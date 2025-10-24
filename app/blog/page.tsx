'use client'

import Link from 'next/link'
import Image from 'next/image'
import { blogPosts } from '@/data/blog'

const blogImages = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', // AI
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop', // Tech
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop', // AI brain
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop', // Future
]

export default function BlogPage() {
  return (
    <div className="blog-page">
      <section className="page-hero">
        <div className="container">
          <h1>Blog & Ressources</h1>
          <p>Apprenez comment automatiser votre entreprise avec l'IA</p>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((post, index) => (
              <article key={post.id} className="blog-card glass-card">
                <div className="blog-image">
                  <Image
                    src={blogImages[index] || blogImages[0]}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="blog-img"
                  />
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
        .blog-page {
          background: #000000;
          min-height: 100vh;
        }

        .page-hero {
          background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15), transparent 70%);
          padding: 120px 20px 100px;
          text-align: center;
        }

        .page-hero h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 24px;
          color: #ffffff;
          font-weight: 800;
        }

        .page-hero p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .blog-section {
          padding: 100px 20px;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 40px;
        }

        .blog-card {
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        .blog-card:hover {
          transform: translateY(-12px);
        }

        .blog-image {
          width: 100%;
          height: 240px;
          overflow: hidden;
          position: relative;
        }

        .blog-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .blog-card:hover .blog-img {
          transform: scale(1.1);
        }

        .blog-content {
          padding: 30px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .blog-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 0.85rem;
        }

        .category {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.75rem;
        }

        .date {
          color: rgba(255, 255, 255, 0.5);
          align-self: center;
        }

        .blog-card h3 {
          margin: 12px 0 16px;
          font-size: 1.5rem;
          color: #ffffff;
          font-weight: 700;
          line-height: 1.3;
        }

        .excerpt {
          flex: 1;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 20px;
          line-height: 1.7;
        }

        .read-more {
          text-decoration: none;
          color: #3b82f6;
          font-weight: 700;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .read-more:hover {
          color: #60a5fa;
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 80px 20px 60px;
          }

          .page-hero h1 {
            font-size: 2rem;
          }

          .blog-section {
            padding: 60px 20px;
          }

          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
