---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

Objek `ReactDOMServer` memungkinkan anda untuk me-*render* komponen-komponen ke dalam bentuk *markup* statis. Objek ini digunakan di dalam *server Node* :

```js
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Ikthisar {#overview}

Metode-metode di bawah ini bisa digunakan di dalam *environment* *server* and *browser* :

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

Metode-metode tambahan ini bergantung pada *package* (`stream`) yang hanya **tersedia di server**, dan tidak dapat bekerja di dalam *browser*.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Referensi {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(elemen)
```

Me-*render* sebuah elemen *React* menjadi *HTML* dasarnya. *React* akan mengembalikan sebuah *string* HTML. Anda bisa menggunakan metode ini untuk menghasilkan *HTML* di *server* dan mengirim *markup* sebagai *request* untuk pemuatan halaman yang lebih cepat dan juga memungkinkan mesin pencarian untuk melakukan *crawling* pada halaman-halaman anda demi kepentingan *SEO*.

Jika anda memanggil [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di dalam sebuah *node* yang sudah memiliki *markup* yang merupakan hasil dari *render* di *server*, *React* akan menyimpan *markup* tersebut dan hanya memasang *event handler* pada *markup* tersebut, memungkinkan anda untuk mendapat performa *first-load experience* yang sangat bagus. 

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(elemen)
```

Serupa dengan [`renderToString`](#rendertostring), kecuali metode ini tidak membuat atribut *DOM* tambahan yang digunakan *React* secara internal, seperti `data-reactroot`. Metode ini bermanfaat jika anda ingin menggunakan *React* untuk menghasilkan halaman statis yang simpel, dikarenakan melepas beberapa atribut tambahan bisa menyimpan beberapa *byte*.

Jika anda berencana untuk menggunakan *React* di dalam *client* untuk membuat *markup* yang interaktif, anda tidak diperkenankan atau disarankan untuk menggunakan metode ini. Sebaiknya, gunakan metode [`renderToString`](#rendertostring) di dalam *server* dan gunakan metode [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di dalam *client*.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(elemen)
```

Me-*render* sebuah elemen *React* menjadi *HTML* dasarnya. Mengembalikan sebuah [Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) yang menghasilkan sebuah *string HTML*. *Output HTML* oleh *stream* ini sama persis dengan hasil atau *output* yang dikembalikan oleh metode [`ReactDOMServer.renderToString`](#rendertostring). Metode ini bisa digunakan untuk menghasilkan *HTML* di *server* dan mengirim *markup* tersebut sebagai *request* untuk pemuatan halaman yang lebih cepat dan juga memungkinkan mesin pencarian untuk melakukan *crawling* pada halaman-halaman anda demi kepentingan *SEO*.

Jika anda memanggil [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di dalam sebuah *node* yang sudah memiliki *markup* yang merupakan hasil dari *render* di *server*, *React* akan menyimpan *markup* tersebut dan hanya memasang *event handler* pada *markup* tersebut, memungkinkan anda untuk mendapat performa *first-load experience* yang sangat bagus.

> Catatan:
>
> Khusus hanya untuk di *server*. *API* ini tidak bisa digunakan di *browser*.
>
> *Stream* yang dikembalikan oleh metode ini akan mengembalikan sebuah *byte stream* yang dikodekan dalam *utf-8*. Jika anda membutuhkan *stream* dalam kode selain kode *utf-8*, disarankan anda untuk mencoba melihat projek seperti [iconv-lite](https://www.npmjs.com/package/iconv-lite), yang menyediakan *transform streams* untuk *transcoding text*.
* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(elemen)
```

Sama seperti [`renderToNodeStream`](#rendertonodestream), kecuali metode ini tidak membuat atribut *DOM* tambahan yang digunakan *React* secara internal, seperti `data-reactroot`. Metode ini bermanfaat jika anda ingin menggunakan *React* untuk menghasilkan halaman statis yang simple, dikarenakan melepas beberapa atribut tambahan bisa menyimpan beberapa *byte*.
Hasil *output HTML* yang dikembalikan oleh *stream* ini sama persis dengan apa yang dikembalikan oleh [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup).

Jika anda berencana untuk menggunakan *React* di *client* untuk membuat *markup* interaktif, anda tidak diperkenankan atau disarankan untuk menggunakan metode ini. Sebaiknya, gunakan metode [`renderToString`](#rendertostring) di dalam *server* dan gunakan metode [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di dalam *client*.

> Catatan:
>
> Khusus hanya untuk di *server*. *API* ini tidak bisa digunakan di *browser*.
>
> *Stream* yang dikembalikan oleh metode ini akan mengembalikan sebuah *byte stream* yang dikodekan dalam *utf-8*. Jika anda membutuhkan *stream* dalam kode selain kode *utf-8*, disarankan anda untuk mencoba melihat projek seperti [iconv-lite](https://www.npmjs.com/package/iconv-lite), yang menyediakan *transform streams* untuk *transcoding text*.
