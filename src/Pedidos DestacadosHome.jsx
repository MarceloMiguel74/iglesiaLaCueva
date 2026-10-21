import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function PedidosDestacadosHome() {
  const [pedidosRecientes, setPedidosRecientes] = useState([]);

  useEffect(() => {
    fetchPedidosHome();
  }, []);

  const fetchPedidosHome = async () => {
    const { data } = await supabase
      .from('pedidos_oracion')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(3);

    if (data) setPedidosRecientes(data);
  };

  if (pedidosRecientes.length === 0) return null;

  return (
    <div style={{ position: 'relative', width: '100%', padding: '50px 0', backgroundColor: '#1e293b' }}>
      <div style={{ width: '70%', minWidth: '320px', margin: '0 auto' }}>
        <h3 style={{ color: '#f59e0b', textAlign: 'center', fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '25px' }}>
          🙏 Motivos de Oración de nuestra Comunidad
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {pedidosRecientes.map(pedido => (
            <div key={pedido.id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #f59e0b',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              {/* Encabezado con Estado */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ color: '#1e3a8a', fontSize: '1.1rem' }}>{pedido.nombre}</strong>
                <span style={obtenerEstiloEstado(pedido.estado)}>
                  {obtenerTextoEstado(pedido.estado)}
                </span>
              </div>

              {/* Contenido */}
              <p style={{ color: '#1e293b', fontStyle: 'italic', fontSize: '1.05rem', marginBottom: '15px', lineHeight: '1.5' }}>
                "{pedido.pedido}"
              </p>

              {/* Pie con País */}
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px', textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>📍 {pedido.pais || 'Argentina'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Funciones auxiliares para el formato de estados
function obtenerTextoEstado(estado) {
  if (estado === 'Orando') return '🙏 En Oración';
  if (estado === 'Contestado') return '✨ Contestado';
  return '⏳ Pendiente';
}

function obtenerEstiloEstado(estado) {
  let bg = '#fef3c7';
  let color = '#d97706';

  if (estado === 'Orando') {
    bg = '#e0f2fe';
    color = '#0284c7';
  } else if (estado === 'Contestado') {
    bg = '#dcfce7';
    color = '#15803d';
  }

  return {
    backgroundColor: bg,
    color: color,
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  };
}