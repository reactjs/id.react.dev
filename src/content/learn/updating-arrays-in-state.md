---
title: Memperbarui Senarai pada State
---

<Intro>

Senarai (*array*) pada JavaScript dapat berubah, tetapi ketika Anda menyimpannya dalam state, Anda harus memperlakukannya sebagai tidak dapat diubah. Sama seperti objek, ketika Anda ingin memperbarui sebuah senarai yang tersimpan pada state, Anda harus membuat yang baru (atau membuat salinan dari yang sudah ada), kemudian mengatur state menggunakan senarai baru.
</Intro>

<YouWillLearn>

- Cara menambah, menghapus, atau mengubah item dalam senarai pada React state
- Cara memperbarui objek di dalam senarai
- Cara agar penyalinan senarai tidak terlalu berulang menggunakan Immer

</YouWillLearn>

## Memperbarui senarai tanpa mutasi {/*updating-arrays-without-mutation*/}

Dalam JavaScript, senarai hanyalah salah satu jenis objek. [Sama seperti objek](/learn/updating-objects-in-state), **pada React state Anda harus memperlakukan senarai sebagai *read-only*.** Ini berarti Anda tidak boleh menetapkan ulang item di dalam senarai seperti `arr[0] = 'bird'`, dan Anda juga tidak boleh menggunakan metode yang mengubah senarai, seperti `push()` dan `pop()`.

Sebagai gantinya, setiap kali Anda ingin memperbarui sebuah senarai, Anda harus mengoper senarai *baru* ke pengaturan fungsi state Anda. Untuk melakukannya, Anda bisa membuat senarai baru dari senarai asli pada state Anda dengan memanggil metode non-mutasi seperti `filter()` dan `map()`. Kemudian Anda dapat mengatur state Anda ke senarai baru yang sudah dihasilkan.

Berikut adalah tabel referensi operasi umum untuk senarai. Saat berurusan dengan senarai di dalam React state, Anda harus menghindari metode di kolom kiri, dan memilih metode di kolom kanan:

