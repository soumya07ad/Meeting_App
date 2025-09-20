'use client';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <pre style={{ whiteSpace: 'pre-wrap', color: 'red' }}>{String(error.message)}</pre>
      <details style={{ whiteSpace: 'pre-wrap' }}>
        {String(error.stack)}
      </details>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}