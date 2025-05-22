import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { VerseMatch } from '@shared/schema';

interface VerseSearchProps {
  onSearch: (term: string) => void;
  onSelectResult: (verse: VerseMatch) => void;
  searchResults: VerseMatch[];
  isSearching: boolean;
}

export function VerseSearch({ onSearch, onSelectResult, searchResults, isSearching }: VerseSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 3) {
      onSearch(value);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSelectResult = (verse: VerseMatch) => {
    onSelectResult(verse);
    setShowResults(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim().length > 0) {
      onSearch(searchTerm);
      setShowResults(true);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="font-bold mb-2 text-ink-DEFAULT dark:text-gray-200">Manual Override</h2>
      <div className="flex">
        <div className="relative flex-1 mr-2">
          <Input
            type="text"
            placeholder="Search verse (e.g., John 3:16)"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm.length >= 3 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light dark:bg-gray-800"
          />
          {showResults && searchResults.length > 0 && (
            <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-52 overflow-y-auto">
              <div className="py-1">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.reference}-${index}`}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    onMouseDown={() => handleSelectResult(result)}
                  >
                    {result.reference} - {result.text.substring(0, 40)}...
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <span className="material-icons">search</span>
        </Button>
      </div>
    </div>
  );
}
