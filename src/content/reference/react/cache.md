---
title: cache
---

<RSC>

<<<<<<< HEAD
`cache` hanya digunakan dengan [Komponen Server React](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).
=======
`cache` is only for use with [React Server Components](/reference/rsc/server-components).
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

</RSC>

<Intro>

`cache` memungkinkan Anda untuk melakukan *cache* pada hasil pengambilan atau komputasi data.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `cache(fn)` {/*cache*/}

Panggil `cache` di luar komponen apapun untuk membuat sebuah versi dari fungsi dengan *caching*.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

Saat `getMetrics` pertama kali dipanggil dengan `data`, `getMetrics` akan memanggil `calculateMetrics(data)` dan menyimpan hasilnya di dalam sebuah *cache*. Jika `getMetrics` dipanggil lagi dengan `data` yang sama, maka akan mengembalikan hasil yang telah ter-*cache* alih-alih memamggil `calculateMetrics(data)` lagi.

[Lihat lebih banyak contoh dibawah.](#usage)

#### Parameter {/*parameters*/}

- `fn`: Fungsi yang ingin Anda *cache* hasilnya. `fn` dapat meneriman argumen apapun dan mengembalikan nilai apapun.

#### Kembalian {/*returns*/}

`cache` mengembalikan versi ter-*cache* dari `fn` dengan tanda tangan tipe yang sama. Ia tidak memanggil `fn` dalam prosesnya.

Saat memanggil `cachedFn` dengan argumen yang diberikan, Pertama ia akan mengecek apakah terdapat nilai yang telah ter-*cache* sebelumnya. Jika nilai tersebut tersedia, maka kembalikan nilai tersebut. Jika tidak, panggil `fn` dengan argumen tersebut, simpan nilai tersebut di dalam *cache*, dan kembalikan nilai tersebut. Satu-satunya waktu `fn` dipanggil adalah ketika ada cache yang terlewat.

<Note>

Optimalisasi dari melakukan *cache* pada nilai kembalian berdasarkan masukkan dikenal sebagai [*memoization*](https://en.wikipedia.org/wiki/Memoization). Kita mengacu mengacu pada fungsi yang dikembalikan dari `cache` sebagai fungsi yang di-*memo*.

</Note>

#### Peringatan {/*caveats*/}

<<<<<<< HEAD
[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- React akan menginvalidasi *cache* untuk setiap fungsi yang di-*memo* untuk setiap permintaan server.
- Setiap pemanggil `cache` membentuk sebuah fungsi baru. Hal ini berarti, memanggil `cache` dengan fungsi yang sama berkali-kali akan mengembalikan fungsi ter-*memo* berbeda yang tidak berbagi *cache* yang sama
- `cachedFn` juga akan men-*cache* eror-eror. Jika `fn` melempar sebuah eror untuk sebuah argumen tertentu, Itu akan ter-*cache*, dan eror yang sama akan dilempar kembali saat `cachedFn` dipanggil dengan argumen yang sama tersebut.
- `cache` hanya dapat digunakan di [*Server Components*](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).
=======
- React will invalidate the cache for all memoized functions for each server request.
- Each call to `cache` creates a new function. This means that calling `cache` with the same function multiple times will return different memoized functions that do not share the same cache.
- `cachedFn` will also cache errors. If `fn` throws an error for certain arguments, it will be cached, and the same error is re-thrown when `cachedFn` is called with those same arguments.
- `cache` is for use in [Server Components](/reference/rsc/server-components) only.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

---

## Penggunaan {/*usage*/}

### Melakukan *cache* pada computasi mahal {/*cache-expensive-computation*/}

Gunakan `cache` untuk melwati pekerjaan yang berulang

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

<<<<<<< HEAD
Jika objek `user` yang sama di-*render* di `Profile` dan `TeamReport`, kedua komponen dapat berbagi pekerjaan dan hanya memanggil `calculateUserMetrics` sekali untuk `user` tersebut.

Asumsikan `Profile` di-*render* pertama kali. Ia akan memanggil <CodeStep step={1}>`getUserMetrics`</CodeStep>, dan mengecek apakah terdapat nilai yang ter-*cache* sebelumnya. Mengingat ini adalah pertama kalinya `getUserMetrics` dipanggil oleh `user` tersebut, maka akan terdapat sebuah *cache miss*. `getUserMetrics` kemudian akan memanggil `calculateUserMetrics` dengan `user` tersebut dan menyimpan hasil tersebut dalam sebuah *cache*.
=======
If the same `user` object is rendered in both `Profile` and `TeamReport`, the two components can share work and only call `calculateUserMetrics` once for that `user`.

Assume `Profile` is rendered first. It will call <CodeStep step={1}>`getUserMetrics`</CodeStep>, and check if there is a cached result. Since it is the first time `getUserMetrics` is called with that `user`, there will be a cache miss. `getUserMetrics` will then call `calculateUserMetrics` with that `user` and write the result to cache.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

Saat `TeamReport` me-*render* daftar `users`-nya dan menjangkau objek `user` yang sama, Ia akan memanggil <CodeStep step={2}>`getUserMetrics`</CodeStep> dan membaca hasilnya dari *cache*.

If `calculateUserMetrics` can be aborted by passing an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), you can use [`cacheSignal()`](/reference/react/cacheSignal) to cancel the expensive computation if React has finished rendering. `calculateUserMetrics` may already handle cancellation internally by using `cacheSignal` directly.

<Pitfall>

##### Memanggil fungsi ter-*memo* berbeda akan membaca dari *caches* yang berbeda. {/*pitfall-different-memoized-functions*/}

Untuk mengakses *cache* yang sama, komponen-komponen harus memanggil fungsi ter-*memo* yang sama.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Salah: Memanggil `cache` dalam komponent membentuk `getWeekReport` yang baru untuk setiap render
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Salah: `getWeekReport` hanya dapat diakses oleh komponen `Precipitation`.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

Pada contoh diatas, <CodeStep step={2}>`Precipitation`</CodeStep> dan <CodeStep step={1}>`Temperature`</CodeStep> masing-masing memanggil `cache` untuk membuat sebuah fungsi ter-*memo* baru dengan *cache look-up*-nya sendiri. Jika kedua komponen di-*render* untuk `cityData` yang sama, maka mereka akan menduplikat pekerjaannya untuk memanggil `calculateWeekReport`.

Sebagai tambahan, `Temperature` membentuk sebuah <CodeStep step={1}>fungsi ter-*memo* baru</CodeStep> setiap kali komponen ter-*render* yang tidak memperbolehkannya untuk berbagi *cache*.

Untuk memaksimalkan *cache* dan mengurangi pekerjaan, kedua komponen tersebut harus memanggil fungsi ter-*memo* yang sama untuk mengakses *cache* yang sama. kedua komponen harus memanggil fungsi memo yang sama untuk mengakses cache yang sama. Sebagai gantinya, tentukan fungsi ter-*memo* dalam modul khusus yang dapat [`impor`-ed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) di seluruh komponen.

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```
<<<<<<< HEAD
Disini, kedua komponen memanggil <CodeStep step={3}>fungsi ter-*memo* sama</CodeStep> yang diekspor dari `./getWeekReport.js` untuk membaca dan menulis pada *cache* yang sama.
=======
Here, both components call the <CodeStep step={3}>same memoized function</CodeStep> exported from `./getWeekReport.js` to read and write to the same cache.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1
</Pitfall>

### Membagikan cuplikan data {/*take-and-share-snapshot-of-data*/}

<<<<<<< HEAD
Untuk membagikan cuplikan data antar komponen, panggil `cache` dengan fungsi *data-fetching* seperti `fetch`. Saat beberapa komponen melakukan pengambilan data yang sama, hanya satu proses *request* yang akan dilakukan dan data yang dikembalikan adalah data ter-*cache* dan dibagikan ke seluruh komponen. Semua komponen ini Semua komponen mengacu pada cuplikan data yang sama di seluruh *render* server.
=======
To share a snapshot of data between components, call `cache` with a data-fetching function like `fetch`. When multiple components make the same data fetch, only one request is made and the data returned is cached and shared across components. All components refer to the same snapshot of data across the server render.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

<<<<<<< HEAD
Jika `AnimatedWeatherCard` dan `MinimalWeatherCard` keduanya merender <CodeStep step={1}>*city*</CodeStep> yang sama, mereka akan menerima cuplikan data yang sama dari <CodeStep step={2}>fungsi yang ter-*memo*</CodeStep>. 
=======
If `AnimatedWeatherCard` and `MinimalWeatherCard` both render for the same <CodeStep step={1}>city</CodeStep>, they will receive the same snapshot of data from the <CodeStep step={2}>memoized function</CodeStep>.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

Jika `AnimatedWeatherCard` dan `MinimalWeatherCard` menggunakan argument <CodeStep step={1}>*city*</CodeStep> yang berbeda pada <CodeStep step={2}>`getTemperature`</CodeStep>, maka `fetchTemperature` akan dipanggil dua kali dan setiap pemanggilan akan menerima data yang berbeda.

<CodeStep step={1}>*city*</CodeStep> berperan sebagai sebuah kunci *cache*.

<Note>

<<<<<<< HEAD
[//]: # 'TODO: add links to Server Components when merged.'

<CodeStep step={3}>pe-*render*-an Asinkron</CodeStep> hanya mendukung komponent *server*.
=======
<CodeStep step={3}>Asynchronous rendering</CodeStep> is only supported for Server Components.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

To render components that use asynchronous data in Client Components, see [`use()` documentation](/reference/react/use).

</Note>

### Pramuat data {/*preload-data*/}

Dengan melakukan *cache* pada data hasil *fetch* yang panjang, Anda dapat memulai proses asinkron sebelum me-*render* komponen.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
});

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Baik: mulai mengambil data user
  getUser(id);
  // ... beberapa proses komputasi
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

Saat me-*render* `Page`, komponen tersebut memanggil <CodeStep step={1}>`getUser`</CodeStep>tetapi perhatikan bahwa ia tidak menggunakan data yang dikembalikan. Pemanggilan <CodeStep step={1}>`getUser`</CodeStep> awal ini memulai *query* asinkron *database* basis data yang terjadi saat `Page` sedang melakukan komputasi lainnya dan me-*render* *children*.

Saat me-*render* `Profile`, kita dapat memanggil <CodeStep step={2}>`getUser`</CodeStep> lagi. Jika pemanggilan awal dari <CodeStep step={1}>`getUser`</CodeStep> telah mengembalikan sebuah nilai dan melakukan *cache* pada data user, saat `Profile` <CodeStep step={2}>meminta dan menunggu data tersebut</CodeStep>, ia dapat hanya membaca langsung dari *cache* tanpa memerlukan pemanggilan prosedur *remote* lainnya. Jika <CodeStep step={1}>proses awal pemanggilan data</CodeStep> belum dapat diselesaikan, pemuatan awal data dalam pola ini dapat mengurangi penundaan pemanggilan data.

<DeepDive>

#### Melakukan *cache* pada proses asinkron {/*caching-asynchronous-work*/}

Saat mengevaluasi sebuah [fungsi asinkron](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), ada akan menerima sebuah [*Promise*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) untuk proses tersebut. *Promise* memegang status dari proses tersebut (*pending*, *fulfilled*, *failed*) dan hasil akhirnya yang telah diselesaikan.

<<<<<<< HEAD
Dalam contoh ini, fungsi asinkron <CodeStep step={1}>`fetchData`</CodeStep> mengembalikan sebuah *promise* yang menantikan proses `fetch`. 
=======
In this example, the asynchronous function <CodeStep step={1}>`fetchData`</CodeStep> returns a promise that is awaiting the `fetch`.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
<<<<<<< HEAD
  // ... beberapa proses komputasi
=======
  // ... some computational work
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1
  await getData();
  // ...
}
```

Saat memanggil <CodeStep step={2}>`getData`</CodeStep> untuk pertama kalinya, *promise*-nya mengembalikan nilai dari <CodeStep step={1}>`fetchData`</CodeStep> yang telah ter-*cache*. Pencarian selanjutnya akan menghasilkan *promise* yang sama

Perhatikan bahwa, pemanggilan <CodeStep step={2}>`getData`</CodeStep> pertama kali tidak melalui `await` sedangkan yang <CodeStep step={3}>kedua</CodeStep> melaluinya. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) adalah sebuah operator JavaScript yang akan menunggu dan mengembalikan hasil akhir dari sebuah *promise*. Pemanggilan pertama <CodeStep step={2}>`getData`</CodeStep> hanya menginisiasi `fetch` untuk melakukan *cache* pada *promise* yang digunakan pada pemanggilan <CodeStep step={3}>`getData`</CodeStep> kedua untuk dicari.

<<<<<<< HEAD
Jika pada <CodeStep step={3}>pemanggilan kedua</CodeStep> *promise* tersebut masih berstatus *pending*, maka `await` akan dihentikan untuk mendapatkan hasilnya. Optimalisasinya adalah saat menunggu `fetch`, React masih dapat melanjutkan proses komputasi, sehingga mengurangi waktu yang diperlukan untuk melakukan <CodeStep step={3}>pemanggilan kedua</CodeStep>.
=======
If by the <CodeStep step={3}>second call</CodeStep> the promise is still _pending_, then `await` will pause for the result. The optimization is that while we wait on the `fetch`, React can continue with computational work, thus reducing the wait time for the <CodeStep step={3}>second call</CodeStep>.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

Jika *promise* telah diselesaikan, antara mendapatkan eror atau *fulfilled* sebagai hasilnya, `await` akan mengembalikan nilai tersebut secara langsung. Dalam kedua hasil tersebut, ada keuntungan kinerja.
</DeepDive>

<Pitfall>

##### Memanggil sebuah fungsi yang ter-*memo* dari luar sebuah komponen tidak akan menggunakn *cache*-nya. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Salah: Memanggil fungsi ter-memo dari luar komponen tidak akan ter-memo.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Baik: `getUser` akan ter-memo.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React hanya menyediakan akses terhadap *cache* pada fungsi ter-memo dalam sebuah komponen. Saat memanggil <CodeStep step={1}>`getUser`</CodeStep> dari luar komponen, ia akan tetap mengevaluasi fungsi tersebut tetapi tidak melakukan proses membaca ataupun memperbarui *cache*.

<<<<<<< HEAD
Hal ini karena akses dari *cache* disediakan melalui [*context*](/learn/passing-data-deeply-with-context) yang hanya dapat diakses oleh sebuah komponent.
=======
This is because cache access is provided through a [context](/learn/passing-data-deeply-with-context) which is only accessible from a component.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

</Pitfall>

<DeepDive>

#### Kapan saya harus menggunakan `cache`, [`memo`](/reference/react/memo), atau [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

Semua API yang disebutkan di atas menawarkan *memo*, tetapi perbedaannya adalah apa yang dimaksudkan untuk *memo*, siapa yang dapat mengakses *cache*, dan kapan *cache* mereka tidak valid.

#### `useMemo` {/*deep-dive-use-memo*/}

<<<<<<< HEAD
Secara umum, anda harus menggunakan [`useMemo`](/reference/react/useMemo) untuk melakukan *cache* untuk sebuah komputasi yang mahal pada sebuah komponen klien di seluruh *render*. Sebagai contoh, untuk me-*memo* sebuah transformasi dari sebuah data di dalam komponen.
=======
In general, you should use [`useMemo`](/reference/react/useMemo) for caching an expensive computation in a Client Component across renders. As an example, to memoize a transformation of data within a component.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

```jsx {expectedErrors: {'react-compiler': [4]}} {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```
Pada contoh ini, `App` me-*render* dua `WeatherReport` dengan catatan yang sama. Meskipun kedua komponen melakukan pekerjaan yang sama, mereka tidak dapat berbagi pekerjaan. Cache `useMemo` hanya bersifat lokal pada komponen tersebut.

<<<<<<< HEAD
Akan tetapi, `useMemo` memastikan bahwa jika `App` ter-*render* ulang dan objek `record` tidak berubah, setiap *instance* komponen akan melewatkan pekerjaan dan menggunakan nilai ter-*memo* dari `avgTemp`. `useMemo` akan hanya melakukan *cache* komputasi terakhir dari `avgTemp` dengan *dependencies* yang diberikan.
=======
However, `useMemo` does ensure that if `App` re-renders and the `record` object doesn't change, each component instance would skip work and use the memoized value of `avgTemp`. `useMemo` will only cache the last computation of `avgTemp` with the given dependencies.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

#### `cache` {/*deep-dive-cache*/}

Secara umum, Anda seharusnya menggunakan `cache` dalam *Server Component* untuk me-*memo* pekerjaan yang dapat dibagikan ke seluruh komponen.

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```
Menulis ulang contoh sebelumnya dengan menggunakan `cache`, dalam kasus ini <CodeStep step={3}>contoh kedua dari `WeatherReport`</CodeStep> akan dapat melewati pekerjaan yang berulan dan membaca dari *cache* yang sama dengan <CodeStep step={1}>`WeatherReport` pertama</CodeStep>. Perbedaan lainnya dari contoh sebelumnya adalah `cache` juga direkomendasikan untuk <CodeStep step={2}>me-*memo* pengambilan data</CodeStep>, tidak seperti `useMemo` yang seharusnya hanya digunakan untuk komputasi.

Sementara waktu, `cache` hanya digunakan pada komponen *server* dan *cache*-nya akan hanya diinvalidasi di seluruh permintaan server.

#### `memo` {/*deep-dive-memo*/}

Anda seharusnya menggunakan [`memo`](reference/react/memo) untuk mencegah proses pe-*render*-an ulang dari sebuah komponen jika *props*-nya tidak berubah.

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record);
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

<<<<<<< HEAD
Dalam contoh ini, kedua komponen `MemoWeatherReport` akan memanggil `calculateAvg` saat di-*render* pertama kalinya. Akan tetapi, jika `App` di-*render* ulang, tanpa andanya perubaha pada `record`, tidak ada *props* yang berubah dan `MemoWeatherReport` tidak akan di-*render* ulang.
=======
In this example, both `MemoWeatherReport` components will call `calculateAvg` when first rendered. However, if `App` re-renders, with no changes to `record`, none of the props have changed and `MemoWeatherReport` will not re-render.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

Apabila dibandingkan dengan `useMemo`, `memo` me-*memo* komponen tersebut di-*render* berdasarkan *props* vs. komputasi spesifik. Mirip dengan `useMemo`, komponen yang di-*memo* hanya akan men-*cache* *render* terakhir dengan menggunakan nilai *props* terakhir. Setelah *props* berubah, *cache* tersebut terinvalidasi dan komponennya di *render* ulang.

</DeepDive>

---

## Pemecahan masalah {/*troubleshooting*/}

### Fungsi ter-memo saya tidak berjalan walaupun saya sudah memanggilnya dengan argumen-argumen yang sama {/*memoized-function-still-runs*/}

Lihatlah jebakan yang disebutkan sebelumnya
* [Memanggil fungsi ter-*memo* berbeda akan membaca dari *caches* yang berbeda.](#pitfall-different-memoized-functions)
* [Memanggil sebuah fungsi yang ter-*memo* dari luar sebuah komponen tidak akan menggunakn *cache*-nya.](#pitfall-memoized-call-outside-component)

Jika yang disebutkan di atas tidak berlaku, mungkin ada masalah dengan cara React memeriksa apakah ada sesuatu yang ada di dalam *cache*.

Jika argumen-argumen Anda bukan [*primitives*](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (contoh: objek, fungsi, array), pastikan Anda memberikan referensi objek yang sama.

Saat memanggil fungsi yang ter-memo, React akan mencari argumen masukkan untuk melihat apakah sebuah nilai telah di-*cache*. React akan menggunakan *shallow equality* pada argumen-argumen untuk menentukan apakah ada *cache hit*.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Salah: props adalah sebuah objek yang berubah disetiap render.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Dalam kasus ini dua `MapMarker` terlihat seperti melakuakn pekerjaan yang sama dan memanggil `calculateNorm` dengan nilai `{x: 10, y: 10, z:10}`. Walaupun menggunakan objek dengan nilai yang sama, keduanya bukan objek dengan referensi yang sama karena kedua komponen membentuk objek `props`-nya masing-masing.

React akan memanggil [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) di masukkan untuk verifikasi jika terdapat *cache hit*.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Baik: Mengoper primitives untuk fungsi ter-memo
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Salah satu cara untuk mengatasi hal ini adalah dengan mengoper dimensi vektor ke `calculateNorm`. Hal ini bekerja karena dimensi itu sendiri adalah *primitives*.

Solusi lain adalah mengoper objek vektor itu sendiri sebagai penopang komponen. Kita harus mengoper objek yang sama ke kedua *instance* komponen.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Baik: Megoper objek `vector` yang sama
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```
