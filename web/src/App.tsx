import { useEffect, useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAudioRecorder } from './hooks/useAudioRecorder';

const SpeechToText = () => {
  const {startRecording, stopRecording, isRecording, error, transcribedText} = useAudioRecorder();
  
  const handleToggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Speech to Text Converter</span>
              <div className="flex items-center gap-2">
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-blue-500">Recording...</span>
                  </div>
                )}
                <Button 
                  onClick={handleToggleRecording}
                  variant={isRecording ? "destructive" : "default"}
                  className="flex items-center gap-2"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg border p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
              {transcribedText ? (
                <p className="text-gray-700">{transcribedText}</p>
              ) : (
                <p className="text-gray-400 italic">
                  Your transcribed text will appear here...
                </p>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Tips:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Speak clearly into your microphone</li>
                <li>Click the record button to start/stop recording</li>
                <li>Text will appear in real-time as you speak</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeechToText;