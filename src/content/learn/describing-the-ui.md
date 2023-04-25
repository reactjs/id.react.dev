---
title: Menggambarkan Antarmuka Pengguna (UI)
---

<Intro>

React adalah sebuah *library* JavaScript untuk melakukan *render* antarmuka pengguna (UI). UI dibangun dari unit-unit kecil seperti tombol, teks, dan gambar. React memungkinkan Anda menggabungkan unit-unit tersebut menjadi suatu komponen yang *reusable* (dapat digunakan kembali), dan *nestable* (dapat ditempatkan di komponen lainnya). Dari situs web hingga aplikasi telepon, semuanya pada layar dapat dipecah menjadi komponen. Dalam bab ini, Anda akan belajar membuat, menyesuaikan, dan menampilkan komponen React secara bersyarat.

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

Aplikasi React dibangun dari potongan-potongan antaramuka pengguna (UI) yang terisolasi yang disebut *komponen*. Komponen React adalah sebuah fungsi JavaScript yang dapat Anda tambahkan dengan *markup*. Komponen dapat sekecil tombol atau sebesar halaman utuh. Berikut adalah contoh komponen `Gallery` yang me-*render* tiga komponen `Profile`:

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

Anda dapat mendeklarasikan banyak komponen dalam satu file, tetapi file yang besar dapat sulit untuk dinavigasi/dibaca. Untuk memecahkan masalah ini, Anda dapat *mengekspor* sebuah komponen ke dalam file sendiri, dan kemudian *mengimpor* komponen tersebut dari file lain:


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

## Menulis Markup dengan JSX {/*writing-markup-with-jsx*/}

Setiap komponen React adalah fungsi JavaScript yang dapat berisi beberapa *markup* yang di-*render* oleh React ke browser. Komponen React menggunakan ekstensi sintaksis bernama JSX untuk merepresentasikan *markup* tersebut. JSX terlihat mirip dengan HTML, tetapi sedikit lebih ketat dan dapat menampilkan informasi yang dinamis.

Jika kita menempel *markup* HTML yang sudah ada ke dalam komponen React, itu tidak selalu akan berfungsi:

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

## JavaScript di JSX dengan Kurung Kurawal {/*javascript-in-jsx-with-curly-braces*/}

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

Baca **[JavaScript di JSX dengan Kurung Kurawal](/learn/javascript-in-jsx-with-curly-braces)** untuk mempelajari cara mengakses data JavaScript dari JSX.

</LearnMore>

## Mengoper Props ke Komponen {/*passing-props-to-a-component*/}

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

Baca **[Mengoper Props ke Komponen](/learn/passing-props-to-a-component)** untuk mempelajari cara mengoper dan membaca *props*.

</LearnMore>

## Rendering Kondisional {/*conditional-rendering*/}

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
      <h1>Daftar Perlengkapan Mengemudi Sally</h1>
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

Baca **[Rendering Kondisional](/learn/conditional-rendering)** untuk mempelajari cara merender konten secara kondisional.

</LearnMore>

## Rendering lists {/*rendering-lists*/}

You will often want to display multiple similar components from a collection of data. You can use JavaScript's `filter()` and `map()` with React to filter and transform your array of data into an array of components.

For each array item, you will need to specify a `key`. Usually, you will want to use an ID from the database as a `key`. Keys let React keep track of each item's place in the list even if the list changes.

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
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
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

Read **[Rendering Lists](/learn/rendering-lists)** to learn how to render a list of components, and how to choose a key.

</LearnMore>

## Keeping components pure {/*keeping-components-pure*/}

Some JavaScript functions are *pure.* A pure function:

* **Minds its own business.** It does not change any objects or variables that existed before it was called.
* **Same inputs, same output.** Given the same inputs, a pure function should always return the same result.

By strictly only writing your components as pure functions, you can avoid an entire class of baffling bugs and unpredictable behavior as your codebase grows. Here is an example of an impure component:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
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

You can make this component pure by passing a prop instead of modifying a preexisting variable:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
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

Read **[Keeping Components Pure](/learn/keeping-components-pure)** to learn how to write components as pure, predictable functions.

</LearnMore>

## What's next? {/*whats-next*/}

Head over to [Your First Component](/learn/your-first-component) to start reading this chapter page by page!

Or, if you're already familiar with these topics, why not read about [Adding Interactivity](/learn/adding-interactivity)?
