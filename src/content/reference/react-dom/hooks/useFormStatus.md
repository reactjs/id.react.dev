---
title: useFormStatus
---

<<<<<<< HEAD
<Canary>

Hook `useFormStatus` saat ini hanya tersedia di kanal *canary* dan eksperimental React. Pelajari lebih lanjut tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

=======
>>>>>>> 2859efa07357dfc2927517ce9765515acf903c7c
<Intro>

`useFormStatus` adalah Hook yang memberi Anda informasi state pengiriman form terakhir.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

Hook `useFormStatus` memberikan informasi state pengiriman form terakhir.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

Untuk mendapatkan informasi state, komponen `Submit` harus di-_render_ dalam `<form>`. Hook mengembalikan informasi seperti properti <CodeStep step={1}>`pending`</CodeStep> yang memberi tahu Anda apakah form sedang aktif dikirimkan. 

Pada contoh di atas, `Submit` menggunakan informasi ini untuk menonaktifkan penekanan `<button>` ketika form dikirimkan.

[Lihat lebih banyak contoh di bawah.](#usage)

#### Parameter {/*parameters*/}

`useFormStatus` tidak menerima parameter apapun.

#### Kembalian {/*returns*/}

Objek `status` dengan properti berikut:

* `pending`: Sebuah boolean. Jika `true`, ini berarti `<form>` induk sedang menunggu pengiriman. Jika tidak, `false`.

* `data`: Objek yang mengimplementasikan [`FormData interface`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) yang berisi data yang dikirimkan oleh `<form>` induk. Jika tidak ada kiriman atau tidak ada induk `<form>`, maka akan menjadi `null`.

* `method`: Nilai string dari `'get'` atau `'post'`. Ini menunjukkan apakah `<form>` induk mengirimkan dengan [metode HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) `GET` atau `POST`. Secara default, `<form>` akan menggunakan metode `GET` dan dapat ditentukan oleh properti [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action`: Referensi fungsi yang diteruskan ke prop `action` pada `<form>` induk. Jika tidak ada `<form>` induk, propertinya adalah `null`. Jika ada URI yang diberikan ke prop `action`, atau tidak ada prop `action` yang ditentukan, `status.action` akan menjadi `null`.

#### Catatan Penting {/*caveats*/}

* Hook `useFormStatus` harus dipanggil dari komponen yang di-_render_ di dalam `<form>`. 
* `useFormStatus` hanya akan mengembalikan informasi status untuk `<form>` induk. Ini tidak akan mengembalikan informasi status untuk `<form>` apapun yang di-_render_ dalam komponen yang sama atau komponen anak.

---

## Penggunaan {/*usage*/}

### Menampilkan state tertunda selama pengiriman form {/*display-a-pending-state-during-form-submission*/}
Untuk menampilkan state tertunda saat form dikirimkan, Anda dapat memanggil Hook `useFormStatus` dalam komponen yang di-_render_ dalam `<form>` dan membaca properti `pending` yang dikembalikan.

Di sini, kami menggunakan properti `pending` untuk menunjukkan bahwa form sedang dikirimkan. 

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
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
</Sandpack>  

<Pitfall>

##### `useFormStatus` tidak akan mengembalikan informasi status untuk `<form>` yang di-_render_ dalam komponen yang sama. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

Hook `useFormStatus` hanya mengembalikan informasi status untuk `<form>` induk dan bukan untuk `<form>` apa pun yang di-_render_ dalam komponen yang sama yang memanggil Hook, atau komponen anak.

```js
function Form() {
  // 🚩 `pending` will never be true
  // useFormStatus does not track the form rendered in this component
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

Seharusnya panggil `useFormStatus` dari dalam komponen yang terletak di dalam `<form>`.

```js
function Submit() {
  // ✅ `pending` akan diturunkan dari form yang membungkus komponen Submit
  const { pending } = useFormStatus(); 
  return <button disabled={pending}>...</button>;
}

function Form() {
  // Ini adalah <form> yang dipantau oleh `useFormStatus`
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### Membaca data form yang dikirimkan {/*read-form-data-being-submitted*/}

Anda dapat menggunakan properti `data` dari informasi status yang dikembalikan dari `useFormStatus` untuk menampilkan data apa yang dikirimkan oleh pengguna.

Di sini, kita memiliki form di mana pengguna dapat meminta nama pengguna. Kita dapat menggunakan `useFormStatus` untuk menampilkan pesan status sementara yang menginformasikan nama pengguna yang mereka minta.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

</Sandpack>  

---

## Pemecahan masalah {/*troubleshooting*/}

### `status.pending` tidak pernah `true` {/*pending-is-never-true*/}

`useFormStatus` hanya akan mengembalikan informasi status untuk `<form>` induk. 

Jika komponen yang memanggil `useFormStatus` tidak disarangkan dalam `<form>`, `status.pending` akan selalu mengembalikan `false`. Pastikan `useFormStatus` dipanggil dalam komponen yang merupakan turunan dari elemen `<form>`.

`useFormStatus` tidak akan melacak status `<form>` yang di-_render_ dalam komponen yang sama. Lihat [Sandungan](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component) untuk lebih detail.
