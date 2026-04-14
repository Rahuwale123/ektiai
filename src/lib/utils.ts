import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function terminalLog(message: string, type: 'info' | 'warn' | 'error' | 'gemini' = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  fetch('http://localhost:3001/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, type, context: 'BROWSER' })
  }).catch(() => {}); // Quietly fail if logger is down
}

export function parseSampleRate(mimeType: string): number {
  const params = mimeType.split(';').map(s => s.trim());
  for (const param of params) {
    const [key, value] = param.split('=').map(s => s.trim());
    if (key === 'rate') {
      return parseInt(value, 10);
    }
  }
  return 24000; // Default
}
