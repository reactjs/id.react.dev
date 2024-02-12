---
<<<<<<< HEAD
title: "React Hook Bawaan"
=======
title: React Reference Overview
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158
---

<Intro>

<<<<<<< HEAD
*Hook* memungkinkan Anda menggunakan fitur React dari dalam komponen Anda. Anda dapat menggunakan Hook bawaan atau mengkombinasikan mereka untuk membuat hook Anda sendiri. Halaman ini mencantumkan daftar semua Hook bawaan yang tersedia di React.
=======
This section provides detailed reference documentation for working with React. For an introduction to React, please visit the [Learn](/learn) section.
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

</Intro>

The React reference documentation is broken down into functional subsections:

<<<<<<< HEAD
## Hook State {/*state-hooks*/}

*State* memungkinkan sebuah komponen ["mengingat" informasi seperti masukan pengguna.](/learn/state-a-components-memory) Sebagai contoh, sebuah komponen formulir dapat menggunakan *state* untuk menyimpan nilai masukan, sementara sebuah komponen galeri gambar dapat menggunakan *state* untuk menyimpan indeks gambar yang terpilih. 
Untuk menambahkan *state* ke sebuah komponen, gunakan salah satu Hooks dibawah ini:

* [`useState`](/reference/react/useState) mendeklarasikan sebuah variabel *state* yang dapat Anda perbarui secara langsung. 
* [`useReducer`](/reference/react/useReducer) mendeklarasikan sebuah variabel *state* dengan logika pembaruan yang tertulis di dalam sebuah [fungsi *reducer*.](/learn/extracting-state-logic-into-a-reducer)
=======
## React {/*react*/}

Programmatic React features:

* [Hooks](/reference/react/hooks) - Use different React features from your components.
* [Components](/reference/react/components) - Documents built-in components that you can use in your JSX.
* [APIs](/reference/react/apis) - APIs that are useful for defining components.
* [Directives](/reference/react/directives) - Provide instructions to bundlers compatible with React Server Components.

## React DOM {/*react-dom*/}
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

React-dom contains features that are only supported for web applications (which run in the browser DOM environment). This section is broken into the following:

* [Hooks](/reference/react-dom/hooks) - Hooks for web applications which run in the browser DOM environment.
* [Components](/reference/react-dom/components) - React supports all of the browser built-in HTML and SVG components.
* [APIs](/reference/react-dom) - The `react-dom` package contains methods supported only in web applications.
* [Client APIs](/reference/react-dom/client) - The `react-dom/client` APIs let you render React components on the client (in the browser).
* [Server APIs](/reference/react-dom/server) - The `react-dom/server` APIs let you render React components to HTML on the server.

<<<<<<< HEAD
## Hook Context {/*context-hooks*/}

*Context* memungkinkan sebuah komponen [menerima informasi dari induk yang jauh tanpa mengopernya sebagai *props*.](/learn/passing-props-to-a-component) Sebagai contoh, komponen tingkat teratas aplikasi Anda dapat meneruskan tema antarmuka pengguna (UI) saat ini ke semua komponen di bawahnya, seberapa pun dalamnya.
* [`useContext`](/reference/react/useContext) membaca dan berlangganan ke sebuah *context*.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Hook Ref {/*ref-hooks*/}

*Refs* memungkinkan sebuah komponen [menyimpan beberapa informasi yang tidak digunakan untuk pe-*render*-an](/learn/referencing-values-with-refs) seperti simpul (*node*) DOM atau ID *timeout*. Tidak seperti *state*, memperbarui sebuah *ref* tidak me-*render* ulang komponen Anda. *Ref* adalah jalan keluar dari paradigma React. *Ref* berguna ketika Anda perlu untuk bekerja dengan sistem-sistem non-React, seperti *API-API* bawaan dari peramban.

* [`useRef`](/reference/react/useRef) mendeklarasikan *ref*. Anda dapat menyimpan nilai apa pun di dalamnya, tapi *ref* seringkali digunakan untuk menyimpan simpul DOM.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) memungkinkan Anda menyesuaikan *ref* yang terekspos oleh komponen Anda. Ini jarang sekali digunakan.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Hook Efek {/*effect-hooks*/}

*Efek* memungkinkan sebuah komponen [terhubung dan menyinkronkan dengan sistem eksternal](/learn/synchronizing-with-effects). Termasuk di dalamnya yakni berurusan dengan jaringan, DOM peramban, animasi, *widget* yang ditulis menggunakan UI pustaka lain, dan kode non-React lainnya.

