export default function Custom404() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
      <a 
        href="/" 
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem'
        }}
      >
        Go back home
      </a>
    </div>
  )
}