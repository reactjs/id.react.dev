---
title: <Suspense>
---

<Intro>

`<Suspense>` memungkinkan Anda menampilkan fallback sampai komponen children selesai dimuat.


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
* `children`: UI aktual yang ingin Anda *render*. Jika `children` ditangguhkan sewaktu me-*render*, batas Suspense akan beralih me-*render* `fallback`.
* `fallback`: UI alternatif untuk di-*render* menggantikan UI yang sebenarnya jika belum selesai dimuat. Setiap node React yang valid akan diterima, meskipun dalam praktiknya, fallback adalah tampilan placeholder yang ringan, Suspense akan secara otomatis beralih ke `fallback` ketika `children` ditangguhkan, dan kembali ke `children` ketika datanya sudah siap. Jika `fallback` ditangguhkan sewaktu melakukan *rendering*, itu akan mengaktifkan induk terdekat dari batas Suspense.

#### Catatan Penting {/*caveats*/}

- React tidak menyimpan state apa pun untuk me-*render* yang ditangguhkan sebelum dapat dimuat untuk pertama kalinya. Ketika komponen sudah dimuat, React akan mencoba me-*render* ulang komponen yang ditangguhkan dari awal.
- Jika Suspense menampilkan konten untuk komponen, namun kemudian ditangguhkan lagi, `fallback` akan ditampilkan lagi kecuali jika pembaruan yang menyebabkannya, disebabkan oleh [`startTransition`](/reference/react/startTransition) atau [`useDeferredValue`](/reference/react/useDeferredValue).
- Jika React perlu menyembunyikan konten yang sudah terlihat karena ditangguhkan lagi, ini akan membersihkan [layout Effects](/reference/react/useLayoutEffect) yang ada di dalam konten komponen. Ketika konten siap untuk ditampilkan lagi, React akan menjalankan Efek tata letak lagi. Hal ini memastikan bahwa Efek yang mengukur tata letak DOM tidak mencoba melakukan hal ini saat konten disembunyikan.
- React menyertakan pengoptimalan di *under the hood* *Streaming Server Rendering* dan *Selective Hydration* yang terintegrasi dengan Suspense. Baca [tinjauan arsitektural](https://github.com/reactwg/react-18/discussions/37) dan tonton [sebuah pembicaraan teknis](https://www.youtube.com/watch?v=pj5N-Khihgc) untuk belajar lebih lanjut.

---

## Pengunaan {/*usage*/}

### Menampilkan fallback saat konten sedang dimuat {/*displaying-a-fallback-while-content-is-loading*/}

Anda dapat membungkus bagian mana pun dari aplikasi Anda dengan Batas Suspense:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React akan menampilkan kode <CodeStep step={1}>loading fallback</CodeStep> sampai semua kode dan data yang dibutuhkan oleh <CodeStep step={2}>the children</CodeStep> telah dimuat.

Pada contoh di bawah ini, Komponen `Albums` *menangguhkan* saat mengambil daftar album. Hingga siap untuk di-*render*, React mengganti batas Suspense terdekat di atas untuk menunjukkan fallback--Anda  `Loading` Komponen. Kemudian, saat data dimuat, React menyembunyikan fallback `Loading` dan me-*render* komponen `Albums` dengan data.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js hidden
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
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js ArtistPage.js active
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
  return <h2>🌀 Loading...</h2>;
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah kerangka kerja
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

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

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi nyata ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// kerangka kerja yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam kerangka kerja.

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
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Tambahkan penundaan palsu untuk membuat penantian menjadi nyata.
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

**Hanya sumber data yang diaktifkan Suspense yang akan mengaktifkan komponen Suspense.** Mereka termasuk:

- Data fetching with Suspense-enabled frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) and [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Lazy-loading component code with [`lazy`](/reference/react/lazy)

Suspense **tidak** mendeteksi ketika data diambil di dalam Effect atau event handler.


Cara yang tepat untuk memuat data dalam komponen `Albums` di atas tergantung pada kerangka kerja Anda. Jika Anda menggunakan kerangka kerja yang mendukung Suspense, Anda akan menemukan detailnya dalam dokumentasi pengambilan data.

Pengambilan data yang mendukung Suspense tanpa menggunakan kerangka kerja yang mendukung belum didukung. Persyaratan untuk mengimplementasikan sumber data yang mendukung Suspense masih belum stabil dan belum terdokumentasi. API resmi untuk mengintegrasikan sumber data dengan Suspense akan dirilis pada versi React yang akan datang. 
 

</Note>

---

### Mengungkap konten secara bersamaan sekaligus {/*revealing-content-together-at-once*/}


Secara default, seluruh pohon di dalam Suspense diperlakukan sebagai satu kesatuan. Sebagai contoh, meskipun *hanya satu* dari komponen-komponen ini yang tertahan menunggu beberapa data, *semua* komponen tersebut akan digantikan oleh indikator pemuatan:


```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Kemudian, setelah semuanya siap untuk ditampilkan, semuanya akan muncul sekaligus.

Pada contoh di bawah ini, baik `Biography` dan `Album` mengambil beberapa data. Namun, karena dikelompokkan di bawah satu batas Suspense, komponen-komponen ini selalu "muncul" bersamaan.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js hidden
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
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js ArtistPage.js active
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
  return <h2>🌀 Loading...</h2>;
}
```

```js Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah kerangka kerja
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi nyata ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah kerangka kerja
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

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

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi nyata ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// kerangka kerja yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam kerangka kerja.

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
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
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

Komponen yang memuat data tidak harus menjadi anak langsung dari batas Suspense. Sebagai contoh, Anda dapat memindahkan `Biografi` dan `Album` ke dalam komponen `Rincian` yang baru. Hal ini tidak akan mengubah perilakunya. `Biografi` dan `Albums` memiliki batas Suspense induk terdekat yang sama, sehingga pengungkapannya dikoordinasikan bersama.

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

### Mengungkap konten yang tersusun saat dimuat {/*revealing-nested-content-as-it-loads*/}

Ketika sebuah komponen ditangguhkan, komponen Suspense induk terdekat akan menampilkan fallback. Hal ini memungkinkan Anda menyatukan beberapa komponen Suspense untuk membuat urutan pemuatan. Fallback setiap batas Suspense akan terisi saat tingkat konten berikutnya tersedia. Sebagai contoh, Anda dapat memberikan daftar album dengan fallback tersendiri:

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

Dengan perubahan ini, menampilkan `Biography` tidak perlu "menunggu" sampai `Album` dimuat.

Urutan nya adalah sebagai berikut:

1. Jika `Biography` belum dimuat, `BigSpinner` ditampilkan sebagai pengganti seluruh area konten.
2. Setelah `Biography` selesai dimuat, `BigSpinner` digantikan oleh konten.
3. Jika `Albums` belum dimuat, `AlbumsGlimmer` ditampilkan sebagai pengganti `Albums` dan induknya `Panel`.
4. Akhirnya, setelah `Albums` selesai dimuat, dia akan menggantikan `AlbumsGlimmer`.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js hidden
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
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js ArtistPage.js active
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
  return <h2>🌀 Loading...</h2>;
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

```js Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah sebuah framework
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi yang sebenarnya ketika bug sudah diperbaiki.

function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah sebuah framework
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

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

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi yang sebenarnya ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// kerangka kerja yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam kerangka kerja.

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
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
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

Batas suspense memungkinkan Anda mengoordinasikan bagian mana dari UI Anda yang harus selalu "muncul" bersamaan, dan bagian mana yang harus menampilkan lebih banyak konten secara bertahap dalam urutan status pemuatan. Anda dapat menambah, memindahkan, atau menghapus batas-batas Suspense di mana saja di dalam pohon tanpa memengaruhi perilaku aplikasi Anda yang lain.

Jangan memberikan batas Suspense pada setiap komponen. Batas suspense tidak boleh lebih terperinci daripada urutan pemuatan yang Anda inginkan untuk dialami pengguna. Jika Anda bekerja dengan desainer, tanyakan kepada mereka di mana status pemuatan harus ditempatkan - kemungkinan mereka sudah memasukkannya dalam wireframe desain mereka.

---

### Menampilkan konten yang sudah basi saat konten baru sedang dimuat {/*showing-stale-content-while-fresh-content-is-loading*/}

Dalam contoh ini, komponen `SearchResults` ditangguhkan saat mengambil hasil pencarian. Ketik `"a"`, tunggu untuk hasil, dan kemudian edit menjadi `"ab"`. Hasil untuk `"a"` akan tergantikan oleh *loading fallback*.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah sebuah framework
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
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

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi yang sebenarnya ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// kerangka kerja yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam kerangka kerja.

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
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
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

Pola UI alternatif yang umum adalah untuk *menunda* memperbarui daftar dan terus menampilkan hasil sebelumnya hingga hasil yang baru siap. The [`useDeferredValue`](/reference/react/useDeferredValue) Hook memungkinkan Anda meneruskan versi kueri yang ditangguhkan: 

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` akan segera diperbarui, sehingga input akan menampilkan nilai baru. Namun, `deferredQuery` akan menyimpan nilai sebelumnya sampai data dimuat, jadi `SearchResults` akan menunjukkan hasil yang sebelumnya untuk sementara waktu.

Untuk membuatnya lebih jelas bagi pengguna, Anda bisa menambahkan indikasi visual apabila daftar hasil basi ditampilkan:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Masukkan `"a"` didalam contoh berikut ini, tunggu hingga hasilnya dimuat, lalu edit input ke `"ab"`. Perhatikan, bahwa alih-alih fallback Suspense, Anda sekarang melihat daftar hasil sebelumnya yang diredupkan sampai hasil yang baru dimuat:


<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah sebuah framework
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
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

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi yang sebenarnya ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// kerangka kerja yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam kerangka kerja.

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
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
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

Baik nilai yang ditangguhkan maupun [transitions](#preventing-already-revealed-content-from-hiding) memungkinkan Anda menghindari menampilkan Suspense fallback demi indikator sebaris. Transisi menandai seluruh pembaruan sebagai tidak mendesak sehingga biasanya digunakan oleh kerangka kerja dan pustaka router untuk navigasi. Nilai yang ditangguhkan, di sisi lain, sebagian besar berguna dalam kode aplikasi di mana Anda ingin menandai bagian dari UI sebagai tidak mendesak dan membiarkannya "tertinggal" dari UI lainnya.

</Note>

---

### Mencegah konten yang sudah terungkap agar tidak disembunyikan {/*preventing-already-revealed-content-from-hiding*/}

Ketika sebuah komponen ditangguhkan, batas Suspense induk terdekat akan beralih untuk menampilkan fallback. Hal ini dapat menyebabkan pengalaman pengguna yang mengejutkan jika komponen tersebut sudah menampilkan beberapa konten. Coba tekan tombol ini:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
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
  return <h2>🌀 Loading...</h2>;
}
```

```js Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
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

```js Albums.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah sebuah framework
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

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

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi yang sebenarnya ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah sebuah framework
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi yang sebenarnya ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// kerangka kerja yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam kerangka kerja.

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
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
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

Saat Anda menekan tombol, `Router` komponen me-*render* `ArtistPage` sebagai gantinya `IndexPage`.Komponen di dalam `ArtistPage` tertangguhkan, sehingga batas Suspense terdekat mulai menunjukkan *fallback*. Batas Suspense terdekat berada di dekat root, sehingga seluruh tata letak situs diganti dengan `BigSpinner`.

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

Hal ini memberi tahu React bahwa transisi state tidak mendesak, dan lebih baik tetap menampilkan halaman sebelumnya daripada menyembunyikan konten yang sudah ditampilkan. Sekarang klik tombol "menunggu" sampai `Biography` dimuat:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
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
  return <h2>🌀 Loading...</h2>;
}
```

```js Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
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

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

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

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah sebuah framework
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi yang sebenarnya ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// kerangka kerja yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam kerangka kerja.

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
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
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

