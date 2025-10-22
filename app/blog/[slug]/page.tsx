'use client'

import Link from 'next/link'
import { blogPosts } from '@/data/blog'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find(p => p.slug === params.slug)

  if (!post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h1>Article non trouvé</h1>
        <p>Désolé, cet article n'existe pas.</p>
        <Link href="/blog" style={{ color: '#000', textDecoration: 'underline' }}>
          Retourner au blog
        </Link>
      </div>
    )
  }

  return (
    <article className="blog-post">
      <div className="blog-hero">
        <div className="container">
          <Link href="/blog" className="back-link">← Retour au blog</Link>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="category">{post.category}</span>
            <span className="separator">•</span>
            <span className="date">{post.date}</span>
            <span className="separator">•</span>
            <span className="reading-time">{post.readingTime} min de lecture</span>
          </div>
        </div>
      </div>

      <div className="blog-image-full">
        <div className="placeholder">[ {post.icon} ]</div>
      </div>

      <div className="blog-content-wrapper">
        <div className="container">
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="post-footer">
            <div className="post-cta">
              <h3>Prêt à automatiser votre entreprise?</h3>
              <p>Commencez votre essai gratuit dès maintenant</p>
              <button className="btn btn-secondary">Démarrer maintenant</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-post {
          width: 100%;
        }

        .blog-hero {
          padding: 60px 20px;
          background: #f5f5f5;
        }

        .back-link {
          display: inline-block;
          text-decoration: none;
          color: inherit;
          opacity: 0.6;
          margin-bottom: 20px;
          transition: opacity 0.2s;
        }

        .back-link:hover {
          opacity: 1;
        }

        .blog-hero h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          line-height: 1.3;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          opacity: 0.7;
        }

        .category {
          background: #fff;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
        }

        .separator {
          opacity: 0.4;
        }

        .blog-image-full {
          width: 100%;
          height: 400px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
        }

        .blog-content-wrapper {
          padding: 80px 20px;
        }

        .blog-content {
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .blog-content p {
          margin-bottom: 24px;
        }

        .blog-content h2 {
          font-size: 1.8rem;
          margin-top: 40px;
          margin-bottom: 20px;
        }

        .blog-content h3 {
          font-size: 1.4rem;
          margin-top: 32px;
          margin-bottom: 16px;
        }

        .blog-content ul,
        .blog-content ol {
          margin: 24px 0 24px 24px;
          padding: 0;
        }

        .blog-content li {
          margin-bottom: 12px;
        }

        .blog-content code {
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
        }

        .blog-content blockquote {
          border-left: 4px solid #000;
          padding-left: 20px;
          margin: 30px 0;
          opacity: 0.8;
          font-style: italic;
        }

        .post-footer {
          margin-top: 60px;
          padding-top: 60px;
          border-top: 1px solid #e5e7eb;
        }

        .post-cta {
          background: #f5f5f5;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
        }

        .post-cta h3 {
          margin-bottom: 12px;
        }

        .post-cta p {
          margin: 0 0 24px 0;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .blog-hero {
            padding: 40px 20px;
          }

          .blog-hero h1 {
            font-size: 1.8rem;
          }

          .blog-image-full {
            height: 250px;
            font-size: 3rem;
          }

          .blog-content-wrapper {
            padding: 40px 20px;
          }

          .blog-content {
            font-size: 1rem;
          }
        }
      `}</style>
    </article>
  )
}
