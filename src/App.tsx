import React from 'react';
import { Header } from './components/Header';
import { EditControls } from './components/EditControls';
import { ImageDisplay } from './components/ImageDisplay';
import { Footer } from './components/Footer';
import { useImageEditing } from './hooks/useImageEditing';

const App: React.FC = () => {
  const {
    originalImage,
    editedImage,
    prompt,
    setPrompt,
    isLoading,
    error,
    handleImageUpload,
    handleSubmit,
    handleReset,
    useEditedAsOriginal,
  } = useImageEditing();

  return (
    <div className="flex flex-col min-h-screen font-sans text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6 sticky top-24">
          <EditControls
            prompt={prompt}
            setPrompt={setPrompt}
            isLoading={isLoading}
            handleImageUpload={handleImageUpload}
            handleSubmit={handleSubmit}
            hasImage={!!originalImage}
            handleReset={handleReset}
          />
          {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center" role="alert">{error}</p>}
        </div>
        <ImageDisplay
          originalImage={originalImage}
          editedImage={editedImage}
          isLoading={isLoading}
          onUseAsOriginal={useEditedAsOriginal}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;