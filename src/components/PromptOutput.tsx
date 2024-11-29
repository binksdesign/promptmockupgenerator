import React, { useRef, useState } from 'react';
import { Copy, Wand2 } from 'lucide-react';
import type { PromptState } from '../types';

interface PromptOutputProps {
  prompt: PromptState;
  onRandomize: () => void;
}

export function PromptOutput({ prompt, onRandomize }: PromptOutputProps) {
  const [editedPrompt, setEditedPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generatePrompt = () => {
    const parts = Object.entries(prompt)
      .filter(([_, value]) => !value.startsWith('no '))
      .map(([_, value]) => value);
    
    return parts.join(', ');
  };

  const handleCopy = async () => {
    const textToCopy = isEditing ? editedPrompt : generatePrompt();
    await navigator.clipboard.writeText(textToCopy);
  };

  const handleEdit = () => {
    if (!isEditing) {
      setEditedPrompt(generatePrompt());
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 glass-effect rounded-2xl p-6 relative z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">
          Prompt Généré
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="px-4 py-1.5 text-sm font-medium text-gray-200 bg-gray-700/50 border border-gray-600/50 rounded-xl hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          >
            {isEditing ? 'Terminer' : 'Éditer'}
          </button>
          <button
            onClick={onRandomize}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-blue-600/80 hover:bg-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          >
            <Wand2 className="w-4 h-4" />
            Aléatoire
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-200 bg-gray-700/50 border border-gray-600/50 rounded-xl hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={isEditing ? editedPrompt : generatePrompt()}
        onChange={(e) => isEditing && setEditedPrompt(e.target.value)}
        readOnly={!isEditing}
        className="w-full h-24 p-4 text-white bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-200"
      />
    </div>
  );
}