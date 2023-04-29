---
title: Me-render List
---

<Intro>

Anda mungkin ingin menampilkan beberapa komponen yang mirip dari sebuah kumpulan data. Anda dapat menggunakan [*method* senarai (array) JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) untuk memanipulasi sebuah senarai data. Pada halaman ini, Anda akan menggunakan *method* [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) dan [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) dengan React untuk menyaring dan mengubah senarai data tersebut menjadi sebuah senarai komponen.

</Intro>

<YouWillLearn>

* Bagaimana me-*render* komponen-komponen dari sebuah senarai menggunakan *method* `map()`
* Bagaimana me-*render* beberapa komponen spesifik menggunakan *method* `filter()`
* Kapan dan mengapa menggunakan React *keys*

</YouWillLearn>

## Me-*render* data dari senarai {/*rendering-data-from-arrays*/}

Misalkan Anda memiliki daftar konten seperti berikut.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

Semua anggota dari daftar tersebut memiliki format yang sama. Perbedaan hanya terletak pada isi konten, lebih tepatnya data mereka. Pada beberapa situasi, Anda mungkin harus menampilkan beberapa komponen yang sama dengan data yang berbeda saat membangun antarmuka, seperti daftar komentar atau galeri foto profil. Dalam situasi-situasi tersebut, Anda bisa menyimpan data tersebut ke dalam objek atau senarai JavaScript dengan menggunakan *method* [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) dan [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) yang kemudian akan digunakan untuk me-*render* beberapa komponen.

Contoh untuk membuat sebuah daftar dari sebuah senarai:

1. **Pindahkan** data ke sebuah senarai:

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. **Petakan** dengan menggunakan *method* `map()` setiap anggota `people` ke sebuah senarai *node* JSX, `listItems`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Kembalikan** `listItems` dari komponen Anda dengan membungkusnya terlebih dahulu dengan elemen `<ul>`:

```js
return <ul>{listItems}</ul>;
```

Hasilnya seperti berikut:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Perhatikan bahwa *sandbox* di atas menampilkan pesan kesalahan:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

Anda akan mempelajari cara memperbaiki kesalahan ini nanti. Untuk saat ini, kita akan menambahkan struktur ke data Anda.

## Menyaring senarai {/*filtering-arrays-of-items*/}

Kita bisa menambahkan struktur ke data ini.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

Misalkan Anda hanya ingin menampilkan orang yang memiliki profesi `'chemist'`. Anda dapat menggunakan *method* `filter()` dari JavaScript untuk mendapatkan daftar tersebut. *Method* ini menerima masukan berupa sebuah senarai, kemudian menguji setiap anggota dari senarai tersebut dengan sebuah fungsi uji (fungsi yang hanya mengembalikan nilai `true` (benar) atau `false` (salah)), lalu mengembalikan sebuah senarai baru yang terdiri atas anggota-anggota yang lolos uji (memperoleh nilai `true`).

Anda hanya menginginkan orang yang memiliki `profession` berupa `'chemist'`. Oleh karena itu, fungsi ujinya adalah `(person) => person.profession === 'chemist'`. Langkahnya seperti berikut:

