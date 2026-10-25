import React, { useState, useEffect } from 'react';
// IMPORTANTE: Agregamos useLocation aquí 👇
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './supabase';

// Componentes del Sitio
import { Navbar } from './NavBar';
import { VisionMision } from './VisionMision';
import IdentidadPage from './IdentidadPage';
import { Cartelera } from './Cartelera';
import { VideoInvitacion } from './VideoInvitacion';
import { SeccionMensajes } from './SeccionMensajes';
import { SeccionComunidad } from './SeccionComunidad';
import { PaginaMultimedia } from './PaginaMultimedia';
import { Contacto } from './Contacto';
import { Footer } from './Footer';
import { Admin } from './Admin';
import { Login } from './Login';

import './App.css';

// -------------------------------------------------------------
// COMPONENTE NUEVO: ScrollToTop (Lleva la vista arriba al cambiar de ruta)
// -------------------------------------------------------------
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando cambie la ruta, subimos el scroll a (0,0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente es invisible, no muestra nada
}

// -------------------------------------------------------------
// COMPONENTE: Último Mensaje (Para la Home)
// -------------------------------------------------------------
function UltimoMensajeHome() {
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchUltimoMensaje = async () => {
      try {
        const { data, error } = await supabase
          .from('mensajes')
          .select('*')
          .order('id', { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          setMensaje(data[0]);
        }
      } catch (err) {
        console.error("Error al cargar último mensaje:", err);
      }
    };
    fetchUltimoMensaje();
  }, []);

  if (!mensaje) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 className="titulo-seccion-doble">📖 Palabra de Vida</h3>
      
      <div className="tarjeta-home" style={{ borderTopColor: '#3b82f6' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>
          📅 {mensaje.fecha}
        </p>
        <h4 style={{ color: '#1e3a8a', margin: '0 0 15px 0', fontSize: '1.3rem', fontWeight: 'bold' }}>
          📌 {mensaje.titulo}
        </h4>
        <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
          📝 {mensaje.descripcion && mensaje.descripcion.length > 120 
              ? mensaje.descripcion.substring(0, 120) + '...' 
              : mensaje.descripcion}
        </p>
        <p style={{ color: '#0f172a', fontWeight: 'bold', margin: '0 0 25px 0' }}>
          📖 {mensaje.versiculo}
        </p>
        
        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <Link to="/mensajes" style={{
            display: 'inline-block', padding: '10px 20px', borderRadius: '8px',
            backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 'bold',
            textDecoration: 'none', border: '1px solid #bfdbfe', transition: 'background 0.3s'
          }}>
            Leer más mensajes →
          </Link>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// COMPONENTE: Carrusel de Reseñas (Estilo Google)
// -------------------------------------------------------------
function CarruselResenasHome() {
  const [resenas, setResenas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    fetchResenas();
  }, []);

  useEffect(() => {
    if (resenas.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % resenas.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [resenas]);

  const fetchResenas = async () => {
    try {
      const { data, error } = await supabase
        .from('mensajes_contacto')
        .select('*')
        .eq('motivo', 'Reseña')
        .eq('aprobada', true)
        .order('fecha', { ascending: false });

      if (data && data.length > 0) setResenas(data);
    } catch (err) {
      console.error("Excepción al traer reseñas:", err);
    }
  };

  if (resenas.length === 0) return null;

  const resenaActual = resenas[indiceActual];
  const inicial = resenaActual.nombre ? resenaActual.nombre.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 className="titulo-seccion-doble">⭐ Reseñas</h3>
      
      <div className="tarjeta-home" style={{ borderTopColor: '#f59e0b' }}>
        <div style={{ color: '#f59e0b', fontSize: '1.3rem', marginBottom: '15px', letterSpacing: '2px' }}>
          ⭐⭐⭐⭐⭐
        </div>
        <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: '1.6', marginBottom: '25px', fontStyle: 'italic' }}>
          "{resenaActual.mensaje}"
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: 'auto' }}>
          <div style={{
            width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#1e3a8a', 
            color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', 
            fontSize: '1.3rem', fontWeight: 'bold'
          }}>
            {inicial}
          </div>
          <div>
            <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.05rem', margin: 0 }}>
              {resenaActual.nombre}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
              Comunidad La Cueva de Adulam
            </p>
          </div>
        </div>

        {resenas.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            {resenas.map((_, index) => (
              <div key={index} onClick={() => setIndiceActual(index)}
                style={{
                  width: '10px', height: '10px', borderRadius: '50%', cursor: 'pointer',
                  transition: 'background 0.3s, transform 0.3s',
                  backgroundColor: index === indiceActual ? '#f59e0b' : '#cbd5e1',
                  transform: index === indiceActual ? 'scale(1.2)' : 'scale(1)'
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SeccionDiscipuladoHome() {
  return (
    <section className="seccion-discipulado" aria-labelledby="titulo-discipulado">
      <div className="contenido-discipulado">
        <div className="tarjeta-discipulado">
          <div className="texto-discipulado">
            <span className="etiqueta-discipulado">Discipulado · La Cueva de Adulam</span>
            <h2 id="titulo-discipulado">Sigamos creciendo juntos en la Palabra</h2>
            <p>
              Crea tu cuenta para guardar tu avance y continuar tus lecciones
              desde otros dispositivos.
            </p>
          </div>
          <div className="detalles-discipulado" aria-label="Sobre el discipulado">
            <div className="detalle-discipulado">
              <span aria-hidden="true">📖</span>
              <strong>Seis niveles</strong>
            </div>
            <div className="detalle-discipulado">
              <span aria-hidden="true">✍️</span>
              <strong>46 lecciones</strong>
            </div>
            <div className="detalle-discipulado">
              <span aria-hidden="true">💻</span>
              <strong>Tu progreso viaja contigo</strong>
            </div>
          </div>
          <a
            className="boton-discipulado"
            href="https://www.discipulado.micuevadeadulam.org"
          >
            Ir al discipulado <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// COMPONENTE: Inicio (Vidriera Principal)
// -------------------------------------------------------------
function Inicio({ videoActual }) {
  const [visitas, setVisitas] = useState(0);

  useEffect(() => {
    const registrarVisitaInicio = async () => {
      try {
        const { data } = await supabase.from('visitas_paginas').select('conteo').eq('ruta', '/inicio').single();
        if (data) {
          const nuevasVisitas = data.conteo + 1;
          setVisitas(nuevasVisitas); 
          await supabase.from('visitas_paginas').update({ conteo: nuevasVisitas }).eq('ruta', '/inicio');
        }
      } catch (err) {
        console.error("Error con el contador de visitas:", err);
      }
    };
    registrarVisitaInicio();
  }, []);

  return (
    <div>
      {/* Etiqueta flotante para mostrar visitas */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', zIndex: 9999, backdropFilter: 'blur(4px)', border: '1px solid #334155' }}>
        👁️ Visitas: <strong>{visitas}</strong>
      </div>

      <VisionMision />
      <SeccionDiscipuladoHome />
      <Cartelera />
      <VideoInvitacion videoActual={videoActual} />
      
      {/* SECCIÓN DOBLE: Mensaje Reciente + Reseñas */}
      <div style={{ width: '100%', backgroundColor: '#f8fafc', padding: '70px 20px 100px 20px' }}>
        
        <style>{`
          .contenedor-seccion-doble {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
            max-width: 1100px;
            margin: 0 auto;
          }
          .titulo-seccion-doble {
            color: #1e3a8a;
            text-align: center;
            font-size: 2.2rem;
            font-weight: bold;
            margin-bottom: 30px;
            margin-top: 0;
          }
          .tarjeta-home {
            background-color: #ffffff; padding: 35px; border-radius: 16px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.06); text-align: left;
            border: 1px solid #e2e8f0; border-top: 4px solid #cbd5e1;
            flex: 1; display: flex; flex-direction: column;
          }

          @media (max-width: 768px) {
            .contenedor-seccion-doble { grid-template-columns: 1fr; gap: 40px; }
            .titulo-seccion-doble { font-size: 1.8rem; margin-bottom: 20px; }
            .tarjeta-home { padding: 25px; }
          }
        `}</style>

        <div className="contenedor-seccion-doble">
          <UltimoMensajeHome />
          <CarruselResenasHome />
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// COMPONENTE: Ruta Protegida para Admin
// -------------------------------------------------------------
function RutaProtegida({ isAuthenticated, children }) {
  if (!isAuthenticated) { return <Navigate to="/login" replace />; }
  return children;
}

// -------------------------------------------------------------
// COMPONENTE PRINCIPAL: App
// -------------------------------------------------------------
export default function App() {
  const [videoActual, setVideoActual] = useState("4dqVAIW8FpA");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const obtenerVideo = async () => {
      try {
        const { data, error } = await supabase.from('configuracion').select('video_principal').eq('id', 1).single(); 
        if (data) setVideoActual(data.video_principal); 
      } catch (err) {
        console.error("Excepción en obtenerVideo:", err);
      }
    };
    obtenerVideo();

    supabase.auth.getSession().then(({ data: { session } }) => { setIsAuthenticated(!!session); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      {/* 🟢 AQUI AGREGAMOS EL COMPONENTE INVISIBLE */}
      <ScrollToTop />
      
      {/* El Navbar con su magia elegante */}
      <Navbar />
      
      {/* Añadimos un padding top global para que el Navbar fijo no tape el contenido de arriba */}
      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Inicio videoActual={videoActual} />} />
          <Route path="/identidad" element={<IdentidadPage />} />
          <Route path="/mensajes" element={<SeccionMensajes />} />
          <Route path="/comunidad" element={<SeccionComunidad />} />
          <Route path="/multimedia" element={<PaginaMultimedia />} />
          <Route path="/cartelera" element={<Cartelera />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={ <RutaProtegida isAuthenticated={isAuthenticated}> <Admin setVideoActual={setVideoActual} /> </RutaProtegida> } />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}