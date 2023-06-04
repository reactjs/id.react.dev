---
title: Berbagi State Antar Komponen
---

<Intro>

Terkadang, Anda ingin dua komponen selalu berubah secara bersamaan. Untuk melakukannya, hapus *state* dari kedua komponen, pindahkan ke komponen induk terdekat, dan kemudian oper ke komponen tersebut melalui *props*. Ini dikenal sebagai *mengangkat state ke atas*, dan ini adalah salah satu hal yang paling umum yang akan Anda lakukan saat menulis kode React.

</Intro>

<YouWillLearn>

- Bagaimana cara berbagi *state* antar komponen dengan menaikkan *state* ke atas (*lifting state up*)
- Apa itu komponen terkendali (*controlled component*) dan tak terkendali (*uncontrolled component*)

</YouWillLearn>

## Contoh Mengangkat State Keatas {/*lifting-state-up-by-example*/}


Pada contoh ini, komponen induk `Accordion` merender dua komponen `Panel` terpisah:

* `Accordion`
  - `Panel`
  - `Panel`

Setiap komponen `Panel` memiliki *state* *boolean* `isActive` yang menentukan apakah kontennya terlihat.


Tekan tombol Tampilkan untuk kedua panel:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Tampilkan
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="Tentang">
        Dengan populasi sekitar 2 juta, Almaty adalah kota terbesar di Kazakhstan. Dari tahun 1929 hingga 1997, itu adalah ibu kota negara tersebut.
      </Panel>
      <Panel title="Etimologi">
        Nama berasal dari <span lang="kk-KZ">алма</span>, kata Kazakh untuk "apel" dan sering diterjemahkan sebagai "penuh dengan apel". Faktanya, wilayah sekitar Almaty dipercaya sebagai rumah leluhur apel, dan tanaman liar <i lang="la">Malus sieversii</i> dianggap sebagai kandidat yang mungkin untuk leluhur apel domestik modern.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Perhatikan bagaimana menekan tombol satu panel tidak memengaruhi panel lainnya--mereka independen.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagram yang menunjukkan pohon dari tiga komponen, satu induk yang diberi label Accordion dan dua anak yang diberi label Panel dan dua komponen anak yang berlabel Panel. Kedua komponen Panel berisi isActive dengan nilai false.">


Awalnya, setiap `Panel` memiliki state `isActive` dengan nilai `false`, sehingga keduanya terlihat tertutup

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="Diagram yang sama seperti sebelumnya, dengan isActive dari komponen Panel anak pertama yang disorot menunjukkan klik dengan nilai isActive diatur ke true. Komponen Panel anak kedua masih berisi nilai false." >


Menekan tombol `Panel` mana pun hanya akan memperbarui *state* `isActive` dari `Panel` itu sendiri

</Diagram>

</DiagramGroup>

**Tetapi sekarang katakanlah Anda ingin mengubah panel tersebut sehingga hanya satu panel yang dibuka pada satu waktu.** Dengan desain di atas, membuka panel kedua berarti secara otomatis menutup panel pertama. Bagaimanakah Anda akan melakukannya?

Untuk mengkoordinasikan kedua panel ini, Anda perlu "mengangkat *state* mereka" ke komponen induk dalam tiga langkah:

1. **Hapus** *state* dari komponen anak.
2. **Oper** data yang dituliskan langsung di dalam kode (*hardcoded*) dari komponen induk.
3. **Tambahkan** *state* ke komponen induk dan oper bersamaan dengan *event handlers*.

Cara ini akan memungkinkan komponen `Accordion` untuk mengkoordinasikan kedua `Panel` dan hanya membuka satu panel pada satu waktu.

### Langkah 1: Hapus state dari komponen anak {/*step-1-remove-state-from-the-child-components*/}


