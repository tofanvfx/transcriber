
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { LanguageSelector } from './components/LanguageSelector';
import { TranscriptionDisplay } from './components/TranscriptionDisplay';
import { Loader } from './components/Loader';
import { transcribeAudio } from './services/geminiService';
import { SUPPORTED_LANGUAGES } from './constants';
import type { LanguageOption } from './types';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES[0].value); // Default to Odia
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setTranscription(''); // Reset transcription when new file is selected
    setError(null); // Reset error
  }, []);

  const handleLanguageChange = useCallback((langValue: string) => {
    setLanguage(langValue);
  }, []);

  const handleTranscription = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }
    if (!process.env.API_KEY) {
      setError('API key is not configured. Please set the API_KEY environment variable.');
      console.error('API_KEY environment variable not set.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranscription('');

    try {
      const result = await transcribeAudio(selectedFile, language);
      setTranscription(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during transcription.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-10 space-y-8 min-h-[70vh] flex flex-col">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
          LinguaScribe
        </h1>
        <p className="text-slate-400 mt-2">
          Upload your audio/video file and get it transcribed in your chosen language.
        </p>
      </header>

      <main className="space-y-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} />
          <LanguageSelector
            onLanguageChange={handleLanguageChange}
            selectedLanguage={language}
            languages={SUPPORTED_LANGUAGES}
          />
        </div>
        
        <div className="text-center">
          <button
            onClick={handleTranscription}
            disabled={!selectedFile || isLoading}
            className="w-full md:w-auto px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
          >
            {isLoading ? 'Transcribing...' : 'Transcribe Audio/Video'}
          </button>
        </div>

        {isLoading && <Loader />}

        {error && (
          <div className="mt-6 p-4 bg-red-700 bg-opacity-30 text-red-300 border border-red-500 rounded-lg text-center">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        <TranscriptionDisplay transcription={transcription} displayLanguageCode={language} />
      </main>
      
      <footer className="text-center text-slate-500 text-sm pt-4">
        <p>Ensure your audio/video files are of a reasonable size for processing.</p>
        <p>&copy; {new Date().getFullYear()} LinguaScribe. Powered by TofanVFX.</p>
      </footer>
    </div>
  );
};

export default App;
