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

### Membuat Fungsi Server dari Komponen Server {/*creating-a-server-function-from-a-server-component*/}

Komponen Server dapat mendefinisikan Fungsi Server dengan direktif `"use server"`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Komponen Server
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Fungsi Server
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}

Ketika React merender Komponen Server `EmptyNote`, ia akan membuat referensi ke fungsi `createNoteAction`, dan meneruskan referensi itu ke Komponen Client `Button`. Ketika tombol diklik, React akan mengirim permintaan ke server untuk mengeksekusi fungsi `createNoteAction` dengan referensi yang diberikan:

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

Untuk lebih jelasnya, lihat dokumen tentang [`"use server"`](/reference/rsc/use-server).


### Mengimpor Fungsi Server dari Komponen Client {/*importing-server-functions-from-client-components*/}

Komponen Client dapat mengimpor Fungsi Server dari file yang menggunakan direktif `"use server"`:

```js [[1, 3, "createNote"]]
"use server";

export async function createNote() {
  await db.notes.create();
}

```

Ketika bundler membangun Komponen Client `EmptyNote`, ia akan membuat referensi ke fungsi `createNoteAction` dalam bundle. Ketika `button` diklik, React akan mengirim permintaan ke server untuk mengeksekusi fungsi `createNoteAction` menggunakan referensi yang diberikan:

```js [[1, 2, "createNote"], [1, 5, "createNote"], [1, 7, "createNote"]]
"use client";
import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  <button onClick={() => createNote()} />
}
```

Untuk lebih jelasnya, lihat dokumen tentang [`"use server"`](/reference/rsc/use-server).

### Fungsi Server dengan Aksi {/*server-functions-with-actions*/}

Fungsi Server dapat digabungkan dengan Aksi di klien:

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Nama diperlukan'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {error && <span>Gagal: {error}</span>}
    </form>
  )
}
```

Ini memungkinkan Anda mengakses status `isPending` dari Fungsi Server dengan membungkusnya dalam Aksi di klien.

Untuk lebih jelasnya, lihat dokumen tentang [Memanggil Fungsi Server di luar `<form>`](/reference/rsc/use-server#calling-a-server-action-outside-of-form)

### Menggunakan Fungsi Server dengan Aksi Form {/*using-server-functions-with-form-actions*/}

Fungsi Server bekerja dengan fitur Formulir baru di React 19.

Anda dapat meneruskan Fungsi Server ke Formulir untuk secara otomatis mengirim formulir ke server:


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

Ketika pengiriman Formulir berhasil, React secara otomatis akan mereset formulir. Anda dapat menambahkan `useActionState` untuk mengakses status tertunda, respons terakhir, atau untuk mendukung peningkatan progresif.

Untuk lebih jelasnya, lihat dokumen tentang [Fungsi Server dalam Formulir](/reference/rsc/use-server#server-actions-in-forms).

## Fungsi Server dengan `useActionState` {/*server-functions-with-use-action-state*/}

Anda dapat menggabungkan Fungsi Server dengan `useActionState` untuk kasus umum di mana Anda hanya perlu mengakses status tertunda aksi dan respons terakhir yang dikembalikan:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Gagal: {state.error}</span>}
    </form>
  );
}
```

Saat menggunakan `useActionState` dengan Fungsi Server, React juga secara otomatis akan memutar ulang pengiriman formulir yang dimasukkan sebelum hidrasi selesai. Ini berarti pengguna dapat berinteraksi dengan aplikasi Anda bahkan sebelum aplikasi terhidrasi.

Untuk lebih jelasnya, lihat dokumen tentang [`useActionState`](/reference/react-dom/hooks/useFormState).

### Peningkatan progresif dengan `useActionState` {/*progressive-enhancement-with-useactionstate*/}

Fungsi Server juga mendukung peningkatan progresif dengan argumen ketiga dari `useActionState`.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

Ketika <CodeStep step={2}>tautan permanen</CodeStep> disediakan ke `useActionState`, React akan mengalihkan ke URL yang diberikan jika formulir dikirim sebelum bundel JavaScript dimuat.

Untuk lebih jelasnya, lihat dokumen tentang [`useActionState`](/reference/react-dom/hooks/useFormState).
