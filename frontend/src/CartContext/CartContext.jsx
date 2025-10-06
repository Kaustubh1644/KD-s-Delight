import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";

import axios from "axios";
const CartContext = createContext();

// Reducer handling Cart Actions Like Add, Remove, Update Quantity And Item.

const cartReducer = (state, action) => {
  switch (action.type) {
    case "HYDRATE_CART":
      return action.payload;
    case "ADD_ITEM": {
      const { _id, item, quantity } = action.payload;
  
      const exists = state.find((ci) => ci._id === _id);
      if (exists) {
        return state.map((ci) =>
          ci._id === _id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...state, { _id, item, quantity }];
    }
    case "REMOVE_ITEM": {
      return state.filter((ci) => ci._id !== action.payload);
    }
    case "UPDATE_ITEM": {
      const { _id, quantity } = action.payload;
      
      return state.map((ci) => (ci._id === _id ? { ...ci, quantity } : ci));
    }
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

/// Initialise cart from localstorage
const initializer = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
  // Persist cart to localstorage on changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  //    HYDRATE FROM SERVER API
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios.get("https://kd-s-delight-backend.onrender.com/api/cart", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => dispatch({ type: "HYDRATE_CART", payload: res.data }))
      .catch((err) => {
  console.error("Cart fetch failed:", err.response?.data || err.message);
});

  }, []);

  // Dispatcher wrapped with useCallBack For Performance
  const addToCart = useCallback(async (item, qty) => {
    const token = localStorage.getItem("authToken");
    const res = await axios.post(
      "https://kd-s-delight-backend.onrender.com/api/cart",
      { itemId: item._id, quantity: qty },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: "ADD_ITEM", payload: res.data });
  }, []);

  const removeFromCart = useCallback(async (_id) => {
    const token = localStorage.getItem("authToken");
    await axios.delete(`https://kd-s-delight-backend.onrender.com/api/cart/${_id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "REMOVE_ITEM", payload: _id });
  }, []);

  const updateQuantity = useCallback(async (_id, qty) => {

    if (!_id) {
    console.error("updateQuantity called without _id");
    return; // or throw an error, or handle it gracefully
  }

    const token = localStorage.getItem("authToken");
    const res = await axios.put(
      `https://kd-s-delight-backend.onrender.com/api/cart/${_id}`,
      {
        quantity: qty,
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: "UPDATE_ITEM", payload: res.data });
  }, []);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    await axios.post(
      `https://kd-s-delight-backend.onrender.com/api/cart/clear`,
      {},
      {
        withCredentials: true,

        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const totalItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalAmount = cartItems.reduce((sum, ci) => {
    const price = ci?.item?.price ?? 0;
    const qty = ci?.quantity ?? 0;
    return sum + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);
