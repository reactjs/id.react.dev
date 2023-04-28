---
title: State Sebagai Sebuah Snapshot
---

<Intro>

*State* mungkin terlihat seperti variabel reguler pada Javascript yang dapat Anda baca dan tulis. Akan tetapi, *state* berperilaku lebih seperti sebuah *snapshot*. Melakukan perubahan pada *state* tidak mengubah kondisi dari variabel yang Anda miliki, akan tetapi memicu terjadinya sebuah *render* ulang.

</Intro>

<YouWillLearn>

* Bagaimana mengubah suatu *state* memicu terjadinya *render* ulang
* Kapan dan bagaimana *state* diperbarui
* Mengapa *state* tidak segera diperbarui setelah Anda mengubahnya  
* Bagaimana *event handlers* dapat mengakses "*snapshot*" dari sebuah *state*

</YouWillLearn>

## Mengubah state memicu terjadinya render ulang {/*setting-state-triggers-renders*/}

Anda mungkin berpikir bahwa antarmuka pengguna Anda berubah seketika sebagai respons terhadap *event* pengguna seperti sebuah *event* klik. Pada React, cara kerjanya sedikit berbeda dari model mental ini. Pada halaman sebelumnya, Anda dapat melihat bahwa [mengubah *state* mengirim permintaan *render* ulang](/learn/render-and-commit#step-1-trigger-a-render) kepada React. Artinya, agar antarmuka pengguna pada aplikasi Anda dapat bereaksi terhadap *event* tersebut, Anda perlu *memperbarui state tersebut*.

Pada contoh dibawah, ketika Anda menekan tombol "Kirim". `setIsSent(true)` memberi tahu React untuk melakukan *render* ulang terhadap UI:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Halo!');
  if (isSent) {
    return <h1>Pesan anda sedang dikirim!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Kirim</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Here's what happens when you click the button:
Inilah yang terjadi ketika Anda menekan tombol "Kirim" pada contoh diatas:

1. *Event handler* `onSubmit` dijalankan.
2. `setIsSent(true)` mengubah `isSent` menjadi `true` dan memasukkan antrian *render* baru.
3. React melakukan *render* ulang pada komponen tersebut sesuai dengan nilai `isSent` yang baru.  

Mari kita lihat lebih dekat hubungan antara *state* dan *rendering*.

## Rendering mengambil sebuah snapshot pada waktunya {/*rendering-takes-a-snapshot-in-time*/}

["Rendering"](/learn/render-and-commit#step-2-react-renders-your-components) berarti React memanggil komponen Anda, yang merupakan sebuah fungsi. JSX yang Anda kembalikan dari fungsi tersebut layaknya seperti sebuah *snapshot* UI pada waktu *render* tersebut. *Props*, *event handler*, dan variabel lokal semuanya dihitung *menggunakan state pada komponen tersebut pada saat render*.

Tidak seperti sebuah foto atau sebuah bingkai film, "*snapshot*" antarmuka yang Anda kembalikan bersifat interaktif. Ini termasuk logika seperti *event handler* yang menentukan apa yang terjadi sebagai respons terhadap suatu input. React memperbarui antarmuka agar sesuai dengan *snapshot* ini dan menghubungkan *event handler*. Sebagai hasilnya, menekan sebuah tombol akan memicu *handler* klik dari JSX Anda.

Ketika React melakukan *render* ulang pada sebuah komponen:

1. React memanggil fungsi Anda kembali.
2. Fungsi Anda mengembalikan *snapshot* JSX yang baru.
3. React lalu memperbarui antarmuka agar sesuai dengan *snapshot* yang Anda kembalikan.

<IllustrationBlock sequential>
    <Illustration caption="React menjalankan fungsi" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Melakukan kalkulasi untuk mendapatkan snapshot terbaru" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Memperbarui pohon DOM" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Sebagai memori dari sebuah komponen, *state* tidak seperti variabel biasa yang hilang setelah fungsi Anda selesai. *State* sebenarnya "hidup" didalam React itu sendiri--seolah-olah di sebuah rak!--di luar fungsi Anda. Ketika React memanggil komponen Anda, React memberi Anda snapshot dari *state* untuk *render* tersebut. Komponen Anda mengembalikan *snapshot* UI dengan kumpulan *props* dan *event handler* baru di JSX tersebut, yang semuanya dihitung **menggunakan nilai *state* dari *render* tersebut!**

<IllustrationBlock sequential>
  <Illustration caption="Anda memberi tahu React untuk memperbarui suatu state" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React memperbarui nilai dari state tersebut" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React meneruskan snapshot dari nilai state tersebut ke komponen yang bersangkutan" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

Berikut sedikit eksperimen untuk menunjukkan cara kerjanya. Pada contoh dibawah, Anda mungkin mengira bahwa menekan tombol "+3" akan menaikkan jumlah perhitungannya sebanyak tiga kali karena kode tersebut memanggil `setNumber(number + 1)` sebanyak tiga kali.

Lihat apa yang terjadi ketika anda menekan tombol "+3":

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Perhatikan bahwa `number` hanya bertambah satu kali per klik!

**Memperbarui state hanya akan mengubahnya untuk *render* selanjutnya.** Pada *render* pertama, `number` bernilai `0`. Inilah sebabnya, dalam *handler* `onClick` pada *render* tersebut, `number` tetap bernilai `0` bahkan setelah `setNumber(number + 1)` dipanggil:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Berikut adalah apa yang *handler* klik pada tombol tersebut beri tahu kepada React apa yang perlu dilakukan:

1. `setNumber(number + 1)`: `number` bernilai `0` sehingga `setNumber(0 + 1)`.
    - React mempersiapkan untuk mengubah `number` menjadi `1` pada *render* selanjutnya.
2. `setNumber(number + 1)`: `number` bernilai `0` sehingga `setNumber(0 + 1)`.
    - React mempersiapkan untuk mengubah `number` menjadi `1` pada *render* selanjutnya.
3. `setNumber(number + 1)`: `number` bernilai `0` sehingga `setNumber(0 + 1)`.
    - React mempersiapkan untuk mengubah `number` menjadi `1` pada *render* selanjutnya.

Even though you called `setNumber(number + 1)` three times, in *this render's* event handler `number` is always `0`, so you set the state to `1` three times. This is why, after your event handler finishes, React re-renders the component with `number` equal to `1` rather than `3`.

You can also visualize this by mentally substituting state variables with their values in your code. Since the `number` state variable is `0` for *this render*, its event handler looks like this:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

For the next render, `number` is `1`, so *that render's* click handler looks like this:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

This is why clicking the button again will set the counter to `2`, then to `3` on the next click, and so on.

## State over time {/*state-over-time*/}

Well, that was fun. Try to guess what clicking this button will alert:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

If you use the substitution method from before, you can guess that the alert shows "0":

```js
setNumber(0 + 5);
alert(0);
```

But what if you put a timer on the alert, so it only fires _after_ the component re-rendered? Would it say "0" or "5"? Have a guess!

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Surprised? If you use the substitution method, you can see the "snapshot" of the state passed to the alert.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

The state stored in React may have changed by the time the alert runs, but it was scheduled using a snapshot of the state at the time the user interacted with it!

**A state variable's value never changes within a render,** even if its event handler's code is asynchronous. Inside *that render's* `onClick`, the value of `number` continues to be `0` even after `setNumber(number + 5)` was called. Its value was "fixed" when React "took the snapshot" of the UI by calling your component.

Here is an example of how that makes your event handlers less prone to timing mistakes. Below is a form that sends a message with a five-second delay. Imagine this scenario:

1. You press the "Send" button, sending "Hello" to Alice.
2. Before the five-second delay ends, you change the value of the "To" field to "Bob".

What do you expect the `alert` to display? Would it display, "You said Hello to Alice"? Or would it display, "You said Hello to Bob"? Make a guess based on what you know, and then try it:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React keeps the state values "fixed" within one render's event handlers.** You don't need to worry whether the state has changed while the code is running.

But what if you wanted to read the latest state before a re-render? You'll want to use a [state updater function](/learn/queueing-a-series-of-state-updates), covered on the next page!

<Recap>

* Setting state requests a new render.
* React stores state outside of your component, as if on a shelf.
* When you call `useState`, React gives you a snapshot of the state *for that render*.
* Variables and event handlers don't "survive" re-renders. Every render has its own event handlers.
* Every render (and functions inside it) will always "see" the snapshot of the state that React gave to *that* render.
* You can mentally substitute state in event handlers, similarly to how you think about the rendered JSX.
* Event handlers created in the past have the state values from the render in which they were created.

</Recap>



<Challenges>

#### Implement a traffic light {/*implement-a-traffic-light*/}

Here is a crosswalk light component that toggles on when the button is pressed:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Add an `alert` to the click handler. When the light is green and says "Walk", clicking the button should say "Stop is next". When the light is red and says "Stop", clicking the button should say "Walk is next".

Does it make a difference whether you put the `alert` before or after the `setWalk` call?

<Solution>

Your `alert` should look like this:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Whether you put it before or after the `setWalk` call makes no difference. That render's value of `walk` is fixed. Calling `setWalk` will only change it for the *next* render, but will not affect the event handler from the previous render.

This line might seem counter-intuitive at first:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

But it makes sense if you read it as: "If the traffic light shows 'Walk now', the message should say 'Stop is next.'" The `walk` variable inside your event handler matches that render's value of `walk` and does not change.

You can verify that this is correct by applying the substitution method. When `walk` is `true`, you get:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

So clicking "Change to Stop" queues a render with `walk` set to `false`, and alerts "Stop is next".

</Solution>

</Challenges>