* [`useEffect`](/reference/react/useEffect) menghubungkan sebuah komponen ke sebuah sistem eksternal.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Efek adalah "jalan keluar" dari paradigma React. Jangan gunakan Efek untuk mengatur aliran data aplikasi Anda. Jika Anda tidak berinteraksi dengan sistem eksternal, [kemungkinan besar Anda tidak memerlukan Efek.](/learn/you-might-not-need-an-effect)

Terdapat dua variasi dari `useEffect` yang jarang digunakan dengan perbedaan pada waktu eksekusinya

* [`useLayoutEffect`](/reference/react/useLayoutEffect) dipanggil sebelum peramban melukis ulang (*repaint*) layar. Anda dapat menggunakannya untuk mengukur tata letak (*layout*) pada tahap ini.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) dipanggil sebelum React melakukan perubahan ke DOM. Pustaka-pustaka (*libraries*) lainnya dapat memasukkan CSS dinamik di sini.

---

## Hook Kinerja {/*performance-hooks*/}

Cara yang umum untuk mengoptimalkan kinerja pe-*render*-an ulang adalah melewatkan pekerjaan yang tidak perlu. Sebagai contoh, Anda dapat memberi tahu React untuk menggunakan kembali perhitungan yang sudah ada di dalam *cache* atau untuk melewatkan *render* ulang jika data tersebut tidak berubah sejak *render* sebelumnya.

Untuk melewatkan perhitungan dan pe-*render*-an ulang yang tidak perlu, gunakan salah satu dari *Hook-hook* ini:

- [`useMemo`](/reference/react/useMemo) memungkinkan Anda menyimpan hasil perhitungan yang berat di *cache*.
- [`useCallback`](/reference/react/useCallback) memungkinkan Anda menyimpan definisi fungsi di *cache* sebelum melewatkannya ke komponen yang hendak dioptimasi.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Terkadang, Anda tidak dapat melewatkan pe-*render*-an ulang karena layar memang benar-benar memerlukan pembaruan. Di dalam kasus itu, Anda dapat meningkatkan kinerja dengan memisahkan pembaruan penghalang (*blocking updates*) yang harus sinkron (seperti mengetik masukan) dari pembaruan yang bukan penghalang (*non-blocking updates*) yang tidak perlu memblokir antarmuka pengguna (seperti memperbarui bagan).

Untuk memprioritaskan pe-*render*-an, gunakan salah satu dari *Hook-hook* ini:

- [`useTransition`](/reference/react/useTransition) memungkinkan Anda menandai transisi *state* sebagai bukan penghalang dan mengizinkan pembaruan lain untuk menghentikannya.
- [`useDeferredValue`](/reference/react/useDeferredValue) memungkinkan Anda menangguhkan pembaruan bagian antarmuka pengguna (UI) yang tidak penting dan membiarkan bagian lain memperbarui terlebih dahulu.

---

## Hook Resource {/*resource-hooks*/}

*Resource* dapat diakses sebuah komponen tanpa membuatnya menjadi bagian dari *state*. Misalnya, sebuah komponen dapat membaca pesan dari sebuah *Promise* atau membaca informasi *style* dari sebuah *context*.

To read a value from a resource, use this Hook:

- [`use`](/reference/react/use) memungkinkan Anda membaca nilai dari sebuah *resource seperti* [*Promise*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) atau [*context*](/learn/passing-data-deeply-with-context).

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

---

## Hook lainnya {/*other-hooks*/}

Ini adalah Hook yang sebagian besar berguna untuk penulis pustaka dan tidak umum digunakan di dalam kode aplikasi.

- [`useDebugValue`](/reference/react/useDebugValue) memungkinkan Anda memodifikasi tampilan label React DevTools untuk Hook kustom Anda.
- [`useId`](/reference/react/useId) memungkinkan komponen mengasosiasikan ID unik dengan dirinya sendiri. Biasanya digunakan dengan API aksesibilitas.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) memungkinkan komponen berlangganan ke *store* eksternal.

---

## Hook Anda sendiri {/*your-own-hooks*/}

Anda juga dapat [mendefinisikan Hook kustom Anda sendiri](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) sebagai fungsi JavaScript.
=======
## Legacy APIs {/*legacy-apis*/}

* [Legacy APIs](/reference/react/legacy) - Exported from the `react` package, but not recommended for use in newly written code.
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158
