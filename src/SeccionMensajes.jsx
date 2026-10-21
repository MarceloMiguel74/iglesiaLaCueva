import { useState, useEffect } from 'react';
import { supabase } from './supabase'; 

export function SeccionMensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // NUEVO: Estado para el contador general de la página
  const [visitas, setVisitas] = useState(0);

  useEffect(() => {
    obtenerMensajes();
    registrarVisitaMensajes();
  }, []);

  // NUEVO: Función para registrar visitas de la página general
  const registrarVisitaMensajes = async () => {
    try {
      const { data, error } = await supabase
        .from('visitas_paginas')
        .select('conteo')
        .eq('ruta', '/mensajes')
        .single();

      if (data) {
        const nuevasVisitas = data.conteo + 1;
        setVisitas(nuevasVisitas);

        await supabase
          .from('visitas_paginas')
          .update({ conteo: nuevasVisitas })
          .eq('ruta', '/mensajes');
      }
    } catch (err) {
      console.error("Error con el contador de visitas:", err);
    }
  };

  const obtenerMensajes = async () => {
    try {
      const { data, error } = await supabase
        .from('mensajes')
        .select('*')
        .order('id', { ascending: false }); 

      if (error) throw error;
      if (data) setMensajes(data);

    } catch (error) {
      console.error("Error obteniendo mensajes:", error.message);
    } finally {
      setCargando(false);
    }
  };

  const manejarMeGusta = async (id, likesActuales) => {
    const nuevosLikes = (likesActuales || 0) + 1;

    try {
      const { error } = await supabase
        .from('mensajes')
        .update({ me_gusta: nuevosLikes })
        .eq('id', id);

      if (error) throw error;

      setMensajes(mensajes.map(msg => 
        msg.id === id ? { ...msg, me_gusta: nuevosLikes } : msg
      ));
    } catch (error) {
      console.error("Error al dar me gusta:", error.message);
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      overflow: 'hidden', 
      padding: '60px 20px', 
      backgroundColor: '#2b6cb0',
      minHeight: '100vh'
    }}>
      
      {/* Etiqueta flotante para mostrar visitas de la página */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: 'white', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', zIndex: 9999, backdropFilter: 'blur(4px)', border: '1px solid #334155' }}>
        👁️ Visitas: <strong>{visitas}</strong>
      </div>

      {/* --- VIDEO DE FONDO EN LOOP --- */}
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
        <source src="/354545.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      {/* --- CAPA OSCURA SEMITRANSPARENTE --- */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1
      }}></div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        <h2 style={{ 
          color: '#ffffff', 
          textAlign: 'center', 
          borderBottom: '2px solid var(--color-acento, #f59e0b)', 
          paddingBottom: '10px',
          marginBottom: '40px',
          textShadow: '0 2px 4px rgba(0,0,0,0.6)'
        }}>
          📖 Mensajes Recientes
        </h2>

        {/* Fila de Tarjetas */}
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          {cargando ? (
            <p style={{ color: 'white', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Cargando mensajes...</p>
          ) : mensajes.length === 0 ? (
            <p style={{ color: 'white', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>No hay mensajes disponibles aún.</p>
          ) : (
            mensajes.map((mensaje) => (
              <div key={mensaje.id} style={{ 
                flex: '1 1 300px',
                maxWidth: '400px',
                padding: '25px', 
                borderRadius: '12px', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                border: '2px solid #f59e0b',
                backdropFilter: 'blur(4px)'
              }}>
                <p style={{ color: '#64748b', fontSize: '0.9em', margin: '0 0 10px 0', fontWeight: 'bold' }}>📅 {mensaje.fecha}</p>
                <h3 style={{ color: '#1e3a8a', margin: '0 0 15px 0' }}>📌 {mensaje.titulo}</h3>
                
                <p style={{ marginBottom: '15px', color: '#334155', lineHeight: '1.5' }}>📝 {mensaje.descripcion}</p>
                <p style={{ marginBottom: '20px', color: '#0f172a' }}>📖 <strong>{mensaje.versiculo}</strong></p>
                
                {/* Botón único de Me gusta */}
                <div style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => manejarMeGusta(mensaje.id, mensaje.me_gusta)}
                    style={{ 
                      padding: '10px 18px', 
                      borderRadius: '20px', 
                      border: '1px solid #f59e0b', 
                      backgroundColor: '#fff', 
                      cursor: 'pointer',
                      color: '#1e3a8a',
                      fontWeight: 'bold',
                      transition: 'transform 0.1s, background 0.3s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    ❤️ Me gusta ({mensaje.me_gusta || 0})
                  </button>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}