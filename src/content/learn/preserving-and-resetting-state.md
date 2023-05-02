---
title: Mempertahankan dan Mengatur Ulang State
---

<Intro>

*State* diisolasi antar komponen. React melacak *state* mana yang dimiliki oleh komponen mana berdasarkan tempatnya di pohon antarmuka pengguna (UI). Anda dapat mengontrol kapan harus mempertahankan *state* dan kapan harus mengatur ulang di antara render ulang (re-*render*).

</Intro>

<YouWillLearn>

* Bagaimana React "melihat" struktur komponen
* Kapan React memilih untuk mempertahankan atau mengatur ulang *state*
* Bagaimana cara memaksa React untuk mengatur ulang *state* komponen
* Bagaimana *keys* dan *types* mempengaruhi apakah *state* dipertahankan

</YouWillLearn>

## Pohon antarmuka pengguna (UI) {/*the-ui-tree*/}

Peramban menggunakan banyak struktur pohon untuk memodelkan antarmuka pengguna (UI). [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) mewakili elemen HTML, [CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model) melakukan hal yang sama untuk CSS. Bahkan ada [Pohon aksesibilitas](https://developer.mozilla.org/docs/Glossary/Accessibility_tree)!

React juga menggunakan struktur pohon untuk mengelola dan memodelkan UI yang Anda buat. React membuat **pohon UI** dari JSX Anda. Kemudian React DOM memperbarui elemen-elemen DOM peramban agar sesuai dengan pohon UI tersebut (React Native menerjemahkan pohon-pohon tersebut menjadi elemen-elemen yang spesifik untuk platform *mobile*).

<DiagramGroup>

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram with three sections arranged horizontally. In the first section, there are three rectangles stacked vertically, with labels 'Component A', 'Component B', and 'Component C'. Transitioning to the next pane is an arrow with the React logo on top labeled 'React'. The middle section contains a tree of components, with the root labeled 'A' and two children labeled 'B' and 'C'. The next section is again transitioned using an arrow with the React logo on top labeled 'React'. The third and final section is a wireframe of a browser, containing a tree of 8 nodes, which has only a subset highlighted (indicating the subtree from the middle section).">

Dari komponen, React membuat pohon UI yang digunakan React DOM untuk me*render* DOM

</Diagram>

</DiagramGroup>

## *State* terikat dengan posisi di dalam pohon {/*state-is-tied-to-a-position-in-the-tree*/}

Ketika Anda memberikan *state* pada sebuah komponen, Anda mungkin berpikir bahwa state tersebut "hidup" di dalam komponen. Tetapi *state* sebenarnya disimpan di dalam React. React mengasosiasikan setiap bagian dari *state* yang dipegangnya dengan komponen yang benar berdasarkan posisi komponen tersebut di dalam pohon UI.


Di sini, hanya ada satu tag JSX `<Counter />`, tetapi tag tersebut dirender pada dua posisi yang berbeda:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Beginilah tampilannya sebagai pohon:

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. Each of the children are labeled 'Counter' and both contain a state bubble labeled 'count' with value 0.">

Pohon React

</Diagram>

</DiagramGroup>

**Ini adalah dua penghitung yang terpisah karena masing-masing di-*render* pada posisinya sendiri di dalam pohon.** Anda biasanya tidak perlu memikirkan posisi-posisi ini untuk menggunakan React, tetapi akan sangat berguna untuk memahami cara kerjanya.

Dalam React, setiap komponen pada layar memiliki *state* yang terisolasi sepenuhnya. Sebagai contoh, jika Anda me-*render* dua komponen `Counter` secara berdampingan, masing-masing komponen akan mendapatkan *state*-nya sendiri-sendiri, independen, yaitu state `score` dan `hover`.

Coba klik kedua penghitung dan perhatikan bahwa keduanya tidak saling mempengaruhi:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Seperti yang dapat Anda lihat, ketika satu penghitung diperbarui, hanya *state* untuk komponen tersebut yang diperbarui:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 1. The state bubble of the right child is highlighted in yellow to indicate its value has updated.">

Memperbarui *state*

</Diagram>

</DiagramGroup>


React akan mempertahankan *state* selama Anda me-*render* komponen yang sama pada posisi yang sama. Untuk melihat hal ini, naikkan kedua penghitung, lalu hapus komponen kedua dengan menghapus centang pada *checkbox* "Render the second counter", lalu tambahkan kembali dengan mencentangnya lagi:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Perhatikan bagaimana saat Anda berhenti me-*render* penghitung kedua, *state*-nya akan hilang sepenuhnya. Hal ini dikarenakan ketika React menghapus sebuah komponen, ia akan menghancurkan *state*-nya.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is missing, and in its place is a yellow 'poof' image, highlighting the component being deleted from the tree.">

Menghapus komponen

</Diagram>

</DiagramGroup>

Ketika Anda mencentang "Render the second counter", `Counter` kedua dan *state*-nya diinisialisasi dari awal (`score = 0`) dan ditambahkan ke DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The entire right child node is highlighted in yellow, indicating that it was just added to the tree.">

Menambahkan komponen

</Diagram>

</DiagramGroup>

**React mempertahankan *state* sebuah komponen selama komponen tersebut di-*render* pada posisinya di pohon UI.** Jika komponen tersebut dihapus, atau komponen lain di-*render* pada posisi yang sama, React akan membuang *state*-nya.

## Komponen yang sama pada posisi yang sama mempertahankan *state* {/*same-component-at-the-same-position-preserves-state*/}

Pada contoh ini, terdapat dua tag `<Counter />` yang berbeda:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Ketika Anda mencentang atau menghapus *checkbox*, *state* penghitung tidak diatur ulang. Entah `isFancy` bernilai `true` atau `false`, Anda selalu memiliki `<Counter />` sebagai anak pertama dari `div` yang dikembalikan dari komponen akar `App`:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram with two sections separated by an arrow transitioning between them. Each section contains a layout of components with a parent labeled 'App' containing a state bubble labeled isFancy. This component has one child labeled 'div', which leads to a prop bubble containing isFancy (highlighted in purple) passed down to the only child. The last child is labeled 'Counter' and contains a state bubble with label 'count' and value 3 in both diagrams. In the left section of the diagram, nothing is highlighted and the isFancy parent state value is false. In the right section of the diagram, the isFancy parent state value has changed to true and it is highlighted in yellow, and so is the props bubble below, which has also changed its isFancy value to true.">

Memperbarui *state* `App` tidak mengatur ulang `Counter` karena `Counter` tetap berada di posisi yang sama

</Diagram>

</DiagramGroup>


Ini adalah komponen yang sama pada posisi yang sama, jadi dari sudut pandang React, ini adalah penghitung yang sama.

<Pitfall>

Ingatlah bahwa **posisi pada pohon UI--bukan pada *markup* JSX--yang penting pada React!** Komponen ini memiliki dua klausa `return` dengan tag JSX `<Counter />` yang berbeda di dalam dan di luar `if`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Anda mungkin berharap *state* akan diatur ulang ketika Anda mencentang *checkbox*, tetapi ternyata tidak! Hal ini dikarenakan **kedua tag `<Counter />` di-*render* pada posisi yang sama.** React tidak mengetahui di mana Anda meletakkan kondisi di dalam fungsi Anda. Yang ia "lihat" hanyalah pohon yang Anda kembalikan.

Pada kedua kasus tersebut, komponen `App` mengembalikan `<div>` dengan `<Counter />` sebagai anak pertama. Bagi React, kedua penghitung ini memiliki "alamat" yang sama: anak pertama dari anak pertama dari akar. Ini adalah cara React mencocokkan keduanya antara *render* sebelumnya dan berikutnya, terlepas dari bagaimana Anda menyusun logika Anda.

</Pitfall>

## Komponen yang berbeda pada posisi *state* reset yang sama {/*different-components-at-the-same-position-reset-state*/}

Pada contoh ini, mencentang *checkbox* akan menggantikan `<Counter>` dengan `<p>`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Di sini, Anda beralih di antara jenis komponen yang *berbeda* pada posisi yang sama. Awalnya, anak pertama dari `<div>` berisi sebuah `Counter`. Namun ketika Anda menukar `p`, React menghapus `Counter` dari pohon UI dan menghancurkan *state*-nya.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'p', highlighted in yellow.">

Ketika `Counter` berubah menjadi `p`, `Counter` dihapus dan `p` ditambahkan

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'p'. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, highlighted in yellow.">

Saat beralih kembali, `p` dihapus dan `Counter` ditambahkan

</Diagram>

</DiagramGroup>

Selain itu, **ketika Anda merender komponen yang berbeda pada posisi yang sama, komponen tersebut akan mengatur ulang *state* seluruh subpohonnya.** Untuk melihat cara kerjanya, tingkatkan penghitungnya, lalu centang *checkbox*:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

*State* penghitung akan diatur ulang saat Anda mengklik *checkbox*. Meskipun Anda me-*render* `Counter`, anak pertama dari `div` berubah dari `div` menjadi `section`. Ketika anak `div` dihapus dari DOM, seluruh pohon di bawahnya (termasuk `Counter` dan *state*-nya) juga dihancurkan.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

Ketika `section` berubah menjadi `div`, `section` akan dihapus dan `div` yang baru ditambahkan

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'div', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 0. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'section', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

Saat beralih kembali, `div` akan dihapus dan `section` yang baru ditambahkan

</Diagram>

</DiagramGroup>

Sebagai aturan praktis, **jika Anda ingin mempertahankan *state* di antara *render* ulang, struktur pohon Anda harus "cocok"** dari satu *render* ke *render* lainnya. Jika strukturnya berbeda, *state* akan dihancurkan karena React menghancurkan *state* ketika menghapus sebuah komponen dari pohon.

<Pitfall>

Inilah alasan mengapa Anda tidak boleh menyarangkan definisi fungsi komponen.

Di sini, fungsi komponen `MyTextField` didefinisikan *di dalam* `MyComponent`:

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


Setiap kali Anda mengklik tombol, *state* masukan akan menghilang! Hal ini disebabkan karena fungsi `MyTextField` yang *berbeda* dibuat untuk setiap *render* `MyComponent`. Anda me-*render* komponen yang *berbeda* pada posisi yang sama, sehingga React akan mengatur ulang semua *state* di bawah ini. Hal ini menyebabkan *bug* dan masalah performa. Untuk menghindari masalah ini, **selalu deklarasikan fungsi komponen pada level teratas, dan jangan menumpuk definisinya.**.

</Pitfall>

## Mengatur ulang *state* pada posisi yang sama {/*resetting-state-at-the-same-position*/}

Secara *default*, React mempertahankan *state* dari sebuah komponen ketika komponen tersebut berada pada posisi yang sama. Biasanya, ini adalah hal yang Anda inginkan, sehingga masuk akal jika ini menjadi perilaku *default*. Namun terkadang, Anda mungkin ingin mengatur ulang *state* sebuah komponen. Pertimbangkan aplikasi ini yang memungkinkan dua pemain melacak skor mereka selama setiap giliran:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Saat ini, ketika Anda mengganti pemain, skor tetap dipertahankan. Kedua `Counter` muncul di posisi yang sama, sehingga React melihat mereka sebagai `Counter` yang *sama* yang mana props `person` telah berubah.

Namun secara konseptual, dalam aplikasi ini mereka seharusnya menjadi dua penghitung yang terpisah. Mereka mungkin muncul di tempat yang sama di UI, tetapi yang satu adalah penghitung untuk Taylor, dan yang lainnya adalah penghitung untuk Sarah.

Ada dua opsi untuk mengatur ulang *state* ketika beralih di antara keduanya:

1. Merender komponen dalam posisi yang berbeda
2. Berikan setiap komponen identitas eksplisit dengan `key`


### Opsi 1: Me-*render* komponen pada posisi yang berbeda {/*option-1-rendering-a-component-in-different-positions*/}

Jika Anda ingin kedua `Counter` ini independen, Anda dapat membuat mereka dalam dua posisi yang berbeda:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Awalnya, `isPlayerA` adalah `true`. Jadi posisi pertama berisi *state* `Counter`, dan posisi kedua kosong.
* Ketika Anda mengklik tombol "Next player", posisi pertama akan hilang, namun posisi kedua sekarang berisi `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The only child, arranged to the left, is labeled Counter with a state bubble labeled 'count' and value 0. All of the left child is highlighted in yellow, indicating it was added.">

*State* awal

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'false'. The state bubble is highlighted in yellow, indicating that it has changed. The left child is replaced with a yellow 'poof' image indicating that it has been deleted and there is a new child on the right, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0.">

Mengklik "next"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The state bubble is highlighted in yellow, indicating that it has changed. There is a new child on the left, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is replaced with a yellow 'poof' image indicating that it has been deleted.">

Mengklik "next" lagi

</Diagram>

</DiagramGroup>

Setiap *state* `Counter` akan dihancurkan setiap kali dihapus dari DOM. Inilah sebabnya mengapa mereka mengatur ulang setiap kali Anda mengklik tombol.

Solusi ini nyaman ketika Anda hanya memiliki beberapa komponen independen yang di-*render* di tempat yang sama. Dalam contoh ini, Anda hanya memiliki dua komponen, sehingga tidak merepotkan untuk me-*render* keduanya secara terpisah di JSX.

### Opsi 2: Mengatur ulang *state* dengan *key* {/*option-2-resetting-state-with-a-key*/}

Ada juga cara lain yang lebih umum untuk mengatur ulang *state* komponen.

Anda mungkin pernah melihat `key` ketika [merender *list*.](/learn/rendering-lists#keeping-list-items-in-order-with-key) *Key* tidak hanya untuk *list*! Anda dapat menggunakan *key* untuk membuat React membedakan antar komponen. Secara *default*, React menggunakan urutan di dalam induk ("penghitung pertama", "penghitung kedua") untuk membedakan antar komponen. Tetapi dengan *key*, Anda dapat memberi tahu React bahwa ini bukan hanya penghitung *pertama*, atau penghitung *kedua*, tetapi penghitung yang spesifik--sebagai contoh, penghitung *Taylor*. Dengan cara ini, React akan mengetahui penghitung *Taylor* di mana pun dia muncul di dalam pohon!

Pada contoh ini, kedua `<Counter />` tidak berbagi *state* meskipun keduanya muncul di tempat yang sama di JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Beralih antara Taylor dan Sarah tidak akan mempertahankan *state*. Ini karena **Anda memberi mereka `key` yang berbeda:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Menentukan sebuah `key` memberitahu React untuk menggunakan `key` itu sendiri sebagai bagian dari posisi, bukan urutan mereka di dalam induk. Inilah sebabnya, meskipun Anda me-*render* mereka di tempat yang sama di JSX, React melihat mereka sebagai dua penghitung yang berbeda, sehingga mereka tidak akan pernah berbagi *state*. Setiap kali penghitung muncul di layar, *state*-nya dibuat. Setiap kali dihapus, *state*-nya akan dihancurkan. Mengalihkan di antara keduanya akan mengatur ulang *state* mereka berulang kali.

<Note>

Ingatlah bahwa *key* tidak unik secara global. Mereka hanya menentukan posisi *dalam induk*.

</Note>

### Mengatur ulang formulir dengan tombol {/*resetting-a-form-with-a-key*/}

Mengatur ulang *state* dengan tombol sangat berguna terutama ketika berurusan dengan formulir.

Dalam aplikasi obrolan ini, komponen `<Chat>` berisi *state* masukan teks:

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Coba masukkan sesuatu ke dalam input, lalu tekan "Alice" atau "Bob" untuk memilih penerima yang berbeda. Anda akan melihat bahwa *state* masukan dipertahankan karena `<Chat>` di-*render* pada posisi yang sama di pohon.

**Di banyak aplikasi, ini mungkin merupakan perilaku yang diinginkan, tetapi tidak di aplikasi obrolan!** Anda tidak ingin membiarkan pengguna mengirim pesan yang telah mereka ketik ke orang yang salah karena klik yang tidak disengaja. Untuk memperbaikinya, tambahkan `key`:

```js
<Chat key={to.id} contact={to} />
```

Hal ini memastikan bahwa ketika Anda memilih penerima yang berbeda, komponen `Chat` akan dibuat ulang dari awal, termasuk *state* apa pun di dalam pohon di bawahnya. React juga akan membuat ulang elemen DOM daripada menggunakannya kembali.

Sekarang, mengganti penerima selalu mengosongkan bidang teks:

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### Mempertahankan *state* untuk komponen yang dilepas {/*preserving-state-for-removed-components*/}

Dalam aplikasi obrolan yang sebenarnya, Anda mungkin ingin memulihkan *state* masukan ketika pengguna memilih penerima sebelumnya lagi. Ada beberapa cara untuk menjaga *state* "hidup" untuk komponen yang tidak lagi terlihat:

- Anda dapat merender *semua* obrolan, bukan hanya obrolan yang sedang berlangsung, tetapi menyembunyikan semua obrolan lainnya dengan CSS. Obrolan tidak akan dihapus dari pohon, sehingga *state* lokalnya akan dipertahankan. Solusi ini bekerja dengan baik untuk UI yang sederhana. Tetapi ini bisa menjadi sangat lambat jika pohon yang disembunyikan berukuran besar dan berisi banyak simpul DOM.
- Anda dapat [mengangkat *state*](/learn/sharing-state-between-components) dan menyimpan pesan yang tertunda untuk setiap penerima di komponen induk. Dengan cara ini, ketika komponen anak dihapus, tidak menjadi masalah, karena induklah yang menyimpan informasi penting. Ini adalah solusi yang paling umum.
- Anda juga dapat menggunakan sumber yang berbeda selain *state* React. Sebagai contoh, Anda mungkin ingin draf pesan tetap ada meskipun pengguna tidak sengaja menutup halaman. Untuk mengimplementasikan hal ini, Anda dapat membuat komponen `Chat` menginisialisasi *state*-nya dengan membaca dari [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), dan menyimpan draft di sana juga.

Apapun strategi yang Anda pilih, obrolan *dengan Alice* secara konseptual berbeda dengan obrolan *dengan Bob*, sehingga masuk akal untuk memberikan `key` pada pohon `<Chat>` berdasarkan penerima saat ini.

</DeepDive>

<Recap>

- React keeps state for as long as the same component is rendered at the same position.
- State is not kept in JSX tags. It's associated with the tree position in which you put that JSX.
- You can force a subtree to reset its state by giving it a different key.
- Don't nest component definitions, or you'll reset state by accident.

</Recap>



<Challenges>

#### Fix disappearing input text {/*fix-disappearing-input-text*/}

This example shows a message when you press the button. However, pressing the button also accidentally resets the input. Why does this happen? Fix it so that pressing the button does not reset the input text.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

The problem is that `Form` is rendered in different positions. In the `if` branch, it is the second child of the `<div>`, but in the `else` branch, it is the first child. Therefore, the component type in each position changes. The first position changes between holding a `p` and a `Form`, while the second position changes between holding a `Form` and a `button`. React resets the state every time the component type changes.

The easiest solution is to unify the branches so that `Form` always renders in the same position:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Technically, you could also add `null` before `<Form />` in the `else` branch to match the `if` branch structure:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

This way, `Form` is always the second child, so it stays in the same position and keeps its state. But this approach is much less obvious and introduces a risk that someone else will remove that `null`.

</Solution>

#### Swap two form fields {/*swap-two-form-fields*/}

This form lets you enter first and last name. It also has a checkbox controlling which field goes first. When you tick the checkbox, the "Last name" field will appear before the "First name" field.

It almost works, but there is a bug. If you fill in the "First name" input and tick the checkbox, the text will stay in the first input (which is now "Last name"). Fix it so that the input text *also* moves when you reverse the order.

<Hint>

It seems like for these fields, their position within the parent is not enough. Is there some way to tell React how to match up the state between re-renders?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" /> 
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" /> 
        <Field label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Give a `key` to both `<Field>` components in both `if` and `else` branches. This tells React how to "match up" the correct state for either `<Field>` even if their order within the parent changes:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" /> 
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" /> 
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Reset a detail form {/*reset-a-detail-form*/}

This is an editable contact list. You can edit the selected contact's details and then either press "Save" to update it, or "Reset" to undo your changes.

When you select a different contact (for example, Alice), the state updates but the form keeps showing the previous contact's details. Fix it so that the form gets reset when the selected contact changes.

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Give `key={selectedId}` to the `EditContact` component. This way, switching between different contacts will reset the form:

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Clear an image while it's loading {/*clear-an-image-while-its-loading*/}

When you press "Next", the browser starts loading the next image. However, because it's displayed in the same `<img>` tag, by default you would still see the previous image until the next one loads. This may be undesirable if it's important for the text to always match the image. Change it so that the moment you press "Next", the previous image immediately clears.

<Hint>

Is there a way to tell React to re-create the DOM instead of reusing it?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

You can provide a `key` to the `<img>` tag. When that `key` changes, React will re-create the `<img>` DOM node from scratch. This causes a brief flash when each image loads, so it's not something you'd want to do for every image in your app. But it makes sense if you want to ensure the image always matches the text.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Fix misplaced state in the list {/*fix-misplaced-state-in-the-list*/}

In this list, each `Contact` has state that determines whether "Show email" has been pressed for it. Press "Show email" for Alice, and then tick the "Show in reverse order" checkbox. You will notice that it's _Taylor's_ email that is expanded now, but Alice's--which has moved to the bottom--appears collapsed.

Fix it so that the expanded state is associated with each contact, regardless of the chosen ordering.

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

The problem is that this example was using index as a `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

However, you want the state to be associated with _each particular contact_.

Using the contact ID as a `key` instead fixes the issue:

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

State is associated with the tree position. A `key` lets you specify a named position instead of relying on order.

</Solution>

</Challenges>
