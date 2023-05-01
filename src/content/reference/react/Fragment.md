---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, sering digunakan melalui sintaksis `<>...</>`, memungkinkan Anda mengelompokkan elemen tanpa (*wrapper*) *node*.

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

Bungkus elemen di dalam `<Fragment>` untuk mengelompokkan elemen di situasi dimana Anda membutuhkan satu elemen. Mengelompokkan elemen di dalam `Fragment` tidak akan mempengaruhi hasil pada DOM; Hal ini sama dengan tidak mengelompokkan elemen. *Tag JSX* kosong `<></>` adalah singkatan untuk `<Fragment></Fragment>` dalam banyak kasus.

#### Props {/*props*/}

- `key` **opsional**: *Fragment* yang dideklarasi dengan eksplisit sintaksis `<Fragment>` mungkin memiliki [`key`.](/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### Caveats {/*caveats*/}

- Jika Anda ingin mengoper `key` ke *Fragment*, Anda tidak bisa menggunakan sintaksis `<>...</>`. Anda harus secara eksplisit mengimpor `Fragment` dari `'react'` dan me-*render* `<Fragment key={yourKey}>...</Fragment>`.

- React tidak akan [mengatur ulang *state*](/learn/preserving-and-resetting-state) ketika Anda me-*render* dari  `<><Child /></>` ke `[<Child />]` atau sebaliknya, atau ketika Anda merender `<><Child /></>` ke `<Child />` dan sebaliknya. Ini hanya bekerja dalam satu tingkat saja: contohnya, beralih dari `<><><Child /></></>` ke `<Child />` akan mengatur ulang *state*. Lihat semantik yang lebih jelas [disini.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

---

## Pengunaan {/*usage*/}

### Mengembalikan banyak elemen {/*returning-multiple-elements*/}

Gunakan `Fragment`, atau sintaksis `<>...</>`, untuk mengelompokkan beberapa elemen menjadi satu. Anda bisa menggunakannya untuk meletakkan banyak elemen dimana saja, dimana satu elemen itu bisa muncul. Misalnya, komponen hanya bisa mengembalikan satu elemen, tetapi dengan menggunakan *Fragment*, Anda dapat mengelompokkan beberapa elemen menjadi satu dan kemudian mengembalikannya sebagai grup:

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

_Fragment_ sangat berguna karena mengelompokkan elemen dengan _Fragment_ tidak akan mempengaruhi *layout* atau *style*, berbeda jika Anda membungkus elemen dalam wadah lain seperti elemen DOM. Jika Anda memeriksa contoh ini dengan alat *browser*, Anda akan melihat semua DOM *node* `<h1>` dan `<p>` muncul sebagai saudara tanpa pembungkus di sekitar mereka:

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

#### Bagaimana menulis *Fragment* tanpa spesial sintaksis? {/*how-to-write-a-fragment-without-the-special-syntax*/}

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

### Menentukan banyak elemen ke variabel {/*assigning-multiple-elements-to-a-variable*/}

Seperti komponen yang lain, Anda bisa menentukan elemen *Fragment* ke variabel, dan mengoper mereka sebagai *props*, dan seterusnya:

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
      Ke
      <DatePicker date={end} />
    </>
  );
}
```

---

### Me-*render* daftar *Fragment* {/*rendering-a-list-of-fragments*/}

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

Anda bisa memeriksa DOM untuk memastikan bahwa tidak ada elemen pembungkus di sekitar anak *Fragment*:

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
