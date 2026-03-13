import IconGamepad from "./icons/IconGamepad";
import type { Activity } from "./types";

function nowToMMSS(ms: number) {
  const secs = Math.floor(ms / 1000);

  return `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;
}

export default function RichPresence(props: { activity: Activity | undefined }) {
  return (
    <div class="bg-neutral-900 rounded-2xl py-4 px-6 flex items-center gap-6 w-full shadow-md font-gg">
      <img class="rounded-lg w-18 h-18 md:w-20 md:h-20 lg:w-28 lg:h-28 aspect-square" src="https://cdn.discordapp.com/app-assets/1481083110971019396/1481088949593047070.png" />
      <div class="flex flex-col min-w-0 justify-center text-left">
        <span class="font-semibold text-neutral-200 leading-tight mb-1 truncate">Counter-Strike 2</span>
        <span class="text-neutral-400 text-sm leading-snug truncate">{props.activity?.details || "Unknown"}</span>
        <span class="text-neutral-400 text-sm leading-snug truncate">{props.activity?.state || "Unknown"}</span>
        <span class="text-emerald-400 text-sm leading-snug truncate mt-1 flex items-center gap-x-1"><IconGamepad /> {nowToMMSS(props.activity?.timestamps.start || 0)}</span>
      </div>
    </div>
  )
}