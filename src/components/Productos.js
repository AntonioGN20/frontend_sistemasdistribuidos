import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

const SERVER_URLS = [
    'http://localhost:3001', 
    'http://172.168.2.21:3001', 
];

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token provided');
                }
                const response = await axios.get(`${serverUrl}/productos`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProductos(response.data);
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error fetching products from ${serverUrl}:`, error);
            }
        }
        alert('Error fetching products: All servers failed');
    };

    const addProducto = async (e) => {
        e.preventDefault();
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token provided');
                }
                await axios.post(`${serverUrl}/productos`, { nombre, precio }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProductos();
                setNombre('');
                setPrecio('');
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error adding product to ${serverUrl}:`, error);
            }
        }
        alert('Error adding product: All servers failed');
    };

    const deleteProducto = async (id) => {
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token provided');
                }
                await axios.delete(`${serverUrl}/productos/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProductos();
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error deleting product from ${serverUrl}:`, error);
            }
        }
        alert('Error deleting product: All servers failed');
    };

    return (
        <div className="lista-container">
            <h1>Productos</h1>
            <form className="formulario" onSubmit={addProducto}>
                <div className="formulario-grupo">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="formulario-grupo">
                    <label htmlFor="precio">Precio:</label>
                    <input
                        id="precio"
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Agregar Producto</button>
            </form>
            <h1>Lista de Productos</h1>
            <ul>
                {productos.map((producto) => (
                    <li key={producto.id}>
                        {producto.nombre} - ${producto.precio}
                        <button onClick={() => deleteProducto(producto.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <Link to="/" className="ver-productos">Volver a Usuarios</Link>
        </div>
    );
};

export default Productos;
