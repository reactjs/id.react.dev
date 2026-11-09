---
title: Fungsi Server
---

<RSC>

Fungsi Server digunakan di [Komponen Server React](/reference/rsc/server-components).

**Catatan:** Hingga September 2024, kami menyebut semua Fungsi Server sebagai "Aksi Server". Jika Fungsi Server diteruskan ke *prop action* atau dipanggil dari dalam suatu aksi, maka itu adalah Aksi Server, tetapi tidak semua Fungsi Server adalah Aksi Server. Penamaan dalam dokumentasi ini telah diperbarui untuk mencerminkan bahwa Fungsi Server dapat digunakan untuk berbagai tujuan.

</RSC>

<Intro>

Fungsi Server memungkinkan Komponen Klien memanggil fungsi async yang dijalankan di server.

</Intro>

<InlineToc />

<Note>

#### Bagaimana cara membangun dukungan untuk Fungsi Server? {/*how-do-i-build-support-for-server-functions*/}

Meskipun Fungsi Server di React 19 sudah stabil dan tidak akan rusak antar versi mayor, API dasar yang digunakan untuk mengimplementasikan Fungsi Server di bundler atau framework React Server Components tidak mengikuti semver dan dapat berubah antar versi minor di React 19.x.

Untuk mendukung Fungsi Server sebagai bundler atau framework, kami merekomendasikan untuk mengunci ke versi React tertentu, atau menggunakan rilis Canary. Kami akan terus bekerja sama dengan bundler dan framework untuk menstabilkan API yang digunakan untuk mengimplementasikan Fungsi Server di masa mendatang.

</Note>

Ketika sebuah Fungsi Server didefinisikan dengan direktif `"use server"`, framework Anda akan secara otomatis membuat referensi ke fungsi server, dan meneruskan referensi tersebut ke Komponen Client. Ketika fungsi itu dipanggil di client, React akan mengirim permintaan ke server untuk mengeksekusi fungsi tersebut, dan mengembalikan hasilnya.

Fungsi Server dapat dibuat di Komponen Server dan diteruskan sebagai prop ke Komponen Client, atau dapat diimpor dan digunakan di Komponen Client.

## Penggunaan {/*usage*/}

<<<<<<< HEAD
### Membuat Fungsi Server dari Komponen Server {/*creating-a-server-function-from-a-server-component*/}
=======
### Creating a Server Function in a Server Component {/*creating-a-server-function-from-a-server-component*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Komponen Server dapat mendefinisikan Fungsi Server dengan direktif `"use server"`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Komponen Server
import Button from './Button';

function EmptyNote() {
  async function createNoteAction() {
    // Fungsi Server
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNoteAction} />;
}

Ketika React merender Komponen Server `EmptyNote`, ia akan membuat referensi ke fungsi `createNoteAction`, dan meneruskan referensi itu ke Komponen Client `Button`. Ketika tombol diklik, React akan mengirim permintaan ke server untuk mengeksekusi fungsi `createNoteAction` dengan referensi yang diberikan:

export default function Button({onClick}) {
  console.log(onClick);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>;
}
```

Untuk lebih jelasnya, lihat dokumen tentang [`"use server"`](/reference/rsc/use-server).

<<<<<<< HEAD

### Mengimpor Fungsi Server dari Komponen Client {/*importing-server-functions-from-client-components*/}
=======
### Importing a Server Function into a Client Component {/*importing-server-functions-from-client-components*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Komponen Client dapat mengimpor Fungsi Server dari file yang menggunakan direktif `"use server"`:

```js [[1, 4, "createNote"]]
// actions.js
"use server";

export async function createNote() {
  await db.notes.create();
}
```

Ketika bundler membangun Komponen Client `EmptyNote`, ia akan membuat referensi ke fungsi `createNoteAction` dalam bundle. Ketika `button` diklik, React akan mengirim permintaan ke server untuk mengeksekusi fungsi `createNoteAction` menggunakan referensi yang diberikan:

```js [[1, 4, "createNote"], [1, 7, "createNote"], [1, 9, "createNote"]]
// EmptyNote.js
"use client";

import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  return <button onClick={() => createNote()}>Create Empty Note</button>;
}
```

Untuk lebih jelasnya, lihat dokumen tentang [`"use server"`](/reference/rsc/use-server).

<<<<<<< HEAD
### Fungsi Server dengan Aksi {/*server-functions-with-actions*/}
=======
### Calling a Server Function from an Action {/*server-functions-with-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Fungsi Server dapat digabungkan dengan Aksi di klien:

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Nama diperlukan'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 15, "updateName"], [2, 13, "submitAction"], [2, 28, "submitAction"]]
// UpdateName.js
"use client";

import {useState, useTransition} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  function submitAction() {
    startTransition(async () => {
      const {error} = await updateName(name);
      // State updates after await aren't automatically marked as Transitions,
      // so wrap them in another startTransition.
      startTransition(() => {
        setError(error);
        if (!error) {
          setName('');
        }
      });
    });
  }

  return (
    <form action={submitAction}>
<<<<<<< HEAD
      <input type="text" name="name" disabled={isPending}/>
      {error && <span>Gagal: {error}</span>}
=======
      <input
        type="text"
        name="name"
        value={name}
        onChange={event => setName(event.target.value)}
        disabled={isPending}
      />
      {error && <span>Failed: {error}</span>}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
    </form>
  );
}
```

