export class AudioRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private isRecording: boolean = false;
    private stream: MediaStream | null = null;
  
    // Event callbacks
    private onDataAvailable?: (data: Blob) => void;
    private onRecordingComplete?: (recording: Blob) => void;
    private onError?: (error: Error) => void;
  
    constructor(options?: {
      onDataAvailable?: (data: Blob) => void;
      onRecordingComplete?: (recording: Blob) => void;
      onError?: (error: Error) => void;
    }) {
      this.onDataAvailable = options?.onDataAvailable;
      this.onRecordingComplete = options?.onRecordingComplete;
      this.onError = options?.onError;
    }
  
    async startRecording(): Promise<void> {
      try {
        if (this.isRecording) {
          throw new Error('Recording is already in progress');
        }
  
        // Request microphone access
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create MediaRecorder instance
        this.mediaRecorder = new MediaRecorder(this.stream, {
          mimeType: this.getSupportedMimeType()
        });
  
        // Set up event handlers
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
            this.onDataAvailable?.(event.data);
          }
        };
  
        this.mediaRecorder.onstop = () => {
          const recordingBlob = new Blob(this.audioChunks, {
            type: this.getSupportedMimeType()
          });
          this.onRecordingComplete?.(recordingBlob);
          this.audioChunks = [];
        };
  
        // Start recording
        this.mediaRecorder.start(100); // Capture data in 100ms chunks
        this.isRecording = true;
  
      } catch (error) {
        this.onError?.(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    }
  
    async stopRecording(): Promise<void> {
      if (!this.isRecording || !this.mediaRecorder) {
        throw new Error('No recording in progress');
      }
  
      this.mediaRecorder.stop();
      this.stream?.getTracks().forEach(track => track.stop());
      this.isRecording = false;
      this.stream = null;
    }
  
    pauseRecording(): void {
      if (!this.isRecording || !this.mediaRecorder) {
        throw new Error('No recording in progress');
      }
      this.mediaRecorder.pause();
    }
  
    resumeRecording(): void {
      if (!this.isRecording || !this.mediaRecorder) {
        throw new Error('No recording in progress');
      }
      this.mediaRecorder.resume();
    }
  
    private getSupportedMimeType(): string {
      const mimeTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
        'audio/mp4'
      ];
  
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          return type;
        }
      }
  
      throw new Error('No supported audio MIME type found');
    }
  
    get recordingState(): RecordingState {
      return {
        isRecording: this.isRecording,
        state: this.mediaRecorder?.state || 'inactive'
      };
    }
}
  
export interface RecordingState {
    isRecording: boolean;
    state: 'inactive' | 'recording' | 'paused';
}