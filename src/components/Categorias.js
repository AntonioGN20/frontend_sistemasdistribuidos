import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const SERVER_URLS = [
    'http://localhost:3001', 
    'http://172.168.2.21:3001', 
];

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editId, setEditId] = useState(null);
    const [editNombre, setEditNombre] = useState('');

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token provided');
                }
                const response = await axios.get(`${serverUrl}/categorias`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategorias(response.data);
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error fetching categories from ${serverUrl}:`, error);
            }
        }
        alert('Error fetching categories: All servers failed');
    };

    const addCategoria = async () => {
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                await axios.post(`${serverUrl}/categorias`, { nombre }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCategorias();
                setNombre('');
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error adding category to ${serverUrl}:`, error);
            }
        }
        alert('Error adding category: All servers failed');
    };

    const updateCategoria = async (id) => {
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`${serverUrl}/categorias/${id}`, { nombre: editNombre }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCategorias();
                setEditId(null);
                setEditNombre('');
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error updating category on ${serverUrl}:`, error);
            }
        }
        alert('Error updating category: All servers failed');
    };

    const deleteCategoria = async (id) => {
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${serverUrl}/categorias/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCategorias();
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error deleting category from ${serverUrl}:`, error);
            }
        }
        alert('Error deleting category: All servers failed');
    };

    return (
        <div className="lista-container">
            <h1>Categorías</h1>
            <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre de la categoría"
            />
            <button onClick={addCategoria}>Agregar Categoría</button>
            <ul>
                {categorias.map((categoria) => (
                    <li key={categoria.id}>
                        {editId === categoria.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editNombre}
                                    onChange={(e) => setEditNombre(e.target.value)}
                                />
                                <button onClick={() => updateCategoria(categoria.id)}>Guardar</button>
                            </>
                        ) : (
                            <>
                                {categoria.nombre}
                                <button onClick={() => { setEditId(categoria.id); setEditNombre(categoria.nombre); }}>Editar</button>
                                <button onClick={() => deleteCategoria(categoria.id)}>Eliminar</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categorias;
