import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Settings, 
  Volume2, 
  Palette, 
  Type, 
  Sliders, 
  Mic,
  TestTube,
  Save,
  Crown,
  Lock
} from "lucide-react";

interface SettingsData {
  // Bible & Detection Settings
  bibleVersion: string;
  confidenceThreshold: number;
  directQuoteMode: boolean;
  
  // Audio Settings
  audioInput: string;
  audioGain: number;
  noiseReduction: boolean;
  
  // Display Settings
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textColor: string;
  backgroundColor: string;
  textAlign: string;
  projectionTheme: string;
  textShadow: boolean;
  fadeAnimation: boolean;
  displayDuration: number;
}

interface SubscriptionTier {
  tier: string;
  features: {
    bibleVersions: string[];
    maxUsers: number | "unlimited";
    advancedAI: boolean;
    customThemes: boolean;
  };
}

const DEFAULT_SETTINGS: SettingsData = {
  bibleVersion: "KJV",
  confidenceThreshold: 75,
  directQuoteMode: false,
  audioInput: "default",
  audioGain: 50,
  noiseReduction: true,
  fontSize: 32,
  fontFamily: "Roboto",
  fontWeight: "500",
  textColor: "#FFFFFF",
  backgroundColor: "#000000",
  textAlign: "center",
  projectionTheme: "classic",
  textShadow: true,
  fadeAnimation: true,
  displayDuration: 8
};

