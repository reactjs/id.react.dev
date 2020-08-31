---
id: hooks-faq
title: Hooks FAQ
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Hooks* adalah tambahan baru dalam React 16.8. React memungkinkan Anda untuk menggunakan *state* dan fitur-fitur React lainnya tanpa perlu menuliskan sebuah kelas. 

Laman ini menjawab beberapa pertanyaan yang sering diajukan (*frequently asked questions*) tentang [*Hooks*](/docs/hooks-overview.html).

<!--
  jika Anda perlu me-rgenerate ini, snippet dalam konsol devtools ini bisa membantu:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[Strategi Adopsi](#adoption-strategy)**
  * [Versi React mana yang termasuk *Hooks* di dalamnya?](#which-versions-of-react-include-hooks)
  * [Apakah perlu menulis ulang semua komponen kelas saya?](#do-i-need-to-rewrite-all-my-class-components)
  * [Apa yang dapat saya lakukan dengan *Hooks* namun tidak bisa saya lakukan dengan kelas?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Seberapa banyak pengetahuan saya tentang React yang tetap relevan?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Haruskah saya menggunakan Hooks, kelas atau gabungan keduanya?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Apakah *Hooks* mencakup seluruh kasus yang digunakan untuk kelas?](#do-hooks-cover-all-use-cases-for-classes)
  * [Apakah *Hooks* menggantikan *render props* dan *higher-order components*?](#do-hooks-replace-render-props-and-higher-order-components)
  * [Apa kegunaan *Hooks* untuk API populer seperti Redux connect() dan React router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Apakah *Hooks* dapat bekerja dengan *static typing*?](#do-hooks-work-with-static-typing)
  * [Bagaimana cara menguji komponen-komponen yang menggunakan Hooks?](#how-to-test-components-that-use-hooks)
  * [Apa yang sebenarnya aturan-aturan *lint* terapkan?](#what-exactly-do-the-lint-rules-enforce)
* **[Dari Kelas ke Hooks](#from-classes-to-hooks)**
  * [Bagaimana cara *lifecycle method* dapat sesuai dengan Hooks?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Bagaimana cara saya dapat memperoleh data dengan Hooks?](#how-can-i-do-data-fetching-with-hooks)
  * [Apakah ada hal seperti *instance variable*?](#is-there-something-like-instance-variables)
  * [Apa saya harus menggunakan satu atau beberapa *state variable*?](#should-i-use-one-or-many-state-variables)
  * [Bisakah saya menjalakan sebuah efek hanya pada pembaruan?](#can-i-run-an-effect-only-on-updates)
  * [Bagimana cara untuk mendapatkan kembali *prop* atau *state* sebelumnya?](#how-to-get-the-previous-props-or-state)
  * [Mengapa saya melihat *prop* atau *state* yang basi dalam fungsi yang saya buat?](#why-am-i-seeing-stale-props-or-state-inside-my-function)
  * [Bagaimana cara mengimplementasikan *getDerivedStateFromProps*?](#how-do-i-implement-getderivedstatefromprops)
  * [Apakah ada fungsionalitas seperti *forceUpdate*?](#is-there-something-like-forceupdate)
  * [Bisakah saya membuat sebuah *ref* pada sebuah komponen fungsi?](#can-i-make-a-ref-to-a-function-component)
  * [Bagaimana cara mengukur sebuah simpul DOM?](#how-can-i-measure-a-dom-node)
  * [Apa yang dimaksud dengan *const [thing, setThing] = useState()*?](#what-does-const-thing-setthing--usestate-mean)
* **[Optimasi Performa](#performance-optimizations)**
  * [Bisakah saya melewatkan sebuah efek pada pembaruan?](#can-i-skip-an-effect-on-updates)
  * [Apakah aman untuk menghilangkan fungsi dari daftar *dependency*?](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  * [Apa yang bisa saya lakukan jika efek *dependency* berganti terlalu sering?](#what-can-i-do-if-my-effect-dependencies-change-too-often)
  * [Bagaimana cara mengimplementasikan *shouldComponentUpdate*?](#how-do-i-implement-shouldcomponentupdate)
  * [Bagaimana cara *memoize* perhitungan?](#how-to-memoize-calculations)
  * [Bagaimana cara membuat objek *expensive* secara *lazy*?](#how-to-create-expensive-objects-lazily)
  * [Apakah *Hooks* lamban karena membuat fungsi di saat *render*?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Bagaimana cara menghindari pengoperan *callback* ke bawah?](#how-to-avoid-passing-callbacks-down)
  * [Bagimana cara membaca sebuah nilai yang sering berubah dari *useCallback*?](#how-to-read-an-often-changing-value-from-usecallback)
* **[*Under the Hood*](#under-the-hood)**
  * [Bagaimana React menghubungkan panggilan *Hook* dengan komponen?](#how-does-react-associate-hook-calls-with-components)
  * [Adakah hasil kerja sebelumnya yang menginspirasi *Hooks*?](#what-is-the-prior-art-for-hooks)

## Strategi Adopsi {#adoption-strategy}

### Versi React mana yang termasuk *Hooks* di dalamnya? {#which-versions-of-react-include-hooks}

Mulai dari 16.8.0, implementasi stabil dari React Hooks sudah tersedia untuk:

* React DOM
* React Native
* React DOM Server
* React Test Renderer
* React Shallow Renderer

Perhatikan bahwa **untuk menjalankan Hooks, semua *package* React perlu setidaknya pada versi 16.8.0 atau lebih tinggi**. *Hooks* tidak akan bekerja jika Anda lupa melakukan pembaruan, sebagai contohnya, React *DOM*.

[React Native 0.59](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059) dan versi di atasnya sudah mendukung Hooks.

### Apakah perlu menulis ulang semua komponen kelas saya?{#do-i-need-to-rewrite-all-my-class-components}

Tidak. [Tidak ada rencana](/docs/hooks-intro.html#gradual-adoption-strategy) untuk menghilangkan kelas dari React -- kita semua perlu mengirimkan produk baru dan tidak memiliki waktu untuk penulisan ulang. Kami rekomendasikan untuk mencoba *Hooks* dalam kode baru.

### Apa yang dapat saya lakukan dengan *Hooks* namun tidak bisa saya lakukan dengan kelas? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Hooks menawarkan sebuah cara baru yang kuat dan ekpresif untuk menggunakan kembali fungsionalitas antara komponen. ["Buat Hooks-mu Sendiri"](/docs/hooks-custom.html) menyajikan sekilas apa saja yang mungkin dilakukan. [Artikel ini](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889), oleh seorang anggota inti tim React, menyelam lebih dalam lagi kemampuan-kemampuan baru yang dibuka oleh Hooks.

### Seberapa banyak pengetahuan saya tentang React yang tetap relevan? {#how-much-of-my-react-knowledge-stays-relevant}

Hooks adalah cara yang lebih langsung untuk menggunakan fitur-fitur React yang sudah Anda ketahui -- seperti *state, lifecycle, context,* dan *ref*. Hal-hal tersebut tidak secara mendasar merubah bagaimana React bekerja, dan pengetahuan Anda tentang komponen, *props*, dan *top-down data flow* tetaplah relevan.

Hooks memiliki sebuah alur kurva pembelajarannya sendiri. Jika terdapat sesuatu yang hilang dalam dokumentasi ini, [ajukan isu](https://github.com/reactjs/reactjs.org/issues/new) dan kami akan coba membantu.

### Haruskah saya menggunakan Hooks, kelas atau gabungan keduanya?{#should-i-use-hooks-classes-or-a-mix-of-both}

Ketika Anda siap, kami menganjurkan Anda untuk mulai mencoba *Hooks* dalam komponen-komponen baru yang Anda tulis. Pastikan setiap orang dalam tim Anda siap dan tidak asing dengan dokumentasi ini. Kami tidak merekomendasikan menulis ulang kelas-kelas Anda yang sudah ada ke *Hooks* kecuali Anda sudah berencana menulis ulang (seperti memperbaiki *bug*).

Anda tidak bisa menggunakan *Hooks* *di dalam* sebuah komponen kelas, tetapi Anda bisa mencampurkan komponen kelas dan fungsi dengan *Hooks* dalam sebuah tatanan. Tak peduli apakah sebuah komponen adalah kelas atau fungsi yang menggunakan Hooks, itu semua adalah implementasi rinci dari komponen tersebut. Dalam jangka waktu panjang, kami harap *Hooks* menjadi cara utama semua orang untuk menulis komponen React.

### Apakah *Hooks* mencakup seluruh kasus yang digunakan untuk kelas? {#do-hooks-cover-all-use-cases-for-classes}

Tujuan kami untuk *Hooks* yakni mencakup seluruh kasus yang digunakan untuk kelas sesegera mungkin. Tidak ada persamaan (*equivalent*) *Hooks* untuk *lifecyle* yang tidak umum seperti `getSnapshotBeforeUpdate` dan `componentDidCatch` sementara ini, namun kami berencana untuk menambahkannya segera.

Sekarang adalah masa-masa awal untuk Hooks, dan *library* pihak ketiga bisa jadi tidak kompatibel dengan *Hooks* saat ini.

### Apakah *Hooks* menggantikan *render props* dan *higher-order components*? {#do-hooks-replace-render-props-and-higher-order-components}

Seringkali, *render props* dan *higher-order components* hanya (me)*render* sebuah turunan. Kami pikir *Hooks* adalah cara yang lebih sederhana untuk menyajikan kasus penggunaan ini. Masih ada tempat untuk kedua pola (contohnya, sebuah *virtual scroller component* bisa saja memiliki sebuah *prop* `renderItem`, atau sebuah *visual container component* bisa saja memiliki struktur *DOM*-nya sendiri). Namun dalam banyak kasus, *Hooks* sudahlah cukup dan akan membantu mengurangi *nesting* dalam tatanan Anda.

### Apa kegunaan *Hooks* untuk API populer seperti Redux `connect()` dan React router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Anda dapat terus menggunakan API yang sama seperti yang selama ini dilakukan; API tersebut akan tetap bekerja.

React Redux sejak versi v7.1.0 [mendukung API Hooks](https://react-redux.js.org/api/hooks) dan memaparkan *Hooks* seperti `useDispatch` atau `useSelector`.

*Library* seperti React Router akan mendukung *Hooks* di masa yang akan datang.

### Apakah *Hooks* dapat bekerja dengan *static typing*?{#do-hooks-work-with-static-typing}

*Hooks* didesain dengan *static typing* pada dasarnya. Karena *Hooks* adalah sekumpulan fungsi, *static typing* lebih mudah ditulis dengan benar daripada pola-pola seperti *higher-order components*. Definisi Flow dan TypeScript untuk React sudah mendukung React Hooks.

Penting untuk diingat, *custom Hooks* memberikan Anda kewenangan untuk memaksa API React jika Anda ingin menuliskannya dengan lebih ketat dalam beberapa hal. React memberikan Anda *primitives*, tapi Anda bisa menggabungkannya dengan cara-cara lain yang unik selain dari yang kami sediakan untuk Anda.

### Bagaimana cara menguji komponen-komponen yang menggunakan Hooks? {#how-to-test-components-that-use-hooks}

Dari sudut pandang React, sebuah komponen yang menggunakan *Hooks* hanyalah sekedar komponen biasa. Jika solusi *testing* Anda tidak bergantung pada fitur-fitur di dalam React, menguji komponen dengan *Hooks* tidak akan berbeda halnya dengan uji komponen yang normalnya Anda lakukan.

>Catatan
>
>[Testing Recipes](/docs/testing-recipes.html) memuat banyak contoh yang bisa Anda salin dan terapkan.

Sebagai contoh, umpamakan kita memiliki komponen penghitung (*counter*) berikut:

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Anda meng-klik sebanyak ${count} kali`;
  });
  return (
    <div>
      <p>Anda meng-klik sebanyak {count} kali</p>
      <button onClick={() => setCount(count + 1)}>
        Klik saya
      </button>
    </div>
  );
}
```

Kami akan mengujinya dengan React DOM. Pastikan bahwa perilakunya dengan yang terjadi di peramban, kami akan mengemas proses *rendering* kode dan memperbaruinya ke dalam [`ReactTestUtils.act()`](/docs/test-utils.html#act) beberapa pemanggilan:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('bisa me-render dan memperbarui sebuah counter', () => {
  // Uji render dan efek pertama
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Anda meng-klik 0 kali');
  expect(document.title).toBe('Anda meng-klik 0 kali');

  // Uji render dan efek kedua
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Anda meng-klik 1 kali');
  expect(document.title).toBe('Anda meng-klik 1 kali');
});
```

Pemanggilan `act()` juga akan menghilangkan efek di dalamnya.

Jika perlu menguji sebuah *custom Hook*, Anda bisa melakukannya dengan cara membuat sebuah komponen dalam pengujian Anda, dan gunakan Hook dari situ. Kemudian Anda bisa menguji komponen yang Anda tulis.

Untuk mengurangi terjadinya *boilerplate*, kami rekomendasikan menggunakan [React Testing Library](https://testing-library.com/react) yang mana didesain untuk mendorong menulis pengujian-pengujian yang menggunakan komponen Anda selayaknya yang dilakukan *end user*.

Untuk informasi lebih lanjut, cek [Testing Recipes](/docs/testing-recipes.html).

### Apa yang sebenarnya [aturan lint](https://www.npmjs.com/package/eslint-plugin-react-hooks) terapkan? {#what-exactly-do-the-lint-rules-enforce}

Kami menyediakan sebuah [*plugin* ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) yang menerapkan [aturan-aturan Hooks](/docs/hooks-rules.html) demi menghindari *bug*. *Plugin* tersebut mengasumsikan bahwa fungsi apapun yang diawali dengan "`use`" dan sebuah huruf kapital tepat setelahnya, adalah sebuah Hook. Kami menyadari pendekatan penemuan (heuristik) ini tidaklah sempurna dan bisa jadi masih ada beberapa *false positive*, akan tetapi tanpa sebuah perjanjian (konvensi) seluruh lingkup ekosistem tidak akan mungkin *Hooks* akan berjalan dengan baik -- dan nama-nama yang lebih panjang akan mengecilkan minat orang-orang baik untuk mengadopsi *Hooks* maupun mengikuti konvensinya.

Khususnya, aturan tersebut menekankan bahwa:

* Panggilan untuk *Hooks* bisa terdapat di dalam sebuah fungsi `PascalCase` (diasumsikan sebagai sebuah komponen) atau fungsi `useSomething` lainnya (diasumsikan sebagai sebuah *custom Hook*).
* *Hooks* dipanggil dalam urutan yang sama pada setiap *render*.

Terdapat beberapa heuristik lagi, dan hal tersebut bisa saja berubah sepanjang waktu selama kita memperbaiki terus aturan yang ada demi menyeimbangkan temuan *bug* dengan menghindari *false positive*.

## Dari Kelas ke *Hooks* {#from-classes-to-hooks}

### Bagaimana cara *lifecycle method* dapat sesuai dengan Hooks? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Komponen fungsi tidak memerlukan sebuah *constructor*. Anda bisa menginisiasikan *state* di dalam panggilan [`useState`](/docs/hooks-reference.html#usestate). Jika komputasi *state* awal itu *expensive*, Anda bisa mengoper sebuah fungsi ke `useState`.

* `getDerivedStateFromProps`: Jadwalkan sebuah pembaruan [ketika proses *render*](#how-do-i-implement-getderivedstatefromprops).

* `shouldComponentUpdate`: Lihat `React.memo` [di bawah ini](#how-do-i-implement-shouldcomponentupdate).

* `render`: Ini adalah komponen fungsi *body* itu sendiri.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: [`useEffect` *Hook*](/docs/hooks-reference.html#useeffect) dapat mengekspresikan semua kombinasi ini (termasuk kasus-kasus yang [kurang](#can-i-skip-an-effect-on-updates) [awam](#can-i-run-an-effect-only-on-updates)).

* `getSnapshotBeforeUpdate`, `componentDidCatch` dan `getDerivedStateFromError`: Tidak ada persamaan Hook untuk *method* ini sementara ini, tetapi akan segera ditambahkan.

### Bagaimana cara saya dapat memperoleh data dengan Hooks?{#how-can-i-do-data-fetching-with-hooks}

Berikut ini sebuah [demo kecil](https://codesandbox.io/s/jvvkoo8pq3) untuk permulaan Anda. Untuk mempelajari lebih lanjut, lihat [artikel ini](https://www.robinwieruch.de/react-hooks-fetch-data/) tentang memperoleh (*fetching*) data dengan menggunakan Hooks.

### Apakah ada hal seperti *instance variable*? {#is-there-something-like-instance-variables}

Ya! [`useRef()`](/docs/hooks-reference.html#useref) Hook tidak hanya untuk *ref* DOM. Objek *"ref"* adalah sebuah *container* umum yang mana memiliki properti `current` yang berubah-ubah serta dapat memegang nilai apapun, serupa dengan *instance property* pada sebuah kelas.

Anda dapat menuliskannya dari dalam 'useEffect':

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

Jika kita hanya ingin mengatur sebuah interval, kita tidak perlu *ref* ('id' bisa jadi lokal pada efek tersebut), tapi akan berguna jika kita ingin membersihkan interval dari sebuah *event handler*:

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

Secara konsep, Anda bisa pikirkan *ref* itu serupa dengan variabel *instance* dalam sebuah kelas. Kecuali, Anda menerapkan [lazy initialization](#how-to-create-expensive-objects-lazily), hindari pengaturan ref selama proses *render* -- hal ini akan mengakibatkan *behavior* yang tidak terduga. Sebagai gantinya, biasanya Anda ingin untuk memodifikasi *ref* dalam *event handler* dan efek.

### Apa saya harus menggunakan satu atau beberapa *state variable*? {#should-i-use-one-or-many-state-variables}

Jika Anda memulai dari kelas, Anda mungkin ingin tetap memanggil `useState()` satu kali dan menempatkan semua *state* ke dalam sebuah objek tunggal. Anda bisa melakukan hal demikian jika suka. Berikut ini sebuah contoh sebuah komponen yang mengikuti pergerakan tetikus. Kita menetapkan posisi dan ukurannya dalam *local state*:

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Sekarang umpamakan kita ingin menuliskan beberapa logika yang mana merubah `left` (sisi kiri) dan `top` (sisi atas) ketika pengguna menggerakan tetikusnya. Perhatikan bagaimana kita harus menggabungkan area-area ini ke dalam objek *state* sebelumnya secara manual:

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Menyebarkan "...state" memastikan kita tidak "kehilangan" lebar dan tinggi
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Catatan: implementasi ini agak sedikit disederhanakan
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

Ini karena ketika kita memperbarui sebuah *state variable*, kita merubah (*replace*) nilainya. Ini berbeda dari `this.setState` dalam sebuah kelas, yang mana menggabungkan (*merges*) area-area yang diperbarui ke dalam objek.

Jika Anda melihatkan penggabungan otomatis (*automatic merging*), Anda bisa menulis sebuah *custom Hook* `useLegacyState` yang menggabungkan pembaruan-pembaruan *state* objek.  Namun, sebagai gantinya **kami merekomendasikan untuk membagi *state* menjadi beberapa _state variable_ berdasarkan nilai mana yang cenderung berubah bersamaan.**

Sebagai contohnya, kita bisa membagi *state* komponen menjadi `position` dan `size` objek, serta selalu merubah `position` tanpa harus proses penggabungan:

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

Memisahkan *state variable* independen juga memiliki keuntungan lain. Hal tersebut membuatnya mudah untuk mengekstrak beberapa logika ke dalam sebuah *custom Hook* nantinya, sebagai contoh:

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

Perhatikan bagaimana kita dapat memindahkan panggilan `useState` untuk *state variable* `position` serta efek yang terhubung ke dalam sebuah *custom Hook* tanpa merubah kodenya. Jika semua *state* ada dalam sebuah objek, mengekstrak *state* tersebut akan jadi lebih sulit.

Baik memasang semua *state* ke dalam sebuah panggilan `useState`, serta memiliki sebuah panggilan `useState` pada setiap area, keduanya sama-sama berfungsi. Komponen-komponen cenderung paling mudah dibaca ketika Anda menemukan keseimbangan antara (penerapan) kedua cara tersebut, dan kelompok yang terhubung dengan *state* ke dalam beberapa *state variable* independen. Jika logika *state* tersebut menjadi kompleks, kami rekomendasikan [mengelolanya dengan sebuah *reducer*](/docs/hooks-reference.html#usereducer) atau sebuah *custom Hook*.

### Bisakah saya menjalakan sebuah efek hanya pada pembaruan? {#can-i-run-an-effect-only-on-updates}

Ini adalah kasus penggunaan yang langka. Jika butuh, Anda dapat [menggunakan sebuah *ref* yang *mutable*](#is-there-something-like-instance-variables) untuk menyimpan secara manual nilai *boolean* sesuai dengan apakah Anda berada pada *render* pertama atau selanjutnya, kemudian memeriksa penandanya (*flag*) pada efek yang Anda buat. (Jika sering melakukan hal ini, ada baiknya Anda membuat sebuah *custom Hook*.)

### Bagaimana cara untuk mendapatkan kembali *prop* atau *state* sebelumnya? {#how-to-get-the-previous-props-or-state}

Saat ini, Anda dapat melakukannya secara manual [dengan *ref*](#is-there-something-like-instance-variables):

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

Cara ini mungkin agak rumit tetapi Anda bisa mengekstraknya ke dalam sebuah *custom Hook*:

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

Perhatikan bagaimana *Hook* ini dapat bekerja pada *props, state,* atau nilai apapun yang diperhitungkan.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count + 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

Di masa yang akan datang, React mungkin akan menyediakan sebuah *Hook* `usePrevious` mengingat hal tersebut adalah kasus yang cukup sering digunakan.

Lihat juga [pola yang direkomendasikan untuk *derived state*](#how-do-i-implement-getderivedstatefromprops).

### Mengapa saya melihat *prop* atau *state* yang basi dalam fungsi yang saya buat?  {#why-am-i-seeing-stale-props-or-state-inside-my-function}

Fungsi apapun yang ada dalam sebuah komponen, termasuk *event handler* dan efek, "melihat" *prop* dan *state* dari dalam proses *render* mana fungsi tersebut diciptakan. Sebagai contohnya, pertimbangkan kode seperi berikut ini:

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('Anda meng-klik: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

Jika Anda meng-klik "Show alert" dan kemudian memberi penambahan (*increment*) pada *counter*, penandanya akan menunjukkan variabel `count` **pada saat Anda meng-klik tombol "Show alert"**. Ini mencegah *bug* yang disebabkan oleh kode yang mengasumsikan *prop* dan *state* tidak berubah.

Jika ingin membaca *state* *terkini* dari beberapa *asynchronous callback*, baiknya Anda menyimpannya dalam [sebuah *ref*](/docs/hooks-faq.html#is-there-something-like-instance-variables), mengubahnya, dan membaca dari situ.

Pada akhirnya, alasan lain Anda melihat *prop* atau *state* yang basi yakni jika Anda menggunakan optimasi "dependency array" tapi tidak secara benar dalam menspesifikasi semua *dependency*-nya. Sebagai contohnya, jika sebuah efek menspesifikasikan `[]` sebagai argumen kedua tetapi membaca `someProp` di dalamnya, efek tersebut akan tetap "melihat" nilai awal dari `someProp`. Solusinya yakni antara menghilangkan *dependency array*, atau memperbaikinya. Ini adalah cara [bagaimana Anda bisa memperlakukan fungsi](#is-it-safe-to-omit-functions-from-the-list-of-dependencies), dan ini adalah [strategi umum lainnya](#what-can-i-do-if-my-effect-dependencies-change-too-often) untuk menjalankan efek lebih jarang tanpa keliru melewatkan *dependency*.

>Catatan
>
>Kami menyediakan sebuah aturan *ESLint* [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) sebagai bagian dari *package*[`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Aturan ini akan memberi peringatan ketika *dependency* keliru dispesifikasikan dan akan memberikan saran perbaikan.

### Bagaimana cara mengimplementasikan `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

Ketika Anda mungkin [tidak memerlukannya](/blog/2018/06/07/you-probably-dont-need-derived-state.html), dalam kasus-kasus yang jarang Anda alami (seperti mengimplementasikan sebuah komponen `<Transition>`), Anda bisa memperbarui *state* tepat saat proses *render*. React akan menjalankan ulang komponen tersebut dengan *state* yang sudah diperbarui tepat setelah keluar dari *render* pertama sehingga tidak akan memakan banyak ruang (*expensive*).

Berikut ini, kita menyetorkan nilai sebelumnya dari *prop* `row` dalam sebuah *state variable* sehingga kita bisa bandingkan:

```js
function ScrollView({row}) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Baris berubah karena render terakhir. Memperbarui isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

Hal ini bisa jadi terlihat aneh pada awalnya, tetapi sebuah pembaruan selama proses *render* adalah hal yang persis secara konsep sejak `getDerivedStateFromProps` dibuat.

### Apakah ada fungsionalitas seperti *forceUpdate*? {#is-there-something-like-forceupdate}

Baik `useState` *Hook* maupun `useReducer` *Hook* [akan keluar dari pembaruan](/docs/hooks-reference.html#bailing-out-of-a-state-update) jika nilai selanjutnya sama dengan nilai sebelumnya. Mengubah *state* saat itu juga dan memanggil `setState` tidak akan mengakibatkan *render* ulang.

Normalnya, Anda tidak akan mengubah *local state* dalam React. Meski demikian, sebagai sebuah solusi darurat, Anda bisa menggunakan sebuah *incrementing counter* untuk memaksa terjadinya *render* ulang walaupun jika *state*-nya tidak berubah:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Coba hindari pola berikut ini sebisa mungkin.

### Bisakah saya membuat *ref* pada sebuah komponen fungsi? {#can-i-make-a-ref-to-a-function-component}

Saat Anda seharusnya tidak sering memerlukan hal ini, Anda bisa saja mengekspos beberapa metode perintah pada sebuah *parent component* dengan menggunakan [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle) *Hook*.

### Bagaimana cara mengukur sebuah simpul DOM? {#how-can-i-measure-a-dom-node}

Untuk mengukur posisi atau ukuran dari sebuah simpul DOM, Anda bisa gunakan [*callback ref*](/docs/refs-and-the-dom.html#callback-refs). React akan memanggil *callback* tersebut kapanpun *ref* terikat pada sebuah *node* yang berbeda. Berikut ini [demo kecil](https://codesandbox.io/s/l7m0v5x4v9):

```js{4-8,12}
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>Header di atas memiliki tinggi {Math.round(height)}px</h2>
    </>
  );
}
```

Kita tidak memilih `useRef` dalam contoh ini karena sebuah objek *ref* tidak memberitahukan kita tentang *perubahan* pada nilai *ref* yang sekarang. Menggunakan sebuah *callback ref* akan memastikan bahwa [walaupun jika sebuah *child component* menampilkan *node* yang diukur setelah ini](https://codesandbox.io/s/818zzk8m78) (sebagai contoh, dalam respon pada sebuah klik), kita masih akan dapat pemberitahuan tentang hal itu dalam *parent component* dan bisa memperbarui pengukurannya.

Perhatikan bahwa kita mengoper `[]` sebagai sebuah *dependency array* untuk `useCallback`. Ini memastikan bahwa *ref callback* tidak berubah di antara *render* ulang, serta agar React tidak akan memanggilnya tanpa sebab.

Dalam contoh ini, *callback ref* hanya akan dipanggil apabila komponen dipasang dan dilepas, karena komponen `<h1>` yang di-_render_ tetap berada di dalam dokumen dalam setiap proses _render_ ulang. Jika Anda ingin diberi tahu setiap sebuah komponen berubah ukuran, Anda mungkin ingin menggunakan [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) atau sebuah *Hook* *third-party* yang menggunakannya.

Jika mau, Anda bisa [mengekstrak logika ini](https://codesandbox.io/s/m5o42082xy) ke dalam sebuah Hook yang bisa digunakan ulang:

```js{2}
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>Header di atas memiliki tinggi {Math.round(rect.height)}px</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```


### Apa yang dimaksud dengan `const [thing, setThing] = useState()`? {#what-does-const-thing-setthing--usestate-mean}

Jika Anda asing dengan *syntax* ini, cek [penjelasannya](/docs/hooks-state.html#tip-what-do-square-brackets-mean) dalam dokumentasi *State Hook*.


## Optimasi Performa {#performance-optimizations}

### Bisakah saya melewatkan sebuah efek pada pembaruan? {#can-i-skip-an-effect-on-updates}

Ya. Lihat [pengaktifan efek secara kondisional](/docs/hooks-reference.html#conditionally-firing-an-effect). Perhatikan bahwa lupa menangani pembaruan seringkali [menimbulkan *bug*](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), yang mana  mengapa hal ini bukanlah *behavior* aslinya.

### Apakah aman untuk menghilangkan fungsi dari daftar *dependency*? {#is-it-safe-to-omit-functions-from-the-list-of-dependencies}

Umumnya tidak aman.

```js{3,8}
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 Ini tidaklah aman (memanggil `doSomething` yang menggunakan `someProp`)
}
```

Sulit untuk mengingat *prop* atau *state* yang digunakan oleh fungsi yang ada di luar efek. Inilah mengapa **biasanya Anda akan mendeklarasikan fungsi yang dibutuhkan dengan efek *di dalam*-nya.** Lalu kita bisa dengan mudah melihat nilai-nilai apa saja dari cakupan komponen yang jadi patokan efek tersebut:

```js{4,8}
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ OK (efek dari kita hanya menggunakan `someProp`)
}
```

Jika setelah itu kita masih tidak menggunakan nilai apapun dari cakupan komponen tersebut, sebaiknya spesifikasikan `[]` agar aman:

```js{7}
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ OK dalam contoh ini karena kita tidak menggunakan nilai apapun dari cakupan komponen tersebut
```

Tergantung pada kasus penggunaan Anda, terdapat beberapa pilihan lainnya sebagaimana yang dideskripsikan di bawah ini.

>Catatan
>
>Kami menyediakan aturan *ESLint* [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) sebagai bagian dari *package* [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Aturan ini akan membantu Anda menemukan komponen yang tidak konsisten menangani pembaruan.

Mari kita lihat mengapa hal ini penting.

<<<<<<< HEAD
Jika Anda menspesifikasikan sebuah [daftar *dependency*](/docs/hooks-reference.html#conditionally-firing-an-effect) sebagai sebuah argumen terakhir untuk `useEffect`, `useMemo`, `useCallback`, atau `useImperativeHandle`, haruslah termasuk semua nilai yang digunakan di dalamnya yang ikut andil dalam *data flow* React. Itu termasuk *props*, *state*, dan apapun yang berasal dari keduanya.
=======
If you specify a [list of dependencies](/docs/hooks-reference.html#conditionally-firing-an-effect) as the last argument to `useEffect`, `useLayoutEffect`, `useMemo`, `useCallback`, or `useImperativeHandle`, it must include all values that are used inside the callback and participate in the React data flow. That includes props, state, and anything derived from them.
>>>>>>> 25cc703d1f23f1782ff96c5c7882a806f8741ec4

Hal tersebut **hanya akan** aman untuk menghilangkan sebuah fungsi dari daftar *dependency* jika tidak terjadi apa-apa di dalamnya (atau fungsi lain yang terpanggil) yang merujuk pada *prop, state,* atau nilai yang berasal dari keduanya. Contoh berikut memiliki *bug*:

```js{5,12}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product/' + productId); // Menggunakan prop productId
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 Tidak valid karena `fetchProduct` menggunakan `productId`
  // ...
}
```

**Rekomendasi perbaikannya adalah dengan cara memindahkan fungsi itu _di dalam_ efek yang Anda buat**. Perbaikan tersebut akan memudahkan untuk melihat *prop* atau *state* mana yang efek Anda gunakan, serta memastikan semuanya terdeklarasikan:

```js{5-10,13}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Dengan memindahkan fungsi ini ke dalam efek, kita bisa dengan jelas melihat nilai-nilai yang digunakan.
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ Valid karena efeknya hanya menggunakan productId
  // ...
}
```

Ini juga membebaskan Anda untuk menangani respon-respon yang tidak pada tempatnya (*out-of-order*) dengan sebuah *local variable* dalam efek tersebut:

```js{2,6,10}
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }

    fetchProduct();
    return () => { ignore = true };
  }, [productId]);
```

Kita pindahkan fungsi dalam efek tersebut agar fungsi tersebut tidak perlu berada dalam daftar *dependency*-nya sendiri.

>Tips
>
>Cek [demo kecil ini](https://codesandbox.io/s/jvvkoo8pq3) dan [artikel ini](https://www.robinwieruch.de/react-hooks-fetch-data/) untuk mempelajari lebih lanjut tentang data fetching menggunakan Hooks.

**Jika untuk beberapa alasan Anda _tidak bisa_ memindahkan sebuah fungsi ke dalam sebuah efek, terdapat beberapa pilihan lainnya:**

* **Anda bisa mencoba menggeser fungsi tersebut keluar komponen**. Dalam kasus ini, fungsi dijamin tidak merujuk pada *prop* atau *state* apapun, dan juga tidak perlu berada dalam daftar *dependency*.
* Jika fungsi yang Anda panggil adalah murni sebuah komputasi dan aman untuk dipanggil saat proses *render*, Anda boleh **memanggilnya di luar efek tersebut sebagai gantinya,** dan membuat efek tersebut bergantung pada nilai balikan (*return*).
* Sebagai pilihan terakhir, Anda bisa**menambahkan sebuah fungsi ke _dependency_ efek tersebut namun _mengemas definisinya_** ke dalam [`useCallback`](/docs/hooks-reference.html#usecallback) *Hook*. Ini memastikan fungsi tersebut tidak berubah pada tiap *render* kecuali *dependency-nya sendiri* juga berubah:

```js{2-5}
function ProductPage({ productId }) {
  // ✅ Dikemas dengan useCallback untuk menghindari berubah tiap kali render
  const fetchProduct = useCallback(() => {
    // ... Melakukan sesuatu dengan productId ...
  }, [productId]); // ✅ Semua useCallback dependency terspesifikasikan

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct }) {
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ Semua useEffect dependency terspesifikasikan
  // ...
}
```

Perhatikan bahwa pada contoh di atas kita **perlu** untuk menjaga fungsi agar tetap dalam daftar dependency. Ini memastikan bahwa setiap perubahan dalam *prop* `productId`  dari `ProductPage` secara otomatis memicu pengumpulan ulang (*refetch*) dalam komponen `ProductDetails`.

### Apa yang bisa saya lakukan jika *dependency* efek berganti terlalu sering berubah? {#what-can-i-do-if-my-effect-dependencies-change-too-often}

Terkadang, efek Anda bisa jadi menggunakan *state* yang terlalu sering berubah. Anda mungkin berkeinginan untuk menghilangkan *state* itu dari daftar *dependency*, namun biasanya berujung pada *bug*:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // Efek ini bergantung pada `count` state
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` tidak dispesifikasikan sebagai sebuah dependency

  return <h1>{count}</h1>;
}
```

Kumpulan *dependency* yang kosong, `[]`, berarti bahwa efek tersebut hanya akan berjalan satu kali ketika komponen dimuat, dan tidak pada setiap kali *render* ulang. Masalahnya adalah di dalam `setInterval` callback*, nilai `count` tidaklah berubah, karena kita menciptakan sebuah pengakhiran dengan nilai `count` ditetapkan jadi `0` selayaknya ketika efek *callback* berjalan. Tiap detik, *callback* ini kemudian memanggil `setCount(0 + 1)`, jadi hitungan tersebut tidak pernah melebihi 1.

Menspesifikasikan `[count]` sebagai sebauh daftar *dependency* dapat memperbaiki *bug*, tetapi juga bisa menyebabkan interval tersetel ulang (*reset*) pada setiap perubahan. Secara efektif, tiap `setInterval` akan mendapat satu kali kesempatan untuk mengeksekusi sebelum dikosongkan (mirip dengan `setTimeout`). Hal itu mungkin saja tidak diinginkan. Untuk memperbaikinya, kita bisa gunakan [bentuk pembaruan fungsional pada `setState`](/docs/hooks-reference.html#functional-updates). Hal tersebut membiarkan kita menspesifikasikan *bagaimana* *state* perlu berubah tanpa merujuk pada *state* yang *sekarang*:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ Ini tidak bergantung pada variabel `count` di luar,
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ Efek kita tidak menggunakan *variabel* apapun dalam lingkup komponen

  return <h1>{count}</h1>;
}
```

(Identitas fungsi `setCount` dijamin akan lebih stabil serta aman untuk dihapus.)

Sekarang, `setInterval` callback* mengeksekusi satu kali tiap detik, namun tiap yang ada di dalamnya memanggil `setCount` bisa menggunakan nilai yang terbaru untuk `count` (disebut `c` dalam *callback* disini.)

Dalam kasus-kasus yang lebih kompleks lagi (seperti halnya jika satu *state* bergantung pada *state*), cobalah untuk memindahkan logika pembaruan *state* keluar efek tersebut menggunakan [`useReducer` Hook*](/docs/hooks-reference.html#usereducer). [Artikel ini](https://adamrackis.dev/state-and-use-reducer/) menawarkan sebuah contoh bagaimana Anda daoat melakukan hal berikut ini. **Indentitas fungsi _`dispatch`_ dari _`useReducer`_ itu selalu stabil** — meskipun jika fungsi pengurangan (*reducer*) dideklarasikan dalam komponen serta membaca *prop*-nya.

Sebagai pilihan terakhir, jika Anda ingin sesuatu seperti `this` dalam sebuah kelas, Anda bisa [gunakan *ref*](/docs/hooks-faq.html#is-there-something-like-instance-variables) untuk menahan sebuah variabel yang berubah-ubah. Kemudian Anda bisa menulis dan membacanya. Contohnya:

```js{2-6,10-11,16}
function Example(props) {
  // Jaga prop terkini dalam sebuah ref.
  const latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // Membaca prop terkini kapanpun
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // Efek ini tidak pernah berjalan ulang
}
```

Lakukan ini jika hanya saat Anda tidak bisa menemukan alternatif yang lebih baik, sebagaimana mengandalkan pada perubahan (*mutation*) membuat komponen jadi kurang dapat diprediksi. Jika ada sebuah pola spesifik yang tidak menerjemahkan dengan baik, [layangkan *issue*](https://github.com/facebook/react/issues/new) dengan sebuah contoh kode yang dapat dijalankan dan kami akan coba bantu.

### Bagaimana cara mengimplementasikan `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

Anda dapat mengemas sebuah komponen fungsi dengan `React.memo` untuk membandingkan secara tak mendalam *prop*-nya:

```js
const Button = React.memo((props) => {
  // komponen Anda
});
```

Bukanlah sebuah *Hook* karena hal tersebut tidak melakukan penyusunan seperti yang *Hooks* lakukan. `React.memo` adalah persamaan untuk `PureComponent`, tapi hanya untuk membandingkan *prop*. (Anda juga bisa menambahkan argumen kedua untuk menspesifikasikan sebuah fungsi perbandingan yang menerima *prop* lama dan *prop* baru. Jika *return* dari fungsi tersebut adalah *true*, maka pembaruan akan dilewat.)

`React.memo` tidak membandingkan *state* karena tidak ada satu pun objek *state* untuk dibandingkan. Tapi Anda dapat membuat *children* (turunan) murni pula, atau bahkan [mengoptimasi masing-masing *children* dengan menggunakan `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

### Bagaimana cara *memoize* perhitungan? {#how-to-memoize-calculations}

*Hook* [`useMemo`](/docs/hooks-reference.html#usememo) memungkinkan Anda untuk menyimpan (*cache*) perhitungan-perhitungan di antara berbagai *render* dengan cara *"mengingat"* komputasi sebelumnya:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Kode ini memanggil `computeExpensiveValue(a, b)`. Tapi jika *dependency* `[a, b]` tidak berubah semenjak nilai sebelumnya, `useMemo` tidak akan memanggil untuk kedua kalinya dan menggunakan kembali nilai terakhir yang di-*return*.

Ingat bahwa fungsi tersebut dioper ke `useMemo` berjalan selama proses *render*. Jangan lakukan hal apapun yang tidak se-normalnya Anda lakukan ketika proses *render*. Sebagai contoh, efek samping (*side effect*) sudah seharusnya berada dalam `useEffect`, bukan `useMemo`.

**Anda bisa jadi mengandalkan _`useMemo`_ sebagai salah satu optimasi performa, bukan sebagai jaminan _semantic_.** Di masa yang akan datang, React bisa saja memilih untuk *"forget"* beberapa nilai-nilai hasil *memoize* sebelumnya dan menghitung ulang pada *render* selanjutnya, contohnya untuk mengosongkan memori dari komponen-komponen *offscreen*. Tulis kode Anda agar kode tersebut dapat terus berjalan tanpa `useMemo` — dan menambahkannya ke performa yang teroptimasi. (Untuk kasus yang langka ketika sebuah nilai harus *tidak pernah* dikomputasi ulang, Anda bisa [menginisiasi secara *lazy* *(initialize lazily)*](#how-to-create-expensive-objects-lazily) sebuah *ref*.)

Dengan mudah, `useMemo` juga memperbolehkan Anda untuk melewatkan sebuah *render* ulang yang *expensive* pada sebuah turunan (*child*):

```js
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Perhatikan bahwa pendekatan ini tidak akan berhasil dalam sebuah pengulangan (*loop*) karena panggilan *Hook* [tidak bisa](/docs/hooks-rules.html) digantikan di dalam *loop*. Tapi Anda bisa mengekstrak komponen yang terpisah untuk daftar *item*, dan memanggil `useMemo` di sana.

### Bagaimana cara membuat objek *expensive* secara *lazy*? {#how-to-create-expensive-objects-lazily}

`useMemo` mengizinkan Anda untuk [me-*memoize* sebuah perhitungan yang *expensive*](#how-to-memoize-calculations) jika *dependency*-nya sama. Bagimanapun, itu hanya berfungsi sebagai sebuah penanda, dan tidak *menjamin* komputasi tersebut tidak akan diulang. Tapi terkadang Anda harus memastikan sebuah objek hanya diciptakan sekali.

**Kasus penggunaan pertama yang umum yakni ketika menciptakan sebuah _initial state_ itu _expensive_:**

```js
function Table(props) {
  // ⚠️ createRows() dipanggil setiap render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

Untuk menghindari pembuatan ulang *initial state* yang dibiarkan, kita bisa mengoper sebuah **function** ke `useState`:

```js
function Table(props) {
  // ✅ createRows() hanya dipanggil satu kali
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React hanya akan memanggil fungsi ini selama *render* pertama. Lihat [referensi `useState` API*](/docs/hooks-reference.html#usestate).

**Anda adakalanya juga ingin menghindari pembuatan ulang nilai awal `useRef()`.** Contohnya, mungkin Anda ingin memastikan beberapa contoh kelas penting hanya bisa dibuat satu kali:

```js
function Image(props) {
  // ⚠️ IntersectionObserver dibuat di tiap render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **tidak** menerima fungsi khusus yang berlebih seperti `useState`. Sebagai gantinya, Anda bisa menuliskan fungsi sendiri yang membuat dan mengaturnya secara *lazy*:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver dibuat satu kali secara lazy
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // Ketika Anda butuh, panggil getObserver()
  // ...
}
```

Ini menghindari pembuatan objek yang *expensive* hingga objek tersebut benar-benar dibutuhkan untuk pertama kalinya. Jika Anda menggunakan *Flow* atau *TypeScript*, Anda juga bisa memberikan `getObserver()` sebuah nilai yang tidak bisa dikosongkan (*non-nullable*) demi kenyamanan.


### Apakah *Hooks* lamban karena membuat fungsi di saat *render*? {#are-hooks-slow-because-of-creating-functions-in-render}

Tidak. Dalam peramban-peramban modern, performa kasar penutupan (*closure*) dibandingkan dengan kelas tidaklah berbeda secara signifikan kecuali dalam skenario-skenario ekstrim.

Sebagai tambahan, pertimbangkan bahwa desain *Hooks* itu lebih efisien dalam beberapa hal:

* *Hooks* menghindari banyak awalan yang kelas butuhkan, seperti ongkos untuk membuat contoh kelas dan mengikat *event handler* di dalam konstruktor.

* **Kode idiomatis yang menggunakan _Hooks_ tidak memerlukan _nesting_ pohon komponen mendalam** yang lazim dalam basis kode yang mana menggunakan *higher-order component*, *render props*, dan *context*. Dengan pohon komponen yang lebih kecil, React jadi punya lebih sedikit tugas untuk dikerjakan.

Secara tradisional, performa menyangkut seputar fugsi-fungsi *inline* React sudah dihubungkan dengan bagaimana cara untuk mengoper *callback* baru setiap *render* yang memotong optimasi `shouldComponentUpdate` dalam komponen turunan. *Hooks* mendekati masalah dari tiga sisi.

* *Hook* [`useCallback`](/docs/hooks-reference.html#usecallback) mengizinkan Anda untuk tetap menggunakan rujukan *callback* yang sama di antara *render* ulang sehingga `shouldComponentUpdate` akan terus bekerja:

    ```js{2}
    // Tidak akan berubah kecuali `a` atau `b` berubah
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* *Hook* [`useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) membuat jadi lebih mudah untuk mengontrol ketika ada satu-satu pembaruan turunan (*children*), mengurangi kebutuhan untuk komponen murni.

* Pada akhirnya, *Hook* [`useReducer`](/docs/hooks-reference.html#usereducer) mengurangi kebutuhan untuk mengoper *callback* secara mendalam, seperti yang dijelaskan di bawah ini.

### Bagaimana cara menghindari pengoperan *callback* ke bawah? {#how-to-avoid-passing-callbacks-down}

Kami menemukan bahwa kebanyakan orang tidak menikmati pengoperan *callback* secara manual di sepanjang tiap tingkatan sebuah diagram komponen. Walaupun hal tersebut lebih gamblang, pengoperan *callback* secara manual bisa terasa seperti pekerjaan yang menguras tenaga.

Dalam diagram komponen yang luas, sebuah alternatif yang kami rekomendasikan adalah untuk mengoper sebuah fungsi `dispatch` dari [`useReducer`](/docs/hooks-reference.html#usereducer) melalui *context*:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Catatan: `dispatch` tidak akan berubah di antara render ulang
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Turunan apapun dalam diagram yang ada di dalam `TodosApp` bisa menggunakan fungsi `dispatch` untuk mengoper tindakan kepada `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // Jika kita ingin melakukan sebuah tindakan, kita bisa mendapatkan dispatch dari context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

Hal ini lebih memudahkan dari sudut pandang pemeliharaan (tidak perlu untuk terus meneruskan *callback*), dan juga menghindari masalah-masalah *callback*. Mengoper `dispatch` seperti ini merupakan rekomendasi pola untuk pembaruan-pembaruan mendalam.

Perlu diingat bahawa Anda masih bisa memilih antara mengoper *state* aplikasi sebagai *prop* (lebih gamblang) atau sebagai *context* (lebih memudahkan untuk pembaruan yang sangat mendalam). Jika Anda menggunakan *context* untuk mengoper *state* juga, gunakan dua jenis *context* berbeda -- `dispatch` context* tidak pernah berubah, jadi komponen yang membacanya tidak perlu melakukan *render* ulang kecuali juga membutuhkan *state* aplikasi.

### Bagimana cara membaca sebuah nilai yang sering berubah dari `useCallback`? {#how-to-read-an-often-changing-value-from-usecallback}

>Catatan
>
>Kami rekomendasikan untuk [mengoper `dispatch` dalam *context*](#how-to-avoid-passing-callbacks-down) daripada *callback* dalam *prop* satu-persatu. Pendekatan di bawah hanya disebutkan di sini sebagai pelengkap dan juga cara darurat.
>
>Perhatikan juga bahwa pola ini bisa menyebabkan masalah dalam [mode *concurrent*](/blog/2018/03/27/update-on-async-rendering.html). Kami berencana untuk menyediakan alternatif yang lebih ergonomis di masa yang akan datang, tapi solusi teraman sekarang adalah untuk selalu meng-invalidasi callback jika beberapa nilai bergantung pada perubahan.

Dalam beberapa kasus langka Anda mungkin butuh untuk *memoize* sebuah *callback* dengan menggunakan [`useCallback`](/docs/hooks-reference.html#usecallback) tetapi proses *memoize* tidak berjalan dengan baik karena fungsi dalam harus dibuat ulang terlalu sering. Jika fungsi yang Anda *memoize* adalah sebuah *event handler* dan tidak digunakan selama proses *render*, Anda bisa gunakan [*ref* sebagai sebuah *instance variable*](#is-there-something-like-instance-variables), dan menyimpan nilai yang terakhir di-*commit* ke dalam *ref* tersebut secara manual:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // Tuliskan ke ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Membaca dari ref
    alert(currentText);
  }, [textRef]); // Tidak membuat ulang handleSubmit seperti [text] 

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

Ini bisa saja pola yang berbelit namun menunjukkan pada Anda bahwa Anda bisa melakukan optimasi darurat ini jika membutuhkannya. Bahkan lebih bisa ditangani jika Anda mengekstraknya ke dalam sebuah *custom Hook*:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Akan di-memoize bahkan jika `text` berubah:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Tidak bisa memanggil event handler ketika proses render.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

Dalam kasus-kasus tersebut, kami **tidak merekomendasikan pola ini** dan hanya untuk menunjukannya sebagai pelengkap di sini. Sebagai gantinya, akan lebih baik untuk [meghindari pengoperan *callback* lebih mendalam](#how-to-avoid-passing-callbacks-down).


## *Under the Hood* {#under-the-hood}

### Bagaimana React menghubungkan panggilan *Hook* dengan komponen? {#how-does-react-associate-hook-calls-with-components}

React merekam jejak komponen yang baru saja mulai di-*render*. Berkat [aturan *Hooks*](/docs/hooks-rules.html), kita tahu bahwa *Hooks* hanya dipanggil dari komponen React (atau *custom Hooks* -- yang mana juga dipanggil dari komponen React).

Terdapat daftar internal dari *"memory cells"* yang berhubungkan dengan tiap komponen. Itu semua hanyalah objek-objek JavaScript dimana kita bisa menaruh data. Ketika Anda memanggil sebuah *Hook* seperti `useState()`, ia membaca *cell* terkini (atau menginisialisasikannya selama *render* pertama), dan memindahkan *pointer* ke *cell* selanjutnya. Inilah bagaimana masing-masing panggilan `useState()` mendapat *local state* sendiri-sendiri.

### Adakah hasil kerja sebelumnya yang menginspirasi *Hooks*? {#what-is-the-prior-art-for-hooks}

*Hooks* mempersatukan ide-ide dari beberapa sumber berbeda:

* Eksperimen lama kami dengan API fungsional dalam repositori [`react-future`](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State).
* Eksperimen-eksperimen komunitas React dengan me-*render* API *props*, termasuk [Reactions Component](https://github.com/reactions/component) dari [Ryan Florence](https://github.com/ryanflorence).
* Pengajuan [kata kunci `adopt`](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) dari [Dominic Gannaway](https://github.com/trueadm) sebagai *sugar syntax* untuk me-*render* *prop*.
* *State variable* dan *state cell* dalam [DisplayScript](http://displayscript.org/introduction.html).
* [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) dalam ReasonReact.
* [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) dalam Rx.
* [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) dalam *Multicore* OCaml.

[Sebastian Markbåge](https://github.com/sebmarkbage) membuat desain awal dari *Hooks*, yang kemudian disempurnakan oleh [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), serta anggota-anggota lain tim React.
