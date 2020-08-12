---
id: faq-state
title: State Komponen
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### Apa yang `setState` lakukan? {#what-does-setstate-do}

`setState()` merencanakan suatu pembaruan ke suatu `state` objek komponen. Ketika *state* berubah, komponen merespons dengan me-*render* ulang.

### Apa perbedaan antara `state` dan `props`? {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html) (kependekan dari "properti") dan [`state`](/docs/state-and-lifecycle.html) adalah objek JavaScript biasa. Meskipun keduanya menyimpan informasi yang mempengaruhi keluaran dari *render*, keduanya berbeda satu sama lain: `props` diteruskan *ke* komponen (mirip dengan *function parameters*) sedangkan `state` dikelola *dalam* komponen (mirip dengan variabel yang dideklarasikan dalam suatu *function*).

Berikut adalah beberapa sumber yang bagus untuk dibaca lebih lanjut tentang kapan menggunakan `props` vs. `state`:
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### Kenapa `setState` memberikan saya `value` yang salah? {#why-is-setstate-giving-me-the-wrong-value}

Di React, baik `this.props` dan `this.state` mewakili nilai yang telah di-*render*, yaitu apa yang saat ini ada di layar.

Pemanggilan `setState` bersifat *asynchronous* - jangan mengandalkan `this.state` untuk mencerminkan nilai baru segera setelah memanggil `setState`. Mengoper pembaruan *function* sebagai ganti *object* jika anda perlu menghitung nilai berdasarkan *state* saat ini (lihat di bawah untuk lebih lanjut).

Contoh kode yang *tidak* akan berperilaku seperti yang diharapkan:

```jsx
incrementCount() {
  // Catatan: ini mungkin *tidak* akan bekerja sebagaimana mestinya.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // Anggap saja `this.state.count` dimulai dari 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // Ketika React me-render ulang komponennya, `this.state.count` akan menjadi 1, tapi anda mengharapkannya menjadi 3.

  // Ini karena fungsi `incrementCount()` di atas membacanya dari `this.state.count`,
  // tapi React tidak memperbarui `this.state.count` sampai komponennya me-render ulang.
  // Jadi `incrementCount()` akhirnya membaca `this.state.count` sebagai 0 setiap waktu, dan mengubahnya ke 1.

  // Perbaikan dari masalah ini dijelaskan di bawah!
}
```

Lihat di bawah untuk mengetahui cara memperbaiki masalah ini.

### Bagaimana cara saya memperbarui `state` dengan `value` yang bergantung pada `state` saat ini?{#how-do-i-update-state-with-values-that-depend-on-the-current-state}

Oper sebuah *function* bukan *object* ke dalam `setState` untuk memastikan pemanggilannya selalu menggunakan versi terbaru dari *state* (lihat di bawah).

### Apa perbedaan antara mengoper sebuah `object` atau `function` dalam `setState`? {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

Mengoper pembaruan *function* memungkinkan anda untuk mengakses nilai *state* saat ini dalam pembaruan. Karena pemanggilan `setState` dikelompokkan, ini memungkinkan anda merangkai pembaruan dan memastikannya terjadi secara bertumpukan bukan bertentangan:

```jsx
incrementCount() {
  this.setState((state) => {
    // Penting: membaca `state` bukan `this.state` ketika memperbarui.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // Anggap saja `this.state.count` dimulai dari 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // Jika anda membaca `this.state.count` sekarang, itu pasti tetap 0.
  // Tapi ketika React me-render ulang komponennya, hasilnya akan menjadi 3.
}
```

[Pelajari lebih lanjut tentang `setState`](/docs/react-component.html#setstate)

### Kapan `setState` *asynchronous*? {#when-is-setstate-asynchronous}

Saat ini, `setState` *asynchronous* di dalam *event handler*.

Ini memastikan, sebagai contoh, jika kedua `Parent` dan `Child` memanggil `setState` selagi *click event*, `Child` tidak perlu me-*render* ulang dua kali. Bahkan sebaliknya, React "membilas" pembaruan *state* pada akhir *browser event*. Ini menghasilkan peningkatan kinerja yang signifikan pada aplikasi-aplikasi yang lebih besar.

Ini adalah implementasi secara rinci untuk menghindari mengandalkannya secara langsung. Di versi yang mendatang, React akan melakukan sejumlah pembaruan secara *default* dalam kasus-kasus yang lebih banyak.

### Kenapa React tidak memperbarui `this.state` secara *synchronous*? {#why-doesnt-react-update-thisstate-synchronously}

Seperti yang sudah dijelaskan di bagian sebelumnya, React dengan sengaja "menunggu" sampai semua komponen memanggil `setState()` di *event handlers* sebelum me-*render* ulang. Ini meningkatkan kinerja dengan menghindari *render* ulang yang tidak perlu.

Namun, anda mungkin masih bertanya-tanya kenapa React tidak langsung memperbarui `this.state` tanpa proses *render* ulang.

Ada dua alasan utama:

* Ini akan merusak konsistensi antara `props` dan `state`, menyebabkan masalah yang sangat sulit untuk di-*debug*.
* Ini akan membuat beberapa fitur baru yang sedang kami kerjakan menjadi mustahil untuk diimplementasikan.


[Komentar GitHub](https://github.com/facebook/react/issues/11527#issuecomment-360199710) ini mendalami lebih jauh ke contoh-contoh yang lebih spesifik.

### Haruskah saya menggunakan `state` *management library* seperti Redux atau MobX? {#should-i-use-a-state-management-library-like-redux-or-mobx}

[Mungkin.](https://redux.js.org/faq/general#when-should-i-use-redux)

Ide yang bagus untuk mengenal React terlebih dahulu, sebelum menambahkan *library* tambahan. Anda dapat membuat aplikasi yang sangat kompleks hanya dengan menggunakan React.
