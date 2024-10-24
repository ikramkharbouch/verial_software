import { createContext } from 'react';
import { useState } from 'react';
// state + actions
const GlobalContext = createContext({
  modalIsOpen: false,
  setIsOpen: (val) => {},
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  currentTab: 0,
  setTab: (val) => {}
});

export const ContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setModalIsOpen] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0)

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

  const setTab = (value) => {
    if (value !== undefined)
      setCurrentTabIndex(value);
    else setCurrentTabIndex(0);
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
        setTab,
        currentTab: currentTabIndex
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;