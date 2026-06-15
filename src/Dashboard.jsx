import { useEffect, useRef, useState } from "react";
import { nhost } from "./nhost";

function Dashboard() {
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!nhost.auth.isAuthenticated()) {
      window.location.href = "/";
    }
  }, []);

  const startRecording = async () => {
    try {
      setRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const socket = new WebSocket(
        "wss://api.deepgram.com/v1/listen",
        ["token", import.meta.env.VITE_DEEPGRAM_API_KEY]
      );

      socketRef.current = socket;

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

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

        if (text.trim()) {
          setTranscript((prev) => prev + " " + text);
        }
      };

      socket.onerror = (error) => {
        console.error("Deepgram Error:", error);
      };

      socket.onclose = () => {
        console.log("Deepgram Closed");
      };
    } catch (error) {
      console.error(error);
      alert("Microphone access denied");
      setRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }

      if (socketRef.current) {
        socketRef.current.close();
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      setRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      stopRecording();

      await nhost.auth.signOut();

      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  const user = nhost.auth.getUser();

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>Live Speech-to-Text Dashboard</h1>

      <p>
        Logged in as:{" "}
        <strong>{user?.email || "User"}</strong>
      </p>

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

      {recording && (
        <button
          onClick={stopRecording}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Stop Recording
        </button>
      )}

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
          <p>Click Start Recording and begin speaking...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;