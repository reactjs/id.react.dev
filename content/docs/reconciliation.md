---
id: reconciliation
title: Rekonsiliasi
permalink: docs/reconciliation.html
---

React menyediakan API deklaratif jadi Anda tidak perlu khawatir tentang apa yang pasti berubah pada setiap pembaruan. Ini membuat penulisan aplikasi menjadi jauh lebih mudah, tetapi ini mungkin kurang jelas bagaimana ini diimplementasikan di dalam React. Artikel ini menjelaskan pilihan yang bisa kita buat dalam algoritma "pembeda" nya React jadi pembaruan komponen dapat diprediksi selagi aplikasi berkinerja cukup cepat.

## Motivasi {#motivation}

Ketika Anda menggunakan React, pada satu titik waktu Anda dapat berpikir fungsi `render()` sebagai pembuat pohon elemen React. Pada pembaruan *state* atau *prop* selanjutnya, fungsi `render()` tersebut akan mengembalikan pohon elemen React yang berbeda. React kemudian perlu mencari tahu bagaimana cara untuk memperbarui antarmuka pengguna secara efisien agar sesuai dengan pohon terbaru.

Ada beberapa solusi umum untuk permasalahan algoritma ini menghasilkan jumlah operasi minimum untuk mengubah satu pohon ke yang lain. Namun, The [State of the Art Algorithms](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) memiliki kompleksitas dalam urutan O(n<sup>3</sup>) dimana n adalah jumlah elemen di pohon.

Jika kita menggunakannya di React, menampilkan 1000 elemen akan membutuhkan satu miliar perbandingan. Ini terlalu mahal. Sebagai gantinya, React mengimplementasikan algoritma heuristik O(n) berdasarkan dua asumsi:

1. Dua elemen yang berbeda jenis akan menghasilkan pohon-pohon yang berbeda.
2. Pengembang dapat mengisyaratkan elemen *child* mana yang mungkin stabil di berbagai *render* yang berbeda dengan *prop* `key`.

Dalam prakteknya, asumsi ini sah untuk hampir semua contoh kasus praktis.

## Algoritma Pembeda {#the-diffing-algorithm}

Saat membedakan dua pohon, React pertama membandingkan dua elemen *root*. Tindakan berbeda tergantung pada jenis dari elemen-elemen *root*.

### Elemen Dari Berbagai Jenis {#elements-of-different-types}

Kapanpun elemen-elemen *root* memiliki jenis yang berbeda, React akan meruntuhkan pohon lama dan membangun pohon baru dari awal. Mulai dari `<a>` ke `<img>`, atau dari `<Article>` ke `<Comment>`, atau dari `<Button>` ke `<div>` - Semua itu akan mengarah pada pembangunan kembali sepenuhnya.

<<<<<<< HEAD
Saat meruntuhkan sebuah pohon, node DOM lama dihancurkan. *Instance* komponen menerima `componentWillUnmount()`. Saat membangun pohon baru, node DOM baru dimasukan ke dalam DOM. *Instance* komponen menerima `componentWillMount()` lalu `componentDidMount()`. *State* manapun yang terkait dengan pohon lama akan hilang.
=======
When tearing down a tree, old DOM nodes are destroyed. Component instances receive `componentWillUnmount()`. When building up a new tree, new DOM nodes are inserted into the DOM. Component instances receive `UNSAFE_componentWillMount()` and then `componentDidMount()`. Any state associated with the old tree is lost.
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

Komponen manapun di bawah *root* juga akan dilepas dan *state* nya dihancurkan. Sebagai contoh, saat membedakan:

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```
Ini akan menghancurkan `Counter` lama dan memasang kembali yang baru.

### Elemen DOM Dari Jenis Yang Sama {#dom-elements-of-the-same-type}

<<<<<<< HEAD
Saat membandingkan dua elemen DOM React dari jenis yang sama, React melihat atribut keduanya, menjaga node DOM dengan dasar yang sama, dan hanya memperbarui atribut yang berubah. Sebagai contoh:
=======
>Note:
>
>These methods are considered legacy and you should [avoid them](/blog/2018/03/27/update-on-async-rendering.html) in new code:
>
>- `UNSAFE_componentWillMount()`

### DOM Elements Of The Same Type {#dom-elements-of-the-same-type}

When comparing two React DOM elements of the same type, React looks at the attributes of both, keeps the same underlying DOM node, and only updates the changed attributes. For example:
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

Dengan membandingkan dua elemen ini, React tahu untuk hanya memodifikasi `className` pada node DOM yang mendasarinya.

Saat memperbarui `style`, React juga tahu untuk hanya memperbarui properti yang berubah. Sebagai contoh:

```xml
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

Saat mengkonversi diantara dua elemen ini, React tahu untuk hanya memodifikasi *style* `color`, bukan `fontWeight`.

Setelah menangani node DOM, React lalu berulang pada *children*.

### Elemen Komponen Dari Jenis Yang Sama {#component-elements-of-the-same-type}

<<<<<<< HEAD
Saat komponen diperbarui, *instance*-nya tetap sama, jadi *state* tersebut terjaga di berbagai *render*. React memperbarui *prop* yang mendasari *instance* komponen untuk mencocokan elemen baru, dan memanggil `componentWillReceiveProps()` dan `componentWillUpdate()` di *instance* yang mendasari.
=======
When a component updates, the instance stays the same, so that state is maintained across renders. React updates the props of the underlying component instance to match the new element, and calls `UNSAFE_componentWillReceiveProps()`, `UNSAFE_componentWillUpdate()` and `componentDidUpdate()` on the underlying instance.
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

