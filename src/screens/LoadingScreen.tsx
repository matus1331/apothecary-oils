export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-bg">
      <svg width="72" height="96" viewBox="0 0 72 96" fill="none" aria-hidden>
        <circle cx="36" cy="20" r="4" className="animate-drip fill-accent" />
        <path
          d="M26 30h20v8l6 8v34a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V46l6-8v-8Z"
          stroke="currentColor"
          className="text-line"
          strokeWidth="2"
        />
        <path d="M22 66h28v16a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V66Z" className="fill-accent/20" />
      </svg>
      <p className="font-serif text-sm text-muted">Připravuji tvou sbírku…</p>
    </div>
  )
}
