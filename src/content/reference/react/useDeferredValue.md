---
title: useDeferredValue
---

<Intro>

`useDeferredValue` adalah React Hook yang memungkinkan Anda menangguhkan pembaruan bagian dari UI.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useDeferredValue(value)` {/*usedeferredvalue*/}

Panggil fungsi `useDeferredValue` di tingkat atas komponen Anda untuk mendapatkan versi yang ditangguhkan dari nilai tersebut.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[Lihat contoh lainnya di bawah ini.](#usage)

#### Parameters {/*parameters*/}

* `value`: Nilai yang ingin Anda tangguhkan. Nilai ini dapat memiliki tipe apa saja.

#### Returns {/*returns*/}

Selama render awal, nilai tangguhan yang dikembalikan akan sama dengan nilai yang Anda berikan. Selama pembaruan, React pertama-tama akan mencoba render ulang dengan nilai lama (sehingga akan mengembalikan nilai lama), dan kemudian mencoba render ulang lainnya di latar belakang dengan nilai baru (sehingga akan mengembalikan nilai yang diperbarui).

#### Caveats {/*caveats*/}

- Nilai yang Anda oper ke `useDeferredValue` harus berupa nilai primitif (seperti string dan angka) atau objek yang dibuat di luar *rendering*. Jika Anda membuat objek baru selama perenderan dan langsung mengopernya ke `useDeferredValue`, objek tersebut akan berbeda di setiap perenderan, menyebabkan render ulang latar belakang yang tidak perlu.

- Ketika `useDeferredValue` menerima nilai yang berbeda (dibandingkan dengan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), di selain render saat ini (ketika masih menggunakan nilai sebelumnya), ia menjadwalkan render ulang di latar belakang dengan nilai baru. Render ulang latar belakang dapat diinterupsi: jika ada pembaruan lain pada `value`, React akan memulai lagi render ulang latar belakang dari awal. Misalnya, jika pengguna mengetik input lebih cepat daripada bagan yang menerima nilai yang ditangguhkan dapat render ulang, bagan hanya akan render ulang setelah pengguna berhenti mengetik.

- `useDeferredValue` terintegrasi dengan [`<Suspense>`.](/reference/react/Suspense) Jika update latar belakang yang disebabkan oleh nilai baru menangguhkan UI, pengguna tidak akan melihat fallback. Mereka akan melihat nilai ditangguhkan yang lama hingga data dimuat.

- `useDeferredValue` tidak dengan sendirinya mencegah permintaan jaringan tambahan.

- Tidak ada penundaan tetap yang disebabkan oleh `useDeferredValue` itu sendiri. Segera setelah React menyelesaikan render ulang asli, React akan segera mulai mengerjakan render ulang latar belakang dengan nilai baru yang ditangguhkan. Pembaruan apa pun yang disebabkan oleh peristiwa (seperti mengetik) akan mengganggu render ulang latar belakang dan mendapatkan prioritas di atasnya.

- Render ulang latar belakang yang disebabkan oleh `useDeferredValue` tidak mengaktifkan Efek hingga diterapkan ke layar. Jika render ulang latar belakang ditangguhkan, Efeknya akan berjalan setelah data dimuat dan pembaruan UI.

---

## Penggunaan {/*usage*/}

### Menampilkan konten basi saat konten segar sedang dimuat {/*showing-stale-content-while-fresh-content-is-loading*/}

Panggil fungsi `useDeferredValue` di tingkat atas komponen Anda untuk menangguhkan pembaruan beberapa bagian dari UI Anda.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

Selama render awal, <CodeStep step={2}>nilai yang ditangguhkan</CodeStep> akan sama dengan <CodeStep step={1}>nilai</CodeStep> yang Anda berikan.

Selama pembaruan, <CodeStep step={2}>nilai yang ditangguhkan</CodeStep> akan "tertinggal" dari <CodeStep step={1}>nilai</CodeStep> terbaru. Secara khusus, React pertama-tama akan render ulang *tanpa* memperbarui nilai yang ditangguhkan, dan kemudian mencoba render ulang dengan nilai yang baru diterima di latar belakang.

**Mari telusuri contoh untuk melihat kapan ini berguna.**

<Note>

Contoh ini menganggap Anda menggunakan salah satu sumber data yang menggunakan Suspense:

- Pengambilan data yang menggunakan Suspense dengan framework seperti [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) dan [Next.js](https://nextjs.org/docs/advanced-features/react-18)
- Kode komponen pemuatan lambat dengan [`lazy`](/reference/react/lazy)

[Pelajari lebih lanjut tentang Suspense dan batasannya.](/reference/react/Suspense)

</Note>


Dalam contoh ini, komponen `SearchResults` [ditangguhkan](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) saat mengambil hasil penelusuran. Coba ketik `"a"`, tunggu hasilnya, lalu edit menjadi `"ab"`. Hasil untuk `"a"` diganti dengan fallback pemuatan.

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

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// itu belum tersedia di React versi stabil.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah kerangka kerja
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

// Ini adalah solusi untuk bug agar demo berjalan.
// TODO: ganti dengan implementasi nyata saat bug diperbaiki.
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
// Catatan: cara Anda melakukan pengambilan data bergantung pada
// kerangka kerja yang Anda gunakan bersama Suspense.
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
  // Tambahkan penundaan palsu agar menunggu terlihat.
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

Pola UI alternatif yang umum adalah *menangguhkan* pembaruan daftar hasil dan terus menampilkan hasil sebelumnya hingga hasil baru siap. Panggil `useDeferredValue` untuk meneruskan versi kueri yang ditangguhkan:

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

`query` akan segera diperbarui, sehingga input akan menampilkan nilai baru. Namun, `deferredQuery` akan mempertahankan nilai sebelumnya sampai data telah dimuat, sehingga `SearchResults` akan menampilkan hasil lama untuk beberapa saat.

Masukkan `"a"` pada contoh di bawah, tunggu hasil dimuat, lalu edit input menjadi `"ab"`. Perhatikan bagaimana alih-alih cadangan Suspense, Anda sekarang melihat daftar hasil basi hingga hasil baru dimuat:

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

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Catatan: komponen ini ditulis menggunakan API eksperimental
// itu belum tersedia di React versi stabil.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah kerangka kerja
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

// Ini adalah solusi untuk bug agar demo berjalan.
// TODO: ganti dengan implementasi nyata saat bug diperbaiki.
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
// Catatan: cara Anda melakukan pengambilan data bergantung pada
// kerangka kerja yang Anda gunakan bersama Suspense.
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
  // Tambahkan penundaan palsu agar menunggu terlihat.
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

<DeepDive>

#### Bagaimana menangguhkan nilai bekerja dibalik layar? {/*how-does-deferring-a-value-work-under-the-hood*/}

Anda dapat menganggapnya terjadi dalam dua langkah:

1. **Pertama, React me-*render* ulang dengan `query` (`"ab"` baru) tetapi dengan `deferredQuery` lama (masih `"a"`).** Nilai `deferredQuery`, yang Anda berikan ke daftar hasil, adalah *ditangguhkan:* itu "tertinggal" dari nilai `query`.

2. **Di latar belakang, React mencoba me-*render* ulang dengan *baik* `query` dan `deferredQuery` diperbarui ke `"ab"`.** Jika render ulang ini selesai, React akan menampilkannya di layar. Namun, jika ditangguhkan (hasil untuk `"ab"` belum dimuat), React akan mengabaikan upaya *rendering* ini, dan mencoba lagi render ulang ini setelah data dimuat. Pengguna akan terus melihat nilai yang ditangguhkan hingga data siap.

Render "latar belakang" yang ditangguhkan dapat diinterupsi. Misalnya, jika Anda mengetik input lagi, React akan mengabaikannya dan memulai kembali dengan nilai baru. React akan selalu menggunakan nilai terbaru yang diberikan.

Perhatikan bahwa masih ada permintaan jaringan per setiap penekanan tombol. Apa yang ditangguhkan di sini adalah menampilkan hasil (sampai siap), bukan permintaan jaringan itu sendiri. Bahkan jika pengguna terus mengetik, respons untuk setiap ketukan tombol akan di-cache, sehingga menekan Backspace akan instan dan tidak mengambil lagi.

</DeepDive>

---

### Menandakan bahwa konten tersebut sudah basi {/*indicating-that-the-content-is-stale*/}

Pada contoh di atas, tidak ada indikasi bahwa daftar hasil kueri terbaru masih dimuat. Ini dapat membingungkan pengguna jika hasil baru membutuhkan waktu untuk dimuat. Untuk membuatnya lebih jelas bagi pengguna bahwa daftar hasil tidak cocok dengan kueri terbaru, Anda dapat menambahkan indikasi visual saat daftar hasil basi ditampilkan:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Dengan perubahan ini, segera setelah Anda mulai mengetik, daftar hasil basi menjadi sedikit redup hingga daftar hasil baru dimuat. Anda juga bisa menambahkan transisi CSS untuk menangguhkan peredupan agar terasa bertahap, seperti pada contoh di bawah ini:

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
        Cari album:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Memuat...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
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
// itu belum tersedia di React versi stabil.

// Untuk contoh realistis yang dapat Anda ikuti hari ini, cobalah kerangka kerja
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

// Ini adalah solusi untuk bug agar demo berjalan.
// TODO: ganti dengan implementasi nyata saat bug diperbaiki.
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
// Catatan: cara Anda melakukan pengambilan data bergantung pada
// kerangka kerja yang Anda gunakan bersama Suspense.
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
  // Tambahkan penundaan palsu agar menunggu terlihat.
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

---

### Menangguhkan *rendering* ulang untuk bagian UI {/*deferring-re-rendering-for-a-part-of-the-ui*/}

Anda juga dapat menerapkan `useDeferredValue` sebagai pengoptimalan kinerja. Ini berguna ketika bagian dari UI Anda lambat untuk di-*render* ulang, tidak ada cara mudah untuk mengoptimalkannya, dan Anda ingin mencegahnya memblokir UI lainnya.

Bayangkan Anda memiliki bidang teks dan komponen (seperti bagan atau daftar panjang) yang di-*render* ulang pada setiap penekanan tombol:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

Pertama, optimalkan `SlowList` untuk melewati *rendering* ulang saat propertinya sama. Untuk melakukannya, [bungkus dalam `memo`:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

Namun, ini hanya membantu jika props `SlowList` *sama* dengan selama render sebelumnya. Masalah yang Anda hadapi sekarang adalah lambat saat *berbeda*, dan saat Anda benar-benar perlu menampilkan keluaran visual yang berbeda.

Konkritnya, masalah kinerja utama adalah setiap kali Anda mengetik ke input, `SlowList` menerima properti baru, dan me-*render* ulang seluruh pohonnya membuat pengetikan terasa tersendat. Dalam hal ini, `useDeferredValue` memungkinkan Anda memprioritaskan pembaruan input (yang harus cepat) daripada memperbarui daftar hasil (yang diizinkan lebih lambat):

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

Ini tidak mempercepat *rendering* ulang `SlowList`. Namun, ini memberi tahu React bahwa me-*render* ulang daftar dapat diturunkan prioritasnya sehingga tidak memblokir penekanan tombol. Daftar akan "tertinggal" input dan kemudian "mengejar". Seperti sebelumnya, React akan berusaha memperbarui daftar sesegera mungkin, tetapi tidak akan menghalangi pengguna untuk mengetik.

<Recipes titleText="Perbedaan antara useDeferredValue dan rendering ulang yang tidak dioptimalkan" titleId="examples">

#### Render ulang daftar yang ditangguhkan {/*deferred-re-rendering-of-the-list*/}

Dalam contoh ini, setiap item dalam komponen `SlowList` **diperlambat secara artifisial** sehingga Anda dapat melihat bagaimana `useDeferredValue` membuat input tetap responsif. Ketik input dan perhatikan bahwa mengetik terasa cepat sementara daftar "tertinggal".

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log pada konsol sekali. Perlambatan sebenarnya ada di dalam SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Masuk sekali. Perlambatan sebenarnya ada di dalam SlowItem.
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### Render ulang daftar yang tidak dioptimalkan {/*unoptimized-re-rendering-of-the-list*/}

Dalam contoh ini, setiap item dalam komponen `SlowList` **diperlambat secara artifisial**, tetapi tidak ada `useDeferredValue`.

Perhatikan bagaimana mengetik input terasa sangat tersendat. Ini karena tanpa `useDeferredValue`, setiap penekanan tombol memaksa seluruh daftar untuk segera di-*render* ulang dengan cara yang tidak dapat disela.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log pada konsol sekali. Perlambatan sebenarnya ada di dalam SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Tidak melakukan apa pun selama 1 md per item untuk meniru kode yang sangat lambat
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

Optimalisasi ini membutuhkan `SlowList` untuk dibungkus dengan [`memo`.](/reference/react/memo) Hal ini karena setiap kali `text` berubah, React harus dapat me-*render* ulang komponen induk dengan cepat. Selama pe-*render*-an ulang itu, `deferredText` masih memiliki nilai sebelumnya, jadi `SlowList` dapat melewati pe-*render*-an ulang (propnya tidak berubah). Tanpa [`memo`,](/reference/react/memo) itu harus di-*render* ulang, mengalahkan poin pengoptimalan.

</Pitfall>

<DeepDive>

#### Bagaimana penangguhan nilai berbeda dari debouncing dan throttling? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

Ada dua teknik pengoptimalan umum yang mungkin pernah Anda gunakan sebelumnya dalam skenario ini:

- *Debouncing* berarti Anda akan menunggu pengguna berhenti mengetik (mis. sesaat) sebelum memperbarui daftar.
- *Throttling* berarti Anda memperbarui daftar sesekali (mis. paling banyak sekali dalam satu detik).

Meskipun teknik ini membantu dalam beberapa kasus, `useDeferredValue` lebih cocok untuk mengoptimalkan *rendering* karena sangat terintegrasi dengan React itu sendiri dan beradaptasi dengan perangkat pengguna.

Tidak seperti debouncing atau throttling, ini tidak memerlukan pemilihan penundaan tetap. Jika perangkat pengguna cepat (misalnya laptop yang kuat), *rendering* ulang yang ditangguhkan akan segera terjadi dan tidak akan terlihat. Jika perangkat pengguna lambat, daftar akan "tertinggal" input secara proporsional dengan seberapa lambat perangkat tersebut.

Selain itu, tidak seperti *debouncing* atau *throttling*, *rendering* ulang yang ditangguhkan yang dilakukan oleh `useDeferredValue` dapat diinterupsi secara *default*. Ini berarti bahwa jika React sedang me-*render* ulang daftar besar, tetapi pengguna membuat *keystroke* lain, React akan mengabaikan *render* ulang itu, menangani *keystroke*, dan kemudian mulai me-*render* di latar belakang lagi. Sebaliknya, *debouncing* dan *throttling* masih menghasilkan pengalaman tersendat karena keduanya *memblokir:* keduanya hanya menangguhkan momen saat me-*render* memblokir *keystroke*.

Jika pekerjaan yang Anda optimalkan tidak terjadi selama *rendering*, *debouncing* dan *throttling* tetap berguna. Misalnya, mereka dapat membiarkan Anda memecat lebih sedikit permintaan jaringan. Anda juga dapat menggunakan teknik ini bersama-sama.

</DeepDive>
