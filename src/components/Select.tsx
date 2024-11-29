import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  description: string;
}

export function Select({ label, options, value, onChange, description }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customValue, setCustomValue] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (a.startsWith('no ')) return -1;
    if (b.startsWith('no ')) return 1;
    return a.localeCompare(b);
  });

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearch('');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customValue.trim()) {
      onChange(customValue.trim());
      setCustomValue('');
      setIsOpen(false);
    }
  };

  const modal = isOpen && createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setIsOpen(false)} 
      />
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="w-full max-w-md transform glass-effect rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">{label}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 text-sm bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-2"
                onClick={(e) => e.stopPropagation()}
              />
              <form onSubmit={handleCustomSubmit} className="mb-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Ajouter un mot-clé personnalisé"
                  className="w-full px-3 py-2 text-sm bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  onClick={(e) => e.stopPropagation()}
                />
              </form>
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {filteredOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-600/50 rounded-lg transition-colors ${
                      option === value ? 'bg-gray-600/50' : ''
                    } ${option.startsWith('no ') ? 'text-red-400 font-medium' : 'text-white'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-200 mb-1">
        {label}
      </label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-3 py-1.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 flex items-center justify-between"
      >
        <span className="truncate mr-2">{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {!isOpen && (
        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 right-0 -bottom-6">
          <p className="text-xs text-gray-300 glass-effect px-2 py-1 rounded-md">
            {description}
          </p>
        </div>
      )}

      {modal}
    </div>
  );
}