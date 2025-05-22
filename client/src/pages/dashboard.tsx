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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Modern dashboard header with gradient */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Live Projection Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Control verse detection and automatic projection
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Bible Version:</span> {settings?.bibleVersion || 'KJV'}
              </div>
              <div className={`h-3 w-3 rounded-full ${isProjectionActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-6">
                <StatusIndicator 
                  isActive={isProjectionActive} 
                  audioSource={settings?.audioInput || 'Default Microphone'}
                  bibleVersion={settings?.bibleVersion || 'KJV'}
                  confidenceThreshold={settings?.confidenceThreshold || 70}
                />
              </div>
            </div>
            
            {/* Transcription view card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <span className="mr-2">Live Transcription</span>
                  {isProjectionActive && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </h2>
              </div>
              <div className="p-6">
                <TranscriptionView 
                  text={transcriptionResult?.text || ''} 
                  isActive={isProjectionActive}
                />
              </div>
            </div>
            
            {/* Matches table card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detected Verses</h2>
              </div>
              <div className="p-6">
                <MatchesTable 
                  matches={transcriptionResult?.matches || []} 
                  onSelectMatch={handleSelectMatch}
                  selectedVerseRef={selectedVerse?.reference || null}
                  isActive={isProjectionActive}
                />
              </div>
            </div>
          </div>
          
          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Search card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manual Search</h2>
              </div>
              <div className="p-6">
                <VerseSearch 
                  onSearch={setSearchTerm}
                  onSelectResult={handleSelectSearchResult}
                  searchResults={searchResults}
                  isSearching={isSearching}
                />
              </div>
            </div>
            
            {/* History card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detection History</h2>
              </div>
              <div className="p-6">
                <DetectionHistoryList 
                  history={detectionHistory}
                  onReproject={handleReproject}
                  isLoading={historyLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
