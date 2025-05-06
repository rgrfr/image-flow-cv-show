
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { extractTitleAndSubtitle } from "@/lib/filename-parser";
import { Check, X, Maximize, AlignVerticalJustifyCenter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ImageSelectorProps {
  images: string[];
  selectedImages: string[];
  onSave: (selected: string[], imageOptions?: Record<string, ImageOptions>) => void;
}

interface ImageOptions {
  fullWidth: boolean;
  cropFromTop: boolean;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ images, selectedImages, onSave }) => {
  const [selected, setSelected] = useState<string[]>(selectedImages);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [imageOptions, setImageOptions] = useState<Record<string, ImageOptions>>({});

  useEffect(() => {
    // Initialize available images (those not in selected)
    const available = images.filter(img => !selected.includes(img));
    setAvailableImages(available);
    
    // Initialize image options for all images
    const initialOptions: Record<string, ImageOptions> = {};
    images.forEach(img => {
      initialOptions[img] = { fullWidth: false, cropFromTop: true };
    });
    setImageOptions(prev => ({...initialOptions, ...prev}));
  }, [images]);

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
    onSave(selected, imageOptions);
  };

  const handleCancel = () => {
    onSave(selectedImages); // Revert to original selection
  };

  const handleOptionChange = (image: string, option: keyof ImageOptions, value: boolean) => {
    setImageOptions(prev => ({
      ...prev,
      [image]: {
        ...prev[image],
        [option]: value
      }
    }));
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
                    className="space-y-3 min-h-[200px]"
                  >
                    {selected.length > 0 ? (
                      selected.map((image, index) => {
                        const { title, subtitle } = extractTitleAndSubtitle(image.split('/').pop() || '');
                        const options = imageOptions[image] || { fullWidth: false, cropFromTop: true };
                        
                        return (
                          <Draggable key={image} draggableId={image} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-gray-800 rounded-lg cursor-move hover:bg-gray-700 transition-colors overflow-hidden"
                              >
                                <div className="p-3 flex gap-3 items-center">
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
                                
                                <div className="px-3 pb-3 pt-1 border-t border-gray-700">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <Checkbox 
                                        id={`fullWidth-${index}`}
                                        checked={options.fullWidth}
                                        onCheckedChange={(checked) => 
                                          handleOptionChange(image, "fullWidth", checked === true)
                                        }
                                      />
                                      <label 
                                        htmlFor={`fullWidth-${index}`}
                                        className="text-sm flex items-center gap-1 cursor-pointer"
                                      >
                                        <Maximize size={14} /> Full width (may crop height)
                                      </label>
                                    </div>
                                    
                                    {options.fullWidth && (
                                      <div className="flex items-center gap-2 pl-6">
                                        <Checkbox 
                                          id={`cropTop-${index}`}
                                          checked={options.cropFromTop}
                                          onCheckedChange={(checked) => 
                                            handleOptionChange(image, "cropFromTop", checked === true)
                                          }
                                        />
                                        <label 
                                          htmlFor={`cropTop-${index}`} 
                                          className="text-sm flex items-center gap-1 cursor-pointer"
                                        >
                                          <AlignVerticalJustifyCenter size={14} /> Crop from top (unchecked crops from bottom)
                                        </label>
                                      </div>
                                    )}
                                  </div>
                                </div>
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
