import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Netlify uses "/", GitHub Pages uses the repository-prefixed project URL.
// Pages builds set GITHUB_PAGES=true, leaving existing Netlify deployment intact.
const githubPages=process.env.GITHUB_PAGES==='true'
const pagesRepo='Geojit-Wealth-Story-POC-2.0'
export default defineConfig({
 plugins: [react()],
 base: githubPages?'/'+pagesRepo+'/':'/'
})
