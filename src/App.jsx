import { useState } from "react";

function App() {
  const [status, setStatus] = useState("Ready");
  const [tokenPreview, setTokenPreview] = useState("");

  async function getToken() {
    try {
      setStatus("Requesting token…");
      const r = await fetch("/api/hume-token");
      if (!r.ok) throw new Error(await r.text());
      const { token } = await r.json();
      setStatus("Got a token!");
      setTokenPreview(token.slice(0, 12) + "…");
    } catch (e) {
      setStatus("Error: " + e.message);
    }
  }

  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Hume + Netlify Starter</h1>
      <p>Status: {status}</p>
      {tokenPreview && <p>Token (preview): <code>{tokenPreview}</code></p>}
      <button onClick={getToken} style={{ padding: "8px 12px" }}>
        Get Hume Token (via Netlify Function)
      </button>
      <p style={{ marginTop: 12, opacity: 0.7 }}>
        Endpoint: <code>/api/hume-token</code>
      </p>
    </main>
  );
}
export default App;
