import { useState, useEffect, useRef } from "react"
import "./CarouselBanner.scss"

export default function CarouselBanner() {
  const images = [
    "/assets/img/carouselbannerpics/banner1.webp",
    "/assets/img/carouselbannerpics/banner2.webp",
    "/assets/img/carouselbannerpics/banner3.webp",
  ]

  const [index, setIndex] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const delay = 5000 // Carousel changes pic every 5s

  const next = () => setIndex((prev) => (prev + 1) % images.length)
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length)

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = window.setInterval(next, delay)
  }

  // Probably messy, but we need to make the buttons reset the implicit timer. Bad UX otherwise. Declaring it manually on each button's function
  const handleNext = () => {
    next()
    resetTimer()
  }

  const handlePrev = () => {
    prev()
    resetTimer()
  }

  const handleDotClick = (i: number) => {
    setIndex(i)
    resetTimer()
  }

  useEffect(() => {
    intervalRef.current = window.setInterval(next, delay)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [])

  return (
    <div className="banner-carousel">
      <div className="carousel-container">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Banner ${i + 1}`}
            className={`carousel-image ${i === index ? "active" : ""}`}
          />
        ))}

        <button className="nav left" onClick={handlePrev} aria-label="Previous image">
          <svg viewBox="0 0 24 24">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button className="nav right" onClick={handleNext} aria-label="Next image">
          <svg viewBox="0 0 24 24">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => handleDotClick(i)}
          />
        ))}
      </div>
    </div>
  )
}
