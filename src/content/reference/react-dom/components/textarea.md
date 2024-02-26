---
title: "<textarea>"
---

<Intro>

Komponen [bawaan peramban (*browser*) `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) yang memungkinkan Anda me-*render* masukan teks dengan banyak baris (*multiline*).

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<textarea>` {/*textarea*/}

Untuk menampilkan sebuah area teks, me-*render* [komponen peramban bawaan `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[Lihat lebih banyak contoh di bawah](#usage)

#### Props {/*props*/}

`<textarea>` mendukung semua [elemen *props* yang umum.](/reference/react-dom/components/common#props)

Anda dapat [membuat sebuah area teks yang terkendali (*controlled*)](#controlling-a-text-area-with-a-state-variable) dengan cara mengoper sebuah *prop* `value`:

* `value`: Sebuah string. Mengontrol teks di dalam area teks.

Ketika Anda mengoper `value`, Anda harus mengoper juga sebuah *handler* `onChange` yang memperbarui nilai yang dioper sebelumnya.

Jika `<textarea>` Anda tidak terkendali (*uncontrolled*), Anda boleh mengoper `defaultValue` sebagai gantinya:

* `defaultValue`: Sebuah string. Menentukan [nilai awal](#providing-an-initial-value-for-a-text-area) untuk sebuah area teks.

`<textarea>` *props* ini relevan baik untuk area text terkendali maupun tidak terkendali:

<<<<<<< HEAD
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): Nilainya `'on'` atau `'off'`. Menentukan perilaku penyelesaian otomatis.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): Sebuah boolean. Jika `true`, React akan memfokuskan elemen ketika terpasang.
* `children`: `<textarea>` tidak menerima anak (*children*). Untuk menentukan nilai awal, gunakan `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): Sebuah angka. Menentukan lebar bawaaan pada rata-rata lebar karakter. Nilai bawaan adalah `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): Sebuah boolean. Jika `true`, masukan tidak akan menjadi interaktif dan akan terlihat redup.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): Sebuah string. Menentukan `id` pada suatu `<form>` yang memiliki masukan tersebut. Jika dihilangkan, nilainya mengacu pada induk formulir terdekat.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): Sebuah angka. Menentukan panjang maksimum teks.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): Sebuah angka. Menentukan panjang minimum teks.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Sebuah string. Menentukan nama pada masukan yang [dikirim dengan formulir tertentu.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)* . Dibutuhkan untuk [area teks terkendali.](#controlling-a-text-area-with-a-state-variable) Beroperasi secara langsung ketika nilai suatu masukan diubah oleh pengguna (misalkan, beroperasi setiap penekanan tombol). Berperilaku seperti [*event* `input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) pada peramban.
* `onChangeCapture`: Sebuah versi `onChange` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)*. Beroperasi secara langsung ketika suatu nilai diubah oleh pengguna. Untuk alasan historis, dalam React penggunaan `onChange` menjadi idiomatik yang berfungsi dengan cara yang serupa.
* `onInputCapture`: Sebuah versi `onInput` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)*. Beroperasi jika sebuah masukan gagal memvalidasi pada pengiriman formulir. Tidak seperti *event* bawaan `invalid`, `onInvalid` *event* pada React menggelembung.
* `onInvalidCapture`: Sebuah versi `onInvalid` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)*. Beroperasi setelah pemilihan di dalam `<textarea>` berubah. React memperluas `onSelect` *event* untuk juga mengaktifkan pemilihan kosong dan pengeditan (dapat mempengaruhi pemilihan).
* `onSelectCapture`: Sebuah versi `onSelect` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): Sebuah string. Ditampilkan dalam warna redup ketika nilai area teks kosong.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): Sebuah boolean. Jika `true`, area teks tidak dapat diubah oleh pengguna.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): Sebuah boolean. Jika `true`, nilai harus disediakan agar formulir dapat terkirim.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): Sebuah angka. Menentukan tinggi bawaaan pada rata-rata tinggi karakter. Nilai bawaaan adalah `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): Nilainya `'hard'`, `'soft'`, atau `'off'`. Menentukan bagaimana suatu teks akan dibungkus ketika mengirimkan formulir.
=======
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): Either `'on'` or `'off'`. Specifies the autocomplete behavior.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): A boolean. If `true`, React will focus the element on mount.
* `children`: `<textarea>` does not accept children. To set the initial value, use `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): A number. Specifies the default width in average character widths. Defaults to `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): A boolean. If `true`, the input will not be interactive and will appear dimmed.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): A string. Specifies the `id` of the `<form>` this input belongs to. If omitted, it's the closest parent form.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): A number. Specifies the maximum length of text.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): A number. Specifies the minimum length of text.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): A string. Specifies the name for this input that's [submitted with the form.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Required for [controlled text areas.](#controlling-a-text-area-with-a-state-variable) Fires immediately when the input's value is changed by the user (for example, it fires on every keystroke). Behaves like the browser [`input` event.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: A version of `onChange` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use `onChange` instead which works similarly.
* `onInputCapture`: A version of `onInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires if an input fails validation on form submit. Unlike the built-in `invalid` event, the React `onInvalid` event bubbles.
* `onInvalidCapture`: A version of `onInvalid` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires after the selection inside the `<textarea>` changes. React extends the `onSelect` event to also fire for empty selection and on edits (which may affect the selection).
* `onSelectCapture`: A version of `onSelect` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): A string. Displayed in a dimmed color when the text area value is empty.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): A boolean. If `true`, the text area is not editable by the user.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): A boolean. If `true`, the value must be provided for the form to submit.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): A number. Specifies the default height in average character heights. Defaults to `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): Either `'hard'`, `'soft'`, or `'off'`. Specifies how the text should be wrapped when submitting a form.
>>>>>>> 081d1008dd1eebffb9550a3ff623860a7d977acf

#### Caveats {/*caveats*/}

- Mengoper anak (*children*) seperti `<textarea>something</textarea>` tidak diperbolehkan. [Gunakan `defaultValue` untuk konten awal.](#providing-an-initial-value-for-a-text-area)
- Jika menerima sebuah *prop* `value` string, sebuah area teks akan [dianggap sebagai komponen terkendali.](#controlling-a-text-area-with-a-state-variable)
- Sebuah area teks tidak dapat menjadi terkendali dan tidak terkendali secara bersamaan.
- Sebuah area teks tidak dapat beralih menjadi terkendali atau tidak terkendali selama masa pakainya.
- Setiap area teks terkendali membutuhkan sebuah *event handler* `onChange` yang memperbarui nilai pendukungnya secara sinkron.

---

## Penggunaan {/*usage*/}

### Menampilkan sebuah area teks {/*displaying-a-text-area*/}

*Render* `<textarea>` untuk menampilkan sebuah area teks. Anda dapat menentukan ukuran bawaanya dengan atribut [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) dan [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols), tapi secara bawaan user dapat mengubah ukurannya. Untuk menonaktifkan pengubahan ukuran, Anda dapat menentukan `resize: none` di dalam CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Tulis publikasi Anda:
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

### Menyediakan sebuah label untuk sebuah area teks {/*providing-a-label-for-a-text-area*/}

Umumnya, Anda akan meletakkan setiap `<textarea>` di dalam sebuah tag [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Ini memberitahu suatu peramban apabila label ini berkaitan dengan area teks tertentu. Ketika pengguna mengeklik label tersebut, peramban akan memfokuskan area teks. Hal ini juga diperlukan untuk aksesbilitas: sebuah layar pembaca akan memberitahu keterangan label ketika pengguna memfokuskan area teks tertentu.

Jika Anda tidak dapat menyusun `<textarea>` di dalam sebuah `<label>`, hubungkanlah mereka dengan mengoper ID yang sama kepada `<textarea id>` dan [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) untuk menghindari konflik antara *instances* pada satu komponen, buatlah sebuah ID dengan [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Tulis publikasi Anda:
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

### Menyediakan sebuah nilai awal pada sebuah area teks {/*providing-an-initial-value-for-a-text-area*/}

Anda dapat menentukan nilai awal pada suatu area teks secara opsional. Untuk mengoper nilai awal, gunakan `defaultValue` dengan tipe string.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Ubah publikasi anda:
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

Tidak seperti HTML, mengoper teks awal seperti `<textarea>Some content</textarea>` tidak didukung.

</Pitfall>

---

### Membaca nilai area teks ketika mengirimkan sebuah formulir {/*reading-the-text-area-value-when-submitting-a-form*/}

Tambahkan sebuah [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) mengelilingi area teks Anda dengan sebuah [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) di dalamnya. Tombol itu akan memanggil `<form onSubmit>` *event handler* Anda. Secara *default*, peramban akan mengirimkan data formulir kepada URL saat ini dan memuat ulang halaman. Anda dapat mengesampingkan perilaku tersebut dengan memanggil `e.preventDefault()`. Baca data formulir dengan menggunakan [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Mencegah peramban dari memuat ulang halaman
    e.preventDefault();

    // Membaca data formulir
    const form = e.target;
    const formData = new FormData(form);

    // Anda dapat mengoper *formData* sebagai *fetch body* secara langsung:
    fetch('/some-api', { method: form.method, body: formData });

    // Atau anda dapat menggunakannya sebagai objek sederhana:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Ubah publikasi Anda:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Atur ulang suntingan</button>
      <button type="submit">Kirim</button>
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

Berikan sebuah `name` kepada `<textarea>` Anda, misalkan `<textarea name="postContent" />`. `name` yang Anda tetapkan akan digunakan sebagai sebuah *key* di dalam data formulir, misalkan `{ postContent: "Your post" }`.

</Note>

<Pitfall>

Secara *default*, *setiap* `<button>` yang berada di dalam sebuah `<form>` akan mengirimkan data formulir tersebut. Ini bisa mengejutkan! Jika Anda mempunyai kustom komponen React `Button` Anda sendiri, pertimbangkanlah untuk mengembalikan [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) daripada `<button>`. Kemudian, supaya menjadi eksplisit, gunakan `<button type="submit">` untuk tombol-tombol yang seharusnya digunakan untuk mengirimkan formulir.

</Pitfall>

---

### Mengendalikan sebuah area teks dengan sebuah variabel state {/*controlling-a-text-area-with-a-state-variable*/}

Sebuah area teks seperti `<textarea />` bersifat *tak terkendali.* Meskipun jika Anda [mengoper sebuah nilai awal](#providing-an-initial-value-for-a-text-area) seperti `<textarea defaultValue="Initial text" />`, JSX Anda hanya menetapkan nilai awal, bukan nilai saat ini.

**Untuk me-*render* sebuah teks area _terkendali_, oper *prop* `value` kepada area teksnya.** React akan memaksa area teks tersebut agar selalu mempunyai `value` yang Anda berikan. Umumnya, Anda akan mengendalikan sebuah area teks dengan mendeklarasikan sebuah [variabel *state*:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Mendeklarasi sebuah variabel state...
  // ...
  return (
    <textarea
      value={postContent} // ...memaksa nilai dari masukan untuk mencocokan variabel state...
      onChange={e => setPostContent(e.target.value)} // ... dan memperbarui variabel state di setiap pengeditan!
    />
  );
}
```

