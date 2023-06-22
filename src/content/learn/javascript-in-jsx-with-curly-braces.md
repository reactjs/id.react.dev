---
title: JavaScript di JSX Menggunakan Kurung Kurawal
---

<Intro>

JSX memungkinkan Anda menulis markup mirip HTML di dalam file JavaScript, sehingga membuat logika rendering dan konten berada pada satu tempat yang sama. Terkadang Anda akan ingin menambahkan sedikit logika JavaScript atau merujuk pada properti yang dinamis di dalam markup tersebut. Dalam situasi ini, Anda dapat menggunakan tanda kurung kurawal pada JSX untuk membuka akses ke JavaScript.

</Intro>

<YouWillLearn>

* Bagaimana cara mengoper *string* dengan tanda kutip
* Bagaimana cara mereferensikan variabel didalam JSX dengan kurung kurawal
* Bagaimana cara memanggil fungsi Javascript didalam JSX dengan kurung kurawal
* Bagaimana cara menggunakan objek Javascript didalam JSX dengan kurung kurawal

</YouWillLearn>

## Mengoper string dengan tanda kutip {/*passing-strings-with-quotes*/}

Ketika Anda ingin oper atribut *string* ke JSX, Anda memasukkannya ke dalam tanda kutip tunggal atau ganda:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Di sini, `"https://i.imgur.com/7vQD0fPs.jpg"` dan `"Gregorio Y. Zara"` sedang dioper sebagai *string*.

Namun bagaimana jika Anda ingin secara dinamis menentukan teks `src` atau `alt? Anda dapat **menggunakan nilai dari JavaScript dengan mengganti `"` dan `"` dengan `{` dan `}`**:


<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Perhatikan perbedaan antara `className="avatar"`, yang menentukan nama kelas CSS `"avatar"` yang membuat gambar bulat, dan `src={avatar}` yang membaca nilai variabel JavaScript disebut `avatar`. Hal itu terjadi karena kurung kurawal memungkinkan Anda bekerja dengan JavaScript langsung di markup Anda!

## Menggunakan kurung kurawal: Jendela ke dunia JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX merupakan cara khusus dalam menulis JavaScript. Artinya, memungkinkan untuk menggunakan JavaScript di dalamnya - dengan kurung kurawal `{ }`. Contohnya di bawah ini pertama-tama mendeklarasikan sebuah nama untuk ilmuwan, `name`, kemudian menyematkannya dengan kurung kurawal di dalam `<h1>`:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

Coba ubah nilai `name` dari `'Gregorio Y. Zara'` menjadi `'Hedy Lamarr'`. Lihat bagaimana judul daftar berubah?

Setiap ekspresi JavaScript akan berfungsi di antara kurung kurawal, termasuk fungsi seperti  `formatDate()`:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Dimana menggunakan kurung kurawal? {/*where-to-use-curly-braces*/}

Anda hanya dapat menggunakan kurung kurawal (curly braces) dalam dua cara di dalam JSX:

1. **Sebagai teks** langsung di dalam tag JSX: `<h1>Daftar Tugas {name}</h1>` berfungsi, tetapi `<{tag}>Daftar Tugas Gregorio Y. Zara</{tag}>` tidak akan berhasil.
2. **Sebagai atribut** yang segera mengikuti tanda dengan `=`: `src={avatar}` akan membaca variabel `avatar`, tetapi `src="{avatar}"` akan mengoper string `"{avatar}"`.

## Menggunakan "kurung kurawal ganda": CSS dan objek lain di JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Selain string, angka, dan ekspresi JavaScript lainnya, Anda bahkan dapat mengoper objek dalam JSX. Objek juga ditandai dengan kurung kurawal, seperti `{ name: "Hedy Lamarr", inventions: 5 }`. Oleh karena itu, untuk mengoper objek JavaScript di JSX, Anda harus membungkus objek tersebut dalam sepasang kurung kurawal lainnya: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Anda mungkin melihat ini pada gaya CSS *inline* dalam JSX. React tidak mengharuskan Anda untuk menggunakan gaya *inline* (kelas CSS berfungsi lebih baik untuk kebanyakan kasus). Namun, ketika Anda membutuhkan gaya *inline*, Anda dapat mengoper objek ke atribut `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Coba ubah nilai dari `backgroundColor` dan `color`.