1. **Buatkan** sebuah senarai baru yang terdiri atas orang-orang berprofesi `chemists`, dengan memanggil *method* `filter()` terhadap senarai `people` dengan syarat `person.profession === 'chemist'`:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. **Petakan** setiap anggota dari senarai `chemists` menggunakan *method* `map()`, yang sudah kita pelajari, menjadi sebuah senarai *node* JSX, `listItems`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
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
```

3. **Kembalikan** `listItems` dari komponen Anda dengan membungkusnya terlebih dahulu dengan elemen `ul`:

```js
return <ul>{listItems}</ul>;
```

Hasil akhirnya seperti berikut:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
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
  return <ul>{listItems}</ul>;
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

*Arrow function* mengembalikan, secara implisit, pernyataan tepat setelah `=>`, sehingga Anda tidak perlu menulis `return`:

```js
const listItems = chemists.map(person =>
  <li>...</li> // Return secara implisit
);
```

Namun, **Anda harus menulis `return` secara eksplisit jika setelah `=>` terdapat `{`!**

```js
const listItems = chemists.map(person => { // Kurung kurawal
  return <li>...</li>;
});
```

*Arrow function* yang mengandung `=> {` dianggap memiliki ["badan/isi"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body). Anda diperbolehkan menulis fungsi yang melebihi satu baris, tetapi Anda **harus menulis `return`**. Jika Anda melupakan ini, fungsi tersebut tidak akan mengembalikan nilai apapun!

</Pitfall>

## Menjaga urutan dengan `key` {/*keeping-list-items-in-order-with-key*/}

Perhatikan bahwa setiap *sandbox* di atas menampilkan pesan kesalahan di konsol:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

Anda harus memberikan setiap anggota dari senarai sebuah `key`--sebuah *string* atau angka yang dapat mengidentifikasi setiap anggota secara unik:

```js
<li key={person.id}>...</li>
```

<Note>

Setiap elemen JSX yang ada di dalam `map()` harus selalu memiliki `key`!

</Note>

`Key` memberi tahu React mengenai hubungan antara sebuah komponen dengan sebuah anggota senarai. Hal ini krusial jika anggota senarai bisa berubah posisi (contohnya karena proses pengurutan (*sorting*)), ditambah, atau dihapus. Sebuah `key` yang baik dapat membantu React untuk mengetahui apa yang telah terjadi dan menentukan langkah optimal saat memperbarui pohon DOM.

Sebaiknya, `key` terkandung di dalam data Anda:

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
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // Digunakan sebagai key pada JSX
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Digunakan sebagai key pada JSX
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Digunakan sebagai key pada JSX
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Digunakan sebagai key pada JSX
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Digunakan sebagai key pada JSX
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Menampilkan beberapa *node* DOM untuk setiap anggota senarai {/*displaying-several-dom-nodes-for-each-list-item*/}

Bagaimana kalau setiap anggota senarai membutuhkan bukan hanya satu, tetapi beberapa *node* DOM?

Sintaksis singkat [`<>...</>` Fragment](/reference/react/Fragment) tidak memberikan tempat untuk `key`, sehingga Anda harus membungkus ke dalam sebuah `<div>` atau menggunakan [sintaksis `<Fragment>` yang lebih panjang](/reference/react/Fragment#rendering-a-list-of-fragments):

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Pada akhirnya, `Fragment` akan hilang dari DOM dan hanya menyisakan `<h1>`, `<p>`, `<h1>`, `<p>`, dan seterusnya, pada contoh di atas.

</DeepDive>

### Bagaimana Anda memperoleh `key` {/*where-to-get-your-key*/}

Sumber data yang berbeda akan memberikan `key` yang berbeda juga, contoh:

* **Data dari basis data:** Jika data yang digunakan berasal dari basis data, ID dapat digunakan sebagai `key` karena sifatnya yang sudah unik.
* **Data lokal:** Jika data dihasilkan dan disimpan secara lokal (seperti catatan pada aplikasi penulisan catatan), Anda dapat menggunakan *counter* yang bertambah, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID), atau *library* seperti [`uuid`](https://www.npmjs.com/package/uuid).

### Aturan `key` {/*rules-of-keys*/}

* **`Key` harus bersifat unik antar-*sibling*.** Namun, `key` yang sama bisa digunakan lagi di senarai yang berbeda.
* **`Key` tidak boleh berubah** atau fungsinya akan hilang! Jangan membuat `key` di saat me-*render*.

### Mengapa React membutuhkan `key`? {/*why-does-react-need-keys*/}

Bayangkan jika *file* yang ada di komputer Anda tidak memiliki nama. Sebagai pengganti, Anda merujuk ke *file* tersebut dengan urutannya--file pertama, file kedua, dan seterusnya. Saat *file* pertama dihapus, *file* kedua akan menjadi *file* pertama, kemudian *file* ketiga akan menjadi *file* kedua, dan seterusnya. Perujukan *file* menjadi tidak konsisten.

Nama file pada folder dan `key` pada JSX memiliki tujuan yang serupa. Mereka membantu kita mengidentifikasi anggota senarai dan membedakan mereka antar-*sibling*. `Key` yang baik tidak hanya memberikan informasi mengenai posisi *item* di dalam senarai, tetapi juga membantu React mengidentifikasi *item* tersebut sepanjang hidupnya.

<Pitfall>

Anda mungkin tertarik untuk menggunakan indeks pada senarai sebagai `key`. Sebenarnya, itulah yang digunakan React jika Anda tidak memberikan `key`. Namun, urutan anggota senarai dapat berubah saat ada yang ditambah, dihapus, atau diubah urutannya. Jika ini terjadi, ini bisa menimbulkan *bug* yang membingungkan dan sulit ditemukan.

Bukan hanya itu, sebaiknya juga tidak membuat `key` sembarangan, misal `key={Math.random()}`. Hal ini menyebabkan `key` baru dibuat setiap *render*. Akibatnya, komponen dan DOM juga ikut dibuat baru setiap *render*. Pada akhirnya, proses *render* akan menjadi lambat dan masukan dari pengguna juga akan hilang. Oleh karena itu, sebaiknya Anda menggunakan ID yang konsisten yang berasal dari data.

Perlu diperhatikan bahwa komponen tidak bisa membaca `key`, layaknya sebuah *prop*. `Key` hanya digunakan oleh React. Jika komponen Anda membutuhkan ID, Anda harus menggunakan *prop* yang berbeda, contoh `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

Pada halaman ini, Anda telah mempelajari:

* Bagaimana memindahkan data dari komponen ke senarai atau objek.
* Bagaimana membuat himpunan komponen yang serupa dengan menggunakan *method* `map()`.
* Bagaimana membuat senarai dari *item* yang memenuhi suatu kondisi menggunakan *method* `filter()`.
* Mengapa dan bagaimana menentukan `key` untuk setiap komponen pada sebuah *collection* sehingga React bisa melakukan *render* yang optimal meskipun terdapat perubahan pada posisi atau data.

</Recap>



<Challenges>

#### Membagi sebuah daftar menjadi dua {/*splitting-a-list-in-two*/}

Pada contoh ini, terdapat sebuah daftar orang.

Anda diminta untuk menampilkan dua daftar berbeda, satu setelah yang lain: ***Chemists*** dan ***Bukan Chemist***. Seperti sebelumnya, Anda bisa melihat apakah seseorang berprofesi sebagai *chemist* dengan menggunakan `person.profession === 'chemist'`.

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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Anda bisa menggunakan `filter()` dua kali, menghasilkan dua senarai, kemudian aplikasikan `map()` ke dua senarai tersebut:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
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
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
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
        )}
      </ul>
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Pada solusi ini, `map()` dipanggil secara *inline* ke dalam elemen `<ul>`, tetapi jika Anda merasa ini masih agak sulit dibaca, Anda bisa menambahkan variabel baru yang menyimpan senarai tersebut.

