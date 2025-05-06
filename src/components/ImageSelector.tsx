
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { extractTitleAndSubtitle } from "@/lib/filename-parser";
import { Check, X } from "lucide-react";

interface ImageSelectorProps {
  images: string[];
  selectedImages: string[];
  onSave: (selected: string[]) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ images, selectedImages, onSave }) => {
  const [selected, setSelected] = useState<string[]>(selectedImages);
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  useEffect(() => {
    // Initialize available images (those not in selected)
    const available = images.filter(img => !selected.includes(img));
    setAvailableImages(available);
  }, [images, selected]);

  const handleToggleSelect = (image: string) => {
    if (selected.includes(image)) {
      // Remove from selected
      setSelected(selected.filter(img => img !== image));
      setAvailableImages([...availableImages, image]);
    } else {
      // Add to selected
      setSelected([...selected, image]);
      setAvailableImages(availableImages.filter(img => img !== image));
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Reordering in the same list
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(selected);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setSelected(items);
    }
  };

  const handleSave = () => {
    onSave(selected);
  };

  const handleCancel = () => {
    onSave(selectedImages); // Revert to original selection
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Configure Presentation</h1>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-md text-white flex items-center gap-1"
            >
              <Check size={16} /> Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Selected Images ({selected.length})</h2>
            <p className="mb-4 text-gray-400">Drag to reorder. Click to remove from presentation.</p>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="selected-images">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 min-h-[200px]"
                  >
                    {selected.length > 0 ? (
                      selected.map((image, index) => {
                        const { title, subtitle } = extractTitleAndSubtitle(image.split('/').pop() || '');
                        return (
                          <Draggable key={image} draggableId={image} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 bg-gray-800 rounded-lg flex gap-3 items-center cursor-move hover:bg-gray-700 transition-colors"
                              >
                                <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                                  <img 
                                    src={image}
                                    alt={title}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="flex-grow overflow-hidden">
                                  <p className="font-medium truncate">{title}</p>
                                  <p className="text-sm text-gray-400 truncate">{subtitle}</p>
                                </div>
                                <button 
                                  onClick={() => handleToggleSelect(image)}
                                  className="p-1 bg-gray-700 hover:bg-red-700 rounded transition-colors"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-gray-500 border border-dashed border-gray-700 rounded-lg">
                        No images selected for the presentation
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Available Images ({availableImages.length})</h2>
            <p className="mb-4 text-gray-400">Click to add to presentation.</p>
            
            <div className="space-y-2">
              {availableImages.length > 0 ? (
                availableImages.map((image) => {
                  const { title, subtitle } = extractTitleAndSubtitle(image.split('/').pop() || '');
                  return (
                    <div 
                      key={image}
                      className="p-3 bg-gray-800 rounded-lg flex gap-3 items-center hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                        <img 
                          src={image}
                          alt={title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="font-medium truncate">{title}</p>
                        <p className="text-sm text-gray-400 truncate">{subtitle}</p>
                      </div>
                      <button 
                        onClick={() => handleToggleSelect(image)}
                        className="p-1 bg-gray-700 hover:bg-green-700 rounded transition-colors"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-gray-500 border border-dashed border-gray-700 rounded-lg">
                  All images are already in the presentation
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;
