import { createContext } from 'react';
import { useState } from 'react';
// state + actions
const GlobalContext = createContext({
  modalIsOpen: false,
  setIsOpen: (val) => {},
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {}
});

export const ContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setModalIsOpen] = useState(false);

  const addItem = (item) => {
    setCartItems([...cartItems, item]);
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // clear the whole cart
  const clearCart = (id) => {
    setCartItems([]);
  };

  const setIsOpen = (value) => {
    if (value !== undefined)
      setModalIsOpen(value);
    else setModalIsOpen(!isOpen);
  }

  return (
    <GlobalContext.Provider
      value={{
        items: cartItems,
        addItem,
        removeItem,
        clearCart,
        modalIsOpen: isOpen,
        setIsOpen,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;