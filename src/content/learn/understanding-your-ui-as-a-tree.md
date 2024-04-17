---
title: Memahami Antarmuka Pengguna (UI) Anda sebagai Pohon
---

<Intro>

Aplikasi React Anda mulai terbentuk dengan banyak komponen yang dirangkai satu sama lain. Bagaimana cara React melacak struktur komponen aplikasi Anda?

React, dan banyak library antarmuka pengguna (UI) lainnya, memodelkan antarmuka pengguna (UI) sebagai sebuah pohon. Memikirkan aplikasi Anda sebagai sebuah pohon sangat berguna untuk memahami hubungan antar komponen. Pemahaman ini akan membantu Anda men-*debug* konsep-konsep di masa depan seperti kinerja dan manajemen *state*.

</Intro>

<YouWillLearn>

* Bagaimana React "melihat" struktur komponen
* Apa itu pohon *render* dan kegunaannya
* Apa itu pohon modul dependensi dan kegunaannya

</YouWillLearn>

## UI Anda sebagai pohon {/*your-ui-as-a-tree*/}

Pohon adalah model hubungan antara setiap bagian (*item*) dan UI yang sering direpresentasikan dengan menggunakan struktur pohon. Sebagai contoh, Peramban (*browser*) menggunakan struktur pohon untuk memodelkan HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) dan CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Platform seluler (*mobile*) juga menggunakan pohon untuk merepresentasikan hierarki tampilan mereka.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram dengan tiga bagian yang disusun secara horizontal. Pada bagian pertama, terdapat tiga persegi panjang yang ditumpuk secara vertikal, dengan label 'Komponen A', 'Komponen B', dan 'Komponen C'. Transisi ke panel berikutnya adalah sebuah panah dengan logo React di bagian atas yang berlabel 'React'. Bagian tengah berisi sebuah pohon komponen, dengan akar berlabel 'A' dan dua komponen anak berlabel 'B' dan 'C'. Bagian selanjutnya ditransisikan lagi menggunakan panah dengan logo React di bagian atas berlabel 'React DOM'. Bagian ketiga dan terakhir adalah *wireframe* dari sebuah peramban, yang berisi sebuah pohon dengan 8 *node*, yang hanya memiliki sebuah bagian yang disorot (mengindikasikan subpohon dari bagian tengah).">

React membuat sebuah pohon UI dari komponen-komponen Anda. Pada contoh ini, pohon UI kemudian digunakan untuk me-*render* ke DOM.
</Diagram>

Seperti halnya peramban (*browser*) dan perangkat seluler (*mobile*) bergerak, React juga menggunakan struktur pohon untuk mengelola dan memodelkan hubungan antar komponen dalam aplikasi React. Pohon-pohon ini adalah alat yang berguna untuk memahami bagaimana data mengalir melalui aplikasi React dan bagaimana mengoptimalkan *rendering* dan ukuran aplikasi.

## Pohon *Render* {/*the-render-tree*/}

