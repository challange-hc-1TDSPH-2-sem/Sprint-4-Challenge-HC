// PostCSS em CommonJS para compatibilidade com projetos ESM (type: module)
// Tailwind v4 usa o plugin oficial @tailwindcss/postcss
const tailwind = require('@tailwindcss/postcss')

module.exports = {
  plugins: [tailwind()],
}



