import React, { useState, useCallback } from 'react';
import { analyzeLeafImage } from './services/geminiService';
import type { DiseaseAnalysis } from './types';
import { FileUpload } from './components/FileUpload';
import { ResultCard } from './components/ResultCard';
import { Spinner } from './components/Spinner';
import { LeafIcon } from './components/icons/LeafIcon';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DiseaseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        if (!base64String) {
          throw new Error("Failed to read file.");
        }
        const result = await analyzeLeafImage(base64String, file.type);
        setAnalysis(result);
      };
      reader.onerror = () => {
          throw new Error("Error reading file.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setIsLoading(false);
    setError(null);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full text-center p-8">
            <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-green-300">
                {previewUrl && <img src={previewUrl} alt="Leaf preview" className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <Spinner />
                    <p className="text-white mt-4 font-semibold text-lg">Analyzing Leaf...</p>
                </div>
            </div>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="w-full text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Analysis Failed</h3>
            <p>{error}</p>
            <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
                Try Again
            </button>
        </div>
       );
    }

    if (analysis) {
        return <ResultCard analysis={analysis} imagePreviewUrl={previewUrl || ''} onReset={handleReset} />;
    }

    if (previewUrl && file) {
      return (
          <div className="w-full text-center p-4 sm:p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-700">Image Ready for Analysis</h2>
              <div className="w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-green-300">
                <img src={previewUrl} alt="Selected leaf" className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-center items-center gap-4">
                  <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                      Change Image
                  </button>
                  <button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg"
                  >
                      Analyze Now
                  </button>
              </div>
          </div>
      );
    }
    
    return <FileUpload onFileSelect={handleFileSelect} />;
  }

  return (
    <div className="min-h-screen bg-green-50/50 flex flex-col items-center justify-center p-4 font-sans">
      <main className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <LeafIcon className="w-12 h-12 text-green-600" />
              <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800">Leaf Disease Detection AI</h1>
            </div>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
              Upload a photo of a plant leaf, and our AI will identify potential diseases and provide care recommendations.
            </p>
        </header>
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 min-h-[400px] flex items-center justify-center transition-all duration-300">
            {renderContent()}
        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} PlantHealth AI. Powered by Gemini.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
