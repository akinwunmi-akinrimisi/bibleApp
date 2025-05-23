import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Eye, EyeOff, Settings, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VerseData {
  reference: string;
  text: string;
  version: string;
}

interface ProjectionPreviewProps {
  currentVerse: VerseData | null;
  isProjectionActive: boolean;
  onToggleProjection: () => void;
  onOpenFullProjection: () => void;
}

export function DashboardProjectionPreview({ 
  currentVerse, 
  isProjectionActive, 
  onToggleProjection, 
  onOpenFullProjection 
}: ProjectionPreviewProps) {
  const [previewSettings, setPreviewSettings] = useState({
    fontSize: 24,
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    fontFamily: 'Inter'
  });

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-lg">Projection Preview</CardTitle>
          <Badge variant={isProjectionActive ? "default" : "secondary"}>
            {isProjectionActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleProjection}
            className="flex items-center gap-2"
          >
            {isProjectionActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isProjectionActive ? "Hide" : "Show"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenFullProjection}
            className="flex items-center gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Full Screen
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div 
          className="relative aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden"
          style={{ 
            backgroundColor: previewSettings.backgroundColor,
            minHeight: '200px'
          }}
        >
          {/* Preview Display */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
              {isProjectionActive && currentVerse ? (
                <motion.div
                  key={currentVerse.reference}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-4 max-w-full"
                >
                  {/* Main verse text */}
                  <div
                    style={{
                      fontSize: `${previewSettings.fontSize}px`,
                      color: previewSettings.textColor,
                      fontFamily: previewSettings.fontFamily,
                      lineHeight: 1.4,
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                    }}
                    className="leading-relaxed"
                  >
                    {currentVerse.text}
                  </div>
                  
                  {/* Reference */}
                  <div
                    style={{
                      fontSize: `${Math.max(previewSettings.fontSize * 0.6, 14)}px`,
                      color: previewSettings.textColor,
                      fontFamily: previewSettings.fontFamily,
                      opacity: 0.9
                    }}
                    className="font-semibold"
                  >
                    {currentVerse.reference} ({currentVerse.version})
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-3"
                >
                  <Monitor className="w-12 h-12 mx-auto text-gray-400" />
                  <div className="text-gray-400 text-sm">
                    {isProjectionActive ? 'Waiting for verse...' : 'Projection inactive'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Preview how verses will appear on projection screen
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Corner indicators */}
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="text-xs bg-black/50 border-gray-500">
              Preview
            </Badge>
          </div>
          
          <div className="absolute top-2 right-2">
            <Badge 
              variant={isProjectionActive ? "default" : "secondary"} 
              className="text-xs"
            >
              {isProjectionActive ? "LIVE" : "OFF"}
            </Badge>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>Font: {previewSettings.fontFamily}</span>
            <span>Size: {previewSettings.fontSize}px</span>
          </div>
          <Button variant="link" size="sm" className="text-xs">
            Customize Display →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}