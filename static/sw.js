var cacheName = 'fyp-v1'

self.addEventListener('install', event => {
  event.waitUntil(
    console.log('installing service worker')
  );
});

self.addEventListener('fetch', event => {
  console.log('Handling fetch event for', event.request.url);
})
