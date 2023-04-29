---
title: "<textarea>"
---

<Intro>

komponen [bawaan peramban `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) yang memungkinkan Anda *render* teks input dengan banyak baris.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<textarea>` {/*textarea*/}

Untuk menampilkan sebuah area teks, *render* [komponen bawaan peramban `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[Lihat lebih banyak contoh di bawah](#usage)

#### Props {/*props*/}

`<textarea>` mendukung semua [elemen props yang umum.](/reference/react-dom/components/common#props)

Anda dapat [membuat sebuah area teks yang terkendali](#controlling-a-text-area-with-a-state-variable) dengan cara memberikan sebuah prop `value`:

* `value`: Sebuah string. Mengontrol teks di dalam area teks.

Ketika Anda memberikan `value`, Kamu harus memberikan juga sebuah `onChange` *handler* yang memperbarui nilai yang diberikan sebelumnya.

Jika `<textarea>` Anda tidak terkendali, Anda boleh memberikan `defaultValue` sebagai gantinya:

* `defaultValue`: Sebuah string. Menentukan [nilai awal](#providing-an-initial-value-for-a-text-area) untuk sebuah area teks.

`<textarea>` props ini relevan baik untuk area text terkendali maupun tidak terkendali:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autocomplete): Nilainya `'on'` atau `'off'`. Menentukan perilaku penyelesaian otomatis.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autofocus): Sebuah boolean. Jika `true`, React akan memfokuskan elemen ketika terpasang.
* `children`: `<textarea>` tidak menerima *children*. Untuk Menentukan nilai awal, gunakan `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-cols): Sebuah bilangan. Menentukan lebar bawaaan pada rata-rata lebar karakter. Nilai bawaan adalah `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-disabled): Sebuah boolean. Jika `true`, input tidak akan menjadi interaktif dan akan terlihat redup.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-form): Sebuah string. Menentukan `id` pada suatu `<form>` yang memiliki input tersebut. Jika dihilangkan, nilainya mengacu pada induk formulir terdekat.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-maxlength): Sebuah bilangan. Menentukan panjang maksimum teks.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-minlength): Sebuah bilangan. Menentukan panjang minimum teks.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Sebuah string. Menentukan nama pada input yang [dikirim dengan formulir tertentu.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)* . Dibutuhkan untuk [area teks terkendali.](#controlling-a-text-area-with-a-state-variable) Beroperasi secara langsung ketika nilai suatu input diubah oleh pengguna (misalkan, beroperasi setiap tombol ditekan). Berperilaku seperti [event `input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) pada peramban.
* `onChangeCapture`: Sebuah versi `onChange` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)*. Beroperasi secara langsung ketika suatu nilai diubah oleh pengguna. Untuk alasan historis, dalam React penggunaan `onChange` menjadi idiomatik yang berfungsi dengan cara yang serupa.
* `onInputCapture`: Sebuah versi `onInput` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)*. Beroperasi jika sebuah input gagal memvalidasi pada pengiriman formulir. Tidak seperti *event* bawaan `invalid`, `onInvalid` *event* pada React menggelembung.
* `onInvalidCapture`: Sebuah versi `onInvalid` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)*. Beroperasi setelah pemilihan di dalam `<textarea>` berubah. React memperluas `onSelect` *event* untuk juga mengaktifkan pemilihan kosong dan pengeditan (dapat mempengaruhi pemilihan).
* `onSelectCapture`: Sebuah versi `onSelect` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-placeholder): Sebuah string. Ditampilkan dalam warna redup ketika nilai area teks kosong.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-readonly): Sebuah boolean. Jika `true`, area teks tidak dapat diubah oleh pengguna.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-required): Sebuah boolean. Jika `true`, nilainya harus tersedia di formulir yang akan dikirim.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-rows): Sebuah bilangan. Menentukan tinggi bawaaan pada rata-rata tinggi karakter. Nilai bawaaan adalah `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-wrap): Nilainya `'hard'`, `'soft'`, atau `'off'`. Menentukan bagaimana suatu teks perlu dibungkus ketika mengirimkan formulir.

#### Caveats {/*caveats*/}

- Memberikan *children* seperti `<textarea>something</textarea>` tidak diperbolehkan. [Gunakan `defaultValue` untuk konten awal.](#providing-an-initial-value-for-a-text-area)
- Jika menerima sebuah *prop* `value` string, sebuah area teks akan [dianggap sebagai komponen terkendali.](#controlling-a-text-area-with-a-state-variable)
- Sebuah area teks tidak dapat menjadi terkendali dan tidak terkendali secara bersamaan.
- Sebuah area teks tidak dapat beralih menjadi terkendali atau tidak terkendali selama masa pakainya.
- Setiap area teks terkendali membutuhkan sebuah `onChange` *event handler* yang mengubah nilai pendukungnya secara sinkronis.

---

## Usage {/*usage*/}

### Displaying a text area {/*displaying-a-text-area*/}

Render `<textarea>` to display a text area. You can specify its default size with the [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) and [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) attributes, but by default the user will be able to resize it. To disable resizing, you can specify `resize: none` in the CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Providing a label for a text area {/*providing-a-label-for-a-text-area*/}

Typically, you will place every `<textarea>` inside a [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tag. This tells the browser that this label is associated with that text area. When the user clicks the label, the browser will focus the text area. It's also essential for accessibility: a screen reader will announce the label caption when the user focuses the text area.

If you can't nest `<textarea>` into a `<label>`, associate them by passing the same ID to `<textarea id>` and [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) To avoid conflicts between instances of one component, generate such an ID with [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Providing an initial value for a text area {/*providing-an-initial-value-for-a-text-area*/}

You can optionally specify the initial value for the text area. Pass it as the `defaultValue` string.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

Unlike in HTML, passing initial text like `<textarea>Some content</textarea>` is not supported.

</Pitfall>

---

### Reading the text area value when submitting a form {/*reading-the-text-area-value-when-submitting-a-form*/}

Add a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) around your textarea with a [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) inside. It will call your `<form onSubmit>` event handler. By default, the browser will send the form data to the current URL and refresh the page. You can override that behavior by calling `e.preventDefault()`. Read the form data with [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Give a `name` to your `<textarea>`, for example `<textarea name="postContent" />`. The `name` you specified will be used as a key in the form data, for example `{ postContent: "Your post" }`.

</Note>

<Pitfall>

By default, *any* `<button>` inside a `<form>` will submit it. This can be surprising! If you have your own custom `Button` React component, consider returning [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) instead of `<button>`. Then, to be explicit, use `<button type="submit">` for buttons that *are* supposed to submit the form.

</Pitfall>

---

### Controlling a text area with a state variable {/*controlling-a-text-area-with-a-state-variable*/}

A text area like `<textarea />` is *uncontrolled.* Even if you [pass an initial value](#providing-an-initial-value-for-a-text-area) like `<textarea defaultValue="Initial text" />`, your JSX only specifies the initial value, not the value right now.

**To render a _controlled_ text area, pass the `value` prop to it.** React will force the text area to always have the `value` you passed. Typically, you will control a text area by declaring a [state variable:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Declare a state variable...
  // ...
  return (
    <textarea
      value={postContent} // ...force the input's value to match the state variable...
      onChange={e => setPostContent(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

This is useful if you want to re-render some part of the UI in response to every keystroke.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**If you pass `value` without `onChange`, it will be impossible to type into the text area.** When you control an text area by passing some `value` to it, you *force* it to always have the value you passed. So if you pass a state variable as a `value` but forget to update that state variable synchronously during the `onChange` event handler, React will revert the text area after every keystroke back to the `value` that you specified.

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### My text area doesn't update when I type into it {/*my-text-area-doesnt-update-when-i-type-into-it*/}

If you render a text area with `value` but no `onChange`, you will see an error in the console:

```js
// 🔴 Bug: controlled text area with no onChange handler
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

