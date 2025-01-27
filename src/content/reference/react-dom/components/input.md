---
title: "<input>"
---

<Intro>

Komponen [bawaan peramban `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) memungkinkan Anda me-*render* berbagai jenis masukan form.

```js
<input />
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<input>` {/*input*/}

Untuk menampilkan sebuah masukan, *render* komponen [bawaan peramban `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).

```js
<input name="myInput" />
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Props {/*props*/}

`<input>` mendukung semua [element props yang umum.](/reference/react-dom/components/common#props)

<<<<<<< HEAD
<Canary>

Ekstensi React terhadap *props* `formAction` saat ini hanya tersedia di kanal *canary* can *experimental* React. Dalam versi stabil React, `formAction` bekerja hanya sebagai [komponen peramban HTML bawaan](/reference/react-dom/components#all-html-components). Pelajari tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

[`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Sebuah *string* atau fungsi. Menimpa `<form action>` induk untuk `type="submit"` dan `type="image"`. Ketika URL dioper ke `action` form akan memiliki perilaku sebagai form standar HTML. Ketika fungsi dioper ke `formAction` fungsi akan menangani kiriman form. Lihat [`<form action>`](/reference/react-dom/components/form#props).
=======
- [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): A string or function. Overrides the parent `<form action>` for `type="submit"` and `type="image"`. When a URL is passed to `action` the form will behave like a standard HTML form. When a function is passed to `formAction` the function will handle the form submission. See [`<form action>`](/reference/react-dom/components/form#props).
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

Anda dapat [membuat sebuah masukan yang terkontrol](#controlling-an-input-with-a-state-variable) melalui satu dari beberapa props berikut:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Sebuah boolean. Untuk masukan checkbox atau tombol radio, mengontrol apakah itu dipilih.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): Sebuah string. Untuk sebuah masukan teks, mengontrol teks. (Untuk tombol radio, menentukan data form.)

Ketika Anda mengoper salah satu dari mereka, Anda juga harus mengoper sebuah `onChange` handler yang memperbarui nilai yang dioper.

Props `<input>` ini hanya relevan untuk masukan yang tidak dikontrol:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Sebuah boolean. Menentukan [nilai awal](#providing-an-initial-value-for-an-input) dari masukan `type="checkbox"` dan `type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): Sebuah string. Menentukan [nilai awal](#providing-an-initial-value-for-an-input) dari masukan sebuah teks.

Props `<input>` ini relevan untuk masukan tidak terkontrol dan masukan terkontrol:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): Sebuah string. Menentukan tipe file mana yang diterima oleh masukan `type="file"`.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): Sebuah string. Menentukan teks gambar alternatif untuk masuk `type="image"`.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): Sebuah string. Menentukan media (mikrofon, video, atau kamera) yang ditangkap oleh masukan `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): Sebuah string. Menentukan salah satu kemungkinan [perilaku autocomplete.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Sebuah boolean. Jika `true`, React akan memfokuskan elemen saat pasang.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): Sebuah string. Menentukan nama bidang form untuk arah elemen.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Sebuah boolean. Jika `true`, masukan tidak akan interaktif dan akan tampak redup.
* `children`: `<input>` tidak menerima children.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): Sebuah string. Menentukan `id` dari `<form>` milik masukan ini. Jika dihilangkan, menggunakan parent form terdekat.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Sebuah string. Menimpa parent `<form action>` dari `type="submit"` dan `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): Sebuah string. Menimpa parent `<form enctype>` dari `type="submit"` dan `type="image"`.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): Sebuah string. Menimpa parent `<form method>` dari `type="submit"` dan `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): Sebuah string. Menimpa parent `<form noValidate>` dari `type="submit"` dan `type="image"`.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): Sebuah string. Menimpa parent `<form target>` dari `type="submit"` dan `type="image"`.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): Sebuah string. Menentukan tinggi dari gambar untuk `type="image"`.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): Sebuah string. Menentukan `id` dari `<datalist>` dengan opsi autocomplete.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Sebuah angka. Menentukan nilai maksimum masukan numerik dan waktu.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Sebuah angka. Menentukan panjang maksimum teks dan masukan lainnya.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Sebuah angka. Menentukan nilai minimum masukan numerik dan waktu.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Sebuah angka. Menentukan panjang minimum teks dan masukan lainnya.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Sebuah boolean. Menentukan apakah beberapa nilai diperbolehkan untuk `<type="file"` dan `type="email"`.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Sebuah string. Menentukan nama dari masukan [yang disubmit dengan form.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: Sebuah fungsi [`Event` handler](/reference/react-dom/components/common#event-handler). Dibutuhkan untuk [masukan yang terkontrol.](#controlling-an-input-with-a-state-variable) Langsung aktif ketika nilai masukan diubah oleh pengguna (sebagai contoh, menyala di setip penekanan tombol). Berperilaku seperti [event`input`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Sebuha versi dari `onChange` yang aktif dalam [fase menangkap.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Sebuah fungsi [`Event` handler](/reference/react-dom/components/common#event-handler). Langsung aktif ketika nilainya diubah oleh pengguna. Untuk alasan historis, dalam React menggunakan `onChange` sebagai gantinya yang berfungsi serupa adalah idiomatis.
* `onInputCapture`: A version of `onInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Sebuah fungsi [`Event` handler](/reference/react-dom/components/common#event-handler). Aktif jika sebuah masukan gagal divalidasi ketika pengiriman form. Tidak seperti event `invalid` bawaan, React `onInvalid` berbentuk event bubbles.
* `onInvalidCapture`: Sebuah versi dari `onInvalid` yang aktif didalam [fase menangkap.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Sebuah fungsi [`Event` handler](/reference/react-dom/components/common#event-handler). Aktif setelah pemilihan di dalam `<input>` berubah. React memperluas event `onSelect` untuk juga mengaktifkan pemilihan kosong dan pada pengeditan (yang dapat memengaruhi pemilihan).
* `onSelectCapture`: Sebuah versi dari `onSelect` yang aktif ketika [fase menangkap.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): Sebuah string. Menentukan pola yang harus cocok dengan `value`.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): Sebuah string. Ditampilkan dalam warna redup saat nilai input kosong.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Sebuah boolean. Jika `true`, masukan tidak dapat diedit oleh pengguna.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Sebuah boolean. Jika `true`, nilai harus diberikan untuk form yang akan dikirim.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Sebuah angka. Mirip dengan pengaturan lebar, tetapi unit tergantung pada kontrol.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): Sebuah string. Menentukan sumber gambar untuk masukan `type="image"`.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Angka positif atau string `'any'`. Menentukan jarak antara nilai yang valid.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): Sebuah string. Satu dari [tipe masukan.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width):  Sebuah string. Menentukan lebar gambar untuk masukan `type="image"`.

