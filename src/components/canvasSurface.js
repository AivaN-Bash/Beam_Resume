export function setupCanvasSurface(canvas, context, width, height) {
  const renderScale = Math.min(0.75, Math.max(0.5, (window.devicePixelRatio || 1) / 4));
  canvas.width = Math.round(width * renderScale);
  canvas.height = Math.round(height * renderScale);
  context.scale(renderScale, renderScale);

  return () => context.clearRect(0, 0, width, height);
}
