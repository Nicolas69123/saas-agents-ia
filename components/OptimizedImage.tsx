'use client';

import React from 'react';
import { getImagePlaceholder } from '@/config/images';

/**
 * Composant d'image optimisé pour Next.js
 * Supporte les images Unsplash et DiceBear avec lazy loading
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholderColor?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 80,
  objectFit = 'cover',
  placeholderColor = '#1e293b',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Détecter si c'est une image SVG (DiceBear)
  const isSvg = src.includes('.svg') || src.includes('dicebear');

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Fallback en cas d'erreur
  if (hasError) {
    return (
      <div
        className={`bg-gray-800 flex items-center justify-center ${className}`}
        style={{ width: width || '100%', height: height || '100%' }}
      >
        <span className="text-gray-500 text-sm">❌ Image non disponible</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Placeholder pendant le chargement */}
      {!isLoaded && !isSvg && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: placeholderColor }}
        />
      )}

      {/* Image principale */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          ${isSvg ? '' : 'transition-opacity duration-500'}
          ${isLoaded || isSvg ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          width: '100%',
          height: '100%',
          objectFit: isSvg ? 'contain' : objectFit,
        }}
      />

      <style jsx>{`
        div {
          background-color: ${placeholderColor};
        }
      `}</style>
    </div>
  );
}

/**
 * Variante pour les avatars agents (circulaire)
 */
interface AgentAvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  borderColor?: string;
}

export function AgentAvatar({
  src,
  alt,
  size = 64,
  className = '',
  borderColor,
}: AgentAvatarProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 4, // Border radius de 25% pour un look moderne
        border: borderColor ? `3px solid ${borderColor}` : 'none',
      }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        objectFit="cover"
        priority
      />
    </div>
  );
}

/**
 * Variante pour les images de fond (hero, sections)
 */
interface BackgroundImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: 'dark' | 'light' | 'gradient' | 'none';
  overlayOpacity?: number;
  children?: React.ReactNode;
}

export function BackgroundImage({
  src,
  alt,
  className = '',
  overlay = 'dark',
  overlayOpacity = 0.6,
  children,
}: BackgroundImageProps) {
  const overlayStyles = {
    dark: `rgba(0, 0, 0, ${overlayOpacity})`,
    light: `rgba(255, 255, 255, ${overlayOpacity})`,
    gradient: `linear-gradient(135deg, rgba(59, 130, 246, ${overlayOpacity}), rgba(139, 92, 246, ${overlayOpacity}))`,
    none: 'transparent',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Image de fond */}
      <OptimizedImage
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full"
        objectFit="cover"
      />

      {/* Overlay */}
      {overlay !== 'none' && (
        <div
          className="absolute inset-0"
          style={{ background: overlayStyles[overlay] }}
        />
      )}

      {/* Contenu */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
