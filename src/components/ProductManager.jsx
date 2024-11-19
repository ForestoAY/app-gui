import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8081/api";

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]); // Untuk menyimpan daftar tipe
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

  // Fetch all types
  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/types`);
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
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
    setTypeId(product.type.id); // Isi typeId dengan ID dari tipe
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
    fetchTypes();
  }, []);

  return (
    <div className="mb-5">
      <h2 className="mb-4">Kelola Produk</h2>
      <div className="mb-3">
        <div className="row g-2">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Nama Produk"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col">
            <select
              className="form-select"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
            >
              <option value="">Pilih Tipe</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Harga Produk"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={saveProduct}>
              {productId ? "Update Produk" : "Tambah Produk"}
            </button>
          </div>
          {productId && (
            <div className="col-auto">
              <button className="btn btn-secondary" onClick={resetForm}>
                Batal
              </button>
            </div>
          )}
        </div>
      </div>
      <table className="table table-striped">
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
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(product.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManager;
