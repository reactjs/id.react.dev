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

Anda mungkin berharap bahwa menekan tombol "+3" akan menambahkan hitungan tiga kali karena memanggil `setNumber(number + 1)` tiga kali:

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

It is an uncommon use case, but if you would like to update the same state variable multiple times before the next render, instead of passing the *next state value* like `setNumber(number + 1)`, you can pass a *function* that calculates the next state based on the previous one in the queue, like `setNumber(n => n + 1)`. It is a way to tell React to "do something with the state value" instead of just replacing it.

Ini bukanlah penggunaan yang umum, tetapi jika Anda ingin memperbarui variabel *state* yang sama berulang kali sebelum *render* selanjutnya, alih-alih mengoper nilai *state* selanjutnya seperti `setNumber(number + 1)`, Anda dapat mengoper *function* yang menghitung *state* selanjutnya berdasarkan nilai sebelumnya pada antrean, seperti `setNumber(n => n + 1)`. Ini adalah cara untuk memberi tahu React untuk "melakukan sesuatu dengan nilai *state*" daripada hanya menggantinya.

Cobalah untuk menambahkan hitungan sekarang:

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

Disini, `n => n + 1` disebut fungsi *updater.* Ketika Anda mengirimkannya ke pengatur (*setter*) state:

1. React mengantre fungsi ini untuk diproses setelah semua kode lain dalam *event handler* dijalankan.  
2. Saat render berikutnya, React akan melewati antrean dan memberi Anda *state* terakhir yang diperbarui.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Berikut adalah cara kerja React melalui baris kode ini saat menjalankan *event handler*:

1. `setNumber(n => n + 1)`: `n => n + 1` is a function. React adds it to a queue.
1. `setNumber(n => n + 1)`: `n => n + 1` is a function. React adds it to a queue.
1. `setNumber(n => n + 1)`: `n => n + 1` is a function. React adds it to a queue.

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

#### Fix a request counter {/*fix-a-request-counter*/}

You're working on an art marketplace app that lets the user submit multiple orders for an art item at the same time. Each time the user presses the "Buy" button, the "Pending" counter should increase by one. After three seconds, the "Pending" counter should decrease, and the "Completed" counter should increase.

However, the "Pending" counter does not behave as intended. When you press "Buy", it decreases to `-1` (which should not be possible!). And if you click fast twice, both counters seem to behave unpredictably.

Why does this happen? Fix both counters.

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

Inside the `handleClick` event handler, the values of `pending` and `completed` correspond to what they were at the time of the click event. For the first render, `pending` was `0`, so `setPending(pending - 1)` becomes `setPending(-1)`, which is wrong. Since you want to *increment* or *decrement* the counters, rather than set them to a concrete value determined during the click, you can instead pass the updater functions:

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

This ensures that when you increment or decrement a counter, you do it in relation to its *latest* state rather than what the state was at the time of the click.

</Solution>

#### Implement the state queue yourself {/*implement-the-state-queue-yourself*/}

In this challenge, you will reimplement a tiny part of React from scratch! It's not as hard as it sounds.

Scroll through the sandbox preview. Notice that it shows **four test cases.** They correspond to the examples you've seen earlier on this page. Your task is to implement the `getFinalState` function so that it returns the correct result for each of those cases. If you implement it correctly, all four tests should pass.

You will receive two arguments: `baseState` is the initial state (like `0`), and the `queue` is an array which contains a mix of numbers (like `5`) and updater functions (like `n => n + 1`) in the order they were added.

Your task is to return the final state, just like the tables on this page show!

<Hint>

If you're feeling stuck, start with this code structure:

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

Fill out the missing lines!

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

This is the exact algorithm described on this page that React uses to calculate the final state:

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

Now you know how this part of React works!

</Solution>

</Challenges>
