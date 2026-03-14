import { createSignal, onCleanup, createEffect } from "solid-js";
import IconGamepad from "./IconGamepad";
import type { Activity } from "../types";

function nowToMMSS(ms: number) {
  const secs = Math.floor(ms / 1000);
  return `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;
}

export default function RichPresence(props: { activity: Activity | undefined }) {
  const [elapsed, setElapsed] = createSignal(0);

  createEffect(() => {
    const rawStart = props.activity?.timestamps?.start;

    if (!rawStart) {
      setElapsed(0);
      return;
    }

    const start = Number(rawStart);

    setElapsed(Math.max(0, Date.now() - start));

    const timer = setInterval(() => {
      setElapsed(Math.max(0, Date.now() - start));
    }, 1000);

    onCleanup(() => clearInterval(timer));
  });

  return (
    <div class="bg-[#F3EDF7] dark:bg-[#211F26] border border-[#79747E]/30 dark:border-[#49454F]/30 rounded-4xl py-5 px-6 flex items-center gap-6 w-full max-w-md shadow-lg font-gg select-none transition-colors duration-300">
      <img
        class="rounded-2xl w-18 h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 aspect-square shadow-md"
        src="https://cdn.discordapp.com/app-assets/1481083110971019396/1481088949593047070.png"
      />

      <div class="flex flex-col min-w-0 justify-center text-left">
        <span class="font-bold text-[#1D1B20] dark:text-[#E6E0E9] leading-tight mb-1.5 truncate transition-colors duration-300">
          Counter-Strike 2
        </span>
        <span class="text-[#49454F] dark:text-[#CAC4D0] text-sm font-medium leading-snug truncate transition-colors duration-300">
          {props.activity?.details || "waiting for client..."}
        </span>
        <span class="text-[#49454F] dark:text-[#CAC4D0] text-sm font-medium leading-snug truncate transition-colors duration-300">
          {props.activity?.state || ""}
        </span>

        <span class="text-[#6750A4] dark:text-[#D0BCFF] text-sm font-bold leading-snug truncate mt-1.5 flex items-center gap-x-1.5 transition-colors duration-300">
          <IconGamepad />
          {props.activity?.timestamps?.start ? `${nowToMMSS(elapsed())} elapsed` : "00:00 elapsed"}
        </span>
      </div>
    </div>
  )
}