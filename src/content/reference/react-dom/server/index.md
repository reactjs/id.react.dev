---
title: API React DOM Server
---

<Intro>

<<<<<<< HEAD
API `react-dom/server` memungkinkan Anda me-*render* komponen React menjadi HTML di *server*. API ini hanya digunakan di *server* pada *top level* aplikasi Anda untuk menghasilkan HTML awal. Kemungkinan [*framework*](/learn/start-a-new-react-project#production-grade-react-frameworks) akan memanggilnya untuk Anda. Sebagian besar komponen Anda tidak perlu mengimpor atau menggunakannya.
=======
The `react-dom/server` APIs let you server-side render React components to HTML. These APIs are only used on the server at the top level of your app to generate the initial HTML. A [framework](/learn/start-a-new-react-project#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> f9e2c1396769bb5da87db60f9ff03683d18711e2

</Intro>

---

<<<<<<< HEAD
## API *Server* untuk Node.js *Stream* {/*server-apis-for-nodejs-streams*/}

Beberapa *method* ini hanya tersedia di lingkungan dengan [Node.js *Stream*:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) me-*render* sebuah React *tree* ke dalam [Node.js *Stream*](https://nodejs.org/api/stream.html) yang *pipeable*.

---

## API *Server* untuk *Web Stream* {/*server-apis-for-web-streams*/}
=======
## Server APIs for Web Streams {/*server-apis-for-web-streams*/}
>>>>>>> f9e2c1396769bb5da87db60f9ff03683d18711e2

Beberapa *method* ini hanya tersedia di lingkungan dengan [*Web Stream*](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), yang mencakup peramban, Deno, dan beberapa *runtime* modern:

<<<<<<< HEAD
* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) me-*render* sebuah React *tree* ke dalam [*Readable Web Stream*.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
=======
* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) renders a React tree to a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* [`resume`](/reference/react-dom/server/renderToPipeableStream) resumes [`prerender`](/reference/react-dom/static/prerender) to a [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).


<Note>

Node.js also includes these methods for compatibility, but they are not recommended due to worse performance. Use the [dedicated Node.js APIs](#server-apis-for-nodejs-streams) instead.

</Note>
---

## Server APIs for Node.js Streams {/*server-apis-for-nodejs-streams*/}

These methods are only available in the environments with [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renders a React tree to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)
* [`resumeToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) resumes [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)
>>>>>>> f9e2c1396769bb5da87db60f9ff03683d18711e2

---

## API Server Lama untuk lingkungan non-streaming {/*legacy-server-apis-for-non-streaming-environments*/}

Beberapa *method* ini dapat digunakan di lingkungan yang tidak mendukung *stream*:

* [`renderToString`](/reference/react-dom/server/renderToString) me-*render* sebuah React *tree* ke dalam *string*.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) me-*render* sebuah React *tree* yang noninteraktif ke dalam *string*.

Mereka memiliki fungsionalitas yang terbatas dibandingkan dengan API streaming.
