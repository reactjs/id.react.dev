---
title: "<option>"
---

<Intro>

[Komponen `<option>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) memungkinkan Anda untuk me-*render* opsi di dalam kotak [`<select>`](/reference/react-dom/components/select).


```js
<select>
  <option value="sebuahOpsi">Sebuah opsi</option>
  <option value="opsiLain">Opsi lain</option>
</select>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<option>` {/*option*/}

[Komponen `<option>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) memungkinkan Anda untuk me-*render* opsi di dalam kotak [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="sebuahOpsi">Sebuah opsi</option>
  <option value="opsiLain">Opsi lain</option>
</select>
```

[Lihat contoh lebih banyak di bawah ini.](#usage)

#### Props {/*props*/}

`<option>` mendukung semua [props element umum.](/reference/react-dom/components/common#props)

Sebagai tambahan, `<option>` mendukung *props* ini:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): Sebuah *boolean*. Jika `true`, opsi akan tidak dapat dipilih dan akan tampak redup.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): Sebuah *string*. Menentukan arti dari opsi. Jika tidak ditentukan, teks di dalam opsi akan digunakan.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): Nilai yang akan digunakan [ketika mengirimkan induk `<select>` dalam *form*](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) jika opsi ini dipilih.

#### Caveats {/*caveats*/}

* React tidak mendukung atribut `selected` dalam `<option>`. Sebagai gantinya, kirimkan `value` dari opsi ke elemen induk [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) untuk sebuah *uncontrolled select box*, atau [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) untuk *controlled select*.

---

## Penggunaan {/*usage*/}

### Menampilkan kotak select dengan opsi {/*displaying-a-select-box-with-options*/}

*Render* sebuah `<select>` dengan daftar komponen `<option>` di dalamnya untuk menampilkan sebuah kotak pilihan. Beri setiap `<option>` sebuah `value` yang merepresentasikan data yang akan dikirim dengan formulir.

[Baca lebih lanjut mengenai menampilkan `<select>` dengan daftar dari komponen `<option>`.](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pilih buah:
      <select name="selectedFruit">
        <option value="apel">Apel</option>
        <option value="pisang">Pisang</option>
        <option value="jeruk">Jeruk</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  
