import { useEffect, useState } from "react";
import "./index.css";

const API_URL = "http://localhost:5000/api/products";

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

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        alert("Bitte alle Felder ausfüllen.");
        return;
      }

      setFormData({
        articleNumber: "",
        name: "",
        category: "",
        stock: "",
        price: "",
        supplier: "",
      });

      loadProducts();
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
  }

  async function deleteProduct(id) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      loadProducts();
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  }

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce(
    (sum, product) => sum + product.stock * product.price,
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
          <h2>Neuen Artikel anlegen</h2>

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

          <button type="submit">Artikel speichern</button>
        </form>

        <section className="table-card">
          <h2>Artikelübersicht</h2>

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
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.articleNumber}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{product.price.toFixed(2)} €</td>
                    <td>{product.supplier}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;