---
title: Mengoper Data Secara Mendalam dengan Context
---

<Intro>

Biasanya, Anda akan mengoper informasi dari komponen induk ke komponen anak melalui *props*. Tapi mengoper *props* bisa menjadi bertele-tele dan merepotkan jika Anda harus mengopernya melalui banyak komponen di tengah-tengah, atau jika banyak komponen di aplikasi Anda membutuhkan informasi yang sama. *Context* memungkinkan komponen induk untuk membuat beberapa informasi tersedia di komponen lain di pohon (*tree*) di bawahnya—tidak peduli seberapa dalam—tanpa mengopernya secara eksplisit melalui *props*.

</Intro>

<YouWillLearn>

- Apa itu "*prop drilling*" 
- Bagaimana cara mengganti pengiriman *props* yang berulang dengan *context*
- Kasus umum untuk penggunaan *context* 
- Alternatif umum untuk *context*

</YouWillLearn>

## Masalah ketika mengoper props {/*the-problem-with-passing-props*/}

[Mengoper *props*](/learn/passing-props-to-a-component) adalah cara yang bagus untuk menyalurkan data secara eksplisit melalui pohon (*tree*) UI Anda ke komponen yang menggunakanya.

Tapi mengoper *props* bisa menjadi bertele-tele dan tidak nyaman ketika Anda perlu mengoper beberapa *prop* secara mendalam melalui pohon (*tree*), atau jika banyak komponen membutuhkan *prop* yang sama. Leluhur umum terdekat bisa jadi jauh dari komponen yang membutuhkan data, dan [memindahkan *state* ke atas](/learn/sharing-state-between-components) dapat menyebabkan yang disebut "*prop drilling*".

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in purple. The value flows down to each of the two children, both highlighted in purple." >

Memindahkan *state* ke atas

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root node contains a bubble representing a value highlighted in purple. The value flows down through the two children, each of which pass the value but do not contain it. The left child passes the value down to two children which are both highlighted purple. The right child of the root passes the value through to one of its two children - the right one, which is highlighted purple. That child passed the value through its single child, which passes it down to both of its two children, which are highlighted purple.">

Prop drilling

</Diagram>

</DiagramGroup>

Bukankah lebih bagus jika ada cara untuk "memindahkan" data ke komponen di dalam pohon (*tree*) yang membutuhkannya tanpa harus mengoper *props*? Dengan fitur *context* React, ternyata ada!

## *Context*: sebuah alternatif untuk mengoper *props* {/*context-an-alternative-to-passing-props*/}

*Context* memungkinkan sebuah komponen induk menyediakan data untuk seluruh pohon (*tree*) di bawahnya. Ada banyak kegunaan dari *context*. Berikut ini salah satu contohnya. Perhatikan komponen `Heading` ini yang menerima `level` untuk ukurannya:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Judul</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Katakanlah Anda ingin beberapa judul dalam `Section` yang sama selalu memiliki ukuran yang sama:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Saat ini, Anda mengoper `level` *props* ke tiap `<Heading>` secara terpisah:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

Akan lebih baik jika Anda dapat mengoper *prop* `level` ke komponen `<Section>` dan menghapusnya dari komponen `<Heading>` Dengan cara ini Anda dapat menerapkan bahwa semua judul di bagian yang sama memiliki ukuran yang sama:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

Tapi bagaimana komponen `<Heading>` dapat mengetahui level `<Section>` yang terdekat? **Hal ini akan membutuhkan suatu cara untuk "meminta" data dari suatu tempat di atas pohon (_tree_).**

Anda tidak bisa melakukannya dengan *props* sendirian. Di sinilah *context* berperan penting. Anda akan melakukannya dalam tiga langkah:

1. **Buat** sebuah *context*. (Anda dapat menamainya `LevelContext`, karena ini untuk level judul.)
2. **Gunakan** *context* tersebut dari komponen yang membutuhkan data. (`Heading` akan menggunakan `LevelContext`.)
3. **Sediakan** *context* tersebut dari komponen yang menentukan data. (`Section` akan menyediakan `LevelContext`.)

*Context* memungkinkan sebuah induk--bahkan yang jauh sekalipun!--menyediakan beberapa data kepada seluruh komponen pohon (*tree*) di dalamnya.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in orange which projects down to the two children, each highlighted in orange." >

