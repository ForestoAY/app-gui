import React from "react";
import ProductManager from "./components/ProductManager";
import CartManager from "./components/CartManager";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>API GUI Tester</h1>
      <ProductManager />
      <CartManager />
    </div>
  );
}

export default App;
