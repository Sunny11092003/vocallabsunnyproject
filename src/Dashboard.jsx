import { useState } from "react";
import { nhost } from "./nhost";

function Dashboard() {
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    try {
      setRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const socket = new WebSocket(
        "wss://api.deepgram.com/v1/listen",
        ["token", import.meta.env.VITE_DEEPGRAM_API_KEY]
      );

      const mediaRecorder = new MediaRecorder(stream);

      socket.onopen = () => {
        console.log("Deepgram Connected");

        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (
            event.data.size > 0 &&
            socket.readyState === WebSocket.OPEN
          ) {
            socket.send(event.data);
          }
        });

        mediaRecorder.start(250);
      };

      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);

        const text =
          data.channel?.alternatives?.[0]?.transcript || "";

        if (text.trim() !== "") {
          setTranscript((prev) => prev + " " + text);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      socket.onclose = () => {
        console.log("Deepgram Connection Closed");
      };
    } catch (error) {
      console.error(error);
      alert("Microphone access denied");
    }
  };

  const logout = async () => {
    await nhost.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>Live Speech-to-Text Dashboard</h1>

      <button
        onClick={startRecording}
        disabled={recording}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          cursor: "pointer",
        }}
      >
        {recording ? "Recording..." : "Start Recording"}
      </button>

      <button
        onClick={logout}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <div
        style={{
          marginTop: "30px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          minHeight: "250px",
        }}
      >
        <h3>Live Transcript</h3>

        {transcript ? (
          <p>{transcript}</p>
        ) : (
          <p>Click "Start Recording" and begin speaking...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;