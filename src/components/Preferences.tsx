import { createSignal } from "solid-js";
import { encodeCbor } from '@std/cbor';

export default function Preferences(props: { socket?: WebSocket }) {
  const [timeoutSecs, setTimeoutSecs] = createSignal(30);
  const [fluffy, setFluffy] = createSignal('sometimes');
  const [saved, setSaved] = createSignal(false);

  const handleSave = (e: Event) => {
    e.preventDefault();

    if (!props.socket) return;
    props.socket.send(new Uint8Array([0xe2, 0x9a, 0x99, ...encodeCbor({ timeout: timeoutSecs() * 1000, fluffy: fluffy() === "always", disableFluffy: fluffy() === "never" })]));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} class="bg-[#F3EDF7] dark:bg-[#211F26] border border-[#79747E]/30 dark:border-[#49454F]/30 rounded-4xl p-8 shadow-sm transition-colors duration-300">
      <h3 class="tracking-tight text-[#6750A4] dark:text-[#D0BCFF] text-2xl mb-6 transition-colors duration-300">
        preferences
      </h3>

      <div class="flex flex-col gap-1 mb-6">
        <label class="text-sm font-medium text-[#1D1B20] dark:text-[#E6E0E9] transition-colors duration-300">timeout duration</label>
        <span class="text-sm text-[#49454F] dark:text-[#CAC4D0] mb-2 transition-colors duration-300">how long to wait before clearing ur discord status when the game stops (in seconds)</span>
        
        <div class="relative group">
          <input
            type="number"
            value={timeoutSecs()}
            onInput={(e) => setTimeoutSecs(parseInt(e.currentTarget.value) || 0)}
            class="w-full bg-[#E7E0EC] dark:bg-[#36343B] hover:bg-[#E0D8E4] dark:hover:bg-[#4A4458] text-[#1D1B20] dark:text-[#E6E0E9] border-b-2 border-[#79747E] dark:border-[#938F99] focus:border-[#6750A4] dark:focus:border-[#D0BCFF] rounded-t-sm px-4 py-3.5 outline-none transition-colors duration-300"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[#49454F] dark:text-[#CAC4D0] pointer-events-none transition-colors duration-300">
            secs
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-1 mb-8">
        <label class="text-sm font-medium text-[#1D1B20] dark:text-[#E6E0E9] transition-colors duration-300">fluffy icon?</label>
        <span class="text-sm text-[#49454F] dark:text-[#CAC4D0] mb-2 transition-colors duration-300">shows an alternative icon :3</span>
        
        <div class="flex border border-[#79747E] dark:border-[#938F99] rounded-full overflow-hidden mt-1 transition-colors duration-300">
          {['always', 'sometimes', 'never'].map((opt, idx) => {
            return (
              <button
                type="button"
                onClick={() => setFluffy(opt)}
                class={`flex-1 cursor-pointer py-2.5 text-sm font-medium transition-colors duration-300 ${
                  idx !== 0 ? 'border-l border-[#79747E] dark:border-[#938F99]' : ''
                } ${
                  fluffy() === opt
                    ? 'bg-[#E8DEF8] dark:bg-[#4A4458] text-[#1D192B] dark:text-[#EADDFF]'
                    : 'bg-transparent text-[#49454F] dark:text-[#CAC4D0] hover:bg-[#E7E0EC] dark:hover:bg-[#36343B]'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <button 
        type="submit"
        class={`w-full px-8 py-3 cursor-pointer active:scale-[0.98] transition-all duration-300 rounded-full font-semibold shadow-sm select-none ${
          saved()
            ? 'bg-emerald-600 dark:bg-emerald-400 text-white dark:text-[#06391F]'
            : 'bg-[#6750A4] text-white hover:bg-[#7D5260] dark:bg-[#D0BCFF] dark:text-[#381E72] dark:hover:bg-[#EADDFF]'
        }`}
      >
        {saved() ? "saved!" : "save changes"}
      </button>
    </form>
  )
}