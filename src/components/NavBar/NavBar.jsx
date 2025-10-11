import React from 'react';
import { Link } from 'react-router-dom';


function Navbar() { 
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', marginTop: '20px' }}>
      
      
      <Link to="/" className="logo" style={{ fontWeight: 'bold', fontSize: '1.5em', textDecoration: 'none', color: '#007bff' }}>
        DESTINO
      </Link>
      
      <nav style={{ display: 'flex', gap: '25px' }}>
        
        <Link to="/viagens" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>Viagens</Link>
        <Link to="/relatorios" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>Relatórios</Link>
        <Link to="/contato" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>Contato</Link>
        
        
        <Link to="/login" style={{ textDecoration: 'none', color: '#FE8A02', fontWeight: 'bold' }}>Sair (Admin)</Link>
      </nav>

      <div className="search-box">
        <input 
          type="search" 
          placeholder="Buscar no site..." 
          style={{ padding: '8px 15px', border: '1px solid #ccc', borderRadius: '20px', width: '250px' }} 
        />
      </div>
    </header>
  );
}

export default Navbar;