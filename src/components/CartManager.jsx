import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8081/api";

function CartManager() {
  const [carts, setCarts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  // Fetch all carts
  const fetchCarts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/order/cart`);
      setCarts(response.data);
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
  };

  // Add product to cart
  const addToCart = async () => {
    try {
      await axios.post(`${API_BASE}/order/add-to-cart`, null, {
        params: { productId, quantity },
      });
      alert("Produk berhasil ditambahkan ke keranjang!");
      fetchCarts();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Gagal menambahkan ke keranjang.");
    }
  };

  // Place order
  const placeOrder = async () => {
    try {
      await axios.post(`${API_BASE}/order/place-order`);
      alert("Keranjang berhasil diselesaikan!");
      fetchCarts();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Gagal menyelesaikan keranjang.");
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <div>
      <h2>Kelola Keranjang</h2>
      <div>
        <input
          type="number"
          placeholder="ID Produk"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Jumlah"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button onClick={addToCart}>Tambah ke Keranjang</button>
        <button onClick={placeOrder}>Selesaikan Keranjang</button>
      </div>
      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Total Item</th>
            <th>Total Harga</th>
            <th>Detail Produk</th>
          </tr>
        </thead>
        <tbody>
          {carts.map((cart) => (
            <tr key={cart.id}>
              <td>{cart.id}</td>
              <td>{cart.isPlaced ? "Selesai" : "Aktif"}</td>
              <td>{cart.items.length}</td>
              <td>{cart.totalAmount || 0}</td>
              <td>
                <ul>
                  {cart.items.map((item) => (
                    <li key={item.product.id}>
                      {item.product.name} - Jumlah: {item.quantity} - Subtotal:{" "}
                      {item.product.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CartManager;
