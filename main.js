const URLS = [
  { url: '/test', paths: ['.'] },
  { url: '/installer', paths: ['..', 'installer-ts', 'build'] },
  { url: '/background-manager', paths: ['..', 'appengine-background-manager', 'build'] },

  // { url: '/synapse/dashboard', paths: ['..', 'dashboard', 'build'] },
  // { url: '/chroma-app/dashboard', paths: ['..', 'razer-chroma-app', 'build'] },
  // { url: '/synapse/products/128/ui', paths: ['..', 'port_ui', 'build'] },
  // { url: '/synapse/products/128/mw', paths: ['..', 'evelyn_mw', 'build'] },
  // { url: '/synapse/products/124/mw', paths: ['..', 'lilywireless_mw', 'build'] },

  // { url: '/synapse/dashboard', port: 3008 },
  // { url: '/synapse/settings', port: 3012 },
  // { url: '/synapse/profiles', port: 3005 },
  // { url: '/synapse/gms-proxy', port: 3011 },
  // { url: '/synapse/macro', port: 3009 },
  // { url: '/systray/systrayv2', port: 3007 },
  // { url: '/synapse/products/128/ui', port: 3000 },
  // { url: '/synapse/products/575/mw', port: 3001 },

  // { url: '/chroma-app/dashboard', port: 3001 },
  // { url: '/chroma-app/settings', port: 3002 },
  // { url: '/synapse/chroma-studio', port: 3003 },
  // { url: '/synapse/chroma-connect', port: 3004 },
  // { url: '/synapse/audio-visualizer', port: 3009 },
  // { url: '/synapse/lighting-engine', port: 3011 },
];
const HOST = 'https://apps-staging.razer.com';
const express = require('express');
const path = require('path');
const request = require('request');
const app = express();
app.use(express.json());
app.listen(5000, () => console.log('Server started!'));
URLS.forEach(({ url, paths, port }) => {
  paths
    ? app.use(url, express.static(path.join(__dirname, ...paths)))
    : app.get(`${url}*`, (req, res) => {
        request.get(`http://localhost:${port}${req.url}`).pipe(res);
        // fetch(`http://127.0.0.1:${port}`).then((actual) => {
        //   actual.headers.forEach((v, n) => res.setHeader(n, v));
        //   actual.body.pipeTo(res);
        // });
      });
});

app.get('*', (req, res) => {
  console.log(req.url);
  request.get(`${HOST}${req.url}`).pipe(res);
});

app.post('*', (req, res) => {
  console.log('POST', req.url);
  request({
    url: `${HOST}${req.url}`,
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: req.body,
    json: true,
  }).pipe(res);
});
