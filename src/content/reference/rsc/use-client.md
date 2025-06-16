---
title: "'use client'"
titleForTitleTag: "Direktif 'use client'"
---

<RSC>

`'use client'` digunakan dengan [Komponen Server React](/reference/rsc/server-components).

</RSC>


<Intro>

`'use client'` menandai kode-kode yang dipanggil dari sisi klien.

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `'use client'` {/*use-client*/}

Tambahkan `'use client'` di bagian atas file untuk menandai modul dan dependensi transitifnya sebagai kode klien.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

Saat file yang ditandai dengan `'use client'` diimpor dari Komponen Server, [bundler yang kompatibel](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) akan memperlakukan impor modul sebagai batas antara kode yang dijalankan server dan kode yang dijalankan klien.

Sebagai dependensi `RichTextEditor`, `formatDate` dan `Button` juga akan dievaluasi pada klien terlepas dari apakah modulnya berisi direktif `'use client'`. Perhatikan bahwa satu modul dapat dievaluasi pada server saat diimpor dari kode server dan pada klien saat diimpor dari kode klien.

#### Catatan penting {/*caveats*/}

* `'use client'` harus berada di awal file, di atas impor atau kode lain (komentar tidak masalah). Direktif harus ditulis dengan tanda kutip tunggal atau ganda, tetapi tidak dengan tanda kutip terbalik.
* Saat modul `'use client'` diimpor dari modul lain yang dirender klien, direktif tersebut tidak memiliki efek.
* Saat modul komponen berisi direktif `'use client'`, penggunaan komponen tersebut dijamin sebagai Komponen Klien. Namun, komponen tetap dapat dievaluasi pada klien meskipun tidak memiliki direktif `'use client'`.
	* Penggunaan komponen dianggap sebagai Komponen Klien jika didefinisikan dalam modul dengan direktif `'use client'` atau saat merupakan dependensi transitif dari modul yang berisi direktif `'use client'`. Jika tidak, maka merupakan Komponen Server.
