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

Dalam pohon dependensi modul, kita melihat bahwa `App.js` mengimpor dan memanggil `Copyright` dari modul `Copyright.js`. Karena `Copyright.js` tidak berisi direktif `'use client'`, penggunaan komponen dirender di server. `App` dirender di server karena merupakan komponen akar.

Komponen Klien dapat merender Komponen Server karena Anda dapat meneruskan JSX sebagai properti. Dalam kasus ini, `InspirationGenerator` menerima `Copyright` sebagai [anak](/learn/passing-props-to-a-component#passing-jsx-as-children). Namun, modul `InspirationGenerator` tidak pernah secara langsung mengimpor modul `Copyright` atau memanggil komponen, semua itu dilakukan oleh `App`. Faktanya, komponen `Copyright` dieksekusi sepenuhnya sebelum `InspirationGenerator` mulai merender.

Kesimpulannya adalah hubungan render induk-anak antara komponen tidak menjamin lingkungan render yang sama.

</DeepDive>

### Kapan menggunakan `'use client'` {/*when-to-use-use-client*/}

Dengan `'use client'`, Anda dapat menentukan kapan komponen merupakan Komponen Klien. Karena Komponen Server adalah komponen default, berikut adalah penjelasan singkat tentang kelebihan dan keterbatasan Komponen Server untuk menentukan kapan Anda perlu menandai sebuah komponen sebagai komponen yang dirender oleh klien.

Untuk menyederhanakannya, kita berbicara tentang Komponen Server, tetapi prinsip yang sama berlaku untuk semua kode di aplikasi Anda yang dijalankan oleh server.

#### Keuntungan Komponen Server {/*advantages*/}
* Komponen Server dapat mengurangi jumlah kode yang dikirim dan dijalankan oleh klien. Hanya modul Klien yang dibundel dan dievaluasi oleh klien.
* Komponen Server diuntungkan karena berjalan di server. Komponen tersebut dapat mengakses sistem berkas lokal dan mungkin mengalami latensi rendah untuk pengambilan data dan permintaan jaringan.

#### Batasan Komponen Server {/*limitations*/}
* Komponen Server tidak dapat mendukung interaksi karena *event handler* harus didaftarkan dan dipicu oleh klien.
	* Misalnya, *event handler* seperti `onClick` hanya dapat didefinisikan dalam Komponen Klien.
* Komponen Server tidak dapat menggunakan sebagian besar Hook.
	* Saat Komponen Server dirender, outputnya pada dasarnya adalah daftar komponen untuk dirender oleh klien. Komponen Server tidak bertahan dalam memori setelah dirender dan tidak dapat memiliki *state*-nya sendiri.

### Tipe data yang dapat diserialisasikan yang dikembalikan oleh Komponen Server {/*serializable-types*/}

Seperti dalam aplikasi React apa pun, komponen induk meneruskan data ke komponen anak. Karena komponen tersebut dirender dalam lingkungan yang berbeda, meneruskan data dari Komponen Server ke Komponen Klien memerlukan pertimbangan ekstra.

Nilai properti yang diteruskan dari Komponen Server ke Komponen Klien harus dapat diserialisasikan.

Properti yang dapat diserialisasikan meliputi:
* Nilai primitif
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), hanya simbol yang terdaftar di registri Symbol global melalui [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterabel yang berisi nilai yang dapat diserialkan
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) dan [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [Objek](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) biasa: objek-objek yang dibuat dengan [inisialisasi objek](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), dengan properti yang dapat diserialisasikan
* Fungsi yang merupakan [Fungsi Server](/reference/rsc/server-functions)
* Elemen Komponen Klien ataupun Server (JSX)
* [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Perlu diperhatikan, tipe-tipe data tersebut tidak didukung:
* [Fungsi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) yang tidak diekspor dari modul bertanda klien atau ditandai dengan [`'use server'`](/reference/rsc/use-server)
* [Class](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objek yang merupakan *instance* kelas mana pun (selain yang sudah disebutkan) atau objek dengan [prototipe null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbol yang tidak terdaftar secara global, mis. `Symbol('my new symbol')`


## Penggunaan {/*usage*/}

### Membuat komponen dengan interaktivitas dan *state* {/*building-with-interactivity-and-state*/}

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

Karena `Counter` memerlukan Hook `useState` dan *event handler* untuk menambah atau mengurangi nilai, komponen ini harus menjadi Komponen Klien dan akan memerlukan direktif `'use client'` di bagian atas.

Sebaliknya, komponen yang merender UI tanpa interaksi tidak perlu menjadi Komponen Klien.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

Misalnya, komponen induk `Counter`, `CounterContainer`, tidak memerlukan `'use client'` karena tidak interaktif dan tidak menggunakan *state*. Selain itu, `CounterContainer` harus menjadi Komponen Server karena komponen tersebut membaca dari sistem berkas lokal di server, yang hanya mungkin dilakukan di Komponen Server.

Ada juga komponen yang tidak menggunakan fitur khusus server atau klien dan dapat bersifat tidak peduli terhadap di mana komponen tersebut ditampilkan. Dalam contoh sebelumnya, `FancyText` adalah salah satu komponen tersebut.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

Dalam kasus ini, kita tidak menambahkan direktif `'use client'`, yang mengakibatkan _output_ `FancyText` (bukan kode sumbernya) dikirim ke browser saat dirujuk dari Komponen Server. Seperti yang ditunjukkan dalam contoh aplikasi Inspirasi sebelumnya, `FancyText` digunakan sebagai Komponen Server atau Klien, tergantung di mana ia diimpor dan digunakan.

Namun, jika output HTML `FancyText` lebih besar dibandingkan dengan kode sumbernya (termasuk dependensi), mungkin lebih efisien untuk memaksanya agar selalu menjadi Komponen Klien. Komponen yang mengembalikan string *path* SVG yang panjang adalah salah satu kasus di mana mungkin lebih efisien untuk memaksa komponen menjadi Komponen Klien.

### Menggunakan API klien {/*using-client-apis*/}

Aplikasi React Anda mungkin menggunakan API khusus klien, seperti API browser untuk penyimpanan web, manipulasi audio dan video, dan perangkat keras, di antara [lainnya](https://developer.mozilla.org/en-US/docs/Web/API).

Dalam contoh ini, komponen menggunakan [API DOM](https://developer.mozilla.org/en-US/docs/Glossary/DOM) untuk memanipulasi elemen [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). Karena API tersebut hanya tersedia di browser, komponen tersebut harus ditandai sebagai Komponen Klien.

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

### Menggunakan pustaka pihak ketiga {/*using-third-party-libraries*/}

Sering kali dalam aplikasi React, Anda akan memanfaatkan pustaka pihak ketiga untuk menangani pola atau logika UI umum.

Pustaka ini dapat mengandalkan Hook komponen atau API klien. Komponen pihak ketiga yang menggunakan salah satu API React berikut harus berjalan pada klien:
* [createContext](/reference/react/createContext)
* Hook [`react`](/reference/react/hooks) dan [`react-dom`](/reference/react-dom/hooks), kecuali [`use`](/reference/react/use) dan [`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* Jika menggunakan API klien, mis. penyisipan DOM atau *view* dari *platform native*

Jika pustaka ini telah diperbarui agar kompatibel dengan Komponen Server React, maka pustaka tersebut akan menyertakan direktif `'use client'` sendiri, yang memungkinkan Anda untuk menggunakannya langsung dari Komponen Server Anda. Jika pustaka belum diperbarui, atau jika komponen memerlukan *props* seperti *event handler* yang hanya dapat ditentukan pada klien, Anda mungkin perlu menambahkan file Komponen Klien Anda sendiri di antara Komponen Klien pihak ketiga dan Komponen Server Anda di mana Anda ingin menggunakannya.

[TODO]: <> (Troubleshooting - need use-cases)
