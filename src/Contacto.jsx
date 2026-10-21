import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function Contacto() {
  const [visitas, setVisitas] = useState(0);
  
  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [contactoInfo, setContactoInfo] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const registrarVisitaContacto = async () => {
      try {
        const { data, error } = await supabase.from('visitas_paginas').select('conteo').eq('ruta', '/contacto').single();
        if (data) {
          const nuevasVisitas = data.conteo + 1;
          setVisitas(nuevasVisitas); 
          await supabase.from('visitas_paginas').update({ conteo: nuevasVisitas }).eq('ruta', '/contacto');
        }
      } catch (err) {
        console.error("Error con el contador de visitas:", err);
      }
    };
    registrarVisitaContacto();
  }, []);

  // Función para enviar a Supabase
  const enviarMensaje = async (e) => {
    e.preventDefault();
    
    const nuevoMensaje = {
      nombre: nombre,
      contacto_info: contactoInfo,
      motivo: motivo,
      mensaje: mensaje,
      aprobada: false // Por defecto, ninguna reseña se publica hasta que la apruebes
    };

    const { error } = await supabase.from('mensajes_contacto').insert([nuevoMensaje]);

    if (error) {
      alert("Hubo un error al enviar tu mensaje: " + error.message);
    } else {
      alert("¡Mensaje enviado con éxito! Nos pondremos en contacto a la brevedad.");
      // Limpiar formulario
      setNombre(''); setContactoInfo(''); setMotivo(''); setMensaje('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '40px auto 20px', position: 'relative', minHeight: '80vh' }}>
      
      {/* Etiqueta flotante para mostrar visitas */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', zIndex: 9999, backdropFilter: 'blur(4px)', border: '1px solid #334155' }}>
        👁️ Visitas: <strong>{visitas}</strong>
      </div>

      <style>{`
        .contenedor-contactos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 800px; margin: 0 auto; }
        @media (max-width: 768px) { .contenedor-contactos { grid-template-columns: 1fr; } .formulario-contacto { padding: 20px !important; } }
        .enlace-wa { text-decoration: none; display: block; height: 100%; }
        .tarjeta-contacto { background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.3s ease; cursor: pointer; height: 100%; display: flex; flex-direction: column; justify-content: center; }
        .enlace-wa:hover .tarjeta-contacto { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(37, 211, 102, 0.2); border-color: #25d366; }
        .numero-wa { font-size: 1.5rem; color: var(--color-primario, #1e3a8a); margin: 10px 0 5px 0; font-weight: bold; transition: color 0.3s ease; }
        .enlace-wa:hover .numero-wa { color: #25d366; }
        .nombre-contacto { font-size: 1.1rem; color: #64748b; margin: 0; }
        .icono-wa { font-size: 2.5rem; margin-bottom: 10px; transition: transform 0.3s ease; }
        .enlace-wa:hover .icono-wa { transform: scale(1.1); }
        .input-form { width: 100%; padding: 12px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #cbd5e1; box-sizing: border-box; font-size: 1rem; font-family: inherit; }
        .input-form:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .btn-enviar { background-color: #f59e0b; color: #0f172a; border: none; padding: 14px 25px; border-radius: 6px; font-weight: bold; font-size: 1.1rem; cursor: pointer; width: 100%; transition: background 0.3s, transform 0.1s; }
        .btn-enviar:hover { background-color: #d97706; color: white; }
        .btn-enviar:active { transform: scale(0.98); }
      `}</style>

      <h2 style={{ color: 'var(--color-primario)', borderBottom: '2px solid var(--color-acento)', paddingBottom: '10px', textAlign: 'center' }}>
        📍 Contáctanos
      </h2>
      
      <div style={{ backgroundColor: '#fff', padding: '30px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '30px' }}>
        <h3 style={{ textAlign: 'center', color: '#64748b', marginTop: 0, marginBottom: '25px', fontSize: '1.2rem' }}>Atención Inmediata (WhatsApp)</h3>
        <div className="contenedor-contactos">
          <a href="https://wa.me/5491130093939?text=Hola,%20quisiera%20hacer%20una%20consulta" target="_blank" rel="noopener noreferrer" className="enlace-wa">
            <div className="tarjeta-contacto">
              <div className="icono-wa">📱</div>
              <h3 className="numero-wa">11-3009-3939</h3>
              <p className="nombre-contacto">(Marcelo)</p>
              <p style={{ color: '#25d366', fontSize: '0.85rem', marginTop: '10px', fontWeight: 'bold' }}>Toque para escribir</p>
            </div>
          </a>
          <a href="https://wa.me/5491127008920?text=Hola,%20quisiera%20hacer%20una%20consulta" target="_blank" rel="noopener noreferrer" className="enlace-wa">
            <div className="tarjeta-contacto">
              <div className="icono-wa">📱</div>
              <h3 className="numero-wa">11-2700-8920</h3>
              <p className="nombre-contacto">(Lorena)</p>
              <p style={{ color: '#25d366', fontSize: '0.85rem', marginTop: '10px', fontWeight: 'bold' }}>Toque para escribir</p>
            </div>
          </a>
        </div>
      </div>

      {/* FORMULARIO CONECTADO A SUPABASE */}
      <div className="formulario-contacto" style={{ backgroundColor: '#f8fafc', padding: '40px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '30px', maxWidth: '600px', margin: '30px auto' }}>
        <h3 style={{ textAlign: 'center', color: '#1e3a8a', marginTop: 0, marginBottom: '10px', fontSize: '1.5rem' }}>Déjanos un Mensaje</h3>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '25px' }}>Completa el formulario y nos pondremos en contacto contigo a la brevedad.</p>

        <form onSubmit={enviarMensaje}>
          <input type="text" placeholder="Tu Nombre completo" className="input-form" required 
            value={nombre} onChange={e => setNombre(e.target.value)} />
          
          <input type="text" placeholder="Tu número de teléfono o Email" className="input-form" required 
            value={contactoInfo} onChange={e => setContactoInfo(e.target.value)} />
          
          <select className="input-form" required value={motivo} onChange={e => setMotivo(e.target.value)}>
            <option value="" disabled>Selecciona el motivo de tu mensaje...</option>
            <option value="Reseña">📝 Dejar una reseña sobre la iglesia</option>
            <option value="Comunicacion">📞 Necesito que se comuniquen conmigo</option>
            <option value="Visita">🏠 Quisiera pedir una visita</option>
            <option value="Discipulado">📖 Solicitar estudio de discipulado</option>
            <option value="Otro">❓ Otro motivo</option>
          </select>

          <textarea placeholder="Escribe aquí los detalles (opcional)" className="input-form" style={{ minHeight: '120px', resize: 'vertical' }}
            value={mensaje} onChange={e => setMensaje(e.target.value)}></textarea>

          <button type="submit" className="btn-enviar">Enviar Mensaje 🚀</button>
        </form>
      </div>

    </div>
  );
}