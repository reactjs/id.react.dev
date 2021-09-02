---
id: static-type-checking
title: Pengecekan Static Type
permalink: docs/static-type-checking.html
---

Pengecekan *static type* seperti [Flow](https://flow.org/) dan [TypeScript](https://www.typescriptlang.org/) mengidentifikasi jenis masalah tertentu bahkan sebelum kode dijalankan. Pengecekan tersebut juga bisa meningkatkan alur kerja pengembang dengan menambahkan fitur seperti pelengkapan kode secara otomatis. Dengan alasan ini, kami sarankan untuk menggunakan Flow atau TypeScript alih-alih menggunakan `PropTypes` untuk kode program berukuran besar.

## Flow {#flow}

[Flow](https://flow.org/) merupakan pengecek *static type* untuk kode JavaScript. Pengecek ini dikembangkan di Facebook dan sering digunakan bersama React. Pengecek ini memungkinkan Anda untuk menganotasi variabel, fungsi, dan komponen React menggunakan sintaksis khusus dan menemukan kesalahan secara dini. Anda bisa membaca [pengenalan Flow](https://flow.org/en/docs/getting-started/) untuk mempelajari dasar-dasarnya.

Untuk menggunakannya, Anda harus:

* Menambahkan Flow ke proyek Anda sebagai *dependency*.
* Memastikan sintaksis Flow dihapus dari kode hasil dikompilasi.
* Menambahkan *type annotation* dan menjalankan Flow untuk mengeceknya.

Kami akan menjelaskan langkah-langkah tersebut secara mendetail.

### Menambahkan Flow ke Proyek {#adding-flow-to-a-project}

Pertama-tama, buka direktori proyek Anda di terminal. Anda akan harus menjalankan perintah berikut:

Jika menggunakan [Yarn](https://yarnpkg.com/), jalankan:

```bash
yarn add --dev flow-bin
```

Jika menggunakan [npm](https://www.npmjs.com/), jalankan:

```bash
npm install --save-dev flow-bin
```

Perintah tersebut akan menginstal versi terbaru Flow ke proyek Anda.

Kini, tambahkan `flow` ke bagian `"scripts"` pada `package.json` Anda untuk bisa menjalankannya dari terminal:

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

Terakhir, jalankan salah satu dari perintah berikut:

Jika menggunakan [Yarn](https://yarnpkg.com/), jalankan:

```bash
yarn run flow init
```

Jika menggunakan [npm](https://www.npmjs.com/), jalankan:

```bash
npm run flow init
```

Perintah tersebut akan membuat konfigurasi Flow yang harus Anda sertakan dalam *commit*.

### Menghapus Sintaksis Flow dari Kode Hasil Kompilasi {#stripping-flow-syntax-from-the-compiled-code}

Flow memperluas bahasa JavaScript dengan sintaksis khusus untuk *type annotation*. Akan tetapi *browser* tidak mengenal sintaksis ini, jadi kita harus memastikan sintaksis tersebut dihapus dari bundel JavaScript hasil kompilasi yang akan dikirim ke *browser*.

Cara yang benar untuk melakukannya tergantung pada peralatan yang Anda gunakan untuk mengompilasi JavaScript.

#### Create React App {#create-react-app}

Jika proyek Anda disiapkan menggunakan [Create React App](https://github.com/facebookincubator/create-react-app), maka kami ucapkan selamat! Anotasi Flow akan dihapus secara *default* dan tidak ada yang perlu dilakukan pada langkah ini.

#### Babel {#babel}

>Catatan:
>
>Petunjuk berikut *bukan* ditujukan untuk pengguna Create React App. Walau pengguna Create React App menggunakan Babel di balik layar, Babel tersebut telah dikonfigurasi untuk memahami Flow. Hanya ikuti langkah berikut jika Anda *tidak* menggunakan Create React App.

Jika Babel dikonfigurasi secara manual untuk proyek Anda, Anda harus menginstal *preset* khusus untuk Flow.

Jika menggunakan Yarn, jalankan:

```bash
yarn add --dev @babel/preset-flow
```

Jika menggunakan npm, jalankan:

```bash
npm install --save-dev @babel/preset-flow
```

Kemudian tambahkan *preset* `flow` ke [konfigurasi Babel](https://babeljs.io/docs/usage/babelrc/) Anda. Misalnya, jika Babel dikonfigurasi lewat *file* `.babelrc`, tampilannya mungkin seperti berikut:

```js{3}
{
  "presets": [
    "@babel/preset-flow",
    "react"
  ]
}
```

Ini memungkinkan Anda untuk menggunakan sintaksis Flow pada kode Anda.

>Catatan:
>
>Flow tidak membutuhkan *preset* `react`, tetapi keduanya sering digunakan secara bersama. Flow sendiri memahami sintaksis JSX secara mandiri.

#### *Setup Build* Lainnya {#other-build-setups}

Jika Anda tidak menggunakan *Create React App* atau Babel, Anda bisa menggunakan [flow-remove-types](https://github.com/flowtype/flow-remove-types) untuk menghapus *type annotation*.

### Menjalankan Flow {#running-flow}

Jika Anda mengikuti petunjuk di atas, Anda bisa menjalankan Flow pertama kali.

```bash
yarn flow
```

Jika menggunakan npm, jalankan:

```bash
npm run flow
```

Seharusnya Anda akan melihat pesan seperti:

```
No errors!
✨  Done in 0.17s.
```

### Menambahkan *Type Annotation* Flow {#adding-flow-type-annotations}

Secara default, Flow hanya mengecek *file* yang disertakan anotasi berikut:

```js
// @flow
```

Umumnya anotasi tersebut ditempatkan di bagian atas *file*. Coba tambahkan anotasi tersebut ke beberapa *file* dalam proyek dan jalankan `yarn flow` atau `npm run flow` untuk melihat apakah Flow sudah menemukan masalah.

Tersedia juga [sebuah *opsi*](https://flow.org/en/docs/config/options/#toc-all-boolean) untuk memaksa Flow untuk mengecek *semua* *file* tanpa melihat adanya anotasi. Ini bisa berakibat terlalu "ramai" untuk proyek yang sudah ada, tetapi cukup bagi proyek baru jika Anda ingin menggunakan Flow secara lengkap.

Kini Anda sudah siap! Kami sarankan untuk memeriksa sumber daya berikut untuk mempelajari lebih lanjut tentang Flow:

* [Dokumentasi Flow: *Type Annotation*](https://flow.org/en/docs/types/)
* [Dokumentasi Flow: Editor](https://flow.org/en/docs/editors/)
* [Dokumentasi Flow: React](https://flow.org/en/docs/react/)
* [*Linting* dalam Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/) merupakan bahasa pemrograman yang dikembangkan oleh Microsoft. Bahasa ini merupakan *superset* dari JavaScript dan menyertakan kompilernya sendiri. Oleh karena TypeScript adalah *typed language*, bahasa ini bisa menangkap kesalahan dan *bug* pada saat proses *build*, jauh sebelum aplikasi Anda tampil untuk para pemirsa. Anda bisa mempelajari lebih lanjut tentang penggunaan TypeScript dengan React [di sini](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

Untuk menggunakan TypeScript, Anda harus:
* Menambahkan TypeScript sebagai *dependency* ke proyek Anda
* Mengonfigurasi opsi kompiler TypeScript
* Menggunakan ektensi *file* yang benar
* Menambahkan definisi untuk *library* yang Anda gunakan

Mari kita jelajahi secara mendetail.

### Menggunakan TypeScript dengan *Create React App* {#using-typescript-with-create-react-app}

*Create React App* mendukung TypeScript secara langsung.

Untuk membuat **proyek baru** dengan dukungan TypeScript, jalankan:

```bash
npx create-react-app my-app --template typescript
```

Anda juga bisa menambahkan TypeScript ke **proyek *Create React App* yang sudah ada**, [seperti yang didokumentasikan di sini](https://facebook.github.io/create-react-app/docs/adding-typescript).

>Catatan:
>
>Jika Anda menggunakan *Create React App*, Anda bisa melewati **sisa halaman ini**. Sisa halaman ini menjelaskan penyiapan manual yang tidak berlaku untuk pengguna *Create React App*.


### Menambahkan TypeScript ke Proyek {#adding-typescript-to-a-project}
Semuanya dimulai dengan menjalankan satu perintah di terminal Anda.

Jika menggunakan [Yarn](https://yarnpkg.com/), jalankan:

```bash
yarn add --dev typescript
```

Jika menggunakan  [npm](https://www.npmjs.com/), jalankan:

```bash
npm install --save-dev typescript
```

Selamat! Anda telah menginstal versi terbaru TypeScript ke proyek Anda. Instalasi TypeScript memberikan akses ke perintah `tsc`. Sebelum mengonfigurasi, mari tambahkan `tsc` ke bagian "scripts" pada `package.json`:

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### Mengonfigurasi Kompiler TypeScript {#configuring-the-typescript-compiler}
Kompiler tidak akan membantu kita hingga kita memberi tahu apa yang harus kompiler lakukan. Pada TypeScript, aturan ini didefinisikan pada berkas khusus yang diberi nama `tsconfig.json`. Untuk membuat berkas ini:

Jika menggunakan [Yarn](https://yarnpkg.com/), jalankan:

```bash
yarn run tsc --init
```

Jika menggunakan [npm](https://www.npmjs.com/), jalankan:

```bash
npx tsc --init
```

Pada `tsconfig.json` yang baru dibuat, Anda bisa melihat banyak opsi yang bisa dikonfigurasi untuk kompiler. Untuk deskripsi mendetail tentang semua opsi kunjungi [halaman ini](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Dari sekian banyak opsi, mari kita lihat opsi `rootDir` dan `outDir`. Awalnya, kompiler akan mengambil berkas TypeScript dan menciptakan berkas JavaScript. Akan tetapi kita tidak ingin mencampur aduk berkas sumber dengan berkas keluaran yang diciptakan.

Kita akan mengatasi masalah ini dalam dua langkah:
* Pertama-tama, mari kita susun struktur proyek kita seperti berikut. Kita akan tempatkan semua kode sumber dalam direktori `src`.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* Berikutnya, kita akan memberi tahu kompiler letak kode sumber kita dan tempat keluaran akan disimpan.

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

Kini, jika kita menjalankan *build script*, maka kompiler akan menghasilkan kode JavaScript di *folder* `build`. [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) menyediakan `tsconfig.json` dengan sekumpulan aturan yang cukup bagi Anda untuk memulai.

Secara umum Anda tidak ingin menyimpan kode JavaScript yang dihasilkan dalam sistem *source control* Anda, jadi pastikan untuk menambahkan *folder* *build* ke *file* `.gitignore`.

### Ekstensi *file* {#file-extensions}
Dalam React, kemungkinan besar Anda menulis komponen pada *file* `.js`. Dalam TypeScript kita memiliki 2 ekstensi *file*:

* `.ts` sebagai ekstensi *default*, dan
* `.tsx` yang merupakan ekstensi khusus yang digunakan untuk file yang mengandung `JSX`.

### Menjalankan TypeScript {#running-typescript}

Jika Anda mengikuti petunjuk di atas, seharusnya Anda bisa menjalankan TypeScript untuk pertama kali.

```bash
yarn build
```

Jika menggunakan npm, jalankan:

```bash
npm run build
```

Jika tidak melihat keluaran, berarti prosesnya selesai dengan sukses.


### *Type Definition* {#type-definitions}
Untuk bisa melihat kesalahan dan petunjuk dari *package* lainnya, kompiler mengandalkan *file* deklarasi. *File* deklarasi menyediakan seluruh informasi *type* tentang sebuah *library*. Ini memungkinkan kita untuk menggunakan *library* JavaScript, misalnya dari npm, dalam proyek kita.

Ada dua cara utama untuk mendapatkan deklarasi sebuah *library*:

__Dibundel__ - *Library* membundel *file* deklarasinya sendiri. Ini baik sekali bagi kita, karena yang perlu kita lakukan adalah menginstal *library* tersebut, dan kita bisa langsung menggunakannya. Untuk memeriksa apakah *library* memiliki *type* yang dibundel, cari *file* bernama `index.d.ts` dalam proyeknya. Beberapa *library* menentukannya dalam *file* `package.json` mereka, di bawah *field* `typings` atau `types`.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped adalah repositori raksasa berisi deklarasi *library* yang tidak membundel *file* deklarasi. Deklarasi di dalamnya diurun daya berbagai pihak dan dikelola oleh Microsoft beserta kontributor sumber terbuka. React misalnya, tidak membundel *file* deklarasinya sendiri, namun kita bisa mendapatkannya dari DefinitelyTyped. Untuk melakukannya, masukkan perintah berikut dalam terminal.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Deklarasi Lokal__
Terkadang *package* yang ingin digunakan tidak memiliki deklarasi terbundel atau tidak tersedia di DefinitelyTyped. Pada kasus ini, kita bisa membuat berkas deklarasi lokal. Untuk melakukannya, buat berkas `declarations.d.ts` pada akar direktori sumber Anda. Deklarasi sederhana tampak sebagai berikut:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

Kini Anda siap menciptakan kode program! Kami sarankan untuk mengunjungi sumber daya berikut untuk mempelajari lebih lanjut tentang TypeScript:

<<<<<<< HEAD
* [Dokumentasi TypeScript: *Type* Dasar](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [Dokumentasi TypeScript: Migrasi dari Javascript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [Dokumentasi TypeScript: React dan Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
=======
* [TypeScript Documentation: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
* [TypeScript Documentation: Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Documentation: React and Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
>>>>>>> a11c2534062bd79cc1e6e34db0e149f928df35bb

## ReScript {#rescript}

<<<<<<< HEAD
[Reason](https://reasonml.github.io/) bukan sebuah bahasa baru, Reason merupakan sintaksis dan *toolchain* baru yang didukung bahasa [OCaml](https://ocaml.org/) yang telah teruji. Reason memberikan sintaksis OCaml yang familier, yang ditujukan untuk pemrogram JavaScript, serta melayani alur kerja NPM/Yarn yang sudah ada dan telah diketahui.

Reason dikembangkan di Facebook, dan digunakan dalam beberapa produknya seperti Messenger. Reason masih bersifat eksperimental tetapi telah memiliki [*binding* React khusus](https://reasonml.github.io/reason-react/) yang diasuh oleh Facebook serta [komunitas yang dinamis](https://reasonml.github.io/docs/en/community.html).
=======
[ReScript](https://rescript-lang.org/) is a typed language that compiles to JavaScript. Some of its core features are  guaranteed 100% type coverage, first-class JSX support and [dedicated React bindings](https://rescript-lang.org/docs/react/latest/introduction) to allow integration in existing JS / TS React codebases.

You can find more infos on integrating ReScript in your existing JS / React codebase [here](https://rescript-lang.org/docs/manual/latest/installation#integrate-into-an-existing-js-project).
>>>>>>> a11c2534062bd79cc1e6e34db0e149f928df35bb

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) merupakan *typed language* yang statis dan dikembangkan oleh JetBrains. Platform targetnya mencakup JVM, Android, LLVM, dan [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html). 

JetBrains mengembangkan dan mengasuh beberapa peralatan khusus untuk komunitas React: [*binding* React](https://github.com/JetBrains/kotlin-wrappers) serta [*Create React Kotlin App*](https://github.com/JetBrains/create-react-kotlin-app). Yang terakhir bisa membantu Anda membangun aplikasi React bersama Kotlin tanpa adanya konfigurasi *build*.

## Bahasa Lainnya {#other-languages}

Perhatikan bahwa ada beberapa *typed language* yang statis yang mengompilasi menjadi JavaScript serta kompatibel dengan React. Misalnya, [F#/Fable](https://fable.io/) dengan [elmish-react](https://elmish.github.io/react). Kunjungi masing-masing situs untuk informasi lebih lanjut. Silakan tambahkan *typed language* statis yang berfungsi bersama React ke halaman ini.
