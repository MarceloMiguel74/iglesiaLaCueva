import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const texto = "La Cueva de Adulam";

  return (
    <nav className="navbar">
      
      {/* Logo y Título Animado */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img src="/logo.png" alt="Logo La Cueva de Adulam" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', display: 'flex' }}>
          {texto.split("").map((letra, index) => (
            <span 
              key={index} 
              className="letra-dorada"
              style={{ 
                width: letra === " " ? "8px" : "auto", 
                animationDelay: `${index * 0.1}s` 
              }}
            >
              {letra}
            </span>
          ))}
        </h1>
      </div>

      {/* Botón Hamburguesa */}
      <button 
        className="menu-hamburguesa"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        {menuAbierto ? '✖' : '☰'}
      </button>

      {/* Enlaces Completos */}
      <div className={`nav-links ${menuAbierto ? 'abierto' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuAbierto(false)}>Inicio</Link>
        <Link to="/identidad" className="nav-link" onClick={() => setMenuAbierto(false)}>Ntra Identidad</Link>
        <Link to="/mensajes" className="nav-link" onClick={() => setMenuAbierto(false)}>Mensajes</Link>
        <Link to="/cartelera" className="nav-link" onClick={() => setMenuAbierto(false)}>Cartelera</Link>
        <Link to="/multimedia" className="nav-link" onClick={() => setMenuAbierto(false)}>Multimedia</Link>
        <Link to="/comunidad" className="nav-link" onClick={() => setMenuAbierto(false)}>Pedido Oración y Testimonios</Link>
        <Link to="/contacto" className="nav-link" onClick={() => setMenuAbierto(false)}>Contacto</Link>
      </div>
      
    </nav>
  );
}