import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8081/api";

function CartManager({ refreshTrigger }) {
  const [carts, setCarts] = useState([]);

  // Fetch all carts
  const fetchCarts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/order/cart`);
      setCarts(response.data);
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
  };

  // Place order
  const placeOrder = async (cartId) => {
    try {
      await axios.post(`${API_BASE}/order/place-order`, null, {
        params: { cartId },
      });
      alert(`Keranjang ${cartId} berhasil diselesaikan!`);
      fetchCarts();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Gagal menyelesaikan keranjang.");
    }
  };

  useEffect(() => {
    fetchCarts();
  }, [refreshTrigger]);

  return (
    <div className="mt-5">
      <h2 className="mb-4">Kelola Keranjang</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Total Item</th>
            <th>Total Harga</th>
            <th>Detail Produk</th>
            <th>Aksi</th>
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
              <td>
                {!cart.isPlaced && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => placeOrder(cart.id)}
                  >
                    Selesaikan Keranjang
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CartManager;
