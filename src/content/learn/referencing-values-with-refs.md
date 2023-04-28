---
title: 'Mereferensikan Nilai dengan Refs'
---

<Intro>

Ketika Anda ingin sebuah komponen untuk "mengingat" beberapa informasi, tetapi Anda tidak mau informasi tersebut [memicu _render_ baru](/learn/render-and-commit), Anda dapat menggunakan _ref_.

</Intro>

<YouWillLearn>

- Bagaimana cara menambahkan _ref_ pada komponen Anda
- Bagaimana cara memperbarui nilai _ref_
- Perbedaan antara _refs_ dan _state_
- Bagaimana cara menggunakan _refs_ dengan aman

</YouWillLearn>

## Menambahkan _ref_ pada komponen Anda {/*adding-a-ref-to-your-component*/}

Anda dapat menambahkan sebuah _ref_ ke komponen dengan mengimpor `useRef` _Hook_ dari React:

```js
import { useRef } from 'react';
```

Di dalam komponen Anda, panggil `useRef` _Hook_ dan berikan nilai awal yang Anda ingin referensikan sebagai satu-satunya argumen. Misalnya, berikut adalah _ref_ yang mempunyai nilai `0`:

```js
const ref = useRef(0);
```

`useRef` mengembalikan sebuah objek seperti:

```js
{ 
  current: 0 // Nilai yang Anda berikan ke useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Sebuah panah dengan tulisan 'current' dimasukkan ke dalam saku dengan tulisan 'ref'." />

Anda dapat mengakses nilai saat ini dari _ref_ tersebut melalui properti `ref.current`. Nilai ini bersifat _mutable_ (dapat diubah), yang artinya Anda dapat membaca dan mengubah nilainya. Ini seperti kantong rahasia dari komponen Anda yang tidak dilacak oleh React. (Inilah yang membuatnya menjadi "jalan keluar" dari arus data satu arah pada React - lebih lanjut tentang hal ini akan dijelaskan di bawah!)

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

_Ref_ tersebut mengacu pada sebuah angka, tetapi, seperti [_state_](/learn/state-a-components-memory), Anda juga dapat mengacu pada tipe data apapun: sebuah _string_, objek, atau bahkan sebuah fungsi. Berbeda dengan _state_, _ref_ adalah sebuah objek JavaScript biasa dengan properti `current` yang dapat Anda baca dan ubah nilainya.

Perhatikan bahwa **komponen tidak rerender setiap kali nilai pada _ref_ ditambahkan.** Seperti _state_, nilai dari _refs_ akan tetap disimpan atau dipertahankan oleh React saat rerender terjadi. Namun mengubah _state_ akan memicu rerender pada komponen, sementara _ref_ tidak akan melakukannya!

## Contoh: Membangun _stopwatch_ {/*example-building-a-stopwatch*/}

Anda dapat menggabungkan _refs_ dan _state_ dalam satu komponen. Sebagai contoh, mari buat _stopwatch_ yang dapat dijalankan atau dihentikan oleh pengguna dengan menekan tombol. Untuk menampilkan berapa waktu yang telah berlalu sejak pengguna menekan tombol "Mulai", Anda perlu melacak kapan tombol "Mulai" ditekan dan waktu saat ini. **Informasi ini digunakan untuk _rendering_, sehingga Anda akan menyimpannya dalam _state_:**

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
    // Mulai menghitung
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Memperbarui waktu saat ini setiap 10ms.
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

Ketika tombol "Berhenti" ditekan, Anda perlu membatalkan _interval_ yang ada sehingga berhenti memperbarui nilai dari variabel _state_ `now`. Anda dapat melakukannya dengan memanggil [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), tetapi Anda harus memberikan _interval ID_ yang sebelumnya dikembalikan oleh pemanggilan `setInterval` saat pengguna menekan "Mulai". Anda perlu menyimpan _interval ID_ tersebut di suatu tempat. **Karena _interval ID_ tidak digunakan untuk _rendering_, Anda dapat menyimpannya dalam _ref_**:

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

Ketika sebuah informasi digunakan untuk _rendering_, simpanlah di dalam _state_. Ketika sebuah informasi hanya dibutuhkan oleh _event handler_ dan perubahan informasi tersebut tidak memerlukan _rerender_, menggunakan _ref_ mungkin akan lebih efisien.

## Perbedaan antara _refs_ dan _state_ {/*differences-between-refs-and-state*/}

Mungkin Anda berpikir bahwa _ref_ terlihat kurang "ketat" dibandingkan dengan _state_ - Anda dapat memutasi _ref_ daripada selalu harus menggunakan fungsi pengaturan _state_, misalnya. Tetapi dalam kebanyakan kasus, Anda akan ingin menggunakan _state_. _Ref_ adalah "jalan keluar" yang tidak sering Anda butuhkan. Berikut adalah perbandingan antara _state_ dan _ref_:

| _refs_                                                                                  | _state_                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` mengembalikan `{ current: initialValue }`                            | `useState(initialValue)` mengembalikan nilai saat ini dari sebuah variabel state dan sebuah fungsi pengatur state. ( `[value, setValue]`) |
| Tidak memicu _rerender_ ketika Anda mengubahnya.                                         | Memicu _rerender_ ketika Anda mengubahnya.                                                                                    |
| _Mutable_—Anda dapat memodifikasi dan memperbarui nilai `current` di luar proses rendering. | _Immutable_—Anda harus menggunakan fungsi pengatur state untuk memodifikasi variabel state agar terjadwal ulang (_rerender_).                       |
| Anda sebaiknya tidak membaca (atau menulis) nilai `current` selama proses _rendering_. | Anda dapat membaca state kapan saja. Namun, setiap _render_ state memiliki [snapshot](/learn/state-as-a-snapshot) sendiri yang tidak berubah.

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

