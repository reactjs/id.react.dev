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

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Referensi {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(elemen)
```

Me-*render* sebuah elemen React menjadi HTML biasa. React akan mengembalikan sebuah *string* HTML. Anda bisa menggunakan *method* ini untuk menghasilkan HTML di server dan mengirim *markup* pada permintaan pertama untuk pemuatan halaman yang lebih cepat dan juga memungkinkan mesin pencarian untuk melakukan *crawling* pada halaman-halaman Anda demi kepentingan SEO.

Jika Anda memanggil [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di dalam sebuah *node* yang sudah memiliki *markup* yang merupakan hasil dari *render* di server, React akan menyimpan *markup* tersebut dan hanya memasang *event handler* pada *markup* tersebut, memungkinkan Anda untuk mendapat performa *first-load experience* yang sangat bagus.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(elemen)
```

Sama seperti [`renderToString`](#rendertostring), bedanya *method* ini tidak membuat atribut DOM tambahan yang digunakan React secara internal, seperti `data-reactroot`. Metode ini bermanfaat jika Anda ingin menggunakan React untuk menghasilkan halaman statis yang simpel, dikarenakan menghapus beberapa atribut tambahan bisa menghemat beberapa *byte*.

Jika Anda berencana untuk menggunakan React di sisi klien untuk membuat *markup* yang interaktif, Anda tidak disarankan untuk menggunakan *method* ini. Sebaiknya, gunakan [`renderToString`](#rendertostring) di sisi server dan gunakan [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di sisi klien.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(elemen)
```

Me-*render* sebuah elemen React menjadi HTML biasa. Mengembalikan sebuah [Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) yang menghasilkan sebuah *string* HTML. Keluaran HTML oleh *stream* ini sama persis dengan keluaran yang dikembalikan oleh [`ReactDOMServer.renderToString`](#rendertostring). Anda dapat menggunakan *method* untuk menghasilkan HTML di server dan mengirim *markup* tersebut pada permintaan pertama untuk pemuatan halaman yang lebih cepat dan juga memungkinkan mesin pencarian untuk melakukan *crawling* pada halaman-halaman Anda demi kepentingan SEO.

Jika Anda memanggil [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) di dalam sebuah *node* yang sudah memiliki *markup* yang merupakan hasil dari *render* di server, React akan menyimpan *markup* tersebut dan hanya memasang *event handler* pada *markup* tersebut, memungkinkan Anda untuk mendapat performa *first-load experience* yang sangat bagus.

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

> Catatan:
>
> Hanya untuk di server. API ini tidak bisa digunakan di *browser*.
>
> *Stream* yang dikembalikan oleh *method* ini akan mengembalikan sebuah *byte stream* yang dikodekan dalam utf-8. Jika Anda membutuhkan *stream* dalam kode selain kode utf-8, disarankan Anda untuk mencoba melihat projek seperti [iconv-lite](https://www.npmjs.com/package/iconv-lite), yang menyediakan *transform streams* untuk *transcoding text*.
