---
title: createElement
---

<Intro>

`createElement` memungkinkan Anda membuat elemen React. Ini berfungsi sebagai alternatif untuk menulis [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Panggil `createElement` untuk membuat elemen React dengan parameter `type`, `props`, dan `children`.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[Lihat lebih banyak contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `type`: Argument `type` harus berupa tipe komponen React yang valid. Misalnya, bisa berupa string nama tag (seperti `'div'` atau `'span'`), atau komponen React (fungsi, kelas, atau komponen khusus seperti [`Fragment`](/reference/react/Fragment)).

* `props`: Argumen `props` harus berupa objek atau `null`. Jika Anda mengoper `null`, itu akan diperlakukan sama seperti objek kosong. React akan membuat elemen dengan *props* yang cocok dengan `props` yang telah Anda oper. Perhatikan bahwa `ref` dan `key` dari objek `props` Anda adalah spesial dan *tidak* akan tersedia sebagai `element.props.ref` dan `element.props.key` pada  `element` yang dikembalikan. Mereka akan tersedia sebagai `element.ref` dan `element.key`.

* **optional** `...children`: Nol atau lebih simpul anak. Mereka bisa berupa simpul React apa saja, termasuk elemen React, string, angka, [portal](/reference/react-dom/createPortal), simpul kosong (`null`, `undefined`, `true`, dan `false`), dan array simpul React.

#### Kembalian {/*returns*/}

`createElement` mengembalikan objek elemen React dengan beberapa properti:

<<<<<<< HEAD
* `type`: `type` yang telah Anda oper.
* `props`: `props` yang telah Anda oper kecuali untuk `ref` dan `key`. Jika `type` adalah komponen *legacy* `type.defaultProps`, lalu ada yang hilang atau tidak terdefinisi `props` akan mendapatkan nilai dari `type.defaultProps`.
* `ref`: `ref` yang telah Anda oper. Jika hilang, `null`.
* `key`: `key` yang telah Anda oper, dipaksa untuk string. Jika hilang, `null`.
=======
* `type`: The `type` you have passed.
* `props`: The `props` you have passed except for `ref` and `key`.
* `ref`: The `ref` you have passed. If missing, `null`.
* `key`: The `key` you have passed, coerced to a string. If missing, `null`.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

Biasanya, Anda akan mengembalikan elemen dari komponen Anda atau menjadikannya anak dari elemen lain. Meskipun Anda dapat membaca properti elemen, yang terbaik adalah memperlakukan setiap elemen sebagai buram setelah dibuat, dan hanya me-*render*-nya.

#### Catatan penting {/*caveats*/}

* Anda harus **memperlakukan elemen React dan propertinya sebagai [*Immutable*](https://en.wikipedia.org/wiki/Immutable_object)** dan tidak pernah mengubah isinya setelah dibuat. Dalam pengembangan, React akan [membekukan](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) elemen yang dikembalikan dan `props` properti dangkal untuk menegakkan ini.

* Saat Anda menggunakan JSX, **Anda harus memulai tag dengan huruf kapital untuk me-*render* komponen kustom Anda sendiri.** Dengan kata lain, `<Something />` setara dengan `createElement(Something)`, tetapi `<something />` (huruf kecil) setara dengan `createElement('something')` (perhatikan itu adalah string, sehingga akan diperlakukan sebagai tag HTML bawaan).

* Anda hanya boleh **mengoper anak sebagai beberapa argumen untuk `createElement` jika semuanya diketahui secara statis,** seperti `createElement('h1', {}, child1, child2, child3)`. Jika anak Anda dinamis, oper seluruh array sebagai argumen ketiga: `createElement('ul', {}, listItems)`. Ini memastikan bahwa React akan [memperingatkan Anda tentang *`key`* yang hilang](/learn/rendering-lists#keeping-list-items-in-order-with-key) untuk setiap daftar dinamis. Untuk daftar statis ini tidak diperlukan karena mereka tidak pernah menyusun ulang.

---

## Penggunaan {/*usage*/}

### Membuat elemen tanpa JSX {/*creating-an-element-without-jsx*/}

Jika Anda tidak menyukai [JSX](/learn/writing-markup-with-jsx) atau tidak dapat menggunakannya dalam proyek Anda, Anda dapat menggunakan `createElement` sebagai alternatif.

Untuk membuat elemen tanpa JSX, panggil `createElement` dengan beberapa <CodeStep step={1}>type</CodeStep>, <CodeStep step={2}>*props*</CodeStep>, dan <CodeStep step={3}>*children*</CodeStep>:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

<CodeStep step={3}>Anak (*children*)</CodeStep> bersifat opsional, dan Anda dapat mengoper sebanyak yang Anda butuhkan (contoh di atas memiliki tiga anak). Kode ini akan menampilkan header `<h1>` dengan salam. Sebagai perbandingan, berikut adalah contoh yang sama yang ditulis ulang dengan JSX:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

Untuk me-*render* komponen React Anda sendiri, oper fungsi seperti `Greeting` sebagai <CodeStep step={1}>type</CodeStep> bukan string seperti `'h1'`:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

Dengan JSX, akan terlihat seperti ini:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

Berikut adalah contoh lengkap yang ditulis dengan `createElement`:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Dan berikut adalah contoh yang sama yang ditulis menggunakan JSX:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Kedua gaya pengkodean baik-baik saja, sehingga Anda dapat menggunakan mana yang Anda sukai untuk proyek Anda. Manfaat utama menggunakan JSX dibandingkan dengan `createElement` adalah mudah untuk melihat tag penutup mana yang sesuai dengan tag pembuka mana.

<DeepDive>

#### Apa itu elemen React, tepatnya? {/*what-is-a-react-element-exactly*/}

Elemen adalah deskripsi ringan dari bagian antarmuka pengguna. Misalnya, keduanya `<Greeting name="Taylor" />` dan `createElement(Greeting, { name: 'Taylor' })` menghasilkan objek seperti ini:

```js
// Slightly simplified
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**Perhatikan bahwa membuat objek ini tidak me-*render* komponen `Greeting` atau membuat elemen DOM apa pun.**

Elemen React lebih seperti deskripsi—instruksi untuk React untuk me-*render* komponen `Greeting` nanti. Dengan mengembalikan objek ini dari komponen `App` Anda, Anda memberi tahu React apa yang harus dilakukan selanjutnya.

Membuat elemen sangatlah murah sehingga Anda tidak perlu mencoba mengoptimalkan atau menghindarinya.

</DeepDive>
