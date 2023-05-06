---
title: useCallback
---

<Intro>

`useCallback` adalah sebuah React Hook yang memungkinkan Anda untuk meng-*cache* sebuah definisi fungsi diantara *render* ulang.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Panggil fungsi `useCallback` di tingkat atas komponen Anda untuk meng-*cache* sebuah definisi fungsi diantara *render* ulang:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[Lihat contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `fn`: Nilai fungsi yang ingin Anda simpan dalam *cache*. ini dapat menerima argumen apa saja dan mengembalikan nilai apa saja. React akan mengembalikan (tidak memanggil!) fungsi Anda kembali kepada Anda selama *render* awal. Pada *render* selanjutnya, React akan memberikan fungsi yang sama kepada Anda lagi jika `dependencies` tidak berubah sejak *render* sebelumnya. Jika tidak, itu akan memberi Anda fungsi yang telah Anda lewati selama *render* saat ini, dan menyimpannya jika nanti dapat digunakan kembali. React tidak akan memanggil fungsi Anda. Fungsi tersebut dikembalikan kepada Anda agar Anda bisa memutuskan kapan dan apakah akan memanggilnya.

* `dependencies`: Daftar dari semua nilai yang bersifat reaktif yang direferensikan di dalam kode `fn`. Nilai-nilai reaktif termasuk *props*, *state*, dan semua variabel dan fungsi yang dideklarasikan langsung di dalam badan komponen. Jika *linter* Anda adalah [dikonfigurasi untuk React](/learn/editor-setup#linting), *linter* akan memverifikasi bahwa setiap nilai reaktif telah ditentukan dengan benar sebagai dependensi. Daftar dependensi harus memiliki jumlah item yang konstan dan ditulis dalam sebaris seperti `[dep1, dep2, dep3]`. React akan membandingkan setiap dependensi dengan nilainya yang sebelumnya menggunakan algoritma perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Pengembalian {/*returns*/}

Pada *render* awal, `useCallback` mengembalikan fungsi `fn` yang telah Anda lewati.

Selama *render* berikutnya, useCallback akan mengembalikan fungsi `fn` yang sudah tersimpan dari *render* terakhir (jika dependensi tidak berubah), atau mengembalikan fungsi `fn` yang telah Anda lewati selama *render* ini.

#### Catatan Penting {/*caveats*/}

* `useCallback` adalah sebuah Hook, jadi Anda hanya dapat memanggil useCallback **di tingkat atas komponen Anda** atau Hooks yang Anda buat sendiri. Anda tidak dapat memanggil useCallback di dalam *looping* atau kondisi. Jika Anda membutuhkannya, ekstrak komponen baru dan pindahkan *state* ke dalamnya.
* React **tidak akan membuang fungsi yang sudah di-*cache* kecuali ada alasan khusus untuk melakukannya.** Sebagai contoh, pada saat pengembangan, React akan membuang *cache* ketika Anda mengedit *file* komponen Anda. Baik pada saat pengembangan maupun produksi, React akan membuang *cache* jika komponen Anda menunda (*suspend*) selama *mounting* awal. Di masa depan, React mungkin akan menambahkan fitur-fitur baru yang memanfaatkan pembuangan *cache*--Sebagai contoh, jika React menambahkan dukungan bawaan untuk *virtualized lists* di masa depan, maka masuk akal untuk membuang *cache* untuk *item* yang keluar dari *virtualized table viewport* tersebut. Hal ini seharusnya sesuai dengan ekspektasi Anda, Jika Anda mengandalkan `useCallback` sebagai optimasi kinerja. Jika tidak, sebuah [state variable](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) atau sebuah [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) mungkin lebih sesuai.

---

## Penggunaan {/*usage*/}

### Melewati proses render ulang sebuah Komponen {/*skipping-re-rendering-of-components*/}

ketika Anda mengoptimalkan kinerja *rendering*, Anda terkadang perlu meng-*cache* fungsi yang Anda berikan ke komponen turunan. Dan kemudian, Mari kita lihat terlebih dahulu sintaksisnya, lalu kita akan melihat dalam kasus mana ini berguna.

untuk meng-*cache* sebuah fungsi antara *render* ulang dari komponen Anda, bungkus definisi fungsi Anda ke dalam Hook `useCallback`:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Anda harus oper dua hal ke dalam `useCallback`:

1. Sebuah definisi fungsi yang ingin Anda *cache* diantara *render* ulang.
2. Sebuah <CodeStep step={2}>list dependensi</CodeStep> termasuk setiap nilai yang ada di dalam komponen Anda yang digunakan dalam fungsi Anda.

Pada saat *render* awal, <CodeStep step={3}>fungsi yang dikembalikan</CodeStep> yang akan anda dapatkan dari `useCallback` akan menjadi fungsi yang anda operkan.

Pada *render* berikutnya, React akan membandingkan <CodeStep step={2}>dependensi</CodeStep> dengan dependensi yang Anda operkan selama *render* sebelumnya. Jika tidak ada dependensi yang berubah (bandingkan dengan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` akan mengembalikan fungsi yang sama seperti sebelumnya. Jika tidak, `useCallback` akan mengembalikan fungsi yang telah Anda operkan di *render* ini.

Dengan kata lain, `useCallback` meng-*cache* sebuah fungsi diantara *render* ulang sampai dependesi itu berubah.

**Mari kita lihat contoh untuk melihat kapan ini berguna.**

katakan jika Anda mengoper fungsi `handleSubmit` di dalam `ProductPage` ke komponen `ShippingForm`:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

Anda akan menyadari bahwa mengganti nilai *prop* `theme` membuat aplikasi terasa berhenti sejenak, tapi jika Anda hapus `<ShippingForm />` dari JSX Anda, itu akan terasa lebih cepat. ini memberitahu Anda bahwa itu layak dicoba untuk optimasi komponen `ShippingForm`.

**Secara *default*, ketika sebuah komponen melakukan *render* ulang, React akan melakukan *render* ulang pada seluruh komponen turunannya secara rekursif** inilah kenapa, ketika `ProductPage` *render* ulang dengan `theme` berbeda, komponen `ShippingForm` juga *render* ulang. Ini bagus untuk komponen yang tidak memerlukan banyak perhitungan untuk *render* ulang. tapi jika anda telah memverifikasi bahwa *render* ulang itu lambat, Anda dapat memberitahu `ShippingForm` untuk melewati *render* ulang ketika *props* itu sama seperti *render* sebelumnya dengan cara bungkus itu di dalam [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**Dengan perubahan ini, `ShippingForm` akan melewati *rendering* ulang jika semua *props* itu sama seperti *render* sebelumnya.** inilah kenapa meng-*cache* sebuah fungsi menjadi penting! misalkan Anda mendefinisikan `handleSubmit` tanpa `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // setiap kali theme berubah, ini akan menjadi fungsi yang berbeda...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  
  return (
    <div className={theme}>
      {/* ... jadi prop ShippingForm tidak akan pernah sama, dan komponen tersebut akan selalu melakukan re-render setiap kali terjadi perubahan tema */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Di Javascript, `function () {}` atau `() => {}` akan selalu membuat sebuah fungsi _berbeda_,** serupa dengan bagaimana literal objek `{}` selalu membuat objek baru. Normalnya, ini tidak akan menjadi sebuah masalah, tetapi ini berarti bahwa *props* `ShippingForm` tidak akan pernah sama, dan optimasi [`memo`](/reference/react/memo) Anda tidak akan bekerja. disinilah `useCallback` berguna:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Beritahu React untuk meng-cache fungsi Anda diantara render ulang...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...selama dependensi tidak berubah...

  return (
    <div className={theme}>
      {/* ...ShippingForm akan menerima props yang sama dan dapat melewati render ulang */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Dengan membungkus `handleSubmit` dalam `useCallback`, Anda memastikan bahwa itu adalah fungsi yang sama antara setiap *render* ulang** (sampai dependensi berubah). Anda tidak harus bungkus sebuah fungsi dalam `useCallback` kecuali jika Anda melakukannya untuk beberapa alasan tertentu. Dalam contoh ini, alasannya adalah Anda oper itu ke komponen yang dibungkus dalam [`memo`,](/reference/react/memo) dan ini memungkinkannya untuk lewati *render* ulang. ada alasan lain mengapa Anda mungkin butuh `useCallback` yang dijelaskan lebih lanjut di halaman ini.

<Note>

**Anda sebaiknya hanya mengandalkan `useCallback` sebagai optimasi kinerja.** jika kode Anda tidak dapat bekerja tanpa itu, cari masalah yang mendasarinya dan perbaiki terlebih dahulu. Kemudian Anda dapat menambahkan `useCallback` kembali.

</Note>

<DeepDive>

#### Bagaimana useCallback terkait dengan useMemo? {/*how-is-usecallback-related-to-usememo*/}

Anda sering melihat [`useMemo`](/reference/react/useMemo) berdampingan `useCallback`. Mereka berdua berguna ketika Anda mencoba mengoptimalkan komponen turunan. mereka memungkinkan Anda [memoize](https://en.wikipedia.org/wiki/Memoization) (atau, dengan kata lain, *cache*) sesuatu yang Anda telah oper ke bawah:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Memanggil fungsi Anda dan menyimpan ke dalam cache
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // meng-cache fungsi itu sendiri
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

Perbedaannya terletak pada *apa* yang Anda simpan dalam *cache*:

* **[`useMemo`](/reference/react/useMemo) meng-*cache* *hasil* dari panggilan fungsi Anda.** Dalam contoh ini, itu meng-*cache* hasil pemanggilan fungsi `computeRequirements(product)` sehingga hasilnya tidak akan berubah kecuali `product` berubah. ini memungkinkan Anda untuk oper objek `requirements` tanpa perlu *render* ulang `ShippingForm`. Jika diperlukan, React akan memanggil fungsi yang telah Anda oper selama *rendering* untuk menghitung hasilnya.
* **`useCallback` meng-*cache* fungsi itu sendiri.** Berbeda dengan `useMemo`, itu tidak akan memanggil fungsi yang Anda berikan. Sebaliknya, itu akan meng-*cache* fungsi yang telah Anda berikan sehingga `handleSubmit` sendiri tidak akan berubah kecuali `productId` atau `referrer` telah berubah. Ini memungkinan Anda untuk oper fungsi `handleSubmit` ke bawah tanpa perlu *render* ulang `ShippingForm`. Kode Anda tidak akan dijalankan sampai pengguna mengirimkan formulir.

Jika Anda sudah terbiasa dengan [`useMemo`,](/reference/react/useMemo) Anda mungkin merasa terbantu dengan `useCallback` seperti ini:

```js
// implementasi sederhana (didalam React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Baca lebih lanjut perbedaan antara `useMemo` dan `useCallback`.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### Apakah Anda harus menambahkan useCallback dimana-mana? {/*should-you-add-usecallback-everywhere*/}

Jika aplikasi Anda seperti situs ini, dan sebagian besar interaksi bersifat kasar (seperti mengganti seluruh halaman atau sebagian), memoisasi biasanya tidak diperlukan. Di sisi lain, Jika aplikasi Anda seperti editor gambar, dan sebagian besar interaksi bersifat granular (seperti memindahkan bentuk), maka Anda mungkin menganggap memoisasi sangat membantu. 

Caching fungsi dengan `useCallback` hanya bermanfaat dalam beberapa kasus:

- Anda mengoper itu sebagai *prop* ke komponen yang dibungkus dalam [`memo`.](/reference/react/memo) Anda ingin melewatkan *rendering* ulang jika nilai tidak berubah. Memoisasi memungkinkan Anda me-*render* ulang hanya jika dependensi berubah.
- Fungsi yang Anda operkan nantinya digunakan sebagai dependensi dari suatu Hook. contoh, fungsi lain yang dibungkus dalam `useCallback` bergantung padanya, atau Anda bergantung pada fungsi ini dari  [`useEffect.`](/reference/react/useEffect)

Jika tidak ada manfaat dari membungkus sebuah fungsi dengan `useCallback` pada kasus lain. Tidak ada kerugian yang signifikan dari melakukan itu juga, sehingga beberapa tim memilih untuk tidak memikirkan kasus-kasus individu, dan memoize sebanyak mungkin. Kekurangannya adalah kode menjadi kurang mudah dibaca. Selain itu, tidak semua memoize efektif: sebuah nilai tunggal yang "selalu baru" sudah cukup untuk menghancurkan memoisasi untuk seluruh komponen.

Perhatikan bahwa `useCallback` tidak mencegah membuat fungsi. Anda selalu membuat fungsi (dan itu bagus!), tapi React akan mengabaikannya dan memberi Anda kembali fungsi yang sudah di-*cache* jika tidak ada yang berubah.

**Dalam praktiknya, Anda dapat menghindari penggunaan memoisasi yang berlebihan dengan mengikuti beberapa prinsip:**

1. Saat komponen membungkus komponen lain secara visual, biarkan [*accept JSX as children.*](/learn/passing-props-to-a-component#passing-jsx-as-children) Kemudian, jika komponen pembungkus memperbarui statenya sendiri, React tahu bahwa komponen-komponen turunan tidak perlu di-*render* ulang.
1. Gunakanlah state lokal dan jangan [*lift state up*](/learn/sharing-state-between-components) lebih dari yang diperlukan. Jangan menyimpan state sementara seperti formulir atau apakah suatu item dihover di bagian atas pohon komponen atau dalam pustaka *state* global.
1. jaga [logika *render* Anda murni.](/learn/keeping-components-pure) jika sebuah komponen *render* ulang menyebabkan masalah or menghasilkan beberapa visual *artifact* yang mencolok, itu adalah sebuah *bug* di dalam komponen Anda! Perbaiki *bug* alih-alih menambahkan memoisasi.
1. hindari [efek yang tidak perlu yang mengubah *state*](/learn/you-might-not-need-an-effect) 
Kebanyakan masalah performa dalam aplikasi React disebabkan oleh rantai pembaruan yang berasal dari efek yang menyebabkan komponen Anda di-*render* berulang-ulang.
1. Coba untuk [menghapus dependensi yang tidak diperlukan dari Efek.](/learn/removing-effect-dependencies) Sebagai contoh, daripada memoisasi, seringkali lebih sederhana untuk memindahkan beberapa objek atau fungsi ke dalam Efek atau di luar komponen.

Jika suatu interaksi masih terasa lambat, [gunakan *profiler React Developer Tools*](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) untuk melihat komponen mana yang paling diuntungkan dari memoisasi, dan tambahkan memoisasi jika diperlukan. Prinsip-prinsip ini membuat komponen Anda lebih mudah untuk didebug dan dipahami, sehingga baik untuk diikuti dalam semua kasus. Secara jangka panjang, kami sedang meneliti [melakukan memoisasi secara otomatis](https://www.youtube.com/watch?v=lGEMwh32soc) untuk menyelesaikan masalah ini sekali dan untuk selamanya.

</DeepDive>

<Recipes titleText="The difference between useCallback and declaring a function directly" titleId="examples-rerendering">

#### Melewati pengulangan *rendering* dengan `useCallback` dan `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

Dalam contoh ini, komponen `ShippingForm` **diperlambat dengan sengaja** agar Anda bisa melihat apa yang terjadi ketika komponen React yang Anda *render* benar-benar lambat. Cobalah untuk menambahkan nilai *counter* dan mengubah tema.

Meningkatkan *counter* terasa lambat karena memaksa `ShippingForm` yang melambat untuk *render* ulang. Ini diharapkan karena *counter* berubah, sehingga Anda perlu memperbarui pilihan pengguna di layar.

Selanjutnya, coba ubah tema. **Berkat `useCallback` bersama dengan [`memo`](/reference/react/memo), meskipun ada penundaan buatan, itu tetap cepat!** `ShippingForm` menghindari *render* ulang karena fungsi `handleSubmit` tidak berubah. fungsi `handleSubmit` tidak berubah karena kedua `productId` dan `referrer` (dependensi `useCallback` Anda) tidak berubah sejak *render* terakhir.

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Bayangkan ini mengirim permintaan...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Tidak melakukan apa-apa selama 500ms untuk mensimulasikan kode yang sangat lambat
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Selalu *render* ulang sebuah Komponen {/*always-re-rendering-a-component*/}

Dalam contoh ini, implementasi `ShippingForm` juga **disengaja diperlambat** agar Anda dapat melihat apa yang terjadi ketika suatu komponen React yang Anda *render* memang lambat. Cobalah untuk meningkatkan counter dan mengubah tema.

Berbeda dengan contoh sebelumnya, mengubah tema menjadi lambat juga pada contoh ini! Hal ini disebabkan karena **tidak ada pemanggilan `useCallback`  pada versi ini,** sehingga `handleSubmit` selalu menjadi fungsi baru, dan komponen `ShippingForm` yang melambat tidak dapat melewatkan proses *rendering*.

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Bayangkan ini mengirim permintaan...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Tidak melakukan apa-apa selama 500ms untuk mensimulasikan kode yang sangat lambat
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Catatan: <code>ShippingForm</code> di buat lambat secara sengaja!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


Namun, ini adalah kode yang sama **tanpa perlambatan buatan.** Apakah kurangnya `useCallback` terasa nyata atau tidak?

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Bayangkan ini mengirim permintaan...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


Seringkali, kode tanpa memoisasi berjalan dengan baik. Jika interaksi Anda cukup cepat, Anda tidak perlu memoisasi.

Dalam mempercepat aplikasi React, perlu diingat bahwa Anda perlu menjalankan React dalam mode produksi, menonaktifkan [*React Developer Tools*](/learn/react-developer-tools), dan menggunakan perangkat yang serupa dengan yang digunakan oleh pengguna aplikasi Anda agar mendapatkan pemahaman yang realistis tentang apa yang sebenarnya membuat aplikasi Anda menjadi lambat.

<Solution />

</Recipes>

---

### Mengupdate *state* dari callback yang telah dimemoisasi {/*updating-state-from-a-memoized-callback*/}

Terkadang, Anda mungkin perlu memperbarui *state* berdasarkan *state* sebelumnya dari sebuah *callback* yang dimemoisasi.

Fungsi `handleAddTodo` menyebutkan `todos` sebagai dependensi karena itu menghitung todos selanjutnya dari todos tersebut:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Anda biasanya ingin fungsi yang telah dimemoisasi memiliki sedikit dependensi. Ketika Anda membaca beberapa *state* hanya untuk menghitung *state* berikutnya, Anda dapat menghapus dependensi tersebut dengan cara memberikan [fungsi *updater*](/reference/react/useState#updating-state-based-on-the-previous-state) sebagai gantinya:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No need for the todos dependency
  // ...
```

Disini, bukannya menjadikan `todos`  sebagai dependensi dan membacanya di dalamnya, Anda memberikan instruksi tentang bagaimana untuk  memperbarui *state* (`todos => [...todos, newTodo]`) ke React. [Baca lebih lanjut tentang *updater functions*.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Mencegah Efek untuk terlalu sering dipicu {/*preventing-an-effect-from-firing-too-often*/}

Kadang-kadang, Anda mungkin ingin memanggil sebuah fungsi dari dalam sebuah [Effect:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

Hal ini menimbulkan masalah. [ Setiap nilai reaktif harus dideklarasikan sebagai dependensi dari *Effect* Anda.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) sebagai dependensi, itu akan membuat *Effect* Anda terus-menerus terhubung ulang ke ruang obrolan:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Masalah: dependensi ini akan berubah setiap render
  // ...
```

Untuk memecahkan masalah ini, Anda dapat membungkus fungsi yang perlu Anda panggil dari sebuah *Effect* dengan `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Hanya berubah ketika roomId berubah

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ hanya berubah ketika createOptions berubah
  // ...
```

Ini memastikan bahwa fungsi `createOptions` sama antara pengulangan *render* jika `roomId` sama. **Namun, lebih baik lagi untuk menghilangkan kebutuhan akan dependensi fungsi.** Pindahkan fungsi Anda ke dalam *Effect*:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ Tidak perlu menggunakan useCallback atau fungsi dependensi!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ hanya berubah ketika roomId berubah
  // ...
```

Sekarang kode Anda lebih sederhana dan tidak perlu `useCallback`. [Pelajari lebih lanjut tentang menghapus dependensi Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Mengoptimalkan sebuah *Custom Hook* {/*optimizing-a-custom-hook*/}

Jika Anda menulis [*custom Hook*,](/learn/reusing-logic-with-custom-hooks) disarankan untuk membungkus setiap fungsi yang dikembalikannya dengan `useCallback`:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

Ini memastikan bahwa pengguna dari Hook yang Anda buat dapat mengoptimalkan kode mereka sendiri jika diperlukan.

---

## Troubleshooting {/*troubleshooting*/}

### Setiap kali komponen saya di-*render*, `useCallback` mengembalikan fungsi yang berbeda {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Pastikan Anda telah menyebutkan senarai dependensi sebagai argumen kedua!

Jika Anda lupa untuk menyebutkan senarai dependensi, useCallback akan mengembalikan fungsi baru setiap kali:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Mengembalikan fungsi baru setiap kali: tidak ada senarai dependensi
  // ...
```

Ini adalah versi yang sudah diperbaiki dengan memberikan senarai dependensi sebagai argumen kedua:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Tidak mengembalikan fungsi baru tanpa alasan yang diperlukan
  // ...
```

Jika ini tidak membantu, maka masalahnya adalah setidaknya satu dari dependensi Anda berbeda dari *render* sebelumnya. Anda dapat melakukan *debugging* masalah ini dengan secara manual mencetak dependensi ke konsol:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

Anda dapat mengklik kanan pada senarai dari *render* yang berbeda di konsol, kemudian pilih "Simpan sebagai variabel *global*" untuk keduanya. Dalam asumsi bahwa yang pertama disimpan sebagai `temp1` dan yang kedua disimpan sebagai `temp2`, Anda kemudian dapat menggunakan konsol browser untuk memeriksa apakah setiap dependensi di kedua senarai tersebut sama:

```js
Object.is(temp1[0], temp2[0]); // Apakah dependensi pertama sama antara senarai-senarai tersebut?
Object.is(temp1[1], temp2[1]); // Apakah dependensi kedua sama antara senarai-senarai tersebut?
Object.is(temp1[2], temp2[2]); // ... dan seterusnya untuk setiap dependensi ...
```

Ketika Anda menemukan dependensi mana yang memecah memoisasi, entah cari cara untuk menghapusnya, atau [mememoisasi juga.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### Saya perlu memanggil `useCallback` untuk setiap *item* di dalam perulangan, tapi itu tidak diizinkan {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Misalkan komponen `Chart` dibungkus dengan [`memo`](/reference/react/memo). Anda ingin melewati pengulangan setiap `Chart` dalam daftar ketika komponen `ReportList` di *render* ulang. Namun, Anda tidak dapat memanggil `useCallback` dalam sebuah perulangan:

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Anda tidak dapat memanggil useCallback di dalam perulangan seperti ini:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Sebaliknya, buat komponen tersendiri untuk setiap *item*, dan tempatkan `useCallback` di sana:

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Panggil useCallback di level atas:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Anda juga bisa menghapus `useCallback` pada contoh terakhir dan sebaliknya mengganti `Report` itu sendiri dengan `memo`. Jika prop `item` tidak berubah, `Report` akan melewati proses *render* ulang sehingga `Chart` akan melewati proses *render* ulang juga:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
