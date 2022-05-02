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
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Ikthisar {#overview}

<<<<<<< HEAD
*Method-method* di bawah ini bisa digunakan di dalam ruang lingkup server dan *browser* :
=======
These methods are only available in the **environments with [Node.js Streams](https://nodejs.dev/learn/nodejs-streams):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

These methods are only available in the **environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (this includes browsers, Deno, and some modern edge runtimes):

- [`renderToReadableStream()`](#rendertoreadablestream)

The following methods can be used in the environments that don't support streams:
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

<<<<<<< HEAD
*Method-method* tambahan ini bergantung pada *package* (`stream`) yang hanya **tersedia di server**, dan tidak dapat bekerja di dalam *browser*.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Referensi {#reference}
=======
## Reference {#reference}
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
<<<<<<< HEAD
ReactDOMServer.renderToString(elemen)
```

Me-*render* sebuah elemen React menjadi HTML biasa. React akan mengembalikan sebuah *string* HTML. Anda bisa menggunakan *method* ini untuk menghasilkan HTML di server dan mengirim *markup* pada permintaan pertama untuk pemuatan halaman yang lebih cepat dan juga memungkinkan mesin pencarian untuk melakukan *crawling* pada halaman-halaman Anda demi kepentingan SEO.

Jika Anda memanggil [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di dalam sebuah *node* yang sudah memiliki *markup* yang merupakan hasil dari *render* di server, React akan menyimpan *markup* tersebut dan hanya memasang *event handler* pada *markup* tersebut, memungkinkan Anda untuk mendapat performa *first-load experience* yang sangat bagus.
=======
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a stream with a `pipe(res)` method to pipe the output and `abort()` to abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" via inline `<script>` tags later. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Note:
>
> This is a Node.js-specific API. Environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), like Deno and modern edge runtimes, should use [`renderToReadableStream`](#rendertoreadablestream) instead.
>
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
<<<<<<< HEAD
ReactDOMServer.renderToStaticMarkup(elemen)
```

Sama seperti [`renderToString`](#rendertostring), bedanya *method* ini tidak membuat atribut DOM tambahan yang digunakan React secara internal, seperti `data-reactroot`. Metode ini bermanfaat jika Anda ingin menggunakan React untuk menghasilkan halaman statis yang simpel, dikarenakan menghapus beberapa atribut tambahan bisa menghemat beberapa *byte*.

Jika Anda berencana untuk menggunakan React di sisi klien untuk membuat *markup* yang interaktif, Anda tidak disarankan untuk menggunakan *method* ini. Sebaiknya, gunakan [`renderToString`](#rendertostring) di sisi server dan gunakan [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di sisi klien.
=======
ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a Promise that resolves to a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
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

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(elemen)
```

<<<<<<< HEAD
Me-*render* sebuah elemen React menjadi HTML biasa. Mengembalikan sebuah [Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) yang menghasilkan sebuah *string* HTML. Keluaran HTML oleh *stream* ini sama persis dengan keluaran yang dikembalikan oleh [`ReactDOMServer.renderToString`](#rendertostring). Anda dapat menggunakan *method* untuk menghasilkan HTML di server dan mengirim *markup* tersebut pada permintaan pertama untuk pemuatan halaman yang lebih cepat dan juga memungkinkan mesin pencarian untuk melakukan *crawling* pada halaman-halaman Anda demi kepentingan SEO.

Jika Anda memanggil [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di dalam sebuah *node* yang sudah memiliki *markup* yang merupakan hasil dari *render* di server, React akan menyimpan *markup* tersebut dan hanya memasang *event handler* pada *markup* tersebut, memungkinkan Anda untuk mendapat performa *first-load experience* yang sangat bagus.
=======
Render a React element to its initial HTML. Returns a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

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
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
>
> Hanya untuk di server. API ini tidak bisa digunakan di *browser*.
>
<<<<<<< HEAD
> *Stream* yang dikembalikan oleh *method* ini akan mengembalikan sebuah *byte stream* yang dikodekan dalam utf-8. Jika Anda membutuhkan *stream* dalam kode selain kode utf-8, disarankan Anda untuk mencoba melihat projek seperti [iconv-lite](https://www.npmjs.com/package/iconv-lite), yang menyediakan *transform streams* untuk *transcoding text*.
=======
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Render a React element to its initial HTML. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note
>
> This API has limited Suspense support and does not support streaming.
>
> On the server, it is recommended to use either [`renderToPipeableStream`](#rendertopipeablestream) (for Node.js) or [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) instead.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
