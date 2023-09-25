---
title: "<select>"
---

<Intro>

[Komponen `<select>` bawaan peramban (*browser*)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)  memungkinkan anda untuk me-*render* sebuah kotak pilih (*select box*) dengan opsi.

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

Untuk menampilkan kotak pilih (*select box*), *render* komponen [`<select>` bawaan peramban (*browser*).](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)

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

<<<<<<< HEAD
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): Sebuah *string*. Menentukan salah satu dari kemungkinan [perilaku *autocomplete*.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): Sebuah *boolean*. Jika bernilai `true`, React akan fokus pada elemen yang terpasang (*mount*). 
* `children`: `<select>` menerima komponen [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup), dan [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup) sebagai anak (*children*). Anda juga dapat memberikan komponen Anda sendiri selama akhirnya salah satu dari komponen yang diizinkan akan di-*render*. Jika Anda memberikan komponen Anda yang pada akhirnya me-*render* *tag* `<option>`, setiap `<option>` yang Anda *render* harus mempunyai nilai `value`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): Sebuah *boolean*. Jika bernilai `true`, kotak pilih (*select box*) tidak akan interaktif dan akan tampak redup.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): Sebuah *string*. Menentukan `id` dari `<form>` yang dimiliki oleh kotak pilih (*select box*). Jika tidak diisi, maka menjadi formulir induk (*parent form*) terdekat.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): Sebuah *boolean*. Jika bernilai `true`, peramban (*browser*) mengizinkan [pilihan ganda.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): Sebuah *string*. Menentukan nama untuk kotak pilih (*select box*) yang [dikirim dengan formulir (*form*).](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: Sebuah fungsi [`Event` *handler* ](/reference/react-dom/components/common#event-handler). Diperlukan untuk [kotak pilih (*select box*) terkontrol.](#controlling-a-select-box-with-a-state-variable) Terpicu segera ketika pengguna memilih opsi berbeda. Berperilaku seperti [*event* `input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) pada peramban.
* `onChangeCapture`:  Sebuah versi dari `onChange` yang terpicu saat [fase penangkapan (*capture phase*).](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Sebuah fungsi [`Event` *handler*.](/reference/react-dom/components/common#event-handler) Terpicu segera saat nilai diubah oleh pengguna. Untuk alasan sejarah, di React lebih umum menggunakan `onChange` yang bekerja dengan cara yang sama.
* `onInputCapture`: Sebuah versi dari `onInput` yang terpicu pada [fase penangkapan (*capture phase*).](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Sebuah fungsi [`Event` handler.](/reference/react-dom/components/common#event-handler) Terpicu jika masukan gagal divalidasi pada pengiriman formulir (*form submit*). Berbeda dengan *event* bawaan `invalid`, *event* React `onInvalid` menyebar.
* `onInvalidCapture`: Sebuah versi dari `onInvalid` yang terpicu pada [fase penangkapan (*capture phase*).](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): Sebuah *boolean*. Jika nilai `true`, nilai harus diisi untuk formulir (*form*) dapat dikirim.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): Sebuah angka. Untuk pemilihan (*select*) dengan `multiple={true}`, tentukan jumlah awal *item* terlihat yang diinginkan.
=======
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): A string. Specifies one of the possible [autocomplete behaviors.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): A boolean. If `true`, React will focus the element on mount.
* `children`: `<select>` accepts [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup), and [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) components as children. You can also pass your own components as long as they eventually render one of the allowed components. If you pass your own components that eventually render `<option>` tags, each `<option>` you render must have a `value`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): A boolean. If `true`, the select box will not be interactive and will appear dimmed.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): A string. Specifies the `id` of the `<form>` this select box belongs to. If omitted, it's the closest parent form.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): A boolean. If `true`, the browser allows [multiple selection.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): A string. Specifies the name for this select box that's [submitted with the form.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Required for [controlled select boxes.](#controlling-a-select-box-with-a-state-variable) Fires immediately when the user picks a different option. Behaves like the browser [`input` event.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: A version of `onChange` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use `onChange` instead which works similarly.
* `onInputCapture`: A version of `onInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires if an input fails validation on form submit. Unlike the built-in `invalid` event, the React `onInvalid` event bubbles.
* `onInvalidCapture`: A version of `onInvalid` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): A boolean. If `true`, the value must be provided for the form to submit.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): A number. For `multiple={true}` selects, specifies the preferred number of initially visible items.
>>>>>>> 2390627c9cb305216e6bd56e67c6603a89e76e7f

#### Catatan Penting {/*caveats*/}

- Berbeda dengan HTML, memberikan atribut `selected` pada `option` tidak didukung. Sebagai gantinya, gunakan [`<select defaultValue>`](#providing-an-initially-selected-option) untuk kotak pilih (*selected box*) yang tidak terkontrol dan [`<select value>`](#controlling-a-select-box-with-a-state-variable) untuk kotak pilih (*selected box*) yang terkontrol.
- Jika kotak pilih (*select box*) menerima *prop* value, maka *prop* tersebut akan [diperlakukan sebagai terkontrol.](#controlling-a-select-box-with-a-state-variable)
- Sebuah kotak pilih (*select box*) tidak dapat menjadi terkontrol dan tidak terkontrol pada waktu yang sama.
- Sebuah kotak pilih (*select box*) tidak dapat berganti menjadi terkontrol atau tidak terkontrol selama masa hidupnya.
- Setiap kotak pilih (*select box*) terkontrol membutuhkan *event handler* `onChange` yang secara sinkron memperbarui nilai yang ada di belakangnya.

---

## Penggunaan {/*usage*/}

### Menampilkan kotak pilih (select box) dengan opsi {/*displaying-a-select-box-with-options*/}

*Render* `<select>` dengan daftar komponen `<option>` di dalamnya untuk menampilkan sebuah kotak pilih (*select box*). Beri setiap `<opsi>` sebuah `value` yang mewakili data yang akan dikirimkan bersama formulir (*form*).

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

Jika Anda tidak dapat menumpuk `<select>` ke dalam `<label>`, kaitkan keduanya dengan meneruskan ID yang sama ke `<select id>` dan [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Untuk menghindari konflik antara beberapa instans (*instance*) dari satu komponen, buat ID tersebut dengan [`useId`.](/reference/react/useId)

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

### Mengaktifkan banyak pilihan {/*enabling-multiple-selection*/}

Berikan `multiple={true}` ke `<select>` agar pengguna dapat memilih beberapa opsi. Dalam hal ini, jika Anda juga menentukan `defaultValue` untuk menentukan opsi awal yang dipilih, maka harus dalam bentuk senarai (*array*).

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pilih beberapa buah:
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

### Membaca nilai kotak pilih saat mengirimkan formulir {/*reading-the-select-box-value-when-submitting-a-form*/}

Tambahkan [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) di sekitar kotak pilih (*select box*) Anda dengan [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) di dalamnya. Ini akan memanggil *event handler* `<form onSubmit>` Anda. Secara bawaan, peramban (*browser*) akan mengirimkan data formulir (*form data*) ke URL yang sedang digunakan dan menyegarkan (*refresh*) halaman. Anda dapat menimpa perilaku tersebut dengan memanggil `e.preventDefault()`. Baca data formulir (*form data*) dengan [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Mencegah peramban (browser) memuat ulang halaman
    e.preventDefault();
    // Baca data formulir (form data)
    const form = e.target;
    const formData = new FormData(form);
    // Anda dapat meneruskan formData sebagai badan pengambilan (fetch body) secara langsung:
    fetch('/some-api', { method: form.method, body: formData });
    // Anda dapat membuat URL darinya, seperti yang dilakukan peramban (browser) secara bawaan:
    console.log(new URLSearchParams(formData).toString());
    // Anda dapat menggunakannya sebagai objek biasa.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) Tidak termasuk beberapa nilai pilihan
    // Atau Anda bisa mendapatkan senarai (array) pasangan nama-nilai.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pilih buah kesukaan Anda:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apel</option>
          <option value="banana">Pisang</option>
          <option value="orange">Jeruk</option>
        </select>
      </label>
      <label>
        Pilih semua sayur kesukaan Anda:
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
      <button type="submit">Kirim</button>
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

Berikan nilai `name` ke `<select>` Anda, misalnya `<select name="selectedFruit" />`. `name` yang Anda tentukan akan digunakan sebagai kunci dalam data formulir (*form data*), misalnya `{ selectedFruit: "orange" }`.

Jika Anda menggunakan `<select multiple={true}>`, [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) yang akan Anda baca dari formulir (*form*) akan menyertakan setiap nilai yang dipilih sebagai pasangan nama-nilai yang terpisah. Perhatikan baik-baik log konsol pada contoh di atas.

</Note>

<Pitfall>

Secara bawaan, *setiap* `<button>` di dalam `<form>` akan mengirimkannya. Hal ini dapat mengejutkan! Jika Anda memiliki komponen React `Button` kustom, pertimbangkan untuk mengembalikan [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) bukan `<button>`. Kemudian, secara eksplisit, gunakan `<button type="submit">` untuk tombol yang *seharusnya* mengirimkan formulir (*form*).

</Pitfall>

---

### Mengontrol kotak pilih (select box) dengan variabel state {/*controlling-a-select-box-with-a-state-variable*/}

Kotak pilih (*select box*) seperti `<select/>` *tidak terkontrol*. Bahkan jika Anda [nilai pilihan awal](#providing-an-initially-selected-option) seperti `<select defaultValue="orange">`, JSX Anda hanya menentukan nilai awal, bukan nilai saat ini.

**Untuk me-*render* kotak pilih (*select box*) _controlled_, berikan *prop* `value` padanya.** React akan memaksa kotak pilih (*select box*) untuk selalu mempunyai nilai `value` yang Anda berikan. Biasanya, Anda akan mengrontrol kotak pilih (*select box*) dengan mendeklarasikan [variabel *state*:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Deklarasikan variabel state...
  // ...
  return (
    <select
      value={selectedFruit} // ...memaksa nilai select agar cocok dengan variabel state...
      onChange={e => setSelectedFruit(e.target.value)} // ... dan memperbarui variabel state pada setiap perubahan!
    >
      <option value="apple">Apel</option>
      <option value="banana">Pisang</option>
      <option value="orange">Jeruk</option>
    </select>
  );
}
```

Hal ini berguna jika Anda ingin me-*render* ulang beberapa bagian UI sebagai respons terhadap setiap pilihan.

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
        Pilih semua sayur kesukaan Anda:
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
      <p>Buah kesukaan Anda: {selectedFruit}</p>
      <p>Sayur kesukaan Anda: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**Jika Anda memberikan nilai `value` tanpa `onChange`, maka tidak akan mungkin untuk memilih opsi.** Ketika Anda mengontrol sebuah kotak pilih (*select box*) dengan memberikan sebuah nilai `value`, Anda *memaksa* kotak tersebut untuk selalu memiliki nilai yang Anda berikan. Jadi, jika Anda memberikan variabel *state* sebagai nilai dari `value` tetapi lupa memperbarui variabel *state* secara sinkron selama *event handler* `onChange`, React akan mengembalikan kotak pilih (*select box*) ke nilai `value` yang Anda tentukan setelah setiap penekanan tombol.

Berbeda dengan HTML, memberikan atribut selected ke `<option>` individual tidak didukung.

</Pitfall>
