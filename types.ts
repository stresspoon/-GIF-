export interface FontOption {
  name: string;
  family: string;
}

export type Layout = 'center' | 'top' | 'bottom' | 'diagonal' | 'corner';
export type TextSize = 'normal' | 'large' | 'extra-large';
export type TextAnimation = 'none' | 'zoom-in' | 'fade-in' | 'slide-in';
export type BackgroundEffect = 'none' | 'ken-burns';
export type BorderEffect = 'none' | 'neon' | 'rainbow' | 'strobe';

export interface GifRequest {
  imageIdea: string;
  overlayText: string;
  font: string;
  layout: Layout;
  textSize: TextSize;
  textAnimation: TextAnimation;
  backgroundEffect: BackgroundEffect;
  borderEffect: BorderEffect;
}

export interface Option<T> {
  value: T;
  label: string;
}
