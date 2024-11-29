import React, { useState } from 'react';
import { Select } from './components/Select';
import { PromptOutput } from './components/PromptOutput';
import { Book } from 'lucide-react';
import { KeywordsModal } from './components/KeywordsModal';
import { categories } from './data/categories';
import type { PromptState } from './types';

function App() {
  const [isKeywordsModalOpen, setIsKeywordsModalOpen] = useState(false);

  const [prompt, setPrompt] = useState<PromptState>({
    photographicStyle: 'cinematic photography',
    object: 'of a blank t-shirt',
    objectColor: 'in white',
    model: 'worn by male model',
    scene: 'in product showcase',
    setting: 'on urban street',
    lighting: 'with soft light',
    mood: 'with minimal mood',
    resolution: 'in high resolution'
  });

  const handleRandomize = () => {
    const newPrompt = Object.keys(categories).reduce((acc, key) => {
      const categoryKeywords = categories[key as keyof typeof categories].keywords;
      const randomIndex = Math.floor(Math.random() * categoryKeywords.length);
      return {
        ...acc,
        [key]: categoryKeywords[randomIndex]
      };
    }, {} as PromptState);

    setPrompt(newPrompt);
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={() => setIsKeywordsModalOpen(true)}
        className="fixed top-4 right-4 p-2 rounded-full glass-effect hover:bg-gray-700/50 transition-colors duration-200"
        aria-label="Show additional keywords"
      >
        <Book className="w-5 h-5 text-white" />
      </button>
      
      <KeywordsModal
        isOpen={isKeywordsModalOpen}
        onClose={() => setIsKeywordsModalOpen(false)}
      />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-white">
            Générateur de prompts pour mockups by binks design
          </h1>
        </header>

        <div className="max-w-5xl mx-auto glass-effect rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(categories).map(([key, category]) => (
              <Select
                key={key}
                label={category.name}
                options={category.keywords}
                value={prompt[key as keyof PromptState]}
                onChange={(value) => 
                  setPrompt((prev) => ({ ...prev, [key]: value }))
                }
                description={category.description}
              />
            ))}
          </div>
        </div>

        <PromptOutput
          prompt={prompt}
          onRandomize={handleRandomize}
        />
      </div>
    </div>
  );
}

export default App;