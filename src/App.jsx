import { useState } from "react";
import { HumeProvider, useEVI } from "@humeai/voice-react";
import { getHumeAccessToken } from "./humeAuth";

function EviDemo() {
  const { connect, disconnect, isConnected, isRecording, startRecording, stopRecording, messages } = useEVI();
  const [status, setStatus] = useState("Ready");

  async function handleConnect() {
    try {
      setStatus("Getting token…");
      const token = await getHumeAccessToken();

      setStatus("Connecting…");
      const configId = import.meta.env.VITE_HUME_CONFIG_ID || undefined;

      // Hand the short-lived token directly to connect()
      await connect({ accessToken: token, configId });

      setStatus("Connected");
    } catch (e) {
      setStatus("Connect error: " + e.message);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, lineHeight: 1.5 }}>
      <h1>Hume + Netlify Starter</h1>
      <p>Status: {status}</p>

      {!isConnected ? (
        <button onClick={handleConnect} style={{ padding: "8px 12px", marginRight: 8 }}>
          Connect to Hume
        </button>
      ) : (
        <button onClick={disconnect} style={{ padding: "8px 12px", marginRight: 8 }}>
          Disconnect
        </button>
      )}

      {isConnected ? (
        isRecording ? (
          <button onClick={stopRecording} style={{ padding: "8px 12px" }}>Stop talking</button>
        ) : (
          <button onClick={startRecording} style={{ padding: "8px 12px" }}>Hold to talk</button>
        )
      ) : null}

      <div style={{ marginTop: 16 }}>
        <strong>Messages</strong>
        <ul>
          {messages.slice(-8).map((m, i) => (
            <li key={i}>
              {m.role}: {m.content?.map((c) => c.text).join(" ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HumeProvider>
      <EviDemo />
    </HumeProvider>
  );
}
