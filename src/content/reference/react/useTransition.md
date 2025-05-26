---
title: useTransition
---

<Intro>

<<<<<<< HEAD
`useTransition` adalah sebuah React Hook yang memungkinkan Anda merubah suatu *state* tanpa memblokir *UI*.
=======
`useTransition` is a React Hook that lets you render a part of the UI in the background.
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useTransition()` {/*usetransition*/}

Panggil `useTransition` pada level teratas komponen Anda untuk menandai beberapa perubahan *state* sebagai transisi.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Lihat contoh lainnya dibawah ini.](#usage)

#### Parameters {/*parameters*/}

`useTransition` tidak menerima parameter apa pun.

#### Returns {/*returns*/}

`useTransition` mengembalikan senarai dengan tepat dua item:

<<<<<<< HEAD
1. Penanda `isPending` yang memberitahukan Anda bahwa terdapat transisi yang tertunda.
2. [fungsi `startTransition`](#starttransition) yang memungkinkan Anda menandai perubahan *state* sebagai transisi.

---

### fungsi `startTransition` {/*starttransition*/}

Fungsi `startTransition` yang dikembalikan oleh `useTransition` memungkinkan Anda menandai perubahan *state* sebagai transisi.
=======
1. The `isPending` flag that tells you whether there is a pending Transition.
2. The [`startTransition` function](#starttransition) that lets you mark updates as a Transition.

---

### `startTransition(action)` {/*starttransition*/}

The `startTransition` function returned by `useTransition` lets you mark an update as a Transition.
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

<Note>
#### Functions called in `startTransition` are called "Actions". {/*functions-called-in-starttransition-are-called-actions*/}

The function passed to `startTransition` is called an "Action". By convention, any callback called inside `startTransition` (such as a callback prop) should be named `action` or include the "Action" suffix:

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}

```

</Note>



#### Parameters {/*starttransition-parameters*/}

