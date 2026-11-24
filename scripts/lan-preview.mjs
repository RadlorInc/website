#!/usr/bin/env node
// See a local build on an iPad or phone on the same Wi-Fi: node scripts/lan-preview.mjs [from=3045] [port=3050]
// The site's CSP asks the browser to upgrade every request to https, which a plain local address does not have (Safari then
// shows an unstyled page), so this passes everything through and takes out that one directive. Local use only.
import http from 'node:http'

const from = Number(process.argv[2] ?? 3045), port = Number(process.argv[3] ?? 3050)
http.createServer((q, r) => {
  const up = http.request({ host: '127.0.0.1', port: from, path: q.url, method: q.method, headers: q.headers }, a => {
    const h = { ...a.headers }
    if (h['content-security-policy']) h['content-security-policy'] = h['content-security-policy'].replace(/;?\s*upgrade-insecure-requests/, '')
    r.writeHead(a.statusCode, h)
    a.pipe(r)
  })
  up.on('error', () => { r.writeHead(502); r.end('The local site is not running.') })
  q.pipe(up)
}).listen(port, '0.0.0.0', () => console.log(`http://<this Mac's address>:${port} → ${from}`))
