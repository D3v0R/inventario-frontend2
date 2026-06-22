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

// Esquema NoSQL de Mongoose
const ProductoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  existencia: Number
});

const Producto = mongoose.model('Producto', ProductoSchema);

// --- OPERACIONES CRUD ---

// 1. GET: Obtener todos los productos (Read)
app.get('/productos', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// 2. POST: Insertar un nuevo producto (Create)
app.post('/productos', async (req, res) => {
  const nuevoProducto = new Producto(req.body);
  await nuevoProducto.save();
  res.json({ mensaje: "Producto registrado", nuevoProducto });
});

// 3. PUT: Actualizar un producto existente (Update)
app.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ mensaje: "Producto actualizado", productoActualizado });
});

// 4. DELETE: Eliminar un producto (Delete)
app.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  await Producto.findByIdAndDelete(id);
  res.json({ mensaje: "Producto eliminado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));