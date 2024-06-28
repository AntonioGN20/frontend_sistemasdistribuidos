import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Usuarios from './components/Usuarios';
import Productos from './components/Productos';
import Cajas from './components/Cajas';
import Categorias from './components/Categorias';
import './App.css';

const SERVER_URLS = [
    'http://localhost:3001', 
    'http://172.168.2.21:3001', 
];

function App() {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        for (const serverUrl of SERVER_URLS) {
            try {
                const response = await axios.post(`${serverUrl}/login`, {
                    usuario,
                    contraseña,
                });
                console.log('Respuesta del servidor:', response.data);
                if (response.data.message === 'Login successful') {
                    localStorage.setItem('token', response.data.token);
                    setLoggedIn(true);
                    return; // Salir de la función si el login es exitoso
                } else {
                    alert('Invalid credentials');
                }
            } catch (error) {
                console.error(`Error en la solicitud de inicio de sesión con ${serverUrl}:`, error);
            }
        }
        alert('Error logging in: All servers failed');
    };

    return (
        <Router>
            <div className="App">
                {!loggedIn ? (
                    <form className="form-container" onSubmit={handleLogin}>
                        <div className="formulario-grupo">
                            <label htmlFor="usuario">Usuario:</label>
                            <input
                                id="usuario"
                                type="text"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                        </div>
                        <div className="formulario-grupo">
                            <label htmlFor="contraseña">Contraseña:</label>
                            <input
                                id="contraseña"
                                type="password"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                ) : (
                    <Routes>
                        <Route path="/" element={<Usuarios />} />
                        <Route path="/productos" element={<Productos />} />
                        <Route path="/cajas" element={<Cajas />} />
                        <Route path="/categorias" element={<Categorias />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;
