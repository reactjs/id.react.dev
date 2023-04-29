---
title: "React Hook Bawaan"
---

<Intro>

*Hook* memungkinkan Anda menggunakan fitur React dari dalam komponen Anda. Anda dapat menggunakan Hook bawaan atau mengkombinasikan mereka untuk membuat hook Anda sendiri. Halaman ini mencantumkan daftar semua list Hook bawaan yang tersedia di React.

</Intro>

---

## Hook State {/*state-hooks*/}

*State* memungkinkan sebuah komponen ["mengingat" informasi seperti masukan pengguna.](/learn/state-a-components-memory) Sebagai contoh, sebuah komponen formulir dapat menggunakan *state* untuk menyimpan nilai masukan, sementara komponen gambar galeri dapat menggunakan state untuk menyimpan indeks gambar yang terpilih. 
Untuk menambahkan state ke sebuah komponen, gunakan salah satu Hooks dibawah ini:

* [`useState`](/reference/react/useState) mendeklarasi sebuah variabel *state* yang dapat Anda perbarui secara langsung. 
* [`useReducer`](/reference/react/useReducer) mendeklarasi sebuah variabel *state* dengan pembaruan logika dalam sebuah [fungsi reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Hook Context {/*context-hooks*/}

*Context* memungkinkan sebuah komponen [menerima informasi dari induk yang jauh tanpa mengopernya sebagai props.](/learn/passing-props-to-a-component) Sebagai contoh, komponen tingkat atas aplikasi Anda dapat meneruskan tema antarmuka pengguna (UI) saat ini ke semua komponen di bawah, tidak peduli seberapa dalam. 
* [`useContext`](/reference/react/useContext) membaca dan berlangganan ke sebuah *context*.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Hook Ref {/*ref-hooks*/}
*Refs* memungkinkan sebuah komponen [menyimpan beberapa informasi yang tidak digunakan untuk dirender](/learn/referencing-values-with-refs) seperti node DOM atau ID *timeout*. Tidak seperti state, memperbarui *ref* tidak merender ulang komponen Anda. Ref adalah jalan keluar dari paradigma React. *Ref* berguna ketika Anda membutuhkan untuk bekerja dengan sistem non-React, seperti *API* browser bawaan.

* [`useRef`](/reference/react/useRef) mendeklarasi *ref*. Anda dapat menyimpan nilai apapun didalamnya, tapi *ref* sering kali digunakan untuk menyimpan node DOM.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) memungkinkan Anda menyesuaikan *ref* yang terekspos oleh komponen Anda. Ini jarang sekali digunakan.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Hook Efek {/*effect-hooks*/}

*Efek* memungkinkan sebuah komponen [terhubung dan menyesuaikan dengan sistem eksternal](/learn/synchronizing-with-effects) Ini termasuk berurusan dengan jaringan, browser DOM, animasi, widget yang ditulis menggunakan UI pustaka lain, dan kode non-React lainnya.

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

Efek adalah jalan keluar dari paradigma React. Jangan gunakan Efek untuk mengatur aliran data aplikasi Anda. Jika Anda tidak berinteraksi dengan sistem eksternal, [Kemungkinan Besar Anda Tidak Memerlukan Efek](/learn/you-might-not-need-an-effect)

Terdapat dua variasi dari `useEffect` yang jarang digunakan dengan perbedaan pada waktu-nya

* [`useLayoutEffect`](/reference/react/useLayoutEffect) dipanggil sebelum browser melakukan repaint layar. Anda dapat menggunakannya untuk mengukur layout pada tahap ini.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) dipanggil sebelum React melakukan perubahan ke DOM. Pustaka - pustaka dapat memasukkan CSS dinamik disini.

---

## Hook Performa {/*performance-hooks*/}

Cara yang umum untuk mengoptimalkan kinerja pen-renderan ulang adalah melewatkan pekerjaan yang tidak perlu. Sebagai contoh, Anda dapat memberi tahu React untuk menggunakan kembali perhitungan yang sudah ada di dalam cache atau untuk melewatkan pen-renderan ulang jika data tersebut tidak berubah sejak render sebelumnya.

Untuk melewatkan perhitungan dan render ulang yang tidak perlu, gunakan salah satu dari Hook ini:

- [`useMemo`](/reference/react/useMemo) memungkinkan Anda menyimpan hasil perhitungan yang berat secara cache.
- [`useCallback`](/reference/react/useCallback) memungkinkan Anda menyimpan definisi fungsi di cache sebelum melewatkannya ke komponen yang dioptimalkan.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Terkadang, Anda tidak dapat melewatkan pe-*render*an ulang karena layar sebenarnya perlu pembaruan. Di dalam kasus itu, Anda dapat meningkatkan performa dengan memisahkan memblokir pembaruan yang harus sinkron (seperti mengetik masukan) dari pembaruan non-pemblokiran yang tidak perlu memblokir antarmuka pengguna (seperti memperbarui bagan).

Untuk memprioritaskan rendering, gunakan salah satu Hook ini:

- [`useTransition`](/reference/react/useTransition) memungkinkan Anda menandai transisi state sebagai non-blocking dan mengizinkan pembaruan lain untuk menghentikannya.
- [`useDeferredValue`](/reference/react/useDeferredValue) memungkinkan Anda menangguhkan pembaruan bagian antarmuka pengguna (UI) yang tidak penting dan membiarkan bagian lain memperbarui terlebih dahulu.

---

## Hook lainnya {/*other-hooks*/}

Ini adalah Hook yang sebagian besar berguna untuk penulis pustaka dan tidak umum digunakan di dalam kode aplikasi.

- [`useDebugValue`](/reference/react/useDebugValue) memungkinkan Anda memodifikasi tampilan label React DevTools untuk Hook kustom Anda.
- [`useId`](/reference/react/useId) memungkinkan komponen mengasosiasikan ID unik dengan dirinya sendiri. Biasanya digunakan dengan API aksesibilitas.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) memungkinkan komponen berlangganan ke *store* eksternal.

---

## Hook Anda sendiri {/*your-own-hooks*/}

Anda juga dapat [mendefinisikan Hook kustom Anda sendiri](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) sebagai fungsi JavaScript.
