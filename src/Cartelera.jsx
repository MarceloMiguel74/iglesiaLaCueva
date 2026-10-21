import React, { useState, useEffect } from 'react';
import { supabase } from './supabase'; 

export function Cartelera() {
  const [actividades, setActividades] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [visitas, setVisitas] = useState(0);

  useEffect(() => {
    cargarDatos();
    registrarVisitaCartelera();
  }, []);

  // --- 1. CARGAR DATOS DE CARTELERA ---
  const cargarDatos = async () => {
    const { data, error } = await supabase
      .from('cartelera')
      .select('*')
      .order('id', { ascending: true });
    
    if (!error && data) {
      setActividades(data.filter(item => item.tipo === 'actividad'));
      setEventos(data.filter(item => item.tipo === 'evento'));
    }
  };

  // --- 2. REGISTRAR VISITAS DE LA PÁGINA ---
  const registrarVisitaCartelera = async () => {
    try {
      const { data, error } = await supabase
        .from('visitas_paginas')
        .select('conteo')
        .eq('ruta', '/cartelera')
        .single();

      if (data) {
        const nuevasVisitas = data.conteo + 1;
        setVisitas(nuevasVisitas);

        await supabase
          .from('visitas_paginas')
          .update({ conteo: nuevasVisitas })
          .eq('ruta', '/cartelera');
      }
    } catch (err) {
      console.error("Error con el contador de visitas:", err);
    }
  };

  // --- 3. MANEJAR EL BOTÓN DE ME GUSTA ---
  const manejarMeGusta = async (id, likesActuales, tipo) => {
    const nuevosLikes = (likesActuales || 0) + 1;

    if (tipo === 'actividad') {
      setActividades(actividades.map(item => item.id === id ? { ...item, me_gusta: nuevosLikes } : item));
    } else {
      setEventos(eventos.map(item => item.id === id ? { ...item, me_gusta: nuevosLikes } : item));
    }

    const { error } = await supabase
      .from('cartelera')
      .update({ me_gusta: nuevosLikes })
      .eq('id', id);

    if (error) console.error("Error al dar me gusta:", error.message);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', padding: '80px 0' }}>
      
      {/* 1. VIDEO DE FONDO HERO */}
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

      {/* 2. CAPA OSCURA PARA QUE RESALTEN LAS TARJETAS */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.8)', /* Azul oscuro casi negro, 80% opaco */
        zIndex: 1
      }}></div>

      {/* Etiqueta flotante para mostrar visitas (Z-index alto para que quede por encima) */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: 'white', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', zIndex: 9999, backdropFilter: 'blur(4px)', border: '1px solid #334155' }}>
        👁️ Visitas: <strong>{visitas}</strong>
      </div>

      <style>{`
        .btn-like-cartelera {
          background: white; border: 1px solid #f59e0b; padding: 6px 12px; border-radius: 20px; 
          color: #1e3a8a; font-weight: bold; cursor: pointer; transition: transform 0.1s, background 0.3s; 
          display: inline-block; margin-top: 15px; font-size: 0.95rem;
        }
        .btn-like-cartelera:hover { background: #fef3c7; }
        .btn-like-cartelera:active { transform: scale(0.95); }
      `}</style>

      {/* 3. CONTENIDO PRINCIPAL (Z-index 2) */}
      <div style={{ position: 'relative', zIndex: 2, width: '90%', maxWidth: '1000px', margin: '0 auto' }}>
        
        <h2 style={{ color: '#ffffff', textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', marginBottom: '40px', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>
          📅 Cartelera
        </h2>

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
          
          {/* COLUMNA IZQUIERDA: ACTIVIDADES */}
          <div style={{ flex: '1 1 320px' }}>
            <h3 style={estilosTituloSeccion}>📌 Actividades</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {actividades.length === 0 ? (
                <p style={estilosTextoVacio}>No hay actividades programadas en este momento.</p>
              ) : (
                actividades.map(actividad => (
                  <div key={actividad.id} style={estilosTarjeta}>
                    <h4 style={estilosTituloTarjeta}>{actividad.nombre}</h4>
                    <p style={estilosTextoTarjeta}><strong>Día:</strong> {actividad.dia}</p>
                    <p style={estilosTextoTarjeta}><strong>Horario:</strong> {actividad.horario}</p>
                    {actividad.lugar && <p style={estilosTextoTarjeta}><strong>Lugar:</strong> {actividad.lugar}</p>}
                    
                    <div style={{ textAlign: 'center' }}>
                      <button className="btn-like-cartelera" onClick={() => manejarMeGusta(actividad.id, actividad.me_gusta, 'actividad')}>
                        ❤️ Me gusta ({actividad.me_gusta || 0})
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: EVENTOS */}
          <div style={{ flex: '1 1 320px' }}>
            <h3 style={estilosTituloSeccion}>🎉 Eventos Especiales</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {eventos.length === 0 ? (
                <p style={estilosTextoVacio}>No hay eventos próximos.</p>
              ) : (
                eventos.map(evento => (
                  <div key={evento.id} style={estilosTarjeta}>
                    <h4 style={estilosTituloTarjeta}>{evento.nombre}</h4>
                    <p style={estilosTextoTarjeta}><strong>Día/Fecha:</strong> {evento.dia}</p>
                    <p style={estilosTextoTarjeta}><strong>Horario:</strong> {evento.horario}</p>
                    {evento.lugar && <p style={estilosTextoTarjeta}><strong>Lugar:</strong> {evento.lugar}</p>}
                    
                    <div style={{ textAlign: 'center' }}>
                      <button className="btn-like-cartelera" onClick={() => manejarMeGusta(evento.id, evento.me_gusta, 'evento')}>
                        ❤️ Me gusta ({evento.me_gusta || 0})
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- OBJETOS DE ESTILOS ---
const estilosTituloSeccion = { textAlign: 'center', color: '#f59e0b', marginBottom: '25px', fontSize: '2rem', fontWeight: 'bold', textShadow: '0 2px 5px rgba(0,0,0,0.8)' };
const estilosTarjeta = { backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '25px', borderRadius: '16px', border: '2px solid #f59e0b', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', position: 'relative', backdropFilter: 'blur(5px)' };
const estilosTituloTarjeta = { margin: '0 0 12px 0', color: '#1e3a8a', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold' };
const estilosTextoTarjeta = { margin: '6px 0', textAlign: 'center', color: '#1f2937', fontSize: '1.1rem', fontWeight: '500' };
const estilosTextoVacio = { textAlign: 'center', color: '#cbd5e1', fontStyle: 'italic', fontSize: '1.1rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', border: '1px dashed #475569' };