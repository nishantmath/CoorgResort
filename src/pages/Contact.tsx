import { imgLandscape, imgNature } from '../lib/images'

const serif = { fontFamily: 'Playfair Display, Georgia, serif' }

export default function Contact() {
  return (
    <div style={{ backgroundColor: '#f4ede0' }}>

      {/* Full-bleed header */}
      <div className="relative overflow-hidden" style={{ minHeight: '50vh', backgroundColor: '#1e3626' }}>
        <img src={imgNature} alt="Estate" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative pt-32 pb-24 px-6 md:px-16 flex flex-col justify-end" style={{ minHeight: '50vh' }}>
          <p className="text-xs tracking-[0.3em] text-white/45 uppercase mb-5">GET IN TOUCH</p>
          <h1 style={{ ...serif, fontStyle: 'italic', fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#fff', fontWeight: 400, lineHeight: 0.97 }}>
            We'd love to<br />hear from you.
          </h1>
        </div>
      </div>

      {/* Contact + form */}
      <section className="px-6 md:px-16 py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-16">

          {/* Left — details */}
          <div className="md:col-span-4">
            <p className="text-xs tracking-[0.2em] uppercase opacity-35 mb-10">DIRECT CONTACT</p>
            <div className="space-y-10">
              <div>
                <p className="text-xs opacity-35 uppercase tracking-widest mb-2">Phone</p>
                <a href="tel:9019563004"
                  style={{ ...serif, fontSize: '2rem', fontWeight: 400 }}
                  className="hover:opacity-60 transition-opacity block">
                  +91 9019563004
                </a>
              </div>
              <div>
                <p className="text-xs opacity-35 uppercase tracking-widest mb-2">Email</p>
                <a href="mailto:coorgheritagehillviewresort@gmail.com"
                  className="text-sm break-all opacity-55 hover:opacity-100 transition-opacity block leading-relaxed">
                  coorgheritagehillviewresort@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs opacity-35 uppercase tracking-widest mb-2">Location</p>
                <p className="text-sm opacity-55 leading-relaxed">Madikeri, Coorg (Kodagu),<br />Karnataka, India</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-16">
              <p className="text-xs tracking-[0.2em] uppercase opacity-35 mb-6">AMENITIES</p>
              {['AC Rooms', 'Non-AC Rooms', 'Restaurant', 'Room Service', 'Bonfire', 'Rain Dance', 'Hill View', 'Indoor Games'].map(a => (
                <div key={a} className="flex items-center gap-3 py-2.5 border-b border-gray-200 last:border-0">
                  <span style={{ color: '#2a4a32', fontSize: '0.5rem' }}>●</span>
                  <span className="text-sm opacity-60">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="md:col-span-8">
            <p className="text-xs tracking-[0.2em] uppercase opacity-35 mb-10">SEND AN ENQUIRY</p>
            <form
              onSubmit={e => { e.preventDefault(); window.location.href = 'mailto:coorgheritagehillviewresort@gmail.com' }}
              className="space-y-0"
            >
              <div className="grid md:grid-cols-2 gap-0 border border-gray-300">
                {[
                  { label: 'Full Name', type: 'text', placeholder: 'Your name' },
                  { label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  { label: 'Phone Number', type: 'tel', placeholder: '+91 00000 00000' },
                  { label: 'Check-in Date', type: 'date', placeholder: '' },
                ].map((field, i) => (
                  <div key={field.label} className={`border-b border-gray-300 ${i % 2 === 0 ? 'md:border-r' : ''}`}>
                    <label className="block text-xs uppercase tracking-widest opacity-35 px-5 pt-5 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-5 pb-5 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <div className="border border-t-0 border-gray-300">
                <label className="block text-xs uppercase tracking-widest opacity-35 px-5 pt-5 mb-1">Number of Guests</label>
                <select className="w-full px-5 pb-5 text-sm bg-transparent focus:outline-none border-b border-gray-300 appearance-none">
                  {['1–2 guests', '3–4 guests', '5–6 guests', '7+ guests'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="border border-t-0 border-gray-300">
                <label className="block text-xs uppercase tracking-widest opacity-35 px-5 pt-5 mb-1">Message</label>
                <textarea
                  rows={5}
                  placeholder="Room preferences, special requests, questions..."
                  className="w-full px-5 pb-5 text-sm bg-transparent focus:outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: '#2a4a32' }}
                className="w-full py-5 text-xs tracking-[0.2em] text-white uppercase hover:opacity-85 transition-opacity">
                SEND ENQUIRY
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Full-bleed landscape */}
      <div className="relative" style={{ height: 'clamp(300px, 40vw, 500px)' }}>
        <img src={imgLandscape} alt="Estate panorama" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,18,10,0.5) 0%, transparent 60%)' }} />
        <div className="absolute bottom-8 left-6 md:left-16">
          <p className="text-xs tracking-[0.25em] text-white/55 uppercase">COORG HERITAGE HILL VIEW RESORT · MADIKERI</p>
        </div>
      </div>
    </div>
  )
}
