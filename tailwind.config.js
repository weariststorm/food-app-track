module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        void: '#0f0f1b',
        plasma: '#ff4fcb',
        mint: '#4effb8',
        steel: '#1f1f2e',
        haze: '#3f3f5a',
      },
      backgroundImage: {
        glass: 'linear-gradient(to bottom right, rgba(255,255,255,0.02), rgba(255,255,255,0))',
      },
    },
  },
  plugins: [],
};