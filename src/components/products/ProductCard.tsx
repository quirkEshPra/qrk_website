import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { Link } from 'react-router-dom';

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    badge?: 'trending' | 'new' | 'almost-gone';
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);

  const getBadgeContent = (badge: string) => {
    switch (badge) {
      case 'trending':
        return '🔥 Trending';
      case 'new':
        return '✨ NEW';
      case 'almost-gone':
        return '💀 Almost Gone';
      default:
        return null;
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setShowAddedAnimation(true);
    setTimeout(() => setShowAddedAnimation(false), 1000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      className="group bg-gray-900 rounded-xl overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Added to Cart Animation */}
      <AnimatePresence>
        {showAddedAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="bg-white text-black px-4 py-2 rounded-full font-bold shadow-lg">
              Added! 🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product image with hover overlay */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-[#FF2E93] text-white rounded-full text-sm font-medium">
            {getBadgeContent(product.badge)}
          </div>
        )}

        {/* Quick actions overlay */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={handleAddToCart}
            className="p-3 bg-white rounded-full text-black hover:bg-[#FF2E93] hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={20} />
          </motion.button>
          <motion.button
            onClick={handleWishlistToggle}
            className={`p-3 rounded-full transition-colors ${isInWishlist(product.id)
                ? 'bg-[#FF2E93] text-white'
                : 'bg-white text-black hover:bg-[#FF2E93] hover:text-white'
              }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={20} className={isInWishlist(product.id) ? 'fill-current' : ''} />
          </motion.button>
          <motion.button
            onClick={(e) => e.preventDefault()}
            className="p-3 bg-white rounded-full text-black hover:bg-[#FF2E93] hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={20} />
          </motion.button>
        </motion.div>
      </Link>

      {/* Product info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-bold mb-1 hover:text-[#FF2E93] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#00f0f0] font-bold">${product.price.toFixed(2)}</span>
            <span className="text-lg">💥</span>
          </div>
          <motion.button
            onClick={() => addToCart(product)}
            className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-[#FF2E93] hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cop Now 🔥
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;