Fitur utama dari komponen adalah kemampuan untuk menyusun komponen dari komponen lain. Saat kita [menyusun komponen](/learn/your-first-component#nesting-and-organizing-components), kita memiliki konsep komponen induk dan anak, di mana setiap komponen induk dapat menjadi anak dari komponen lain.

Ketika kita me-*render* aplikasi React, kita dapat memodelkan hubungan ini dalam sebuah pohon, yang dikenal sebagai pohon *render*.

Berikut ini adalah aplikasi React yang membuat kutipan-kutipan inspiratif.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Aplikasi Dapatkan Inspirasi" />
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
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>Kutipan inspiratif Anda adalah:</p>
      <FancyText text={quote} />
      <button onClick={next}>Berikan Aku inspirasi lagi.</button>
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

```js src/quotes.js
export default [
  "Jangan biarkan hari kemarin menyita terlalu banyak waktu di hari ini.” — Will Rogers",
  "Ambisi adalah menyusun tangga menuju langit.",
  "Kegembiraan yang dibagi adalah kegembiraan yang berlipat ganda.",
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

<Diagram name="render_tree" height={250} width={500} alt="Graf pohon dengan lima simpul. Tiap simpul merepresentasikan sebuah komponen. Akar dari pohon ini adalah App, dengan dua anak panah yang memanjang dari akar tersebut ke 'InspirationGenerator' dan 'FancyText'. Panah-panah tersebut diberi label dengan kata 'render'. Node 'InspirationGenerator' juga memiliki dua anak panah yang mengarah ke node 'FancyText' dan 'Copyright'.">

React membuat sebuah *render tree*, sebuah pohon UI, yang terdiri dari komponen-komponen yang di-*render*.


</Diagram>

Dari contoh aplikasi, kita dapat membuat pohon *render* di atas.

Pohon ini terdiri dari beberapa simpul, yang masing-masing mewakili sebuah komponen. `App`, `FancyText`, `Copyright`, dan beberapa lainnya, merupakan beberapa simpul di dalam pohon kita.

Simpul akar (*root node*) dalam pohon *render* React adalah [komponen akar](/learn/importing-and-exporting-components#the-root-component-file) dari aplikasi. Dalam kasus ini, Akar komponen adalah `Aplikasi` dan merupakan komponen pertama yang di-*render* oleh React. Setiap panah pada pohon menunjuk dari komponen induk ke komponen anak.

<DeepDive>

#### Di mana letak dari tag HTML dalam pohon *render*? {/*di-mana-letak-dari-tag-html-dalam-pohon-render*/}
{/*where-are-the-html-elements-in-the-render-tree*/}

Anda akan melihat pada pohon *render* di atas, tidak disebutkan tag HTML yang di-*render* oleh setiap komponen. Hal ini dikarenakan pohon *render* hanya terdiri dari React [components](learn/your-first-component#components-ui-building-blocks).

React, sebagai sebuah framework UI, bersifat agnostik terhadap platform. Di react.dev, kami menampilkan contoh-contoh yang di-*render* ke web, yang menggunakan markup HTML sebagai primitif UI-nya. Tetapi aplikasi React bisa saja merender ke platform mobile atau desktop, yang mungkin menggunakan primitif UI yang berbeda seperti [UIView](https://developer.apple.com/documentation/uikit/uiview) atau [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Primitif UI platform ini bukan merupakan bagian dari React. Pohon *render* React dapat memberikan wawasan kepada aplikasi React kita terlepas dari platform apa aplikasi Anda di-*render*.

</DeepDive>

Sebuah pohon *render* merepresentasikan sekali *render* pada aplikasi React. Dengan [perenderan kondisional](/learn/conditional-rendering), komponen induk dapat me-*render* anak yang berbeda tergantung pada data yang di-*render*.

Kita dapat memperbarui aplikasi untuk me-*render* secara bersyarat sebuah kutipan inspiratif atau warna.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Aplikasi Dapatkan Inspirasi" />
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

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>{inspiration.type} inspiratif Anda adalah:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Berikan Aku inspirasi lagi</button>
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
  {type: 'quote', value: "Jangan biarkan hari kemarin menyita terlalu banyak waktu di hari ini.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambisi adalah menyusun tangga menuju langit."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "Kegembiraan yang dibagi adalah kegembiraan yang berlipat ganda."},
  {type: 'color', value: "#F9F2B4"},
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
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="Graf pohon dengan enam simpul. Simpul teratas dari pohon diberi label 'App' dengan dua anak panah yang mengarah ke simpul-simpul yang diberi label 'InspirationGenerator' dan 'FancyText'. Panah-panah tersebut merupakan garis solid dan diberi label dengan kata 'render'. Node 'InspirationGenerator' juga memiliki tiga anak panah. Panah ke node 'FancyText' dan 'Color' putus-putus dan diberi label 'renders? Panah terakhir mengarah ke node berlabel 'Copyright' dan berbentuk padat dan diberi label 'renders'.">

Dengan perenderan kondisional, pada *render* yang berbeda, pohon *render* dapat merender komponen yang berbeda.

</Diagram>

Pada contoh ini, tergantung pada apa yang dimaksud dengan `inspiration.type`, Kita bisa me-*render* `<FancyText>` atau `<Color>`. Pohon *render* mungkin berbeda untuk setiap lintasan.

Meskipun pohon *render* (*render tree*) dapat berbeda di seluruh umpan (*pass*) *render*, namun secara umum pohon *render* (*render tree*) ini sangat membantu untuk mengidentifikasi apa itu *top-level* dan *leaf component* di dalam aplikasi React. Komponen tingkat atas (*top-level*) adalah komponen yang paling dekat dengan komponen akar (*root component*) dan mempengaruhi performa *rendering* dari semua komponen di bawahnya dan sering kali memiliki kompleksitas yang paling tinggi. Daun Komponen (*leaf component*) berada di dekat bagian bawah pohon dan tidak memiliki komponen turunan dan sering di-*render* ulang.

Mengidentifikasi kategori komponen ini berguna untuk memahami aliran data dan kinerja aplikasi Anda.

## Pohon dependensi modul (*Module dependency tree*) {/*the-module-dependency-tree*/}

Hubungan lain dalam aplikasi React yang dapat dimodelkan dengan pohon adalah dependensi modul aplikasi. Ketika kita [memecah komponen kita](/learn/importing-and-exporting-components#exporting-and-importing-a-component) dan logika ke dalam berkas-berkas yang terpisah, kita membuat [modul JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) di mana kita bisa mengekspor komponen, fungsi, atau konstanta.

Setiap simpul (*node*) dalam pohon dependensi modul adalah sebuah modul dan setiap cabang merepresentasikan pernyataan `import` dalam modul tersebut.

Jika kita mengambil aplikasi Inspirasi sebelumnya, kita dapat membangun pohon dependensi modul, atau singkatnya pohon dependensi.

<Diagram name="module_dependency_tree" height={250} width={658} alt="Sebuah graf pohon dengan tujuh simpul. Setiap simpul diberi label dengan nama modul. Simpul tingkat teratas dari pohon diberi label 'App.js'. Ada tiga anak panah yang mengarah ke modul 'InspirationGenerator.js', 'FancyText.js' dan 'Copyright.js' dan anak panah tersebut diberi label 'import'. Dari simpul 'InspirationGenerator.js', terdapat tiga anak panah yang mengarah ke tiga modul: 'FancyText.js', 'Color.js', dan 'inspirations.js'. Panah-panah tersebut diberi label 'import'.">

Pohon dependensi modul untuk aplikasi Inspirasi.

</Diagram>

Simpul akar (*root node*) dari pohon adalah modul akar, juga dikenal sebagai file titik masuk (*entrypoint*). Sering kali modul ini adalah modul yang berisi komponen akar (*root component*).

Dibandingkan dengan pohon *render* dari aplikasi yang sama, terdapat struktur yang serupa namun ada beberapa perbedaan penting:

* Simpul (*node*) yang membentuk pohon mewakili modul, bukan komponen.
* Modul non-komponen, seperti `inspirations.js`, juga direpresentasikan dalam pohon ini. Pohon *render* hanya merangkum komponen.
* `Copyright.js` muncul di bawah `App.js` tetapi dalam pohon *render*, `Copyright`, Komponennya, Muncul sebagai anak dari `InspirasiGenerator`. Hal ini karena `InspirationGenerator` menerima JSX sebagai [*children props*](/learn/passing-props-to-a-component#passing-jsx-as-children), Sehingga membuat `Copyright` sebagai komponen anak tetapi tidak mengimpor modul.

Pohon dependensi berguna untuk menentukan modul apa saja yang diperlukan untuk menjalankan aplikasi React Anda. Ketika membangun aplikasi React untuk produksi, Biasanya ada langkah build yang akan memaketkan semua JavaScript yang diperlukan untuk dikirimkan ke klien. Alat yang bertanggung jawab untuk hal ini disebut [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), Dan *bundler* akan menggunakan pohon dependensi untuk menentukan modul apa saja yang harus disertakan.

Seiring dengan pertumbuhan aplikasi Anda, seringkali ukuran *bundel* juga bertambah. Ukuran *bundel* yang besar akan mahal untuk diunduh dan dijalankan oleh klien. Ukuran *bundel* yang besar dapat menunda waktu untuk menggambar antramuka pengguna (UI) Anda. Memahami pohon dependensi aplikasi Anda dapat membantu dalam melakukan *debug* terhadap masalah ini.

[comment]: <> (mungkin kita juga harus mendalami impor bersyarat)

<Recap>

* Pohon (*tree*) adalah cara yang umum untuk merepresentasikan hubungan antar entitas. Mereka sering digunakan untuk memodelkan antramuka pengguna (UI).
* Pohon *Render* (*render tree*) merepresentasikan hubungan bersarang antara komponen-komponen React dalam satu *render*.
* Dengan *render* bersyarat, pohon *render* dapat berubah pada *render* yang berbeda. Dengan nilai *prop* yang berbeda, komponen dapat me-*render* komponen anak (*children component*) yang berbeda.
* Pohon *render* (*render tree*) membantu mengidentifikasi apa yang dimaksud dengan komponen tingka atas (*top-level* dan daun (*leaf*). Komponen tingkat atas memengaruhi performa *rendering* semua komponen di bawahnya dan komponen daun sering di-*render* ulang. Mengidentifikasi komponen ini berguna untuk memahami dan men-*debug* performa *rendering*.
* Pohon dependensi (*dependency tree*) merepresentasikan dependensi modul dalam aplikasi React.
* Pohon dependensi (*dependency tree*) digunakan oleh (*build tool*) untuk menggabungkan kode yang diperlukan untuk mengirimkan aplikasi.
* Pohon dependensi (*dependency tree*) berguna untuk men-*debug* ukuran *bundle* yang besar yang memperlambat waktu untuk melukis (*repaint*) dan membuka peluang untuk mengoptimalkan kode yang di-*bundel*.

</Recap>

[TODO]: <> (Tambahkan tantangan)