As the error message suggests, if you only wanted to [specify the *initial* value,](#providing-an-initial-value-for-a-text-area) pass `defaultValue` instead:

```js
// ✅ Good: uncontrolled text area with an initial value
<textarea defaultValue={something} />
```

If you want [to control this text area with a state variable,](#controlling-a-text-area-with-a-state-variable) specify an `onChange` handler:

```js
// ✅ Good: controlled text area with onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

If the value is intentionally read-only, add a `readOnly` prop to suppress the error:

```js
// ✅ Good: readonly controlled text area without on change
<textarea value={something} readOnly={true} />
```

---

### My text area caret jumps to the beginning on every keystroke {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

If you [control a text area,](#controlling-a-text-area-with-a-state-variable) you must update its state variable to the text area's value from the DOM during `onChange`.

You can't update it to something other than `e.target.value`:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

You also can't update it asynchronously:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

To fix your code, update it synchronously to `e.target.value`:

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

If this doesn't fix the problem, it's possible that the text area gets removed and re-added from the DOM on every keystroke. This can happen if you're accidentally [resetting state](/learn/preserving-and-resetting-state) on every re-render. For example, this can happen if the text area or one of its parents always receives a different `key` attribute, or if you nest component definitions (which is not allowed in React and causes the "inner" component to remount on every render).

---

### I'm getting an error: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


If you provide a `value` to the component, it must remain a string throughout its lifetime.

You cannot pass `value={undefined}` first and later pass `value="some string"` because React won't know whether you want the component to be uncontrolled or controlled. A controlled component should always receive a string `value`, not `null` or `undefined`.

If your `value` is coming from an API or a state variable, it might be initialized to `null` or `undefined`. In that case, either set it to an empty string (`''`) initially, or pass `value={someValue ?? ''}` to ensure `value` is a string.
