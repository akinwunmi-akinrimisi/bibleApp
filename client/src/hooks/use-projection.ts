import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { VerseMatch } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export function useProjection() {
  const [isProjectionActive, setIsProjectionActive] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<VerseMatch | null>(null);
  const [projectionWindow, setProjectionWindow] = useState<Window | null>(null);
  const { toast } = useToast();

  // Open projection window
  const openProjectionWindow = useCallback(() => {
    try {
      const features = 'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no';
      const newWindow = window.open('/projection', 'ProjectionWindow', features);
      
      if (!newWindow) {
        throw new Error('Failed to open projection window. Please check your popup blocker settings.');
      }
      
      setProjectionWindow(newWindow);
      return newWindow;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to open projection window',
        variant: 'destructive'
      });
      return null;
    }
  }, [toast]);

  // Project a verse
  const projectVerse = useCallback(async (verse: VerseMatch) => {
    try {
      let window = projectionWindow;
      
      if (!window || window.closed) {
        window = openProjectionWindow();
        if (!window) return;
      }

      // Send the verse to the projection window using postMessage
      window.postMessage({ type: 'project-verse', payload: verse }, '*');
      
      // Save to detection history
      await apiRequest('POST', '/api/detection-history', {
        reference: verse.reference,
        text: verse.text,
        version: verse.version,
        confidence: verse.confidence
      });

      setSelectedVerse(verse);
      
      toast({
        title: 'Success',
        description: `Verse ${verse.reference} projected successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to project verse',
        variant: 'destructive'
      });
    }
  }, [projectionWindow, openProjectionWindow, toast]);

  // Toggle projection active state
  const toggleProjection = useCallback(() => {
    if (!isProjectionActive) {
      const window = openProjectionWindow();
      if (window) {
        setIsProjectionActive(true);
      }
    } else {
      if (projectionWindow && !projectionWindow.closed) {
        projectionWindow.close();
      }
      setIsProjectionActive(false);
      setSelectedVerse(null);
    }
  }, [isProjectionActive, openProjectionWindow, projectionWindow]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (projectionWindow && !projectionWindow.closed) {
        projectionWindow.close();
      }
    };
  }, [projectionWindow]);

  return {
    isProjectionActive,
    selectedVerse,
    projectVerse,
    toggleProjection
  };
}
