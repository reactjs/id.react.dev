---
id: hooks-overview
title: Sekilas tentang Hooks
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

*Hooks* merupakan penambahan baru pada React 16.8. *Hooks* memungkinkan Anda menggunakan *state* dan fitur React lainnya tanpa membuat sebuah kelas.

*Hooks* merupakan fitur yang [*backwards-compatible*](/docs/hooks-intro.html#no-breaking-changes). Laman ini menyediakan ikhtisar mengenai *Hooks* untuk pengguna React yang berpengalaman. Laman ini merupakan ikhtisar yang singkat. Jika Anda kurang paham, carilah kotak kuning seperti di bawah ini:

>Penjelasan Detail
>
>Baca laman [Motivasi](/docs/hooks-intro.html#motivation) untuk mengetahui kenapa kami mengenalkan *Hooks* pada React.

**↑↑↑ Setiap bagian diakhiri dengan kotak kuning seperti ini.** Kotak tersebut menghubungkan ke penjelasan yang lebih terperinci.

## 📌 Hook State {#state-hook}

Contoh berikut me-*render* sebuah penghitung. Jika tombol di klik, nilai akan bertambah:

```js{1,4,5}
import React, { useState } from 'react';

function Example() {
  // Deklarasi sebuah variabel state baru, dimana akan dinamakan "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Anda klik sebanyak {count} kali</p>
      <button onClick={() => setCount(count + 1)}>
        Klik saya
      </button>
    </div>
  );
}
```

Disini, `useState` merupakan *Hook* (akan dibahas apa artinya sebentar lagi). `useState` di panggil dalam *function component* untuk menambahkan suatu *state* lokal. React akan menyimpan *state* antar *render*. `useState` memberikan dua hal: nilai *state* saat ini dan fungsi untuk memperbarui nilai tersebut. Anda dapat memanggil fungsi ini dari sebuah *event handler* atau dimanapun. Hal ini serupa dengan `this.setState` pada kelas, tetapi tidak menggabungkan `state` lama dan baru menjadi satu. (Akan kami berikan contoh perbandingan `useState` dengan `this.state` pada [Menggunakan Hook State](/docs/hooks-state.html).)

Satu-satunya argumen pada `useState` yaitu nilai awal *state*. Pada contoh diatas, nilainya `0` karena penghitung mulai dari nol. Perlu diketahui bahwa tidak seperti `this.state`, *state* disini tidak harus berupa objek -- meskipun bisa jadi apapun yang diinginkan. Argumen nilai awal *state* hanya digunakan pada saat *render* pertama.

#### Mendeklarasikan beberapa variabel state {#declaring-multiple-state-variables}

Anda dapat menggunakan *Hook* untuk *state* lebih dari sekali pada satu komponen:

```js
function ContohDenganBanyakState() {
  // Deklarasi banyak variabel state!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('pisang');
  const [todos, setTodos] = useState([{ text: 'Belajar Hooks' }]);
  // ...
}
```

Sintaksis [*array destructuring*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) memungkinkan untuk memberi nama yang berbeda pada variabel *state* yang dideklarasikan dengan memanggil `useState`. Nama-nama tersebut bukan bagian dari API `useState`. React mengasumsikan jika Anda memanggil `useState` berkali-kali, Anda melakukannya dalam urutan yang sama saat setiap *render*. Kami akan kembali membahas kenapa ini berfungsi dan kapan ini berguna kedepannya.

#### Tetapi Apa itu Hook? {#but-what-is-a-hook}

*Hooks* merupakan fungsi yang memungkinkan Anda untuk "mengaitkan" *state* dan fitur-fitur *lifecycle* React dari *function component*. *Hooks* tidak dapat berfungsi didalam kelas -- *Hooks* memungkinkan menggunakan React tanpa kelas. (Kami [tidak merekomendasikan](/docs/hooks-intro.html#gradual-adoption-strategy) membuat ulang komponen yang sudah ada tetapi Anda dapat menggunakan *Hooks* untuk komponen yang baru jika diinginkan.)

React menyediakan beberapa *Hooks* bawaan seperti `useState`. Anda dapat membuat *Hooks* sendiri untuk menggunakan ulang *stateful behavior* antara komponen yang berbeda. Kami akan membahas *Hooks* bawaan terlebih dahulu.

>Penjelasan Detail
>
>Anda dapat mempelajari lebih lanjut mengenai *Hook* State pada laman khusus: [Menggunakan Hook State](/docs/hooks-state.html).

## ⚡️ Hook Effect {#effect-hook}

Anda tentunya pernah melakukan pengambilan data, berlangganan data (*subscription*), atau secara manual mengubah DOM dari komponen React sebelumnya. Kami menyebut operasi-operasi seperti ini "efek samping (*side effects*)" (atau singkatnya "efek (*effects*)")  karena dapat mempengaruhi komponen lain dan tidak dapat dilakukan pada saat proses *render*.

*Effect Hook*, `useEffect`, menambahkan kemampuan untuk melakukan "efek samping" dari sebuah *function component*. *Hook* ini memiliki fungsi yang sama dengan `componentDidMount`, `componentDidUpdate`, dan `componentWillUnmount` pada kelas React, tetapi disatukan menjadi satu API. (Kami akan memberi beberapa contoh perbandingan `useEffect` dengan metode ini pada [Menggunakan Hook Effect](/docs/hooks-effect.html).)

Sebagai contoh, komponen berikut menetapkan judul dokumen setelah React memperbarui DOM:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Sama seperti componentDidMount dan componentDidUpdate:
  useEffect(() => {
    // Memperbarui judul dokumen menggunakan API browser
    document.title = `Anda klik sebanyak ${count} kali`;
  });

  return (
    <div>
      <p>Anda klik sebanyak {count} kali</p>
      <button onClick={() => setCount(count + 1)}>
        Klik saya
      </button>
    </div>
  );
}
```

Pada saat memanggil `useEffect`, Anda memerintah React untuk menjalankan fungsi "efek" setelah membersihkan perubahan pada DOM. Efek dideklarasikan di dalam komponen sehingga mereka akan mendapat akses pada *prop* dan *state* komponen tersebut. Secara bawaan, React menjalankan efek setelah setiap *render* -- termasuk pada *render* pertama. (Akan kami bahas lebih banyak mengenai bagaimana hal ini jika di bandingkan dengan *lifecycle* pada kelas React di [Menggunakan Hook Effect](/docs/hooks-effect.html).)

Efek juga secara opsional menentukan bagaimana cara "membersihkan" setelahnya dengan memberikan sebuah fungsi. Sebagai contoh, komponen berikut menggunakan sebuah efek untuk berlangganan atau memperoleh status *online* teman, dan "membersihkan" dengan berhenti berlangganan (*unsubscribe*) darinya:

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Pada contoh diatas, React akan berhenti berlangganan dari `ChatAPI` pada saat komponen dilepas, serta saat sebelum menjalankan kembali efeknya karena *render* berikutnya. (Jika diinginkan, ada cara untuk [memberitahu React untuk melewati proses berlangganan ulang](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) jika `props.friend.id` yang diteruskan kepada `ChatAPI` tidak berubah.)

Sama seperti `useState`, Anda dapat menggunakan lebih dari satu efek didalam komponen:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Anda klik sebanyak ${count} kali`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

*Hooks* memungkinkan untuk menata atau mengatur efek samping pada suatu komponen dengan bagian-bagian mana yang terkait (seperti menambah dan menghapus suatu *subscription*), daripada memaksa pemisahan pada *lifecycle method*.

>Penjelasan Detail
>
>Anda dapat belajar lebih lanjut mengenai `useEffect` pada laman khusus: [Menggunakan Hook Effect](/docs/hooks-effect.html).

## ✌️ Peraturan Hooks {#rules-of-hooks}

*Hooks* merupakan fungsi JavaScript, tetapi memberlakukan dua aturan tambahan:

* Hanya panggil *Hooks* pada **tingkat teratas**. Jangan panggil *Hooks* di dalam perulangan, kondisi, atau fungsi bertingkat.
* Hanya panggil *Hooks* dari **komponen fungsi React**. Jangan memanggil *Hooks* dari fungsi JavaScript biasa. (Hanya ada satu tempat yang diperbolehkan untuk memanggil *Hooks* -- *Hooks* buatan Anda sendiri. Kita akan belajar tentang hal tersebut sebentar lagi.)

Kami menyediakan [*linter plugin*](https://www.npmjs.com/package/eslint-plugin-react-hooks) untuk memaksa aturan-aturan ini secara otomatis. Kami memahami aturan-aturan ini mungkin tampak membatasi atau membingungkan pada awalnya, tetapi mereka sangat penting untuk membuat *Hooks* berfungsi dengan baik.

>Penjelasan Detail
>
>Anda dapat belajar lebih lanjut mengenai aturan-aturan tersebut pada laman khusus: [Peraturan Hooks](/docs/hooks-rules.html).

## 💡 Membangun Hooks Anda Sendiri {#building-your-own-hooks}

Terkadang, kita ingin menggunakan kembali logika *stateful* antar komponen. Secara tradisional, ada dua solusi populer untuk masalah ini: [*higher-order component*](/docs/higher-order-components.html) dan [*render props*](/docs/render-props.html). *Hooks* kustom memungkinkan Anda melakukan ini, tanpa menambahkan komponen lain pada *tree* komponen Anda.

Sebelumnya pada laman ini, kami mengenalkan komponen `FriendStatus` yang memanggil *Hooks* `useState` dan `useEffect` untuk berlangganan status *online* teman. Katakanlah kita juga ingin menggunakan kembali logika berlangganan ini pada komponen lain.

Pertama, kita akan mengekstrak logika ini ke dalam *Hook* kustom yang disebut `useFriendStatus`:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

`friendID` dibutuhkan sebagai argumen, dan memberikan apakah teman tersebut sedang online.

Sekarang kita bisa menggunakannya dari kedua komponen:

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

<<<<<<< HEAD
*State* dari komponen-komponen tersebut sepenuhnya independen. *Hooks* merupakan salah satu cara untuk menggunakan ulang *stateful logic*, bukan *state* itu sendiri. Faktanya, setiap panggilan kepada sebuah *Hook* memiliki *state* yang sepenuhnya terisolasi -- sehingga Anda dapat menggunakan *Hook* kustom yang sama dua kali dalam satu komponen.
=======
The state of each component is completely independent. Hooks are a way to reuse *stateful logic*, not state itself. In fact, each *call* to a Hook has a completely isolated state -- so you can even use the same custom Hook twice in one component.
>>>>>>> 25cc703d1f23f1782ff96c5c7882a806f8741ec4

*Hook* kustom merupakan sebuah konvensi daripada sebuah fitur. Jika suatu nama fungsi dimulai dengan "`use`" dan memanggil *Hooks* lainnya, kami menganggapnya sebagai *Hook* kustom. Konvensi penamaan `useSomething` merupakan cara dari *linter plugin* kami dapat menemukan kesalahan (*bug*) dalam kode yang menggunakan *Hooks*.

Anda dapat menulis *Hooks* kustom yang mencakup berbagai studi kasus seperti penanganan *form*, animasi, perolehan data deklaratif, *timer*, dan mungkin banyak lagi yang belum kami pertimbangkan. Kami senang melihat *Hooks* kustom apa saja yang akan dibuat oleh komunitas React.

>Penjelasan Detail
>
>Anda dapat belajar lebih lanjut mengenai *Hooks* kustom pada laman khusus: [Membangun Hooks Anda Sendiri](/docs/hooks-custom.html).

## 🔌 Hooks Lainnya {#other-hooks}

Ada beberapa *Hooks* bawaan yang kurang umum yang mungkin berguna bagi Anda. Contohnya, [`useContext`](/docs/hooks-reference.html#usecontext) memungkinkan untuk berlangganan atau memperoleh *context* React tanpa perlu menulis sintaksis bersarang:

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

Dan [`useReducer`](/docs/hooks-reference.html#usereducer) memungkinkan Anda mengelola *state* lokal komponen yang kompleks menggunakan sebuah *reducer*:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>Penjelasan Detail
>
>Anda dapat belajar lebih lanjut mengenai semua *Hooks* bawaan pada laman khusus: [Referensi API Hooks](/docs/hooks-reference.html).

## Langkah Selanjutnya {#next-steps}

Wah, cepat sekali! Jika ada beberapa bagian yang kurang Anda pahami atau Anda ingin belajar lebih detail, Anda dapat membaca laman berikutnya, dimulai dari dokumentasi [State Hook](/docs/hooks-state.html).

Anda juga dapat baca [referensi API Hooks](/docs/hooks-reference.html) dan [FAQ Hooks](/docs/hooks-faq.html).

Terakhir, jangan melewatkan [laman pengantar](/docs/hooks-intro.html) yang menjelaskan *mengapa* kami menambahkan *Hooks* dan bagaimana kita akan mulai menggunakannya berdampingan dengan kelas -- tanpa perlu menulis ulang aplikasi.
