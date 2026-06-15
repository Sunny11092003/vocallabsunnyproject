import { useState, useEffect } from "react";
import { nhost } from "./nhost";

function Login() {
  const [email, setEmail] = useState("vocallabs@gmail.com");
  const [password, setPassword] = useState("vocallabs123");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = nhost.auth.getUser();

    if (user) {
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
    } catch (error) {
      console.error(error);
      alert("Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);

      const { session, error } = await nhost.auth.signIn({
        email,
        password,
      });

      console.log("LOGIN RESULT:", { session, error });

      if (error) {
        alert(error.message);
        return;
      }

      if (session) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error);
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
        fontFamily: "Arial",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Speech To Text Dashboard
      </h2>

      <div
        style={{
          background: "#f5f5f5",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <strong>Demo Credentials</strong>

        <p>Email: <b>vocallabs@gmail.com</b></p>
        <p>Password: <b>vocallabs123</b></p>
      </div>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
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
        }}
      >
        Sign Up
      </button>

      <button
        onClick={login}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;