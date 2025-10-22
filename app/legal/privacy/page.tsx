'use client'

export default function PrivacyPage() {
  return (
    <div className="page-container">
      <section>
        <div className="container">
          <h1>Politique de Confidentialité</h1>
          <p>Dernière mise à jour : 22 octobre 2025</p>

          <div className="legal-content">
            <h2>1. Collecte des données</h2>
            <p>Nous collectons les informations que vous nous fournissez directement lors de votre inscription...</p>

            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour fournir nos services d'agents IA...</p>

            <h2>3. Protection des données</h2>
            <p>Nous utilisons des mesures de sécurité de niveau entreprise...</p>

            <h2>4. Partage des données</h2>
            <p>Nous ne vendons jamais vos données à des tiers...</p>

            <h2>5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification...</p>

            <h2>6. Cookies</h2>
            <p>Nous utilisons des cookies pour améliorer votre expérience...</p>

            <h2>7. Contact</h2>
            <p>Pour toute question concernant vos données : privacy@saas-agents-ia.fr</p>
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

        .legal-content p {
          opacity: 0.8;
          line-height: 1.8;
        }
      `}</style>
    </div>
  )
}