Transisi tidak menunggu *semua* konten dimuat. Ini hanya menunggu cukup lama untuk menghindari menyembunyikan konten yang sudah terungkap. Misalnya, situs web `Layout` sudah terungkap, jadi tidak baik menyembunyikannya di balik *loading spinner*. Namun, batas `Suspense` yang bersusun di sekitar `Albums` adalah hal yang baru, jadi transisinya tidak perlu ditunggu.


<Note>

Router yang mendukung suspense diharapkan untuk membungkus pembaruan navigasi ke dalam transisi secara bawaan.

</Note>

---

### Mengindikasikan bahwa transisi sedang terjadi {/*indicating-that-a-transition-is-happening*/}

Pada contoh di atas, setelah Anda mengeklik tombol, tidak ada indikasi visual bahwa navigasi sedang berlangsung. Untuk menambahkan indikator, Anda dapat mengganti [`startTransition`](/reference/react/startTransition) dengan [`useTransition`](/reference/react/useTransition) yang akan memberimu boolean dengan nilai `isPending`. Pada contoh di bawah ini, ini digunakan untuk mengubah gaya tajuk situs web saat transisi terjadi:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
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
  return <h2>🌀 Loading...</h2>;
}
```

```js Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
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

```js Albums.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah sebuah framework
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

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

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi yang sebenarnya ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// yang belum tersedia di versi stabil React.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah sebuah framework
// yang terintegrasi dengan Suspense, seperti Relay atau Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Ini adalah solusi untuk bug agar demo dapat berjalan.
// TODO: ganti dengan implementasi yang sebenarnya ketika bug sudah diperbaiki.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js data.js hidden
// Catatan: cara Anda melakukan pengambilan data tergantung pada
// kerangka kerja yang Anda gunakan bersama dengan Suspense.
// Biasanya, logika caching akan berada di dalam kerangka kerja.

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
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Tambahkan penundaan palsu untuk membuat penantian terlihat.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
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

### Menyetel ulang batas Suspense pada navigasi {/*resetting-suspense-boundaries-on-navigation*/}

Selama transisi, React akan menghindari menyembunyikan konten yang sudah ditampilkan. Namun, jika Anda menavigasi ke rute dengan parameter yang berbeda, Anda mungkin ingin memberi tahu React bahwa itu adalah konten yang *berbeda*. Anda dapat mengekspresikan ini dengan sebuah `key`:

```js
<ProfilePage key={queryParams.id} />
```

Bayangkan Anda sedang menavigasi dalam halaman profil pengguna, dan ada sesuatu yang ditangguhkan. Jika pembaruan itu dibungkus dengan transisi, pembaruan itu tidak akan memicu kemunduran untuk konten yang sudah terlihat. Itulah perilaku yang diharapkan.

Namun, sekarang bayangkan Anda menavigasi di antara dua profil pengguna yang berbeda. Dalam hal ini, masuk akal untuk menampilkan fallback. Sebagai contoh, timeline salah satu pengguna adalah *konten yang berbeda* dengan timeline pengguna lain. Dengan menentukan sebuah `kunci`, Anda memastikan bahwa React memperlakukan profil pengguna yang berbeda sebagai komponen yang berbeda, dan menyetel ulang batas-batas Suspense selama navigasi. Router yang terintegrasi dengan Suspense seharusnya melakukan ini secara otomatis.

---
### Menyediakan fallback untuk kesalahan server dan konten khusus klien {/*providing-a-fallback-for-server-errors-and-server-only-content*/}

Jika Anda menggunakan salah satu dari [API perenderan server streaming](/reference/react-dom/server) (atau kerangka kerja yang bergantung pada mereka), React juga akan menggunakan `<Suspense>` untuk menangani kesalahan pada server. Jika sebuah komponen menimbulkan kesalahan pada server, React tidak akan membatalkan *render* server. Sebagai gantinya, React akan menemukan komponen `<Suspense>` terdekat di atasnya dan menyertakan fallback-nya (seperti *spiner*) ke dalam HTML server yang dihasilkan. Pengguna akan melihat pemintal pada awalnya.


Pada klien, React akan mencoba me-*render* komponen yang sama lagi. Jika terjadi kesalahan pada klien juga, React akan melemparkan kesalahan dan menampilkan [ErrorBoundary terdekat.] (/reference/react/Component/Component#static-getderivedstatefromerror) Namun, jika tidak terjadi kesalahan pada klien, React tidak akan menampilkan kesalahan pada pengguna karena konten pada akhirnya berhasil ditampilkan.

Anda dapat menggunakan ini untuk mengecualikan beberapa komponen dari perenderan di server. Untuk melakukan hal ini, lemparkan kesalahan pada lingkungan server dan kemudian bungkus dengan batas `<Suspense>` untuk mengganti HTML-nya dengan fallback:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

HTML server akan menyertakan indikator pemuatan. Indikator ini akan digantikan oleh komponen `Chat` pada klien.

---

## Pemecahan Masalah {/*troubleshooting*/}

### Bagaimana cara mencegah agar UI tidak diganti dengan fallback selama pembaruan? {/*preventing-unwanted-fallbacks*/}

Mengganti UI yang terlihat dengan fallback menciptakan pengalaman pengguna yang mengejutkan. Hal ini dapat terjadi ketika pembaruan menyebabkan sebuah komponen ditangguhkan, dan batas Suspense terdekat sudah menampilkan konten kepada pengguna.

Untuk mencegah hal ini terjadi, [tandai pembaruan sebagai tidak mendesak menggunakan  `startTransition`](#preventing-already-revealed-content-from-hiding). Selama transisi, React akan menunggu hingga cukup banyak data yang dimuat untuk mencegah terjadinya fallback yang tidak diinginkan:

```js {2-3,5}
function handleNextPageClick() {
  // If this update suspends, don't hide the already displayed content
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Ini akan menghindari menyembunyikan konten yang ada. Namun, setiap batas `Suspense` yang baru di-*render* masih akan segera menampilkan fallback untuk menghindari pemblokiran UI dan membiarkan pengguna melihat konten saat tersedia.

**React hanya akan mencegah fallback yang tidak diinginkan selama pembaruan yang tidak mendesak**. Ini tidak akan menunda *render* jika itu adalah hasil dari pembaruan yang mendesak. Anda harus ikut serta dengan API seperti [`startTransition`](/reference/react/startTransition) atau [`useDeferredValue`](/reference/react/useDeferredValue).

Jika router Anda terintegrasi dengan Suspense, router akan membungkus pembaruannya menjadi [`startTransition`](/reference/react/startTransition) secara otomatis.
