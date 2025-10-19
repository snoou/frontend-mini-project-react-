import { Dialog, DialogContent } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Heart, Check } from 'lucide-react';
import { useState } from 'react';
import { Product } from './ProductCard';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    onAddToCart(product, selectedSize, selectedColor);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-8 pt-6">
          <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.onSale && (
              <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                Sale
              </Badge>
            )}
            {product.isNew && (
              <Badge className="absolute top-3 left-3 bg-black text-white">
                New
              </Badge>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-2">
              <Badge variant="outline">{product.category}</Badge>
            </div>
            
            <h2 className="mb-4">{product.name}</h2>
            
            <div className="flex items-center gap-3 mb-6">
              {product.onSale && product.originalPrice ? (
                <>
                  <span className="text-red-600">${product.price}</span>
                  <span className="text-gray-400 line-through">${product.originalPrice}</span>
                  <Badge variant="destructive" className="bg-red-500">
                    Save ${product.originalPrice - product.price}
                  </Badge>
                </>
              ) : (
                <span>${product.price}</span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="mb-3">Description</h3>
              <p className="text-gray-600">
                This stylish piece combines comfort and elegance, perfect for any occasion. 
                Crafted from premium materials with attention to detail, ensuring both durability and sophistication.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="mb-3">Select Size</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3">Select Color</h3>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-black scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <Check className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-600" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-600" />
                <span>Free returns within 30 days</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-600" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
