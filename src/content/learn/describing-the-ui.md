---
title: Menggambarkan Antarmuka Pengguna (UI)
---

<Intro>

React adalah pustaka JavaScript untuk melakukan *render* antarmuka pengguna (*User Interface* - UI). UI dibangun dari unit-unit kecil seperti tombol, teks, dan gambar. React memungkinkan Anda menggabungkan unit-unit tersebut menjadi suatu komponen yang *reusable* (dapat digunakan kembali), dan *nestable* (dapat diletakkan secara bersarang dan/atau di bawah komponen lainnya). Dari situs web hingga aplikasi, semua yang ada pada layar dapat dipecah menjadi komponen. Dalam bab ini, Anda akan belajar membuat, menyesuaikan, dan menampilkan komponen React secara kondisional.

</Intro>

<YouWillLearn isChapter={true}>

* [Cara menulis komponen React pertama Anda](/learn/your-first-component)
* [Kapan dan bagaimana membuat file multi-komponen](/learn/importing-and-exporting-components)
* [Cara menambahkan markup ke JavaScript dengan JSX](/learn/writing-markup-with-jsx)
* [Cara menggunakan kurung kurawal dengan JSX untuk mengakses fungsionalitas JavaScript dari komponen Anda](/learn/javascript-in-jsx-with-curly-braces)
* [Cara mengonfigurasi komponen dengan props](/learn/passing-props-to-a-component)
* [Cara melakukan render komponen secara kondisional](/learn/conditional-rendering)
* [Cara melakukan render beberapa komponen sekaligus](/learn/rendering-lists)
* [Cara menghindari bug yang membingungkan dengan menjaga komponen tetap murni](/learn/keeping-components-pure)

</YouWillLearn>

## Komponen Pertama Anda {/*your-first-component*/}

Aplikasi React dibangun dari potongan-potongan antarmuka pengguna (UI) yang terisolasi yang disebut *komponen*. Komponen React adalah sebuah fungsi JavaScript yang dapat Anda tambahkan dengan *markup*. Komponen dapat sekecil tombol atau sebesar halaman utuh. Berikut adalah contoh komponen `Gallery` yang me-*render* tiga komponen `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Ilmuwan yang luar biasa</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

Baca **[Komponen Pertama Anda](/learn/your-first-component)** untuk mempelajari cara mendeklarasikan dan menggunakan komponen React.

</LearnMore>

## Mengimpor dan Mengekspor Komponen {/*importing-and-exporting-components*/}

Anda dapat mendeklarasikan banyak komponen dalam satu file, tetapi file yang besar dapat menjadi sulit untuk dinavigasi/dibaca. Untuk memecahkan masalah ini, Anda dapat *mengekspor* sebuah komponen ke dalam file sendiri, dan kemudian *mengimpor* komponen tersebut dari file lain:


<Sandpack>

```js App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Ilmuwan yang luar biasa</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Baca **[Mengimpor dan Mengekspor Komponen](/learn/importing-and-exporting-components)**  untuk belajar bagaimana memecah komponen ke dalam file-file terpisah.

</LearnMore>

## Menulis markup dengan JSX {/*writing-markup-with-jsx*/}

Setiap komponen React adalah sebuah fungsi JavaScript yang dapat berisi beberapa *markup* yang di-*render* oleh React ke peramban. Komponen React menggunakan ekstensi sintaksis bernama JSX untuk merepresentasikan *markup* tersebut. JSX terlihat mirip dengan HTML, tetapi sedikit lebih ketat dan dapat menampilkan informasi yang dinamis.

Menempel *markup* HTML ke dalam komponen React tidak selalu akan berfungsi:

<Sandpack>

