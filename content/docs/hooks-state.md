---
id: hooks-state
title: Menggunakan State Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

*Hooks* merupakan fitur baru di React 16.8. Fitur ini memungkinkan Anda menggunakan *state* dan fitur React lainnya tanpa menuliskan sebuah kelas.

Halaman [Memperkenalkan *Hooks*](/docs/hooks-intro.html) menggunakan contoh sebagai berikut:

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // Deklarasi variabel state baru yang kita sebut "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Anda menekan sebanyak {count} kali</p>
      <button onClick={() => setCount(count + 1)}>
        Klik saya
      </button>
    </div>
  );
}
```

Kita akan mulai belajar tentang *Hooks* dengan membandingkan kode berikut dengan contoh yang sama dengan kelas.

## Contoh Kelas yang Sama {#equivalent-class-example}

Apabila Anda telah menggunakan kelas di React sebelumnya, potongan kode di bawah ini seharusnya terlihat familier:

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>Anda menekan sebanyak {this.state.count} kali</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Klik saya
        </button>
      </div>
    );
  }
}
```

*State* dimulai dengan `{ count: 0 }` dan kita tambah nilai `state.count` ketika pengguna menekan sebuah tombol dengan memanggil `this.setState()`. Kita akan menggunakan cuplikan dari kelas berikut kedepannya.

>Catatan
>
>Anda mungkin berfikir kenapa kita menggunakan *counter* dibandingkan dengan menggunakan contoh yang lebih realistis. Ini membantu kita untuk fokus kepada API ketika kita masih belajar tentang *Hooks*.

## Hooks dan Function Components {#hooks-and-function-components}

Sebagai pengingat, *function components* di React terlihat seperti ini:

```js
const Example = (props) => {
  // Anda bisa menggunakan Hooks di sini!
  return <div />;
}
```

atau seperti ini:

```js
function Example(props) {
  // Anda bisa menggunakan Hooks di sini!
  return <div />;
}
```

Anda mungkin sebelumnya sudah tahu hal ini sebagai *"stateless components"*. Sekarang kami akan mengenalkan kemampuan untuk menggunakan *state* di dalamnya, jadi kami memilih untuk menyebutnya sebagai *"function components"*.

*Hooks* **tidak** bekerja di dalam kelas. Tapi Anda dapat menggunakannya sebagai ganti untuk menulis kelas.

## Apa itu *Hook*? {#whats-a-hook}

Contoh baru kita akan dimulai dengan mengimpor *Hook* `useState` dari React:

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**Apa itu *Hook*?** *Hook* adalah fungsi spesial yang memungkinkan Anda "terhubung" dengan fitur-fitur di React. Sebagai contoh, `useState` adalah sebuah *Hook* yang memungkinkan Anda memberi *state* pada *function components*. Kita akan membahas *Hooks* lainnya nanti.

**Kapan saya butuh menggunakan *Hook*?** Jika Anda menulis sebuah *function component* dan menyadari bahwa Anda membutuhkan beberapa *state* di dalamnya, sebelumnya Anda harus mengubahnya ke dalam sebuah kelas. Sekarang Anda dapat menggunakan *Hook* di dalam *function component* yang sudah ada. Kita akan melakukannya sekarang!

>Catatan:
>
>Ada beberapa aturan khusus tentang di mana Anda bisa dan tidak bisa menggunakan *Hooks* dalam suatu komponen. Kita akan mempelajarinya di [Aturan *Hooks*](/docs/hooks-rules.html).

## Deklarasi Sebuah Variabel *State* {#declaring-a-state-variable}

Di dalam kelas, kita menginisialisasi *state* `count` bernilai `0` dengan mengatur `this.state` menjadi `{ count: 0 }` di dalam *constructor*:

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

Di dalam sebuah *function component*, kita tidak memiliki `this`, jadi kita tidak bisa menulis atau membaca `this.state`. Sebagai gantinya, kita dapat memanggil *Hook* `useState` secara langsung di dalam komponen kita:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Deklarasi variabel state baru yang kita sebut "count"
  const [count, setCount] = useState(0);
