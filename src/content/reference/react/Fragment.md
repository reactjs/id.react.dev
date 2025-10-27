---
title: <Fragment> (<>...</>)
---

<Intro>

<<<<<<< HEAD
`<Fragment>`, sering digunakan melalui sintaksis `<>...</>`, memungkinkan Anda mengelompokkan elemen tanpa *wrapper node*.
=======
`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node. 

<Canary> Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements. See reference and usage below.</Canary>
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<Fragment>` {/*fragment*/}

Bungkus elemen-elemen di dalam `<Fragment>` untuk mengelompokkan mereka dalam situasi di mana Anda membutuhkan satu elemen. Mengelompokkan elemen di dalam `Fragment` tidak akan mempengaruhi hasil pada DOM; elemen-elemen tersebut seolah-olah seperti tidak dikelompokkan. *Tag JSX* kosong `<></>` adalah singkatan untuk `<Fragment></Fragment>` dalam banyak kasus.

#### Props {/*props*/}

<<<<<<< HEAD
- `key` **opsional**: *Fragment* yang dideklarasikan dengan sintaksis `<Fragment>` eksplisit mungkin memiliki [`key`.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
=======
- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <CanaryBadge />  **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

When you pass a ref to a fragment, React provides a `FragmentInstance` object with methods for interacting with the DOM nodes wrapped by the fragment:

**Event handling methods:**
- `addEventListener(type, listener, options?)`: Adds an event listener to all first-level DOM children of the Fragment.
- `removeEventListener(type, listener, options?)`: Removes an event listener from all first-level DOM children of the Fragment.
- `dispatchEvent(event)`: Dispatches an event to a virtual child of the Fragment to call any added listeners and can bubble to the DOM parent.

**Layout methods:**
- `compareDocumentPosition(otherNode)`: Compares the document position of the Fragment with another node.
  - If the Fragment has children, the native `compareDocumentPosition` value is returned. 
  - Empty Fragments will attempt to compare positioning within the React tree and include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
  - Elements that have a different relationship in the React tree and DOM tree due to portaling or other insertions are `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
- `getClientRects()`: Returns a flat array of `DOMRect` objects representing the bounding rectangles of all children.
- `getRootNode()`: Returns the root node containing the Fragment's parent DOM node.

**Focus management methods:**
- `focus(options?)`: Focuses the first focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `focusLast(options?)`: Focuses the last focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `blur()`: Removes focus if `document.activeElement` is within the Fragment.

**Observer methods:**
- `observeUsing(observer)`: Starts observing the Fragment's DOM children with an IntersectionObserver or ResizeObserver.
- `unobserveUsing(observer)`: Stops observing the Fragment's DOM children with the specified observer.
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

#### Caveats {/*caveats*/}

- Jika Anda ingin mengoper `key` ke *Fragment*, Anda tidak bisa menggunakan sintaksis `<>...</>`. Anda harus secara eksplisit mengimpor `Fragment` dari `'react'` dan me-*render* `<Fragment key={yourKey}>...</Fragment>`.

- React tidak akan [mengatur ulang *state*](/learn/preserving-and-resetting-state) ketika Anda me-*render* dari  `<><Child /></>` ke `[<Child />]` atau sebaliknya, atau ketika Anda me-*render* `<><Child /></>` ke `<Child />` dan sebaliknya. Ini hanya bekerja dalam satu tingkat kedalaman: contohnya, beralih dari `<><><Child /></></>` ke `<Child />` akan mengatur ulang *state*. Lihat semantik yang lebih jelas [di sini.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

- <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

---

## Pengunaan {/*usage*/}

### Menetapkan banyak elemen {/*returning-multiple-elements*/}

Gunakan `Fragment`, atau sintaksis `<>...</>`, untuk mengelompokkan beberapa elemen menjadi satu. Anda bisa menggunakannya untuk meletakkan banyak elemen di mana saja, di mana satu elemen itu bisa muncul. Misalnya, komponen hanya bisa mengembalikan satu elemen, tetapi dengan menggunakan *Fragment*, Anda dapat mengelompokkan beberapa elemen menjadi satu dan kemudian mengembalikannya sebagai sebuah kelompok:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

*Fragment* sangat berguna karena mengelompokkan elemen dengan *Fragment* tidak akan mempengaruhi *layout* atau *style*, berbeda jika Anda membungkus elemen dalam wadah lain seperti elemen DOM. Jika Anda memeriksa contoh ini dengan peralatan yang disediakan peramban (*browser tools*), Anda akan melihat semua DOM *node* `<h1>` dan `<p>` muncul sebagai saudara (*siblings*) tanpa pembungkus di sekitar mereka:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Bagaimana menulis Fragment tanpa sintaksis spesial? {/*how-to-write-a-fragment-without-the-special-syntax*/}

Contoh di atas sama dengan mengimpor `Fragment` dari React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Biasanya Anda tidak memerlukan cara ini kecuali Anda perlu [mengoper `key` ke `Fragment` Anda.](#rendering-a-list-of-fragments)

</DeepDive>

---

### Menetapkan banyak elemen ke variabel {/*assigning-multiple-elements-to-a-variable*/}

Seperti komponen yang lain, Anda bisa menetapkan elemen *Fragment* ke variabel, dan mengoper mereka sebagai *props*, dan seterusnya:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Apakah anda yakin untuk meninggalkan halaman ini?
    </AlertDialog>
  );
}
```

---

### Mengelompokkan elemen dengan teks {/*grouping-elements-with-text*/}

Anda bisa mengunakan `Fragment` untuk mengelompokkan teks dengan komponen:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      Dari
      <DatePicker date={start} />
      ke
      <DatePicker date={end} />
    </>
  );
}
```

---

### Me-render daftar Fragment {/*rendering-a-list-of-fragments*/}

Inilah situasi di mana Anda perlu menulis `Fragment` secara eksplisit daripada menggunakan sintaksis `<></>`. Saat Anda [me-*render* beberapa elemen dalam *loop*](/learn/rendering-lists), Anda perlu menetapkan `key` untuk setiap elemen. Jika elemen dalam *loop* adalah *Fragment*, Anda perlu menggunakan sintaksis elemen *JSX* normal untuk menyediakan atribut `key`:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Anda bisa memeriksa DOM untuk memastikan bahwa tidak ada elemen pembungkus di sekitar anak-anak (*children*) *Fragment*:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'Sebuah pembaharuan', body: "Sudah lama tidak posting..." },
  { id: 2, title: 'Blog baru saya', body: 'Saya memulai blog baru!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

---

### <CanaryBadge /> Using Fragment refs for DOM interaction {/*using-fragment-refs-for-dom-interaction*/}

Fragment refs allow you to interact with the DOM nodes wrapped by a Fragment without adding extra wrapper elements. This is useful for event handling, visibility tracking, focus management, and replacing deprecated patterns like `ReactDOM.findDOMNode()`.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> Tracking visibility with Fragment refs {/*tracking-visibility-with-fragment-refs*/}

Fragment refs are useful for visibility tracking and intersection observation. This enables you to monitor when content becomes visible without requiring the child Components to expose refs:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );
    
    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

This pattern is an alternative to Effect-based visibility logging, which is an anti-pattern in most cases. Relying on Effects alone does not guarantee that the rendered Component is observable by the user.

---

### <CanaryBadge /> Focus management with Fragment refs {/*focus-management-with-fragment-refs*/}

Fragment refs provide focus management methods that work across all DOM nodes within the Fragment:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

The `focus()` method focuses the first focusable element within the Fragment, while `focusLast()` focuses the last focusable element.
