import React, { useEffect, useState } from 'react';
import type { VerseMatch } from '@shared/schema';

export function ProjectionWindow() {
  const [verse, setVerse] = useState<VerseMatch | null>(null);
  const [settings, setSettings] = useState({
    fontSize: 24,
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    fontFamily: 'Roboto',
  });
  
  useEffect(() => {
    // Listen for messages from the main window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'project-verse') {
        setVerse(event.data.payload);
      }
      else if (event.data.type === 'update-settings') {
        setSettings(event.data.payload);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Set title and make full screen
    document.title = 'VerseProjection - Projection Window';
    
    // Let the opener know we're ready
    if (window.opener) {
      window.opener.postMessage({ type: 'projection-ready' }, '*');
    }
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  if (!verse) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center text-white text-lg">
          Waiting for verse selection...
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-200 ease-in-out"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div className="text-center px-8 animate-fade-in">
        <div 
          className="mb-4 font-medium"
          style={{ 
            color: settings.textColor,
            fontSize: `${settings.fontSize}px`,
            fontFamily: settings.fontFamily,
          }}
        >
          {verse.text}
        </div>
        <div 
          className="text-2xl font-bold"
          style={{ 
            color: settings.textColor,
            fontFamily: settings.fontFamily,
          }}
        >
          {verse.reference}
        </div>
        <div 
          className="text-lg mt-2 opacity-70"
          style={{ 
            color: settings.textColor,
            fontFamily: settings.fontFamily, 
          }}
        >
          {verse.version}
        </div>
      </div>
    </div>
  );
}

export default ProjectionWindow;
