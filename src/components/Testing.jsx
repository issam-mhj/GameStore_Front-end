

import React, { useState, useEffect } from 'react';

const TestCart = () => {

  const products = [
    { id: 1, name: 'T-Shirt', price: 20 },
    { id: 2, name: 'Casquette', price: 15 },
  ];

  
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  
  useEffect(() => {
    try {

      const savedCart = localStorage.getItem('shopping-cart');
     
      
     
      if (savedCart && savedCart !== "[]") {
        const parsedCart = JSON.parse(savedCart);
        console.log("Parsed cart:", parsedCart);
        
        if (Array.isArray(parsedCart)) {
          console.log("Setting cart state with saved data");
          setCart(parsedCart);
        }
      } else {
        console.log("No valid cart data found in localStorage");
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      
      localStorage.removeItem('shopping-cart');
    } finally {
      setIsLoaded(true);
    }
  }, []); 


  useEffect(() => {
    if (isLoaded) {
      try {
        console.log("Cart changed, saving to localStorage:", cart);
        if (cart.length > 0) {
          localStorage.setItem('shopping-cart', JSON.stringify(cart));
          console.log("Cart saved successfully");
        } else {
          console.log("Cart is empty, not saving");
        }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isLoaded]); 

 
  const addToCart = (product) => {
    console.log("Adding to cart:", product);
    setCart(prevCart => {
      const exists = prevCart.find(item => item.id === product.id);
      if (exists) {
      
        console.log("updating quantity");
        return prevCart.map(item => 
          item.id === product.id 
            ? {...item, qty: item.qty + 1} 
            : item
        );
      }
    
      console.log("New item, adding to cart");
      return [...prevCart, {...product, qty: 1}];
    });
  };


  const removeFromCart = (id) => {
    console.log("Removing item from cart:", id);
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };



  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Produits</h2>
      <div>
        {products.map(p => (
          <div key={p.id} style={{ margin: '10px 0' }}>
            {p.name} - {p.price}€
            <button onClick={() => addToCart(p)} style={{ marginLeft: '10px' }}>
              +
            </button>
          </div>
        ))}
      </div>

      <h2>Panier ({totalItems})</h2>
      <div>
        {cart.length === 0 ? (
          <p>Votre panier est vide</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} style={{ margin: '10px 0' }}>
                {item.name} x{item.qty} = {item.price * item.qty}€
                <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px' }}>
                  ×
                </button>
              </div>
            ))}
            <div style={{ marginTop: '15px' }}>
              Total: {cart.reduce((sum, item) => sum + (item.price * item.qty), 0)}€
            </div>
          </>
        )}
      </div>
      
    
    </div>
  );
};

export default TestCart;