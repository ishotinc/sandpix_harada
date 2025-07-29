'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Three.js setup for background animation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create floating particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    // Google colors
    const googleColors = [
      { r: 66/255, g: 133/255, b: 244/255 },   // Blue
      { r: 234/255, g: 67/255, b: 53/255 },    // Red
      { r: 251/255, g: 188/255, b: 4/255 },    // Yellow
      { r: 52/255, g: 168/255, b: 83/255 }     // Green
    ];

    for (let i = 0; i < 200; i++) {
      vertices.push(
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500
      );
      
      const color = googleColors[Math.floor(Math.random() * googleColors.length)];
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 500;

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.x += 0.0005;
      points.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);


  return (
    <>
      <canvas 
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30"
        style={{ zIndex: 1 }}
      />
      
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20" style={{ zIndex: 2 }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Keywords */}
            <div className="mb-12 space-y-2">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight">
                <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0ms' }}>Swipe.</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Play.</span>
                </span>{' '}
                <span className="inline-block animate-fade-in-up" style={{ animationDelay: '400ms' }}>Publish.</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '600ms' }}>
              The smartest way to create landing pages
            </p>

            {/* CTA Button */}
            <div className="mb-16 animate-fade-in" style={{ animationDelay: '800ms' }}>
              <Link to="/register">
                <Button 
                  variant="custom" 
                  size="lg" 
                  className="bg-[#0071E3] hover:bg-[#0051C3] text-white px-8 py-4 text-lg rounded-full font-medium transition-all transform hover:scale-105"
                >
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
}