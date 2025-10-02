import { useMemo, useState } from "react";
import * as Hume from "@humeai/voice-react";
import { getHumeAccessToken } from "./humeAuth";

/**
 * Resolve provider/hook names across different @humeai/voice-react versions.
 */
function useHumeBindings() {
  // pick whichever provider exists in this build of the library
  const Provider =
    Hume.VoiceProvider ||
    Hume.HumeProvider ||
    Hume.Provider ||
    Hume.EVIProvider;

  // pick whichever hook exists
  const useVoice =
    Hume.useVoice ||
    Hume.useEVI ||
    Hume.useHume ||
    Hume.useHumeClient;

  return useMemo(() => ({ Provider, useVoice }), [Provider, useVoice]);
}

function VoiceDemo({ useVoice }) {
  const {
    connect,
    disconnect,
    isConnected = false,
    isRecording = false,
    startRecording = () => {},
    stopRecording = () => {},
    messages = [],
  } = (useVoice ? useVoice() : {});

  const [status, setStatus] = useState("Ready");

  async function handleConnect() {
    try {
      if (!connect) throw new Error("Voice connect() not available");
      setStatus("Getting token…");
      const token = await getHumeAccessToken();

      setStatus("Connecting…");
      const configId = import.meta.env.VITE_HUME_CONFIG_ID || undefined;

      await connect({ accessToken: token, configId });
      setStatus("Connected");
    } catch (e) {
      setStatus("Connect error: " + (e?.message || String(e)));
    }
  }

  if (!useVoice) {
    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <h1>Hume + Netlify Starter</h1>
        <p style={{ color: "crimson" }}>
          Couldn’t find a voice hook in <code>@humeai/voice-react</code>. Try upgrading the package.
        </p>
      </div>
    );
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
          <button onClick={startR
