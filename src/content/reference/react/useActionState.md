---
title: useActionState
---

<Intro>

`useActionState` adalah Hook yang memungkinkan Anda memperbarui status berdasarkan hasil aksi formulir.

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

Pada versi React Canary sebelumnya, API ini merupakan bagian dari React DOM dan disebut `useFormState`.

</Note>


<InlineToc />

---

## Referensi {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

Panggil `useActionState` di tingkat atas komponen Anda untuk membuat *state* komponen yang diperbarui [saat aksi formulir dijalankan](/reference/react-dom/components/form). Anda mengoper sebuah fungsi aksi form yang sudah ada serta *state* awal ke `useActionState`, dan fungsi ini akan mengembalikan aksi baru yang Anda gunakan dalam form, bersama dengan *state* form terbaru dan apakah aksi tersebut masih tertunda. *State* form terbaru juga akan dioper ke fungsi yang Anda sediakan.

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

*State* form adalah nilai yang dikembalikan oleh aksi saat form terakhir kali disubmit. Jika form belum disubmit, itu adalah *state* awal yang Anda lewatkan.

Jika digunakan dengan Fungsi Server, `useActionState` memungkinkan respon dari server setelah mengirimkan form untuk ditampilkan bahkan sebelum proses hidrasi selesai.

[Lihat contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `fn`: Fungsi yang akan dipanggil ketika form dikirimkan atau tombol ditekan. Ketika fungsi dipanggil, fungsi akan menerima keadaan sebelumnya dari form (awalnya `initialState` yang Anda berikan, kemudian nilai kembalian sebelumnya) sebagai argumen awal, diikuti dengan argumen yang biasanya diterima oleh aksi form.
* `initialState`: Nilai yang Anda inginkan untuk *state* awalnya. Nilai ini dapat berupa nilai yang dapat diurutkan. Argumen ini diabaikan setelah aksi pertama kali dipanggil.
* **opsional** `permalink`: String yang berisi URL halaman unik yang dimodifikasi oleh form ini. Untuk digunakan pada halaman dengan konten dinamis (misalnya: feed) dalam hubungannya dengan peningkatan progresif: jika `fn` adalah [fungsi server](/reference/rsc/server-functions) dan form dikirimkan sebelum bundel JavaScript dimuat, browser akan menavigasi ke URL permalink yang ditentukan, bukan ke URL halaman yang sekarang. Pastikan bahwa komponen form yang sama di-render di halaman tujuan (termasuk action `fn` dan `permalink` yang sama) sehingga React tahu bagaimana cara meneruskan *state*. Setelah form di-hidrasi, parameter ini tidak berpengaruh.

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Kembalian {/*returns*/}

`useActionState` returns an array with the following values:

1. *State* saat ini. Selama render pertama, ini akan dicocokkan dengan `initialState` yang telah Anda berikan. Setelah aksi dipanggil, ia akan dicocokkan dengan nilai yang dikembalikan oleh aksi.
2. Aksi baru yang dapat Anda berikan sebagai prop `action` ke komponen `form` Anda atau `formAction` ke komponen `button` manapun di dalam formulir. Aksi dapat juga dipanggil secara manual dari dalam [`startTransition`](/reference/react/startTransition).
3. Flag `isPending` yang memberitahu apakah ada Transisi yang masih tertunda.

#### Catatan penting {/*caveats*/}

* Ketika digunakan dengan *framework* yang mendukung Komponen Server React, `useActionState` memungkinkan Anda membuat form menjadi interaktif sebelum JavaScript dieksekusi di klien. Ketika digunakan tanpa Komponen Server, ini setara dengan state lokal komponen.
* Fungsi yang dioper ke `useActionState` menerima argumen tambahan, yaitu *state* sebelumnya atau awal, sebagai argumen pertamanya. Hal ini membuat tanda tangannya berbeda dibandingkan jika digunakan secara langsung sebagai aksi form tanpa menggunakan `useActionState`.

---

## Penggunaan {/*usage*/}

### Menggunakan informasi yang dikembalikan oleh tindakan form {/*using-information-returned-by-a-form-action*/}

Panggil `useActionState` di tingkat atas komponen Anda untuk mengakses nilai balik dari suatu tindakan dari saat terakhir kali form dikirimkan.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useActionState` mengembalikan sebuah array dengan nilai berikut:

1. <CodeStep step={1}>State saat ini</CodeStep> dari form, yang pada awalnya diatur ke <CodeStep step={4}>state awal</CodeStep> yang Anda berikan, dan setelah form dikirimkan, diatur ke nilai balik dari <CodeStep step={3}>aksi</CodeStep> yang Anda berikan.
2. <CodeStep step={2}>Aksi baru</CodeStep> yang Anda oper ke`<form>` sebagai properti `action`-nya atau dipanggil secara manual dari dalam `startTransition`.
3. <CodeStep step={1}>State tertunda</CodeStep> yang dapat Anda manfaatkan saat aksi Anda sedang diproses.

Ketika form dikirimkan, fungsi <CodeStep step={3}>aksi</CodeStep> yang Anda berikan akan dipanggil. Nilai baliknya akan menjadi <CodeStep step={1}>state saat ini</CodeStep> yang baru dari form.

<CodeStep step={3}>Aksi</CodeStep> yang Anda sediakan juga akan menerima argumen pertama yang baru, yaitu <CodeStep step={1}>state saat ini</CodeStep> dari form. Saat form dikirimkan untuk pertama kalinya, nilai akan berupa <CodeStep step={4}>state awal</CodeStep> yang Anda berikan, Pada pengiriman berikutnya, nilai ini akan menjadi hasil dari panggilan aksi terakhir. Sisanya dari argumen tetap sama seperti jika `useActionState` tidak digunakan.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="Menampilkan informasi setelah mengirimkan form" titleId="display-information-after-submitting-a-form">

#### Menampilkan kesalahan form {/*display-form-errors*/}

Untuk menampilkan pesan seperti pesan kesalahan atau *toast* yang dikembalikan oleh Fungsi Server, bungkus aksi tersebut dengan panggilan ke `useActionState`.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

#### Menampilkan informasi terstruktur setelah mengirimkan form {/*display-structured-information-after-submitting-a-form*/}

Nilai yang dikembalikan dari Fungsi Server dapat berupa nilai yang dapat diserialkan. Sebagai contoh, nilai tersebut dapat berupa object yang mencakup boolean yang menunjukan apakah aksi berhasil, pesan kesalahan, atau informasi yang diperbarui.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

</Recipes>

## Pemecahan masalah {/*troubleshooting*/}

### Aksi saya tidak lagi dapat membaca data form yang dikirimkan {/*my-action-can-no-longer-read-the-submitted-form-data*/}

Ketika Anda membungkus sebuah aksi dengan `useActionState`, ia mendapatkan argumen tambahan *sebagai argumen pertama*. Oleh karena itu, data form yang dikirimkan menjadi argumen *kedua* alih-alih argumen pertama seperti biasanya. Argumen pertama baru yang ditambahkan adalah state saat ini dari form.

```js
function action(currentState, formData) {
  // ...
}
```
