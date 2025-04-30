import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import state from '../store';
import { CustomButton } from '../components';
import { fadeAnimation } from '../config/motion';

const SaveAndCart = () => {
  const snap = useSnapshot(state);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Generate a unique ID
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  // Save current design
  const saveDesign = () => {
    const newDesign = {
      id: generateId(),
      color: snap.color,
      isLogoTexture: snap.isLogoTexture,
      isFullTexture: snap.isFullTexture,
      logoDecal: snap.logoDecal,
      fullDecal: snap.fullDecal,
      date: new Date().toISOString()
    };

    state.savedDesigns = [...snap.savedDesigns, newDesign];
    localStorage.setItem('savedDesigns', JSON.stringify(state.savedDesigns));
    
    setMessage('Design saved!');
    setTimeout(() => setMessage(''), 2000);
  };

  // Apply a saved design
  const applyDesign = (design) => {
    state.color = design.color;
    state.isLogoTexture = design.isLogoTexture;
    state.isFullTexture = design.isFullTexture;
    state.logoDecal = design.logoDecal;
    state.fullDecal = design.fullDecal;
    
    state.showSavedDesigns = false;
  };

  // Delete a saved design
  const deleteDesign = (id) => {
    state.savedDesigns = snap.savedDesigns.filter(design => design.id !== id);
    localStorage.setItem('savedDesigns', JSON.stringify(state.savedDesigns));
  };

  // Add to cart
  const addToCart = () => {
    const cartItem = {
      id: generateId(),
      name: 'Custom T-Shirt Design',
      image: '../assets/images/products/tshirt1.jpg',
      price: 599,
      size: snap.size || 'M',
      quantity: snap.quantity || 1,
      color: snap.color,
      logoTexture: snap.isLogoTexture ? snap.logoDecal : null,
      fullTexture: snap.isFullTexture ? snap.fullDecal : null,
      dateAdded: new Date().toISOString()
    };
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    setMessage('Added to cart!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="absolute z-10 top-5 right-5">
      {/* Message notification */}
      <AnimatePresence>
        {message && (
          <motion.div 
            className="absolute right-0 -top-10 bg-green-500 text-white px-4 py-2 rounded-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <CustomButton 
          type="filled"
          title="Save Design"
          handleClick={saveDesign}
          customStyles="w-fit px-4 py-2.5 font-bold text-sm"
        />
        <CustomButton 
          type="filled"
          title="Add to Cart"
          handleClick={addToCart}
          customStyles="w-fit px-4 py-2.5 font-bold text-sm"
        />
      </div>

      {/* Size Selector */}
      <div className="mt-4 bg-white p-3 rounded-md shadow-md">
        <h3 className="text-gray-700 font-bold mb-2">Size:</h3>
        <div className="flex gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <button
              key={size}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                snap.size === size ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => { state.size = size; }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="mt-4 bg-white p-3 rounded-md shadow-md">
        <h3 className="text-gray-700 font-bold mb-2">Quantity:</h3>
        <div className="flex items-center border rounded-md w-fit">
          <button 
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => { if (snap.quantity > 1) state.quantity -= 1; }}
          >
            -
          </button>
          <span className="w-8 h-8 flex items-center justify-center">
            {snap.quantity || 1}
          </span>
          <button 
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => { if ((snap.quantity || 1) < 10) state.quantity = (snap.quantity || 1) + 1; }}
          >
            +
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="mt-4 bg-white p-3 rounded-md shadow-md">
        <h3 className="text-gray-700 font-bold">Price: ₹599</h3>
      </div>

      {/* View Cart Button */}
      <div className="mt-4">
        <CustomButton
          type="filled"
          title="View Cart"
          handleClick={() => navigate('/cart')}
          customStyles="w-full px-4 py-2.5 font-bold text-sm bg-green-500"
        />
      </div>

      {/* Saved Designs Panel Toggle */}
      <div className="mt-4 flex justify-end">
        <button 
          className="bg-white p-2 rounded-md shadow-lg hover:bg-gray-100"
          onClick={() => { state.showSavedDesigns = !snap.showSavedDesigns; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Saved Designs Panel */}
      <AnimatePresence>
        {snap.showSavedDesigns && (
          <motion.div
            className="absolute top-full right-0 w-72 bg-white rounded-md shadow-xl p-4 mt-2"
            {...fadeAnimation}
          >
            <h2 className="text-xl font-bold mb-4">Saved Designs</h2>
            {snap.savedDesigns.length === 0 ? (
              <p>No saved designs yet.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {snap.savedDesigns.map((design) => (
                  <div key={design.id} className="mb-3 p-2 border rounded-md">
                    <div 
                      className="w-full h-20 rounded mb-2 flex items-center justify-center"
                      style={{ 
                        backgroundColor: design.color,
                        backgroundImage: design.isFullTexture ? `url(${design.fullDecal})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {design.isLogoTexture && (
                        <img 
                          src={design.logoDecal} 
                          alt="Logo" 
                          className="h-12 w-12 object-contain"
                        />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <button 
                          className="text-blue-500 text-sm"
                          onClick={() => applyDesign(design)}
                        >
                          Apply
                        </button>
                        <button 
                          className="text-red-500 text-sm"
                          onClick={() => deleteDesign(design.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button 
              className="mt-3 w-full py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={() => { state.showSavedDesigns = false; }}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SaveAndCart;