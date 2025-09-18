
import React from 'react';
import DownloadIcon from './icons/DownloadIcon';

interface GifPreviewProps {
  gifUrl: string | null;
  isLoading: boolean;
  error: string | null;
  loadingStep: string;
}

const LoadingSpinner: React.FC = () => (
  <div className="w-16 h-16 border-4 border-t-purple-500 border-r-purple-500 border-b-purple-500 border-l-gray-700 rounded-full animate-spin"></div>
);

const GifPreview: React.FC<GifPreviewProps> = ({ gifUrl, isLoading, error, loadingStep }) => {
  if (isLoading) {
    return (
      <div className="text-center flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-lg font-semibold text-gray-300">GIF를 만들고 있어요...</p>
        <p className="text-sm text-gray-400">{loadingStep}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-2">오류 발생</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (gifUrl) {
    return (
      <div className="w-full text-center">
        <img src={gifUrl} alt="Generated GIF" className="w-full h-auto object-contain rounded-lg shadow-2xl mb-4 border-2 border-purple-500" />
        <a
          href={gifUrl}
          download="result.gif"
          className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          다운로드
        </a>
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500">
      <div className="w-24 h-24 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="font-semibold">GIF 미리보기</p>
      <p className="text-sm">왼쪽 양식을 채우고 생성 버튼을 누르세요.</p>
    </div>
  );
};

export default GifPreview;
