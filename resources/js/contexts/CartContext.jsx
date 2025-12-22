import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('spiceloop_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error loading cart from localStorage:', e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('spiceloop_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item, selectedOption = null) => {
        const cartItem = {
            ...item,
            quantity: 1,
            selectedOption: selectedOption || null,
            price: selectedOption ? parseFloat(selectedOption.price) : parseFloat(item.price),
        };

        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(c => {
                if (c.id !== item.id) return false;
                const cOptionId = c.selectedOption?.id || null;
                const newOptionId = selectedOption?.id || null;
                return cOptionId === newOptionId;
            });

            if (existingItemIndex !== -1) {
                return prevCart.map((c, index) => 
                    index === existingItemIndex
                        ? { ...c, quantity: c.quantity + 1 }
                        : c
                );
            } else {
                return [...prevCart, cartItem];
            }
        });
    };

    const removeFromCart = (index) => {
        setCart(prevCart => prevCart.filter((_, i) => i !== index));
    };

    const updateQuantity = (index, quantity) => {
        if (quantity <= 0) {
            removeFromCart(index);
            return;
        }
        setCart(prevCart => 
            prevCart.map((item, i) => 
                i === index ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartItemCount,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

