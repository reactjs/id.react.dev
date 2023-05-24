---
title: Mengantre Serangkaian Pembaruan State
---

<Intro>

Mengatur variabel *state* akan menambahkan antrean (*queue*) *render* baru. Terkadang Anda ingin melakukan beberapa operasi terhadap nilai sebelum menambahkan antrean *render* selanjutnya. Untuk melakukannya, penting untuk memahami bagaimana React melakukan pembaruan *state* secara berkelompok.

</Intro>

<YouWillLearn>

* Apa itu "pengelompokan (*batching*)" dan bagaimana React menggunakannya untuk memproses beberapa pembaruan *state*
* Bagaimana menerapkan beberapa pembaruan ke variabel *state* yang sama secara berurutan

</YouWillLearn>

## Mengelompokkan pembaruan state dalam React  {/*react-batches-state-updates*/}

Anda mungkin berharap bahwa menekan tombol "+3" akan menambahkan penghitung tiga kali karena memanggil `setNumber(number + 1)` tiga kali:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Namun, seperti yang mungkin Anda ingat dari bagian sebelumnya, [nilai *state* setiap *render* adalah tetap](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), sehingga nilai `number` di dalam *event handler* *render* pertama selalu `0`, tidak peduli berapa kali Anda memanggil `setNumber(1)`:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Akan tetapi, ada satu faktor lain yang berperan di sini. **React menunggu sampai semua kode dalam *event handler* selesai dijalankan sebelum memproses pembaruan *state* Anda.** Inilah sebabnya mengapa *re-render* hanya terjadi setelah semua `setNumber()` dipanggil.

Ini mungkin mengingatkan Anda pada seorang pelayan yang menerima pesanan di restoran. Seorang pelayan tidak berlari ke dapur saat Anda menyebutkan hidangan pertama Anda! Sebaliknya, mereka membiarkan Anda menyelesaikan pesanan Anda, membiarkan Anda mengubahnya, dan bahkan menerima pesanan dari orang lain di meja tersebut.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="Sebuah kursor elegan di sebuah restoran memesan beberapa kali dengan React, memainkan peran pelayan. Setelah dia memanggil setState() beberapa kali, pelayan menulis yang terakhir yang dia minta sebagai pesanan akhirnya." />

