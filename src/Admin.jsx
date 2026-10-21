import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

export function Admin({ setVideoActual }) {
  const navigate = useNavigate();
  const [pestañaActiva, setPestañaActiva] = useState('videos'); 

  // --- ESTADOS VIDEOS ---
  const [listaVideos, setListaVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoLink, setNuevoLink] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("Prédica");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");

  // --- ESTADOS COMUNIDAD ---
  const [testimoniosPendientes, setTestimoniosPendientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // --- ESTADOS CARTELERA ---
  const [actividades, setActividades] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [modalCartelera, setModalCartelera] = useState(false);
  const [formCartelera, setFormCartelera] = useState({ id: null, tipo: '', nombre: '', dia: '', horario: '', lugar: '' });

  // --- ESTADOS MENSAJES ---
  const [listaMensajes, setListaMensajes] = useState([]);
  const [editingMensajeId, setEditingMensajeId] = useState(null);
  const [msgTitulo, setMsgTitulo] = useState("");
  const [msgDescripcion, setMsgDescripcion] = useState("");
  const [msgVersiculo, setMsgVersiculo] = useState("");
  const [msgFecha, setMsgFecha] = useState("");

  // --- ESTADOS BANDEJA DE ENTRADA ---
  const [mensajesContacto, setMensajesContacto] = useState([]);

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    // Videos
    const { data: vData } = await supabase.from('videos').select('*').order('fecha', { ascending: false });
    if (vData) setListaVideos(vData);

    // Testimonios
    const { data: tData } = await supabase.from('testimonios').select('*').eq('aprobado', false);
    if (tData) setTestimoniosPendientes(tData);

    // Pedidos de oración
    const { data: pData } = await supabase.from('pedidos_oracion').select('*').order('fecha', { ascending: false });
    if (pData) setPedidos(pData);

    // Cartelera
    const { data: cData } = await supabase.from('cartelera').select('*').order('id', { ascending: true });
    if (cData) {
      setActividades(cData.filter(item => item.tipo === 'actividad'));
      setEventos(cData.filter(item => item.tipo === 'evento'));
    }

    // Mensajes 
    const { data: mData } = await supabase.from('mensajes').select('*').order('id', { ascending: false });
    if (mData) setListaMensajes(mData);

    // Bandeja de Entrada de Contacto
    const { data: ctoData } = await supabase.from('mensajes_contacto').select('*').order('fecha', { ascending: false });
    if (ctoData) setMensajesContacto(ctoData);
  };

const cerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/'; 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      window.location.href = '/'; 
    }
  };

  // --- FUNCIONES VIDEOS ---
  const extraerIdYoutube = (url) => {
    if (url.length === 11) return url;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const guardarVideo = async (e) => {
    e.preventDefault();
    const idLimpio = extraerIdYoutube(nuevoLink);
    if (editingId) {
      await supabase.from('videos').update({ titulo: nuevoTitulo, youtube_id: idLimpio, tipo: nuevoTipo, descripcion: nuevaDescripcion }).eq('id', editingId);
      alert("¡Video actualizado!");
    } else {
      await supabase.from('videos').insert([{ titulo: nuevoTitulo, youtube_id: idLimpio, tipo: nuevoTipo, descripcion: nuevaDescripcion }]);
      alert("¡Video guardado correctamente!");
    }
    limpiarFormVideo(); fetchDatos();
  };

  const cargarParaEditar = (v) => {
    setEditingId(v.id); setNuevoTitulo(v.titulo); setNuevoLink(v.youtube_id);
    setNuevoTipo(v.tipo || 'Prédica'); setNuevaDescripcion(v.descripcion || '');
  };

  const limpiarFormVideo = () => {
    setEditingId(null); setNuevoTitulo(""); setNuevoLink(""); setNuevoTipo("Prédica"); setNuevaDescripcion("");
  };

  const eliminarVideo = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este video?")) {
      await supabase.from('videos').delete().eq('id', id); fetchDatos();
    }
  };

  const seleccionarComoDestacado = async (youtubeId) => {
    await supabase.from('configuracion').update({ video_principal: youtubeId }).eq('id', 1);
    if (setVideoActual) setVideoActual(youtubeId);
    alert("¡Video destacado en portada!");
  };

  // --- FUNCIONES COMUNIDAD ---
  const aprobarTestimonio = async (id) => { await supabase.from('testimonios').update({ aprobado: true }).eq('id', id); fetchDatos(); };
  const eliminarTestimonio = async (id) => { if (window.confirm("¿Borrar testimonio?")) { await supabase.from('testimonios').delete().eq('id', id); fetchDatos(); } };
  
  const eliminarPedido = async (id) => { if (window.confirm("¿Borrar pedido?")) { await supabase.from('pedidos_oracion').delete().eq('id', id); fetchDatos(); } };

  // NUEVA FUNCIÓN: Cambiar estado del pedido
  const cambiarEstadoPedido = async (id, nuevoEstado) => {
    const { error } = await supabase.from('pedidos_oracion').update({ estado: nuevoEstado }).eq('id', id);
    if (error) {
      alert("Error al actualizar el estado: " + error.message);
    } else {
      fetchDatos();
    }
  };

  // --- FUNCIONES CARTELERA ---
  const abrirModalCartelera = (item, tipo = 'actividad') => {
    if (item) setFormCartelera(item);
    else setFormCartelera({ id: null, tipo: tipo, nombre: '', dia: '', horario: '', lugar: '' });
    setModalCartelera(true);
  };

  const guardarCartelera = async (e) => {
    e.preventDefault();
    let errorSupabase;

    if (formCartelera.id) {
      const { error } = await supabase.from('cartelera').update({ nombre: formCartelera.nombre, dia: formCartelera.dia, horario: formCartelera.horario, lugar: formCartelera.lugar }).eq('id', formCartelera.id);
      errorSupabase = error;
    } else {
      const { error } = await supabase.from('cartelera').insert([{ tipo: formCartelera.tipo, nombre: formCartelera.nombre, dia: formCartelera.dia, horario: formCartelera.horario, lugar: formCartelera.lugar }]);
      errorSupabase = error;
    }

    if (errorSupabase) {
      alert("Error al guardar: " + errorSupabase.message);
    } else {
      alert("¡Guardado correctamente!");
      setModalCartelera(false); 
      fetchDatos();
    }
  };

  const eliminarCartelera = async (id) => {
    if (window.confirm("¿Borrar de la cartelera?")) { await supabase.from('cartelera').delete().eq('id', id); fetchDatos(); }
  };

  // --- FUNCIONES MENSAJES ---
  const guardarMensaje = async (e) => {
    e.preventDefault();
    if (editingMensajeId) {
      const { error } = await supabase.from('mensajes').update({
        titulo: msgTitulo, descripcion: msgDescripcion, versiculo: msgVersiculo, fecha: msgFecha
      }).eq('id', editingMensajeId);
      if (error) alert("Error al actualizar: " + error.message);
      else alert("¡Mensaje actualizado!");
    } else {
      const { error } = await supabase.from('mensajes').insert([{
        titulo: msgTitulo, descripcion: msgDescripcion, versiculo: msgVersiculo, fecha: msgFecha, me_gusta: 0, visitas: 0
      }]);
      if (error) alert("Error al guardar: " + error.message);
      else alert("¡Mensaje publicado correctamente!");
    }
    limpiarFormMensaje(); fetchDatos();
  };

  const cargarMensajeParaEditar = (m) => {
    setEditingMensajeId(m.id); setMsgTitulo(m.titulo);
    setMsgDescripcion(m.descripcion); setMsgVersiculo(m.versiculo); setMsgFecha(m.fecha);
  };

  const limpiarFormMensaje = () => {
    setEditingMensajeId(null); setMsgTitulo(""); setMsgDescripcion(""); setMsgVersiculo(""); setMsgFecha("");
  };

  const eliminarMensaje = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este mensaje?")) {
      await supabase.from('mensajes').delete().eq('id', id); fetchDatos();
    }
  };

  // --- FUNCIONES BANDEJA DE ENTRADA ---
  const eliminarMensajeContacto = async (id) => {
    if (window.confirm("¿Seguro que deseas borrar este mensaje de tu bandeja?")) {
      await supabase.from('mensajes_contacto').delete().eq('id', id);
      fetchDatos();
    }
  };

  const toggleAprobarReseña = async (id, estadoActual) => {
    await supabase.from('mensajes_contacto').update({ aprobada: !estadoActual }).eq('id', id);
    fetchDatos();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      
     <style>{`
        .btn-cerrar-sesion { 
          background-color: #ef4444; color: white; border: none; padding: 10px 20px; 
          border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.3s; 
        }
        .btn-cerrar-sesion:hover { background-color: #dc2626; }
        
        @media (max-width: 768px) {
          .contenedor-cabecera { justify-content: center !important; padding-bottom: 10px; }
          .btn-cerrar-sesion { 
            position: fixed; 
            bottom: 25px; 
            right: 20px; 
            z-index: 99999; 
            box-shadow: 0 5px 20px rgba(239, 68, 68, 0.7); 
            border-radius: 50px; 
            padding: 15px 25px;
            font-size: 1.1rem;
          }
        }
      `}</style>

      {/* CABECERA */}
      <div className="contenedor-cabecera" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0, color: '#1e3a8a', textAlign: 'center' }}>⚙️ Panel de Administración</h1>
        <button onClick={cerrarSesion} className="btn-cerrar-sesion">✖ Cerrar</button>
      </div>

      {/* PESTAÑAS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <button onClick={() => setPestañaActiva('videos')} style={pestañaActiva === 'videos' ? tabActiva : tabInactiva}>🎥 Videos</button>
        <button onClick={() => setPestañaActiva('comunidad')} style={pestañaActiva === 'comunidad' ? tabActiva : tabInactiva}>🙏 Comunidad</button>
        <button onClick={() => setPestañaActiva('cartelera')} style={pestañaActiva === 'cartelera' ? tabActiva : tabInactiva}>📅 Cartelera</button>
        <button onClick={() => setPestañaActiva('mensajes')} style={pestañaActiva === 'mensajes' ? tabActiva : tabInactiva}>📖 Mensajes</button>
        <button onClick={() => setPestañaActiva('bandeja')} style={pestañaActiva === 'bandeja' ? tabActiva : tabInactiva}>
          📥 Bandeja {mensajesContacto.length > 0 && `(${mensajesContacto.length})`}
        </button>
      </div>

      {/* ----------------- PESTAÑA: VIDEOS ----------------- */}
      {pestañaActiva === 'videos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={panelStyle}>
            <h3 style={tituloPanel}>{editingId ? '✏️ Editar Video' : '➕ Subir Nuevo Video'}</h3>
            <form onSubmit={guardarVideo} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Título" value={nuevoTitulo} onChange={e => setNuevoTitulo(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="Enlace de YouTube" value={nuevoLink} onChange={e => setNuevoLink(e.target.value)} required style={inputStyle} />
              <select value={nuevoTipo} onChange={e => setNuevoTipo(e.target.value)} style={inputStyle}>
                <option value="Prédica">Prédica</option>
                <option value="Alabanza">Alabanza</option>
                <option value="Estudio">Estudio</option>
              </select>
              <textarea placeholder="Descripción (opcional)" value={nuevaDescripcion} onChange={e => setNuevaDescripcion(e.target.value)} style={{...inputStyle, minHeight: '80px'}} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={btnPrimary}>{editingId ? 'Actualizar' : 'Guardar'}</button>
                {editingId && <button type="button" onClick={limpiarFormVideo} style={btnSecondary}>Cancelar</button>}
              </div>
            </form>
          </div>
          <div style={panelStyle}>
            <h3 style={tituloPanel}>Tus Videos ({listaVideos.length})</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {listaVideos.map(v => (
                <div key={v.id} style={itemStyle}>
                  <strong>{v.titulo}</strong> <span style={{ color: '#64748b', fontSize: '0.8rem' }}>({v.tipo})</span>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <button onClick={() => seleccionarComoDestacado(v.youtube_id)} style={btnSmallBlue}>⭐ Destacar</button>
                    <button onClick={() => cargarParaEditar(v)} style={btnSmallGray}>✏️ Editar</button>
                    <button onClick={() => eliminarVideo(v.id)} style={btnSmallRed}>🗑️ Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- PESTAÑA: COMUNIDAD ----------------- */}
      {pestañaActiva === 'comunidad' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
           <div style={panelStyle}>
            <h3 style={tituloPanel}>Testimonios Pendientes ({testimoniosPendientes.length})</h3>
            {testimoniosPendientes.length === 0 ? <p style={{color: '#64748b'}}>No hay testimonios pendientes.</p> : null}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {testimoniosPendientes.map(t => (
                <div key={t.id} style={{ background: '#fffbeb', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #fcd34d' }}>
                  <p style={{margin: '0 0 5px 0'}}><strong>{t.nombre} ({t.pais}):</strong></p>
                  <p style={{ fontStyle: 'italic', margin: 0, color: '#451a03' }}>"{t.mensaje}"</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button onClick={() => aprobarTestimonio(t.id)} style={{...btnSmallBlue, background: '#10b981', flex: 1}}>✅ Publicar</button>
                    <button onClick={() => eliminarTestimonio(t.id)} style={{...btnSmallRed, flex: 1}}>🗑️ Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={panelStyle}>
            <h3 style={tituloPanel}>Muro de Oración ({pedidos.length})</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {pedidos.map(p => {
                const estado = p.estado || 'pendiente';
                // Colores dinámicos para la etiqueta según el estado
                const bgColor = estado === 'contestado' ? '#dcfce7' : (estado === 'en oración' ? '#fef08a' : '#e2e8f0');
                const textColor = estado === 'contestado' ? '#15803d' : (estado === 'en oración' ? '#854d0e' : '#475569');

                return (
                  <div key={p.id} style={{...itemStyle, flexDirection: 'column', alignItems: 'flex-start'}}>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <p style={{margin: '0 0 5px 0', fontSize: '1.05rem'}}><strong>{p.nombre}</strong></p>
                      
                      {/* ETIQUETA VISUAL DE ESTADO */}
                      <span style={{
                        fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold',
                        backgroundColor: bgColor, color: textColor, textTransform: 'uppercase'
                      }}>
                        {estado}
                      </span>
                    </div>
                    
                    <p style={{margin: '5px 0 15px 0', color: '#334155', fontStyle: 'italic'}}>"{p.pedido}"</p>
                    
                    {/* CONTROLES (Select de Estado y Botón Eliminar) */}
                    <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                      <select 
                        value={estado} 
                        onChange={(e) => cambiarEstadoPedido(p.id, e.target.value)}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="pendiente">⏳ Pendiente</option>
                        <option value="en oración">🙏 En Oración</option>
                        <option value="contestado">✨ Contestado</option>
                      </select>
                      
                      <button onClick={() => eliminarPedido(p.id)} style={btnSmallRed}>🗑️ Eliminar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- PESTAÑA: CARTELERA ----------------- */}
      {pestañaActiva === 'cartelera' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
           <div style={panelStyle}>
            <h3 style={tituloPanel}>📌 Actividades Permanentes</h3>
            <button onClick={() => abrirModalCartelera(null, 'actividad')} style={{...btnPrimary, marginBottom: '15px', width: '100%'}}>➕ Nueva Actividad</button>
            {actividades.map(a => (
              <div key={a.id} style={itemStyle}>
                <div>
                  <strong style={{color: '#1e3a8a'}}>{a.nombre}</strong> <br/> 
                  <small style={{color: '#64748b'}}>{a.dia} - {a.horario} | 📍 {a.lugar}</small>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => abrirModalCartelera(a)} style={btnSmallGray}>✏️</button>
                  <button onClick={() => eliminarCartelera(a.id)} style={btnSmallRed}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <div style={panelStyle}>
            <h3 style={tituloPanel}>🎉 Eventos Especiales</h3>
            <button onClick={() => abrirModalCartelera(null, 'evento')} style={{...btnPrimary, marginBottom: '15px', background: '#f59e0b', width: '100%'}}>➕ Nuevo Evento</button>
            {eventos.map(e => (
              <div key={e.id} style={itemStyle}>
                <div>
                  <strong style={{color: '#92400e'}}>{e.nombre}</strong> <br/> 
                  <small style={{color: '#64748b'}}>{e.dia} - {e.horario} | 📍 {e.lugar}</small>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => abrirModalCartelera(e)} style={btnSmallGray}>✏️</button>
                  <button onClick={() => eliminarCartelera(e.id)} style={btnSmallRed}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- PESTAÑA: MENSAJES ----------------- */}
      {pestañaActiva === 'mensajes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div style={panelStyle}>
            <h3 style={tituloPanel}>{editingMensajeId ? '✏️ Editar Mensaje' : '➕ Escribir Nuevo Mensaje'}</h3>
            <form onSubmit={guardarMensaje} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Título (Ej: La paz en medio de la tormenta)" value={msgTitulo} onChange={e => setMsgTitulo(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="Fecha (Ej: 9 de agosto de 2026)" value={msgFecha} onChange={e => setMsgFecha(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="Versículo Clave (Ej: Juan 14:27)" value={msgVersiculo} onChange={e => setMsgVersiculo(e.target.value)} style={inputStyle} />
              <textarea placeholder="Descripción o cuerpo del mensaje" value={msgDescripcion} onChange={e => setMsgDescripcion(e.target.value)} required style={{...inputStyle, minHeight: '120px'}} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={btnPrimary}>{editingMensajeId ? 'Actualizar' : 'Publicar Mensaje'}</button>
                {editingMensajeId && <button type="button" onClick={limpiarFormMensaje} style={btnSecondary}>Cancelar</button>}
              </div>
            </form>
          </div>

          <div style={panelStyle}>
            <h3 style={tituloPanel}>Mensajes Publicados ({listaMensajes.length})</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {listaMensajes.length === 0 ? (
                <p style={{ color: '#64748b' }}>Aún no hay mensajes publicados.</p>
              ) : (
                listaMensajes.map(m => (
                  <div key={m.id} style={{...itemStyle, flexDirection: 'column', alignItems: 'flex-start'}}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{color: '#1e3a8a'}}>{m.titulo}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>📅 {m.fecha}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#475569', margin: '5px 0' }}>{m.versiculo}</p>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '5px', width: '100%' }}>
                      <button onClick={() => cargarMensajeParaEditar(m)} style={{...btnSmallGray, flex: 1}}>✏️ Editar</button>
                      <button onClick={() => eliminarMensaje(m.id)} style={{...btnSmallRed, flex: 1}}>🗑️ Eliminar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- PESTAÑA: BANDEJA DE ENTRADA ----------------- */}
      {pestañaActiva === 'bandeja' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div style={panelStyle}>
            <h3 style={tituloPanel}>Bandeja de Contacto</h3>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>Aquí llegan los mensajes del formulario web. Las reseñas aprobadas se mostrarán en la página de inicio.</p>
            
            <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
              {mensajesContacto.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>Tu bandeja de entrada está vacía.</p>
              ) : (
                mensajesContacto.map(msg => (
                  <div key={msg.id} style={{
                    ...itemStyle, 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    backgroundColor: msg.motivo === 'Reseña' ? '#f0fdf4' : '#fff',
                    borderLeft: msg.motivo === 'Reseña' ? '4px solid #22c55e' : '4px solid #3b82f6',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <strong style={{color: '#1e293b', fontSize: '1.1rem'}}>{msg.nombre}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '3px' }}>📞 {msg.contacto_info}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: msg.motivo === 'Reseña' ? '#dcfce7' : '#e2e8f0', color: msg.motivo === 'Reseña' ? '#15803d' : '#475569', fontWeight: 'bold' }}>
                        {msg.motivo}
                      </span>
                    </div>
                    
                    <p style={{ margin: '12px 0', color: '#334155', fontStyle: msg.mensaje ? 'normal' : 'italic', fontSize: '0.95rem' }}>
                      {msg.mensaje ? `"${msg.mensaje}"` : "Sin mensaje adicional."}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                      {msg.motivo === 'Reseña' && (
                        <button onClick={() => toggleAprobarReseña(msg.id, msg.aprobada)} style={{...btnSmallBlue, background: msg.aprobada ? '#f59e0b' : '#22c55e'}}>
                          {msg.aprobada ? '❌ Quitar de Inicio' : '✅ Aprobar para Inicio'}
                        </button>
                      )}
                      <button onClick={() => eliminarMensajeContacto(msg.id)} style={btnSmallRed}>🗑️ Eliminar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------- MODAL CARTELERA ------------- */}
      {modalCartelera && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <h3 style={{marginTop: 0, textAlign: 'center', color: '#1e3a8a'}}>
              {formCartelera.id ? '✏️ Editar' : '➕ Agregar'} {formCartelera.tipo}
            </h3>
            <form onSubmit={guardarCartelera} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Nombre (Ej: Reunión Joven)" value={formCartelera.nombre} onChange={e => setFormCartelera({...formCartelera, nombre: e.target.value})} required style={inputStyle} />
              <input type="text" placeholder="Día (Ej: Domingo 15/10)" value={formCartelera.dia} onChange={e => setFormCartelera({...formCartelera, dia: e.target.value})} required style={inputStyle} />
              <input type="text" placeholder="Horario (Ej: 19:30 hs)" value={formCartelera.horario} onChange={e => setFormCartelera({...formCartelera, horario: e.target.value})} required style={inputStyle} />
              <input type="text" placeholder="Lugar (Ej: La Cueva de Adulam)" value={formCartelera.lugar} onChange={e => setFormCartelera({...formCartelera, lugar: e.target.value})} required style={inputStyle} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={btnPrimary}>Guardar</button>
                <button type="button" onClick={() => setModalCartelera(false)} style={btnSecondary}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// --- OBJETOS DE ESTILO ---
const tabActiva = { flex: 1, padding: '12px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const tabInactiva = { flex: 1, padding: '12px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const panelStyle = { background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const tituloPanel = { marginTop: 0, color: '#1e3a8a', marginBottom: '20px', textAlign: 'center' };
const itemStyle = { padding: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '6px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box', fontSize: '1rem' };
const btnPrimary = { background: '#3182ce', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flex: 1 };
const btnSecondary = { background: '#94a3b8', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flex: 1 };
const btnSmallBlue = { background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' };
const btnSmallGray = { background: '#94a3b8', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' };
const btnSmallRed = { background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' };