|                | hindari (mutasi senarai)              | pilih (menghasilkan senarai baru)                                               |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| menambahkan    | `push`, `unshift`                     | `concat`, `[...arr]` sintaksis penyebaran ([contoh](#adding-to-an-array))       |
| menghapus      | `pop`, `shift`, `splice`              | `filter`, `slice` ([contoh](#removing-from-an-array))                           |
| mengganti      | `splice`, `arr[i] = ...` *assignment* | `map` ([contoh](#replacing-items-in-an-array))                                  |
| mengurutkan    | `reverse`, `sort`                     | menyalin senarai terlebih dahulu ([contoh](#making-other-changes-to-an-array)) |

Atau, Anda dapat menggunakan [use Immer](#write-concise-update-logic-with-immer) yang memungkinkan Anda untuk menggunakan metode dari kedua kolom.

<Pitfall>

Sayangnya, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) dan [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) diberi nama yang mirip tetapi sangat berbeda:

* `slice` memungkinkan Anda menyalin senarai atau bagian darinya.
* `splice` **memutasi** senarai (untuk menyisipkan atau menghapus item).

Pada React, Anda akan lebih sering menggunakan `slice` (tanpa p!) karena Anda tidak ingin memutasi objek atau senarai pada state. [Memperbarui Objek](/learn/updating-objects-in-state) menjelaskan apa itu mutasi dan mengapa itu tidak direkomendasikan untuk state.

</Pitfall>

### Menambahkan ke senarai {/*adding-to-an-array*/}

`push()` akan memutasi senarai, yang mana tidak Anda inginkan:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Pematung yang menginspirasi:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Tambah</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Sebagai gantinya, buat senarai *baru* yang berisi item yang sudah ada *dan* item baru di bagian akhir. Ada beberapa cara untuk melakukan ini, tapi yang paling mudah adalah dengan menggunakan `...` sintaksis [penyebaran senarai](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Ganti state
  [ // dengan sebuah senarai baru
    ...artists, // yang berisi item yang sudah ada
    { id: nextId++, name: name } // dan item baru di bagian akhir
  ]
);
```

Sekarang sudah berfungsi dengan benar:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Pematung yang menginspirasi:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Tambah</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Sintaksis penyebaran senarai juga memungkinkan Anda menambahkan item dengan menempatkannya *sebelum* item asli `...artists`:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Letakkan item lama di akhir
]);
```

Dengan cara ini, penyebaran dapat melakukan `push()` dengan menambahkan ke akhir senarai dan `unshift()` dengan menambahkan ke awal senarai. Cobalah pada *sandbox* di atas!

### Menghapus dari senarai {/*removing-from-an-array*/}

Cara termudah untuk menghapus item dari senarai adalah dengan *memfilternya*. Dengan kata lain, Anda akan menghasilkan senarai baru yang tidak berisi item tersebut. Untuk melakukannya, gunakan metode `filter`, misalnya:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Pematung yang menginspirasi:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Klik tombol "Hapus" beberapa kali, dan lihat penanganan kliknya.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Di sini, `artists.filter(a => a.id !== artist.id)` berarti "buat sebuah senarai yang berisi para artis yang memiliki *ID* berbeda dari `artist.id`". Dengan kata lain, tombol "Hapus" pada setiap artis akan memfilter *artis tersebut* dari senarai, lalu meminta render ulang dengan senarai yang dihasilkan. Ingat bahwa `filter` tidak mengubah senarai asli.

### Mengubah sebuah senarai {/*transforming-an-array*/}

Jika Anda ingin mengubah beberapa atau semua item dari senarai, Anda dapat menggunakan `map()` untuk membuat senarai **baru**. Fungsi yang Anda berikan ke `map` dapat memutuskan apa yang harus dilakukan dengan setiap item, berdasarkan datanya atau indeksnya (atau keduanya).

Dalam contoh ini, sebuah senarai menyimpan koordinat dua lingkaran dan sebuah persegi. Saat Anda menekan tombol, maka hanya akan menggeser lingkaran ke bawah sebanyak 50 piksel. Ini dilakukan dengan menghasilkan senarai data baru menggunakan `map()`:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // Tidak ada perubahan
        return shape;
      } else {
        // Kembalikan koordinat lingkaran baru 50px ke bawah
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Render ulang menggunakan senarai baru
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Geser lingkarang ke bawah!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Mengganti item dalam senarai {/*replacing-items-in-an-array*/}

Sangat umum untuk ingin mengganti satu atau lebih item dalam senarai. *Assignments* seperti `arr[0] = 'bird'` memutasi senarai asli, jadi sebagai gantinya gunakanlah `map`.

Untuk mengganti item, buat senarai baru dengan `map`. Di dalam fungsi `map`, Anda akan menerima indeks item sebagai argumen kedua. Gunakan untuk memutuskan apakah akan mengembalikan item asli (argumen pertama) atau yang lainnya:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Penambahan saat diklik
        return c + 1;
      } else {
        // Sisanya tidak berubah
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Menyisipkan ke dalam senarai {/*inserting-into-an-array*/}

Terkadang, Anda mungkin ingin menyisipkan item pada posisi tertentu yang bukan di awal maupun di akhir. Untuk melakukan ini, Anda dapat menggunakan sintaksis penyebaran senarai `...` bersama dengan metode `slice()`. Metode `slice()` memungkinkan Anda untuk memotong "bagian" dari senarai. Untuk menyisipkan item, Anda akan membuat senarai yang menyebarkan "bagian" *sebelum* titik penyisipan, lalu item baru, lalu selebihnya dari senarai asli.

Dalam contoh ini, tombol sisipkan selalu menyisipkan pada indeks `1`:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Bisa dari indeks berapa saja
    const nextArtists = [
      // Item sebelum titik penyisipan:
      ...artists.slice(0, insertAt),
      // Item baru:
      { id: nextId++, name: name },
      // Item setelah titik penyisipan:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Pematung yang menginspirasi:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Sisipkan
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Membuat perubahan lain ke senarai {/*making-other-changes-to-an-array*/}

Ada beberapa hal yang tidak dapat Anda lakukan dengan sintaksis penyebaran dan metode non-mutasi seperti `map()` dan `filter()` saja. Misalnya, Anda mungkin ingin membalikkan atau mengurutkan senarai. Metode JavaScript `reverse()` dan `sort()` memutasikan senarai asli, sehingga Anda tidak dapat menggunakannya secara langsung.

**Namun, Anda dapat menyalin senarai terlebih dahulu, lalu mengubahnya.**

Sebagai contoh:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Balik
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Di sini, Anda menggunakan sintaksis penyebaran `[...list]` untuk membuat salinan senarai asli terlebih dahulu. Sekarang setelah Anda memiliki salinannya, Anda dapat menggunakan metode mutasi seperti `nextList.reverse()` atau `nextList.sort()`, atau bahkan menetapkan item individual dengan `nextList[0] = "something"`.

Namun, **meskipun Anda menyalin sebuah senarai, Anda tidak dapat mengubah item yang ada *di dalamnya* secara langsung,** Ini karena penyalinan dangkal—senarai baru akan berisi item yang sama dengan yang asli. Jadi jika Anda memodifikasi objek di dalam senarai yang disalin, Anda memutasi state yang ada. Misalnya, kode seperti ini adalah masalah.

```js
const nextList = [...list];
nextList[0].seen = true; // Masalah: memutasi list[0]
setList(nextList);
```

Meskipun `nextList` dan `list` adalah dua senarai yang berbeda, **`nextList[0]` dan `list[0]` menunjuk ke objek yang sama.** Jadi dengan mengubah `nextList[0].seen`, Anda juga mengubah `list[0].seen`. Ini adalah mutasi state, yang harus Anda hindari! Anda dapat mengatasi masalah ini dengan cara yang mirip dengan [memperbarui objek bersarang JavaScript](/learn/updating-objects-in-state#updating-a-nested-object)—dengan menyalin setiap item yang ingin Anda ubah alih-alih memutasinya. Begini caranya.

## Memperbarui objek di dalam senarai {/*updating-objects-inside-arrays*/}

Objek *tidak benar-benar* terletak "di dalam" senarai. Mereka mungkin terlihat berada "di dalam" pada kode, tetapi setiap objek dalam senarai adalah nilai yang terpisah, yang "ditunjukkan" oleh senarai. Inilah mengapa Anda harus berhati-hati saat mengubah bagian bersarang seperti `list[0]`. Daftar *artwork* orang lain mungkin menunjuk ke elemen senarai yang sama!

**Ketika mengubah state yang bersarang, Anda harus membuat salinan mulai dari titik di mana Anda ingin mengubah, hingga ke level teratas.** Mari kita lihat bagaimana ini bekerja.

Dalam contoh ini, dua daftar *artwork* terpisah memiliki state awal yang sama. Mereka seharusnya terisolasi, tetapi karena adanya mutasi, state mereka secara tidak sengaja dibagikan, sehingga mencentang kotak di satu daftar akan memengaruhi daftar lainnya:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Masalahnya ada di kode seperti ini:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Masalah: memutasikan item yang sudah ada
setMyList(myNextList);
```

Meskipun senarai `myList` itu sendiri baru, *item-itemnya* sama dengan senarai `myList` yang asli. Jadi mengubah `artwork.seen` akan mengubah item *artwork asli*. Item *artwork* itu juga ada di `yourList`, yang menyebabkan bug. Bug seperti ini mungkin sulit untuk dipikirkan, tetapi untungnya bug tersebut akan hilang jika Anda menghindari perubahan pada state *(mutating state)*.

**Anda dapat menggunakan `map` untuk mengganti item lama dengan versi terbarunya tanpa mutasi.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Buat objek baru dengan perubahan
    return { ...artwork, seen: nextSeen };
  } else {
    // Tidak ada perubahan
    return artwork;
  }
}));
```

Di sini, `...` adalah sintaksis penyebaran objek yang digunakan untuk [membuat salinan objek](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax).

Dengan pendekatan ini, item state yang ada tidak akan dimutasi, dan bug teratasi:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Buat objek baru dengan perubahan
        return { ...artwork, seen: nextSeen };
      } else {
        // Tidak ada perubahan
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Buat objek baru dengan perubahan
        return { ...artwork, seen: nextSeen };
      } else {
        // Tidak ada perubahan
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Secara umum, **Anda sebaiknya hanya memutasi objek yang baru saja Anda buat.** Jika Anda memasukkan *artwork baru*, Anda dapat memutasinya, tetapi jika Anda berurusan dengan state yang sudah ada, Anda perlu membuat salinannya.

### Menulis logika pembaruan singkat dengan Immer {/*write-concise-update-logic-with-immer*/}

Memperbarui senarai bersarang tanpa mutasi bisa jadi sedikit berulang. [Sama seperti objek:](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Secara umum, Anda tidak perlu memperbarui state lebih dari beberapa level kedalaman. Jika state objek Anda sangat dalam, Anda mungkin ingin [menyusunnya kembali secara berbeda](/learn/choosing-the-state-structure#avoid-deeply-nested-state) sehingga menjadi rata.
- Jika Anda tidak ingin mengubah struktur state Anda, Anda mungkin lebih memilih untuk menggunakan [Immer](https://github.com/immerjs/use-immer), yang memungkinkan Anda menulis menggunakan sintaksis yang mudah tetapi dapat mengubah state dan mengurus penyalinannya untuk Anda.

Berikut adalah contoh Art Bucket List yang ditulis ulang dengan Immer:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
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

Perhatikan bagaimana dengan Immer, **mutasi seperti `artwork.seen = nextSeen` sekarang baik-baik saja:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Ini karena Anda tidak mengubah state *aslinya*, tetapi Anda mengubah objek `draft` khusus yang disediakan oleh Immer. Demikian pula, Anda dapat menerapkan metode mutasi seperti `push()` dan `pop()` ke konten `draft`.

Di belakang layar, Immer selalu membuat state berikutnya dari awal sesuai dengan perubahan yang Anda lakukan pada `draft`. Ini membuat *event handler* Anda sangat ringkas tanpa pernah mengubah state.

<Recap>

- Anda dapat memasukkan senarai ke dalam state, tetapi Anda tidak dapat mengubahnya.
- Alih-alih memutasi senarai, buat versi *barunya*, dan perbarui state tersebut.
- Anda dapat menggunakan penyebaran sintaksis senarai `[...arr, newItem]` untuk membuat senarai dengan item baru.
- Anda dapat menggunakan `filter()` dan `map()` untuk membuat senarai baru dengan item yang difilter atau diubah.
- Anda dapat menggunakan Immer untuk menjaga agar kode Anda tetap ringkas.

</Recap>



<Challenges>

#### Memperbarui item di keranjang belanja {/*update-an-item-in-the-shopping-cart*/}

Isi logika `handleIncreaseClick` sehingga saat menekan "+" akan meningkatkan angka yang sesuai:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Anda dapat menggunakan fungsi `map` untuk membuat senarai baru, lalu menggunakan penyebaran sintaksis objek `...` untuk membuat salinan objek yang diubah untuk senarai baru:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Menghapus item dari keranjang belanja {/*remove-an-item-from-the-shopping-cart*/}

Keranjang belanja ini memiliki tombol "+" yang berfungsi, tetapi tombol "–" tidak melakukan apa-apa. Anda perlu menambahkan *event handler* ke dalamnya sehingga saat menekannya akan mengurangi `count` produk yang sesuai. Jika Anda menekan "–" saat `count` 1, produk akan secara otomatis dihapus dari keranjang. Pastikan itu tidak pernah menunjukkan 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Pertama-tama Anda dapat menggunakan `map` untuk menghasilkan senarai baru, lalu `filter` untuk menghapus produk dengan `count` yang disetel ke 0:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Perbaiki mutasi menggunakan metode nonmutatif {/*fix-the-mutations-using-non-mutative-methods*/}

Pada contoh ini, semua *event handler* di App.js menggunakan mutasi. Akibatnya, mengedit dan menghapus todos tidak berfungsi. Tulis ulang `handleAddTodo`, `handleChangeTodo`, dan `handleDeleteTodo` untuk menggunakan metode *non-mutatif*:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Tambah todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Tambah</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Simpan
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Hapus
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

Pada `handleAddTodo`, Anda bisa menggunakan sintaksis penyebaran senarai. Pada `handleChangeTodo`, Anda dapat membuat senarai baru dengan `map`. Pada `handleDeleteTodo`, Anda dapat membuat senarai baru dengan `filter`. Sekarang daftar berfungsi dengan benar:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Tambah todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Tambah</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Simpan
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Hapus
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Perbaiki mutasi menggunakan Immer {/*fix-the-mutations-using-immer*/}

Ini adalah contoh yang sama seperti pada tantangan sebelumnya. Kali ini, perbaiki mutasi dengan menggunakan Immer. Untuk kemudahan Anda, `useImmer` sudah diimpor, jadi Anda perlu mengubah variabel state `todos` untuk menggunakannya.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Tambah todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Tambah</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Simpan
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Hapus
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
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

<Solution>

Dengan Immer, Anda dapat menulis kode dengan gaya yang dapat bermutasi, selama Anda hanya memutasi bagian-bagian dari `draft` yang diberikan oleh Immer. Di sini, semua mutasi dilakukan pada `draft`, jadi kode berfungsi:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Tambah todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Tambah</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Simpan
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Hapus
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
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

Anda juga dapat mencampur dan mencocokkan pendekatan *mutatif* dan *non-mutatif* dengan Immer.

Misalnya, dalam versi ini `handleAddTodo` diimplementasikan dengan mengubah `draft` Immer, sedangkan `handleChangeTodo` dan `handleDeleteTodo` menggunakan metode `map` dan `filter` *non-mutatif*:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Tambah todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Tambah</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Simpan
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Hapus
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
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

Dengan Immer, Anda dapat memilih gaya yang terasa paling alami untuk setiap casing terpisah.

</Solution>

</Challenges>
