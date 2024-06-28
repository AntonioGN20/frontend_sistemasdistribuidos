import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

const SERVER_URLS = [
    'http://localhost:3001', 
    'http://172.168.2.21:3001', 
];

const Usuarios = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            for (const serverUrl of SERVER_URLS) {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        throw new Error('No token provided');
                    }
                    const response = await axios.get(`${serverUrl}/usuarios`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUsers(response.data);
                    return; // Salir de la función si la solicitud es exitosa
                } catch (error) {
                    console.error(`Error fetching users from ${serverUrl}:`, error);
                }
            }
            alert('Error fetching users: All servers failed');
        };
        fetchUsers();
    }, []);

    return (
        <div className="lista-container">
            <h1>Lista de Usuarios</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.usuario}>{user.usuario}</li>
                ))}
            </ul>
            <Link to="/productos" className="ver-productos">Ver Productos</Link>
            <Link to="/cajas" className="ver-cajas">Ver Cajas</Link>
            <Link to="/categorias" className="ver-productos">Ver Categorías</Link>
        </div>
    );
};

export default Usuarios;


