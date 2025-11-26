import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">FitPass Admin</h1>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link href="/login" className="p-4 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600">
            Login
          </Link>
          <Link href="/dashboard" className="p-4 bg-green-500 text-white rounded-lg text-center hover:bg-green-600">
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}