Menggunakan *context* di *children* terdekat

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root parent node contains a bubble representing a value highlighted in orange. The value projects down directly to four leaves and one intermediate component in the tree, which are all highlighted in orange. None of the other intermediate components are highlighted.">

Menggunakan *context* di *children* yang jauh

</Diagram>

</DiagramGroup>

### Langkah 1: Buat *context* {/*step-1-create-the-context*/}

Pertama, Anda perlu membuat *context*. Anda harus **mengekspornya dari sebuah file** sehingga komponen Anda dapat menggunakannya:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Judul</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Satu-satunya argumen untuk `createContext` adalah nilai *default*. Disini, `1` merujuk pada level *heading* terbesar, tapi Anda dapat mengoper nilai apa pun (bahkan sebuah objek). Anda akan melihat pentingnya nilai *default* di langkah selanjutnya.

### Langkah 2: Gunakan *context* {/*step-2-use-the-context*/}

Impor `useContext` *Hook* dari React dan *context* Anda:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Saat ini, komponen `Heading` membaca `level` dari *props*:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Sebagai gantinya, hapus *prop* `level` dan baca nilai dari *context* yang baru saja Anda impor, `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` adalah sebuah *Hook*. Sama seperti `useState` dan `useReducer`, Anda hanya dapat memanggil sebuah *Hook* secara langsung di dalam komponen React (bukan di dalam pengulangan atau pengkondisian). **`useContext` memberitahu React bahwa komponen `Heading` mau membaca `LevelContext`.**

Sekarang komponen `Heading` tidak membutuhkan sebuah prop `level`, Anda tidak perlu mengoper level *prop* ke `Heading` di JSX Anda seperti ini lagi:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

Sebagai gantinya Perbarui JSX sehingga `Section` yang dapat menerimanya:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

Sebagai pengingat, ini adalah markup yang sedang Anda coba untuk bekerja:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Judul</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Perhatikan contoh ini masih belum berfungsi dengan baik! Semua judul memiliki ukuran yang sama karena **meskipun Anda *menggunakan* *context*, Anda belum *menyediakannya*.** React tidak tahu darimana untuk mendapatkannya!

Jika Anda tidak menyediakan *context*, React akan menggunakan nilai *default* yang sudah Anda tentukan di langkah sebelumnya. Di contoh ini, Anda menentukan `1` sebagai argumen `createContext`, jadi `useContext(LevelContext)` mengembalikan `1`, mengatur semua *headings* ke `<h1>`. Ayo kita perbaiki masalah ini dengan membuat setiap `Section` menyediakan *context*-nya sendiri.

### Langkah 3: Sediakan *context* {/*step-3-provide-the-context*/}

Komponen `Section` saat ini me*renders* anaknya:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Bungkus mereka semua dengan sebuah _context provider_** untuk menyediakan `LevelContext` kepada mereka:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

<<<<<<< HEAD
Ini memberitahu React: "jika ada komponen di dalam `<Section>` ini yang meminta `LevelContext`, berikan `level` ini." Komponen akan menggunakan nilai dari `<LevelContext.Provider>` terdekat di pohon UI (*tree*) di atasnya.
=======
This tells React: "if any component inside this `<Section>` asks for `LevelContext`, give them this `level`." The component will use the value of the nearest `<LevelContext>` in the UI tree above it.
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Judul</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Hasilnya sama dengan kode aslinya, tapi Anda tidak perlu mengoper *prop* `level` ke setiap komponen `Heading`! Sebagai gantinya, ia "mencari tahu" *level heading*-nya dengan meminta `Section` terdekat di atasnya:

<<<<<<< HEAD
1. Anda mengoper *prop* `level` ke `<Section>`.
2. `Section` membungkus anaknya dengan `<LevelContext.Provider value={level}>`.
3. `Heading` meminta nilai terdekat dari `LevelContext` di atasnya dengan `useContext(LevelContext)`.
=======
1. You pass a `level` prop to the `<Section>`.
2. `Section` wraps its children into `<LevelContext value={level}>`.
3. `Heading` asks the closest value of `LevelContext` above with `useContext(LevelContext)`.
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

## Menggunakan dan menyediakan *context* dari komponen yang sama {/*using-and-providing-context-from-the-same-component*/}

Saat ini, Anda masih harus menentukan setiap `level` *section's* secara manual:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Karena *context* memungkinan Anda membaca informasi dari komponen di atasnya, setiap `Section` dapat membaca `level` dari `Section` di atasnya, dan mengoper `level + 1` ke bawah secara otomatis. Berikut adalah bagaimana Anda dapat melakukannya:

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

