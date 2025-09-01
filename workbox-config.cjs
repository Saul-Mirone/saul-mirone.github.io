module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico,xml}'
  ],
  swDest: 'dist/sw.js',
  swSrc: 'public/sw.js',
  dontCacheBustURLsMatching: /^\/assets\//,
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
  manifestTransforms: [
    (manifestEntries) => {
      const manifest = manifestEntries.map((entry) => {
        if (entry.url.endsWith('.html')) {
          entry.url = entry.url.replace(/\.html$/, '');
          if (entry.url.endsWith('/index')) {
            entry.url = entry.url.replace(/\/index$/, '/');
          }
        }
        return entry;
      });
      
      return { manifest };
    }
  ]
};