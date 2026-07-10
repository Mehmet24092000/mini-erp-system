const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let products = [
  {
    id: 1,
    articleNumber: "MAT-1001",
    name: "Laptop",
    category: "IT-Hardware",
    stock: 12,
    price: 899.99,
    supplier: "TechSupplier GmbH",
  },
  {
    id: 2,
    articleNumber: "MAT-1002",
    name: "Monitor",
    category: "IT-Hardware",
    stock: 25,
    price: 179.99,
    supplier: "Office Solutions Berlin",
  },
];

function validateProductData(data) {
  const { articleNumber, name, category, stock, price, supplier } = data;

  return (
    articleNumber &&
    name &&
    category &&
    stock !== undefined &&
    price !== undefined &&
    supplier
  );
}

app.get("/", (req, res) => {
  res.json({
    message: "Mini ERP API läuft",
  });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  if (!validateProductData(req.body)) {
    return res.status(400).json({
      message: "Bitte alle Felder ausfüllen.",
    });
  }

  const { articleNumber, name, category, stock, price, supplier } = req.body;

  const newProduct = {
    id: Date.now(),
    articleNumber,
    name,
    category,
    stock: Number(stock),
    price: Number(price),
    supplier,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);

  if (!validateProductData(req.body)) {
    return res.status(400).json({
      message: "Bitte alle Felder ausfüllen.",
    });
  }

  const productIndex = products.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      message: "Artikel wurde nicht gefunden.",
    });
  }

  const { articleNumber, name, category, stock, price, supplier } = req.body;

  const updatedProduct = {
    id: productId,
    articleNumber,
    name,
    category,
    stock: Number(stock),
    price: Number(price),
    supplier,
  };

  products[productIndex] = updatedProduct;

  res.json({
    message: "Artikel wurde aktualisiert.",
    product: updatedProduct,
  });
});

app.patch("/api/products/:id/stock", (req, res) => {
  const productId = Number(req.params.id);
  const { quantityChange } = req.body;

  const product = products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({
      message: "Artikel wurde nicht gefunden.",
    });
  }

  if (quantityChange === undefined || Number.isNaN(Number(quantityChange))) {
    return res.status(400).json({
      message: "Bitte eine gültige Bestandsänderung angeben.",
    });
  }

  const newStock = product.stock + Number(quantityChange);

  if (newStock < 0) {
    return res.status(400).json({
      message: "Der Lagerbestand darf nicht unter 0 fallen.",
    });
  }

  product.stock = newStock;

  res.json({
    message: "Lagerbestand wurde aktualisiert.",
    product,
  });
});

app.delete("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);

  products = products.filter((product) => product.id !== productId);

  res.json({
    message: "Artikel wurde gelöscht.",
  });
});

app.listen(PORT, () => {
  console.log(`Mini ERP Server läuft auf http://localhost:${PORT}`);
});