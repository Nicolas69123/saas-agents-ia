'use client'

import Link from 'next/link'
import { blogPosts } from '@/data/blog'

export default function BlogPage() {
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>Blog & Ressources</h1>
          <p>Apprenez comment automatiser votre entreprise avec l'IA</p>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-image">
                  <div className="placeholder">[ {post.icon} ]</div>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="category">{post.category}</span>
                    <span className="date">{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p className="excerpt">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="read-more">
                    Lire l'article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-hero {
          background: #f5f5f5;
          padding: 80px 20px;
          text-align: center;
        }

        .page-hero h1 {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .page-hero p {
          font-size: 1.1rem;
          opacity: 0.7;
        }

        .blog-section {
          padding: 80px 20px;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
        }

        .blog-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .blog-card:hover {
          border-color: #000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .blog-image {
          width: 100%;
          height: 200px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
        }

        .blog-content {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .blog-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 0.85rem;
        }

        .category {
          background: #f5f5f5;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
        }

        .date {
          opacity: 0.6;
          align-self: center;
        }

        .blog-card h3 {
          margin: 12px 0;
          font-size: 1.3rem;
        }

        .excerpt {
          flex: 1;
          font-size: 0.95rem;
          opacity: 0.7;
          margin-bottom: 16px;
        }

        .read-more {
          text-decoration: none;
          color: inherit;
          font-weight: 600;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .read-more:hover {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .page-hero h1 {
            font-size: 1.8rem;
          }

          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
