import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

const CATEGORIES = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Activewear'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Beige', value: '#D4C4B0' },
  { name: 'Navy', value: '#1E3A8A' },
];

export function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.sizes.length > 0 || 
    filters.colors.length > 0 || 
    filters.priceRange[0] !== 0 || 
    filters.priceRange[1] !== 500;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h4>Category</h4>
        <div className="space-y-3">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t">
        <h4>Price Range</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={500}
            step={10}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t">
        <h4>Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-1.5 border rounded-md text-sm transition-colors ${
                filters.sizes.includes(size)
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t">
        <h4>Color</h4>
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorToggle(color.value)}
              className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                filters.colors.includes(color.value)
                  ? 'border-black scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {filters.colors.includes(color.value) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full border border-black" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
