let neuralCtx;
const neuralNodes = Array.from({ length: 24 }).map((_, index) => ({
  x: Math.random() * 320,
  y: Math.random() * 220,
  vx: (Math.random() - 0.5) * 0.6,
  vy: (Math.random() - 0.5) * 0.6,
  radius: 3 + Math.random() * 2,
  layer: index % 4
}));

export function initNeural() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  neuralCtx = canvas.getContext('2d');
  requestAnimationFrame(renderNeural);
}

function renderNeural() {
  if (!neuralCtx) return;
  const canvas = neuralCtx.canvas;
  neuralCtx.clearRect(0, 0, canvas.width, canvas.height);
  neuralCtx.fillStyle = '#0a1626';
  neuralCtx.fillRect(0, 0, canvas.width, canvas.height);

  neuralCtx.strokeStyle = 'rgba(51, 255, 215, 0.25)';
  neuralCtx.lineWidth = 1;
  for (let i = 0; i < neuralNodes.length; i++) {
    for (let j = i + 1; j < neuralNodes.length; j++) {
      const a = neuralNodes[i];
      const b = neuralNodes[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 120) {
        neuralCtx.globalAlpha = 1 - dist / 140;
        neuralCtx.beginPath();
        neuralCtx.moveTo(a.x, a.y);
        neuralCtx.lineTo(b.x, b.y);
        neuralCtx.stroke();
      }
    }
  }
  neuralCtx.globalAlpha = 1;

  neuralNodes.forEach(node => {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 10 || node.x > canvas.width - 10) node.vx *= -1;
    if (node.y < 10 || node.y > canvas.height - 10) node.vy *= -1;
    const gradient = neuralCtx.createRadialGradient(node.x, node.y, 1, node.x, node.y, node.radius * 2);
    gradient.addColorStop(0, '#33ffd7');
    gradient.addColorStop(1, 'rgba(51, 255, 215, 0)');
    neuralCtx.fillStyle = gradient;
    neuralCtx.beginPath();
    neuralCtx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
    neuralCtx.fill();
  });

  requestAnimationFrame(renderNeural);
}
