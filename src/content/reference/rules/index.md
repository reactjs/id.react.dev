---
title: Peraturan React
---

<Intro>
Sama seperti bahasa pemrograman lain yang memiliki cara tersendiri untuk mengekspresikan konsep, React memiliki idiom atau aturannya sendiri untuk menulis pola dengan cara yang mudah dipahami dan menghasilkan aplikasi berkualitas tinggi.
</Intro>

<InlineToc />

---

<Note>
Untuk mempelajari lebih lanjut tentang mengekspresikan antarmuka dengan React, kami sarankan untuk membaca [Cara Berpikir dengan React](/learn/thinking-in-react).
</Note>

Bagian ini menjelaskan peraturan yang perlu Anda ikuti untuk menulis kode React yang idiomatis. Menulis kode React yang idiomatis dapat membantu Anda menulis aplikasi yang terorganisisasi dengan baik, aman, dan dapat disusun. Hal ini membuat aplikasi Anda lebih tahan terhadap perubahan dan memudahkan bekerja dengan pengembang, pustaka (*library*), dan alat lain.

Peraturan ini dikenal sebagai **Peraturan React**. Ini adalah aturan, bukan sekadar pedoman, yang dalam artian jika peraturan tersebut dilanggar, kemungkinan besar aplikasi Anda memiliki *bug*. Kode Anda juga menjadi tidak idiomatis dan lebih sulit untuk dipahami dan dipikirkan.

Kami sangat merekomendasikan penggunaan [Strict Mode](/reference/react/StrictMode) bersama dengan [*plugin* ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) untuk React, untuk membantu basis kode (*codebase*) Anda mematuhi Peraturan React. Dengan mengikuti Peraturan React, Anda akan dapat menemukan dan mengatasi bug ini dan menjaga aplikasi Anda tetap dapat dipelihara.

---

## Komponen dan *Hooks* harus murni {/*components-and-hooks-must-be-pure*/}

[Kemurnian dalam Komponen dan *Hooks*](/reference/rules/components-and-hooks-must-be-pure) adalah peraturan utama React yang membuat aplikasi Anda dapat diprediksi, mudah di-*debug*, dan memungkinkan React mengoptimalkan kode Anda secara otomatis. 

* [Komponen harus *idempotent*](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – Komponen React diasumsikan selalu mengembalikan output yang sama terkait dengan inputnya – *props*, *state*, dan *context*.
* [Efek samping harus dijalankan di luar *render*](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – Efek samping tidak boleh dijalankan dalam *render*, karena React dapat me-*render* komponen beberapa kali untuk menciptakan pengalaman pengguna sebaik mungkin.
* [*Props* dan *state* adalah sesuatu yang *immutable*](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – *Props* dan *state* suatu komponen adalah *snapshot* yang *immutable* untuk sekali *render*. Jangan pernah mengubahnya secara langsung.
* [Nilai kembalian dan argumen ke *Hooks* adalah sesuatu yang *immutable*](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – Setelah nilai dioper ke sebuah *Hook*, Anda tidak boleh mengubahnya. Seperti *props* dalam JSX, nilai menjadi *immutable* saat dioper ke *Hook*.
* [Nilai menjadi *immutable* setelah dioper ke JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – Jangan ubah nilai setelah digunakan di JSX. Pindahkan perubahan (*mutation*) sebelum JSX dibuat.

---

## React memanggil Komponen dan *Hooks* {/*react-calls-components-and-hooks*/}

[React bertanggung jawab untuk me-*render* komponen-komponen dan *hooks* bila diperlukan untuk mengoptimalkan pengalaman pengguna.](/reference/rules/react-calls-components-and-hooks) React bersifat deklaratif: Anda memberi tahu React apa yang akan di-*render* dalam logika komponen Anda, dan React akan menentukan cara terbaik untuk menampilkannya kepada pengguna Anda.

* [Jangan pernah memanggil fungsi komponen secara langsung](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – Komponen hanya boleh digunakan di JSX. Jangan panggil mereka sebagai fungsi biasa.
* [Jangan pernah mengoper *hooks* sebagai nilai biasa](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – *Hooks* hanya boleh dipanggil di dalam komponen. Jangan pernah mengopernya sebagai nilai biasa.

---

## Peraturan *Hooks* {/*rules-of-hooks*/}

Meskipun *Hooks* ditulis menggunakan fungsi JavaScript, mereka memiliki fungsi khusus sebagai logika antarmuka yang dapat digunakan kembali. Namun, ada batasan terkait saat Anda bisa menggunakan *Hook*. Anda perlu mematuhi [Peraturan *Hooks*](/reference/rules/rules-of-hooks) saat menggunakannya.

* [Panggil *Hooks* hanya di tingkat atas](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – Jangan panggil *Hooks* di dalam perulangan (*loop*), kondisi (*if/else*), atau fungsi bersarang. Sebagai gantinya, selalu gunakan *Hooks* di level paling atas fungsi React Anda, sebelum kembalian awal (jika ada).
* [Panggil *Hooks* hanya dari fungsi React](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – Jangan panggil *Hooks* dari fungsi JavaScript biasa.

