---
title: Aturan React
---

<Intro>
Sama seperti bahasa pemrograman lain yang memiliki cara tersendiri untuk mengekspresikan konsep, React memiliki idiom atau aturannya sendiri untuk menulis pola dengan cara yang mudah dipahami dan menghasilkan aplikasi berkualitas tinggi.
</Intro>

<InlineToc />

---

<Note>
Untuk mempelajari lebih lanjut tentang mengekspresikan antarmuka dengan React, kami sarankan untuk membaca [Cara Berpikir dengan React](/learn/thinking-in-react).
</Note>

Bagian ini menjelaskan aturan yang perlu Anda ikuti untuk menulis kode React yang idiomatis. Menulis kode React yang idiomatis dapat membantu Anda menulis aplikasi yang terorganisisasi dengan baik, aman, dan dapat disusun. Hal ini membuat aplikasi Anda lebih tahan terhadap perubahan dan memudahkan bekerja dengan pengembang, pustaka (_library_), dan alat lain.

Aturan-aturan ini dikenal sebagai **Aturan React**. Ini adalah aturan, bukan sekadar pedoman, yang dalam artian jika aturan tersebut dilanggar, kemungkinan besar aplikasi Anda memiliki _bug_. Kode Anda juga menjadi tidak idiomatis dan lebih sulit untuk dipahami dan dipikirkan.

Kami sangat merekomendasikan penggunaan [Strict Mode](/reference/react/StrictMode) bersama dengan [_plugin_ ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) untuk React, untuk membantu basis kode Anda mematuhi Aturan React. Dengan mengikuti Aturan React, Anda akan dapat menemukan dan mengatasi bug ini dan menjaga aplikasi Anda tetap dapat dipelihara.

---

## Komponen dan _Hooks_ harus murni {/*components-and-hooks-must-be-pure*/}

[Kemurnian dalam Komponen dan _Hooks_](/reference/rules/components-and-hooks-must-be-pure) adalah aturan utama React yang membuat aplikasi Anda dapat diprediksi, mudah di-_debug_, dan memungkinkan React mengoptimalkan kode Anda secara otomatis. 

* [Komponen harus _idempotent_](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – Komponen React diasumsikan selalu mengembalikan output yang sama terkait dengan inputnya – _props_, _state_, dan _context_.
* [Efek samping harus dijalankan di luar _render_](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – Efek samping tidak boleh dijalankan dalam _render_, karena React dapat me-_render_ komponen beberapa kali untuk menciptakan pengalaman pengguna sebaik mungkin.
* [_Props_ dan _state_ adalah sesuatu yang _immutable_](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – _Props_ dan _state_ suatu komponen adalah _snapshot_ yang _immutable_ untuk sekali _render_. Jangan pernah mengubahnya secara langsung.
* [Nilai kembalian dan argumen ke _Hooks_ adalah sesuatu yang _immutable_](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – Setelah nilai dioper ke sebuah _Hook_, Anda tidak boleh mengubahnya. Seperti _props_ dalam JSX, nilai menjadi _immutable_ saat dioper ke _Hook_.
* [Nilai menjadi _immutable_ setelah dioper ke JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – Jangan ubah nilai setelah digunakan di JSX. Pindahkan perubahan (_mutation_) sebelum JSX dibuat.

---

## React memanggil Komponen dan _Hooks_ {/*react-calls-components-and-hooks*/}

[React bertanggung jawab untuk me-_render_ komponen-komponen dan _hooks_ bila diperlukan untuk mengoptimalkan pengalaman pengguna.](/reference/rules/react-calls-components-and-hooks) React bersifat deklaratif: Anda memberi tahu React apa yang akan di-_render_ dalam logika komponen Anda, dan React akan menentukan cara terbaik untuk menampilkannya kepada pengguna Anda.

* [Jangan pernah memanggil fungsi komponen secara langsung](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – Komponen hanya boleh digunakan di JSX. Jangan panggil mereka sebagai fungsi biasa.
* [Jangan pernah mengoper _hooks_ sebagai nilai biasa](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – _Hooks_ hanya boleh dipanggil di dalam komponen. Jangan pernah mengopernya sebagai nilai biasa.

---

## Aturan _Hooks_ {/*rules-of-hooks*/}

Meskipun _Hooks_ ditulis menggunakan fungsi JavaScript, mereka memiliki fungsi khusus sebagai logika antarmuka yang dapat digunakan kembali. Namun, ada batasan terkait saat Anda bisa menggunakan Hook. Anda perlu mematuhi [Aturan _Hooks_](/reference/rules/rules-of-hooks) saat menggunakannya.

* [Panggil _Hooks_ hanya di tingkat teratas](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – Jangan panggil _Hooks_ di dalam perulangan (_loop_), kondisi (_if/else_), atau fungsi bersarang. Sebagai gantinya, selalu gunakan _Hooks_ di level paling atas fungsi React Anda, sebelum kembalian awal (jika ada).
* [Panggil _Hooks_ hanya dari fungsi React](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – Jangan panggil _Hooks_ dari fungsi JavaScript biasa.

