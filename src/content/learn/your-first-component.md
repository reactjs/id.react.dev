---
title: Komponen Pertama Anda
---

<Intro>

Komponen merupakan salah satu konsep inti dari React. Komponen adalah fondasi di mana anda bangun antarmuka pengguna (UI), yang membuat komponen tempat yang sempurna untuk memulai perjalan React anda!

</Intro>

<YouWillLearn>

* Apa itu komponen
* Apa tugas yang dimainkan oleh komponen di dalam aplikasi React
* Bagaimana cara menulis komponen React pertama anda

</YouWillLearn>

## Komponen: Pembangun Balok UI {/*components-ui-building-blocks*/}

Di dalam *web*, HTML memungkinkan kita membuat dokumen-dokumen terstruktur yang kaya dengan kumpulan *tag* *built-in*-nya seperti `<h1>` dan `<li>`:

```html
<article>
  <h1>Komponen Pertama Saya</h1>
  <ol>
    <li>Komponen: Pembangun Balok UI</li>
    <li>Mendefinisikan sebuah Komponen</li>
    <li>Menggunakan sebuah Komponen</li>
  </ol>
</article>
```

*Markup* ini merepresentasikan artikel `<article>`, heading `<h1>` dan daftar isi (yang disingkat) sebagai daftar yang tersusun `<ol>`. *Markup* seperti ini, digabung dengan CSS untuk *style*, dan *Javascript* untuk interaktivitas, berada di belakang setiap *sidebar*, *avatar*, *modal*, *dropdown*—setiap potongan UI anda liat di dalam web.

React memungkinkan anda menggabung *markup*, CSS, dan *Javascript* anda menjadi "komponen" *custom*, **elemen UI yang dapat digunakan kembali untuk aplikasi anda.** Daftar isi yang anda lihat diatas dapat diubah menjadi sebuah komponen `<TableOfContents />` yang dapat kamu *render* di setiap halaman. *Under the hood*, itu tetap menggunakan *tag* HTML yang sama seperti `<article>`, `h1`, dll.

