---
title: useRef
---

<Intro>

`useRef` adalah sebuah React Hook yang memungkinkan Anda mereferensikan sebuah nilai yang tidak diperlukan untuk rendering.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Panggil `useRef` di tingkat atas komponen Anda untuk mendeklarasikan sebuah [ref.](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameters {/*parameters*/}

* `initialValue`: Nilai yang Anda inginkan untuk properti `current` objek ref pada awalnya. Nilai ini dapat berupa nilai dari jenis apa pun. Argumen ini akan diabaikan setelah render awal.

#### Returns {/*returns*/}

`useRef` mengembalikan sebuah objek dengan satu properti:

* `current`: Awalnya, ini diatur ke `initialValue` yang telah Anda oper. Anda dapat mengaturnya ke nilai yang lain. Jika Anda mengoper objek ref ke React sebagai sebuah atribut `ref` ke node JSX, React akan menyetelkan properti `current`-nya.

Pada render berikutnya, `useRef` akan mengembalikan objek yang sama.

#### Perhatian {/*caveats*/}

* Anda dapat mengubah properti `ref.current`. Tidak seperti state, properti ini tidak dapat diubah. Namun, jika properti ini menyimpan objek yang digunakan untuk rendering (misalnya, sebuah bagian dari state Anda), maka Anda tidak boleh mengubah objek tersebut.
* Ketika Anda mengubah properti `ref.current`, React tidak me-render ulang komponen Anda. React tidak mengetahui kapan Anda mengubahnya karena ref adalah objek JavaScript biasa.
* Jangan menulis _atau membaca_ `ref.current` selama proses rendering, kecuali untuk [inisialisasi.](#avoiding-recreating-the-ref-contents) Hal ini membuat perilaku komponen Anda tidak dapat diprediksi.
* Dalam Strict Mode, React akan **memanggil fungsi komponen Anda dua kali** untuk [membantu Anda menemukan bug yang tidak disengaja.](#my-initializer-or-updater-function-runs-twice) Ini adalah perilaku khusus development dan tidak mempengaruhi produksi. Setiap objek ref akan dibuat dua kali, tetapi salah satu versi akan dibuang. Jika fungsi komponen Anda murni (sebagaimana mestinya), hal ini seharusnya tidak mempengaruhi perilaku.

---

## Penggunaan {/*usage*/}

### Mereferensikan sebuah nilai dengan sebuah ref {/*referencing-a-value-with-a-ref*/}

Panggil `useRef` di tingkat atas komponen Anda untuk mendeklarasikan satu atau lebih [ref.](/learn/referencing-values-with-refs)

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` mengembalikan sebuah <CodeStep step={1}>objek ref</CodeStep> dengan satu <CodeStep step={2}>properti `current`</CodeStep> pada awalnya diatur ke <CodeStep step={3}>initialValue</CodeStep> yang Anda sediakan.

Pada render berikutnya, `useRef` akan mengembalikan objek yang sama. Anda dapat mengubah properti `current` untuk menyimpan informasi dan membacanya nanti. Hal ini mungkin mengingatkan Anda pada [state](/reference/react/useState), tetapi ada sebuah perbedaan penting.

**Mengubah sebuah ref tidak memicu render ulang.** Ini berarti ref sangat cocok untuk menyimpan informasi yang tidak memengaruhi keluaran visual komponen Anda. Sebagai contoh, jika Anda perlu menyimpan sebuah [ID interval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) dan mengambilnya nanti, Anda bisa menaruhnya di dalam ref. Untuk pembaruan nilai di dalam ref, Anda perlu mengubah secara manual nilai <CodeStep step={2}>properti `current`</CodeStep>:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

Nantinya, Anda dapat membaca ID interval tersebut dari ref sehingga Anda dapat memanggil [pembersihan interval tersebut](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Dengan menggunakan ref, Anda memastikan bahwa:

- Anda dapat **menyimpan informasi** di antara render ulang (tidak seperti variabel biasa, yang disetel ulang pada setiap render).
- Mengubahnya **tidak memicu sebuah render ulang** (tidak seperti variabel state, yang memicu sebuah render ulang).
- **Informasinya bersifat lokal** untuk setiap salinan komponen Anda (tidak seperti variabel di luar, yang dibagikan).

Mengubah sebuah ref tidak akan memicu sebuah render ulang, jadi ref tidak sesuai untuk menyimpan informasi yang ingin Anda tampilkan di layar. Gunakan state untuk itu. Baca lebih lanjut tentang [memilih antara `useRef` dan `useState`.](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="Contoh mereferensikan sebuah nilai dengan useRef" titleId="examples-value">

#### Klik penghitung {/*click-counter*/}

Komponen ini menggunakan sebuah ref untuk melacak berapa kali tombol diklik. Perhatikan bahwa tidak masalah untuk menggunakan sebuah ref dan bukan state di sini karena jumlah klik hanya dibaca dan ditulis di dalam event handler.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

Jika Anda menampilkan `{ref.current}` di dalam JSX, nomor tersebut tidak akan memperbarui saat mengeklik. Hal ini karena pengaturan `ref.current` tidak memicu sebuah render ulang. Informasi yang digunakan untuk rendering harus berupa state.

<Solution />

#### Sebuah stopwatch {/*a-stopwatch*/}

Contoh ini menggunakan sebuah kombinasi dari state dan ref. Baik `startTime` dan `now` adalah variabel state karena digunakan untuk rendering. Tetapi kita juga perlu menyimpan sebuah [ID interval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) sehingga kita dapat menghentikan interval pada saat tombol ditekan. Karena ID interval tidak digunakan untuk rendering, maka sebaiknya disimpan di dalam sebuah ref, dan pembaruan secara manual.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**Jangan menulis _atau membaca_ `ref.current` selama proses rendering.**

React mengharapkan bahwa tubuh komponen Anda [berperilaku seperti fungsi murni](/learn/keeping-components-pure):

- Jika masukan-masukan ([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), dan [context](/learn/passing-data-deeply-with-context)) yang sama, seharusnya mengembalikan JSX yang sama persis.
- Memanggilnya dengan urutan yang berbeda atau dengan argumen yang berbeda tidak akan mempengaruhi hasil panggilan lainnya.

Membaca atau menulis ref **selama rendering** melanggar ekspektasi-ekspektasi ini.

```js {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Don't write a ref during rendering
  myRef.current = 123;
  // ...
  // 🚩 Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}
```

Anda dapat membaca atau menulis ref **dari event handler atau effect sebagai gantinya**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Jika Anda *harus* membaca [atau menulis](/reference/react/useState#storing-information-from-previous-renders) sesuatu selama rendering, [gunakan state](/reference/react/useState) sebagai gantinya.

Ketika Anda melanggar beberapa aturan ini, komponen Anda mungkin masih dapat berfungsi, tetapi sebagian besar fitur baru yang kami tambahkan ke React akan bergantung pada ekspektasi ini. Baca lebih lanjut tentang [menjaga komponen Anda tetap murni.](/learn/keeping-components-pure#where-you-can-cause-side-effects)

</Pitfall>

---

### Memanipulasi DOM dengan sebuah ref {/*manipulating-the-dom-with-a-ref*/}

Sangat umum menggunakan sebuah ref untuk memanipulasi [DOM.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) React memiliki dukungan bawaan untuk hal ini.

Pertama, deklarasikan sebuah <CodeStep step={1}>objek ref</CodeStep> dengan sebuah <CodeStep step={3}>initialValue</CodeStep> dari `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Kemudian oper objek ref Anda sebagai atribut `ref` ke JSX milik node DOM yang ingin Anda manipulasi:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

Setelah React membuat node DOM dan meletakkannya di layar, React akan mengatur <CodeStep step={2}>properti `current`</CodeStep> objek Anda yang merujuk ke node DOM tersebut. Sekarang Anda dapat mengakses node DOM dari `<input>` dan memanggil method seperti [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React akan menyetel properti `current` kembali ke `null` ketika node dihapus dari layar.

Baca lebih lanjut tentang [memanipulasi DOM dengan ref].(/learn/manipulating-the-dom-with-refs)

<Recipes titleText="Contoh memanipulasi DOM dengan useRef" titleId="examples-dom">

#### Memfokuskan sebuah masukan teks {/*focusing-a-text-input*/}

Dalam contoh ini, mengeklik tombol akan memfokuskan masukan:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Menggulir gambar ke dalam tampilan {/*scrolling-an-image-into-view*/}

Pada contoh ini, mengeklik tombol akan menggulirkan gambar ke dalam tampilan. Ini menggunakan ref ke daftar node DOM, dan kemudian memanggil DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) API untuk menemukan gambar yang ingin kita gulir.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // This line assumes a particular DOM structure:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Tom
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Maru
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### Memutar dan menjeda sebuah video {/*playing-and-pausing-a-video*/}

Contoh ini menggunakan sebuah ref untuk memanggil [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) dan [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) pada sebuah node DOM `<video>`.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### Mengekspos sebuah ref ke komponen Anda sendiri {/*exposing-a-ref-to-your-own-component*/}

Terkadang, Anda mungkin ingin membiarkan komponen induk memanipulasi DOM di dalam komponen Anda. Sebagai contoh, mungkin Anda menulis komponen `MyInput`, tetapi Anda ingin induknya dapat memfokuskan masukan (yang tidak dapat diakses oleh induknya). Anda dapat menggunakan kombinasi `useRef` untuk menampung masukan dan [`forwardRef`](/reference/react/forwardRef) untuk mengeksposnya ke komponen induk. Baca sebuah [panduan mendetail](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) di sini.

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Menghindari pembuatan ulang konten ref {/*avoiding-recreating-the-ref-contents*/}

React menyimpan nilai ref awal sekali dan mengabaikannya pada render berikutnya.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Meskipun hasil dari `new VideoPlayer()` hanya digunakan untuk render awal, Anda masih memanggil fungsi ini pada setiap render. Hal ini dapat menjadi boros jika Anda membuat objek yang besar.

Untuk mengatasinya, Anda dapat menginisialisasi ref seperti ini sebagai gantinya:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Biasanya, menulis atau membaca `ref.current` selama render tidak diperbolehkan. Namun, dalam kasus ini tidak masalah karena hasilnya akan selalu sama, dan kondisi ini hanya dijalankan selama inisialisasi sehingga dapat sepenuhnya diprediksi.

<DeepDive>

#### Cara menghindari pemeriksaan null saat menginisialisasi useRef {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

Jika Anda menggunakan pemeriksa tipe dan tidak ingin selalu memeriksa `null`, Anda dapat mencoba pola seperti ini:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Di sini, `playerRef` itu sendiri dapat bernilai null. Namun, Anda harus dapat meyakinkan pemeriksa tipe Anda bahwa tidak ada kasus di mana `getPlayer()` mengembalikan `null`. Kemudian gunakan `getPlayer()` di dalam event handler Anda.

</DeepDive>

---

## Pemecahan masalah {/*troubleshooting*/}

### Saya tidak bisa mendapatkan ref ke komponen kustom {/*i-cant-get-a-ref-to-a-custom-component*/}

Jika Anda mencoba mengoper `ref` ke komponen Anda sendiri seperti ini:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

Anda mungkin mendapatkan error di konsol:

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

</ConsoleBlock>

Secara bawaan, komponen Anda sendiri tidak mengekspos ref ke node DOM di dalamnya.

Untuk memperbaikinya, cari komponen yang ingin Anda dapatkan ref-nya:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

Dan kemudian membungkusnya dengan [`forwardRef`](/reference/react/forwardRef) seperti ini:

```js {3,8}
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MyInput;
```

Kemudian komponen induk bisa mendapatkan ref ke sana.

Baca lebih lanjut tentang [mengakses node DOM komponen lain.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)
