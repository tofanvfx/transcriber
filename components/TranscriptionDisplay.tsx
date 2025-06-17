
import React, { useState, useCallback } from 'react';
import { SUPPORTED_LANGUAGES } from '../constants';
import { Document, Packer, Paragraph, TextRun } from 'docx';

interface TranscriptionDisplayProps {
  transcription: string;
  displayLanguageCode: string;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcription, displayLanguageCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (transcription) {
      navigator.clipboard.writeText(transcription)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        })
        .catch(err => console.error('Failed to copy text: ', err));
    }
  }, [transcription]);

  const handleDownloadTxt = useCallback(() => {
    if (!transcription) return;
    const blob = new Blob([transcription], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [transcription]);

  const handleDownloadDocx = useCallback(async () => {
    if (!transcription) return;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(transcription)],
          }),
        ],
      }],
    });

    try {
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transcription.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating .docx file:', error);
      // You could add user-facing error handling here if desired
    }
  }, [transcription]);

  if (!transcription) {
    return null;
  }

  const langConfig = SUPPORTED_LANGUAGES.find(lang => lang.value === displayLanguageCode);
  const headingText = langConfig?.resultHeading || 'Transcription Result:';

  const buttonBaseClass = "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-white rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50";

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h2 className="text-xl font-semibold text-slate-200">{headingText}</h2>
        <div className="flex space-x-2 flex-wrap">
          <button
            onClick={handleCopy}
            className={`${buttonBaseClass} bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500`}
            disabled={!transcription}
            aria-label={copied ? 'Text copied to clipboard' : 'Copy transcription to clipboard'}
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={handleDownloadTxt}
            className={`${buttonBaseClass} bg-sky-600 hover:bg-sky-700 focus:ring-sky-500`}
            disabled={!transcription}
            aria-label="Download transcription as .txt file"
          >
            Download .txt
          </button>
          <button
            onClick={handleDownloadDocx}
            className={`${buttonBaseClass} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`}
            disabled={!transcription}
            aria-label="Download transcription as .docx file"
          >
            Download .docx
          </button>
        </div>
      </div>
      <textarea
        readOnly
        value={transcription}
        className="w-full h-48 p-3 bg-slate-700 border border-slate-600 rounded-md text-slate-200 resize-y focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
        placeholder="Transcription will appear here..."
        aria-label="Transcribed text"
      />
    </div>
  );
};
