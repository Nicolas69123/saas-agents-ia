'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const articles = [
  {
    id: 1,
    slug: 'automatiser-comptabilite-ia',
    title: 'Comment automatiser sa comptabilité avec l\'IA en 2024',
    excerpt: 'Découvrez comment les agents IA révolutionnent la gestion comptable des PME et permettent de gagner jusqu\'à 70% de temps.',
    category: 'Comptabilité',
    color: '#4F46E5',
    date: '15 Nov 2024',
    readTime: '5 min',
    image: '/blog/automatiser-comptabilite-ia.svg',
    content: `
      <h2>L'IA au service de votre comptabilité</h2>
      <p>La comptabilité est l'un des domaines où l'intelligence artificielle apporte le plus de valeur ajoutée. Les tâches répétitives comme la saisie de factures, le rapprochement bancaire ou le calcul de TVA peuvent désormais être automatisées avec une précision remarquable.</p>
      <p>Dans un contexte économique où chaque minute compte, les dirigeants de PME et TPE passent encore en moyenne 8 heures par semaine sur des tâches comptables. Un temps précieux qui pourrait être consacré au développement de leur activité.</p>

      <h2>Les avantages concrets</h2>
      <p>Nos clients constatent en moyenne :</p>
      <ul>
        <li><strong>70% de temps gagné</strong> sur les tâches administratives</li>
        <li><strong>95% de précision</strong> dans la catégorisation des dépenses</li>
        <li><strong>Zéro erreur</strong> de calcul sur les déclarations fiscales</li>
        <li><strong>Réduction de 50%</strong> des coûts de gestion comptable</li>
      </ul>
      <p>Ces chiffres ne sont pas de simples promesses marketing. Ils sont le résultat de mesures effectuées auprès de plus de 500 entreprises utilisant notre solution depuis plus d'un an.</p>

      <h2>Comment ça marche ?</h2>
      <p>Notre agent comptable Lucas analyse automatiquement vos documents (factures, tickets, relevés bancaires) grâce à la reconnaissance optique de caractères (OCR) et l'intelligence artificielle. Il extrait les informations pertinentes, les catégorise et les intègre directement dans votre comptabilité.</p>
      <p>Le processus est simple : vous déposez vos documents (par email, scan ou photo), Lucas les analyse en quelques secondes, extrait toutes les informations (montants, dates, fournisseurs, TVA) et les enregistre automatiquement dans votre comptabilité.</p>
      <p>En cas de doute sur une catégorisation, Lucas vous pose la question et apprend de votre réponse pour ne plus jamais la reposer. Plus vous l'utilisez, plus il devient intelligent et adapté à votre activité.</p>

      <h2>Une intégration simple</h2>
      <p>L'agent s'intègre avec vos outils existants : logiciels de comptabilité (Sage, Cegid, QuickBooks), banques en ligne, et systèmes de gestion. Aucune installation complexe n'est nécessaire.</p>
      <p>La mise en place se fait en moins de 30 minutes. Notre équipe vous accompagne dans la configuration initiale et la connexion avec vos outils. Vous pouvez commencer à utiliser Lucas dès le premier jour.</p>

      <h2>La conformité en toute sérénité</h2>
      <p>Lucas est constamment mis à jour pour respecter les dernières réglementations fiscales et comptables. Facturation électronique obligatoire, nouvelles règles de TVA, évolutions du Plan Comptable Général : vous êtes toujours en conformité sans effort.</p>
      <p>Toutes vos données sont stockées de manière sécurisée et conforme au RGPD. Nous utilisons un chiffrement de niveau bancaire pour protéger vos informations sensibles.</p>

      <h2>Témoignage client</h2>
      <p><em>"Avant Lucas, je passais mes dimanches à faire ma comptabilité. Aujourd'hui, tout est automatisé. Je reçois juste un récapitulatif hebdomadaire à valider. J'ai retrouvé ma vie de famille."</em> - Marie D., fondatrice d'une agence de communication</p>
    `
  },
  {
    id: 2,
    slug: 'reseaux-sociaux-ia',
    title: 'Réseaux sociaux : les meilleures pratiques avec l\'IA',
    excerpt: 'Comment utiliser l\'intelligence artificielle pour créer du contenu engageant et gérer efficacement vos réseaux sociaux.',
    category: 'Marketing',
    color: '#7C3AED',
    date: '12 Nov 2024',
    readTime: '7 min',
    image: '/blog/reseaux-sociaux-ia.svg',
    content: `
      <h2>Révolutionnez votre présence sociale</h2>
      <p>Les réseaux sociaux sont devenus incontournables pour toute entreprise. Mais créer du contenu régulièrement, engager sa communauté et analyser les performances demande un temps considérable.</p>
      <p>Entre LinkedIn, Instagram, Facebook, TikTok et X (Twitter), maintenir une présence cohérente et engageante sur toutes ces plateformes est devenu un travail à temps plein. Sans parler de l'évolution constante des algorithmes qui rend obsolètes les stratégies d'hier.</p>

      <h2>L'IA comme community manager</h2>
      <p>Notre agent Thomas prend en charge l'ensemble de votre stratégie sociale :</p>
      <ul>
        <li><strong>Création de contenu</strong> : posts, carrousels, stories adaptés à chaque plateforme</li>
        <li><strong>Planning éditorial</strong> : programmation automatique aux meilleurs moments</li>
        <li><strong>Veille concurrentielle</strong> : analyse de ce qui fonctionne chez vos concurrents</li>
        <li><strong>Reporting</strong> : tableaux de bord en temps réel</li>
        <li><strong>Réponses aux commentaires</strong> : engagement automatique et personnalisé</li>
      </ul>

      <h2>Du contenu adapté à chaque plateforme</h2>
      <p>Thomas comprend les spécificités de chaque réseau social. Un même message sera adapté automatiquement : format professionnel pour LinkedIn, visuel accrocheur pour Instagram, ton décontracté pour TikTok.</p>
      <p>Il génère également des variantes de vos contenus pour tester ce qui fonctionne le mieux auprès de votre audience. L'A/B testing devient automatique et continu.</p>

      <h2>L'analyse prédictive au service de votre stratégie</h2>
      <p>Grâce à l'analyse de millions de posts et de leur performance, Thomas peut prédire le potentiel viral d'un contenu avant même sa publication. Il vous suggère des modifications pour maximiser l'engagement.</p>
      <p>Il identifie également les tendances émergentes dans votre secteur, vous permettant d'être parmi les premiers à surfer sur une vague virale.</p>

      <h2>Des résultats mesurables</h2>
      <p>En moyenne, nos clients voient leur engagement augmenter de 150% dans les 3 premiers mois d'utilisation. Le nombre de followers croît de 40% et le trafic vers leur site web issu des réseaux sociaux double.</p>
      <p>Plus impressionnant encore : le temps consacré à la gestion des réseaux sociaux est divisé par 5, passant de 10 heures à 2 heures par semaine en moyenne.</p>

      <h2>Témoignage client</h2>
      <p><em>"Thomas a transformé notre présence sur LinkedIn. Nous sommes passés de 500 à 15 000 followers en 6 mois, et nos posts génèrent régulièrement plus de 10 000 impressions. Le tout sans y passer plus d'une heure par semaine."</em> - Pierre L., CEO d'une startup B2B</p>
    `
  },
  {
    id: 3,
    slug: 'support-client-24-7',
    title: 'Support client 24/7 : l\'avantage concurrentiel ultime',
    excerpt: 'Pourquoi un support client disponible en permanence grâce à l\'IA peut transformer votre relation client.',
    category: 'Support',
    color: '#2563EB',
    date: '8 Nov 2024',
    readTime: '4 min',
    image: '/blog/support-client-24-7.svg',
    content: `
      <h2>Vos clients n'attendent plus</h2>
      <p>Dans un monde où tout va vite, les clients s'attendent à des réponses immédiates. Un délai de réponse de plus de quelques heures peut suffire à perdre une vente ou un client fidèle.</p>
      <p>Selon une étude récente, <strong>82% des consommateurs</strong> considèrent qu'une réponse immédiate est importante ou très importante lorsqu'ils ont une question. Et <strong>60%</strong> définissent "immédiat" comme moins de 10 minutes.</p>

      <h2>Emma, votre agent support 24/7</h2>
      <p>Notre agent Emma répond instantanément à 80% des demandes courantes :</p>
      <ul>
        <li>Questions fréquentes sur vos produits/services</li>
        <li>Suivi de commandes et livraisons</li>
        <li>Gestion des retours et réclamations</li>
        <li>Prise de rendez-vous</li>
        <li>Informations sur les prix et disponibilités</li>
        <li>Assistance technique de premier niveau</li>
      </ul>

      <h2>Une conversation naturelle</h2>
      <p>Emma ne se contente pas de réponses robotiques. Elle comprend le contexte, détecte les émotions et adapte son ton en conséquence. Un client frustré sera traité avec empathie, un client pressé recevra des réponses concises.</p>
      <p>Elle peut gérer plusieurs conversations simultanément, dans plusieurs langues, sans jamais perdre le fil. Français, anglais, espagnol, allemand : Emma est polyglotte.</p>

      <h2>L'escalade intelligente</h2>
      <p>Pour les demandes complexes, Emma sait quand passer le relais à un humain, avec tout le contexte nécessaire pour une prise en charge efficace. Pas besoin pour le client de répéter son problème.</p>
      <p>Elle peut également planifier un rappel téléphonique aux heures ouvrées si le client préfère parler à un humain. Le conseiller reçoit alors un résumé complet de la conversation.</p>

      <h2>Apprentissage continu</h2>
      <p>Chaque interaction rend Emma plus intelligente. Elle apprend de vos produits, de vos procédures, et s'améliore constamment. Vous pouvez également lui enseigner de nouvelles réponses en quelques clics.</p>

      <h2>Impact sur la satisfaction client</h2>
      <p>Nos clients constatent en moyenne :</p>
      <ul>
        <li><strong>+35 points</strong> de NPS (Net Promoter Score)</li>
        <li><strong>-60%</strong> de temps d'attente moyen</li>
        <li><strong>+25%</strong> de taux de résolution au premier contact</li>
      </ul>

      <h2>Témoignage client</h2>
      <p><em>"Emma gère 3000 conversations par mois pour nous. Notre équipe support peut enfin se concentrer sur les cas vraiment complexes. La satisfaction client n'a jamais été aussi haute."</em> - Sophie M., Directrice Service Client e-commerce</p>
    `
  },
  {
    id: 4,
    slug: 'recrutement-ia-rh',
    title: 'IA et RH : révolutionner le recrutement',
    excerpt: 'Les agents IA changent la donne dans le recrutement. Tri de CV, présélection et onboarding automatisé.',
    category: 'RH',
    color: '#EA580C',
    date: '5 Nov 2024',
    readTime: '6 min',
    image: '/blog/recrutement-ia-rh.svg',
    content: `
      <h2>Le recrutement réinventé</h2>
      <p>Recruter les bons profils est devenu un défi majeur. Entre les centaines de CV reçus et le temps limité des équipes RH, de nombreux talents passent entre les mailles du filet.</p>
      <p>Le coût d'un mauvais recrutement est estimé entre <strong>50 000€ et 150 000€</strong> pour un poste cadre. Sans compter l'impact sur la productivité de l'équipe et le moral des collaborateurs.</p>

      <h2>Claire, votre agent RH</h2>
      <p>Notre agent Claire automatise les tâches chronophages :</p>
      <ul>
        <li><strong>Tri intelligent des CV</strong> : analyse sémantique au-delà des mots-clés</li>
        <li><strong>Présélection objective</strong> : scoring basé sur les compétences réelles</li>
        <li><strong>Planification d'entretiens</strong> : coordination automatique des agendas</li>
        <li><strong>Onboarding personnalisé</strong> : parcours d'intégration adapté</li>
        <li><strong>Suivi des candidatures</strong> : communication automatique avec les candidats</li>
      </ul>

      <h2>Au-delà des mots-clés</h2>
      <p>Contrairement aux ATS traditionnels qui filtrent par mots-clés, Claire comprend réellement le contenu des CV. Elle peut identifier qu'un "Responsable de la transformation digitale" a les compétences recherchées pour un poste de "Chef de projet IT", même si les termes diffèrent.</p>
      <p>Elle analyse également les parcours atypiques et identifie les potentiels que d'autres outils auraient ignorés. Un candidat en reconversion avec les bonnes compétences transférables sera repéré.</p>

      <h2>Éliminer les biais</h2>
      <p>L'IA aide à réduire les biais inconscients en se concentrant sur les compétences et l'expérience, plutôt que sur des critères non pertinents comme le nom, l'âge ou le lieu de résidence.</p>
      <p>Vous pouvez configurer Claire pour anonymiser automatiquement les CV lors de la première présélection, garantissant une évaluation purement basée sur les compétences.</p>

      <h2>L'expérience candidat optimisée</h2>
      <p>Claire maintient une communication régulière avec tous les candidats. Fini les "candidatures sans réponse" qui nuisent à votre marque employeur. Chaque candidat reçoit un suivi personnalisé et des mises à jour sur l'avancement de sa candidature.</p>

      <h2>Onboarding automatisé</h2>
      <p>Une fois le candidat recruté, Claire prend en charge son parcours d'intégration :</p>
      <ul>
        <li>Envoi automatique des documents administratifs</li>
        <li>Planning de la première semaine</li>
        <li>Présentation de l'équipe et des outils</li>
        <li>Suivi régulier pendant la période d'essai</li>
      </ul>

      <h2>Témoignage client</h2>
      <p><em>"Claire nous a permis de diviser par 3 notre temps de recrutement. Mais surtout, la qualité des candidats présélectionnés s'est nettement améliorée. Notre taux de rétention à 1 an est passé de 70% à 92%."</em> - Laurent B., DRH groupe industriel</p>
    `
  },
  {
    id: 5,
    slug: 'tresorerie-previsions-ia',
    title: 'Prévisions de trésorerie : l\'IA au service du DAF',
    excerpt: 'Comment les algorithmes prédictifs permettent d\'anticiper les flux de trésorerie avec une précision inédite.',
    category: 'Finance',
    color: '#059669',
    date: '1 Nov 2024',
    readTime: '8 min',
    image: '/blog/tresorerie-previsions-ia.svg',
    content: `
      <h2>Anticiper plutôt que subir</h2>
      <p>La gestion de trésorerie est souvent réactive. On découvre les problèmes quand ils arrivent, sans pouvoir les anticiper. Pourtant, <strong>25% des faillites d'entreprises</strong> sont dues à des problèmes de trésorerie, même pour des sociétés rentables.</p>
      <p>La visibilité sur les flux futurs est essentielle pour prendre les bonnes décisions : investir, embaucher, négocier avec sa banque ou ses fournisseurs.</p>

      <h2>Marc, votre agent trésorier</h2>
      <p>Notre agent Marc utilise l'intelligence artificielle pour :</p>
      <ul>
        <li><strong>Prévisions à 30, 60, 90 jours</strong> avec une précision de 95%</li>
        <li><strong>Alertes proactives</strong> en cas de tension prévisible</li>
        <li><strong>Optimisation du BFR</strong> : suggestions de négociation fournisseurs/clients</li>
        <li><strong>Scénarios what-if</strong> : simulation d'impact de vos décisions</li>
        <li><strong>Rapports automatiques</strong> : tableaux de bord pour le DAF et la direction</li>
      </ul>

      <h2>L'intelligence prédictive</h2>
      <p>Marc ne se contente pas de projeter vos données historiques. Il intègre de nombreux facteurs externes : saisonnalité de votre secteur, délais de paiement moyens de vos clients, tendances macroéconomiques.</p>
      <p>Il apprend également de vos spécificités : ce client qui paie toujours avec 15 jours de retard, cette période de l'année où les encaissements ralentissent, ces charges trimestrielles à ne pas oublier.</p>

      <h2>Des données en temps réel</h2>
      <p>Marc se connecte à vos banques et outils comptables pour avoir une vision consolidée et actualisée de votre trésorerie. Fini les exports Excel et les consolidations manuelles.</p>
      <p>Il réconcilie automatiquement les mouvements bancaires avec vos factures, identifie les anomalies et vous alerte en cas d'écart significatif.</p>

      <h2>Optimisation du BFR</h2>
      <p>Marc analyse en permanence votre Besoin en Fonds de Roulement et identifie les leviers d'optimisation :</p>
      <ul>
        <li>Clients à relancer en priorité</li>
        <li>Fournisseurs avec qui renégocier les délais</li>
        <li>Stock dormant à liquider</li>
        <li>Opportunités d'escompte à saisir</li>
      </ul>

      <h2>Scénarios et simulations</h2>
      <p>Vous envisagez un investissement ? Une embauche ? Un nouveau contrat ? Marc simule instantanément l'impact sur votre trésorerie des 12 prochains mois. Vous prenez vos décisions en connaissance de cause.</p>

      <h2>Témoignage client</h2>
      <p><em>"Grâce à Marc, nous avons évité une tension de trésorerie qui aurait pu nous coûter très cher. Il nous a alertés 6 semaines à l'avance, ce qui nous a laissé le temps de négocier une ligne de crédit dans de bonnes conditions."</em> - François D., DAF PME industrielle</p>
    `
  },
  {
    id: 6,
    slug: 'email-marketing-conversions',
    title: 'Email marketing : boostez vos conversions avec l\'IA',
    excerpt: 'Segmentation intelligente, personnalisation avancée : les secrets d\'une stratégie email performante.',
    category: 'Marketing',
    color: '#DB2777',
    date: '28 Oct 2024',
    readTime: '5 min',
    image: '/blog/email-marketing-conversions.svg',
    content: `
      <h2>L'email n'est pas mort</h2>
      <p>Contrairement aux idées reçues, l'email marketing reste le canal avec le meilleur ROI. Pour chaque euro investi, l'email génère en moyenne <strong>42€ de revenus</strong>. Aucun autre canal ne peut rivaliser.</p>
      <p>Mais attention : les consommateurs reçoivent en moyenne 121 emails par jour. Pour sortir du lot, vos emails doivent être pertinents, personnalisés et envoyés au bon moment.</p>

      <h2>Sophie, votre agent email marketing</h2>
      <p>Notre agent Sophie optimise chaque aspect de vos campagnes :</p>
      <ul>
        <li><strong>Segmentation intelligente</strong> : groupes dynamiques basés sur le comportement</li>
        <li><strong>Personnalisation avancée</strong> : contenu adapté à chaque destinataire</li>
        <li><strong>Optimisation des envois</strong> : timing personnalisé par contact</li>
        <li><strong>A/B testing automatique</strong> : amélioration continue des performances</li>
        <li><strong>Rédaction assistée</strong> : objets et contenus optimisés pour la conversion</li>
      </ul>

      <h2>La personnalisation à grande échelle</h2>
      <p>Sophie ne se contente pas d'insérer le prénom dans l'objet. Elle personnalise réellement le contenu de chaque email en fonction du profil et du comportement du destinataire.</p>
      <p>Un client qui a consulté vos produits haut de gamme recevra une mise en avant différente de celui qui cherche les bonnes affaires. Le tout automatiquement, sans segmentation manuelle.</p>

      <h2>Le bon moment pour chaque contact</h2>
      <p>Saviez-vous que le moment d'envoi peut faire varier le taux d'ouverture de 30% ? Sophie analyse les habitudes de chaque contact et envoie vos emails au moment où ils ont le plus de chances d'être lus.</p>
      <p>Marie ouvre ses emails à 7h dans le métro, Pierre à 13h pendant sa pause déjeuner, Sophie à 21h devant la télé. Chacun reçoit votre message au moment optimal.</p>

      <h2>Des objets qui font ouvrir</h2>
      <p>L'objet est déterminant : 47% des destinataires ouvrent un email uniquement en fonction de l'objet. Sophie génère et teste automatiquement plusieurs variantes pour identifier ce qui fonctionne auprès de votre audience.</p>
      <p>Elle apprend de chaque campagne : les emojis qui marchent (ou pas), la longueur idéale, les mots déclencheurs pour votre secteur.</p>

      <h2>Automatisations intelligentes</h2>
      <p>Sophie met en place des séquences automatisées qui s'adaptent au comportement :</p>
      <ul>
        <li>Séquence de bienvenue personnalisée</li>
        <li>Relance panier abandonné avec offre adaptée</li>
        <li>Réactivation des clients dormants</li>
        <li>Upsell post-achat au bon moment</li>
        <li>Anniversaire et événements personnels</li>
      </ul>

      <h2>Des résultats concrets</h2>
      <p>Nos clients constatent en moyenne :</p>
      <ul>
        <li><strong>+40%</strong> de taux d'ouverture</li>
        <li><strong>+25%</strong> de taux de clic</li>
        <li><strong>+60%</strong> de revenus générés par email</li>
        <li><strong>-50%</strong> de taux de désinscription</li>
      </ul>

      <h2>Témoignage client</h2>
      <p><em>"Sophie a révolutionné notre email marketing. Nos newsletters généraient 2000€/mois, maintenant c'est plus de 12000€. Et je passe 3 fois moins de temps dessus."</em> - Amélie R., fondatrice e-commerce mode</p>
    `
  },
]

