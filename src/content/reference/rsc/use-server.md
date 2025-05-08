---
title: "'use server'"
titleForTitleTag: "'use server' directive"
canary: true
---

<Canary>

`'use server'` hanya diperlukan jika Anda [menggunakan Komponen *React Server*](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) atau sedang membangun library yang kompatibel dengan fitur tersebut.

</Canary>


<Intro>

`'use server'` menandai fungsi-fungsi sisi server yang dapat dipanggil dari kode sisi klien.

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `'use server'` {/*use-server*/}

Tambahkan `'use server'` di bagian atas fungsi async untuk menandai bahwa fungsi tersebut dapat dipanggil oleh klien. Kami menyebut fungsi-fungsi ini sebagai [Aksi Server](/reference/rsc/server-actions).

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

Saat memanggil Aksi Server dari klien, `'use server'` akan melakukan permintaan jaringan *(network request)* ke server dan menyertakan salinan ter-serialisasi dari setiap argumen yang dikirim. Jika Aksi Server mengembalikan sebuah nilai, nilai tersebut akan di-serialisasi dan dikembalikan ke klien.

Daripada menandai fungsi satu per satu dengan `'use server'`, Anda bisa menambahkan [Direktif](/reference/rsc/directives) ini di bagian paling atas *file* untuk menandai semua fungsi yang di ekspor dalam *file* tersebut sebagai Aksi Server nantinya semua fungsi yang di ekspor pada *file* tersebut bisa digunakan di mana saja, termasuk diimpor dalam kode klien.

