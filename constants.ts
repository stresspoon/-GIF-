import { FontOption, Layout, TextSize, TextAnimation, BackgroundEffect, BorderEffect, Option } from './types';

export const IMAGE_STYLE_KEYWORDS: string[] = [
  'professional photography',
  'photorealistic',
  'cinematic lighting',
  '4k',
  'high detail',
  'close-up shot',
  'soft light',
  'vibrant colors'
];

export const FONTS: FontOption[] = [
  { name: 'Noto Sans KR (기본)', family: "'Noto Sans KR', sans-serif" },
  { name: 'Black Han Sans (굵은)', family: "'Black Han Sans', sans-serif" },
  { name: 'Do Hyeon (강조)', family: "'Do Hyeon', sans-serif" },
  { name: 'Gowun Dodum (부드러운)', family: "'Gowun Dodum', sans-serif" },
];

// GIF Generation Parameters
export const GIF_WIDTH = 1080;
export const GIF_HEIGHT = 1080;
export const GIF_FPS = 20;
export const PRE_TEXT_SECONDS = 1.0;
export const TEXT_ANIMATION_SECONDS = 0.5;
export const POST_TEXT_SECONDS = 2.0;

// New v1.2 Options
export const LAYOUT_OPTIONS: Option<Layout>[] = [
    { value: 'center', label: '중앙' },
    { value: 'top', label: '상단 강조' },
    { value: 'bottom', label: '하단 집중' },
    { value: 'diagonal', label: '대각선 역동' },
    { value: 'corner', label: '모서리 포인트' },
];

export const TEXT_SIZE_OPTIONS: Option<TextSize>[] = [
    { value: 'normal', label: '보통' },
    { value: 'large', label: '크게' },
    { value: 'extra-large', label: '아주 크게' },
];

export const TEXT_ANIMATION_OPTIONS: Option<TextAnimation>[] = [
    { value: 'zoom-in', label: 'Zoom-in' },
    { value: 'fade-in', label: 'Fade-in' },
    { value: 'slide-in', label: 'Slide-in' },
];

export const BACKGROUND_EFFECT_OPTIONS: Option<BackgroundEffect>[] = [
    { value: 'none', label: '없음' },
    { value: 'ken-burns', label: '미세 줌 효과' },
];

export const BORDER_EFFECT_OPTIONS: Option<BorderEffect>[] = [
    { value: 'none', label: '없음' },
    { value: 'neon', label: '반짝이는 네온' },
    { value: 'rainbow', label: '무지개 그라데이션' },
    { value: 'strobe', label: '점선 스트로브' },
];
