import { useEffect, useState } from 'react';
import { supabase } from './supabase';

function formatearFecha(fecha) {
  if (!fecha) return '';
  const [anio, mes, dia] = String(fecha).slice(0, 10).split('-');
  return dia && mes && anio ? `${dia}-${mes}-${anio}` : fecha;
}

export function ReflexionesPage() {
  const [reflexiones, setReflexiones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const { data, error } = await supabase
        .from('reflexiones')
        .select('*')
        .eq('activa', true)
        .order('fecha', { ascending: false })
        .order('id', { ascending: false });
      if (!error && data) setReflexiones(data);
      setCargando(false);
    };
    cargar();
  }, []);

  const manejarMeGusta = async (reflexion) => {
    const clave = `reflexion_like_${reflexion.id}`;
    if (localStorage.getItem(clave)) return;
    localStorage.setItem(clave, '1');
    setReflexiones((items) => items.map((item) => item.id === reflexion.id ? { ...item, me_gusta: (item.me_gusta || 0) + 1 } : item));
    await supabase.rpc('incrementar_me_gusta_reflexion', { reflexion_id: reflexion.id });
  };

  const compartir = async (reflexion) => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://micuevadeadulam.org/reflexiones';
    const texto = `${reflexion.titulo}\n${reflexion.versiculo || ''}\n${url}`;
    if (navigator.share) {
      try { await navigator.share({ title: reflexion.titulo, text: texto, url }); return; } catch { return; }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer');
  };

  const descargar = async (reflexion) => {
    try {
      const respuesta = await fetch(reflexion.imagen_url);
      const blob = await respuesta.blob();
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url; enlace.download = `${reflexion.titulo || 'reflexion-biblica'}.jpg`;
      document.body.appendChild(enlace); enlace.click(); enlace.remove(); URL.revokeObjectURL(url);
    } catch {
      window.open(reflexion.imagen_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <main style={{ minHeight: '70vh', padding: '60px 20px', background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: '#997a45', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Palabra para el día</span>
          <h1 style={{ color: '#1e3a8a', fontSize: 'clamp(2rem, 5vw, 3rem)', marginTop: '8px' }}>Reflexiones bíblicas</h1>
        </header>

        {cargando ? <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando reflexiones...</p> : reflexiones.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Todavía no hay reflexiones publicadas.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {reflexiones.map((reflexion) => (
              <article key={reflexion.id} style={{ overflow: 'hidden', borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(30,58,138,0.08)' }}>
                <div style={{ height: '260px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={reflexion.imagen_url} alt={reflexion.titulo || 'Reflexión bíblica'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '22px' }}>
                  <p style={{ color: '#997a45', fontWeight: 700, marginBottom: '8px' }}>📅 {formatearFecha(reflexion.fecha)}</p>
                  <h2 style={{ color: '#1e3a8a', fontSize: '1.35rem', marginBottom: '10px' }}>{reflexion.titulo}</h2>
                  {reflexion.descripcion && <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '10px' }}>{reflexion.descripcion}</p>}
                  {reflexion.versiculo && <p style={{ color: '#0f172a', fontWeight: 700, lineHeight: 1.5 }}>📖 {reflexion.versiculo}</p>}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', marginTop: '18px' }}>
                    <button onClick={() => manejarMeGusta(reflexion)} style={{ padding: '9px 5px', borderRadius: '7px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#1e3a8a', fontWeight: 700, cursor: 'pointer' }}>❤️ {reflexion.me_gusta || 0}</button>
                    <button onClick={() => compartir(reflexion)} style={{ padding: '9px 5px', borderRadius: '7px', border: 0, backgroundColor: '#c2a26f', color: '#172f32', fontWeight: 700, cursor: 'pointer' }}>Compartir</button>
                    <button onClick={() => descargar(reflexion)} style={{ padding: '9px 5px', borderRadius: '7px', border: '1px solid #1b3c40', backgroundColor: 'transparent', color: '#1b3c40', fontWeight: 700, cursor: 'pointer' }}>Descargar</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
