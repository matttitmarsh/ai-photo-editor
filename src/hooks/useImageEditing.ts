import { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

// This is a placeholder. In a real application, the API key would be
// configured in the environment and not directly in the code.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you might show a message to the user or have a different fallback.
  // For this example, we'll throw an error during development if the key is missing.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result includes the Base64 prefix, so we split it off.
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        // Handle the case where the result is not a string (e.g., ArrayBuffer)
        // This part would need more robust handling in a real-world app
        // but for common image types, string is expected.
        resolve(''); // or reject the promise
      }
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: file.type,
    },
  };
};

export const useImageEditing = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setEditedImage(null);
    setError(null);
    setPrompt('');
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setPrompt('');
    setError(null);
    setIsLoading(false);
  };
  
  const useEditedAsOriginal = async () => {
    if (!editedImage) return;

    try {
        const response = await fetch(editedImage);
        const blob = await response.blob();
        const newFile = new File([blob], "edited-image.png", { type: blob.type });
        
        setOriginalImage(newFile);
        setEditedImage(null);
        setPrompt('');
        setError(null);

    } catch (err) {
        console.error("Error converting edited image to file:", err);
        setError("Could not use the edited image as a new source. Please try downloading and re-uploading it.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalImage || !prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const imagePart = await fileToGenerativePart(originalImage);
      const textPart = { text: prompt };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      let foundImage = false;
      // The response can contain multiple parts (text, image, etc.)
      // We loop through to find the first image part.
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64ImageBytes = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          setEditedImage(`data:${mimeType};base64,${base64ImageBytes}`);
          foundImage = true;
          break; // Stop after finding the first image
        }
      }

      if (!foundImage) {
        setError("The AI didn't return an image. Try a different prompt.");
      }

    } catch (err) {
      console.error(err);
      setError('An error occurred while editing the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};