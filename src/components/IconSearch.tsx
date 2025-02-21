import React, { useState, useCallback } from 'react';
import algoliasearch from 'algoliasearch';
import { Search, Loader2, X } from 'lucide-react';
import { IconData } from '../types/icon';
import debounce from '../utils/debounce';

const client = algoliasearch('M19DXW5X0Q', 'c79b2e61519372a99fa5890db070064c');
const index = client.initIndex('fontawesome_com-collections-6.7.2_alphabetical');

interface IconSearchProps {
  onSelectIcon: (icon: IconData) => void;
  selectedIcon: IconData | null;
  onSelectStyle: (icon: IconData, style: { family: string; style: string }) => void;
}

export function IconSearch({ onSelectIcon, selectedIcon, onSelectStyle }: IconSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IconData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchIcons = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { hits } = await index.search<IconData>(searchQuery, {
          hitsPerPage: 20,
        });
        setResults(hits);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchIcons(value);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    onSelectIcon(null);
  };

  const handleIconClick = (icon: IconData) => {
    onSelectIcon(icon);
  };

  const renderIconRow = (icon: IconData) => {
    if (selectedIcon?.objectID === icon.objectID) {
      return (
        <div className="col-span-full bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 min-w-[200px]">
              <i className={`fa-${icon.family} fa-${icon.name} fa-${icon.style} text-2xl text-gray-700`}></i>
              <div>
                <p className="font-medium text-gray-800">{icon.label}</p>
                <p className="text-xs text-gray-500">Unicode: {icon.unicode}</p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-5 gap-2">
              {icon.membership.pro.map((style, index) => (
                <button
                  key={`${style.family}-${style.style}-${index}`}
                  onClick={() => onSelectStyle(icon, style)}
                  className="p-3 border rounded hover:bg-blue-50 hover:border-blue-300 transition-colors flex flex-col items-center gap-2"
                >
                  <i className={`fa-${style.family} fa-${icon.name} fa-${style.style} text-xl text-gray-700`}></i>
                  <span className="text-xs text-gray-600 capitalize">{style.style}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => handleIconClick(icon)}
        className="p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200 flex items-center gap-3"
      >
        <i className={`fa-${icon.family} fa-${icon.name} fa-${icon.style} text-2xl text-gray-700`}></i>
        <span className="text-sm text-gray-600">
          {icon.label}
        </span>
      </button>
    );
  };

  return (
    <div>
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search icons..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {results.map((icon) => (
            <React.Fragment key={icon.objectID}>
              {renderIconRow(icon)}
            </React.Fragment>
          ))}
        </div>
      ) : query && (
        <div className="text-center py-8 text-gray-500">
          No icons found for "{query}"
        </div>
      )}
    </div>
  );
}