import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWebSocket } from '@/hooks/use-websocket';
import { useAudio } from '@/hooks/use-audio';
import { useProjection } from '@/hooks/use-projection';
import { useVerses } from '@/hooks/use-verses';
import { useToast } from '@/hooks/use-toast';

import { StatusIndicator } from '@/components/status-indicator';
import { TranscriptionView } from '@/components/transcription-view';
import { MatchesTable } from '@/components/matches-table';
import { VerseSearch } from '@/components/verse-search';
import { DetectionHistoryList } from '@/components/detection-history';
import type { VerseMatch, DetectionHistory, Settings } from '@shared/schema';

export default function Dashboard() {
  const { toast } = useToast();
  const { isConnected, transcriptionResult, connect, disconnect, send } = useWebSocket();
  const { isCapturing, selectedDeviceId, startCapture, stopCapture } = useAudio();
  const { isProjectionActive, selectedVerse, projectVerse, toggleProjection } = useProjection();
  const { 
    searchTerm,
    searchResults,
    isSearching,
    detectionHistory,
    historyLoading,
    setSearchTerm,
    addToHistory,
    recordFeedback
  } = useVerses();

  // Get user settings
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return await response.json();
    },
  });

  // Handle selected verse match
  const handleSelectMatch = (verse: VerseMatch) => {
    projectVerse(verse);
    
    // Record feedback for model learning if we have transcription
    if (transcriptionResult?.text) {
      recordFeedback({
        transcription: transcriptionResult.text,
        selectedVerse: verse.reference,
        confidenceScores: transcriptionResult.matches.map(m => ({ 
          reference: m.reference, 
          confidence: m.confidence 
        }))
      });
    }
  };

  // Handle verse search selection
  const handleSelectSearchResult = (verse: VerseMatch) => {
    projectVerse(verse);
    addToHistory(verse);
  };

  // Handle reproject from history
  const handleReproject = (historyItem: DetectionHistory) => {
    projectVerse({
      reference: historyItem.reference,
      text: historyItem.text,
      version: historyItem.version,
      confidence: historyItem.confidence || 100
    });
  };

  // Connect WebSocket and start audio capture when projection is activated
  useEffect(() => {
    if (isProjectionActive && !isConnected) {
      connect();
    } else if (!isProjectionActive && isConnected) {
      disconnect();
    }
  }, [isProjectionActive, isConnected, connect, disconnect]);

  // Start audio capture when WebSocket is connected
  useEffect(() => {
    if (isConnected && !isCapturing) {
      startCapture((audioBlob: Blob) => {
        // Convert Blob to base64 and send via WebSocket
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          send({
            type: 'audio',
            payload: {
              data: base64data.split(',')[1], // Remove data URL prefix
              deviceId: selectedDeviceId,
              settings: {
                bibleVersion: settings?.bibleVersion || 'KJV',
                confidenceThreshold: settings?.confidenceThreshold || 70
              }
            }
          });
        };
        reader.readAsDataURL(audioBlob);
      });
    } else if (!isConnected && isCapturing) {
      stopCapture();
    }
  }, [isConnected, isCapturing, startCapture, stopCapture, send, selectedDeviceId, settings]);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Live Projection Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Control verse detection and projection</p>
      </header>
      
      <StatusIndicator 
        isActive={isProjectionActive} 
        audioSource={settings?.audioInput || 'Default Microphone'}
        bibleVersion={settings?.bibleVersion || 'KJV'}
        confidenceThreshold={settings?.confidenceThreshold || 70}
      />
      
      <TranscriptionView 
        text={transcriptionResult?.text || ''} 
        isActive={isProjectionActive}
      />
      
      <MatchesTable 
        matches={transcriptionResult?.matches || []} 
        onSelectMatch={handleSelectMatch}
        selectedVerseRef={selectedVerse?.reference || null}
        isActive={isProjectionActive}
      />
      
      <VerseSearch 
        onSearch={setSearchTerm}
        onSelectResult={handleSelectSearchResult}
        searchResults={searchResults}
        isSearching={isSearching}
      />
      
      <DetectionHistoryList 
        history={detectionHistory}
        onReproject={handleReproject}
        isLoading={historyLoading}
      />
    </div>
  );
}
