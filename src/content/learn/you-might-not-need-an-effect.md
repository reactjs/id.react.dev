---
title: 'Anda Mungkin Tidak Membutuhkan Effect'
---

<Intro>

*Effects* adalah jalan keluar dari paradigma React. Mereka memungkinkan Anda untuk "keluar" dari React dan menyinkronkan komponen Anda dengan sistem eksternal. Jika tidak ada sistem eksternal yang terlibat (misalkan, jika Anda ingin memperbarui *state* komponen dengan beberapa *props* atau perubahan *state*), Anda seharusnya tidak perlu menggunakan *Effect*. Menghilangkan *Effects* yang tidak perlu akan membuat kode Anda lebih mudah untuk diikuti, lebih cepat untuk dijalankan, dan lebih sedikit berpotensi galat.

</Intro>

<YouWillLearn>

* Mengapa dan cara menghapus *Effects* yang tidak perlu dari komponen Anda
* Cara meng-*cache* komputasi yang mahal tanpa *Effects*
* Cara menyetel ulang dan mengatur *state* komponen tanpa *Effects*
* Cara berbagi logika di antara *event handler* share logic between event handlers
* Logika apa yang seharusnya dipindahkan ke *event handler*
* Cara memberi tahu perubahan komponen ke komponen induk

</YouWillLearn>

## Cara menghapus Effect yang tidak perlu {/*how-to-remove-unnecessary-effects*/}

Ada dua kasus umum di mana Anda tidak memerlukan *Effects*:

* **Anda tidak memerlukan *Effects* untuk melakukan transformasi data untuk *rendering*.** Sebagai contoh, katakanlah Anda ingin melakukan *filter* terhadap sebuah daftar sebelum menampiklannya. Anda mungkin merasa tergoda untuk menulis *Effect* yang memperbarui variabel *state* ketika daftar berubah. Akan tetapi, hal ini tidak efisien. Ketika Anda memperbarui *state*, React akan memanggil fungsi komponen Anda terlebih dahulu untuk menghitung apa yang seharusnya ada di layar. Kemudian React akan ["*commit*"](/learn/render-and-commit) perubahan ini ke DOM, memperbarui layar. Kemudian React akan menjalankan *Effect* Anda. Jika *Effect* Anda *juga* segera memperbarui state, ini akan mengulang seluruh proses dari awal! Untuk menghindari *render pass* yang tidak perlu, ubah semua data pada tingkat teratas komponen Anda. Kode tersebut akan secara otomatis dijalankan ulang setiap kali *props* atau *state* anda berubah.
* **Anda tidak memerlukan Efek untuk menangani *event* dari pengguna.** Sebagai contoh, katakanlah Anda ingin mengirim *request* POST `/api/buy` dan menampilkan notifikasi ketika pengguna membeli produk. Di *event handler* klik tombol Beli, Anda tahu persis apa yang terjadi. Pada saat *Effect* berjalan, Anda tidak tahu *apa* yang dilakukan pengguna (misalnya, tombol mana yang diklik). Inilah sebabnya mengapa Anda biasanya akan menangani *event* pengguna di *event handler* yang sesuai.

