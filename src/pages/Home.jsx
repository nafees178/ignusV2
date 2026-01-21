import { useEffect, useRef, useState } from "react";
import "../styles/Home.css";

function Home() {
  const [galleryImagesLoaded, setGalleryImagesLoaded] = useState(false);
  const canvasRef = useRef(null);
  const contentRefs = useRef([]);

  const spinnerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [startX, setStartX] = useState(0);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const requestRef = useRef(null);
  const autoRotateSpeed = 0.2;

  const galleryImages = [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800"
  ];

  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        velocityRef.current *= 0.95;

        if (isHovering) {
          velocityRef.current *= 0.5;
        } else {
          if (Math.abs(velocityRef.current) < 0.01) {
            rotationRef.current -= autoRotateSpeed;
          } else {
            rotationRef.current += velocityRef.current;
          }
        }
      }

      if (spinnerRef.current) {
        spinnerRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isDragging, isHovering]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    lastXRef.current = e.pageX;
    velocityRef.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX;
    const delta = x - lastXRef.current;
    rotationRef.current += delta * 0.05;
    velocityRef.current = delta * 0.05;
    lastXRef.current = x;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    lastXRef.current = e.touches[0].pageX;
    velocityRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX;
    const delta = x - lastXRef.current;
    rotationRef.current += delta * 0.1;
    velocityRef.current = delta * 0.1;
    lastXRef.current = x;
  };

  useEffect(() => {
    let loadedCount = 0;
    const totalImages = galleryImages.length;

    galleryImages.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setGalleryImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setGalleryImagesLoaded(true);
        }
      };
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const frameCount = 660;
    const prefix = 'image';
    const ext = '.webp';
    const padding = 3;
    const framesPath = '/bgFrames/';
    const easing = 0.09;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let images = new Array(frameCount);
    let loadedCount = 0;
    let scrollTarget = 0;
    let smooth = 0;
    let firstFrameDrawn = false;
    let rafId = 0;

    function pad(num) {
      return String(num).padStart(padding, '0');
    }

    function frameUrl(i) {
      return framesPath + prefix + pad(i) + ext;
    }

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawImageToCover(img) {
      if (!img || !img.width) return;
      const vw = canvas.clientWidth;
      const vh = canvas.clientHeight;
      const iw = img.width;
      const ih = img.height;

      const scale = Math.max(vw / iw, vh / ih) * 1.1;
      const w = iw * scale;
      const h = ih * scale;
      const x = (vw - w) / 2;
      const y = (vh - h) / 2;

      ctx.clearRect(0, 0, vw, vh);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, vw, vh);
      ctx.drawImage(img, x, y, w, h);
    }

    function computeScrollPercent() {
      const el = document.scrollingElement || document.documentElement;
      const docH = el.scrollHeight - el.clientHeight;
      if (docH <= 0) return 0;
      return Math.max(0, Math.min(1, el.scrollTop / docH));
    }

    function animateContents() {
      const totalContents = contentRefs.current.length;
      const currentScrollPercent = computeScrollPercent();

      contentRefs.current.forEach((content, index) => {
        if (!content) return;

        const startScroll = index / totalContents;
        let endScroll = (index + 1) / totalContents;

        if (index === totalContents - 1) endScroll = 1.05;

        const contentScrollRange = endScroll - startScroll;
        let opacity = 0;
        let scale = 0.5;

        if (index === 0 && currentScrollPercent < startScroll + 0.02) {
          opacity = 1;
          scale = 1;
        } else if (currentScrollPercent < startScroll) {
          opacity = 0;
          scale = 0.5;
        } else if (currentScrollPercent < startScroll + contentScrollRange * 0.3) {
          const progress = (currentScrollPercent - startScroll) / (contentScrollRange * 0.3);
          opacity = progress;
          scale = 0.5 + 0.5 * progress;
        } else if (currentScrollPercent < startScroll + contentScrollRange * 0.7) {
          opacity = 1;
          scale = 1.0;
        } else if (currentScrollPercent < endScroll) {
          const progress = (currentScrollPercent - (startScroll + contentScrollRange * 0.7)) / (contentScrollRange * 0.3);
          opacity = 1 - progress;
          scale = 1.0 + 0.5 * progress;
        } else {
          opacity = 0;
          scale = 1.5;
        }

        content.style.transform = `scale(${scale})`;
        content.style.opacity = opacity;
      });
    }

    async function preloadAll() {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          images[i - 1] = img;
          loadedCount++;
          const pct = Math.round((loadedCount / frameCount) * 100);
          if (!firstFrameDrawn) {
            firstFrameDrawn = true;
            drawImageToCover(img);
          }
        };
        img.onerror = () => {
          loadedCount++;
        };
        img.src = frameUrl(i);
      }
    }

    function loop() {
      smooth += (scrollTarget - smooth) * easing;

      const index = Math.floor(smooth * (frameCount - 1));
      let img = images[index] || images.find(Boolean);
      if (img) drawImageToCover(img);

      animateContents();
      rafId = requestAnimationFrame(loop);
    }

    function onScroll() {
      scrollTarget = computeScrollPercent();
    }

    function onResize() {
      resizeCanvas();
      if (firstFrameDrawn) {
        const index = Math.floor(smooth * (frameCount - 1));
        let img = images[index] || images.find(Boolean);
        if (img) drawImageToCover(img);
      }
    }

    resizeCanvas();
    preloadAll();

    rafId = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll);
    onScroll();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: "0px",
    };

    const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 80;
      const duration = 2000;
      const stepTime = duration / 80;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target + "+";
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + "+";
        }
      }, stepTime);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("animated")
        ) {
          entry.target.classList.add("animated");
          const target = parseInt(entry.target.dataset.target);
          animateCounter(entry.target, target);
        }
      });
    }, observerOptions);

    const statNumbers = document.querySelectorAll(".stat-number");
    statNumbers.forEach((stat) => observer.observe(stat));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <canvas id="canvas" ref={canvasRef} aria-hidden="true" />
      <div className="canvas-overlay"></div>

      <section className="ignus-hero">
        <div className="ignus-brand">
          <h1 className="ignus-title">IGNUS</h1>
          <p className="ignus-subtitle">Annual Cultural Festival of IIT Jodhpur</p>
          <p className="ignus-date">February 2025</p>
          <div className="scroll-hint">
            <div className="scroll-line"></div>
            <span className="scroll-text">Scroll</span>
          </div>
        </div>
      </section>

      <section className="ignus-about">
        <div className="about-frame">
          <div className="about-content">
            <p className="section-label">About</p>
            <h2 className="about-title">A Celebration of Culture, Creativity & Unity</h2>
            <p className="about-description">
              Ignus is the annual cultural extravaganza of IIT Jodhpur, bringing together thousands of students from across the nation for three days of music, dance, art, and celebration. Experience the perfect blend of tradition and innovation in the heart of Rajasthan.
            </p>
          </div>
          <div className="stats-container">
            <div className="stat-block">
              <div className="stat-value">1000+</div>
              <div className="stat-text">Attendees</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">50+</div>
              <div className="stat-text">Events</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">100+</div>
              <div className="stat-text">Colleges</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">3</div>
              <div className="stat-text">Days</div>
            </div>
          </div>
        </div>
      </section>

      <section className="ignus-theme">
        <div className="theme-content">
          <p className="theme-year">IGNUS 2025</p>
          <h2 className="theme-title">RENAISSANCE</h2>
          <p className="theme-description">
            A rebirth of creativity, culture, and community. This year's theme celebrates the timeless spirit of innovation and artistic expression, bridging the past with the future through music, dance, art, and human connection.
          </p>
        </div>
      </section>

      <section className="ignus-gallery">
        <div className="gallery-header">
          <h2 className="gallery-title">MOMENTS</h2>
        </div>
        <div
          className="gallery-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <div className="gallery-spinner" ref={spinnerRef}>
            {galleryImages.map((src, index) => (
              <div
                key={index}
                className="gallery-item"
                style={{ '--i': index + 1, '--total': galleryImages.length }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <img
                  src={src}
                  alt={`Ignus ${index + 1}`}
                  className="gallery-image"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}

export default Home;
