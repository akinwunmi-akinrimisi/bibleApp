import React from 'react';
import type { VerseMatch } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MatchesTableProps {
  matches: VerseMatch[];
  onSelectMatch: (verse: VerseMatch) => void;
  selectedVerseRef?: string | null;
  isActive: boolean;
}

export function MatchesTable({ matches, onSelectMatch, selectedVerseRef, isActive }: MatchesTableProps) {
  // Function to get confidence badge color
  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 90) return "success";
    if (confidence >= 80) return "info";
    if (confidence >= 70) return "warn";
    return "secondary";
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-ink-DEFAULT dark:text-gray-200">Verse Matches</h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {matches.length > 0 
            ? `Showing top ${matches.length} matches` 
            : isActive ? "Waiting for matches..." : "Start projection to detect verses"}
        </span>
      </div>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reference</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Text</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Version</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {matches.length > 0 ? (
                matches.map((verse, index) => (
                  <tr 
                    key={`${verse.reference}-${index}`}
                    onClick={() => onSelectMatch(verse)}
                    className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer ${
                      selectedVerseRef === verse.reference
                        ? 'border-l-4 border-secondary-600' 
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{verse.reference}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">{verse.text}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{verse.version}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={getConfidenceBadgeVariant(verse.confidence)}>
                        {verse.confidence}%
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {isActive 
                      ? "Listening for Bible verses..." 
                      : "Start projection to see matching verses"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
