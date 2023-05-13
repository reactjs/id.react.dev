---
title: 'Menghilangkan Efek dependensi'
---

<Intro>

Saat Anda menulis sebuah Efek, *linter* akan memverifikasi bahwa Anda telah memasukkan setiap nilai reaktif (seperti *props* dan *state*) yang dibaca Efek dalam daftar dependensi Efek. Ini memastikan bahwa Efek Anda tetap tersinkronisasi dengan *props* dan *state* terbaru dari komponen Anda. Dependensi yang tidak perlu dapat menyebabkan Efek Anda berjalan terlalu sering, atau bahkan membuat perulangan tak terbatas. Ikuti panduan ini untuk meninjau dan menghapus dependensi yang tidak perlu dari Efek Anda.

</Intro>

<YouWillLearn>

- Bagaimana untuk memperbaiki perulangan dependensi Efek tak terbatas (*Inifinite Effect*)?
- Apa yang harus dilakukan ketika Anda ingin menghapus dependensi?
- Bagaimana untuk membaca nilai dari Efek Anda tanpa "bereaksi" kepadanya?
- Bagaimana dan mengapa menghindari objek dan fungsi dependensi?
- Mengapa menekan dependensi *linter* itu berbahaya, dan apa yang seharusnya dilakukan?

</YouWillLearn>

## Dependensi harus sesuai dengan kode {/*dependencies-should-match-the-code*/}

