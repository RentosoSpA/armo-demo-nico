import React, { useState, useRef, useCallback, memo } from 'react';
import { Button } from 'antd';
import { Mic, Square } from 'lucide-react';
import { audioBufferToWav, arrayBufferToBase64, resampleAudio, formatDuration } from '../../utils/audioUtils';
import './AudioRecorder.scss';

interface AudioRecorderProps {
  onRecordingComplete: (audioBase64: string) => void;
  disabled?: boolean;
}

const AudioRecorderComponent: React.FC<AudioRecorderProps> = ({ onRecordingComplete, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Convert to WAV LINEAR16 48kHz
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new AudioContext({ sampleRate: 48000 });
        audioContextRef.current = audioContext;
        
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Resample to 48kHz if necessary
        const resampledBuffer = audioBuffer.sampleRate === 48000
          ? audioBuffer
          : await resampleAudio(audioContext, audioBuffer, 48000);
        
        // Convert to WAV
        const wavBuffer = audioBufferToWav(resampledBuffer);
        const base64Audio = arrayBufferToBase64(wavBuffer);
        
        onRecordingComplete(base64Audio);
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setDuration(0);

      // Start duration counter
      durationIntervalRef.current = window.setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          // Auto-stop at 60 seconds
          if (newDuration >= 60) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('No se pudo acceder al micrófono. Por favor verifica los permisos.');
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  }, [isRecording]);

  return (
    <div className="audio-recorder">
      {!isRecording ? (
        <Button
          type="primary"
          shape="circle"
          icon={<Mic size={20} />}
          onClick={startRecording}
          disabled={disabled}
          className="record-button"
          size="large"
        />
      ) : (
        <div className="recording-controls">
          <Button
            danger
            shape="circle"
            icon={<Square size={20} />}
            onClick={stopRecording}
            className="stop-button"
            size="large"
          />
          <div className="recording-indicator">
            <span className="recording-dot" />
            <span className="duration">{formatDuration(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const AudioRecorder = memo(AudioRecorderComponent);
AudioRecorder.displayName = 'AudioRecorder';

export default AudioRecorder;