#### Peringatan {/*caveats*/}
* Untuk mengimpor Aksi Server dari [kode klien](/reference/rsc/use-client), direktif harus digunakan pada level modul.
* Karena pemanggilan jaringan yang mendasarinya bersifat asinkron, `'use server'` hanya boleh digunakan pada fungsi asinkron.
* Selalu perlakukan argumen yang diterima Aksi Server sebagai input yang tidak terpercaya, dan pastikan semua perubahan (mutasi) telah diautorisasi. Lihat [pertimbangan keamanan](#security).
* Aksi Server sebaiknya dipanggil dalam sebuah [Transisi](/reference/react/useTransition). Aksi Server yang diteruskan ke [`<form action>`](/reference/react-dom/components/form#props) atau [`formAction`](/reference/react-dom/components/input#props) akan secara otomatis dipanggil dalam sebuah transisi.
* Aksi Server dirancang untuk melakukan mutasi yang memperbarui data di sisi server; Sehingga Aksi Server tidak disarankan untuk pengambilan data. Oleh karena itu, *framework* yang mengimplementasikan Aksi Server umumnya memproses satu aksi dalam satu waktu dan tidak menyediakan mekanisme untuk melakukan *caching* terhadap nilai yang dikembalikan.

### Pertimbangan Keamanan {/*security*/}

Argumen untuk Aksi Server sepenuhnya dikendalikan oleh klien. Demi keamanan, selalu perlakukan argumen tersebut sebagai masukan yang tidak tepercaya, dan pastikan untuk memvalidasi serta menyaring argumen sesuai kebutuhan.

Dalam setiap Aksi Server, pastikan untuk memvalidasi bahwa pengguna yang sedang masuk diizinkan untuk melakukan aksi tersebut.

<Wip>

Untuk mencegah pengiriman data sensitif dari Aksi Server, terdapat *API taint* eksperimental untuk mencegah nilai dan objek unik diteruskan ke kode klien.

Lihat [*experimental_taintUniqueValue*](/reference/react/experimental_taintUniqueValue) dan [*experimental_taintObjectReference*](/reference/react/experimental_taintObjectReference).

</Wip>

### Argumen yang dapat diserialisasi dan Nilai kembalian {/*serializable-parameters-and-return-values*/}

Karena kode klien memanggil Aksi Server melalui jaringan, setiap argumen yang dikirim harus dapat diserialisasi.

Berikut adalah tipe data yang didukung untuk argumen Aksi Server:

* Primitif
	* [*string*](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [*number*](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [*bigint*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [*boolean*](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [*undefined*](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [*null*](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [Simbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), hanya simbol yang didaftarkan dalam Registri Simbol Global melalui [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* *Iterable* yang berisi nilai yang dapat diserialkan
	* [*String*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Senarai](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [*Map*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [*Set*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [*TypedArray*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) dan [*ArrayBuffer*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [*Date*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* *Instance* [*FormData*](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* [Objek](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) biasa: objek yang dibuat dengan [*object initializers*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), dengan properti yang dapat diserialisasi
* Fungsi yang merupakan Aksi Server
* [*Promises*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Yang tidak didukung, antara lain:

* Elemen React, atau [*JSX*](/learn/writing-markup-with-jsx)
* Fungsi komponen atau fungsi lainnya yang bukan Aksi Server
* [Kelas](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* [Objek](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) yang merupakan *instance* dari kelas apa pun (selain bawaan seperti yang telah disebutkan) atau objek dengan [*null prototype*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Simbol yang tidak didaftarkan secara global, misalnya *`Symbol('my new symbol')`*

Nilai kembali yang dapat diserialisasi mengikuti aturan yang sama dengan [properti yang bisa diserialisasi](/reference/rsc/use-client#passing-props-from-server-to-client-components) untuk Komponen Klien yang menjadi pembatas.

## Penggunaan {/*usage*/}

### Aksi Server dalam formulir {/*server-actions-in-forms*/}

Aksi Server biasanya digunakan untuk memanggil fungsi di server yang mengubah data. Di peramban, pengguna umumnya mengirimkan perubahan data lewat [elemen formulir HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form). Dengan komponen *React Server*, React kini mendukung Aksi Server secara langsung di dalam formulir.

Contoh di bawah ini menunjukkan formulir yang meminta nama pengguna.

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Meminta</button>
    </form>
  );
}
```

Dalam contoh ini, *`requestUsername`* adalah sebuah Aksi Server yang diteruskan ke sebuah formulir `<form>.`
Ketika pengguna mengirim formulir ini, akan ada permintaan jaringan ke fungsi server *`requestUsername`*.
Saat memanggil Aksi Server lewat formulir, React akan mengirimkan <CodeStep step={1}>[*FormData*](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> dari formulir sebagai argumen pertama ke Aksi Server tersebut.

Dengan meneruskan Aksi Server ke formulir *`action`*, React bisa meningkatkan fungsionalitas formulir secara [progresif](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). Artinya, formulir tetap bisa dikirimkan meskipun bundel *JavaScript* belum dimuat sepenuhnya.

#### Menangani nilai kembali dari formulir {/*handling-return-values*/}

Dalam formulir diatas, ada kemungkinan nama pengguna yang diminta tidak tersedia. *`requestUsername`* harus memberi tahu apakah permintaan tersebut berhasil atau gagal.

Untuk memperbarui antarmuka pengguna berdasarkan hasil dari Aksi Server sambil tetap mendukung peningkatan progresif gunakan [*`useActionState`*](/reference/react/useActionState).

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Meminta</button>
      </form>
      <p>Respon dari pengiriman terakhir:{state}</p>
    </>
  );
}
```

Perlu diingat bahwa seperti Hook lainnya, *`useActionState`* hanya bisa dipanggil di <CodeStep step={1}>[kode klien](/reference/rsc/use-client)</CodeStep>.

### Memanggil sebuah Aksi Server dari luar formulir `<form>` {/*calling-a-server-action-outside-of-form*/}

Aksi Server adalah *endpoint* di sisi server dan bisa dipanggil dari mana saja di dalam kode klien.

Jika Anda menggunakan Aksi server di luar [formulir](/reference/react-dom/components/form), panggillah fungsi tersebut di dalam sebuah [Transisi](/reference/react/useTransition). Dengan begitu, Anda bisa menampilkan indikator pemuatan, melakukan [pembaruan status optimistis](/reference/react/useOptimistic), dan menangani error yang tidak terduga. Formulir akan secara otomatis membungkus Aksi Server di dalam transisi.

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Suka: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Suka</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

Untuk mendapatkan hasil dari Aksi Server, Anda perlu menunggu *promise*-nya dengan menggunakan *await*.