Karena nilai `count` ditampilkan, maka masuk akal untuk menggunakan nilai _state_ untuk hal tersebut. Ketika nilai hitung diatur dengan `setCount()`, React akan _merender_ ulang komponen dan layar akan diperbarui untuk mencerminkan hitungan baru.

Jika Anda mencoba mengimplementasikan ini dengan menggunakan _ref_, React tidak akan pernah melakukan _rerender_ pada komponen, sehingga Anda tidak akan pernah melihat perubahan hitungan! Lihat bagaimana mengeklik tombol ini **tidak memperbarui teks-nya**:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Hal ini tidak memicu rerender pada komponen
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

Inilah mengapa membaca `ref.current` selama proses `render` akan menghasilkan kode yang tidak dapat diandalkan. Jika kamu membutuhkan akses nilai pada saat proses render, lebih baik gunakan _state_.

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

Pada saat render pertama kali, `useRef` akan mengembalikan nilai `{ current: initialValue }`. Objek ini akan disimpan oleh React, sehingga pada saat render berikutnya, objek yang sama akan dikembalikan. Perhatikan bahwa dalam contoh ini, pengatur dari _state_ tidak digunakan. Pengatur _state_ tidak diperlukan karena `useRef` selalu harus mengembalikan objek yang sama!

React menyediakan versi bawaan dari `useRef` karena cukup umum dalam praktiknya. Namun, Anda bisa memikirkannya sebagai variabel state biasa tanpa pengatur. Jika Anda akrab dengan pemrograman berorientasi objek, _ref_ mungkin mengingatkan Anda pada _instance fields_--tetapi bukannya `this.something`, Anda menulis `somethingRef.current`.

</DeepDive>

## Kapan untuk menggunakan _refs_ {/*when-to-use-refs*/}

Biasanya, Anda akan menggunakan _ref_ ketika komponen Anda perlu "keluar" dari React dan berkomunikasi dengan _API_ eksternal - seringkali _API_ peramban yang tidak mempengaruhi tampilan komponen. Berikut adalah beberapa situasi langka di mana Anda bisa menggunakan _refs_:

