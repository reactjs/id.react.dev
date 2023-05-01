---
title: Menambahkan Interaktivitas
---

<Intro>

Beberapa hal di layar berubah mengikuti masukan dari pengguna. Contohnya, mengeklik sebuah galeri gambar bisa mengganti gambar yang sedang aktif. Di React, data yang berubah seiring waktu disebut *state.* Anda dapat menambahkan state ke komponen apapun, dan mengubahnya sesuai kebutuhan. Di bab ini, Anda akan belajar cara menulis komponen yang dapat menangani interaksi, mengubah state yang dimilikinya, dan menampilkan keluaran yang berbeda seiring berjalannya waktu.

</Intro>

<YouWillLearn isChapter={true}>

* [Cara menangani events yang di-mulai oleh pengguna](/learn/responding-to-events)
* [Cara membuat komponen "mengingat" informasi dengan menggunakan state](/learn/state-a-components-memory)
* [Cara React memperbaharui UI dalam dua fase](/learn/render-and-commit)
* [Mengapa state tidak langsung terbaharui setelah Anda mengubahnya](/learn/state-as-a-snapshot)
* [Cara mengantrikan beberapa perubahan state](/learn/queueing-a-series-of-state-updates)
* [Cara mengubah object di dalam state](/learn/updating-objects-in-state)
* [Cara mengubah array di dalam state](/learn/updating-arrays-in-state)

</YouWillLearn>

## Menanggapi events {/*responding-to-events*/}

React memungkinkan Anda untuk menambakan *event handlers* ke JSX Anda. *Event handlers* adalah fungsi milik Anda yang akan dipanggil sebagai respon terhadap interaksi dari pengguna seperti klik, *hover*, fokus pada masukan form, dan lain-lain.

Komponen bawaan seperti `<button>` hanya mendukung *event* bawaan dari peramban seperti `onClick`. Namun, Anda juga dapat membuat komponen Anda sendiri, dan memberikannya *prop event handler* dengan nama apapun, spesifik terhadap aplikasi Anda.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Memutar!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Putar Film
      </Button>
      <Button onClick={onUploadImage}>
        Upload Gambar
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

<LearnMore path="/learn/responding-to-events">

Baca **[Menangani Event](/learn/responding-to-events)** untuk mempelajari cara menambahkan *event handler*.

</LearnMore>

## State: Ingatan dari komponen {/*state-a-components-memory*/}

Komponen sering perlu mengubah apa yang ada di layar sebagai hasil dari sebuah interaksi. Mengetik kedalam form dapat mengubah sebuah kolom masukan, mengeklik "next" pada sebuah *carousel* gambar mengubah gambar yang sedang ditampilkan, mengeklik "beli" menambahkan sebuah produk kedalam keranjang belanja. Komponen perlu "mengingat" berbagai hal: nilai masukan saat ini, gambar saat ini, keranjang belanja. Di React, jenis ingatan komponen seperti ini disebut *state.* 