#### Caveats {/*caveats*/}

- Checkbox harus `checked` (atau `defaultChecked`), bukan `value` (atau `defaultValue`).
- Jika sebuah masukan teks menerima sebuah prop string `value`, itu akan [diperlakukan sebagai terkontrol.](#controlling-an-input-with-a-state-variable)
- Jika sebuah checkbox atau sebuah tombol radio menerima prop boolean `checked`, itu akan [diperlakukan sebagai terkontrol.](#controlling-an-input-with-a-state-variable)
- Masukan tidak dapat dikontrol dan tidak dikontrol secara bersamaan.
- Masukan tidak dapat beralih antara dikontrol atau tidak dikontrol selama masa pakainya.
- Setiap masukan yang dikontrol membutuhkan event handler `onChange` yang secara sinkron memperbarui nilai pendukungnya.

---

## Penggunaan {/*usage*/}

### Menampilkan masukan dari berbagai jenis {/*displaying-inputs-of-different-types*/}

Untuk menampilkan masukan, *render* sebuah komponen `<input>`. Secara default, itu akan menjadi masukan teks. Anda dapat mengopen `type="checkbox"` untuk sebuah checkbox, `type="radio"` untuk sebuah tombol radio, [atau salah satu dari jenis masukan lainnya.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Masukan teks: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Tombol radio:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Pilihan 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Pilihan 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Pilihan 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Memberikan label untuk sebuah masukan {/*providing-a-label-for-an-input*/}

Biasanya, Anda akan menaruh setiap `<input>` di dalam sebuah tag [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Ini memberi tahu peramban bahwa label ini dikaitkan dengan masukan itu. Saat pengguna melakukan klik pada label, peramban akan secara otomatis memfokuskan input. Ini juga penting untuk aksesibilitas: pembaca layar akan memberitahukan keterangan label saat pengguna memfokuskan masukan terkait.

Jika Anda tidak dapat menumpuk `<input>` pada sebuah `<label>`, katikan keduanya dengan mengoper ID yang sama ke `<input id>` dan [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Untuk menghindari konflik antara beberapa instance dari satu komponen, buat ID tersebut dengan [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Nama depan Anda:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Umur Anda:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Memberikan nilai awal untuk sebuah masukan {/*providing-an-initial-value-for-an-input*/}

Secara opsional Anda dapat menentukan nilai awal untuk masukan apa pun. Berikan sebagai string `defaultValue` untuk masukan teks. Sedangkan checkboxes dan tombol radio harus menentukan nilai awal dengan boolean `defaultChecked`.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Masukan teks: <input name="myInput" defaultValue="Beberapa nilai awal" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Tombol radio:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Pilihan 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Pilihan 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Pilihan 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Membaca nilai input saat mengirimkan form {/*reading-the-input-values-when-submitting-a-form*/}

Tambahkan sebuah [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) disekitar masukan Anda dengan [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) di dalamnya. Ini akan memanggil event handler `<form onSubmit>`. Secara default, peramban akan mengirimkan data form ke URL saat ini dan menyegarkan halaman. Anda dapat menimpa perilaku tersebut dengan memanggil `e.preventDefault()`. Baca data form dengan [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Cegah peramban memuat ulang halaman
    e.preventDefault();

    // Membaca data form
    const form = e.target;
    const formData = new FormData(form);

    // Anda dapat mengoper formData sebagai fetch body secara langsung:
    fetch('/some-api', { method: form.method, body: formData });

    // Atau Anda dapat mengerjakannya sebagai objek biasa:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Masukan teks: <input name="myInput" defaultValue="Beberapa masukan awal" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Tombol radio:
        <label><input type="radio" name="myRadio" value="option1" /> Pilihan 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Pilihan 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Pilihan 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Kirim form</button>
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

Berikan `name` untuk setiap `<input>`, contohnya `<input name="firstName" defaultValue="Taylor" />`. `name` yang Anda tentukan akan digunakan sebagai kunci dalam data form, contohnya `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

Secara default, *apa pun* `<button>` di dalam sebuah `<form>` akan melakukan submit. Ini bisa mengejutkan! Jika Anda memiliki komponen React `Button` kustom Anda sendiri, pertimbangkan untuk mengembalikan [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) bukannya `<button>`. Kemudian, secara eksplisit, gunakan `<button type="submit">` untuk tombol yang *seharusnya* mengirimkan form.

</Pitfall>

---

### Mengontrol input dengan variabel status {/*controlling-an-input-with-a-state-variable*/}

Sebuah masukan seperti `<input />` *tidaklah terkontrol.* Bahkan jika Anda [memberikan sebuah nilai awal](#providing-an-initial-value-for-an-input) seperti `<input defaultValue="Teks awal" />`, JSX Anda hanya menentukan nilai awal. Tidak mengontrol apa seharusnya nilai sekarang.

**Untuk *render* sebuah masukan _terkontrol_, oper prop `value` ke dalamnya (atau `checked` untuk checkbox and radio).** React akan memaksa masukan untuk selalu memiliki `value` yang Anda berikan. Biasanya, Anda akan melakukan ini dengan mendeklarasikan sebuah [variable *state*:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Deklarasikan variabel state...
  // ...
  return (
    <input
      value={firstName} // ...memaksa nilai masukan untuk cocok dengan variabel state...
      onChange={e => setFirstName(e.target.value)} // ... dan perbarui variabel state pada setiap pengeditan!
    />
  );
}
```

Bagaimanapun sebuah masukan terkontrol masuk akal jika Anda membutuhkan *state*--contohnya, untuk *render*-ing ulang UI Anda pada setiap pengeditan:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        Nama Anda:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Nama Anda adalah {firstName}.</p>}
      ...
```

Ini juga berguna jika Anda ingin menawarkan berbagai cara untuk menyesuaikan *state* masukan (contohnya, dengan mengeklik tombol):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Umur:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Tambah 10 tahun
        </button>
```

`value` yang Anda berikan ke komponen terkontrol tidak boleh `undefined` or `null`. Jika Anda memerlukan nilai awal kosong (seperti dengan kolom `firstName` di bawah), inisialisasi variabel *state* Anda ke string kosong (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Nama Anda:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Umur:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Tambah 10 tahun
        </button>
      </label>
      {firstName !== '' &&
        <p>Nama Anda adalah {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Umur Anda adalah {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**Jika Anda mengoper `value` tanpa `onChange`, tidak mungkin bisa untuk mengetik di dalam masukan.** Ketika Anda mengontrol sebuah masukan dengan memberikan beberapa `value` ke dalamnya, Andan *memaksanya* untuk selalu memiliki nilai yang Anda berikan. Jika Anda mengoper sebuah variabel *state* sebagai `value` tetapi lupa untuk memperbarui variabel *state* tersebut secara sinkron selama `onChange` event handler, React akan mengembalikan masukan setelah setiap keystroke kembali ke `value` yang Anda tentukan.

</Pitfall>

---

### Mengoptimalkan *render*-ing ulang pada setiap penekanan tombol {/*optimizing-re-rendering-on-every-keystroke*/}

Ketika Anda menggunakan masukan terkontrol, Anda mengatur *state* pada setiap penekanan tombol. Jika komponen yang berisi *state* Anda me-*render* ulang pohon besar, ini bisa menjadi lambat. Ada beberapa cara untuk mengoptimalkan kinerja *render*-ing ulang.

Contohnya, misalkan Anda mulai dengan form yang me-*render* ulang semua konten halaman pada setiap penekanan tombol:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

Karena `<PageContent />` tidak bergantung pada masukan *state*, Anda dapat memindahkan masukan *state* ke dalam komponennya sendiri:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Ini secara signifikan meningkatkan kinerja karena sekarang hanya `SignupForm` yang di-*render* ulang pada setiap penekanan tombol.

Jika tidak ada cara untuk menghindari pe-*render*-an ulang (contohnya, jika `PageContent` bergantung pada nilai masukan pencarian), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) memungkinkan Anda menjaga masukan yang dikontrol tetap responsif bahkan di tengah *render* ulang yang besar.

---

## Penyelesaian masalah {/*troubleshooting*/}

### Masukan teks saya tidak diperbarui saat saya mengetiknya {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Jika Anda me-*render* masukan dengan `value` tetapi tanpa `onChange`, Anda akan melihat kesalahan di konsol:

```js
// 🔴 Bug: masukan teks terkontrol tanpa handler onChange
<input value={something} />
```

<ConsoleBlock level="error">

Anda memberikan prop `value` ke kolom form tanpa handler `onChange`. Ini akan membuat bidang read-only. Jika bidang harus dapat diubah, gunakan `defaultValue`. Jika tidak, tetapkan `onChange` atau `readOnly`.

</ConsoleBlock>

Seperti yang disarankan oleh pesan kesalahan, jika Anda hanya ingin [menentukan nilai *awal*,](#providing-an-initial-value-for-an-input) berikan `defaultValue` sebagai gantinya:

```js
// ✅ Bagus: masukan tidal terkontrol dengan sebuah nilai awal
<input defaultValue={something} />
```

Jika Anda ingin [mengontrol masukan ini menggunakan sebuah variabel *state*,](#controlling-an-input-with-a-state-variable) tentukan sebuah handler `onChange`:

```js
// ✅ Bagus: masukan terkontrol dengan onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Jika nilainya sengaja read-only, tambahkan prop `readOnly` untuk mendiamkan kesalahan:

```js
// ✅ Bagus: masukan yang dikontrol secara readonly tanpa perubahan
<input value={something} readOnly={true} />
```

---

### Checkbox saya tidak diperbarui ketika saya mengkliknya {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Jika Anda me-*render* kotak checkbox dengan `checked` tetapi tanpa `onChange`, Anda akan melihat kesalahan di konsol:

```js
// 🔴 Bug: checkbox terkontrol tanpa handler onChange
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

Anda memberikan prop `checked` ke kolom form tanpa handler `onChange`. Ini akan membuat bidang read-only. Jika bidang harus dapat diubah, gunakan `defaultChecked`. Jika tidak, tetapkan `onChange` atau `readOnly`.

</ConsoleBlock>

Seperti yang disarankan oleh pesan kesalahan, jika Anda hanya ingin [menentukan nilai *awal*,](#providing-an-initial-value-for-an-input) berikan `defaultValue` sebagai gantinya:

```js
// ✅ Bagus: checkbox tidak terkontrol dengan nilai awal
<input type="checkbox" defaultChecked={something} />
```

Jika Anda ingin [mengontrol masukan checkbox ini menggunakan sebuah variabel *state*,](#controlling-an-input-with-a-state-variable) tentukan sebuah handler `onChange`:

```js
// ✅ Bagus: checkbox terkontrol dengan onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Anda perlu membaca `e.target.checked` daripada `e.target.value` untuk checkbox.

</Pitfall>

Jika checkbox sengaja read-only, tambahkan prop `readOnly` untuk mendiamkan kesalahan:

```js
// ✅ Bagus: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Tanda sisipan saya melompat ke awal pada setiap penekanan tombol {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Jika Anda [mengontrol sebuah masukan,](#controlling-an-input-with-a-state-variable) Anda harus memperbarui variabel *state*-nya ke nilai masukan dari DOM selama `onChange`.

Anda tidak dapat memperbaruinya menjadi sesuatu selain `e.target.value` (atau `e.target.checked` untuk checkbox):

```js
function handleChange(e) {
  // 🔴 Bug: memperbarui masukan ke sesuatu selain e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Anda juga tidak dapat memperbaruinya secara asinkron:

```js
function handleChange(e) {
  // 🔴 Bug: memperbarui masukan secara asinkron
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Untuk memperbaiki kode Anda, perbarui secara sinkron ke `e.target.value`:

```js
function handleChange(e) {
  // ✅ Memperbarui input terkontrol ke e.target.value secara sinkron
  setFirstName(e.target.value);
}
```

Jika ini tidak menyelesaikan masalah, mungkin saja masukan dihapus dan ditambahkan kembali dari DOM pada setiap penekanan tombol. Ini dapat terjadi jika Anda secara tidak sengaja [menyetel ulang *state*](/learn/preserving-and-resetting-state) pada setiap *render* ulang, contohnya jika masukan atau salah satu parentnya selalu menerima atribut `key` yang berbeda, atau jika Anda menyusun definisi fungsi komponen (yang tidak didukung dan menyebabkan komponen "dalam" selalu dianggap pohon yang berbeda).

---

### Saya menerima pesan kesalahan: "Komponen sedang mengubah masukan yang tidak terkontrol menjadi dikontrol" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Jika Anda memberikan `value` ke komponen, `value` tersebut harus tetap berupa string selama masa pakainya.

Anda tidak dapat mengoper `value={undefined}` terlebih dahulu dan kemudian meneruskan `value="some string"` karena React tidak akan tahu apakah Anda ingin komponen tidak dikontrol atau dikontrol. Komponen yang dikontrol harus selalu menerima string `value`, bukan `null` atau `undefined`.

Jika `value` Anda berasal dari API atau variabel status, nilai tersebut mungkin diinisialisasi ke `null` atau `undefined`. Dalam hal ini, setel ke string kosong (`''`) pada awalnya, atau berikan `value={someValue ?? ''}` untuk memastikan `value` adalah sebuah string.

Demikian pula, jika Anda mengoper `checked` ke checkbox, pastikan itu selalu sebuah boolean.
