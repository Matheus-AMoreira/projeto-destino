
import React from 'react';


/**
 * 
 * @param {object} props 
 * @param {string} props.title 
 * @param {string} props.description 
 */
function Card({ title, description }) {
  return (
    <div className="card-container" style={{ border: '1px solid #ccc', padding: '15px', maxWidth: '300px', margin: '10px', display: 'inline-block' }}>
      {/* Área placeholder para imagem */}
      <div className="card-image-placeholder" style={{ backgroundColor: '#eee', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
        🖼️
      </div>

      <h3 className="card-title">{title}</h3>
      <p className="card-description" style={{ fontSize: '0.9em', color: '#555' }}>
        {description}
      </p>

      <button className="card-button" style={{ backgroundColor: '#333', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
        Saiba Mais
      </button>
    </div>
  );
}

export default Card;