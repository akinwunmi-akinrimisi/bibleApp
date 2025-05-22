import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { VerseMatch, DetectionHistory } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export function useVerses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<VerseMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch detection history
  const { data: detectionHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['/api/detection-history'],
  });

  // Handle verse search
  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/verses/search?q=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error('Failed to search verses');
      }
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      toast({
        title: 'Search Error',
        description: error instanceof Error ? error.message : 'Failed to search verses',
        variant: 'destructive'
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  // Debounced search
  const debouncedSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.length >= 3) {
      const handler = setTimeout(() => {
        handleSearch(term);
      }, 300);
      
      return () => clearTimeout(handler);
    } else {
      setSearchResults([]);
    }
  }, [handleSearch]);

  // Add verse to detection history
  const addToHistoryMutation = useMutation({
    mutationFn: async (verse: VerseMatch) => {
      return await apiRequest('POST', '/api/detection-history', verse);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/detection-history'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save to history',
        variant: 'destructive'
      });
    }
  });

  // Record user feedback for model learning
  const recordFeedbackMutation = useMutation({
    mutationFn: async (data: { transcription: string, selectedVerse: string, confidenceScores: any }) => {
      return await apiRequest('POST', '/api/feedback', data);
    },
    onError: (error) => {
      console.error('Failed to record feedback:', error);
      // No user-facing toast for this background operation
    }
  });

  return {
    searchTerm,
    searchResults,
    isSearching,
    detectionHistory,
    historyLoading,
    setSearchTerm: debouncedSearch,
    addToHistory: addToHistoryMutation.mutate,
    recordFeedback: recordFeedbackMutation.mutate
  };
}
