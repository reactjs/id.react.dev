---
title: 'Mereferensikan Nilai menggunakan Refs'
---

<Intro>

Ketika Anda ingin sebuah komponen untuk "mengingat" beberapa informasi, tetapi Anda tidak mau informasi tersebut [memicu *render* baru](/learn/render-and-commit), Anda dapat menggunakan *ref*.

</Intro>

<YouWillLearn>

- Bagaimana cara menambahkan *ref* pada komponen Anda
- Bagaimana cara memperbarui nilai *ref*
- Perbedaan antara *refs* dan *state*
- Bagaimana cara menggunakan *refs* dengan aman

</YouWillLearn>

## Menambahkan sebuah *ref* pada komponen Anda {/*adding-a-ref-to-your-component*/}

Anda dapat menambahkan sebuah *ref* ke komponen dengan mengimpor `useRef` *Hook* dari React:

```js
import { useRef } from 'react';
```

Di dalam komponen Anda, panggil `useRef` *Hook* dan berikan nilai awal yang Anda ingin referensikan sebagai satu-satunya argumen. Misalnya, berikut adalah *ref* yang mempunyai nilai `0`:

```js
const ref = useRef(0);
```

`useRef` mengembalikan sebuah objek seperti ini:

```js
{ 
  current: 0 // Nilai yang Anda berikan ke useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Sebuah panah dengan tulisan 'current' dimasukkan ke dalam saku dengan tulisan 'ref'." />

Anda dapat mengakses nilai saat ini dari *ref* tersebut melalui properti `ref.current`. Nilai ini bersifat *mutable* (dapat diubah), yang artinya Anda dapat membaca dan mengubah nilainya. Ini seperti kantong rahasia dari komponen Anda yang tidak dilacak oleh React. (Inilah yang membuatnya menjadi "jalan keluar" dari arus data satu arah pada React - lebih lanjut tentang hal ini akan dijelaskan di bawah!)

Di sini, tombol akan menambahkan nilai dari `ref.current` setiap kali diklik:
<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Anda mengeklik ' + ref.current + ' kali!');
  }

  return (
    <button onClick={handleClick}>
      Klik saya!
    </button>
  );
}
```

</Sandpack>

*Ref* tersebut mengacu pada sebuah angka, tetapi, seperti [*state*](/learn/state-a-components-memory), Anda juga dapat mengacu pada tipe data apapun: sebuah *string*, objek, atau bahkan sebuah fungsi. Berbeda dengan *state*, *ref* adalah sebuah objek JavaScript biasa dengan properti `current` yang dapat Anda baca dan ubah nilainya.

Perhatikan bahwa **komponen tidak di-*render* ulang setiap kali nilai pada *ref* ditambahkan.** Seperti *state*, nilai dari *refs* akan tetap disimpan atau dipertahankan oleh React saat *render* ulang terjadi. Namun mengubah *state* akan memicu *render* ulang pada komponen, sementara *ref* tidak akan melakukannya!

## Contoh: Membangun *stopwatch* {/*example-building-a-stopwatch*/}

Anda dapat menggabungkan *refs* dan *state* dalam satu komponen. Sebagai contoh, mari buat *stopwatch* yang dapat dijalankan atau dihentikan oleh pengguna dengan menekan sebuah tombol. Untuk menampilkan berapa waktu yang telah berlalu sejak pengguna menekan tombol "Mulai", Anda perlu melacak kapan tombol "Mulai" ditekan dan waktu saat ini. **Informasi ini digunakan untuk *rendering*, sehingga Anda akan menyimpannya dalam *state*:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Ketika pengguna menekan "Mulai", Anda akan menggunakan [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) untuk memperbarui waktu setiap 10 milidetik:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Mulai menghitung.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Memperbarui waktu saat ini setiap 10 milidetik.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Waktu yang telah berlalu: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Mulai
      </button>
    </>
  );
}
```

</Sandpack>

Ketika tombol "Berhenti" ditekan, Anda perlu membatalkan *interval* yang ada sehingga komponen tersebut berhenti memperbarui nilai dari *state* `now`. Anda dapat melakukannya dengan memanggil [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), tetapi Anda harus memberikan *interval ID* yang sebelumnya dikembalikan oleh pemanggilan `setInterval` saat pengguna menekan "Mulai". Anda perlu menyimpan *interval ID* tersebut di suatu tempat. **Karena *interval ID* tidak digunakan untuk *rendering*, Anda dapat menyimpannya dalam *ref***:

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
      <h1>Waktu yang telah berlalu: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Mulai
      </button>
      <button onClick={handleStop}>
        Berhenti
      </button>
    </>
  );
}
```