Anda akan memberikan kontrol `isActive` dari `Panel` ke komponen induknya. Ini berarti komponen induk akan mengoper `isActive` ke `Panel` sebagai *prop*. Mulai dengan **menghapus baris ini** dari komponen `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

Lalu, tambahkan `isActive` ke daftar *prop* `Panel`:

```js
function Panel({ title, children, isActive }) 
```

Sekarang komponen induk `Panel` dapat *mengontrol* `isActive` dengan [mengoper sebagai prop.](/learn/passing-props-to-a-component) Sebaliknya, komponen `Panel` sekarang tidak memiliki *kontrol* atas nilai `isActive`--sekarang terserah komponen induk!


### Langkah 2: Oper data yang dituliskan langsung di dalam kode dari komponen induk {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Untuk mengangkat *state*, Anda harus menemukan komponen induk yang paling dekat dari *kedua* komponen anak yang ingin Anda koordinasikan:

* `Accordion` *(komponen induk terdekat)*
  - `Panel`
  - `Panel`

Pada contoh ini, komponen `Accordion` adalah yang terdekat. Karena komponen ini berada di atas kedua panel dan dapat mengontrol *prop* mereka, komponen ini akan menjadi "sumber kebenaran" untuk panel mana yang sedang aktif. Buat komponen `Accordion` mengoper nilai `isActive` yang telah ditentukan sebelumnya (misalnya, `true`) ke kedua panel:


<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="Tentang" isActive={true}>
        Dengan populasi sekitar 2 juta, Almaty adalah kota terbesar di Kazakhstan. Dari tahun 1929 hingga 1997, itu adalah ibu kota negara tersebut.
      </Panel>
      <Panel title="Etimologi" isActive={true}>
        Nama berasal dari <span lang="kk-KZ">алма</span>, kata Kazakh untuk "apel" dan sering diterjemahkan sebagai "penuh dengan apel". Faktanya, wilayah sekitar Almaty dipercaya sebagai rumah leluhur apel, dan <i lang="la">Malus sieversii</i> si liar dianggap sebagai kandidat yang mungkin untuk leluhur apel domestik modern.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Tampilkan
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Coba ubah nilai `isActive` yang dituliskan langsung di dalam kode komponen `Accordion` dan lihat hasilnya di layar.

### Langkah 3: Tambahkan state ke komponen induk {/*step-3-add-state-to-the-common-parent*/}

Memindahkan *state* ke atas seringkali mengubah sifat dari apa yang Anda simpan sebagai *state*. 



Dalam contoh ini, Anda ingin mengubah `Accordion` sehingga hanya satu panel yang dapat dibuka pada satu waktu. Ini berarti bahwa komponen induk `Accordion` perlu melacak *panel mana* yang sedang aktif. Alih-alih nilai `boolean`, ia dapat menggunakan angka sebagai indeks `Panel` aktif untuk variabel *state*:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Ketika `activeIndex` bernilai `0`, panel pertama aktif, dan ketika bernilai `1`, panel kedua aktif.

Menekan tombol "Tampilkan" di salah satu `Panel` perlu mengubah indeks aktif di `Accordion`. Sebuah `Panel` tidak dapat mengatur *state* `activeIndex` secara langsung karena ia didefinisikan di dalam `Accordion`. Komponen `Accordion` perlu *secara ekplisit mengizinkan* komponen `Panel` untuk mengubah *state*-nya dengan [mengoper *event handler* sebagai prop](/learn/responding-to-events#passing-event-handlers-as-props):

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

Elemen `<button>` di dalam `Panel` sekarang akan menggunakan *prop* `onShow` sebagai *event handler* kliknya:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="Tentang"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Dengan populasi sekitar 2 juta, Almaty adalah kota terbesar di Kazakhstan. Dari tahun 1929 hingga 1997, itu adalah ibu kota negara tersebut.
      </Panel>
      <Panel
        title="Etimologi"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
       Nama berasal dari <span lang="kk-KZ">алма</span>, kata Kazakh untuk "apel" dan sering diterjemahkan sebagai "penuh dengan apel". Faktanya, wilayah sekitar Almaty dipercaya sebagai rumah leluhur apel, dan tanaman liar <i lang="la">Malus sieversii</i> dianggap sebagai kandidat yang mungkin untuk leluhur apel domestik modern.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Tampilkan
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Dengan ini, terselesaikanlah pengangkatan *state* ke atas! Memindahkan *state* ke komponen induk memungkinkan Anda untuk mengkoordinasikan kedua panel. Menggunakan indeks aktif alih-alih dua *flag* "ditampilkan" memastikan bahwa hanya satu panel yang aktif pada satu waktu. Dan mengoper *event handler* ke komponen anak memungkinkan komponen anak untuk mengubah *state* induknya.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagram yang menunjukkan pohon tiga komponen, satu induk yang diberi label Accordion dan dua anak yang diberi label Panel. Accordion berisi nilai activeIndex nol yang berubah menjadi nilai isActive true yang dilewatkan ke Panel pertama, dan nilai isActive false yang dioper ke Panel kedua." >


Awalnya, nilai `activeIndex` dari `Accordion` adalah `0`, sehingga `Panel` pertama menerima `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="Diagram yang sama dengan sebelumnya, dengan nilai activeIndex dari komponen induk Accordion yang diberi sorotan menunjukkan klik dengan nilai yang berubah menjadi satu. Aliran ke kedua komponen Panel anak juga disorot, dan nilai isActive yang dioper ke setiap anak diatur ke yang berlawanan: false untuk Panel pertama dan true untuk yang kedua." >


