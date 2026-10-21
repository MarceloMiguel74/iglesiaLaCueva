import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Agregamos { videoActual } como propiedad para que reciba el video desde Supabase
export function VideoInvitacion({ videoActual }) {
  // Usa el video destacado del administrador, o uno por defecto si está cargando
  const videoId = videoActual || "W7E8BsQR0qw";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      minHeight: '100vh', /* 👈 ESTO LO CONVIERTE EN UN HERO DE PANTALLA COMPLETA */
      overflow: 'hidden', 
      padding: '80px 0', 
      backgroundColor: '#1e293b',
      display: 'flex',          /* 👈 Flexbox para centrar verticalmente */
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      
      {/* MAGIA CSS RESPONSIVE */}
      <style>{`
        .contenedor-video {
          width: 70%;
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          text-align: center;
        }
        .titulo-video {
          color: #ffffff;
          font-size: 3.5rem; /* 👈 Letra más grande para el Hero */
          font-weight: bold;
          margin-bottom: 15px;
          text-shadow: 0 4px 15px rgba(0,0,0,1);
          line-height: 1.2; 
        }
        .subtitulo-video {
          color: #f8fafc;
          font-size: 1.4rem;
          font-weight: 500;
          margin-bottom: 45px;
          text-shadow: 0 3px 10px rgba(0,0,0,1);
          line-height: 1.5;
        }
        .btn-video {
          display: inline-block;
          border-radius: 8px;
          font-weight: bold;
          font-size: 1.2rem;
          text-decoration: none;
          padding: 16px 36px;
          border: 2px solid #f59e0b;
          transition: all 0.3s ease;
        }

        /* 📱 AJUSTES PARA CELULARES */
        @media (max-width: 768px) {
          .contenedor-video {
            width: 92%; 
          }
          .titulo-video {
            font-size: 2.5rem;
            line-height: 1.15; 
            margin-bottom: 15px;
          }
          .subtitulo-video {
            font-size: 1.15rem; 
            line-height: 1.4;
            margin-bottom: 35px;
            padding: 0 10px;
          }
          .btn-video {
            font-size: 1.1rem;
            padding: 14px 24px;
            display: block; 
            margin: 0 10px;
          }
        }
      `}</style>

      {/* Video de fondo en bucle */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          objectFit: 'cover', zIndex: 2 , filter: 'brightness(0.5)'
        }}
      >
        <source src="/adoracion.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      {/* Capa oscura semitransparente (Oscurecida un poco más para que lea bien el texto) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1 }}></div>

      <div className="contenedor-video">
        
        <h2 className="titulo-video">
          🎬 Video destacado
        </h2>
        
        <p className="subtitulo-video">
          Te compartimos el último mensaje. ¡Dios tiene una palabra para tu vida!
        </p>

        {/* Reproductor de Video */}
        <div style={{
          maxWidth: '850px', margin: '0 auto 55px auto', position: 'relative',
          paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px',
          border: '2px solid #f59e0b', boxShadow: '0 0 35px rgba(245, 158, 11, 0.6), 0 10px 40px rgba(0,0,0,0.8)',
          backgroundColor: '#000'
        }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Video Principal"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Botón interactivo */}
        <div>
          <Link 
            to="/multimedia" 
            className="btn-video"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
              backgroundColor: isHovered ? '#b45309' : '#f59e0b',
              color: isHovered ? '#ffffff' : '#0f172a',
              boxShadow: isHovered ? '0 0 25px rgba(245, 158, 11, 0.8), 0 6px 20px rgba(0,0,0,0.6)' : '0 0 15px rgba(245, 158, 11, 0.4), 0 4px 12px rgba(0,0,0,0.4)',
              transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            Ver más videos y mensajes ▶️
          </Link>
        </div>

      </div>

    </div>
  );
}