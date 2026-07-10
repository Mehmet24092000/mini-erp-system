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

app.get("/", (req, res) => {
  res.json({
    message: "Mini ERP API läuft",
  });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const { articleNumber, name, category, stock, price, supplier } = req.body;

  if (
    !articleNumber ||
    !name ||
    !category ||
    stock === undefined ||
    price === undefined ||
    !supplier
  ) {
    return res.status(400).json({
      message: "Bitte alle Felder ausfüllen.",
    });
  }

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