import React, { useState, useCallback } from 'react';
import { GifRequest } from './types';
import { translateAndEnhancePrompt, generateImage } from './services/geminiService';
import { createGif } from './services/gifService';
import GifForm from './components/GifForm';
import GifPreview from './components/GifPreview';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateGif = useCallback(async (request: GifRequest) => {
    setIsLoading(true);
    setError(null);
    setGifUrl(null);

    try {
      setLoadingStep('1/4: 아이디어 번역 및 프롬프트 최적화 중...');
      const enhancedPrompt = await translateAndEnhancePrompt(request.imageIdea);

      setLoadingStep('2/4: AI 이미지 생성 중...');
      const imageBase64 = await generateImage(enhancedPrompt);

      setLoadingStep('3/4: GIF 파일 생성 및 렌더링 중...');
      const generatedGifUrl = await createGif(imageBase64, request);
      setGifUrl(generatedGifUrl);

      setLoadingStep('4/4: 완성!');
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`GIF 생성 중 오류가 발생했습니다: ${message}`);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SparklesIcon className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              N-GIF 생성기 v1.2
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            시선을 사로잡는 마케팅 GIF를 AI로 손쉽게 만들어보세요.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <GifForm onSubmit={handleGenerateGif} isLoading={isLoading} />
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center justify-center aspect-square border border-gray-700">
            <GifPreview gifUrl={gifUrl} isLoading={isLoading} error={error} loadingStep={loadingStep} />
          </div>
        </main>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>&copy; 2025 N-GIF. All rights reserved.</p>
          <p>AI-Powered GIF Generation for Small Business Owners.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