Selanjutnya, metode `render()` dipanggil dan algoritma pembeda berulang pada hasil sebelumnya dan hasil yang baru.

<<<<<<< HEAD
### Berulang Di Children {#recursing-on-children}
=======
>Note:
>
>These methods are considered legacy and you should [avoid them](/blog/2018/03/27/update-on-async-rendering.html) in new code:
>
>- `UNSAFE_componentWillUpdate()`
>- `UNSAFE_componentWillReceiveProps()`

### Recursing On Children {#recursing-on-children}
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

Secara standar, saat berulang pada *children* node DOM, React hanya melakukan iterasi di atas kedua daftar *children* di waktu bersamaan dan menghasilkan mutasi setiap kali ada perbedaan.

Sebagai contoh, saat menambahkan sebuah elemen pada akhir *children*, mengkonversi diantara kedua pohon ini bekerja dengan baik:

```xml
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React akan mencocokan kedua pohon `<li>first</li>`, mencocokan kedua pohon `<li>second</li>`, dan lalu memasukan pohon `<li>third</li>`.

Jika Anda mengimplementasikan dengan naifnya, memasukan sebuah elemen di awal memiliki kinerja lebih buruk. Sebagai contoh, mengkonversi diantara kedua pohon ini bekerja dengan buruk:

```xml
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React akan mengubah setiap *child* daripada menyadari itu dapat menjaga keutuhan sub-pohon `<li>Duke</li>` dan `<li>Villanova</li>`. Ketidakefisienan ini bisa menjadi masalah.

### Key {#keys}

Untuk mengatasi masalah ini, React mendukung atribut `key`. Saat *children* memiliki *key*, React menggunakan *key* untuk mencocokan *children* di dalam pohon yang asli dengan *children* di dalam pohon selanjutnya. Sebagai contoh, menambahkan `key` pada contoh tidak efisien kita diatas dapat membuat konversi pohon efisien:

```xml
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

Sekarang React tahu bahwa elemen dengan *key* `'2014'` adalah yang baru, dan elemen dengan *key* `'2015'` dan `'2016'` telah dipindahkan.

Dalam prakteknya, menemukan sebuah *key* biasanya tidak sulit. Elemen yang akan Anda tampilkan mungkin sudah memiliki ID yang unik, jadi *key*-nya bisa saja berasal dari data Anda: 

```js
<li key={item.id}>{item.name}</li>
```

Saat itu bukan kasusnya, Anda dapat menambahkan properti ID baru pada model Anda atau *hash* beberapa bagian dari konten untuk menghasilkan sebuah *key*. *Key* hanya harus unik antar *sibling*, bukan unik secara global.

Sebagai pilihan terakhir, Anda dapat mengoper sebuah indeks *item* dalam senarai (*array*) sebagai *key*. Ini dapat bekerja dengan baik jika *item-item* tidak pernah diurutkan kembali, tetapi pengurutan kembali akan menjadi lambat.

Pengurutan kembali juga dapat menyebabkan masalah dengan *state* komponen saat indeks digunakan sebagai *key*. *Instance* komponen diperbarui dan digunakan kembali berdasarkan *key*-nya. Jika *key* adalah indeks, memindahkan sebuah *item* akan mengubahnya. Sebagai hasil, *state* komponen untuk hal seperti *uncontrolled input* dapat tercampur dan diperbarui dengan cara yang tidak terduga.

[Disini adalah contoh masalah yang dapat disebabkan oleh penggunaan indeks sebagai *key*](codepen://reconciliation/index-used-as-key) pada CodePen, dan [disini adalah versi terbaru dari contoh yang sama menunjukan bagaimana agar tidak menggunakan indeks sebagai *key* akan memperbaiki pengurutan kembali, penyortiran, dan masalah yang saling terkait ini](codepen://reconciliation/no-index-used-as-key).

## Pengorbanan {#tradeoffs}

Penting untuk diingat bahwa algoritma rekonsiliasi adalah sebuah detail implementasi. React dapat *render* kembali seluruh aplikasi pada setiap aksi; hasil akhirnya akan sama. Untuk lebih jelasnya, *render* kembali di konteks ini berarti memanggil `render` untuk semua komponen, ini bukan berarti React akan melepaskan dan memasangnya kembali. Itu hanya akan menerapkan perbedaan mengikuti aturan yang disebutkan di bagian sebelumnya.

Kita secara teratur memperbaiki heuristik untuk membuat contoh kasus umum menjadi lebih cepat. Dalam implementasi saat ini, Anda dapat mengekspresikan fakta bahwa sebuah sub-pohon telah dipindahkan diantara *sibling*, tetapi Anda tidak dapat mengatakan bahwa itu telah dipindahkan ke tempat lain. Algoritma akan *render* ulang sub-pohon itu sepenuhnya.

Karena React bergantung pada heuristik, jika asumsi dibelakang mereka tidak terpenuhi, kinerja akan menderita.

1. Algoritma tidak akan mencoba untuk mencocokan sub-pohon dari jenis komponen yang berbeda. Jika Anda melihat diri Anda sendiri bergantian antara dua jenis komponen dengan keluaran yang sangat mirip, Anda mungkin ingin untuk membuatnya menjadi jenis yang sama. Dalam prakteknya, Kita belum menemukan ini sebagai masalah.

2. *Key* harus stabil, dapat diprediksi, dan unik. *Key* yang tidak stabil (seperti yang diproduksi oleh `Math.random()`) akan menyebabkan banyak *instance* komponen dan node DOM tidak perlu diciptakan kembali, yang dapat menyebabkan penurunan kinerja dan *state* hilang dalam komponen *child*.
