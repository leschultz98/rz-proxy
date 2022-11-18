const URLS = [
  { url: '/test', paths: ['.'] },
  { url: '/installer', paths: ['..', 'installer-ts', 'build'] },
  { url: '/background-manager', paths: ['..', 'appengine-background-manager', 'build'] },

  // { url: '/synapse/dashboard', paths: ['..', 'dashboard', 'build'] },
  // { url: '/chroma-app/dashboard', paths: ['..', 'razer-chroma-app', 'build'] },
  // { url: '/synapse/products/154/ui', paths: ['..', 'port_ui', 'build'] },
  // { url: '/synapse/products/154/mw', paths: ['..', 'port_mw', 'build'] },

  // { url: '/synapse/dashboard', port: 3008 },
  // { url: '/synapse/settings', port: 3012 },
  // { url: '/synapse/profiles', port: 3005 },
  // { url: '/synapse/gms-proxy', port: 3010 },
  // { url: '/synapse/macro', port: 3009 },
  // { url: '/systray/systrayv2', port: 3007 },
  // { url: '/synapse/products/154/ui', port: 3000 },
  // { url: '/synapse/products/154/mw', port: 1154, pathRewrite: true },

  // { url: '/chroma-app/dashboard', port: 3001 },
  // { url: '/chroma-app/settings', port: 3002 },
  // { url: '/synapse/chroma-studio', port: 3003 },
  // { url: '/synapse/chroma-connect', port: 3004 },
  // { url: '/synapse/audio-visualizer', port: 3009 },
  // { url: '/synapse/lighting-engine', port: 3011 },
];

const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const app = express();
const HOST = 'https://apps-staging.razer.com';

app.listen(5000, () => console.log('Server started!'));

URLS.forEach(({ url, paths, port, pathRewrite }) => {
  app.use(
    url,
    paths
      ? express.static(path.join(__dirname, ...paths))
      : createProxyMiddleware({
          target: `http://127.0.0.1:${port}`,
          pathRewrite: pathRewrite && { [url]: '' },
        })
  );
});

app.use(
  '/files/synapse',
  createProxyMiddleware({
    target: 'https://razer-apps-assets.s3.amazonaws.com',
    changeOrigin: true,
  })
);

const FILES = [
  // { path: '/synapse/dashboard', name: 'AvailableDevices.json' }
];

FILES.forEach(({ path, name }) => {
  app.use(
    `${path}/${name}`,
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000/test/',
      pathRewrite: {
        [path]: '',
      },
    })
  );
});

app.use('*', createProxyMiddleware({ target: HOST, changeOrigin: true }));
