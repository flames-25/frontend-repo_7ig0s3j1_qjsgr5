import { useEffect, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const offerUrl = 'https://devopswithvikas.com/offer/0faab342-e96f-4a5d-ae4b-f152fc28fda9'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/scrape-offer?url=${encodeURIComponent(offerUrl)}`)
        if (!res.ok) throw new Error('Failed to fetch offer details')
        const json = await res.json()
        setData(json)
      } catch (e) {
        setError(e.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Preparing your personalized landing page...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur border border-rose-100 shadow-xl rounded-2xl p-8 max-w-xl text-center">
          <h1 className="text-2xl font-bold text-rose-600 mb-2">We couldn't fetch the offer</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <a className="inline-block px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg" href={offerUrl} target="_blank">Open original page</a>
        </div>
      </div>
    )
  }

  const title = data?.headings?.[0] || data?.title || 'Exclusive Offer'
  const description = data?.description || data?.paragraphs?.[0] || 'Discover an exclusive learning opportunity tailored for you.'
  const bullets = (data?.bullets || []).slice(0, 6)
  const images = (data?.images || []).map(img => ({
    ...img,
    src: img.src?.startsWith('http') ? img.src : new URL(img.src, offerUrl).toString()
  }))

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-sm">Limited-time learning offer</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300 mb-4">
                {title}
              </h1>
              <p className="text-lg md:text-xl text-slate-300/90 leading-relaxed mb-6">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={offerUrl} target="_blank" className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/20">Claim this offer</a>
                <a href="#details" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10">See details</a>
              </div>
              <div className="mt-6 text-slate-400 text-sm">Backed by modern DevOps practices and real-world projects.</div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-2 shadow-xl">
                {images[0] ? (
                  <img src={images[0].src} alt={images[0].alt || 'Offer'} className="rounded-xl w-full aspect-video object-cover" />
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-400">Visual preview unavailable</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="details" className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {bullets.slice(0,3).map((b, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/7 transition">
              <div className="text-indigo-300 font-semibold mb-2">Key Benefit {i+1}</div>
              <div className="text-slate-200 leading-relaxed">{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What you'll learn / details */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-3">What you'll get</h2>
            <ul className="space-y-3 text-slate-200">
              {bullets.slice(3,9).map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
                  <span>{b}</span>
                </li>
              ))}
              {bullets.length === 0 && (
                <li className="text-slate-400">Course modules, live sessions, hands-on labs, community support, and certification guidance.</li>
              )}
            </ul>
          </div>

          <div className="space-y-6">
            {(data?.paragraphs || []).slice(0,3).map((p, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-slate-200 leading-relaxed">
                {p}
              </div>
            ))}
            <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl p-1">
              <div className="bg-slate-950 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <div className="text-slate-300">Ready to start?</div>
                  <div className="text-white text-xl font-semibold">Secure your spot today</div>
                </div>
                <a href={offerUrl} target="_blank" className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold">Enroll now</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <div>Built with modern, responsive design.</div>
          <div className="flex items-center gap-4">
            {images.slice(1,4).map((img, i) => (
              <img key={i} src={img.src} alt={img.alt || 'Preview'} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