Ini memungkinkan Anda mengakses status `isPending` dari Fungsi Server dengan membungkusnya dalam Aksi di klien.

<<<<<<< HEAD
Untuk lebih jelasnya, lihat dokumen tentang [Memanggil Fungsi Server di luar `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form)

### Menggunakan Fungsi Server dengan Aksi Form {/*using-server-functions-with-form-actions*/}
=======
For more, see the docs for [Calling a Server Function outside of `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form).

### Passing a Server Function to the `<form>` `action` prop {/*using-server-functions-with-form-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Fungsi Server bekerja dengan fitur Formulir baru di React 19.

<<<<<<< HEAD
Anda dapat meneruskan Fungsi Server ke Formulir untuk secara otomatis mengirim formulir ke server:
=======
Pass a Server Function to the `<form>` `action` prop to submit the form to the server. React passes the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) to the Server Function as its first argument:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    throw new Error('Name is required');
  }
  await db.users.updateName(name);
}
```

```js [[1, 4, "updateName"], [1, 8, "updateName"]]
// UpdateName.js
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  );
}
```

<<<<<<< HEAD
Ketika pengiriman Formulir berhasil, React secara otomatis akan mereset formulir. Anda dapat menambahkan `useActionState` untuk mengakses status tertunda, respons terakhir, atau untuk mendukung peningkatan progresif.
=======
When the Server Function passed to the `<form>` `action` prop succeeds, React automatically resets the form's uncontrolled fields. Users can submit the form before its JavaScript bundle loads. Use `useActionState` to access the Action's pending state and most recent return value.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Untuk lebih jelasnya, lihat dokumen tentang [Fungsi Server dalam Formulir](/reference/rsc/use-server#server-functions-in-forms).

<<<<<<< HEAD
## Fungsi Server dengan `useActionState` {/*server-functions-with-use-action-state*/}

Anda dapat menggabungkan Fungsi Server dengan `useActionState` untuk kasus umum di mana Anda hanya perlu mengakses status tertunda aksi dan respons terakhir yang dikembalikan:
=======
### Calling a Server Function with `useActionState` {/*server-functions-with-use-action-state*/}

Call a Server Function with `useActionState` to access the Action's pending state and most recent return value. The Server Function receives the previous state as its first argument and the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) as its second argument. Its return value becomes the next state:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(previousState, formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "submitAction"], [2, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
<<<<<<< HEAD
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Gagal: {state.error}</span>}
=======
      <input type="text" name="name" disabled={isPending} />
      {state.error && <span>Failed: {state.error}</span>}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
    </form>
  );
}
```

<<<<<<< HEAD
Saat menggunakan `useActionState` dengan Fungsi Server, React juga secara otomatis akan memutar ulang pengiriman formulir yang dimasukkan sebelum hidrasi selesai. Ini berarti pengguna dapat berinteraksi dengan aplikasi Anda bahkan sebelum aplikasi terhidrasi.
=======
When the function passed to `useActionState` is a Server Function, users can submit the form before hydration finishes. React can display the Server Function's return value before JavaScript loads.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Untuk lebih jelasnya, lihat dokumen tentang [`useActionState`](/reference/react-dom/hooks/useFormState).

<<<<<<< HEAD
### Peningkatan progresif dengan `useActionState` {/*progressive-enhancement-with-useactionstate*/}
=======
To keep submitted values or control when the form resets, see [Preserving form values after an Action](/reference/react-dom/components/form#preserve-form-values-after-an-action).

### Supporting progressive enhancement with `useActionState` {/*progressive-enhancement-with-useactionstate*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Fungsi Server juga mendukung peningkatan progresif dengan argumen ketiga dari `useActionState`.

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "/name/update"], [3, 8, "submitAction"], [3, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, {error: null}, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<<<<<<< HEAD
Ketika <CodeStep step={2}>tautan permanen</CodeStep> disediakan ke `useActionState`, React akan mengalihkan ke URL yang diberikan jika formulir dikirim sebelum bundel JavaScript dimuat.
=======
If you pass the <CodeStep step={2}>`permalink`</CodeStep> to `useActionState`, the browser navigates to that URL when the form is submitted before the JavaScript bundle loads. At the destination, render the same form component with the same Server Function and `permalink` so React can pass the returned state to it.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Untuk lebih jelasnya, lihat dokumen tentang [`useActionState`](/reference/react-dom/hooks/useFormState).
