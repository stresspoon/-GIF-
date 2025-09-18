import React, { useState } from 'react';
import { GifRequest, Layout, TextSize, TextAnimation, BackgroundEffect, BorderEffect } from '../types';
import { FONTS, LAYOUT_OPTIONS, TEXT_SIZE_OPTIONS, TEXT_ANIMATION_OPTIONS, BACKGROUND_EFFECT_OPTIONS, BORDER_EFFECT_OPTIONS } from '../constants';

interface GifFormProps {
  onSubmit: (request: GifRequest) => void;
  isLoading: boolean;
}

const RadioButtonGroup = <T extends string>({ label, options, selected, onChange }: { label: string, options: { value: T, label: string }[], selected: T, onChange: (value: T) => void }) => (
  <div>
    <label className="block text-sm font-bold text-gray-300 mb-2">{label}</label>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${selected === option.value ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-400' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);


const GifForm: React.FC<GifFormProps> = ({ onSubmit, isLoading }) => {
  const [imageIdea, setImageIdea] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [font, setFont] = useState(FONTS[0].family);
  const [layout, setLayout] = useState<Layout>('center');
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [textAnimation, setTextAnimation] = useState<TextAnimation>('zoom-in');
  const [backgroundEffect, setBackgroundEffect] = useState<BackgroundEffect>('none');
  const [borderEffect, setBorderEffect] = useState<BorderEffect>('none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageIdea.trim() && overlayText.trim()) {
      onSubmit({ imageIdea, overlayText, font, layout, textSize, textAnimation, backgroundEffect, borderEffect });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="space-y-4 border-b border-gray-700 pb-6">
        <legend className="text-lg font-semibold text-white mb-2">1. 기본 정보</legend>
        <div>
          <label htmlFor="image-idea" className="block text-sm font-bold text-gray-300 mb-2">
            이미지 아이디어 (한글)
          </label>
          <input
            id="image-idea"
            type="text"
            value={imageIdea}
            onChange={(e) => setImageIdea(e.target.value)}
            placeholder="예: 육즙이 가득한 스테이크"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="overlay-text" className="block text-sm font-bold text-gray-300 mb-2">
            홍보 문구
          </label>
          <input
            id="overlay-text"
            type="text"
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
            placeholder="예: 이번 주 특선 메뉴!"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="font-select" className="block text-sm font-bold text-gray-300 mb-2">
            폰트
          </label>
          <select
            id="font-select"
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            {FONTS.map((fontOption) => (
              <option key={fontOption.name} value={fontOption.family}>
                {fontOption.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-b border-gray-700 pb-6">
        <legend className="text-lg font-semibold text-white mb-2">2. 텍스트 스타일</legend>
        {/* FIX: Explicitly provide generic type argument <Layout> to fix type inference issue. */}
        <RadioButtonGroup<Layout> label="레이아웃" options={LAYOUT_OPTIONS} selected={layout} onChange={setLayout} />
        {/* FIX: Explicitly provide generic type argument <TextSize> to fix type inference issue. */}
        <RadioButtonGroup<TextSize> label="텍스트 크기" options={TEXT_SIZE_OPTIONS} selected={textSize} onChange={setTextSize} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-white mb-2">3. 애니메이션 & 효과</legend>
        {/* FIX: Explicitly provide generic type argument <TextAnimation> to fix type inference issue. */}
        <RadioButtonGroup<TextAnimation> label="텍스트 등장 효과" options={TEXT_ANIMATION_OPTIONS} selected={textAnimation} onChange={setTextAnimation} />
        {/* FIX: Explicitly provide generic type argument <BackgroundEffect> to fix type inference issue. */}
        <RadioButtonGroup<BackgroundEffect> label="배경 효과" options={BACKGROUND_EFFECT_OPTIONS} selected={backgroundEffect} onChange={setBackgroundEffect} />
        {/* FIX: Explicitly provide generic type argument <BorderEffect> to fix type inference issue. */}
        <RadioButtonGroup<BorderEffect> label="테두리 효과" options={BORDER_EFFECT_OPTIONS} selected={borderEffect} onChange={setBorderEffect} />
      </fieldset>

      <button
        type="submit"
        disabled={isLoading || !imageIdea.trim() || !overlayText.trim()}
        className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            생성 중...
          </>
        ) : (
          'GIF 생성하기'
        )}
      </button>
    </form>
  );
};

export default GifForm;