export default function BlogArticlePage() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    window.scrollTo(0, 0)
  }, [])

  const article = articles.find(a => a.slug === params.slug)

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary, #fff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#4F46E5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!article) {
    return (
      <>
        <Header />
        <main className="not-found">
          <div className="container">
            <span className="error-icon">📝</span>
            <h1>Article non trouvé</h1>
            <p>L'article que vous recherchez n'existe pas ou a été déplacé.</p>
            <Link href="/blog" className="btn-back">
              ← Retour au blog
            </Link>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .not-found {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 100px 24px;
          }
          .error-icon {
            font-size: 4rem;
            display: block;
            margin-bottom: 24px;
          }
          h1 {
            font-family: var(--font-display);
            font-size: 2rem;
            color: var(--text-primary);
            margin-bottom: 12px;
          }
          p {
            color: var(--text-secondary);
            margin-bottom: 32px;
          }
          .btn-back {
            display: inline-flex;
            padding: 14px 28px;
            background: var(--accent);
            color: white;
            font-weight: 600;
            border-radius: 12px;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          .btn-back:hover {
            background: var(--accent-hover);
          }
        `}</style>
      </>
    )
  }

  const relatedArticles = articles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 2)

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="hero" style={{ background: `linear-gradient(135deg, ${article.color}15 0%, ${article.color}08 100%)` }}>
          <div className="container">
            <Link href="/blog" className="back-link">
              ← Retour au blog
            </Link>
            <div className="article-meta">
              <span className="category" style={{ color: article.color }}>
                {article.category}
              </span>
              <span className="date">{article.date}</span>
              <span className="read-time">⏱ {article.readTime} de lecture</span>
            </div>
            <h1>{article.title}</h1>
            <p className="excerpt">{article.excerpt}</p>
            <div className="article-image">
              <img src={article.image} alt={article.title} />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="content-section">
          <div className="container">
            <article
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="related-section">
            <div className="container">
              <h2>Articles similaires</h2>
              <div className="related-grid">
                {relatedArticles.map(related => (
                  <Link key={related.id} href={`/blog/${related.slug}`} className="related-card">
                    <div className="related-image">
                      <img src={related.image} alt={related.title} />
                    </div>
                    <div className="related-content">
                      <span className="related-category" style={{ color: related.color }}>
                        {related.category}
                      </span>
                      <h3>{related.title}</h3>
                      <span className="related-read">Lire →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Prêt à automatiser votre entreprise ?</h2>
              <p>Découvrez nos agents IA et commencez votre essai gratuit.</p>
              <Link href="/agents" className="btn-primary">
                Voir les agents →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        main {
          min-height: 100vh;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Hero */
        .hero {
          padding: 140px 24px 60px;
        }

        .back-link {
          display: inline-block;
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 24px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: var(--accent);
        }

        .article-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .category {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .date, .read-time {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .hero h1 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .excerpt {
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .article-image {
          height: 350px;
          border-radius: 24px;
          overflow: hidden;
        }

        .article-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Content */
        .content-section {
          padding: 60px 24px;
          background: var(--bg-primary);
        }

        .article-content {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.8;
        }

        .article-content :global(h2) {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 40px 0 20px;
        }

        .article-content :global(h2:first-child) {
          margin-top: 0;
        }

        .article-content :global(p) {
          margin-bottom: 20px;
        }

        .article-content :global(ul) {
          margin: 20px 0;
          padding-left: 24px;
        }

        .article-content :global(li) {
          margin-bottom: 12px;
        }

        .article-content :global(strong) {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Related */
        .related-section {
          padding: 60px 24px 80px;
          background: var(--bg-secondary);
        }

        .related-section h2 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 32px;
          text-align: center;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .related-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .related-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .related-image {
          height: 140px;
          overflow: hidden;
        }

        .related-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .related-card:hover .related-image img {
          transform: scale(1.05);
        }

        .related-content {
          padding: 20px;
        }

        .related-category {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .related-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 8px 0 12px;
          line-height: 1.4;
        }

        .related-read {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent);
        }

        /* CTA */
        .cta-section {
          padding: 80px 24px;
          background: var(--bg-primary);
        }

        .cta-content {
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .cta-content p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 28px;
        }

        .btn-primary {
          display: inline-flex;
          padding: 16px 32px;
          background: var(--accent);
          color: white;
          font-weight: 600;
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .article-image {
            height: 220px;
          }

          .related-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}
