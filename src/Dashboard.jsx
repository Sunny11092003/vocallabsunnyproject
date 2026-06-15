import { useState, useRef, useEffect } from "react";
import { nhost } from "./nhost";

function Dashboard() {
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("");

  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = nhost.auth.getUser();

      console.log("USER:", user);
      console.log("AUTH:", nhost.auth.isAuthenticated());

      if (!user) {
        window.location.href = "/";
      }
    }, 1000);

    const handleUnload = () => {
      localStorage.clear();
      sessionStorage.clear();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const startRecording = async () => {
    try {
      setPermissionStatus("Requesting microphone access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      setPermissionStatus("Microphone access granted");
      setRecording(true);

      const socket = new WebSocket(
        "wss://api.deepgram.com/v1/listen",
        ["token", import.meta.env.VITE_DEEPGRAM_API_KEY]
      );

      socketRef.current = socket;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      socket.onopen = () => {
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
    } catch (error) {
      console.error(error);

      setPermissionStatus(
        "Microphone permission denied."
      );

      setRecording(false);
    }
  };

  const stopRecording = () => {
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
  };

  const logout = async () => {
    try {
      stopRecording();

      await nhost.auth.signOut();

      localStorage.clear();
      sessionStorage.clear();

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
        Logged in as: <strong>{user?.email}</strong>
      </p>

      <button
        onClick={startRecording}
        disabled={recording}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
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
          }}
        >
          Stop Recording
        </button>
      )}

      <button
        onClick={logout}
        style={{
          padding: "10px 20px",
        }}
      >
        Logout
      </button>

      <div style={{ marginTop: "15px" }}>
        {permissionStatus}
      </div>

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