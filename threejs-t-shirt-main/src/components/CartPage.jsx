import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomButton } from './';
import { fadeAnimation } from '../config/motion';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, shipping, payment, success
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    method: 'credit_card', // credit_card, paypal, apple_pay, google_pay, crypto
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paypalEmail: '',
    cryptoCurrency: 'bitcoin',
    cryptoWalletAddress: ''
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const successSoundRef = useRef(null);

  // Load cart items and order history on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
    
    const savedOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    setOrderHistory(savedOrders);
    
    // Create audio element for success sound
    successSoundRef.current = new Audio('/assets/sounds/successfull.mp3');
  }, []);

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setMessage('Item removed from cart');
    setTimeout(() => setMessage(''), 2000);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    setMessage('Cart cleared');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Create order object
    const order = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      items: [...cartItems],
      shipping: { ...shippingDetails },
      payment: { 
        method: paymentDetails.method,
        // Only include relevant payment details based on method
        ...(paymentDetails.method === 'credit_card' && {
          cardNumber: paymentDetails.cardNumber.replace(/\d{12}/, '********'),
          cardName: paymentDetails.cardName,
          expiryDate: paymentDetails.expiryDate
        }),
        ...(paymentDetails.method === 'paypal' && {
          email: paymentDetails.paypalEmail
        }),
        ...(paymentDetails.method === 'crypto' && {
          currency: paymentDetails.cryptoCurrency,
          walletAddress: paymentDetails.cryptoWalletAddress
        })
      },
      total: calculateTotal(),
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    // Add to order history
    const updatedOrderHistory = [order, ...orderHistory];
    setOrderHistory(updatedOrderHistory);
    localStorage.setItem('orderHistory', JSON.stringify(updatedOrderHistory));
    
    // Clear cart
    clearCart();
    
    // Play success sound
    if (successSoundRef.current) {
      successSoundRef.current.play();
    }
    
    // Show success message and move to success step
    setMessage('Order placed successfully!');
    setCheckoutStep('success');
    
    // Reset checkout after 5 seconds
    setTimeout(() => {
      setMessage('');
      setCheckoutStep('cart');
      setShippingDetails({
        fullName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      });
      setPaymentDetails({
        method: 'credit_card',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        paypalEmail: '',
        cryptoCurrency: 'bitcoin',
        cryptoWalletAddress: ''
      });
    }, 5000);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderCart = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowOrderHistory(!showOrderHistory)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            {showOrderHistory ? 'Hide Order History' : 'View Order History'}
          </button>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {showOrderHistory ? (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Order History</h3>
          {orderHistory.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {orderHistory.map((order) => (
                <div key={order.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-green-600">Completed</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Items: {order.items.length}</p>
                    <p>Payment: {order.payment.method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <CustomButton
            type="outline"
            title="Continue Shopping"
            handleClick={() => window.location.href = '/'}
            customStyles="w-fit"
          />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-contain"
                    />
                    {item.logoTexture && (
                      <img 
                        src={item.logoTexture} 
                        alt="Logo" 
                        className="absolute w-12 h-12 object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <p className="text-sm text-gray-600">Color: {item.color}</p>
                    <div className="flex items-center mt-2">
                      <button 
                        className="w-6 h-6 flex items-center justify-center border rounded-l"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="w-8 h-6 flex items-center justify-center border-t border-b">
                        {item.quantity}
                      </span>
                      <button 
                        className="w-6 h-6 flex items-center justify-center border rounded-r"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <CustomButton
                type="filled"
                title="Proceed to Checkout"
                handleClick={() => setCheckoutStep('shipping')}
                customStyles="w-full"
              />
              <CustomButton
                type="outline"
                title="Continue Shopping"
                handleClick={() => window.location.href = '/'}
                customStyles="w-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderShipping = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
      <form onSubmit={handleShippingSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={shippingDetails.fullName}
              onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={shippingDetails.email}
              onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={shippingDetails.address}
            onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={shippingDetails.city}
              onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={shippingDetails.state}
              onChange={(e) => setShippingDetails({...shippingDetails, state: e.target.value})}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={shippingDetails.zipCode}
              onChange={(e) => setShippingDetails({...shippingDetails, zipCode: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={shippingDetails.country}
              onChange={(e) => setShippingDetails({...shippingDetails, country: e.target.value})}
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <CustomButton
            type="outline"
            title="Back to Cart"
            handleClick={() => setCheckoutStep('cart')}
            customStyles="w-1/3"
          />
          <CustomButton
            type="filled"
            title="Continue to Payment"
            handleClick={handleShippingSubmit}
            customStyles="w-1/3"
          />
        </div>
      </form>
    </div>
  );

  const renderPayment = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`p-4 border rounded-md flex items-center justify-center ${
              paymentDetails.method === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setPaymentDetails({...paymentDetails, method: 'credit_card'})}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Credit Card
          </button>
          <button
            type="button"
            className={`p-4 border rounded-md flex items-center justify-center ${
              paymentDetails.method === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setPaymentDetails({...paymentDetails, method: 'paypal'})}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            PayPal
          </button>
          <button
            type="button"
            className={`p-4 border rounded-md flex items-center justify-center ${
              paymentDetails.method === 'apple_pay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setPaymentDetails({...paymentDetails, method: 'apple_pay'})}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Apple Pay
          </button>
          <button
            type="button"
            className={`p-4 border rounded-md flex items-center justify-center ${
              paymentDetails.method === 'google_pay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setPaymentDetails({...paymentDetails, method: 'google_pay'})}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Google Pay
          </button>
          <button
            type="button"
            className={`p-4 border rounded-md flex items-center justify-center ${
              paymentDetails.method === 'crypto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setPaymentDetails({...paymentDetails, method: 'crypto'})}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cryptocurrency
          </button>
        </div>
      </div>
      
      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        {/* Credit Card Fields */}
        {paymentDetails.method === 'credit_card' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name on Card</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={paymentDetails.cardName}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                  placeholder="123"
                />
              </div>
            </div>
          </>
        )}
        
        {/* PayPal Fields */}
        {paymentDetails.method === 'paypal' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">PayPal Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={paymentDetails.paypalEmail}
              onChange={(e) => setPaymentDetails({...paymentDetails, paypalEmail: e.target.value})}
              placeholder="your.email@example.com"
            />
          </div>
        )}
        
        {/* Cryptocurrency Fields */}
        {paymentDetails.method === 'crypto' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cryptocurrency</label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={paymentDetails.cryptoCurrency}
                onChange={(e) => setPaymentDetails({...paymentDetails, cryptoCurrency: e.target.value})}
              >
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="litecoin">Litecoin (LTC)</option>
                <option value="dogecoin">Dogecoin (DOGE)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={paymentDetails.cryptoWalletAddress}
                onChange={(e) => setPaymentDetails({...paymentDetails, cryptoWalletAddress: e.target.value})}
                placeholder="Enter your wallet address"
              />
            </div>
          </>
        )}
        
        {/* Apple Pay and Google Pay don't need additional fields */}
        {(paymentDetails.method === 'apple_pay' || paymentDetails.method === 'google_pay') && (
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700">
              {paymentDetails.method === 'apple_pay' 
                ? 'You will be redirected to Apple Pay to complete your purchase.' 
                : 'You will be redirected to Google Pay to complete your purchase.'}
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-bold">${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <CustomButton
              type="outline"
              title="Back to Shipping"
              handleClick={() => setCheckoutStep('shipping')}
              customStyles="w-1/3"
            />
            <CustomButton
              type="filled"
              title="Place Order"
              handleClick={handlePaymentSubmit}
              customStyles="w-1/3"
            />
          </div>
        </div>
      </form>
    </div>
  );

  const renderSuccess = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      
      <motion.h2 
        className="text-3xl font-bold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Order Successful!
      </motion.h2>
      
      <motion.p 
        className="text-gray-600 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Thank you for your purchase. Your order has been placed and will be processed shortly.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <CustomButton
          type="filled"
          title="Continue Shopping"
          handleClick={() => window.location.href = '/'}
          customStyles="w-full"
        />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <AnimatePresence>
        {message && (
          <motion.div 
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={checkoutStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {checkoutStep === 'cart' && renderCart()}
          {checkoutStep === 'shipping' && renderShipping()}
          {checkoutStep === 'payment' && renderPayment()}
          {checkoutStep === 'success' && renderSuccess()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CartPage; 