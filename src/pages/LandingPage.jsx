import React from 'react';
import Navbar from '../components/NavBar/NavBar'; 
import Card from '../components/Card/Card';

function LandingPage() {
  const packagesData = [
    { title: "Pacote 1", description: "Viagens incríveis te esperam neste pacote promocional." },
    { title: "Pacote 2", description: "Oportunidade única para explorar novos destinos." },
    { title: "Pacote 3", description: "Aproveite a temporada de ofertas para planejar seu roteiro." },
  ];

  return (
    <div className="landing-page-container">
      
      
      <Navbar /> 
      
      <main style={{ padding: '40px 60px' }}>
        
        
        <section className="hero-section" style={{ display: 'flex', gap: '50px', marginBottom: '60px', alignItems: 'center', minHeight: '350px' }}>
          
          <div className="hero-content" style={{ flex: 1, paddingRight: '20px' }}>
            <h1 style={{ fontSize: '2.5em', marginBottom: '15px', color: '#333' }}>O Mundo Todo em Suas Mãos</h1>
            <p style={{ lineHeight: 1.6, marginBottom: '25px', maxWidth: '450px', color: '#555' }}>
              Descubra os melhores roteiros e planos de viagem com a gente. Planejamento fácil, execução perfeita.
            </p>
            <button style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Começar a Planejar
            </button>
          </div>

          <div className="hero-image-placeholder" style={{ flex: 1, backgroundColor: '#e9ecef', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            🖼️ Imagem de Destaque
          </div>
        </section>

        
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Confira Nossos Pacotes</h2>
        <section className="cards-section" style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
          {packagesData.map((data, index) => (
            <Card 
              key={index}
              title={data.title}
              description={data.description}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default LandingPage;