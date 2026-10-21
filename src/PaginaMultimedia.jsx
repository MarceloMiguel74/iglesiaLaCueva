import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function PaginaMultimedia() {
  const [videos, setVideos] = useState([]);
  const [videoActual, setVideoActual] = useState("W7E8BsQR0qw");
  const [visitas, setVisitas] = useState(0);

  useEffect(() => {
    fetchVideos();
    registrarVisitaMultimedia();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) {
        console.error("Error al cargar la galería multimedia:", error);
      } else if (data && data.length > 0) {
        setVideos(data);
        setVideoActual(data[0].youtube_id);
      }
    } catch (err) {
      console.error("Error en Supabase:", err);
    }
  };

  const registrarVisitaMultimedia = async () => {
    try {
      const { data, error } = await supabase
        .from('visitas_paginas')
        .select('conteo')
        .eq('ruta', '/multimedia')
        .single();

      if (data) {
        const nuevasVisitas = data.conteo + 1;
        setVisitas(nuevasVisitas); 

        await supabase
          .from('visitas_paginas')
          .update({ conteo: nuevasVisitas })
          .eq('ruta', '/multimedia');
      }
    } catch (err) {
      console.error("Error con el contador de visitas:", err);
    }
  };

  // NUEVO: Función para manejar los "Me gusta" en los videos
  const manejarMeGustaVideo = async (e, id, likesActuales) => {
    e.stopPropagation(); // Evita que al hacer clic en el corazón se cambie el video actual
    const nuevosLikes = (likesActuales || 0) + 1;

    // Actualizar pantalla al instante
    setVideos(videos.map(v => v.id === id ? { ...v, me_gusta: nuevosLikes } : v));

    // Actualizar Supabase
    const { error } = await supabase
      .from('videos')
      .update({ me_gusta: nuevosLikes })
      .eq('id', id);

    if (error) console.error("Error al dar me gusta:", error.message);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', padding: '100px 20px 60px' }}>
      
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', zIndex: 9999, backdropFilter: 'blur(4px)', border: '1px solid #334155' }}>
        👁️ Visitas: <strong>{visitas}</strong>
      </div>

      {/* Video de fondo */}
      <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'brightness(0.4)' }}>
        <source src="/adoracion.mp4" type="video/mp4" />
      </video>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#ffffff', textAlign: 'center', borderBottom: '2px solid var(--color-acento, #f59e0b)', paddingBottom: '10px', marginBottom: '40px', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
          🎬 Galería Multimedia
        </h2>
      
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Reproductor Principal */}
          <div style={{ flex: '2 1 500px', maxWidth: '800px' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', border: '3px solid #f59e0b', boxShadow: '0 0 25px rgba(245, 158, 11, 0.5), 0 8px 25px rgba(0,0,0,0.7)', backgroundColor: '#000' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src={`https://www.youtube.com/embed/${videoActual}`}
                title="Video Seleccionado"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Lista de Videos Sugeridos */}
          <div style={{ flex: '1 1 300px', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '25px', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', maxHeight: '550px', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e3a8a', borderBottom: '2px solid #f59e0b', paddingBottom: '10px' }}>
              Lista de Reproducción
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {videos.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>No hay videos cargados aún.</p>
              ) : (
                videos.map(video => (
                  <div 
                    key={video.id} 
                    onClick={() => setVideoActual(video.youtube_id)} 
                    style={{ 
                      padding: '12px 15px', 
                      borderRadius: '8px',
                      backgroundColor: videoActual === video.youtube_id ? '#f59e0b' : '#f8fafc',
                      color: videoActual === video.youtube_id ? '#0f172a' : '#1e293b',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer', 
                      transition: 'all 0.3s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    onMouseOver={(e) => { if(videoActual !== video.youtube_id) e.currentTarget.style.backgroundColor = '#e2e8f0' }}
                    onMouseOut={(e) => { if(videoActual !== video.youtube_id) e.currentTarget.style.backgroundColor = videoActual === video.youtube_id ? '#f59e0b' : '#f8fafc' }}
                  >
                    {/* Información del video */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>▶️ {video.titulo}</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        alignSelf: 'flex-start',
                        padding: '2px 8px', 
                        borderRadius: '10px', 
                        backgroundColor: videoActual === video.youtube_id ? '#0f172a' : '#e0f2fe', 
                        color: videoActual === video.youtube_id ? '#ffffff' : '#0369a1',
                        fontWeight: 'bold'
                      }}>
                        {video.tipo || 'Video'}
                      </span>
                    </div>

                    {/* Botón interactivo de Me gusta */}
                    <button 
                      onClick={(e) => manejarMeGustaVideo(e, video.id, video.me_gusta)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: videoActual === video.youtube_id ? '#0f172a' : '#ef4444',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        transition: 'transform 0.1s'
                      }}
                      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.8)'}
                      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ❤️
                      <span style={{ fontSize: '0.8rem' }}>{video.me_gusta || 0}</span>
                    </button>
                    
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