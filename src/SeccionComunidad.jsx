import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function SeccionComunidad() {
  const [testimonios, setTestimonios] = useState([]);
  const [pedidosPublicos, setPedidosPublicos] = useState([]);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  
  // Estado para visitas
  const [visitas, setVisitas] = useState(0);

  const [formTestimonio, setFormTestimonio] = useState({ nombre: '', pais: '', mensaje: '' });
  const [formOracion, setFormOracion] = useState({ nombre: '', pais: '', pedido: '' });

  useEffect(() => {
    fetchDatosComunidad();
    registrarVisitaComunidad();
  }, []);

  // Función para registrar visitas
  const registrarVisitaComunidad = async () => {
    try {
      const { data, error } = await supabase
        .from('visitas_paginas')
        .select('conteo')
        .eq('ruta', '/comunidad')
        .single();

      if (data) {
        const nuevasVisitas = data.conteo + 1;
        setVisitas(nuevasVisitas);

        await supabase
          .from('visitas_paginas')
          .update({ conteo: nuevasVisitas })
          .eq('ruta', '/comunidad');
      }
    } catch (err) {
      console.error("Error con el contador de visitas:", err);
    }
  };

  const fetchDatosComunidad = async () => {
    // 1. Cargar testimonios aprobados
    const { data: testData } = await supabase
      .from('testimonios')
      .select('*')
      .eq('aprobado', true)
      .order('fecha', { ascending: false });

    if (testData) setTestimonios(testData);

    // 2. Cargar lista pública de pedidos de oración
    const { data: pedData } = await supabase
      .from('pedidos_oracion')
      .select('*')
      .order('fecha', { ascending: false });

    if (pedData) setPedidosPublicos(pedData);
  };

  const handleLike = async (id) => {
    const tActual = testimonios.find(t => t.id === id);
    if (!tActual) return;

    const nuevosLikes = (tActual.likes || 0) + 1;
    setTestimonios(testimonios.map(t => t.id === id ? { ...t, likes: nuevosLikes } : t));
    await supabase.from('testimonios').update({ likes: nuevosLikes }).eq('id', id);
  };

  // Función para manejar las 3 reacciones de los pedidos
  const handleReaccionPedido = async (id, tipo, countActual) => {
    const nuevoCount = (countActual || 0) + 1;
    let columnaDb = '';

    if (tipo === 'corazon') columnaDb = 'reaccion_corazon';
    if (tipo === 'like') columnaDb = 'reaccion_like';
    if (tipo === 'oracion') columnaDb = 'reaccion_oracion';

    // 1. Actualizar UI al instante
    setPedidosPublicos(pedidosPublicos.map(p => 
      p.id === id ? { ...p, [columnaDb]: nuevoCount } : p
    ));

    // 2. Actualizar Supabase
    const { error } = await supabase
      .from('pedidos_oracion')
      .update({ [columnaDb]: nuevoCount })
      .eq('id', id);

    if (error) console.error(`Error al dar ${tipo}:`, error.message);
  };

  const testimonioActual = testimonios.length > 0 ? testimonios[indiceCarrusel] : null;

  const siguienteTestimonio = () => {
    if (testimonios.length === 0) return;
    setIndiceCarrusel((prev) => (prev + 1) % testimonios.length);
  };

  const anteriorTestimonio = () => {
    if (testimonios.length === 0) return;
    setIndiceCarrusel((prev) => (prev === 0 ? testimonios.length - 1 : prev - 1));
  };

  const enviarTestimonio = async (e) => {
    e.preventDefault();
    const nuevoTestimonio = {
      nombre: formTestimonio.nombre,
      pais: formTestimonio.pais,
      mensaje: formTestimonio.mensaje,
      aprobado: false,
      likes: 0
    };

    const { error } = await supabase.from('testimonios').insert([nuevoTestimonio]);
    if (error) {
      alert("Error al enviar el testimonio.");
    } else {
      alert("¡Testimonio enviado para revisión!");
      setFormTestimonio({ nombre: '', pais: '', mensaje: '' });
    }
  };

  const enviarPedido = async (e) => {
    e.preventDefault();
    const nuevoPedidoOracion = {
      nombre: formOracion.nombre,
      pais: formOracion.pais || 'Argentina',
      pedido: formOracion.pedido,
      estado: 'pendiente' // Aseguramos que entre como pendiente en minúsculas
    };

    const { error } = await supabase.from('pedidos_oracion').insert([nuevoPedidoOracion]);

    if (error) {
      alert("Error al enviar el pedido de oración.");
    } else {
      alert("¡Pedido de oración publicado! Estaremos orando por ti.");
      setFormOracion({ nombre: '', pais: '', pedido: '' });
      fetchDatosComunidad();
    }
  };

  return (
    <div className="seccion-comunidad" style={{ backgroundColor: '#fdfdfd', margin: '0 auto', maxWidth: '1200px', position: 'relative', minHeight: '100vh' }}>
      
      {/* Etiqueta flotante para mostrar visitas */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', zIndex: 9999, backdropFilter: 'blur(4px)', border: '1px solid #334155' }}>
        👁️ Visitas: <strong>{visitas}</strong>
      </div>

      {/* ESTILOS RESPONSIVE INYECTADOS */}
      <style>{`
        .seccion-comunidad { padding: 60px 20px; }
        .titulo-principal { font-size: 2rem; }
        .contenedor-columnas { display: flex; gap: 40px; flex-wrap: wrap; }
        .columna { flex: 1 1 350px; display: flex; flex-direction: column; gap: 25px; }
        .fila-inputs { display: flex; gap: 10px; }
        .texto-base { font-size: 1rem; }
        
        .btn-reaccion { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 15px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; transition: all 0.2s; color: #475569; font-weight: bold; }
        .btn-reaccion:hover { background: #e2e8f0; transform: scale(1.05); }
        .btn-reaccion:active { transform: scale(0.95); }

        /* REGLAS PARA CELULARES */
        @media (max-width: 768px) {
          .seccion-comunidad { padding: 30px 15px; }
          .contenedor-columnas { gap: 20px; }
          .columna { flex: 1 1 100%; }
          .titulo-principal { font-size: 1.5rem; margin-bottom: 20px !important; }
          h3 { font-size: 1.2rem; }
          h4 { font-size: 1.1rem !important; }
          .fila-inputs { flex-direction: column; }
          .texto-base, input, textarea, button, p { font-size: 0.85rem !important; }
          .caja-pedido { padding: 10px !important; }
        }
      `}</style>

      <h2 className="titulo-principal" style={{ color: '#1e3a8a', borderBottom: '2px solid #f59e0b', paddingBottom: '10px', textAlign: 'center', marginBottom: '40px' }}>
        🙏 Vida en Comunidad
      </h2>

      <div className="contenedor-columnas">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO Y MURO DE PEDIDOS */}
        <div className="columna">
          
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ textAlign: 'center', color: '#2b6cb0', marginBottom: '20px' }}>Pedidos de Oración</h3>
            <p className="texto-base" style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
              No estás solo. Escribinos tu necesidad y nuestro equipo pastoral estará orando por vos.
            </p>

            <form onSubmit={enviarPedido} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="fila-inputs">
                <input 
                  type="text" 
                  placeholder="Tu Nombre (o Anónimo)" 
                  value={formOracion.nombre}
                  onChange={(e) => setFormOracion({ ...formOracion, nombre: e.target.value })}
                  style={{ ...estilosInput, flex: 1 }} 
                  required
                />
                <input 
                  type="text" 
                  placeholder="País" 
                  value={formOracion.pais}
                  onChange={(e) => setFormOracion({ ...formOracion, pais: e.target.value })}
                  style={{ ...estilosInput, flex: 1 }} 
                  required
                />
              </div>

              <textarea 
                placeholder="Escribe tu pedido de oración aquí..." 
                value={formOracion.pedido}
                onChange={(e) => setFormOracion({ ...formOracion, pedido: e.target.value })}
                style={{ ...estilosInput, minHeight: '100px', resize: 'vertical' }} 
                required
              />
              <button type="submit" style={estilosBoton}>Enviar Motivo de Oración</button>
            </form>
          </div>

          {/* Muro Público de Pedidos */}
          <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '10px', border: '1px solid #cbd5e0', maxHeight: '500px', overflowY: 'auto' }}>
            <h4 style={{ color: '#1e3a8a', marginTop: 0, marginBottom: '15px', fontSize: '1.2rem' }}>
              Muro de Oración Reciente ({pedidosPublicos.length})
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pedidosPublicos.map(p => {
                // NORMALIZAMOS EL ESTADO PARA QUE COINCIDA (lo pasamos a minúsculas)
                const estadoLimpio = (p.estado || 'pendiente').toLowerCase();
                
                // ASIGNAMOS COLORES DINÁMICOS IGUAL QUE EN EL ADMIN
                let bgColor = '#fef3c7'; // Amarillo por defecto (Pendiente)
                let textColor = '#d97706';
                let emoji = '⏳';
                let borderColor = '#eab308';
                
                if (estadoLimpio === 'contestado') {
                  bgColor = '#dcfce7'; textColor = '#15803d'; emoji = '✨'; borderColor = '#22c55e';
                } else if (estadoLimpio === 'en oración' || estadoLimpio === 'orando') {
                  bgColor = '#e0f2fe'; textColor = '#0284c7'; emoji = '🙏'; borderColor = '#0ea5e9';
                }

                return (
                  <div key={p.id} className="caja-pedido" style={{ 
                    padding: '14px', 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    borderLeft: `5px solid ${borderColor}`,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '5px' }}>
                      <strong style={{ color: '#1e293b' }}>{p.nombre} ({p.pais || 'Argentina'})</strong>
                      
                      <span style={{
                        fontSize: '0.70rem',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        backgroundColor: bgColor,
                        color: textColor
                      }}>
                        {emoji} {estadoLimpio}
                      </span>
                    </div>

                    <p className="texto-base" style={{ margin: '0 0 12px 0', color: '#475569', fontStyle: 'italic' }}>
                      "{p.pedido}"
                    </p>

                    {/* FILA DE REACCIONES */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      <button className="btn-reaccion" onClick={() => handleReaccionPedido(p.id, 'corazon', p.reaccion_corazon)}>
                        ❤️ {p.reaccion_corazon || 0}
                      </button>
                      <button className="btn-reaccion" onClick={() => handleReaccionPedido(p.id, 'like', p.reaccion_like)}>
                        👍 {p.reaccion_like || 0}
                      </button>
                      <button className="btn-reaccion" onClick={() => handleReaccionPedido(p.id, 'oracion', p.reaccion_oracion)}>
                        🙏 {p.reaccion_oracion || 0}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: TESTIMONIOS */}
        <div className="columna">
          
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ textAlign: 'center', color: '#2b6cb0', marginBottom: '20px' }}>Testimonios</h3>

            {!testimonioActual ? (
              <p className="texto-base" style={{ textAlign: 'center', color: '#777', fontStyle: 'italic' }}>Pronto verás testimonios aquí.</p>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p className="texto-base" style={{ fontStyle: 'italic', color: '#4a5568', marginBottom: '15px' }}>
                  "{testimonioActual.mensaje}"
                </p>
                <p className="texto-base" style={{ fontWeight: 'bold', color: '#2d3748', margin: '5px 0' }}>
                  {testimonioActual.nombre} <span style={{ fontWeight: 'normal', color: '#718096' }}>- {testimonioActual.pais}</span>
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <button onClick={anteriorTestimonio} type="button" style={btnCarrusel}>◀</button>
                  <button onClick={() => handleLike(testimonioActual.id)} type="button" style={btnLike}>
                    ❤️ {testimonioActual.likes || 0}
                  </button>
                  <button onClick={siguienteTestimonio} type="button" style={btnCarrusel}>▶</button>
                </div>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#f7fafc', padding: '25px', borderRadius: '10px', border: '1px dashed #cbd5e0' }}>
            <h4 style={{ textAlign: 'center', color: '#4a5568', marginBottom: '15px' }}>¿Qué hizo Dios en tu vida? ¡Contanos!</h4>
            <form onSubmit={enviarTestimonio} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="fila-inputs">
                <input 
                  type="text" placeholder="Nombre" style={{ ...estilosInput, flex: 1 }} required
                  value={formTestimonio.nombre} onChange={(e) => setFormTestimonio({ ...formTestimonio, nombre: e.target.value })}
                />
                <input 
                  type="text" placeholder="País" style={{ ...estilosInput, flex: 1 }} required
                  value={formTestimonio.pais} onChange={(e) => setFormTestimonio({ ...formTestimonio, pais: e.target.value })}
                />
              </div>
              <textarea 
                placeholder="Escribe tu testimonio..." style={{ ...estilosInput, minHeight: '80px', resize: 'vertical' }} required
                value={formTestimonio.mensaje} onChange={(e) => setFormTestimonio({ ...formTestimonio, mensaje: e.target.value })}
              />
              <button type="submit" style={{ ...estilosBoton, backgroundColor: '#48bb78' }}>Compartir Testimonio</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

// Objetos de estilo limpios
const estilosInput = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' };
const estilosBoton = { padding: '12px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const btnCarrusel = { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#a0aec0' };
const btnLike = { background: '#fff0f5', border: '1px solid #feb2b2', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', color: '#e53e3e', fontWeight: 'bold' };