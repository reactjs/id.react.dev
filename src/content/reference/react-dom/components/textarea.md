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

## Referensi {/*reference*/}

### `<textarea>` {/*textarea*/}

Untuk menampilkan sebuah area teks, *render* [komponen bawaan peramban `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[Lihat lebih banyak contoh di bawah](#usage)

#### Props {/*props*/}

`<textarea>` mendukung semua [elemen *props* yang umum.](/reference/react-dom/components/common#props)

Anda dapat [membuat sebuah area teks yang terkendali](#controlling-a-text-area-with-a-state-variable) dengan cara memberikan sebuah *prop* `value`:

* `value`: Sebuah string. Mengontrol teks di dalam area teks.

Ketika Anda memberikan `value`, Kamu harus memberikan juga sebuah `onChange` *handler* yang memperbarui nilai yang diberikan sebelumnya.

Jika `<textarea>` Anda tidak terkendali, Anda boleh memberikan `defaultValue` sebagai gantinya:

* `defaultValue`: Sebuah string. Menentukan [nilai awal](#providing-an-initial-value-for-a-text-area) untuk sebuah area teks.

`<textarea>` *props* ini relevan baik untuk area text terkendali maupun tidak terkendali:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autocomplete): Nilainya `'on'` atau `'off'`. Menentukan perilaku penyelesaian otomatis.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autofocus): Sebuah boolean. Jika `true`, React akan memfokuskan elemen ketika terpasang.
* `children`: `<textarea>` tidak menerima anak (*children*). Untuk Menentukan nilai awal, gunakan `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-cols): Sebuah bilangan. Menentukan lebar bawaaan pada rata-rata lebar karakter. Nilai bawaan adalah `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-disabled): Sebuah boolean. Jika `true`, input tidak akan menjadi interaktif dan akan terlihat redup.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-form): Sebuah string. Menentukan `id` pada suatu `<form>` yang memiliki input tersebut. Jika dihilangkan, nilainya mengacu pada induk formulir terdekat.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-maxlength): Sebuah bilangan. Menentukan panjang maksimum teks.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-minlength): Sebuah bilangan. Menentukan panjang minimum teks.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Sebuah string. Menentukan nama pada input yang [dikirim dengan formulir tertentu.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)* . Dibutuhkan untuk [area teks terkendali.](#controlling-a-text-area-with-a-state-variable) Beroperasi secara langsung ketika nilai suatu input diubah oleh pengguna (misalkan, beroperasi setiap penekanan tombol). Berperilaku seperti [event `input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) pada peramban.
* `onChangeCapture`: Sebuah versi `onChange` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)*. Beroperasi secara langsung ketika suatu nilai diubah oleh pengguna. Untuk alasan historis, dalam React penggunaan `onChange` menjadi idiomatik yang berfungsi dengan cara yang serupa.
* `onInputCapture`: Sebuah versi `onInput` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)*. Beroperasi jika sebuah input gagal memvalidasi pada pengiriman formulir. Tidak seperti *event* bawaan `invalid`, `onInvalid` *event* pada React menggelembung.
* `onInvalidCapture`: Sebuah versi `onInvalid` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): Sebuah fungsi *[`Event` handler](/reference/react-dom/components/common#event-handler)*. Beroperasi setelah pemilihan di dalam `<textarea>` berubah. React memperluas `onSelect` *event* untuk juga mengaktifkan pemilihan kosong dan pengeditan (dapat mempengaruhi pemilihan).
* `onSelectCapture`: Sebuah versi `onSelect` yang beroperasi pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-placeholder): Sebuah string. Ditampilkan dalam warna redup ketika nilai area teks kosong.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-readonly): Sebuah boolean. Jika `true`, area teks tidak dapat diubah oleh pengguna.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-required): Sebuah boolean. Jika `true`, nilai harus disediakan agar formulir dapat terkirim.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-rows): Sebuah bilangan. Menentukan tinggi bawaaan pada rata-rata tinggi karakter. Nilai bawaaan adalah `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-wrap): Nilainya `'hard'`, `'soft'`, atau `'off'`. Menentukan bagaimana suatu teks akan dibungkus ketika mengirimkan formulir.

#### Caveats {/*caveats*/}

- Memberikan anak (*children*) seperti `<textarea>something</textarea>` tidak diperbolehkan. [Gunakan `defaultValue` untuk konten awal.](#providing-an-initial-value-for-a-text-area)
- Jika menerima sebuah *prop* `value` string, sebuah area teks akan [dianggap sebagai komponen terkendali.](#controlling-a-text-area-with-a-state-variable)
- Sebuah area teks tidak dapat menjadi terkendali dan tidak terkendali secara bersamaan.
- Sebuah area teks tidak dapat beralih menjadi terkendali atau tidak terkendali selama masa pakainya.
- Setiap area teks terkendali membutuhkan sebuah *event handler* `onChange` yang memperbarui nilai pendukungnya secara sinkron.

---

## Penggunaan {/*usage*/}

### Menampilkan sebuah area teks {/*displaying-a-text-area*/}

*Render* `<textarea>` untuk menampilkan sebuah area teks. Kamu dapat menentukan ukuran bawaanya dengan atribut [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) dan [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols), tapi secara bawaan user dapat mengubah ukurannya. Untuk menonaktifkan pengubahan ukuran, kamu dapat menentukan `resize: none` di dalam CSS.

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

Jika Anda tidak dapat menyusun `<textarea>` di dalam sebuah `<label>`, hubungkanlah mereka dengan memberikan ID yang sama kepada `<textarea id>` dan [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) untuk menghindari konflik antara *instances* pada satu komponen, buatlah sebuah ID dengan [`useId`.](/reference/react/useId)

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

Kamu dapat menentukan nilai awal pada suatu area teks secara opsional. Untuk memberikan nilai awal, gunakan `defaultValue` dengan tipe string.

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

Tidak seperti HTML, memberikan teks awal seperti `<textarea>Some content</textarea>` tidak didukung.

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

    // Anda dapat mengirimakn *formData* sebagai *fetch body* secara langsung:
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

Sebuah area teks seperti `<textarea />` bersifat *tak terkendali.* Meskipun jika Anda [memberikan sebuah nilai awal](#providing-an-initial-value-for-a-text-area) seperti `<textarea defaultValue="Initial text" />`, JSX Anda hanya menetapkan nilai awal, bukan nilai saat ini.

**Untuk *render* sebuah teks area _terkendali_, berikan *prop* `value` kepada area teksnya.** React akan memaksa area teks tersebut agar selalu mempunyai `value` yang Anda berikan. Umumnya, kamu akan mengendalikan sebuah area teks dengan mendeklarasikan sebuah [variabel *state*:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Mendeklarasi sebuah variabel state...
  // ...
  return (
    <textarea
      value={postContent} // ...memaksa nilai dari input untuk mencocokan variabel state...
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

**Jika Anda memberikan `value` tanpa `onChange`, mengetik di area teks tersebut akan menjadi mustahil.** Jika Anda mengontrol sebuah area teks dengan memberikan beberapa `value` kepadanya, Anda *memaksa* area teks tersebut untuk selalu mempunyai nilai yang diberikan. Sehingga jika Anda memberikan sebuah variabel *state* sebagai sebuah `value` tetapi lupa untuk memperbarui variabel *state* tersebut secara sinkron selama *event handler* `onChange`, React akan mengembalikan area teks kembali ke `value` yang Anda berikan sebelumnya setelah setiap penekanan tombol.

</Pitfall>

---

## Penyelesain masalah {/*troubleshooting*/}

### Area teks saya tidak memperbarui ketika Saya mengetiknya {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Jika Anda *render* sebuah area teks dengan `value` tetapi tanpa `onChange`, Anda akan melihat sebuah *error* di konsol:

```js
// 🔴 Bug: area teks terkendali tanpa handler onChange
<textarea value={something} />
```

<ConsoleBlock level="error">

Anda memberikan sebuah *prop* `value` ke sebuah *field* formulir tanpa sebuah *handler* `onChange`. area teksnya akan ter-*render* menjadi sebuah *field* yang hanya untuk dibaca. Jika *field*-nya harus *mutable*, gunakan `defaultValue`. Selain itu, berikan `onChange` atau `readOnly`.

</ConsoleBlock>

Seperti yang disarankan pada pesan *error* berikut, jika Anda hanya ingin [menentukan nilai *awal*,](#providing-an-initial-value-for-a-text-area) berikan `defaultValue` sebagai gantinya:

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
  // 🔴 Bug: memperbarui sebuah input dengan sesuatu selain e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Anda juga tidak dapat memperbaruinya secara asinkron:

```js
function handleChange(e) {
  // 🔴 Bug: memperbarui sebuah input secara asinkron
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Untuk memperbaiki kode Anda, perbarui secara sinkron ke `e.target.value`:

```js
function handleChange(e) {
  // ✅ Memperbarui sebuah input terkendali ke e.target.value secara sinkron
  setFirstName(e.target.value);
}
```

Jika ini tidak menyelesaikan masalah, ada kemungkinan area teks terhapus dan ditambahkan kembali dari DOM di setiap penekanan tombol. Ini dapat terjadi jika Anda secara tidak sengaja [menyetel ulang *state*](/learn/preserving-and-resetting-state) di setiap *render* ulang. Misalkan, ini dapat terjadi jika area teksnya atau salah satu dari *parents*-nya selalu menerima sebuah atribut `key` yang berbeda, atau jika Anda menyusun definisi komponen (dimana hal ini tidak diizinkan React dan menyebabkan komponen "dalam" terpasang ulang di setiap *render*).

---

### Saya menerima sebuah error: "Sebuah komponen sedang mengubah input yang tidak terkendali menjadi terkendali" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Jika Anda memberikan sebuah `value` ke komponen, nilai tersebut harus tetap berupa string selama masa pakainya.

Anda tidak dapat memberikan `value={undefined}` terlebih dahulu dan kemudian memberikan `value="some string"` karena React tidak akan mengetahui apakah anda ingin komponennya menjadi tidak terkontrol atau terkontrol. Sebuah *controlled component* harus selalu menerima sebuah string `value`, bukan `null` atau `undefined`.

Jika `value` Anda berasal dari sebuah API atau sebuah variabel *state*, nilai tersebut mungkin diinisiasi ke `null` atau `undefined`. Dalam hal ini, Berikan sebuah string kosong (`''`) pada awalnya, atau berikan `value={someValue ?? ''}` untuk memastikan `value`-nya adalah string.
