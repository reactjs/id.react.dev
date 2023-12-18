---
title: Mempertahankan dan Mengatur Ulang State
---

<Intro>

*State* diisolasi antar komponen. React melacak *state* mana yang dimiliki oleh komponen mana berdasarkan tempatnya di pohon antarmuka pengguna (UI). Anda dapat mengontrol kapan harus mempertahankan *state* dan kapan harus mengatur ulang di antara *render* ulang (re-*render*).

</Intro>

<YouWillLearn>

<<<<<<< HEAD
* Bagaimana React "melihat" struktur komponen
* Kapan React memilih untuk mempertahankan atau mengatur ulang *state*
* Bagaimana cara memaksa React untuk mengatur ulang *state* komponen
* Bagaimana *keys* dan *types* mempengaruhi apakah *state* dipertahankan

</YouWillLearn>

## Pohon antarmuka pengguna (UI) {/*the-ui-tree*/}

Peramban menggunakan banyak struktur pohon untuk memodelkan antarmuka pengguna (UI). [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) mewakili elemen HTML, [CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model) melakukan hal yang sama untuk CSS. Bahkan ada [Pohon aksesibilitas](https://developer.mozilla.org/docs/Glossary/Accessibility_tree)!

React juga menggunakan struktur pohon untuk mengelola dan memodelkan UI yang Anda buat. React membuat **pohon UI** dari JSX Anda. Kemudian React DOM memperbarui elemen-elemen DOM peramban agar sesuai dengan pohon UI tersebut (React Native menerjemahkan pohon-pohon tersebut menjadi elemen-elemen yang spesifik untuk platform *mobile*).

<DiagramGroup>

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram dengan tiga bagian yang disusun secara horizontal. Pada bagian pertama, terdapat tiga persegi panjang yang ditumpuk secara vertikal, dengan label 'Komponen A', 'Komponen B', dan 'Komponen C'. Transisi ke panel berikutnya adalah sebuah panah dengan logo React di bagian atas yang berlabel 'React'. Bagian tengah berisi sebuah pohon komponen, dengan akar berlabel 'A' dan dua anak berlabel 'B' dan 'C'. Bagian selanjutnya ditransisikan lagi menggunakan panah dengan logo React di bagian atas berlabel 'React'. Bagian ketiga dan terakhir adalah model rangka dari sebuah browser, yang berisi sebuah pohon dengan 8 node, yang hanya memiliki sebuah subset yang disorot (menunjukkan subpohon dari bagian tengah).">

Dari komponen, React membuat pohon UI yang digunakan React DOM untuk me*render* DOM

</Diagram>

</DiagramGroup>

## *State* terikat dengan posisi di dalam pohon {/*state-is-tied-to-a-position-in-the-tree*/}

Ketika Anda memberikan *state* pada sebuah komponen, Anda mungkin berpikir bahwa state tersebut "hidup" di dalam komponen. Tetapi *state* sebenarnya disimpan di dalam React. React mengasosiasikan setiap bagian dari *state* yang dipegangnya dengan komponen yang benar berdasarkan posisi komponen tersebut di dalam pohon UI.
=======
* When React chooses to preserve or reset the state
* How to force React to reset component's state
* How keys and types affect whether the state is preserved

</YouWillLearn>

## State is tied to a position in the render tree {/*state-is-tied-to-a-position-in-the-tree*/}

React builds [render trees](learn/understanding-your-ui-as-a-tree#the-render-tree) for the component structure in your UI.
>>>>>>> 303ecae3dd4c7b570cf18e0115b94188f6aad5a1

When you give a component state, you might think the state "lives" inside the component. But the state is actually held inside React. React associates each piece of state it's holding with the correct component by where that component sits in the render tree.

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

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram pohon dari komponen-komponen React. Simpul akar diberi label 'div' dan memiliki dua anak. Masing-masing anak diberi label 'Counter' dan keduanya berisi gelembung state berlabel 'count' dengan nilai 0.">

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

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram pohon dari komponen-komponen React. Simpul akar diberi label 'div' dan memiliki dua anak. Anak sebelah kiri diberi label 'Counter' dan berisi gelembung state berlabel 'count' dengan nilai 0. Anak kanan diberi label 'Counter' dan berisi gelembung state berlabel 'count' dengan nilai 1. Gelembung state dari anak kanan disorot dengan warna kuning untuk mengindikasikan bahwa nilainya telah diperbarui.">

Memperbarui *state*

</Diagram>

</DiagramGroup>


<<<<<<< HEAD
React akan mempertahankan *state* selama Anda me-*render* komponen yang sama pada posisi yang sama. Untuk melihat hal ini, naikkan kedua penghitung, lalu hapus komponen kedua dengan menghapus centang pada *checkbox* "Render the second counter", lalu tambahkan kembali dengan mencentangnya lagi:
=======
React will keep the state around for as long as you render the same component at the same position in the tree. To see this, increment both counters, then remove the second component by unchecking "Render the second counter" checkbox, and then add it back by ticking it again:
>>>>>>> 303ecae3dd4c7b570cf18e0115b94188f6aad5a1

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

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram pohon dari komponen-komponen React. Simpul akar diberi label 'div' dan memiliki dua anak. Anak sebelah kiri diberi label 'Counter' dan berisi gelembung state berlabel 'count' dengan nilai 0. Anak kanan tidak ada, dan sebagai gantinya adalah gambar 'poof' berwarna kuning, menyoroti komponen yang dihapus dari pohon.">

Menghapus komponen

</Diagram>

</DiagramGroup>

Ketika Anda mencentang "Render the second counter", `Counter` kedua dan *state*-nya diinisialisasi dari awal (`score = 0`) dan ditambahkan ke DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram pohon dari komponen-komponen React. Simpul akar diberi label 'div' dan memiliki dua anak. Anak sebelah kiri diberi label 'Counter' dan berisi gelembung state berlabel 'count' dengan nilai 0. Anak kanan diberi label 'Counter' dan berisi gelembung state berlabel 'count' dengan nilai 0. Seluruh simpul anak kanan disorot dengan warna kuning, yang menandakan bahwa simpul tersebut baru saja ditambahkan ke dalam pohon.">

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

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram dengan dua bagian yang dipisahkan oleh panah yang bertransisi di antara keduanya. Setiap bagian berisi tata letak komponen dengan induk berlabel 'App' yang berisi gelembung state berlabel isFancy. Komponen ini memiliki satu anak berlabel 'div', yang mengarah ke gelembung prop yang berisi isFancy (disorot dengan warna ungu) yang diturunkan ke satu-satunya anak. Anak terakhir diberi label 'Counter' dan berisi gelembung state dengan label 'count' dan nilai 3 di kedua diagram. Di bagian kiri diagram, tidak ada yang disorot dan nilai state induk isFancy adalah false. Di bagian kanan diagram, nilai state induk isFancy telah berubah menjadi true dan disorot dengan warna kuning, begitu juga dengan gelembung prop di bawahnya, yang juga telah mengubah nilai isFancy menjadi true.">

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

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram dengan tiga bagian, dengan panah yang mentransisikan setiap bagian di antaranya. Bagian pertama berisi komponen React berlabel 'div' dengan satu anak berlabel 'Counter' yang berisi gelembung state berlabel 'count' dengan nilai 3. Bagian tengah memiliki induk 'div' yang sama, tetapi komponen turunannya telah dihapus, ditunjukkan dengan gambar 'proof' berwarna kuning. Bagian ketiga memiliki induk 'div' yang sama lagi, sekarang dengan anak baru berlabel 'p', disorot dengan warna kuning.">

Ketika `Counter` berubah menjadi `p`, `Counter` dihapus dan `p` ditambahkan

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram dengan tiga bagian, dengan panah yang mentransisikan setiap bagian di antaranya. Bagian pertama berisi komponen React yang diberi label 'p'. Bagian tengah memiliki induk 'div' yang sama, tetapi komponen anak sekarang telah dihapus, ditunjukkan dengan gambar 'proof' berwarna kuning. Bagian ketiga memiliki induk 'div' yang sama lagi, sekarang dengan anak baru berlabel 'Counter' yang berisi state bubble berlabel 'count' dengan nilai 0, disorot dengan warna kuning.">

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

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram dengan tiga bagian, dengan panah yang mentransisikan setiap bagian di antaranya. Bagian pertama berisi komponen React berlabel 'div' dengan satu anak berlabel 'section', yang memiliki satu anak berlabel 'Counter' yang berisi gelembung state berlabel 'count' dengan nilai 3. Bagian tengah memiliki induk 'div' yang sama, tetapi komponen turunannya telah dihapus, ditunjukkan dengan gambar 'proof' berwarna kuning. Bagian ketiga memiliki induk 'div' yang sama lagi, sekarang dengan anak baru berlabel 'div', disorot dengan warna kuning, juga dengan anak baru berlabel 'Counter' yang berisi gelembung state berlabel 'count' dengan nilai 0, semuanya disorot dengan warna kuning.">

Ketika `section` berubah menjadi `div`, `section` akan dihapus dan `div` yang baru ditambahkan

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram dengan tiga bagian, dengan panah yang mentransisikan setiap bagian di antaranya. Bagian pertama berisi komponen React berlabel 'div' dengan satu anak berlabel 'div', yang memiliki satu anak berlabel 'Counter' yang berisi gelembung state berlabel 'count' dengan nilai 0. Bagian tengah memiliki induk 'div' yang sama, tetapi komponen anak sekarang telah dihapus, ditunjukkan dengan gambar 'proof' berwarna kuning. Bagian ketiga memiliki induk 'div' yang sama lagi, sekarang dengan anak baru berlabel 'section', disorot dengan warna kuning, juga dengan anak baru berlabel 'Counter' yang berisi gelembung state berlabel 'count' dengan nilai 0, semuanya disorot dengan warna kuning.">

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

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram dengan pohon komponen-komponen React. Induk diberi label 'Scoreboard' dengan gelembung state berlabel isPlayerA dengan nilai 'true'. Satu-satunya anak, yang diatur ke kiri, diberi label Counter dengan gelembung state berlabel 'count' dan bernilai 0. Semua anak di sebelah kiri disorot dengan warna kuning, yang menandakan bahwa anak tersebut telah ditambahkan.">

*State* awal

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram dengan pohon komponen-komponen React. Induk diberi label 'Scoreboard' dengan gelembung state berlabel isPlayerA dengan nilai 'false'. State bubble disorot dengan warna kuning, menandakan bahwa gelembung state tersebut telah berubah. Anak sebelah kiri diganti dengan gambar 'poof' berwarna kuning yang menandakan bahwa anak tersebut telah dihapus dan terdapat anak baru di sebelah kanan, yang disorot dengan warna kuning yang menandakan bahwa anak tersebut telah ditambahkan. Anak baru ini diberi label 'Counter' dan berisi gelembung state berlabel 'count' dengan nilai 0.">

Mengklik "next"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram dengan pohon komponen-komponen React. Induk diberi label 'Scoreboard' dengan gelembung state berlabel isPlayerA dengan nilai 'true'. State bubble disorot dengan warna kuning, menandakan bahwa gelembung state tersebut telah berubah. Ada anak baru di sebelah kiri, disorot dengan warna kuning yang menandakan bahwa anak tersebut telah ditambahkan. Anak baru ini diberi label 'Counter' dan berisi gelembung state berlabel 'count' dengan nilai 0. Anak di sebelah kanan diganti dengan gambar 'poof' berwarna kuning yang menandakan bahwa anak tersebut telah dihapus.">

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

```js src/App.js
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

```js src/ContactList.js
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

```js src/Chat.js
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

```js src/App.js
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

```js src/ContactList.js
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

```js src/Chat.js
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

- React menyimpan *state* selama komponen yang sama di-*render* pada posisi yang sama.
- State tidak disimpan dalam tag JSX. Hal ini terkait dengan posisi pohon tempat Anda meletakkan JSX tersebut.
- Anda dapat memaksa subpohon untuk mengatur ulang *state*-nya dengan memberikan *key* yang berbeda.
- Jangan membuat sarang definisi komponen, atau Anda akan mengatur ulang *state* secara tidak sengaja.

</Recap>



<Challenges>

#### Memperbaiki teks masukan yang menghilang {/*fix-disappearing-input-text*/}

Contoh ini menunjukkan pesan apabila Anda menekan tombol. Namun, menekan tombol juga secara tidak sengaja mengatur ulang masukan. Mengapa hal ini bisa terjadi? Perbaiki agar penekanan tombol tidak mengatur ulang teks masukan.

<Sandpack>

```js src/App.js
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

Masalahnya adalah `Form` di-*render* dalam posisi yang berbeda. Pada cabang `if`, ini adalah anak kedua dari `<div>`, tetapi pada cabang `else`, ini adalah anak pertama. Oleh karena itu, jenis komponen di tiap posisi berubah. Posisi pertama berubah antara menahan `p` dan `Form`, sedangkan posisi kedua berubah antara menahan `Form` dan `tombol`. React mengatur ulang *state* setiap kali tipe komponen berubah.

Solusi termudah adalah dengan menyatukan cabang-cabang sehingga `Form` selalu dirender pada posisi yang sama:

<Sandpack>

```js src/App.js
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


Secara teknis, Anda juga dapat menambahkan `null` sebelum `<Form />` pada cabang `else` untuk mencocokkan struktur cabang `if`:

<Sandpack>

```js src/App.js
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

Dengan cara ini, `Form` selalu menjadi anak kedua, sehingga tetap berada di posisi yang sama dan mempertahankan *state*-nya. Tetapi pendekatan ini kurang jelas dan menimbulkan risiko bahwa orang lain akan menghapus `null` tersebut.

</Solution>

#### Menukar dua bidang formulir {/*swap-two-form-fields*/}

Formulir ini memungkinkan Anda memasukkan nama depan dan belakang. Formulir ini juga memiliki *checkbox* yang mengontrol bidang mana yang harus diisi terlebih dahulu. Ketika Anda mencentang *checkbox*, kolom "Last name" akan muncul sebelum kolom "First name".

Ini hampir berhasil, tetapi ada *bug*. Jika Anda mengisi input "First name" dan mencentang *checkbox*, teks akan tetap berada di masukan pertama (yang sekarang menjadi "Last name"). Perbaiki agar teks masukan *juga* berpindah ketika Anda membalikkan urutannya.

<Hint>

Sepertinya untuk bidang-bidang ini, posisinya di dalam induk tidak cukup. Apakah ada cara untuk memberi tahu React bagaimana cara mencocokkan *state* di antara *render* ulang?

</Hint>

<Sandpack>

```js src/App.js
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

Berikan `key` pada kedua komponen `<Field>` di cabang `if` dan `else`. Hal ini memberi tahu React bagaimana cara "mencocokkan" *state* yang benar untuk salah satu `<Field>` meskipun urutannya di dalam induk berubah:

<Sandpack>

```js src/App.js
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

#### Mengatur ulang formulir detail {/*reset-a-detail-form*/}

Ini adalah daftar kontak yang dapat diedit. Anda dapat mengedit detail kontak yang dipilih, lalu tekan "Save" untuk memperbaruinya, atau "Reset" untuk membatalkan perubahan.

Ketika Anda memilih kontak yang berbeda (misalnya, Alice), *state* akan diperbarui namun formulir tetap menampilkan detail kontak sebelumnya. Perbaiki agar formulir diatur ulang ketika kontak yang dipilih berubah.

<Sandpack>

```js src/App.js
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

```js src/ContactList.js
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

```js src/EditContact.js
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

Berikan `key={selectedId}` pada komponen `EditContact`. Dengan cara ini, beralih di antara kontak yang berbeda akan mengatur ulang formulir:

<Sandpack>

```js src/App.js
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

```js src/ContactList.js
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

```js src/EditContact.js
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

#### Menghapus gambar saat sedang dimuat {/*clear-an-image-while-its-loading*/}

Ketika Anda menekan "Next", peramban akan mulai memuat gambar berikutnya. Namun, karena ditampilkan dalam tag `<img>` yang sama, secara *default* Anda masih akan melihat gambar sebelumnya sampai gambar berikutnya dimuat. Hal ini mungkin tidak diinginkan jika teks harus selalu sesuai dengan gambar. Ubahlah supaya saat Anda menekan "Next", gambar sebelumnya segera dihapus.

<Hint>

Apakah ada cara untuk memberitahu React untuk membuat ulang DOM daripada menggunakannya kembali?

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

Anda dapat memberikan `key` pada tag `<img>`. Ketika `key` tersebut berubah, React akan membuat ulang simpul DOM `<img>` dari awal. Hal ini menyebabkan kilatan singkat ketika setiap gambar dimuat, jadi ini bukanlah sesuatu yang ingin Anda lakukan untuk setiap gambar dalam aplikasi Anda. Namun, hal ini masuk akal jika Anda ingin memastikan gambar selalu sesuai dengan teks.

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

#### Memperbaiki *state* yang salah tempat dalam *list* {/*fix-misplaced-state-in-the-list*/}

Dalam *list* ini, setiap `Kontak` memiliki *state* yang menentukan apakah "Show email" telah ditekan untuknya. Tekan "Show email" untuk Alice, lalu centang *checkbox* "Show in reverse order". Anda akan melihat bahwa email *Taylor* yang sekarang diperluas, tetapi email Alice--yang telah dipindahkan ke bagian bawah--tampak menciut.

Perbaiki agar *state* yang diperluas dikaitkan dengan setiap kontak, terlepas dari urutan yang dipilih.

<Sandpack>

```js src/App.js
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

```js src/Contact.js
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

Masalahnya adalah contoh ini menggunakan indeks sebagai `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

Namun, Anda ingin *state* dikaitkan dengan *setiap kontak tertentu*.

Menggunakan ID kontak sebagai `key` dapat mengatasi masalah ini:

<Sandpack>

```js src/App.js
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

```js src/Contact.js
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

*State* dikaitkan dengan posisi pohon. Sebuah `key` memungkinkan Anda menentukan posisi yang diberi nama daripada mengandalkan urutan.

</Solution>

</Challenges>
