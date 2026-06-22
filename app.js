const API_URL = "https://inventario-backend1-1.onrender.com/productos";

// 1. Obtener y mostrar productos
async function obtenerProductos() {
    try {
        const res = await fetch(API_URL);
        const productos = await res.json();
        mostrarTabla(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

// 2. Renderizar tabla
function mostrarTabla(productos) {
    const tabla = document.getElementById('tabla');
    tabla.innerHTML = '';
    productos.forEach(p => {
        tabla.innerHTML += `<tr>
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.existencia}</td>
            <td>
                <button onclick="editarProducto('${p._id}', '${p.nombre}', ${p.precio}, ${p.existencia})" style="background:orange; color:white; border:none; padding:5px; cursor:pointer;">Editar</button>
                <button onclick="eliminarProducto('${p._id}')" style="background:red; color:white; border:none; padding:5px; cursor:pointer;">Eliminar</button>
            </td>
        </tr>`;
    });
}

// 3. Registrar nuevo producto (POST)
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
    e.target.reset();
    obtenerProductos();
});

// 4. Buscar / Filtrar
function filtrarProductos() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    fetch(API_URL)
        .then(res => res.json())
        .then(productos => {
            const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda));
            mostrarTabla(filtrados);
        });
}

// 5. Editar (PUT)
async function editarProducto(id, nombre, precio, existencia) {
    const n = prompt("Nuevo nombre:", nombre);
    const p = prompt("Nuevo precio:", precio);
    const e = prompt("Nueva cantidad:", existencia);

    if (n && p && e) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nombre: n, precio: p, existencia: e })
        });
        obtenerProductos();
    }
}

// 6. Eliminar (DELETE)
async function eliminarProducto(id) {
    if(confirm('¿Seguro que deseas eliminar este producto?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        obtenerProductos();
    }
}

// Inicializar
obtenerProductos();