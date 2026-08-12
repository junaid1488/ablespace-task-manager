export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-sm font-bold">A</div>
          <span className="text-lg font-semibold">AbleSpace</span>
        </div>
        <div>
          <p className="text-2xl font-semibold leading-snug">
            Organize your work.
            <br />
            Ship with clarity.
          </p>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/80">
            A focused task manager built for teams who care about the details.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">© 2026 AbleSpace</p>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">{children}</div>
    </div>
  );
}