Hal ini berguna jika Anda ingin mengulang *render* di beberapa bagian UI sebagai bentuk tanggapan di setiap penekanan tombol.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Masukkan beberapa markdown:
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

```js src/MarkdownPreview.js
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

**Jika Anda mengoper `value` tanpa `onChange`, mengetik di area teks tersebut akan menjadi mustahil.** Jika Anda mengontrol sebuah area teks dengan mengoper suatu `value` kepadanya, Anda *memaksa* area teks tersebut untuk selalu mempunyai nilai yang dioper. Sehingga jika Anda mengoper sebuah variabel *state* sebagai sebuah `value` tetapi lupa untuk memperbarui variabel *state* tersebut secara sinkron selama *event handler* `onChange`, React akan mengembalikan area teks kembali ke `value` yang Anda berikan sebelumnya setelah setiap penekanan tombol.

</Pitfall>

---

## Penyelesain masalah {/*troubleshooting*/}

### Area teks saya tidak memperbarui ketika Saya mengetiknya {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Jika Anda me-*render* sebuah area teks dengan `value` tetapi tanpa `onChange`, Anda akan melihat sebuah *error* di konsol:

```js
// 🔴 Bug: area teks terkendali tanpa handler onChange
<textarea value={something} />
```

<ConsoleBlock level="error">

Anda memberikan sebuah *prop* `value` ke sebuah *field* formulir tanpa sebuah *handler* `onChange`. area teksnya akan ter-*render* menjadi sebuah *field* yang hanya untuk dibaca. Jika *field*-nya harus *mutable*, gunakan `defaultValue`. Selain itu, berikan `onChange` atau `readOnly`.

</ConsoleBlock>

Seperti yang disarankan pada pesan *error* berikut, jika Anda hanya ingin [menentukan nilai *awal*,](#providing-an-initial-value-for-a-text-area) oper `defaultValue` sebagai gantinya:

```js
// ✅ Good: area teks tidak terkendali dengan sebuah nilai awal
<textarea defaultValue={something} />
```

Jika Anda ingin [mengendalikan area teks ini dengan sebuah variabel *state*,](#controlling-a-text-area-with-a-state-variable) Tentukanlah sebuah *handler* `onChange`:

```js
// ✅ Good: area teks terkendali dengan onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Jika nilainya sengaja diatur hanya untuk dibaca, tambahkan sebuah *prop* `readOnly` untuk menghilangkan *error*:

