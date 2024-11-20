import { useState } from "react";
import ProductManager from "./components/ProductManager";
import CartManager from "./components/CartManager";

function App() {
  const [refreshCart, setRefreshCart] = useState(false);

  const triggerCartRefresh = () => setRefreshCart(!refreshCart);

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Order System</h1>
      <ProductManager onCartUpdated={triggerCartRefresh} />
      <CartManager refreshTrigger={refreshCart} />
    </div>
  );
}

export default App;
