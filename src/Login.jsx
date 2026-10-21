import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase'; // ¡Agregamos la conexión a Supabase!

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos
    
    // Conexión REAL a Supabase
    const { error: errorSupabase } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (errorSupabase) {
      setError('Credenciales incorrectas. Por favor, intenta de nuevo.');
    } else {
      // Si todo sale bien, Supabase le avisa a App.jsx automáticamente
      // y nosotros solo tenemos que viajar a la ruta /admin
      navigate('/admin'); 
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '20px' }}>
      <form 
        onSubmit={handleLogin} 
        style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}
      >
        <h2 style={{ textAlign: 'center', color: 'var(--color-primario)', marginBottom: '20px' }}>
          Acceso Administrativo
        </h2>
        
        {error && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Correo Electrónico</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Contraseña</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-primario)', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}