```js
// ✅ Good: area teks terkontrol yang hanya untuk dibaca tanpa onChange
<textarea value={something} readOnly={true} />
```

---

### Tanda sisipan saya melompat ke awal pada setiap penekanan tombol {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

Jika Anda [mengendalikan sebuah area teks,](#controlling-a-text-area-with-a-state-variable) Anda harus memperbarui variabel *state*-nya ke nilai area teksnya melalui DOM selama `onChange`.

Anda tidak dapat memperbarui nilainya dengan sesuatu selain `e.target.value`:

```js
function handleChange(e) {
  // 🔴 Bug: memperbarui sebuah masukan dengan sesuatu selain e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Anda juga tidak dapat memperbaruinya secara asinkron:

```js
function handleChange(e) {
  // 🔴 Bug: memperbarui sebuah masukan secara asinkron
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Untuk memperbaiki kode Anda, perbarui secara sinkron ke `e.target.value`:

```js
function handleChange(e) {
  // ✅ Memperbarui sebuah masukan terkendali ke e.target.value secara sinkron
  setFirstName(e.target.value);
}
```

Jika ini tidak menyelesaikan masalah, ada kemungkinan area teks terhapus dan ditambahkan kembali dari DOM di setiap penekanan tombol. Ini dapat terjadi jika Anda secara tidak sengaja [menyetel ulang *state*](/learn/preserving-and-resetting-state) di setiap *render* ulang. Misalkan, ini dapat terjadi jika area teksnya atau salah satu dari *parents*-nya selalu menerima sebuah atribut `key` yang berbeda, atau jika Anda menyusun definisi komponen (dimana hal ini tidak diizinkan React dan menyebabkan komponen "dalam" ter-*mount* ulang di setiap *render*).

---

### Saya menerima sebuah error: "Sebuah komponen sedang mengubah masukan yang tidak terkendali menjadi terkendali" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Jika Anda memberikan sebuah `value` ke komponen, nilai tersebut harus tetap berupa string selama masa pakainya.

Anda tidak dapat mengoper `value={undefined}` terlebih dahulu dan kemudian oper `value="some string"` karena React tidak akan mengetahui apakah anda ingin komponennya menjadi tidak terkontrol atau terkontrol. Sebuah *controlled component* harus selalu menerima sebuah string `value`, bukan `null` atau `undefined`.

Jika `value` Anda berasal dari sebuah API atau sebuah variabel *state*, nilai tersebut mungkin diinisiasi ke `null` atau `undefined`. Dalam hal ini, Berikan sebuah string kosong (`''`) pada awalnya, atau oper `value={someValue ?? ''}` untuk memastikan `value`-nya adalah string.