Sebenarnya, masih ada duplikasi pada dua daftar yang dibuat. Anda bisa mengekstrak bagian yang duplikat ke dalam sebuah komponen `<ListSection>`:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Bagi pembaca yang sangat teliti, Anda mungkin menyadari pemanggilan `filter()` dua kali mengakibatkan setiap orang dari senarai `people` akan dicek dua kali. Untungnya, pengecekan sebuah *property* objek itu cukup cepat sehingga itu bukan menjadi masalah pada kasus ini. Namun, jika komputasi yang dilakukan lebih mahal, Anda bisa mengganti `filter()` dengan pengulangan manual yang membuat dua senarai sekaligus. Dengan begitu, setiap orang hanya perlu dicek sekali.

Bahkan, jika `people` tidak pernah berubah, Anda bisa menempatkan kode ini di luar komponen Anda. React hanya menginginkan sebuah senarai berisi *node* JSX. React tidak peduli bagaimana Anda dapat memperoleh senarai tersebut:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Daftar bersarang dalam satu komponen {/*nested-lists-in-one-component*/}

Anda diminta untuk membuat sebuah daftar resep dari sebuah senarai yang telah disediakan. Untuk setiap resep yang ada di dalam senarai, Anda diminta untuk menampilkan nama sebagai `<h2>` dan daftar bahannya di dalam `<ul>`.

<Hint>

