import {io, Socket} from "socket.io-client"

export class AudioSocketClient {
    public socket: Socket;
    private isConnected: boolean = false;

    constructor(serverUrl: string = 'http://localhost:3000') {
       this.socket = io(serverUrl, {
        reconnection: true, 
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
       })
       
       this.setupSocketListeners();
    }

    private setupSocketListeners(): void {
        this.socket.on('connect', ()=>{
            console.log("Connected to server")
            this.isConnected = true;
        })

        this.socket.on('disconnect', ()=>{
            console.log("Disconnected to server")
            this.isConnected = false;
        })

        this.socket.on("error", (error: Error) => {
            console.log("Socket Error: ", error)
        })
    }

    public async sendAudioChunk(audioData: Blob): Promise<void> {
        if (!this.isConnected) {
            console.warn("Not Connected to server");
            return;
        }

        const arrayBuffer = await audioData.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        this.socket.emit("audioData", {
            audio: uint8Array,
            mimeType: audioData.type,
            size: audioData.size
        });
    }

    public disconnect(): void {
        this.socket.disconnect();
    }
}