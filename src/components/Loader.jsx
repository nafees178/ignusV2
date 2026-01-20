import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../styles/Loader.css";

function Loader({ onComplete }) {
  const loaderBarRef = useRef(null);
  const loaderTextRef = useRef(null);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
      if (loaderBarRef.current) {
        loaderBarRef.current.style.width = `${progress}%`;
      }
      if (loaderTextRef.current) {
        loaderTextRef.current.textContent = `Loading ${Math.floor(progress)}%`;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="loader-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loader-content">
        <motion.h1
          className="loader-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          IGNUS
        </motion.h1>
        <motion.p
          className="loader-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          IIT Jodhpur Cultural Fest
        </motion.p>
        <div className="loader-bar-container">
          <div className="loader-bar" ref={loaderBarRef}></div>
        </div>
        <p className="loader-text" ref={loaderTextRef}>
          Loading 0%
        </p>
      </div>
    </motion.div>
  );
}

export default Loader;

