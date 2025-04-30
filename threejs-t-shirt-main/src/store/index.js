import {proxy} from 'valtio';

// Retrieve saved designs and cart items from localStorage if they exist
const getSavedDesigns = () => {
  const savedDesigns = localStorage.getItem('savedDesigns');
  return savedDesigns ? JSON.parse(savedDesigns) : [];
};

const getCartItems = () => {
  const cartItems = localStorage.getItem('cartItems');
  return cartItems ? JSON.parse(cartItems) : [];
};

const state = proxy({
  intro: true,
  color: '#353934',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './circuit.png',
  price: 599, // Default price
  size: 'M', // Default size
  quantity: 1, // Default quantity
  savedDesigns: getSavedDesigns(),
  cartItems: getCartItems(),
  showSavedDesigns: false, // Toggle for saved designs panel
  showCart: false, // Toggle for cart panel
});

export default state;