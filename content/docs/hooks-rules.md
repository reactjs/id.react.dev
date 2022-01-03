---
id: hooks-rules
title: Rules of Hooks
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

*Hooks* adalah sebuah fitur tambahan baru di React 16.8. Mereka membantu Anda untuk menggunakan *state* and fitur-fitur React lainnya tanpa menulis sebuah kelas.

Hooks adalah fungsi JavaScript, tetapi Anda perlu mengikuti dua aturan pada saat menggunakannya. Kami menyediakan sebuah [*linter plugin*](https://www.npmjs.com/package/eslint-plugin-react-hooks) untuk memberlakukan aturan-aturan ini secara otomatis:

### Hanya Panggil *Hooks* di Tingkat Atas {#only-call-hooks-at-the-top-level}

<<<<<<< HEAD
**Jangan memanggil *Hooks* dari dalam *loops*, *conditions*, atau *nested functions*.** Melainkan, selalu gunakan *Hooks* di tingkat atas dari fungsi React Anda. Dengan mengikuti aturan ini, Anda dapat dengan yakin dapat memastikan bahwa *Hooks* akan dipanggil dengan urutan yang sama setiap kali sebuah komponen me-*render*. Hal itu yang menyebabkan React dapat menyimpan *state* dari *Hooks* dengan benar di antara banyak panggilan `useState` dan `useEffect`. (Jika Anda ingin tahu lebih lanjut, kami akan menjelaskan ini lebih dalam [di bawah](#explanation).)
=======
**Don't call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function, before any early returns. By following this rule, you ensure that Hooks are called in the same order each time a component renders. That's what allows React to correctly preserve the state of Hooks between multiple `useState` and `useEffect` calls. (If you're curious, we'll explain this in depth [below](#explanation).)
>>>>>>> b41b1dc35679c01c3252e7d512ce28c5e100d0a4

### Hanya Panggil *Hooks* dari Fungsi-Fungsi React {#only-call-hooks-from-react-functions}

**Jangan memanggil *Hooks* dari fungsi-fungsi JavaScript biasa.** Sebagai gantinya, Anda dapat:

* ✅ Memanggil *Hooks* dari komponen-komponen fungsi React.
* ✅ Memanggil *Hooks* dari *custom Hooks* (kita akan belajar tentang ini [di laman berikutnya](/docs/hooks-custom.html)).

Dengan mengikuti aturan ini, Anda dapat dengan yakin memastikan bahwa semua logika *stateful* di dalam sebuah komponen terlihat jelas dari *source code*-nya.

## *Plugin* ESLint {#eslint-plugin}

Kami membuat sebuah *ESLint plugin* dengan nama [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) yang membantu menekankan dua aturan-aturan ini. Anda dapat menambahkan *plugin* ini ke proyek Anda jika Anda ingin mencobanya:

This plugin is included by default in [Create React App](/docs/create-a-new-react-app.html#create-react-app).

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```js
// Konfigurasi ESLint Anda
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  }
}
```

**Anda dapat melompat ke laman selanjutnya yang menjelaskan bagaimana membuat [*Hooks* Anda sendiri](/docs/hooks-custom.html) sekarang.** Di laman ini, kita akan melanjutkan dengan menjelaskan pemikiran dibalik aturan-aturan ini.

## Penjelasan {#explanation}

Seperti yang telah [dipelajari sebelumnya](/docs/hooks-state.html#tip-using-multiple-state-variables), kita dapat menggunakan banyak *State* atau *Effect Hooks* di dalam sebuah komponen:

```js
function Form() {
  // 1. Menggunakan state variabel name
  const [name, setName] = useState('Mary');

  // 2. Menggunakan sebuah effect untuk mengukuhkan form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Menggunakan state variabel surname
  const [surname, setSurname] = useState('Poppins');

  // 4. Menggunakan sebuah effect untuk meng-update title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

Bagaimana React mengetahui *state* mana yang sesuai dengan panggilan `useState` yang mana? Jawabannya adalah **React bergantung pada urutan bagaimana *Hooks* dipanggil**. Contoh kami berjalan dengan baik karena urutan dari panggilan-panggilan *Hook* sama setiap kali *render*:

```js
// ------------
// Render pertama
// ------------
useState('Mary')           // 1. Inisialisasi state variabel name dengan 'Mary'
useEffect(persistForm)     // 2. Tambahkan sebuah effect untuk mengukuhkan form
useState('Poppins')        // 3. Inisialisasi state variabel surname dengan 'Poppins'
useEffect(updateTitle)     // 4. Tambahkan sebuah effect untuk meng-update title

// -------------
// Render kedua
// -------------
useState('Mary')           // 1. Baca state variabel name (argument diabaikan)
useEffect(persistForm)     // 2. Ganti effect untuk mengukuhkan form
useState('Poppins')        // 3. Baca state variabel surname (argument diabaikan)
useEffect(updateTitle)     // 4. Ganti effect untuk meng-update title

// ...
```

Selama urutan panggilan-panggilan *Hook* sama dalam setiap *render*, React dapat mengasosiasikan beberapa *state* lokal dengannya. Tetapi apa yang akan terjadi jika menaruh sebuah panggilan *Hook* (contoh, *effect* `persistForm`) di dalam sebuah *condition*?

```js
  // 🔴 Kita melanggar aturan pertama dengan menggunakan Hook di dalam sebuah condition
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

*Condition* `name !== ''` adalah `true` pada *render* pertama, jadi kita menjalankan *Hook* ini. Akan tetapi, pada *render* selanjutnya pengguna mungkin mengosongkan *form*, mengakibatkan *condition* menjadi `false`. Sekarang kita melangkahi *Hook* ini pada saat *rendering*, urutan panggilan-panggilan *Hook* menjadi tidak sama:

```js
useState('Mary')           // 1. Baca state variabel name (argument diabaikan)
// useEffect(persistForm)  // 🔴 Hook ini dilangkahi!
useState('Poppins')        // 🔴 2 (sebelumnya 3). Gagal membaca state variabel surname
useEffect(updateTitle)     // 🔴 3 (sebelumnya 4). Gagal mengganti effect
```

React tidak akan mengetahui apa yang harus dikembalikan pada saat panggilan *Hook* `useState` kedua. React mengharapkan bahwa panggilan *Hook* kedua di komponen ini sesuai dengan *effect* `persistForm`, seperti *render* sebelumnya, tetapi tidak lagi. Sejak saat itu, setiap panggilan *Hook* selanjutnya setelah yang kita langkahi juga akan bergeser satu, mengakibatkan *bugs*.

**Ini sebabnya Hooks harus dipanggil dari level atas komponen-komponen kita.** Jika kita ingin menjalankan sebuah *effect* secara *conditional*, kita dapat menaruh *condition* tersebut *di dalam* *Hook* kita:

```js
  useEffect(function persistForm() {
    // 👍 Kita tidak lagi melanggar aturan pertama
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**Catatan Anda tidak perlu khawatir tentang masalah ini lagi jika Anda menggunakan [*lint rule* yang diberikan](https://www.npmjs.com/package/eslint-plugin-react-hooks).** Tetapi sekarang Anda juga mengetahui *mengapa* *Hooks* bekerja dengan cara ini, dan masalah apa yang dihindari dengan mengikuti aturan-aturan ini.

## Langkah-Langkah Selanjutnya {#next-steps}

Akhirnya, kita siap untuk belajar mengenai [membuat *Hook* Anda sendiri](/docs/hooks-custom.html)! *Custom Hooks* memperbolehkan Anda untuk menggabungkan *Hooks* dari React ke dalam abstraksi milik Anda, dan menggunakan kembali logika *stateful* umum dalam komponen-komponen yang berbeda.
