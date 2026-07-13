import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSequence() {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const frameCount = 240;
  const currentFrame = (index) => `/ezgif-2457c235ca83dc5e-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const images = [];
    const sequence = { frame: 0 };
    let loadedCount = 0;
    
    // 1. Preload images
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      
      const handleLoadOrError = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          initAnimation();
        }
      };
      
      img.onload = handleLoadOrError;
      img.onerror = handleLoadOrError;
      images.push(img);
    }

    const render = () => {
      if (images[sequence.frame] && images[sequence.frame].complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[sequence.frame], 0, 0);
      }
    };

    const initAnimation = () => {
      setLoading(false);
      
      if(images[0]) {
        canvas.width = images[0].width || 1920;
        canvas.height = images[0].height || 1080;
      }
      
      render();

      gsap.to(sequence, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        onUpdate: render,
      });
    };

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', backgroundColor: '#000' }}>
      {loading && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            zIndex: 10,
            fontSize: '1.25rem'
          }}
        >
          Loading animation... {progress}%
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'crisp-edges',
          opacity: 1 // Increased opacity so the animation is fully visible
        }}
      />
      {/* Glass overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' }} />
    </div>
  );
}