* Kode yang ditandai untuk evaluasi klien tidak terbatas pada komponen. Semua kode yang merupakan bagian dari sub-pohon modul Klien dikirim ke dan dijalankan oleh klien.
* Ketika modul yang dievaluasi server mengimpor nilai dari modul `'use client'`, nilai tersebut harus berupa komponen React atau [nilai prop serialisasi yang didukung](#passing-props-from-server-to-client-components) untuk diteruskan ke Komponen Klien. Kasus penggunaan lainnya akan memunculkan pengecualian.

### Bagaimana `'use client'` menandai kode klien {/*how-use-client-marks-client-code*/}

Dalam aplikasi React, komponen sering dibagi menjadi file terpisah, atau [modul](/learn/importing-and-exporting-components#exporting-and-importing-a-component).

Untuk aplikasi yang menggunakan Komponen Server React, aplikasi dirender di *server* secara bawaan. `'use client'` memperkenalkan batasan *server-client* di [pohon dependensi modul](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree), yang secara efektif menciptakan subpohon modul Klien.

Untuk mengilustrasikan hal ini dengan lebih baik, perhatikan aplikasi Komponen Server React berikut.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Aplikasi Menginspirasi Anda" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Kutipan menginspirasi Anda adalah:</p>
      <FancyText text={quote} />
      <button onClick={next}>Beri aku inspirasi lagi</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Jangan biarkan hari kemarin mengambil alih sebagian besar hari ini.” — Will Rogers",
  "Ambisi seperti meletakkan tangga ke langit.",
  "Kebahagiaan yang dibagi adalah kebahagiaan yang berlipat ganda.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

Pada pohon dependensi modul aplikasi contoh ini, direktif `'use client'` dalam `InspirationGenerator.js` menandai modul tersebut dan semua dependensi transitifnya sebagai modul Klien. Subpohon yang dimulai pada `InspirationGenerator.js` sekarang ditandai sebagai modul Klien.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="Grafik pohon dengan simpul teratas yang mewakili modul 'App.js'. 'App.js' memiliki tiga anak: 'Copyright.js', 'FancyText.js', dan 'InspirationGenerator.js'. 'InspirationGenerator.js' memiliki dua anak: 'FancyText.js' dan 'inspirations.js'. Simpul di bawah dan termasuk 'InspirationGenerator.js' memiliki warna latar belakang kuning untuk menandakan bahwa sub-grafik ini dirender oleh klien karena direktif 'use client' dalam 'InspirationGenerator.js'.">
`'use client'` mengelompokkan pohon dependensi modul dari aplikasi Komponen Server React di atas, menandai `InspirationGenerator.js` dan semua dependensinya sebagai yang dirender oleh klien.
</Diagram>

Selama proses render, *framework* akan melakukan server-render pada komponen root dan melanjutkan melalui [pohon render](/learn/understanding-your-ui-as-a-tree#the-render-tree), dengan memilih untuk tidak mengevaluasi kode apa pun yang diimpor dari kode yang ditandai klien.

Bagian pohon render yang dirender server kemudian dikirim ke klien. Klien, dengan kode klien yang diunduh, kemudian menyelesaikan rendering sisa pohon.

<Diagram name="use_client_render_tree" height={250} width={500} alt="Grafik pohon yang setiap simpulnya mewakili komponen dan anak-anaknya sebagai komponen anak. Simpul tingkat atas diberi label 'App' dan memiliki dua komponen anak 'InspirationGenerator' dan 'FancyText'. 'InspirationGenerator' memiliki dua komponen anak, 'FancyText' dan 'Copyright'. Baik 'InspirationGenerator' maupun komponen anaknya 'FancyText' ditandai sebagai hasil render klien.">
Pohon render untuk aplikasi Komponen Server React di atas. `InspirationGenerator` dan komponen anaknya `FancyText` adalah komponen yang diekspor dari kode bertanda klien dan dianggap sebagai Komponen Klien.
</Diagram>

Kami memperkenalkan definisi berikut:

* **Komponen Klien** adalah komponen dalam pohon render yang dirender pada klien.
* **Komponen Server** adalah komponen dalam pohon render yang dirender pada server.

Saat menelusuri aplikasi contoh, `App`, `FancyText`, dan `Copyright` semuanya dirender oleh server dan dianggap sebagai Komponen Server. Karena `InspirationGenerator.js` dan dependensi transitifnya ditandai sebagai kode klien, komponen `InspirationGenerator` dan komponen turunannya `FancyText` adalah Komponen Klien.

<DeepDive>
#### Bagaimana caranya `FancyText` menjadi Komponen Server dan Klien sekaligus? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

Berdasarkan definisi di atas, komponen `FancyText` merupakan Komponen Server dan Klien, bagaimana mungkin?

Pertama, mari kita perjelas bahwa istilah "komponen" tidak terlalu tepat. Berikut ini hanya dua cara "komponen" dapat dipahami:

1. "Komponen" dapat merujuk ke **definisi komponen**. Dalam kebanyakan kasus, ini akan menjadi fungsi.

```js
// This is a definition of a component
function MyComponent() {
  return <p>My Component</p>
}
```

2. "Komponen" juga dapat merujuk pada **penggunaan komponen** dari definisinya.
```js
import MyComponent from './MyComponent';

function App() {
  // This is a usage of a component
  return <MyComponent />;
}
```

Seringkali, ketidaktepatan tidaklah penting saat menjelaskan konsep, tetapi dalam kasus ini penting.

Saat kita berbicara tentang Komponen Server atau Klien, kita mengacu pada penggunaan komponen.

* Jika komponen didefinisikan dalam modul dengan direktif `'use client'`, atau komponen diimpor dan dipanggil dalam Komponen Klien, maka penggunaan komponen tersebut adalah Komponen Klien.
* Jika tidak, penggunaan komponen tersebut adalah Komponen Server.


<Diagram name="use_client_render_tree" height={150} width={450} alt="Grafik pohon yang setiap simpulnya mewakili komponen dan anak-anaknya sebagai komponen anak. Simpul tingkat atas diberi label 'App' dan memiliki dua komponen anak 'InspirationGenerator' dan 'FancyText'. 'InspirationGenerator' memiliki dua komponen anak, 'FancyText' dan 'Copyright'. Baik 'InspirationGenerator' maupun komponen anaknya 'FancyText' ditandai sebagai hasil render klien.">Pohon render yang menggambarkan penggunaan komponen.</Diagram>

Kembali ke pertanyaan tentang `FancyText`, kita melihat bahwa definisi komponen _tidak_ memiliki direktif `'use client'` dan memiliki dua penggunaan.

Penggunaan `FancyText` sebagai anak dari `App`, menandai penggunaan tersebut sebagai Komponen Server. Ketika `FancyText` diimpor dan dipanggil di bawah `InspirationGenerator`, penggunaan `FancyText` tersebut adalah Komponen Klien karena `InspirationGenerator` berisi direktif `'use client'`.

Ini berarti bahwa definisi komponen untuk `FancyText` akan dievaluasi di server dan juga diunduh oleh klien untuk merender penggunaan Komponen Kliennya.

</DeepDive>

<DeepDive>

#### Mengapa `Copyright` merupakan Komponen Server? {/*why-is-copyright-a-server-component*/}

Karena `Copyright` ditampilkan sebagai anak dari Komponen Klien `InspirationGenerator`, Anda mungkin terkejut bahwa itu adalah Komponen Server.

Ingat bahwa `'use client'` mendefinisikan batas antara kode server dan klien pada _pohon dependensi modul_, bukan pohon render.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="Grafik pohon dengan simpul teratas yang mewakili modul 'App.js'. 'App.js' memiliki tiga anak: 'Copyright.js', 'FancyText.js', dan 'InspirationGenerator.js'. 'InspirationGenerator.js' memiliki dua anak: 'FancyText.js' dan 'inspirations.js'. Simpul di bawah dan termasuk 'InspirationGenerator.js' memiliki warna latar belakang kuning untuk menandakan bahwa sub-grafik ini dirender oleh klien karena direktif 'use client' dalam 'InspirationGenerator.js'.">
`'use client'` mendefinisikan batas antara kode server dan klien pada pohon dependensi modul.
</Diagram>

In the module dependency tree, we see that `App.js` imports and calls `Copyright` from the `Copyright.js` module. As `Copyright.js` does not contain a `'use client'` directive, the component usage is rendered on the server. `App` is rendered on the server as it is the root component.

Client Components can render Server Components because you can pass JSX as props. In this case, `InspirationGenerator` receives `Copyright` as [children](/learn/passing-props-to-a-component#passing-jsx-as-children). However, the `InspirationGenerator` module never directly imports the `Copyright` module nor calls the component, all of that is done by `App`. In fact, the `Copyright` component is fully executed before `InspirationGenerator` starts rendering.

The takeaway is that a parent-child render relationship between components does not guarantee the same render environment.

</DeepDive>

### When to use `'use client'` {/*when-to-use-use-client*/}

With `'use client'`, you can determine when components are Client Components. As Server Components are default, here is a brief overview of the advantages and limitations to Server Components to determine when you need to mark something as client rendered.

For simplicity, we talk about Server Components, but the same principles apply to all code in your app that is server run.

#### Advantages of Server Components {/*advantages*/}
* Server Components can reduce the amount of code sent and run by the client. Only Client modules are bundled and evaluated by the client.
* Server Components benefit from running on the server. They can access the local filesystem and may experience low latency for data fetches and network requests.

#### Limitations of Server Components {/*limitations*/}
* Server Components cannot support interaction as event handlers must be registered and triggered by a client.
	* For example, event handlers like `onClick` can only be defined in Client Components.
* Server Components cannot use most Hooks.
	* When Server Components are rendered, their output is essentially a list of components for the client to render. Server Components do not persist in memory after render and cannot have their own state.

### Serializable types returned by Server Components {/*serializable-types*/}

As in any React app, parent components pass data to child components. As they are rendered in different environments, passing data from a Server Component to a Client Component requires extra consideration.

Prop values passed from a Server Component to Client Component must be serializable.

Serializable props include:
* Primitives
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), only symbols registered in the global Symbol registry via [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterables containing serializable values
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are [Server Functions](/reference/rsc/server-functions)
* Client or Server Component elements (JSX)
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) that are not exported from client-marked modules or marked with [`'use server'`](/reference/rsc/use-server)
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are instances of any class (other than the built-ins mentioned) or objects with [a null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`


## Usage {/*usage*/}

### Building with interactivity and state {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

As `Counter` requires both the `useState` Hook and event handlers to increment or decrement the value, this component must be a Client Component and will require a `'use client'` directive at the top.

In contrast, a component that renders UI without interaction will not need to be a Client Component.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

For example, `Counter`'s parent component, `CounterContainer`, does not require `'use client'` as it is not interactive and does not use state. In addition, `CounterContainer` must be a Server Component as it reads from the local file system on the server, which is possible only in a Server Component.

There are also components that don't use any server or client-only features and can be agnostic to where they render. In our earlier example, `FancyText` is one such component.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

In this case, we don't add the `'use client'` directive, resulting in `FancyText`'s _output_ (rather than its source code) to be sent to the browser when referenced from a Server Component. As demonstrated in the earlier Inspirations app example, `FancyText` is used as both a Server or Client Component, depending on where it is imported and used.

But if `FancyText`'s HTML output was large relative to its source code (including dependencies), it might be more efficient to force it to always be a Client Component. Components that return a long SVG path string are one case where it may be more efficient to force a component to be a Client Component.

### Using client APIs {/*using-client-apis*/}

Your React app may use client-specific APIs, such as the browser's APIs for web storage, audio and video manipulation, and device hardware, among [others](https://developer.mozilla.org/en-US/docs/Web/API).

In this example, the component uses [DOM APIs](https://developer.mozilla.org/en-US/docs/Glossary/DOM) to manipulate a [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) element. Since those APIs are only available in the browser, it must be marked as a Client Component.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### Using third-party libraries {/*using-third-party-libraries*/}

Often in a React app, you'll leverage third-party libraries to handle common UI patterns or logic.

These libraries may rely on component Hooks or client APIs. Third-party components that use any of the following React APIs must run on the client:
* [createContext](/reference/react/createContext)
* [`react`](/reference/react/hooks) and [`react-dom`](/reference/react-dom/hooks) Hooks, excluding [`use`](/reference/react/use) and [`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* If they use client APIs, ex. DOM insertion or native platform views

If these libraries have been updated to be compatible with React Server Components, then they will already include `'use client'` markers of their own, allowing you to use them directly from your Server Components. If a library hasn't been updated, or if a component needs props like event handlers that can only be specified on the client, you may need to add your own Client Component file in between the third-party Client Component and your Server Component where you'd like to use it.

[TODO]: <> (Troubleshooting - need use-cases)