Dengan perubahan ini, Anda tidak perlu mengoper *prop* `level` baik ke `<Section>` atau ke `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Judul</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Sekarang keduanya `Heading` dan `Section` membaca `LevelContext` untuk mencari tahu seberapa "dalam" mereka. Dan `Section` membungkus anaknya ke dalam `LevelContext` untuk menentukan bahwa apa pun yang ada di dalamnya berada pada *level* yang "lebih dalam".

<Note>

Contoh ini menggunakan *heading levels* karena mereka menunjukkan secara visual bagaimana komponen bersarang dapat menimpa *context*. Tapi *context* juga berguna untuk banyak kasus penggunaan lainnya. Anda dapat mengoper ke bawah informasi apa pun yang dibutuhkan oleh seluruh *sub*-pohon (*tree*): tema warna saat ini, pengguna yang sedang masuk, dan seterusnya.

</Note>

## *Context* melewati komponen perantara {/*context-passes-through-intermediate-components*/}

Anda dapat menyisipkan sebanyak mungkin komponen di antara komponen yang menyediakan *context* dan komponen yang menggunakannya. Ini termasuk komponen bawaan seperti `<div>` dan komponen yang mungkin Anda buat sendiri.

Di contoh berikut, komponen `Post` yang sama (dengan batas putus-putus) diberikan pada dua tingkat sarang yang berbeda. Perhatikan bahwa `<Heading>` di dalamnya mendapatkan *level*-nya secara otomatis dari `<Section>` terdekat:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>Profil Saya</Heading>
      <Post
        title="Hello traveller!"
        body="Baca tentang petualangan Saya."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Posting Terbaru</Heading>
      <Post
        title="Cita Rasa Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires dalam irama tango"
        body="Saya menyukainya!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

Anda tidak perlu melakukan sesuatu yang khusus untuk pekerjaan ini. `Section` menentukan *context* untuk pohon (*tree*) di dalamnya, jadi Anda dapat menyisipkan `<Heading>` di mana saja, dan akan memiliki ukuran yang benar. Cobalah di kotak pasir di atas!

**_Context_ memungkinkan Anda untuk menulis komponen yang "beradaptasi dengan sekitar mereka" dan menampilkan diri mereka secara berbeda tergantung di mana (atau, dalam kata lain, _dalam context apa_) mereka akan diberikan.**

Cara kerja *context* mungkin mengingatkan Anda pada [pewarisan properti CSS.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) Pada CSS, Anda dapat menentukan `color: blue` untuk `<div>`, dan simpul DOM apa pun di dalamnya, tidak peduli seberapa dalam, akan mewarisi warna tersebut kecuali ada simpul DOM lain di tengahnya yang menimpanya dengan `color: green`. Demikian pula, dalam React, satu-satunya cara untuk menimpa beberapa *context* yang berasal dari atas adalah dengan membungkus anaknya ke dalam penyedia *context* dengan nilai yang berbeda.

Pada CSS, properti berbeda seperti `color` dan `background-color` tidak akan menimpa satu sama lain. Anda dapat mengatur semua `color` `<div>`  ke merah tanpa berdampak pada `background-color`. Demikian pula, **React contexts yang berbeda tidak akan menimpa satu sama lain.** Tiap *context* yang Anda buat dengan `createContext()` benar-benar terpisah dari yang lain, dan menyatukan komponen-komponen yang menggunakan dan menyediakan context *tertentu*. Satu komponen dapat menggunakan atau menyediakan banyak konteks yang berbeda tanpa masalah.

## Sebelum Anda menggunakan *context* {/*before-you-use-context*/}

*Context* sangat menggoda untuk digunakan! Namun, ini juga terlalu mudah untuk menggunakannya secara berlebihan. **Hanya karena Anda membutuhkan untuk mengoper beberapa _props_ beberapa tingkat lebih dalam bukan berarti Anda memasukkan informasi tersebut ke dalam _context_.**

Ini adalah beberapa alternatif yang harus Anda pertimbangkan sebelum menggunakan *context*:

1. **Mulai dengan [mengoper *props*.](/learn/passing-props-to-a-component)** Jika komponen Anda tidak sepele, bukan hal yang aneh jika Anda mengoper selusin *props* melalui selusin komponen. Ini mungkin terasa seperti pekerjaan berat, tapi membuatnya sangat jelas komponen yang mana menggunakan data yang mana! Orang yang mengelola kode Anda akan senang Anda telah membuat aliran data eksplisit dengan *props*.
2. **Ekstrak komponen dan [oper JSX sebagai `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) ke mereka.** Jika Anda mengoper beberapa data melewati banyak lapisan komponen perantara yang tidak menggunakan data tersebut (dan hanya mengopernya lebih jauh ke bawah), ini sering kali Anda lupa mengekstrak beberapa komponen di sepanjang jalan. Contohnya, mungkin Anda mengoper data *props* seperti `posts` ke komponen visual yang tidak menggunakannya secara langsung, seperti `<Layout posts={posts} />`. Sebagai gantinya, buat `Layout` mengambil `children` sebagai *prop*, dan berikan `<Layout><Posts posts={posts} /></Layout>`. Hal ini mengurangi jumlah lapisan antara komponen yang menentukan data dan komponen yang membutuhkannya.

