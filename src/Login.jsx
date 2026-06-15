import { useState } from "react";
import { nhost } from "./nhost";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      const { session, error } =
        await nhost.auth.signUp({
          email,
          password,
        });

      console.log("Signup:", session, error);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Signup Successful");
    } catch (err) {
      console.error(err);
      alert("Signup Failed");
    }
  };

  const login = async () => {
    try {
      const { session, error } =
        await nhost.auth.signIn({
          email,
          password,
        });

      console.log("Login:", session, error);

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
        display: "flex",
        flexDirection: "column",
        width: "300px",
        margin: "100px auto",
        gap: "10px",
      }}
    >
      <h2>Speech Dashboard</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={signup}>
        Sign Up
      </button>

      <button onClick={login}>
        Login
      </button>
    </div>
  );
}

export default Login;