export function SettingsPanel() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionTier | null>(null);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load current settings and subscription info
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load user settings
        const settingsResponse = await apiRequest("GET", "/api/settings");
        const settingsData = await settingsResponse.json();
        if (settingsData) {
          setSettings({ ...DEFAULT_SETTINGS, ...settingsData });
        }

        // Load subscription info
        const subResponse = await apiRequest("GET", "/api/subscription/status");
        const subData = await subResponse.json();
        setSubscription(subData);

        // Load audio devices
        if (navigator.mediaDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          setAvailableDevices(devices.filter(device => device.kind === 'audioinput'));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast({
          title: "Settings Load Error",
          description: "Could not load your current settings.",
          variant: "destructive"
        });
      }
    };

    loadSettings();
  }, [toast]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: SettingsData) => {
      const response = await apiRequest("PUT", "/api/settings", newSettings);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved!",
        description: "Your preferences have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Test audio functionality
  const testAudio = async () => {
    setIsTestingAudio(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: settings.audioInput !== "default" ? settings.audioInput : undefined,
          echoCancellation: settings.noiseReduction,
          noiseSuppression: settings.noiseReduction
        }
      });
      
      // Create audio context to test input
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      // Test for 3 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
        setIsTestingAudio(false);
        toast({
          title: "Audio Test Complete",
          description: "Audio input is working properly!",
        });
      }, 3000);

    } catch (error) {
      setIsTestingAudio(false);
      toast({
        title: "Audio Test Failed",
        description: "Could not access the selected audio device.",
        variant: "destructive"
      });
    }
  };

  const updateSetting = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettingsMutation.mutate(settings);
  };

  const getAvailableBibleVersions = () => {
    const baseBibleVersions = ["KJV", "WEB"];
    if (!subscription) return baseBibleVersions;

    switch (subscription.tier) {
      case "professional":
        return ["KJV", "WEB", "ESV", "NIV", "NASB"];
      case "enterprise":
        return ["KJV", "WEB", "ESV", "NIV", "NASB", "NKJV", "NLT", "CSB", "AMP"];
      default:
        return baseBibleVersions;
    }
  };

  const isFeatureLocked = (feature: string) => {
    if (!subscription) return true;
    
    switch (feature) {
      case "premiumBibles":
        return subscription.tier === "starter";
      case "customThemes":
        return !subscription.features.customThemes;
      case "advancedAI":
        return !subscription.features.advancedAI;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projection Settings
          </h2>
        </div>
        <Badge variant={subscription?.tier === "enterprise" ? "default" : "secondary"}>
          {subscription?.tier || "starter"} plan
        </Badge>
      </div>

      {/* Bible & Detection Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Type className="w-5 h-5" />
            <span>Bible & Detection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bible Version */}
          <div className="space-y-2">
            <Label htmlFor="bible-version">Bible Version</Label>
            <Select
              value={settings.bibleVersion}
              onValueChange={(value) => updateSetting("bibleVersion", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bible version" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableBibleVersions().map((version) => (
                  <SelectItem key={version} value={version}>
                    <div className="flex items-center justify-between w-full">
                      <span>{version}</span>
                      {!["KJV", "WEB"].includes(version) && isFeatureLocked("premiumBibles") && (
                        <Crown className="w-4 h-4 text-yellow-500 ml-2" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isFeatureLocked("premiumBibles") && (
              <p className="text-xs text-gray-500 flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Premium Bible versions require Professional plan or higher
              </p>
            )}
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Confidence Threshold</Label>
              <Badge variant="outline">{settings.confidenceThreshold}%</Badge>
            </div>
            <Slider
              value={[settings.confidenceThreshold]}
              onValueChange={([value]) => updateSetting("confidenceThreshold", value)}
              min={50}
              max={95}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Higher values = more precise detection, fewer results
            </p>
          </div>

          {/* Direct Quote Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Direct Quote Mode</Label>
              <p className="text-xs text-gray-500">
                Only detect explicitly quoted verses
              </p>
            </div>
            <Switch
              checked={settings.directQuoteMode}
              onCheckedChange={(checked) => updateSetting("directQuoteMode", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="w-5 h-5" />
            <span>Audio Input</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Audio Input Device */}
          <div className="space-y-2">
            <Label htmlFor="audio-input">Input Device</Label>
            <div className="flex space-x-2">
              <Select
                value={settings.audioInput}
                onValueChange={(value) => updateSetting("audioInput", value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select audio device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Device</SelectItem>
                  {availableDevices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={testAudio}
                disabled={isTestingAudio}
                className="px-3"
              >
                <TestTube className="w-4 h-4" />
                {isTestingAudio ? "Testing..." : "Test"}
              </Button>
            </div>
          </div>

          {/* Audio Gain */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Input Gain</Label>
              <Badge variant="outline">{settings.audioGain}%</Badge>
            </div>
            <Slider
              value={[settings.audioGain]}
              onValueChange={([value]) => updateSetting("audioGain", value)}
              min={0}
              max={100}
              step={10}
              className="w-full"
            />
          </div>

          {/* Noise Reduction */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Noise Reduction</Label>
              <p className="text-xs text-gray-500">
                Filter background noise and echo
              </p>
            </div>
            <Switch
              checked={settings.noiseReduction}
              onCheckedChange={(checked) => updateSetting("noiseReduction", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Projection Display</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Font Size</Label>
              <Badge variant="outline">{settings.fontSize}pt</Badge>
            </div>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => updateSetting("fontSize", value)}
              min={12}
              max={48}
              step={2}
              className="w-full"
            />
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) => updateSetting("fontFamily", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => updateSetting("textColor", e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300"
                />
                <span className="text-sm text-gray-600">{settings.textColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Background</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => updateSetting("backgroundColor", e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300"
                />
                <span className="text-sm text-gray-600">{settings.backgroundColor}</span>
              </div>
            </div>
          </div>

          {/* Text Alignment */}
          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <Select
              value={settings.textAlign}
              onValueChange={(value) => updateSetting("textAlign", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Animation Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Animation</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Text Shadow</Label>
                <p className="text-xs text-gray-500">Add shadow for better readability</p>
              </div>
              <Switch
                checked={settings.textShadow}
                onCheckedChange={(checked) => updateSetting("textShadow", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Fade Animation</Label>
                <p className="text-xs text-gray-500">Smooth transitions between verses</p>
              </div>
              <Switch
                checked={settings.fadeAnimation}
                onCheckedChange={(checked) => updateSetting("fadeAnimation", checked)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Display Duration</Label>
                <Badge variant="outline">{settings.displayDuration}s</Badge>
              </div>
              <Slider
                value={[settings.displayDuration]}
                onValueChange={([value]) => updateSetting("displayDuration", value)}
                min={3}
                max={30}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saveSettingsMutation.isPending}
          className="min-w-32"
        >
          <Save className="w-4 h-4 mr-2" />
          {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}