</Sandpack>

Ketika sebuah informasi digunakan untuk *rendering*, simpanlah di dalam *state*. Ketika sebuah informasi hanya dibutuhkan oleh *event handler* dan perubahan informasi tersebut tidak memerlukan *render* ulang, menggunakan *ref* mungkin akan lebih efisien.

## Perbedaan antara *refs* dan *state* {/*differences-between-refs-and-state*/}

Mungkin Anda berpikir bahwa *ref* terlihat kurang "ketat" dibandingkan dengan *state*-Anda dapat memutasi *ref* daripada selalu harus menggunakan fungsi pengaturan *state*, misalnya. Tetapi dalam kebanyakan kasus, Anda akan ingin menggunakan *state*. *Ref* adalah "jalan keluar" yang tidak sering Anda butuhkan. Berikut adalah perbandingan antara *state* dan *ref*:

| *ref*                                                                                  | *state*                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` mengembalikan `{ current: initialValue }`                            | `useState(initialValue)` mengembalikan nilai saat ini dari sebuah *state* dan sebuah fungsi pengatur state. ( `[value, setValue]`) |
| Tidak memicu *render* ulang ketika Anda mengubahnya.                                         | Memicu *render* ulang ketika Anda mengubahnya.                                                                                    |
| *Mutable*—Anda dapat memodifikasi dan memperbarui nilai `current` di luar proses rendering. | *Immutable*—Anda harus menggunakan fungsi pengatur *state* untuk memodifikasi *state* dan memicu *render* ulang.                       |
| Anda sebaiknya tidak membaca (atau menulis) nilai `current` selama proses *rendering*. | Anda dapat membaca *state* kapan saja. Namun, setiap *render* terjadi *state* memiliki [snapshot](/learn/state-as-a-snapshot) sendiri yang tidak berubah.

Berikut adalah tombol penghitung yang diimplementasikan dengan state:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Anda mengeklik {count} kali
    </button>
  );
}
```

</Sandpack>

Karena nilai `count` ditampilkan, maka masuk akal untuk menggunakan nilai *state* untuk hal tersebut. Ketika nilai hitung diatur dengan `setCount()`, React akan me-*render* ulang komponen dan layar akan diperbarui untuk mencerminkan hitungan baru.

Jika Anda mencoba mengimplementasikan ini dengan menggunakan *ref*, React tidak akan pernah melakukan *render* ulang pada komponen, sehingga Anda tidak akan pernah melihat perubahan hitungan! Lihat bagaimana mengeklik tombol ini **tidak memperbarui teks-nya**:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Hal ini tidak memicu render ulang pada komponen
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      Anda mengeklik {countRef.current} kali
    </button>
  );
}
```

</Sandpack>

Inilah mengapa membaca `ref.current` selama proses `render` akan menghasilkan kode yang tidak dapat diandalkan. Jika kamu membutuhkan akses nilai pada saat proses render, lebih baik gunakan *state*.

<DeepDive>

#### Bagaimana cara useRef bekerja di dalamnya? {/*how-does-use-ref-work-inside*/}

Meskipun kedua `useState` dan `useRef` disediakan oleh React, pada prinsipnya useRef dapat diimplementasikan di atas useState. Anda dapat membayangkan bahwa di dalam React, useRef diimplementasikan seperti ini:

```js
// Di dalam React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Pada saat render pertama kali, `useRef` akan mengembalikan nilai `{ current: initialValue }`. Objek ini akan disimpan oleh React, sehingga pada saat render berikutnya, objek yang sama akan dikembalikan. Perhatikan bahwa dalam contoh ini, pengatur dari *state* tidak digunakan. Pengatur *state* tidak diperlukan karena `useRef` selalu harus mengembalikan objek yang sama!

