---
title: "'use server'"
titleForTitleTag: "'use server' directive"
---

<RSC>

<<<<<<< HEAD
`'use server'` hanya diperlukan jika Anda [menggunakan Komponen Server React](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) atau sedang membangun library yang kompatibel dengan fitur tersebut.
=======
`'use server'` is for use with [using React Server Components](/reference/rsc/server-components).
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

</RSC>


<Intro>

`'use server'` menandai fungsi-fungsi sisi server yang dapat dipanggil dari kode sisi klien.

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `'use server'` {/*use-server*/}

<<<<<<< HEAD
Tambahkan `'use server'` di bagian atas fungsi async untuk menandai bahwa fungsi tersebut dapat dipanggil oleh klien. Kami menyebut fungsi-fungsi ini sebagai [Aksi Server](/reference/rsc/server-actions).
=======
Add `'use server'` at the top of an async function body to mark the function as callable by the client. We call these functions [_Server Functions_](/reference/rsc/server-functions).
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

<<<<<<< HEAD
Saat memanggil Aksi Server dari klien, `'use server'` akan melakukan permintaan jaringan *(network request)* ke server dan menyertakan salinan ter-serialisasi dari setiap argumen yang dikirim. Jika Aksi Server mengembalikan sebuah nilai, nilai tersebut akan di-serialisasi dan dikembalikan ke klien.

Daripada menandai fungsi satu per satu dengan `'use server'`, Anda bisa menambahkan [Direktif](/reference/rsc/directives) ini di bagian paling atas *file* untuk menandai semua fungsi yang di ekspor dalam *file* tersebut sebagai Aksi Server nantinya semua fungsi yang di ekspor pada *file* tersebut bisa digunakan di mana saja, termasuk diimpor dalam kode klien.

