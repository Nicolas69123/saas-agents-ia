'use client'

export default function TestHoverPage() {
  return (
    <div style={{ padding: '100px', background: '#fff' }}>
      <h1>Test Hover Underline</h1>

      <div style={{ marginTop: '40px' }}>
        <h2>Test 1: Lien simple avec inline style</h2>
        <a
          href="#"
          style={{
            position: 'relative',
            display: 'inline-block',
            color: '#0f172a',
            fontWeight: 500,
            fontSize: '0.9375rem',
            padding: '8px 0',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => {
            const line = e.currentTarget.querySelector('.hover-line') as HTMLElement
            if (line) line.style.transform = 'scaleX(1)'
          }}
          onMouseLeave={(e) => {
            const line = e.currentTarget.querySelector('.hover-line') as HTMLElement
            if (line) line.style.transform = 'scaleX(0)'
          }}
        >
          Fonctionnalités TEST
          <span
            className="hover-line"
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '100%',
              height: '2px',
              background: '#0f172a',
              transform: 'scaleX(0)',
              transition: 'transform 0.3s ease',
              display: 'block'
            }}
          />
        </a>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Test 2: Avec className et CSS global</h2>
        <a href="#" className="test-menu-item">
          Tarification TEST
        </a>
      </div>

      <style jsx global>{`
        .test-menu-item {
          position: relative;
          display: inline-block;
          color: #0f172a;
          font-weight: 500;
          font-size: 0.9375rem;
          padding: 8px 0;
          text-decoration: none;
        }

        .test-menu-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #0f172a;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .test-menu-item:hover::after {
          transform: scaleX(1);
        }
      `}</style>
    </div>
  )
}
