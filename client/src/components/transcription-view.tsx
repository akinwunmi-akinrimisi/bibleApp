import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TranscriptionViewProps {
  text: string;
  isActive: boolean;
}

export function TranscriptionView({ text, isActive }: TranscriptionViewProps) {
  return (
    <div className="mb-6">
      <h2 className="font-bold mb-2 text-ink-DEFAULT dark:text-gray-200">Live Transcription</h2>
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="h-28 overflow-y-auto p-4">
          {isActive ? (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {text || "Listening for speech..."}
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Start projection to begin speech transcription
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
