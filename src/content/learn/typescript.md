---
title: Menggunakan TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript adalah salah satu cara populer untuk menambahkan definisi *type* ke dalam basis kode JavaScript. Secara bawaan, TypeScript [mendukung JSX](/learn/writing-markup-with-jsx) dan Anda bisa mendapatkan dukungan penuh React Web dengan menambahkan [`@types/react`](https://www.npmjs.com/package/@types/react) dan [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) ke proyek Anda.

</Intro>

<YouWillLearn>

* [TypeScript dengan Komponen React](/learn/typescript#typescript-with-react-components)
* [Contoh menambahkan *type* dalam Hooks](/learn/typescript#example-hooks)
* [*Types* umum dari `@types/react`](/learn/typescript/#useful-types)
* [Tempat pembelajaran lebih lanjut](/learn/typescript/#further-learning)

</YouWillLearn>

## Pemasangan {/*installation*/}

Semua [kerangka kerja React tingkat produksi](/learn/start-a-new-react-project#production-grade-react-frameworks) menawarkan dukungan untuk menggunakan TypeScript. Ikuti panduan khusus kerangka kerja tersebut untuk pemasangan:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Menambahkan TypeScript ke proyek React yang ada {/*adding-typescript-to-an-existing-react-project*/}

Untuk memasang versi terbaru definisi *type* React:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

Opsi *compiler* berikut perlu disetel dalam `tsconfig.json` Anda:

1. `dom` harus disertakan dalam [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Catatan: Jika tidak ada opsi `lib` yang disetel, `dom` disetel secara bawaan).
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) harus desetel ke salah satu opsi yang valid. `preserve` seharusnya cukup untuk sebagian besar aplikasi.
  Jika Anda menerbitkan pustaka (*library*), lihat [dokumentasi `jsx`](https://www.typescriptlang.org/tsconfig/#jsx) untuk mengetahui opsi yang harus dipilih.

## TypeScript dengan Komponen React {/*typescript-with-react-components*/}

<Note>

Setiap *file* yang berisi JSX harus menggunakan ekstensi *file* `.tsx`. Ini adalah ekstensi khusus TypeScript yang memberi tahu TypeScript bahwa *file* ini berisi JSX.

</Note>

Menulis TypeScript dengan React sangat mirip dengan menulis JavaScript dengan React. Perbedaan utama saat bekerja dengan komponen adalah Anda dapat menyediakan *type* untuk *props* komponen Anda. *Type* ini dapat digunakan untuk memeriksa kebenaran dan menyediakan dokumentasi sebaris di editor.

Dengan mengambil [komponen `MyButton`](/learn#components) dari panduan [Mulai Cepat](/learn), kita dapat menambahkan *type* yang mendeskripsikan `title` untuk tombol:

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

*Sandbox* ini dapat menangani kode TypeScript, tetapi tidak menjalankan pemeriksa *type*. Ini berarti Anda dapat mengubah *sandbox* TypeScript untuk belajar, tetapi Anda tidak akan mendapatkan kesalahan (*error*) atau peringatan (*warning*) *type* apa pun. Untuk mendapatkan pemeriksaan *type*, Anda dapat menggunakan [TypeScript Playground](https://www.typescriptlang.org/play) atau menggunakan *sandbox* daring yang berfitur lebih lengkap.

</Note>

Sintaksis sebaris ini adalah cara paling sederhana untuk menyediakan *type* bagi suatu komponen, namun setelah Anda mulai memiliki beberapa *field* untuk mendeskripsikannya, hal ini akan menjadi lebih sulit dibaca. Sebagai gantinya, Anda dapat menggunakan `interface` atau `type` untuk mendeskripsikan *props* sebuah komponen:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** Teks yang ditampilkan di dalam tombol */
  title: string;
  /** Apakah tombol dapat diklik atau tidak */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

*Type* yang mendeskripsikan *props* komponen Anda dapat sesederhana atau serumit yang Anda perlukan, namun *props* tersebut harus berupa tipe objek yang dideskripsikan dengan `type` atau `interface`. Anda dapat mempelajari tentang cara TypeScript mendeskripsikan objek di [*Object Types*](https://www.typescriptlang.org/docs/handbook/2/objects.html) tetapi Anda mungkin juga tertarik menggunakan [*Union Types*](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) untuk mendeskripsikan properti yang dapat berupa salah satu dari beberapa *type* yang berbeda dan panduan [*Creating Types from Types*](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) untuk kasus penggunaan yang lebih lanjut.


## Contoh Hooks {/*example-hooks*/}

Definisi *type* dari `@types/react` menyertakan *type* untuk Hooks bawaan, sehingga Anda dapat menggunakannya dalam komponen tanpa pengaturan tambahan apa pun. Definisi tersebut dibuat untuk memperhitungkan kode yang Anda tulis dalam komponen, sehingga Anda akan memperoleh [*type* yang disimpulkan](https://www.typescriptlang.org/docs/handbook/type-inference.html) sering kali dan idealnya tidak perlu menangani hal-hal sepele dalam menyediakan *type* sendiri.

Namun, kita dapat melihat beberapa contoh tentang cara menyediakan *type* untuk Hooks.

### `useState` {/*typing-usestate*/}

[Hook `useState`](/reference/react/useState) akan menggunakan kembali nilai yang diberikan sebagai *state* awal untuk menentukan *type* dari nilai yang seharusnya. Misalnya:

```ts
// Menyimpulkan type sebagai "boolean"
const [enabled, setEnabled] = useState(false);
```

Ini akan menetapkan *type* `boolean` ke `enabled`, dan `setEnabled` akan menjadi fungsi yang menerima argumen `boolean`, atau fungsi yang mengembalikan `boolean`. Jika Anda ingin secara eksplisit memberikan *type* untuk *state*, Anda dapat melakukannya dengan memberikan argumen *type* ke panggilan `useState`:

```ts 
// Menyetel type ke "boolean" secara eksplisit
const [enabled, setEnabled] = useState<boolean>(false);
```

Hal ini tidak terlalu berguna dalam kasus ini, tetapi kasus umum di mana Anda mungkin ingin memberikan *type* adalah ketika Anda memiliki *union type*. Misalnya, `status` di sini dapat berupa salah satu dari beberapa string yang berbeda:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Atau, seperti yang direkomendasikan dalam [Prinsip-prinsip untuk menata state](/learn/choosing-the-state-structure#principles-for-structuring-state), Anda dapat mengelompokkan *state* terkait sebagai objek dan mendeskripsikan berbagai kemungkinan melalui *type* objek:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[Hook `useReducer`](/reference/react/useReducer) adalah Hook yang lebih kompleks yang mengambil fungsi *reducer* dan *state* awal. *Type* untuk fungsi *reducer* disimpulkan dari *state* awal. Anda dapat secara opsional memberikan argumen *type* ke panggilan `useReducer` untuk memberikan *type* bagi *state* tersebut, tetapi sering kali lebih baik untuk menetapkan *type* pada *state* awal sebagai gantinya:

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


Kita menggunakan TypeScript di beberapa tempat penting:

 - `interface State` menjelaskan bentuk *state* dari *reducer*.
 - `type CounterAction` menjelaskan berbagai *action* yang dapat dikirimkan ke *reducer*.
 - `const initialState: State` menyediakan *type* untuk *state* awal, dan juga *type* yang digunakan oleh `useReducer` secara bawaan.
 - `stateReducer(state: State, action: CounterAction): State` menetapkan *type* untuk argumen fungsi *reducer* dan nilai pengembalian.

Alternatif yang lebih eksplisit untuk menetapkan *type* pada `initialState` adalah dengan memberikan argumen *type* ke `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[Hook `useContext`](/reference/react/useContext) adalah teknik untuk meneruskan data ke bawah pohon komponen tanpa harus meneruskan *props* melalui komponen. Teknik ini digunakan dengan membuat komponen penyedia dan sering kali dengan membuat Hook untuk menggunakan nilai dalam komponen anak.

*Type* dari nilai yang disediakan oleh *Context* disimpulkan dari nilai yang diteruskan ke panggilan `createContext`:

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext value={theme}>
      <MyComponent />
    </ThemeContext>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Teknik ini berfungsi saat Anda memiliki nilai bawaan yang masuk akal - tetapi terkadang ada kasus saat Anda tidak memilikinya, dan dalam kasus tersebut `null` dapat terasa masuk akal sebagai nilai bawaan. Namun, untuk memungkinkan sistem *type* memahami kode Anda, Anda perlu secara eksplisit menetapkan `ContextShape | null` pada `createContext`.

Hal ini menyebabkan masalah yang mengharuskan Anda menghilangkan `| ​​null` dalam *type* untuk *consumer* *Context*. Rekomendasi kami adalah agar Hook melakukan pemeriksaan *runtime* untuk keberadaannya dan memunculkan kesalahan saat tidak ada:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// Ini adalah contoh yang lebih sederhana, namun Anda dapat membayangkan obyek yang lebih kompleks di sini.
type ComplexObject = {
  kind: string
};

// Context dibuat dengan `| null` dalam type, untuk merefleksikan nilai bawaan secara akurat.
const Context = createContext<ComplexObject | null>(null);

// `| null` akan dihapus melalui pemeriksaan di dalam Hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context value={object}>
      <MyComponent />
    </Context>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

Hook [`useMemo`](/reference/react/useMemo) akan membuat/mengakses ulang nilai yang tersimpan dari pemanggilan fungsi, dan menjalankan ulang fungsi hanya saat dependensi yang diteruskan sebagai parameter ke-2 diubah. Hasil pemanggilan Hook disimpulkan dari nilai yang dikembalikan dari fungsi di parameter pertama. Anda dapat lebih eksplisit dengan memberikan argumen *type* ke Hook.

```ts
// Type dari visibleTodos disimpulkan dari nilai kembalian filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

[`useCallback`](/reference/react/useCallback) menyediakan referensi stabil ke suatu fungsi selama dependensi yang dimasukkan ke parameter kedua sama. Seperti `useMemo`, *type* fungsi disimpulkan dari nilai kembalian fungsi di parameter pertama, dan Anda dapat lebih eksplisit dengan memberikan argumen *type* ke Hook.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

Saat bekerja dalam mode *strict* TypeScript, `useCallback` mengharuskan penambahan *type* untuk parameter dalam *callback* Anda. Hal ini karena *type* dari *callback* disimpulkan dari nilai pengembalian fungsi, dan tanpa parameter, *type* tersebut tidak dapat dipahami sepenuhnya.

Bergantung pada preferensi gaya kode Anda, Anda dapat menggunakan fungsi `*EventHandler` dari *type* React untuk menyediakan *type* bagi *event handler* pada saat yang sama saat mendefinisikan *callback*:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## *Type-type* lain yang berguna {/*useful-types*/}

Ada sekumpulan *type* yang cukup luas yang berasal dari *package* `@types/react`, ini layak dibaca jika Anda merasa nyaman dengan cara React dan TypeScript berinteraksi. Anda dapat menemukannya [di folder React di DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). Kami akan membahas beberapa *type* yang lebih umum di sini.

### *Event* DOM {/*typing-dom-events*/}

Saat bekerja dengan *event* DOM di React, *type* dari *event* sering kali dapat disimpulkan dari *event handler*. Namun, saat Anda ingin mengekstrak fungsi untuk diteruskan ke *event handler*, Anda perlu menetapkan *type* dari *event* secara eksplisit.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Ada banyak jenis *events* yang disediakan dalam *type* React - daftar lengkapnya dapat ditemukan [di sini](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) yang didasarkan pada [*event* paling populer dari DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

Saat menentukan *type* yang Anda cari, pertama-tama Anda dapat melihat informasi *hover* untuk *event handler* yang Anda gunakan, yang akan menunjukkan tipe *event* tersebut.

Jika Anda perlu menggunakan *event* yang tidak termasuk dalam daftar ini, Anda dapat menggunakan *type* `React.SyntheticEvent`, yang merupakan *type* dasar untuk semua *event*.

### Anak (*Children*) {/*typing-children*/}

Ada dua jalur umum untuk mendeskripsikan anak dari suatu komponen. Yang pertama adalah dengan menggunakan *type* `React.ReactNode`, yang merupakan gabungan dari semua *type* yang mungkin yang dapat diteruskan sebagai anak dalam JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Ini adalah definisi anak yang sangat luas. Yang kedua adalah menggunakan *type* `React.ReactElement`, yang hanya berupa elemen JSX dan bukan primitif JavaScript seperti *string* atau angka:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Perlu diingat, bahwa Anda tidak dapat menggunakan TypeScript untuk menjelaskan bahwa anak dari komponen adalah tipe elemen JSX tertentu, jadi Anda tidak dapat menggunakan sistem *type* untuk menjelaskan komponen yang hanya menerima anak `<li>`.

Anda dapat melihat contoh `React.ReactNode` dan `React.ReactElement` dengan pemeriksa *type* di [*playground* TypeScript ini](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### *Props* *Style* {/*typing-style-props*/}

Saat menggunakan *inline styles* di React, Anda dapat menggunakan `React.CSSProperties` untuk mendeskripsikan objek yang diteruskan ke *props* `style`. *Type* ini merupakan gabungan dari semua properti CSS yang mungkin, dan merupakan cara yang baik untuk memastikan Anda meneruskan properti CSS yang valid ke properti `style`, dan untuk mendapatkan pelengkapan otomatis di editor Anda.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Pembelajaran lebih lanjut {/*further-learning*/}

Panduan ini telah membahas dasar-dasar penggunaan TypeScript dengan React, tetapi masih banyak lagi yang dapat dipelajari.
Halaman API individual pada dokumentasi mungkin berisi dokumentasi yang lebih mendalam tentang cara menggunakannya dengan TypeScript.

Kami merekomendasikan sumber daya berikut:

 - [Buku panduan TypeScript](https://www.typescriptlang.org/docs/handbook/) adalah dokumentasi resmi untuk TypeScript, dan mencakup sebagian besar fitur utama dari bahasa pemrograman ini.

 - [Catatan rilis TypeScript](https://devblogs.microsoft.com/typescript/) membahas fitur-fitur baru secara mendalam.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) adalah lembar contekan yang dikelola komunitas untuk menggunakan TypeScript dengan React, yang mencakup banyak kasus tepi yang berguna dan menyediakan lebih banyak keluasan daripada dokumen ini.

 - [Komunitas Discord TypeScript](https://discord.com/invite/typescript) adalah tempat yang bagus untuk mengajukan pertanyaan dan mendapatkan bantuan terkait masalah TypeScript dan React.
