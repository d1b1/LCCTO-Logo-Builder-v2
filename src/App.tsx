import React, { useRef } from 'react';
import { X, Download } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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
  addIcon,
  removeIcon,
  reorderIcons
} from './store/bannerSlice';

function App() {
  const dispatch = useDispatch();
  const {
    iconSize,
    iconSpacing,
    bannerWidth,
    bannerHeight,
    selectedIcons
  } = useSelector((state: RootState) => state.banner);
  
  const [selectedIcon, setSelectedIcon] = React.useState<IconData | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const addToCollection = (icon: IconData, style: { family: string; style: string }) => {
    const iconWithStyle = { ...icon, family: style.family, style: style.style };
    dispatch(addIcon(iconWithStyle));
  };

  const removeFromCollection = (index: number) => {
    dispatch(removeIcon(index));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedIcons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(reorderIcons(items));
  };

  const exportBanner = async (filename: string) => {
    if (!previewRef.current) return;

    await document.fonts.ready;

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: 'white',
      width: bannerWidth,
      height: bannerHeight,
      scale: 2,
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsExportModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Low Code Banner</h1>
          <p className="text-gray-600">Search through the Font Awesome icon library</p>
        </div>

        {selectedIcons.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">            
            <div className="relative mb-6">
              <div className="mx-auto overflow-hidden bg-gray-100 p-4">
                <div 
                  ref={previewRef}
                  className="mx-auto bg-white relative"
                  style={{ 
                    width: `${bannerWidth}px`, 
                    height: `${bannerHeight}px`,
                    minWidth: '100px',
                    minHeight: '50px'
                  }}
                >
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="icons" direction="horizontal">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
                          style={{ gap: `${iconSpacing}px` }}
                        >
                          {selectedIcons.map((icon, index) => (
                            <Draggable 
                              key={`${icon.objectID}-${index}`}
                              draggableId={`${icon.objectID}-${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`relative group cursor-move ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                >
                                  <div className="p-2">
                                    <i 
                                      className={`fa-${icon.family} fa-${icon.name} fa-${icon.style} text-gray-700`}
                                      style={{ fontSize: `${iconSize}px` }}
                                    ></i>
                                  </div>
                                  <button
                                    onClick={() => removeFromCollection(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500">
                {bannerWidth} x {bannerHeight} pixels
              </div>
            </div>

            <div className="space-y-6 mt-8 p-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bannerWidth" className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Width
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="bannerWidth"
                      min="100"
                      max="2000"
                      value={bannerWidth}
                      onChange={(e) => dispatch(setBannerWidth(Number(e.target.value)))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">px</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="bannerHeight" className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Height
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="bannerHeight"
                      min="50"
                      max="1000"
                      value={bannerHeight}
                      onChange={(e) => dispatch(setBannerHeight(Number(e.target.value)))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">px</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="iconSize" className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Size (px)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      id="iconSize"
                      min="16"
                      max="96"
                      value={iconSize}
                      onChange={(e) => dispatch(setIconSize(Number(e.target.value)))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-600 w-12">{iconSize}px</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="iconSpacing" className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Spacing (px)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      id="iconSpacing"
                      min="8"
                      max="96"
                      value={iconSpacing}
                      onChange={(e) => dispatch(setIconSpacing(Number(e.target.value)))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-600 w-12">{iconSpacing}px</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export Banner
                </button>
              </div>
            </div>
          </div>
        )}

        <IconSearch 
          onSelectIcon={setSelectedIcon} 
          selectedIcon={selectedIcon}
          onSelectStyle={addToCollection}
        />

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