<<<<<<< HEAD
* `scope`: Fungsi yang mengubah beberapa *state* dengan memanggil satu atau lebih [fungsi `set`.](/reference/react/useState#setstate) React segera memanggil `scope` tanpa parameter dan menandai semua perubahan *state* yang dijadwalkan secara sinkron saat fungsi `scope` dipanggil sebagai transisi. Mereka akan menjadi [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) dan [tidak akan menampilkan indikator *loading* yang tidak perlu.](#preventing-unwanted-loading-indicators)
=======
* `action`: A function that updates some state by calling one or more [`set` functions](/reference/react/useState#setstate). React calls `action` immediately with no parameters and marks all state updates scheduled synchronously during the `action` function call as Transitions. Any async calls that are awaited in the `action` will be included in the Transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition` (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). State updates marked as Transitions will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators](#preventing-unwanted-loading-indicators).
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

#### Returns {/*starttransition-returns*/}

`startTransition` tidak mengembalikan apa pun.

#### Perhatian {/*starttransition-caveats*/}

* `useTransition` adalah sebuah Hook, sehingga hanya bisa dipanggil di dalam komponen atau Hook *custom*. Jika Anda ingin memulai sebuah transisi di tempat lain (contoh, dari data *library*), sebaiknya panggil [`startTransition`](/reference/react/startTransition) sebagai gantinya.

* Anda dapat membungkus perubahan menjadi transisi hanya jika Anda memiliki akses pada fungsi `set` pada *state* tersebut. Jika Anda ingin memulai sebuah transisi sebagai balasan dari beberapa *prop* atau nilai Hook *custom*, coba gunakan [`useDeferredValue`](/reference/react/useDeferredValue) sebagai gantinya.

<<<<<<< HEAD
* Fungsi yang Anda kirimkan kepada `startTransition` haruslah sinkron. React akan langsung mengeksekusi fungsi ini, menandai semua perubahan *state* yang terjadi sambil mengeksekusinya sebagai transisi. Jika Anda mencoba untuk melakukan perubahan *state* lebih nanti (contoh, saat *timeout*), mereka tidak akan ditandai sebagai transisi.
=======
* The function you pass to `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a `setTimeout`, for example, they won't be marked as Transitions.

* You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that we will fix in the future (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* The `startTransition` function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

* Perubahan *state* yang ditandai sebagai transisi akan terganggu oleh perubahan *state* lainnya. Contohnya, jika anda mengubah komponen chart di dalam transisi, namun kemudian memulai mengetik dalam input ketika chart sedang di tengah me*render* ulang, React akan me*render* ulang pekerjaan pada komponen chart setelah mengerjakan perubahan pada input.

* Perubahan transisi tidak dapat digunakan untuk mengontrol input teks.

<<<<<<< HEAD
* Apabila terdapat beberapa transisi yang berjalan, React saat ini akan mengelompokkan mereka bersama. Ini adalah limitasi yang mungkin akan dihapus pada rilis yang akan datang.

---
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that may be removed in a future release.
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

## Kegunaan {/*usage*/}

<<<<<<< HEAD
### Menandai perubahan state sebagai transisi non-blocking {/*marking-a-state-update-as-a-non-blocking-transition*/}

Panggil `useTransition` pada level teratas komponen Anda untuk menandai perubahan *state* sebagai *transisi* non-blocking.
=======
### Perform non-blocking updates with Actions {/*perform-non-blocking-updates-with-actions*/}

Call `useTransition` at the top of your component to create Actions, and access the pending state:
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` mengembalikan sebuah senarai dengan tepat dua item:

<<<<<<< HEAD
1. Penanda <CodeStep step={1}>`isPending`</CodeStep> yang memberitahukan Anda apakah terdapat transisi tertunda.
2. Fungsi <CodeStep step={2}>`startTransition`</CodeStep> yang memungkinkan Anda menandai perubahan *state* sebagai transisi.

Kemudian Anda dapat menandai perubahan *state* sebagai transisi seperti berikut:
=======
1. The <CodeStep step={1}>`isPending` flag</CodeStep> that tells you whether there is a pending Transition.
2. The <CodeStep step={2}>`startTransition` function</CodeStep> that lets you create an Action.

To start a Transition, pass a function to `startTransition` like this:
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

<<<<<<< HEAD
Transisi akan memungkinkan Anda untuk mempertahankan perubahan tampilan pengguna secara responsif bahkan untuk perangkat lambat.

Dengan transisi, UI Anda akan tetap responsif di tengah-tengah me-*render* ulang. Contohnya, jika pengguna menekan tab namun mereka berubah pikiran dan menekan tab lain, mereka dapat melakukan itu tanpa menunggu muat ulang pertama selesai.

<Recipes titleText="Perbedaan antara useTransition dan perubahan state biasa" titleId="examples">

#### Merubah tab saat ini dalam transisi {/*updating-the-current-tab-in-a-transition*/}

Pada contoh berikut ini, tab "Posts" ini **Dipelankan secara artifisial** sehingga akan memakan waktu setidaknya satu detik untuk *render*.

Tekan "Posts" kemudian segera tekan "Contact". Perhatikan bahwa ini akan mengganggu muatan "Posts" yang lambat. Tab "Contact" akan tampil segera. Karena perubahan *state* ini ditandai sebagai transisi, me*render* ulang yang lambat tidak akan membekukan tampilan pengguna.
=======
The function passed to `startTransition` is called the "Action". You can update state and (optionally) perform side effects within an Action, and the work will be done in the background without blocking user interactions on the page. A Transition can include multiple Actions, and while a Transition is in progress, your UI stays responsive. For example, if the user clicks a tab but then changes their mind and clicks another tab, the second click will be immediately handled without waiting for the first update to finish. 

To give the user feedback about in-progress Transitions, the `isPending` state switches to `true` at the first call to `startTransition`, and stays `true` until all Actions complete and the final state is shown to the user. Transitions ensure side effects in Actions to complete in order to [prevent unwanted loading indicators](#preventing-unwanted-loading-indicators), and you can provide immediate feedback while the Transition is in progress with `useOptimistic`.

<Recipes titleText="The difference between Actions and regular event handling">

#### Updating the quantity in an Action {/*updating-the-quantity-in-an-action*/}

In this example, the `updateQuantity` function simulates a request to the server to update the item's quantity in the cart. This function is *artificially slowed down* so that it takes at least a second to complete the request.

Update the quantity multiple times quickly. Notice that the pending "Total" state is shown while any requests are in progress, and the "Total" updates only after the final request is complete. Because the update is in an Action, the "quantity" can continue to be updated while the request is in progress.
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

```js src/Item.js
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // To expose an action prop, await the callback in startTransition.
    startTransition(async () => {
      await action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

This is a basic example to demonstrate how Actions work, but this example does not handle requests completing out of order. When updating the quantity multiple times, it's possible for the previous requests to finish after later requests causing the quantity to update out of order. This is a known limitation that we will fix in the future (see [Troubleshooting](#my-state-updates-in-transitions-are-out-of-order) below).

For common use cases, React provides built-in abstractions such as:
- [`useActionState`](/reference/react/useActionState)
- [`<form>` actions](/reference/react-dom/components/form)
- [Server Functions](/reference/rsc/server-functions)

These solutions handle request ordering for you. When using Transitions to build your own custom hooks or libraries that manage async state transitions, you have greater control over the request ordering, but you must handle it yourself.

<Solution />

<<<<<<< HEAD
#### Merubah tab saat ini tanpa transisi {/*updating-the-current-tab-without-a-transition*/}

Pada contoh berikut, tab "Posts" juga **Dipelankan secara artifisial** sehingga akan memakan waktu setidaknya satu detik untuk *render*. Berbeda dengan contoh sebelumnya, perubahan *state* ini **bukanlah sebuah transisi.**

Tekan "Posts" kemudian segera tekan "Contact". Perhatikan bahwa aplikasi membeku ketika render tab yang lambat, dan UI menjadi tidak responsive. Perubahan *state* ini bukanlah sebuah transisi, sehingga me-*render* ulang yang lambat membekukan tampilan pengguna.
=======
#### Updating the quantity without an Action {/*updating-the-users-name-without-an-action*/}

In this example, the `updateQuantity` function also simulates a request to the server to update the item's quantity in the cart. This function is *artificially slowed down* so that it takes at least a second to complete the request.

Update the quantity multiple times quickly. Notice that the pending "Total" state is shown while any requests is in progress, but the "Total" updates multiple times for each time the "quantity" was clicked:
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async newQuantity => {
    // Manually set the isPending State.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

A common solution to this problem is to prevent the user from making changes while the quantity is updating:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async event => {
    const newQuantity = event.target.value;
    // Manually set the isPending state.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item isPending={isPending} onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        disabled={isPending}
        onChange={onUpdateQuantity}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

This solution makes the app feel slow, because the user must wait each time they update the quantity. It's possible to add more complex handling manually to allow the user to interact with the UI while the quantity is updating, but Actions handle this case with a straight-forward built-in API.

<Solution />

</Recipes>

---

<<<<<<< HEAD
### Merubah komponen induk dalam transisi {/*updating-the-parent-component-in-a-transition*/}

Anda dapat mengubah *state* komponen induk dari panggilan `useTransition` juga. Contohnya, komponen `TabButton` ini membungkus logika komponen `onClick` dalam sebuah transisi:
=======
### Exposing `action` prop from components {/*exposing-action-props-from-components*/}

You can expose an `action` prop from a component to allow a parent to call an Action.
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

For example, this `TabButton` component wraps its `onClick` logic in an `action` prop:

```js {8-12}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async. 
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

<<<<<<< HEAD
Karena komponen induk merubah *state*nya di dalam event handler `onClick`, perubahan *state* tersebut akan ditandai sebagai transisi. Inilah mengapa, seperti pada contoh di awal, Anda dapat menekan pada "Posts" dan kemudian segera menekan "Contact". Mengubah tab yang dipilih akan ditandai sebagai transisi, sehingga itu tidak memblokir tampilan pengguna.
=======
Because the parent component updates its state inside the `action`, that state update gets marked as a Transition. This means you can click on "Posts" and then immediately click "Contact" and it does not block user interactions:
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async. 
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

<Note>

When exposing an `action` prop from a component, you should `await` it inside the transition. 

This allows the `action` callback to be either synchronous or asynchronous without requiring an additional `startTransition` to wrap the `await` in the action.

</Note>

---

<<<<<<< HEAD
### Menampilan state visual tertunda saat transisi {/*displaying-a-pending-visual-state-during-the-transition*/}
=======
### Displaying a pending visual state {/*displaying-a-pending-visual-state*/}
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

Anda dapat menggunakan nilai boolean `isPending` yang dikembalikan oleh `useTransition` untuk menandai ke pengguna bahwa transisi sedang berjalan. Contohnya, tombol tab dapat memiliki *state* visual special "pending":

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Perhatikan bagaimana menekan "Posts" sekarang terasa lebih responsif karena tombol tab tersebut berubah langsung:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### Mencegah indikator loading yang tidak diinginkan {/*preventing-unwanted-loading-indicators*/}

<<<<<<< HEAD
Pada contoh berikut ini, komponen `PostsTab` mengambil beberapa data menggunakan [Suspense-enabled](/reference/react/Suspense) data source. Ketika Anda menekan tab "Posts", komponen `PostsTab` akan di*suspends*, menyebabkan *fallback* loading terdekat untuk muncul:
=======
In this example, the `PostsTab` component fetches some data using [use](/reference/react/use). When you click the "Posts" tab, the `PostsTab` component *suspends*, causing the closest loading fallback to appear:
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

<<<<<<< HEAD
Menyembunyikan seluruh tab container untuk menampilkan indikator loading akan mengarahkan ke pengalaman pengguna yang gemuruh. Jika Anda menambahkan `useTransition` ke `TabButton`, Anda bisa sebagai gantinya mengindikasi tampilan *state* pending di tombol tab sebagai gantinya.
=======
Hiding the entire tab container to show a loading indicator leads to a jarring user experience. If you add `useTransition` to `TabButton`, you can instead display the pending state in the tab button instead.
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

Perhatikan bahwa menekan "Posts" tidak menjadikan seluruh tab container dengan spinner:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Baca lebih lanjut tentang menggunakan transisi dengan Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

<<<<<<< HEAD
Transisi hanya akan "menunggu" cukup lama untuk menghindari konten *already revealed* (seperti tab container). Jika tab Posts memiliki [nested `<Suspense>` boundary,](/reference/react/Suspense#revealing-nested-content-as-it-loads) transisi tidak akan "menunggu" untuk itu.
=======
Transitions only "wait" long enough to avoid hiding *already revealed* content (like the tab container). If the Posts tab had a [nested `<Suspense>` boundary,](/reference/react/Suspense#revealing-nested-content-as-it-loads) the Transition would not "wait" for it.
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

</Note>

---

### Membangun router Suspense-enabled {/*building-a-suspense-enabled-router*/}

Jika Anda membangun React framework atau router, kami merekomendasikan menandai navigasi halaman sebagai transisi.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

<<<<<<< HEAD
Ini direkomendasikan karena dua alasan:

- [Transisi dapat terputus,](#marking-a-state-update-as-a-non-blocking-transition) yang memungkinkan pengguna mengklik tanpa menunggu me-*render* ulang selesai.
- [Transisi mencegah indikator loading yang tidak diinginkan,](#preventing-unwanted-loading-indicators) yang memungkinkan pengguna menghindari lompatan menggelegar pada navigasi.

Berikut adalah contoh router kecil sederhana menggunakan transisi untuk navigasi.
=======
This is recommended for three reasons:

- [Transitions are interruptible,](#marking-a-state-update-as-a-non-blocking-transition) which lets the user click away without waiting for the re-render to complete.
- [Transitions prevent unwanted loading indicators,](#preventing-unwanted-loading-indicators) which lets the user avoid jarring jumps on navigation.
- [Transitions wait for all pending actions](#perform-non-blocking-updates-with-actions) which lets the user wait for side effects to complete before the new page is shown.

Here is a simplified router example using Transitions for navigations.
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

Secara default, router [Suspense-enabled](/reference/react/Suspense) diharapkan untuk membungkus perubahan navigasi menjadi transisi.

</Note>

---

### Menampilkan *error* ke pengguna dengan *error boundary* {/*displaying-an-error-to-users-with-error-boundary*/}

<<<<<<< HEAD
<Canary>

*Error Boundary* untuk useTransition saat ini hanya tersedia di kanal *canary* dan *experimental* React. Pelajari lebih lanjut tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

=======
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772
If a function passed to `startTransition` throws an error, you can display an error to your user with an [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). To use an error boundary, wrap the component where you are calling the `useTransition` in an error boundary. Once the function passed to `startTransition` errors, the fallback for the error boundary will be displayed.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // Untuk tujuan demonstrasi untuk menunjukkan ErrorBoundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Secara sengaja tidak menambahkan komentar
          // agar error ditampilkan
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Pemecahan Masalah {/*troubleshooting*/}

### Merubah input dalam transisi tidak bekerja {/*updating-an-input-in-a-transition-doesnt-work*/}

Anda tidak dapat menggunakan transisi unttuk variabel state yang mengendalikan input:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Tidak dapat menggunakan transisi untuk state input terkontrol
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

Ini dikarenakan transisi adalah non-blocking, namun mengubah input dalam respon untuk mengubah *event* seharusnya bekerja secara sinkron. Jika Anda ingin menjalankan transisi sebagai respon untuk menulis, Anda memiliki dua opsi:

1. Anda dapat mendeklarasikan dua variabel *state* berbeda: satu untuk *state* masukan ( yang selalu berubah secara sinkron), dan satu yang akan Anda ubah dalam transisi. Ini memungkinkan Anda mengendalikan masukan menggunakan *state* sinkron, dan mengirim variabel *state* transisi (yang akan "lag" dibelakang masukan) ke sisa logika *rendering* Anda.
2. Kalau tidak, Anda dapat memiliki satu variabel *state*, dan tambahkan [`useDeferredValue`](/reference/react/useDeferredValue) yang akan "lag" dibelakang nilai asli. Ini akan men*trigger* me*render* ulang non-blocking untuk "mengejar" dengan nilai baru secara otomatis.

---

### React tidak memperlakukan perubahan state saya sebagai transisi {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Ketika Anda membungkus perubahan *state* di dalam transisi, pastikan bahwa itu terjadi *saat* memanggil `startTransition`:

```js
startTransition(() => {
  // ✅ Mengatur state *saat* startTransition dipanggil
  setPage('/about');
});
```

<<<<<<< HEAD
Fungsi yang Anda kirimkan ke `startTransition` harus sinkron.

Anda tidak dapat menandakan perubahan sebagai transisi seperti berikut:
=======
The function you pass to `startTransition` must be synchronous. You can't mark an update as a Transition like this:
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

```js
startTransition(() => {
  // ❌ Mengatur state *setelah* startTransition dipanggil
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Sebaiknya, anda dapat melakukan hal berikut:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Mengatur state *saat* startTransition dipanggil
    setPage('/about');
  });
}, 1000);
```

<<<<<<< HEAD
Demikian pula, Anda tidak dapat menandai perubahan sebagai transisi seperti berikut:
=======
---

### React doesn't treat my state update after `await` as a Transition {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

When you use `await` inside a `startTransition` function, the state updates that happen after the `await` are not marked as Transitions. You must wrap state updates after each `await` in a `startTransition` call:
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

```js
startTransition(async () => {
  await someAsyncFunction();
<<<<<<< HEAD
  // ❌ Mengatur state *setelah* startTransition dipanggil
=======
  // ❌ Not using startTransition after await
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772
  setPage('/about');
});
```

Namun, ini bekerja sebagai gantinya:

```js
<<<<<<< HEAD
await someAsyncFunction();
startTransition(() => {
  // ✅ Mengatur state *saat* startTransition dipanggil
  setPage('/about');
=======
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Using startTransition *after* await
  startTransition(() => {
    setPage('/about');
  });
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772
});
```

This is a JavaScript limitation due to React losing the scope of the async context. In the future, when [AsyncContext](https://github.com/tc39/proposal-async-context) is available, this limitation will be removed.

---

### Saya ingin memanggil `useTransition` dari luar komponen {/*i-want-to-call-usetransition-from-outside-a-component*/}

Anda tidak dapat memanggil `useTransition` di luar sebuah komponen karena ini adalah sebuah Hook. Dalam kasus ini, sebaiknya gunakanlah *method* [`startTransition`](/reference/react/startTransition). Itu bekerja dengan cara yang sama, namun itu tidak dapat memberikan indikator `isPending`.

---

### Fungsi yang saya berikan ke `startTransition` tereksekusi langsung {/*the-function-i-pass-to-starttransition-executes-immediately*/}

Jika Anda menjalankan kode berikut, ini akan mencetak 1, 2, 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**Ini diharapkan untuk mencetak 1, 2, 3.** Fungsi yang Anda berikan ke `startTransition` tidak tertunda. Tidak seperti milik browser `setTimeout`, hal tersebut nantinya tidak menjalankan *callback*. React akan eksekusi fungsi Anda secara langsung, namun perubahan *state* yang terjadwal *saat berjalan* akan ditandai sebagai transisi. Anda dapat membayangkan hal tersebut bekerja seperti berikut:

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a Transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```

### My state updates in Transitions are out of order {/*my-state-updates-in-transitions-are-out-of-order*/}

If you `await` inside `startTransition`, you might see the updates happen out of order.

In this example, the `updateQuantity` function simulates a request to the server to update the item's quantity in the cart. This function *artificially returns the every other request after the previous* to simulate race conditions for network requests.

Try updating the quantity once, then update it quickly multiple times. You might see the incorrect total:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  
  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Access the pending state of the transition,
    // by wrapping in startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(async () => {
      await action(e.target.value);
    });
  }  
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>


When clicking multiple times, it's possible for previous requests to finish after later requests. When this happens, React currently has no way to know the intended order. This is because the updates are scheduled asynchronously, and React loses context of the order across the async boundary.

This is expected, because Actions within a Transition do not guarantee execution order. For common use cases, React provides higher-level abstractions like [`useActionState`](/reference/react/useActionState) and [`<form>` actions](/reference/react-dom/components/form) that handle ordering for you. For advanced use cases, you'll need to implement your own queuing and abort logic to handle this.


Example of `useActionState` handling execution order:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useActionState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  const [quantity, updateQuantityAction, isPending] = useActionState(
    async (prevState, payload) => {
      setClientQuantity(payload);
      const savedQuantity = await updateQuantity(payload);
      return savedQuantity; // Return the new quantity to update the state
    },
    1 // Initial quantity
  );

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(() => {
      action(e.target.value);
    });
  }  
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>
