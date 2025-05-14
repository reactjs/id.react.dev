---
title: API React DOM Server
---

<Intro>

<<<<<<< HEAD
API `react-dom/server` memungkinkan Anda me-*render* komponen React menjadi HTML di *server*. API ini hanya digunakan di *server* pada *top level* aplikasi Anda untuk menghasilkan HTML awal. React DOM Server dapat dipanggil dengan menggunakan [*framework*](/learn/start-a-new-react-project#production-grade-react-frameworks). Sebagian besar komponen Anda tidak perlu mengimpor atau menggunakannya.
=======
The `react-dom/server` APIs let you server-side render React components to HTML. These APIs are only used on the server at the top level of your app to generate the initial HTML. A [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

</Intro>

---

## API *Server* untuk Node.js *Stream* {/*server-apis-for-nodejs-streams*/}

Beberapa *method* ini hanya tersedia di lingkungan dengan [Node.js *Stream*:](https://nodejs.org/api/stream.html)

<<<<<<< HEAD
* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) me-*render* sebuah React *tree* ke dalam [Node.js *Stream*](https://nodejs.org/api/stream.html) yang *pipeable*.
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream) me-*render* sebuah React *tree* noninteraktif ke dalam [Node.js *Readable Stream*.](https://nodejs.org/api/stream.html#readable-streams)
=======
* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renders a React tree to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

---

## API *Server* untuk *Web Stream* {/*server-apis-for-web-streams*/}

Beberapa *method* ini hanya tersedia di lingkungan dengan [*Web Stream*](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), yang mencakup peramban, Deno, dan beberapa *runtime* modern:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) me-*render* sebuah React *tree* ke dalam [*Readable Web Stream*.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

<<<<<<< HEAD
## API Server untuk lingkungan non-streaming {/*server-apis-for-non-streaming-environments*/}
=======
## Legacy Server APIs for non-streaming environments {/*legacy-server-apis-for-non-streaming-environments*/}
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

Beberapa *method* ini dapat digunakan di lingkungan yang tidak mendukung *stream*:

* [`renderToString`](/reference/react-dom/server/renderToString) me-*render* sebuah React *tree* ke dalam *string*.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) me-*render* sebuah React *tree* yang noninteraktif ke dalam *string*.

<<<<<<< HEAD
Beberapa *method* tersebut memiliki fungsionalitas terbatas dibandingkan dengan API *streaming*.

---

## API server yang sudah tidak digunakan {/*deprecated-server-apis*/}

<Deprecated>

API ini akan dihapus pada versi utama React di masa depan.

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream) me-*render* sebuah React *tree* ke dalam [Node.js *Readable stream*.](https://nodejs.org/api/stream.html#readable-streams) (*Deprecated*.)
=======
They have limited functionality compared to the streaming APIs.
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3
