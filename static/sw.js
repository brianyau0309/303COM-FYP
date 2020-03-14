var CACHE_NAME = 'fyp-v1'
var CACHED_URLS = [
  // CSS
  '/static/css/student.css',
  '/static/css/daypicker.css',
  '/static/css/calendar.css',
  // JS
  '/static/js/student.js',
  '/static/js/vendors~student.js',
  '/static/js/canvasjs.min.js',
  // external
  '//cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js',
  // Image
  '/static/images/icons/icon-72x72.png',
  '/static/images/icons/icon-96x96.png',
  '/static/images/icons/icon-144x144.png',
  '/static/images/icons/icon-128x128.png',
  '/static/images/icons/icon-192x192.png',
  '/static/images/icons/icon-192x192.jpg',
  '/static/images/icons/icon-384x384.png',
  '/static/images/icons/icon-512x512.png',
  '/static/images/toggle.png',
  // Basic
  'https://img.icons8.com/flat_round/64/000000/back--v1.png',
  'https://img.icons8.com/flat_round/64/000000/plus.png',
  'https://img.icons8.com/flat_round/64/000000/minus.png',
  // For Nav
  'https://img.icons8.com/dusk/64/000000/course-assign.png',
  'https://img.icons8.com/dusk/64/000000/why-us-male.png',
  'https://img.icons8.com/dusk/64/000000/class.png',
  'https://img.icons8.com/dusk/64/000000/small-smile.png',
  'https://img.icons8.com/dusk/64/000000/appointment-reminders.png',
  'https://img.icons8.com/dusk/64/000000/logout-rounded-left.png',
  // For Comment
  'https://img.icons8.com/emoji/48/000000/star-emoji.png',
  'https://img.icons8.com/color/48/000000/star--v1.png',
  // For TextEditor
  'https://img.icons8.com/metro/26/000000/bold.png',
  'https://img.icons8.com/metro/26/000000/italic.png',
  'https://img.icons8.com/metro/26/000000/underline.png',
  'https://img.icons8.com/metro/26/000000/strikethrough.png',
  'https://img.icons8.com/metro/26/000000/align-left.png',
  'https://img.icons8.com/metro/26/000000/align-center.png',
  'https://img.icons8.com/metro/26/000000/align-right.png',
  'https://img.icons8.com/ios-glyphs/30/000000/subscript.png',
  'https://img.icons8.com/material-sharp/24/000000/list.png',
  'https://img.icons8.com/metro/26/000000/numbered-list.png'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHED_URLS)
    })
  )
})

self.addEventListener('fetch', event => {
  var requestURL = new URL(event.request.url)
  if (CACHED_URLS.includes(requestURL.href) || CACHED_URLS.includes(requestURL.pathname)) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request)
        })
      })
    )
  }
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (CACHED_URLS !== cacheName && cacheName.startsWith("fyp")) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener('push', event => {
  var message = event.data.text()
  self.registration.showNotification("New Courses!", {
    body: message,
    icon: 'https://briyana.ddns.net/static/images/icons/icon-192x192.jpg',
    url: 'https://briyana.ddns.net',
    actions: [
      {action: 'Go', title: 'Go'}
    ]
  })
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  if (event.action === 'Go') {
    clients.openWindow('https://briyana.ddns.net/courses')
  }
})
