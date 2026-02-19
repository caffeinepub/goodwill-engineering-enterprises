import { useState } from 'react';
import { ExternalBlob } from '../backend';
import { fileToBytes, validateImageFile } from '../utils/fileToBytes';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface UseProductImageUploadResult {
  uploadImage: (file: File) => Promise<ExternalBlob | null>;
  uploadState: UploadState;
  resetUpload: () => void;
}

export function useProductImageUpload(): UseProductImageUploadResult {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const resetUpload = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
    });
  };

  const uploadImage = async (file: File): Promise<ExternalBlob | null> => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: validation.error || 'Invalid file',
      });
      return null;
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
    });

    try {
      // Convert file to bytes
      const bytes = await fileToBytes(file);

      // Create ExternalBlob with progress tracking
      const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadState((prev) => ({
          ...prev,
          progress: percentage,
        }));
      });

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
      });

      return externalBlob;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
      });
      return null;
    }
  };

  return {
    uploadImage,
    uploadState,
    resetUpload,
  };
}
