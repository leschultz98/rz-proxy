const MW_PID = 0;
const URLS = [
  { url: '/test', paths: ['.', 'test'] },
  { url: '/installer', paths: ['..', 'installer-ts', 'build'] },
  { url: '/background-manager', paths: ['..', 'appengine-background-manager', 'build'] },
  { url: '/synapse/lighting-engine/manifest', paths: ['..', 'razer-lighting-engine\\public\\manifest'] },

  // { url: '/synapse/dashboard', paths: ['..', 'dashboard', 'build'] },
  // { url: '/chroma-app/dashboard', paths: ['..', 'razer-chroma-app', 'build'] },
  // { url: '/synapse/products/154/ui', paths: ['..', 'port_ui', 'build'] },
  // { url: '/synapse/products/154/mw', paths: ['..', 'port_mw', 'build'] },

  // { url: '/synapse/philips-hue', port: 3000 },
  // { url: '/synapse/dashboard', port: 3008 },
  // { url: '/synapse/settings', port: 3012 },
  // { url: '/synapse/profiles', port: 3005 },
  // { url: '/synapse/gms-proxy', port: 3010 },
  // { url: '/synapse/macro', port: 3009 },
  // { url: '/systray/systrayv2', port: 3007 },
  // { url: '/remote-sync-worker', port: 5555, onlyLocalHost: true },
  // { url: '/synapse/products/99/ui', port: 3000 },
  // { url: '/synapse/products/769/ui', port: 3000 },
  { url: `/synapse/products/${MW_PID}/mw`, port: 1000 + MW_PID, pathRewrite: true },

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

URLS.forEach(({ url, paths, port, pathRewrite, onlyLocalHost }) => {
  app.use(
    url,
    paths
      ? express.static(path.join(__dirname, ...paths))
      : createProxyMiddleware({
          target: `http://${onlyLocalHost ? 'localhost' : '127.0.0.1'}:${port}`,
          pathRewrite: pathRewrite && { [url]: '' },
        })
  );
});

const FILES = [
  // { path: '/synapse/dashboard/AvailableDevices.json', name: 'dump.json' },
];
FILES.forEach(({ path, name }) =>
  app.use(
    path,
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000/test/',
      pathRewrite: { [path]: name },
    })
  )
);

app.use(
  '/files',
  createProxyMiddleware({
    target: 'https://app-assets.razer.com',
    changeOrigin: true,
  })
);

app.use('*', createProxyMiddleware({ target: HOST, changeOrigin: true }));
