---
title: "<form>"
---

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

`<form>` mendukung semua [props elemen umum.](/reference/react-dom/components/common#common-props)

<<<<<<< HEAD
[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): URL atau fungsi. Ketika URL diberikan ke `action`, formulir akan berperilaku seperti komponen formulir HTML. Ketika fungsi diberikan ke `action`, fungsi tersebut akan menangani pengiriman formulir. Fungsi yang diberikan ke `action` dapat berupa *async* dan akan dipanggil dengan satu argumen yang berisi [data formulir](https://developer.mozilla.org/en-US/docs/Web/API/FormData) dari formulir yang dikirimkan. Prop `action` dapat ditimpa oleh atribut `formAction` pada komponen `<button>`, `<input type="submit">`, atau `<input type="image">`.
=======
* [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): A string containing a URL, or a function. If you pass a URL, the form behaves like a standard HTML form. If you pass a function, it handles the submission. See [Handling form submission with an action prop](#handle-form-submission-with-an-action-prop).
  * If you pass a function to `action`, React runs it in a [Transition](/reference/react/useTransition) following [the Action prop pattern](/reference/react/useTransition#exposing-action-props-from-components).
  * The function may be async. React calls it with a single argument containing the [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) of the submitted form.
  * A `formAction` prop on a `<button>`, `<input type="submit">`, or `<input type="image">` overrides this `action`.
* [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method): A string that specifies the HTTP method to use when `action` is a URL. Defaults to `get`.
* `onSubmit`: An [`Event` handler](/reference/react-dom/components/common#react-event-object) function. Fires when the form is submitted. See [Handling form submission with an event handler](#handle-form-submission-with-an-event-handler).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

#### Catatan Penting {/*caveats*/}

<<<<<<< HEAD
* Ketika sebuah fungsi diberikan ke `action` atau `formAction`, metode HTTP akan menjadi POST terlepas dari nilai prop `method`.
=======
* If you pass a function to `action` or `formAction`, the HTTP method will be `POST` regardless of the value of the `method` prop.
* If you pass a function to `action` or `formAction`, React resets all [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) field elements after the Action succeeds. See [Preserving form values after an Action](#preserve-form-values-after-an-action).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

---

## Penggunaan {/*usage*/}

<<<<<<< HEAD
### Menangani pengiriman formulir di klien {/*handle-form-submission-on-the-client*/}

Lepaskan sebuah fungsi ke prop `action` dari formulir untuk menjalankan fungsi tersebut saat formulir disubmit. [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) akan diteruskan ke fungsi sebagai argumen sehingga Anda dapat mengakses data yang dikirimkan oleh formulir. Ini berbeda dari [HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action) konvensional, yang hanya menerima URL.
=======
### Handling form submission with an event handler {/*handle-form-submission-with-an-event-handler*/}

Pass a function to the `onSubmit` event handler to run code when the form is submitted. By default, the browser sends the form data to the current URL and refreshes the page. Calling [`e.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) in the event handler overrides this behavior.

If you also pass a function to `action`, React runs it after `onSubmit` unless `onSubmit` calls `e.preventDefault()`.

<Sandpack>

```js src/App.js
export default function Search() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

<Note>

`onSubmit` works in every version of React and gives you direct access to the [submit event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event). Starting in React 19, the [`action` prop](#handle-form-submission-with-an-action-prop) is the preferred API for form submissions. With `action`, React runs the submission in a [Transition](/reference/react/useTransition) and manages pending state and concurrency across multiple submissions. You can also use optimistic updates, Error Boundaries, and [Server Functions](/reference/rsc/server-functions).

</Note>

---

### Handling form submission with an action prop {/*handle-form-submission-with-an-action-prop*/}

Pass a function to the `action` prop to run it when the form is submitted. React calls the function with a [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object containing the values of every input with a `name` attribute. Your inputs can be [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). You don't need `value`/`onChange` pairs, an `onSubmit` handler, or `e.preventDefault()`.

When you pass a function to `action`, React:

* Runs the function in a [Transition](/reference/react/useTransition).
* Makes the pending state available to child components via [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).
* Propagates any errors to the nearest Error Boundary.
* Resets the form's uncontrolled fields when the function succeeds. To keep their values, see [Preserving form values after an Action](#preserve-form-values-after-an-action).

Because the Action runs in a Transition, you can also use [`useActionState`](/reference/react/useActionState) to manage form state and [`useOptimistic`](/reference/react/useOptimistic) for optimistic UI. For [Server Functions](/reference/rsc/server-functions) and progressive enhancement, see [Handling form submission with a Server Function](#handle-form-submission-with-a-server-function).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
<<<<<<< HEAD
    const query = formData.get("query");
    alert(`Anda mencari '${query}'`);
=======
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Cari</button>
    </form>
  );
}
```

</Sandpack>

<<<<<<< HEAD
### Menangani pengiriman formulir dengan Fungsi Server {/*handle-form-submission-with-a-server-action*/}

Render sebuah `<form>` dengan input dan tombol kirim. Lepaskan Fungsi Server (sebuah fungsi yang ditandai dengan [`'use server'`](/reference/rsc/use-server)) ke prop `action` dari formulir untuk menjalankan fungsi tersebut saat formulir disubmit.

Melewatkan Fungsi Server ke `<form action>` memungkinkan pengguna untuk mengirimkan formulir tanpa JavaScript yang diaktifkan atau sebelum kode dimuat. Ini menguntungkan bagi pengguna yang memiliki koneksi lambat, perangkat, atau yang memiliki JavaScript dinonaktifkan dan mirip dengan cara kerja formulir ketika URL diberikan ke prop `action`.

Anda dapat menggunakan *field* formulir tersembunyi untuk memberikan data ke aksi `<form>`. Fungsi Server akan dipanggil dengan data *field* formulir tersembunyi sebagai *instance* dari [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
=======
---

### Handling form submission with a Server Function {/*handle-form-submission-with-a-server-function*/}

A `<form>`'s `action` prop can run a Server Function (a function marked with [`'use server'`](/reference/rsc/use-server)) when the user submits the form. Users can submit that form before JavaScript loads or when JavaScript is disabled. This matches how forms behave when you pass a URL to `action`.

React calls the Server Function with the form's [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) and includes every input with a `name` attribute. To pass additional data, such as an ID from props, see [Passing extra data to an Action](#passing-extra-data-to-an-action).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```jsx
import { addComment } from './actions.js';

function CommentForm() {
  return (
<<<<<<< HEAD
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Tambahkan ke Keranjang</button>
=======
    <form action={addComment}>
      <textarea name="comment" />
      <button type="submit">Comment</button>
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
    </form>
  );
}
```

<<<<<<< HEAD
Sebagai pengganti menggunakan *field* formulir tersembunyi untuk memberikan data ke aksi `<form>`, Anda dapat memanggil metode <CodeStep step={1}>`bind`</CodeStep> untuk menyuplai argumen tambahan. Ini akan mengikat argumen baru (<CodeStep step={2}>`productId`</CodeStep>) ke fungsi selain dari <CodeStep step={3}>`formData`</CodeStep> yang diteruskan sebagai argumen ke fungsi.
=======
```js
// actions.js
'use server';
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

export async function addComment(formData) {
  const comment = formData.get('comment');
  // ...
}
```

<DeepDive>

#### Passing extra data to an Action {/*passing-extra-data-to-an-action*/}

An Action receives the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData). To include data the user did not enter, such as an ID from props, use one of these approaches:

* **Hidden fields** add the value to `FormData`. The value appears in the HTML, and `formData.get` returns a string. Users can submit the form before JavaScript loads.
* **Binding with `bind`** passes the value as an argument to a Server Function, before `formData`. The argument keeps its type, so a number stays a number. It must be [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values). Users can submit the form before JavaScript loads.
* **A function in the component** reads props and state directly. It runs after JavaScript loads, then calls a Server Function with those values.

The client sends hidden field values and bound arguments. Check on the server that the logged-in user is allowed to perform the Action. See [Security considerations](/reference/rsc/use-server#security).

#### Hidden fields {/*passing-extra-data-hidden-fields*/}

In a Server Component, render an `<input type="hidden">` with a `name` and `value`. React includes that value in the `FormData` passed to the Action.

```jsx
// Server Component
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    'use server';
    await updateCart(formData.get('productId'));
  }
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

React includes a submit button's `name` and `value` in `FormData` when that button submits the form.

#### Binding with `bind` {/*passing-extra-data-bind*/}

In a Server Component, call [`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) on the Server Function and pass the bound function to `action`. Pass `null` as the first argument to `bind`. Each argument after `null` comes before the `formData` argument React passes when the form is submitted.

```jsx
// Server Component
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(productId, formData) {
    'use server';
    await updateCart(productId);
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Tambahkan ke Keranjang</button>
    </form>
  );
}
```

<<<<<<< HEAD
Ketika `<form>` dirender oleh [Server Component](/reference/rsc/use-client), dan [Fungsi Server](/reference/rsc/server-functions) diteruskan ke prop `action` `<form>`, formulir akan [ditingkatkan secara progresif](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

### Menampilkan status tertunda selama pengiriman formulir {/*display-a-pending-state-during-form-submission*/}
Untuk menampilkan status tertunda ketika formulir sedang dikirim, Anda dapat memanggil Hook `useFormStatus` dalam komponen yang dirender dalam `<form>` dan membaca properti `pending` yang dikembalikan.
=======
When the form is submitted, React calls `addProductToCart(formData)`, which calls `addToCart(productId, formData)`.

If you also use [`useActionState`](/reference/react/useActionState), the Server Function receives `productId`, `previousState`, and `formData`, in that order. Define that function in a separate file and bind it from the Client Component.

#### A function in the component {/*passing-extra-data-function*/}

Define the function passed to `action` in the Client Component so it can read the component's props or state. That function passes those values to a Server Function.

```jsx
// AddToCart.js
'use client';

import { updateCart } from './actions.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    await updateCart(productId, formData);
  }
  return (
    <form action={addToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

```js
// actions.js
'use server';

export async function updateCart(productId, formData) {
  // ...
}
```

Because `addToCart` runs in the browser, the component's JavaScript must load before the form can submit.

</DeepDive>

---

### Displaying a pending state during form submission {/*display-a-pending-state-during-form-submission*/}

To display a pending state when a form is being submitted, you can call the [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) Hook in a component rendered in a `<form>` and read the `pending` property returned.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Di sini, kami menggunakan properti `pending` untuk menunjukkan formulir sedang dikirim.

<Sandpack>

```js src/App.js
import { useFormStatus } from 'react-dom';
import { submitForm } from './actions.js';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
<<<<<<< HEAD
      {pending ? "Mengirim..." : "Kirim"}
=======
      {pending ? 'Submitting...' : 'Submit'}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
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
export async function submitForm(formData) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

<<<<<<< HEAD
Untuk mempelajari lebih lanjut tentang Hook `useFormStatus` lihat [dokumentasi referensi](/reference/react-dom/hooks/useFormStatus).

### Memperbarui data formulir secara optimis {/*optimistically-updating-form-data*/}
Hook `useOptimistic` menyediakan cara untuk memperbarui antarmuka pengguna secara optimis sebelum operasi latar belakang, seperti permintaan jaringan, selesai. Dalam konteks formulir, teknik ini membantu membuat aplikasi terasa lebih responsif. Ketika seorang pengguna mengirimkan formulir, alih-alih menunggu respons server untuk mencerminkan perubahan, antarmuka segera diperbarui dengan hasil yang diharapkan.
=======
To learn more about the `useFormStatus` Hook, see the [reference documentation](/reference/react-dom/hooks/useFormStatus).

---

### Optimistically updating form data {/*optimistically-updating-form-data*/}

The [`useOptimistic`](/reference/react/useOptimistic) Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Sebagai contoh, ketika seorang pengguna mengetik pesan ke dalam formulir dan menekan tombol "Kirim", Hook `useOptimistic` memungkinkan pesan tersebut segera muncul dalam daftar dengan label "Mengirim...", bahkan sebelum pesan tersebut benar-benar dikirim ke server. Pendekatan "optimis" ini memberikan kesan kecepatan dan responsivitas. Formulir kemudian berusaha untuk benar-benar mengirim pesan di latar belakang. Setelah server mengonfirmasi pesan telah diterima, label "Mengirim..." dihapus.

<Sandpack>

```js src/App.js
import { startTransition, useOptimistic, useState, useRef } from 'react';
import { deliverMessage } from './actions.js';

function Thread({ messages, sendMessage }) {
  const formRef = useRef(null);
  async function formAction(formData) {
    addOptimisticMessage(formData.get('message'));
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
<<<<<<< HEAD
    { text: "Halo!", sending: false, key: 1 }
=======
    { text: 'Hello there!', sending: false, key: 1 }
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get('message'));
    startTransition(() => {
      setMessages((messages) => [...messages, { text: sentMessage }]);
    });
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  // Simulate a message delivery delay
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

To learn more about the `useOptimistic` Hook, see the [reference documentation](/reference/react/useOptimistic).

---

### Menangani kesalahan pengiriman formulir {/*handling-form-submission-errors*/}

<<<<<<< HEAD
Dalam beberapa kasus fungsi yang dipanggil oleh prop `action` dari `<form>` melemparkan sebuah kesalahan. Anda dapat menangani kesalahan ini dengan membungkus `<form>` dalam Error Boundary. Jika fungsi yang dipanggil oleh prop `action` dari `<form>` melemparkan sebuah kesalahan, *fallback* untuk *error boundary* akan ditampilkan.
=======
To handle errors thrown by a function passed to a `<form>`'s `action` prop, wrap the form in an [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). React displays the boundary's fallback when the function throws.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
import { ErrorBoundary } from 'react-error-boundary';

export default function Search() {
  function search() {
<<<<<<< HEAD
    throw new Error("kesalahan pencarian");
=======
    throw new Error('search error');
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
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
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

<<<<<<< HEAD
### Menampilkan kesalahan pengiriman formulir tanpa JavaScript {/*display-a-form-submission-error-without-javascript*/}
=======
#### Handling form submission errors before JavaScript loads {/*display-a-form-submission-error-without-javascript*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Menampilkan pesan kesalahan pengiriman formulir sebelum bundel JavaScript dimuat untuk peningkatan progresif mengharuskan bahwa:

<<<<<<< HEAD
1. `<form>` dirender oleh [Server Component](/reference/rsc/use-client)
1. fungsi yang diteruskan ke prop `action` `<form>` adalah [Fungsi Server](/reference/rsc/server-functions)
1. Hook `useActionState` digunakan untuk menampilkan pesan kesalahan

`useActionState` mengambil dua parameter: sebuah [Fungsi Server](/reference/rsc/server-functions) dan sebuah *state* awal. `useActionState` mengembalikan dua nilai, sebuah variabel *state* dan sebuah aksi. Aksi yang dikembalikan oleh `useActionState` harus diteruskan ke prop `action` dari formulir. Variabel *state* yang dikembalikan oleh `useActionState` dapat digunakan untuk menampilkan pesan kesalahan. Nilai yang dikembalikan oleh Fungsi Server yang diteruskan ke `useActionState` akan digunakan untuk memperbarui variabel *state*.
=======
1. `<form>` be rendered by a [Client Component](/reference/rsc/use-client)
1. the function passed to the `<form>`'s `action` prop be a [Server Function](/reference/rsc/server-functions)
1. the [`useActionState`](/reference/react/useActionState) Hook be used to display the error message

Define the Server Function in a separate file with the [`'use server'`](/reference/rsc/use-server) directive. It receives the previous state followed by the submitted `FormData`:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js
// actions.js
'use server';

import { signUpNewUser } from './api.js';

<<<<<<< HEAD
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
=======
export async function signup(previousState, formData) {
  const email = formData.get('email');
  try {
    await signUpNewUser(email);
    return null;
  } catch (error) {
    return error.message;
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  }
}
```

In a Client Component, pass the Server Function to `useActionState`. Pass the returned Action to the form's `action` prop and render the returned state:

```js
// Signup.js
'use client';

import { useActionState } from 'react';
import { signup } from './actions.js';

export default function Signup() {
  const [message, signupAction] = useActionState(signup, null);
  return (
<<<<<<< HEAD
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
=======
    <form action={signupAction}>
      <label htmlFor="email">Email: </label>
      <input name="email" id="email" placeholder="react@example.com" />
      <button>Sign up</button>
      {message && <p>{message}</p>}
    </form>
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  );
}
```

If the form is submitted before JavaScript loads, React includes the Server Function's returned error message in the server-rendered response.

<<<<<<< HEAD
export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("Alamat email ini sudah ditambahkan");
=======
---

### Preserving form values after an Action {/*preserve-form-values-after-an-action*/}

When a function passed to `action` or `formAction` completes without throwing, React resets the form's [uncontrolled fields](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). You may want to keep the submitted values after saving edits, or when the Action returns a [validation error](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values).

To preserve those values, you can store them with [`useState`](/reference/react/useState) and pass them to each field's [`defaultValue`](/reference/react-dom/components/input#providing-an-initial-value-for-an-input). Update the state when the Action finishes. React applies the updated defaults before resetting the form, so the fields keep those values.

Try changing the title and clicking **Save**. In this example, [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) shows "Saving..." during a simulated one-second request. Then `setTitle` updates the saved title and preserves it in the input.

<Sandpack>

```js src/App.js
import { startTransition, useState } from 'react';
import SaveButton from './SaveButton.js';

export default function EditForm() {
  const [title, setTitle] = useState('My draft');

  async function saveAction(formData) {
    await new Promise((res) => setTimeout(res, 1000));
    startTransition(() => {
      setTitle(formData.get('title'));
    });
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  }

  return (
    <form action={saveAction}>
      <input name="title" defaultValue={title} />
      <SaveButton />
      <p>Saved title: {title}</p>
    </form>
  );
}
```

```js src/SaveButton.js hidden
import { useFormStatus } from 'react-dom';

export default function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

</Sandpack>

<<<<<<< HEAD
Pelajari lebih lanjut tentang memperbarui *state* dari aksi formulir dengan dokumen [`useActionState`](/reference/react/useActionState).
=======
The call to `setTitle` [after `await`](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) needs another [`startTransition`](/reference/react/startTransition) to mark it as a Transition update.

`saveAction` can also call a [Server Function](/reference/rsc/server-functions) and store its return value:

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function submitTitle(formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return title;
}
```

Add [`'use client'`](/reference/rsc/use-client) at the top of the component's file, import `submitTitle`, and replace `saveAction`. The rest of the form stays the same:

```js
import { submitTitle } from './actions.js';

async function saveAction(formData) {
  const savedTitle = await submitTitle(formData);
  startTransition(() => {
    setTitle(savedTitle);
  });
}
```

#### Preserving form values before JavaScript loads {/*preserving-form-values-before-javascript-loads*/}

With [`useActionState`](/reference/react/useActionState), React can display a [Server Function](/reference/rsc/server-functions)'s returned value before hydration completes. The form can use those values as its new defaults. In a [Client Component](/reference/rsc/use-client), `useActionState` receives the Server Function and returns an Action for the form's `action` prop.

See [Handling form submission errors before JavaScript loads](#display-a-form-submission-error-without-javascript) for the same behavior with errors.

The Server Function receives the previous state followed by the submitted `FormData`. In this example, `updateTitle` saves the title and returns `{ title }`, which becomes the new state. Passing `state.title` to `defaultValue` preserves the saved title after the reset:

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function updateTitle(previousState, formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return { title };
}
```

```js
// EditForm.js
'use client';

import { useActionState } from 'react';
import { updateTitle } from './actions.js';

export default function EditForm() {
  const [state, updateTitleAction, isPending] = useActionState(updateTitle, {
    title: 'My draft',
  });

  return (
    <form action={updateTitleAction}>
      <input name="title" defaultValue={state.title} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

<DeepDive>

#### Other ways to control form resets {/*other-ways-to-control-form-resets*/}

The examples above keep every submitted value by storing it before the reset. You can also choose which values survive, or when the reset runs:

* **Keep values only when validation fails.** Return the same state shape from every submission. When validation fails, include the submitted `FormData` and read each field with `state.submitted?.get('title') ?? ''`. When validation succeeds, set that `FormData` to `null` so the reset clears those fields. [`useActionState`](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values) shows this pattern.

* **Skip the reset with `onSubmit`.** Handle the submission in `onSubmit`, call `e.preventDefault()`, and run the Action inside [`startTransition`](/reference/react/useTransition). Because the form's `action` does not run, React does not reset the form.

* **Reset at a specific moment.** Call the form element's [`reset()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset) method to immediately reset uncontrolled fields to their default values. To schedule a reset as part of an Action or Transition, call [`requestFormReset`](/blog/2024/12/05/react-19#form-actions) from `react-dom` instead.

* **Reset the form and the component state together.** Change the [`key`](/learn/preserving-and-resetting-state#resetting-a-form-with-a-key) of the component that renders the form. React recreates the component and its DOM, which resets the fields and any local state.

</DeepDive>

---
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

### Menangani beberapa jenis pengiriman {/*handling-multiple-submission-types*/}

<<<<<<< HEAD
Formulir dapat dirancang untuk menangani beberapa aksi pengiriman berdasarkan tombol yang ditekan oleh pengguna. Setiap tombol di dalam formulir dapat dikaitkan dengan aksi atau perilaku yang berbeda dengan mengatur prop `formAction`.

Ketika seorang pengguna mengetuk tombol tertentu, formulir disubmit, dan aksi yang sesuai, yang ditentukan oleh atribut dan aksi tombol tersebut, dieksekusi. Misalnya, sebuah formulir mungkin mengirimkan artikel untuk ditinjau secara default tetapi memiliki tombol terpisah dengan `formAction` diatur untuk menyimpan artikel sebagai draf.
=======
A form can have more than one submit button, each running a different Action. A button without `formAction` runs the form's `action`; a button with `formAction` runs its own Action instead. For example, the form below publishes an article by default, but its **Save draft** button stores the current content without publishing it. It uses [`useActionState`](/reference/react/useActionState) to preserve the saved draft:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
import { useActionState } from 'react';

export default function ArticleForm() {
  // Preserve the saved draft after submission
  const [formState, dispatchFormState] = useActionState((state, payload) => {
    const content = payload.data.get('content');
    switch (payload.type) {
      case 'save':
        alert(`Your draft of '${content}' was saved!`);
        return payload.data;
      case 'publish':
        alert(`'${content}' was published!`);
        return new FormData();
      default:
        return state;
    }
  }, new FormData());

  function publish(formData) {
<<<<<<< HEAD
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' telah dipublikasikan dengan tombol '${button}'`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Draf '${content}' Anda telah disimpan!`);
=======
    dispatchFormState({
      type: 'publish',
      data: formData,
    });
  }

  function save(formData) {
    dispatchFormState({
      type: 'save',
      data: formData,
    });
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  }

  return (
    <form action={publish}>
      <textarea
        name="content"
        rows={4}
        cols={40}
        defaultValue={formState?.get('content') || ''}
      />
      <br />
      <button type="submit" name="button" value="submit">Publikasikan</button>
      <button formAction={save}>Simpan draf</button>
    </form>
  );
}
```

</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

### My form fields are cleared after submission {/*my-form-fields-are-cleared-after-submission*/}

When a function passed to `action` or `formAction` succeeds, React resets the form's uncontrolled fields to their default values. Text fields without a `defaultValue` become empty. Returning a validation error instead of throwing also triggers this reset.

To keep a submitted value, store it in state and pass it to the field's `defaultValue`. See [Preserving form values after an Action](#preserve-form-values-after-an-action) for examples, or [preserving values when validation fails](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values).
