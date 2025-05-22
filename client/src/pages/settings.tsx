import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAudio } from '@/hooks/use-audio';
import { apiRequest } from '@/lib/queryClient';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { audioDevices, selectedDeviceId, setSelectedDeviceId, testAudioInput } = useAudio();
  
  // Initialize state with defaults - will be updated when settings are loaded
  const [formValues, setFormValues] = useState({
    bibleVersion: 'KJV',
    fontSize: 24,
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    fontFamily: 'Roboto',
    confidenceThreshold: 70,
    audioInput: 'default',
  });

  // Load settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/settings'],
  });

  // Update local state when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormValues({
        bibleVersion: settings.bibleVersion || 'KJV',
        fontSize: settings.fontSize || 24,
        textColor: settings.textColor || '#FFFFFF',
        backgroundColor: settings.backgroundColor || '#000000',
        fontFamily: settings.fontFamily || 'Roboto',
        confidenceThreshold: settings.confidenceThreshold || 70,
        audioInput: settings.audioInput || 'default',
      });
      setSelectedDeviceId(settings.audioInput || 'default');
    }
  }, [settings, setSelectedDeviceId]);

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PUT', '/api/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: 'destructive',
      });
    },
  });

  // Form handlers
  const handleChange = (key: string, value: string | number) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formValues);
  };

  // Preview section style
  const previewStyle = {
    fontSize: `${formValues.fontSize}px`,
    fontFamily: formValues.fontFamily,
    color: formValues.textColor,
    backgroundColor: formValues.backgroundColor,
  };

  if (isLoading) {
    return <div className="p-4 md:p-6 text-center">Loading settings...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure application preferences</p>
      </header>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bible Version */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <h2 className="font-bold mb-4 text-ink-DEFAULT dark:text-gray-200">Bible Version</h2>
            <RadioGroup 
              value={formValues.bibleVersion}
              onValueChange={(value) => handleChange('bibleVersion', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="KJV" id="KJV" />
                <Label htmlFor="KJV">King James Version (KJV)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="WEB" id="WEB" />
                <Label htmlFor="WEB">World English Bible (WEB)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* Audio Input */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <h2 className="font-bold mb-4 text-ink-DEFAULT dark:text-gray-200">Audio Input</h2>
            <div className="mb-4">
              <Label htmlFor="audioInput" className="block text-sm font-medium mb-1">
                Select Input Device
              </Label>
              <Select 
                value={selectedDeviceId} 
                onValueChange={(value) => {
                  setSelectedDeviceId(value);
                  handleChange('audioInput', value);
                }}
              >
                <SelectTrigger id="audioInput" className="w-full">
                  <SelectValue placeholder="Select audio device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Microphone</SelectItem>
                  {audioDevices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId.substring(0, 5)}...`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="button" 
              variant="outline"
              onClick={testAudioInput}
              className="flex items-center"
            >
              <span className="material-icons mr-2 text-primary-600">mic</span>
              Test Audio (5s)
            </Button>
          </CardContent>
        </Card>
        
        {/* Display Settings */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <h2 className="font-bold mb-4 text-ink-DEFAULT dark:text-gray-200">Display Settings</h2>
            
            <div className="mb-4">
              <Label htmlFor="fontSize" className="block text-sm font-medium mb-1">
                Font Size: <span>{formValues.fontSize}</span>pt
              </Label>
              <Slider 
                id="fontSize"
                min={12}
                max={48}
                step={2}
                value={[formValues.fontSize]}
                onValueChange={(value) => handleChange('fontSize', value[0])}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="textColor" className="block text-sm font-medium mb-1">
                  Text Color
                </Label>
                <div className="flex">
                  <Input 
                    type="color" 
                    id="textColor" 
                    value={formValues.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="h-10 w-10 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer"
                  />
                  <Input 
                    type="text" 
                    value={formValues.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="ml-2 flex-1 px-3 py-2 uppercase"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="backgroundColor" className="block text-sm font-medium mb-1">
                  Background Color
                </Label>
                <div className="flex">
                  <Input 
                    type="color" 
                    id="backgroundColor" 
                    value={formValues.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="h-10 w-10 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer"
                  />
                  <Input 
                    type="text" 
                    value={formValues.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="ml-2 flex-1 px-3 py-2 uppercase"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="fontFamily" className="block text-sm font-medium mb-1">
                Font Family
              </Label>
              <Select 
                value={formValues.fontFamily} 
                onValueChange={(value) => handleChange('fontFamily', value)}
              >
                <SelectTrigger id="fontFamily" className="w-full">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div 
              className="p-4 rounded-lg flex items-center justify-center" 
              style={{ minHeight: '150px', ...previewStyle }}
            >
              <div className="text-center">
                <div>For God so loved the world...</div>
                <div className="text-sm mt-2">John 3:16</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Confidence Threshold */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <h2 className="font-bold mb-4 text-ink-DEFAULT dark:text-gray-200">Detection Settings</h2>
            
            <div className="mb-4">
              <Label htmlFor="confidenceThreshold" className="block text-sm font-medium mb-1">
                Confidence Threshold: <span>{formValues.confidenceThreshold}</span>%
              </Label>
              <Slider 
                id="confidenceThreshold"
                min={50}
                max={95}
                step={5}
                value={[formValues.confidenceThreshold]}
                onValueChange={(value) => handleChange('confidenceThreshold', value[0])}
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Higher values require more precise matches but may reduce detection rate.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={saveMutation.isPending}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md px-6 py-3"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
