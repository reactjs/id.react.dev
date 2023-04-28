---
title: Berbagi State Antar Komponen

---

<Intro>

Terkadang, Anda ingin 2 komponen selalu berubah secara bersamaan. Untuk melakukannya, hapus *state* dari kedua komponen, pindahkan ke komponen induk terdekat, dan kemudian oper ke komponen tersebut melalui *props*. Ini dikenal sebagai *lifting state up,* dan ini adalah salah satu hal yang paling umum yang akan Anda lakukan saat menulis kode React.

</Intro>

<YouWillLearn>

- Bagaimana cara berbagi state antar komponen dengan *lifting state up*
- Apa itu komponen terkendali dan tidak terkendali

</YouWillLearn>

## Contoh Lifting State Up {/*lifting-state-up-by-example*/}


Pada contoh ini, komponen induk `Accordion` merender dua komponen `Panel` terpisah:

* `Accordion`
  - `Panel`
  - `Panel`

Setiap komponen `Panel` memiliki *state* boolean `isActive` yang menentukan apakah kontennya terlihat.


Tekan tombol Tampilkan untuk kedua panel:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Tampilkan
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="Tentang">
        Dengan populasi sekitar 2 juta, Almaty adalah kota terbesar di Kazakhstan. Dari tahun 1929 hingga 1997, itu adalah ibu kota negara tersebut.
      </Panel>
      <Panel title="Etimologi">
        Nama berasal dari <span lang="kk-KZ">алма</span>, kata Kazakh untuk "apel" dan sering diterjemahkan sebagai "penuh dengan apel". Faktanya, wilayah sekitar Almaty dipercaya sebagai rumah leluhur apel, dan <i lang="la">Malus sieversii</i> si liar dianggap sebagai kandidat yang mungkin untuk leluhur apel domestik modern.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Perhatikan bagaimana menekan tombol satu panel tidak memengaruhi panel lainnya - mereka independen.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Both Panel components contain isActive with value false.">

Awalnya, setiap `Panel` memiliki state `isActive` dengan nilai `false`, sehingga keduanya terlihat tertutup

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="The same diagram as the previous, with the isActive of the first child Panel component highlighted indicating a click with the isActive value set to true. The second Panel component still contains value false." >

Menekan tombol `Panel` mana pun hanya akan memperbarui state `isActive` dari `Panel` itu sendiri

</Diagram>

</DiagramGroup>

**Tetapi sekarang katakanlah Anda ingin mengubah panel tersebut sehingga hanya satu panel yang dibuka pada satu waktu.** Dengan desain diatas, membuka panel kedua harus menutup panel pertama. Bagaimana Anda melakukannya?

Untuk mengkoordinasikan kedua panel ini, Anda perlu "mengangkat *state* mereka" ke komponen induk dalam tiga langkah:

1. **Hapus** *state* dari komponen anak.
2. **Oper** data dari komponen induk.
3. **Tambahkan** *state* ke komponen induk dan oper bersamaan dengan *Event Handlers*.

Cara ini akan memungkinkan komponen `Accordion` untuk mengkoordinasikan kedua `Panel` dan hanya membuka satu panel pada satu waktu.

### Langkah 1: Hapus state dari komponen anak {/*step-1-remove-state-from-the-child-components*/}


Anda akan memberikan kontrol `isActive` dari `Panel` ke komponen induknya. Ini berarti komponen induk akan mengoper `isActive` ke `Panel` sebagai *prop*. Mulai dengan **menghapus baris ini** dari komponen `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

Lalu, tambahkan `isActive` ke daftar *prop* `Panel`:

```js
function Panel({ title, children, isActive }) 
```

Sekarang komponen induk `Panel` dapat *mengontrol* `isActive` dengan [mengoper sebagai prop.](/learn/passing-props-to-a-component) Sebaliknya, komponen `Panel` sekarang tidak memiliki *kontrol* atas nilai `isActive` - sekarang terserah komponen induk!


### Langkah 2: Oper data yang diperlukan dari komponen induk {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Untuk mengangkat *state*, Anda harus menemukan komponen induk yang paling dekat dari *kedua* komponen anak yang ingin Anda koordinasikan:

* `Accordion` *(Komponen induk terdekat)*
  - `Panel`
  - `Panel`

Pada contoh ini, komponen `Accordion` adalah yang terdekat. Karena komponen ini berada di atas kedua panel dan dapat mengontrol *prop* mereka, komponen ini akan menjadi "sumber kebenaran" untuk panel mana yang sedang aktif. Buat komponen `Accordion` mengoper nilai `isActive` yang telah ditentukan sebelumnya (misalnya, `true`) ke kedua panel:


<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="Tentang" isActive={true}>
        Dengan populasi sekitar 2 juta, Almaty adalah kota terbesar di Kazakhstan. Dari tahun 1929 hingga 1997, itu adalah ibu kota negara tersebut.
      </Panel>
      <Panel title="Etimologi" isActive={true}>
        Nama berasal dari <span lang="kk-KZ">алма</span>, kata Kazakh untuk "apel" dan sering diterjemahkan sebagai "penuh dengan apel". Faktanya, wilayah sekitar Almaty dipercaya sebagai rumah leluhur apel, dan <i lang="la">Malus sieversii</i> si liar dianggap sebagai kandidat yang mungkin untuk leluhur apel domestik modern.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Tampilkan
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Coba edit nilai `isActive` yang telah ditentukan sebelumnya di komponen `Accordion` dan lihat hasilnya di layar.

### Langkah 3: Tambahkan state ke komponen induk {/*step-3-add-state-to-the-common-parent*/}

Memindahkan *state* keatas sering mengubah sifat apa yang Anda simpan sebagai *state*. 



Dalam contoh ini, Anda ingin mengubah `Accordion` sehingga hanya satu panel yang dapat dibuka pada satu waktu. Ini berarti bahwa komponen induk `Accordion` perlu melacak *panel mana* yang sedang aktif. Alih-alih nilai `boolean`, ini dapat menggunakan angka sebagai indeks `Panel` aktif untuk variabel *state*:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Ketika `activeIndex` bernilai `0`, panel pertama aktif, dan ketika bernilai `1`, panel kedua aktif.

Menekan tombol "Tampilkan" di salah satu `Panel` perlu mengubah indeks aktif di `Accordion`. Sebuah `Panel` tidak dapat mengatur *state* `activeIndex` secara langsung karena didefinisikan di dalam `Accordion`. Komponen `Accordion` perlu *mengeksplisitkan* komponen `Panel` untuk mengubah *state*-nya dengan [mengoper event handler sebagai prop](/learn/responding-to-events#passing-event-handlers-as-props):

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

The `<button>` inside the `Panel` will now use the `onShow` prop as its click event handler:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

This completes lifting state up! Moving state into the common parent component allowed you to coordinate the two panels. Using the active index instead of two "is shown" flags ensured that only one panel is active at a given time. And passing down the event handler to the child allowed the child to change the parent's state.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Accordion contains an activeIndex value of zero which turns into isActive value of true passed to the first Panel, and isActive value of false passed to the second Panel." >

Initially, `Accordion`'s `activeIndex` is `0`, so the first `Panel` receives `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="The same diagram as the previous, with the activeIndex value of the parent Accordion component highlighted indicating a click with the value changed to one. The flow to both of the children Panel components is also highlighted, and the isActive value passed to each child is set to the opposite: false for the first Panel and true for the second one." >

