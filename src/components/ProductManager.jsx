import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8081/api";

function ProductManager({ onCartUpdated }) {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [price, setPrice] = useState("");
  const [productId, setProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  const fetchProducts = async (page = 0) => {
    try {
      const response = await axios.get(
        `${API_BASE}/products?page=${page}&size=${pageSize}`
      );
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/types`);
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const saveProduct = async () => {
    if (productId) {
      try {
        await axios.put(`${API_BASE}/products/${productId}`, {
          name,
          typeId: parseInt(typeId),
          price: parseFloat(price),
        });
        alert("Produk berhasil diperbarui!");
        resetForm();
        fetchProducts(currentPage);
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Gagal memperbarui produk.");
      }
    } else {
      try {
        await axios.post(`${API_BASE}/products`, {
          name,
          typeId: parseInt(typeId),
          price: parseFloat(price),
        });
        alert("Produk berhasil ditambahkan!");
        resetForm();
        fetchProducts(currentPage);
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Gagal menambahkan produk.");
      }
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/products/${id}`);
      alert("Produk berhasil dihapus!");
      fetchProducts(currentPage);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk.");
    }
  };

  const addToCart = async () => {
    try {
      await axios.post(`${API_BASE}/order/add-to-cart`, null, {
        params: { productId: selectedProduct.id, quantity },
      });
      alert("Produk berhasil ditambahkan ke keranjang!");
      onCartUpdated(); // Trigger untuk refresh keranjang
      closeModal();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Gagal menambahkan ke keranjang.");
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity("");
    setIsModalOpen(false);
  };

  const editProduct = (product) => {
    setProductId(product.id);
    setName(product.name);
    setTypeId(product.type.id);
    setPrice(product.price);
  };

  const resetForm = () => {
    setName("");
    setTypeId("");
    setPrice("");
    setProductId(null);
  };

  const changePage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchProducts(page);
    }
  };

  const renderPagination = () => {
    const siblings = 1; // Number of sibling pages to display
    const pagination = [];

    for (
      let i = Math.max(0, currentPage - siblings);
      i <= Math.min(totalPages - 1, currentPage + siblings);
      i++
    ) {
      pagination.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => changePage(i)}>
            {i + 1}
          </button>
        </li>
      );
    }

    if (currentPage - siblings > 0) {
      pagination.unshift(
        <li key="start" className="page-item">
          <button className="page-link" onClick={() => changePage(0)}>
            1
          </button>
        </li>
      );
      if (currentPage - siblings > 1) {
        pagination.splice(
          1,
          0,
          <li key="dots-start" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    if (currentPage + siblings < totalPages - 1) {
      pagination.push(
        <li key="dots-end" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
      pagination.push(
        <li key="end" className="page-item">
          <button
            className="page-link"
            onClick={() => changePage(totalPages - 1)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return (
      <nav aria-label="Pagination">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => changePage(currentPage - 1)}
            >
              &laquo; Previous
            </button>
          </li>
          {pagination}
          <li
            className={`page-item ${
              currentPage === totalPages - 1 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => changePage(currentPage + 1)}
            >
              Next &raquo;
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  useEffect(() => {
    fetchProducts(currentPage);
    fetchTypes();
  }, [currentPage]);

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
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => deleteProduct(product.id)}
                >
                  Hapus
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => openModal(product)}
                >
                  Tambah ke Keranjang
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderPagination()}

      {isModalOpen && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tambah ke Keranjang</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>Produk: {selectedProduct?.name}</p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Jumlah"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Batal
                </button>
                <button className="btn btn-primary" onClick={addToCart}>
                  Tambahkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManager;
