import express, {Express} from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

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

io.on('connection', (socket) => {
    console.log("Client connected", socket.id);

    socket.on("audioData", (data) => {
        console.log('Received audio chunk from client:', socket.id);
        console.log('Audio data:', {
            size: data.size,
            mimeType: data.mimeType,
            arrayBufferSize: data.audio.length
        });

        const mockText = "mock transcription text" + new Date().toLocaleTimeString();
        socket.emit('transcription', mockText);
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