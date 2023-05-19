---
title: createElement
---

<Intro>

`createElement` memungkinkan Anda membuat elemen React. Ini berfungsi sebagai alternatif untuk menulis [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Panggil `createElement` untuk membuat elemen React dengan parameter `type`, `props`, dan `children`.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[Lihat lebih banyak contoh lainnya di bawah ini.](#usage)

#### Parameters {/*parameters*/}

* `type`: Argument `type` harus berupa tipe komponen React yang valid. Misalnya, bisa berupa string nama tag (seperti `'div'` atau `'span'`), atau komponen React (fungsi, kelas, atau komponen khusus seperti [`Fragment`](/reference/react/Fragment)).

* `props`: Argumen `props` harus berupa objek atau `null`. Jika Anda mengoper `null`, itu akan diperlakukan sama seperti objek kosong. React akan membuat elemen dengan *props* yang cocok dengan `props` yang telah Anda oper. Perhatikan bahwa `ref` dan `key` dari objek `props` Anda adalah spesial dan *tidak* akan tersedia sebagai `element.props.ref` dan `element.props.key` pada  `element` yang dikembalikan. Mereka akan tersedia sebagai `element.ref` dan `element.key`.

* **optional** `...children`: Nol atau lebih simpul anak. Mereka bisa berupa simpul React apa saja, termasuk elemen React, string, angka, [portal](/reference/react-dom/createPortal), simpul kosong (`null`, `undefined`, `true`, dan `false`), dan array simpul React.

#### Returns {/*returns*/}

`createElement` returns a React element object with a few properties:

* `type`: The `type` you have passed.
* `props`: The `props` you have passed except for `ref` and `key`. If the `type` is a component with legacy `type.defaultProps`, then any missing or undefined `props` will get the values from `type.defaultProps`.
* `ref`: The `ref` you have passed. If missing, `null`.
* `key`: The `key` you have passed, coerced to a string. If missing, `null`.

Usually, you'll return the element from your component or make it a child of another element. Although you may read the element's properties, it's best to treat every element as opaque after it's created, and only render it.

#### Caveats {/*caveats*/}

* You must **treat React elements and their props as [immutable](https://en.wikipedia.org/wiki/Immutable_object)** and never change their contents after creation. In development, React will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) the returned element and its `props` property shallowly to enforce this.

* When you use JSX, **you must start a tag with a capital letter to render your own custom component.** In other words, `<Something />` is equivalent to `createElement(Something)`, but `<something />` (lowercase) is equivalent to `createElement('something')` (note it's a string, so it will be treated as a built-in HTML tag).

* You should only **pass children as multiple arguments to `createElement` if they are all statically known,** like `createElement('h1', {}, child1, child2, child3)`. If your children are dynamic, pass the entire array as the third argument: `createElement('ul', {}, listItems)`. This ensures that React will [warn you about missing `key`s](/learn/rendering-lists#keeping-list-items-in-order-with-key) for any dynamic lists. For static lists this is not necessary because they never reorder.

---

## Usage {/*usage*/}

### Creating an element without JSX {/*creating-an-element-without-jsx*/}

If you don't like [JSX](/learn/writing-markup-with-jsx) or can't use it in your project, you can use `createElement` as an alternative.

To create an element without JSX, call `createElement` with some <CodeStep step={1}>type</CodeStep>, <CodeStep step={2}>props</CodeStep>, and <CodeStep step={3}>children</CodeStep>:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

The <CodeStep step={3}>children</CodeStep> are optional, and you can pass as many as you need (the example above has three children). This code will display a `<h1>` header with a greeting. For comparison, here is the same example rewritten with JSX:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

To render your own React component, pass a function like `Greeting` as the <CodeStep step={1}>type</CodeStep> instead of a string like `'h1'`:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

With JSX, it would look like this:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

Here is a complete example written with `createElement`:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

And here is the same example written using JSX:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Both coding styles are fine, so you can use whichever one you prefer for your project. The main benefit of using JSX compared to `createElement` is that it's easy to see which closing tag corresponds to which opening tag.

<DeepDive>

#### What is a React element, exactly? {/*what-is-a-react-element-exactly*/}

An element is a lightweight description of a piece of the user interface. For example, both `<Greeting name="Taylor" />` and `createElement(Greeting, { name: 'Taylor' })` produce an object like this:

```js
// Slightly simplified
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**Note that creating this object does not render the `Greeting` component or create any DOM elements.**

A React element is more like a description--an instruction for React to later render the `Greeting` component. By returning this object from your `App` component, you tell React what to do next.

Creating elements is extremely cheap so you don't need to try to optimize or avoid it.

</DeepDive>
