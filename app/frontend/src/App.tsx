import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import { sendChatMessage } from "./api/chat";
import { fetchVoices, requestSpeech, transcribeRecording, Voice } from "./api/speech";
import { AmbientHud } from "./components/AmbientHud";
import { ComponentState, SystemStatus } from "./components/SystemStatus";
import { BriefingPanel } from "./components/BriefingPanel";
import { waitForBackend } from "./api/system";
import { isWebActionRequest, planWebAction, WebAction } from "./webActions";
import cyberpunkBackground from "../../../refrences/cyberpunk_background_new.jpg";

type Message = { author: "user" | "jarvis"; text: string };
type Status = "idle" | "listening" | "thinking" | "speaking" | "error";

export function App() {
  const sessionId = useRef(crypto.randomUUID());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const recordingStartedAtRef = useRef(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voiceId, setVoiceId] = useState("en-US-GuyNeural");
  const [level, setLevel] = useState(0);
  const [backendState, setBackendState] = useState<ComponentState>("unknown");
  const [backendStarting, setBackendStarting] = useState(true);
  const [microphoneState, setMicrophoneState] = useState<ComponentState>("unknown");
  const [sttState, setSttState] = useState<ComponentState>("unknown");
  const [ttsState, setTtsState] = useState<ComponentState>("unknown");
  const [chatState, setChatState] = useState<ComponentState>("unknown");
  const [networkState, setNetworkState] = useState<ComponentState>(() => navigator.onLine ? "ready" : "error");
  const [bluetoothState] = useState<ComponentState>(() => "bluetooth" in navigator ? "ready" : "unknown");
  const [pendingWebAction, setPendingWebAction] = useState<WebAction | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const healthy = await waitForBackend();
      if (cancelled) return;
      setBackendState(healthy ? "ready" : "error");
      setBackendStarting(false);
      if (!healthy) { setError("Jarvis backend did not start. Restart the app and try again."); return; }
      try {
        const items = await fetchVoices();
        if (cancelled) return;
        setVoices(items);
        if (!items.some((item) => item.id === voiceId)) setVoiceId(items[0]?.id ?? voiceId);
      } catch {
        if (!cancelled) setError("Voice options are unavailable. Text chat still works.");
      }
    })();
    return () => { cancelled = true; };
  }, []);
  useEffect(() => { const updateNetwork = () => setNetworkState(navigator.onLine ? "ready" : "error"); window.addEventListener("online", updateNetwork); window.addEventListener("offline", updateNetwork); return () => { window.removeEventListener("online", updateNetwork); window.removeEventListener("offline", updateNetwork); }; }, []);
  useEffect(() => () => { stopSpeech(); stopCapture(); }, []);

  function stopSpeech() {
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
  }

  function stopCapture() {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    setLevel(0);
  }

  async function playSpeech(text: string) {
    try {
      stopSpeech();
      const url = URL.createObjectURL(await requestSpeech(text, voiceId));
      const audio = new Audio(url);
      audioRef.current = audio;
      audioUrlRef.current = url;
      audio.onended = () => { if (audioUrlRef.current === url) URL.revokeObjectURL(url); setStatus("idle"); };
      await audio.play();
      setTtsState("ready");
      setStatus("speaking");
    } catch (reason) {
      setTtsState("error");
      setError(reason instanceof Error ? reason.message : "Speech generation is unavailable. The text reply is still available.");
      setStatus("idle");
    }
  }

  async function askJarvis(text: string) {
    stopSpeech();
    setError("");
    setMessages((current) => [...current, { author: "user", text }]);
    if (isWebActionRequest(text)) {
      setStatus("thinking");
      try {
        const webAction = await planWebAction(text);
        setPendingWebAction(webAction);
        setMessages((current) => [...current, { author: "jarvis", text: `I prepared this browser action: ${webAction.label}. Please confirm.` }]);
        setStatus("idle");
        return;
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Jarvis could not prepare that web action.");
      }
    }
    setStatus("thinking");
    try {
      const result = await sendChatMessage(sessionId.current, text);
      setChatState("ready");
      setMessages((current) => [...current, { author: "jarvis", text: result.reply }]);
      void playSpeech(result.reply);
    } catch (reason) {
      setChatState("error");
      setError(reason instanceof Error ? reason.message : "Jarvis could not process that message.");
      setStatus("error");
    }
  }

  function openConfirmedWebAction() {
    if (!pendingWebAction) return;
    // This runs inside the user's confirmation click, which browsers permit as
    // a new-tab navigation. The backend generates the URL from constrained plan data.
    window.open(pendingWebAction.url, "_blank", "noopener,noreferrer");
    setMessages((current) => [...current, { author: "jarvis", text: `Opening ${pendingWebAction.label} in a new tab.` }]);
    setPendingWebAction(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || status === "thinking" || backendStarting) return;
    setInput("");
    await askJarvis(text);
  }

  async function startListening() {
    if (status === "thinking" || backendStarting || recorderRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setError("This browser does not support microphone recording. Text chat remains available."); return; }
    try {
      setError("");
      stopSpeech();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      streamRef.current = stream;
      setMicrophoneState("ready");
      const context = new AudioContext();
      audioContextRef.current = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      context.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      const updateMeter = () => { analyser.getByteTimeDomainData(samples); const mean = samples.reduce((sum, sample) => sum + Math.abs(sample - 128), 0) / samples.length; setLevel(Math.min(1, mean / 26)); animationRef.current = requestAnimationFrame(updateMeter); };
      updateMeter();
      const chunks: BlobPart[] = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => { recorderRef.current = null; const duration = performance.now() - recordingStartedAtRef.current; stopCapture(); if (duration < 650) { setError("Recording was too short. Hold the button while speaking, then release."); setSttState("error"); setStatus("error"); return; } void (async () => { try { setStatus("thinking"); const transcript = await transcribeRecording(new Blob(chunks, { type: "audio/webm" })); if (!transcript) throw new Error("No speech was detected. Please try again."); setSttState("ready"); await askJarvis(transcript); } catch (reason) { setSttState("error"); setError(reason instanceof Error ? reason.message : "Jarvis could not transcribe that recording."); setStatus("error"); } })(); };
      recorder.start();
      recordingStartedAtRef.current = performance.now();
      setStatus("listening");
    } catch (reason) {
      stopCapture();
      setMicrophoneState("error");
      setError(reason instanceof Error && reason.name === "NotAllowedError" ? "Microphone permission was denied. Text chat remains available." : "Jarvis could not access the microphone.");
      setStatus("error");
    }
  }

  function finishListening() { if (recorderRef.current?.state === "recording") recorderRef.current.stop(); }
  const active = status === "listening" || status === "thinking" || status === "speaking";
  const stateLabel = backendStarting ? "STARTING LOCAL BACKEND" : status === "listening" ? "LISTENING / HOLD TO TALK" : status === "thinking" ? "PROCESSING REQUEST" : status === "speaking" ? "VOICE OUTPUT ACTIVE" : "SYSTEM ONLINE";
  const statusItems = [
    { label: "BACKEND", state: backendState, detail: backendState === "ready" ? "ONLINE" : undefined },
    { label: "NETWORK", state: networkState, detail: networkState === "ready" ? "ONLINE" : "OFFLINE" },
    { label: "TEXT ENGINE", state: chatState },
    { label: "BLUETOOTH", state: bluetoothState, detail: bluetoothState === "ready" ? "AVAILABLE" : undefined },
    { label: "MICROPHONE", state: microphoneState },
    { label: "SPEECH TO TEXT", state: sttState },
    { label: "TEXT TO SPEECH", state: ttsState },
  ];

  return <main className="app-shell" style={{ "--background-image": `url(${cyberpunkBackground})` } as CSSProperties}>
    <AmbientHud active={active} level={status === "listening" ? level : status === "speaking" ? .72 : .35} />
    <SystemStatus items={statusItems} />
    <BriefingPanel />
    <section className="chat-card" aria-label="Jarvis assistant">
      <p className="eyebrow">JARVIS / SECURE CHANNEL</p><h1>At your service.</h1><p className="connection-state">{stateLabel}</p>
      <div className="messages" aria-live="polite">{messages.length === 0 && <p>Type a message or hold to talk.</p>}{messages.map((message, index) => <p className={`message ${message.author}`} key={`${message.author}-${index}`}>{message.text}</p>)}{status === "thinking" && <p className="message jarvis">Thinking…</p>}{pendingWebAction && <div className="web-action-confirmation"><p>OPEN {pendingWebAction.label.toUpperCase()}?</p><small>{pendingWebAction.url}</small><div><button type="button" onClick={openConfirmedWebAction}>Open new tab</button><button type="button" onClick={() => setPendingWebAction(null)}>Cancel</button></div></div>}</div>
      <button className={`talk-button ${status === "listening" ? "is-listening" : ""}`} type="button" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); void startListening(); }} onPointerUp={finishListening} onPointerCancel={finishListening} disabled={status === "thinking" || backendStarting}>{status === "listening" ? "Release to send" : backendStarting ? "Starting Jarvis…" : "Hold to talk"}</button>
      <form onSubmit={handleSubmit} className="composer"><label className="sr-only" htmlFor="chat-input">Message Jarvis</label><input id="chat-input" value={input} maxLength={2000} onChange={(event) => setInput(event.target.value)} placeholder="Type a message…" disabled={status === "thinking" || backendStarting}/><button type="submit" disabled={!input.trim() || status === "thinking" || backendStarting}>Send</button></form>
      <label className="voice-picker" htmlFor="voice-select">Voice<select id="voice-select" value={voiceId} onChange={(event) => setVoiceId(event.target.value)} disabled={!voices.length}>{voices.map((voice) => <option key={voice.id} value={voice.id}>{voice.label}</option>)}</select></label>
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  </main>;
}
