import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function VisionMision() {
  // Estado para controlar el efecto hover del botón
  const [isHovered, setIsHovered] = useState(false);

  // Estilo base reutilizable con contorno dorado difuminado
  const tarjetaEstilo = {
    flex: '1 1 280px',
    maxWidth: '380px',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    padding: '30px 25px',
    borderRadius: '16px',
    border: '2px solid #f59e0b',
    boxShadow: '0 0 20px rgba(245, 158, 11, 0.45), 0 8px 25px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', margin: '30px 0', padding: '60px 0', backgroundColor: '#1e293b' }}>
      
      {/* Video de fondo en bucle */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      >
        <source src="/cielo.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      {/* Capa oscura semitransparente */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        zIndex: 1
      }}></div>

      {/* Contenido ajustado al 70% del ancho de la pantalla */}
      <div style={{ width: '70%', minWidth: '320px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        <h2 style={{ color: '#fff', textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '35px', textShadow: '0 3px 10px rgba(0,0,0,0.9)' }}>
          ✨ Nuestra Identidad
        </h2>
        
        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch' }}>
          
          {/* Misión */}
          <div style={tarjetaEstilo}>
            <div>
              <h3 style={{ color: '#1e3a8a', margin: '0 0 15px 0', textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>🎯 Misión</h3>
              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify', color: '#1f2937', fontSize: '1.1rem', fontWeight: '500' }}>
                Ser un refugio Cristo-céntrico donde los afligidos, endeudados y amargados de espíritu encuentran sanidad, propósito y pertenencia, siendo transformados por el amor de Jesús para convertirse en sus seguidores y guerreros espirituales.
              </p>
            </div>
          </div>

          {/* Valores (VERSIÓN RESUMIDA) */}
          <div style={tarjetaEstilo}>
            <div>
              <h3 style={{ color: '#1e3a8a', margin: '0 0 15px 0', textAlign: 'center', fontSize: '1.rem', fontWeight: 'bold' }}>💖 Valores</h3>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#1f2937', lineHeight: '1.6', textAlign: 'left', fontSize: '1.1rem', fontWeight: '500' }}>
                <li><strong>Amor y Servicio:</strong> Fortalecer a las familias.</li>
                <li><strong>Gracia Incondicional:</strong> Refugio seguro.</li>
                <li><strong>Transformación:</strong> De la herida al carácter.</li>
                <li><strong>Dependencia Total:</strong> Oración y Palabra.</li>
                <li><strong>Comunidad Auténtica:</strong> Pertenencia en fe.</li>
                <li><strong>Propósito y Misión:</strong> Impactar el entorno.</li>
              </ul>
            </div>
          </div>

          {/* Visión */}
          <div style={tarjetaEstilo}>
            <div>
              <h3 style={{ color: '#1e3a8a', margin: '0 0 15px 0', textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>👁️ Visión</h3>
              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify', color: '#1f2937', fontSize: '1.1rem', fontWeight: '500' }}>
                Ser una iglesia relevante y transformadora en González Catán. Una comunidad que refleja el corazón de Cristo, transformando vidas en LA CUEVA para que cada persona pase de ser un marginado a un adorador y guerrero que impacta su generación.
              </p>
            </div>
          </div>

        </div>

        {/* Botón Ver Más con Hover */}
        <div style={{ textAlign: 'center', marginTop: '45px' }}>
          <Link 
            to="/identidad" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
              display: 'inline-block',
              backgroundColor: isHovered ? '#b45309' : '#f59e0b', // Transición de dorado brillante a dorado más oscuro
              color: isHovered ? '#ffffff' : '#0f172a',
              padding: '16px 36px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              textDecoration: 'none',
              border: '2px solid #f59e0b',
              boxShadow: isHovered 
                ? '0 0 25px rgba(245, 158, 11, 0.8), 0 6px 20px rgba(0,0,0,0.6)' 
                : '0 0 15px rgba(245, 158, 11, 0.4), 0 4px 12px rgba(0,0,0,0.4)',
              transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
              transition: 'all 0.3s ease'
            }}
          >
            Ver más sobre Nuestra Identidad →
          </Link>
        </div>

      </div>

    </div>
  );
}