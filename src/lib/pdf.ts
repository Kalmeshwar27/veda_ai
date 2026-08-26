export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")}MB`;
}

export async function getPdfPageCount(file: File): Promise<number | null> {
  if (file.type !== "application/pdf") {
    return null;
  }

  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const document = await loadingTask.promise;
  return document.numPages;
}