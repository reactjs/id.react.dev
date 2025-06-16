---
title: API React DOM Server
---

<Intro>

API `react-dom/server` memungkinkan Anda me-*render* komponen React menjadi HTML di *server*. API ini hanya digunakan di *server* pada *top level* aplikasi Anda untuk menghasilkan HTML awal. Kemungkinan [*framework*](/learn/start-a-new-react-project#production-grade-react-frameworks) akan memanggilnya untuk Anda. Sebagian besar komponen Anda tidak perlu mengimpor atau menggunakannya.

</Intro>

---

## API *Server* untuk Node.js *Stream* {/*server-apis-for-nodejs-streams*/}

Beberapa *method* ini hanya tersedia di lingkungan dengan [Node.js *Stream*:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) me-*render* sebuah React *tree* ke dalam [Node.js *Stream*](https://nodejs.org/api/stream.html) yang *pipeable*.

---

## API *Server* untuk *Web Stream* {/*server-apis-for-web-streams*/}

Beberapa *method* ini hanya tersedia di lingkungan dengan [*Web Stream*](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), yang mencakup peramban, Deno, dan beberapa *runtime* modern:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) me-*render* sebuah React *tree* ke dalam [*Readable Web Stream*.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## API Server Lama untuk lingkungan non-streaming {/*legacy-server-apis-for-non-streaming-environments*/}

Beberapa *method* ini dapat digunakan di lingkungan yang tidak mendukung *stream*:

* [`renderToString`](/reference/react-dom/server/renderToString) me-*render* sebuah React *tree* ke dalam *string*.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) me-*render* sebuah React *tree* yang noninteraktif ke dalam *string*.

Mereka memiliki fungsionalitas yang terbatas dibandingkan dengan API streaming.
