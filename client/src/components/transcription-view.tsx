import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface TranscriptionViewProps {
  text: string;
  isActive: boolean;
  confidence?: number;
  audioLevel?: number;
}

export function TranscriptionView({ 
  text, 
  isActive, 
  confidence = 0,
  audioLevel = 0 
}: TranscriptionViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new text appears
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text]);

  // Split text into sentences for better readability
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const recentSentences = sentences.slice(-5); // Show last 5 sentences

  return (
    <Card className="h-48 overflow-hidden">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Header with status indicators */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isActive ? (
                <Mic className="w-5 h-5 text-green-500" />
              ) : (
                <MicOff className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isActive ? 'Listening' : 'Inactive'}
              </span>
            </div>
            
            {/* Audio level indicator */}
            {isActive && (
              <div className="flex items-center space-x-2">
                {audioLevel > 0 ? (
                  <Volume2 className="w-4 h-4 text-blue-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                )}
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-200"
                    style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confidence indicator */}
          {confidence > 0 && (
            <Badge 
              variant={confidence > 80 ? "default" : confidence > 60 ? "secondary" : "outline"}
              className="text-xs"
            >
              {Math.round(confidence)}% confidence
            </Badge>
          )}
        </div>

        {/* Transcription content */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-2 text-sm leading-relaxed"
          aria-live="polite"
          aria-label="Live transcription"
        >
          {!text ? (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              {isActive ? (
                <div className="text-center">
                  <div className="animate-pulse flex space-x-1 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-100"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-200"></div>
                  </div>
                  <p>Listening for speech...</p>
                </div>
              ) : (
                <p>Start projection to begin transcription</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {recentSentences.map((sentence, index) => (
                <p 
                  key={index}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    index === recentSentences.length - 1 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {sentence.trim()}.
                </p>
              ))}
              
              {/* Current speaking indicator */}
              {isActive && (
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse animation-delay-100"></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse animation-delay-200"></div>
                  </div>
                  <span className="text-xs">Speaking...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Word count and timing info */}
        {text && (
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {text.split(' ').length} words
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}