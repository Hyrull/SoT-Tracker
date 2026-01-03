import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

// This whole script is run with npm run build
// It creates static pages for the index and for /commendations so crawlers etc access it properly
// otherwise it thinks it's an empty page + console returns 404

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, 'dist')

// static routes here
const routes = ['/', '/commendations'];

(async () => {
  // We launch a headless browser
  console.log('Starting Prerender...')
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  })
  const page = await browser.newPage()

  // Start local server to serve the build
  const { preview } = await import('vite')
  const server = await preview({
    preview: { port: 4173, open: false },
    root: DIST_DIR,
    configFile: false,
  })
  
  const baseUrl = server.resolvedUrls.local[0]

  for (const route of routes) {
    // Clean URL construction
    const url = `${baseUrl}${route.substring(1)}`
    console.log(`Snapshotting: ${route}`)

    // Wait for network idle (API requests etc)
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Capture HTML
    let html = await page.content()

    // fixing so the url isnt localhost but sot-tracker.com instead
    const safeBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    const prodUrl = 'https://www.sot-tracker.com'
    
    // Global replace of localhost:4173 -> sot-tracker.com
    html = html.split(safeBaseUrl).join(prodUrl)
    // ----------------------------------------------------

    // Determine output path (e.g. dist/commendations/index.html)
    const fileName = route === '/' ? 'index.html' : `${route.substring(1)}/index.html`
    const filePath = path.join(DIST_DIR, fileName)
    
    // Ensure folder exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    fs.writeFileSync(filePath, html)
  }

  // --- GITHUB PAGES FIX ---
  // Copying index.html to 404.html so generic routes
  // fall back to the React App instead of a GitHub 404 page.
  console.log('Creating 404.html for GitHub Pages...');
  fs.copyFileSync(path.join(DIST_DIR, 'index.html'), path.join(DIST_DIR, '404.html'));
  // ------------------------

  // Cleanup
  await browser.close()
  server.httpServer.close()
  console.log('Done.')
  process.exit(0)
})()