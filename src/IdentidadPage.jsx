import React, { useState, useEffect } from 'react';
import { supabase } from './supabase'; 

export default function IdentidadPage() {
  const [visitas, setVisitas] = useState(0);

  useEffect(() => {
    const registrarVisitaIdentidad = async () => {
      try {
        const { data } = await supabase.from('visitas_paginas').select('conteo').eq('ruta', '/identidad').single();
        if (data) {
          const nuevasVisitas = data.conteo + 1;
          setVisitas(nuevasVisitas);
          await supabase.from('visitas_paginas').update({ conteo: nuevasVisitas }).eq('ruta', '/identidad');
        }
      } catch (err) {
        console.error("Error con el contador de visitas:", err);
      }
    };
    registrarVisitaIdentidad();
  }, []);

  const valores = [
    { titulo: "Amor y Servicio", desc: "Servir con integridad y fortalecer a las familias.", pasaje: "Mateo 22:35-39", texto: "«Amarás al Señor tu Dios con todo tu corazón... Y el segundo es semejante: Amarás a tu prójimo como a ti mismo.»" },
    { titulo: "Gracia Incondicional", desc: "Un refugio seguro para los quebrantados.", pasaje: "2 Corintios 12:9", texto: "«Te basta mi gracia; porque mi poder se perfecciona en la debilidad.»" },
    { titulo: "Transformación", desc: "Convertir las heridas en carácter y fortalezas en Cristo.", pasaje: "1 Samuel 22:1-2", texto: "«Se juntaron con él todos los afligidos, y todo el que estaba endeudado, y todos los que se hallaban en amargura de espíritu...»" },
    { titulo: "Dependencia Total", desc: "Guiados únicamente por la oración y la Palabra.", pasaje: "Proverbios 3:5-6", texto: "«Confía en el Señor con todo tu corazón, y no te apoyes en tu propia prudencia.»" },
    { titulo: "Comunidad Auténtica", desc: "Relaciones de fe donde todos encontramos pertenencia.", pasaje: "Hechos 2:42", texto: "«Y perseveraban en la doctrina de los apóstoles, en la comunión unos con otros...»" },
    { titulo: "Propósito y Misión", desc: "Salir de la cueva para transformar nuestro entorno.", pasaje: "Mateo 28:19-20", texto: "«Por tanto, id, y haced discípulos a todas las naciones...»" }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', padding: '60px 0', backgroundColor: '#1e293b' }}>
      
      {/* MAGIA CSS RESPONSIVE */}
      <style>{`
        .contenedor-identidad { width: 70%; margin: 0 auto; position: relative; z-index: 2; }
        .titulo-identidad { color: #fff; text-align: center; font-size: 3rem; font-weight: bold; margin-bottom: 45px; text-shadow: 0 3px 10px rgba(0,0,0,0.9); line-height: 1.2; }
        .titulo-secundario { color: #fff; text-align: center; font-size: 2.5rem; font-weight: bold; margin-bottom: 35px; text-shadow: 0 3px 10px rgba(0,0,0,0.9); line-height: 1.2; }
        
        .tarjeta-dorada {
          background-color: rgba(255, 255, 255, 0.96); padding: 30px; border-radius: 16px; 
          border: 2px solid #f59e0b; box-shadow: 0 0 20px rgba(245, 158, 11, 0.45), 0 8px 25px rgba(0,0,0,0.5); 
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        /* AJUSTES PARA CELULAR */
        @media (max-width: 768px) {
          .contenedor-identidad { width: 92%; }
          .titulo-identidad { font-size: 2.2rem; margin-bottom: 25px; line-height: 1.15; padding: 0 10px; }
          .titulo-secundario { font-size: 2rem; margin-bottom: 25px; }
          .tarjeta-dorada { padding: 20px; }
        }
      `}</style>

      {/* Etiqueta flotante para mostrar visitas */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', zIndex: 9999, backdropFilter: 'blur(4px)', border: '1px solid #334155' }}>
        👁️ Visitas: <strong>{visitas}</strong>
      </div>

      {/* Video de fondo */}
      <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
        <source src="/cielo.mp4" type="video/mp4" />
      </video>

      {/* Capa oscura */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.45)', zIndex: 1 }}></div>

      {/* Contenido principal */}
      <div className="contenedor-identidad">
        
        <h1 className="titulo-identidad">✨ Nuestra Identidad</h1>

        {/* Misión y Visión */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          <div className="tarjeta-dorada">
            <h2 style={{ color: '#1e3a8a', margin: '0 0 15px 0', textAlign: 'center', fontSize: '2.2rem', fontWeight: 'bold' }}>🎯 Misión</h2>
            <p style={{ margin: 0, lineHeight: '1.6', color: '#1f2937', textAlign: 'justify', fontSize: '1.15rem', fontWeight: '500' }}>
              Ser un refugio Cristo-céntrico donde los afligidos, endeudados y amargados de espíritu encuentran sanidad, propósito y pertenencia, siendo transformados por el amor de Jesús para convertirse en sus seguidores y guerreros espirituales.
            </p>
          </div>

          <div className="tarjeta-dorada">
            <h2 style={{ color: '#1e3a8a', margin: '0 0 15px 0', textAlign: 'center', fontSize: '2.2rem', fontWeight: 'bold' }}>👁️ Visión</h2>
            <p style={{ margin: 0, lineHeight: '1.6', color: '#1f2937', textAlign: 'justify', fontSize: '1.15rem', fontWeight: '500' }}>
              Ser una iglesia relevante y transformadora en González Catán. Una comunidad que refleja el corazón de Cristo, transformando vidas en LA CUEVA (nuestras circunstancias difíciles) para que cada persona pase de ser un marginado a un adorador y guerrero que impacta su generación para la gloria de Dios.
            </p>
          </div>
        </div>

        {/* Título Valores */}
        <h2 className="titulo-secundario">💖 Nuestros Valores</h2>

        {/* Grilla de Valores */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          {valores.map((v, index) => (
            <div key={index} className="tarjeta-dorada" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: '#1e3a8a', margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{v.titulo}</h3>
                <p style={{ color: '#374151', margin: '0 0 18px 0', fontWeight: '600', fontSize: '1.1rem' }}>{v.desc}</p>
              </div>
              <blockquote style={{ margin: 0, paddingLeft: '15px', borderLeft: '4px solid #f59e0b', fontStyle: 'italic', color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.5' }}>
                {v.texto}
                <span style={{ display: 'block', fontWeight: 'bold', fontStyle: 'normal', color: '#1e3a8a', marginTop: '8px', fontSize: '1rem' }}>
                  — {v.pasaje}
                </span>
              </blockquote>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}