Sama seperti *tag* HTMl, anda dapat menggabung, mengurut, dan menyusun bertingkat komponen untuk mendesain halaman penuh. Contohnya, halaman dokumentasi ini yang anda baca terbuat oleh komponen React: 

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Seiring berkembangnya proyek anda, anda akan memperhatikan bahwa banyak desain anda bisa dikomposisi dengan menggunakan ulang komponen yang sudah anda buat, mempercepatkan *development* anda. Daftar isi kami diatas bisa disertakan pada layar apapun denagn `<TableOfContents />`! Anda bisa *jumpstart* projek anda dengan ribuan komponen yang dibagi oleh komunitas *open source* React seperti [Chakra UI](https://chakra-ui.com/) dan [Material UI.](https://material-ui.com/)

## Mendefinisikan sebuah Komponen {/*defining-a-component*/}

Secara tradisional saat menciptakan halaman *web*, para *web developer* *marked up* konten mereka kemudian menambahkan interaksi dengan menambahkan sedikit *Javascript*. Ini bekerja dengan baik ketika interaksi hanya menyenangkan-untuk-dimiliki di dalam *web*. Sekarang ini diharapkan banyak situs dan semua aplikasi. React mengutamakan interaktivitas dengan tetap menggunakan teknologi yang sama: **Komponen React adalah _function Javascript_ yang dapat anda _sirami dengan markup_.** Inilah tampilannya (anda bisa sunting contoh dibawah):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Dan ini bagaimana cara membuat komponen:

### Langkah 1: Ekspor komponen {/*step-1-export-the-component*/}

*prefix* `export default` adalah sebuah [sintaksis *Javascript* standar](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (tidak spesifik kepada React). Itu memungkinkan anda menandai fungsi utama di sebuah file supaya anda bisa import itu dari *files* lain nanti. (Lebih lanjut tentang mengimport di [Mengimport dan Mengeksport Komponen](/learn/importing-and-exporting-components)!)

### Langkah 2: Definisikan fungsi {/*step-2-define-the-function*/}

Dengan `function Profile() { }` anda mendefinisikan fungsi *Javascript* dengan nama `Profile`.

<Pitfall>

Componen React adalah fungsi-fungsi *Javascript* biasa, tetapi **nama mereka harus dimulai dengan huruf kapital** atau tidak akan berfungsi!

</Pitfall>

### Langkah 3: Tambahkan *markup* {/*step-3-add-markup*/}

Komponen itu mengembalikan tag `<img />` dengan attribut `src` dan `alt`. `<img />` ditulis seperti HTML, tetapi ini sebenarngan *Javascript* *under the hood*! Sintaksis ini disebut [JSX](/learn/writing-markup-with-jsx), dan ini memungkinkan anda untuk *embed* *markup* didalam *Javascript*.

Pernyataan-pernyataan yang dikembalikan bisa ditulis semua dalam satu baris, seperti dalam komponen ini.

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

But if your markup isn't all on the same line as the `return` keyword, you must wrap it in a pair of parentheses:
Tetapi jika *markup* anda tidak semua ada di baris yang sama seperti *keyword* `return`, anda harus membungkus itu dalam tanda kurung:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

Tanpa tanda kurung, kode apapun di baris-baris setelah `return` [akan diabaikan](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Menggunakan komponen {/*using-a-component*/}

  Sekarang setelah anda mendefinisikan komponen `Profile` anda, anda bisa mengsarangi itu di dalam komponen-komponen lain. Misalnya, anda bisa eksport sebuah komponen `Gallery` yang menggunakan beberapa komponen `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### What the browser sees {/*what-the-browser-sees*/}

Notice the difference in casing:

* `<section>` is lowercase, so React knows we refer to an HTML tag.
* `<Profile />` starts with a capital `P`, so React knows that we want to use our component called `Profile`.

And `Profile` contains even more HTML: `<img />`. In the end, this is what the browser sees:

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Nesting and organizing components {/*nesting-and-organizing-components*/}

Components are regular JavaScript functions, so you can keep multiple components in the same file. This is convenient when components are relatively small or tightly related to each other. If this file gets crowded, you can always move `Profile` to a separate file. You will learn how to do this shortly on the [page about imports.](/learn/importing-and-exporting-components)

Because the `Profile` components are rendered inside `Gallery`—even several times!—we can say that `Gallery` is a **parent component,** rendering each `Profile` as a "child". This is part of the magic of React: you can define a component once, and then use it in as many places and as many times as you like.

<Pitfall>

Components can render other components, but **you must never nest their definitions:**

```js {2-5}
export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```

The snippet above is [very slow and causes bugs.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Instead, define every component at the top level:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```

When a child component needs some data from a parent, [pass it by props](/learn/passing-props-to-a-component) instead of nesting definitions.

</Pitfall>

<DeepDive>

#### Components all the way down {/*components-all-the-way-down*/}

Your React application begins at a "root" component. Usually, it is created automatically when you start a new project. For example, if you use [CodeSandbox](https://codesandbox.io/) or [Create React App](https://create-react-app.dev/), the root component is defined in `src/App.js`. If you use the framework [Next.js](https://nextjs.org/), the root component is defined in `pages/index.js`. In these examples, you've been exporting root components.

Most React apps use components all the way down. This means that you won't only use components for reusable pieces like buttons, but also for larger pieces like sidebars, lists, and ultimately, complete pages! Components are a handy way to organize UI code and markup, even if some of them are only used once.

[React-based frameworks](/learn/start-a-new-react-project) take this a Langkah further. Instead of using an empty HTML file and letting React "take over" managing the page with JavaScript, they *also* generate the HTML automatically from your React components. This allows your app to show some content before the JavaScript code loads.

Still, many websites only use React to [add interactivity to existing HTML pages.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) They have many root components instead of a single one for the entire page. You can use as much—or as little—React as you need.

</DeepDive>

<Recap>

You've just gotten your first taste of React! Let's recap some key points.

* React lets you create components, **reusable UI elements for your app.**
* In a React app, every piece of UI is a component.
* React components are regular JavaScript functions except:

  1. Their names always begin with a capital letter.
  2. They return JSX markup.

</Recap>



<Challenges>

#### Export the component {/*export-the-component*/}

This sandbox doesn't work because the root component is not exported:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Try to fix it yourself before looking at the solution!

<Solution>

Add `export default` before the function definition like so:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

You might be wondering why writing `export` alone is not enough to fix this example. You can learn the difference between `export` and `export default` in [Importing and Exporting Components.](/learn/importing-and-exporting-components)

</Solution>

#### Fix the return statement {/*fix-the-return-statement*/}

Something isn't right about this `return` statement. Can you fix it?

<Hint>

You may get an "Unexpected token" error while trying to fix this. In that case, check that the semicolon appears *after* the closing parenthesis. Leaving a semicolon inside `return ( )` will cause an error.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

You can fix this component by moving the return statement to one line like so:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Or by wrapping the returned JSX markup in parentheses that open right after `return`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Spot the mistake {/*spot-the-mistake*/}

Something's wrong with how the `Profile` component is declared and used. Can you spot the mistake? (Try to remember how React distinguishes components from the regular HTML tags!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

React component names must start with a capital letter.

Change `function profile()` to `function Profile()`, and then change every `<profile />` to `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### Your own component {/*your-own-component*/}

Write a component from scratch. You can give it any valid name and return any markup. If you're out of ideas, you can write a `Congratulations` component that shows `<h1>Good job!</h1>`. Don't forget to export it!

<Sandpack>

```js
// Write your component below!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
