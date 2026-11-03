import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';

function formatearFecha(fecha) {
  if (!fecha) return 'Hoy';
  const soloFecha = String(fecha).slice(0, 10);
  const [anio, mes, dia] = soloFecha.split('-');
  return dia && mes && anio ? `${dia}-${mes}-${anio}` : soloFecha;
}

export function ReflexionesHome() {
  const [reflexiones, setReflexiones] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const { data, error } = await supabase
        .from('reflexiones')
        .select('*')
        .eq('activa', true)
        .order('fecha', { ascending: false })
        .order('id', { ascending: false })
        .limit(1);

      if (!error && data) setReflexiones(data);
    };
    cargar();
  }, []);

  if (reflexiones.length === 0) return null;

  const actual = reflexiones[0];
  const url = typeof window !== 'undefined' ? window.location.href : 'https://micuevadeadulam.org';
  const textoCompartir = `${actual.titulo}\n${actual.versiculo}\n${url}`;

  const manejarMeGusta = async () => {
    const clave = `reflexion_like_${actual.id}`;
    if (localStorage.getItem(clave)) return;

    const nuevosLikes = (actual.me_gusta || 0) + 1;
    setReflexiones((actuales) => actuales.map((item) => item.id === actual.id ? { ...item, me_gusta: nuevosLikes } : item));
    localStorage.setItem(clave, '1');
    await supabase.rpc('incrementar_me_gusta_reflexion', { reflexion_id: actual.id });
  };

  const compartir = async () => {
    if (navigator.share) {
      await navigator.share({ title: actual.titulo, text: textoCompartir, url });
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(textoCompartir)}`, '_blank', 'noopener,noreferrer');
  };

  const descargar = async () => {
    try {
      const respuesta = await fetch(actual.imagen_url);
      const blob = await respuesta.blob();
      const objetoUrl = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = objetoUrl;
      enlace.download = `${actual.titulo || 'reflexion-biblica'}.jpg`;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      URL.revokeObjectURL(objetoUrl);
    } catch {
      window.open(actual.imagen_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section aria-labelledby="reflexiones-titulo" style={{ padding: '70px 20px', background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ color: '#997a45', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Palabra para el día</span>
          <h2 id="reflexiones-titulo" style={{ color: '#1e3a8a', fontSize: 'clamp(2rem, 4vw, 2.7rem)', marginTop: '6px' }}>Reflexiones bíblicas</h2>
        </div>

        <div className="reflexiones-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(280px, 0.65fr)', gap: '28px', alignItems: 'stretch' }}>
          <article style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(30, 58, 138, 0.12)', border: '1px solid #e2e8f0' }}>
            <div className="reflexion-imagen-contenedor" style={{ width: '100%', height: 'min(620px, 52vw)', minHeight: '420px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={actual.imagen_url} alt={actual.titulo || 'Reflexión bíblica'} style={{ width: '100%', height: '100%', maxHeight: '620px', objectFit: 'contain', display: 'block' }} /></div>
          </article>

          <div style={{ background: '#1b3c40', color: '#fff', borderRadius: '18px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#e6d59f', fontWeight: 700, marginBottom: '10px' }}>📅 {formatearFecha(actual.fecha)}</p>
              <h3 style={{ fontSize: '1.65rem', marginBottom: '14px' }}>{actual.titulo}</h3>
              {actual.descripcion && <p style={{ lineHeight: 1.7, color: '#e2e8f0', marginBottom: '16px' }}>{actual.descripcion}</p>}
              {actual.versiculo && <p style={{ fontWeight: 700, lineHeight: 1.6 }}>📖 {actual.versiculo}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '24px' }}>
              <button type="button" onClick={manejarMeGusta} style={{ border: '1px solid #c2a26f', borderRadius: '8px', padding: '10px 6px', background: '#fff', color: '#1e3a8a', fontWeight: 700, cursor: 'pointer' }}>❤️ {actual.me_gusta || 0}</button>
              <button type="button" onClick={compartir} style={{ border: '1px solid #c2a26f', borderRadius: '8px', padding: '10px 6px', background: '#c2a26f', color: '#172f32', fontWeight: 700, cursor: 'pointer' }}>Compartir</button>
              <button type="button" onClick={descargar} style={{ border: '1px solid #fff', borderRadius: '8px', padding: '10px 6px', background: 'transparent', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Descargar</button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/reflexiones" style={{ display: 'inline-block', padding: '12px 22px', borderRadius: '8px', backgroundColor: '#1e3a8a', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Ver todas las reflexiones →</Link>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .reflexiones-grid { grid-template-columns: 1fr !important; } .reflexion-imagen-contenedor { min-height: 260px !important; } }`}</style>
    </section>
  );
}