Ini memungkinkan Anda memperbarui beberapa variabel *state*--bahkan dari beberapa komponen--tanpa memicu terlalu banyak [*re-render*.](/learn/render-and-commit#re-renders-when-state-updates) Akan tetapi, hal ini ini membuat UI tidak akan diperbarui hingga _setelah_ *event handler* Anda, dan kode apa pun di dalamnya, selesai dijalankan. Perilaku ini, juga dikenal sebagai **pengelompokan,** membuat aplikasi React Anda berjalan lebih cepat. Ini juga menghindari penanganan *render* "setengah jadi" yang membingungkan ketika hanya beberapa variabel yang diperbarui.

**React tidak melakukan pengelompokkan pada beberapa *event* yang disengaja, seperti klik**--setiap klik ditangani secara terpisah. Pastikan bahwa React hanya melakukan pengelompokan ketika aman untuk dilakukan. Ini memastikan bahwa, misalnya, jika klik tombol pertama menonaktifkan *form*, klik kedua tidak akan mengirimkannya lagi.

## Memperbarui state yang sama beberapa kali sebelum render selanjutnya {/*updating-the-same-state-multiple-times-before-the-next-render*/}

Ini bukanlah penggunaan yang umum, tetapi jika Anda ingin memperbarui variabel *state* yang sama berulang kali sebelum *render* selanjutnya, daripada mengoper nilai *state* selanjutnya seperti `setNumber(number + 1)`, Anda dapat mengoper sebuah fungsi yang menghitung *state* selanjutnya berdasarkan nilai sebelumnya pada antrean, seperti `setNumber(n => n + 1)`. Ini adalah cara untuk memberi tahu React untuk "melakukan sesuatu dengan nilai *state*" daripada hanya menggantinya.

Cobalah untuk menambahkan penghitung sekarang:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Di sini, `n => n + 1` disebut fungsi *updater.* Ketika Anda mengirimkannya ke pengatur (*setter*) state:

1. React mengantre fungsi ini untuk diproses setelah semua kode lain dalam *event handler* dijalankan.  
2. Saat *render* berikutnya, React akan melewati antrean dan memberi Anda *state* terakhir yang diperbarui.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Berikut adalah cara kerja React melalui baris kode ini saat menjalankan *event handler*:

1. `setNumber(n => n + 1)`: `n => n + 1` adalah sebuah fungsi. React menambahkannya ke dalam antrean.
2. `setNumber(n => n + 1)`: `n => n + 1` adalah sebuah fungsi. React menambahkannya ke dalam antrean.
3. `setNumber(n => n + 1)`: `n => n + 1` adalah sebuah fungsi. React menambahkannya ke dalam antrean.

Ketika Anda memanggil `useState` saat *render* berikutnya, React akan melewati antrean. *State* `number` sebelumnya adalah `0`, jadi itulah yang akan diteruskan React ke fungsi *updater* pertama sebagai argumen `n`. Kemudian React mengambil hasil dari fungsi *updater* sebelumnya dan meneruskannya ke *updater* berikutnya sebagai `n`, dan begitu seterusnya:

|  antrean diperbarui | `n` | hasil |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React menyimpan `3` sebagai hasil akhir dan mengembalikannya dari `useState`.

Inila mengapa mengklik "+3" pada contoh di atas dengan benar meningkatkan nilai sebesar 3.
### Apa yang terjadi jika Anda memperbarui state setelah menggantinya {/*what-happens-if-you-update-state-after-replacing-it*/}

Bagaimana dengan *event handler* ini? Menurut Anda berapa nilai `number` pada *render* berikutnya?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Begini cara *event handler* memberitahu React apa yang harus dilakukan:

1. `setNumber(number + 5)`: `number` adalah `0` maka `setNumber(0 + 5)`. React menambahkan "ganti dengan `5`" ke antreannya.
2. `setNumber(n => n + 1)`: `n => n + 1` merupakan fungsi *updater*. React menambahkan fungsi tersebut ke antreannya.

Selama *render* berikutnya, React melewati antrean *state*:

|   antrean diperbarui       | `n` | hasil |
|--------------|---------|-----|
| "ganti dengan `5`" | `0` (tak terpakai) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React menyimpan `6` sebagai hasil akhir dan mengembalikannya dari `useState`.

<Note>

Anda mungkin sadar bahwa `setState(5)` sebenarnya bekerja seperti `setState(n => 5)`, tetapi `n` tidak terpakai! 

</Note>

### Apa yang terjadi jika Anda mengganti state setelah memperbaruinya {/*what-happens-if-you-replace-state-after-updating-it*/}

Mari kita coba satu contoh lagi. Menurut Anda berapa nilai `number` pada *render* berikutnya?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Begini cara React bekerja melalui baris kode ini saat menjalankan *event handler*:

1. `setNumber(number + 5) : `number` adalah `0` maka `setNumber(0 + 5)`. React menambahkan "ganti dengan `5`" ke antreannya.
2. `setNumber(n => n + 1)`: `n => n + 1` adalah fungsi *updater*. React menambahkan fungsi tersebut ke antreannya.
3. `setNumber(42)`: React menambahkan "ganti dengan `42`" ke antreannya.

Selama *render* berikutnya, React melewati antrean *state*:

|   antrean diperbarui       | `n` | hasil |
|--------------|---------|-----|
| "ganti dengan `5`" | `0` (tak terpakai) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "ganti dengan `42`" | `6` (tak terpakai) | `42` |

Akibatnya, React menyiapkan `42` sebagai hasil akhir dan mengembalikannya dari `useState`.

Jadi, kesimpulannya adalah berikut cara Anda dapat memikirkan apa yang anda oper ke pengatur *state* `setNumber`:

* **Sebuah fungsi *updater*** (misalnya `n => n + 1`) ditambahkan ke antrean.
* **Apapun nilai lainnya** (misalnya angka `5`) menambahkan "ganti dengan `5`" ke antrean, mengabaikan apa yang sudah ada di antrean.

Setelah *event handler* selesai, React akan memicu *re-render*. Selama *re-render*, React akan memproses antrean. Fungsi *updater* berjalan selama proses *render*, jadi **fungsi *updater* harus [murni](/learn/keeping-components-pure)** dan hanya mengembalikan hasilnya. Jangan mencoba mengatur *state* dari dalamnya atau menjalankan efek samping lainnya. Dalam *Strict Mode*, React akan menjalankan setiap fungsi *updater* dua kali (tetapi membuang hasil kedua) untuk membantu Anda menemukan kesalahan.

### Konvensi penamaan {/*naming-conventions*/}

Seringkali nama fungsi *updater* diambil dari huruf pertama variabel *state* yang sesuai:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Jika Anda lebih suka kode yang lebih panjang, konvensi umum lainnya adalah mengulangi nama variabel *state* lengkap, seperti `setEnabled(enabled => !enabled)`, atau menggunakan awalan seperti `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Mengatur *state* tidak mengubah variabel dalam *render* yang sudah ada, tetapi meminta *render* baru.
* React memproses pembaruan *state* setelah *event handler* selesai berjalan. Ini disebut pengelompokan.
* untuk memperbarui beberapa *state* beberapa kali dalam satu *event*, Anda dapat menggunakan fungsi *updater* `setNumber(n => n + 1)`.

</Recap>



<Challenges>

#### Memperbaiki penghitung permintaan {/*fix-a-request-counter*/}

Anda bekerja pada aplikasi pasar seni yang memungkinkan pengguna mengirimkan beberapa pesanan untuk item seni pada saat yang sama. Setiap kali pengguna menekan tombol "Buy", penghitung "Pending" harus bertambah satu. Setelah tiga detik, penghitung "Pending" harus berkurang, dan penghitung "Completed" harus bertambah.

Akan tetapi, penghitung "Pending" tidak berperilaku seperti yang diharapkan. Ketika Anda menekan "Buy", ia berkurang menjadi `-1` (yang seharusnya tidak mungkin!). Dan jika Anda mengklik cepat dua kali, kedua penghitung tampaknya berperilaku diluar kendali.

Mengapa ini terjadi? Perbaikilah kedua penghitung.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

Di dalam *event handler* `handleClick`, nilai `pending` dan `completed` sesuai dengan apa yang mereka lakukan pada saat klik. Untuk *render* pertama, `pending` adalah `0` sehingga `setPending(pending - 1)` menjadi `setPending(-1)`, ini salah. Karena Anda ingin menambah atau mengurangi penghitung, bukan mengaturnya ke nilai konkret yang ditentukan selama klik, Anda dapat mengirimkan fungsi *updater*:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Ini memastikan bahwa ketika Anda menambah atau mengurangi penghitung, Anda melakukannya dalam kaitannya dengan *state* terbaru daripada *state* pada saat klik.

</Solution>

#### Implementasikan antrean state sendiri {/*implement-the-state-queue-yourself*/}

Dalam tantangan ini, Anda akan mengimplementasikan kembali bagian kecil dari React dari awal! Ini tidak sesulit kedengarannya.

Gulir (*scroll*) melalui pratinjau (*preview*) *sandbox*. Perhatikan bahwa itu menunjukkan **empat kasus uji.** Mereka sesuai dengan contoh yang telah Anda lihat sebelumnya di halaman ini. Tugas Anda adalah mengimplementasikan fungsi `getFinalState` sehingga mengembalikan hasil yang benar untuk masing-masing kasus tersebut. Jika Anda mengimplementasikannya dengan benar, keempat tes harus lulus.

Anda akan menerima dua argumen: `baseState` adalah *state* awal (seperti `0`), dan `queue` adalah array yang berisi campuran angka (seperti `5`) dan fungsi *updater* (seperti `n => n + 1`) sesuai dengan urutan mereka ditambahkan.

Tugas Anda adalah mengembalikan *state* akhir, seperti tabel pada halaman ini menunjukkan!

<Hint>

Jika Anda merasa terjebak, mulailah dengan struktur kode ini:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

Isi baris yang hilang!

</Hint>

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Ini merupakan algoritma paling tepat yang digunakan React untuk menghitung state akhir:

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

Sekarang Anda tahu bagaimana bagian React ini bekerja!

</Solution>

</Challenges>
