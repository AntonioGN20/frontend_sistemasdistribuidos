import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const SERVER_URLS = [
    'http://localhost:3001', 
    'http://172.168.2.21:3001', 
];

const Cajas = () => {
    const [cajas, setCajas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editId, setEditId] = useState(null);
    const [editNombre, setEditNombre] = useState('');

    useEffect(() => {
        fetchCajas();
    }, []);

    const fetchCajas = async () => {
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token provided');
                }
                const response = await axios.get(`${serverUrl}/cajas`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCajas(response.data);
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error fetching boxes from ${serverUrl}:`, error);
            }
        }
        alert('Error fetching boxes: All servers failed');
    };

    const addCaja = async () => {
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                await axios.post(`${serverUrl}/cajas`, { nombre }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCajas();
                setNombre('');
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error adding box to ${serverUrl}:`, error);
            }
        }
        alert('Error adding box: All servers failed');
    };

    const updateCaja = async (id) => {
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`${serverUrl}/cajas/${id}`, { nombre: editNombre }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCajas();
                setEditId(null);
                setEditNombre('');
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error updating box on ${serverUrl}:`, error);
            }
        }
        alert('Error updating box: All servers failed');
    };

    const deleteCaja = async (id) => {
        for (const serverUrl of SERVER_URLS) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${serverUrl}/cajas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCajas();
                return; // Salir de la función si la solicitud es exitosa
            } catch (error) {
                console.error(`Error deleting box from ${serverUrl}:`, error);
            }
        }
        alert('Error deleting box: All servers failed');
    };

    return (
        <div className="lista-container">
            <h1>Cajas</h1>
            <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del cajero"
            />
            <button onClick={addCaja}>Agregar Caja</button>
            <ul>
                {cajas.map((caja) => (
                    <li key={caja.id}>
                        {editId === caja.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editNombre}
                                    onChange={(e) => setEditNombre(e.target.value)}
                                />
                                <button onClick={() => updateCaja(caja.id)}>Guardar</button>
                            </>
                        ) : (
                            <>
                                {caja.nombre}
                                <button onClick={() => { setEditId(caja.id); setEditNombre(caja.nombre); }}>Editar</button>
                                <button onClick={() => deleteCaja(caja.id)}>Eliminar</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cajas;
