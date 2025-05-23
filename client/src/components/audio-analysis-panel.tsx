import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Activity, 
  Settings,
  Zap,
  Clock,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioAnalysisProps {
  isListening: boolean;
  onToggleListening: () => void;
  currentTranscription: string;
  audioLevel: number;
  directQuoteMode: boolean;
  onToggleDirectQuoteMode: (enabled: boolean) => void;
}

export function AudioAnalysisPanel({ 
  isListening, 
  onToggleListening, 
  currentTranscription,
  audioLevel,
  directQuoteMode,
  onToggleDirectQuoteMode
}: AudioAnalysisProps) {
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    if (currentTranscription && currentTranscription.length > 0) {
      setRecentActivity(prev => 
        [currentTranscription, ...prev.slice(0, 4)]
      );
    }
  }, [currentTranscription]);

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isListening ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
            {isListening ? (
              <Mic className="w-5 h-5 text-green-600" />
            ) : (
              <MicOff className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div>
            <CardTitle className="text-lg">Audio Analysis</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time speech detection
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Control Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onToggleListening}
              variant={isListening ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
            
            <Badge variant={isListening ? "default" : "secondary"}>
              {isListening ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Direct Quote Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-blue-600" />
              <div>
                <Label htmlFor="direct-quote" className="text-sm font-medium">
                  Auto-project Direct Quotes
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Automatically show verses when directly referenced
                </p>
              </div>
            </div>
            <Switch
              id="direct-quote"
              checked={directQuoteMode}
              onCheckedChange={onToggleDirectQuoteMode}
            />
          </div>
        </div>

        {/* Audio Level Indicator */}
        {isListening && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Audio Level</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
                animate={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}

        {/* Current Transcription */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Live Transcription</span>
          </div>
          <div className="min-h-[60px] p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <AnimatePresence mode="wait">
              {currentTranscription ? (
                <motion.p
                  key={currentTranscription}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  "{currentTranscription}"
                </motion.p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  {isListening ? "Listening for speech..." : "Start listening to see transcription"}
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Recent Activity</span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-2 border-blue-500"
                >
                  {activity.substring(0, 100)}...
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No recent activity</p>
            )}
          </div>
        </div>

        {/* Detection Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">12</div>
            <div className="text-xs text-gray-500">Verses Detected</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">8</div>
            <div className="text-xs text-gray-500">Auto-Projected</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}