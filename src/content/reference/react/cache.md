---
title: cache
canary: true
---

<Canary>
* `cache` hanya digunakan dengan [*React Server Components*](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components). Lihat [*frameworks*](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) yang mendukung *React Server Components*.

* `cache` hanya tersedia di kanal [*Canary*](/community/versioning-policy#canary-channel) dan [eksperimental](/community/versioning-policy#experimental-channel) React. Please ensure you understand the limitations before using `cache` in production. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).
</Canary>

<Intro>

`cache` memungkinkan anda untuk melakukan *cache* pada data hasil *fetch* atau komputasi.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `cache(fn)` {/*cache*/}

Panggil `cache` diluar komponen apapun untuk membuat sebuah versi dari fungis dengan *caching*.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

Saat `getMetrics` pertama kali dipanggil dengan `data`, `getMetrics` akan memanggil `calculateMetrics(data)` dan menyimpan hasilnya didalam sebuah *cache*. Jika `getMetrics` dipanggil lagi dengan `data` yang sama, maka akan mengembalikan hasil yang telah ter-*cache* alih-alih memamggil `calculateMetrics(data)` lagi.

[Lihat lebih banyak contoh dibawah.](#usage)

#### Parameter-parameter {/*parameters*/}

- `fn`: Fungsi yang ingin anda *cache* hasilnya. `fn` dapat meneriman argumen apapun dan mengembalikan nilai apapun.

#### Returns {/*returns*/}

`cache` mengembalikan versi ter-*cache* dari `fn` dengan tanda tangan tipe yang sama. Ia tidak memanggil `fn` dalam prosesnya.

Saat memanggil `cachedFn` dengan argumen yang diberikan, Pertama ia akan mengecek apakah terdapat nilai yang telah ter-*cache* sebelumnya. Jika nilai tersebut tersedia, maka kembalikan nilai tersebut. Jika tidak, panggil `fn` dengan argumen tersebut, simpan nilai tersebut di dalam *cache*, dan kembalikan nilai tersebut. Satu-satunya waktu `fn` dipanggil adalah ketika ada cache yang terlewat.

<Note>

Optimalisasi dari melakukan *cache* pada nilai kembalian berdasarkan masukkan dikenal sebagai [*memoization*](https://en.wikipedia.org/wiki/Memoization). Kita mengacu mengacu pada fungsi yang dikembalikan dari `cache` sebagai fungsi yang dimemo.

</Note>

#### Peringatan {/*caveats*/}

[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- React akan menginvalidasi *cache* untuk setiap fungsi yang di-*memo* untuk setiap permintaan server.
- Setiap pemanggil `cache` membentuk sebuah fungsi baru. Hal ini berarti, memanggi `cache` dengan fungsi yang sama berkali-kali akan mengembalikan fungsi ter-*memo* berbeda yang tidak berbagi *cache* yang sama
- `cachedFn` juga akan men-*cache* eror-eror. Jika `fn` melempar sebuah eror untuk sebuah argumen tertentu, Itu akan ter-*cache*, dan eror yang sama akan dilempar kembali saat `cachedFn` dipanggil dengan argumen yang sama tersebut.
- `cache` hanya dapat digunakan di [*Server Components*](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

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

Jika objek `user` yang sama di-*render* di `Profile` dan `TeamReport`, kedua komponen dapat berbagi pekerjaan dan hanya memanggil `calculateUserMetrics` sekali untuk `user` tersebut.

Asumsikan `Profile` di-*render* pertama kali. Ia akan memanggil <CodeStep step={1}>`getUserMetrics`</CodeStep>, dan mengecek apakah terdapat nilai yang ter-*cache* sebelumnya. Mengingat ini adalah pertama kalinya `getUserMetrics` dipanggil oleh `user` tersebut, maka akan terdapat sebuah *cache miss*. `getUserMetrics` kemudian akan memanggil `calculateUserMetrics` dengan `user` tersebut dan menyimpan hasil tersebut dalam sebuah *cache*. 

Saat `TeamReport` me-*render* daftar `users`-nya dan menjangkau objek `user` yang sama, Ia akan memanggil <CodeStep step={2}>`getUserMetrics`</CodeStep> dan membaca hasilnya dari *cache*.

<Pitfall>

##### Memanggil fungsi ter-*memo* berbeda akan membaca dari *caches* yang berbeda. {/*pitfall-different-memoized-functions*/}

Untuk mengakses *cache* yang sama, komponen-komponen harus memanggil fungsi ter-*memo* yang sama.
To access the same cache, components must call the same memoized function.

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

Untuk memaksimalkan *cache* dan mengurangi pekerjaan, kedua komponen tersebut harus memanggil fungsi ter-*memo* yang sama untuk mengakses *cache* yang sama. kedua komponen harus memanggil fungsi memo yang sama untuk mengakses cache yang sama. Sebagai gantinya, tentukan fungsi memoized dalam modul khusus yang dapat [`impor`-ed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) di seluruh komponen.

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
Disini, kedua komponen memanggil <CodeStep step={3}>fungsi ter-memo sama</CodeStep> yang diekspor dari `./getWeekReport.js` untuk membaca dan menulis pada *cache* yang sama.
</Pitfall>

### Membagikan cuplikan data {/*take-and-share-snapshot-of-data*/}

Untuk membagikan cuplikan data antar komponen, panggil `cache` dengan fungsi *data-fetching* seperti `fetch`. Saat beberapa komponen melakukan pengambilan data yang sama, hanya satu proses *request* yang akan dilakukan dan data yang dikembalikan adalah data ter-*cache* dan dibagikan ke seluruh komponen. Semua komponen ini Semua komponen mengacu pada cuplikan data yang sama di seluruh *render* server.

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

If `AnimatedWeatherCard` and `MinimalWeatherCard` both render for the same <CodeStep step={1}>city</CodeStep>, they will receive the same snapshot of data from the <CodeStep step={2}>memoized function</CodeStep>. 

If `AnimatedWeatherCard` and `MinimalWeatherCard` supply different <CodeStep step={1}>city</CodeStep> arguments to <CodeStep step={2}>`getTemperature`</CodeStep>, then `fetchTemperature` will be called twice and each call site will receive different data.

The <CodeStep step={1}>city</CodeStep> acts as a cache key.

<Note>

[//]: # 'TODO: add links to Server Components when merged.'

<CodeStep step={3}>Asynchronous rendering</CodeStep> is only supported for Server Components.

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```
[//]: # 'TODO: add link and mention to use documentation when merged'
[//]: # 'To render components that use asynchronous data in Client Components, see `use` documentation.'

</Note>

### Preload data {/*preload-data*/}

By caching a long-running data fetch, you can kick off asynchronous work prior to rendering the component.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
})

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
  // ✅ Good: start fetching the user data
  getUser(id);
  // ... some computational work
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

When rendering `Page`, the component calls <CodeStep step={1}>`getUser`</CodeStep> but note that it doesn't use the returned data. This early <CodeStep step={1}>`getUser`</CodeStep> call kicks off the asynchronous database query that occurs while `Page` is doing other computational work and rendering children.

When rendering `Profile`, we call <CodeStep step={2}>`getUser`</CodeStep> again. If the initial <CodeStep step={1}>`getUser`</CodeStep> call has already returned and cached the user data, when `Profile` <CodeStep step={2}>asks and waits for this data</CodeStep>, it can simply read from the cache without requiring another remote procedure call. If the <CodeStep step={1}> initial data request</CodeStep> hasn't been completed, preloading data in this pattern reduces delay in data-fetching.

<DeepDive>

#### Caching asynchronous work {/*caching-asynchronous-work*/}

When evaluating an [asynchronous function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), you will receive a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for that work. The promise holds the state of that work (_pending_, _fulfilled_, _failed_) and its eventual settled result.

In this example, the asynchronous function <CodeStep step={1}>`fetchData`</CodeStep> returns a promise that is awaiting the `fetch`. 

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... some computational work  
  await getData();
  // ...
}
```

In calling <CodeStep step={2}>`getData`</CodeStep> the first time, the promise returned from <CodeStep step={1}>`fetchData`</CodeStep> is cached. Subsequent look-ups will then return the same promise.

Notice that the first <CodeStep step={2}>`getData`</CodeStep> call does not `await` whereas the <CodeStep step={3}>second</CodeStep> does. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) is a JavaScript operator that will wait and return the settled result of the promise. The first <CodeStep step={2}>`getData`</CodeStep> call simply initiates the `fetch` to cache the promise for the second <CodeStep step={3}>`getData`</CodeStep> to look-up.

If by the <CodeStep step={3}>second call</CodeStep> the promise is still _pending_, then `await` will pause for the result. The optimization is that while we wait on the `fetch`, React can continue with computational work, thus reducing the wait time for the <CodeStep step={3}>second call</CodeStep>. 

If the promise is already settled, either to an error or the _fulfilled_ result, `await` will return that value immediately. In both outcomes, there is a performance benefit.
</DeepDive>

<Pitfall>

##### Calling a memoized function outside of a component will not use the cache. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Wrong: Calling memoized function outside of component will not memoize.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Good: `getUser` will memoize.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React only provides cache access to the memoized function in a component. When calling <CodeStep step={1}>`getUser`</CodeStep> outside of a component, it will still evaluate the function but not read or update the cache.

This is because cache access is provided through a [context](/learn/passing-data-deeply-with-context) which is only accessible from a component. 

</Pitfall>

<DeepDive>

#### When should I use `cache`, [`memo`](/reference/react/memo), or [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

All mentioned APIs offer memoization but the difference is what they're intended to memoize, who can access the cache, and when their cache is invalidated.

#### `useMemo` {/*deep-dive-use-memo*/}

In general, you should use [`useMemo`](/reference/react/useMemo) for caching a expensive computation in a Client Component across renders. As an example, to memoize a transformation of data within a component.

```jsx {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record)), record);
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
In this example, `App` renders two `WeatherReport`s with the same record. Even though both components do the same work, they cannot share work. `useMemo`'s cache is only local to the component.

However, `useMemo` does ensure that if `App` re-renders and the `record` object doesn't change, each component instance would skip work and use the memoized value of `avgTemp`. `useMemo` will only cache the last computation of `avgTemp` with the given dependencies. 

#### `cache` {/*deep-dive-cache*/}

In general, you should use `cache` in Server Components to memoize work that can be shared across components.

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
Re-writing the previous example to use `cache`, in this case the <CodeStep step={3}>second instance of `WeatherReport`</CodeStep> will be able to skip duplicate work and read from the same cache as the <CodeStep step={1}>first `WeatherReport`</CodeStep>. Another difference from the previous example is that `cache` is also recommended for <CodeStep step={2}>memoizing data fetches</CodeStep>, unlike `useMemo` which should only be used for computations.

At this time, `cache` should only be used in Server Components and the cache will be invalidated across server requests.

#### `memo` {/*deep-dive-memo*/}

You should use [`memo`](reference/react/memo) to prevent a component re-rendering if its props are unchanged.

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

In this example, both `MemoWeatherReport` components will call `calculateAvg` when first rendered. However, if `App` re-renders, with no changes to `record`, none of the props have changed and `MemoWeatherReport` will not re-render. 

Compared to `useMemo`, `memo` memoizes the component render based on props vs. specific computations. Similar to `useMemo`, the memoized component only caches the last render with the last prop values. Once the props change, the cache invalidates and the component re-renders.

</DeepDive>

---

## Troubleshooting {/*troubleshooting*/}

### My memoized function still runs even though I've called it with the same arguments {/*memoized-function-still-runs*/}

See prior mentioned pitfalls
* [Calling different memoized functions will read from different caches.](#pitfall-different-memoized-functions)
* [Calling a memoized function outside of a component will not use the cache.](#pitfall-memoized-call-outside-component)

If none of the above apply, it may be a problem with how React checks if something exists in cache.

If your arguments are not [primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (ex. objects, functions, arrays), ensure you're passing the same object reference.

When calling a memoized function, React will look up the input arguments to see if a result is already cached. React will use shallow equality of the arguments to determine if there is a cache hit.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Wrong: props is an object that changes every render.
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

In this case the two `MapMarker`s look like they're doing the same work and calling `calculateNorm` with the same value of `{x: 10, y: 10, z:10}`. Even though the objects contain the same values, they are not the same object reference as each component creates its own `props` object.

React will call [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) on the input to verify if there is a cache hit.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass primitives to memoized function
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

One way to address this could be to pass the vector dimensions to `calculateNorm`. This works because the dimensions themselves are primitives.

Another solution may be to pass the vector object itself as a prop to the component. We'll need to pass the same object to both component instances.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass the same `vector` object
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

