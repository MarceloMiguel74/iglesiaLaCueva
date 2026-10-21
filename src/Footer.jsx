import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer style={{ 
      backgroundColor: 'var(--color-primario)', 
      color: '#fff', 
      padding: '30px 20px 20px', 
      textAlign: 'center', 
      marginTop: '40px',
      borderTop: '3px solid var(--color-acento)'
    }}>
      
      {/* Derechos Reservados */}
      <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem' }}>
        © 2026 La Cueva de Adulam. Todos los derechos reservados.
      </p>

      {/* Sección del Desarrollador (Código Agape) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '25px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)' /* Línea separadora muy sutil */
      }}>
        <span style={{ fontSize: '0.8rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Desarrollo web con propósito
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* LOGO: Asegúrate de guardar la imagen del logo en tu carpeta 'public' */}
          <img 
            src="/logo-agape.png" 
            alt="Logo Código Agape" 
            style={{ width: '35px', height: 'auto' }} 
          />
          <span style={{ 
            fontFamily: 'serif', /* O la fuente que uses para tu marca */
            fontSize: '1.3rem', 
            color: '#d4af37', /* Color dorado imitando tu tarjeta */
            fontWeight: 'bold',
            letterSpacing: '1.5px'
          }}>
            CÓDIGO AGAPE
          </span>
        </div>
      </div>
      
      {/* Enlace sutil de administración */}
      <div>
        <Link to="/admin" style={{ 
          color: 'var(--color-acento)', 
          textDecoration: 'none', 
          fontSize: '0.8rem', 
          opacity: 0.5,
          transition: 'opacity 0.3s'
        }}>
          Admin
        </Link>
      </div>
      
    </footer>
  );
}