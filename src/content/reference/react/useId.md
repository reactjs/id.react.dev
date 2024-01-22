---
title: useId
---

<Intro>

`useId` adalah React Hook untuk menghasilkan ID unik yang dapat diteruskan ke atribut aksesibilitas.
```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useId()` {/*useid*/}

Panggil `useId` di tingkat teratas komponen Anda untuk menghasilkan ID unik:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameter {/*parameters*/}

`useId` tidak mengambil parameter apapun.

#### Kembalian {/*returns*/}

`useId` mengembalikan string ID unik yang terkait dengan panggilan `useId` tertentu dalam komponen khusus ini.

#### Caveats {/*caveats*/}

* `useId` adalah sebuah Hook, jadi Anda hanya dapat memanggilnya **di tingkat teratas komponen Anda** atau Hook Anda sendiri. Anda tidak dapat memanggilnya di dalam perulangan (*loops*) atau kondisi (*conditions*). Jika Anda membutuhkannya, ekstrak komponen baru dan pindahkan *state* ke dalamnya.

* `useId` **tidak boleh digunakan untuk menghasilkan *key*** dalam daftar. [*Key* harus dihasilkan dari data Anda.](/learn/rendering-lists#where-to-get-your-key)

---

## Pengunaan {/*usage*/}

<Pitfall>

**Jangan panggil `useId` untuk menghasilkan *key* dalam daftar.** [*Key* harus dihasilkan dari data Anda](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Menghasilkan ID unik untuk atribut aksesibilitas {/*generating-unique-ids-for-accessibility-attributes*/}

Panggil `useId` di tingkat atas komponen Anda untuk menghasilkan ID unik:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Anda kemudian dapat meneruskan <CodeStep step={1}>ID yang dihasilkan</CodeStep> ke atribut yang berbeda:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Mari telusuri contoh untuk melihat kapan ini berguna.**

[Atribut aksesibilitas HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) seperti [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) membiarkan Anda menentukan bahwa dua *tag* terkait satu sama lain. Misalnya, Anda dapat menentukan bahwa suatu elemen (seperti sebuah masukan (`input`)) dijelaskan oleh elemen lain (seperti sebuah paragraf (`p`)).

Dalam HTML biasa, Anda akan menulisnya seperti ini:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

Namun, menuliskan ID secara langsung di dalam kode (*hardcoding*) seperti ini bukanlah praktik yang baik di React. Sebuah komponen dapat di-*render* lebih dari sekali pada halaman—namun ID harus unik! Alih-alih melakukan pemaksaan ID, buat ID unik dengan `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

Sekarang, meskipun `PasswordField` muncul beberapa kali di layar, ID yang dihasilkan tidak akan berbenturan.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[Tonton video ini](https://www.youtube.com/watch?v=0dNzNcuEuOo) untuk melihat perbedaan pengalaman pengguna dengan teknologi bantu.

<Pitfall>

Dengan [*server rendering*](/reference/react-dom/server), **`useId` membutuhkan pohon komponen yang identik di *server* dan klien**. Jika pohon yang Anda *render* di *server* dan klien tidak sama persis, ID yang dihasilkan tidak akan cocok.

</Pitfall>

<DeepDive>

#### Mengapa useId lebih baik daripada penghitung kenaikan? {/*why-is-useid-better-than-an-incrementing-counter*/}

Anda mungkin bertanya-tanya mengapa `useId` lebih baik daripada menambahkan variabel global seperti `nextId++`.

Manfaat utama `useId` adalah React memastikan bahwa ia bekerja dengan [*server rendering*.](/reference/react-dom/server) Selama *server rendering*, komponen Anda menghasilkan keluaran HTML. Kemudian, pada klien, [hidrasi](/reference/react-dom/client/hydrateRoot) melampirkan *event handler* Anda ke HTML yang dihasilkan. Agar hidrasi berfungsi, output klien harus cocok dengan HTML dari *server*.

<<<<<<< HEAD
Hal ini sangat sulit untuk dijamin dengan penghitung kenaikan karena urutan di mana komponen klien terhidrasi mungkin tidak sesuai dengan urutan di mana HTML dari *server* dipancarkan. Dengan memanggil `useId`, Anda memastikan bahwa hidrasi akan berfungsi, dan hasilnya akan cocok antara *server* dan klien.
=======
This is very difficult to guarantee with an incrementing counter because the order in which the Client Components are hydrated may not match the order in which the server HTML was emitted. By calling `useId`, you ensure that hydration will work, and the output will match between the server and the client.
>>>>>>> 3563d95efe8719bdae8bbd258e6ab4134753348b


Di dalam React, `useId` dihasilkan dari “jalur induk” dari komponen pemanggil. Inilah sebabnya, jika pohon di klien dan *server* sama, "jalur induk" akan cocok terlepas dari urutan *rendering*.

</DeepDive>

---

### Menghasilkan ID untuk beberapa elemen terkait {/*generating-ids-for-several-related-elements*/}

Jika Anda perlu memberikan ID ke beberapa elemen terkait, Anda dapat memanggil `useId` untuk menghasilkan awalan bersama untuk mereka:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Ini memungkinkan Anda menghindari pemanggilan `useId` untuk setiap elemen yang membutuhkan ID unik.

---

### Menentukan awalan bersama untuk semua ID yang dihasilkan {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Jika Anda me-*render* beberapa aplikasi React independen pada satu halaman, berikan `identifierPrefix` sebagai opsi untuk panggilan [`createRoot`](/reference/react-dom/client/createRoot#parameters) atau [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) Anda. Hal ini memastikan bahwa ID yang dihasilkan oleh dua aplikasi berbeda tidak pernah berbenturan karena setiap pengenal yang dibuat dengan `useId` akan dimulai dengan awalan berbeda yang telah Anda tentukan.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### Using the same ID prefix on the client and the server {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

If you [render multiple independent React apps on the same page](#specifying-a-shared-prefix-for-all-generated-ids), and some of these apps are server-rendered, make sure that the `identifierPrefix` you pass to the [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) call on the client side is the same as the `identifierPrefix` you pass to the [server APIs](/reference/react-dom/server) such as [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

You do not need to pass `identifierPrefix` if you only have one React app on the page.
