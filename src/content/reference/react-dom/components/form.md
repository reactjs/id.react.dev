---
title: "<form>"
canary: true
---

<Canary>

Ekstensi React untuk `<form>` saat ini hanya tersedia di kanal *canary* dan eksperimental React. Pada rilis stabil React, `<form>` hanya berfungsi sebagai [komponen HTML bawaan peramban](https://react.dev/reference/react-dom/components#all-html-components). Pelajari lebih lanjut tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

[Komponen `<form>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) memungkinkan Anda membuat kontrol interaktif untuk mengirimkan informasi.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Cari</button>
</form>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<form>` {/*form*/}

Untuk membuat kontrol interaktif untuk mengirimkan informasi, render [komponen `<form>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Cari</button>
</form>
```

[Lihat contoh lainnya di bawah.](#usage)

#### Props {/*props*/}

`<form>` mendukung semua [props elemen umum.](/reference/react-dom/components/common#props)

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): URL atau fungsi. Ketika URL diberikan ke `action`, formulir akan berperilaku seperti komponen formulir HTML. Ketika fungsi diberikan ke `action`, fungsi tersebut akan menangani pengiriman formulir. Fungsi yang diberikan ke `action` dapat berupa *async* dan akan dipanggil dengan satu argumen yang berisi [data formulir](https://developer.mozilla.org/en-US/docs/Web/API/FormData) dari formulir yang dikirimkan. Prop `action` dapat ditimpa oleh atribut `formAction` pada komponen `<button>`, `<input type="submit">`, atau `<input type="image">`.

#### Catatan Penting {/*caveats*/}

* Ketika sebuah fungsi diberikan ke `action` atau `formAction`, metode HTTP akan menjadi POST terlepas dari nilai prop `method`.

---

## Penggunaan {/*usage*/}

### Menangani pengiriman formulir di klien {/*handle-form-submission-on-the-client*/}

Lepaskan sebuah fungsi ke prop `action` dari formulir untuk menjalankan fungsi tersebut saat formulir disubmit. [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) akan diteruskan ke fungsi sebagai argumen sehingga Anda dapat mengakses data yang dikirimkan oleh formulir. Ini berbeda dari konvensional [HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action), yang hanya menerima URL.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`Anda mencari '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Cari</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Menangani pengiriman formulir dengan Server Action {/*handle-form-submission-with-a-server-action*/}

Render sebuah `<form>` dengan input dan tombol kirim. Lepaskan Server Action (sebuah fungsi yang ditandai dengan [`'use server'`](/reference/rsc/use-server)) ke prop `action` dari formulir untuk menjalankan fungsi tersebut saat formulir disubmit.

Melewatkan Server Action ke `<form action>` memungkinkan pengguna untuk mengirimkan formulir tanpa JavaScript yang diaktifkan atau sebelum kode dimuat. Ini menguntungkan bagi pengguna yang memiliki koneksi lambat, perangkat, atau yang memiliki JavaScript dinonaktifkan dan mirip dengan cara kerja formulir ketika URL diberikan ke prop `action`.

Anda dapat menggunakan *field* formulir tersembunyi untuk memberikan data ke aksi `<form>`'s. Server Action akan dipanggil dengan data *field* formulir tersembunyi sebagai *instance* dari [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Tambahkan ke Keranjang</button>
    </form>
  );
}
```

Sebagai pengganti menggunakan *field* formulir tersembunyi untuk memberikan data ke aksi `<form>`, Anda dapat memanggil metode <CodeStep step={1}>`bind`</CodeStep> untuk menyuplai argumen tambahan. Ini akan mengikat argumen baru (<CodeStep step={2}>`productId`</CodeStep>) ke fungsi selain dari <CodeStep step={3}>`formData`</CodeStep> yang diteruskan sebagai argumen ke fungsi.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Tambahkan ke Keranjang</button>
    </form>
  );
}
```

Ketika `<form>` dirender oleh [Server Component](/reference/rsc/use-client), dan [Server Action](/reference/rsc/use-server) diteruskan ke prop `action` `<form>`, formulir akan [ditingkatkan secara progresif](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

### Menampilkan status tertunda selama pengiriman formulir {/*display-a-pending-state-during-form-submission*/}
Untuk menampilkan status tertunda ketika formulir sedang dikirim, Anda dapat memanggil Hook `useFormStatus` dalam komponen yang dirender dalam `<form>` dan membaca properti `pending` yang dikembalikan.

Di sini, kami menggunakan properti `pending` untuk menunjukkan formulir sedang dikirim.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Mengirim..." : "Kirim"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

Untuk mempelajari lebih lanjut tentang Hook `useFormStatus` lihat [dokumentasi referensi](/reference/react-dom/hooks/useFormStatus).

### Memperbarui data formulir secara optimis {/*optimistically-updating-form-data*/}
Hook `useOptimistic` menyediakan cara untuk memperbarui antarmuka pengguna secara optimis sebelum operasi latar belakang, seperti permintaan jaringan, selesai. Dalam konteks formulir, teknik ini membantu membuat aplikasi terasa lebih responsif. Ketika seorang pengguna mengirimkan formulir, alih-alih menunggu respons server untuk mencerminkan perubahan, antarmuka segera diperbarui dengan hasil yang diharapkan.

Sebagai contoh, ketika seorang pengguna mengetik pesan ke dalam formulir dan menekan tombol "Kirim", Hook `useOptimistic` memungkinkan pesan tersebut segera muncul dalam daftar dengan label "Mengirim...", bahkan sebelum pesan tersebut benar-benar dikirim ke server. Pendekatan "optimis" ini memberikan kesan kecepatan dan responsivitas. Formulir kemudian berusaha untuk benar-benar mengirim pesan di latar belakang. Setelah server mengonfirmasi pesan telah diterima, label "Mengirim..." dihapus.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Mengirim...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Halo!" />
        <button type="submit">Kirim</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Halo!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages([...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

[//]: # 'Uncomment the next line, and delete this line after the `useOptimistic` reference documentatino page is published'
[//]: # 'To learn more about the `useOptimistic` Hook see the [reference documentation](/reference/react/hooks/useOptimistic).'

### Menangani kesalahan pengiriman formulir {/*handling-form-submission-errors*/}

Dalam beberapa kasus fungsi yang dipanggil oleh prop `action` dari `<form>` melemparkan sebuah kesalahan. Anda dapat menangani kesalahan ini dengan membungkus `<form>` dalam Error Boundary. Jika fungsi yang dipanggil oleh prop `action` dari `<form>` melemparkan sebuah kesalahan, *fallback* untuk *error boundary* akan ditampilkan.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("kesalahan pencarian");
  }
  return (
    <ErrorBoundary
      fallback={<p>Terjadi kesalahan saat mengirimkan formulir</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Cari</button>
      </form>
    </ErrorBoundary>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Menampilkan kesalahan pengiriman formulir tanpa JavaScript {/*display-a-form-submission-error-without-javascript*/}

Menampilkan pesan kesalahan pengiriman formulir sebelum bundel JavaScript dimuat untuk peningkatan progresif mengharuskan bahwa:

1. `<form>` dirender oleh [Server Component](/reference/rsc/use-client)
1. fungsi yang diteruskan ke prop `action` `<form>` adalah [Server Action](/reference/rsc/use-server)
1. Hook `useActionState` digunakan untuk menampilkan pesan kesalahan

`useActionState` mengambil dua parameter: sebuah [Server Action](/reference/rsc/use-server) dan sebuah *state* awal. `useActionState` mengembalikan dua nilai, sebuah variabel *state* dan sebuah aksi. Aksi yang dikembalikan oleh `useActionState` harus diteruskan ke prop `action` dari formulir. Variabel *state* yang dikembalikan oleh `useActionState` dapat digunakan untuk menampilkan pesan kesalahan. Nilai yang dikembalikan oleh [Server Action](/reference/rsc/use-server) yang diteruskan ke `useActionState` akan digunakan untuk memperbarui variabel *state*.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Menambahkan "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Daftar untuk newsletter saya</h1>
      <p>Daftar dengan email yang sama dua kali untuk melihat kesalahan</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Daftar</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("Alamat email ini sudah ditambahkan");
  }
  emails.push(newEmail);
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

Pelajari lebih lanjut tentang memperbarui *state* dari aksi formulir dengan dokumen [`useActionState`](/reference/react/useActionState).

### Menangani beberapa jenis pengiriman {/*handling-multiple-submission-types*/}

Formulir dapat dirancang untuk menangani beberapa aksi pengiriman berdasarkan tombol yang ditekan oleh pengguna. Setiap tombol di dalam formulir dapat dikaitkan dengan aksi atau perilaku yang berbeda dengan mengatur prop `formAction`.

Ketika seorang pengguna mengetuk tombol tertentu, formulir disubmit, dan aksi yang sesuai, yang ditentukan oleh atribut dan aksi tombol tersebut, dieksekusi. Misalnya, sebuah formulir mungkin mengirimkan artikel untuk ditinjau secara default tetapi memiliki tombol terpisah dengan `formAction` diatur untuk menyimpan artikel sebagai draf.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' telah dipublikasikan dengan tombol '${button}'`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Draf '${content}' Anda telah disimpan!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publikasikan</button>
      <button formAction={save}>Simpan draf</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>
