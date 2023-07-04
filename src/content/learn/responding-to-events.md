---
title: Menanggapi Event
---

<Intro>

React memungkinkan Anda menambahkan *event handler* ke dalam JSX Anda. *Event handler* adalah fungsi-fungsi yang akan dipicu sebagai respons terhadap interaksi seperti mengeklik, mengarahkan kursor, memfokuskan pada input formulir, dan sebagainya.

</Intro>

<YouWillLearn>

* Berbagai cara untuk menulis event handler
* Bagaimana cara mengoper logika penanganan event dari komponen induk
* Bagaimana *event* berpropagasi dan cara menghentikannya

</YouWillLearn>

## Menambahkan event handler {/*adding-event-handlers*/}

Untuk menambahkan *event handler*, pertama-tama Anda akan mendefinisikan sebuah fungsi dan kemudian [mengopernya sebagai *prop*](/learn/passing-props-to-a-component) ke *tag* JSX yang sesuai. Sebagai contoh, berikut adalah sebuah tombol yang belum melakukan apa pun:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

Anda dapat membuatnya menampilkan pesan ketika pengguna mengeklik dengan mengikuti tiga langkah berikut:

1. Deklarasikan sebuah fungsi bernama `handleClick` *di dalam* komponen `Button` Anda.
2. Implementasikan logika di dalam fungsi tersebut (gunakan `alert` untuk menampilkan pesan).
3. Tambahkan `onClick={handleClick}` ke *tag* JSX `<button>`.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Anda mendefinisikan fungsi `handleClick` dan kemudian [mengopernya sebagai *prop*](/learn/passing-props-to-a-component) ke `<button>`. `handleClick` adalah sebuah ***event handler.*** Fungsi *event handler*:

* Biasanya didefinisikan *di dalam* komponen Anda.
* Memiliki nama yang diawali dengan `handle`, diikuti oleh nama *event*.

