---
title: JavaScript di JSX menggunakan Curly Braces
---

<Intro>

JSX memungkinkan Anda menulis markup mirip HTML di dalam file JavaScript, sehingga membuat logika rendering dan konten berada pada satu tempat yang sama. Terkadang Anda akan ingin menambahkan sedikit logika JavaScript atau merujuk pada properti yang dinamis di dalam markup tersebut. Dalam situasi ini, Anda dapat menggunakan tanda kurung kurawal pada JSX untuk membuka akses ke JavaScript.

</Intro>

<YouWillLearn>

* Bagaimana cara untuk oper *strings* dengan tanda kutip
* Bagaimana cara mereferensikan variabel didalam JSX dengan kurung kurawal
* Bagaimana cara memanggil fungsi Javascript didalam JSX dengan kurung kurawal
* Bagaimana cara menggunakan objek Javascript didalam JSX dengan kurung kurawal

</YouWillLearn>

## Mengoper *strings* dengan tanda kutip {/*passing-strings-with-quotes*/}

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

Disini, `"https://i.imgur.com/7vQD0fPs.jpg"` dan `"Gregorio Y. Zara"` sedang dioper sebagai *strings*.

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

Anda hanya dapat menggunakan kurung keriting (curly braces) dalam dua cara di dalam JSX:

1. **Sebagai teks** langsung di dalam tag JSX: `<h1>Daftar Tugas {name}</h1>` berfungsi, tetapi `<{tag}>Daftar Tugas Gregorio Y. Zara</{tag}>` tidak akan berhasil.
2. **Sebagai atribut** yang segera mengikuti tanda dengan `=`: `src={avatar}` akan membaca variabel `avatar`, tetapi `src="{avatar}"` akan mengoper string `"{avatar}"`.

## Menggunakan "kurung kurawal ganda": CSS dan objek lain di JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Selain string, angka, dan ekspresi JavaScript lainnya, Anda bahkan dapat oper objek dalam JSX. Objek juga ditandai dengan kurung kurawal, seperti `{ name: "Hedy Lamarr", inventions: 5 }`. Oleh karena itu, untuk oper objek JavaScript di JSX, Anda harus membungkus objek tersebut dalam sepasang kurung kurawal lainnya: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Anda mungkin melihat ini pada gaya CSS *inline* dalam JSX. React tidak mengharuskan Anda untuk menggunakan gaya *inline* (kelas CSS berfungsi lebih baik untuk kebanyakan kasus). Namun, ketika Anda membutuhkan gaya *inline*, Anda dapat oper objek ke atribut `style`:

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

#### Fix the mistake {/*fix-the-mistake*/}

This code crashes with an error saying `Objects are not valid as a React child`:

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

Can you find the problem?

<Hint>Look for what's inside the curly braces. Are we putting the right thing there?</Hint>

<Solution>

This is happening because this example renders *an object itself* into the markup rather than a string: `<h1>{person}'s Todos</h1>` is trying to render the entire `person` object! Including raw objects as text content throws an error because React doesn't know how you want to display them.

To fix it, replace `<h1>{person}'s Todos</h1>` with `<h1>{person.name}'s Todos</h1>`:

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

#### Extract information into an object {/*extract-information-into-an-object*/}

Extract the image URL into the `person` object.

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

Move the image URL into a property called `person.imageUrl` and read it from the `<img>` tag using the curlies:

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

#### Write an expression inside JSX curly braces {/*write-an-expression-inside-jsx-curly-braces*/}

In the object below, the full image URL is split into four parts: base URL, `imageId`, `imageSize`, and file extension.

We want the image URL to combine these attributes together: base URL (always `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), and file extension (always `'.jpg'`). However, something is wrong with how the `<img>` tag specifies its `src`.

Can you fix it?

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

To check that your fix worked, try changing the value of `imageSize` to `'b'`. The image should resize after your edit.

<Solution>

You can write it as `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` opens the JavaScript expression
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` produces the correct URL string
3. `}` closes the JavaScript expression

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

You can also move this expression into a separate function like `getImageUrl` below:

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

Variables and functions can help you keep the markup simple!

</Solution>

</Challenges>
