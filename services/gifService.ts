import { GIF_WIDTH, GIF_HEIGHT, GIF_FPS, PRE_TEXT_SECONDS, TEXT_ANIMATION_SECONDS, POST_TEXT_SECONDS } from '../constants';
import { GifRequest } from '../types';

declare var GIF: any;

export function createGif(imageBase64: string, options: GifRequest): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let workerUrl: string | null = null;
    const cleanup = () => {
      if (workerUrl) {
        URL.revokeObjectURL(workerUrl);
        workerUrl = null;
      }
    };

    try {
      const workerResponse = await fetch('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js');
      if (!workerResponse.ok) throw new Error(`Failed to fetch gif.worker.js: ${workerResponse.statusText}`);
      const workerScriptContent = await workerResponse.text();
      const workerBlob = new Blob([workerScriptContent], { type: 'application/javascript' });
      workerUrl = URL.createObjectURL(workerBlob);

      const gif = new GIF({
        workers: 4,
        quality: 10,
        width: GIF_WIDTH,
        height: GIF_HEIGHT,
        workerScript: workerUrl,
      });

      const canvas = document.createElement('canvas');
      canvas.width = GIF_WIDTH;
      canvas.height = GIF_HEIGHT;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        cleanup();
        return reject(new Error('Could not get canvas context'));
      }

      const image = new Image();
      image.src = `data:image/jpeg;base64,${imageBase64}`;

      image.onload = () => {
        // Animation parameters
        const frameDelay = 1000 / GIF_FPS;
        const preTextFrames = PRE_TEXT_SECONDS * GIF_FPS;
        const textAnimationFrames = TEXT_ANIMATION_SECONDS * GIF_FPS;
        const postTextFrames = POST_TEXT_SECONDS * GIF_FPS;
        const totalFrames = preTextFrames + textAnimationFrames + postTextFrames;

        // --- Main rendering loop ---
        for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
          ctx.clearRect(0, 0, GIF_WIDTH, GIF_HEIGHT);

          // 1. Draw Background
          drawBackground(ctx, image, frameIndex, totalFrames, options);

          // 2. Draw Text (if applicable)
          const isTextVisible = frameIndex >= preTextFrames;
          if (isTextVisible) {
            const animationProgress = Math.min(1, (frameIndex - preTextFrames) / textAnimationFrames);
            drawText(ctx, animationProgress, options);
          }

          // 3. Draw Border
          drawBorder(ctx, frameIndex, totalFrames, options);
          
          gif.addFrame(ctx, { copy: true, delay: frameDelay });
        }

        gif.on('finished', (blob: Blob) => {
          cleanup();
          resolve(URL.createObjectURL(blob));
        });
        gif.on('abort', () => {
          cleanup();
          reject(new Error('GIF rendering was aborted.'));
        });
        gif.render();
      };

      image.onerror = (err) => {
        cleanup();
        reject(new Error('Failed to load the generated image.'));
        console.error(err);
      };
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}

// --- Drawing Helper Functions ---

function drawBackground(ctx: CanvasRenderingContext2D, image: HTMLImageElement, frame: number, totalFrames: number, options: GifRequest) {
  if (options.backgroundEffect === 'ken-burns') {
    const zoomFactor = 1.1;
    const progress = frame / (totalFrames - 1);
    const scale = 1 + (zoomFactor - 1) * progress;
    
    const newWidth = image.width / scale;
    const newHeight = image.height / scale;
    const sx = (image.width - newWidth) / 2;
    const sy = (image.height - newHeight) / 2;

    ctx.drawImage(image, sx, sy, newWidth, newHeight, 0, 0, GIF_WIDTH, GIF_HEIGHT);
  } else {
    ctx.drawImage(image, 0, 0, GIF_WIDTH, GIF_HEIGHT);
  }
}

function drawBorder(ctx: CanvasRenderingContext2D, frame: number, totalFrames: number, options: GifRequest) {
  if (options.borderEffect === 'none') return;

  const borderWidth = 20;
  ctx.lineWidth = borderWidth;
  
  switch (options.borderEffect) {
    case 'neon':
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 + 0.3 * Math.sin(frame * 0.5)})`;
      ctx.shadowColor = 'rgba(192, 132, 252, 1)';
      ctx.shadowBlur = 30;
      break;
    case 'rainbow':
      const hue = (frame * 360 / totalFrames) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
      ctx.shadowBlur = 20;
      break;
    case 'strobe':
      if (frame % 4 < 2) return; // Blink effect
      ctx.setLineDash([50, 25]);
      ctx.strokeStyle = 'white';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 15;
      break;
  }
  
  ctx.strokeRect(borderWidth / 2, borderWidth / 2, GIF_WIDTH - borderWidth, GIF_HEIGHT - borderWidth);
  
  // Reset shadows and line dash for other elements
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.setLineDash([]);
}

function drawText(ctx: CanvasRenderingContext2D, progress: number, options: GifRequest) {
  ctx.save();
  
  // --- Base Text Styling ---
  let fontSize;
  switch (options.textSize) {
    case 'large': fontSize = GIF_WIDTH / 10; break;
    case 'extra-large': fontSize = GIF_WIDTH / 8; break;
    default: fontSize = GIF_WIDTH / 12;
  }
  
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;

  // --- Apply Animation ---
  switch (options.textAnimation) {
    case 'zoom-in':
      const scale = 0.8 + 0.2 * progress;
      ctx.font = `bold ${fontSize * scale}px ${options.font}`;
      ctx.globalAlpha = progress;
      break;
    case 'fade-in':
      ctx.font = `bold ${fontSize}px ${options.font}`;
      ctx.globalAlpha = progress;
      break;
    case 'slide-in':
      ctx.font = `bold ${fontSize}px ${options.font}`;
      // Slide-in position is handled inside layout logic
      break;
    default:
       ctx.font = `bold ${fontSize}px ${options.font}`;
  }

  // --- Text Wrapping ---
  const words = options.overlayText.split(' ');
  let line = '';
  const lines: string[] = [];
  const maxWidth = GIF_WIDTH * 0.9;
  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  const lineHeight = fontSize * 1.2;

  // --- Apply Layout ---
  ctx.textAlign = 'center';

  let startY;
  switch (options.layout) {
    case 'top':
      startY = GIF_HEIGHT * 0.2 - (lineHeight * (lines.length - 1)) / 2;
      break;
    case 'bottom':
      startY = GIF_HEIGHT * 0.8 - (lineHeight * (lines.length - 1)) / 2;
      break;
    case 'diagonal':
       ctx.textAlign = 'center';
       ctx.translate(GIF_WIDTH / 2, GIF_HEIGHT / 2);
       ctx.rotate(-0.2); // ~11.5 degrees
       startY = -(lineHeight * (lines.length - 1)) / 2;
       break;
    case 'corner':
       ctx.textAlign = 'left';
       startY = GIF_HEIGHT - (lineHeight * lines.length) - (GIF_HEIGHT * 0.05);
       break;
    case 'center':
    default:
      startY = GIF_HEIGHT / 2 - (lineHeight * (lines.length - 1)) / 2;
      break;
  }

  // Apply slide-in animation if selected
  if (options.textAnimation === 'slide-in') {
    const slideOffset = 50 * (1 - progress);
    startY += slideOffset;
  }
  
  // --- Render Lines ---
  lines.forEach((l, i) => {
    let x = GIF_WIDTH / 2;
    if(options.layout === 'corner') {
        x = GIF_WIDTH * 0.05;
    } else if (options.layout === 'diagonal') {
        x = 0;
    }
    ctx.fillText(l, x, startY + i * lineHeight);
  });

  ctx.restore();
}
