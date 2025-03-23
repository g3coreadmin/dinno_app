// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {
      engine: 'node', // 👈 força parser JS e evita erro do oxide
    },
    autoprefixer: {},
  },
};
