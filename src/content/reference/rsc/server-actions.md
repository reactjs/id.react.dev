---
title: Aksi Server
canary: true
---

<Intro>

Aksi Server memungkinkan Komponen Client memanggil fungsi async yang dijalankan di server.

</Intro>

<InlineToc />

<Note>

#### Bagaimana cara membangun dukungan untuk Aksi Server? {/*how-do-i-build-support-for-server-actions*/}

Meskipun Aksi Server di React 19 sudah stabil dan tidak akan rusak antar versi mayor, API dasar yang digunakan untuk mengimplementasikan Aksi Server di bundler atau framework React Server Components tidak mengikuti semver dan dapat berubah antar versi minor di React 19.x.

Untuk mendukung Aksi Server sebagai bundler atau framework, kami merekomendasikan untuk mengunci ke versi React tertentu, atau menggunakan rilis Canary. Kami akan terus bekerja sama dengan bundler dan framework untuk menstabilkan API yang digunakan untuk mengimplementasikan Aksi Server di masa mendatang.

</Note>

Ketika sebuah Aksi Server didefinisikan dengan direktif `"use server"`, framework Anda akan secara otomatis membuat referensi ke fungsi server, dan meneruskan referensi tersebut ke Komponen Client. Ketika fungsi itu dipanggil di client, React akan mengirim permintaan ke server untuk mengeksekusi fungsi tersebut, dan mengembalikan hasilnya.

Aksi Server dapat dibuat di Komponen Server dan diteruskan sebagai prop ke Komponen Client, atau dapat diimpor dan digunakan di Komponen Client.

### Membuat Aksi Server dari Komponen Server {/*creating-a-server-action-from-a-server-component*/}

Komponen Server dapat mendefinisikan Aksi Server dengan direktif `"use server"`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Komponen Server
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Aksi Server
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

Ketika React merender Komponen Server `EmptyNote`, ia akan membuat referensi ke fungsi `createNoteAction`, dan meneruskan referensi itu ke Komponen Client `Button`. Ketika tombol diklik, React akan mengirim permintaan ke server untuk mengeksekusi fungsi `createNoteAction` dengan referensi yang diberikan:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={onClick}>Buat Catatan Kosong</button>
}
```

Untuk lebih jelasnya, lihat dokumen tentang [`"use server"`](/reference/rsc/use-server).


### Mengimpor Aksi Server dari Komponen Client {/*importing-server-actions-from-client-components*/}

Komponen Client dapat mengimpor Aksi Server dari file yang menggunakan direktif `"use server"`:

```js [[1, 3, "createNoteAction"]]
"use server";

export async function createNoteAction() {
  await db.notes.create();
}

```

Ketika bundler membangun Komponen Client `EmptyNote`, ia akan membuat referensi ke fungsi `createNoteAction` dalam bundle. Ketika `button` diklik, React akan mengirim permintaan ke server untuk mengeksekusi fungsi `createNoteAction` menggunakan referensi yang diberikan:

```js [[1, 2, "createNoteAction"], [1, 5, "createNoteAction"], [1, 7, "createNoteAction"]]
"use client";
import {createNoteAction} from './actions';

function EmptyNote() {
  console.log(createNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  <button onClick={createNoteAction} />
}
```

Untuk lebih jelasnya, lihat dokumen tentang [`"use server"`](/reference/rsc/use-server).

### Menggabungkan Aksi Server dengan Aksi {/*composing-server-actions-with-actions*/}

Aksi Server dapat digabungkan dengan Aksi di klien:

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
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Gagal: {state.error}</span>}
    </form>
  )
}
```

Ini memungkinkan Anda mengakses status `isPending` dari Aksi Server dengan membungkusnya dalam Aksi di klien.

Untuk lebih jelasnya, lihat dokumen tentang [Memanggil Aksi Server di luar `<form>`](/reference/rsc/use-server#calling-a-server-action-outside-of-form)

### Aksi Form dengan Aksi Server {/*form-actions-with-server-actions*/}

Aksi Server bekerja dengan fitur Formulir baru di React 19.

Anda dapat meneruskan Aksi Server ke Formulir untuk secara otomatis mengirim formulir ke server:


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

Untuk lebih jelasnya, lihat dokumen tentang [Aksi Server dalam Formulir](/reference/rsc/use-server#server-actions-in-forms).

### Aksi Server dengan `useActionState` {/*server-actions-with-use-action-state*/}

Anda dapat menggabungkan Aksi Server dengan `useActionState` untuk kasus umum di mana Anda hanya perlu mengakses status tertunda aksi dan respons terakhir yang dikembalikan:

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

Saat menggunakan `useActionState` dengan Aksi Server, React juga secara otomatis akan memutar ulang pengiriman formulir yang dimasukkan sebelum hidrasi selesai. Ini berarti pengguna dapat berinteraksi dengan aplikasi Anda bahkan sebelum aplikasi terhidrasi.

Untuk lebih jelasnya, lihat dokumen tentang [`useActionState`](/reference/react-dom/hooks/useFormState).

### Peningkatan progresif dengan `useActionState` {/*progressive-enhancement-with-useactionstate*/}

Aksi Server juga mendukung peningkatan progresif dengan argumen ketiga dari `useActionState`.

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
