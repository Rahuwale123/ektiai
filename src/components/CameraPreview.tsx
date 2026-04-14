import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface CameraPreviewProps {
  className?: string;
  onFrame?: (base64: string) => void;
  isStreaming?: boolean;
}

export function CameraPreview({ className, onFrame, isStreaming }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (streamRef.current) return;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };

    if (isStreaming) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isStreaming]);

  useEffect(() => {
    if (isStreaming && onFrame) {
      const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          
          if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
            // Draw video frame to canvas
            canvas.width = 320; // Lower resolution for API efficiency
            canvas.height = (video.videoHeight / video.videoWidth) * 320;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert to base64 JPEG
            const base64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
            onFrame(base64);
          }
        }
        requestRef.current = requestAnimationFrame(captureFrame);
      };
      
      requestRef.current = requestAnimationFrame(captureFrame);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isStreaming, onFrame]);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl", className)}>
      <canvas ref={canvasRef} className="hidden" />
      <AnimatePresence mode="wait">
        {isStreaming ? (
          <motion.video
            key="video"
            ref={videoRef}
            autoPlay
            playsInline
            muted
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full object-cover mirror"
          />
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex items-center justify-center text-white/20"
          >
            <CameraOff className="w-12 h-12" />
          </motion.div>
        )}
      </AnimatePresence>

      {isStreaming && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/50">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Live</span>
        </div>
      )}
    </div>
  );
}
