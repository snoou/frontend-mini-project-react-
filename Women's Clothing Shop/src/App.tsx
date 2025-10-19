import { useState, useMemo } from "react";
import { ShoppingCart, Menu, Search, Heart, User } from "lucide-react";
import { ProductCard, Product } from "./components/ProductCard";
import { ShoppingCartPanel, CartItem } from "./components/ShoppingCartPanel";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { FilterSidebar, FilterOptions } from "./components/FilterSidebar";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Badge } from "./components/ui/badge";

// Mock product data
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Elegant Summer Dress",
    price: 89.99,
    category: "Dresses",
    image:"/public/img/61mHmSnd0BL._AC_SY550_.jpg" ,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#000000", "#EC4899", "#2563EB"],
    isNew: true,
  },
  {
    id: 2,
    name: "Classic Silk Blouse",
    price: 65.0,
    originalPrice: 85.0,
    category: "Tops",
    image:"/public/img/71xkv5rPfuL._AC_SY550_.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#FFFFFF", "#D4C4B0", "#000000"],
    onSale: true,
  },
  {
    id: 3,
    name: "High-Waist Denim Jeans",
    price: 79.99,
    category: "Bottoms",
    image:"public/img/61xunpnoBHL._AC_SY550_.jpg",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["#1E3A8A", "#000000"],
  },
  {
    id: 4,
    name: "Wool Blend Coat",
    price: 149.99,
    category: "Outerwear",
    image:"public/img/71yeA5xS0ZL._AC_SY550_.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#000000", "#D4C4B0", "#DC2626"],
    isNew: true,
  },
  {
    id: 5,
    name: "Floral Midi Skirt",
    price: 55.0,
    originalPrice: 75.0,
    category: "Bottoms",
    image:"public/img/71TL6CwStNL._AC_SY550_.jpg",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#EC4899", "#FFFFFF", "#16A34A"],
    onSale: true,
  },
  {
    id: 6,
    name: "Cashmere Sweater",
    price: 129.99,
    category: "Tops",
    image:"public/img/61JLw2O8b+L._AC_SX466_.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#D4C4B0", "#000000", "#FFFFFF", "#DC2626"],
  },
];

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 500],
    sizes: [],
    colors: [],
  });

  const filteredProducts = useMemo(() => {
    let filtered = PRODUCTS;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes.some((size) => filters.sizes.includes(size))
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors.some((color) => filters.colors.includes(color))
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, filters, sortBy]);

  const handleAddToCart = (
    product: Product,
    size: string = "M",
    color: string = product.colors[0]
  ) => {
    const existingItem = cartItems.find(
      (item) =>
        item.id === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === existingItem.id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          size,
          color,
        },
      ]);
    }
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 500],
      sizes: [],
      colors: [],
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <h1 className="text-xl sm:text-2xl">Bella Boutique</h1>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          <div className="md:hidden mt-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">No products found</p>
                <Button onClick={resetFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-[300px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onReset={resetFilters}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Shopping Cart */}
      <ShoppingCartPanel
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
