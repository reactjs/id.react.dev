---
title: Kompiler React
---

<Intro>
Halaman ini akan memberikan pengantar tentang Kompiler React dan cara menjalankannya dengan sukses.
</Intro>

<Wip>
Dokumentasi ini masih dalam tahap pengembangan. Dokumentasi lebih lanjut tersedia di [repo Kelompok Kerja Kompiler React](https://github.com/reactwg/react-compiler/discussions), dan akan dimasukkan ke dalam dokumen ini ketika lebih stabil.
</Wip>

<YouWillLearn>

* Memulai dengan kompiler
* Menginstal kompiler dan plugin eslint
* Memecahkan masalah

</YouWillLearn>

<Note>
Kompiler React saat ini berada di kandidat rilis (RC) yang kami jadikan sumber terbuka untuk mendapatkan umpan balik awal dari komunitas. Saat ini kami merekomendasikan semuanya untuk mencoba kompiler ini dan memberi umpan balik.

Rilis RC terbaru dapat ditemukan di *tag* `@rc`, dan rilis eksperimental harian dapat ditemukan di *tag* `@experimental`.
</Note>

Kompiler React adalah kompiler baru yang kami jadikan sumber terbuka untuk mendapatkan umpan balik dari komunitas. Ini adalah alat yang digunakan pada waktu kompilasi yang secara otomatis mengoptimalkan aplikasi React Anda. Alat ini bekerja dengan JavaScript biasa, dan memahami [Aturan React](/reference/rules), sehingga Anda tidak perlu menulis ulang kode apa pun untuk menggunakannya.

Kompiler juga mencakup plugin [eslint](#installing-eslint-plugin-react-compiler) yang menampilkan analisis dari kompiler langsung di editor Anda. **We sangat merekomendasinkan semuanya untuk menggunakan *linter* ini sekarang.** *Linter* ini tidak memerlukan Anda untuk memasang kompiler React, jadi Anda dapat menggunakannya bahkan jika Anda belum siap menggunakan kompiler.

Kompiler saat ini dirilis sebagai `rc`, dan dapat dicoba oleh aplikasi dan pustaka React 17+. Untuk menginstall RC:

<TerminalBlock>
{`npm install -D babel-plugin-react-compiler@rc eslint-plugin-react-hooks@^6.0.0-rc.1`}
</TerminalBlock>

Atau, jika Anda menggunakan Yarn:

<TerminalBlock>
{`yarn add -D babel-plugin-react-compiler@rc eslint-plugin-react-hooks@^6.0.0-rc.1`}
</TerminalBlock>

Jika Anda belum menggunakan React 19, silakan lihat [bagian di bawah](#using-react-compiler-with-react-17-or-18) untuk petunjuk lebih lanjut.

### Apa yang dilakukan oleh kompiler? {/*what-does-the-compiler-do*/}

Untuk mengoptimalkan aplikasi, Kompiler React secara otomatis melakukan memoisasi kode Anda. Anda mungkin sudah familiar dengan memoisasi melalui API seperti `useMemo`, `useCallback`, dan `React.memo`. Dengan API ini, Anda dapat memberi tahu React bahwa bagian-bagian tertentu dari aplikasi Anda tidak perlu dijalankan ulang jika inputnya tidak berubah, mengurangi pekerjaan pada pembaruan. Meskipun sangat berguna, mudah untuk lupa menerapkan memoisasi atau menerapkannya dengan cara yang salah. Hal ini dapat menyebabkan pembaruan yang tidak efisien karena React harus memeriksa bagian-bagian UI Anda yang tidak memiliki perubahan yang *berarti*.

Kompiler menggunakan pengetahuannya tentang JavaScript dan aturan React untuk secara otomatis melakukan memoisasi nilai atau kelompok nilai dalam komponen dan *hook* Anda. Jika ia mendeteksi pelanggaran aturan, ia akan melewati hanya komponen atau *hook* tersebut, dan melanjutkan kompilasi kode lain dengan aman

<Note>
Kompiler React dapat mendeteksi secara statis saat Aturan React dilanggar, dan dengan aman memilih untuk tidak mengoptimalkan hanya komponen atau kait yang terpengaruh. Kompiler tidak perlu mengoptimalkan 100% basis kode Anda.
</Note>

Jika basis kode Anda sudah sangat ter-memoisasi dengan baik, Anda mungkin tidak mengharapkan peningkatan kinerja yang signifikan dengan kompiler ini. Namun, dalam praktiknya, memoisasi dependensi yang benar yang menyebabkan masalah kinerja adalah hal yang sulit dilakukan dengan tepat secara manual.

<DeepDive>
#### Jenis memoisasi apa yang ditambahkan oleh Kompiler React? {/*what-kind-of-memoization-does-react-compiler-add*/}

Rilis awal Kompiler React terutama berfokus pada **meningkatkan kinerja pembaruan** (merender ulang komponen yang ada), sehingga berfokus pada dua kasus penggunaan:

1. **Melewati render ulang berantai komponen**
    * Merender ulang `<Parent />` menyebabkan banyak komponen dalam pohon komponennya merender ulang, meskipun hanya `<Parent />` yang berubah
1. **Melewati perhitungan mahal dari luar React**
    * Misalnya, memanggil `expensivelyProcessAReallyLargeArrayOfObjects()` di dalam komponen atau *hook* Anda yang membutuhkan data tersebut

#### Mengoptimalkan Render Ulang {/*optimizing-re-renders*/}

React memungkinkan Anda mengekspresikan UI Anda sebagai fungsi dari keadaan saat ini (lebih konkretnya: *prop*, *state*, dan konteks mereka). Dalam implementasinya saat ini, ketika keadaan komponen berubah, React akan merender ulang komponen tersebut *dan semua anak-anaknya* — kecuali jika Anda telah menerapkan memoisasi manual dengan `useMemo()`, `useCallback()`, atau `React.memo()`. Misalnya, pada contoh berikut, `<MessageButton>` akan merender ulang setiap kali keadaan `<FriendList>` berubah:

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
[*Lihat contoh ini di *React Compiler Playground**](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

Kompiler React secara otomatis menerapkan memoisasi manual yang setara, memastikan bahwa hanya bagian-bagian yang relevan dari aplikasi yang merender ulang saat keadaan berubah, yang kadang-kadang disebut sebagai "reaktivitas bergranular halus". Pada contoh di atas, Kompiler React menentukan bahwa nilai kembalian dari `<FriendListCard />` dapat digunakan kembali bahkan saat `friends` berubah, dan dapat menghindari membuat ulang JSX ini *dan* menghindari merender ulang `<MessageButton>` saat jumlah berubah.

#### Perhitungan mahal juga mendapatkan memoisasi {/*expensive-calculations-also-get-memoized*/}

Kompiler juga dapat secara otomatis melakukan memoisasi untuk perhitungan mahal yang digunakan selama merender:

```js
// **Tidak** memoisasi oleh Kompiler React, karena ini bukan komponen atau *hook*
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoisasi oleh Kompiler React karena ini adalah komponen
function TableContainer({ items }) {
  // Panggilan fungsi ini akan memoisasi:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[*Lihat contoh ini di *React Compiler Playground**](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

Namun, jika `expensivelyProcessAReallyLargeArrayOfObjects` adalah fungsi yang benar-benar mahal, Anda mungkin perlu mempertimbangkan untuk mengimplementasikan memoisasi sendiri di luar React, karena:

- Kompiler React hanya melakukan memoisasi pada komponen dan *hook* React, bukan setiap fungsi
- Memoisasi Kompiler React tidak dibagikan di beberapa komponen atau *hook*

Jadi, jika `expensivelyProcessAReallyLargeArrayOfObjects` digunakan dalam banyak komponen yang berbeda, bahkan jika item yang sama persis dilewatkan, perhitungan mahal tersebut akan dijalankan secara berulang. Kami merekomendasikan untuk [melakukan profil](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) terlebih dahulu untuk melihat apakah benar-benar mahal sebelum membuat kode menjadi lebih rumit.
</DeepDive>

### Haruskah saya mencoba kompiler? {/*should-i-try-out-the-compiler*/}

The compiler is now in RC and has been tested extensively in production. While it has been used in production at companies like Meta, rolling out the compiler to production for your app will depend on the health of your codebase and how well you've followed the [Rules of React](/reference/rules).

**Anda tidak perlu terburu-buru menggunakan kompiler sekarang. Tidak apa-apa untuk menunggu sampai mencapai rilis stabil sebelum mengadopsinya.** Namun, kami menghargai jika Anda mencobanya dalam eksperimen kecil di aplikasi Anda sehingga Anda dapat [memberikan umpan balik](#reporting-issues) kepada kami untuk membantu membuat kompiler menjadi lebih baik.

## Memulai {/*getting-started*/}

Selain dokumen ini, kami sarankan untuk memeriksa [Kelompok Kerja Kompiler React](https://github.com/reactwg/react-compiler) untuk informasi tambahan dan diskusi tentang kompiler.

### Menginstal eslint-plugin-react-hooks {/*installing-eslint-plugin-react-compiler*/}

React Compiler juga mendukung plugin ESLint. Anda dapat mencobanya dengan menginstal eslint-plugin-react-hooks@^6.0.0-rc.1.

<TerminalBlock>
{`npm install -D eslint-plugin-react-hooks@^6.0.0-rc.1`}
</TerminalBlock>

See our [editor setup](/learn/editor-setup#linting) guide for more details.

The ESLint plugin will display any violations of the rules of React in your editor. When it does this, it means that the compiler has skipped over optimizing that component or hook. This is perfectly okay, and the compiler can recover and continue optimizing other components in your codebase.

<Note>
**You don't have to fix all ESLint violations straight away.** You can address them at your own pace to increase the amount of components and hooks being optimized, but it is not required to fix everything before you can use the compiler.
</Note>

### Mengimplementasikan kompiler ke kode Anda {/*using-the-compiler-effectively*/}

#### Proyek yang sudah ada {/*existing-projects*/}
Kompiler ini dirancang untuk mengompilasi komponen fungsional dan *hook* yang mengikuti Aturan React. Kompiler ini juga dapat menangani kode yang melanggar aturan tersebut dengan cara mengabaikan (melewati) komponen atau *hook* yang bermasalah. Namun, karena sifat fleksibel JavaScript, kompiler tidak dapat menangkap setiap pelanggaran yang mungkin terjadi dan dapat menghasilkan hasil negatif palsu: yaitu, kompiler mungkin secara tidak sengaja mengompilasi komponen/*hook* yang melanggar Aturan React, yang dapat menyebabkan perilaku yang tidak terdefinisi.

Untuk alasan ini, untuk mengadopsi kompiler dengan sukses pada proyek yang sudah ada, kami sarankan menjalankannya pada direktori kecil di kode produk Anda terlebih dahulu. Anda dapat melakukannya dengan mengonfigurasi kompiler agar hanya berjalan pada set direktori tertentu:

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

When you have more confidence with rolling out the compiler, you can expand coverage to other directories as well and slowly roll it out to your whole app.

#### Proyek baru {/*new-projects*/}

Jika Anda memulai proyek baru, Anda dapat mengaktifkan kompiler pada seluruh kode Anda, yang merupakan perilaku bawaan.

### Menggunakan Kompiler React dengan React 17 or 18 {/*using-react-compiler-with-react-17-or-18*/}

Kompiler React bekerja paling baik dengan React 19 RC. Jika Anda tidak dapat melakukan pemutakhiran, Anda dapat memasang pustaka tambahan `react-compiler-runtime` yang akan memungkinkan kode yang dikompilasi berjalan pada versi sebelum 19. Namun, perlu diingat bahwa versi minimum yang didukung adalah 17.

<TerminalBlock>
{`npm install react-compiler-runtime@rc`}
</TerminalBlock>

Anda juga harus menambahkan `target` yang benar ke konfigurasi kompiler Anda, di mana `target` adalah versi utama React yang Anda targetkan:

```js {3}
// babel.config.js
const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
```

### Menggunakan kompiler dalam pustaka {/*using-the-compiler-on-libraries*/}

Kompiler React juga dapat digunakan untuk mengompilasi pustaka. Karena Kompiler React perlu dijalankan pada kode sumber asli sebelum transformasi kode apa pun, maka jalur pembuatan aplikasi tidak mungkin mengompilasi pustaka yang mereka gunakan. Oleh karena itu, rekomendasi kami adalah bagi pengelola pustaka untuk mengompilasi dan menguji pustaka mereka secara independen dengan kompiler, dan mengirimkan kode yang dikompilasi ke npm.

Karena kode Anda sudah dikompilasi sebelumnya, pengguna pustaka Anda tidak perlu mengaktifkan kompiler untuk mendapatkan manfaat dari memoisasi otomatis yang diterapkan ke pustaka Anda. Jika pustaka Anda menargetkan aplikasi yang belum menggunakan React 19, tentukan minimum [`target` dan tambahkan `react-compiler-runtime` sebagai dependensi langsung](#using-react-compiler-with-react-17-or-18). Paket runtime akan menggunakan implementasi API yang benar tergantung pada versi aplikasi, dan melakukan *polyfill* pada API yang hilang jika perlu.

Kode pustaka sering kali memerlukan pola yang lebih kompleks dan penggunaan *escape hatch*. Karena alasan ini, kami sarankan untuk memastikan bahwa Anda memiliki pengujian yang cukup guna mengidentifikasi masalah apa pun yang mungkin timbul dari penggunaan kompiler pada pustaka Anda. Jika Anda mengidentifikasi masalah apa pun, Anda selalu dapat memilih keluar dari komponen atau kait tertentu dengan direktif [`'use no memo'`](#something-is-not-working-after-compilation).

Mirip dengan aplikasi, tidak perlu mengompilasi sepenuhnya 100% komponen atau kait Anda untuk melihat manfaatnya di pustaka Anda. Titik awal yang baik mungkin adalah mengidentifikasi bagian pustaka Anda yang paling sensitif terhadap kinerja dan memastikan bahwa bagian tersebut tidak melanggar [Aturan React](/reference/rules), yang dapat Anda gunakan `eslint-plugin-react-compiler` untuk mengidentifikasinya.

## Penggunaan {/*installation*/}

### Babel {/*usage-with-babel*/}

<TerminalBlock>
{`npm install babel-plugin-react-compiler@rc`}
</TerminalBlock>

Kompiler mencakup *plugin* Babel yang dapat Anda gunakan dalam jalur pembangunan Anda untuk menjalankan kompiler.

Setelah instalasi, tambahkan ke konfigurasi Babel Anda. Harap dicatat bahwa sangat kritis bahwa kompiler dijalankan **pertama** dalam *pipeline*:

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

Please refer to the [Next.js docs](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) for more information.

### Remix {/*usage-with-remix*/}
Instal `vite-plugin-babel`, dan tambahkan *plugin* Babel kompiler ke dalamnya:

<TerminalBlock>
{`npm install vite-plugin-babel`}
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

*Loader* komunitas dari Webpack [kini tersedia di sini](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Silakan merujuk ke [dokumentasi Expo](https://docs.expo.dev/guides/react-compiler/) untuk mengaktifkan dan menggunakan Kompiler React dalam aplikasi Expo.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native menggunakan Babel melalui Metro, jadi silakan merujuk ke bagian [Penggunaan dengan Babel](#usage-with-babel) untuk petunjuk instalasi.

### Rspack {/*usage-with-rspack*/}

Silahkan merujuk ke [Dokumen Rspack](https://rspack.dev/guide/tech/react#react-compiler) untuk mengaktifkan dan menggunakan Kompiler React di aplikasi Rspack.

### Rsbuild {/*usage-with-rsbuild*/}

Silahkan merujuk ke [Dokumen Rsbuild](https://rsbuild.dev/guide/framework/react#react-compiler) untuk mengaktifkan dan menggunakan Kompiler React di aplikasi Rsbuild.

## Pemecahan Masalah {/*troubleshooting*/}

Untuk melaporkan masalah, harap pertama-tama buat contoh minimal di [*React Compiler Playground*](https://playground.react.dev/) dan sertakan dalam laporan bug Anda. Anda dapat membuka masalah di repositori [facebook/react](https://github.com/facebook/react/issues).

Anda juga dapat memberikan umpan balik di Kelompok Kerja React Compiler dengan melamar menjadi anggota. Silakan lihat [README untuk detail lebih lanjut tentang bergabung](https://github.com/reactwg/react-compiler).

### Apakah yang diasumsikan oleh kompiler? {/*what-does-the-compiler-assume*/}

Kompiler React mengasumsikan kode Anda:

1. JavaScript valid dan semantik.
2. Menguji bahwa nilai dan properti yang dapat bernilai null/opsional didefinisikan sebelum mengaksesnya (misalnya, dengan mengaktifkan [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) jika menggunakan TypeScript), misal, `if (object.nullableProperty) { object.nullableProperty.foo }` atau dengan optional-chaining `object.nullableProperty?.foo`
3. Mengikuti [Aturan React](https://react.dev/reference/rules)

Kompiler React dapat memverifikasi berbagai macam Aturan React secara statis, dan akan melewati kompilasi dengan aman ketika mendeteksi galat. Untuk melihat galat, kami juga merekomendasikan menginstal [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler).

### Bagaimana cara saya mengetahui komponen saya telah dioptimalkan? {/*how-do-i-know-my-components-have-been-optimized*/}

[React Devtools](/learn/react-developer-tools) (v5.0+) dan [React Native DevTools](https://reactnative.dev/docs/react-native-devtools) memiliki dukungan bawaan untuk React Compiler dan akan menampilkan lencana "Memo ✨" di samping komponen yang telah dioptimalkan oleh kompiler.

### Sesuatu tidak berfungsi setelah kompilasi {/*something-is-not-working-after-compilation*/}
Jika Anda memiliki eslint-plugin-react-compiler terinstal, kompiler akan menampilkan pelanggaran aturan React di editor Anda. Ketika ini terjadi, itu berarti kompiler telah melewati optimasi komponen atau *hook* tersebut. Ini sepenuhnya normal, dan kompiler dapat melanjutkan untuk mengoptimalkan komponen lain di basis kode Anda. **Anda tidak perlu memperbaiki semua pelanggaran ESLint segera**. Anda dapat menanganinya sesuai kecepatan Anda sendiri untuk meningkatkan jumlah komponen dan *hook* yang dioptimalkan.

Namun, karena sifat fleksibel dan dinamis dari JavaScript, tidak mungkin untuk mendeteksi semua kasus secara komprehensif. *Bug* dan perilaku tidak terdefinisi seperti *loop* tak hingga mungkin terjadi dalam kasus-kasus tersebut.

Jika aplikasi Anda tidak berfungsi dengan baik setelah kompilasi dan Anda tidak melihat galat ESLint, kompiler mungkin salah mengompilasi kode Anda. Untuk memastikan hal ini, coba untuk menghilangkan masalah dengan secara agresif memilih keluar komponen atau hook yang Anda pikir mungkin terkait melalui [direktif `"use no memo"`](#opt-out-of-the-compiler-for-a-component).

```js {2}
function SuspiciousComponent() {
  "use no memo"; // memilih untuk tidak mengkompilasi komponen ini oleh Kompiler React
  // ...
}
```

<Note>
#### `"use no memo"` {/*use-no-memo*/}

`"use no memo"` adalah penyelesaian sementara yang memungkinkan Anda memilih untuk tidak mengkompilasi komponen dan *hook* dari kompilasi oleh Kompiler React. Direktif ini tidak dimaksudkan untuk bertahan lama seperti halnya [`"use client"`](/reference/rsc/use-client).

Tidak dianjurkan untuk menggunakan direktif ini kecuali benar-benar diperlukan. Setelah Anda memilih untuk tidak mengkompilasi komponen atau hook, komponen atau hook tersebut tidak akan mengkompilasi komponen selamanya hingga direktif dihapus. Ini berarti bahwa meskipun Anda memperbaiki kode, kompiler masih akan melewati kompilasinya kecuali Anda menghapus direktif tersebut.
</Note>

Saat Anda membuat galat tersebut hilang, pastikan bahwa menghapus direktif *opt-out* membuat masalah tersebut muncul kembali. Kemudian bagikan laporan *bug* dengan kami (Anda dapat mencoba mereduksi ke contoh kecil, atau jika itu kode sumber terbuka, Anda juga bisa langsung menempelkan seluruh sumbernya) menggunakan [*React Compiler Playground*](https://playground.react.dev) agar kami dapat mengidentifikasi dan membantu memperbaiki masalah tersebut.

### Masalah Lain {/*other-issues*/}

Silahkan lihat https://github.com/reactwg/react-compiler/discussions/7.
