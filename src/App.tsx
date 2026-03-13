import { createSignal } from "solid-js";
import RichPresence from "./RichPresence";
import { makeHeartbeatWS, makeReconnectingWS } from '@solid-primitives/websocket';
import { decodeCbor } from '@std/cbor';
import type { Activity } from "./types";

export default function App() {
  const ws = makeHeartbeatWS(makeReconnectingWS(`ws://localhost:8000/ws`), {
    interval: 2000,
    message: new Uint8Array([0xe2, 0x99, 0xa1])
  });
  const [activity, setActivity] = createSignal<Activity>();
  ws.addEventListener('message', (m) => {
    const data = new Uint8Array(m.data);
    if (data.length === 3 && data.every((v, i) => v === [0xe2, 0x99, 0xa5][i])) return;
    setActivity(decodeCbor(data) as unknown as Activity);
  })

  return (
    <div class="text-black grid grid-cols-2 items-center gap-x-16 justify-center h-full">
      <div>
        <RichPresence activity={activity()} />
        <p class="text-center my-4 text-neutral-200">{ws.readyState === ws.OPEN ? "connected" : "not connected to server"}</p>
      </div>
      <div class="bg-neutral-900 rounded-2xl p-4 shadow-md">
      </div>
    </div>
  );
}