Anda dapat melihat objek JavaScript di dalam kurung kurawal dengan jelas ketika Anda menulisnya seperti ini:


```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

Ketika Anda melihat `{{` dan `}}` di dalam JSX, Anda akan tahu bahwa itu tidak lebih dari objek di dalam kurung kurawal JSX!


<Pitfall>

Properti `style` dalam bentuk *inline* ditulis menggunakan gaya *camelCase* di dalam JSX. Sebagai contoh, jika pada HTML Anda menuliskan `<ul style="background-color: black">`, maka pada komponen React Anda harus menulisnya sebagai `<ul style={{ backgroundColor: 'black' }}>`.

</Pitfall>

## Lebih banyak kesenangan dengan objek JavaScript dan kurung kurawal {/*more-fun-with-javascript-objects-and-curly-braces*/}

Anda dapat memasukkan beberapa ekspresi ke dalam satu objek, dan merujuk pada objek tersebut di dalam JSX menggunakan kurung kurawal. Sebagai contoh:

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
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
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

Pada contoh ini, objek JavaScript `person` berisi sebuah string `name` dan sebuah objek `theme`:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Komponen dapat menggunakan nilai-nilai dari objek `person` seperti ini:


```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX sangat sederhana sebagai bahasa templating karena memungkinkan Anda untuk mengorganisir data dan logika menggunakan JavaScript.

<Recap>

Sekarang Anda hampir tahu segalanya tentang JSX:

* Atribut JSX di dalam tanda kutip dianggap sebagai string.
* Kurung kurawal memungkinkan Anda membawa logika JavaScript dan variabel ke dalam markup.
* Kurung kurawal berfungsi di dalam konten tag JSX atau segera setelah `=` pada atribut.
* `{{` dan `}}` bukanlah sintaks khusus: itu adalah objek JavaScript yang tersembunyi di dalam kurung kurawal JSX.

</Recap>

<Challenges>

#### Perbaiki Kesalahan {/*fix-the-mistake*/}

Kode ini mengalami *crash* dengan pesan galat yang menyatakan `Objects are not valid as a React child`:

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
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
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

Bisakah Anda menemukan masalahnya?

<Hint>Periksa apa yang ada di dalam kurung kurawal. Apakah kita meletakkan sesuatu yang benar di sana?</Hint>

<Solution>

Ini terjadi karena contoh ini me-*render* *objek itu sendiri* ke dalam markup bukan string: `<h1>{person}'s Todos</h1>` mencoba *render* seluruh objek `person`! Menyertakan objek mentah sebagai konten teks menghasilkan kesalahan karena React tidak tahu bagaimana Anda ingin menampilkannya.

Untuk memperbaikinya, ganti `<h1>{person}'s Todos</h1>` dengan `<h1>{person.name}'s Todos</h1>`:

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
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
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

</Solution>

#### Ekstrak informasi ke dalam sebuah objek {/*extract-information-into-an-object*/}

Ekstrak URL gambar ke dalam objek `person`.

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
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
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

<Solution>

Pindahkan URL gambar ke dalam properti yang disebut `person.imageUrl` dan baca dari tag `<img>` menggunakan kurung kurawal:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
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
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
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

</Solution>

#### Menulis ekspresi di dalam kurung kurawal JSX {/*write-an-expression-inside-jsx-curly-braces*/}

Pada objek di bawah ini, URL lengkap gambar dibagi menjadi empat bagian: URL dasar, `imageId`, `imageSize`, dan ekstensi file.

Kita ingin URL gambar menggabungkan atribut-atribut ini bersama-sama: URL dasar (selalu `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), dan ekstensi file (selalu `'.jpg'`). Namun, ada yang salah dengan bagaimana tag `<img>` menentukan `src`.

Bisakah anda memperbaikinya?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Untuk memeriksa apakah perbaikan Anda berhasil, coba ubah nilai dari `imageSize` menjadi `'b'`. Gambar harus menyesuaikan ukuran setelah diubah.

<Solution>

Anda bisa menuliskannya seperti ini `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` membuka ekspresi JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` menghasilkan string URL yang benar
3. `}` menutup ekspresi JavaScript.

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Anda juga dapat memindahkan ekspresi ini ke fungsi terpisah seperti `getImageUrl` di bawah ini.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Variabel dan fungsi dapat membantu Anda menjaga markup tetap sederhana!

</Solution>

</Challenges>
