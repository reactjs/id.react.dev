---
title: 'Sinkronisasi dengan Effect'
---

<Intro>

Beberapa komponen perlu melakukan sinkronisasi dengan sistem eksternal. Misalkan, Anda mungkin ingin mengontrol komponen di luar React berdasarkan *state* React, mengatur koneksi server, atau mengirim log analitik ketika sebuah komponen muncul di layar. *Effects* memungkinkan Anda menjalankan kode setelah *render* sehingga Anda bisa melakukan sinkronisasi dengan sistem di luar React.

</Intro>

<YouWillLearn>

- Apa itu *Effect*
- Perbedaan *Effect* dengan *event*
- Cara mendeklarasikan *Effect* di dalam komponen
- How to skip re-running an Effect unnecessarily
- Mengapa *Effect* berjalan dua kali di pengembangan (*development*) dan cara memperbaikinya

</YouWillLearn>

## Apa itu *Effect* dan apa perbedaanya dengan *event*? {/*what-are-effects-and-how-are-they-different-from-events*/}

Sebelum kita membahas *Effect*, Anda perlu mengenal dua tipe logika di dalam komponen React:

- **Kode pe-*render*-an** (diperkenalkan di [Menggambarkan Antarmuka Pengguna](/learn/describing-the-ui)) berada di tingkat atas komponen Anda. Inilah di mana Anda mengambil *props* dan *state*, mentransformasinya, dan mengembalikan JSX yang diinginkan di layar. [Kode pe-*render*-an haruslah murni.](/learn/keeping-components-pure) Seperti rumus matematika, ia harus _menghitung_ hasilnya saja, tapi tidak melakukan hal lainnya.

- ***Event handlers*** (diperkenalkan di [Menambahkan Interaktivitas](/learn/adding-interactivity)) adalah fungsi bersarang di dalam komponen yang *melakukan* berbagai hal dan bukan hanya menghitungnya. Sebuah *event handler* dapat memperbarui bidang input, mengirimkan permintaan HTTP POST untuk membeli produk, atau menavigasi pengguna ke layar lain. *Event handlers* memiliki ["efek samping"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) (yaitu mengubah *state* program) yang dihasilkan dari aksi pengguna tertentu (misalnya, tekanan tombol atau ketikan).

Terkadang hal-hal ini tidak cukup. Bayangkan sebuah komponen `ChatRoom` yang harus melakukan koneksi ke server obrolan (*chat*) ketika ditampilkan di layar. Melakukan koneksi ke server bukanlah penghitungan murni (melainkan efek samping) jadi tidak dapat dilakukan saat proses *render*. Meskipun itu, tidak ada *event* tertentu seperti klik yang akan menampilkan `ChatRoom`.

***Effects* memungkinkan Anda menentukan efek samping yang disebabkan oleh pe-*render*-an itu sendiri, dan bukan oleh *event* tertentu.** Mengirim pesan di ruang obrolan merupakan *event* karena disebabkan secara langsung oleh pengguna yang mengeklik tombol tertentu. Namun, melakukan koneksi server merupakan *Effect* karena harus terjadi tanpa peduli interaksi apapun yang menyebabkan komponen ditampilkan. *Effects* berjalan di akhir [*commit*](/learn/render-and-commit) setelah layar diperbarui. Ini merupakan waktu yang tepat untuk menyinkronkan komponen React dengan sistem eksternal (seperti jaringan atau pustaka pihak ketiga).

<Note>

Di sini dan selanjutnya dalam teks ini, kata "*Effect*" yang dikapitalisasi mengacu kepada definisi khusus React yang dijelaskan di atas, seperti efek samping yang disebabkan oleh proses *render*. Untuk mengacu kepada konsep pemrograman secara keseluruhan, kita akan menggunakan kata "efek samping".

</Note>


## Anda mungkin tidak membutuhkan *Effect* {/*you-might-not-need-an-effect*/}

**Jangan terburu-buru menambahkan *Effects* ke dalam komponen Anda.** Perlu diingat bahwa *Effects* umumnya digunakan untuk "melangkah ke luar" dari kode React Anda dan menyinkronkan dengan sistem *eksternal*. Hal ini termasuk API peramban (*browser*), *widget* pihak ketiga, jaringan, dan lainnya. Apabila *Effect* Anda hanya mengatur *state* berdasarkan *state* lain, [Anda mungkin tidak membutuhkan *Effect*.](/learn/you-might-not-need-an-effect)

## Cara menulis *Effect* {/*how-to-write-an-effect*/}

Untuk menulis *Effect*, ikuti tiga langkah berikut:

1. **Deklarasikan Effect.** Secara bawaan, *Effect* Anda akan berjalan setiap [*commit*](/learn/render-and-commit).
2. **Tentukan dependensi dari Effect.** Kebanyakan *Effect* hanya perlu dijalankan ulang *ketika diperlukan*, bukan setiap render. Misalnya, animasi *fade-in* seharusnya hanya dijalankan ketika sebuah komponen muncul. Menghubungkan dan memutuskan koneksi ke ruang obrolan seharusnya hanya terjadi ketika komponen muncul dan menghilang, atau ketika ruang obrolan berubah. Anda akan belajar cara mengontrolnya dengan menentukan *dependensi.*
3. **Tambahkan pembersihan (*cleanup*) jika diperlukan.** Beberapa *Effect* perlu menentukan cara menghentikan, membatalkan, atau membersihkan apa pun yang sedang dilakukan. Misalnya, "sambungkan koneksi" membutuhkan "lepaskan koneksi", "berlangganan" memerlukan "hentikan langganan", dan "*fetch*" membutuhkan "batal" atau "abaikan". Anda akan belajar cara melakukan hal tersebut dengan mengembalikan *fungsi pembersihan*.

Mari kita lihat langkah-langkah berikut secara detil.

### Langkah 1: Deklarasikan Effect {/*step-1-declare-an-effect*/}

Untuk mendeklarasikan *Effect* di dalam komponen, impor [Hook `useEffect`](/reference/react/useEffect) dari React:

```js
import { useEffect } from 'react';
```

Kemudian, panggil Hook tersebut di atas komponen Anda dan isikan *Effect* tersebut dengan kode:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Kode di dalam blok ini akan dijalankan setelah *setiap* render
  });
  return <div />;
}
```

Setiap kali setelah komponen Anda di-*render*, React akan memperbarui layar *kemudian* menjalankan kode di dalam `useEffect`. Dengan kata lain, **`useEffect` "menunda" sepotong kode agar tidak berjalan sampai *render* tersebut ditampilkan di layar.**

Mari kita lihat bagaimana Anda dapat menggunakan *Effect* untuk melakukan sinkronisasi dengan sistem eksternal. Bayangkan sebuah komponen React `<VideoPlayer>`. Akan lebih baik jika kita dapat mengontrol apakah video sedang diputar atau dijeda dengan mengoper *prop* `isPlaying` ke dalamnya:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

Komponen `VideoPlayer` kustom Anda me-*render* tag bawaan peramban [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video):

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: lakukan sesuatu dengan isPlaying
  return <video src={src} />;
}
```