Berdasarkan konvensi, adalah hal yang umum untuk memberi nama *event* handler dengan format `handle`, diikuti oleh nama *event*. Anda sering melihat contoh seperti `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, dan lain sebagainya.

Sebagai alternatif, Anda juga dapat mendefinisikan *event handler* secara *inline* dalam JSX:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Atau, lebih singkatnya, menggunakan *arrow function*:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

Semua gaya penulisan tersebut equivalen. *Inline event handler* sangat praktis untuk fungsi-fungsi yang singkat.

<Pitfall>

Fungsi yang dioper ke *event handler* harus dioper, bukan dipanggil. Sebagai contoh:

| mengoper fungsi (benar)          | memanggil fungsi (salah)           |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Perbedaannya tipis. Pada contoh pertama, fungsi `handleClick` dioper sebagai *event handler* `onClick`. Ini memberitahu React untuk mengingatnya dan hanya memanggil fungsi tersebut ketika pengguna mengeklik tombolnya.

Pada contoh kedua, tanda `()` di akhir `handleClick()` akan menjalankan fungsi tersebut *langsung* saat [pe-*render*-an](/learn/render-and-commit), tanpa adanya klik. Ini karena JavaScript di dalam *tag* [JSX `{` dan `}`](/learn/javascript-in-jsx-with-curly-braces) dieksekusi secara langsung.

Ketika Anda menuliskan kode secara *inline*, masalah yang sama muncul dengan cara yang berbeda:

| mengirimkan fungsi (benar)              | memanggil fungsi (salah)          |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Mengoper kode *inline* seperti ini tidak akan menjalankan kodenya saat diklik—kode tersebut akan dijalankan setiap kali komponen di-*render*:

```jsx
// *Alert* ini muncul saat komponen me-*render*, bukan saat diklik!
<button onClick={alert('You clicked me!')}>
```

Jika Anda ingin mendefinisikan *event handler* secara *inline*, bungkus ke dalam sebuah fungsi anonim, seperti berikut:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Alih-alih menjalankan kode setiap *render*, ini membuat fungsi untuk dipanggil nanti.

Dalan kedua kasus, yang Anda inginkan adalah mengoper fungsi:

* `<button onClick={handleClick}>` mengoper fungsi `handleClick`.
* `<button onClick={() => alert('...')}>` mengoper fungsi `() => alert('...')`.

[Baca lebih lanjut tentang *arrow functions*.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### Membaca *props* pada *event handler* {/*reading-props-in-event-handlers*/}

Karena *event handler* dideklarasikan di dalam komponen, mereka memiliki akses ke *prop* komponen tersebut. Ini adalah tombol yang, ketika diklik, menampilkan *alert* dengan *prop* `message`-nya.

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Ini membuat kedua tombol tersebut menampilkan dua pesan yang berbeda. Coba untuk mengganti pesan yang dioper kepada mereka.

### Mengoper *event handler* sebagai *prop* {/*passing-event-handlers-as-props*/}

Seringnya, Anda akan ingin komponen induk untuk menentukan *event handler* anaknya. Misalnya pada tombol: bergantung kepada tempat Anda menggunakan komponen `Button`, Anda mungkin ingin untuk menjalankan fungsi berbeda—mungkin satu memutar film dan satu lagi menggungah gambar.

Untuk melakukan ini, oper *prop* yang diterima komponen dari induknya sebagai *event handler* seperti ini:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Di sini, komponen `Toolbar` me-*render* `PlayButton` dan `UploadButton`:

- `PlayButton` mengoper `handlePlayClick` sebagai *prop* `onClick` ke `Button` di dalamnya.
- `UploadButton` mengoper `() => alert('Uploading!')` sebagai *prop* `onClick` ke `Button` di dalamnya.

Terakhir, komponen `Button` Anda menerima *prop* bernama `onClick`. Itu mengoper *prop* tersebut secara langsung ke `<button>` *built-in* peramban dengan `onClick={onClick}`. Ini memberitahukan React untuk memanggil fungsi yang dioper pada saat klik.

Jika anda menggunakan sebuah [*design system*](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), adalah hal yang umum untuk komponen seperti tombol untuk mengandung *styling* tetapi tidak menentukan perilaku. Alih-alih seperti itu, komponen seperti `PlayButton` dan `UploadButton` akan mengoper *event handler* ke bawah.

### Naming event handler props {/*naming-event-handler-props*/}

Komponen *built-in* seperti `<button>` dan `<div>` hanya mendukung [nama *event* peramban (*browser event names*)](/reference/react-dom/components/common#common-props) seperti `onClick`. Namun, ketika Anda membuat komponen Anda sendiri, Anda dapat menamakan *prop event handler*-nya sesuka Anda.

Berdasarkan konvensi, *prop event handler* harus diawali dengan `on`, diikuti dengan huruf kapital.

Misalnya, *prop* `onClick` milk komponen `Button` bisa saja dinamakan `onSmash`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Pada contoh ini, `<button onClick={onSmash}>` menunjukkan bahwa `<button>` (huruf kecil) milik peramban masih membutuhkan *prop* bernama `onClick`, tetapi *prop* yang diterima oleh komponen kustom `Button` dapat diberi nama sesuka Anda!

Saat komponen Anda mendukung beberapa interaksi, Anda mungkin memberi nama *prop event handler* untuk konsep spesifik terhadap aplikasi. Misalnya, komponen `Toolbar` ini menerima *event handler* `onPlayMovie` dan `onUploadImage`.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Perhatikan bagaimana komponen `App` tidak perlu tahu *apa* yang `Toolbar` akan lakukan dengan `onPlayMovie` atau `onUploadImage`. Itu adalah detail implementasi dari `Toolbar`. Di sini, `Toolbar` mengoper mereka sebagai *handler* `onClick` kepada `Button`-nya, tetapi itu bisa saja memicu mereka dengan *keyboard shortcut*. Memberi nama *prop* berdasarkan interaksi spesifik aplikasi seperti `onPlayMovie` memberikan Anda fleksibilitas untuk mengganti bagaimana mereka digunakan nanti.
  
<Note>

Pastikan bahwa Anda menggunakan *tag* HTML yang sesuai untuk *event handler* Anda. Misalnya, untuk meng-*handle* klik, gunakan [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) alih-alih `<div onClick={handleClick}>`. Menggunakan `<button>` asli milik peramban memungkinkan perilaku peramban *built-in* seperti navigasi *keyboard*. Jika Anda tidak suka *styling* bawaan peramban dari sebuah tombol dan ingin membuatnya tampil lebih seperti tautan atau elemen UI lainnya, Anda dapat mengubahnya dengan CSS. [Pelajari lebih lanjut tentang menulis *markup* yang aksesibel.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

</Note>

## Propagasi *event* {/*event-propagation*/}

*Event handler* akan menangkap *event* dari anak mana pun yang mungkin dimiliki oleh komponen Anda. Kita sebut bahwa sebuah event "menggelembung" (*bubbles*) atau "berpropagasi" ke atas pohon: mulai dari tempat *event* terjadi, dan bergerak ke atas pada pohon.

`<div>` ini mengandung dua tombol. Keduanya, baik `<div>` *maupun* setiap tombol masing-masing memiliki *handler* `onClick` mereka sendiri. *Handler* mana yang Anda pikir akan dijalankan saat Anda mengeklik sebuah tombol?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Jika Anda mengeklik salah satu tombol, `onClick` milik tombol tersebut akan berjalan terlebih dahulu, diikuti dengan `onClick` milik `<div>` induknya. Jadi, dua pesan akan muncul. Jika Anda mengeklik *toolbar*-nya, hanya `onClick` milik `<div>` induknya yang akan berjalan.

<Pitfall>

Semua *event* berpropagasi di React kecuali `onScroll`, yang hanya bekerja pada *tag* JSX yang tersemat.

</Pitfall>

### Menghentikan propagasi {/*stopping-propagation*/}

*Event handler* menerima sebuah **objek *event*** sebagai satu-satunya argumen. Berdasarkan konvensi, objek tersebut biasanya disebut `e`, yang merupakan kepanjangan dari "*event*". Anda dapat menggunakan objek ini untuk membaca informasi tentang *event* teresbut.

Objek *event* tersebut juga dapat memungkinkan Anda untuk menghentikan propagasi. Jika anda ingin mencegah sebuah *event* untuk mencapai komponen induknya, Anda harus memanggil `e.stopPropagation()` seperti apa yang komponen `Button` ini lakukan:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Saat Anda mengeklik pada sebuah tombol:

1. React memanggil *handler* `onClick` yang dioper ke `<button>`. 
2. *Handler* tersebut, didefinisikan di dalam `Button`, melakukan hal berikut:
   * Memanggil `e.stopPropagation()`, mencegah *event*-nya untuk menggelembung lebih lanjut.
   * Memanggil fungsi `onClick`, yang merupakan *prop* yang dioper dari komponen `Toolbar`.
3. Fungsi tersebut, didefinisikan di dalam komponen `Toolbar`, menampilkan *alert* dari tombol tersebut.
4. Karena propagasinya dihentikan, *handler* `onClick` milik `<div>` induknya *tidak* berjalan.

Sebagai hasil dari `e.stopPropagation()`, mengeklik pada tombolnya sekarang hanya akan menampilkan satu *alert* (dari `<button>`) alih-alih keduanya (dari `<button>` dan `<div>` *toolbar* induk). Mengeklik tombol tidak sama dengan mengeklik *toolbar* di sekitarnya, maka menghentikan propagasi masuk akal untuk UI ini.

<DeepDive>

#### *Event* fase *capture* {/*capture-phase-events*/}

Dalam kasus yang jarang terjadi, Anda mungkin butuh untuk menangkap semua *event* pada elemen anak, *walaupun mereka menghentikan propagasi*. Misalnya, mungkin Anda ingin mengelog setiap klik untuk analitik, bagaimanapun logika propagasinya. Anda dapat melakukan ini dengan menambahkan `Capture` pada akhir nama *event* tersebut:

```js
<div onClickCapture={() => { /* ini berjalan terlebih dahulu */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Setiap *event* berpropagasi dalam tiga fase: 

1. Bergerak ke atas, meamnggil semua *handler* `onClickCapture`.
2. Menjalankan *handler* `onClick` milik elemen yang diklik. 
3. Bergerak ke atas, memanggil semua *handler* `onClick`.

*Event capture* berguna untuk kode seperti perute atau analitik, tetapi Anda mungkin tidak akan menggunakannya dalam kode aplikasi.

</DeepDive>

### Mengoper *handler* sebagai alternatif terhadap propagasi {/*passing-handlers-as-alternative-to-propagation*/}

Perhatikan bagaimana *handler* klik ini menjalankan sebuah baris kode *lalu* memanggil *prop* `onClick` yang dioper dari induknya:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Anda juga dapat menambahkan kode kepada *handler* ini sebelum memanggil *event handler* `onClick` induknya. Pola ini menyediakan sebuah *alternatif* terhadap propagasi. Ini membiarkan komponen anaknya meng-*handle* *event* tersebut, sambil juga membiarkan komponen induknya menentukan beberapa perilaku tambahan. Tidak seperti propagasi, ini tidak otomatis. Namun, manfaat dari pola ini adalah Anda dapat dengan jelas mengikuti rantai kode yang dijalankan sebagai hasil dari suatu *event*.

Jika Anda bergantung kepada propagasi dan sulit bagi Anda untuk menelusuri *handler* mana yang dijalankan dan kenapa, coba pendekatan ini sebagai gantinya.

### Preventing default behavior {/*preventing-default-behavior*/}

Beberapa *event* peramban memiliki perilaku bawaan yang terasosiasi dengan mereka. Misalnya, *event submit* `<form>`, yang terjadi ketika sebuah tombol di dalamnya diklik, akan memuat ulang seluruh halaman secara bawaan:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Anda dapat memanggil `e.preventDefault()` pada objek *event* untuk menghentikan ini terjadi:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Jangan tertukar antara `e.stopPropagation()` dan `e.preventDefault()`. Keduanya berguna, tetapi tidak berkaitan:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) menghentikan *event handler* tersemat pada *tag* di atasnya untuk terpanggil.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) mencegah perilaku bawaan peramban untuk beberapa *event* yang memilikinya.

