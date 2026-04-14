import { useRef, useState, useCallback } from 'react';
import { GoogleGenAI, Modality, MediaResolution } from "@google/genai";
import { AudioStreamer, float32ToPcm16 } from './audio-utils';

const MODEL = "gemini-3.1-flash-live-preview";

export function useLiveAPI() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const connect = useCallback(async (systemInstruction: string) => {
    try {
      const apiKey = "AIzaSyCB6hr5AmmW5d3V0cf5cb0kxg0rLDeP29c";
      if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

      const ai = new GoogleGenAI({ apiKey });
      audioStreamerRef.current = new AudioStreamer(24000);

      const session = await ai.live.connect({
        model: MODEL,
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setError(null);
          },
          onmessage: async (message: any) => {
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  audioStreamerRef.current?.addPCMChunk(
                    new Uint8Array(atob(part.inlineData.data).split("").map(c => c.charCodeAt(0)))
                  );
                }
              }
            }
            if (message.serverContent?.interrupted) {
              audioStreamerRef.current?.interrupt();
            }
          },
          onclose: () => {
            setIsConnected(false);
            stopRecording();
          },
          onerror: (err: any) => {
            console.error("Live API error:", err);
            const errorMessage = err?.message || String(err);
            if (errorMessage.includes("Quota exceeded")) {
              setError("Free limit reached. Please try again later.");
            } else {
              setError("Connection error");
            }
            setIsConnected(false);
            
            // Clear error after 5 seconds
            setTimeout(() => setError(null), 5000);
          }
        },
        config: {
          systemInstruction,
          responseModalities: [Modality.AUDIO],
          mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Leda" } }
          },
          contextWindowCompression: {
            triggerTokens: "104857",
            slidingWindow: { targetTokens: "52428" },
          },
        }
      });

      sessionRef.current = session;

    } catch (err: any) {
      console.error("Connection error:", err);
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  }, []);

  const disconnect = useCallback(() => {
    sessionRef.current?.close();
    audioStreamerRef.current?.stop();
    stopRecording();
    setIsConnected(false);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = float32ToPcm16(inputData);
        
        const binary = String.fromCharCode(...new Uint8Array(pcm16.buffer));
        const base64 = btoa(binary);

        sessionRef.current?.sendRealtimeInput({
          audio: {
            mimeType: "audio/pcm;rate=16000",
            data: base64
          }
        });
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      setIsRecording(true);
    } catch (err: any) {
      console.error("Recording error:", err);
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const sendVideoFrame = useCallback((base64: string) => {
    if (sessionRef.current && isConnected) {
      sessionRef.current.sendRealtimeInput({
        video: {
          mimeType: "image/jpeg",
          data: base64
        }
      });
    }
  }, [isConnected]);

  return {
    isConnected,
    isRecording,
    error,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    sendVideoFrame
  };
}


