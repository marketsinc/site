export default function NotFound() {
  return (
    <main className="flex h-screen items-center justify-center p-10">
      <div className="text-center" style={{ maxWidth: 500 }}>
        <h1 className="title">Page not found</h1>
        <p>
          Go <a href="/" className="link">home</a>.
        </p>
      </div>
    </main>
  );
}