```

**Apa yang terjadi ketika memanggil `useState`?** Ini mendeklarasi sebuah "variabel *state*". Variabel kita bernama `count` tapi kita dapat menyebutnya sesuatu yang lain seperti `pisang`. Ini merupakan cara untuk "menjaga" nilai-nilai antar pemanggilan fungsi — `useState` adalah cara baru untuk menggunakan kapabilitas yang sama persis dengan `this.state` berikan di dalam sebuah kelas. Biasanya variabel-variabel "menghilang" ketika sebuah fungsi selesai tetapi variabel *state* "dipertahankan" oleh React.

**Apa yang kita berikan ke `useState` sebagai sebuah argumen?** Satu-satunya argumen *Hook* `useState()` adalah *state* awal. Tidak seperti kelas, *state* tidak harus berbentuk sebuah objek. Kita dapat menyimpan angka atau *string* jika hanya itu yang kita butuhkan. Seperti di contoh, kita hanya membutuhkan angka untuk berapa kali klik dilakukan oleh user, jadi berikan `0` sebagai *state* awal untuk variabel kita. (Apabila kita ingin menyimpan dua nilai yang berbeda di dalam *state*, kita akan memanggil `useState()` dua kali.)

**Apa yang dikembalikan `useState`?** Ini mengembalikan sepasang nilai: *state* saat ini dan fungsi untuk melakukan pembaruan. Inilah kenapa kita menulis `const [count, setCount] = useState()`. Hal ini sama dengan `this.state.count` dan `this.setState` di dalam sebuah kelas, namun Anda mendapatinya sepasang. Jika Anda tidak akrab dengan sintaksis yang kami gunakan, kita akan kembali ke sana [di bagian bawah halaman ini](/docs/hooks-state.html#tip-what-do-square-brackets-mean).

Sekarang kita tahu apa yang dilakukan *Hook* `useState`, contoh kode berikut akan lebih masuk akal:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Deklarasi variabel state baru yang kita sebut "count"
  const [count, setCount] = useState(0);
```

Kita mendeklarasikan sebuah *state* bernama `count`, dan memberinya nilai `0`. React akan mengingat nilai saat ini di setiap *render* ulang, dan memberikan nilai terbaru ke fungsi kita. Jika kita ingin melakukan pembaruan nilai `count`, kita dapat memanggil `setCount`.

>Catatan
>
>Anda mungkin berfikir: kenapa `useState` tidak diberi nama `createState`?
>
>"Create" tidak cukup akurat karena *state* hanya dibuat saat pertama kali komponen di-*render*. Pada *render* selanjutnya, `useState` memberi kita *state* saat ini. Jika tidak, itu tidak akan menjadi *state* sama sekali! Itu juga alasan kenapa penamaan pada *Hooks* dimulai dengan `use`. Kita akan mempelajari alasannya di [Aturan *Hooks*](/docs/hooks-rules.html).

## Membaca *State* {#reading-state}

Ketika kita ingin menampilkan jumlah *count* saat ini di dalam sebuah kelas, kita membaca `this.state.count`:

```js
  <p>Anda menekan sebanyak {this.state.count} kali</p>
```

Di dalam sebuah fungsi, kita dapat menggunakan `count` secara langsung:


```js
  <p>Anda menekan sebanyak {count} kali</p>
```

## Melakukan pembaruan *State* {#updating-state}

Di dalam sebuah kelas, kita perlu untuk memanggil `this.setState()` untuk melakukan pembaruan *state* `count`:

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Klik saya
  </button>
```

Di dalam sebuah fungsi, kita memiliki `setCount` dan `count` sebagai variabel jadi kita tidak memerlukan `this`:

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Klik saya
  </button>
```

## Rekap {#recap}

Mari sekarang **rekap apa yang kita pelajari baris demi baris** dan cek pemahaman kita.

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js{1,4,9}
 1:  import React, { useState } from 'react';
 2:
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>Anda menekan sebanyak {count} kali</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Klik saya
11:        </button>
12:      </div>
13:    );
14:  }
```

* **Baris 1:** Kita mengimpor *Hook* `useState` dari React. Ini memungkinkan kita dapat menyimpan *state* lokal di dalam sebuah *function component*.
* **Baris 4:** Di dalam komponen `Example`, kita mendeklarasikan sebuah variabel *state* baru dengan memanggil *Hook* `useState`. Ini mengembalikan sepasang nilai yang kita beri nama sendiri. Kita memberi nama variable tersebut dengan `count` karena menyimpan angka berapa kali klik pada tombol dilakukan. Kita menginisialisasi nilai nol dengan memberi `0` sebagai argumen satu-satunya `useState`. Item kedua yang dikembalikan adalah sebuah fungsi. Ini memungkinkan kita melakukan pembaruan nilai `count` jadi kita menamainya `setCount`.
* **Baris 9:** Ketika pengguna melakukan klik, kita memanggil `setCount` dengan nilai baru. React akan melakukan *render* ulang komponen `Example` dengan nilai `count` yang baru.

Ini mungkin tampak seperti banyak yang harus dilakukan pada awalnya. Jangan terburu-buru! Jika Anda tersesat dalam penjelasannya, lihat kembali kode di atas dan coba untuk membacanya dari atas ke bawah. Kami berjanji ketika Anda mencoba "melupakan" bagaimana *state* bekerja di dalam kelas, dan dengan melihat kode ini dengan mata yang segar, ini akan menjadi masuk akal.

### Tip: Apa arti tanda kurung siku?{#tip-what-do-square-brackets-mean}

Anda mungkin telah memperhatikan tanda kurung siku saat kita mendeklarasikan variabel *state*:

```js
  const [count, setCount] = useState(0);
