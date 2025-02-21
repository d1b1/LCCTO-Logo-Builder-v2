import React from 'react';
import { IconData } from '../types/icon';

interface IconCardProps {
  icon: IconData;
  onSelectStyle: (icon: IconData, style: { family: string; style: string }) => void;
}

export function IconCard({ icon, onSelectStyle }: IconCardProps) {
  return (
    <div className="bg-white shadow-md p-6 w-full rounded-lg">
      <div className="flex items-center justify-between mb-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{icon.label}</h2>
          <p className="text-gray-500 text-sm">Unicode: <span className="font-mono">{icon.unicode}</span></p>
        </div>
      </div>
      
      <div className="grid grid-cols-8 gap-4">
        {icon.membership.pro.map((style, index) => (
          <button
            key={`${style.family}-${style.style}-${index}`}
            onClick={() => onSelectStyle(icon, style)}
            className="border rounded-lg p-3 bg-gray-50 flex flex-col items-center hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <i className={`fa-${style.family} fa-${icon.name} fa-${style.style} text-2xl mb-2 text-gray-700`}></i>
            <span className="text-xs text-gray-600 text-center">{style.style}</span>
            <span className="text-xs text-gray-500 text-center">{style.family}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {icon.categories.map((category) => (
              <span 
                key={category}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {icon.keywords.map((keyword) => (
              <span 
                key={keyword}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}