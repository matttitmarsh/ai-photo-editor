import React, { useRef } from 'react';

interface EditControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  handleImageUpload: (file: File) => void;
  handleSubmit: (e: React.FormEvent) => void;
  hasImage: boolean;
  handleReset: () => void;
}

export const EditControls: React.FC<EditControlsProps> = ({
  prompt,
  setPrompt,
  isLoading,
  handleImageUpload,
  handleSubmit,
  hasImage,
  handleReset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      {!hasImage ? (
        <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Upload an Image to Get Started</h2>
            <p className="text-slate-400 mb-6">Choose a photo and tell the AI what you want to change.</p>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
              ref={fileInputRef}
              aria-label="Upload image"
            />
            <button
              onClick={onUploadClick}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
            >
              Upload Image
            </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
                    Editing Prompt
                </label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'add a birthday hat on the cat'"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
                    rows={3}
                    required
                    disabled={isLoading}
                    aria-label="Editing prompt"
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="submit"
                    disabled={isLoading || !prompt}
                    className="flex-1 w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
                >
                    {isLoading ? 'Generating...' : 'Apply Edit'}
                </button>
                 <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="flex-1 w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-slate-500 disabled:opacity-50"
                >
                    Start Over
                </button>
            </div>
        </form>
      )}
    </div>
  );
};
