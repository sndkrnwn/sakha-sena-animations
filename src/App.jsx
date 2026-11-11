import React, { useState, useEffect, useRef, useMemo } from 'react'
import confetti from 'canvas-confetti'

const YOUTUBE_CHANNEL_ID = "UC2fxzeBambN6GzEjnaNJnAQ"
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`
const API_ENDPOINT = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`

const fallbackItems = [
  {
    id: 'L_LUpnjgPso',
    title: 'Misi Merapikan Kamar Mainan Bersama Sakha & Sena',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=60',
    date: 'Terbaru'
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Tebak Warna Balok Bersama Sena! 🔴 #Shorts',
    type: 'short',
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=60',
    date: 'Shorts'
  },
  {
    id: '3JZ_D3ELwOQ',
    title: 'Lagu Merapikan Mainan Ceria 🎶 #Shorts',
    type: 'short',
    thumbnail: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=60',
    date: 'Shorts'
  },
  {
    id: '9bZkp7q19f0',
    title: 'Sakha Belajar Menghitung Balok Bersama Ayah & Ibu',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1584697964190-7bb9ff663674?w=800&auto=format&fit=crop&q=60',
    date: 'Video'
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Teka-Teki Suara Hewan Ternak! 🐮🐥 #Shorts',
    type: 'short',
    thumbnail: 'https://images.unsplash.com/photo-1535572292021-0603653f6491?w=800&auto=format&fit=crop&q=60',
    date: 'Shorts'
  },
  {
    id: 'fJ9rUzIMcZQ',
    title: 'Menyusun Puzzle Mobil Pemadam Kebakaran Cilik',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?w=800&auto=format&fit=crop&q=60',
    date: 'Video'
  },
  {
    id: 'OPf0YbXqDm0',
    title: 'Senam Pagi Ceria Sakha Sena Melompat Tinggi! ☀️ #Shorts',
    type: 'short',
    thumbnail: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=60',
    date: 'Shorts'
  },
  {
    id: 'RgKAFK5djSk',
    title: 'Ayo Mengenal Buah Segar dan Sehat Bersama Bunda',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=60',
    date: 'Video'
  }
]

const initialToys = [
  { id: 1, name: 'Balok Biru 🔷', color: 'blue' },
  { id: 2, name: 'Mobil Merah 🚗', color: 'red' },
  { id: 3, name: 'Robot Biru 🤖', color: 'blue' },
  { id: 4, name: 'Bola Merah 🔴', color: 'red' }
]

