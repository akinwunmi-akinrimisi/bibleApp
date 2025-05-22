import { useState, useEffect, useCallback, useRef } from 'react';
import type { TranscriptionResult } from '@shared/schema';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    // Close existing connection if any
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'transcription') {
            setTranscriptionResult(data.payload);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = (event) => {
        setError('WebSocket connection error');
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      webSocketRef.current = ws;
    } catch (err) {
      setError('Failed to establish WebSocket connection');
      setIsConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
      webSocketRef.current = null;
    }
  }, []);

  const send = useCallback((data: any) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify(data));
    } else {
      setError('WebSocket not connected');
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    error,
    transcriptionResult,
    connect,
    disconnect,
    send
  };
}
