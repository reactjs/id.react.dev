---
id: hooks-intro
title: Introducing Hooks
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hooks* merupakan fitur baru di React 16.8. Dengan *Hooks*, kita dapat menggunakan *state* dan fitur React yang lain tanpa perlu menulis sebuah kelas baru.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Mendeklarasikan variabel state baru, yaitu "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Anda mengklik {count} kali</p>
      <button onClick={() => setCount(count + 1)}>
        Klik aku
      </button>
    </div>
  );
}
```

`useState` adalah fungsi baru yang akan kita pelajari pertama, perlu diingat bahwa contoh di atas hanyalah contoh. Jangan khawatir jika masih terlihat tidak masuk akal!

**Anda dapat mulai mempelajari Hooks [di laman selanjutnya](/docs/hooks-overview.html).** Pada laman ini, kami akan menjelaskan mengapa kami menambahkan *Hooks* ke React dan bagaimana mereka dapat membantu Anda untuk menulis aplikasi yang hebat.

>Catatan
>
<<<<<<< HEAD
>React 16.8.0 adalah versi rilis pertama yang mendukung *Hooks*. Ketika melakukan *upgrade*, jangan lupa untuk memperbarui semua *package*, termasuk React DOM.
>React Native mendukung *Hooks* sejak [versi rilis 0.59 dari React Native](https://facebook.github.io/react-native/blog/2019/03/12/releasing-react-native-059).
=======
>React 16.8.0 is the first release to support Hooks. When upgrading, don't forget to update all packages, including React DOM.
>React Native supports Hooks since [the 0.59 release of React Native](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059).
>>>>>>> dea4f329ea3a7bba116e07adf67eb5c8b6c528cd

## Video Pengenalan {#video-introduction}

Pada React Conf 2018, Sophie Alpert dan Dan Abramov mengenalkan *Hooks*, diikuti oleh Ryan Florence yang mendemonstrasikan cara me-*refactor* sebuah aplikasi untuk menggunakannya. Tonton videonya di sini:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Tidak Ada Breaking Changes {#no-breaking-changes}

Sebelum kita melanjutkan, perlu diingat bahwa *Hooks*:

* **Benar-benar opsional.** Anda dapat mencoba *Hooks* di beberapa komponen tanpa perlu menulis ulang kode. Tapi Anda tidak harus belajar atau menggunakan *Hooks* jika belum ingin.
* **100% *backwards-compatible*.** *Hooks* tidak akan menyebabkan *breaking changes*.
* **Tersedia sekarang.** *Hooks* sudah tersedia di versi 16.8.0.

**Belum ada rencana untuk menghapus kelas dari React.** Anda dapat membaca tentang strategi untuk mengadopsi *Hooks* secara bertahap di [bagian bawah](#gradual-adoption-strategy) laman ini.

**Hooks tidak menghilangkan konsep React yang Anda ketahui.** Malahan, *Hooks* memberikan API yang lebih langsung ke konsep-konsep React yang Anda ketahui: *props*, *state*, *context*, *refs*, dan *lifecycle*. Kami akan menunjukkan pada Anda nanti, bahwa *Hooks* juga menawarkan sebuah cara yang manjur untuk menggabungkan hal-hal tersebut.

**Jika Anda ingin langsung mempelajari Hooks, jangan ragu untuk [langsung ke laman selanjutnya!](/docs/hooks-overview.html)** Anda juga tetap dapat di laman ini untuk mempelajari mengapa kami menambahkan *Hooks*, dan bagaimana cara menggunakannya tanpa perlu menulis ulang aplikasi.

## Motivasi {#motivation}

*Hooks* memecahkan berbagai masalah yang terlihat tidak berhubungan yang telah kami temui selama lima tahun menulis dan memelihara ribuan komponen di React. Tidak peduli apakah Anda mempelajari React, berinteraksi sehari-hari, atau bahkan menggunakan *library* yang menggunakan model komponen yang mirip, Anda mungkin juga menemukan beberapa masalah yang kami temui seperti di bawah.

### Kesulitan untuk menggunakan kembali *stateful logic* antar komponen {#its-hard-to-reuse-stateful-logic-between-components}

React tidak memberikan cara untuk "melampirkan" perilaku yang dapat digunakan kembali ke sebuah komponen (misal, menghubungkan komponen ke sebuah *store*). Jika Anda sudah pernah menggunakan React, Anda mungkin sudah akrab dengan cara seperti [render props](/docs/render-props.html) dan [higher-order components](/docs/higher-order-components.html) untuk mengatasi masalah ini. Namun cara-cara tersebut mengharuskan Anda untuk merekstrukturisasi komponen, yang mana akan menimbulkan kerumitan dan kesulitan untuk mengikuti kode. Jika Anda melihat aplikasi React pada umumnya di React DevTools, Anda mungkin menemukan "wrapper hell" dari komponen-komponen yang dibungkus oleh lapisan-lapisan *provider*, *consumer*, *higher-order component*, *render props*, dan abstraksi lainnya. Meski kita dapat [menyaring mereka di DevTools](https://github.com/facebook/react-devtools/pull/503), ternyata hal ini menunjukkan bahwa adanya masalah yang lebih mendasar: React memerlukan cara yang lebih praktis untuk membagikan *stateful logic*.

Dengan *Hooks*, Anda dapat mengekstrak *stateful logic* dari sebuah komponen sehingga dapat dilakukan *testing* secara independen dan digunakan kembali. **Hooks memperbolehkan Anda untuk menggunakan kembali *stateful logic* tanpa mengubah hirarki komponen.** Hal ini mempermudah untuk membagikan *Hooks* ke komponen-komponen atau ke komunitas.

Kita akan membahas lebih lanjut mengenai hal ini di bagian [Membuat *Hooks* Anda sendiri](/docs/hooks-custom.html).

### Komponen kompleks menjadi sulit untuk dimengerti {#complex-components-become-hard-to-understand}

Kita sering menemui kesulitan untuk memelihara komponen yang awalnya sederhana, tetapi seiring berjalannya waktu berubah menjadi kompleks dengan *stateful logic* yang rumit dan berbagai efek samping. Setiap *lifecycle method* berisi campuran dari logika yang tidak berhubungan sama sekali. Contoh, komponen melakukan pengambilan data di `componentDidMount` dan `componentDidUpdate`. Namun, *method* `componentDidMount` yang sama juga terdapat logika yang tidak berkaitan, seperti memasang *event listener*, dengan permbersihannya yang dilakukan di `componentWillUnmount`. Kode yang berhubungan berjauhan, tetapi kode yang tidak berhubungan malah berada pada satu *method* yang sama. Hal ini rentan untuk menghasilkan *bug* dan ketidakkonsistenan.

Dalam beberapa kasus tidak mungkin untuk memecah komponen menjadi beberapa komponen kecil karena *stateful logic* yang tersebar. Dan juga susah untuk diuji. Ini merupakan salah satu alasan bahwa banyak orang lebih memilih untuk mengkombinasikan React dengan *library* manajemen *state* yang lain. Sayangnya, hal tersebut menimbulkan abstraksi yang terlalu banyak, yang mengharuskan Anda untuk berpindah-pindah *file*, dan menggunakan ulang komponen yang sudah ada menjadi lebih sulit.

Untuk mengatasi hal ini, **Hooks membuat Anda mampu untuk memecah satu komponen besar menjadi beberapa fungsi kecil yang berisi bagian-bagian yang saling berhubungan (seperti pemasangan langganan atau pengambilan data)**, daripada memaksa dengan memecah bagian per bagian di *lifecycle method* yang ada. Anda juga dapat melakukan pengelolaan *local state* komponen dengan *reducer* untuk membuatnya lebih mudah diprediksi.

Kita akan membahas hal ini lebih lanjut di [Menggunakan Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Kelas membingungkan manusia dan mesin {#classes-confuse-both-people-and-machines}

Selain membuat penggunaan kode kembali dan pengorganisasian kode menjadi lebih sulit, kami mendapati bahwa kelas dan menjadi penghalang besar untuk mempelajari React. Anda harus memahami cara kerja `this` di Javascript, yang mana sangat berbeda dengan cara kerjanya di mayoritas bahasa lainnya. Anda perlu ingat untuk melakukan *bind* *event handler* yang ada. Tanpa [syntax proposals](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/) yang tidak stabil, kode akan menjadi sangat bertele-tele. Orang dapat memahami *props*, *state*, dan alur data *top-down* dengan sangat baik namun tetap kesulitan dengan kelas. Perbedaan antara *function* dan komponen kelas di React serta kapan menggunakan salah satunya menghasilkan perbedaan pendapat bahkan antara developer React yang sudah berpengalaman.

Selain itu, React sudah berumur sekitar lima tahun, dan kami ingin memastikannya untuk lima tahun ke depan lagi. Seperti yang diperlihatkan [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) dari komponen memiliki potensi di masa depan. Terutama jika tidak terbatas oleh *template* saja. Akhir-akhir ini, kami sedang bereksperimen dengan [component folding](https://github.com/facebook/react/issues/7323) menggunakan [Prepack](https://prepack.io/), dan kami melihat hasil awal yang menjanjikan. Sayangnya, kami menemukan bahwa kelas komponen dapat menyebabkan pola yang tidak sengaja yang menyebabkan optimasi malah menjadi lebih lambat. Kelas membawa masalah pada alat-alat yang ada saat ini. Contohnya, kelas tidak dapat di-*minify* dengan baik, dan mereka membuat *hot reloading* menjadi rumit dan tidak dapat diandalkan. Kami ingin menunjukkan sebuah API yang akan membuat kode untuk tetap dapat dioptimasi dengan baik.

Untuk mengatasi masalah ini, **Hooks membuat Anda mampu untuk menggunakan fitur React tanpa menggunakan kelas.** Konsepnya, React selalu dekat dengan fungsi. *Hooks* merangkul fungsi, tetapi tidak mengorbankan kepraktisan dari React. Hooks memberikan akses ke bagian-bagian penting dan tidak mengharuskan Anda untuk mempelajari teknik memrogram fungsional atau reaktif yang kompleks.

>Contoh
>
>[Sekilas tentang Hooks](/docs/hooks-overview.html) merupakan tempat yang baik untuk mulai belajar tentang *Hooks*.

## Strategi Adopsi Bertahap {#gradual-adoption-strategy}

>**TLDR: Belum ada rencana untuk menghilangkan kelas dari React.**

Kami tahu bahwa pengembang React berfokus pada produk dan tidak ada waktu untuk melihat API baru yang baru saja dirilis. *Hooks* adalah hal yang sangat baru, dan mungkin lebih baik untuk menunggu contoh dan tutorial yang lain sebelum belajar atau mulai mengadopsinya.

Kami juga mengerti bahwa permintaan untuk menambahkan fungsi dasasr baru ke React sangatlah tinggi. Untuk pembaca yang ingin tahu, kami mempersiapkan [RFC mendetil](https://github.com/reactjs/rfcs/pull/68) yang menjadi motivasi dengan beberapa detil, dan perspektif tambahan pada keputusan mengenai desain, serta pekerjaan terkait sebelumnya.

**Penting, Hooks bekerja berdampingan dengan kode yang sudah ada sehingga dapat diadopsi secara bertahap.** Tidak ada keharusan untuk cepat-cepat atau berpindah ke *Hooks*. Kami tidak merekomendasikan untuk melakukan "penulisan ulang kode yang besar", terutama untuk yang sudah ada, dengan kelas komponen yang kompleks. Ini membutuhkan sedikit perubahan pemikiran untuk mulai "berpikir dalam *Hooks*". Menurut kami, lebih baik untuk belajar menggunakan *Hooks* pada komponen yang baru dan tidak kritis, dan memastikan bahwa setiap orang dalam tim merasa nyaman untuk menggunakannya. Setelah Anda mencoba menggunakan *Hooks*, mohon bantuannya untuk [mengirimkan umpan balik ke kami](https://github.com/facebook/react/issues/new), positif maupun negatif.

Kami ingin *Hooks* untuk mencakup setiap *use case* yang ada pada kelas, tetapi **kami akan tetap mendukung komponen kelas untuk kedepannya.** Di Facebook, kami memiliki puluhan ribu komponen yang ditulis menjadi kelas, dan kami tidak memiliki rencana untuk menulis ulang. Sebagai gantinya, kami mulai untuk menggunakan *Hooks* untuk kode baru yang berjalan berdampingan dengan kelas.

## Frequently Asked Questions {#frequently-asked-questions}

Kami sudah menyiapkan [laman FAQ *Hooks*](/docs/hooks-faq.html) yang akan menjawab pertanyaan-pertanyaan umum mengenai *Hooks*.

## Langkah Selanjutnya {#next-steps}

Akhir dari laman ini, Anda seharusnya sudah memiliki gambaran kasar mengenai masalah yang diatasi oleh *Hooks*, tetapi beberapa detil mungkin masih belum jelas. Jangan khawatir! **Mari menuju [laman selanjutnya](/docs/hooks-overview.html) dimana kita akan belajar mengenai *Hooks* dengan contoh.**
