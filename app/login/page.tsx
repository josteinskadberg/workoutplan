type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form method="post" action="/api/login" className="w-full max-w-sm space-y-4">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Workout plan</h1>
          <p className="text-muted text-sm">Enter the password to continue.</p>
        </header>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="numeric-input text-left"
          placeholder="Password"
        />
        <input type="hidden" name="next" value={next ?? "/"} />
        <button className="btn-primary w-full" type="submit">
          Sign in
        </button>
        {error ? (
          <p className="text-danger text-sm text-center">Wrong password.</p>
        ) : null}
      </form>
    </main>
  );
}
