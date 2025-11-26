export default function Custom500() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>500 - Server Error</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Something went wrong on our end.</p>
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