- Menyimpan [_timeout IDs_](https://developer.mozilla.org/docs/Web/API/setTimeout)
- Menyimpan dan memanipulasi [elemen DOM](https://developer.mozilla.org/docs/Web/API/Element), yang akan dibahas pada [halaman berikutnya](/learn/manipulating-the-dom-with-refs)
- Menyimpan objek lain yang tidak diperlukan untuk menghitung JSX.

Jika komponen Anda perlu menyimpan beberapa nilai, tetapi tidak mempengaruhi logika _rendering_, pilihlah penggunaan _refs_.

## Praktik terbaik menggunakan _refs_ {/*best-practices-for-refs*/}

Mengikuti prinsip-prinsip ini akan membuat komponen Anda lebih dapat diprediksi:

- **Gunakan _refs_ sebagai "jalan keluar"**. _Refs_ berguna ketika Anda bekerja dengan sistem eksternal atau _API_ peramban. Jika sebagian besar logika aplikasi dan aliran data bergantung pada _refs_, mungkin perlu untuk mempertimbangkan kembali pendekatan yang digunakan.

- **Jangan membaca atau menulis `ref.current` selama proses rendering**. Jika beberapa informasi dibutuhkan selama _rendering_, gunakan [state](/learn/state-a-components-memory) sebagai gantinya. Karena React tidak mengetahui perubahan pada `ref.current`, bahkan membacanya selama _rendering_ membuat perilaku komponen sulit diprediksi. (Satu-satunya pengecualian untuk ini adalah kode seperti `if (!ref.current) ref.current = new Thing()` yang hanya mengatur _ref_ sekali selama _render_ pertama.)

Keterbatasan dari _state_ di React tidak berlaku pada _refs_. Sebagai contoh, _state_ bertindak seperti [snapshot untuk setiap render](/learn/state-as-a-snapshot) dan [tidak memperbarui sinkron secara langsung](/learn/queueing-a-series-of-state-updates). Namun ketika Anda memutasi nilai saat ini dari sebuah _ref_, perubahannya langsung terjadi:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Ini karena **_ref_ itu sendiri adalah objek JavaScript biasa**, dan karena itu berperilaku seperti objek biasa.

Anda juga tidak perlu khawatir tentang [menghindari mutasi](/learn/updating-objects-in-state) saat bekerja dengan _ref_. Selama objek yang Anda ubah tidak digunakan untuk _rendering_, React tidak peduli apa yang Anda lakukan dengan _ref_ atau isinya.

## _Refs_ dan _DOM_ {/*refs-and-the-dom*/}

Anda dapat memberikan nilai apapun kepada _ref_. Namun, penggunaan _ref_ yang paling umum adalah untuk mengakses sebuah elemen _DOM_. Misalnya, hal ini berguna jika Anda ingin memberi fokus pada sebuah input secara programatik. Ketika Anda mengoper sebuah _ref_ ke dalam atribut `ref` di _JSX_, seperti `<div ref={myRef}>`, React akan menempatkan elemen _DOM_ yang sesuai ke dalam `myRef.current`. Anda dapat membaca lebih lanjut tentang hal ini di [Memanipulasi DOM dengan Refs](/learn/manipulating-the-dom-with-refs).

<Recap>

- _Ref_ adalah "jalan keluar" untuk menyimpan nilai yang tidak digunakan untuk merender. Anda tidak akan membutuhkannya terlalu sering.
- _Ref_ adalah objek JavaScript biasa dengan satu properti yang disebut `current`, yang dapat Anda baca atau mengaturnya.
- Anda dapat meminta React untuk memberikan Anda sebuah _ref_ dengan memanggil Hook `useRef`.
- Seperti _state_, _ref_ memungkinkan Anda mempertahankan informasi antara _rerenders_ dari komponen.
- Tidak seperti _state_, mengatur nilai `current` dari _ref_ tidak memicu _rerender_.
- Jangan membaca atau mengubah `ref.current` selama _merender_. Hal ini membuat perilaku komponen Anda sulit diprediksi.

</Recap>



<Challenges>

#### Memperbaiki _chat input_ yang rusak {/*fix-a-broken-chat-input*/}

Ketikkan pesan dan klik "Kirim". Anda akan melihat ada penundaan tiga detik sebelum Anda melihat _alert_ "Terkirim!". Selama penundaan ini, Anda dapat melihat tombol "_Undo_". Klik tombol "_Undo_". Tombol "_Undo_" ini seharusnya menghentikan pesan "Terkirim!" untuk muncul. Ini dilakukan dengan memanggil [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) untuk ID waktu tunggu yang disimpan selama `handleSend`. Namun, bahkan setelah "_Undo_" diklik, pesan "Terkirim!" tetap muncul. Temukan mengapa ini tidak berfungsi dan perbaikilah.

<Hint>

Variabel biasa seperti `let timeoutID` tidak "bertahan" antara _rerender_ karena setiap _rerender_ akan menjalankan komponen dari awal (dan menginisialisasi variabel-variabelnya) kembali. Apakah Anda harus menyimpan _timeout ID_ di tempat lain?

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

Setiap kali komponen Anda _dirender_ ulang (seperti saat Anda mengatur _state_), semua variabel lokal akan diinisialisasi dari awal. Inilah sebabnya mengapa Anda tidak dapat menyimpan _timeout ID_ dalam variabel lokal seperti `timeoutID` dan kemudian mengharapkan `event handler` lainnya untuk "melihat"nya di masa depan. Sebaliknya, simpanlah _timeout ID_ di dalam sebuah _ref_, yang akan dipertahankan oleh React antara _render_.

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


#### Perbaiki komponen yang gagal untuk _dirender_ kembali {/*fix-a-component-failing-to-re-render*/}

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

Dalam contoh ini, nilai saat ini dari sebuah _ref_ digunakan untuk menghitung output _rendering_: `{isOnRef.current ? 'Nyala' : 'Mati'}`. Ini menunjukkan bahwa informasi ini seharusnya tidak berada dalam sebuah _ref_, dan seharusnya disimpan dalam _state_. Untuk memperbaikinya, hapus _ref_ dan gunakan state sebagai gantinya:

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

#### Perbaiki _debouncing_ {/*fix-debouncing*/}

Pada contoh ini, semua penangan klik tombol di-_debounce_. Untuk melihat apa artinya, tekan salah satu tombol. Perhatikan bagaimana pesan muncul satu detik kemudian. Jika Anda menekan tombol sambil menunggu pesan, waktu akan direset. Jadi jika Anda terus mengeklik tombol yang sama secara cepat beberapa kali, pesan tidak akan muncul sampai satu detik _setelah_ Anda berhenti mengeklik. _Debouncing_ memungkinkan Anda menunda beberapa tindakan sampai pengguna "berhenti melakukan sesuatu".

Contoh ini berfungsi, tetapi tidak sepenuhnya seperti yang dimaksudkan. Tombol-tombolnya tidak independen. Untuk melihat masalahnya, klik salah satu tombol, lalu segera klik tombol lain. Anda akan mengharapkan bahwa setelah penundaan, Anda akan melihat pesan dari kedua tombol. Tetapi hanya pesan dari tombol terakhir yang muncul. Pesan dari tombol pertama hilang.

Mengapa tombol-tombol saling mengganggu satu sama lain? Temukan dan perbaiki masalahnya.

<Hint>

Variabel `timeoutID` dibagikan antara semua komponen `DebouncedButton`. Ini adalah mengapa mengeklik satu tombol akan mereset waktu tunggu tombol yang lain. Bisakah Anda menyimpan _ID_ waktu tunggu yang terpisah untuk setiap tombol?

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

Sebuah variabel seperti `timeoutID` bersifat global diantara semua komponen. Inilah sebabnya mengapa mengeklik tombol kedua akan mengatur ulang _timeout_ yang tertunda di tombol pertama. Untuk memperbaikinya, Anda dapat menyimpan _timeout_ dalam _ref_. Setiap tombol akan memiliki _ref_-nya sendiri, sehingga tidak akan saling bertentangan satu sama lain. Perhatikan bagaimana mengeklik dua tombol dengan cepat akan menampilkan kedua pesan.

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

#### Membaca nilai _state_ terbaru {/*read-the-latest-state*/}

Pada contoh ini, setelah Anda menekan "Kirim", ada jeda sebentar sebelum pesan ditampilkan. Ketikkan "halo", klik Kirim, lalu cepat edit input kembali. Meskipun Anda mengedit, alert masih akan menampilkan "halo" (yang merupakan nilai state [pada saat](/learn/state-as-a-snapshot#state-over-time) tombol diklik).

Biasanya, perilaku ini yang Anda inginkan di dalam sebuah aplikasi. Namun, mungkin ada kasus-kasus tertentu di mana Anda ingin beberapa kode asinkron membaca versi _terbaru_ dari suatu _state_. Bisakah Anda memikirkan cara untuk membuat _alert_ menampilkan teks masukan _saat ini_ daripada saat tombol diklik?

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

Dalam contoh ini, state bekerja [seperti snapshot](/learn/state-as-a-snapshot), sehingga Anda tidak dapat membaca +state+ terbaru dari operasi asinkron seperti _timeout_. Namun, Anda dapat menyimpan teks input terbaru dalam _ref_. _Ref_ bersifat _mutable_(dapat diubah), sehingga Anda dapat membaca properti `current` kapan saja. Karena teks saat ini juga digunakan untuk _merender_, pada contoh ini, Anda akan memerlukan keduanya, variabel _state_ (untuk _merender_), dan _ref_ (untuk membacanya di _timeout_). Anda harus memperbarui nilai _ref_ saat ini secara manual.

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
