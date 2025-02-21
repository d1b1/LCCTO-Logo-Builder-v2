import React, { useRef } from 'react';
import { X, Download, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { IconSearch } from './components/IconSearch';
import { ExportModal } from './components/ExportModal';
import { IconData } from './types/icon';
import { RootState } from './store/store';
import {
  setIconSize,
  setIconSpacing,
  setBannerWidth,
  setBannerHeight,
  setBorderWidth,
  setBorderRadius,
  setBorderColor,
  setIconColor,
  addIcon,
  removeIcon,
} from './store/bannerSlice';

function App() {
  const dispatch = useDispatch();
  const {
    iconSize,
    iconSpacing,
    bannerWidth,
    bannerHeight,
    borderWidth,
    borderRadius,
    borderColor,
    iconColor,
    selectedIcons
  } = useSelector((state: RootState) => state.banner);
  
  const [selectedIcon, setSelectedIcon] = React.useState<IconData | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const addToCollection = (icon: IconData, style: { family: string; style: string }) => {
    const iconWithStyle = { ...icon, family: style.family, style: style.style };
    dispatch(addIcon(iconWithStyle));
    setSelectedIcon(null);
  };

  const removeFromCollection = (index: number) => {
    dispatch(removeIcon(index));
  };

  const exportBanner = async (filename: string) => {
    if (!previewRef.current) return;

    // Wait for fonts to load
    await document.fonts.ready;
    
    const html2canvas = (await import('html2canvas')).default;
    
    // Create a temporary container for export
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = `${bannerWidth}px`;
    tempContainer.style.height = `${bannerHeight}px`;
    document.body.appendChild(tempContainer);

    // Create the export layout
    tempContainer.innerHTML = `
      <div 
        style="
          width: ${bannerWidth}px;
          height: ${bannerHeight}px;
          background: white;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: ${iconSpacing}px;
          padding: ${iconSpacing}px;
          border: ${borderWidth}px solid ${borderColor};
          border-radius: ${borderRadius}px;
        "
      >
        ${Array.from({ length: 4 }).map((_, index) => {
          const icon = selectedIcons[index];
          return icon ? `
            <div style="display: flex; align-items: center; justify-content: center;">
              <i 
                class="fa-${icon.family} fa-${icon.name} fa-${icon.style}"
                style="font-size: ${iconSize}px; color: ${iconColor};"
              ></i>
            </div>
          ` : `
            <div></div>
          `;
        }).join('')}
      </div>
    `;

    try {
      // Render to canvas
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: 'white',
        width: bannerWidth,
        height: bannerHeight,
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Ensure styles are applied in cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = document.querySelector('style')?.textContent || '';
          clonedDoc.head.appendChild(style);
          
          // Copy Font Awesome links
          document.querySelectorAll('link[href*="fontawesome"]').forEach(link => {
            const clonedLink = link.cloneNode(true) as HTMLLinkElement;
            clonedDoc.head.appendChild(clonedLink);
          });
        }
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      // Clean up
      document.body.removeChild(tempContainer);
      setIsExportModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Logo Builder</h1>
          <p className="text-gray-600">Create a 2x2 grid logo with Font Awesome icons</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Logo Preview and Settings */}
          <div className="space-y-8">
            {/* Logo Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">            
              <div className="relative mb-6">
                <div 
                  ref={previewRef}
                  className="mx-auto bg-white relative rounded-lg overflow-hidden"
                  style={{ 
                    width: `${bannerWidth}px`, 
                    height: `${bannerHeight}px`,
                  }}
                >
                  <div 
                    className="logo-grid w-full h-full grid grid-cols-2 grid-rows-2 p-4"
                    style={{ 
                      gap: `${iconSpacing}px`,
                      border: `${borderWidth}px solid ${borderColor}`,
                      borderRadius: `${borderRadius}px`
                    }}
                  >
                    {Array.from({ length: 4 }).map((_, index) => {
                      const icon = selectedIcons[index];
                      return (
                        <div
                          key={index}
                          onClick={() => icon && removeFromCollection(index)}
                          className="relative flex items-center justify-center cursor-pointer"
                        >
                          {icon ? (
                            <i 
                              className={`fa-${icon.family} fa-${icon.name} fa-${icon.style} transition-colors`}
                              style={{ 
                                fontSize: `${iconSize}px`,
                                color: iconColor
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center text-gray-300">
                              <Plus className="w-6 h-6 mb-1" />
                              <span className="text-xs">Empty Slot</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="iconSize" className="block text-sm font-medium text-gray-700 mb-2">
                      Icon Size
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        id="iconSize"
                        min="32"
                        max="200"
                        value={iconSize}
                        onChange={(e) => dispatch(setIconSize(Number(e.target.value)))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600 w-12">{iconSize}px</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="iconSpacing" className="block text-sm font-medium text-gray-700 mb-2">
                      Grid Spacing
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        id="iconSpacing"
                        min="8"
                        max="48"
                        value={iconSpacing}
                        onChange={(e) => dispatch(setIconSpacing(Number(e.target.value)))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600 w-12">{iconSpacing}px</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="borderWidth" className="block text-sm font-medium text-gray-700 mb-2">
                      Border Width
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        id="borderWidth"
                        min="1"
                        max="10"
                        value={borderWidth}
                        onChange={(e) => dispatch(setBorderWidth(Number(e.target.value)))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600 w-12">{borderWidth}px</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="borderRadius" className="block text-sm font-medium text-gray-700 mb-2">
                      Border Radius
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        id="borderRadius"
                        min="0"
                        max="32"
                        value={borderRadius}
                        onChange={(e) => dispatch(setBorderRadius(Number(e.target.value)))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600 w-12">{borderRadius}px</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="borderColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Border Color
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        id="borderColor"
                        value={borderColor}
                        onChange={(e) => dispatch(setBorderColor(e.target.value))}
                        className="h-9 w-16 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 font-mono">{borderColor}</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="iconColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Icon Color
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        id="iconColor"
                        value={iconColor}
                        onChange={(e) => dispatch(setIconColor(e.target.value))}
                        className="h-9 w-16 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 font-mono">{iconColor}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bannerWidth" className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Size
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="bannerWidth"
                        min="200"
                        max="2000"
                        value={bannerWidth}
                        onChange={(e) => {
                          const size = Number(e.target.value);
                          dispatch(setBannerWidth(size));
                          dispatch(setBannerHeight(size));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">px</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    disabled={selectedIcons.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" />
                    Export Logo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Icon Search */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Icon Library</h2>
            <IconSearch 
              onSelectIcon={setSelectedIcon} 
              selectedIcon={selectedIcon}
              onSelectStyle={addToCollection}
            />
          </div>
        </div>

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onConfirm={exportBanner}
        />
      </div>
    </div>
  );
}

export default App;