Jika tidak satu pun dari pendekatan ini yang cocok untuk Anda, pertimbangkan *context*.

## Kasus penggunakan untuk *context* {/*use-cases-for-context*/}

* **Tema:** Jika aplikasi Anda memungkinkan pengguna mengganti penampilannya (misalnya mode gelap), Anda dapat menempatkan penyedia *context* di paling atas aplikasi Anda, dan menggunakan konteksnya di komponen yang membutuhkan  untuk menyesuaikan tampilan visual mereka.
* **Akun saat ini:** Banyak komponen yang mungkin perlu mengetahui pengguna yang sedang masuk. Menempatkannya dalam konteks akan memudahkan untuk membacanya di mana saja di dalam pohon (*tree*). Beberapa aplikasi memungkinkan Anda mengoperasikan beberapa akun pada saat yang sama (misalnya untuk memberikan komentar sebagai pengguna yang berbeda). Dalam kasus tersebut, akan lebih mudah untuk membungkus bagian dari UI ke dalam penyedia bersarang dengan nilai akun saat ini yang berbeda.
* **Routing:** Sebagian besar solusi *routing* menggunakan *context* secara internal untuk menyimpan rute saat ini. Dengan cara inilah setiap link "mengetahui" apakah ia aktif atau tidak. Jika Anda membuat *router* anda sendiri, Anda mungkin ingin melakukannya juga.
* **Mengelola _state_:** Seiring pertumbuhan aplikasi Anda, Anda mungkin akan menempatkan banyak *state* yang lebih dekat ke bagian atas aplikasi Anda. Banyak komponen yang jauh di bawahnya mungkin ingin untuk mengubahnya. Ini adalah hal yang umum untuk [menggunakan reducer bersama dengan *context*](/learn/scaling-up-with-reducer-and-context) untuk mengelola *state* yang kompleks dan mengopernya ke komponen yang jauh ke bawah tanpa terlalu banyak kerumitan.
  
*Context* tidak terbatas pada nilai statis. Jika anda memberikan nilai yang berbeda pada render berikutnya, React akan memperbarui semua komponen yang membacanya di bawahnya! Inilah sebabnya mengapa *context* sering digunakan bersama degan *state*.

Pada umumnya, jika beberapa informasi dibutuhkan oleh komponen yang jauh di beberapa bagian pohon (*tree*), ini adalah indikasi yang bagus bahwa *context* akan membantu Anda.

<Recap>

<<<<<<< HEAD
* *Context* memungkinkan komponen menyediakan beberapa informasi ke keseluruhan pohon (*tree*) di bawahnya.
* Untuk mengoper *context*:
  1. Buat dan ekspor ia dengan `export const MyContext = createContext(defaultValue)`.
  2. Oper ke `useContext(MyContext)` *Hook* untuk membacanya di komponen anak manapun, tidak peduli seberapa dalam.
  3. Bungkus anak ke `<MyContext.Provider value={...}>` untuk menyediakannya dari induk.
* *Context* melewati komponen apa pun di tengahnya.
* *Context* memungkinkan Anda menulis komponen yang "beradaptasi dengan sekitar mereke".
* Sebelum Anda menggunakan *context*, coba oper *props* atau oper JSX sebagai `children`.
=======
* Context lets a component provide some information to the entire tree below it.
* To pass context:
  1. Create and export it with `export const MyContext = createContext(defaultValue)`.
  2. Pass it to the `useContext(MyContext)` Hook to read it in any child component, no matter how deep.
  3. Wrap children into `<MyContext value={...}>` to provide it from a parent.
