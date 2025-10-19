import { ShoppingCart, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  onSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden transition-shadow hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 hover:bg-gray-100"
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
          />
        </button>

        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <Button
              onClick={() => onQuickView(product)}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              Quick View
            </Button>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="mb-2 line-clamp-1">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          {product.onSale && product.originalPrice ? (
            <>
              <span className="text-red-600">${product.price}</span>
              <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
            </>
          ) : (
            <span>${product.price}</span>
          )}
        </div>

        <div className="flex gap-1 mb-3">
          {product.colors.slice(0, 4).map((color, index) => (
            <div
              key={index}
              className="w-5 h-5 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <Button
          onClick={() => onAddToCart(product)}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
