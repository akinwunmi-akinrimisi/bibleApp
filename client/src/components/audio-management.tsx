import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  TestTube, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Play,
  Square,
  RefreshCw
} from "lucide-react";

interface AudioDevice {
  deviceId: string;
  label: string;
  kind: string;
}

interface AudioSettings {
  selectedDevice: string;
  gain: number;
  noiseReduction: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
  sampleRate: number;
}

export function AudioManagement() {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [settings, setSettings] = useState<AudioSettings>({
    selectedDevice: "default",
    gain: 75,
    noiseReduction: true,
    echoCancellation: true,
    autoGainControl: true,
    sampleRate: 44100
  });
  const [isListening, setIsListening] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioQuality, setAudioQuality] = useState<"poor" | "good" | "excellent">("good");
  const [permissionStatus, setPermissionStatus] = useState<"unknown" | "granted" | "denied">("unknown");
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const { toast } = useToast();

  // Load available audio devices
  const loadDevices = useCallback(async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceList
        .filter(device => device.kind === 'audioinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`,
          kind: device.kind
        }));
      
      setDevices(audioInputs);
    } catch (error) {
      console.error("Failed to enumerate devices:", error);
      toast({
        title: "Device Access Error",
        description: "Could not access audio devices. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Check microphone permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionStatus(permission.state as any);
        
        permission.onchange = () => {
          setPermissionStatus(permission.state as any);
        };
      } catch (error) {
        console.error("Permission check failed:", error);
      }
    };

    checkPermissions();
    loadDevices();
  }, [loadDevices]);

  // Audio level monitoring
  const monitorAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate RMS (Root Mean Square) for audio level
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const level = (rms / 255) * 100;
    
    setAudioLevel(level);
    
    // Determine audio quality based on level and consistency
    if (level < 5) {
      setAudioQuality("poor");
    } else if (level > 15 && level < 80) {
      setAudioQuality("excellent");
    } else {
      setAudioQuality("good");
    }

    if (isListening || isTesting) {
      animationFrameRef.current = requestAnimationFrame(monitorAudio);
    }
  }, [isListening, isTesting]);

  // Start audio stream
  const startAudioStream = async (deviceId?: string) => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: deviceId || settings.selectedDevice !== "default" ? settings.selectedDevice : undefined,
          echoCancellation: settings.echoCancellation,
          noiseSuppression: settings.noiseReduction,
          autoGainControl: settings.autoGainControl,
          sampleRate: settings.sampleRate
        }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      setPermissionStatus("granted");

      // Setup audio analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(newStream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      
      return newStream;
    } catch (error: any) {
      console.error("Audio stream error:", error);
      setPermissionStatus("denied");
      toast({
        title: "Microphone Access Failed",
        description: error.name === "NotAllowedError" 
          ? "Please allow microphone access in your browser settings"
          : "Could not access the selected microphone",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Stop audio stream
  const stopAudioStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setAudioLevel(0);
    setIsListening(false);
    setIsTesting(false);
  };

  // Test audio functionality
  const testAudio = async () => {
    if (isTesting) {
      stopAudioStream();
      return;
    }

    try {
      setIsTesting(true);
      await startAudioStream();
      monitorAudio();
      
      toast({
        title: "Audio Test Started",
        description: "Testing microphone for 10 seconds...",
      });

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (isTesting) {
          stopAudioStream();
          toast({
            title: "Audio Test Complete",
            description: `Audio quality: ${audioQuality}`,
          });
        }
      }, 10000);
    } catch (error) {
      setIsTesting(false);
    }
  };

  // Start/stop listening
  const toggleListening = async () => {
    if (isListening) {
      stopAudioStream();
    } else {
      try {
        setIsListening(true);
        await startAudioStream();
        monitorAudio();
        
        toast({
          title: "Listening Started",
          description: "VerseProjection is now listening for speech",
        });
      } catch (error) {
        setIsListening(false);
      }
    }
  };

  // Update audio settings
  const updateSetting = <K extends keyof AudioSettings>(
    key: K,
    value: AudioSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // If currently listening, restart with new settings
    if (isListening || isTesting) {
      stopAudioStream();
      setTimeout(async () => {
        try {
          if (isListening) {
            await startAudioStream();
            monitorAudio();
          }
        } catch (error) {
          console.error("Failed to restart audio with new settings:", error);
        }
      }, 100);
    }
  };

  const getQualityColor = () => {
    switch (audioQuality) {
      case "excellent": return "text-green-600";
      case "good": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getQualityIcon = () => {
    switch (audioQuality) {
      case "excellent": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "good": return <Volume2 className="w-4 h-4 text-yellow-600" />;
      case "poor": return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mic className="w-5 h-5 text-blue-600" />
            <span>Audio Management</span>
          </div>
          <Badge 
            variant={permissionStatus === "granted" ? "default" : "destructive"}
            className="text-xs"
          >
            {permissionStatus === "granted" ? "Access Granted" : 
             permissionStatus === "denied" ? "Access Denied" : "Permission Unknown"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Device Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="audio-device">Input Device</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadDevices}
              className="text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
          <Select
            value={settings.selectedDevice}
            onValueChange={(value) => updateSetting("selectedDevice", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select microphone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Device</SelectItem>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Audio Level Monitoring */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Audio Level</Label>
            <div className="flex items-center space-x-2">
              {getQualityIcon()}
              <span className={`text-sm font-medium ${getQualityColor()}`}>
                {audioQuality}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={audioLevel} 
              className="h-3"
              style={{
                background: audioLevel < 5 ? "#fee2e2" : audioLevel > 80 ? "#fef3c7" : "#dcfce7"
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Silent</span>
              <span>{Math.round(audioLevel)}%</span>
              <span>Too Loud</span>
            </div>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex space-x-3">
          <Button
            variant={isListening ? "destructive" : "default"}
            onClick={toggleListening}
            disabled={permissionStatus === "denied"}
            className="flex-1"
          >
            {isListening ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={testAudio}
            disabled={permissionStatus === "denied"}
            className="flex-1"
          >
            <TestTube className="w-4 h-4 mr-2" />
            {isTesting ? "Stop Test" : "Test Audio"}
          </Button>
        </div>

        {/* Audio Settings */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Audio Processing
          </h4>
          
          {/* Input Gain */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Input Gain</Label>
              <Badge variant="outline">{settings.gain}%</Badge>
            </div>
            <Slider
              value={[settings.gain]}
              onValueChange={([value]) => updateSetting("gain", value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Sample Rate */}
          <div className="space-y-2">
            <Label>Sample Rate</Label>
            <Select
              value={settings.sampleRate.toString()}
              onValueChange={(value) => updateSetting("sampleRate", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16000">16 kHz (Phone Quality)</SelectItem>
                <SelectItem value="22050">22 kHz (Radio Quality)</SelectItem>
                <SelectItem value="44100">44.1 kHz (CD Quality)</SelectItem>
                <SelectItem value="48000">48 kHz (Professional)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audio Processing Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Noise Reduction</Label>
                <p className="text-xs text-gray-500">Remove background noise</p>
              </div>
              <Switch
                checked={settings.noiseReduction}
                onCheckedChange={(checked) => updateSetting("noiseReduction", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Echo Cancellation</Label>
                <p className="text-xs text-gray-500">Prevent feedback loops</p>
              </div>
              <Switch
                checked={settings.echoCancellation}
                onCheckedChange={(checked) => updateSetting("echoCancellation", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto Gain Control</Label>
                <p className="text-xs text-gray-500">Automatically adjust volume</p>
              </div>
              <Switch
                checked={settings.autoGainControl}
                onCheckedChange={(checked) => updateSetting("autoGainControl", checked)}
              />
            </div>
          </div>
        </div>

        {/* Status Information */}
        {(isListening || isTesting) && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="animate-pulse">
                {isListening ? (
                  <Mic className="w-5 h-5 text-blue-600" />
                ) : (
                  <TestTube className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {isListening ? "Listening for speech..." : "Testing audio input..."}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Audio level: {Math.round(audioLevel)}% | Quality: {audioQuality}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Permission Denied Warning */}
        {permissionStatus === "denied" && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  Microphone Access Required
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Please allow microphone access in your browser settings to use VerseProjection.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}