#### Peringatan {/*caveats*/}
* Untuk mengimpor Aksi Server dari [kode klien](/reference/rsc/use-client), direktif harus digunakan pada level modul.
* Karena pemanggilan jaringan yang mendasarinya bersifat asinkron, `'use server'` hanya boleh digunakan pada fungsi asinkron.
* Selalu perlakukan argumen yang diterima Aksi Server sebagai input yang tidak terpercaya, dan pastikan semua perubahan (mutasi) telah diautorisasi. Lihat [pertimbangan keamanan](#security).
* Aksi Server sebaiknya dipanggil dalam sebuah [Transisi](/reference/react/useTransition). Aksi Server yang diteruskan ke [`<form action>`](/reference/react-dom/components/form#props) atau [`formAction`](/reference/react-dom/components/input#props) akan secara otomatis dipanggil dalam sebuah transisi.
* Aksi Server dirancang untuk melakukan mutasi yang memperbarui data di sisi server; Sehingga Aksi Server tidak disarankan untuk pengambilan data. Oleh karena itu, *framework* yang mengimplementasikan Aksi Server umumnya memproses satu aksi dalam satu waktu dan tidak menyediakan mekanisme untuk melakukan *caching* terhadap nilai yang dikembalikan.
=======
When calling a Server Function on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the Server Function returns a value, that value will be serialized and returned to the client.

Instead of individually marking functions with `'use server'`, you can add the directive to the top of a file to mark all exports within that file as Server Functions that can be used anywhere, including imported in client code.

#### Caveats {/*caveats*/}
* `'use server'` must be at the very beginning of their function or module; above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks.
* `'use server'` can only be used in server-side files. The resulting Server Functions can be passed to Client Components through props. See supported [types for serialization](#serializable-parameters-and-return-values).
* To import a Server Functions from [client code](/reference/rsc/use-client), the directive must be used on a module level.
* Because the underlying network calls are always asynchronous, `'use server'` can only be used on async functions.
* Always treat arguments to Server Functions as untrusted input and authorize any mutations. See [security considerations](#security).
* Server Functions should be called in a [Transition](/reference/react/useTransition). Server Functions passed to [`<form action>`](/reference/react-dom/components/form#props) or [`formAction`](/reference/react-dom/components/input#props) will automatically be called in a transition.
* Server Functions are designed for mutations that update server-side state; they are not recommended for data fetching. Accordingly, frameworks implementing Server Functions typically process one action at a time and do not have a way to cache the return value.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

### Pertimbangan keamanan {/*security*/}

<<<<<<< HEAD
Argumen untuk Aksi Server sepenuhnya dikendalikan oleh klien. Demi keamanan, selalu perlakukan argumen tersebut sebagai masukan yang tidak tepercaya, dan pastikan untuk memvalidasi serta menyaring argumen sesuai kebutuhan.

Dalam setiap Aksi Server, pastikan untuk memvalidasi bahwa pengguna yang sedang masuk diizinkan untuk melakukan aksi tersebut.

<Wip>

Untuk mencegah pengiriman data sensitif dari Aksi Server, terdapat *API taint* eksperimental untuk mencegah nilai dan objek unik diteruskan ke kode klien.
=======
Arguments to Server Functions are fully client-controlled. For security, always treat them as untrusted input, and make sure to validate and escape arguments as appropriate.

In any Server Function, make sure to validate that the logged-in user is allowed to perform that action.

<Wip>

To prevent sending sensitive data from a Server Function, there are experimental taint APIs to prevent unique values and objects from being passed to client code.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

Lihat [*experimental_taintUniqueValue*](/reference/react/experimental_taintUniqueValue) dan [*experimental_taintObjectReference*](/reference/react/experimental_taintObjectReference).

</Wip>

### Argumen yang dapat diserialisasi dan nilai kembalian {/*serializable-parameters-and-return-values*/}

<<<<<<< HEAD
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
=======
Since client code calls the Server Function over the network, any arguments passed will need to be serializable.

Here are supported types for Server Function arguments:

* Primitives
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), only symbols registered in the global Symbol registry via [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterables containing serializable values
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instances
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are Server Functions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* React elements, or [JSX](/learn/writing-markup-with-jsx)
* Functions, including component functions or any other function that is not a Server Function
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are instances of any class (other than the built-ins mentioned) or objects with [a null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`
* Events from event handlers
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

* Elemen React, atau [*JSX*](/learn/writing-markup-with-jsx)
* Fungsi komponen atau fungsi lainnya yang bukan Aksi Server
* [Kelas](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* [Objek](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) yang merupakan *instance* dari kelas apa pun (selain bawaan seperti yang telah disebutkan) atau objek dengan [*null prototype*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Simbol yang tidak didaftarkan secara global, misalnya `Symbol('my new symbol')`

Nilai kembali yang dapat diserialisasi mengikuti aturan yang sama dengan [properti yang bisa diserialisasi](/reference/rsc/use-client#passing-props-from-server-to-client-components) untuk Komponen Klien yang menjadi pembatas.

## Penggunaan {/*usage*/}

### Aksi Server dalam formulir {/*server-actions-in-forms*/}

<<<<<<< HEAD
Aksi Server biasanya digunakan untuk memanggil fungsi di server yang mengubah data. Di peramban, pengguna umumnya mengirimkan perubahan data lewat [elemen formulir HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form). Dengan komponen server React, React kini mendukung Aksi Server secara langsung di dalam formulir.

Contoh di bawah ini menunjukkan formulir yang meminta nama pengguna.
=======
### Server Functions in forms {/*server-functions-in-forms*/}

The most common use case of Server Functions will be calling functions that mutate data. On the browser, the [HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) is the traditional approach for a user to submit a mutation. With React Server Components, React introduces first-class support for Server Functions as Actions in [forms](/reference/react-dom/components/form).

Here is a form that allows a user to request a username.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

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

<<<<<<< HEAD
Dalam contoh ini, `requestUsername` adalah sebuah Aksi Server yang diteruskan ke sebuah formulir `<form>.`
Ketika pengguna mengirim formulir ini, akan ada permintaan jaringan ke fungsi server `requestUsername`.
Saat memanggil Aksi Server lewat formulir, React akan mengirimkan <CodeStep step={1}>[*FormData*](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> dari formulir sebagai argumen pertama ke Aksi Server tersebut.

Dengan meneruskan Aksi Server ke `action` formulir, React bisa meningkatkan fungsionalitas formulir secara [progresif](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). Artinya, formulir tetap bisa dikirimkan meskipun bundel *JavaScript* belum dimuat sepenuhnya.
=======
In this example `requestUsername` is a Server Function passed to a `<form>`. When a user submits this form, there is a network request to the server function `requestUsername`. When calling a Server Function in a form, React will supply the form's <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> as the first argument to the Server Function.

By passing a Server Function to the form `action`, React can [progressively enhance](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) the form. This means that forms can be submitted before the JavaScript bundle is loaded.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

#### Menangani nilai kembali dari formulir {/*handling-return-values*/}

Dalam formulir diatas, ada kemungkinan nama pengguna yang diminta tidak tersedia. `requestUsername` harus memberi tahu apakah permintaan tersebut berhasil atau gagal.

<<<<<<< HEAD
Untuk memperbarui antarmuka pengguna berdasarkan hasil dari Aksi Server sambil tetap mendukung peningkatan progresif gunakan [`useActionState`](/reference/react/useActionState).
=======
To update the UI based on the result of a Server Function while supporting progressive enhancement, use [`useActionState`](/reference/react/useActionState).
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

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
      <p>Respon dari pengiriman terakhir: {state}</p>
    </>
  );
}
```

Perlu diingat bahwa seperti Hook lainnya, `useActionState` hanya bisa dipanggil di <CodeStep step={1}>[kode klien](/reference/rsc/use-client)</CodeStep>.

<<<<<<< HEAD
### Memanggil sebuah Aksi Server dari luar formulir `<form>` {/*calling-a-server-action-outside-of-form*/}

Aksi Server adalah *endpoint* di sisi server dan bisa dipanggil dari mana saja di dalam kode klien.

Jika Anda menggunakan Aksi server di luar [formulir](/reference/react-dom/components/form), panggillah fungsi tersebut di dalam sebuah [Transisi](/reference/react/useTransition). Dengan begitu, Anda bisa menampilkan indikator pemuatan, melakukan [pembaruan status optimistis](/reference/react/useOptimistic), dan menangani error yang tidak terduga. Formulir akan secara otomatis membungkus Aksi Server di dalam transisi.
=======
### Calling a Server Function outside of `<form>` {/*calling-a-server-function-outside-of-form*/}

Server Functions are exposed server endpoints and can be called anywhere in client code.

When using a Server Function outside a [form](/reference/react-dom/components/form), call the Server Function in a [Transition](/reference/react/useTransition), which allows you to display a loading indicator, show [optimistic state updates](/reference/react/useOptimistic), and handle unexpected errors. Forms will automatically wrap Server Functions in transitions.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

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

<<<<<<< HEAD
Untuk mendapatkan hasil dari Aksi Server, Anda perlu menunggu *promise*-nya dengan menggunakan *await*.
=======
To read a Server Function return value, you'll need to `await` the promise returned.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91
