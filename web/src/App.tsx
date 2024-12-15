import { useState } from 'react';
import { Mic, MicOff, Loader2,  Save, ChevronDown, ChevronUp  } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAudioRecorder } from './hooks/useAudioRecorder';

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

const SpeechToText = () => {
  const {startRecording, stopRecording, isRecording, error, transcribedText, setTranscribedText} = useAudioRecorder();
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([])
  
  const handleToggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

  const handleSaveNote = () => {
    if (transcribedText.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        text: transcribedText.trim(),
        timestamp: new Date().toLocaleString()
      };
      setNotes(prev => [newNote, ...prev]);
      
      // Clear the transcribed text
      setTranscribedText('');
    }
  };

  const toggleNoteExpansion = (noteId: string) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Speaknote</span>
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
                <Button
                  onClick={handleSaveNote}
                  disabled={!transcribedText.trim()}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Note
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
        
        {notes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Saved Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notes.map((note) => (
                <Card 
                  key={note.id} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleNoteExpansion(note.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">{note.timestamp}</p>
                        <p className="text-gray-700 mt-1">
                          {expandedNoteId === note.id 
                            ? note.text
                            : note.text.slice(0, 100) + (note.text.length > 100 ? '...' : '')}
                        </p>
                      </div>
                      {expandedNoteId === note.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SpeechToText;