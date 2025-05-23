import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, BookOpen, Clock, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { VerseMatch } from "@shared/schema";

interface VerseSearchProps {
  onSearch: (query: string) => void;
  onSelectResult: (verse: VerseMatch) => void;
  searchResults: VerseMatch[];
  isSearching: boolean;
}

interface PopularVerse {
  reference: string;
  text: string;
  version: string;
  searchCount: number;
}

export function VerseSearch({ 
  onSearch, 
  onSelectResult, 
  searchResults, 
  isSearching 
}: VerseSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<VerseMatch[]>([]);
  const [popularVerses, setPopularVerses] = useState<PopularVerse[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  // Debounced search for autocomplete
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await apiRequest("POST", "/api/verses/search", {
          query: searchQuery,
          limit: 8
        });
        const data = await response.json();
        setSuggestions(data.verses || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search suggestions error:", error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  // Load popular verses on component mount
  useEffect(() => {
    const loadPopularVerses = async () => {
      try {
        const response = await apiRequest("GET", "/api/verses/popular?limit=6");
        const data = await response.json();
        setPopularVerses(data.verses || []);
      } catch (error) {
        console.error("Failed to load popular verses:", error);
      }
    };

    loadPopularVerses();
  }, []);

  // Trigger autocomplete suggestions
  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
      toast({
        title: "Searching...",
        description: `Looking for "${query}"`,
      });
    }
  };

  const handleSelectSuggestion = (verse: VerseMatch) => {
    onSelectResult(verse);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    toast({
      title: "Verse Selected",
      description: `Projecting ${verse.reference}`,
    });
  };

  const handleSelectPopular = (verse: PopularVerse) => {
    const verseMatch: VerseMatch = {
      reference: verse.reference,
      text: verse.text,
      version: verse.version,
      confidence: 100
    };
    onSelectResult(verseMatch);
    toast({
      title: "Popular Verse Selected",
      description: `Projecting ${verse.reference}`,
    });
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search verses (e.g., 'John 3:16' or 'love')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-20"
            aria-label="Search for Bible verses"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? "..." : "Search"}
          </Button>
        </div>

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
            <CardContent className="p-2">
              <ScrollArea className="max-h-64">
                <div className="space-y-1">
                  {suggestions.map((verse, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSuggestion(verse)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <BookOpen className="w-3 h-3 text-blue-500" />
                            <span className="font-medium text-sm text-blue-600 dark:text-blue-400">
                              {verse.reference}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {verse.version}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {highlightMatch(verse.text, query)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {Math.round(verse.confidence)}%
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Search Results ({searchResults.length})
            </h3>
            <ScrollArea className="max-h-80">
              <div className="space-y-2">
                {searchResults.map((verse, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectResult(verse)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {verse.reference}
                          </span>
                          <Badge variant="outline">
                            {verse.version}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {highlightMatch(verse.text, query)}
                        </p>
                      </div>
                      <Badge 
                        variant={verse.confidence > 80 ? "default" : "secondary"} 
                        className="ml-3"
                      >
                        {Math.round(verse.confidence)}%
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Popular Verses */}
      {!query && popularVerses.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Popular Verses
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {popularVerses.map((verse, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectPopular(verse)}
                  className="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-yellow-700 dark:text-yellow-400">
                      {verse.reference}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {verse.searchCount} searches
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {verse.text}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Reference Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuery("John 3:16")}
          className="text-xs"
        >
          John 3:16
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuery("Psalm 23")}
          className="text-xs"
        >
          Psalm 23
        </Button>
      </div>
    </div>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}