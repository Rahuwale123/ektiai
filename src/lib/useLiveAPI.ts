import { useRef, useState, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { AudioStreamer, float32ToPcm16 } from './audio-utils';
import { terminalLog, parseSampleRate } from './utils';

const MODEL = "models/gemini-3.1-flash-live-preview";

export function useLiveAPI() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Defined first so connect/disconnect can reference it stably
  const stopRecording = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.port.onmessage = null;
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const connect = useCallback(async (systemInstruction: string, voiceName: string) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing in .env");

      const ai = new GoogleGenAI({ apiKey });
      terminalLog(`Connecting to ${MODEL} with voice: ${voiceName}`, "info");

      audioStreamerRef.current = new AudioStreamer(24000);
      await audioStreamerRef.current.resume();

      const session = await ai.live.connect({
        model: MODEL,
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setError(null);
            terminalLog("Gemini Live Session Opened", "gemini");
          },
          onmessage: async (message: any) => {
            try {
              if (message.serverContent?.modelTurn?.parts) {
                for (const part of message.serverContent.modelTurn.parts) {
                  if (part.inlineData?.data) {
                    const mimeType = part.inlineData.mimeType || "audio/pcm;rate=24000";
                    const sampleRate = parseSampleRate(mimeType);

                    const base64 = part.inlineData.data;
                    const binary = atob(base64);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) {
                      bytes[i] = binary.charCodeAt(i);
                    }

                    terminalLog(`Audio received (${sampleRate}Hz): ${bytes.length} bytes`, "gemini");
                    audioStreamerRef.current?.addPCMChunk(bytes, sampleRate);

                    // Track speaking state
                    setIsSpeaking(true);
                    if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
                    speakingTimerRef.current = setTimeout(() => setIsSpeaking(false), 800);
                  }
                  if (part.text) {
                    terminalLog(`AI Text: ${part.text}`, "gemini");
                  }
                }
              }
              if (message.serverContent?.interrupted) {
                terminalLog("AI Interrupted", "warn");
                audioStreamerRef.current?.interrupt();
                setIsSpeaking(false);
              }
            } catch (err) {
              terminalLog(`Error in onmessage handler: ${err}`, "error");
            }
          },
          onclose: (event: any) => {
            sessionRef.current = null;
            setIsConnected(false);
            setIsSpeaking(false);
            stopRecording();
            const reason = event.reason || "No reason provided";
            terminalLog(`Session Closed. Code: ${event.code}, Reason: ${reason}`, "warn");
          },
          onerror: (err: any) => {
            console.error("Live API error:", err);
            const errorMessage = err?.message || String(err);
            terminalLog(`Gemini Error: ${errorMessage}`, "error");
            if (errorMessage.includes("Quota exceeded") || errorMessage.includes("quota")) {
              setError("Free limit reached. Please try again later.");
            } else {
              setError("Connection error. Please try again.");
            }
            setIsConnected(false);
            setIsSpeaking(false);
            setTimeout(() => setError(null), 5000);
          }
        },
        config: {
          systemInstruction,
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName,
              }
            }
          },
          contextWindowCompression: {
            triggerTokens: '104857',
            slidingWindow: { targetTokens: '52428' },
          },
        }
      });

      sessionRef.current = session;
      terminalLog("Session ready — waiting for user to speak", "info");

    } catch (err: any) {
      console.error("Connection error:", err);
      setError(err.message || "Failed to connect");
      setTimeout(() => setError(null), 5000);
    }
  }, [stopRecording]);

  const disconnect = useCallback(() => {
    if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
    sessionRef.current?.close();
    sessionRef.current = null;
    audioStreamerRef.current?.stop();
    stopRecording();
    setIsConnected(false);
    setIsSpeaking(false);
  }, [stopRecording]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext({ sampleRate: 16000 });
      await audioContext.resume();
      audioContextRef.current = audioContext;

      await audioContext.audioWorklet.addModule('/audio-processor.js');

      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioContext, 'audio-processor');
      workletNodeRef.current = workletNode;

      workletNode.port.onmessage = (e) => {
        // Always use sessionRef — never stale state in this closure
        if (!sessionRef.current) return;

        const float32Data = e.data;
        const pcm16 = float32ToPcm16(float32Data);
        const binary = String.fromCharCode(...new Uint8Array(pcm16.buffer, pcm16.byteOffset, pcm16.byteLength));
        const base64 = btoa(binary);

        try {
          sessionRef.current.sendRealtimeInput({
            audio: {
              mimeType: "audio/pcm;rate=16000",
              data: base64
            }
          });
          if (Math.random() < 0.03) terminalLog("Sending audio chunk...", "info");
        } catch (err) {
          console.warn("Could not send audio frame:", err);
        }
      };

      source.connect(workletNode);
      workletNode.connect(audioContext.destination);
      setIsRecording(true);
    } catch (err: any) {
      console.error("Recording error:", err);
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  }, []);

  return {
    isConnected,
    isRecording,
    isSpeaking,
    error,
    connect,
    disconnect,
    startRecording,
    stopRecording,
  };
}
