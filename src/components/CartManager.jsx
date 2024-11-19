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
    <div className="mt-5">
      <h2 className="mb-4">Kelola Keranjang</h2>
      <div className="mb-3">
        <div className="row g-2">
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="ID Produk"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Jumlah"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={addToCart}>
              Tambah ke Keranjang
            </button>
          </div>
          <div className="col-auto">
            <button className="btn btn-success" onClick={placeOrder}>
              Selesaikan Keranjang
            </button>
          </div>
        </div>
      </div>
      <table className="table table-striped">
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
                <ul className="list-unstyled">
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
