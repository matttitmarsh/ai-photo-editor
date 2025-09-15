import React from 'react';

interface ImageDisplayProps {
  originalImage: File | null;
  editedImage: string | null;
  isLoading: boolean;
  onUseAsOriginal: () => void;
}

const ImageCard: React.FC<{ 
    title: string; 
    src: string | null; 
    isLoading?: boolean;
    children?: React.ReactNode;
    actions?: React.ReactNode;
}> = ({ title, src, isLoading = false, children, actions }) => (
    <div className="bg-slate-800 rounded-xl flex flex-col overflow-hidden border border-slate-700 shadow-lg">
      <h3 className="text-lg font-semibold text-center py-3 bg-slate-700/50 text-slate-300">{title}</h3>
      <div className="aspect-square flex-grow flex items-center justify-center p-2 relative">
        {isLoading && (
             <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center z-10" aria-label="Loading image">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-300">Editing in progress...</p>
             </div>
        )}
        {src ? (
          <img src={src} alt={title} className="max-w-full max-h-full object-contain rounded-md" />
        ) : (
            <div className="text-slate-500 text-center p-4">
                {children}
            </div>
        )}
      </div>
      {actions && <div className="border-t border-slate-700 p-3 bg-slate-800">{actions}</div>}
    </div>
);


export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  originalImage,
  editedImage,
  isLoading,
  onUseAsOriginal
}) => {
  const originalImageUrl = originalImage ? URL.createObjectURL(originalImage) : null;

  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const editedImageActions = editedImage && !isLoading ? (
    <div className="flex gap-3 justify-center">
        <button 
            onClick={handleDownload}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm inline-flex items-center justify-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download
        </button>
        <button 
            onClick={onUseAsOriginal}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm inline-flex items-center justify-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
            Use as Original
        </button>
    </div>
  ) : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <ImageCard title="Original" src={originalImageUrl}>
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
         </svg>
         Your original image will appear here.
      </ImageCard>
      <ImageCard title="Edited" src={editedImage} isLoading={isLoading} actions={editedImageActions}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Your edited image will appear here.
      </ImageCard>
    </div>
  );
};