Namun, tag `<video>` pada peramban tidak memiliki *prop* `isPlaying`. Satu-satunya cara untuk mengontrolnya adalah untuk memanggil metode [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) dan [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) dalam elemen DOM secara manual. **Anda perlu menyinkronkan nilai *prop* `isPlaying`, yang memberitahu apakah video _seharusnya_ sedang diputar, dengan panggilan metode seperti `play()` dan `pause()`.**

Pertama-tama, kita perlu [mendapatkan *ref*](/learn/manipulating-the-dom-with-refs) ke simpul DOM `<video>`.

Anda mungkin tergoda untuk mencoba memanggil `play()` atau `pause()` saat pe-*render*-an, tapi ini tidak benar:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Memanggil ini saat rendering tidak diperbolehlkan.
  } else {
    ref.current.pause(); // Ini juga akan menyebabkan *crash*.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Alasan kode ini tidak benar adalah ia mencoba melakukan sesuati dengan simpul DOM saat proses *render*. Dalam React, [proses render harus merupakan penghitungan murni](/learn/keeping-components-pure) dari JSX dan tidak boleh mengandung efek samping seperti memodifikasi DOM.

Lebih dari itu, ketika `VideoPlayer` dipanggil pertama kalinya, DOM belum tersedia! Belum ada simpul DOM untuk memanggil `play()` atau `pause()`, karena React tidak mengetahui DOM apa yang perlu dibuat sampai Anda mengembalikan JSX.

Solusinya adalah **membungkus efek samping dengan `useEffect` memindahkannya keluar dari penghitungan proses *render*:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

Dengan membungkus pembaruan DOM di dalam *Effect*, Anda memungkinkan React memperbarui layar terlebih dahulu. Kemudian *Effect* Anda dijalankan.

Ketika komponen `VideoPlayer` Anda di-*render* (baik pertama kalinya atau ketika di-*render* ulang), beberapa hal akan terjadi. Pertama, React akan memperbarui layar, memastikan tag `<video>` berada di dalam DOM dengan *props* yang benar. Kemudian React akan menjalankan *Effect* Anda. Pada akhirnya, *Effect* Anda akan memanggil `play()` atau `pause()` berdasarkan nilai dari `isPlaying`.

Coba tekan Putar/Jeda beberapa kali dan lihat bagaimana pemutar video tetap tersinkron dengan nilai `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Jeda' : 'Putar'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Dalam contoh ini, "sistem eksternal" yang Anda sinkronisasi ke *state* React adalah API media peramban. Anda dapat menggunakan pendekatan sama untuk membungkus kode lama di luar React (seperti *plugin* jQuery) ke komponen deklaratif React.

Perlu dicatat bahwa mengontrol pemutar video jauh lebih kompleks dalam praktiknya. Memanggil `play()` bisa gagal, pengguna dapat memutar atau menjeda menggunakan kontrol peramban bawaan, dan sebagainya. Contoh ini sangat disederhanakan dan tidak lengkap.

<Pitfall>

Secara bawaan, *Effects* dijalankan setelah *setiap* render. Inilah sebabnya mengapa kode seperti ini akan **menghasilkan perulangan tak terbatas (*infinite loop*):**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

*Effects* dijalankan sebagai *hasil* rendering. Mengatur *state* *memicu* rendering. Mengatur *state* secara langsung dalam suatu *Effect*, seperti mencolokkan stopkontak ke stopkontak itu sendiri. *Effect* berjalan, mengatur *state*, yang menyebabkan *render* ulang, yang menyebabkan *Effect* berjalan, mengatur *state* lagi, yang menyebabkan *render* ulang, dan seterusnya.

Perlu diingat bahwa *Effects* umumnya digunakan untuk "melangkah ke luar" dari kode React Anda dan menyinkronkan dengan sistem *eksternal*. Hal ini termasuk API peramban (*browser*), *widget* pihak ketiga, jaringan, dan lainnya. Apabila *Effect* Anda hanya mengatur *state* berdasarkan *state* lain, [Anda mungkin tidak membutuhkan *Effect*.](/learn/you-might-not-need-an-effect)

*Effects* biasanya *hanya* digunakan untuk menyinkronkan komponen Anda dengan sistem *eksternal*. Jika tidak ada sistem eksternal dan Anda hanya ingin mengatur *state* berdasarkan *state* lain, [Anda mungkin tidak membutuhkan *Effect*.](/learn/you-might-not-need-an-effect)

</Pitfall>

### Langkah 2: Tentukan dependensi dari *Effect* {/*step-2-specify-the-effect-dependencies*/}

Secara bawaan, *Effects* berjalan setelah *setiap* *render*. Seringkali, ini **bukan yang Anda inginkan:**

- Terkadang, lambat. Sinkronisasi dengan sistem eksternal tidak selalu instan, jadi Anda mungkin ingin melewatkannya kecuali jika diperlukan. Misalnya, Anda tidak ingin menyambung kembali ke server obrolan pada setiap penekanan papan ketik.
- Terkadang, tidak benar. Misalnya, Anda tidak ingin memicu animasi *fade-in* komponen pada setiap penekanan papan ketik. Animasi seharusnya hanya diputar satu kali ketika komponen muncul untuk pertama kalinya.

Untuk mendemonstrasikan masalah ini, berikut adalah contoh sebelumnya dengan beberapa panggilan `console.log` dan input teks yang memperbarui *state* komponen induk. Perhatikan bagaimana pengetikan menyebabkan *Effect* dijalankan kembali:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Memanggil video.play()');
      ref.current.play();
    } else {
      console.log('Memanggil video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Jeda' : 'Putar'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Anda dapat memberi tahu React untuk **melewatkan menjalankan ulang *Effect* yang tidak perlu** dengan menspesifikasikan senarai *dependencies* sebagai argumen kedua pada pemanggilan `useEffect`. Mulai dengan menambahkan senarai kosong `[]` ke dalam contoh di atas pada baris 14:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

Anda akan melihat *error* yang mengatakan `React Hook useEffect has a missing dependency: 'isPlaying'`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Memanggil video.play()');
      ref.current.play();
    } else {
      console.log('Memanggil video.pause()');
      ref.current.pause();
    }
  }, []); // This causes an error

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Jeda' : 'Putar'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Masalahnya adalah kode di dalam Effect Anda *tergantung pada* *prop* `isPlaying` untuk memutuskan apa yang harus dilakukan, tetapi ketergantungan ini tidak dideklarasikan secara eksplisit. Untuk memperbaiki masalah ini, tambahkan `isPlaying` ke dalam senarai dependensi:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // Digunakan di sini...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...jadi harus dideklarasikan di sini!
```

Sekarang semua dependensi dideklarasikan, jadi tidak ada *error*. Menentukan `[isPlaying]` sebagai senarai dependensi memberi tahu React ia harus melewati menjalankan ulang *Effect* Anda apabila `isPlaying` sama seperti saat *render* sebelumnya. Dengan perubahan ini, mengetik pada input tidak menyebabkan *Effect* dijalankan ulang, tapi menekan Putar/Jeda akan menyebabkannya:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Memanggil video.play()');
      ref.current.play();
    } else {
      console.log('Memanggil video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Jeda' : 'Putar'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Senarai dependensi dapat berisi lebih dari satu dependensi. React hanya akan melewatkan menjalankan ulang *Effect* jika *semua* dependensi yang Anda tentukan memiliki nilai yang sama persis dengan nilai yang mereka miliki saat render sebelumnya. React membandingkan nilai dependensi menggunakan fungsi pembanding [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Lihat [referensi `useEffect`](/reference/react/useEffect#reference) untuk detailnya.

**Perhatikan bahwa Anda tidak dapat "memilih" dependensi Anda.** Anda akan mendapatkan *lint error* jika dependensi yang Anda tentukan tidak sesuai dengan apa yang diharapkan oleh React berdasarkan kode di dalam *Effect* Anda. Hal ini membantu menangkap banyak *bug* dalam kode Anda. Jika Anda tidak ingin beberapa kode dijalankan ulang, [*edit kode Effect itu sendiri* untuk tidak "membutuhkan" dependensi tersebut.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

Perilaku tanpa senarai dependensi dan dengan senarai dependensi *kosong* `[]` berbeda:

```js {3,7,11}
useEffect(() => {
  // Ini dijalankan setiap render
});

useEffect(() => {
  // Ini hanya dijalankan setiap pemasangan (ketika komponen ditampilkan)
}, []);

useEffect(() => {
  // Ini dijalankan setiap pemasangan *dan juga* ketika a atau b telah berubah sejak render sebelumnya
}, [a, b]);
```

Kita akan mencermati secara dekat, apa arti "pemasangan" dalam langkah berikutnya.

</Pitfall>

<DeepDive>

#### Mengapa ref dihilangkan dari senarai dependensi? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

*Effect* ini menggunakan `ref` *dan* `isPlaying`, tapi hanya `isPlaying` yang dideklarasikan sebagai dependensi:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

Hal ini dikarenakan objek `ref` memiliki *identitas yang stabil:* React menjamin [Anda akan selalu mendapatkan objek yang sama](/reference/react/useRef#returns) dari pemanggilan `useRef` yang sama pada setiap render. Objek tersebut tidak pernah berubah, sehingga tidak akan pernah dengan sendirinya menyebabkan *Effect* dijalankan ulang. Oleh karena itu, tidak masalah apakah Anda menyertakannya atau tidak. Memasukkannya juga tidak masalah:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

[Fungsi `set`](/reference/react/useState#setstate) yang dikembalikan oleh `useState` juga memiliki identitas yang stabil, sehingga Anda akan sering melihat fungsi ini dihilangkan dari dependensi. Jika *linter* mengizinkan Anda menghilangkan sebuah dependensi tanpa kesalahan, maka hal ini aman untuk dilakukan.

Menghilangkan dependensi yang selalu stabil hanya berfungsi ketika linter dapat "melihat" bahwa objek tersebut stabil. Sebagai contoh, jika `ref` dioper dari komponen induk, Anda harus menspesifikasikannya dalam senarai dependensi. However, this is good because you can't know whether the parent component always passes the same ref, or passes one of several refs conditionally. So your Effect _would_ depend on which ref is passed.

</DeepDive>

### Langkah 3: Tambahkan pembersihan jika diperlukan {/*step-3-add-cleanup-if-needed*/}

Bayangkan contoh yang berbeda. Anda sedang menulis komponen `ChatRoom` yang perlu terhubung ke server obrolan ketika ditampilkan. Anda diberi API `createConnection()` yang mengembalikan sebuah objek dengan metode `connect()` dan `disconnect()`. Bagaimana Anda menjaga komponen tetap terhubung saat ditampilkan kepada pengguna?

Mulai dengan menulis logika *Effect*:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

Akan sangat lambat untuk melakukan koneksi ke obrolan setelah setiap *render* ulang, jadi Anda menambahkan larik dependensi:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Kode di dalam *Effect* tidak menggunakan *props* atau *state* apapun, sehingga larik dependensi Anda adalah `[]` (kosong). Ini memberitahu React untuk hanya menjalankan kode ini ketika komponen "dipasang", yaitu muncul di layar untuk pertama kalinya.**

Mari kita coba menjalankan kode ini:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Selamat datang di ruang obrolan!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Implementasi nyata akan benar-benar terhubung ke server
  return {
    connect() {
      console.log('✅ Menghubungkan...');
    },
    disconnect() {
      console.log('❌ Terputus.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

*Effect* ini hanya berjalan pada pemasangan, jadi Anda mungkin mengharapkan `"✅ Menghubungkan..."` dicetak sekali di konsol. **Namun, jika Anda memeriksa konsol, `"✅ Menghubungkan..."` akan dicetak dua kali. Mengapa hal ini bisa terjadi?**

Bayangkan komponen `ChatRoom` merupakan bagian dari aplikasi yang lebih besar dengan banyak layar yang berbeda. Pengguna memulai perjalanan mereka di halaman `ChatRoom`. Komponen dipasang dan memanggil `connection.connect()`. Kemudian bayangkan pengguna menavigasi ke layar lain--misalnya, ke halaman Pengaturan. Akhirnya, pengguna mengklik Kembali dan `ChatRoom` terpasang kembali. Hal ini akan membuat sambungan kedua--tetapi sambungan pertama tidak pernah diputuskan! Ketika pengguna menavigasi aplikasi, koneksi akan terus menumpuk.

Bug seperti ini mudah terlewatkan tanpa pengujian manual yang ekstensif. Untuk membantu Anda menemukannya dengan cepat, dalam pengembangan, React melakukan pemasangan ulang setiap komponen satu kali setelah pemasangan awal.

Melihat log `"✅ Menghubungkan..."` dua kali akan membantu Anda mengetahui masalah yang sebenarnya: kode Anda tidak menutup koneksi ketika komponen dilepas.

Untuk memperbaiki masalah ini, kembalikan *fungsi cleanup* dari Effect Anda:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React akan memanggil fungsi pembersihan Anda setiap kali sebelum *Effect* dijalankan kembali, dan satu kali lagi ketika komponen dilepas (dihapus). Mari kita lihat apa yang terjadi ketika fungsi pembersihan diimplementasikan:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Selamat datang di ruang obrolan!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Implementasi nyata akan benar-benar terhubung ke server
  return {
    connect() {
      console.log('✅ Menghubungkan...');
    },
    disconnect() {
      console.log('❌ Terputus.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Sekarang Anda mendapatkan tiga log konsol dalam pengembangan:

1. `"✅ Menghubungkan..."`
2. `"❌ Terputus."`
3. `"✅ Menghubungkan..."`

**Ini adalah perilaku yang benar dalam pengembangan.** Dengan memasang kembali komponen Anda, React memverifikasi bahwa navigasi menjauh dan kembali tidak akan merusak kode Anda. Memutuskan sambungan dan kemudian menyambungkannya kembali adalah hal yang seharusnya terjadi! Ketika Anda mengimplementasikan pembersihan dengan baik, seharusnya tidak ada perbedaan yang terlihat oleh pengguna antara menjalankan *Effect* sekali vs menjalankannya, membersihkannya, dan menjalankannya lagi. Ada pasangan panggilan tambahan untuk menghubungkan/memutuskan koneksi karena React sedang menyelidiki kode Anda untuk mencari bug dalam pengembangan. Ini adalah hal yang normal--jangan mencoba untuk menghilangkannya!

**Dalam produksi, Anda hanya akan melihat `"✅ Menghubungkan..."` dicetak satu kali.** Memasang kembali komponen hanya terjadi dalam pengembangan untuk membantu Anda menemukan *Effect* yang perlu dibersihkan. Anda dapat mematikan [Strict Mode](/reference/react/StrictMode) untuk keluar dari perilaku pengembangan, tetapi kami sarankan untuk tetap mengaktifkannya. Hal ini memungkinkan Anda menemukan banyak bug seperti di atas.

## Bagaimana cara menangani *Effect* yang ditembakkan dua kali dalam pengembangan? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React secara sengaja memasang ulang komponen Anda dalam pengembangan untuk menemukan bug seperti pada contoh terakhir. **Pertanyaan yang tepat bukanlah "bagaimana cara menjalankan sebuah *Effect* sekali saja", tetapi "bagaimana cara memperbaiki *Effect* saya agar dapat berfungsi setelah dipasang ulang".**

Biasanya, jawabannya adalah menerapkan fungsi pembersihan. Fungsi pembersihan harus menghentikan atau membatalkan apa pun yang sedang dilakukan oleh Effect. Aturan praktisnya adalah bahwa pengguna seharusnya tidak dapat membedakan antara Effect yang berjalan sekali (seperti dalam produksi) dan urutan _setup → cleanup → setup_ (seperti yang Anda lihat dalam pengembangan).

Sebagian besar *Effect* yang akan Anda tulis, akan sesuai dengan salah satu pola umum di bawah ini.

<Pitfall>

#### Jangan gunakan ref untuk mencegah *Effect* diaktifkan {/*dont-use-refs-to-prevent-effects-from-firing*/}

Kesalahan umum untuk mencegah *Effect* berjalan dua kali dalam pengembangan adalah menggunakan `ref` untuk mencegah *Effect* berjalan lebih dari satu kali. Misalnya, Anda dapat "memperbaiki" bug di atas dengan `useRef`:

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 Ini tidak akan memperbaiki bug!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

Hal ini membuat Anda hanya melihat `"✅ Menghubungkan..."` sekali dalam pengembangan, tetapi hal itu tidak memperbaiki bug.

Saat pengguna keluar, koneksi masih belum ditutup dan saat mereka kembali, koneksi baru dibuat. Saat pengguna keluar dari aplikasi, koneksi akan terus menumpuk, sama seperti sebelum "perbaikan".

Untuk memperbaiki bug, tidak cukup hanya menjalankan Efek sekali. Efek harus berfungsi setelah dipasang ulang, yang berarti koneksi perlu dibersihkan seperti dalam solusi di atas.

Lihat contoh di bawah ini untuk cara menangani pola umum.

</Pitfall>

### Mengontrol *widget* di luar React {/*controlling-non-react-widgets*/}

<<<<<<< HEAD
Terkadang Anda perlu menambahkan *widget* UI yang tidak ditulis untuk React. Sebagai contoh, katakanlah Anda menambahkan komponen peta ke halaman Anda. Komponen ini memiliki metode `setZoomLevel()`, dan Anda ingin menjaga tingkat *zoom* tetap sinkron dengan variabel *state* `zoomLevel` dalam kode React Anda. *Effect* Anda akan terlihat seperti ini:
=======
Sometimes you need to add UI widgets that aren't written in React. For example, let's say you're adding a map component to your page. It has a `setZoomLevel()` method, and you'd like to keep the zoom level in sync with a `zoomLevel` state variable in your React code. Your Effect would look similar to this:
>>>>>>> 5138e605225b24d25701a1a1f68daa90499122a4

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Perhatikan bahwa tidak ada pembersihan yang diperlukan dalam kasus ini. Dalam pengembangan, React akan memanggil Effect dua kali, tetapi ini tidak menjadi masalah karena memanggil `setZoomLevel` dua kali dengan nilai yang sama tidak akan melakukan apa-apa. Ini mungkin sedikit lebih lambat, tetapi ini tidak menjadi masalah karena tidak akan melakukan pemanggilan ulang yang tidak perlu dalam produksi.

Beberapa API mungkin tidak mengizinkan Anda memanggilnya dua kali berturut-turut. Misalnya, metode [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) dari elemen [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) bawaan akan melempar *error* jika Anda memanggilnya dua kali. Implementasi fungsi pembersihan untuk membuatnya menutup dialog:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

Dalam pengembangan, *Effect* Anda akan memanggil `showModal()`, lalu segera `close()`, dan kemudian `showModal()` lagi. Ini memiliki perilaku yang terlihat oleh pengguna yang sama dengan memanggil `showModal()` satu kali, seperti yang akan Anda lihat dalam produksi.

### Berlangganan *events* {/*subscribing-to-events*/}

Jika *Effect* Anda berlangganan sesuatu, fungsi pembersihan harus menghentikan langganan:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Dalam mode pengembangan, *Effect* Anda akan memanggil `addEventListener()`, lalu segera `hapusEventListener()`, dan kemudian `addEventListener()` lagi dengan *event handler* yang sama. Jadi hanya akan ada satu langganan yang aktif pada satu waktu. Ini memiliki perilaku yang terlihat oleh pengguna yang sama dengan memanggil `addEventListener()` sekali, seperti dalam produksi.

### Memicu animasi {/*triggering-animations*/}

Jika *Effect* Anda menganimasikan sesuatu, fungsi pembersihan harus mengatur ulang animasi ke nilai awal:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Picu animasi
  return () => {
    node.style.opacity = 0; // Set ulang ke nilai awal
  };
}, []);
```

Dalam mode pengembangan, *opacity* akan diatur ke `1`, kemudian ke `0`, dan kemudian ke `1` lagi. Ini seharusnya memiliki perilaku yang terlihat oleh pengguna yang sama dengan pengaturan ke `1` secara langsung, yang akan terjadi dalam produksi. Jika Anda menggunakan pustaka animasi pihak ketiga yang mendukung *tweening*, fungsi pembersihan Anda akan mengatur ulang *timeline* ke kondisi awal.

### Mengambil data {/*fetching-data*/}

Jika *Effect* Anda mengambil sesuatu, fungsi pembersihan harus [membatalkan pengambilan](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) atau mengabaikan hasilnya:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

Anda tidak dapat "membatalkan" *network request* yang telah terjadi, tetapi fungsi pembersihan Anda harus memastikan bahwa pengambilan data yang _tidak relevan lagi_ tidak terus mempengaruhi aplikasi Anda. Jika `userId` berubah dari `'Alice'` menjadi `'Bob'`, pembersihan memastikan bahwa respons `'Alice'` diabaikan meskipun ia datang setelah `'Bob'`.

**Dalam mode pengembangan, Anda akan melihat dua *fetch* di tab *Network*.** Tidak ada yang salah dengan hal itu. Dengan pendekatan di atas, *Effect* pertama akan segera dibersihkan sehingga salinan variabel `ignore` akan disetel ke `true`. Jadi, meskipun ada *request* tambahan, hal itu tidak akan mempengaruhi *state* berkat pemeriksaan `if (!ignore)`.

**Dalam mode produksi, hanya akan ada satu *request*.** Jika *request* kedua dalam pengembangan mengganggu Anda, pendekatan terbaik adalah menggunakan solusi yang menduplikasi *request* dan menyimpan responsnya di antara komponen:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

Hal ini tidak hanya akan meningkatkan pengalaman pengembangan, tetapi juga membuat aplikasi Anda terasa lebih cepat. Sebagai contoh, pengguna yang menekan tombol Kembali tidak perlu menunggu data dimuat lagi, karena data tersebut akan di-*cache*. Anda bisa membuat *cache* sendiri atau menggunakan salah satu dari banyak alternatif untuk *fetching* secara manual di *Effects*.

<DeepDive>

#### Apa saja alternatif yang bagus untuk pengambilan data di *Effects*? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Menulis panggilan `fetch` di dalam *Effects* adalah [cara populer untuk mengambil data](https://www.robinwieruch.de/react-hooks-fetch-data/), terutama di aplikasi yang sepenuhnya berbasis klien. Namun, ini adalah pendekatan yang sangat manual dan memiliki kelemahan yang signifikan:

- ***Effects* tidak berjalan di server.** Ini berarti bahwa HTML awal yang di-*render* di server hanya akan menyertakan status pemuatan tanpa data. Komputer klien harus mengunduh semua JavaScript dan me-*render* aplikasi Anda hanya untuk mengetahui bahwa sekarang ia perlu memuat data. Hal ini sangat tidak efisien.
- **Mengambil data secara langsung dalam *Effects* memudahkan untuk menciptakan "air terjun (*waterfall*) jaringan".** Anda me-*render* komponen induk, mengambil beberapa data, me-*render* komponen anak, dan kemudian komponen anak mulai mengambil datanya. Jika jaringan tidak terlalu cepat, hal ini jauh lebih lambat daripada mengambil semua data secara paralel.
- **Mengambil data secara langsung dalam *Effects* biasanya berarti Anda tidak melakukan pramuat atau *cache* data.** Sebagai contoh, jika komponen dilepas dan kemudian dipasang lagi, komponen tersebut harus mengambil data lagi.
- **Sangat tidak ergonomis.** Ada cukup banyak kode *boilerplate* yang terlibat ketika menulis panggilan `fetch` dengan cara yang tidak mengalami bug seperti [*race condition*.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Daftar kelemahan ini tidak spesifik untuk React. Ini berlaku untuk mengambil data saat pemasangan komponen dengan pustaka apa pun. Seperti halnya dengan *routing*, pengambilan data bukanlah hal yang sepele untuk dilakukan dengan baik, jadi kami merekomendasikan pendekatan berikut ini:

- **Jika Anda menggunakan [kerangka kerja (*framework*)](/learn/start-a-new-react-project#production-grade-react-frameworks), gunakan mekanisme pengambilan data yang sudah ada di dalamnya.** Kerangka kerja React modern memiliki mekanisme pengambilan data terintegrasi yang efisien dan tidak mengalami kendala di atas.
- **Jika tidak, pertimbangkan untuk menggunakan atau membangun *cache* sisi klien.** Solusi sumber terbuka (*open source*) yang populer termasuk [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), dan [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Anda juga dapat membuat solusi sendiri, dalam hal ini Anda dapat menggunakan *Effects* di dalamnya, tetapi menambahkan logika untuk menduplikasi *request*, menyimpan respons dalam *cache*, dan menghindari *waterfall* jaringan (dengan melakukan pramuat data atau mengangkat kebutuhan data ke *route*).

Anda dapat terus mengambil data secara langsung di *Effects* jika tidak ada satu pun dari pendekatan ini yang cocok untuk Anda.

</DeepDive>

### Mengirim analitik {/*sending-analytics*/}

Perhatikan kode berikut ini yang mengirimkan *event* analitik pada kunjungan halaman:

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

Dalam mode pengembangan, `logVisit` akan dipanggil dua kali untuk setiap URL, sehingga Anda mungkin tergoda untuk mencoba memperbaikinya. **Kami sarankan untuk membiarkan kode ini apa adanya.** Seperti contoh-contoh sebelumnya, tidak ada perbedaan perilaku yang *dilihat oleh pengguna* antara menjalankannya sekali dan menjalankannya dua kali. Dari sudut pandang praktis, `logVisit` tidak boleh melakukan apa pun dalam pengembangan karena Anda tidak ingin log dari mesin pengembangan mempengaruhi metrik produksi. Komponen Anda akan dimuat ulang setiap kali Anda menyimpan berkasnyanya, sehingga komponen tersebut tetap mencatat kunjungan ekstra dalam pengembangan.

**Dalam mode produksi, tidak akan ada log kunjungan yang terduplikasi.**

Untuk men-debug *event* analitik yang Anda kirimkan, Anda bisa men-*deploy* aplikasi Anda ke lingkungan *staging* (yang berjalan dalam mode produksi) atau untuk sementara tidak menggunakan [Strict Mode](/reference/react/StrictMode) dan pengecekan ulang khusus pengembangannya. Anda juga dapat mengirimkan analitik dari *event handler* perubahan *route*, bukan dari *Effects*. Untuk analitik yang lebih tepat, [*intersection observers*](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) dapat membantu melacak komponen mana yang ada di tampilan layar dan berapa lama komponen tersebut tetap terlihat.

### Bukan *Effect*: Menginisialisasi aplikasi {/*not-an-effect-initializing-the-application*/}

Beberapa logika seharusnya hanya berjalan sekali ketika aplikasi dijalankan. Anda dapat meletakkannya di luar komponen Anda:

```js {2-3}
if (typeof window !== 'undefined') { // Periksa apakah kita berjalan di browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Hal ini menjamin bahwa logika tersebut hanya berjalan satu kali setelah browser memuat halaman.

### Bukan *Effect*: Membeli produk {/*not-an-effect-buying-a-product*/}

Terkadang, meskipun Anda menulis fungsi pembersihan, tidak ada cara untuk mencegah konsekuensi yang terlihat oleh pengguna dari menjalankan *Effect* dua kali. Misalnya, mungkin *Effect* Anda mengirimkan *request* POST seperti membeli produk:

```js {2-3}
useEffect(() => {
  // 🔴 Salah: Effect ini ditembakkan dua kali di pengembangan, mengungkapkan masalah dalam kode.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

Anda tidak ingin membeli produk dua kali. Namun, ini juga alasan mengapa Anda tidak boleh meletakkan logika ini di dalam sebuah *Effect*. Bagaimana jika pengguna pergi ke halaman lain dan kemudian menekan Kembali? *Effect* Anda akan berjalan lagi. Anda tidak ingin membeli produk ketika pengguna *mengunjungi* halaman; Anda ingin membelinya ketika pengguna *mengklik* tombol Beli.

Pembelian tidak disebabkan oleh rendering; ini disebabkan oleh interaksi tertentu. Interaksi ini harus berjalan hanya ketika pengguna menekan tombol. **Hapus *Effect* dan pindahkan *request* `/api/buy` Anda ke dalam *event handler* tombol Beli:**

```js {2-3}
  function handleClick() {
    // ✅ Pembelian adalah sebuah event karena disebabkan oleh interaksi tertentu.
    fetch('/api/buy', { method: 'POST' });
  }
```

**Hal ini mengilustrasikan bahwa jika pemasangan ulang merusak logika aplikasi Anda, hal ini biasanya akan menemukan bug yang ada.** Dari sudut pandang pengguna, mengunjungi sebuah halaman seharusnya tidak berbeda dengan mengunjunginya, mengklik sebuah tautan, lalu menekan Kembali untuk melihat halaman tersebut kembali. React memverifikasi bahwa komponen Anda mematuhi prinsip ini dengan memasang ulang komponen tersebut sekali dalam pengembangan.

## Menyatukan semuanya {/*putting-it-all-together*/}

*Playground* ini dapat membantu Anda "merasakan" bagaimana *Effect* bekerja dalam praktiknya.

Contoh ini menggunakan [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) untuk menjadwalkan log konsol dengan teks input untuk muncul tiga detik setelah *Effect* berjalan. Fungsi pembersihan akan membatalkan batas waktu yang tertunda. Mulailah dengan menekan "Pasang komponen":

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Menjadwalkan log "' + text + '"');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Membatalkan log "' + text + '"');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        Yang ingin di-log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Lepas' : 'Pasang'} komponen
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

Anda akan melihat tiga log pada awalnya: `Menjadwalkan log "a"`, `Membatalkan log "a"`, dan `Menjadwalkan log "a"` lagi. Three second later there will also be a log saying `a`. Tiga detik kemudian juga akan ada log yang bertuliskan `a`. Seperti yang Anda pelajari sebelumnya, pasangan penjadwalan/pembatalan tambahan adalah karena React me-remount komponen sekali dalam pengembangan untuk memverifikasi bahwa Anda telah mengimplementasikan pembersihan dengan baik.

Sekarang edit input menjadi `abc`. Jika Anda melakukannya dengan cukup cepat, you'll see `Menjadwalkan log "ab"` segera diikuti dengan `Membatalkan log "ab"` dan `Menjadwalkan log "abc"`. **React selalu membersihkan *Effect* dari render sebelumnya sebelum *Effect* dari render berikutnya.** Inilah sebabnya mengapa meskipun Anda mengetikkan input dengan cepat, hanya ada satu *timeout* yang dijadwalkan dalam satu waktu. Edit input beberapa kali dan lihat konsol untuk mengetahui bagaimana *Effect* dibersihkan.

Ketik sesuatu ke dalam input, lalu segera tekan "Lepas komponen". Perhatikan bagaimana melepas komponen membersihkan *Effect* render terakhir. Di sini, *Effect* membersihkan *timeout* terakhir sebelum sempat menembak.

Terakhir, edit komponen di atas dan beri komentar pada fungsi pembersihan agar *timeout* tidak dibatalkan. Coba ketik `abcde` dengan cepat. Apa yang Anda kira akan terjadi dalam tiga detik? Akankah `console.log(text)` di dalam *timeout* mencetak `text` *terbaru* dan menghasilkan lima log `abcde`? Cobalah untuk menguji intuisi Anda!

Tiga detik kemudian, Anda akan melihat urutan log (`a`, `ab`, `abc`, `abcd`, and `abcde`) bukan lima log `abcde`. **Setiap *Effect* "menangkap" nilai `teks` dari render yang sesuai.** Tidak masalah jika *state* `text` berubah: *Effect* dari render dengan `text = 'ab'` akan selalu menjadi `'ab'`. Jika Anda penasaran bagaimana cara kerjanya, Anda dapat membaca tentang [*closures*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

<DeepDive>

#### Setiap render memiliki *Effect* tersendiri {/*each-render-has-its-own-effects*/}

Anda dapat menganggap `useEffect` sebagai "melampirkan" sebuah perilaku ke keluaran *render*. Perhatikan *Effect* berikut:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Selamat datang di {roomId}!</h1>;
}
```

Mari kita lihat apa yang sebenarnya terjadi saat pengguna menavigasi aplikasi ini.

#### *Render* awal {/*initial-render*/}

Pengguna mengunjungi `<ChatRoom roomId="general" />`. Mari kita [menukar secara mental](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` dengan `'general'`:

```js
  // JSX untuk render pertama (roomId = "general")
  return <h1>Selamat datang di general!</h1>;
```

***Effect* *juga* bagian dari keluaran *render*.** *Effect* render pertama adalah sebagai berikut:

```js
  // Effect untuk render pertama (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependensi untuk render pertama (roomId = "general")
  ['general']
```

React menjalankan *Effect* ini, yang menghubungkan ke ruang obrolan `'general'`.

#### *Render ulang* dengan dependensi yang sama {/*re-render-with-same-dependencies*/}

Bayangkan `<ChatRoom roomId="general" />` di-*render* ulang. Keluaran JSX tetap sama:

```js
  // JSX untuk render kedua (roomId = "general")
  return <h1>Selamat datang di general!</h1>;
```

React melihat bahwa keluaran *render* tidak berubah, jadi ia tidak memperbarui DOM.

Effect dari *render* kedua menjadi seperti ini:

```js
  // Effect untuk render kedua (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependensi untuk render kedua (roomId = "general")
  ['general']
```

React membandingkan `['general']` dari *render* kedua dengan `['general']` dari *render* pertama. **Karena semua dependensi sama, React *mengabaikan* *Effect* dari render kedua.** Ia tidak pernah dipanggil.

#### *Render ulang* dengan dependensi berbeda {/*re-render-with-different-dependencies*/}

Kemudian, pengguna mengunjungi `<ChatRoom roomId="travel" />`. Kali ini, komponen mengembalikan JSX yang berbeda:

```js
  // JSX untuk render ketiga (roomId = "travel")
  return <h1>Selamat datang di travel!</h1>;
```

React memperbarui DOM dengan mengubah `"Selamat datang di general"` menjadi `"Selamat datang di travel"`.

*Effect* dari *render* ketiga menjadi seperti ini:

```js
  // Effect untuk render ketiga (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependensi untuk render ketiga (roomId = "travel")
  ['travel']
```

React membandingkan `['travel']` dari *render* ketiga dengan `['general']` dari *render* kedua. Satu dependensi berbeda: `Object.is('travel', 'general')` adalah `false`. *Effect* tidak dapat dilewati.

**Sebelum React dapat menerapkan *Effect* dari *render* ketiga, React perlu membersihkan *Effect* terakhir yang _dilewati_.** *Effect* pada *render* kedua dilewati, sehingga React perlu membersihkan *Effect* pada *render* pertama. Jika Anda menggulir ke atas ke *render* pertama, Anda akan melihat bahwa pembersihannya memanggil `disconnect()` pada koneksi yang dibuat dengan `createConnection('general')`. Ini akan memutuskan aplikasi dari ruang obrolan `'general'`.

Setelah itu, React menjalankan *Effect* render ketiga. Ia menghubungkan ke ruang obrolan `'travel'`.

#### Pelepasan {/*unmount*/}

Terakhir, katakanlah pengguna melakukan navigasi, dan komponen `ChatRoom` dilepas. React menjalankan fungsi pembersihan *Effect* terakhir. Effect terakhir berasal dari *render* ketiga. Pembersihan *render* ketiga menghancurkan koneksi `createConnection('travel')`. Sehingga aplikasi terputus dari ruang `'travel'`.

#### Perilaku mode pengembangan {/*development-only-behaviors*/}

Ketika [*Strict Mode*](/reference/react/StrictMode) diaktifkan, React akan memasang ulang setiap komponen satu kali setelah pemasangan (*state* dan DOM akan dipertahankan). Hal ini [membantu Anda menemukan *Effect* yang membutuhkan pembersihan](#step-3-add-cleanup-if-needed) dan mengekspos bug seperti *race condition* lebih awal. Selain itu, React akan memasang ulang *Effect* setiap kali Anda menyimpan berkas dalam pengembangan. Kedua perilaku ini hanya untuk mode pengembangan.

</DeepDive>

<Recap>

- Tidak seperti *events*, *Effects* disebabkan oleh pe-*render*-an itu sendiri, bukan oleh interaksi tertentu.
- *Effects* memungkinkan Anda menyinkronkan komponen dengan suatu sistem eksternal (API pihak ketiga, jaringan, dll.).
- Secara default, *Effects* dijalankan setelah setiap *render* (termasuk *render* awal).
- React akan melewatkan *Effect* jika semua dependensinya memiliki nilai yang sama dengan nilai pada saat render terakhir.
- Anda tidak dapat "memilih" dependensi Anda. Mereka ditentukan oleh kode di dalam *Effect*.
- Larik dependensi kosong (`[]`) berhubungan dengan "pemasangan" komponen, yaitu ketika komponen ditambahkan ke layar.
- Dalam *Strict Mode*, React memasang komponen dua kali (hanya dalam pengembangan!) untuk menguji coba *Effect* Anda.
- Jika *Effect* Anda rusak karena pemasangan ulang, Anda perlu menerapkan fungsi pembersihan.
- React akan memanggil fungsi pembersihan Anda sebelum *Effect* dijalankan di lain waktu, dan selama proses pelepasan (*unmount*).

</Recap>

<Challenges>

#### Memfokuskan bidang teks saat pemasangan {/*focus-a-field-on-mount*/}

Dalam contoh ini, formulir merender komponen `<MyInput />`.

Gunakan metode [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) pada input untuk membuat `MyInput` secara otomatis fokus ketika muncul di layar. Sudah ada implementasi yang dikomentari, tetapi tidak cukup berhasil. Cari tahu mengapa hal ini tidak berhasil, dan perbaiki. (Jika Anda terbiasa dengan atribut `autoFocus`, anggap saja atribut tersebut tidak ada: kita mengimplementasikan ulang fungsi yang sama dari awal).

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: Ini tidak bekerja. Perbaiki.
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Sembunyikan' : 'Tampilkan'} formulir</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Masukkan nama:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Jadikan huruf besar
          </label>
          <p>Halo, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>


Untuk memastikan bahwa solusi Anda berfungsi, tekan "Tampilkan formulir" dan pastikan bahwa input menerima fokus (menjadi tersorot dan kursor ditempatkan di dalam). Tekan "Sembunyikan formulir" dan "Tampilkan formulir" lagi. Pastikan bahwa input telah disorot kembali.

`MyInput` seharusnya hanya fokus _pada saat pemasangan_, bukan setelah setiap _render_. Untuk memastikan bahwa perilaku sudah benar, tekan "Tampilkan formulir" dan kemudian berulang kali tekan kotak centang "Jadikan huruf besar". Mengklik kotak centang tersebut seharusnya _tidak_ akan memfokuskan input di atasnya.

<Solution>

Memanggil `ref.current.focus()` saat _render_ salah karena ia merupakan _efek samping_. *Effect* samping seharusnya ditempatkan di dalam _event handler_ atau dideklarasikan dengan `useEffect`. Dalam contoh ini, efek samping _dihasilkan_ oleh komponen yang muncul, bukan oleh interaksi tertentu, oleh karena itu akan masuk akal menempatkannya di dalam _Effect_.

Untuk memperbaiki kesalahannya, bungkus panggilan `ref.current.focus()` di dalam _Effect_. Kemudian, untuk memastikan bahwa _Effect_ ini hanya berjalan pada saat pemasangan dan bukan setelah setiap render, tambahkan dependensi kosong `[]` ke dalamnya.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Sembunyikan' : 'Tampilkan'} formulir</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Masukkan nama:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Jadikan huruf besar
          </label>
          <p>Halo, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### Memfokuskan bidang teks secara kondisional {/*focus-a-field-conditionally*/}

Formulir ini me-*render* dua komponen `<MyInput />`.

Tekan "Tampilkan formulir" dan perhatikan bahwa bidang kedua secara otomatis akan terfokus. Hal ini karena kedua komponen `<MyInput />` mencoba untuk memfokuskan bidang di dalamnya. Ketika Anda memanggil `focus()` untuk dua bidang input secara berurutan, bidang input yang terakhir akan selalu "menang".

Katakanlah Anda ingin memfokuskan bidang pertama. Komponen `MyInput` pertama sekarang menerima *prop* boolean `shouldFocus` yang disetel ke `true`. Ubah logikanya sehingga `focus()` hanya dipanggil jika *prop* `shouldFocus` yang diterima oleh `MyInput` adalah `true`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: panggil focus() hanya ketika nilai shouldFocus adalah true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Sembunyikan' : 'Tampilkan'} formulir</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Masukkan nama depan:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Masukkan nama belakang:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Untuk memastikan solusi Anda, tekan "Tampilkan formulir" dan "Sembunyikan formulir" berulang kali. Ketika formulir muncul, hanya input *pertama* yang akan difokuskan. Hal ini karena komponen induk merender input pertama dengan `shouldFocus={true}` dan input kedua dengan `shouldFocus={false}`. Periksa juga apakah kedua input masih berfungsi dan Anda dapat mengetikkan kedua input tersebut.

<Hint>

Anda tidak dapat mendeklarasikan *Effect* secara kondisional, tetapi *Effect* Anda dapat mengandung logika kondisional.

</Hint>

<Solution>

Letakkan logika kondisional di dalam Effect. Anda harus menentukan `shouldFocus` sebagai dependensi karena Anda menggunakannya di dalam *Effect*. (Ini berarti bahwa jika `shouldFocus` dari beberapa input berubah dari `false` menjadi `true`, input tersebut akan fokus setelah dipasang.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Sembunyikan' : 'Tampilkan'} formulir</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Masukkan nama depan:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Masukkan nama belakang:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Halo, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### Memperbaiki interval yang menembak dua kali {/*fix-an-interval-that-fires-twice*/}

Komponen `Counter` ini menampilkan penghitung yang harus bertambah setiap detik. Saat dipasang, komponen ini memanggil [`setInterval`.](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) Hal ini menyebabkan `onTick` berjalan setiap detik. Fungsi `onTick` menambah penghitung.

Namun, alih-alih bertambah sekali per detik, fungsi ini bertambah dua kali. Mengapa demikian? Temukan penyebab bug dan perbaiki.

<Hint>

Perlu diingat bahwa `setInterval` mengembalikan ID interval, yang dapat Anda berikan kepada [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) untuk menghentikan interval.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Sembunyikan' : 'Tampilkan'} penghitung</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

Ketika [*Strict Mode*](/reference/react/StrictMode) diaktifkan (seperti pada sandbox di situs ini), React akan memasang ulang setiap komponen satu kali dalam pengembangan. Hal ini menyebabkan interval disetel dua kali, dan inilah mengapa setiap detik penghitung bertambah dua kali.

Namun, perilaku React bukanlah *penyebab* dari bug: bug sudah ada di dalam kode. Perilaku React membuat bug menjadi lebih terlihat. Penyebab sebenarnya adalah karena *Effect* ini memulai sebuah proses tetapi tidak menyediakan cara untuk membersihkannya.

Untuk memperbaiki kode ini, simpan ID interval yang dikembalikan oleh `setInterval`, dan terapkan fungsi pembersihan dengan [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Dalam mode pengembangan, React masih akan memasang ulang komponen Anda satu kali untuk memastikan bahwa Anda telah mengimplementasikan pembersihan dengan baik. Jadi akan ada pemanggilan `setInterval`, segera diikuti dengan `clearInterval`, dan `setInterval` lagi. Dalam produksi, hanya akan ada satu panggilan `setInterval`. Perilaku yang terlihat oleh pengguna pada kedua kasus tersebut adalah sama: penghitung bertambah satu kali per detik.

</Solution>

#### Memperbaiki pengambilan data di dalam *Effect* {/*fix-fetching-inside-an-effect*/}

Komponen ini menampilkan biografi orang yang dipilih. Komponen ini memuat biografi dengan memanggil fungsi asinkron `fetchBio(person)` pada saat pemasangan dan setiap kali `person` berubah. Fungsi asinkron tersebut mengembalikan sebuah [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) yang pada akhirnya akan menjadi sebuah string. Ketika pengambilan selesai, fungsi ini memanggil `setBio` untuk menampilkan string tersebut di bawah kotak pilihan.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Memuat...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Ini adalah biodata ' + person + '.');
    }, delay);
  })
}

```

</Sandpack>


Ada bug dalam kode ini. Mulailah dengan memilih "Alice". Kemudian pilih "Bob" dan segera setelah itu pilih "Taylor". Jika Anda melakukan ini dengan cukup cepat, Anda akan melihat bug itu: Taylor sudah dipilih, tetapi paragraf di bawahnya mengatakan "Ini adalah biodata Bob."

Mengapa hal ini terjadi? Perbaiki bug di dalam *Effect* ini.

<Hint>

Jika *Effect* melakukan *fetching* terhadap sesuatu secara asinkron, biasanya perlu dibersihkan.

</Hint>

<Solution>

Untuk memicu bug, beberapa hal harus terjadi secara berurutan:

- Memilih `'Bob'` akan memicu `fetchBio('Bob')`
- Memilih `'Taylor'` akan memicu `fetchBio('Taylor')`
- **Mengambil data `'Taylor'` selesai *sebelum* mengambil data `'Bob'`**
- *Effect* dari *render* `'Taylor'` memanggil `setBio('Ini adalah biodata Taylor')`
- Pengambilan data `'Bob'` selesai
- *Effect* dari *render* `'Bob'` memanggil `setBio('Ini adalah biodata Bob')`

Inilah sebabnya mengapa Anda melihat biodata Bob meskipun Taylor yang terpilih. Bug seperti ini disebut [*race condition*](https://en.wikipedia.org/wiki/Race_condition) karena dua operasi asinkron "berlomba" satu sama lain, dan mungkin tiba dalam urutan yang tidak terduga.

Untuk memperbaiki *race condition* ini, tambahkan fungsi pembersihan:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Memuat...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Ini adalah biodata ' + person + '.');
    }, delay);
  })
}

```

</Sandpack>

Setiap *Effect* *render* memiliki variabel `ignore` sendiri. Awalnya, variabel `ignore` disetel ke `false`. Namun, jika sebuah Effect dibersihkan (seperti ketika Anda memilih orang yang berbeda), variabel `ignore` menjadi `true`. Jadi sekarang tidak masalah dalam urutan mana permintaan diselesaikan. Hanya *Effect* orang terakhir yang memiliki `ignore` yang disetel ke `false`, sehingga akan memanggil `setBio(result)`. *Effect*-efek sebelumnya telah dibersihkan, sehingga pemeriksaan `if (!ignore)` akan mencegah mereka memanggil `setBio`:

- Memilih `'Bob'` akan memicu `fetchBio('Bob')`
- Memilih `'Taylor'` akan memicu `fetchBio('Taylor')` **dan membersihkan *Effect* sebelumnya (milik Bob)**
- Mengambil data `'Taylor'` selesai *sebelum* mengambil data `'Bob'`
- *Effect* dari render `'Taylor'` memanggil `setBio('Ini adalah biodata Taylor')`
- Mengambil data `'Bob'` selesai
- *Effect* dari *render* `'Bob'` **tidak melakukan apa pun karena flag `ignore` diset ke `true`**

Selain mengabaikan hasil panggilan API yang sudah usang, Anda juga dapat menggunakan [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) untuk membatalkan *request* yang sudah tidak diperlukan. Namun, hal ini saja tidak cukup untuk melindungi dari *race condition*. Langkah-langkah asinkron lainnya dapat dirangkai (*chain*) setelah *fetch*, jadi menggunakan tanda spesifik seperti `ignore` adalah cara paling reliabel untuk memperbaiki masalah seperti ini.

</Solution>

</Challenges>