When `Accordion`'s `activeIndex` state changes to `1`, the second `Panel` receives `isActive = true` instead

</Diagram>

</DiagramGroup>

<DeepDive>

#### Controlled and uncontrolled components {/*controlled-and-uncontrolled-components*/}

It is common to call a component with some local state "uncontrolled". For example, the original `Panel` component with an `isActive` state variable is uncontrolled because its parent cannot influence whether the panel is active or not.

In contrast, you might say a component is "controlled" when the important information in it is driven by props rather than its own local state. This lets the parent component fully specify its behavior. The final `Panel` component with the `isActive` prop is controlled by the `Accordion` component.

Uncontrolled components are easier to use within their parents because they require less configuration. But they're less flexible when you want to coordinate them together. Controlled components are maximally flexible, but they require the parent components to fully configure them with props.

In practice, "controlled" and "uncontrolled" aren't strict technical terms--each component usually has some mix of both local state and props. However, this is a useful way to talk about how components are designed and what capabilities they offer.

When writing a component, consider which information in it should be controlled (via props), and which information should be uncontrolled (via state). But you can always change your mind and refactor later.

</DeepDive>

## A single source of truth for each state {/*a-single-source-of-truth-for-each-state*/}

In a React application, many components will have their own state. Some state may "live" close to the leaf components (components at the bottom of the tree) like inputs. Other state may "live" closer to the top of the app. For example, even client-side routing libraries are usually implemented by storing the current route in the React state, and passing it down by props!

**For each unique piece of state, you will choose the component that "owns" it.** This principle is also known as having a ["single source of truth".](https://en.wikipedia.org/wiki/Single_source_of_truth) It doesn't mean that all state lives in one place--but that for _each_ piece of state, there is a _specific_ component that holds that piece of information. Instead of duplicating shared state between components, *lift it up* to their common shared parent, and *pass it down* to the children that need it.

Your app will change as you work on it. It is common that you will move state down or back up while you're still figuring out where each piece of the state "lives". This is all part of the process!

To see what this feels like in practice with a few more components, read [Thinking in React.](/learn/thinking-in-react)

<Recap>

* When you want to coordinate two components, move their state to their common parent.
* Then pass the information down through props from their common parent.
* Finally, pass the event handlers down so that the children can change the parent's state.
* It's useful to consider components as "controlled" (driven by props) or "uncontrolled" (driven by state).

</Recap>

<Challenges>

#### Synced inputs {/*synced-inputs*/}

These two inputs are independent. Make them stay in sync: editing one input should update the other input with the same text, and vice versa. 

<Hint>

You'll need to lift their state up into the parent component.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Move the `text` state variable into the parent component along with the `handleChange` handler. Then pass them down as props to both of the `Input` components. This will keep them in sync.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Filtering a list {/*filtering-a-list*/}

In this example, the `SearchBar` has its own `query` state that controls the text input. Its parent `FilterableList` component displays a `List` of items, but it doesn't take the search query into account.

Use the `filterItems(foods, query)` function to filter the list according to the search query. To test your changes, verify that typing "s" into the input filters down the list to "Sushi", "Shish kebab", and "Dim sum".

Note that `filterItems` is already implemented and imported so you don't need to write it yourself!

<Hint>

You will want to remove the `query` state and the `handleChange` handler from the `SearchBar`, and move them to the `FilterableList`. Then pass them down to `SearchBar` as `query` and `onChange` props.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

Lift the `query` state up into the `FilterableList` component. Call `filterItems(foods, query)` to get the filtered list and pass it down to the `List`. Now changing the query input is reflected in the list:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>
