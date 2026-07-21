import { useEffect, useState } from "react";
import "./index.css";

const API_URL = "https://mini-erp-system-56nk.onrender.com/api/products";
function App() {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    articleNumber: "",
    name: "",
    category: "",
    stock: "",
    price: "",
    supplier: "",
  });

  const [editingProductId, setEditingProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  async function loadProducts() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Fehler beim Laden der Produkte:", error);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setFormData({
      articleNumber: "",
      name: "",
      category: "",
      stock: "",
      price: "",
      supplier: "",
    });

    setEditingProductId(null);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const url = editingProductId
      ? `${API_URL}/${editingProductId}`
      : API_URL;

    const method = editingProductId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Bitte alle Felder ausfüllen.");
        return;
      }

      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
  }

  function startEditing(product) {
    setEditingProductId(product.id);

    setFormData({
      articleNumber: product.articleNumber,
      name: product.name,
      category: product.category,
      stock: String(product.stock),
      price: String(product.price),
      supplier: product.supplier,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function updateStock(id, quantityChange) {
    try {
      const response = await fetch(`${API_URL}/${id}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantityChange }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Bestand konnte nicht aktualisiert werden.");
        return;
      }

      loadProducts();
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Bestands:", error);
    }
  }

  async function deleteProduct(id) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (editingProductId === id) {
        resetForm();
      }

      loadProducts();
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  }

  const categories = [...new Set(products.map((product) => product.category))];

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      product.articleNumber.toLowerCase().includes(search) ||
      product.name.toLowerCase().includes(search) ||
      product.supplier.toLowerCase().includes(search);

    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "available" && Number(product.stock) > 0) ||
      (stockFilter === "low" &&
        Number(product.stock) > 0 &&
        Number(product.stock) <= 5) ||
      (stockFilter === "out" && Number(product.stock) === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock),
    0
  );
  const totalValue = products.reduce(
    (sum, product) => sum + Number(product.stock) * Number(product.price),
    0
  );

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="label">Mini ERP System</p>
          <h1>Artikel- und Lagerverwaltung</h1>
          <p>
            Eine kleine Fullstack-Anwendung zur Verwaltung von Artikeln,
            Lagerbestand, Lieferanten und Preisen.
          </p>
        </div>

        <div className="hero-card">
          <span>Fullstack-Projekt</span>
          <strong>React · Node.js · Express</strong>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <span>Artikel</span>
          <strong>{totalProducts}</strong>
        </div>

        <div className="stat-card">
          <span>Gesamtbestand</span>
          <strong>{totalStock}</strong>
        </div>

        <div className="stat-card">
          <span>Lagerwert</span>
          <strong>{totalValue.toFixed(2)} €</strong>
        </div>
      </section>

      <section className="content-grid">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>
            {editingProductId
              ? "Artikel bearbeiten"
              : "Neuen Artikel anlegen"}
          </h2>

          <input
            name="articleNumber"
            placeholder="Artikelnummer, z. B. MAT-1003"
            value={formData.articleNumber}
            onChange={handleChange}
          />

          <input
            name="name"
            placeholder="Artikelname"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="category"
            placeholder="Kategorie"
            value={formData.category}
            onChange={handleChange}
          />

          <input
            name="stock"
            type="number"
            placeholder="Lagerbestand"
            value={formData.stock}
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Preis"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            name="supplier"
            placeholder="Lieferant"
            value={formData.supplier}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit">
              {editingProductId ? "Änderungen speichern" : "Artikel speichern"}
            </button>

            {editingProductId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Abbrechen
              </button>
            )}
          </div>
        </form>

        <section className="table-card">
          <div className="table-header">
            <div>
              <h2>Artikelübersicht</h2>
              <p className="filter-summary">
                {filteredProducts.length} von {products.length} Artikeln werden
                angezeigt
              </p>
            </div>
          </div>

          <div className="filters">
            <input
              className="filter-control"
              placeholder="Suchen nach Artikelnummer, Name oder Lieferant..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              className="filter-control"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="">Alle Kategorien</option>
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="filter-control"
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
            >
              <option value="all">Alle Bestände</option>
              <option value="available">Verfügbar</option>
              <option value="low">Niedriger Bestand</option>
              <option value="out">Ausverkauft</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Artikelnummer</th>
                  <th>Name</th>
                  <th>Kategorie</th>
                  <th>Bestand</th>
                  <th>Preis</th>
                  <th>Lieferant</th>
                  <th>Bestand buchen</th>
                  <th>Aktionen</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.articleNumber}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>
                      <span
                        className={
                          product.stock <= 5
                            ? "stock-badge low"
                            : "stock-badge"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td>{Number(product.price).toFixed(2)} €</td>
                    <td>{product.supplier}</td>
                    <td>
                      <div className="stock-actions">
                        <button
                          className="stock-btn plus"
                          onClick={() => updateStock(product.id, 1)}
                        >
                          +1
                        </button>

                        <button
                          className="stock-btn plus"
                          onClick={() => updateStock(product.id, 10)}
                        >
                          +10
                        </button>

                        <button
                          className="stock-btn minus"
                          onClick={() => updateStock(product.id, -1)}
                        >
                          -1
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="edit-btn"
                          onClick={() => startEditing(product)}
                        >
                          Bearbeiten
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Löschen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <p className="empty-state">
                Keine Artikel gefunden. Passe die Suche oder Filter an.
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;