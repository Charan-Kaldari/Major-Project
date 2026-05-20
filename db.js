import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const exists = state.find(i => i._id === action.item._id);
      if (exists) return state.map(i => i._id === action.item._id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.item, qty: 1 }];
    }
    case "REMOVE":   return state.filter(i => i._id !== action.id);
    case "UPDATE":   return state.map(i => i._id === action.id ? { ...i, qty: action.qty } : i);
    case "CLEAR":    return [];
    default:         return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart     = (item)       => dispatch({ type: "ADD", item });
  const removeFromCart = (id)        => dispatch({ type: "REMOVE", id });
  const updateQty     = (id, qty)    => qty < 1 ? removeFromCart(id) : dispatch({ type: "UPDATE", id, qty });
  const clearCart     = ()           => dispatch({ type: "CLEAR" });
  const total         = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount     = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
