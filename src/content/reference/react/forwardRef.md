---
title: forwardRef
---

<Intro>

`forwardRef` memungkinkan Anda mengekspos sebuah simpul DOM sebagai sebuah [ref](/learn/manipulating-the-dom-with-refs) kepada induknya.

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Panggil fungsi `forwardRef()` untuk membiarkan komponen Anda menerima *ref* dan meneruskannya ke komponen anak:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Lihat contoh lainnya di bawah ini.] (#usage)

#### Parameter {/*parameters*/}

* `render`: Fungsi *render* untuk komponen Anda. React memanggil fungsi ini dengan *props* dan `ref` yang diterima komponen Anda dari induknya. JSX yang Anda kembalikan akan menjadi keluaran dari komponen Anda.

#### Kembalian {/*returns*/}

`forwardRef` mengembalikan komponen React yang dapat Anda *render* di JSX. Tidak seperti komponen React yang didefinisikan sebagai fungsi biasa, komponen yang dikembalikan oleh `forwardRef` juga dapat menerima *prop* `ref`.

#### Peringatan {/*caveats*/}

* Dalam Mode Ketat, React akan **memanggil fungsi *render* Anda dua kali** untuk [membantu Anda menemukan ketidakmurnian yang tidak disengaja.](#my-initializer-or-updater-function-runs-twice) Ini adalah perilaku khusus pengembangan dan tidak mempengaruhi produksi. Jika fungsi *render* Anda murni (sebagaimana mestinya), hal ini tidak akan mempengaruhi logika komponen Anda. Hasil dari salah satu pemanggilan akan diabaikan.


---

### `render` function {/*render-function*/}

`forwardRef` menerima fungsi *render* sebagai argumen. React memanggil fungsi ini dengan `props` dan `ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Parameter {/*render-parameters*/}

* `props`: *props* yang dioperkan oleh komponen induk.

* `ref`: Atribut `ref` yang dioper oleh komponen induk. `ref` dapat berupa objek atau fungsi. Jika komponen induk tidak mengoper *ref*, maka akan menjadi `null`. Anda harus mengoper `ref` yang Anda terima ke komponen lain, atau mengopernya ke [`useImperativeHandle`.](/reference/react/useImperativeHandle)

#### Kembalian {/*render-returns*/}

`forwardRef` mengembalikan komponen React yang dapat Anda *render* di JSX. Tidak seperti komponen React yang didefinisikan sebagai fungsi biasa, komponen yang dikembalikan oleh `forwardRef` dapat mengambil sebuah *prop* `ref`.

---

## Penggunaan {/*usage*/}

### Mengekspos sebuah simpul DOM ke komponen induk {/*exposing-a-dom-node-to-the-parent-component*/}

Secara *default*, simpul-simpul DOM dari setiap komponen bersifat privat. Namun, terkadang berguna untuk mengekspos simpul DOM ke induknya - misalnya, untuk memungkinkan pemfokusan. Untuk ikut serta, bungkus definisi komponen Anda ke dalam `forwardRef()`:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Anda akan menerima <CodeStep step={1}>ref</CodeStep> sebagai argumen kedua setelah props. Berikan ke simpul DOM yang ingin Anda ekspos:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Hal ini memungkinkan komponen `Form` induk mengakses <CodeStep step={2}>`<input>` DOM node</CodeStep> yang diekspos oleh `MyInput`:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Komponen `MyInput` meneruskan *ref* tersebut ke tag peramban `<input>`. Hasilnya, komponen `Form` dapat mengakses simpul DOM `<input>` tersebut dan memanggil fungsi [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) di atasnya.

Perlu diingat bahwa mengekspos *ref* ke simpul DOM di dalam komponen Anda akan mempersulit untuk mengubah internal komponen Anda di kemudian hari. Anda biasanya akan mengekspos simpul DOM dari komponen tingkat rendah yang dapat digunakan kembali seperti tombol atau input teks, tetapi Anda tidak akan melakukannya untuk komponen tingkat aplikasi seperti avatar atau komentar.


<Recipes title="Examples of forwarding a ref">

#### Memfokuskan input teks {/*focusing-a-text-input*/}

Mengeklik tombol akan memfokuskan input. Komponen `Form` mendefinisikan sebuah ref dan meneruskannya ke komponen `MyInput`. Komponen `MyInput` meneruskan *ref* tersebut ke tag peramban `<input>`. Hal ini memungkinkan komponen `Form` memfokuskan `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Memutar dan menjeda video {/*playing-and-pausing-a-video*/}

Mengeklik tombol akan memanggil [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) dan [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) pada simpul DOM `<video>`. Komponen `Aplikasi` mendefinisikan sebuah *ref* dan meneruskannya ke komponen `MyVideoPlayer`. Komponen `MyVideoPlayer` meneruskan *ref* tersebut ke simpul `<video>` pada peramban. Hal ini memungkinkan komponen `Aplikasi` memainkan dan menjeda `<video>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Meneruskan ref melalui beberapa komponen {/*forwarding-a-ref-through-multiple-components*/}

Alih-alih meneruskan `ref` ke *DOM node*, Anda bisa meneruskannya ke komponen Anda sendiri seperti `MyInput`:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Jika komponen `MyInput` meneruskan sebuah *ref* ke `<input>`, sebuah *ref* ke `FormField` akan memberi Anda `<input>` tersebut:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Komponen `Form` mendefinisikan sebuah *ref* dan meneruskannya ke `FormField`. Komponen `FormField` meneruskan *ref* tersebut ke `MyInput`, yang meneruskannya ke *DOM node* `<input>` peramban. Beginilah cara `Form` mengakses *DOM node* tersebut.

<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### Mengekspos penanganan imperatif alih-alih sebuah simpul DOM {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Daripada mengekspos seluruh simpul DOM, Anda dapat mengekspos objek khusus, yang disebut penanganan imperatif (*imperative handle*), dengan sekumpulan *methods* yang lebih terbatas. Untuk melakukan ini, Anda harus mendefinisikan *ref* terpisah untuk menampung *DOM node*:


```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Berikan `ref` yang Anda terima ke [`useImperativeHandle`](/reference/react/useImperativeHandle) dan tentukan nilai yang ingin Anda ekspos ke `ref`:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Jika beberapa komponen mendapatkan referensi ke `MyInput`, komponen tersebut hanya akan menerima objek `{ focus, scrollIntoView }`, bukan simpul DOM. Hal ini memungkinkan Anda membatasi informasi yang Anda paparkan tentang simpul DOM seminimal mungkin.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[Baca lebih lanjut tentang menggunakan penanganan imperatif.](/reference/react/useImperativeHandle)

<Pitfall>

**Jangan terlalu sering menggunakan refs.** Anda hanya boleh menggunakan *refs* untuk perilaku *imperatif* yang tidak dapat Anda ungkapkan sebagai *props*: misalnya, menggulir ke sebuah simpul, memfokuskan sebuah simpul, memicu sebuah animasi, memilih teks, dan sebagainya.

**Jika Anda dapat mengekspresikan sesuatu sebagai *prop*, Anda tidak seharusnya menggunakan *ref*.** Sebagai contoh, alih-alih mengekspos sebuah penanganan imperatif seperti `{ open, close }` dari sebuah komponen `Modal`, lebih baik menggunakan `isOpen` sebagai *prop* seperti `<Modal isOpen={isOpen} />`. [Efek](/learn/synchronizing-with-effects) dapat membantu Anda mengekspos perilaku imperatif melalui *props*.

</Pitfall>

---

## Pemecahan Masalah {/*troubleshooting*/}

### Komponen saya dibungkus dengan `forwardRef`, tetapi `ref` ke komponen tersebut selalu `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Hal ini biasanya berarti bahwa Anda lupa menggunakan `ref` yang Anda terima.

Sebagai contoh, komponen ini tidak melakukan apa pun dengan `ref`-nya:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Untuk memperbaikinya, berikan `ref` ke simpul DOM atau komponen lain yang dapat menerima *ref*:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

`ref` ke Komponen `MyInput` juga dapat menjadi `null` jika beberapa logika bersyarat:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Jika `showInput` bernilai `false`, maka *ref* tidak akan diteruskan ke simpul mana pun, dan *ref* ke `MyInput` akan tetap kosong. Hal ini sangat mudah terlewatkan jika kondisi tersebut tersembunyi di dalam komponen lain, seperti `Panel` pada contoh ini:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
