---
title: "<select>"
---

<Intro>

[Komponen peramban (*browser*) bawaan `<select>`] memungkinkan anda untuk me-*render* sebuah kotak pilih (*select box*) dengan opsi.

```js
<select>
  <option value="someOption">Sebuah opsi</option>
  <option value="otherOption">Opsi lainnya</option>
</select>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<select>` {/*select*/}

Untuk menampilkan kotak pilih (*select box*), *render* komponen [peramban (*browser*) bawaan `<select>`.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)

```js
<select>
  <option value="someOption">Sebuah opsi</option>
  <option value="otherOption">Opsi lainnya</option>
</select>
```

[Lihat contoh lainnya di bawah ini.](#usage)

#### Props {/*props*/}

`<select>` mendukung seluruh [*props* elemen umum.](/reference/react-dom/components/common#props)

Anda dapat [membuat sebuah kotak pilih (*select box*) terkontrol](#controlling-a-select-box-with-a-state-variable) dengan memberikan *prop* `<value>`:

* `value`: Sebuah *string* (atau senarai (*array*) *string* untuk [`multiple={true}`](#enabling-multiple-selection)). Mengontrol opsi mana yang dipilih. Setiap *string* nilai harus sama dengan nilai `value` dari beberapa `<option>` yang tertanam di dalam `<select>`.

Ketika Anda memberikan `value`, Anda juga harus memberikan *handler* `onChange` yang memperbarui nilai yang diberi.

Jika `<select>` Anda tidak terkontrol, Anda dapat memberikan *prop* `defaultValue`:

* `defaultValue`: Sebuah *string* (atau senarai (*array*) *string* untuk [`multiple={true}`](#enabling-multiple-selection)). Menentukan [pilihan yang dipilih di awal.](#providing-an-initially-selected-option)

*Props* `<select>` ini relevan baik untuk kotak pilih (*select box*) yang terkontrol maupun tidak terkontrol:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-autocomplete): Sebuah *string*. Menentukan salah satu dari kemungkinan [perilaku *autocomplete*.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-autofocus): Sebuah *boolean*. Jika bernilai `true`, React akan fokus pada elemen yang terpasang (*mount*). 
* `children`: `<select>` menerima komponen [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup), dan [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup) sebagai anak (*children*). Anda juga dapat memberikan komponen Anda sendiri selama akhirnya salah satu dari komponen yang diizinkan akan di-*render*. Jika Anda memberikan komponen Anda yang pada akhirnya me-*render* *tag* `<option>`, setiap `<option>` yang Anda *render* harus mempunyai nilai `value`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-disabled): Sebuah *boolean*. Jika bernilai `true`, kotak pilih (*select box*) tidak akan interaktif dan akan tampak redup.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-form): Sebuah *string*. Menentukan `id` dari `<form>` yang dimiliki oleh kotak pilih (*select box*). Jika tidak diisi, maka Specifies the `id` of the `<form>` this select box belongs to. Jika dihilangkan, maka menjadi formulir induk (*parent form*) terdekat.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-multiple): Sebuah *boolean*. Jika bernilai `true`, peramban (*browser*) mengizinkan [pilihan ganda.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-name): Sebuah *string*. Menentukan nama untuk kotak pilih (*select box*) yang [dikirim dengan formulir (*form*).]
* `onChange`: Sebuah fungsi [`Event` *handler* ](/reference/react-dom/components/common#event-handler). Diperlukan untuk [kotak pilih (*select box*) terkontrol.](#controlling-a-select-box-with-a-state-variable) Terpicu segera ketika pengguna memilih opsi berbeda. Berperilaku seperti [*event* `input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) peramban.
* `onChangeCapture`:  Sebuah versi dari `onChange` yang terpicu saat [fase penangkapan (*capture phase*).](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Sebuah fungsi [`Event` *handler*.](/reference/react-dom/components/common#event-handler) Terpicu segera saat nilai diubah oleh pengguna. Untuk alasan sejarah, di React lebih umum menggunakan `onChange` yang bekerja dengan cara yang sama.
* `onInputCapture`: Sebuah versi dari `onInput` yang terpicu pada [fase penangkapan (*capture phase*).](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Sebuah fungsi [`Event` handler.](/reference/react-dom/components/common#event-handler) Terpicu jika masukan gagal divalidasi pada pengiriman formulir (*form submit*). Berbeda dengan event bawaan `invalid`, event React `onInvalid` menyebar.
* `onInvalidCapture`: Sebuah versi dari `onInvalid` yang terpicu pada  fires in the [fase penangkapan (*capture phase*).](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-required): Sebuah *boolean*. Jika nilai `true`, nilai harus disediakan untuk formulir (*form*) dikirim.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-size): Sebuah angka. Untuk pemilihan (*select*) dengan `multiple={true}`, tentukan jumlah awal *item* terlihat yang diinginkan.

#### Catatan Penting {/*caveats*/}

- Berbeda dengan HTML, memberikan atribut `selected` pada `option` tidak didukung. Sebagai gantinya, gunakan [`<select defaultValue>`](#providing-an-initially-selected-option) untuk kotak pilih (*selected box*) yang tidak terkontrol dan [`<select value>`](#controlling-a-select-box-with-a-state-variable) untuk kotak pilih (*selected box*) yang terkontrol.
- Jika kotak pilih (*select box*) meneripa *prop* value, maka *prop* tersebut akan [diperlakukan sebagai terkontrol.](#controlling-a-select-box-with-a-state-variable)
- Sebuah kotak pilih (*select box*) tidak dapat menjadi terkontrol dan tidak terkontrol pada waktu yang sama.
- Sebuah kotak pilih (*select box*) tidak dapat berganti menjadi terkontrol atau tidak terkontrol selama masa hidupnya.
- Setiap kotak pilih (*select box*) terkontrol membutuhkan *event handler* `onChange` yang secara sinkron memperbarui nilai yang ada di belakangnya.

---

## Penggunaan {/*usage*/}

### Menampilkan kotak pilih (select box) dengan opsi {/*displaying-a-select-box-with-options*/}

*Render* `<select>` dengan daftar komponen `<option>` di dalamnya untuk menampilkan sebuah kotak pilih (*select box*). Beri setiap `<opsi>` sebuah `nilai` yang mewakili data yang akan dikirimkan bersama formulir (*form*).

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pilih buah
      <select name="selectedFruit">
        <option value="apple">Apel</option>
        <option value="banana">Pisang</option>
        <option value="orange">Jeruk</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

---

### Memberikan label untuk kotak pilih (select box) {/*providing-a-label-for-a-select-box*/}

Biasanya, Anda akan menempatkan setiap `<select>` di dalam *tag* [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Ini memberi tahu peramban (*browser*) bahwa label ini dikaitkan dengan kotak pilih (*select box*) tersebut. Saat pengguna mengeklik labelnya, peramban (*browser*) secara otomatis akan memfokuskan kotak pilih (*select box*). Hal ini juga penting untuk aksesibilitas: pembaca layar (*screen reader*) akan membacakan keterangan label saat pengguna memfokuskan kotak pilih (*select box*).

Jika Anda tidak dapat menumpuk `<select>` ke dalam `<label>`, kaitkan keduanya dengan meneruskan ID yang sama ke `<select id>` dan [`<label htmlFor>`.](https://developer. mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Untuk menghindari konflik antara beberapa instans (*instance*) dari satu komponen, buat ID tersebut dengan [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pilih buah:
        <select name="selectedFruit">
          <option value="apple">Apel</option>
          <option value="banana">Pisang</option>
          <option value="orange">Jeruk</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pilih sayuran:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Timun</option>
        <option value="corn">Jagung</option>
        <option value="tomato">Tomat</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Memberikan opsi awal yang dipilih {/*providing-an-initially-selected-option*/}

Secara bawaan, peramban (*browser*) akan memilih `<opsi>` pertama dalam daftar. Untuk memilih opsi yang berbeda secara default, teruskan nilai `value` dari `<option>` tersebut sebagai `defaultValue` ke elemen `<select>`.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pilih buah:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apel</option>
        <option value="banana">Pisang</option>
        <option value="orange">Jeruk</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

<Pitfall>

Tidak seperti di HTML, meneruskan atribut `selected` ke `<option>` individual tidak didukung.

</Pitfall>

---

### Enabling multiple selection {/*enabling-multiple-selection*/}

Pass `multiple={true}` to the `<select>` to let the user select multiple options. In that case, if you also specify `defaultValue` to choose the initially selected options, it must be an array.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apel</option>
        <option value="banana">Pisang</option>
        <option value="orange">Jeruk</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Reading the select box value when submitting a form {/*reading-the-select-box-value-when-submitting-a-form*/}

Add a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) around your select box with a [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) inside. It will call your `<form onSubmit>` event handler. By default, the browser will send the form data to the current URL and refresh the page. You can override that behavior by calling `e.preventDefault()`. Read the form data with [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
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
    // You can generate a URL out of it, as the browser does by default:
    console.log(new URLSearchParams(formData).toString());
    // You can work with it as a plain object.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) This doesn't include multiple select values
    // Or you can get an array of name-value pairs.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apel</option>
          <option value="banana">Pisang</option>
          <option value="orange">Jeruk</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Timun</option>
          <option value="corn">Jagung</option>
          <option value="tomato">Tomat</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

Give a `name` to your `<select>`, for example `<select name="selectedFruit" />`. The `name` you specified will be used as a key in the form data, for example `{ selectedFruit: "orange" }`.

If you use `<select multiple={true}>`, the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) you'll read from the form will include each selected value as a separate name-value pair. Look closely at the console logs in the example above.

</Note>

<Pitfall>

By default, *any* `<button>` inside a `<form>` will submit it. This can be surprising! If you have your own custom `Button` React component, consider returning [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) instead of `<button>`. Then, to be explicit, use `<button type="submit">` for buttons that *are* supposed to submit the form.

</Pitfall>

---

### Controlling a select box with a state variable {/*controlling-a-select-box-with-a-state-variable*/}

A select box like `<select />` is *uncontrolled.* Even if you [pass an initially selected value](#providing-an-initially-selected-option) like `<select defaultValue="orange" />`, your JSX only specifies the initial value, not the value right now.

**To render a _controlled_ select box, pass the `value` prop to it.** React will force the select box to always have the `value` you passed. Typically, you will control a select box by declaring a [state variable:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Declare a state variable...
  // ...
  return (
    <select
      value={selectedFruit} // ...force the select's value to match the state variable...
      onChange={e => setSelectedFruit(e.target.value)} // ... and update the state variable on any change!
    >
      <option value="apple">Apel</option>
      <option value="banana">Pisang</option>
      <option value="orange">Jeruk</option>
    </select>
  );
}
```

This is useful if you want to re-render some part of the UI in response to every selection.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pilih buah:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apel</option>
          <option value="banana">Pisang</option>
          <option value="orange">Jeruk</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Timun</option>
          <option value="corn">Jagung</option>
          <option value="tomato">Tomat</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**If you pass `value` without `onChange`, it will be impossible to select an option.** When you control a select box by passing some `value` to it, you *force* it to always have the value you passed. So if you pass a state variable as a `value` but forget to update that state variable synchronously during the `onChange` event handler, React will revert the select box after every keystroke back to the `value` that you specified.

Unlike in HTML, passing a `selected` attribute to an individual `<option>` is not supported.

</Pitfall>