Anda *memang* membutuhkan Effect untuk [melakukan sinkronisasi](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) dengan sistem eksternal. dengan sistem eksternal. Sebagai contoh, Anda dapat menulis sebuah *Effect* yang membuat *widget* jQuery tetap tersinkronisasi dengan *state* React. Anda juga dapat mengambil data dengan *Effect*: sebagai contoh, Anda dapat menyinkronkan hasil pencarian dengan kueri pencarian saat ini. Perlu diingat bahwa [kerangka kerja (*framework*)](/learn/start-a-new-react-project#production-grade-react-frameworks) modern menyediakan mekanisme pengambilan data bawaan yang lebih efisien daripada menulis *Effect* secara langsung di dalam komponen Anda.

Untuk membantu Anda mendapatkan intuisi yang tepat, mari kita lihat beberapa contoh konkret yang umum!

### Memperbarui *state* berdasarkan *props* atau *state* {/*updating-state-based-on-props-or-state*/}

Katakanlah Anda memiliki komponen dengan dua variabel *state*: `firstName` dan `lastName`. Anda ingin mendapatkan `fullName` dengan menggabungkan keduanya. Selain itu, Anda ingin `fullName` diperbarui setiap kali `firstName` atau `lastName` berubah. Naluri pertama Anda mungkin menambahkan variabel *state* `fullName` dan memperbaruinya di *Effect*:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Hindari: state berlebihan dan Effect yang tidak perlu
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Ini lebih rumit dari yang diperlukan. Ini juga tidak efisien: ia melakukan *render pass* secara keseluruhan dengan nilai usang untuk `fullName`, lalu segera me-*render* ulang dengan nilai yang diperbarui. Hapus variabel *state* dan *Effect*:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Baik: dikalkulasi saat render
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Ketika sebuah nilai dapat dihitung dari *props* atau *state* yang ada, [jangan memasukkannya ke dalam *state*.](/learn/choosing-the-state-structure#avoid-redundant-state) Sebaiknya, hitunglah saat *rendering*.** Hal ini membuat kode Anda lebih cepat (Anda menghindari pembaruan "bertingkat" tambahan), lebih sederhana (Anda menghapus beberapa kode), dan lebih tidak rawan terhadap *error* (Anda menghindari bug yang disebabkan oleh variabel *state* berbeda yang tidak sinkron satu sama lain). Jika pendekatan ini terasa baru bagi Anda, [Cara Berpikir dengan React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) menjelaskan apa yang seharusnya masuk sebagai *state*.

### Menyimpan penghitungan mahal di *cache* {/*caching-expensive-calculations*/}

Komponen ini menghitung `visibleTodos` dengan mengambil `todos` yang diterimanya berdasarkan *props* dan memfilternya berdasarkan prop `filter`. Anda mungkin tergoda untuk menyimpan hasilnya dalam keadaan dan memperbaruinya dari *Effect*:

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Hindari: state berlebihan dan Effect yang tidak perlu
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Seperti pada contoh sebelumnya, hal ini tidak diperlukan dan tidak efisien. Pertama, hapus *state* dan *Effect*-nya:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Ini baik jika getFilteredTodos() tidak lambat.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Biasanya, kode ini baik-baik saja! Namun mungkin `getFilteredTodos()` lambat atau Anda memiliki banyak `todos`. Dalam hal ini Anda tidak ingin mengkalkulasi ulang `getFilteredTodos()` jika beberapa variabel *state* yang tidak terkait seperti `newTodo` telah berubah.

Anda dapat melakukan *cache* (atau ["memoisasi"](https://en.wikipedia.org/wiki/Memoization)) perhitungan yang mahal dengan membungkusnya dalam Hook [`useMemo`](/reference/react/useMemo):

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Tidak dijalankan ulang kecuali todos atau filter berubah
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Atau, ditulis dalam satu baris:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Hal ini memberitahu React bahwa Anda tidak ingin fungsi di dalamnya dijalankan ulang kecuali `todos` atau `filter` telah berubah.** React akan mengingat nilai kembalian `getFilteredTodos()` selama *render* awal. Selama *rendering* berikutnya, ia akan memeriksa apakah `todos` atau `filter` berbeda. Jika sama dengan yang terakhir kali, `useMemo` akan mengembalikan hasil terakhir yang disimpannya. Namun jika berbeda, React akan memanggil fungsi di dalamnya lagi (dan menyimpan hasilnya).

Fungsi yang Anda bungkus dalam [`useMemo`](/reference/react/useMemo) berjalan selama rendering, jadi ini hanya berfungsi untuk [perhitungan murni.](/learn/keeping-components-pure)

<DeepDive>

#### Bagaimana cara mengetahui apakah suatu perhitungan itu mahal? {/*how-to-tell-if-a-calculation-is-expensive*/}

Secara umum, kecuali Anda membuat atau melakukan pengulangan terhadap ribuan objek, biayanya mungkin tidak mahal. Jika Anda ingin lebih percaya diri, Anda dapat menambahkan log konsol untuk mengukur waktu yang dihabiskan dalam sebuah kode:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Lakukan interaksi yang Anda ukur (misalnya, mengetik pada input). Anda kemudian akan melihat log seperti `filter array: 0,15ms` di konsol Anda. Jika keseluruhan waktu yang dicatat bertambah hingga jumlah yang signifikan (katakanlah, `1 ms` atau lebih), mungkin masuk akal untuk melakukan memoisasi terhadap penghitungan tersebut. Sebagai percobaan, Anda kemudian dapat menggabungkan penghitungan dalam `useMemo` untuk memverifikasi apakah total waktu yang dicatat untuk interaksi tersebut telah berkurang atau tidak:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` tidak akan membuat rendering *pertama* lebih cepat. Ini hanya membantu Anda melewatkan pekerjaan pembaruan yang tidak perlu.

Ingatlah bahwa perangkat Anda mungkin lebih cepat daripada perangkat pengguna Anda, jadi sebaiknya uji kinerjanya dengan pelambatan buatan. Misalnya, Chrome menawarkan opsi [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) untuk ini.

Perhatikan juga bahwa mengukur kinerja dalam mode pengembangan tidak akan memberi Anda hasil yang paling akurat. (Misalnya, ketika [Strict Mode](/reference/react/StrictMode) aktif, Anda akan melihat setiap komponen dirender dua kali, bukan sekali.) Untuk mendapatkan pengaturan waktu yang paling akurat, kompilasi aplikasi Anda dalam mode produksi dan uji pada perangkat seperti yang dimiliki pengguna Anda.

</DeepDive>

### Menyetel ulang keseluruhan *state* ketika *props* berubah {/*resetting-all-state-when-a-prop-changes*/}

Komponen `ProfilePage` ini menerima *prop* `userId`. Halaman tersebut berisi *input* komentar, dan Anda menggunakan variabel *state* `comment` untuk menyimpan nilainya. Suatu hari, Anda melihat masalah: saat Anda bernavigasi dari satu profil ke profil lainnya, *state* `comment` tidak disetel ulang. Akibatnya, Anda dapat dengan mudah mengirim komentar ke profil pengguna yang salah secara tidak sengaja. Untuk memperbaiki masalah ini, Anda ingin menghapus variabel *state* `comment` setiap kali `userId` berubah:

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Hindari: menyetel ulanh state setiap prop berubah di dalam Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

Hal ini tidak efisien karena `ProfilePage` dan turunannya akan di-*render* terlebih dahulu dengan nilai yang sudah usang, lalu di-*render* lagi. Ini juga rumit karena Anda harus melakukan ini di *setiap* komponen yang memiliki *state* di dalam `ProfilePage`. Misalnya, jika UI komentar disarangkan, Anda juga ingin menghapus *state* komentar yang disarangkan.

Sebagai gantinya, Anda dapat memberi tahu React bahwa setiap profil pengguna secara konseptual adalah profil _berbeda_ dengan memberinya *key* secara eksplisit. Pisahkan komponen Anda menjadi dua dan oper atribut `key` dari komponen luar ke komponen dalam:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ State ini dan state lain di bawahnya akan disetel ulang secara otomatis setiap kali key berubah
  const [comment, setComment] = useState('');
  // ...
}
```

Biasanya, React mempertahankan *state* ketika komponen yang sama dirender di tempat yang sama. **Dengan mengoper `userId` sebagai `key` ke komponen `Profile`, Anda meminta React untuk memperlakukan dua komponen `Profile` dengan `userId` yang berbeda sebagai dua komponen berbeda yang tidak boleh berbagi *state* apa pun.** Kapan pun *key* (yang telah Anda setel ke `userId`) berubah, React akan membuat ulang DOM dan [mengatur ulang *state*](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) dari komponen `Profile` dan semua turunannya. Sekarang bidang `comment` akan dihapus secara otomatis saat bernavigasi antar profil.

Perhatikan bahwa dalam contoh ini, hanya komponen `ProfilePage` bagian luar yang diekspor dan terlihat oleh file lain dalam proyek. Komponen yang merender `ProfilePage` tidak perlu meneruskan kuncinya: komponen meneruskan `userId` sebagai prop biasa. Fakta bahwa `ProfilePage` meneruskannya sebagai `key` ke komponen `Profile` bagian dalam adalah detail implementasi.

### Menyesuaikan sebagian *state* ketika *prop* berubah {/*adjusting-some-state-when-a-prop-changes*/}

Terkadang, Anda mungkin ingin menyetel ulang atau menyesuaikan sebagian *state* pada perubahan prop, namun tidak semuanya.

Komponen `List` ini menerima *list* `item` sebagai *prop*, dan mempertahankan item yang dipilih dalam variabel *state* `selection`. Anda ingin menyetel ulang `selection` ke `null` setiap kali prop `items` menerima senarai yang berbeda:

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Hindari: Mengatur state saat prop berubah di dalam Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Hal ini juga tidak ideal. Setiap kali `items` berubah, `List` dan komponen turunannya akan di-*render* dengan nilai `selection` yang usang pada awalnya. Kemudian React akan memperbarui DOM dan menjalankan *Effect*-nya. Terakhir, panggilan `setSelection(null)` akan menyebabkan *rendering* ulang `List` dan komponen turunannya lagi, sehingga memulai kembali seluruh proses ini.

Mulailah dengan menghapus *Effect*. Sebagai gantinya, sesuaikan *state* secara langsung selama rendering:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Lebih baik: Menyesuaikan state saat rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[Menyimpan informasi dari *render* sebelumnya](/reference/react/useState#storing-information-from-previous-renders) seperti ini mungkin sulit untuk dipahami, tetapi ini lebih baik daripada memperbarui *state* yang sama dalam suatu *Effect*. Dalam contoh di atas, `setSelection` dipanggil secara langsung saat *render*. React akan me-*render* ulang `List` *segera* setelah keluar dengan pernyataan `return`. React belum merender turunan `List` atau memperbarui DOM, jadi hal ini memungkinkan turunan `List` melewatkan rendering nilai `selection` yang sudah usang.

Saat Anda memperbarui komponen selama rendering, React membuang JSX yang dikembalikan dan segera mencoba lagi *rendering*. Untuk menghindari percobaan ulang berjenjang yang sangat lambat, React hanya mengizinkan Anda memperbarui *state* komponen *sama* selama render. Jika Anda memperbarui *state* komponen lain selama render, Anda akan melihat *error*. Kondisi seperti `items !== prevItems` diperlukan untuk menghindari perulangan. Anda dapat menyesuaikan *state* seperti ini, namun efek samping lainnya (seperti mengubah DOM atau menyetel batas waktu) harus tetap berada di *event handlers* atau *Effect* untuk [menjaga komponen tetap murni.](/learn/keeping-components-pure)

**Meskipun pola ini lebih efisien daripada *Effect*, sebagian besar komponen juga tidak memerlukannya.** Bagaimana pun Anda melakukannya, menyesuaikan *state* berdasarkan *props* atau *state* lainnya akan membuat aliran data Anda lebih sulit untuk dipahami dan di-*debug*. Selalu periksa apakah Anda dapat [mengatur ulang semua *state* dengan *key*](#resetting-all-state-when-a-prop-changes) atau [menghitung semuanya selama rendering](#update-state-based-on-props-or-state) sebagai gantinya. Misalnya, alih-alih menyimpan (dan mengatur ulang) *item* yang dipilih, Anda dapat menyimpan *ID item* yang dipilih:

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Cara terbaik: Menghitung semuanya saat rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Sekarang tidak perlu lagi "menyesuaikan" *state*. Jika item dengan ID yang dipilih ada dalam daftar, maka item tersebut tetap dipilih. Jika tidak, `selection` yang dihitung selama *rendering* akan menjadi `null` karena tidak ditemukan item yang cocok. Perilaku ini berbeda, namun bisa dibilang lebih baik karena sebagian besar perubahan pada `item` mempertahankan pilihan.

### Berbagi logika antar *event handler* {/*sharing-logic-between-event-handlers*/}

Katakanlah Anda memiliki halaman produk dengan dua tombol (Beli dan Checkout) yang memungkinkan Anda membeli produk tersebut. Anda ingin menampilkan notifikasi setiap kali pengguna memasukkan produk ke keranjang. Memanggil `showNotification()` pada *handler* klik kedua tombol terasa berulang sehingga Anda mungkin tergoda untuk menempatkan logika ini dalam sebuah *Effect*:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Hindari: Logika khusus Event di dalam Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

*Effect* ini tidak diperlukan. Kemungkinan besar juga akan menyebabkan bug. Misalnya, aplikasi Anda "mengingat" keranjang belanja di antara halaman yang dimuat ulang. Jika Anda menambahkan produk ke keranjang satu kali dan me-*refresh* halaman, notifikasi akan muncul kembali. Ini akan terus muncul setiap kali Anda me-*refresh* halaman produk tersebut. Hal ini karena `product.isInCart` sudah menjadi `true` saat halaman dimuat, sehingga *Effect* di atas akan memanggil `showNotification()`.

**Jika Anda tidak yakin apakah beberapa kode harus berada dalam *Effect* atau dalam *event handler*, tanyakan pada diri Anda *mengapa* kode ini perlu dijalankan. Gunakan *Effect* hanya untuk kode yang harus dijalankan *karena* komponen ditampilkan kepada pengguna.** Dalam contoh ini, notifikasi akan muncul karena pengguna *menekan tombol*, bukan karena halaman ditampilkan! Hapus *Effect*-nya dan masukkan logika bersama ke dalam fungsi yang dipanggil dari kedua *event handler*:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Baik: Logika khusus event dipanggil dari event handler
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

Hal ini menghilangkan *Effect* yang tidak perlu dan memperbaiki bug.

### Mengirim *request* POST {/*sending-a-post-request*/}

Komponen `Form` ini mengirimkan dua jenis *request* POST. Ini mengirimkan *event* analitik saat dipasang. Saat Anda mengisi formulir dan mengklik tombol Kirim, *request* POST akan dikirim ke *endpoint* `/api/register`:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Baik: Logika ini seharusnya dijalankan karena komponen ditampilkan
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Hindari: Logika khusus event di dalam Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

Mari kita terapkan kriteria yang sama seperti pada contoh sebelumnya.

*Request* POST analitik harus tetap dalam *Effect*. Ini karena _alasan_ mengirim *event* analitik adalah karena formulir telah ditampilkan. (Ini akan diaktifkan dua kali dalam pengembangan, tetapi [lihat di sini](/learn/synchronizing-with-effects#sending-analytics) untuk mengetahui cara mengatasinya.)

Namun, *request* POST `/api/register` tidak disebabkan oleh formulir yang _ditampilkan_. Anda hanya ingin mengirim permintaan pada satu waktu tertentu: saat pengguna menekan tombol. Ini seharusnya hanya terjadi _pada interaksi tertentu_. Hapus *Effect* kedua dan pindahkan *request* POST tersebut ke dalam *event handler*:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Baik: Logika ini dijalankan karena komponen ditampilkan
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Baik: Logika khusus event di dalam event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Saat Anda memilih apakah akan memasukkan logika ke dalam *event handler* atau *Effect*, pertanyaan utama yang perlu Anda jawab adalah _logika macam apa_ dari sudut pandang pengguna. Jika logika ini disebabkan oleh interaksi tertentu, simpan logika tersebut di *event handler*. Jika hal ini disebabkan oleh pengguna _melihat_ komponen di layar, simpan di *Effect*.

### Rantai komputasi {/*chains-of-computations*/}

Terkadang Anda mungkin tergoda untuk membuat *Effect* berantai yang masing-masing menyesuaikan suatu bagian *state* berdasarkan *state* lainnya:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Hindari: Rantai Effect yang menyesuaikan state hanya untuk memicu Effect satu sama lain
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

Ada dua masalah dengan kode ini.

<<<<<<< HEAD
Salah satu masalahnya adalah hal ini sangat tidak efisien: komponen (dan turunannya) harus di-*render* ulang di antara setiap panggilan `set` dalam rantai. Dalam contoh di atas, dalam kasus terburuk (`setCard` → *render* → `setGoldCardCount` → *render* → `setRound` → *render* → `setIsGameOver` → *render*) ada tiga *rendering* ulang yang tidak diperlukan pada pohon di bawah ini.

Meskipun tidak lambat, seiring berkembangnya kode Anda, Anda akan menghadapi kasus di mana "rantai" yang Anda tulis tidak sesuai dengan persyaratan baru. Bayangkan Anda menambahkan cara untuk menelusuri sejarah gerakan permainan. Anda akan melakukannya dengan memperbarui setiap variabel *state* ke nilai dari masa lalu. Namun, menyetel *state* `card` ke nilai dari masa lalu akan memicu rantai *Effect* lagi dan mengubah data yang Anda tampilkan. Kode seperti ini seringkali kaku dan rapuh.
=======
The first problem is that it is very inefficient: the component (and its children) have to re-render between each `set` call in the chain. In the example above, in the worst case (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) there are three unnecessary re-renders of the tree below.

The second problem is that even if it weren't slow, as your code evolves, you will run into cases where the "chain" you wrote doesn't fit the new requirements. Imagine you are adding a way to step through the history of the game moves. You'd do it by updating each state variable to a value from the past. However, setting the `card` state to a value from the past would trigger the Effect chain again and change the data you're showing. Such code is often rigid and fragile.
>>>>>>> 65d297e93b36be5370e58ab7828d022c741ecbe2

Dalam hal ini, lebih baik menghitung apa yang Anda bisa selama *rendering*, dan sesuaikan *state* di *event handler*:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Hitung apa yang Anda bisa saat render
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Hitung keseluruhan state selanjutnya dalam event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

Ini jauh lebih efisien. Selain itu, jika Anda menerapkan cara untuk melihat riwayat *game*, sekarang Anda akan dapat menyetel setiap variabel *state* ke pergerakan dari masa lalu tanpa memicu rantai *Effect* yang menyesuaikan setiap nilai lainnya. Jika Anda perlu menggunakan kembali logika antara beberapa *event handler*, Anda dapat [mengekstrak fungsi](#sharing-logic-between-event-handlers) dan memanggilnya dari *handler* tersebut.

Ingat bahwa di dalam event handler, [*state* berperilaku seperti *snapshot*.](/learn/state-as-a-snapshot) Misalnya, bahkan setelah Anda memanggil `setRound(round + 1)`, variabel `round` akan mencerminkan nilai pada saat pengguna mengklik tombol. Jika Anda perlu menggunakan nilai berikutnya untuk penghitungan, tentukan secara manual seperti `const nextRound = round + 1`.

Dalam beberapa kasus, Anda *tidak dapat* menghitung *state* berikutnya secara langsung di *event handler*. Misalnya, bayangkan sebuah formulir dengan beberapa *dropdown* di mana pilihan *dropdown* berikutnya bergantung pada nilai yang dipilih dari *dropdown* sebelumnya. Kemudian, rangkaian *Effect* sesuai karena Anda melakukan sinkronisasi dengan jaringan.

### Inisialisasi aplikasi {/*initializing-the-application*/}

Beberapa logika hanya boleh dijalankan satu kali saat aplikasi dimuat.

Anda mungkin tergoda untuk menempatkannya di *Effect* di komponen tingkat atas:

```js {2-6}
function App() {
  // 🔴 Hindari: Effects dengan logika yang harus dijalankan sekali saja
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

Namun, Anda akan segera menyadari bahwa ini [berjalan dua kali dalam pengembangan.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) Hal ini dapat menyebabkan masalah-- misalnya, mungkin token autentikasinya menjadi tidak valid karena fungsinya tidak dirancang untuk dipanggil dua kali. Secara umum, komponen Anda harus tahan untuk dipasang ulang. Ini termasuk komponen `App` tingkat atas Anda.

Meskipun dalam praktiknya mungkin tidak akan pernah dipasang ulang dalam produksi, mengikuti batasan yang sama di semua komponen akan mempermudah pemindahan dan penggunaan kembali kode. Jika beberapa logika harus dijalankan *sekali per pemuatan aplikasi* dan bukan *sekali per pemasangan komponen*, tambahkan variabel tingkat atas untuk melacak apakah logika tersebut sudah dijalankan:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Hanya dijalankan sekali saat aplikasi dimuat
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

You can also run it during module initialization and before the app renders:

```js {1,5}
if (typeof window !== 'undefined') { // Cek apakah kode berjalan di peramban.
   // ✅ Hanya dijalankan sekali saat aplikasi dimuat
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Kode di tingkat atas dijalankan satu kali saat komponen Anda diimpor--walaupun komponen tersebut tidak di-*render*. Untuk menghindari perlambatan atau perilaku tidak terduga saat mengimpor komponen sembarangan, jangan terlalu sering menggunakan pola ini. Pertahankan logika inisialisasi seluruh aplikasi ke root modul komponen seperti `App.js` atau di titik masuk aplikasi Anda.

### Memberi tahu komponen induk tentang perubahan *state* {/*notifying-parent-components-about-state-changes*/}

Katakanlah Anda sedang menulis komponen `Toggle` dengan *state* `isOn` internal yang dapat berupa `true` atau `false`. Ada beberapa cara berbeda untuk mengaktifkannya (dengan mengeklik atau menggeser). Anda ingin memberi tahu komponen induk setiap kali *state* internal `Toggle` berubah, sehingga Anda mengekspos *event* `onChange` dan memanggilnya dari *Effect*:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Hindari: Event handler onChange terlambat dijalankan
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

Seperti sebelumnya, ini tidak ideal. `Toggle` memperbarui *state*-nya terlebih dahulu, dan React memperbarui layar. Kemudian React menjalankan *Effect*, yang memanggil fungsi `onChange` yang diteruskan dari komponen induk. Sekarang komponen induk akan memperbarui *state*-nya sendiri, memulai proses *render* lainnya. Akan lebih baik jika melakukan semuanya dalam sekali jalan.

Hapus *Effect*-nya dan perbarui status *kedua* komponen dalam *event handler* yang sama:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Baik: Lakukan semua pembaruan selama event yang menyebabkannya
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

Dengan pendekatan ini, komponen `Toggle` dan komponen induknya memperbarui *state*-nya selama *event*. React [mem-*batch* pembaruan](/learn/queueing-a-series-of-state-updates) dari berbagai komponen secara bersamaan, sehingga hanya akan ada satu *render pass*.

Anda mungkin juga dapat menghapus *state* tersebut, dan sebagai gantinya menerima `isOn` dari komponen induk:

```js {1,2}
// ✅ Juga baik: komponen terkontrol secara penuh oleh induknya
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["Menaikkan *state* ke atas"](/learn/sharing-state-between-components) memungkinkan komponen induk mengontrol sepenuhnya `Toggle` dengan mengubah *state* induknya sendiri. Ini berarti komponen induk harus mengandung lebih banyak logika, namun secara keseluruhan akan ada lebih sedikit *state* yang perlu dikhawatirkan. Setiap kali Anda mencoba untuk menyinkronkan dua variabel *state* yang berbeda, coba naikkan *state*!

### Mengoper data ke komponen induk {/*passing-data-to-the-parent*/}

Komponen `Child` ini mengambil data dan kemudian meneruskannya ke komponen `Parent` dalam sebuah *Effect*:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Hindari: Mengoper data ke komponen induk di dalam Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

Di React, data mengalir dari komponen induk ke komponen turunannya. Saat Anda melihat sesuatu yang salah di layar, Anda dapat melacak dari mana informasi tersebut berasal dengan menelusuri rantai komponen ke atas hingga Anda menemukan komponen mana yang mengoper *props* yang salah atau memiliki *state* yang salah. Saat komponen anak memperbarui *state* komponen induknya di *Effect*, aliran data menjadi sangat sulit dilacak. Karena komponen turunan dan induk membutuhkan data yang sama, biarkan komponen induk mengambil data tersebut, dan *meneruskannya* ke turunan:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Baik: Meneruskan data ke komponen anak
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

Hal ini lebih simpel dan menjaga aliran data tetap dapat diprediksi: data mengalir dari induk ke turunan.

### Berlangganan ke penyimpanan data eksternal {/*subscribing-to-an-external-store*/}

Terkadang, komponen Anda mungkin perlu berlangganan beberapa data di luar *state* React. Data ini bisa berasal dari pustaka pihak ketiga atau API browser bawaan. Karena data ini dapat berubah tanpa sepengetahuan React, Anda perlu berlangganan komponen Anda secara manual. Hal ini sering dilakukan dengan *Effect*, misalnya:

```js {2-17}
function useOnlineStatus() {
  // Tidak ideal: Berlangganan store secara manual dalam Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Di sini, komponen berlangganan penyimpanan data eksternal (dalam hal ini, API `navigator.onLine` browser). Karena API ini tidak ada di server (sehingga tidak dapat digunakan untuk HTML awal), awalnya *state* disetel ke `true`. Setiap kali nilai penyimpanan data tersebut berubah di browser, komponen akan memperbarui *state*-nya.

Meskipun *Effect* umumnya digunakan untuk hal ini, React memiliki Hook yang dibuat khusus untuk berlangganan penyimpanan data eksternal yang lebih disarankan digunakan. Hapus *state* dan ganti dengan panggilan ke [`useSyncExternalStore`](/reference/react/useSyncExternalStore):

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Baik: Berlangganan store eksternal dengan Hook bawaan
  return useSyncExternalStore(
    subscribe, // React tidak akan berlangganan ulang selama Anda mengoper fungsi yang sama
    () => navigator.onLine, // Bagaimana cara mendapatkan nilai client
    () => true // Bagaimana cara mendapatkan nilai server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Pendekatan ini lebih tidak rentan terhadap kesalahan dibandingkan menyinkronkan secara manual data yang dapat diubah ke *state* React dengan *Effec*. Biasanya, Anda akan menulis Hook khusus seperti `useOnlineStatus()` di atas sehingga Anda tidak perlu mengulangi kode ini di masing-masing komponen. [Baca selengkapnya tentang berlangganan penyimpanan data eksternal dari komponen React.](/reference/react/useSyncExternalStore)

### Mengambil data {/*fetching-data*/}

Banyak aplikasi menggunakan *Effect* untuk memulai pengambilan data. Sangat umum untuk menulis *Effect* pengambilan data seperti ini:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Hindari: Pengambilan data tanpa logika pembersihan
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Anda *tidak* perlu memindahkan pengambilan ini ke *event handler*.

Ini mungkin tampak seperti kontradiksi dengan contoh sebelumnya di mana Anda perlu memasukkan logika ke dalam *event handler*! Namun, pertimbangkan bahwa bukan *event pengetikan* yang menjadi alasan utama pengambilan. *Input* penelusuran sering kali diisi sebelumnya dari URL, dan pengguna dapat menavigasi Mundur dan Maju tanpa menyentuh *input* tersebut.

Tidak masalah dari mana `page` dan `query` berasal. Saat komponen ini terlihat, Anda ingin tetap `results` [disinkronkan](/learn/synchronizing-with-effects) dengan data dari jaringan untuk `page` dan `query` saat ini. Inilah mengapa ini merupakan *Effect*.

Namun kode diatas mempunyai bug. Bayangkan Anda mengetik `"hello"` dengan cepat. Kemudian `query` akan berubah dari `"h"`, menjadi `"he"`, `"hel"`, `"hell"`, dan `"hello"`. Ini akan memulai pengambilan terpisah, namun tidak ada jaminan urutan respons yang akan diterima. Misalnya, respons `"hell"` mungkin muncul *setelah* respons `"hello"`. Karena ini akan memanggil `setResults()` terakhir, Anda akan menampilkan hasil pencarian yang salah. Ini disebut ["*race condition*"](https://en.wikipedia.org/wiki/Race_condition): dua permintaan berbeda "berlomba" satu sama lain dan datang dalam urutan berbeda dari yang Anda harapkan.

**Untuk memperbaiki *race condition*, anda perlu [menambahkan fungsi pembersihan](/learn/synchronizing-with-effects#fetching-data) untuk mengabaikan respons yang sudah usang:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```


Hal ini memastikan bahwa saat *Effect* Anda mengambil data, semua respons kecuali yang terakhir diminta akan diabaikan.

Menangani *race condition* bukan satu-satunya kesulitan dalam mengimplementasikan pengambilan data. Anda mungkin juga ingin memikirkan tentang *cache* terhadap respons (sehingga pengguna dapat mengeklik Kembali dan langsung melihat layar sebelumnya), cara mengambil data di server (sehingga HTML awal yang di-*render* oleh server berisi konten yang diambil, bukan *spinner*), dan cara menghindari air terjun jaringan (*network waterfalls*) (sehingga komponen anak dapat mengambil data tanpa menunggu induknya).

**Masalah ini berlaku untuk semua perpustakaan UI, bukan hanya React. Menyelesaikannya bukanlah hal yang sepele, itulah sebabnya [kerangka kerja](/learn/start-a-new-react-project#production-grade-react-frameworks) modern menyediakan mekanisme pengambilan data bawaan yang lebih efisien daripada mengambil data di *Effect*.**

Jika Anda tidak menggunakan kerangka kerja (dan tidak ingin membuat kerangka kerja sendiri) namun ingin membuat pengambilan data dari *Effect* lebih ergonomis, pertimbangkan untuk mengekstrak logika pengambilan Anda ke dalam Hook khusus seperti dalam contoh ini:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```


Anda mungkin juga ingin menambahkan beberapa logika untuk penanganan *error* dan melacak apakah konten sedang dimuat. Anda dapat membuat Hook seperti ini sendiri atau menggunakan salah satu dari banyak solusi yang sudah tersedia di ekosistem React. **Meskipun hal ini saja tidak akan seefisien menggunakan mekanisme pengambilan data bawaan kerangka kerja, memindahkan logika pengambilan data ke dalam Hook kustom akan mempermudah penerapan strategi pengambilan data yang efisien nantinya.**

Secara umum, kapan pun Anda harus menulis *Effect*, perhatikan kapan Anda dapat mengekstrak sebagian fungsionalitas ke dalam Hook khusus dengan API yang lebih deklaratif dan dibuat khusus seperti `useData` di atas. Semakin sedikit panggilan `useEffect` mentah yang Anda miliki di komponen Anda, semakin mudah Anda memelihara aplikasi Anda.

<Recap>

- Apabila Anda dapat menghitung nilai sesuatu saat *render*, Anda tidak memerlukan Effect.
- Untuk meng-*cache* penghitungan yang mahal, tambahkan `useMemo` sebagai ganti `useEffect`.
- Untuk menyetel ulang *state* sebuah pohon komponen secara keseluruhan, berikan `key` yang berbeda ke dalamnya.
- Untuk mengatur ulang *state* tertentu sebagai respons terhadap perubahan *props*, aturlah selama *rendering*.
- Kode yang berjalan karena komponen *ditampilkan* harus di *Effect*, sisanya harus di *event*.
- Jika Anda perlu memperbarui *state* beberapa komponen, lebih baik melakukannya dalam satu *event*.
- Setiap kali Anda mencoba menyinkronkan variabel *state* di komponen yang berbeda, pertimbangkan untuk menaikkan *state*.
- Anda dapat mengambil data dengan *Effect*, tetapi Anda perlu menerapkan pembersihan untuk menghindari *race condition*.

</Recap>

<Challenges>

#### Mentransformasi data tanpa *Effect* {/*transform-data-without-effects*/}

Komponen `TodoList` di bawah menampilkan daftar tugas. Jika kotak centang "Tampilkan hanya tugas yang aktif" dicentang, tugas yang sudah selesai tidak akan ditampilkan dalam daftar. Terlepas dari tugas mana yang terlihat, *footer* menampilkan jumlah tugas yang belum selesai.

Sederhanakan komponen ini dengan menghapus semua *state* dan *Effect* yang tidak perlu.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        Sisa {activeTodos.length} tugas
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Tampilkan hanya tugas yang aktif
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Tambahkan
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Beli apel', true),
  createTodo('Beli jeruk', true),
  createTodo('Beli wortel'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

Jika Anda dapat menghitung nilai dari sesuatu saat *rendering*, Anda tidak memerlukan *state* atau *Effect* yang memperbaruinya.

</Hint>

<Solution>

Hanya ada dua bagian penting dari *state* dalam contoh ini: daftar `todos` dan variabel *state* `showActive` yang menunjukkan apakah kotak centang dicentang. Semua variabel *state* lainnya adalah [redundan](/learn/choosing-the-state-structure#avoid-redundant-state) dan dapat dihitung selama *rendering*. Ini termasuk `footer` yang dapat Anda pindahkan langsung ke JSX di sekitarnya.

Hasil Anda akan terlihat seperti ini:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Tampilkan hanya tugas yang aktif
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        Sisa {activeTodos.length} tugas
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Tambahkan
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Beli apel', true),
  createTodo('Beli jeruk', true),
  createTodo('Beli wortel'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Meng-*cache* perhitungan tanpa *Effect* {/*cache-a-calculation-without-effects*/}

Dalam contoh ini, pemfilteran daftar tugas diekstrak ke dalam fungsi terpisah yang disebut `getVisibleTodos()`. Fungsi ini berisi panggilan `console.log()` di dalamnya yang membantu Anda mengetahui saat fungsi tersebut dipanggil. Alihkan "Tampilkan hanya tugas yang aktif" dan perhatikan bahwa fungsi tersebut menyebabkan `getVisibleTodos()` dijalankan ulang. Hal ini diharapkan karena tugas yang terlihat berubah saat Anda mengubah tugas mana yang akan ditampilkan.

Tugas Anda adalah menghapus *Effect* yang menghitung ulang daftar `visibleTodos` dalam komponen `TodoList`. Namun, Anda perlu memastikan bahwa `getVisibleTodos()` *tidak* dijalankan ulang (dan karenanya tidak mencetak log apa pun) saat Anda mengetik ke dalam input.

<Hint>

Salah satu solusinya adalah menambahkan panggilan `useMemo` untuk menyimpan *cache* dari tugas yang terlihat. Ada juga solusi lain yang tidak terlalu jelas.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Tampilkan hanya tugas yang aktif
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Tambahkan
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Beli apel', true),
  createTodo('Beli jeruk', true),
  createTodo('Beli wortel'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

Hapus variabel *state* dan *Effect*, dan sebagai gantinya tambahkan panggilan `useMemo` untuk menyimpan hasil pemanggilan `getVisibleTodos()`:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Tampilkan hanya tugas yang aktif
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Tambahkan
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Beli apel', true),
  createTodo('Beli jeruk', true),
  createTodo('Beli wortel'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Dengan perubahan ini, `getVisibleTodos()` hanya akan dipanggil jika `todos` atau `showActive` berubah. Mengetik ke input hanya mengubah variabel *state* `text`, jadi tidak memicu panggilan ke `getVisibleTodos()`.

Ada juga solusi lain yang tidak memerlukan `useMemo`. Karena variabel *state* `text` tidak mungkin memengaruhi daftar todo, Anda dapat mengekstrak formulir `NewTodo` ke dalam komponen terpisah, dan memindahkan variabel *state* `text` ke dalamnya:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Tampilkan hanya tugas yang aktif
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Tambahkan
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Beli apel', true),
  createTodo('Beli jeruk', true),
  createTodo('Beli wortel'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Pendekatan ini juga memenuhi persyaratan. Saat Anda mengetik ke dalam input, hanya variabel *state* `text` yang diperbarui. Karena variabel *state* `text` ada di komponen anak `NewTodo`, komponen induk `TodoList` tidak akan di-*render* ulang. Inilah sebabnya `getVisibleTodos()` tidak dipanggil saat Anda mengetik. (Itu akan tetap dipanggil jika `TodoList` di-*render* ulang karena alasan lain.)

</Solution>

#### Menyetel ulang *state* tanpa *Effect* {/*reset-state-without-effects*/}

Komponen `EditContact` ini menerima objek kontak berbentuk seperti `{ id, name, email }` sebagai *props* `savedContact`. Coba mengubah kolom input nama dan email. Saat Anda menekan Simpan, tombol kontak di atas formulir akan diperbarui ke nama yang diedit. Saat Anda menekan Atur Ulang, semua perubahan yang tertunda dalam formulir akan dibuang. Cobalah UI ini untuk merasakannya.

Saat Anda memilih kontak dengan tombol di bagian atas, formulir akan disetel ulang untuk mencerminkan detail kontak tersebut. Ini dilakukan dengan *Effect* di dalam `EditContact.js`. Hapus *Effect* ini. Temukan cara lain untuk menyetel ulang formulir saat `savedContact.id` berubah.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Nama:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Simpan
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Atur Ulang
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

Akan lebih baik jika ada cara untuk memberi tahu React bahwa ketika `savedContact.id` berbeda, formulir `EditContact` secara konseptual adalah _formulir kontak yang berbeda_ dan tidak boleh mempertahankan *state*. Apakah Anda ingat cara seperti itu?

</Hint>

<Solution>

Pisahkan komponen `EditContact` menjadi dua. Pindahkan semua *state* formulir ke komponen `EditForm` bagian dalam. Ekspor komponen `EditContact` bagian luar, dan buat komponen tersebut meneruskan `savedContact.id` sebagai `key` ke komponen `EditForm` bagian dalam. Hasilnya, komponen `EditForm` bagian dalam akan menyetel ulang semua *state* formulir dan membuat ulang DOM setiap kali Anda memilih kontak yang berbeda.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Nama:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Simpan
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Atur Ulang
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Mengirim formulir tanpa *Effect* {/*submit-a-form-without-effects*/}

Komponen `Form` ini memungkinkan Anda mengirim pesan ke teman. Saat Anda mengirimkan formulir, variabel *state* `showForm` disetel ke `false`. Ini memicu *Effect* yang memanggil `sendMessage(message)`, yang mengirim pesan (Anda dapat melihatnya di konsol). Setelah pesan terkirim, Anda akan melihat dialog "Terima kasih" dengan tombol "Buka obrolan" yang memungkinkan Anda kembali ke formulir.

Pengguna aplikasi Anda mengirim terlalu banyak pesan. Untuk membuat obrolan sedikit lebih sulit, Anda telah memutuskan untuk menampilkan dialog "Terima kasih" *terlebih dahulu* daripada formulir. Ubah variabel *state* `showForm` untuk diinisialisasi ke `false` alih-alih `true`. Segera setelah Anda membuat perubahan itu, konsol akan menunjukkan bahwa pesan kosong telah dikirim. Ada yang salah dalam logika ini!

Apa akar penyebab masalah ini? Dan bagaimana cara memperbaikinya?

<Hint>

Haruskah pesan dikirim _karena_ pengguna melihat dialog "Terima kasih"? Atau sebaliknya?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Terima kasih telah menggunakan layanan kami!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Buka obrolan
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Kirim
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Mengirim pesan: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

Variabel *state* `showForm` menentukan apakah akan menampilkan formulir atau dialog "Terima kasih". Namun, Anda tidak mengirim pesan karena dialog "Terima kasih" _ditampilkan_. Anda ingin mengirim pesan karena pengguna telah _mengirimkan formulir._ Hapus *Effect* yang menyesatkan dan pindahkan panggilan `sendMessage` ke dalam *event handler* `handleSubmit`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Terima kasih telah menggunakan layanan kami!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Buka obrolan
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Kirim
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Mengirim pesan: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Perhatikan bagaimana dalam versi ini, hanya _mengirimkan formulir_ (yang merupakan suatu *event*) yang menyebabkan pesan terkirim. Ini berfungsi sama baiknya terlepas dari apakah `showForm` awalnya disetel ke `true` atau `false`. (Setel ke `false` dan perhatikan tidak ada pesan konsol tambahan.)

</Solution>

</Challenges>
