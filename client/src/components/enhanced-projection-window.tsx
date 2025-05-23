import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Maximize2, 
  Minimize2, 
  Settings, 
  Monitor, 
  Eye,
  EyeOff,
  RotateCcw
} from "lucide-react";

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
    fontSize: 32,
    textColor: "#FFFFFF",
    backgroundColor: "#000000",
    fontFamily: "Roboto",
    fontWeight: "500",
    textAlign: "center",
    projectionTheme: "classic",
    textShadow: true,
    fadeAnimation: true,
    displayDuration: 8
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [projectionWindow, setProjectionWindow] = useState<Window | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Listen for messages from parent window (dashboard)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, data } = event.data;

      switch (type) {
        case "PROJECT_VERSE":
          handleProjectVerse(data.verse);
          break;
        case "UPDATE_SETTINGS":
          setSettings(prev => ({ ...prev, ...data.settings }));
          break;
        case "HIDE_PROJECTION":
          setIsVisible(false);
          break;
        case "SHOW_PROJECTION":
          setIsVisible(true);
          break;
        case "CLEAR_PROJECTION":
          handleClearProjection();
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Load settings from localStorage or API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = localStorage.getItem("projectionSettings");
        if (savedSettings) {
          setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
        }
      } catch (error) {
        console.error("Failed to load projection settings:", error);
      }
    };

    loadSettings();
  }, []);

  // Auto-hide verse after display duration
  useEffect(() => {
    if (!currentVerse || !isVisible) return;

    const timer = setTimeout(() => {
      if (settings.fadeAnimation) {
        handleFadeOut();
      } else {
        setCurrentVerse(null);
      }
    }, settings.displayDuration * 1000);

    return () => clearTimeout(timer);
  }, [currentVerse, isVisible, settings.displayDuration, settings.fadeAnimation]);

  const handleProjectVerse = async (verse: VerseData) => {
    if (settings.fadeAnimation && currentVerse) {
      // Fade out current verse first
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVerse(verse);
        setIsVisible(true);
        setIsTransitioning(false);
      }, 200);
    } else {
      setCurrentVerse(verse);
      setIsVisible(true);
    }
  };

  const handleFadeOut = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVerse(null);
      setIsTransitioning(false);
    }, 200);
  };

  const handleClearProjection = () => {
    if (settings.fadeAnimation) {
      handleFadeOut();
    } else {
      setCurrentVerse(null);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const openProjectionWindow = () => {
    const newWindow = window.open(
      "/projection",
      "projection",
      "width=1920,height=1080,fullscreen=yes,menubar=no,toolbar=no,location=no,status=no"
    );
    setProjectionWindow(newWindow);
  };

  const getTextShadowStyle = () => {
    if (!settings.textShadow) return {};
    
    return {
      textShadow: `2px 2px 4px rgba(0, 0, 0, 0.8), 
                   -1px -1px 2px rgba(0, 0, 0, 0.5),
                   1px -1px 2px rgba(0, 0, 0, 0.5),
                   -1px 1px 2px rgba(0, 0, 0, 0.5)`
    };
  };

  const getBackgroundStyle = () => {
    const base = {
      backgroundColor: settings.backgroundColor,
    };

    if (settings.backgroundImage) {
      return {
        ...base,
        backgroundImage: `url(${settings.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      };
    }

    // Add gradient for certain themes
    if (settings.projectionTheme === "gradient") {
      return {
        ...base,
        background: `linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%)`
      };
    }

    return base;
  };

  const adjustColor = (color: string, amount: number) => {
    // Simple color adjustment utility
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };

  const projectionContent = (
    <div
      ref={containerRef}
      className={`h-screen flex flex-col justify-center items-center p-8 transition-all duration-200 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
      style={getBackgroundStyle()}
    >
      {currentVerse && isVisible ? (
        <>
          {/* Main verse text */}
          <div
            className="max-w-6xl text-center leading-relaxed mb-8"
            style={{
              fontSize: `${settings.fontSize}px`,
              fontFamily: settings.fontFamily,
              fontWeight: settings.fontWeight,
              color: settings.textColor,
              textAlign: settings.textAlign as any,
              ...getTextShadowStyle()
            }}
            aria-live="polite"
          >
            {currentVerse.text}
          </div>

          {/* Reference */}
          <div
            className="text-center mb-4"
            style={{
              fontSize: `${settings.fontSize * 0.6}px`,
              fontFamily: settings.fontFamily,
              fontWeight: "600",
              color: settings.textColor,
              opacity: 0.9,
              ...getTextShadowStyle()
            }}
          >
            {currentVerse.reference}
          </div>

          {/* Version */}
          <div
            className="absolute bottom-8 right-8"
            style={{
              fontSize: `${settings.fontSize * 0.4}px`,
              fontFamily: settings.fontFamily,
              fontWeight: "400",
              color: settings.textColor,
              opacity: 0.7,
              ...getTextShadowStyle()
            }}
          >
            {currentVerse.version}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl opacity-75">Ready for Projection</p>
          <p className="text-sm opacity-50 mt-2">Waiting for verse selection...</p>
        </div>
      )}

      {/* Control overlay (only visible on hover in fullscreen) */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="bg-black/20 backdrop-blur border-white/20 text-white hover:bg-white/20"
            >
              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearProjection}
              className="bg-black/20 backdrop-blur border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-black/20 backdrop-blur border-white/20 text-white hover:bg-white/20"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  // If this component is being used as a standalone projection window
  if (window.location.pathname === '/projection') {
    return projectionContent;
  }

  // Preview mode for dashboard
  return (
    <Card className="w-full">
      <CardContent className="p-0">
        {/* Preview header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <Monitor className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Projection Preview
            </h3>
            {currentVerse && (
              <Badge variant="default" className="text-xs">
                Live
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="text-xs"
            >
              {isVisible ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
              {isVisible ? "Hide" : "Show"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearProjection}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openProjectionWindow}
              className="text-xs"
            >
              <Maximize2 className="w-3 h-3 mr-1" />
              Open Window
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="text-xs"
            >
              <Monitor className="w-3 h-3 mr-1" />
              Fullscreen
            </Button>
          </div>
        </div>

        {/* Preview content */}
        <div className="aspect-video bg-black relative overflow-hidden">
          <div className="transform scale-[0.3] origin-top-left w-[333.33%] h-[333.33%]">
            {projectionContent}
          </div>
          
          {/* Preview overlay */}
          <div className="absolute inset-0 border-2 border-dashed border-gray-600 pointer-events-none" />
          
          {/* Resolution indicator */}
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            1920×1080 Preview
          </div>
        </div>

        {/* Quick settings */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Font: {settings.fontFamily} {settings.fontSize}pt</span>
            <span>Theme: {settings.projectionTheme}</span>
            <span>Duration: {settings.displayDuration}s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}