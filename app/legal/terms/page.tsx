'use client'

export default function TermsPage() {
  return (
    <div className="page-container">
      <section>
        <div className="container">
          <h1>Conditions Générales d'Utilisation</h1>
          <p>Dernière mise à jour : 22 octobre 2025</p>

          <div className="legal-content">
            <h2>1. Acceptation des conditions</h2>
            <p>En utilisant SaaS Agents IA, vous acceptez ces conditions d'utilisation...</p>

            <h2>2. Description du service</h2>
            <p>SaaS Agents IA fournit des agents IA automatisés pour les entreprises...</p>

            <h2>3. Inscription et compte</h2>
            <p>Vous devez créer un compte pour utiliser nos services...</p>

            <h2>4. Tarification et paiement</h2>
            <p>Les prix sont indiqués en euros TTC. Le paiement est mensuel ou annuel...</p>

            <h2>5. Utilisation acceptable</h2>
            <p>Vous vous engagez à utiliser nos services de manière légale et éthique...</p>

            <h2>6. Propriété intellectuelle</h2>
            <p>Tous les contenus générés par nos agents vous appartiennent...</p>

            <h2>7. Limitation de responsabilité</h2>
            <p>Nos agents IA sont fournis "en l'état". Nous ne garantissons pas...</p>

            <h2>8. Résiliation</h2>
            <p>Vous pouvez résilier votre abonnement à tout moment...</p>

            <h2>9. Modifications</h2>
            <p>Nous nous réservons le droit de modifier ces conditions...</p>

            <h2>10. Contact</h2>
            <p>Pour toute question : legal@saas-agents-ia.fr</p>
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
