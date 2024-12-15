import {useState, useCallback, useEffect} from 'react'
import {AudioRecorder, RecordingState} from '@/lib/AudioRecorder'

export const useAudioRecorder = () => {
    const [recorder, setRecorder] = useState<AudioRecorder | null>(null);
    const [recordingState, setRecordingState] = useState<RecordingState>({
        isRecording: false, 
        state: 'inactive'
    })

    const [error, setError] = useState<Error | null>(null);
    const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);

    useEffect(()=> {
        const newRecorder = new AudioRecorder({
            onDataAvailable: (data) => {
                setAudioBlobs(prev => [...prev, data])
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
                newRecorder.startRecording().catch(console.error)
            }
        }
    }, []);

    const startRecording = useCallback(async ()=>{
        try {
            setError(null);
            setAudioBlobs([]);
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
        audioBlobs
    }
}

