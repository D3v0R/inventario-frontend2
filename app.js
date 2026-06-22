const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conexión exitosa a MongoDB Atlas"))
  .catch(err => console.error("Error de conexión:", err));

const ProductoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  existencia: Number
});

const Producto = mongoose.model('Producto', ProductoSchema);

// --- CRUD ---
app.get('/productos', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

app.post('/productos', async (req, res) => {
  const nuevoProducto = new Producto(req.body);
  await nuevoProducto.save();
  res.json(nuevoProducto);
});

app.put('/productos/:id', async (req, res) => {
  const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(productoActualizado);
});

app.delete('/productos/:id', async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Eliminado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));