## Bisakan *event handler* memiliki efek samping? {/*can-event-handlers-have-side-effects*/}

Tentu saja! *Event handler* adalah tempat terbaik untuk efek samping.

Tidak seperti me-*render* fungsi, *event handler* tidak perlu menjadi [murni (*pure*)](/learn/keeping-components-pure), maka ini adalah tempat yang bagus untuk *mengubah* sesuatu—misalnya, mengubah sebuah nilai dari masukan sebagai tanggapan dari ketikan, atau mengubah sebuah daftar sebagai tanggapan dari penekanan tombol. Namun, untuk mengubah beberapa informasi, Anda terlebih dulu memerlukan suatu cara untuk menyimpannya. Dalam React, ini dilakukan dengan menggunakan [*state*, memori dari komponen.](/learn/state-a-components-memory) Anda akan mempelajari segala hal tentang itu pada halaman berikutnya.

<Recap>

* Anda dapat meng-*handle* *event* dengan mengoper fungsi sebagai prop ke elemen seperti `<button>`.
* *Event handler* harus dioper, **tidak dipanggil!** `onClick={handleClick}`, bukan `onClick={handleClick()}`.
* Anda dapat mendefinisikan sebuah fungsi *event handler* secara terpisah atau *inline*.
* *Event handler* didefinisikan di dalam sebuah komponen, maka mereka dapat mengakses *prop*.
* Anda dapat mendeklarasikan sebuah *event handler* dalam sebuah induk dan mengopernya sebagai *prop* ke suatu anak.
* Anda dapat mendefinisikan *prop event handler* Anda sendiri dengan nama yang spesifik terhadap aplikasi.
* *Event* berpropagasi ke atas. Panggil `e.stopPropagation()` pada argumen pertama untuk mencegah hal tersebut.
* *Event* dapat memiliki perilaku bawaan peramban yang tidak diinginkan. Panggil `e.preventDefault()` untuk mencegah hal tersebut.
* Secara eksplisit memanggil sebuah *prop event handler* dari *handler* anak adalah alternatif yang bagus terhadap propagasi.

