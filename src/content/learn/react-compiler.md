---
title: Kompilator React
---

<Intro>
Halaman ini akan memberikan pengantar tentang Kompilator React eksperimental baru dan cara menjalankannya dengan sukses.
</Intro>

<Wip>
Dokumentasi ini masih dalam tahap pengembangan. Dokumentasi lebih lanjut tersedia di [repo Kelompok Kerja Kompilator React](https://github.com/reactwg/react-compiler/discussions), dan akan dimasukkan ke dalam dokumen ini ketika lebih stabil.
</Wip>

<YouWillLearn>

* Memulai dengan kompilator
* Menginstal kompilator dan plugin eslint
* Memecahkan masalah

</YouWillLearn>

<Note>
Kompilator React adalah kompilator eksperimental baru yang kami jadikan sumber terbuka untuk mendapatkan umpan balik awal dari komunitas. Masih ada beberapa kekurangan dan belum sepenuhnya siap untuk produksi.

Kompilator React membutuhkan React 19 RC. Jika Anda tidak dapat mengupgrade ke React 19, Anda dapat mencoba implementasi *userspace* dari fungsi *cache* seperti yang dijelaskan di [Kelompok Kerja](https://github.com/reactwg/react-compiler/discussions/6).
</Note>

Kompilator React adalah kompilator eksperimental baru yang kami jadikan sumber terbuka untuk mendapatkan umpan balik awal dari komunitas. Ini adalah alat yang digunakan pada waktu kompilasi yang secara otomatis mengoptimalkan aplikasi React Anda. Alat ini bekerja dengan JavaScript biasa, dan memahami [Aturan React](/reference/rules), sehingga Anda tidak perlu menulis ulang kode apa pun untuk menggunakannya.

Kompilator juga mencakup plugin [eslint](#menginstal-plugin-eslint-kompilator-react) yang menampilkan analisis dari kompilator langsung di editor Anda. Plugin ini berjalan secara independen dari kompilator dan dapat digunakan bahkan jika Anda tidak menggunakan kompilator dalam aplikasi Anda. Kami merekomendasikan semua pengembang React untuk menggunakan plugin eslint ini untuk membantu meningkatkan kualitas kode Anda.

### Apa yang dilakukan oleh kompilator? {/*what-does-the-compiler-do*/}

Untuk mengoptimalkan aplikasi, Kompilator React secara otomatis melakukan memoisasi kode Anda. Anda mungkin sudah familiar dengan memoisasi melalui API seperti `useMemo`, `useCallback`, dan `React.memo`. Dengan API ini, Anda dapat memberi tahu React bahwa bagian-bagian tertentu dari aplikasi Anda tidak perlu dijalankan ulang jika inputnya tidak berubah, mengurangi pekerjaan pada pembaruan. Meskipun sangat berguna, mudah untuk lupa menerapkan memoisasi atau menerapkannya dengan cara yang salah. Hal ini dapat menyebabkan pembaruan yang tidak efisien karena React harus memeriksa bagian-bagian UI Anda yang tidak memiliki perubahan yang _berarti_.

Kompilator menggunakan pengetahuannya tentang JavaScript dan aturan React untuk secara otomatis melakukan memoisasi nilai atau kelompok nilai dalam komponen dan *hook* Anda. Jika ia mendeteksi pelanggaran aturan, ia akan melewati hanya komponen atau *hook* tersebut, dan melanjutkan kompilasi kode lain dengan aman

Jika basis kode Anda sudah sangat ter-memoisasi dengan baik, Anda mungkin tidak mengharapkan peningkatan kinerja yang signifikan dengan kompilator ini. Namun, dalam praktiknya, memoisasi dependensi yang benar yang menyebabkan masalah kinerja adalah hal yang sulit dilakukan dengan tepat secara manual.

<DeepDive>
#### Jenis memoisasi apa yang ditambahkan oleh Kompilator React? {/*what-kind-of-memoization-does-react-compiler-add*/}

Rilis awal Kompilator React terutama berfokus pada **meningkatkan kinerja pembaruan** (merender ulang komponen yang ada), sehingga berfokus pada dua kasus penggunaan:

1. **Melewati render ulang berantai komponen**
    * Merender ulang `<Parent />` menyebabkan banyak komponen dalam pohon komponennya merender ulang, meskipun hanya `<Parent />` yang berubah
1. **Melewati perhitungan mahal dari luar React**
    * Misalnya, memanggil `expensivelyProcessAReallyLargeArrayOfObjects()` di dalam komponen atau *hook* Anda yang membutuhkan data tersebut

#### Mengoptimalkan Render Ulang {/*optimizing-re-renders*/}

React memungkinkan Anda mengekspresikan UI Anda sebagai fungsi dari keadaan saat ini (lebih konkretnya: *prop*, *state*, dan konteks mereka). Dalam implementasinya saat ini, ketika keadaan komponen berubah, React akan merender ulang komponen tersebut _dan semua anak-anaknya_ — kecuali jika Anda telah menerapkan memoisasi manual dengan `useMemo()`, `useCallback()`, atau `React.memo()`. Misalnya, pada contoh berikut, `<MessageButton>` akan merender ulang setiap kali keadaan `<FriendList>` berubah:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_Lihat contoh ini di *React Compiler Playground*_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

Kompilator React secara otomatis menerapkan memoisasi manual yang setara, memastikan bahwa hanya bagian-bagian yang relevan dari aplikasi yang merender ulang saat keadaan berubah, yang kadang-kadang disebut sebagai "reaktivitas bergranular halus". Pada contoh di atas, Kompilator React menentukan bahwa nilai kembalian dari `<FriendListCard />` dapat digunakan kembali bahkan saat `friends` berubah, dan dapat menghindari membuat ulang JSX ini _dan_ menghindari merender ulang `<MessageButton>` saat jumlah berubah.

#### Perhitungan mahal juga mendapatkan memoisasi {/*expensive-calculations-also-get-memoized*/}

Kompilator juga dapat secara otomatis melakukan memoisasi untuk perhitungan mahal yang digunakan selama merender:

```js
// **Tidak** memoisasi oleh Kompilator React, karena ini bukan komponen atau *hook*
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoisasi oleh Kompilator React karena ini adalah komponen
function TableContainer({ items }) {
  // Panggilan fungsi ini akan memoisasi:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_Lihat contoh ini di React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

Namun, jika `expensivelyProcessAReallyLargeArrayOfObjects` adalah fungsi yang benar-benar mahal, Anda mungkin perlu mempertimbangkan untuk mengimplementasikan memoisasi sendiri di luar React, karena:

- Kompilator React hanya melakukan memoisasi pada komponen dan *hook* React, bukan setiap fungsi
- Memoisasi Kompilator React tidak dibagikan di beberapa komponen atau *hook*

Jadi, jika `expensivelyProcessAReallyLargeArrayOfObjects` digunakan dalam banyak komponen yang berbeda, bahkan jika item yang sama persis dilewatkan, perhitungan mahal tersebut akan dijalankan secara berulang. Kami merekomendasikan untuk [melakukan profil](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) terlebih dahulu untuk melihat apakah benar-benar mahal sebelum membuat kode menjadi lebih rumit.
</DeepDive>

### Apa yang diasumsikan oleh kompilator? {/*what-does-the-compiler-assume*/}

React Compiler assumes that your code:

1. Valid, semantik JavaScript
2. Menguji bahwa nilai dan properti yang dapat bernilai null/opsional didefinisikan sebelum mengaksesnya (misalnya, dengan mengaktifkan [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) jika menggunakan TypeScript), yaitu, `if (object.nullableProperty) { object.nullableProperty.foo }` atau dengan optional-chaining `object.nullableProperty?.foo`
3. Mengikuti [Aturan React](https://react.dev/reference/rules)

Kompilator React dapat memverifikasi banyak Aturan React secara statis, dan akan melewati kompilasi dengan aman ketika mendeteksi eror. Untuk melihat eror, kami juga merekomendasikan menginstal [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler).

### Haruskah Saya mencoba kompilator? {/*should-i-try-out-the-compiler*/}

Harap dicatat bahwa kompilator ini masih eksperimental dan memiliki beberapa kekurangan. Meskipun telah digunakan di produksi oleh perusahaan seperti Meta, mengimplementasikan kompilator ke produksi untuk aplikasi Anda akan bergantung pada keadaan kode Anda dan sejauh mana Anda mengikuti [Aturan React](/reference/rules).

**Anda tidak perlu terburu-buru menggunakan kompilator sekarang. Tidak apa-apa untuk menunggu sampai mencapai rilis stabil sebelum mengadopsinya.** Namun, kami menghargai jika Anda mencobanya dalam eksperimen kecil di aplikasi Anda sehingga Anda dapat [memberikan umpan balik](#reporting-issues) kepada kami untuk membantu membuat kompilator menjadi lebih baik.

## Memulai {/*getting-started*/}

Selain dokumen ini, kami sarankan untuk memeriksa [Kelompok Kerja Kompilator React](https://github.com/reactwg/react-compiler) untuk informasi tambahan dan diskusi tentang kompilator.

### Memeriksa kompatibilitas {/*checking-compatibility*/}

Sebelum menginstal kompilator, Anda dapat memeriksa apakah kode Anda kompatibel:

<TerminalBlock>
npx react-compiler-healthcheck@latest
</TerminalBlock>

Skrip ini akan:

- Memeriksa berapa banyak komponen yang dapat dioptimalkan dengan sukses: semakin tinggi semakin baik
- Memeriksa penggunaan `<StrictMode>`: memiliki ini diaktifkan dan diikuti berarti peluang lebih tinggi bahwa [Aturan React](/reference/rules) diikuti
- Memeriksa penggunaan *library* yang tidak kompatibel: *library* yang diketahui tidak kompatibel dengan kompilator

Sebagai contoh:

<TerminalBlock>
Successfully compiled 8 out of 9 components.
StrictMode usage not found.
Found no usage of incompatible libraries.
</TerminalBlock>

### Menginstal plugin eslint-plugin-react-compiler {/*installing-eslint-plugin-react-compiler*/}

Kompilator React juga menyediakan plugin eslint. Plugin eslint dapat digunakan **secara independen** dari kompilator, yang berarti Anda dapat menggunakan plugin eslint bahkan jika Anda tidak menggunakan kompilator.

<TerminalBlock>
npm install eslint-plugin-react-compiler
</TerminalBlock>

Kemudian, tambahkan plugin tersebut ke konfigurasi eslint Anda:

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': "error",
  },
}
```

Plugin eslint akan menampilkan pelanggaran aturan React di editor Anda. Ketika ini terjadi, artinya kompilator telah melewati optimasi komponen atau hook tersebut. Ini adalah hal yang wajar, dan kompilator dapat melanjutkan dan mengoptimasi kode lain dalam aplikasi Anda.

**Anda tidak perlu memperbaiki semua pelanggaran eslint segera.** Anda dapat menanganinya sesuai keinginan Anda untuk meningkatkan jumlah komponen dan hook yang dioptimalkan, tetapi tidak diperlukan untuk memperbaiki semuanya sebelum Anda dapat menggunakan kompilator.

### Mengimplementasikan kompilator ke kode Anda {/*using-the-compiler-effectively*/}

#### Proyek yang sudah ada {/*existing-projects*/}
Kompilator ini dirancang untuk mengompilasi komponen fungsional dan *hook* yang mengikuti Aturan React. Kompilator ini juga dapat menangani kode yang melanggar aturan tersebut dengan cara mengabaikan (melewati) komponen atau *hook* yang bermasalah. Namun, karena sifat fleksibel JavaScript, kompilator tidak dapat menangkap setiap pelanggaran yang mungkin terjadi dan dapat menghasilkan hasil negatif palsu: yaitu, kompilator mungkin secara tidak sengaja mengompilasi komponen/*hook* yang melanggar Aturan React, yang dapat menyebabkan perilaku yang tidak terdefinisi.

Untuk alasan ini, untuk mengadopsi kompilator dengan sukses pada proyek yang sudah ada, kami sarankan menjalankannya pada direktori kecil di kode produk Anda terlebih dahulu. Anda dapat melakukannya dengan mengonfigurasi kompilator agar hanya berjalan pada set direktori tertentu:

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

Dalam kasus yang jarang terjadi, Anda juga dapat mengonfigurasi kompilator untuk berjalan dalam mode "opt-in" menggunakan opsi `compilationMode: "annotation"`. Ini membuat kompilator hanya mengkompilasi komponen dan hook yang dianotasi dengan direktif `"use memo"`. Harap dicatat bahwa mode `annotation` adalah mode sementara untuk membantu pengguna awal, dan bahwa kami tidak bermaksud agar direktif `"use memo"` digunakan dalam jangka panjang.

```js {2,7}
const ReactCompilerConfig = {
  compilationMode: "annotation",
};

// src/app.jsx
export default function App() {
  "use memo";
  // ...
}
```

Ketika Anda lebih percaya diri dengan mengimplementasikan kompilator, Anda dapat meningkatkan cakupan ke direktori lain dan secara perlahan mengimplementasikannya ke seluruh aplikasi Anda.

#### Proyek baru {/*new-projects*/}

Jika Anda memulai proyek baru, Anda dapat mengaktifkan kompilator pada seluruh kode Anda, yang merupakan perilaku bawaan.

## Penggunaan {/*installation*/}

### Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler
</TerminalBlock>

Kompilator mencakup *plugin* Babel yang dapat Anda gunakan dalam jalur pembangunan Anda untuk menjalankan kompilator.

Setelah instalasi, tambahkan ke konfigurasi Babel Anda. Harap dicatat bahwa sangat kritis bahwa compiler dijalankan **pertama** dalam pipeline:

```js {7}
// babel.config.js
const ReactCompilerConfig = { /* ... */ };

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // harus jalan terlebih dahulu!
      // ...
    ],
  };
};
```

`babel-plugin-react-compiler` harus dijalankan pertama sebelum plugin Babel lainnya karena compiler memerlukan informasi sumber masukan untuk analisis yang akurat.

### Vite {/*usage-with-vite*/}

Jika Anda menggunakan Vite, Anda dapat menambahkan plugin ke vite-plugin-react:

```js {10}
// vite.config.js
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
    // ...
  };
});
```

### Next.js {/*usage-with-nextjs*/}

Next.js memiliki konfigurasi eksperimental untuk mengaktifkan React Compiler. Hal ini secara otomatis memastikan Babel disiapkan dengan `babel-plugin-react-compiler`.

- Instal Next.js *canary*, yang menggunakan *React 19 Release Candidate*
- Instal `babel-plugin-react-compiler`

<TerminalBlock>
npm install next@canary babel-plugin-react-compiler
</TerminalBlock>

Kemudian konfigurasikan opsi eksperimental di `next.config.js`:

```js {4,5,6}
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

Menggunakan opsi eksperimental memastikan dukungan untuk Kompilator React di:

- *App Router*
- *Pages Router*
- *Webpack* (bawaan)
- *Turbopack* (opsional melalui `--turbo`)


### Remix {/*usage-with-remix*/}
Instal `vite-plugin-babel`, dan tambahkan *plugin* Babel kompilator ke dalamnya:

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {2,14}
// vite.config.js
import babel from "vite-plugin-babel";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    remix({ /* ... */}),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

Anda dapat membuat *loader* Anda sendiri untuk React Compiler, seperti berikut:

```js
const ReactCompilerConfig = { /* ... */ };
const BabelPluginReactCompiler = require('babel-plugin-react-compiler');

function reactCompilerLoader(sourceCode, sourceMap) {
  // ...
  const result = transformSync(sourceCode, {
    // ...
    plugins: [
      [BabelPluginReactCompiler, ReactCompilerConfig],
    ],
  // ...
  });

  if (result === null) {
    this.callback(
      Error(
        `Failed to transform "${options.filename}"`
      )
    );
    return;
  }

  this.callback(
    null,
    result.code,
    result.map === null ? undefined : result.map
  );
}

module.exports = reactCompilerLoader;
```

### Expo {/*usage-with-expo*/}

Expo menggunakan Babel melalui Metro, jadi silakan merujuk ke bagian [Penggunaan dengan Babel](#usage-with-babel) untuk petunjuk instalasi.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native menggunakan Babel melalui Metro, jadi silakan merujuk ke bagian [Penggunaan dengan Babel](#usage-with-babel) untuk petunjuk instalasi.

## Pemecahan Masalah {/*troubleshooting*/}

Untuk melaporkan masalah, harap pertama-tama buat contoh minimal di [*React Compiler Playground*](https://playground.react.dev/) dan sertakan dalam laporan bug Anda. Anda dapat membuka masalah di repositori [facebook/react](https://github.com/facebook/react/issues).

Anda juga dapat memberikan umpan balik di Kelompok Kerja React Compiler dengan melamar menjadi anggota. Silakan lihat [README untuk detail lebih lanjut tentang bergabung](https://github.com/reactwg/react-compiler).

### Eror `(0 , _c) is not a function` {/*0--_c-is-not-a-function-error*/}

Ini terjadi jika Anda tidak menggunakan React 19 RC atau versi yang lebih baru. Untuk memperbaikinya, [tingkatkan aplikasi Anda ke React 19 RC terlebih dahulu](https://react.dev/blog/2024/04/25/react-19-upgrade-guide).

Jika Anda tidak dapat meningkatkan ke React 19, Anda dapat mencoba implementasi fungsi cache dari ruang pengguna seperti yang dijelaskan dalam [Kelompok Kerja](https://github.com/reactwg/react-compiler/discussions/6). Namun, harap dicatat bahwa ini tidak dianjurkan dan Anda harus memperbarui ke React 19 jika memungkinkan.

### Bagaimana cara saya mengetahui komponen saya telah dioptimalkan? {/*how-do-i-know-my-components-have-been-optimized*/}

[React Devtools](/learn/react-developer-tools) (v5.0+) memiliki dukungan bawaan untuk React Compiler dan akan menampilkan lencana "Memo ✨" di samping komponen yang telah dioptimalkan oleh kompilator.

### Sesuatu tidak berfungsi setelah kompilasi {/*something-is-not-working-after-compilation*/}
Jika Anda memiliki eslint-plugin-react-compiler terinstal, kompilator akan menampilkan pelanggaran aturan React di editor Anda. Ketika ini terjadi, itu berarti kompilator telah melewati optimasi komponen atau *hook* tersebut. Ini sepenuhnya normal, dan kompilator dapat melanjutkan untuk mengoptimalkan komponen lain di basis kode Anda. **Anda tidak perlu memperbaiki semua pelanggaran eslint segera**. Anda dapat menanganinya sesuai kecepatan Anda sendiri untuk meningkatkan jumlah komponen dan *hook* yang dioptimalkan.

Namun, karena sifat fleksibel dan dinamis dari JavaScript, tidak mungkin untuk mendeteksi semua kasus secara komprehensif. *Bug* dan perilaku tidak terdefinisi seperti *loop* tak hingga mungkin terjadi dalam kasus-kasus tersebut.

Jika aplikasi Anda tidak berfungsi dengan baik setelah kompilasi dan Anda tidak melihat eror eslint, kompilator mungkin salah mengompilasi kode Anda. Untuk memastikan hal ini, coba untuk menghilangkan masalah dengan secara agresif memilih keluar komponen atau hook yang Anda pikir mungkin terkait melalui [direktif `"use no memo"`](#opt-out-of-the-compiler-for-a-component).

```js {2}
function SuspiciousComponent() {
  "use no memo"; // memilih untuk tidak mengkompilasi komponen ini oleh Kompilator React
  // ...
}
```

<Note>
#### `"use no memo"` {/*use-no-memo*/}

`"use no memo"` adalah penyelesaian sementara yang memungkinkan Anda memilih untuk tidak mengkompilasi komponen dan *hook* dari kompilasi oleh Kompilator React. Direktif ini tidak dimaksudkan untuk bertahan lama seperti halnya [`"use client"`](/reference/rsc/use-client).

Tidak dianjurkan untuk menggunakan direktif ini kecuali benar-benar diperlukan. Setelah Anda memilih untuk tidak mengkompilasi komponen atau hook, komponen atau hook tersebut tidak akan mengkompilasi komponen selamanya hingga direktif dihapus. Ini berarti bahwa meskipun Anda memperbaiki kode, kompilator masih akan melewati kompilasinya kecuali Anda menghapus direktif tersebut.
</Note>

Saat Anda membuat eror tersebut hilang, pastikan bahwa menghapus direktif *opt-out* membuat masalah tersebut muncul kembali. Kemudian bagikan laporan *bug* dengan kami (Anda dapat mencoba mereduksi ke contoh kecil, atau jika itu kode sumber terbuka, Anda juga bisa langsung menempelkan seluruh sumbernya) menggunakan [*React Compiler Playground*](https://playground.react.dev) agar kami dapat mengidentifikasi dan membantu memperbaiki masalah tersebut.

### Masalah Lain {/*other-issues*/}

Silahkan lihat https://github.com/reactwg/react-compiler/discussions/7.