* Context passes through any components in the middle.
* Context lets you write components that "adapt to their surroundings".
* Before you use context, try passing props or passing JSX as `children`.
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

</Recap>

<Challenges>

#### Ganti *prop drilling* dengan *context* {/*replace-prop-drilling-with-context*/}

Pada contoh ini, mengganti checkbox akan mengubah `imageSize` *prop* yang diteruskan ke setiap `<PlaceImage>`. checkbox *state* akan disimpan di komponen paling atas komponen `App`, tapi tiap `<PlaceImage>` harus menyadarinya.

Saat ini, `App` mengoper `imageSize` ke `List`, yang mana mengopernya ke tiap `Place`, yang mana mengopernya ke tiap `PlaceImage`. Hapus *prop* `imageSize`, dan sebagai gantinya oper ia dari komponen `App` ke `PlaceImage` secara langsung.

Anda dapat deklarasi *context* di `Context.js`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Menggunakan gambar besar
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap di Cape Town, Afrika Selatan',
  description: 'Tradisi memilih warna-warna cerah untuk rumah dimulai pada akhir abad ke-20.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Desa Pelangi di Taichung, Taiwan',
  description: 'Untuk menyelamatkan rumah-rumah tersebut dari pembongkaran, Huang Yung-Fu, seorang penduduk setempat, mengecat 1.200 rumah tersebut pada tahun 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Meksiko',
  description: 'Salah satu mural terbesar di dunia yang menutupi rumah-rumah di lingkungan lereng bukit.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase di Rio de Janeiro, Brasil',
  description: 'Tengara ini diciptakan oleh Jorge Selarón, seorang seniman kelahiran Chili, sebagai "penghormatan kepada rakyat Brasil."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'Rumah-rumahnya dicat mengikuti sistem warna tertentu yang berasal dari abad ke-16.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Maroko',
  description: 'Ada beberapa teori mengapa rumah-rumah dicat biru, termasuk bahwa warna tersebut dapat mengusir nyamuk atau melambangkan langit dan surga.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Desa Budaya Gamcheon di Busan, Korea Selatan',
  description: 'Pada tahun 2009, desa ini diubah menjadi pusat budaya dengan mengecat rumah-rumah dan menampilkan pameran dan instalasi seni.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

Hapus prop `imageSize` dari semua komponen.

<<<<<<< HEAD
Buat dan ekspor `ImageSizeContext` dari `Context.js`. Lalu bungkus List ke `<ImageSizeContext.Provider value={imageSize}>` untuk mengoper nilai ke bawah, dan `useContext(ImageSizeContext)` untuk membacanya di `PlaceImage`:
=======
Create and export `ImageSizeContext` from `Context.js`. Then wrap the List into `<ImageSizeContext value={imageSize}>` to pass the value down, and `useContext(ImageSizeContext)` to read it in the `PlaceImage`:
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Menggunakan gambar besar
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap di Cape Town, Afrika Selatan',
  description: 'Tradisi memilih warna-warna cerah untuk rumah dimulai pada akhir abad ke-20.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Desa Pelangi di Taichung, Taiwan',
  description: 'Untuk menyelamatkan rumah-rumah tersebut dari pembongkaran, Huang Yung-Fu, seorang penduduk setempat, mengecat 1.200 rumah tersebut pada tahun 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Meksiko',
  description: 'Salah satu mural terbesar di dunia yang menutupi rumah-rumah di lingkungan lereng bukit.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase di Rio de Janeiro, Brasil',
  description: 'Tengara ini diciptakan oleh Jorge Selarón, seorang seniman kelahiran Chili, sebagai "penghormatan kepada rakyat Brasil."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'Rumah-rumahnya dicat mengikuti sistem warna tertentu yang berasal dari abad ke-16.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Maroko',
  description: 'Ada beberapa teori mengapa rumah-rumah dicat biru, termasuk bahwa warna tersebut dapat mengusir nyamuk atau melambangkan langit dan surga.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Desa Budaya Gamcheon di Busan, Korea Selatan',
  description: 'Pada tahun 2009, desa ini diubah menjadi pusat budaya dengan mengecat rumah-rumah dan menampilkan pameran dan instalasi seni.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

Perhatikan bagaimana komponen di tengah tidak perlu lagi mengoper `imageSize`.

</Solution>

</Challenges>
