export function Footer() {
  return (
    <footer style={{ backgroundColor: '#2a4a32' }} className="px-6 md:px-16 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <p className="text-xs tracking-[0.15em] font-semibold text-white mb-0.5">COORG HERITAGE</p>
          <p className="text-xs tracking-[0.15em] font-semibold mb-4" style={{ color: '#c8a96e' }}>HILL VIEW RESORT</p>
          <p className="text-xs text-white opacity-40 leading-relaxed">Madikeri, Coorg, Karnataka</p>
        </div>
        <div>
          <p className="text-xs text-white opacity-40 uppercase tracking-widest mb-3">Contact</p>
          <a href="tel:9019563004" className="block text-sm text-white opacity-70 hover:opacity-100 transition-opacity mb-1">
            +91 9019563004
          </a>
          <a href="mailto:coorgheritagehillviewresort@gmail.com"
            className="block text-xs text-white opacity-50 hover:opacity-80 transition-opacity break-all">
            coorgheritagehillviewresort@gmail.com
          </a>
        </div>
        <div>
          <p className="text-xs text-white opacity-40 uppercase tracking-widest mb-3">Amenities</p>
          <div className="grid grid-cols-2 gap-1">
            {['AC Rooms', 'Non-AC Rooms', 'Restaurant', 'Room Service', 'Bonfire', 'Rain Dance'].map(a => (
              <p key={a} className="text-xs text-white opacity-55">{a}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/10">
        <p className="text-xs text-white opacity-25">© 2026 Coorg Heritage Hill View Resort. All rights reserved.</p>
      </div>
    </footer>
  )
}
