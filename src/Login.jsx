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

  const login = async () => {
    try {
      setLoading(true);

      // Already logged in
      const currentUser = nhost.auth.getUser();

      if (currentUser) {
        window.location.href = "/dashboard";
        return;
      }

      const { session, error } = await nhost.auth.signIn({
        email,
        password,
      });

      console.log("LOGIN RESULT:", { session, error });

      if (error) {
        if (error.error === "already-signed-in") {
          window.location.href = "/dashboard";
          return;
        }

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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
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
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
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
      </form>
    </div>
  );
}

export default Login;