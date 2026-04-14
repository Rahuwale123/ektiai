/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function pcmToFloat32(pcmData: Uint8Array): Float32Array {
  // Ensure we handle potential alignment issues and offsets correctly
  const dataView = new DataView(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength);
  const int16Array = new Int16Array(pcmData.length / 2);
  for (let i = 0; i < int16Array.length; i++) {
    int16Array[i] = dataView.getInt16(i * 2, true); // true for little-endian (PCM standard)
  }
  
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768;
  }
  return float32Array;
}

export function float32ToPcm16(float32Array: Float32Array): Int16Array {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm16;
}

export class AudioStreamer {
  private audioContext: AudioContext | null = null;
  private nextStartTime: number = 0;
  private sampleRate: number = 24000;

  constructor(sampleRate: number = 24000) {
    this.sampleRate = sampleRate;
  }

  private init(sampleRate?: number) {
    if (sampleRate && sampleRate !== this.sampleRate) {
      if (this.audioContext) {
        this.audioContext.close().catch(console.error);
        this.audioContext = null;
      }
      this.sampleRate = sampleRate;
    }

    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate: this.sampleRate });
      this.nextStartTime = this.audioContext.currentTime;
    }
  }

  async resume(sampleRate?: number) {
    this.init(sampleRate);
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async addPCMChunk(chunk: Uint8Array, sampleRate?: number) {
    this.init(sampleRate);
    if (!this.audioContext) return;
    
    // Resume context if it was suspended (browser policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const float32Data = pcmToFloat32(chunk);
    const audioBuffer = this.audioContext.createBuffer(1, float32Data.length, this.sampleRate);
    audioBuffer.getChannelData(0).set(float32Data);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    const startTime = Math.max(this.nextStartTime, this.audioContext.currentTime);
    source.start(startTime);
    this.nextStartTime = startTime + audioBuffer.duration;
    
    // Keep track of active sources to stop them on interruption
    this.activeSources.push(source);
    source.onended = () => {
      this.activeSources = this.activeSources.filter(s => s !== source);
    };
  }

  interrupt() {
    this.activeSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Source might have already stopped
      }
    });
    this.activeSources = [];
    if (this.audioContext) {
      this.nextStartTime = this.audioContext.currentTime;
    }
  }

  stop() {
    this.interrupt();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
  }

  private activeSources: AudioBufferSourceNode[] = [];
}