Saat Anda menulis sebuah Efek, pertama Anda menentukan cara [memulai dan menghentikan](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) apa pun yang Anda ingin dari Efek Anda lakukan:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Kemudian, jika Anda membiarkan dependensi Efek kosong (`[]`), *linter* akan menyarankan dependensi yang tepat:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Perbaiki kesalahan disini!
  return <h1>Selamat datang di ruang {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Pilih ruang obrolan:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">umum</option>
          <option value="travel">travel</option>
          <option value="music">musik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  return {
    connect() {
      console.log('✅ Menghubungkan ke ruang "' + roomId + '" pada ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Terputus dari ruang "' + roomId + '" pada ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Isi sesuai dengan apa yang *linter* katakan:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Semua dependensi dideklarasikan
  // ...
}
```

[Efek "bereaksi" terhadap nilai reaktif.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Karena `roomId` adalah nilai reaktif (dapat berubah karena *render* ulang), *linter* memverifikasi bahwa Anda telah menetapkannya sebagai sebuah dependensi. JIka `roomId` menerima nilai yang berbeda, React akan menyinkronkan ulang Efek Anda. Ini memastikan obrolan tetap terhubung ke ruang yang dipilih dan "bereaksi" dengan *dropdown*:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Selamat datang di ruang {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Pilih ruang obrolan:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">umum</option>
          <option value="travel">travel</option>
          <option value="music">musik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  return {
    connect() {
      console.log('✅ Menghubungkan ke ruang "' + roomId + '" pada ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Terputus dari ruang "' + roomId + '" pada ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

### Untuk menghapus dependensi, pastikan bahwa itu bukan dependensi {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Perhatikan bahwa Anda tidak dapat "memilih" dependensi dari Efek Anda. Setiap <CodeStep step={2}>nilai reaktif</CodeStep> yang digunakan oleh kode Efek Anda harus dideklarasikan dalam daftar dependensi. Daftar dependensi ditentukan oleh kode disekitarnya:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Ini adalah nilai reaktif
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Efek ini membaca nilai reaktif tersebut
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Jadi Anda harus menentukan nilai reaktif tersebut sebagai dependesi dari Efek Anda
  // ...
}
```

[Nilai reaktif](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) termasuk *props* dan semua variabel dan fungsi dideklarasikan langsung di dalam komponen Anda. Ketika `roomId` adalah nilai reaktif, Anda tidak dapat menghapusnya dari daftar dependensi. *Linter* tidak akan mengizinkannya:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect memiliki dependensi yang hilang: 'roomId'
  // ...
}
```

Dan *linter* akan benar! Ketika `roomId` mungkin berubah dari waktu ke waktu, ini akan menimbulkan bug dalam kode Anda.

**Untuk menghapus dependensi, "buktikan" kepada *linter* bahwa itu *tidak perlu* menjadi sebuah dependensi.** Misalnya, Anda dapat mengeluarkan `roomId` dari komponen  untuk membuktikan bahwa ia tidak reaktif dan tidak akan berubah saat render ulang:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Bukan nilai reaktif lagi

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Semua dependensi dideklarasikan
  // ...
}
```

Sekarang `roomId` bukan nilai reaktif (dan tidak berubah dalam render ulang), ia tidak perlu menjadi sebuah dependensi:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Selamat datang di ruang {roomId}!</h1>;
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  return {
    connect() {
      console.log('✅ Menghubungkan ke ruang "' + roomId + '" pada ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Terputus dari ruang "' + roomId + '" pada ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Inilah mengapa Anda sekarang dapat menentukan [(`[]`) daftar dependensi kosong.](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Efek Anda *benar-benar tidak* bergantung pada nilai reaktif lagi, jadi itu *benar-benar tidak* dijalankan ulang ketika salah satu *props* atau *state* komponen berubah.

### Untuk mengubah dependensi, ubah kodenya {/*to-change-the-dependencies-change-the-code*/}

Anda mungkin memperhatikan pola dalam alur kerja Anda:

1. Pertama, Anda **mengubah kode** kode Efek Anda atau bagaimana nilai reaktif Anda dideklarasikan.
2. Kemudian, Anda mengikuti *linter* dan menyesuaikan dependensi agar **sesuai dengan kode yang Anda ubah.**
3. Jika kamu tidak puas dengan daftar dependensi, Anda **kembali ke langkah pertama** (dan mengubah kodenya kembali).

Bagian terakhir ini penting. **Jika Anda ingin mengubah dependensi, ubah kode sekitarnya lebih dulu.** Anda bisa menganggap daftar dependensi sebagai [sebuah daftar dari semua niali reaktif yang digunakan oleh kode Efek Anda.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Anda tidak *memilih* apa yang dimasukan ke dalam daftar tersebut. Daftar *mendeskripsikan* kode Anda. Untuk mengubah daftar dependensi, ubah kodenya.

Ini mungkin terasa seperti menyelesaikan persamaan. Anda mungkin memulai dengan tujuan (misalnya, untuk menghapus dependensi), dan Anda perlu "menemukan" kode yang sesuai dengan tujuan tersebut. Tidak semua orang menganggap memecahkan persamaan itu menyenangkan, dan hal yang sama bisa dikatakan tentang menulis Efek! Untungnya, ada daftar dari cara umum yang bisa Anda coba di bawah ini.

<Pitfall>

Jika Anda memiliki basis kode yang sudah ada, Anda mungkin memiliki beberapa Efek yang menekan *linter* seperti ini:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Hindari menekan linter seperti ini:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Ketika dependensi tidak sesuai dengan kode, ada risiko yang sangat tinggi memunculkan bug** Dengan menekan *linter*, Anda "bohong" kepada React tentang nilai yang bergantung pada Efek Anda.

Sebagai gantinya, gunakan teknik di bawah ini.

</Pitfall>

<DeepDive>

#### Mengapa menekan linter dependensi sangat berbahaya? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}


Menekan *linter* menyebabkan bug yang sangat tidak intuitif yang sulit ditemukan dan diperbaiki. Berikut salah satu contohnya:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Pencacah: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Setiap detik, kenaikan sebesar:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Katakanlah Anda ingin menjalankan Efek "hanya saat mount". Anda telah membaca [ (`[]`) dependensi kosong](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) melakukannya, jadi Anda memutuskan untuk mengabaikan *linter*, dan dengan paksa menentukan `[]` sebagai dependensi.

Pencacah ini seharusnya bertambah setiap detik dengan jumlah yang dapat dikonfigurasi dengan 2 tombol. Namun, karena Anda "berbohong" kepada React bahwa Efek ini tidak bergantung pada apa pun, React selamanya akan tetap menggunakan fungsi `onTick` dari render awal. [Selama render tersebut,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` adalah `0` and `increment` adalah `1`. Inilah mengapa `onTick` dari render tersebut selalu memanggil `setCount(0 + 1)` setiap, dan Anda selalu melihat `1`. Bug seperti ini sulit untuk diperbaiki ketika tersebar dibeberapa komponen.

Selalu ada solusi yang lebih baik daripada mengabaikan *linter*! Untuk memperbaiki kode ini, Anda perlu menambahkan `onTick` ke dalam daftar dependensi. (Untuk memastikan interval hanya disetel sekali, [buat `onTick` sebagai Event Efek.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**Sebaiknya perlakukan eror lint dependensi sebagai eror kompilasi. Jika Anda tidak menekannya, Anda tidak akan pernah melihat eror seperti ini.** Sisa dari halaman ini mendokumentasikan untuk kasus ini dan kasus lainnya.

</DeepDive>

## Menghapus dependensi yang tidak perlu {/*removing-unnecessary-dependencies*/}

Setiap kali Anda mengatur dependensi Efek untuk merefleksikan kode, lihat pada daftar dependensi. Apakah masuk akal jika Efek dijalankan ulang ketika salah satu dependensi ini berubah? Terkadang, jawabannya adalah "tidak":

* Anda mungkin ingin menjalankan kembali *bagian yang berbeda* dalam kondisi yang berbeda.
* Anda mungkin ingin hanya membaca *nilai terbaru* dari beberapa dependensi alih-alih "bereaksi" terhadap perubahannya.
* Sebuah dependensi dapat berubah terlalu sering *secara tidak sengaja* karena merupakan objek atau fungsi.

Untuk menemukan solusi yang tepat, Anda harus menjawab beberapa pertanyaan tentang Efek Anda. Mari kita telusuri pertanyaan-pertanyaan tersebut.

### Haruskah kode ini dipindahkan ke event handler? {/*should-this-code-move-to-an-event-handler*/}

Hal pertama yang harus Anda pikirkan adalah apakah kode ini harus menjadi Efek atau tidak.

Bayangkan sebuah formlir. Ketika dikirim, Anda mengatur variabel *state* `submitted` menjadi `true`. Anda perlu mengirim permintaan POST dan menampilkan notifikasi. Anda telah memasukkan logika ini ke dalam Efek yang "bereaksi" terhadap `submitted` yang bernilai `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Hindari: Logika Event-specific di dalam Efek
      post('/api/register');
      showNotification('Berhasil mendaftar!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Kemudian, Anda ingin menyesuaikan pesan notifikasi sesuai dengan tema saat ini, sehingga Anda membaca tema saat ini. Ketika `theme` dideklarasikan di badan komponen, tema merupakan nilai reaktif, jadi Anda menambahkannya sebagai dependensi:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Hindari: Logika Event-specific di dalam Efek
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ Semua dependensi dideklarasikan

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

Dengan melakukan hal ini, Anda telah memunculkan *bug*. Bayangkan Anda mengirimkan formulir terlebih dahulu kemudian beralih antara tema Gelap dan Terang. `theme` akan berubah, Efek akan berjalan kembali, sehingga akan menampilkan notifikasi yang sama lagi!

**Masalahnya di sini adalah ini seharusnya tidak menjadi Efek sejak awal.** Anda ingin mengririm permintaan POST tersebut dan menampilkan notifikasi sebagai respon atas *pengiriman formulir,* yang merupakan interaksi tertentu. Untuk menjalankan beberapa kode sebagai respon terhadap interaksi tertentu, letakkan logika tersebut langsung ke dalam *event handler* yang sesuai:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Baik: Logika Event-specific dipanggil dari event handler
    post('/api/register');
    showNotification('Berhasil mendaftar!', theme);
  }  

  // ...
}
```

Sekarang kode tersebut berada di dalam *event handler*, kode tersebut tidak reaktif--jadi itu hanya akan berjalan saat pengguna mengirimkan formulir. Baca slebih lanjut tentang [memilih antara event handlers dan Efek](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) dan [cara menghapus Efrk yang tidak perlu.](/learn/you-might-not-need-an-effect)

### Apakah Efek Anda melakukan beberapa hal yang tidak terkait? {/*is-your-effect-doing-several-unrelated-things*/}

Pertanyaan berikutnya yang harus Anda tanyakan pada diri sendiri adalah apakah Efek Anda melakukan beberapa hal yang tidak berhubungan.

Bayangkan Anda membuat formulir pengiriman di mana pengguna perlu memilih kota dan wilayah mereka. Anda mengambil daftar `cities` dari server sesuai dengan `country` yang dipilih untuk menampilkannya dalam menu *dropdown*:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ Semua dependensi dideklarasikan

  // ...
```

Ini adalah contoh yang baik untuk [mengambil data dari Efek.](/learn/you-might-not-need-an-effect#fetching-data) Anda menyinkronkan *state* `cities` dengan jaringan sesuai dengan *props* `country`. Anda tidak dapat melakukan hal ini di dalam *event handler* karena Anda harus mengambil data segera setelah `ShippingForm` ditampilkan dan setiap kali `country` berubah (tidak peduli interaksi mana yang menyebabkannya).

Sekarang katakanlah Anda menambahkan kotak pilihan kedua untuk area kota, yang akan mengambil `areas` untuk `city` yang sedang dipilih. Anda dapat memulai dengan menambahkan panggilan `fetch` kedua untuk daftar area di dalam Efek yang sama:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Hindari: Satu Efek menyinkronkan dua proses independen
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ Semua dependensi dideklarasikan

  // ...
```

Namun, karena Efek sekarang menggunakan variabel *state* `city`, nda harus menambahkan `city` ke dalam daftar dependensi. Hal ini, pada akhirnya, menimbulkan masalah: ketika pengguna memilih kota yang berbeda, Efek akan menjalankan ulang dan memanggil  `fetchCities(country)`. Akibatnya, Anda akan mengambil ulang daftar kota berkali-kali.

**Masalah dengan kode ini adalah Anda menyinkronkan dua hal berbeda yang tidak berhubungan:**

1. Anda ingin menyinkronkan *state* `cities` ke jaringan berdasarkan *prop* `country`.
1. Anda ingin menyinkronkan *state* `areas` ke jaringan berdasarkan *prop* `city`.

Membagi logika menjadi dua Efek, yang masing-masing bereaksi terhadap *prop* yang perlu disinkronkan:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ Semua dependensi dideklarasikan

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Sekarang, Efek pertama hanya akan berjalan kembali jika `country` berubah, sedangkan Efek kedua akan berjalan kembali jika `city` berubah. Anda telah memisahkannya dengan tujuan: dua hal yang berbeda disinkronkan oleh dua Efek yang terpisah. Dua Efek yang terpisah memiliki dua daftar dependensi yang terpisah, jadi keduanya tidak akan memicu satu sama lain secara tidak sengaja.

Kode akhir lebih panjang dari aslinya, tetapi pemisahan Efek ini masih benar. [Setiap Efek harus mewakili proses sinkronisasi independen.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) Dalam contoh ini, menghapus satu Efek tidak merusak logika Efek lainnya. Ini berarti mereka *menyinkronkan hal-hal yang berbeda,* dan akan lebih baik jika dipisahkan. Jika Anda khawatir tentang duplikasi, Anda dapat mengembangkan kode ini dengan [mengekstrak logika berulang ke dalam Hook khusus.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Apakah Anda membaca beberapa state untuk menghitung state berikutnya? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Efek ini memperbarui variabel *state* `messages` dengan senarai yang baru dibuat setiap kali ada pesan baru yang masuk:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

Ini menggunakan variabel `messages` untuk [membuat senarai baru](/learn/updating-arrays-in-state) yang dimulai dengan semua pesan yang ada dan menambahkan pesan baru di bagian akhir. Namun, karena `messages` adalah nilai reaktif yang dibaca oleh Efek, maka itu harus menjadi sebuah dependensi:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Dan menjadikan `messages` sebagai dependensi akan menimbulkan masalah.

Setiap kali Anda menerima pesan, `setMessages()` menyebabkan komponen di-*render* ulang dengan senarai `messages` baru yang memuat pesan yang diterima. Namun, karena Efek ini bergantung pada `messages`, ini *juga* akan menyinkronkan ulang Efek. Jadi setiap pesan baru akan membuat obrolan terhubung kembali. Pengguna tidak akan menyukai hal itu!

Untuk memperbaiki masalah ini, jangan membaca `messages` di dalam Efek. Sebagai gantinya, berikan [fungsi updater](/reference/react/useState#updating-state-based-on-the-previous-state) untuk `setMessages`:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Semua dependensi dideklarasikan
  // ...
```

**Perhatikan bagaimana Efek Anda tidak membaca variabel `messages` sama sekali sekarang.** Anda hanya perlu mengoper fungsi updater seperti `msgs => [...msgs, receivedMessage]`. React [menaruh fungsi updater Anda dalam antrian](/learn/queueing-a-series-of-state-updates) dan akan memberikan argumen `msgs` kepada fungsi tersebut pada saat *render* berikutnya. Inilah sebabnya mengapa Efek sendiri tidak perlu bergantung pada `messages` lagi. Dengan adanya perbaikan ini, menerima pesan obrolan tidak lagi membuat obrolan tersambung kembali.

### Apakah Anda ingin membaca nilai tanpa "bereaksi" terhadap perubahannya? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

Bagian ini menjelaskan **API experimental yang belum dirilis** dalam versi stabil React.

</Wip>

Misalkan Anda ingin memainkan bunyi saat pengguna menerima pesan baru kecuali `isMuted` bernilai `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Karena Efek Anda sekarang menggunakan `isMuted` dalam kodenya, Anda harus menambahkannya dalam dependensi:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Masalahnya adalah setiap kali `isMuted` berubah (misalnya, saat pengguna menekan tombol "Muted"), Efek dakan menyinkronkan ulang, dan menghubungkan kembali ke obrloan. Ini bukan *user experience* yang diinginkan! (Dalam contoh ini, bahkan menonaktifkan *linter* pun tidak akan berhasil--jika Anda melakukannya, `isMuted` akan "terjebak" dengan nilai sebelumnya.)

Untuk mengatasi masalah ini, Anda perlu mengekstrak logika yang seharusnya tidak reaktif dari Efek. Anda tidak ingin Efek ini "bereaksi" terhadap perubahan dari `isMuted`. [Pindahkan logika non-reaktif ini ke dalam Event Efek:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Event Efek memungkinkan Anda membagi Efek menjadi bagian reaktif (yang seharusnya "bereaksi" terhadap nilai reaktif seperti `roomId` dan perubahannya) dan bagian non-reaktif (yang hanya membaca nilai terbarunya, seperti `onMessage` membaca `isMuted`). **Sekarang setelah Anda membaca `isMuted` di dalam Event Efek, ia tidak perlu menjadi dependensi Efek Anda.** Hasilnya, obrolan tidak akan tehubung kembali saat Anda men-*toggle* pengaturan "Dibisukan", dan menyelesaikan masalah aslinya!

#### Membungkus event handler dari props {/*wrapping-an-event-handler-from-the-props*/}

Anda mungkin mengalami masalah yang sama ketika komponen Anda menerima event handler sebagai prop:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Misalkan komponen induk meneruskan fungsi `onReceiveMessage` *yang berbeda* pada setiap render:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Karena `onReceiveMessage` adalah sebuah dependensi, ini akan menyebabkan Efek untuk menyinkronkan ulang setelah setiap induk dirender ulang. Hal ini akan membuat terhubung kembali ke obrolan. Untuk mengatasi ini, bungkus panggilan tersebut dalam sebuah Event Efek:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Event Efek tidak reaktif, jadi Anda tidak perlu menetapkannya sebagai dependensi. Hasilnya, obrolan tidak akan terhubung kembali meskipun komponen induk meneruskan fungsi yang berbeda pada setiap render ulang.

#### Memisahkan kode reaktif dan non-reaktif {/*separating-reactive-and-non-reactive-code*/}

Dalam contoh ini, Anda ingin mencatat kunjungan setiap kali `roomId` berubah. Anda ingin memasukkan `notificationCount` saat ini dengan setiap *log*, namun Anda *tidak* ingin perubahan `notificationCount` memicu *log event*.

Solusinya adalah sekali lagi membagi kode non-reaktif menjadi Event Efek:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ Semua dependensi dideklarasikan
  // ...
}
```

Anda ingin logika Anda menjadi reaktif terhadap `roomId`, sehingga Anda membaca `roomId` di dalam Efek Anda. Nmaun, Anda tidak ingin perubahan pada `notificationCount` untuk mencatat kunjungan tambahan, jadi Anda membaca `notificationCount` di dalam Event Efek. [Pelajari lebih lanjut tentang membaca *props* dan *state* dari Efek menggunakan Event Efek.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### Apakah beberapa nilai reaktif berubah secara tidak sengaja {/*does-some-reactive-value-change-unintentionally*/}

Terkadang, Anda *ingin* Efek Anda "beraksi" terhadap nilai tertentu, tetapi nilai tersebut berubah lebih sering daripada yang Anda inginkan--dan mungkin tidak mencerminkan perubahan yang sebenarnya dari sudut pandang pengguna. For example, Sebagai contoh, katakanlah Anda membuat objek `options` dalam badan komponen Anda, dan kemudian membaca objek tersebut dari dalam Efek Anda:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Objek ini dideklarasikan di dalam badan komponen, jadi ini adalah [nilai reaktif.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)  Ketika Anda membaca nilai reaktif seperti ini di dalam Efek, Anda mendeklarasikannya sebagai dependensi. Hal ini memastikan Efek Anda "bereaksi" terhadap perubahannya:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Penting untuk mendeklarasikannya sebagai dependensi, Hal ini memastikan, misalnya, jika `roomId` berubah, Efek Anda akan terhubung kembali dengan `options` baru. Namun, ada juga masalah dengan kode di atas. Untuk melihatnya, coba ketik masukan di *sandbox* di bawah ini, dan lihat apa yang terjadi di konsol:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Nonaktifkan linter untuk sementara guna mendemonstrasikan masalahnya
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Selamat datang di ruang {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Pilih ruang obrolan:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">umum</option>
          <option value="travel">travel</option>
          <option value="music">musik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  return {
    connect() {
      console.log('✅ Menghubungkan ke ruang "' + roomId + '" pada ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Terputus dari ruang "' + roomId + '" pada ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Pada sandbox di atas, masukan hanya akan memperbarui variabel *state* `message`. Dari sudut pandang pengguna, hal ini seharusnya tidak mempengaruhi koneksi obrolan. Namun, setiap kali Anda memperbarui `message`, komponen Anda akan di-*render* ulang. Saat kompenen Anda di-*render* ulang, kode di dalamnya akan berjalan lagi dari awal.

Objek `options` baru dibuat dari awal pada setiap *render* ulang komponen `ChatRoom`. React melihat bahwa objek `options` adalah *objek yang berbeda* dari objek `options` yang dibuat pada *render* terakhir. Inilah mengapa React melakukan sinkronisasi ulang pada Efek Anda (yang bergantung pada `options`), dan obrolan akan tersambung kembali setelah Anda mengetik.

**Masalah ini hanya mempengaruhi objek dan fungsi. Dalam JavaScript, setiap objek dan fungsi yang baru dibuat dianggap berbeda dari yang lainnya. Tidak masalah jika isi di dalamnya mungkin sama!**

```js {7-8}
// Selama render pertama
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Selama render berikutnya
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Ini adalah dua objek yang berbeda!
console.log(Object.is(options1, options2)); // false
````

**Dependensi objek dan fungsi dapat membuat Efek Anda melakukan sinkronisasi ulang lebih sering daripada yang Anda perlukan.**

Inilah sebabnya mengapa, jika memungkinkan, Anda harus mencoba menghindari objek dan fungsi sebagai dependensi Efek Anda. Sebagai gantinya, cobalah memindahkannya di luar komponen, di dalam Efek, atau mengekstrak nilai primitif dari komponen tersebut.

#### Memindahkan objek dan fungsi statis di luar komponen Anda {/*move-static-objects-and-functions-outside-your-component*/}

Jika objek tidak bergantung pada *props* dan *state* apa pun, Anda dapat memindahkan objek tersebut di luar komponen Anda:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Semua dependensi dideklarasikan
  // ...
```

Dengan cara ini, Anda *membuktikan* kepada *linter* bahwa itu tidak reaktif. Ini tidak dapat berubah sebagai hasil dari *render* ulang, jadi tidak perlu menjadi dependensi. Sekarang me-*render* ulang `ChatRoom` tidak akan menyebabkan Efek Anda melakukan sinkronisasi ulang.

Ini juga berlaku untuk fungsi:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Semua dependensi dideklrasikan
  // ...
```

Karena `createOptions` dideklarasikan di luar komponen Anda, ini bukan nilai reaktif. Inilah sebabnya mengapa ia tidak perlu ditentukan dalam dependensi Efek Anda, dan mengapa ia tidak akan menyebabkan Efek Anda melakukan sinkronisasi ulang.

#### Memindahkan objek dan fungsi dinamis di dalam Efek Anda {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Jika objek Anda bergantung pada beberapa nilai reaktif yang dapat berubah sebagai hasil dari *render* ulang, seperti *prop* `roomId`, Anda tidak dapat menariknya *ke luar* komponen Anda. Namun, Anda dapat memindahkan pembuatannya *di dalam* kode Efek Anda:

```js {7-10,11,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Sekarang `options` dideklarasikan di dalam Efek Anda, tidak lagi menjadi dependensi dari Efek Anda. Sebaliknya, satu-satunya nilai reaktif yang digunakan oleh Efek Anda adalah `roomId`. Karena `roomId` bukan objek atau fungsi, Anda dapat yakin bahwa itu tidak akan *berbeda secara tidak sengaja*. Dalam JavaScript, *numbers* dan *string* dibandingkan berdasarkan isinya:

```js {7-8}
// Selama render pertama
const roomId1 = 'music';

// Selama render berikutnya
const roomId2 = 'music';

// Kedua string ini sama!
console.log(Object.is(roomId1, roomId2)); // true
````

Berkat perbaikan ini, obrolan tidak lagi terhubung kembali jika Anda mengedit masukan:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Selamat datang di ruang {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Pilih ruang obrolan:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">umum</option>
          <option value="travel">travel</option>
          <option value="music">musik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  return {
    connect() {
      console.log('✅ Menghubungkan ke ruang "' + roomId + '" pada ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Terputus dari ruang "' + roomId + '" pada ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Namun, ini *akan* terhubung kembali ketika Anda mengubah *dropdown* `roomId`, seperti yang Anda harapkan.

Hal ini juga berlaku untuk fungsi-fungsi lainnya:

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Anda dapat menulis fungsi Anda sendiri untuk mengelompokkan bagian logika di dalam Efek Anda. Selama Anda juga mendeklarasikannya *di dalam* Efek Anda, mereka bukan nilai reaktif, sehingga tidak perlu menjadi dependensi dari Efek Anda.

#### Membaca nilai primitif dari objek {/*read-primitive-values-from-objects*/}

Terkadang, Anda mungkin menerima objek dari *props*:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Risikonya di sini adalah komponen induk akan membuat objek selama *rendering*:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Hal ini akan menyebabkan Efek Anda terhubung kembali setiap kali komponen induk di-*render* ulang. Untuk mengatasinya, baca informasi dari objek *di luar* Efek, dan hindari dependensi objek dan fungsi:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Logikanya menjadi sedikit berulang (Anda membaca beberapa nilai dari objek di luar Efek, dan kemudian membuat objek dengan nilai yang sama di dalam Efek). Tetapi hal ini membuatnya sangat eksplisit tentang informasi apa yang *sebenarnya* bergantung pada Efek Anda. Jika sebuah objek dibuat ulang secara tidak sengaja oleh komponen induk, obrolan tidak akan tersambung kembali. Namun, jika `options.roomId` atau `options.serverUrl` benar-benar berbeda, obrolan akan tersambung kembali.

#### Menghitung nilai primitif dari fungsi {/*calculate-primitive-values-from-functions*/}

Pendekatan yang sama dapat digunakan untuk fungsi. Sebagai contoh, misalkan komponen induk meneruskan sebuah fungsi:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

Untuk menghindari menjadikannya dependensi (dan menyebabkannya terhubung kembali pada *render* ulang), panggil di luar Efek. Ini akan memberi Anda nilai `roomId` dan `serverUrl` yang bukan objek, dan Anda dapat membacanya dari dalam Efek:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Semua dependensi dideklarasikan
  // ...
```

Ini hanya berfungsi untuk fungsi [murni](/learn/keeping-components-pure) karena aman untuk dipanggil selama *rendering*. Jika fungsi Anda adalah sebuah *event handler*, tetapi Anda tidak ingin perubahannya menyinkronkan ulang Efek Anda, [bungkuslah menjadi sebuah Event Efek](#do-you-want-to-read-a-value-without-reacting-to-its-changes).

<Recap>

- Dependensi harus selalu sesuai dengan kodenya.
- Ketika Anda tidak puas dengan dependensi Anda, yang perlu Anda edit adalah kodenya.
- Menekan *linter* akan menyebabkan *bug* yang sangat membingungkan, dan Anda harus selalu menghindarinya.
- Untuk menghapus sebuah dependensi, Anda perlu "membuktikan" kepada *linter* bahwa dependensi tersebut tidak diperlukan.
- Jika beberapa kode harus berjalan sebagai respons terhadap interaksi tertentu, pindahkan kode tersebut ke *event handler*.
- Jika beberapa bagian dari Efek Anda harus dijalankan ulang karena alasan yang berbeda, pisahkan menjadi beberapa Efek.
- Jika Anda ingin memperbarui beberapa *state* berdasarkan *state* sebelumnya, berikan fungsi *updater*.
- Jika Anda ingin membaca nilai terbaru tanpa "bereaksi", ekstrak Event Efek dari Efek Anda.
- Dalam JavaScript, objek dan fungsi dianggap berbeda jika dibuat pada waktu yang berbeda.
- Cobalah untuk menghindari ketergantungan objek dan fungsi. Pindahkan mereka di luar komponen atau di dalam Efek.

</Recap>

<Challenges>

#### Memperbaiki interval pengaturan ulang {/*fix-a-resetting-interval*/}

Efek ini menetapkan interval yang berdetak setiap detik. Anda telah memperhatikan sesuatu yang aneh terjadi: sepertinya interval tersebut dihancurkan dan dibuat ulang setiap kali berdetak. Perbaiki kode sehingga interval tidak terus-menerus dibuat ulang.

<Hint>

Sepertinya kode Efek ini bergantung pada `count`. Apakah ada cara untuk tidak memerlukan dependensi ini? Seharusnya ada cara untuk memperbarui *state* `count` berdasarkan nilai sebelumnya tanpa menambahkan dependensi pada nilai tersebut.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Membuat interval');
    const id = setInterval(() => {
      console.log('⏰ Ketukan interval');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Membersihkan interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Pencacah: {count}</h1>
}
```

</Sandpack>

<Solution>

Anda ingin memperbarui *state* `count` menjadi `count + 1` dari dalam Efek. Namun, hal ini membuat Efek Anda bergantung pada `count`, yang berubah setiap kali ada ketukan, dan itulah mengapa interval Anda dibuat ulang setiap kali ada ketukan.

Untuk mengatasi hal ini, gunakan [fungsi updater](/reference/react/useState#updating-state-based-on-the-previous-state) dan tuliskan `setCount(c => c + 1)` bukan `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Membuat interval');
    const id = setInterval(() => {
      console.log('⏰ Ketukan interval');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Membersihkan interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Pencacah: {count}</h1>
}
```

</Sandpack>

Alih-alih membaca `count` di dalam Efek, Anda mengoper instruksi `c => c + 1` ("increment this number!") ke React. React akan menerapkannya pada *render* berikutnya. Dan karena Anda tidak perlu membaca nilai `count` di dalam Efek Anda lagi, maka Anda bisa membiarkan dependensi Efek Anda kosong (`[]`). Hal ini mencegah Efek Anda untuk membuat ulang interval pada setiap ketukan.

</Solution>

#### Memperbaiki animasi pemicu ulang {/*fix-a-retriggering-animation*/}

Dalam contoh ini, ketika Anda menekan "Tampilkan", pesan selamat datang akan menghilang. Animasi membutuhkan waktu beberapa detik. Ketika Anda menekan "Hapus", pesan selamat datang akan segera menghilang. Logika untuk animasi *fade-in* diimplementasikan di file `animation.js` sebagai [animasi perulangan.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) JavaScript biasa. Anda tidak perlu mengubah logika tersebut. Anda dapat memperlakukannya sebagai pustaka pihak ketiga. Efek Anda membuat sebuah *instance* `FadeInAnimation` untuk simpul DOM, lalu memanggil `start(duration)` atau `stop()` untuk mengontrol animasi. Durasi dikontrol oleh *silder*. Sesuaikan *silder* dan lihat bagaimana animasi berubah.

Kode ini sudah berfungsi, tetapi ada sesuatu yang ingin Anda ubah. Saat ini, saat Anda menggerakkan *slider* yang mengontrol variabel *state* `duration`, *slider* tersebut akan memicu ulang animasi. Ubah perilakunya sehingga Efek tidak "bereaksi" terhadap variabel `duration`. Saat Anda menekan "Tampilkan", Efek seharusnya menggunakan `duration` saat ini pada *silder*. Namun demikian, menggerakkan *slider* itu sendiri seharusnya tidak dengan sendirinya memicu ulang animasi.

<Hint>

Apakah ada baris kode di dalam Efek yang tidak boleh reaktif? Bagaimana cara memindahkan kode non-reaktif keluar dari Efek?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Selamat datang
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Durasi fade in: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Hapus' : 'Tampilkan'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Lompat ke akhir dengan segera
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Memulai animasi
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Kita masih memiliki lebih banyak bingkai untuk dilukis
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution>

Efek Anda perlu membaca nilai terbaru dari `duration`, tetapi Anda tidak ingin efek tersebut "bereaksi" terhadap perubahan dalam `suration`. Anda menggunakan `duration` untuk memulai animasi, tetapi memulai animasi tidak reaktif. Ekstrak baris kode non-reaktif ke dalam Event Efek, dan panggil fungsi itu dari Efek Anda.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Durasi fade in: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Hapus' : 'Tamoilkan'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Kita masih memiliki lebih banyak bingkai untuk dilukis
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

Event Efek seperti `onAppear` tidak reaktif, sehingga Anda dapat membaca `duration` di dalamnya tanpa memicu ulang animasi.

</Solution>

#### Memperbaiki obrolan yang tersambung kembali {/*fix-a-reconnecting-chat*/}

Dalam contoh ini, setiap kali Anda menekan "Alihkan tema", obrolan akan terhubung kembali. Mengapa hal ini terjadi? Perbaiki kesalahan tersebut sehingga obrolan terhubung kembali hanya jika Anda mengedit URL Server atau memilih ruang obrolan yang berbeda.

Perlakukan `chat.js` sebagai pustaka pihak ketiga eksternal: Anda dapat berkonsultasi untuk memeriksa API-nya, tetapi jangan mengeditnya.

<Hint>

Ada lebih dari satu cara untuk memperbaikinya, tetapi pada akhirnya Anda ingin menghindari memiliki objek sebagai dependensi Anda.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle tena
      </button>
      <label>
        URL Server:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Pilih ruang obrolan:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">umum</option>
          <option value="travel">travel</option>
          <option value="music">musik</option>
        </select>
      </label>
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Selamat datang di ruang {options.roomId}!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Menghubungkan ke ruang "' + roomId + '" pada ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Terputus dari ruang "' + roomId + '" pada ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Efek Anda dijalankan ulang karena bergantung pada objek `options`. Objek dapat dibuat ulang tanpa disengaja, Anda harus mencoba menghindarinya sebagai dependensi Efek Anda bila memungkinkan.

Perbaikan yang paling tidak invasif adalah dengan membaca `roomId` dan `serverUrl` tepat di luar Efek, dan kemudian membuat Efek bergantung pada nilai primitif tersebut (yang tidak dapat berubah secara tidak sengaja). Di dalam Efek, buat sebuah objek dan berikan ke `createConnection`:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle tema
      </button>
      <label>
        URL Server:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Pilih ruang obrolan:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">umum</option>
          <option value="travel">travel</option>
          <option value="music">musik</option>
        </select>
      </label>
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Selamat datang di ruang {options.roomId}!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Menghubungkan ke ruang "' + roomId + '" pada ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Terputus dari ruang "' + roomId + '" pada ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Akan lebih baik lagi jika mengganti *prop* objek `options` dengan *prop* `roomId` dan `serverUrl` yang lebih spesifik:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Pilih ruang obrolan:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">umum</option>
          <option value="travel">travel</option>
          <option value="music">musik</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Selamt datang di ruang {roomId}!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Menghubungkan ke ruang "' + roomId + '" pada ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Terputus dari ruang "' + roomId + '" pada ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>


Menggunakan *props* primitif bilamana memungkinkan, akan lebih mudah untuk mengoptimalkan komponen Anda nanti.

</Solution>

#### Memperbaiki obrolan yang tersambung kembali, lagi {/*fix-a-reconnecting-chat-again*/}

Contoh ini terhubung ke obrolan baik dengan atau tanpa enkripsi. *Toogle* kotak centang dan perhatikan pesan yang berbeda di konsol ketika enkripsi aktif dan nonaktif. Coba ubah ruangan. Kemudian, coba ganti tema. Ketika Anda terhubung ke ruang obrolan, Anda akan menerima pesan baru setiap beberapa detik. Pastikan warnanya sesuai dengan tema yang Anda pilih.

Dalam contoh ini, obrolan tersambung kembali setiap kali Anda mencoba mengubah tema. Perbaiki ini. Setelah diperbaiki, mengubah tema seharusnya tidak menyambungkan kembali obrolan, tetapi mengganti pengaturan enkripsi atau mengubah ruangan seharusnya menyambungkan kembali.

Jangan ubah kode apa pun di `chat.js`. Selain itu, Anda dapat mengubah kode apa pun selama kode tersebut menghasilkan perilaku yang sama. Sebagai contoh, Anda mungkin merasa terbantu dengan mengubah *props* mana yang diturunkan.

<Hint>

Anda mewariskan dua fungsi: `onMessage` dan `createConnection`. Keduanya dibuat dari awal setiap kali `Aplikasi` di-*render* ulang. Keduanya dianggap sebagai nilai baru setiap saat, dan itulah sebabnya mereka memicu ulang Efek Anda.

Salah satu dari fungsi ini adalah *event handler*. Apakah Anda tahu beberapa cara untuk memanggil *event handler* sebagai Efek tanpa "bereaksi" terhadap nilai baru dari fungsi *event handler*? Itu akan sangat berguna!

Fungsi lain dari fungsi ini hanya ada untuk mengoper beberapa *state* ke metode API yang diimpor. Apakah fungsi ini benar-benar diperlukan? Apa informasi penting yang diturunkan? Anda mungkin perlu memindahkan beberapa impor dari `App.js` ke `ChatRoom.js`.

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Gunakan tema gelap
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Aktifkan enkripsi
      </label>
      <label>
        Pilih ruang obrolan:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">umum</option>
          <option value="travel">travel</option>
          <option value="music">musik</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Selamat datang di ruang {roomId}!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Menghubungkan ke ruang "' + roomId + '" ... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Terputus dari ruang "' + roomId + '" (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Menghubungkan ke ruang "' + roomId + '" (unencrypted)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Terputus dari ruang "' + roomId + '" (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

To fix the problem with `onMessage`, you needed to wrap it into an Event Efek:

Ada lebih dari satu cara yang benar untuk mengatasi hal ini, tetapi berikut ini adalah salah satu solusi yang mungkin.

Pada contoh asli, mengganti tema menyebabkan fungsi `onMessage` dan `createConnection` yang berbeda dibuat dan diturunkan. Karena Efek bergantung pada fungsi-fungsi ini, obrolan akan tersambung kembali setiap kali Anda mengganti tema.

Untuk memperbaiki masalah pada `onMessage`, Anda perlu membungkusnya menjadi sebuah Event Efek:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Tidak seperti *prop* `onMessage`, Event Efek `onReceiveMessage` tidak bersifat reaktif. Inilah sebabnya mengapa ia tidak perlu menjadi dependensi Efek Anda. Akibatnya, perubahan pada `onMessage` tidak akan menyebabkan obrolan tersambung kembali.

Anda tidak dapat melakukan hal yang sama dengan `createConnection` karena ia *harus* reaktif. Anda *ingin* Efeknya terpicu kembali jika pengguna beralih antara koneksi terenkripsi dan tidak terenkripsi, atau jika pengguna berpindah ruangan. Namun, karena `createConnection` adalah sebuah fungsi, Anda tidak dapat memeriksa apakah informasi yang dibacanya telah *benar-benar* berubah atau tidak. Untuk mengatasi hal ini, alih-alih meneruskan `createConnection` dari komponen `App`, berikan nilai mentah `roomId` dan `isEncrypted`:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Sekarang Anda dapat memindahkan fungsi `createConnection` ke dalam Efek alih-alih meneruskannya dari `App`:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

Setelah kedua perubahan ini, Efek Anda tidak lagi bergantung pada nilai fungsi apa pun:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Nilai reaktif
  const onReceiveMessage = useEffectEvent(onMessage); // Tidak reaktif

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Membaca nilai reaktif
      };
      if (isEncrypted) { // Membaca nilai reaktif
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ Semua dependensi dideklarasikan
```

Hasilnya, obrolan akan tersambung kembali hanya jika ada sesuatu yang berarti (`roomId` atau `isEncrypted`) berubah:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Gunakan tema gelap
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Hidupkan enkripsi
      </label>
      <label>
        Pilih ruang obrolan:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Selamat datang di ruang {roomId}!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Mengubungkan ke ruang "' + roomId + '" ... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Terputus dari ruang "' + roomId + '" (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Terputus dari ruang "' + roomId + '" (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
