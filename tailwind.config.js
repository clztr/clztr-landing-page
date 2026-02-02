/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['index.html', 'components/**/*.hbs', 'public/app.js'],
  safelist: [
    'bg-gray-900',
    'bg-gray-800',
    'text-white',
    'text-gray-500',
    'border-primary/60',
    'border-gray-600',
    'border-transparent',
    'shadow-sm',
    'hover:text-white',
    'hover:bg-gray-900',
    'ring-1',
    'ring-white/20',
    'opacity-100',
    'opacity-50',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        accent: '#00E5FF',
        'neon-orange': '#FF6B00',
        'background-light': '#F3F4F6',
        'background-dark': '#050505',
        'surface-light': '#FFFFFF',
        'surface-dark': '#0F0F0F',
        'secondary-dark': '#1A1A20',
        'accent-cyan': '#00E0FF',
        'accent-purple': '#A020F0',
        'dim-gray': '#1A1A1A',
        'mesh-orange': '#FF6B35',
        success: '#00FF94',
        error: '#FF2A2A',
      },
      fontFamily: {
        display: ['"Russo One"', 'sans-serif'],
        body: ['"Chakra Petch"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)',
      },
      screens: {
        '3xl': '1600px',
      },
      boxShadow: {
        'neon-yellow':
          '0 0 10px rgba(252, 238, 10, 0.5), 0 0 20px rgba(252, 238, 10, 0.3)',
        'neon-cyan':
          '0 0 10px rgba(0, 229, 255, 0.5), 0 0 20px rgba(0, 229, 255, 0.3)',
        'neon-orange':
          '0 0 10px rgba(255, 107, 0, 0.5), 0 0 20px rgba(255, 107, 0, 0.3)',
        'neon-white':
          '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'scan-fast': 'scanline 2s linear infinite',
        'spin-slow': 'spin 10s linear infinite',
        'spin-reverse': 'spin 15s linear infinite reverse',
        shimmer: 'shimmer 2s infinite',
        scan: 'scan 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scan: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
