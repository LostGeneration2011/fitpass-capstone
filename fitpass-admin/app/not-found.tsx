'use client'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f9fafb'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        fontWeight: 'bold', 
        color: '#1f2937',
        marginBottom: '1rem'
      }}>
        404
      </h1>
      <p style={{ 
        color: '#6b7280', 
        fontSize: '1.25rem',
        marginBottom: '2rem' 
      }}>
        Page Not Found
      </p>
      <a 
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem'
        }}
      >
        Go Home
      </a>
    </div>
  )
}