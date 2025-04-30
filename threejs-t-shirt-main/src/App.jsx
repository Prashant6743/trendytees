import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Canvas from "./canvas/index.jsx";
import Customizer from "./pages/Customizer.jsx";
import Home from "./pages/Home.jsx";
import CartPage from "./components/CartPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <main className="app transition-all ease-in">
            <Home />
            <Canvas />
            <Customizer />
          </main>
        } />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
