import { createSignal, onCleanup, onMount } from "solid-js";
import RichPresence from "./components/RichPresence";
import { decodeCbor } from '@std/cbor';
import type { Activity } from "./types";
import Indicator from "./components/Indicator";
import Preferences from "./components/Preferences";

export default function App() {
  const [ws, setWS] = createSignal<WebSocket>();
  const [open, setOpen] = createSignal<boolean>(false);
  const [activity, setActivity] = createSignal<Activity>();

  const [blink, setBlink] = createSignal<boolean>(false);
  let blinkTimer: number;

  const handleMessage = (buf: ArrayBuffer) => {
    setBlink(true);
    clearTimeout(blinkTimer);
    blinkTimer = setTimeout(() => setBlink(false), 500);

    const data = new Uint8Array(buf);
    const pong = [0xe2, 0x99, 0xa5];

    if (data.length === 3 && data.every((v, i) => v === pong[i])) return;

    try {
      const decoded = decodeCbor(data) as unknown as Activity;
      setActivity(decoded);
    } catch (e) {
      console.error("failed to decode cbor", e);
    }
  }

  const connect = () => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.binaryType = "arraybuffer";
    ws.addEventListener('open', () => setOpen(true));
    ws.addEventListener('close', () => setOpen(false));
    ws.addEventListener('message', (ev) => handleMessage(ev.data));

    setWS(ws);
  };

  onMount(() => {
    connect();

    const heartbeat = setInterval(() => {
      const s = ws();
      if (s?.readyState == WebSocket.OPEN) s.send(new Uint8Array([0xe2, 0x99, 0xa1]));
    }, 2000);

    const reconnect = setInterval(() => {
      const s = ws();
      if (s && s.readyState !== s.CLOSED) return;
      connect();
    }, 2000);

    onCleanup(() => {
      ws()?.close();
      clearInterval(heartbeat);
      clearInterval(reconnect);
      clearTimeout(blinkTimer);
    });
  })

  return (
    <div class="p-16 bg-[#FEF7FF] dark:bg-[#141218] min-h-screen min-w-screen text-[#1D1B20] dark:text-[#E6E0E9] grid grid-cols-2 items-center gap-x-16 justify-center selection:bg-[#EADDFF] dark:selection:bg-[#4F378B]/50 transition-colors duration-300">
      <div class="flex flex-col justify-center items-center gap-y-8">
        <RichPresence activity={activity()} />
        <Indicator open={open()} blink={blink()} />
      </div>

      <div class="flex flex-col justify-center gap-y-8">
        <Preferences socket={ws()} />
      </div>
    </div>
  );
}