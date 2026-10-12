---
title: <Suspense>
---

<Intro>

`<Suspense>` memungkinkan Anda menampilkan *fallback* hingga komponen anak-anaknya selesai dimuat.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### *Props* {/*props*/}
* `children`: UI sebenarnya yang ingin Anda *render*. Jika `children` ditangguhkan saat di-*render*, maka Suspense akan beralih me-*render* `fallback`.
* `fallback`: UI alternatif untuk di-*render* menggantikan UI yang sebenarnya jika belum selesai dimuat. Simpul React apapun yang valid akan diterima, meskipun dalam praktiknya, *fallback* adalah tampilan pengganti yang ringan, Suspense akan secara otomatis beralih ke `fallback` ketika `children` ditangguhkan, dan kembali ke `children` ketika datanya sudah siap. Jika `fallback` ditangguhkan sewaktu melakukan *rendering*, itu akan mengaktifkan batasan Suspense dari induk terdekat.

#### Catatan Penting {/*caveats*/}

- React tidak menyimpan *state* apa pun untuk *render*-an yang ditangguhkan sebelum dapat dimuat untuk pertama kalinya. Ketika komponen sudah dimuat, React akan mencoba me-*render* ulang komponen yang ditangguhkan dari awal.
- Jika *Suspense* menampilkan konten untuk komponen, namun kemudian ditangguhkan lagi, `fallback` akan ditampilkan kembali kecuali jika pembaruan yang menyebabkannya, disebabkan oleh [`startTransition`](/reference/react/startTransition) atau [`useDeferredValue`](/reference/react/useDeferredValue).
- Jika React perlu menyembunyikan konten yang sudah terlihat karena ditangguhkan kembali, React akan membersihkan [*layout Effects*](/reference/react/useLayoutEffect) yang ada di dalam konten komponen. Ketika konten siap untuk ditampilkan lagi, React akan menjalankan *layout Effects* lagi. Hal ini memastikan bahwa Efek yang mengukur tata letak DOM tidak mencoba melakukan hal ini saat konten disembunyikan.
- React menyertakan pengoptimalan di balik layar seperti *Streaming Server Rendering* dan *Selective Hydration* yang terintegrasi dengan *Suspense*. Baca [tinjauan arsitektur]((https://github.com/reactwg/react-18/discussions/37)) dan tonton [diskusi teknis]((https://www.youtube.com/watch?v=pj5N-Khihgc)) untuk mempelajari lebih lanjut.

---

## Penggunaan {/*usage*/}

### Menampilkan *fallback* saat konten sedang dimuat {/*displaying-a-fallback-while-content-is-loading*/}

<<<<<<< HEAD
Anda dapat membungkus bagian mana pun dari aplikasi Anda dengan batasan Suspense:
=======
- Lazy-loading component code with [`lazy`](/reference/react/lazy).
- Reading a Promise with [`use`](/reference/react/use), including data streamed from [Server Components](/reference/rsc/server-components) or loaded through a [Suspense-enabled framework](#suspense-enabled-frameworks).
- Loading a stylesheet rendered with [`<link rel="stylesheet">` and a `precedence` prop.](/reference/react-dom/components/link#special-rendering-behavior) React blocks the boundary until the stylesheet loads, up to a timeout. [See an example below.](#waiting-for-a-stylesheet-to-load)
- Waiting for a large boundary's HTML to arrive during streaming server rendering. Sending HTML takes time, so a boundary with enough content activates even when nothing in it suspends. React reveals the content as the HTML arrives.
- Loading fonts. Suspense doesn't wait for fonts by default, but when a [`<ViewTransition>`](/reference/react/ViewTransition) animates a boundary's reveal, React waits up to 500 ms for new fonts to load so text doesn't flash with a fallback font. [See an example below.](#waiting-for-a-font-to-load)
- Loading images. Suspense doesn't wait for images by default, but when a [`<ViewTransition>`](/reference/react/ViewTransition) animates a boundary's reveal, React waits up to 500 ms for visible images to load before starting the animation. Setting `loading="lazy"` or adding an `onLoad` handler opts a specific image out. [See an example below.](#waiting-for-an-image-to-load)
- <ExperimentalBadge /> Performing CPU-bound render work inside a [`<Suspense defer>`](#props) boundary.

<Note>

#### Suspense-enabled frameworks {/*suspense-enabled-frameworks*/}

A *Suspense-enabled framework* gives you a way to read data in your component in a way that activates the closest Suspense boundary. The exact way you load your data depends on your framework, and you'll find the details in its documentation. Under the hood, a Suspense-enabled framework maintains a cache of Promises and calls [`use`](/reference/react/use) to suspend on a Promise.

Without a framework, you can read a Promise with `use` directly, as long as the Promise is [cached so the same instance is reused across renders.](/reference/react/use#caching-promises-for-client-components)

</Note>

---

## Usage {/*usage*/}

### Displaying a fallback while content is loading {/*displaying-a-fallback-while-content-is-loading*/}

You can wrap any part of your application with a Suspense boundary:
>>>>>>> 046f17d04295ba047bb5739026b4ac3110f17028

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React akan menampilkan <CodeStep step={1}>*fallback* pemuatan</CodeStep> hingga semua kode dan data yang dibutuhkan oleh <CodeStep step={2}>anak-anaknya</CodeStep> telah selesai dimuat.

Pada contoh di bawah ini, komponen `Albums` *ditangguhkan* saat mengambil daftar album. Hingga komponen tersebut siap untuk di-*render*, React mengganti batasan Suspense terdekat di atas untuk menunjukkan *fallback*--komponen `Loading` Anda. Kemudian, saat data termuat, React menyembunyikan *fallback* `Loading` dan me-*render* komponen `Albums` dengan data.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Buka laman artis The Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Memuat...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Catatan: cara Anda melakukan pengambilan data bergantung pada
// _framework_ yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika _caching_ akan berada di dalam _framework_.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Tidak diimplementasikan');
  }
}

async function getAlbums() {
  // Tambahkan penundaan palsu agar penantian data lebih jelas.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

</Sandpack>

<Note>

**Hanya sumber data yang mendukung Suspense yang akan mengaktifkan komponen Suspense.** Yaitu:

- Pengambilan data dengan *framework* yang mendukung Suspense seperti [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) dan [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Kode komponen *lazy-loading* dengan [`lazy`](/reference/react/lazy)
- Membaca nilai dari Promise dengan [`use`](/reference/react/use)

Suspense **tidak** mendeteksi ketika data diambil di dalam Effect atau *event handler*.

Cara yang tepat untuk memuat data dalam komponen `Albums` di atas tergantung pada *framework* Anda. Jika Anda menggunakan *framework* yang mendukung Suspense, Anda akan menemukan detailnya dalam dokumentasi pengambilan data.

Pengambilan data yang mendukung Suspense tanpa menggunakan *framework* dogmatis belum didukung. Persyaratan untuk mengimplementasikan sumber data yang mendukung Suspense masih belum stabil dan belum terdokumentasi. API resmi untuk mengintegrasikan sumber data dengan Suspense akan dirilis pada versi React yang akan datang.

</Note>

---

### Menampilkan konten secara bersamaan sekaligus {/*revealing-content-together-at-once*/}


Secara *default*, seluruh pohon di dalam Suspense diperlakukan sebagai satu kesatuan. Sebagai contoh, meskipun *hanya satu* dari komponen-komponen ini yang tertahan menunggu beberapa data, *semua* komponen tersebut akan digantikan oleh indikator pemuatan:


```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Kemudian, setelah semuanya siap untuk ditampilkan, semuanya akan muncul sekaligus.

Pada contoh di bawah ini, baik `Biography` dan `Album` mengambil beberapa data. Namun, karena mereka dikelompokkan di bawah satu batasan Suspense, komponen-komponen ini akan selalu "muncul" bersama-sama pada waktu yang sama.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Buka laman artis The Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Memuat...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// _framework_ yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam _framework_.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Tidak diimplementasikan');
  }
}

async function getBio() {
  // Tambahkan penundaan palsu agar penantian data lebih terasa.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles adalah sebuah band rock asal Inggris,
    yang dibentuk di Liverpool pada tahun 1960, yang terdiri dari
    John Lennon, Paul McCartney, George Harrison
    dan Ringo Starr.`;
}

async function getAlbums() {
  // Tambahkan penundaan palsu agar penantian data lebih terasa.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

Komponen yang memuat data tidak harus menjadi anak langsung dari batasan Suspense. Sebagai contoh, Anda dapat memindahkan `Biography` dan `Album` ke dalam komponen `Details` yang baru. Hal ini tidak akan mengubah perilakunya. `Biography` dan `Albums` memiliki batasan Suspense induk terdekat yang sama, sehingga pemunculannya dikoordinasikan bersama-sama.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### Menunjukkan konten yang tersusun saat dimuat {/*revealing-nested-content-as-it-loads*/}

Ketika sebuah komponen ditangguhkan, komponen Suspense induk terdekat akan menampilkan *fallback*. Hal ini memungkinkan Anda menyatukan beberapa komponen Suspense untuk membuat pemuatan terurut. *Fallback* setiap batasan Suspense akan terisi saat level konten berikutnya tersedia. Sebagai contoh, Anda dapat memberikan daftar album sebuah *fallback*-nya sendiri:

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

Dengan perubahan ini, menampilkan `Biography` tidak perlu "menunggu" hingga `Album` termuat.

Urutan pemuatannya adalah sebagai berikut:

1. Jika `Biography` belum dimuat, `BigSpinner` ditampilkan sebagai pengganti seluruh area konten.
2. Setelah `Biography` selesai dimuat, `BigSpinner` digantikan oleh konten.
3. Jika `Albums` belum dimuat, `AlbumsGlimmer` ditampilkan sebagai pengganti `Albums` dan induknya `Panel`.
4. Akhirnya, setelah `Albums` selesai dimuat, dia akan menggantikan `AlbumsGlimmer`.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Buka laman artis The Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Memuat...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// *framework* yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam *framework*.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Tidak diimplementasikan');
  }
}

async function getBio() {
  // Tambahkan penundaan palsu agar penantian data lebih terasa.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles adalah sebuah band rock asal Inggris,
    yang dibentuk di Liverpool pada tahun 1960, yang terdiri dari
    John Lennon, Paul McCartney, George Harrison
    dan Ringo Starr.`;
}

async function getAlbums() {
  // Tambahkan penundaan palsu agar penantian data lebih terasa.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Batasan Suspense memungkinkan Anda mengkoordinasikan bagian dari UI Anda yang harus selalu "muncul" bersamaan, dan bagian yang harus menampilkan lebih banyak konten secara bertahap dalam urutan status pemuatan. Anda dapat menambah, memindahkan, atau menghapus batasan-batasan Suspense di mana saja di dalam pohon tanpa mempengaruhi perilaku bagian lainnya dari aplikasi Anda.

Jangan memberikan batasan Suspense pada setiap komponen. Batas suspense tidak boleh lebih spesifik daripada urutan pemuatan yang Anda inginkan untuk pengalman pengguna. Jika Anda bekerja dengan desainer, tanyakan kepada mereka di mana status pemuatan harus ditempatkan, mungkin mereka sudah memasukkannya dalam *wireframe* desain mereka.

---

### Menampilkan konten yang sudah usang saat konten baru sedang dimuat {/*showing-stale-content-while-fresh-content-is-loading*/}

Dalam contoh ini, komponen `SearchResults` ditangguhkan saat sedang mengambil hasil pencarian. Ketik `"a"`, tunggu hasilnya, dan kemudian ubah menjadi `"ab"`. Hasil untuk `"a"` akan tergantikan oleh *fallback* pemuatan.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Cari album:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Memuat...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Tidak ada yang cocok dengan <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// _framework_ yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam _framework_.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Tidak diimplementasikan');
  }
}

async function getSearchResults(query) {
  // Tambahkan penundaan palsu agar penantian data lebih terasa.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

Pola UI alternatif yang umum adalah dengan *menangguhkan* pembaruan daftar dan tetap menampilkan hasil sebelumnya hingga hasil yang baru siap. Hook [`useDeferredValue`](/reference/react/useDeferredValue) memungkinkan Anda untuk memberikan versi yang ditangguhkan dari kueri:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Cari album:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Memuat...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` akan segera diperbarui, sehingga input akan menampilkan nilai baru. Namun, `deferredQuery` akan menyimpan nilai sebelumnya sampai data dimuat, sehingga `SearchResults` akan menunjukkan hasil yang sebelumnya untuk sementara waktu.

Untuk membuatnya lebih jelas bagi pengguna, Anda bisa menambahkan indikasi visual apabila daftar hasil yang sudah usang ditampilkan:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Masukkan `"a"` didalam contoh berikut ini, tunggu hingga hasilnya dimuat, lalu ubah masukan ke `"ab"`. Perhatikan, bahwa alih-alih menampilkan *fallback* Suspense, Anda sekarang melihat daftar hasil sebelumnya yang diredupkan sampai hasil yang baru dimuat:


<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Cari album:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Memuat...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Tidak ada yang cocok dengan <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// _framework_ yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam _framework_.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Tidak diimplementasikan');
  }
}

async function getSearchResults(query) {
  // Tambahkan penundaan palsu agar penantian data lebih terasa.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<Note>

Baik nilai yang ditangguhkan maupun [transisi](#preventing-already-revealed-content-from-hiding) memungkinkan Anda menghindari menampilkan *fallback* Suspense hanya untuk indikator sebaris. Transisi menandai seluruh pembaruan sebagai tidak mendesak sehingga biasanya hal ini digunakan oleh *framework* dan *library router* untuk navigasi. Nilai yang ditangguhkan, di sisi lain, sebagian besar berguna dalam kode aplikasi di mana Anda ingin menandai bagian dari UI sebagai tidak mendesak dan membiarkannya "tertinggal" dari UI lainnya.

</Note>

---

### Mencegah konten yang sudah ditunjukkan agar tidak disembunyikan {/*preventing-already-revealed-content-from-hiding*/}

Ketika sebuah komponen ditangguhkan, batasan Suspense induk terdekat akan beralih untuk menampilkan *fallback*. Hal ini dapat menyebabkan pengalaman pengguna yang mengejutkan jika komponen tersebut sudah menampilkan beberapa konten. Coba tekan tombol ini:

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Memuat...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Peramban Musik
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Buka laman artis The Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// _framework_ yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam _framework_.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Tidak diimplementasikan');
  }
}

async function getBio() {
  // Tambahkan penundaan palsu agar penantian data lebih terasa.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles adalah sebuah band rock asal Inggris,
    yang dibentuk di Liverpool pada tahun 1960, yang terdiri dari
    John Lennon, Paul McCartney, George Harrison
    dan Ringo Starr.`;
}

async function getAlbums() {
  // Tambahkan penundaan palsu agar penantian data lebih terasa.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Saat Anda menekan tombol, komponen `Router` akan me-*render* `ArtistPage`, bukan `IndexPage`. Komponen di dalam `ArtistPage` ditangguhkan, sehingga batasan Suspense terdekat mulai menampilkan *fallback*. Batasan Suspense terdekat berada pada dekat akar, sehingga seluruh tata letak situs digantikan oleh `BigSpinner`.

Untuk mencegah hal ini, Anda dapat menandai pembaruan status navigasi sebagai *transition* dengan [`startTransition`:](/reference/react/startTransition)

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

Dengan begitu, React diberi tahu bahwa transisi *state* tidak mendesak, dan lebih baik tetap menampilkan halaman sebelumnya daripada menyembunyikan konten yang sudah ditampilkan. Sekarang pengklikan tombol akan "menunggu" sampai `Biography` dimuat:

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Memuat...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Peramban Musik
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Buka laman artis The Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// _framework_ yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam _framework_.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Tidak diimplementasikan');
  }
}

async function getBio() {
  // Tambahkan penundaan palsu agar penantian data lebih terasa.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles adalah sebuah band rock asal Inggris,
    yang dibentuk di Liverpool pada tahun 1960, yang terdiri dari
    John Lennon, Paul McCartney, George Harrison
    dan Ringo Starr.`;
}

async function getAlbums() {
  // Tambahkan penundaan palsu agar penantian data lebih terasa.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Transisi tidak menunggu *semua* konten dimuat. Transisi hanya menunggu cukup lama untuk menghindari menyembunyikan konten yang sudah ditunjukkan. Misalnya, situs web `Layout` sudah ditunjukkan, jadi tidak baik menyembunyikannya di balik *loading spinner*. Namun, batasan `Suspense` yang ada di sekitar `Albums` adalah Suspense yang baru, jadi transisinya tidak perlu ditunggu.


<Note>

Router yang mendukung Suspense diharapkan untuk membungkus pembaruan navigasi ke dalam transisi secara bawaan.

</Note>

---

### Mengindikasikan bahwa transisi sedang terjadi {/*indicating-that-a-transition-is-happening*/}

Pada contoh di atas, setelah Anda mengeklik tombol, tidak ada indikasi visual bahwa navigasi sedang berlangsung. Untuk menambahkan indikator, Anda dapat mengganti [`startTransition`](/reference/react/startTransition) dengan [`useTransition`](/reference/react/useTransition) yang akan memberi Anda nilai *boolean* `isPending`. Pada contoh di bawah ini, nilai tersebut digunakan untuk mengubah gaya *header* situs web saat transisi terjadi:

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Memuat...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Peramban Musik
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Buka laman artis The Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// _framework_ yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam _framework_.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Tidak diimplementasikan');
  }
}

async function getBio() {
  // Tambahkan penundaan palsu untuk membuat penantian terlihat.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles adalah sebuah band rock asal Inggris,
    yang dibentuk di Liverpool pada tahun 1960, yang terdiri dari
    John Lennon, Paul McCartney, George Harrison
    dan Ringo Starr.`;
}

async function getAlbums() {
  // Tambahkan penundaan palsu untuk membuat penantian terlihat.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Menyetel ulang batasan Suspense pada navigasi {/*resetting-suspense-boundaries-on-navigation*/}

Selama transisi, React akan menghindari menyembunyikan konten yang sudah ditunjukkan. Namun, jika Anda menavigasi ke rute dengan parameter yang berbeda, Anda mungkin ingin memberi tahu React bahwa itu adalah konten yang *berbeda*. Anda dapat mengekspresikan ini dengan sebuah `key`:

```js
<ProfilePage key={queryParams.id} />
```

Bayangkan Anda sedang menavigasi dalam halaman profil pengguna, dan ada sesuatu yang ditangguhkan. Jika pembaruan itu dibungkus dengan transisi, pembaruan itu tidak akan menampilkan *fallback* untuk konten yang sudah terlihat. Itulah perilaku yang diharapkan.

Namun, sekarang bayangkan Anda menavigasi di antara dua profil pengguna yang berbeda. Dalam kasus ini, masuk akal untuk menampilkan *fallback*. Sebagai contoh, *timeline* salah satu pengguna adalah *konten yang berbeda* dengan *timeline* pengguna lain. Dengan menentukan sebuah `kunci`, Anda memastikan bahwa React memperlakukan profil pengguna yang berbeda sebagai komponen yang berbeda, dan menyetel ulang batasan-batasan Suspense selama navigasi. Router yang terintegrasi dengan Suspense seharusnya melakukan ini secara otomatis.

---
### Menyediakan *fallback* untuk kesalahan server dan konten khusus klien {/*providing-a-fallback-for-server-errors-and-server-only-content*/}

Jika Anda menggunakan salah satu dari [API *streaming* untuk pe-*render*-an di server](/reference/react-dom/server) (atau *framework* yang bergantung pada mereka), React juga akan menggunakan `<Suspense>` untuk menangani kesalahan pada server. Jika sebuah komponen menimbulkan kesalahan pada server, React tidak akan membatalkan pe-*render*an pada server. Sebagai gantinya, React akan mencari komponen `<Suspense>` terdekat di atasnya dan menyertakan *fallback*-nya (seperti *spinner*) ke dalam HTML yang dihasilkan server. Pengguna akan tetap melihat *spinner* pada awalnya.


Pada klien, React akan mencoba me-*render* komponen yang sama kembali. Jika terjadi kesalahan pada klien juga, React akan melemparkan kesalahan dan menampilkan [batasan error](/reference/react/Component#static-getderivedstatefromerror) terdekat. Namun, jika tidak terjadi kesalahan pada klien, React tidak akan menampilkan kesalahan pada pengguna karena konten pada akhirnya berhasil ditampilkan.

Anda dapat menggunakan ini untuk mengecualikan beberapa komponen dari perenderan di server. Untuk melakukan hal ini, lemparkan kesalahan pada lingkungan server dan kemudian bungkus dengan batas `<Suspense>` untuk mengganti HTML-nya dengan *fallback*:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat seharusnya hanya di-render di klien.');
  }
  // ...
}
```

HTML server akan menyertakan indikator pemuatan. Indikator ini akan digantikan oleh komponen `Chat` pada klien.

---

<<<<<<< HEAD
## Pemecahan Masalah {/*troubleshooting*/}
=======
### Providing a fallback for browser-only content {/*providing-a-fallback-for-browser-only-content*/}
>>>>>>> 046f17d04295ba047bb5739026b4ac3110f17028

### Bagaimana cara mencegah agar UI tidak diganti dengan *fallback* selama pembaruan? {/*preventing-unwanted-fallbacks*/}

Mengganti UI yang terlihat dengan *fallback* menciptakan pengalaman pengguna yang mengejutkan. Hal ini dapat terjadi ketika pembaruan menyebabkan sebuah komponen menjadi ditangguhkan, dan batasan Suspense terdekat sudah menampilkan konten kepada pengguna.

<<<<<<< HEAD
Untuk mencegah hal ini terjadi, [tandai pembaruan sebagai tidak mendesak dengan menggunakan  `startTransition`](#preventing-already-revealed-content-from-hiding). Selama transisi, React akan menunggu hingga cukup banyak data yang dimuat untuk mencegah terjadinya kemumculan *fallback* yang tidak diinginkan:
=======
<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('The draft is stored in localStorage.'));
  const [draft, setDraft] = useState(
    () => localStorage.getItem('draft') ?? ''
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem('draft', nextDraft);
  }

  return (
    <label>
      Draft:
      <textarea
        value={draft}
        onChange={handleChange}
        rows={4}
        cols={30}
      />
    </label>
  );
}

export default function App() {
  return (
    <>
      <h1>Saved draft</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Saved draft</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
          label, textarea { display: block; }
          textarea { margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Browser-only rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 160px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

During server rendering, React includes the Suspense boundary's fallback in the HTML. In the browser, React replaces the fallback with the saved draft.

---

### Waiting for a stylesheet to load {/*waiting-for-a-stylesheet-to-load*/}

A stylesheet rendered with [`<link rel="stylesheet">` and a `precedence` prop](/reference/react-dom/components/link#special-rendering-behavior) blocks the Suspense boundary until the stylesheet loads, up to a timeout, so the content doesn't appear unstyled.

In the example below, the `Card` component renders a stylesheet with `precedence`. Press "Show card": React shows the fallback until the stylesheet has loaded, and then reveals the card with its styles applied.

For comparison, the second button performs the same update without React, in a separate document. Nothing waits for the stylesheet, so the card's text appears in a fallback font first and then switches:

<Sandpack>

```js
import { Suspense, useState, startTransition } from 'react';
import { freshStylesheetUrl } from './styles.js';
import VanillaCard from './VanillaCard.js';

function Card({ href }) {
  return (
    <>
      <link rel="stylesheet" href={href} precedence="default" />
      <div className="fancy-card">This card uses a font from the stylesheet.</div>
    </>
  );
}

export default function App() {
  const [href, setHref] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setHref(freshStylesheetUrl());
          });
        }}>
        Show card
      </button>
      {href && (
        <Suspense fallback={<p>⌛ Loading styles...</p>}>
          <Card href={href} />
        </Suspense>
      )}
      <hr />
      <VanillaCard />
    </>
  );
}
```

```js src/VanillaCard.js
import { useRef } from 'react';
import { freshStylesheetUrl } from './styles.js';

export default function VanillaCard() {
  const ref = useRef(null);
  function show() {
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; }
        .fancy-card {
          padding: 20px;
          border-radius: 8px;
          color: white;
          font-family: 'Caveat', sans-serif;
          font-size: 24px;
          background: linear-gradient(135deg, #087ea4, #2b3491);
        }
      </style>
      <div class="fancy-card">This card uses a font from the stylesheet.</div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show card (without React)</button>
      <iframe ref={ref} title="Vanilla card" className="vanilla-frame" />
    </>
  );
}
```

```js src/styles.js hidden
// Add a unique parameter so the stylesheet isn't cached,
// and every run shows the loading state.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}
```

```css
#root {
  min-height: 300px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
.fancy-card {
  margin-top: 1em;
  padding: 20px;
  border-radius: 8px;
  color: white;
  font-family: 'Caveat', sans-serif;
  font-size: 24px;
  background: linear-gradient(135deg, #087ea4, #2b3491);
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 90px;
}
```

</Sandpack>

---

### Animating from Suspense content {/*animating-from-suspense-content*/}

Suspense composes with [`<ViewTransition>`](/reference/react/ViewTransition) to animate the swap from the fallback to the content. Wrap the boundary in a `<ViewTransition>`, and React treats the swap as an update, cross-fading between the fallback and the content by default:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, Suspense} from 'react';
import {Video, VideoPlaceholder} from './Video';
import {useLazyVideoData} from './data';

function LazyVideo() {
  const video = useLazyVideoData();
  return <Video video={video} />;
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from 'react';

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

Where you place the `<ViewTransition>` relative to the boundary determines whether the fallback and content cross-fade as one update or animate as separate exit and enter animations. You can also [customize the animation](/reference/react/ViewTransition#customizing-animations) with View Transition classes.

[Learn more about animating from Suspense content.](/reference/react/ViewTransition#animating-from-suspense-content)

</Note>

---

### Waiting for a font to load {/*waiting-for-a-font-to-load*/}

When a [`<ViewTransition>`](/reference/react/ViewTransition) animates a Suspense boundary's reveal, React waits up to 500 ms for new fonts the content introduces so the text doesn't flash with a fallback font. This only happens during a `<ViewTransition>` update.

In the example below, the Suspense boundary is wrapped in a `<ViewTransition>`, and the `Quote` component suspends while its data loads. Rendering the quote loads a stylesheet that introduces the font. React keeps the fallback visible while the stylesheet and font load. If the font loads within the 500 ms limit, the quote appears already in its font.

For comparison, the second button performs the same update without React. Nothing waits for the font, so the text appears in a fallback font first and then switches:

<Sandpack>

```js
import {
  ViewTransition,
  Suspense,
  use,
  useState,
  startTransition,
} from 'react';
import { fetchQuote } from './data.js';
import {
  freshFontUrl,
  freshStylesheetUrl,
} from './font.js';
import VanillaQuote from './VanillaQuote.js';

function Quote({ stylesheet }) {
  const quote = use(fetchQuote());
  return (
    <>
      <link
        rel="stylesheet"
        href={stylesheet}
        precedence="default"
      />
      <p className="quote fancy">{quote}</p>
    </>
  );
}

export default function App() {
  const [stylesheet, setStylesheet] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setStylesheet(freshStylesheetUrl());
          });
        }}>
        Show quote
      </button>
      {stylesheet && (
        <ViewTransition>
          <Suspense fallback={<p className="quote">⌛ Loading quote...</p>}>
            <Quote stylesheet={stylesheet} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaQuote />
    </>
  );
}
```

```js src/VanillaQuote.js
import { useRef } from 'react';
import { freshFontUrl } from './font.js';

export default function VanillaQuote() {
  const ref = useRef(null);
  function show() {
    const style = document.createElement('style');
    style.textContent = `@font-face {
      font-family: 'VanillaFancy';
      src: url(${freshFontUrl()}) format('woff2');
      font-display: swap;
    }`;
    document.head.appendChild(style);
    ref.current.innerHTML = `<p class="quote vanilla-fancy">The best way to predict the future is to invent it.</p>`;
  }
  return (
    <>
      <button onClick={show}>Show quote (without React)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/font.js hidden
export function freshStylesheetUrl() {
  // Add a unique parameter so the stylesheet isn't cached.
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshFontUrl() {
  // Add a unique parameter so the font isn't cached.
  return (
    'https://fonts.gstatic.com/s/caveat/v23/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIWpYT5Kmgq3sw.woff2' +
    '?t=' +
    Date.now()
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = null;

export function fetchQuote() {
  if (!cache) {
    cache = new Promise((resolve) => {
      // Add a fake delay to make waiting noticeable.
      setTimeout(() => {
        resolve(
          'The best way to predict the future is to invent it.'
        );
      }, 500);
    });
  }
  return cache;
}
```

```css
#root {
  min-height: 260px;
}
.quote {
  font-size: 20px;
  margin-top: 1em;
}
.fancy {
  font-family: 'Caveat', sans-serif;
}
.vanilla-fancy {
  font-family: 'VanillaFancy', sans-serif;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Waiting for an image to load {/*waiting-for-an-image-to-load*/}

When a Suspense boundary reveals content inside a [`<ViewTransition>`](/reference/react/ViewTransition), React waits up to 500 ms for visible images to load before starting the animation. Setting `loading="lazy"` or adding an `onLoad` handler opts an image out.

Compare the same boundary inside and outside a `<ViewTransition>`. Inside, React keeps the profile skeleton visible for up to 500 ms while the image loads, so the card can be revealed with its image already in place. Outside, Suspense stops showing the skeleton as soon as the Promise resolves. If the image is still loading, the card appears first and the image pops in afterward:

<Sandpack>

```js
import {
  ViewTransition,
  Suspense,
  use,
  useState,
} from 'react';
import { fetchImageSrc } from './image.js';

function Profile({ cacheKey }) {
  const src = use(fetchImageSrc(cacheKey));
  return (
    <div className="card">
      <img src={src} alt="" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [showWithTransition, setShowWithTransition] =
    useState(false);
  const [showWithoutTransition, setShowWithoutTransition] =
    useState(false);
  return (
    <>
      <button onClick={() => setShowWithTransition(true)}>
        Show profile with View Transition
      </button>
      {showWithTransition && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile cacheKey="with-transition" />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <button onClick={() => setShowWithoutTransition(true)}>
        Show profile without View Transition
      </button>
      {showWithoutTransition && (
        <Suspense fallback={<ProfilePlaceholder />}>
          <Profile cacheKey="without-transition" />
        </Suspense>
      )}
    </>
  );
}
```

```js src/image.js hidden
// Normally, the caching logic would be inside a framework.
const cache = new Map();

export function fetchImageSrc(cacheKey) {
  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, loadImageSrc());
  }
  return cache.get(cacheKey);
}

async function loadImageSrc() {
  // Delay the response so the Suspense fallback is visible.
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Add a unique parameter so the image isn't cached.
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Coordinating fonts, images, and stylesheets {/*coordinating-fonts-images-and-stylesheets*/}

A Suspense boundary can wait for data, stylesheets, fonts, and images at once. Waiting for fonts and images only happens during a [`<ViewTransition>`](/reference/react/ViewTransition) update. In the example below, the `ProfileCard` component suspends while its data loads, and renders a stylesheet with `precedence`, text in a new font, and a portrait. React keeps the skeleton visible while the data and the stylesheet load. The `<ViewTransition>` reveal then waits for the font and the image, so the card appears complete.

For comparison, the version without React loads the same data and shows every resource arriving on its own schedule:

<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';
import VanillaProfileCard from './VanillaProfileCard.js';

function ProfileCard({ resources }) {
  const quote = use(resources.quotePromise);
  return (
    <>
      <link rel="stylesheet" href={resources.stylesheet} precedence="default" />
      <div className="profile-card">
        <img src={resources.image} alt="" width={80} height={80} />
        <div>
          <p className="name">Jack Pope</p>
          <p className="bio">{quote}</p>
        </div>
      </div>
    </>
  );
}

function ProfileCardPlaceholder() {
  return (
    <div className="profile-card">
      <div className="avatar-placeholder" />
      <div>
        <p className="name name-placeholder">&nbsp;</p>
        <p className="bio bio-placeholder">&nbsp;</p>
      </div>
    </div>
  );
}

export default function App() {
  const [resources, setResources] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setResources({
              quotePromise: fetchQuote(),
              stylesheet: freshStylesheetUrl(),
              image: freshImageUrl(),
            });
          });
        }}>
        Show profile
      </button>
      {resources && (
        <ViewTransition>
          <Suspense fallback={<ProfileCardPlaceholder />}>
            <ProfileCard resources={resources} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfileCard />
    </>
  );
}
```

```js src/VanillaProfileCard.js
import { useRef } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';

export default function VanillaProfileCard() {
  const ref = useRef(null);
  async function show() {
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; font-family: sans-serif; }
        .profile-card { display: flex; gap: 12px; align-items: center; }
        .profile-card img { border-radius: 50%; background: #dfe3e9; }
        .name { margin: 0 0 4px; font-family: 'Caveat', sans-serif; font-size: 22px; line-height: 28px; font-weight: bold; }
        .bio { margin: 0; font-family: 'Caveat', sans-serif; font-size: 20px; line-height: 26px; }
        .avatar-placeholder { width: 80px; height: 80px; border-radius: 50%; background: #dfe3e9; }
        .name-placeholder, .bio-placeholder { border-radius: 4px; background: #dfe3e9; color: transparent; }
        .name-placeholder { width: 90px; }
        .bio-placeholder { width: 220px; height: 52px; }
      </style>
      <div class="profile-card">
        <div class="avatar-placeholder"></div>
        <div>
          <p class="name name-placeholder">&nbsp;</p>
          <p class="bio bio-placeholder">&nbsp;</p>
        </div>
      </div>
    `);
    doc.close();

    const quote = await fetchQuote();
    doc.body.innerHTML = `
      <div class="profile-card">
        <img src="${freshImageUrl()}" alt="" width="80" height="80" />
        <div>
          <p class="name">Jack Pope</p>
          <p class="bio">${quote}</p>
        </div>
      </div>`;
    const stylesheet = doc.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = freshStylesheetUrl();
    doc.head.appendChild(stylesheet);
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <iframe ref={ref} title="Vanilla profile card" className="vanilla-frame" />
    </>
  );
}
```

```js src/resources.js hidden
// Add a unique parameter so the resources aren't cached,
// and every run shows the loading state.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.

export async function fetchQuote() {
  // Add a fake delay to make waiting noticeable.
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return 'The best way to predict the future is to invent it.';
}
```

```css
#root {
  min-height: 320px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
.profile-card {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 1em;
}
.profile-card img {
  border-radius: 50%;
  background: #dfe3e9;
}
.name {
  margin: 0 0 4px;
  font-family: 'Caveat', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
}
.bio {
  margin: 0;
  font-family: 'Caveat', sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.profile-card img {
  display: block;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder,
.bio-placeholder {
  border-radius: 4px;
  background: #dfe3e9;
  color: transparent;
}
.name-placeholder {
  width: 90px;
}
.bio-placeholder {
  width: 220px;
  height: 52px;
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 110px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

### How do I prevent the UI from being replaced by a fallback during an update? {/*preventing-unwanted-fallbacks*/}

Replacing visible UI with a fallback creates a jarring user experience. This can happen when an update causes a component to suspend, and the nearest Suspense boundary is already showing content to the user.

To prevent this from happening, [mark the update as non-urgent using `startTransition`](#preventing-already-revealed-content-from-hiding). During a Transition, React will wait until enough data has loaded to prevent an unwanted fallback from appearing:
>>>>>>> 046f17d04295ba047bb5739026b4ac3110f17028

```js {2-3,5}
function handleNextPageClick() {
  // Jika pembaruan ini ditangguhkan, jangan sembunyikan konten yang sudah ditampilkan
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Hal ini akan menghindari penyembunyan konten yang ada. Namun, setiap batasan `Suspense` yang baru di-*render* masih akan segera menampilkan *fallback* untuk menghindari pemblokiran UI dan memperbolehkan pengguna melihat konten saat konten tersebut tersedia.

**React hanya akan mencegah *fallback* yang tidak diinginkan selama pembaruan yang tidak mendesak**. Ini tidak akan menunda pe-*render*-an jika hasl tersebut adalah hasil dari pembaruan yang mendesak. Anda harus memilih menggunakan API seperti [`startTransition`](/reference/react/startTransition) atau [`useDeferredValue`](/reference/react/useDeferredValue).

Jika router Anda terintegrasi dengan Suspense, router seharusnya membungkus pembaruannya menjadi [`startTransition`](/reference/react/startTransition) secara otomatis.
