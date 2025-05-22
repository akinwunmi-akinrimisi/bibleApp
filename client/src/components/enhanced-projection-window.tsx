import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectionSettings {
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontWeight: string;
  textAlign: string;
  projectionTheme: string;
  backgroundImage?: string;
  textShadow: boolean;
  fadeAnimation: boolean;
  displayDuration: number;
}

interface VerseData {
  reference: string;
  text: string;
  version: string;
}

export function EnhancedProjectionWindow() {
  const [currentVerse, setCurrentVerse] = useState<VerseData | null>(null);
  const [settings, setSettings] = useState<ProjectionSettings>({
    fontSize: 48,
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    fontFamily: 'Inter',
    fontWeight: 'normal',
    textAlign: 'center',
    projectionTheme: 'dark',
    textShadow: true,
    fadeAnimation: true,
    displayDuration: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for messages from parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PROJECT_VERSE') {
        setCurrentVerse(event.data.verse);
        setIsVisible(true);
        
        // Auto-hide after duration if set
        if (settings.displayDuration > 0) {
          setTimeout(() => {
            setIsVisible(false);
          }, settings.displayDuration * 1000);
        }
      } else if (event.data.type === 'UPDATE_SETTINGS') {
        setSettings(event.data.settings);
      } else if (event.data.type === 'HIDE_VERSE') {
        setIsVisible(false);
      } else if (event.data.type === 'CLEAR_VERSE') {
        setCurrentVerse(null);
        setIsVisible(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [settings.displayDuration]);

  const getThemeStyles = () => {
    const themes = {
      dark: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        overlay: 'rgba(0, 0, 0, 0.3)'
      },
      light: {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        overlay: 'rgba(255, 255, 255, 0.8)'
      },
      gradient: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overlay: 'rgba(0, 0, 0, 0.2)'
      },
      nature: {
        background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        overlay: 'rgba(0, 0, 0, 0.3)'
      },
      sunset: {
        background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
        overlay: 'rgba(0, 0, 0, 0.2)'
      }
    };

    return themes[settings.projectionTheme as keyof typeof themes] || themes.dark;
  };

  const themeStyles = getThemeStyles();

  const containerStyle = {
    background: settings.backgroundImage 
      ? `url(${settings.backgroundImage})` 
      : themeStyles.background,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const textStyle = {
    fontSize: `${settings.fontSize}px`,
    color: settings.textColor,
    fontFamily: settings.fontFamily,
    fontWeight: settings.fontWeight,
    textAlign: settings.textAlign as 'left' | 'center' | 'right',
    textShadow: settings.textShadow 
      ? '2px 2px 4px rgba(0, 0, 0, 0.7)' 
      : 'none',
    lineHeight: 1.4,
    letterSpacing: '0.5px'
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-8"
      style={containerStyle}
    >
      {/* Background overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: themeStyles.overlay }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {isVisible && currentVerse && (
            <motion.div
              initial={settings.fadeAnimation ? { opacity: 0, scale: 0.9 } : { opacity: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={settings.fadeAnimation ? { opacity: 0, scale: 0.9 } : { opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center space-y-6"
            >
              {/* Main verse text */}
              <motion.div
                initial={settings.fadeAnimation ? { y: 20, opacity: 0 } : {}}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={textStyle}
                className="leading-relaxed"
              >
                {currentVerse.text}
              </motion.div>
              
              {/* Reference */}
              <motion.div
                initial={settings.fadeAnimation ? { y: 20, opacity: 0 } : {}}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{
                  ...textStyle,
                  fontSize: `${Math.max(settings.fontSize * 0.6, 24)}px`,
                  opacity: 0.9,
                  fontWeight: '600'
                }}
              >
                {currentVerse.reference} ({currentVerse.version})
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No verse placeholder */}
        {!isVisible && (
          <div 
            className="text-center opacity-30"
            style={{
              color: settings.textColor,
              fontSize: `${Math.max(settings.fontSize * 0.5, 20)}px`,
              fontFamily: settings.fontFamily
            }}
          >
            Ready for projection...
          </div>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-4 right-4 text-xs opacity-50" style={{ color: settings.textColor }}>
        Press ESC to clear • Space to hide/show
      </div>
    </div>
  );
}