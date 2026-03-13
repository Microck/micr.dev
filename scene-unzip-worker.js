importScripts("https://cdn.jsdelivr.net/npm/fflate/umd/index.js");

self.onmessage = ({ data }) => {
  const archiveBuffer = data?.archiveBuffer;

  if (!(archiveBuffer instanceof ArrayBuffer)) {
    self.postMessage({
      ok: false,
      error: "Scene archive worker received an invalid payload.",
    });
    return;
  }

  try {
    const files = self.fflate.unzipSync(new Uint8Array(archiveBuffer));
    const entry = files["scene.splinecode"];

    if (!entry) {
      throw new Error("scene.splinecode not found in scene.dat");
    }

    const sceneBuffer =
      entry.byteOffset === 0 && entry.byteLength === entry.buffer.byteLength
        ? entry.buffer
        : entry.slice().buffer;

    self.postMessage({ ok: true, sceneBuffer }, [sceneBuffer]);
  } catch (error) {
    self.postMessage({
      ok: false,
      error:
        error instanceof Error ? error.message : "Scene archive unzip failed.",
    });
  }
};