</Recap>



<Challenges>

#### Memperbaiki *event handler* {/*fix-an-event-handler*/}

Mengeklik tombol ini seharusnya mengganti latar belakang halaman dari putih ke hitam dan sebaliknya. Namun, tidak ada yang terjadi saat Anda mengekliknya. Perbaiki masalahnya. (Jangan khawatirkan logika di dalah `handleClick`—bagian itu sudah benar.)

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

Masalahnya adalah `<button onClick={handleClick()}>` _memanggil_ fungsi `handleClick` saat me-*render* alih-alih _mengopernya_. Menghapus pemanggilan `()` menjadi `<button onClick={handleClick}>` memperbaiki masalahnya:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

Selain itu, Anda juga bisa membungkus panggilan tersebut ke dalam suatu fungsi lain, seperti `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Menghubungkan *events* {/*wire-up-the-events*/}

Komponen `ColorSwitch` ini me-*render* sebuah tombol. Tombol tersebut seharusnya mengganti warna halaman. Hubungkan tombol tersebut dengan *prop event handler* `onChangeColor` yang diterima dari induknya sehingga mengeklik tombolnya mengubah warnanya.

Setelah Anda melakukan ini, perhatikan bahwa mengeklik tombolnya juga menaikkan penghitung klik pada halaman. Kolega Anda yang menulis komponen induknya bersikeras bahwa `onChangeColor` tidak menaikkan penghitung apa pun. Hal lain apa yang mungkin sedang terjadi? Perbaiki supaya mengeklik tombolnya *hanya* mengubah warnanya, dan *tidak* menaikkan penghitungnya.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

Pertama, Anda perlu menambahkan *event handler*, seperti `<button onClick={onChangeColor}>`.

Namun, ini menambahkan masalah kenaikan penghitung. Jika `onChangeColor` tidak melakukan ini, seperti yang kolega Anda tegaskan, masalahnya adalah *event* ini berpropagasi ke atas, dan suatu *handler* di atas melakukan hal ini. Untuk memperbaikinya, Anda harus menghentikan propagasi. Namun, jangan lupa bahwa Anda masih harus memanggil `onChangeColor`.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
