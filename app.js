const API_URL = "https://inventario-backend1-1.onrender.com/productos";
// 1. Función para obtener y listar productos
async function obtenerProductos() {
    try {
        const respuesta = await fetch(API_URL);
        const productos = await respuesta.json();
        const tabla = document.getElementById('tabla');
        
        tabla.innerHTML = '';
        
        productos.forEach(prod => {
            tabla.innerHTML += `
                <tr>
                    <td>${prod.nombre}</td>
                    <td>$${prod.precio}</td>
                    <td>${prod.existencia}</td>
                    <td>
                        <button onclick="eliminarProducto('${prod._id}')" style="background:red; color:white; border:none; cursor:pointer; padding:5px 10px;">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// 2. Función para registrar producto (Create)
document.getElementById('formProducto').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nuevoProducto = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        existencia: document.getElementById('existencia').value
    };

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
    });
    
    e.target.reset(); // Limpia el formulario
    obtenerProductos(); // Recarga la tabla
});

// 3. Función para eliminar producto (Delete)
async function eliminarProducto(id) {
    if(confirm('¿Seguro que deseas eliminar este producto?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        obtenerProductos();
    }
}

// Cargar productos al abrir la página
obtenerProductos();