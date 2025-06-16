---
title: useActionState
---

<Intro>

<<<<<<< HEAD
Hook `useActionState` saat ini hanya tersedia di kanal Canary dan eksperimental React. Pelajari lebih lanjut tentang [saluran rilis disini](/community/versioning-policy#all-release-channels). Selain itu, Anda perlu menggunakan framework yang mendukung [React Server Components](/reference/rsc/use-client) untuk mendapatkan manfaat penuh dari `useActionState`.
=======
`useActionState` is a Hook that allows you to update state based on the result of a form action.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

Pada versi React Canary sebelumnya, API ini merupakan bagian dari React DOM dan disebut `useFormState`.

</Note>

<<<<<<< HEAD
<Intro>

`useActionState` adalah sebuah Hook yang memungkinkan Anda memperbarui *state* berdasarkan hasil dari aksi sebuah form.

```js
const [state, formAction] = useActionState(fn, initialState, permalink?);
```

</Intro>
=======
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

<InlineToc />

---

## Referensi {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

<<<<<<< HEAD
Panggil `useActionState` di tingkat atas komponen Anda untuk membuat *state* komponen yang diperbarui [saat aksi form dijalankan](/reference/react-dom/components/form). Anda mengoper sebuah fungsi aksi form yang sudah ada serta *state* awal ke `useActionState`, dan fungsi ini akan mengembalikan aksi baru yang Anda gunakan dalam form, bersama dengan *state* form terbaru. *State* form terbaru juga akan dioper ke fungsi yang Anda sediakan.
=======
Call `useActionState` at the top level of your component to create component state that is updated [when a form action is invoked](/reference/react-dom/components/form). You pass `useActionState` an existing form action function as well as an initial state, and it returns a new action that you use in your form, along with the latest form state and whether the Action is still pending. The latest form state is also passed to the function that you provided.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

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

<<<<<<< HEAD
Jika digunakan dengan *Server Action*, `useActionState` memungkinkan respon dari server setelah mengirimkan form untuk ditampilkan bahkan sebelum proses hidrasi selesai.
=======
If used with a Server Function, `useActionState` allows the server's response from submitting the form to be shown even before hydration has completed.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

[Lihat contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

<<<<<<< HEAD
* `fn`: Fungsi yang akan dipanggil ketika form dikirimkan atau tombol ditekan. Ketika fungsi dipanggil, fungsi akan menerima keadaan sebelumnya dari form (awalnya `initialState` yang Anda berikan, kemudian nilai kembalinya sebelumnya) sebagai argumen awal, diikuti dengan argumen yang biasanya diterima oleh aksi form.
* `initialState`: Nilai yang Anda inginkan untuk *state* awalnya. Nilai ini dapat berupa nilai yang dapat diurutkan. Argumen ini diabaikan setelah aksi pertama kali dipanggil.
* **opsional** `permalink`: String yang berisi URL halaman unik yang dimodifikasi oleh form ini. Untuk digunakan pada halaman dengan konten dinamis (misalnya: feeddalam hubungannya dengan peningkatan progresif: jika `fn` adalah [aksi server](/reference/rsc/use-server) dan form dikirimkan sebelum bundel JavaScript dimuat, browser akan menavigasi ke URL permalink yang ditentukan, bukan ke URL halaman yang sekarang. Pastikan bahwa komponen form yang sama di-render di halaman tujuan (termasuk action `fn` dan `permalink` yang sama) sehingga React tahu bagaimana cara meneruskan *state*. Setelah form di-hidrasi, parameter ini tidak berpengaruh.
=======
* `fn`: The function to be called when the form is submitted or button pressed. When the function is called, it will receive the previous state of the form (initially the `initialState` that you pass, subsequently its previous return value) as its initial argument, followed by the arguments that a form action normally receives.
* `initialState`: The value you want the state to be initially. It can be any serializable value. This argument is ignored after the action is first invoked.
* **optional** `permalink`: A string containing the unique page URL that this form modifies. For use on pages with dynamic content (eg: feeds) in conjunction with progressive enhancement: if `fn` is a [server function](/reference/rsc/server-functions) and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL, rather than the current page's URL. Ensure that the same form component is rendered on the destination page (including the same action `fn` and `permalink`) so that React knows how to pass the state through. Once the form has been hydrated, this parameter has no effect.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Kembalian {/*returns*/}

<<<<<<< HEAD
`useActionState` mengembalikan sebuah array dengan tepat dua nilai:

1. Keadaan saat ini. Selama render pertama, ini akan cocok dengan `initialState` yang telah Anda berikan. Setelah aksi dipanggil, ia akan cocok dengan nilai yang dikembalikan oleh aksi.
2. Tindakan baru yang dapat Anda berikan sebagai prop `action` ke komponent `form` Anda atau prop`formAction` ke komponen `button` mana pun di dalam form.
=======
`useActionState` returns an array with the following values:

1. The current state. During the first render, it will match the `initialState` you have passed. After the action is invoked, it will match the value returned by the action.
2. A new action that you can pass as the `action` prop to your `form` component or `formAction` prop to any `button` component within the form. The action can also be called manually within [`startTransition`](/reference/react/startTransition).
3. The `isPending` flag that tells you whether there is a pending Transition.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

#### Perhatian {/*caveats*/}

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

<<<<<<< HEAD
`useActionState` mengembalikan sebuah array dengan tepat dua:

1. <CodeStep step={1}>State saat ini</CodeStep> dari form, yang pada awalnya diatur ke <CodeStep step={4}>state awal</CodeStep> yang Anda berikan, dan setelah form dikirimkan, diatur ke nilai balik dari <CodeStep step={3}>aksi</CodeStep> yang Anda berikan.
2. <CodeStep step={2}>Aksi baru</CodeStep> yang Anda oper ke`<form>` sebagai properti `action`-nya.
=======
`useActionState` returns an array with the following items:

1. The <CodeStep step={1}>current state</CodeStep> of the form, which is initially set to the <CodeStep step={4}>initial state</CodeStep> you provided, and after the form is submitted is set to the return value of the <CodeStep step={3}>action</CodeStep> you provided.
2. A <CodeStep step={2}>new action</CodeStep> that you pass to `<form>` as its `action` prop or call manually within `startTransition`.
3. A <CodeStep step={1}>pending state</CodeStep> that you can utilise while your action is processing.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

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

<<<<<<< HEAD
Untuk menampilkan pesan seperti pesan kesalahan atau toast yang dikembalikan oleh Aksi Server, bungkus aksi tersebut dengan panggilan ke `useActionState`.
=======
To display messages such as an error message or toast that's returned by a Server Function, wrap the action in a call to `useActionState`.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

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

<<<<<<< HEAD
Nilai yang dikembalikan dari Server Action dapat berupa nilai yang dapat diserialkan. Sebagai contoh, nilai tersebut dapat berupa object yang mencakup boolean yang menunjukan apakah aksi berhasil, pesan kesalahan, atau informasi yang diperbarui.
=======
The return value from a Server Function can be any serializable value. For example, it could be an object that includes a boolean indicating whether the action was successful, an error message, or updated information.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

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
