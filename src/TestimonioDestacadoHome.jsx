import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

function TestimonioDestacadoHome() {
  const [ultimoTestimonio, setUltimoTestimonio] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchUltimoTestimonio();
  }, []);

  const fetchUltimoTestimonio = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonios')
        .select('*')
        .eq('aprobado', true)
        .order('fecha', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error cargando testimonio en el Inicio:", error);
      } else if (data && data.length > 0) {
        setUltimoTestimonio(data[0]);
      }
    } catch (err) {
      console.error("Excepción inesperada:", err);
    } finally {
      setCargando(false);
    }
  };

  if (cargando || !ultimoTestimonio) return null;

  return (
    <div className="seccion-testimonio-destacado" style={{ position: 'relative', width: '100%', backgroundColor: '#0f172a' }}>
      
      <style>{`
        .seccion-testimonio-destacado {
          padding: 50px 0;
        }
        .contenedor-testimonio {
          width: 70%;
          max-width: 900px;
          margin: 0 auto;
        }
        .titulo-testimonio {
          color: #f59e0b;
          text-align: center;
          font-size: 2.2rem;
          font-weight: bold;
          line-height: 1.2; /* 👈 AQUÍ SOLUCIONAMOS EL APLASTAMIENTO */
          margin-bottom: 25px;
        }
        .tarjeta-testimonio {
          background-color: rgba(255, 255, 255, 0.96);
          padding: 35px;
          border-radius: 16px;
          border: 2px solid #f59e0b;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.45), 0 8px 25px rgba(0,0,0,0.5);
          text-align: center;
        }
        .texto-testimonio {
          font-style: italic;
          color: #1f2937;
          font-size: 1.25rem;
          line-height: 1.8; 
          margin-bottom: 20px;
        }
        .autor-testimonio {
          font-weight: bold;
          color: #1e3a8a;
          font-size: 1.1rem;
          margin: 0;
        }

        /* AJUSTES CELULAR */
        @media (max-width: 768px) {
          .seccion-testimonio-destacado {
            padding: 40px 0;
          }
          .contenedor-testimonio {
            width: 92%; 
          }
          .titulo-testimonio {
            font-size: 1.8rem;
            line-height: 1.2; /* 👈 EVITA QUE CHOQUEN LAS LETRAS EN MÓVIL */
            margin-bottom: 20px;
            padding: 0 10px; 
          }
          .tarjeta-testimonio {
            padding: 25px 20px; 
          }
          .texto-testimonio {
            font-size: 1.1rem;
            line-height: 1.6; 
            margin-bottom: 20px; 
          }
        }
      `}</style>

      <div className="contenedor-testimonio">
        <h3 className="titulo-testimonio">
          ✨ Lo que Dios está haciendo
        </h3>

        <div className="tarjeta-testimonio">
          <p className="texto-testimonio">
            "{ultimoTestimonio?.mensaje || ''}"
          </p>
          <p className="autor-testimonio">
            — {ultimoTestimonio?.nombre || 'Anónimo'} 
            {ultimoTestimonio?.pais && <span style={{ fontWeight: 'normal', color: '#4b5563' }}> ({ultimoTestimonio.pais})</span>}
          </p>
        </div>
      </div>
    </div>
  );
}