// postcss.config.js (modo ESM)
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const config = {
  plugins: [
    tailwindcss({ engine: 'node' }), // 👈 aqui você força usar a versão JS e evita o erro do oxide
    autoprefixer,
  ],
}

export default config
