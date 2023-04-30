---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` adalah sebuah React Hook yang memungkinkan Anda menyesuaikan penanganan yang diekspos sebagai [ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Panggil fungsi `useImperativeHandle` di tingkat atas komponen Anda untuk mengkustomisasi penanganan yang diekspos oleh ref:

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

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `ref`: `ref` yang Anda terima sebagai argumen ke-dua dari [fungsi render `forwardRef`.](/reference/react/forwardRef#render-function)

* `createHandle`: Sebuah fungsi yang tidak mengambil argumen dan mengembalikan penanganan ref yang ingin Anda ekspos. Penanganan ref tersebut dapat memiliki tipe *any*. Biasanya, Anda akan mengembalikan sebuah object dengan sekumpulan metode yang ingin Anda ekspos.

* **opsional** `dependencies`: Daftar semua nilai reaktif yang dirujuk di dalam kode `setup`. Nilai reaktif termasuk *props*, *state*, dan semua variabel dan fungsi yang dideklarasikan langsung di dalam komponen. Jika *linter* Anda telah [dikonfigurasi untuk React](/learn/editor-setup#linting), maka *linter* tersebut akan memverifikasi bahwa setiap nilai reaktif sudah diatur dengan benar sebagai dependensi. Daftar dependensi ini harus memiliki jumlah *item* yang konstan dan ditulis secara *inline* seperti `[dep1, dep2, dep3]`. React akan membandingkan setiap dependensi dengan nilai lama menggunakan perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Jika sebuah *re-render* menghasilkan sebuah perubahan terhadap beberapa *dependency*, atau jika Anda menghilangkan argumen ini, fungsi `createHandle` Anda akan dijalankan ulang, dan penanganan yang baru dibuat akan ditempatkan ke `ref`.

#### Returns {/*returns*/}

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

Dengan kode di atas, [sebuah *ref* yang diteruskan ke komponen `MyInput` akan menerima *DOM node* dari `<input>`.](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) Namun, Anda dapat mengekspos sebuah nilai kustom. Untuk mengkustom penanganan yang diekspos, panggil fungsi `useImperativeHandle` di tingkat atas komponen Anda:

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

Perlu dicatat bahwa dalam kode diatas, `ref` tidak lagi diteruskan kepada `<input>`.

For example, suppose you don't want to expose the entire `<input>` DOM node, but you want to expose two of its methods: `focus` and `scrollIntoView`. To do this, keep the real browser DOM in a separate ref. Then use `useImperativeHandle` to expose a handle with only the methods that you want the parent component to call:

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

Now, if the parent component gets a ref to `MyInput`, it will be able to call the `focus` and `scrollIntoView` methods on it. However, it will not have full access to the underlying `<input>` DOM node.

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

### Exposing your own imperative methods {/*exposing-your-own-imperative-methods*/}

The methods you expose via an imperative handle don't have to match the DOM methods exactly. For example, this `Post` component exposes a `scrollAndFocusAddComment` method via an imperative handle. This lets the parent `Page` scroll the list of comments *and* focus the input field when you click the button:

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

**Do not overuse refs.** You should only use refs for *imperative* behaviors that you can't express as props: for example, scrolling to a node, focusing a node, triggering an animation, selecting text, and so on.

**If you can express something as a prop, you should not use a ref.** For example, instead of exposing an imperative handle like `{ open, close }` from a `Modal` component, it is better to take `isOpen` as a prop like `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) can help you expose imperative behaviors via props.

</Pitfall>
