---
id: hooks-reference
title: Referensi API Hooks
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Hooks* merupakan fitur baru pada React 16.8. *Hooks* memungkinkan Anda menggunakan *state* dan fitur React lainnya tanpa membuat sebuah kelas.

Halaman ini menjelaskan tentang API untuk *Hooks* bawaan di React.

Jika Anda baru menggunakan *Hooks*, Anda mungkin ingin melihat [gambaran umum](/docs/hooks-overview.html) terlebih dahulu. Anda juga dapat menemukan informasi yang berguna di bagian [pertanyaan yang sering diajukan](/docs/hooks-faq.html).

- [*Hooks* Dasar](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [*Hooks* Tambahan](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)
  - [`useDeferredValue`](#usedeferredvalue)
  - [`useTransition`](#usetransition)
  - [`useId`](#useid)
- [Library Hooks](#library-hooks)
  - [`useSyncExternalStore`](#usesyncexternalstore)
  - [`useInsertionEffect`](#useinsertioneffect)

## *Hooks* Dasar {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

Mengembalikan sebuah nilai *stateful*, dan sebuah fungsi untuk memperbaruinya.

Selama *render* awal, *state* yang dikembalikan (`state`) sama dengan nilai yang telah dioper pada argumen pertama (`initialState`).

Fungsi `setState` digunakan untuk memperbarui *state*. Fungsi tersebut menerima sebuah nilai *state* yang baru dan meminta sebuah *render* ulang pada komponen tersebut.

```js
setState(newState);
```

Selama *render* ulang berikutnya, nilai pertama yang dikembalikan oleh `useState` akan selalu menjadi *state* yang paling terbaru setelah pembaruan diterapkan.

>Catatan
>
>React menjamin bahwa identitas fungsi `setState` stabil dan tidak akan berubah saat *render* ulang. Inilah sebabnya mengapa aman untuk diabaikan dari daftar *dependency* `useEffect` atau `useCallback`.

#### Pembaruan fungsional {#functional-updates}

Jika *state* baru dikomputasi menggunakan *state* sebelumnya, Anda dapat mengoper sebuah fungsi ke `setState`. Fungsi tersebut akan menerima nilai sebelumnya, dan mengembalikan sebuah nilai yang telah diperbarui. Berikut adalah contoh komponen penghitung yang menggunakan kedua bentuk `setState`:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

Tombol "+" dan "-" menggunakan bentuk fungsional, karena nilai yang telah diperbarui didasari oleh nilai sebelumnya. Tetapi tombol "Reset" menggunakan bentuk normal, karena tombol tersebut selalu mengatur perhitungan kembali ke nilai awal.

Jika fungsi pembaruan Anda mengembalikan nilai yang sama dengan _state_ saat ini, pe-_render_-an ulang selanjutnya akan dilewati.

> Catatan
>
> Tidak seperti metode `setState` yang dapat ditemukan dalam *class components*, `useState` tidak secara otomatis menggabungkan obyek-obyek yang telah diperbaruinya. Anda bisa meniru perilaku ini dengan menggabungkan fungsi *updater* dengan *object spread syntax*:
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>   // Object.assign would also work
>   return {...prevState, ...updatedValues};
> });
> ```
>
> Pilihan lainnya adalah `useReducer`, yang lebih cocok untuk mengelola obyek-obyek *state* yang berisi beberapa sub nilai.

#### Lazy initial state {#lazy-initial-state}

Argumen `initialState` adalah *state* yang digunakan selama *render* awal. Dalam *render* berikutnya, argumen tersebut diabaikan. Jika *state* awal adalah hasil dari perhitungan yang "mahal", mungkin Anda dapat menyediakan sebuah fungsi sebagai gantinya, yang akan dijalankan hanya pada *render* awal:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### Pengabaian dari sebuah pembaruan *state* {#bailing-out-of-a-state-update}

Jika Anda memperbarui sebuah *State Hook* ke nilai yang sama dengan nilai *state* saat ini, React akan mengabaikannya tanpa me-*render* turunannya atau mengaktifkan efek. (React menggunakan [`Object.is` algoritma perbandingan](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Perlu diperhatikan bahwa React mungkin masih perlu me-*render* lagi komponen tersebut sebelum diabaikan. Itu seharusnya tidak perlu menjadi perhatian karena React tidak perlu masuk "lebih dalam" ke dalam bagan. Jika Anda melakukan perhitungan "mahal" saat me-*render*, Anda dapat mengoptimalkannya dengan `useMemo`.

#### Batching of state updates {#batching-of-state-updates}

React may group several state updates into a single re-render to improve performance. Normally, this improves performance and shouldn't affect your application's behavior.

Before React 18, only updates inside React event handlers were batched. Starting with React 18, [batching is enabled for all updates by default](/blog/2022/03/08/react-18-upgrade-guide.html#automatic-batching). Note that React makes sure that updates from several *different* user-initiated events -- for example, clicking a button twice -- are always processed separately and do not get batched. This prevents logical mistakes.

In the rare case that you need to force the DOM update to be applied synchronously, you may wrap it in [`flushSync`](/docs/react-dom.html#flushsync). However, this can hurt performance so do this only where needed.

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

Menerima sebuah fungsi yang berisi kode imperatif, juga kode yang mungkin mengandung efek samping.

Mutasi, berlangganan, pengatur waktu, mencatat, dan efek samping lainnya tidak diperbolehkan di dalam bagian utama dari sebuah *function component* (disebut sebagai _render phase_ pada React). Dengan melakukan hal tersebut akan menyebabkan *bugs* dan ketidakkonsistenan pada UI.

Sebagai gantinya, gunakan `useEffect`. Fungsi yang dioper ke `useEffect` akan berjalan setelah *render* dilakukan ke layar. Pikirkan efek sebagai jalan keluar dari dunia fungsional murni pada React ke dunia imperatif.

Secara bawaan, efek berjalan setelah setiap *render* selesai, tetapi Anda dapat memilih untuk memicu efek tersebut [hanya ketika nilai-nilai tertentu telah berubah](#conditionally-firing-an-effect).

#### Membersihkan sebuah efek {#cleaning-up-an-effect}

Seringkali, efek-efek menciptakan sumber daya yang perlu dibersihkan sebelum komponen meninggalkan layar, seperti sebuah langganan atau pengatur waktu. Untuk melakukan ini, fungsi yang dioper ke `useEffect` mungkin dapat mengembalikan sebuah fungsi pembersihan. Misalnya, untuk membuat sebuah langganan:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

Fungsi pembersihan berjalan sebelum komponen dihapus dari UI untuk mencegah kebocoran memori. Selain itu, jika komponen me-*render* berkali-kali (seperti biasanya), **efek sebelumnya dibersihkan sebelum menjalankan efek selanjutnya**. Dalam contoh ini, sebuah langganan baru dibuat pada setiap pembaruan. Untuk menghindari pengaktifan efek pada setiap pembaruan, lihat bagian selanjutnya.

#### Pengaturan waktu efek {#timing-of-effects}

Tidak seperti `componentDidMount` dan `componentDidUpdate`, fungsi dioper ke `useEffect` aktif **setelah** tata letak dan menggambar, selama *event* yang ditunda. Ini membuatnya cocok untuk kebanyakan efek samping yang umum, seperti mengatur langganan dan *event handlers*, karena sebagian besar jenis pekerjaan tidak boleh menghalangi browser untuk memperbarui layar.

Namun, tidak semua efek dapat ditangguhkan. Misalnya, mutasi DOM yang terlihat oleh pengguna harus diaktifkan secara *synchronous* sebelum menggambar berikutnya sehingga pengguna tidak perlu melihat visual yang tidak konsisten. (Perbedaannya secara konseptual mirip dengan *event listeners* pasif melawan *event listeners* aktif.) Untuk jenis efek ini, React menyediakan satu *Hook* tambahan yang disebut [`useLayoutEffect`](#uselayouteffect). Ini memiliki tanda yang sama dengan `useEffect`, dan hanya berbeda ketika itu dijalankan.

<<<<<<< HEAD
Meskipun `useEffect` ditangguhkan sampai setelah browser digambar, `useEffect` dijamin akan diaktifkan sebelum *render* baru. React akan selalu membanjiri efek render sebelumnya, sebelum memulai sebuah pembaruan baru.
=======
Additionally, starting in React 18, the function passed to `useEffect` will fire synchronously **before** layout and paint when it's the result of a discrete user input such as a click, or when it's the result of an update wrapped in [`flushSync`](/docs/react-dom.html#flushsync). This behavior allows the result of the effect to be observed by the event system, or by the caller of [`flushSync`](/docs/react-dom.html#flushsync).

> Note
> 
> This only affects the timing of when the function passed to `useEffect` is called - updates scheduled inside these effects are still deferred. This is different than [`useLayoutEffect`](#uselayouteffect), which fires the function and processes the updates inside of it immediately.

Even in cases where `useEffect` is deferred until after the browser has painted, it's guaranteed to fire before any new renders. React will always flush a previous render's effects before starting a new update.
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

#### Memicu sebuah efek secara bersyarat {#conditionally-firing-an-effect}

Perilaku efek secara bawaan adalah dengan memicu efek setelah setiap *render* selesai. Dengan begitu efek selalu diciptakan kembali jika salah satu dari beberapa *dependency*-nya berubah.

Namun, ini mungkin terlalu berlebihan dalam beberapa kasus, seperti contoh sebuah langganan pada bagian sebelumnya. Kita tidak perlu membuat sebuah langganan baru pada setiap pembaruan, hanya jika *props* `source` telah berubah.

Untuk mengimplementasikan ini, oper sebuah argumen kedua ke `useEffect` yang merupakan senarai nilai yang efeknya bergantung padanya. Contoh terbaru akan terlihat seperti berikut:

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

Sekarang langganan tersebut hanya akan dibuat ulang ketika `props.source` berubah.

>Catatan
>
>Jika Anda menggunakan optimisasi ini, pastikan senarai termasuk **semua nilai dari lingkup komponen (seperti *props* dan *state*) yang berubah seiring waktu dan yang digunakan oleh efek**. Jika tidak, kode Anda akan merujuk pada nilai lama dari *renders* sebelumnya. Pelajari lebih lanjut tentang [bagaimana cara menangani fungsi](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) dan apa yang harus dilakukan ketika [nilai senarai terlalu sering berubah](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>Jika Anda ingin menjalankan efek dan membersihkannya hanya sekali (saat *mount* dan *unmount*), Anda dapat mengoper senarai kosong (`[]`) sebagai argumen kedua. Ini memberi tahu React bahwa efek Anda tidak bergantung pada nilai apapun dari *props* atau *state*, sehingga efek itu tidak perlu dijalankan kembali. Ini tidak ditangani sebagai kasus khusus -- ini mengikuti secara langsung bagaimana *dependencies* senarai selalu bekerja.
>
>Jika Anda mengoper senarai kosong (`[]`), *props* dan *state* di dalam efek akan selalu memiliki nilai awal. Ketika mengoper `[]` dimana argumen kedua akan lebih dekat dengan model mental `componentDidMount` dan` componentWillUnmount` yang sudah dikenal, biasanya ada [solusi](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) [lebih baik](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) untuk menghindari menjalankan efek terlalu sering. Juga, jangan lupa bahwa React menunda menjalankan `useEffect` sampai setelah browser digambar, jadi, melakukan pekerjaan ekstra tidak terlalu menjadi masalah.
>
>
> Kami sarankan untuk menggunakan aturan [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) sebagai bagian dari paket [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) kami. Itu akan memberi peringatan ketika *dependencies* ditentukan secara tidak benar dan akan menyarankan sebuah perbaikan.

Senarai dari *dependencies* tidak dioper sebagai argumen ke fungsi efek. Meskipun demikian, secara konseptual itulah yang mereka wakili: setiap nilai yang direferensikan di dalam fungsi efek juga harus muncul dalam senarai *dependencies*. Di masa depan, kompiler yang cukup canggih dapat membuat senarai ini secara otomatis.

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

Menerima sebuah obyek konteks (nilai yang dikembalikan dari `React.createContext`) dan mengembalikan nilai konteks saat ini untuk konteks tersebut. Nilai konteks saat ini ditentukan oleh `value` dari *prop* terdekat dari `<MyContext.Provider>` diatas komponen yang dipanggil pada bagan.

Ketika `<MyContext.Provider>` terdekat dari komponen melakukan pembaruan, *Hook* ini akan memicu *render* ulang dengan `value` dari konteks terakhir yang dioper ke penyedia `MyContext` tersebut. Meskipun induk teratas menggunakan [`React.memo`](/docs/react-api.html#reactmemo) atau [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate), proses _render_ ulang akan tetap terjadi yang dimulai dari komponen tersebut menggunakan `useContext`.

Jangan lupa bahwa argumen untuk `useContext` harus berupa obyek konteks itu sendiri:

 * **Benar:** `useContext(MyContext)`
 * **Salah:** `useContext(MyContext.Consumer)`
 * **Salah:** `useContext(MyContext.Provider)`

Sebuah komponen yang memanggil `useContext` akan selalu me-*render* ulang ketika nilai konteksnya berubah. Jika merender ulang komponen itu "mahal", Anda dapat [mengoptimalkannya dengan menggunakan memoisasi](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

>Kiat
>
>Jika Anda terbiasa dengan API konteks sebelum *Hooks*, `useContext(MyContext)` setara dengan `static contextType = MyContext` pada sebuah kelas, atau untuk `<MyContext.Consumer>`.
>
>`useContext(MyContext)` hanya memungkinkan Anda *membaca* konteksnya dan berlangganan pada perubahannya. Anda masih memerlukan `<MyContext.Provider>` di atas pada bagan untuk *memberikan* nilai untuk konteks ini.

**Menyatukannya bersama dengan Context.Provider**
```js{31-36}
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```
Contoh ini dimodifikasi untuk *hooks* dari contoh sebelumnya di [Panduan Konteks Tingkat Lanjut](/docs/context.html), di mana Anda dapat menemukan informasi lebih lanjut tentang kapan dan bagaimana cara menggunakan konteks.


## *Hooks* Tambahan {#additional-hooks}

*Hooks* berikut adalah varian dasar dari bagian sebelumnya, atau hanya diperlukan untuk kasus tertentu. Jangan terlalu dipusingkan untuk mempelajarinya di muka.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

Sebuah alternatif untuk [`useState`](#usestate). Menerima sebuah *reducer* bertipe `(state, action) => newState`, dan mengembalikan *state* saat ini yang dipasangkan dengan metode `dispatch`. (Jika Anda terbiasa dengan Redux, Anda sudah tahu cara kerjanya.)

`useReducer` biasanya lebih disukai daripada `useState` ketika Anda memiliki logika *state* yang kompleks yang melibatkan beberapa sub nilai atau ketika *state* selanjutnya bergantung pada *state* sebelumnya. `useReducer` juga memungkinkan Anda mengoptimalkan kinerja untuk komponen yang memicu pembaruan mendalam karena [Anda dapat mengoper `dispatch` ke bawah bukan menggunakan *callbacks*](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

Inilah contoh sebuah penghitung dari bagian [`useState`](#usestate), ditulis ulang untuk menggunakan *reducer*:

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

>Catatan
>
>React menjamin bahwa identitas fungsi `setState` stabil dan tidak akan berubah saat *render* ulang. Inilah sebabnya mengapa aman untuk diabaikan dari daftar *dependency* `useEffect` atau `useCallback`.

#### Menentukan *state* awal {#specifying-the-initial-state}

Terdapat dua cara berbeda untuk menginisialisasi `useReducer` *state*. Anda dapat memilih salah satu tergantung pada kasus penggunaan. Cara paling sederhana adalah dengan mengoper *state* awal sebagai argumen kedua:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Catatan
>
>React tidak menggunakan konvensi argumen `state = initialState` yang dipopulerkan oleh Redux. *State* awal kadang perlu bergantung pada *props* dan ditentukan dari panggilan *Hook* sebagai gantinya. Jika Anda sangat yakin dengan hal ini, Anda dapat memanggil `useReducer(reducer, undefined, reducer)` untuk meniru perilaku Redux, tetapi itu tidak dianjurkan.

#### Lazy initialization {#lazy-initialization}

Anda juga dapat membuat *state* awal secara *lazy*. Untuk melakukan ini, Anda dapat mengoper fungsi `init` sebagai argumen ketiga. *State* awal akan diatur ke `init(initialArg)`.

Ini memungkinkan Anda mengekstrak logika untuk menghitung *state* awal di luar *reducer*. Ini juga berguna untuk mengatur ulang *state* nantinya sebagai respon terhadap suatu tindakan:

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### Pengabaian dari sebuah *dispatch* {#bailing-out-of-a-dispatch}

Jika Anda mengembalikan nilai yang sama dari sebuah *Reducer Hook* sebagai *state* saat ini, React akan mengabaikannya tanpa me-*render* turunannya atau mengaktifkan efek. (React menggunakan [`Object.is` algoritma perbandingan](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Perhatikan bahwa React mungkin masih perlu me-*render* lagi komponen tersebut sebelum diabaikan. Itu seharusnya tidak perlu menjadi perhatian karena React tidak perlu masuk "lebih dalam" ke dalam bagan. Jika Anda melakukan perhitungan "mahal" saat me-*render*, Anda dapat mengoptimalkannya dengan `useMemo`.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Mengembalikan sebuah [*memoized*](https://en.wikipedia.org/wiki/Memoization) *callback*.

Oper sebuah *inline callback* dan sebuah senarai dari *dependencies*. `useCallback` akan mengembalikan versi *memoized* dari *callback* yang hanya berubah jika salah satu dari *dependency* telah berubah. Ini berguna ketika mengoper *callbacks* ke komponen turunan yang teroptimisasi yang mengandalkan kesetaraan referensi untuk mencegah *render* yang tidak perlu (misalnya `shouldComponentUpdate`).

`useCallback(fn, deps)` setara dengan `useMemo(() => fn, deps)`.

> Catatan
>
> Senarai dari *dependencies* tidak dioper sebagai argumen ke *callback*. Meskipun demikian, secara konseptual itulah yang mereka wakili: setiap nilai yang direferensikan di dalam *callback* juga harus muncul dalam senarai *dependencies*. Di masa depan, kompiler yang cukup canggih dapat membuat senarai ini secara otomatis.
>
> Kami sarankan untuk menggunakan aturan [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) sebagai bagian dari paket [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) kami. Itu akan memberi peringatan ketika *dependencies* ditentukan secara tidak benar dan akan menyarankan sebuah perbaikan.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Mengembalikan sebuah nilai [memoized](https://en.wikipedia.org/wiki/Memoization).

Oper sebuah fungsi "create" dan sebuah senarai dari *dependencies*. `useMemo` hanya akan menghitung ulang nilai *memoized* ketika salah satu *dependencies* telah berubah. Optimalisasi ini membantu menghindari perhitungan "mahal" pada setiap *render*.

Ingatlah bahwa fungsi yang dioper ke `useMemo` berjalan selama *render*. Jangan lakukan apa pun yang biasanya tidak Anda lakukan selama *render*. Misalnya, efek samping termasuk dalam `useEffect`, bukan` useMemo`.

Jika tidak ada senarai yang disediakan, sebuah nilai baru akan dihitung pada setiap *render*.

**Anda dapat mengandalkan `useMemo` sebagai sebuah pengoptimalan kinerja, bukan sebagai sebuah jaminan semantik.** Di masa mendatang, React dapat memilih untuk "melupakan" beberapa nilai *memoized* sebelumnya dan menghitung ulang pada *render* berikutnya, misalnya untuk mengosongkan memori untuk *offscreen components*. Tulis kode Anda dimana itu masih berfungsi tanpa `useMemo` - lalu tambahkan itu untuk mengoptimalkan kinerja.

> Catatan
>
> Senarai dari *dependencies* tidak dioper sebagai argumen ke dalam fungsi. Meskipun demikian, secara konseptual itulah yang mereka wakili: setiap nilai yang direferensikan di dalam fungsi juga harus muncul dalam senarai *dependencies*. Di masa depan, kompiler yang cukup canggih dapat membuat senarai ini secara otomatis.
>
>
> Kami sarankan untuk menggunakan aturan [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) sebagai bagian dari paket [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) kami. Itu akan memberi peringatan ketika *dependencies* ditentukan secara tidak benar dan akan menyarankan sebuah perbaikan.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` mengembalikan sebuah obyek *mutable ref* (obyek yang mungkin dapat berubah) dimana properti `.current` diinisialisasi ke argumen yang dioper (`initialValue`). Obyek yang dikembalikan akan bertahan selamanya di komponen.

Sebuah kasus penggunaan umum adalah dengan mengakses sebuah turunan secara imperatif:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

Pada dasarnya, `useRef` seperti "kotak" yang dapat menyimpan sebuah nilai *mutable* (nilai yang mungkin dapat berubah) dalam properti `.current`.

Anda mungkin terbiasa dengan refs terutama sebagai sebuah cara untuk [mengakses DOM](/docs/refs-and-the-dom.html). Jika Anda mengoper obyek ref ke React dengan `<div ref={myRef} />`, React akan mengatur properti `.current` miliknya ke DOM *node* yang sesuai setiap kali *node* itu berubah.

Namun, `useRef ()` berguna untuk lebih dari atribut `ref`. Ini [berguna untuk menjaga nilai yang mungkin dapat berubah di sekitarnya](/docs/hooks-faq.html#is-there-something-like-instance-variables) mirip dengan cara Anda menggunakan *instance fields* pada kelas.

Ini berfungsi karena `useRef ()` membuat obyek JavaScript biasa. Satu-satunya perbedaan antara `useRef ()` dan membuat obyek `{current: ...}` sendiri adalah bahwa `useRef` akan memberi Anda obyek ref yang sama pada setiap *render*.

Ingatlah bahwa `useRef` *tidak* memberi tahu Anda ketika kontennya berubah. Memutasi properti `.current` tidak menyebabkan *render* ulang. Jika Anda ingin menjalankan beberapa kode ketika React melampirkan atau melepaskan sebuah ref ke DOM *Node*, Anda mungkin ingin menggunakan [*callback ref*](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) sebagai gantinya.


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` mengkustomisasi nilai contoh yang diekspos ke komponen induk saat menggunakan `ref`. Seperti biasanya, kode imperatif yang menggunakan refs harus dihindari dalam banyak kasus. `useImperativeHandle` harus digunakan dengan `forwardRef`:

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

Dalam contoh ini, sebuah komponen induk yang me-*render* `<FancyInput ref={fancyInputRef} />` akan dapat memanggil `fancyInputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

Tanda ini identik dengan `useEffect`, tetapi diaktifkan secara *synchronous* setelah semua mutasi DOM. Gunakan ini untuk membaca tata letak dari DOM dan me-*render* ulang secara *synchronous*. Pembaruan yang dijadwalkan di dalam `useLayoutEffect` akan dipenuhi secara *synchronous*, sebelum browser memiliki kesempatan untuk menggambar.

Pilih `useEffect` standar bila memungkinkan untuk menghindari pemblokiran pembaruan visual.

> Tip
>
> Jika Anda memigrasikan kode dari sebuah *class component*, `useLayoutEffect` aktif pada fase yang sama dengan `componentDidMount` dan `componentDidUpdate`. Namun, **kami sarankan memulai dengan `useEffect` dahulu** dan hanya mencoba `useLayoutEffect` jika itu menyebabkan masalah.
>
>Jika Anda menggunakan *server rendering*, perlu diingat bahwa `useLayoutEffect` atau `useEffect` tidak dapat berjalan hingga JavaScript diunduh. Inilah sebabnya React memberikan peringatan ketika sebuah *server-rendered component* mengandung `useLayoutEffect`. Untuk memperbaikinya, pindahkan logika itu ke `useEffect` (jika itu tidak diperlukan untuk *render* pertama), atau menunda untuk memperlihatkan komponen itu sampai setelah *client* me-*render* (jika HTML terlihat rusak sampai `useLayoutEffect` berjalan).
>
>Untuk mengecualikan komponen yang membutuhkan efek tata letak dari *server-rendered* HTML, render secara kondisional dengan `showChild && <Child />` dan tunda untuk memperlihatkannya dengan `useEffect (() => {setShowChild (true);}, [] ) `. Dengan cara ini, UI tidak tampak rusak sebelum hidrasi.

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` dapat digunakan untuk menampilkan sebuah label untuk *hooks* kustom di React DevTools.

Misalnya, pertimbangkan `useFriendStatus` *hooks* kustom yang dijelaskan dalam ["Membuat *Hooks* Anda Sendiri"](/docs/hooks-custom.html):

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> Tip
>
> Kami tidak menyarankan menambahkan nilai *debug* ke setiap *Hook* kustom. Ini paling berharga untuk *Hooks* kustom yang merupakan bagian dari *libraries* bersama.

#### Tunda pemformatan nilai *debug* {#defer-formatting-debug-values}

Dalam beberapa kasus, memformat sebuah nilai untuk tampilan mungkin merupakan operasi yang "mahal". Ini juga tidak perlu kecuali sebuah *Hook* benar-benar diperiksa.

Karena alasan ini `useDebugValue` menerima sebuah fungsi pemformatan sebagai parameter opsional kedua. Fungsi ini hanya dipanggil jika *Hooks* diperiksa. Ini menerima nilai *debug* sebagai parameter dan harus mengembalikan sebuah nilai tampilan yang telah diformat.

Misalnya, sebuah *Hook* kustom yang mengembalikan sebuah nilai `Date` dapat menghindari pemanggilan fungsi `toDateString` tanpa perlu, dengan mengoper peformat berikut:

```js
useDebugValue(date, date => date.toDateString());
```

### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value);
```

`useDeferredValue` accepts a value and returns a new copy of the value that will defer to more urgent updates. If the current render is the result of an urgent update, like user input, React will return the previous value and then render the new value after the urgent render has completed.

This hook is similar to user-space hooks which use debouncing or throttling to defer updates. The benefits to using `useDeferredValue` is that React will work on the update as soon as other work finishes (instead of waiting for an arbitrary amount of time), and like [`startTransition`](/docs/react-api.html#starttransition), deferred values can suspend without triggering an unexpected fallback for existing content.

#### Memoizing deferred children {#memoizing-deferred-children}
`useDeferredValue` only defers the value that you pass to it. If you want to prevent a child component from re-rendering during an urgent update, you must also memoize that component with [`React.memo`](/docs/react-api.html#reactmemo) or [`React.useMemo`](/docs/hooks-reference.html#usememo):

```js
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
```

Memoizing the children tells React that it only needs to re-render them when `deferredQuery` changes and not when `query` changes. This caveat is not unique to `useDeferredValue`, and it's the same pattern you would use with similar hooks that use debouncing or throttling.

### `useTransition` {#usetransition}

```js
const [isPending, startTransition] = useTransition();
```

Returns a stateful value for the pending state of the transition, and a function to start it.

`startTransition` lets you mark updates in the provided callback as transitions:

```js
startTransition(() => {
  setCount(count + 1);
})
```

`isPending` indicates when a transition is active to show a pending state:

```js
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

> Note:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transitions will not show a fallback for re-suspended content. This allows the user to continue interacting with the current content while rendering the update.

### `useId` {#useid}

```js
const id = useId();
```

`useId` is a hook for generating unique IDs that are stable across the server and client, while avoiding hydration mismatches.

> Note
>
> `useId` is **not** for generating [keys in a list](/docs/lists-and-keys.html#keys). Keys should be generated from your data.

For a basic example, pass the `id` directly to the elements that need it:

```js
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
};
```

For multiple IDs in the same component, append a suffix using the same `id`:

```js
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <div>
        <input id={id + '-firstName'} type="text" />
      </div>
      <label htmlFor={id + '-lastName'}>Last Name</label>
      <div>
        <input id={id + '-lastName'} type="text" />
      </div>
    </div>
  );
}
```

> Note:
> 
> `useId` generates a string that includes the `:` token. This helps ensure that the token is unique, but is not supported in CSS selectors or APIs like `querySelectorAll`.
> 
> `useId` supports an `identifierPrefix` to prevent collisions in multi-root apps. To configure, see the options for [`hydrateRoot`](/docs/react-dom-client.html#hydrateroot) and [`ReactDOMServer`](/docs/react-dom-server.html).

## Library Hooks {#library-hooks}

The following Hooks are provided for library authors to integrate libraries deeply into the React model, and are not typically used in application code.

### `useSyncExternalStore` {#usesyncexternalstore}

```js
const state = useSyncExternalStore(subscribe, getSnapshot[, getServerSnapshot]);
```

`useSyncExternalStore` is a hook recommended for reading and subscribing from external data sources in a way that's compatible with concurrent rendering features like selective hydration and time slicing.

This method returns the value of the store and accepts three arguments:
- `subscribe`: function to register a callback that is called whenever the store changes.
- `getSnapshot`: function that returns the current value of the store.
- `getServerSnapshot`: function that returns the snapshot used during server rendering.

The most basic example simply subscribes to the entire store:

```js
const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

However, you can also subscribe to a specific field:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
);
```

When server rendering, you must serialize the store value used on the server, and provide it to `useSyncExternalStore`. React will use this snapshot during hydration to prevent server mismatches:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
  () => INITIAL_SERVER_SNAPSHOT.selectedField,
);
```

> Note:
>
> `getSnapshot` must return a cached value. If getSnapshot is called multiple times in a row, it must return the same exact value unless there was a store update in between.
> 
> A shim is provided for supporting multiple React versions published as `use-sync-external-store/shim`. This shim will prefer `useSyncExternalStore` when available, and fallback to a user-space implementation when it's not.
> 
> As a convenience, we also provide a version of the API with automatic support for memoizing the result of getSnapshot published as `use-sync-external-store/with-selector`.

### `useInsertionEffect` {#useinsertioneffect}

```js
useInsertionEffect(didUpdate);
```

The signature is identical to `useEffect`, but it fires synchronously _before_ all DOM mutations. Use this to inject styles into the DOM before reading layout in [`useLayoutEffect`](#uselayouteffect). Since this hook is limited in scope, this hook does not have access to refs and cannot schedule updates.

> Note:
>
> `useInsertionEffect` should be limited to css-in-js library authors. Prefer [`useEffect`](#useeffect) or [`useLayoutEffect`](#uselayouteffect) instead.
