export default function Indicator(props: { open: boolean, blink: boolean }) {
  return (
    <span
      class={`block w-16 h-4 rounded-full transition-all duration-500 ease-out shadow-lg
        ${props.open ? "bg-emerald-600 shadow-emerald-400/20 dark:bg-emerald-400 dark:shadow-emerld-200/20" : "bg-red-60 shadow-red-400/20 dark:bg-red-400 dark:shadow-red-200/20"}
        ${props.blink ? "brightness-150" : "brightness-100"}`}
    />
  )
}