import { useState, useEffect } from "react";
import { nhost } from "./nhost";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const user = nhost.auth.getUser();

    if (user) {
      window.location.href = "/dashboard";
    }
  }, []);

  const signup = async () => {
    try {
      const { error } = await nhost.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Signup Successful. Please verify your email if required.");
    } catch (err) {
      console.error(err);
      alert("Signup Failed");
    }
  };

  const login = async () => {
    try {
      const currentUser = nhost.auth.getUser();

      if (currentUser) {
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

      alert("Login Successful");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Login Failed");
    }
  };

  return (
    <div
      style={{
        width: "350px",
        margin: "100px auto",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h2>Speech To Text Dashboard</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px" }}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px" }}
      />

      <button
        onClick={signup}
        style={{
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Sign Up
      </button>

      <button
        onClick={login}
        style={{
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;