import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/login.css';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos de inicio de sesión:', formData);
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2>WildCare</h2>
                <p className="subtitle">Ingresa tus datos para continuar</p>

                <form onSubmit={handleSubmit} id="loginForm">
                    <div className="form-group">
                        <label htmlFor="username">Nombre de usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Usuario"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn-submit">
                        Ingresar
                    </button>
                </form>

                <div className="login-footer">
                    <Link to="/">← Volver al inicio</Link>
                </div>
            </div>
        </div>
    );
}