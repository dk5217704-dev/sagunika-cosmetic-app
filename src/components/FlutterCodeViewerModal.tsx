import React, { useState } from 'react';
import { X, Copy, Check, Code2, Download, FileCode } from 'lucide-react';
import { FLUTTER_PROJECT_FILES } from '../data/flutterSourceCode';

interface FlutterCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeViewerModal: React.FC<FlutterCodeViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = FLUTTER_PROJECT_FILES[selectedFileIndex] || FLUTTER_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.filename.split('/').pop() || 'file.dart';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[85vh] flex flex-col border border-[#E8D5C4] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#FAF8F9] px-4 py-3 border-b border-[#E8D5C4] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-[#4A154B] text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                Flutter Project Source Code
              </h3>
              <p className="text-[10px] text-gray-500">
                Production-ready Flutter 3.x + Firebase Android Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E8D5C4] hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center space-x-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadAll}
              className="px-2.5 py-1.5 rounded-lg bg-[#4A154B] hover:bg-[#67226B] text-white text-xs font-bold flex items-center space-x-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout: File Sidebar + Code Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-48 bg-[#FAF8FA] border-r border-[#E8D5C4] overflow-y-auto p-2 space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1 block">
              Flutter Files
            </span>
            {FLUTTER_PROJECT_FILES.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 truncate transition-all ${
                  selectedFileIndex === idx
                    ? 'bg-[#4A154B] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{file.filename.split('/').pop()}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-[#1E1E24] text-gray-200 overflow-hidden">
            {/* File Path Bar */}
            <div className="px-4 py-2 bg-[#17171C] border-b border-gray-800 flex items-center justify-between text-xs">
              <span className="font-mono text-[#B76E79]">{currentFile.filename}</span>
              <span className="text-[10px] text-gray-400">{currentFile.description}</span>
            </div>

            {/* Code Body */}
            <pre className="flex-1 p-4 text-xs font-mono overflow-auto leading-relaxed text-gray-300 selection:bg-[#B76E79]/40">
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
