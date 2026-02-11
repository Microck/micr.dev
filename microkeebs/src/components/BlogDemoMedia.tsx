import { useState } from 'react';

export function BlogDemoMedia() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border p-6">
        <div className="text-center">
          <p className="text-sm font-medium">Missing demo video</p>
          <p className="mt-1 text-sm opacity-70">
            Add <code className="rounded border px-1.5 py-0.5">public/blog-demo.mp4</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      src="/blog-demo.mp4"
      className="w-full rounded-xl border"
      onError={() => setFailed(true)}
    />
  );
}
