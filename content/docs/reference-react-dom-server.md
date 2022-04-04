---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

Objek `ReactDOMServer` memungkinkan Anda untuk me-*render* komponen-komponen ke dalam bentuk *markup* statis. Objek ini digunakan di dalam server Node :

```js
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Ikthisar {#overview}

*Method-method* di bawah ini bisa digunakan di dalam ruang lingkup server dan *browser* :

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

*Method-method* tambahan ini bergantung pada *package* (`stream`) yang hanya **tersedia di server**, dan tidak dapat bekerja di dalam *browser*.

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Referensi {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(elemen)
```

Me-*render* sebuah elemen React menjadi HTML biasa. React akan mengembalikan sebuah *string* HTML. Anda bisa menggunakan *method* ini untuk menghasilkan HTML di server dan mengirim *markup* pada permintaan pertama untuk pemuatan halaman yang lebih cepat dan juga memungkinkan mesin pencarian untuk melakukan *crawling* pada halaman-halaman Anda demi kepentingan SEO.

<<<<<<< HEAD
Jika Anda memanggil [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di dalam sebuah *node* yang sudah memiliki *markup* yang merupakan hasil dari *render* di server, React akan menyimpan *markup* tersebut dan hanya memasang *event handler* pada *markup* tersebut, memungkinkan Anda untuk mendapat performa *first-load experience* yang sangat bagus.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(elemen)
```

Sama seperti [`renderToString`](#rendertostring), bedanya *method* ini tidak membuat atribut DOM tambahan yang digunakan React secara internal, seperti `data-reactroot`. Metode ini bermanfaat jika Anda ingin menggunakan React untuk menghasilkan halaman statis yang simpel, dikarenakan menghapus beberapa atribut tambahan bisa menghemat beberapa *byte*.

<<<<<<< HEAD
Jika Anda berencana untuk menggunakan React di sisi klien untuk membuat *markup* yang interaktif, Anda tidak disarankan untuk menggunakan *method* ini. Sebaiknya, gunakan [`renderToString`](#rendertostring) di sisi server dan gunakan [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di sisi klien.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(elemen)
```

Me-*render* sebuah elemen React menjadi HTML biasa. Mengembalikan sebuah [Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) yang menghasilkan sebuah *string* HTML. Keluaran HTML oleh *stream* ini sama persis dengan keluaran yang dikembalikan oleh [`ReactDOMServer.renderToString`](#rendertostring). Anda dapat menggunakan *method* untuk menghasilkan HTML di server dan mengirim *markup* tersebut pada permintaan pertama untuk pemuatan halaman yang lebih cepat dan juga memungkinkan mesin pencarian untuk melakukan *crawling* pada halaman-halaman Anda demi kepentingan SEO.

<<<<<<< HEAD
Jika Anda memanggil [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di dalam sebuah *node* yang sudah memiliki *markup* yang merupakan hasil dari *render* di server, React akan menyimpan *markup* tersebut dan hanya memasang *event handler* pada *markup* tersebut, memungkinkan Anda untuk mendapat performa *first-load experience* yang sangat bagus.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> Catatan:
>
> Hanya untuk server. API ini tidak bisa digunakan di *browser*.
>
> *Stream* yang dikembalikan oleh *method* ini akan mengembalikan sebuah *byte stream* yang dienkode dalam utf-8. Jika Anda membutuhkan *stream* dalam kode selain utf-8, disarankan untuk mencoba melihat proyek seperti [iconv-lite](https://www.npmjs.com/package/iconv-lite), yang menyediakan *transform streams* untuk *transcoding text*.
* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(elemen)
```

Sama seperti [`renderToNodeStream`](#rendertonodestream), bedanya *method* ini tidak membuat atribut DOM tambahan yang digunakan React secara internal, seperti `data-reactroot`. Metode ini bermanfaat jika Anda ingin menggunakan React untuk menghasilkan halaman statis yang simpel, dikarenakan menghapus beberapa atribut tambahan bisa menghemat beberapa *byte*.
Hasil keluaran HTML yang dikembalikan oleh *stream* ini sama persis dengan yang dikembalikan oleh [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup).

Jika Anda berencana untuk menggunakan React di sisi klien untuk membuat *markup* yang interaktif, Anda tidak disarankan untuk menggunakan *method* ini. Sebaiknya, gunakan [`renderToString`](#rendertostring) di sisi server dan gunakan [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di sisi klien.

<<<<<<< HEAD
> Catatan:
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.

> Note:
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1
>
> Hanya untuk di server. API ini tidak bisa digunakan di *browser*.
>
> *Stream* yang dikembalikan oleh *method* ini akan mengembalikan sebuah *byte stream* yang dikodekan dalam utf-8. Jika Anda membutuhkan *stream* dalam kode selain kode utf-8, disarankan Anda untuk mencoba melihat projek seperti [iconv-lite](https://www.npmjs.com/package/iconv-lite), yang menyediakan *transform streams* untuk *transcoding text*.