Ketika nilai `activeIndex` dari `Accordion` berubah menjadi `1`, `Panel` kedua menerima `isActive = true` sebagai gantinya

</Diagram>

</DiagramGroup>

<DeepDive>

#### Komponen terkendali dan tak terkendali {/*controlled-and-uncontrolled-components*/}

Secara umum Anda dapat menyebut sebuah komponen yang memiliki *state* lokal sebagai "tak terkendali". Misalnya, komponen `Panel` yang asli dengan variabel *state* `isActive` adalah tak terkendali karena induknya tidak dapat mempengaruhi apakah panel aktif atau tidak.

Sebaliknya, Anda dapat menyebut sebuah komponen "terkendali" ketika informasi penting di dalamnya dikendalikan oleh *prop* daripada *state* lokalnya sendiri. Ini memungkinkan komponen induk untuk sepenuhnya menentukan perilakunya. Komponen `Panel` akhir dengan *prop* `isActive` dikendalikan oleh komponen `Accordion`.

Komponen-komponen tak terkendali lebih mudah digunakan dalam induknya karena membutuhkan konfigurasi yang lebih sedikit. Tetapi mereka kurang fleksibel ketika Anda ingin mengkoordinasikannya bersamaan. Komponen-komponen terkendali sepenuhnya fleksibel, tetapi mereka membutuhkan komponen induk untuk sepenuhnya mengkonfigurasi mereka dengan *props*.

Pada praktiknya, "terkendali" dan "tak terkendali" bukanlah istilah teknis yang ketat--setiap komponen biasanya memiliki beberapa campuran dari kedua *state* lokal dan *props*. Namun, ini adalah cara yang berguna untuk berbicara tentang bagaimana komponen dirancang dan kemampuan apa yang mereka tawarkan.

Ketika menulis komponen, pertimbangkan informasi manakah di dalamnya yang seharusnya dikendalikan (melalui *props*), dan informasi manakah yang seharusnya tak terkendali (melalui *state*). Tetapi Anda selalu dapat mengubah pikiran Anda dan melakukan refaktorasi belakangan.

</DeepDive>

## Satu sumber kebenaran untuk setiap state {/*a-single-source-of-truth-for-each-state*/}

Pada aplikasi React, banyak komponen akan memiliki *state* mereka sendiri. Beberapa *state* mungkin "hidup" dekat dengan komponen daun (komponen di bagian bawah pohon) seperti masukan-masukan (*inputs*). *State* lainnya mungkin "hidup" lebih dekat ke bagian atas aplikasi. Misalnya, bahkan pustaka-pustaka rute pada sisi klien (*client-side routing libraries*) biasanya diimplementasikan dengan menyimpan rute saat ini di *state* React, dan mengopernya dengan *props*!

