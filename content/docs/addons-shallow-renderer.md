---
id: shallow-renderer
title: Shallow Renderer
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**Cara Import**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 dengan npm
```

## Ikhtisar {#overview}

Ketika menulis _unit tests_ untuk React, _shallow rendering_ akan sangat membantu Anda. _Shallow rendering_ memungkinkan Anda untuk melakukan _render_ suatu komponen “sedalam satu level” dan melakukan pengujian dari hasil kembalian _render method_ komponen tersebut. Hasil _render method_ tidak akan memedulikan sifat (_behavior_) dari komponen-komponen yang ada di dalamnya, karena komponen-komponen tersebut tidak ter-_render_. Proses ini tidak memerlukan DOM.

Sebagai contoh, jika Anda memiliki komponen seperti berikut:

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Judul</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

Kemudian Anda dapat melakukan pengujian:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// pada pengujian Anda:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Judul</span>,
  <Subcomponent foo="bar" />
]);
```

Saat ini _shallow testing_ masih memiliki beberapa keterbatasan, salah satunya belum mendukung _refs_.

> Catatan:
>
> Kami juga menyarankan Anda untuk membaca [API Shallow Rendering](http://airbnb.io/enzyme/docs/api/shallow.html) oleh Enzyme yang menyediakan _API_ tingkat atas (_higher-level API_) yang lebih baik untuk fungsionalitas serupa.


## Referensi {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

Anda dapat membayangkan `shallowRenderer` sebagai “tempat” untuk me-_render_ suatu komponen yang sedang Anda uji, juga sebagai tempat di mana Anda bisa mengekstrak keluaran dari komponen tersebut.

<<<<<<< HEAD
`shallowRenderer.render()` merupakan _method_ yang serupa dengan [`ReactDOM.render()`](/docs/react-dom.html#render) tetapi tidak membutuhkan DOM dan hanya melakukan _render_ sedalam satu level. Hal tersebut membuat Anda dapat menguji suatu komponen secara terisolasi, tidak menghiraukan implementasi komponen lain yang ada di dalamnya.
=======
`shallowRenderer.render()` is similar to [`root.render()`](/docs/react-dom-client.html#createroot) but it doesn't require DOM and only renders a single level deep. This means you can test components isolated from how their children are implemented.
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

Setelah memanggil _method_ `shallowRenderer.render()` , Anda dapat menggunakan `shallowRenderer.getRenderOutput()` untuk memperoleh keluaran dari komponen yang di-_render_ menggunakan _shallow renderer_.

Kemudian, Anda dapat mulai melakukan pengujian dari hasil keluaran yang telah diperoleh.
