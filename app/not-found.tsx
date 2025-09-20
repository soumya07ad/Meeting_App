export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 0,
          backgroundColor: '#1C1F2E'
        }}>
          <div style={{
            textAlign: 'center',
            color: 'white'
          }}>
            <h1 style={{
              fontSize: '2rem',
              marginBottom: '1rem'
            }}>404 - Page Not Found</h1>
            <a 
              href="/"
              style={{
                color: '#0E78F9',
                textDecoration: 'none'
              }}
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
