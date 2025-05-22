import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useAudio() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Load available audio devices
  const loadAudioDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new Error('Media devices API not supported');
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      setAudioDevices(audioInputs);
      
      if (audioInputs.length > 0 && !audioInputs.some(device => device.deviceId === selectedDeviceId)) {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load audio devices',
        variant: 'destructive'
      });
    }
  }, [selectedDeviceId, toast]);

  // Start audio capture
  const startCapture = useCallback(async (sendAudioData: (data: Blob) => void) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices API not supported');
      }

      // Request permission to use audio input
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      mediaStreamRef.current = stream;

      // Create a media recorder
      const options = { mimeType: 'audio/webm' };
      const recorder = new MediaRecorder(stream, options);

      // Handle data available event
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          sendAudioData(event.data);
        }
      };

      // Start recording with 5 second chunks
      recorder.start(5000);
      mediaRecorderRef.current = recorder;
      setIsCapturing(true);

      toast({
        title: 'Audio Capture Started',
        description: 'Now listening for Bible verses...',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start audio capture',
        variant: 'destructive'
      });
    }
  }, [selectedDeviceId, toast]);

  // Stop audio capture
  const stopCapture = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (recordingIntervalRef.current) {
      window.clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    setIsCapturing(false);
    toast({
      title: 'Audio Capture Stopped',
      description: 'No longer listening for Bible verses',
    });
  }, [toast]);

  // Test audio input for 5 seconds
  const testAudioInput = useCallback(async () => {
    if (isCapturing) {
      toast({
        title: 'Warning',
        description: 'Please stop capture before testing',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices API not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
        }
      });

      // Create audio context to visualize the input
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      // Setup a timer to stop test after 5 seconds
      toast({
        title: 'Testing Audio Input',
        description: 'Testing microphone for 5 seconds...',
      });

      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
        toast({
          title: 'Audio Test Complete',
          description: 'Audio input test completed successfully',
        });
      }, 5000);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to test audio input',
        variant: 'destructive'
      });
    }
  }, [isCapturing, selectedDeviceId, toast]);

  // Load audio devices on component mount
  useEffect(() => {
    loadAudioDevices();
    
    // Ask for permission when the component mounts
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Just to ask for permission, then stop it immediately
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(err => {
        toast({
          title: 'Permission Error',
          description: 'Microphone access denied. Please check permissions.',
          variant: 'destructive'
        });
      });
      
    // Setup device change listener
    const handleDeviceChange = () => loadAudioDevices();
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    
    return () => {
      // Clean up
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [loadAudioDevices, toast]);

  return {
    isCapturing,
    audioDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    startCapture,
    stopCapture,
    testAudioInput
  };
}