Anda dapat menambahkan state kepada komponen dengan menggunakan Hook [`useState`](/reference/react/useState). *Hooks* adalah fungsi spesial yang memungkinkan komponen Anda untuk menggunakan fitur-fitur dari React (state adalah salah satu fitur tersebut). Hook `useState` memungkinkan Anda mendeklarasikan sebuah variabel state. Fungsi ini menerima state awal dan mengeluarkan sepasang nilai: state saat ini, dan sebuah fungsi *state setter*  yang memungkinkan Anda untuk mengubah state tersebut.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Berikut adalah cara galeri gambar menggunakan dan mengubah state saat diklik:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Selanjutnya
      </button>
      <h2>
        <i>{sculpture.name} </i>
        oleh {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} dari {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Sembunyikan' : 'Tampilkan'} detail
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

Baca **[State: Ingatan dari komponen](/learn/state-a-components-memory)** untuk mempelajari cara untuk mengingat sebuah nilai dan mengubahnya saat berinteraksi.

</LearnMore>

## Render dan commit {/*render-and-commit*/}

Sebelum komponen Anda ditampilkan di layar, mereka harus di *render* oleh React. Memahami langkah-langkah dalam proses ini akan membantu Anda berpikir tentang bagaimana kode Anda akan dijalankan dan menjelaskan perilakunya.

Bayangkan bahwa komponen Anda adalah koki di dapur, menyusun hidangan lezat dari bahan-bahan dasar. Dalam skenario ini, React adalah pelayan yang mengajukan permintaan dari pelanggan dan membawakan pesanan mereka. Proses permintaan dan pelayanan UI ini memiliki tiga langkah:

1. **Memicu** *render* (mengirimkan pesanan pelanggan ke dapur)
2. **Me-*render*** komponen (menyiapkan pesanan di dapur)
3. **Commit** ke DOM (menempatkan pesanan di meja)

<IllustrationBlock sequential>
  <Illustration caption="Memicu" alt="React sebagai pelayan di restoran, mengambil pesanan dari pengguna dan mengantarkannya ke Dapur Komponent" src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption={<>Me-<i>render</i></>} alt="Koki Card memberikan React komponen Card baru." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React mengantarkan Card ke pengguna di meja mereka" src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Baca **[Render dan Commit](/learn/render-and-commit)** untuk mempelajari *lifecycle* dari perubahan UI.

</LearnMore>

## State sebagai snapshot {/*state-as-a-snapshot*/}

Tidak seperti variabel Javascript biasa, state di React berperilaku lebih seperti *snapshot*. Mengubah state tidaklah mengubah variabel state yang Anda miliki sekarang, tetapi akan memicu *render* ulang. Ini bisa mengejutkan pada awalnya!

```js
console.log(count);  // 0
setCount(count + 1); // Meminta render ulang dengan 1
console.log(count);  // Masih 0!
```

Perilaku ini akan membantu Anda menghindari *bug* yang susah ditemukan. Berikut adalah aplikasi chat sederhana. Coba tebak apa yang terjadi jika Anda menekan "Kirim" terlebih dahulu dan *kemudian* mengubah penerima menjadi Bob. Nama siapa yang akan muncul di `alert` lima detik kemudian?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Halo');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Anda mengatakan ${message} kepada ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Kepada:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Kirim</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

Baca **[State sebagai Snapshot](/learn/state-as-a-snapshot)** untuk mempelajari mengapa state terlihat "tetap" dan tak berubah di dalam *event handler*.

</LearnMore>

## Mengantrikan serangkaian perubahan state {/*queueing-a-series-of-state-updates*/}

Komponent ini memiliki *bug*: mengeklik "+3" hanya akan menambahkan skor satu kali saja.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Skor: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[State sebagai Snapshot](/learn/state-as-a-snapshot) menjelaskan mengapa ini terjadi. Mengubah state akan meminta *render* ulang baru, tetapi tidak akan mengubah state-nya di kode yang sudah berjalan. Jadi `score` tetap `0` setelah Anda memanggil `setScore(score + 1)`. 

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Anda bisa memperbaiki ini dengan memberikan *updater function* ketika mengubah state. Perhatikan bagaimana mengganti `setScore(score + 1)` dengan `setScore(s => s + 1)` memperbaiki tombol "+3". Cara ini memungkinkan Anda untuk mengantrikan beberapa perubahan state.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Skor: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Baca **[Mengantrikan serangkaian perubahan state](/learn/queueing-a-series-of-state-updates)** untuk mempelajari cara meng-*queue* sebuah rentetan perubahan state.

</LearnMore>

## Mengubah object di dalam state {/*updating-objects-in-state*/}

State bisa memegang berbagai jenis nilai JavaScript, termasuk *object*. Tetapi Anda tidak boleh mengubah *object* dan *array* yang Anda simpan di dalam state React secara langsung. Melainkan, ketika Anda ingin mengubah *object* dan *array*, Anda perlu membuat *object* yang baru (atau membuat salinan dari *object* yang sudah ada), dan kemudian mengubah state-nya untuk menggunakan salinan tersebut.


Biasanya, Anda akan menggunakan sintaks *spreads* `...` untuk menyalin *object* dan *array* yang ingin Anda ubah. Contohnya, mengubah *object* yang bersarang bisa terlihat seperti ini:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Nama:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Judul:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Kota:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Gambar:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' oleh '}
        {person.name}
        <br />
        (berada di {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Jika menyalin *object* di kode terasa terlalu ribet, Anda bisa menggunakan library seperti [Immer](https://github.com/immerjs/use-immer) untuk mengurangi kode yang berulang-ulang:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Nama:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Judul:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Kota:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Gambar:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' oleh '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

Baca **[Mengubah Object di dalam State](/learn/updating-objects-in-state)** untuk mempelajari cara mengubah *object* dengan benar.

</LearnMore>

## Mengubah array di dalam state {/*updating-arrays-in-state*/}

Array adalah tipe object lain yang bersifat *mutable* di Javascript yang bisa Anda simpan di state dan harus diperlakukan sebagai *read-only*. Seperti *object*, ketika Anda ingin mengubah *array* yang disimpan di state, Anda perlu membuat *array* baru (atau membuat salinan dari *array* yang sudah ada), dan kemudian mengubah state-nya untuk menggunakan *array* baru tersebut:

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
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Bucket List Seni</h1>
      <h2>Daftar seni untuk dilihat:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
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

Jika menyalin *array* di kode terasa terlalu ribet, Anda bisa menggunakan *library* seperti [Immer](https://github.com/immerjs/use-immer) untuk mengurangi kode yang berulang-ulang:

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
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Bucket List Seni</h1>
      <h2>Daftar seni untuk dilihat:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
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

<LearnMore path="/learn/updating-arrays-in-state">

Baca **[Mengubah Array di dalam State](/learn/updating-arrays-in-state)** untuk mempelajari cara mengubah *array* dengan benar.

</LearnMore>

## Apa selanjutnya? {/*whats-next*/}

Lanjutkan ke [Menanggapi Event](/learn/responding-to-events) untuk mulai membaca bab ini halaman demi halaman!

Atau, jika Anda sudah akrab dengan topik ini, mengapa tidak membaca tentang [Mengatur State](/learn/managing-state)?