```js
export default function TodoList() {
  return (
    // Ini tidak cukup berhasil
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Ciptakan lampu lalu lintas baru
      <li>Latih adegan film
      <li>Meningkatkan teknologi spektrum
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Jika Anda memiliki HTML seperti ini, Anda dapat memperbaikinya menggunakan [konverter](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Ciptakan lampu lalu lintas baru</li>
        <li>Latih adegan film</li>
        <li>Meningkatkan teknologi spektrum</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Baca **[Menulis Markup dengan JSX](/learn/writing-markup-with-jsx)** untuk mempelajarai cara menulis JSX yang valid.

</LearnMore>

## JavaScript di dalam JSX dengan kurung kurawal {/*javascript-in-jsx-with-curly-braces*/}

JSX memungkinkan Anda menulis *markup* mirip HTML di dalam file JavaScript, menjaga logika *rendering* dan konten di tempat yang sama. Terkadang Anda ingin menambahkan sedikit logika JavaScript atau merujuk pada properti dinamis di dalam markup tersebut. Dalam situasi ini, Anda dapat menggunakan kurung kurawal di JSX Anda untuk "membuka jendela" ke JavaScript:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Meningkatkan videophone</li>
        <li>Menyiapkan kuliah aeronautika</li>
        <li>Mengerjakan mesin berbahan bakar alkohol</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Baca **[JavaScript di dalam JSX dengan Kurung Kurawal](/learn/javascript-in-jsx-with-curly-braces)** untuk mempelajari cara mengakses data JavaScript dari JSX.

</LearnMore>

## Mengoper Props ke sebuah Komponen {/*passing-props-to-a-component*/}

Komponen React menggunakan *props* untuk berkomunikasi satu sama lain. Setiap komponen induk dapat memberikan informasi ke komponen anaknya dengan memberikan *props*. *Props* mungkin mengingatkan Anda pada atribut HTML, tetapi Anda dapat mengoper nilai JavaScript apa pun melalui *props*, termasuk objek, senarai, fungsi, dan bahkan JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Baca **[Mengoper Props ke sebuah Komponen](/learn/passing-props-to-a-component)** untuk mempelajari cara mengoper dan membaca *props*.

</LearnMore>

## Me-render Secara Kondisional {/*conditional-rendering*/}

Komponen Anda seringkali perlu menampilkan hal-hal yang berbeda tergantung pada kondisi yang berbeda. Di React, Anda dapat me-*render* JSX secara kondisional menggunakan sintaks JavaScript seperti `if` *statements*, `&&`, dan `?:` operator.

Dalam contoh ini, operator `&&` JavaScript digunakan untuk me-*render* centang secara kondisional:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Perlengkapan Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Pakaian luar angkasa"
        />
        <Item
          isPacked={true}
          name="Helm dengan daun emas"
        />
        <Item
          isPacked={false}
          name="Foto Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Baca **[Me-*render* Secara Kondisional](/learn/conditional-rendering)** untuk mempelajari cara me-*render* konten secara kondisional.

</LearnMore>

## Me-render List {/*rendering-lists*/}

Anda akan sering ingin menampilkan beberapa komponen serupa dari koleksi data. Anda dapat menggunakan `filter()` dan `map()` dari JavaScript dengan React untuk menyaring dan mentransformasikan senarai data Anda menjadi senarai komponen.

Untuk setiap *item* pada senarai, Anda perlu menentukan sebuah kunci `key`. Biasanya, Anda ingin menggunakan ID dari basisdata sebagai `key`. `key` memungkinkan React untuk melacak posisi setiap *item* di dalam daftar bahkan jika daftar berubah.

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        yang terkenal dengan {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Ilmuwan</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'ahli matematika',
  accomplishment: 'perhitungan penerbangan luar angkasa',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'ahli kimia',
  accomplishment: 'penemuan lubang ozon Arktik',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'ahli fisika',
  accomplishment: 'teori elektromagnetik',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'ahli kimia',
  accomplishment: 'perintis obat kortison, steroid dan pil KB',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'ahli astrofisika',
  accomplishment: 'perhitungan massa bintang kerdil putih',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Baca **[Me-*render* List](/learn/rendering-lists)** untuk mempelajari cara me-*render* daftar komponen dan cara memilih `key`.

</LearnMore>

## Menjaga Komponen Tetap Murni {/*keeping-components-pure*/}

Sebagian fungsi JavaScript adalah murni (*pure*). Sebuah fungsi murni:

* **Memperhatikan urusannya sendiri.** fungsi tidak mengubah objek atau variabel apapun yang ada sebelum fungsi dipanggil.
* **_Input_ sama, _output_ sama.**  Dengan *input* yang sama, sebuah fungsi murni harus selalu memiliki *output* yang sama.

Dengan hanya benar-benar menulis komponen Anda sebagai fungsi murni, Anda dapat menghindari seluruh *bug* yang membingungkan dan perilaku yang tidak dapat diprediksi saat kode Anda berkembang. Berikut ini adalah contoh komponen tidak murni:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Buruk: memodifikasi variabel yang sudah ada sebelum Cup dipanggil!
  guest = guest + 1;
  return <h2>Cangkir teh untuk tamu #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Anda dapat membuat komponen ini menjadi murni dengan mengoper sebuah *prop* daripada memodifikasi variabel yang sudah ada:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Cangkir teh untuk tamu #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Baca **[Menjaga Komponen Tetap Murni](/learn/keeping-components-pure)** untuk mempelajari cara menulis komponen sebagai fungsi yang murni dan dapat diprediksi.

</LearnMore>

## Apa selanjutnya? {/*whats-next*/}

Lanjut ke [Komponen Pertama Anda](/learn/your-first-component) untuk mulai membaca halaman bab ini dari awal!

Atau, jika Anda sudah familiar dengan topik ini, mengapa tidak membaca tentang [Menambahkan Interaktivitas](/learn/adding-interactivity)?