**Untuk setiap potongan *state* yang unik, Anda akan memilih komponen yang "memilikinya".** Prinsip ini juga dikenal sebagai memiliki ["sumber kebenaran tunggal".](https://en.wikipedia.org/wiki/Single_source_of_truth) Ini tidak berarti bahwa semua *state* berada di satu tempat--tetapi bahwa untuk _setiap_ potongan *state*, ada _komponen_ tertentu yang memegang potongan informasi itu. Alih-alih menduplikasi *state* yang sama diantara komponen, *angkatlah* *state* tersebut ke induk mereka, dan oper ke anak-anak yang membutuhkannya.

Aplikasi Anda akan berubah saat Anda mengerjakannya. Biasanya Anda akan memindahkan *state* ke bawah atau kembali ke atas saat Anda masih mencari tahu di mana setiap potongan *state* "hidup". Semua ini adalah bagian dari proses!

Untuk mengetahui bagaimana penerapannya dalam praktik dengan beberapa komponen lebih banyak, baca [Berpikir dalam React.](/learn/thinking-in-react)

<Recap>

* Ketika Anda ingin mengkoordinasikan dua komponen, pindahkan *state* mereka ke induknya.
* Kemudian oper informasi yang diperlukan melalui *props* dari induk mereka.
* Terakhir, oper *event handler* sehingga komponen anak-anak dapat mengubah *state* induk.
* Dapat membantu jika Anda mempertimbangkan komponen sebagai "terkendali" (dikendalikan oleh *props*) atau "tak terkendali" (dikendalikan oleh *state*).

</Recap>

<Challenges>

#### Masukan yang disinkronkan {/*synced-inputs*/}

Berikut ini dua masukan yang independen. Buat mereka tetap disinkronkan: mengedit satu masukan harus memperbarui masukan lain dengan teks yang sama, dan sebaliknya.

<Hint>

Anda harus mengangkat *state* mereka ke komponen induk.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="masukan pertama" />
      <Input label="masukan kedua" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Pindahkan variabel *state* `text` ke komponen induk bersama dengan *event handler* `handleChange`. Kemudian oper mereka sebagai *props* ke kedua komponen `Input`. Ini akan membuat mereka tetap disinkronkan.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="Masukan pertama"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Masukan kedua"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Memfilter daftar {/*filtering-a-list*/}

Pada contoh ini, `SearchBar` memiliki *state* `query` sendiri yang mengontrol masukan teks. Komponen induknya `FilterableList` menampilkan `List` item, tetapi tidak memperhitungkan kueri pencarian.


Gunakan fungsi `filterItems(foods, query)` untuk memfilter daftar sesuai dengan kueri pencarian. Untuk menguji perubahan Anda, verifikasi bahwa mengetik "s" ke dalam masukan memfilter daftar menjadi "Sushi", "Shish kebab", dan "Dim sum".

Ingat bahwa `filterItems` sudah diimplementasikan dan diimport sehingga Anda tidak perlu menulisnya sendiri!

<Hint>

Anda harus menghapus *state* `query` dan *event handler* `handleChange` dari `SearchBar`, dan memindahkannya ke `FilterableList`. Kemudian oper mereka ke `SearchBar` sebagai *props* `query` dan `onChange`.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi adalah hidangan Jepang tradisional dari nasi yang diawetkan dengan cuka.'
}, {
  id: 1,
  name: 'Dal',
  description: 'Cara paling umum untuk menyiapkan dal adalah dalam bentuk sup yang dapat ditambahkan bawang bombay, tomat, dan berbagai bumbu.'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi adalah pangsit isi yang dibuat dengan cara membungkus adonan tidak beragi di sekitar isian yang gurih atau manis dan dimasak dalam air mendidih.'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab adalah makanan populer yang terdiri dari potongan daging yang ditusuk dan dipanggang.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum adalah berbagai macam hidangan kecil yang biasa dinikmati orang Kanton di restoran untuk sarapan dan makan siang'
}];
```

</Sandpack>

<Solution>

Angkat *state* `query` ke komponen `FilterableList`. Panggil `filterItems(foods, query)` untuk mendapatkan daftar yang difilter dan oper ke `List`. Sekarang ubah masukan kueri tercermin dalam daftar:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi adalah hidangan Jepang tradisional dari nasi yang diawetkan dengan cuka.'
}, {
  id: 1,
  name: 'Dal',
  description: 'Cara paling umum untuk menyiapkan dal adalah dalam bentuk sup yang dapat ditambahkan bawang bombay, tomat, dan berbagai bumbu.'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi adalah pangsit isi yang dibuat dengan cara membungkus adonan tidak beragi di sekitar isian yang gurih atau manis dan dimasak dalam air mendidih.'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab adalah makanan populer yang terdiri dari potongan daging yang ditusuk dan dipanggang.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum adalah berbagai macam hidangan kecil yang biasa dinikmati orang Kanton di restoran untuk sarapan dan makan siang'
}];
```

</Sandpack>

</Solution>

</Challenges>