```

Nama-nama di sebelah kiri bukan bagian dari React API. Anda bisa memberi nama variabel *state* Anda sendiri:

```js
  const [fruit, setFruit] = useState('banana');
```

Sintaksis JavaScript ini dikenal dengan [*array destructuring*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring). Sintaksis ini berarti kita membuat dua variabel `fruit` dan `setFruit`, di mana `fruit` adalah nilai pertama yang dikembalikan oleh `useState`, dan `setFruit` adalah yang kedua. Ini sama dengan kode berikut:

```js
  var fruitStateVariable = useState('banana'); // Mengembalikan sepasang item
  var fruit = fruitStateVariable[0]; // Item pertama di pasangan
  var setFruit = fruitStateVariable[1]; // Item kedua di pasangan
```

Ketika kita mendeklarasi sebuah variabel *state* dengan `useState`, ini mengembalikan sepasang item - sebuah senarai dengan dua buah item. Item pertama adalah nilai saat ini dan yang kedua adalah fungsi yang memungkinkan kita untuk melakukan pembaruan nilai tersebut. Menggunakan `[0]` dan `[1]` untuk mengaksesnya akan sedikit membingungkan karena mereka memiliki arti yang spesifik. Inilah kenapa kami lebih memilih menggunakan *array destructuring*.

>Catatan
>
>Anda mungkin penasaran bagaimana React tahu komponen mana yang menggunakan `useState` karena kita tidak memberikan sesuatu seperti `this` ke React. Kami akan menjawab [pertanyaan ini](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) dan banyak pertanyaan lainya di bagian FAQ.

### Tip: Menggunakan Banyak Variabel *State*{#tip-using-multiple-state-variables}

Mendeklarasi variabel *state* sebagai sepasang `[something, setSomething]` juga berguna karena memungkinkan kita memberi nama yang *berbeda* untuk membedakan variabel *state* jika kita ingin menggunakan lebih dari satu:

```js
function ExampleWithManyStates() {
  // Deklarasi banyak variabel state!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

Di dalam komponen di atas, kita memiliki `age`, `fruit`, dan `todos` sebagai variabel lokal, dan kita dapat melakukan pembaruan secara individu.

```js
  function handleOrangeClick() {
    // Serupa dengan this.setState({ fruit: 'orange' })
    setFruit('orange');
  }
```

Anda **tidak perlu untuk** menggunakan banyak variabel *state*. Variabel *state* bisa menyimpan objek dan senarai juga, jadi Anda tetap bisa mengelompokkan data yang terkait bersama. Namun tidak seperti `this.setState` di dalam sebuah kelas, melakukan pembaruan sebuah variabel *state* selalu *menggantikan* nilai tersebut alih-alih menggabungkannya.

Kami memberikan lebih banyak rekomendasi tentang pemisahan variabel *state* [di dalam FAQ](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).

## Langkah Selanjutnya {#next-steps}

Di dalam halaman ini kita telah belajar tentang salah satu *Hooks* yang disediakan React, bernama `useState`. Kita juga terkadang akan menyebutnya sebagai *"State Hook"*. Ini memungkinkan kita menambah *state* lokal ke *function components* di React -- yang kita lakukan untuk pertama kalinya!

Kita juga mempelajari sedikit lebih banyak tentang *Hooks*. *Hooks* adalah fungsi yang memungkinkan Anda "terhubung" dengan fitur yang ada di React dari *function components*. Namanya selalu dimulai dengan `use`, dan lebih banyak *Hooks* yang belum kita lihat sebelumnya.

**Sekarang mari lanjutkan dengan [belajar *Hook* selanjutnya: `useEffect`.](/docs/hooks-effect.html)** Ini memungkinkan Anda melakukan efek samping di dalam komponen dan mirip dengan *lifecycle methods* dalam kelas.
