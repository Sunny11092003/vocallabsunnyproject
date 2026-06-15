import { useState, useEffect } from "react";
import { nhost } from "./nhost";

function Login() {
  const [email, setEmail] = useState("vocallabs@gmail.com");
  const [password, setPassword] = useState("vocallabs123");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nhost.auth.isAuthenticated()) {
      window.location.href = "/dashboard";
    }
  }, []);

  const signup = async () => {
    try {
      setLoading(true);

      const { error } = await nhost.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Signup Successful");
    } catch (err) {
      console.error(err);
      alert("Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);

      if (nhost.auth.isAuthenticated()) {
        window.location.href = "/dashboard";
        return;
      }

      const { error } = await nhost.auth.signIn({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "100px auto",
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Speech To Text Dashboard
      </h2>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #ddd",
        }}
      >
        <strong>Demo Credentials</strong>

        <p>
          Email: <b>vocallabs@gmail.com</b>
        </p>

        <p>
          Password: <b>vocallabs123</b>
        </p>
      </div>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={signup}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Please Wait..." : "Sign Up"}
      </button>

      <button
        onClick={login}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Please Wait..." : "Login"}
      </button>
    </div>
  );
}

export default Login;