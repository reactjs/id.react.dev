---
id: create-a-new-react-app
title: Membuat Sebuah Aplikasi React Baru
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Gunakan *toolchains* yang terintegrasi untuk pengalaman pengguna dan pengembangan terbaik.

Halaman ini menjelaskan beberapa *toolchains* yang bisa membantu menyelesaikan tugas seperti:

* Penskalaan ke banyak *file* dan komponen.
* Penggunaan *library* pihak ketiga dari npm.
* Mendeteksi kesalahan umum lebih awal.
* Pengeditan CSS dan JS secara langsung dalam tahap pengembangan.
* Mengoptimalkan keluaran untuk tahap produksi.

*Toolchains* yang direkomendasikan pada halaman ini **tidak membutuhkan konfigurasi untuk memulai**.

## Anda Mungkin Tidak Butuh Toolchains{#you-might-not-need-a-toolchain}

Jika Anda tidak mengalami masalah yang dijelaskan di atas atau belum nyaman menggunakan *tools* dari JavaScript, pertimbangkan untuk [menambahkan React sebagai *tag* `<script>` biasa pada halaman HTML](/docs/add-react-to-a-website.html). Anda dapat melakukan itu [dengan JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

Cara tersebut juga merupakan **cara termudah mengintegrasikan React ke dalam situs yang sudah ada.** Anda bisa menambah *Toolchains* yang lebih besar kapanpun Anda inginkan jika Anda merasa itu dapat membantu!

## Toolchains Yang Direkomendasikan {#recommended-toolchains}

Tim React sangat merekomendasikan solusi ini:

- Jika Anda **sedang belajar React** atau **membuat aplikasi [*single-page*](/docs/glossary.html#single-page-application) baru,** cobalah [Create React App](#create-react-app).
- Jika Anda sedang membangun sebuah **situs yang di-*render* menggunakan *server* Node.js,** cobalah [Next.js](#nextjs).
- Jika Anda sedang membangun sebuah **situs statis yang berorientasi pada konten,** cobalah [Gatsby](#gatsby).
- Jika Anda sedang membangun sebuah ***library* komponen** atau **menggabungkannya dengan basis kode yang sudah ada,** cobalah [*toolchains* yang lebih fleksibel](#more-flexible-toolchains).

### Create React App {#create-react-app}

<<<<<<< HEAD
Create React App mengatur lingkungan pengembangan Anda sehingga, Anda dapat menggunakan fitur terbaru JavaScript, memberikan pengalaman pengembangan yang menyenangkan, dan mengoptimalkan aplikasi Anda untuk lingkungan produksi. Anda membutuhkan [Node >= 8.10 dan npm >= 5.6](https://nodejs.org/en/) di komputer Anda. Untuk membuat suatu proyek baru, jalankan:
=======
[Create React App](https://github.com/facebookincubator/create-react-app) is a comfortable environment for **learning React**, and is the best way to start building **a new [single-page](/docs/glossary.html#single-page-application) application** in React.

It sets up your development environment so that you can use the latest JavaScript features, provides a nice developer experience, and optimizes your app for production. You’ll need to have [Node >= 10.16 and npm >= 5.6](https://nodejs.org/en/) on your machine. To create a project, run:
>>>>>>> 68e4efcf93b6e589355f6aa3cbc3f3c811c0ad37

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Catatan
>
>`npx` pada baris pertama bukanlah salah ketik --itu adalah [*package runner tool* yang tersedia bersamaan dengan npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App tidak mengatur bagian *backend* ataupun basis data; tapi hanya membuat sebuah *frontend build pipeline*. Sehingga, Anda dapat menggunakan aplikasi Anda dengan *backend* yang Anda inginkan. Create React App menggunakan [Babel](http://babeljs.io/) dan [Webpack](https://webpack.js.org/), tapi Anda tidak perlu tahu tentang semua itu.

Ketika Anda siap melanjutkan ke tahap produksi, menjalankan `npm run build` akan membuat *build* yang teroptimasi dari aplikasi Anda dalam *folder* `build`. Anda dapat belajar lebih dalam mengenai Create React App dari [README](https://github.com/facebookincubator/create-react-app#create-react-app--) dan [Petunjuk Pengguna](https://facebook.github.io/create-react-app/) Create React App.

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) adalah *framework* populer dan ringan untuk aplikasi statis dan aplikasi yang di-*render* di *server*. Next.js dibangun menggunakan React. Framework ini sudah mengatasi masalah ***styling*** dan ***routing***, dan mengasumsikan bahwa Anda menggunakan [Node.js](https://nodejs.org/) sebagai lingkungan *server* Anda.

Pelajari Next.js dari [dokumentasi resminya](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) adalah cara terbaik untuk membuat situs statis dengan menggunakan React. Gatsby membuat Anda dapat menggunakan komponen React, namun memberikan keluaran berupa HTML yang telah di-*render* dan CSS untuk menjamin kecepatan waktu pemuatan.

Pelajari Gatsby dari [dokumentasi resminya](https://www.gatsbyjs.org/docs/) dan [galeri *starter kit*](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Toolchains Yang Lebih Fleksibel {#more-flexible-toolchains}

*Toolchains* berikut menawarkan fleksibilitas dan berbagai pilihan. Kami merekomendasikan ini untuk pengguna yang lebih berpengalaman:

- **[Neutrino](https://neutrinojs.org/)** mengombinasikan keunggulan [Webpack](https://webpack.js.org/) dengan kemudahan pengaturan awal, termasuk pengaturan awal [Aplikasi React](https://neutrinojs.org/packages/react/) dan [komponen React](https://neutrinojs.org/packages/react-components/).

- **[nwb](https://github.com/insin/nwb)** sangat baik dalam [memublikasikan komponen React untuk npm](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb). *Toolchains* ini juga [dapat digunakan](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb) untuk membuat aplikasi React.

- **[Nx](https://nx.dev/react)** adalah sebuah *toolkit* untung pengembangan *full-stack* di dalam monorepo, dengan dukungan untuk React, Next.js, [Express](https://expressjs.com/), dan lebih banyak lagi.

- **[Parcel](https://parceljs.org/)** adalah *bundler* aplikasi *web* yang cepat, tanpa konfigurasi, dan dapat [bekerja dengan React](https://parceljs.org/recipes.html#react).

## Membuat Toolchains dari Awal{#creating-a-toolchain-from-scratch}

Sebuah *Toolchains* yang dibuat menggunakan JavaScript biasanya terdiri dari:

* Sebuah ***package manager***, seperti [Yarn](https://yarnpkg.com/) atau [npm](https://www.npmjs.com/). *Package manager* memberikan keuntungan berupa ekosistem yang luas dari paket-paket pihak ketiga, dan Anda dapat memasang atau memperbarui paket tersebut dengan mudah.

* Sebuah ***bundler***, seperti [Webpack](https://webpack.js.org/) atau [Parcel](https://parceljs.org/). *Bundler* membantu Anda menuliskan kode modular dan menyatukannya menjadi paket-paket kecil untuk mengoptimalkan waktu pemuatan.


* Sebuah ***compiler*** seperti [Babel](http://babeljs.io/). *Compiler* membantu Anda menulis kode JavaScript yang lebih modern agar dapat bekerja pada *browser* yang lebih lama.

Jika Anda lebih suka membuat *Toolchains* JavaScript Anda sendiri dari awal, [silahkan cek petunjuk ini](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) yang membuat ulang beberapa fungsi dari Create React App.

Jangan lupa memastikan *toolchains* buatan Anda [sudah diatur untuk tahap produksi dengan benar](/docs/optimizing-performance.html#use-the-production-build).
