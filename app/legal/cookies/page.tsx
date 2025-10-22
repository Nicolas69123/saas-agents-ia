'use client'

export default function CookiesPage() {
  return (
    <div className="page-container">
      <section>
        <div className="container">
          <h1>Politique de Cookies</h1>
          <p>Dernière mise à jour : 22 octobre 2025</p>

          <div className="legal-content">
            <h2>Qu'est-ce qu'un cookie ?</h2>
            <p>Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite...</p>

            <h2>Types de cookies utilisés</h2>

            <h3>Cookies essentiels</h3>
            <p>Nécessaires au fonctionnement du site (session, authentification)...</p>

            <h3>Cookies d'analyse</h3>
            <p>Nous permettent de comprendre comment vous utilisez notre site...</p>

            <h3>Cookies de performance</h3>
            <p>Optimisent l'expérience utilisateur en mémorisant vos préférences...</p>

            <h2>Gestion des cookies</h2>
            <p>Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur...</p>

            <h2>Durée de conservation</h2>
            <p>La plupart de nos cookies expirent après 12 mois...</p>

            <h2>Contact</h2>
            <p>Pour toute question : cookies@saas-agents-ia.fr</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .legal-content {
          max-width: 800px;
          margin: 40px auto;
        }

        .legal-content h2 {
          margin-top: 32px;
          margin-bottom: 16px;
          font-size: 1.5rem;
        }

        .legal-content h3 {
          margin-top: 20px;
          margin-bottom: 12px;
          font-size: 1.2rem;
        }

        .legal-content p {
          opacity: 0.8;
          line-height: 1.8;
        }
      `}</style>
    </div>
  )
}
