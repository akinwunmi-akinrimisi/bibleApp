import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { DetectionHistory } from '@shared/schema';

interface DetectionHistoryProps {
  history: DetectionHistory[];
  onReproject: (historyItem: DetectionHistory) => void;
  isLoading: boolean;
}

export function DetectionHistoryList({ history, onReproject, isLoading }: DetectionHistoryProps) {
  // Function to format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <h2 className="font-bold mb-2 text-ink-DEFAULT dark:text-gray-200">Detection History</h2>
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-4 h-48 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 dark:text-gray-400">Loading history...</p>
            </div>
          ) : history.length > 0 ? (
            <ul className="space-y-2">
              {history.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <span className="font-medium">{item.reference}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">{item.version}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 text-xs mr-3">
                      {formatTime(item.timestamp)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onReproject(item)} 
                      className="text-primary-600 hover:text-primary-700 h-6 w-6"
                      title="Project again"
                    >
                      <span className="material-icons text-sm">replay</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No detection history yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
