require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB verbunden");
  })
  .catch((error) => {
    console.error("MongoDB-Verbindung fehlgeschlagen:", error.message);
  });

app.get("/", (req, res) => {
  res.json({
    message: "Mini ERP API läuft",
  });
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Produkte konnten nicht geladen werden.",
    });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    if (!validateProductData(req.body)) {
      return res.status(400).json({
        message: "Bitte alle Felder ausfüllen.",
      });
    }

    const { articleNumber, name, category, stock, price, supplier } = req.body;

    const newProduct = await Product.create({
      articleNumber,
      name,
      category,
      stock: Number(stock),
      price: Number(price),
      supplier,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({
      message: "Artikel konnte nicht erstellt werden.",
    });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    if (!validateProductData(req.body)) {
      return res.status(400).json({
        message: "Bitte alle Felder ausfüllen.",
      });
    }

    const { articleNumber, name, category, stock, price, supplier } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        articleNumber,
        name,
        category,
        stock: Number(stock),
        price: Number(price),
        supplier,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Artikel wurde nicht gefunden.",
      });
    }

    res.json({
      message: "Artikel wurde aktualisiert.",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Artikel konnte nicht aktualisiert werden.",
    });
  }
});

app.patch("/api/products/:id/stock", async (req, res) => {
  try {
    const { quantityChange } = req.body;

    if (quantityChange === undefined || Number.isNaN(Number(quantityChange))) {
      return res.status(400).json({
        message: "Bitte eine gültige Bestandsänderung angeben.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Artikel wurde nicht gefunden.",
      });
    }

    const newStock = product.stock + Number(quantityChange);

    if (newStock < 0) {
      return res.status(400).json({
        message: "Der Lagerbestand darf nicht unter 0 fallen.",
      });
    }

    product.stock = newStock;
    await product.save();

    res.json({
      message: "Lagerbestand wurde aktualisiert.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lagerbestand konnte nicht aktualisiert werden.",
    });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Artikel wurde nicht gefunden.",
      });
    }

    res.json({
      message: "Artikel wurde gelöscht.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Artikel konnte nicht gelöscht werden.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Mini ERP Server läuft auf http://localhost:${PORT}`);
});