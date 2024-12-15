import {useState, useCallback, useEffect, useRef} from 'react'
import {AudioRecorder, RecordingState} from '@/lib/AudioRecorder'
import { AudioSocketClient  } from '@/lib/socket';

export const useAudioRecorder = () => {
    const [recorder, setRecorder] = useState<AudioRecorder | null>(null);
    const [recordingState, setRecordingState] = useState<RecordingState>({
        isRecording: false, 
        state: 'inactive'
    })

    const [error, setError] = useState<Error | null>(null);
    const socketClientRef = useRef<AudioSocketClient | null>(null);
    const [transcribedText, setTranscribedText] = useState('');

    useEffect(()=>{
        socketClientRef.current = new AudioSocketClient();

        return ()=> {
            socketClientRef.current?.disconnect();
        }
    }, [])


    useEffect(()=> {
        const newRecorder = new AudioRecorder({
            onDataAvailable: (data) => {
                socketClientRef.current?.sendAudioChunk(data);
            },
            onRecordingComplete: (recording) => {
                console.log("Recording Complete", recording)
            },
            onError: (error) => {
                setError(error)
            }
        })

        setRecorder(newRecorder);

        return () => {
            if (newRecorder.recordingState.isRecording) {
                newRecorder.stopRecording().catch(console.error)
            }
        }
    }, []);

    useEffect(() => {
        const socket = socketClientRef.current?.socket;
        
        if (socket) {
          socket.on('transcription', (text: string) => {
            setTranscribedText(prev => prev + ' ' + text);
          });
        }
      }, []);
    

    const startRecording = useCallback(async ()=>{
        try {
            setError(null);
            await recorder?.startRecording();
            setRecordingState(recorder?.recordingState || {isRecording: false, state: 'inactive'})
        } catch (err) {
            setError(err instanceof Error ? err : new Error('failed to start recording'))
        }
    }, [recorder])

    const stopRecording = useCallback(async ()=>{
        try {
            await recorder?.stopRecording();
            setRecordingState(recorder?.recordingState || {isRecording: false, state: 'inactive'})
        } catch (err) {
            setError(err instanceof Error ? err : new Error('failed to start recording'))
        }
    }, [recorder])

    return {
        startRecording, 
        stopRecording, 
        isRecording: recordingState.isRecording,
        error,
        transcribedText
    }
}

