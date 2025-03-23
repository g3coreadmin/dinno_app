import tailwind from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwind({ engine: 'node' }), // 👈 força uso do parser JS (sem oxide)
    autoprefixer,
  ],
}