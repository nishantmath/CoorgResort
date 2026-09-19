import { Outlet, ScrollRestoration } from 'react-router'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export default function Root() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <ScrollRestoration />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
