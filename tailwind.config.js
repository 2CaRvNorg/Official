/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#060918',
        'accent-gold': '#F5A623',
        'accent-cyan': '#00E5FF',
        'glass-surface': 'rgba(255,255,255,0.05)',
        'glass-border': 'rgba(255,255,255,0.12)',
        'text-primary': '#FFFFFF',
        'text-muted': 'rgba(255,255,255,0.6)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      backdropBlur: {
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.37)',
        'gold-glow': '0 0 30px rgba(245,166,35,0.4)',
        'cyan-glow': '0 0 30px rgba(0,229,255,0.4)',
        card: '0 20px 60px rgba(0,0,0,0.5)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-mid': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
