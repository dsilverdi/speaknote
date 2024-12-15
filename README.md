<div align="center">
<h1>speaknote</h1>
Realtime Voice note with Speaknote 🎵

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
</div>

## 🚀 Features

- **Real-time Speech to Text**: Convert your voice to text in real-time
- **Note Management**: Save and organize your transcribed notes
- **Expandable Notes**: Click to view full content of saved notes
- **Clean UI**: Modern and responsive design using shadcn/ui

## 🛠️ Tech Stack

- **Frontend**:
  - React + TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui
  - Socket.io Client
  - Lucide React Icons

- **Backend**:
  - Node.js + Express
  - Socket.io Server
  - Deepgram API for Speech Recognition

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/speaknote.git
cd speaknote
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:
```bash
# In server directory, create .env file
DEEPGRAM_SECRET=your_deepgram_api_key
PORT=3000
```

4. Start the development servers:
```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm run dev
```

## 🔧 Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Click the "Start Recording" button to begin voice recording
3. Speak into your microphone and watch the real-time transcription
4. Click "Save Note" to store the transcribed text
5. View your saved notes in the list below
6. Click on any note to expand and view its full content

## 🔍 API Reference

### WebSocket Events

**Client to Server:**
- `audioData`: Sends audio chunks for transcription
  ```typescript
  {
    audio: Uint8Array,
    mimeType: string,
    size: number
  }
  ```

**Server to Client:**
- `transcription`: Returns transcribed text
  ```typescript
  string
  ```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