React menyediakan versi bawaan dari `useRef` karena cukup umum dalam praktiknya. Namun, Anda bisa memikirkannya sebagai *state* biasa tanpa pengatur. Jika Anda akrab dengan pemrograman berorientasi objek, *ref* mungkin mengingatkan Anda pada *instance fields*--tetapi bukannya `this.something`, Anda menulis `somethingRef.current`.

</DeepDive>

## Kapan untuk menggunakan *refs* {/*when-to-use-refs*/}

Biasanya, Anda akan menggunakan *ref* ketika komponen Anda perlu "keluar" dari React dan berkomunikasi dengan *API* eksternal - seringkali *API* peramban yang tidak mempengaruhi tampilan komponen. Berikut adalah beberapa situasi langka di mana Anda bisa menggunakan *refs*:

- Menyimpan [*timeout IDs*](https://developer.mozilla.org/docs/Web/API/setTimeout)
- Menyimpan dan memanipulasi [elemen DOM](https://developer.mozilla.org/docs/Web/API/Element), yang akan dibahas pada [halaman berikutnya](/learn/manipulating-the-dom-with-refs)
- Menyimpan objek lain yang tidak diperlukan untuk menghitung JSX.

Jika komponen Anda perlu menyimpan beberapa nilai, tetapi tidak mempengaruhi logika *rendering*, pilihlah penggunaan *refs*.

## Praktik terbaik menggunakan *refs* {/*best-practices-for-refs*/}

Mengikuti prinsip-prinsip ini akan membuat komponen Anda lebih dapat diprediksi:

- **Gunakan *refs* sebagai "jalan keluar"**. *Refs* berguna ketika Anda bekerja dengan sistem eksternal atau *API* peramban. Jika sebagian besar logika aplikasi dan aliran data bergantung pada *refs*, mungkin perlu untuk mempertimbangkan kembali pendekatan yang digunakan.

- **Jangan membaca atau menulis `ref.current` selama proses rendering**. Jika beberapa informasi dibutuhkan selama *rendering*, gunakan [*state*](/learn/state-a-components-memory) sebagai gantinya. Karena React tidak mengetahui perubahan pada `ref.current`, bahkan membacanya selama *rendering* membuat perilaku komponen sulit diprediksi. (Satu-satunya pengecualian untuk ini adalah kode seperti `if (!ref.current) ref.current = new Thing()` yang hanya mengatur *ref* sekali selama *render* pertama.)

Keterbatasan dari *state* di React tidak berlaku pada *refs*. Sebagai contoh, *state* bertindak seperti [snapshot untuk setiap render](/learn/state-as-a-snapshot) dan [tidak memperbarui sinkron secara langsung](/learn/queueing-a-series-of-state-updates). Namun ketika Anda memutasi nilai saat ini dari sebuah *ref*, perubahannya langsung terjadi:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Ini karena ***ref* itu sendiri adalah objek JavaScript biasa**, dan karena itu berperilaku seperti objek biasa.

Anda juga tidak perlu khawatir tentang [menghindari mutasi](/learn/updating-objects-in-state) saat bekerja dengan *ref*. Selama objek yang Anda ubah tidak digunakan untuk *rendering*, React tidak peduli apa yang Anda lakukan dengan *ref* atau isinya.

## *Refs* dan *DOM* {/*refs-and-the-dom*/}

Anda dapat memberikan nilai apapun kepada *ref*. Namun, penggunaan *ref* yang paling umum adalah untuk mengakses sebuah elemen *DOM*. Misalnya, hal ini berguna jika Anda ingin memberi fokus pada sebuah input secara programatik. Ketika Anda mengoper sebuah *ref* ke dalam atribut `ref` di *JSX*, seperti `<div ref={myRef}>`, React akan menempatkan elemen *DOM* yang sesuai ke dalam `myRef.current`. Anda dapat membaca lebih lanjut tentang hal ini di [Memanipulasi DOM dengan Refs](/learn/manipulating-the-dom-with-refs).

<Recap>

- *Ref* adalah "jalan keluar" untuk menyimpan nilai yang tidak digunakan untuk me-*render*. Anda tidak akan membutuhkannya terlalu sering.
- *Ref* adalah objek JavaScript biasa dengan satu properti yang disebut `current`, yang dapat Anda baca atau mengaturnya.
- Anda dapat meminta React untuk memberikan Anda sebuah *ref* dengan memanggil Hook `useRef`.
- Seperti *state*, *ref* memungkinkan Anda mempertahankan informasi antara *render* ulang dari komponen.
- Tidak seperti *state*, mengatur nilai `current` dari *ref* tidak memicu *render* ulang.
- Jangan membaca atau mengubah `ref.current` selama me-*render*. Hal ini membuat perilaku komponen Anda sulit diprediksi.

</Recap>



<Challenges>

#### Memperbaiki *chat input* yang rusak {/*fix-a-broken-chat-input*/}

Ketikkan pesan dan klik "Kirim". Anda akan melihat ada penundaan tiga detik sebelum Anda melihat *alert* "Terkirim!". Selama penundaan ini, Anda dapat melihat tombol "*Undo*". Klik tombol "*Undo*". Tombol "*Undo*" ini seharusnya menghentikan pesan "Terkirim!" untuk muncul. Ini dilakukan dengan memanggil [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) untuk ID waktu tunggu yang disimpan selama `handleSend`. Namun, bahkan setelah "*Undo*" diklik, pesan "Terkirim!" tetap muncul. Temukan mengapa ini tidak berfungsi dan perbaikilah.

<Hint>

Variabel biasa seperti `let timeoutID` tidak "bertahan" antara *render* ulang karena setiap *render* ulang akan menjalankan komponen dari awal (dan menginisialisasi variabel-variabelnya) kembali. Apakah Anda harus menyimpan *timeout ID* di tempat lain?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Terkirim!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Mengirim...' : 'Kirim'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Setiap kali komponen Anda di-*render* ulang (seperti saat Anda mengatur *state*), semua variabel lokal akan diinisialisasi dari awal. Inilah sebabnya mengapa Anda tidak dapat menyimpan *timeout ID* dalam variabel lokal seperti `timeoutID` dan kemudian mengharapkan *event handler* lainnya untuk "melihat"nya di masa depan. Sebaliknya, simpanlah *timeout ID* di dalam sebuah *ref*, yang akan dipertahankan oleh React antara *render*.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Terkirim!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Mengirim...' : 'Kirim'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Perbaiki komponen yang gagal untuk di-*render* kembali {/*fix-a-component-failing-to-re-render*/}

Tombol ini seharusnya beralih antara menunjukkan "Nyala" dan "Mati". Namun, selalu menunjukkan "Mati". Apa yang salah dengan kode ini? Perbaiki.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'Nyala' : 'Mati'}
    </button>
  );
}
```

</Sandpack>

<Solution>

Dalam contoh ini, nilai saat ini dari sebuah *ref* digunakan untuk menghitung output *rendering*: `{isOnRef.current ? 'Nyala' : 'Mati'}`. Ini menunjukkan bahwa informasi ini seharusnya tidak berada dalam sebuah *ref*, dan seharusnya disimpan dalam *state*. Untuk memperbaikinya, hapus *ref* dan gunakan *state* sebagai gantinya:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'Nyala' : 'Mati'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Perbaiki *debouncing* {/*fix-debouncing*/}

Pada contoh ini, semua penangan klik tombol di-*debounce*. Untuk melihat apa artinya, tekan salah satu tombol. Perhatikan bagaimana pesan muncul satu detik kemudian. Jika Anda menekan tombol sambil menunggu pesan, waktu akan direset. Jadi jika Anda terus mengeklik tombol yang sama secara cepat beberapa kali, pesan tidak akan muncul sampai satu detik *setelah* Anda berhenti mengeklik. *Debouncing* memungkinkan Anda menunda beberapa tindakan sampai pengguna "berhenti melakukan sesuatu".

Contoh ini berfungsi, tetapi tidak sepenuhnya seperti yang dimaksudkan. Tombol-tombolnya tidak independen. Untuk melihat masalahnya, klik salah satu tombol, lalu segera klik tombol lain. Anda akan mengharapkan bahwa setelah penundaan, Anda akan melihat pesan dari kedua tombol. Tetapi hanya pesan dari tombol terakhir yang muncul. Pesan dari tombol pertama hilang.

Mengapa tombol-tombol saling mengganggu satu sama lain? Temukan dan perbaiki masalahnya.

<Hint>

Variabel `timeoutID` dibagikan antara semua komponen `DebouncedButton`. Ini adalah mengapa mengeklik satu tombol akan mereset waktu tunggu tombol yang lain. Bisakah Anda menyimpan *ID* waktu tunggu yang terpisah untuk setiap tombol?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Pesawat luar angkasa diluncurkan!')}
      >
        Luncurkan pesawat ruang angkasa
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Sup direbus!')}
      >
        Rebus sup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lagu pengantar tidur dinyanyikan!')}
      >
        Nyanyikan lagu pengantar tidur
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

Sebuah variabel seperti `timeoutID` bersifat global diantara semua komponen. Inilah sebabnya mengapa mengeklik tombol kedua akan mengatur ulang *timeout* yang tertunda di tombol pertama. Untuk memperbaikinya, Anda dapat menyimpan *timeout* dalam *ref*. Setiap tombol akan memiliki *ref*-nya sendiri, sehingga tidak akan saling bertentangan satu sama lain. Perhatikan bagaimana mengeklik dua tombol dengan cepat akan menampilkan kedua pesan.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Pesawat luar angkasa diluncurkan!')}
      >
        Luncurkan pesawat ruang angkasa
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Sup direbus!')}
      >
        Rebus sup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lagu pengantar tidur dinyanyikan!')}
      >
        Nyanyikan lagu pengantar tidur
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Membaca nilai *state* terbaru {/*read-the-latest-state*/}

Pada contoh ini, setelah Anda menekan "Kirim", ada jeda sebentar sebelum pesan ditampilkan. Ketikkan "halo", klik Kirim, lalu cepat edit input kembali. Meskipun Anda mengedit, alert masih akan menampilkan "halo" (yang merupakan nilai *state* [pada saat](/learn/state-as-a-snapshot#state-over-time) tombol diklik).

Biasanya, perilaku ini yang Anda inginkan di dalam sebuah aplikasi. Namun, mungkin ada kasus-kasus tertentu di mana Anda ingin beberapa kode asinkron membaca versi *terbaru* dari suatu *state*. Bisakah Anda memikirkan cara untuk membuat *alert* menampilkan teks masukan *saat ini* daripada saat tombol diklik?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Mengirim: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Kirim
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

Dalam contoh ini, *state* bekerja [seperti snapshot](/learn/state-as-a-snapshot), sehingga Anda tidak dapat membaca +state+ terbaru dari operasi asinkron seperti *timeout*. Namun, Anda dapat menyimpan teks input terbaru dalam *ref*. *Ref* bersifat *mutable* (dapat diubah), sehingga Anda dapat membaca properti `current` kapan saja. Karena teks saat ini juga digunakan untuk me-*render*, pada contoh ini, Anda akan memerlukan keduanya, variabel *state* (untuk me-*render*), dan *ref* (untuk membacanya di *timeout*). Anda harus memperbarui nilai *ref* saat ini secara manual.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Mengirim: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Kirim
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
