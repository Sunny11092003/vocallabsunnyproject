import { useState } from "react";

function Dashboard() {
  const [transcript, setTranscript] = useState("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);

    const socket = new WebSocket(
      "wss://api.deepgram.com/v1/listen",
      ["token", import.meta.env.VITE_DEEPGRAM_API_KEY]
    );

    socket.onopen = () => {
      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0 && socket.readyState === 1) {
          socket.send(event.data);
        }
      });

      mediaRecorder.start(250);
    };

    socket.onmessage = (message) => {
      const received = JSON.parse(message.data);

      const text =
        received.channel?.alternatives?.[0]?.transcript;

      if (text) {
        setTranscript((prev) => prev + " " + text);
      }
    };
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Live Speech To Text Dashboard</h1>

      <button onClick={startRecording}>
        Start Recording
      </button>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid gray",
          padding: "20px",
          minHeight: "150px",
        }}
      >
        {transcript}
      </div>
    </div>
  );
}

export default Dashboard;