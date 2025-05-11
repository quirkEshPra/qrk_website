import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-start border border-gray-200 rounded-lg p-4 bg-white">
      {/* Product image */}
      <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      
      {/* Product details */}
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
        </div>
        
        {/* Quantity controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <Minus size={14} />
            </button>
            
            <span className="text-gray-700 w-8 text-center">{item.quantity}</span>
            
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;