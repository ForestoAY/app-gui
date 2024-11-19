import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8081/api";

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [price, setPrice] = useState("");
  const [productId, setProductId] = useState(null); // Untuk menyimpan ID produk yang sedang diupdate

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/products?page=0&size=10`);
      setProducts(response.data.content);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Add or update product
  const saveProduct = async () => {
    if (productId) {
      // Update existing product
      try {
        await axios.put(`${API_BASE}/products/${productId}`, {
          name,
          typeId: parseInt(typeId),
          price: parseFloat(price),
        });
        alert("Produk berhasil diperbarui!");
        setProductId(null); // Reset ID setelah update
        resetForm();
        fetchProducts();
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Gagal memperbarui produk.");
      }
    } else {
      // Add new product
      try {
        await axios.post(`${API_BASE}/products`, {
          name,
          typeId: parseInt(typeId),
          price: parseFloat(price),
        });
        alert("Produk berhasil ditambahkan!");
        resetForm();
        fetchProducts();
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Gagal menambahkan produk.");
      }
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/products/${id}`);
      alert("Produk berhasil dihapus!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk.");
    }
  };

  // Edit product (prefill form)
  const editProduct = (product) => {
    setProductId(product.id);
    setName(product.name);
    setTypeId(product.type.id);
    setPrice(product.price);
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setTypeId("");
    setPrice("");
    setProductId(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Kelola Produk</h2>
      <div>
        <input
          type="text"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="ID Tipe Produk"
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Harga Produk"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={saveProduct}>
          {productId ? "Update Produk" : "Tambah Produk"}
        </button>
        {productId && <button onClick={resetForm}>Batal</button>}
      </div>
      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Tipe</th>
            <th>Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.type.name}</td>
              <td>{product.price}</td>
              <td>
                <button onClick={() => editProduct(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManager;
