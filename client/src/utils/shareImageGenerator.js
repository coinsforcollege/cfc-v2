export const generateShareImage = async (data) => {
  const {
    collegeName,
    collegeLogo,
    balance,
    isGeneral = false
  } = data;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const width = 1200;
  const height = 630;
  canvas.width = width;
  canvas.height = height;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const accentGradient = ctx.createRadialGradient(width * 0.8, height * 0.2, 0, width * 0.8, height * 0.2, width * 0.6);
  accentGradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
  accentGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
  ctx.fillStyle = accentGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 32px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Coins For College', width / 2, 80);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '500 24px system-ui, -apple-system, sans-serif';
  ctx.fillText('Join me and become an early miner for', width / 2, 130);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 64px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  const maxCollegeWidth = width - 160;
  const wrappedName = wrapText(ctx, collegeName || 'My College', maxCollegeWidth, 64);
  const collegeNameStartY = 240;
  wrappedName.forEach((line, index) => {
    ctx.fillText(line, width / 2, collegeNameStartY + (index * 75));
  });

  const balanceY = 460;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '500 18px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isGeneral ? 'Total Balance' : 'Current Balance', width / 2, balanceY);

  const balanceGradient = ctx.createLinearGradient(width / 2 - 200, balanceY + 20, width / 2 + 200, balanceY + 20);
  balanceGradient.addColorStop(0, '#8b5cf6');
  balanceGradient.addColorStop(1, '#ec4899');
  ctx.fillStyle = balanceGradient;
  ctx.font = '700 52px system-ui, -apple-system, sans-serif';
  ctx.fillText(`${balance.toFixed(2)} Tokens`, width / 2, balanceY + 50);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
};

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;

    if (src.startsWith('http://localhost') || src.startsWith('http://127.0.0.1')) {
      img.src = src;
    } else if (src.startsWith('/') || src.startsWith('http')) {
      img.src = src;
    } else {
      img.src = src;
    }
  });
};

const wrapText = (ctx, text, maxWidth, fontSize) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  if (lines.length > 2) {
    return [lines[0] + '...'];
  }

  return lines;
};
