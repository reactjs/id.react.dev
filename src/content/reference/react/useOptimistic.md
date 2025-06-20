---
title: useOptimistic
---

<Intro>

`useOptimistic` adalah Hook yang memungkinkan Anda memperbarui antarmuka pengguna (UI) secara optimis.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` adalah Hook yang memungkinkan Anda menampilkan *state* yang berbeda pada saat aksi asinkron sedang berlangsung. Hook ini menerima beberapa *state* sebagai argumen dan mengembalikan salinan dari *state* tersebut yang bisa berbeda selama aksi asinkron seperti contoh *network request*. Anda dapat menyediakan sebuah *function* yang mengambil *state* saat ini dan input untuk aksi tersebut, dan mengembalikan *optimistic state* yang akan digunakan saat aksi tersebut tertunda.

*State* ini disebut sebagai *"optimistic" state* karena biasanya digunakan untuk segera menampilkan hasil dari aksi yang dilakukan pengguna, meskipun aksi tersebut sebenarnya memerlukan waktu untuk diselesaikan.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // merge and return new state
      // with optimistic value
    }
  );
}
```

[See more examples below.](#usage)

#### Parameter {/*parameters*/}

* `state`: nilai yang akan dikembalikan di awal dan setiap kali tidak ada tindakan yang tertunda.
* `updateFn(currentState, optimisticValue)`: sebuah *function* yang menerima `state` saat ini dan *optimistic value* yang diteruskan ke `addOptimistic` dan mengembalikan *optimistic state* yang dihasilkan. Function ini harus berupa function murni. `updateFn` menerima 2 parameter yaitu `currentState` dan `optimisticValue`. Nilai yang dikembalikan akan menjadi nilai gabungan dari `currentState` dan `optimisticValue`.


#### Kembalian {/*returns*/}

* `optimisticState`: Hasil optimistic state. Nilai ini sama dengan `state` kecuali jika ada aksi yang tertunda, dalam hal ini nilainya sama dengan nilai yang dikembalikan oleh `updateFn`.
* `addOptimistic`: `addOptimistic` adalah *dispatch function* yang dipanggil ketika Anda memiliki *optimistic update*. *Function* ini menerima satu argumen, `optimisticValue`, dengan tipe apapun dan akan memanggil `updateFn` dengan `state` dan `optimisticValue`.

---

## Penggunaan {/*usage*/}

### Memperbarui data secara optimis dengan form {/*optimistically-updating-with-forms*/}

Hook `useOptimistic` menyediakan cara untuk memperbarui antarmuka pengguna secara optimis sebelum operasi latar belakang, seperti *network request*. Dalam konteks *form*, teknik ini membantu membuat aplikasi terasa lebih responsif. Ketika seorang pengguna mengirimkan *form*, alih-alih menunggu respons dari server untuk merefleksikan perubahan, antarmuka akan langsung diperbarui dengan hasil yang diharapkan.

Misalnya, ketika seorang pengguna mengetik pesan ke dalam *form* dan menekan tombol "Send", Hook `useOptimistic` memungkinkan pesan tersebut segera muncul dalam daftar dengan label "Sending...", bahkan sebelum pesan tersebut benar-benar terkirim ke server. Pendekatan *"optimistic"* ini memberikan kesan kecepatan dan responsivitas. *Form* tersebut kemudian mencoba untuk benar-benar mengirim pesan tersebut di latar belakang. Setelah server mengonfirmasi bahwa pesan telah diterima, label "Sending..." akan dihapus.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef, startTransition } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessageAction }) {
  const formRef = useRef();
  function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true
      },
      ...state,
    ]
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessageAction(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    startTransition(() => {
      setMessages((messages) => [{ text: sentMessage }, ...messages]);
    })
  }
  return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


</Sandpack>
