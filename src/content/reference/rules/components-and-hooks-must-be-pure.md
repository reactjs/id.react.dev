---
title: Komponen dan Hooks harus murni
---

<Intro>
Fungsi murni hanya melakukan kalkulasi saja. Hal ini membuat kode anda lebih mudah untuk dipahami, di-*debug*, dan memungkinkan React untuk melakukan optimisasi pada komponen-komponen dan *Hooks* anda secara otomatis dan benar.
</Intro>

<Note>
Halaman referensi ini mencakup topik-topik tingkat lanjut dan memerlukan pemahaman terkait dengan konsep-konsep yang telah tercakup pada halaman [Menjaga Kemurnian Komponen
](/learn/keeping-components-pure).
</Note>

<InlineToc />

### Mengapa kemurnian itu penting? {/*why-does-purity-matter*/}

Salah satu konsep utama dari React adalah kemurnian. Sebuah komponen atau *hook* disebut murni jika: 
* **Idempotent** - Anda [selalu mendapatkan hasil yang sama setiap saat](/learn/keeping-components-pure#purity-components-as-formulas) anda menjalankannya dengan masukkan, *props*, *state*, *context* sebagai masukkan komponen;
* **Tidak mempunyai efek samping saat *render*** - Kode yang memiliki efek samping seharusnya menjalankannya [**secara terpisah dari proses me-*render***](#how-does-react-run-your-code). Contohnya adalah sebagai [*event handler*](/learn/responding-to-events) - dimana pengguna berinteraksi dengan UI dan mengakibatkan adanya perubahan; atau sebagai sebuah [Efek](/reference/react/useEffect) - yang dijalankan setelah *render*.

Saat *render* disimpan murni, React akan memamahi bagaimana caranya untuk memprioritasi proses perubahan mana yang paling penting untuk dilihat oleh pengguna. Hal ini mungkin terjadi karena kemurnian dari *render*: karena komponen-komponen tidak perlu mempunyai efek samping [saat *render*](#how-does-react-run-your-code), React akan menghentikan proses *render* komponen-komponen yang tidak terlalu penting untuk dilakukan perubahan, dan hanya akan kembali ke komponen tersebut saat diperlukan.

Secara konkrit, hal ini berarti logika me-*render* akan dijalankan berkali-kali dengan cara yang memungkinan React untuk memberikan pengalaman pengguna (UX) yang menyenangkan kepada pengguannya. Akan tetapi, jika komponen anda memiliki efek samping yang tidak terlacak - seperti mengubah sebuah nilai dari variabel global saat [proses *render*](#how-does-react-run-your-code) - saat React menjalankan kode proses *render* anda lagi, efek sampingnya akan dipicu dengan cara yang tidak sesuai dengan yang anda inginkan. Hal ini seringkali menyebabkan bug yang tidak terduga yang dapat menurunkan pengalaman pengguna dalam menggunakan aplikasi anda. Anda dapat melihat [contoh dari ini di halaman Menjaga Kemurnian Komponen](/learn/keeping-components-pure#side-effects-unintended-consequences)

#### Bagaimana React menjalankan kode anda? {/*how-does-react-run-your-code*/}

React bersifat deklaratif: anda memberi tahu *apa* kepata React untuk di-*render*, dan React akan mencari tahu *bagaimana* cara terbaik untuk menampilkannya kepada pengguna anda. Untuk melakukan ini, React memiliki beberapa fase untuk menjalankan kode anda. Anda tidak perlu untuk mengetahu tentang semua fase yang digunakan React dengan baik. Akan tetapi pada level yang lebih tinggi, anda harus paham tentang kode apa yang dijalankan saat *render*, dan apa yang berjalan diluar itu.  

pe-*renderan* mengacu pada perhitungan seperti apa tampilan UI anda nantinya. Setelah me-*render*, [*Effect*](/reference/react/useEffect) di *flush* (artinya mereka akan dijalankan hingga tidak ada lagi yang tersisa) dan dapat memperbarui kalkulasi jika *Effect* berdampak pada *layout*. React akan mengambil kalkulasi ini dan membandingkannya dengan kalkulasi yang digunakannya pada versi sebelumnya dari UI anda, lalu *commits* hanya perubahan minim yang diperlukan ke [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (apa yang sebenarnya pengguna lihat) untuk menyesuaikan dengan versi terbaru.

<DeepDive>

#### Bagaimana cara mengetahui jika kode anda berjalan di *render* {/*how-to-tell-if-code-runs-in-render*/}

Salah satu heuristik cepat untuk mengetahui apakah kode berjalan selama *render* adalah dengan memeriksa di mana kode tersebut berada: jika ditulis di tingkat atas seperti pada contoh di bawah ini, kemungkinan besar kode tersebut berjalan selama *render*.

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // dibentuk saat render
  // ...
}
```

Event handlers and Effects don't run in render:

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // kode ini ada di dalam event handler, jadi hanya dijalankan ketika pengguna memicu ini
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // kode ini berada didalam sebuah Effect, sehingga hanya akan jalan saat setelah proses render
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## Komponen-komponen dan *Hooks* harus idempoten {/*components-and-hooks-must-be-idempotent*/}

Komponen-komponen harus selalu mengembalikan keluaran yang sama berdasarkan masukan - *props*, *state*, dan *context*. Hal ini dikenal sebagai *idempoten*. [Idempoten](https://id.wikipedia.org/wiki/Idempoten) adalah istilah yang dipopulerkan pada pemrograman fungsional. Istilah ini mengacu pada gagasan bahwa anda [selalu mendapatkan hasil yang sama setiap kali](learn/keeping-components-pure) anda menjalankan kode dengan masukan yang sama. 

Hal ini berarti *semua* kode yang dijalankan [saat *render*](#how-does-react-run-your-code) juga akan bersifat idempoten agar aturan ini dapat diterapkan. Sebagai contoh, barisa kode ini tidak idempoten (dan oleh karena itu, komponennya juga tidak): 

```js {2}
function Clock() {
  const time = new Date(); // 🔴 Buruk: selalu mengembalikan nilai yang berbeda!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` tidak idemponten karena selalu mengeluarkan tanggal saat ini dan hasilnya selalu berubah setiap kali dipanggil. Saat anda *render* komponen di atas, waktu yang ditampilkan pada layar akan tetap pada waktu dimana komponen tersebut di-*render*. Sama halnya dengan `Math.random()` yang juga tidak idempoten, karena selalu mengeluarkan nilai yang berbeda setiap kali dipanggil, walaupun masukan yang diberikan sama.

Hal ini bukan berarti anda tidak seharusnya menggunakan fungsi idemponen seperti `new Date()` *sama sekali* - anda hanya perlu untuk menghindarinya [saat *render*](#how-does-react-run-your-code), Dalam kasus ini, kita bisa *menyinkronkan* tanggal terbaru ke komponen ini dengan [*Effect*](/reference/react/useEffect):

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Melacak status tanggal saat ini. `useState` menerima fungsi inisialisasi sebagai
  //    state awal. Fungsi ini hanya berjalan sekali ketika hook dipanggil, jadi hanya tanggal saat ini pada
  //    saat hook dipanggil yang di-set terlebih dahulu.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Perbarui tanggal saat ini setiap detik menggunakan `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Baik: kode non-idempoten tidak lagi berjalan dalam render
    }, 1000);
    // 3. Kembalikan fungsi pembersihan agar kita tidak membocorkan timer `setInterval`.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

Dengan membungkus pemanggilan `new Date()` yang tidak idempoten di dalam sebuah *Effect*, ini akan memindahkan kalkulasi tersebut [di luar pe-*render*-an](#how-does-react-run-your-code).

Jika Anda tidak perlu menyinkronkan beberapa *state* eksternal dengan React, Anda juga bisa mempertimbangkan untuk menggunakan [event handler](/learn/responing-to-events) jika *state* tersebut hanya perlu diperbarui sebagai respons terhadap interaksi pengguna.

---

## Efek samping seharusnya berjalan diluar *render* {/*side-effects-must-run-outside-of-render*/}

[Efek samping](/learn/keeping-components-pure#side-effects-unintended-consequences) tidak seharusnya jalan [pada *render*](#how-does-react-run-your-code), karena React dapat *render* komponen-komponen beberapa kali untuk menghasilkan pengalaman pengguna sebaik mungkin.

<Note>
Efek samping adalah istilah yang lebih luas dari *Effect*. *Effect* secara khusus merujuk pada kode yang dibungkus dengan `useEffect`, sedangkan efek samping adalah istilah umum untuk kode yang memiliki efek yang dapat diamati selain dari hasil utamanya yaitu mengembalikan sebuah nilai kepada pemanggil.

Efek samping biasanya ditulis di dalam [*event handler*](/learn/responing-to-events) atau *Effect*. Tetapi tidak pernah selama *render*.
</Note>

Meskipun render harus dijaga agar tetap murni, efek samping diperlukan di beberapa titik agar aplikasi Anda dapat melakukan sesuatu yang menarik, seperti menampilkan sesuatu di layar! Poin penting dari aturan ini adalah efek samping tidak boleh dijalankan [pada saat *render*](#how-does-react-run-your-code), karena React dapat me-*render* komponen beberapa kali. Pada kebanyakan kasus, Anda akan menggunakan [*event handler*](learn/responing-to-events) untuk menangani efek samping. Menggunakan *event handler* secara eksplisit memberi tahu React bahwa kode ini tidak perlu dijalankan saat *render*, sehingga *render* tetap murni. Jika Anda sudah kehabisan semua opsi - dan hanya sebagai pilihan terakhir - Anda juga bisa menangani efek samping menggunakan `useEffect`.

### Kapan waktu yang tepat untuk melakukan mutasi? {/*mutation*/}

#### Mutasi local {/*local-mutation*/}
Satu contoh umu dari efek samping adalah mutasi, yang mana di JavaScript mengacu pada perubahan nilai dari nilai non-[primitif](https://developer.mozilla.org/en-US/docs/Glossary/Primitive). Secara umum, meskipun mutasi tidak bersifat idiomatis di React, mutasi *lokal* tidak apa-apa:

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ Baik: dibentuk secara lokal
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ Baik: mutasi lokal tidak apa-apa
  }
  return <section>{items}</section>;
}
```

Tidak perlu mengubah kode Anda untuk menghindari mutasi lokal. [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) uga dapat digunakan di sini untuk mempersingkat waktu, tetapi tidak ada salahnya membuat mutasi lokal dan kemudian memasukkan item ke dalamnya [saat *render*](#how-does-react-run-your-code).

Meskipun terlihat seperti kita melakukan mutasi pada `items`, poin penting yang perlu diperhatikan adalah kode ini hanya melakukannya secara *lokal* - mutasi tidak "diingat" ketika komponen di-*render* lagi. Dengan kata lain, `items` hanya akan tetap ada selama komponen tersebut masih ada. Karena `items` selalu dibuat ulang setiap kali `<FriendList />` di-*render*, komponen akan selalu mengembalikan hasil yang sama.

Di sisi lain, jika `items` dibuat diluar komponen, maka komponen tersebut akan menyimpan nilai sebelumnya dan mengingat perubahan;

```js {1,7}
const items = []; // 🔴 Buruk: dibuat di luar komponen
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 Buruk: mengubah nilai yang dibuat di luar render
  }
  return <section>{items}</section>;
}
```

Ketika `<FriendList />` dijalankan lagi, kita akan terus menambahkan `friends` ke `items` setiap kali komponen tersebut dijalankan, yang mengarah ke beberapa hasil yang terduplikasi. Versi `<FriendList />` ini memiliki efek samping yang dapat diamati [selama *render*](#how-does-react-run-your-code) dan **melanggar aturan**.

#### *Lazy initialization* {/*lazy-initialization*/}

*Lazy initialization* juga tidak masalah walaupun tidak sepenuhnya "murni":

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Baik: jika tidak memengaruhi komponen lain
  // Melanjutkan me-render...
}
```

#### Mengubah DOM {/*changing-the-dom*/}

Efek samping yang secara langsung terlihat oleh pengguna tidak diperbolehkan dalam logika render komponen React. Dengan kata lain, hanya dengan memanggil fungsi komponen seharusnya tidak dengan sendirinya menghasilkan perubahan pada layar.

```js {2}
function ProductDetailPage({ product }) {
<<<<<<< HEAD
  document.window.title = product.title; // 🔴 Buruk: Mengubah DOM
}
```

Salah satu cara untuk mencapai hasil yang diinginkan dengan memperbarui `window.title` di luar *render* adalah dengan [menyinkronkan komponen dengan `window`](/learn/synchronizing-with-effects).
=======
  document.title = product.title; // 🔴 Bad: Changes the DOM
}
```

One way to achieve the desired result of updating `document.title` outside of render is to [synchronize the component with `document`](/learn/synchronizing-with-effects).
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc

Selama pemanggilan sebuah komponen beberapa kali aman dan tidak mempengaruhi proses *render* komponen lainnya, React tidak peduli apakah komponen tersebut 100% murni dalam arti pemrograman fungsional yang ketat. Yang lebih penting adalah [komponen harus idempoten](/reference/rules/components-and-hooks-must-be-pure).

---

## *Props* dan *state* adalah tidak dapat dimutasi {/*props-and-state-are-immutable*/}

Sebuah *props* dan *state* dari komponen adalah [*snapshots*](learn/state-as-a-snapshot) yang tidak dapat dimutasi. Jangan pernah memutasinya secara langsung. Sebagai gantinya, oper *props* baru kebawah, dan gunakan fungsi *setter* dari `useState`. 

Anda dapat menganggap *props* dan nilai *state* sebagai *snapshot* yang diperbarui setelah di-*render*. Karena alasan ini, Anda tidak memodifikasi *props* atau variabel state secara langsung: sebagai gantinya, Anda mengoper *props* baru, atau menggunakan fungsi *setter* yang disediakan untuk memberi tahu React bahwa *state* perlu diperbarui pada saat komponen di-*render*.

### Jangan memutasi *Props* {/*props*/}
*Props* dapat dimutasi karena karena jika anda memutasinya, maka Props tidak dapat diubah karena jika Anda mengubahnya, aplikasi akan menghasilkan output yang tidak konsisten, yang bisa jadi sulit untuk di-*debug* karena mungkin bekerja atau tidak bekerja tergantung pada situasinya.

```js {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Buruk: jangan pernah mengubah props secara langsung
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Baik: buatlah salinan sebagai gantinya
  return <Link url={url}>{item.title}</Link>;
}
```

### Jangan memutasi *State* {/*state*/}
`useState` mengembalikan variabel *state* dan sebuah *setter* untuk mengubah *state* tersebut.

```js
const [stateVariable, setter] = useState(0);
```

Daripada memperbarui variabel *state* di tempat, kita perlu memperbaruinya menggunakan fungsi *setter* yang dikembalikan oleh `useState`. Mengubah nilai pada variabel *state* tidak menyebabkan komponen diperbarui, sehingga pengguna akan mendapatkan UI yang usang. Menggunakan fungsi *setter* memberi tahu React bahwa *state* telah berubah, dan kita perlu mengantri untuk melakukan *render* ulang untuk memperbarui UI.

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 Buruk: jangan pernah memutasi state secara langsung
  }

  return (
    <button onClick={handleClick}>
      Anda telah menekan {count} kali
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Baik: gunakan fungsi setter yang dikeluarkan oleh useState
  }

  return (
    <button onClick={handleClick}>
      Anda telah menekan {count} kali
    </button>
  );
}
```

---

## Kembaliakan nilai dan argumen ke *Hooks* yang tidak dapat dimutasi {/*return-values-and-arguments-to-hooks-are-immutable*/}

Sesaat sebuah nilai dioper ke sebuah *hook*, anda tidak boleh memodifikasinya. Seperti *props* di JSX, nilai akan berubah menjadi tidak dapat dimutasi saat dioper ke sebuah *hook* 

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 Buruk: jangan memutasi argumen hook secara langsung
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ Baik: buatlah salinan sebagai gantinya
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

Salah satu prinsip penting dalam React adalah *local reasoning*: kemampuan untuk memahami apa yang dilakukan oleh sebuah komponen atau *hook* dengan melihat kodenya secara terpisah. *Hooks* harus diperlakukan seperti "kotak hitam" ketika dipanggil. Sebagai contoh, sebuah hook kustom mungkin menggunakan argumennya sebagai dependensi untuk memoisasi nilai di dalamnya:

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

Jika Anda mengubah argumen *Hooks*, memoisasi *hook* kustom akan menjadi salah, jadi penting untuk menghindari hal tersebut.

```js {4}
style = useIconStyle(icon);         // `style` dimemoisasi berdasarkan `icon`
icon.enabled = false;               // Buruk: 🔴 jangan pernah memutasi argumen hook secara langsung
style = useIconStyle(icon);         // sebelumnya mememoisasi hasil yang dikeluarkan
```

```js {4}
style = useIconStyle(icon);         // `style` dimemoisasi berdasarkan `icon`
icon = { ...icon, enabled: false }; // Good: ✅ buatlah salinan sebagai gantinya
style = useIconStyle(icon);         // nilai baru dari `style` yang dikalkulasi
```

Demikian pula, penting untuk tidak memodifikasi nilai yang dikembalikan dari *Hooks*, karena nilai tersebut mungkin sudah dimemoisasi.

---

## Nilai tidak dapat diubah setelah diteruskan ke JSX {/*values-are-immutable-after-being-passed-to-jsx*/}

Jangan melakukan mutasi nilai setelah nilai tersebut digunakan dalam JSX. Pindahkan mutasi sebelum JSX dibuat.

Ketika Anda menggunakan JSX dalam sebuah ekspresi, React mungkin akan mengevaluasi JSX sebelum komponen selesai di-*render*. Ini berarti bahwa mengubah nilai setelah nilai tersebut dioper ke JSX dapat menyebabkan UI yang sudah usang, karena React tidak akan tahu untuk memperbarui keluaran komponen.

```js {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 Buruk: styles telah digunakan sebelumnya di JSX di atas
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ Baik: kita menggunakan nilai yang baru
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```
