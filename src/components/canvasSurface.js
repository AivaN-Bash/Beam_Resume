export function setupCanvasSurface(canvas, context, width, height) {
  const renderScale = Math.min(1.5, Math.max(1, (window.devicePixelRatio || 1) * 0.75));
  canvas.width = Math.round(width * renderScale);
  canvas.height = Math.round(height * renderScale);
  context.scale(renderScale, renderScale);

  return () => context.clearRect(0, 0, width, height);
}
