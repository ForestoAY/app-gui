import React from "react";
import ProductManager from "./components/ProductManager";
import CartManager from "./components/CartManager";

function App() {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">API GUI Tester</h1>
      <ProductManager />
      <CartManager />
    </div>
  );
}

export default App;