export default function App() {
  // Slogan & Quotes State
  const [showSakhaQuote, setShowSakhaQuote] = useState(false)
  const [showSenaQuote, setShowSenaQuote] = useState(false)

  // Mini Game State
  const [availableToys, setAvailableToys] = useState(initialToys)
  const [blueBoxItems, setBlueBoxItems] = useState([])
  const [redBoxItems, setRedBoxItems] = useState([])

  // YouTube / Video State
  const [allItems, setAllItems] = useState([])
  const [currentFilter, setCurrentFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [activeDotIndex, setActiveDotIndex] = useState(0)

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    videoId: '',
    isShort: false
  })

  const videoContainerRef = useRef(null)

  const triggerConfettiHero = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  // Mini Game Logic
  const sortToy = (toy) => {
    if (toy.color === 'blue') {
      setBlueBoxItems(prev => [...prev, toy.name])
    } else {
      setRedBoxItems(prev => [...prev, toy.name])
    }
    const nextRemaining = availableToys.filter(t => t.id !== toy.id)
    setAvailableToys(nextRemaining)

    if (nextRemaining.length === 0) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.7 } })
    }
  }

  const resetGame = () => {
    setAvailableToys(initialToys)
    setBlueBoxItems([])
    setRedBoxItems([])
  }

  // Fetch YouTube Content
  useEffect(() => {
    async function loadContent() {
      setIsLoading(true)
      try {
        const response = await fetch(API_ENDPOINT)
        const data = await response.json()
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          const mapped = data.items.map(item => {
            const videoId = item.link.includes('v=')
              ? item.link.split('v=')[1].split('&')[0]
              : item.link.split('/').pop()

            const isShort = item.title.toLowerCase().includes('#short') ||
                            item.title.toLowerCase().includes('#shorts') ||
                            (item.description && item.description.toLowerCase().includes('#shorts'))

            return {
              id: videoId,
              title: item.title,
              type: isShort ? 'short' : 'video',
              thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
              date: new Date(item.pubDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            }
          })
          setAllItems(mapped)
        } else {
          setAllItems(fallbackItems)
        }
      } catch (err) {
        console.warn('Menggunakan fallback data:', err)
        setAllItems(fallbackItems)
      } finally {
        setIsLoading(false)
      }
    }
    loadContent()
  }, [])

  // Filtered Items
  const filteredVideos = useMemo(() => {
    if (currentFilter === 'all') return allItems
    return allItems.filter(item => item.type === currentFilter)
  }, [allItems, currentFilter])

  const isCarousel = filteredVideos.length > 6
  const totalDots = Math.min(filteredVideos.length, 6)

  // Carousel Controls
  const slideCarousel = (direction) => {
    if (!videoContainerRef.current) return
    const scrollStep = videoContainerRef.current.clientWidth * 0.75
    videoContainerRef.current.scrollBy({ left: direction * scrollStep, behavior: 'smooth' })
  }

  const scrollCarouselToDot = (index) => {
    if (!videoContainerRef.current) return
    const maxScroll = videoContainerRef.current.scrollWidth - videoContainerRef.current.clientWidth
    const target = (maxScroll / (totalDots - 1)) * index
    videoContainerRef.current.scrollTo({ left: target, behavior: 'smooth' })
  }

  const handleCarouselScroll = () => {
    if (!videoContainerRef.current || totalDots <= 1) return
    const maxScroll = videoContainerRef.current.scrollWidth - videoContainerRef.current.clientWidth
    if (maxScroll <= 0) return
    const idx = Math.min(
      totalDots - 1,
      Math.round((videoContainerRef.current.scrollLeft / maxScroll) * (totalDots - 1))
    )
    setActiveDotIndex(idx)
  }

  // Modal Handlers
  const openModal = (id, isShort) => {
    setModalState({ isOpen: true, videoId: id, isShort })
  }

  const closeModal = () => {
    setModalState({ isOpen: false, videoId: '', isShort: false })
  }

  return (
    <div className="bg-polka text-slate-800 antialiased overflow-x-hidden selection:bg-sunyellow selection:text-slate-900 min-h-screen">
      
      {/* ==================== TOP NAVIGATION BAR ==================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-amber-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sakhablue to-senared flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-105 transition-transform duration-300">
              <i className="fa-solid fa-shapes"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-2xl font-bold tracking-tight text-slate-800 group-hover:text-sakhablue transition-colors leading-none">
                Sakha<span className="text-senared">&</span>Sena
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 font-heading">
                Animation Channel
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 font-semibold text-slate-700">
            <a href="#karakter" className="hover:text-sakhablue transition-colors py-2 px-3 rounded-full hover:bg-sakhablue-soft">Karakter</a>
            <a href="#video" className="hover:text-sakhablue transition-colors py-2 px-3 rounded-full hover:bg-sakhablue-soft">Video & Shorts</a>
            <a href="#edukasi" className="hover:text-sakhablue transition-colors py-2 px-3 rounded-full hover:bg-sakhablue-soft">Nilai Edukatif</a>
            <a href="#minigame" className="hover:text-sakhablue transition-colors py-2 px-3 rounded-full hover:bg-sakhablue-soft flex items-center gap-1.5 text-senared">
              <i className="fa-solid fa-gamepad"></i> Mini Game
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="https://youtube.com/@sakhasenaanimation" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center gap-2 bg-senared hover:bg-senared-dark text-white font-heading font-semibold px-4 sm:px-6 py-2.5 rounded-2xl shadow-bubbly-red hover:-translate-y-0.5 active:translate-y-1 transition duration-200 text-sm sm:text-base">
              <i className="fa-brands fa-youtube text-lg"></i>
              <span>Langganan</span>
            </a>
          </div>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-10 pb-20 md:py-24 overflow-hidden">
        <div className="absolute top-12 left-8 text-sunyellow text-4xl animate-float opacity-70 pointer-events-none select-none">⭐</div>
        <div className="absolute top-1/4 right-12 text-sakhablue text-5xl animate-float-slow opacity-60 pointer-events-none select-none">🧩</div>
        <div className="absolute bottom-16 left-1/4 text-mintgreen text-4xl animate-float opacity-70 pointer-events-none select-none">🎨</div>
        <div className="absolute bottom-24 right-1/4 text-senared text-3xl animate-float-slow opacity-70 pointer-events-none select-none">🚀</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 font-semibold text-sm border border-amber-300 shadow-sm animate-pulse-slow">
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
                Kanal Animasi Anak Indonesia @sakhasenaanimation
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight">
                Petualangan Seru & Edukatif Bersama <span className="text-sakhablue">Sakha</span> dan <span className="text-senared">Sena!</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Membantu anak balita & prasekolah belajar kebiasaan baik, kerja sama merapikan mainan, mengenal warna, dan nilai positif keluarga melalui animasi 3D yang hangat dan ceria.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-3">
                <a href="https://youtube.com/@sakhasenaanimation" target="_blank" rel="noopener noreferrer"
                   className="px-8 py-4 bg-senared hover:bg-senared-dark text-white rounded-2xl font-heading text-lg font-bold shadow-bubbly-red hover:-translate-y-1 transition duration-200 flex items-center gap-3">
                  <i className="fa-brands fa-youtube text-2xl"></i>
                  Tonton di YouTube
                </a>

                <a href="#video" 
                   className="px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 rounded-2xl font-heading text-lg font-bold shadow-bubbly hover:-translate-y-1 transition duration-200 flex items-center gap-2">
                  <i className="fa-solid fa-circle-play text-sakhablue"></i>
                  Lihat Episode
                </a>
              </div>

              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-slate-600">
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200">
                  <span className="text-mintgreen text-lg font-bold">✓</span> 100% Konten Ramah Anak
                </div>
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200">
                  <span className="text-sunyellow text-lg font-bold">✓</span> Edukasi Kebiasaan Baik
                </div>
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200">
                  <span className="text-sakhablue text-lg font-bold">✓</span> Visual Animasi 3D Menarik
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-bubbly border-4 border-amber-300 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="absolute -top-5 -right-3 bg-sunyellow text-slate-900 font-heading font-bold text-sm px-4 py-2 rounded-2xl shadow-bubbly-yellow flex items-center gap-1.5 transform rotate-6">
                  <i className="fa-solid fa-crown text-amber-900"></i> Made for Kids
                </div>

                <div className="relative bg-gradient-to-b from-sky-100 to-indigo-50 rounded-2xl p-6 text-center border-2 border-dashed border-sky-300 overflow-hidden">
                  <div className="flex justify-center items-end gap-6 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center text-4xl shadow-md border-4 border-white animate-float">
                        👦
                      </div>
                      <span className="mt-2 font-heading font-bold text-sakhablue text-lg">Sakha</span>
                      <span className="text-xs bg-sakhablue-soft text-sakhablue-dark px-2 py-0.5 rounded-full font-semibold">Hoodie Biru</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-b from-red-400 to-red-600 flex items-center justify-center text-4xl shadow-md border-4 border-white animate-float-slow">
                        🧒
                      </div>
                      <span className="mt-2 font-heading font-bold text-senared text-lg">Sena</span>
                      <span className="text-xs bg-senared-soft text-senared-dark px-2 py-0.5 rounded-full font-semibold">Hoodie Merah</span>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-sky-100 shadow-sm mt-3">
                    <p className="font-heading text-sm font-semibold text-slate-700">
                      "Ayo rapikan mainan dan belajar hal seru bersama kami!" ✨
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-white flex items-center justify-center text-lg font-bold">
                      <i className="fa-solid fa-bell"></i>
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-800">Jangan Lewatkan!</h4>
                      <p className="text-xs text-slate-500">Subscribe untuk konten baru</p>
                    </div>
                  </div>
                  <button onClick={triggerConfettiHero} className="px-3 py-1.5 bg-mintgreen hover:bg-mintgreen-dark text-white rounded-xl font-heading text-xs font-bold transition">
                    🎉 Tepuk Tangan
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== KARAKTER UTAMA SECTION ==================== */}
      <section id="karakter" className="py-20 bg-white border-y-4 border-sky-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-sky-100 text-sakhablue font-heading font-bold text-sm uppercase tracking-wider">
              Sahabat Petualang Cilik
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
              Kenalan Dengan Sakha & Sena
            </h2>
            <p className="text-slate-600 font-medium">
              Dua bersaudara yang selalu kompak, saling membantu, dan siap mengajak si kecil belajar hal baru setiap hari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Kartu Sakha */}
            <div className="group bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border-4 border-blue-200 shadow-bubbly hover:border-sakhablue transition duration-300">
              <div className="flex items-start justify-between">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sakhablue to-blue-400 text-white flex items-center justify-center text-4xl shadow-bubbly-blue border-2 border-white">
                  👦
                </div>
                <span className="px-3 py-1 bg-sakhablue text-white font-heading font-bold text-xs rounded-full uppercase tracking-wide">
                  Kakak Cerdas
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-heading text-2xl font-bold text-slate-800 group-hover:text-sakhablue transition-colors">
                  Sakha
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Kakak yang bijaksana, gemar memakai hoodie biru kesayangannya, suka menyusun balok geometri, dan selalu membimbing adiknya untuk membereskan barang bersama-sama.
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">💙 Hoodie Biru</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">🧩 Suka Menyusun Balok</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">🤝 Suka Menolong</span>
                </div>

                <div className="pt-4 border-t border-blue-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Suara & Slogan Sakha:</span>
                  <button 
                    onClick={() => setShowSakhaQuote(prev => !prev)} 
                    className="text-sakhablue hover:text-sakhablue-dark font-heading font-bold text-sm flex items-center gap-1.5 focus:outline-none">
                    <i className="fa-solid fa-volume-high"></i> Sapa Sakha!
                  </button>
                </div>
                {showSakhaQuote && (
                  <div className="mt-2 p-3 bg-blue-100/70 text-blue-900 rounded-xl text-xs font-semibold animate-pulse-slow">
                    "Ayo rapikan satu persatu, pasti cepat selesai kalau kita bekerja sama!" ✨
                  </div>
                )}
              </div>
            </div>

            {/* Kartu Sena */}
            <div className="group bg-gradient-to-br from-red-50 to-white rounded-3xl p-8 border-4 border-red-200 shadow-bubbly hover:border-senared transition duration-300">
              <div className="flex items-start justify-between">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-senared to-rose-400 text-white flex items-center justify-center text-4xl shadow-bubbly-red border-2 border-white">
                  🧒
                </div>
                <span className="px-3 py-1 bg-senared text-white font-heading font-bold text-xs rounded-full uppercase tracking-wide">
                  Adik Lincah
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-heading text-2xl font-bold text-slate-800 group-hover:text-senared transition-colors">
                  Sena
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Adik yang sangat lincah, selalu bersemangat dalam balutan hoodie merah, gemar bermain mobil-mobilan dan robot, serta cepat belajar hal baru dari sang kakak!
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">❤️ Hoodie Merah</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">🚗 Pecinta Mobil Mainan</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">⚡ Penuh Energi</span>
                </div>

                <div className="pt-4 border-t border-red-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Suara & Slogan Sena:</span>
                  <button 
                    onClick={() => setShowSenaQuote(prev => !prev)} 
                    className="text-senared hover:text-senared-dark font-heading font-bold text-sm flex items-center gap-1.5 focus:outline-none">
                    <i className="fa-solid fa-volume-high"></i> Sapa Sena!
                  </button>
                </div>
                {showSenaQuote && (
                  <div className="mt-2 p-3 bg-red-100/70 text-red-900 rounded-xl text-xs font-semibold animate-pulse-slow">
                    "Horeee! Sena siap bantu Kakak, bola merah masuk ke kotak merah!" 🎈
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== VIDEO & SHORTS SHOWCASE SECTION ==================== */}
      <section id="video" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-red-100 text-senared font-heading font-bold text-sm uppercase tracking-wider inline-flex items-center gap-1.5">
              <i className="fa-brands fa-youtube"></i> Konten YouTube Terupdate
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
              Tonton Episode & Shorts Terbaru
            </h2>
            <p className="text-slate-600 font-medium">
              Dapatkan video edukasi dan video pendek interaktif yang otomatis tersinkronisasi dari kanal resmi Sakha Sena.
            </p>

            {/* Filter Tabs */}
            <div className="flex justify-center items-center gap-2 pt-4 flex-wrap">
              <button 
                onClick={() => setCurrentFilter('all')} 
                className={`px-5 py-2.5 rounded-full font-heading font-bold text-sm transition ${currentFilter === 'all' ? 'bg-sakhablue text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
                🌟 Semua Konten
              </button>
              <button 
                onClick={() => setCurrentFilter('video')} 
                className={`px-5 py-2.5 rounded-full font-heading font-bold text-sm transition ${currentFilter === 'video' ? 'bg-sakhablue text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
                🎬 Video Animasi
              </button>
              <button 
                onClick={() => setCurrentFilter('short')} 
                className={`px-5 py-2.5 rounded-full font-heading font-bold text-sm transition ${currentFilter === 'short' ? 'bg-sakhablue text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
                ⚡ YouTube Shorts
              </button>
            </div>
          </div>

          {/* Carousel & Video Track */}
          <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
            {isCarousel && (
              <button 
                onClick={() => slideCarousel(-1)} 
                aria-label="Previous slide"
                className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 bg-white/95 text-sakhablue border-4 border-amber-300 rounded-full shadow-bubbly hover:bg-amber-100 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center font-bold text-xl">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            )}

            {isCarousel && (
              <button 
                onClick={() => slideCarousel(1)} 
                aria-label="Next slide"
                className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 bg-white/95 text-senared border-4 border-amber-300 rounded-full shadow-bubbly hover:bg-amber-100 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center font-bold text-xl">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-3xl p-4 shadow-bubbly border-2 border-slate-100 animate-pulse">
                    <div className="w-full h-48 bg-slate-200 rounded-2xl mb-4"></div>
                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-medium">
                Belum ada konten pada kategori ini.
              </div>
            ) : (
              <div 
                ref={videoContainerRef}
                onScroll={handleCarouselScroll}
                className={isCarousel ? 'flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300'}>
                
                {filteredVideos.map(item => (
                  <div 
                    key={item.id}
                    className={`group bg-white rounded-3xl overflow-hidden shadow-bubbly border-4 hover:-translate-y-1 transition duration-300 flex flex-col ${isCarousel ? 'snap-start flex-shrink-0 w-[85%] sm:w-[48%] lg:w-[31.5%]' : ''} ${item.type === 'short' ? 'border-amber-300' : 'border-blue-200'}`}>
                    
                    <div 
                      className={`relative overflow-hidden bg-slate-900 cursor-pointer ${item.type === 'short' ? 'aspect-[9/14]' : 'aspect-video'}`}
                      onClick={() => openModal(item.id, item.type === 'short')}>
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100" 
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/3b82f6/ffffff?text=Sakha+Sena+Video' }} />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition duration-200">
                          <i className="fa-solid fa-play ml-1"></i>
                        </div>
                      </div>

                      <div className="absolute top-3 left-3">
                        {item.type === 'short' ? (
                          <span className="bg-senared text-white text-xs font-heading font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <i className="fa-solid fa-bolt"></i> Shorts
                          </span>
                        ) : (
                          <span className="bg-sakhablue text-white text-xs font-heading font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <i className="fa-solid fa-video"></i> Video
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                        {{itemDate: item.date}.itemDate}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <h3 className="font-heading font-bold text-slate-800 text-base line-clamp-2 group-hover:text-sakhablue transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                        <button onClick={() => openModal(item.id, item.type === 'short')} className="text-senared hover:underline flex items-center gap-1">
                          <i className="fa-solid fa-circle-play"></i> Putar Video
                        </button>
                        <a href={`https://www.youtube.com/watch?v=${item.id}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">
                          Buka di YT <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}

            {/* Dots Pagination */}
            {isCarousel && totalDots > 0 && (
              <div className="flex justify-center items-center gap-2.5 mt-8 flex-wrap">
                {Array.from({ length: totalDots }).map((_, idx) => (
                  <button 
                    key={idx} 
                    aria-label={`Slide ${idx + 1}`}
                    onClick={() => scrollCarouselToDot(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${activeDotIndex === idx ? 'bg-sakhablue scale-125' : 'bg-slate-300 hover:bg-slate-400'}`}>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <a href="https://youtube.com/@sakhasenaanimation" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-heading font-bold text-lg px-8 py-4 rounded-2xl shadow-bubbly-red hover:-translate-y-1 transition duration-200">
              <i className="fa-brands fa-youtube text-2xl"></i>
              <span>Kunjungi Kanal YouTube Sakha Sena</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
            </a>
          </div>

        </div>
      </section>

      {/* ==================== NILAI EDUKATIF SECTION ==================== */}
      <section id="edukasi" className="py-20 bg-white border-y-4 border-amber-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-heading font-bold text-sm uppercase tracking-wider">
              Materi Ramah Anak
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
              Pilar Nilai & Kebiasaan Baik
            </h2>
            <p className="text-slate-600 font-medium">
              Setiap jalan cerita dirancang secara cermat untuk mendampingi masa emas pertumbuhan si kecil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-sunyellow-soft rounded-3xl p-8 border-4 border-sunyellow shadow-bubbly text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sunyellow text-white text-3xl flex items-center justify-center mx-auto shadow-md">
                🧸
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-800">Tanggung Jawab & Kerapian</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Mengajarkan anak untuk terbiasa mengembalikan mainan ke wadahnya setelah selesai bermain lewat lagu dan permainan warna.
              </p>
            </div>

            <div className="bg-sakhablue-soft rounded-3xl p-8 border-4 border-sakhablue-light shadow-bubbly text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sakhablue text-white text-3xl flex items-center justify-center mx-auto shadow-md">
                🤝
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-800">Kerja Sama Saudara</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Menanamkan kerukunan antara kakak dan adik, saling menghargai, berbagi peran, serta saling tolong menolong tanpa berebut.
              </p>
            </div>

            <div className="bg-mintgreen-soft rounded-3xl p-8 border-4 border-mintgreen-light shadow-bubbly text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-mintgreen text-white text-3xl flex items-center justify-center mx-auto shadow-md">
                🧠
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-800">Stimulasi Kognitif & Warna</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Mengenalkan konsep bentuk balok, pengelompokan warna (merah, biru, kuning), serta penyelesaian masalah sederhana secara menyenangkan.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== MINI GAME ==================== */}
      <section id="minigame" className="py-20 relative bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-10 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-mintgreen-soft text-mintgreen-dark font-heading font-bold text-sm uppercase tracking-wider">
              Interaksi Ceria
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
              Mini Game: Bantu Merapikan Mainan! 📦
            </h2>
            <p className="text-slate-600 font-medium">
              Klik tombol mainan di bawah untuk memasukkannya ke kotak warna yang sesuai!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-bubbly border-4 border-sky-200">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-4 border-dashed border-sakhablue bg-blue-50/70 rounded-2xl p-6 text-center transition-all">
                <div className="text-4xl mb-2">📥</div>
                <h4 className="font-heading font-bold text-sakhablue text-lg">Kotak Sakha (Biru)</h4>
                <div className="mt-4 flex flex-wrap gap-2 justify-center min-h-[50px]">
                  {blueBoxItems.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 text-xs rounded-full font-bold bg-blue-200 text-blue-900">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-4 border-dashed border-senared bg-red-50/70 rounded-2xl p-6 text-center transition-all">
                <div className="text-4xl mb-2">📥</div>
                <h4 className="font-heading font-bold text-senared text-lg">Kotak Sena (Merah)</h4>
                <div className="mt-4 flex flex-wrap gap-2 justify-center min-h-[50px]">
                  {redBoxItems.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 text-xs rounded-full font-bold bg-red-200 text-red-900">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              {availableToys.length > 0 && (
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 font-heading">
                  Pilih mainan untuk dimasukkan:
                </p>
              )}

              <div className="flex flex-wrap justify-center gap-3">
                {availableToys.map(toy => (
                  <button 
                    key={toy.id}
                    onClick={() => sortToy(toy)}
                    className={`px-4 py-2 font-bold rounded-xl border shadow-sm transition active:scale-95 cursor-pointer ${toy.color === 'blue' ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300' : 'bg-red-100 hover:bg-red-200 text-red-800 border-red-300'}`}>
                    {toy.name}
                  </button>
                ))}
              </div>

              {availableToys.length === 0 && (
                <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-2xl font-heading font-bold text-lg animate-pulse-slow">
                  🎉 Hebat! Semua mainan sudah rapi di tempatnya!
                  <br />
                  <button onClick={resetGame} className="mt-2 text-xs font-sans text-green-700 underline font-semibold cursor-pointer">
                    Main Lagi
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ==================== VIDEO MODAL POPUP ==================== */}
      {modalState.isOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <div className={modalState.isShort ? 'relative w-full max-w-sm mx-auto aspect-[9/16]' : 'relative w-full pt-[56.25%]'}>
              <iframe 
                src={`https://www.youtube.com/embed/${modalState.videoId}?autoplay=1`} 
                className="absolute inset-0 w-full h-full" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>
      )}

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t-4 border-amber-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="font-heading text-2xl font-bold text-slate-800">
              Sakha<span className="text-senared">&</span>Sena
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium max-w-xl mx-auto">
            Kanal animasi anak edukatif & keluarga. Dibuat dengan cinta untuk menumbuhkan kebiasaan baik dan tawa si kecil.
          </p>
          <div className="flex justify-center gap-4 text-xl text-slate-600">
            <a href="https://youtube.com/@sakhasenaanimation" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
          <p className="text-xs text-slate-400">
            &copy; 2026 Sakha & Sena Animation. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
