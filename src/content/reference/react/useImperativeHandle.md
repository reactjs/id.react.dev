---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` adalah sebuah React Hook yang memungkinkan Anda menyesuaikan penanganan yang diekspos sebagai [*ref*.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Panggil fungsi `useImperativeHandle` di tingkat teratas komponen Anda untuk menyesuaikan penanganan yang diekspos oleh *ref*:

```js
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

[Lihat lebih banyak contoh di bawah.](#usage)

#### Parameter {/*parameters*/}

* `ref`: *ref* yang Anda terima sebagai argumen kedua dari [fungsi *render* `forwardRef`.](/reference/react/forwardRef#render-function)

* `createHandle`: Sebuah fungsi yang tidak mengambil argumen dan mengembalikan penanganan ref yang ingin Anda ekspos. Penanganan ref tersebut dapat memiliki tipe *any*. Biasanya, Anda akan mengembalikan sebuah object dengan sekumpulan metode yang ingin Anda ekspos.

* `dependencies` **opsional**: Daftar semua nilai reaktif yang dirujuk di dalam kode `setup`. Nilai reaktif termasuk *props*, *state*, dan semua variabel dan fungsi yang dideklarasikan langsung di dalam tubuh komponen. Jika *linter* Anda telah [dikonfigurasi untuk React](/learn/editor-setup#linting), maka *linter* tersebut akan memverifikasi bahwa setiap nilai reaktif sudah diatur dengan benar sebagai dependensi. Daftar dependensi ini harus memiliki jumlah *item* yang konstan dan ditulis secara *inline* seperti `[dep1, dep2, dep3]`. React akan membandingkan setiap dependensi dengan nilai lama menggunakan perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Jika sebuah *render* ulang menghasilkan sebuah perubahan terhadap beberapa *dependency*, atau jika Anda menghilangkan argumen ini, fungsi `createHandle` Anda akan dijalankan ulang, dan penanganan yang baru dibuat akan ditetapkan kepada `ref` tersebut.

#### Kembalian {/*returns*/}

`useImperativeHandle` mengembalikan `undefined`.

---

## Penggunaan {/*usage*/}

### Mengekspos sebuah penanganan ref kustom kepada komponen induk {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Secara bawaan, komponen tidak mengekspos *DOM nodes* kepada komponen induk. Sebagai contoh, jika Anda menginginkan komponen induk dari `MyInput` untuk [memiliki akses](/learn/manipulating-the-dom-with-refs) terhadap *DOM node* dari `<input>`, Anda harus menyertakannya dengan [`forwardRef`:](/reference/react/forwardRef)

```js {4}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

Dengan kode di atas, [sebuah *ref* yang diteruskan ke komponen `MyInput` akan menerima simpul DOM dari `<input>`.](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) Namun, Anda dapat mengekspos sebuah nilai kustom. Untuk mengkustom penanganan yang diekspos, panggil fungsi `useImperativeHandle` di tingkat atas komponen Anda:

```js {4-8}
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);

  return <input {...props} />;
});
```

Perlu dicatat bahwa dalam kode di atas, `ref` tidak lagi diteruskan kepada `<input>`.

Sebagai contoh, jika Anda tidak ingin mengekspos keseluruhan simpul DOM dari `<input>`, namun Anda ingin mengekspos dua *methods* yang tersedia di dalamnya: `focus` dan `scrollIntoView`. Untuk melakukan hal tersebut, pertahankan DOM peramban yang asli ke dalam *ref* yang terpisah. Kemudian gunakan `useImperativeHandle` untuk mengekspos sebuah penanganan hanya dengan *methods* yang ingin Anda panggil melalui komponen induk:

```js {7-14}
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

Sekarang, jika komponen induk mendapatkan sebuah *ref* yang merujuk pada `MyInput`, komponen tersebut akan dapat memanggil *method* `focus` dan `scrollIntoView`. Meskipun begitu, komponen induk tersebut tidak akan memiliki akses penuh terhadap simpul DOM `<input>` yang mendasarinya.

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

---

### Mengekspos methods imperatif Anda sendiri {/*exposing-your-own-imperative-methods*/}

*Methods* yang diekspos melalui penanganan imperatif tidak harus sesuai dengan *DOM methods* secara persis. Sebagai contoh, komponen `Post` berikut mengekspos sebuah *method* `scrollAndFocusAddComment` melalui penanganan imperatif. Hal ini memungkinkan induk `Page` menggulir daftar komentar *dan* memfokuskan bidang input ketika Anda mengklik tombol:

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js Post.js
import { forwardRef, useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

const Post = forwardRef((props, ref) => {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
});

export default Post;
```


```js CommentList.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const CommentList = forwardRef(function CommentList(props, ref) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
});

export default CommentList;
```

```js AddComment.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const AddComment = forwardRef(function AddComment(props, ref) {
  return <input placeholder="Add comment..." ref={ref} />;
});

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**Jangan terlalu sering menggunakan refs.** Anda hanya boleh menggunakan *refs* untuk perilaku *imperatif* yang tidak dapat Anda ungkapkan sebagai *props*: misalnya, menggulir ke sebuah simpul, memfokuskan sebuah simpul, memicu sebuah animasi, memilih teks, dan sebagainya.

**Jika Anda dapat mengekspresikan sesuatu sebagai *prop*, Anda tidak seharusnya menggunakan *ref*.** Sebagai contoh, alih-alih mengekspos penanganan imperatif seperti `{ open, close }` dari sebuah komponen `Modal`, lebih baik menggunakan `isOpen` sebagai *prop* seperti `<Modal isOpen={isOpen} />`. [Efek](/learn/synchronizing-with-effects) dapat membantu Anda mengekspos perilaku imperatif melalui  *props*.

</Pitfall>
