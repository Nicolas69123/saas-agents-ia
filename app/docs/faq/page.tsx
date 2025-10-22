'use client'

export default function FAQPage() {
  const faqs = [
    {
      question: 'Comment démarrer avec SaaS Agents IA ?',
      answer: 'Inscrivez-vous gratuitement, choisissez vos agents IA, et connectez vos outils en quelques clics...'
    },
    {
      question: 'Puis-je essayer avant de payer ?',
      answer: 'Oui ! Nous offrons 14 jours d\'essai gratuit sans carte bancaire requise...'
    },
    {
      question: 'Comment fonctionnent les intégrations ?',
      answer: 'Nos agents se connectent via API, webhooks ou via n8n/Zapier...'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Absolument. Nous utilisons un chiffrement end-to-end et sommes conformes RGPD...'
    },
    {
      question: 'Puis-je annuler mon abonnement ?',
      answer: 'Oui, à tout moment depuis vos paramètres. Aucun engagement...'
    }
  ]

  return (
    <div className="page-container">
      <section>
        <div className="container">
          <h1>Questions Fréquentes (FAQ)</h1>
          <p>Trouvez les réponses aux questions les plus posées</p>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .faq-list {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .faq-item {
          padding: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: #fff;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .faq-item h3 {
          font-size: 1.2rem;
          margin-bottom: 12px;
          color: #000;
        }

        .faq-item p {
          margin: 0;
          opacity: 0.7;
          line-height: 1.6;
        }
      `}</style>
    </div>
  )
}