Tantangan ini membutuhkan Anda untuk membuat dua pemanggilan `map()` yang bersarang.

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Salah satu solusinya seperti berikut:

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Setiap anggota dari `recipes` memiliki *property* `id` yang dapat digunakan di pengulangan sebelah luar sebagai `key`. Namun, hal yang sama tidak berlaku untuk daftar bahan. Walaupun begitu, cukup wajar untuk berasumsi sebuah bahan tidak akan dipakai dua kali di dalam satu resep, sehingga *property* `name` bisa digunakan sebagai `key`. Jika Anda tidak puas dengan hal tersebut, Anda juga bisa mengubah struktur data dan menambahkan ID ke setiap bahan dari setiap resep. Anda juga bisa menggunakan indeks pada senarai sebagai `key`, tetapi Anda tidak bisa mengubah urutan bahan-bahan tersebut.

</Solution>

#### Mengekstrak sebuah komponen daftar *item* {/*extracting-a-list-item-component*/}

Komponen `RecipeList` mengandung dua pemanggilan `map()` yang bersarang. Untuk menyederhanakannya, Anda diminta untuk mengekstrak sebuah komponen `Recipe` yang menerima *prop*, yaitu `id`, `name`, dan `ingredients`. Di mana Anda harus meletakkan `key` dan mengapa?

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Anda bisa menyalin JSX dari `map()` sebelah luar ke dalam sebuah komponen baru, yaitu `Recipe` dan mengembalikan JSX tersebut. Setelah itu, Anda dapat mengubah `recipe.name` menjadi `name`, `recipe.id` menjadi `id`, dan seterusnya. Nantinya, nilai-nilai tersebut dapat diperoleh melalui *prop* dari `Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

`<Recipe {...recipe} key={recipe.id} />` adalah sintaksis singkat yang berarti menyerahkan semua *property* dari objek `recipe` sebagai *prop* ke komponen `Recipe`. Anda juga bisa menuliskannya secara eksplisit seperti `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Perhatikan bahwa `key` diletakkan di `<Recipe>`, bukan pada `<div>` akar yang dikembalikan dari komponen `Recipe`.** Ini disebabkan `key` dibutuhkan di konteks yang sama dengan senarai. Sebelumnya, Anda membuat senarai `<div>` sehingga setiap `div` membutuhkan `key`. Namun, sekarang Anda membuat senarai `<Recipe>`. Oleh karena itu, jika Anda mengekstrak komponen, jangan lupa untuk menaruh `key` di luar JSX yang Anda salin.

</Solution>

#### Daftar dengan pemisah {/*list-with-a-separator*/}

Pada contoh ini, terdapat sebuah *haiku* terkenal dari Katsushika Hokusai yang setiap barisnya dibungkus `<p>`. Anda diminta untuk menambahkan `<hr />` di antara setiap baris sebagai pemisah. Hasil akhirnya akan menyerupai ini:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

Sebuah *haiku* hanya terdiri atas tiga baris, tetapi solusi Anda harus berlaku untuk sembarang jumlah baris. Perhatikan bahwa `<hr />` hanya muncul *di antara* `<p>`, tidak di awal maupun di akhir!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(Ini merupakan kasus langka karena Anda bisa menggunakan indeks pada senarai sebagai `key` sebab urutan baris tidak akan berubah.)

<Hint>

Anda bisa mengubah `map()` ke pengulangan manual atau menggunakan `Fragment`.

</Hint>

<Solution>

Anda bisa membuat pengulangan manual dengan memasukkan `<hr />` dan `<p>...</p>` ke senarai luaran seiring pengulangan berlangsung:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Isi senarai luaran
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Hapus <hr /> pertama
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Penggunakan indeks baris sebagai `key` tidak bisa dilakukan karena setiap pemisah dan baris berada di senarai yang sama. Namun, hal ini bisa dihindari dengan menambahkan akhiran seperti `key={i + '-text'}`.

Anda juga bisa me-*render* sebuah kumpulan fragmen yang mengandung `<hr />` dan `<p>...</p>`. Meskipun begitu, sintaksis singkat `<>...</>` tidak dapat digunakan karena tidak mendukung penggunaan `key`. Oleh karena itu, Anda harus menuliskan `<Fragment>` secara eksplisit:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Ingat, fragmen (biasa ditulis `<> </>`) memberi cara bagi Anda untuk menggabungkan beberapa *node* JSX tanpa perlu menambahkan `<div>` di bagian luar!

</Solution>

</Challenges>
