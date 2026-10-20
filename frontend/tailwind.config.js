/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F3F4F6',
        card: '#FFFFFF',
        brand: {
          orange: '#EA580C',
          orangeHover: '#C2410C',
          orangeLight: '#FFF7ED',
          orangeBorder: '#FFEDD5',
        },
        inverted: {
          DEFAULT: '#291C14',
          surface: '#3A281E',
          border: '#4D3629',
        },
        textDark: '#111827',
        textMuted: '#6B7280',
        positive: '#10B981',
        negative: '#EF4444',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
        'orange-glow': '0 4px 14px 0 rgba(234, 88, 12, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
