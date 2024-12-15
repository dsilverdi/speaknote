import express, {Express} from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import {createClient, LiveTranscriptionEvents} from "@deepgram/sdk"

dotenv.config();
const app: Express = express();
const corsOPtion = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}

app.use(cors(corsOPtion));
const httpserver = createServer(app);

const io = new Server(httpserver, {
    cors: corsOPtion,
    maxHttpBufferSize: 1e8,
})

const deepgram = createClient(process.env.DEEPGRAM_SECRET);

const setupDeepgram = (ws: Socket) => {
    const connection = deepgram.listen.live({
        model: "nova-2",
        language: "en-US",
        smart_format: true,
    });
    
    // STEP 3: Listen for events from the live transcription connection
    connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("deepgram connection opened");

        connection.on(LiveTranscriptionEvents.Close, () => {
            console.log("deepgram connection closed.");
        });

        connection.on(LiveTranscriptionEvents.Transcript, (data) => {
            const transcript = data.channel.alternatives[0].transcript;
            if (transcript) {
                ws.emit("transcription", transcript)
            }
        });

        connection.on(LiveTranscriptionEvents.Metadata, (data) => {
            console.log(data);
        });

        connection.on(LiveTranscriptionEvents.Error, (err) => {
            console.error(err);
        });
    });

    return connection
}

io.on('connection', (socket) => { 
    console.log("Client connected", socket.id);

    let deepgram = setupDeepgram(socket)
    socket.on("audioData", (data) => {
        console.log("audio get")
        if (deepgram.getReadyState() === 1) {
            try {
                console.log("send data")
                deepgram.send(data.audio);
            } catch (error) {
                console.log("Error Sending data to deepgram")
            }
        } else if (deepgram.getReadyState() >= 2) { 
            console.log("ws: data couldn't be sent to deepgram");
            console.log("ws: retrying connection to deepgram");
            /* Attempt to reopen the Deepgram connection */
            deepgram.requestClose();
            deepgram.removeAllListeners();
            deepgram = setupDeepgram(socket);
        } else {
            console.warn("Deepgram connection not ready for socket:", socket.id);
        }
    })

    socket.on("disconnect", ()=>{
        console.log("Client disconnected", socket.id)
    })

    socket.on("error", (error) => {
        console.log("Socket error:", error)
    })
})

const PORT = process.env.PORT || 3000;

httpserver.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`)
})