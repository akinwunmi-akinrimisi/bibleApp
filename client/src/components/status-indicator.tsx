import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatusIndicatorProps {
  isActive: boolean;
  audioSource: string;
  bibleVersion: string;
  confidenceThreshold: number;
}

export function StatusIndicator({ 
  isActive,
  audioSource,
  bibleVersion,
  confidenceThreshold
}: StatusIndicatorProps) {
  return (
    <div className="mb-6">
      <Card className="p-4 rounded-lg bg-parchment dark:bg-parchment-dark border border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-ink-DEFAULT dark:text-gray-200">Status</h2>
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isActive ? 'bg-secondary-600' : 'bg-gray-400'}`}></span>
              <span className="text-sm">{isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Audio Source</p>
              <p className="font-medium">{audioSource || 'Default Microphone'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bible Version</p>
              <p className="font-medium">
                {bibleVersion === 'KJV' ? 'KJV (King James Version)' : 'WEB (World English Bible)'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Confidence Threshold</p>
              <p className="font-medium">{confidenceThreshold}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
