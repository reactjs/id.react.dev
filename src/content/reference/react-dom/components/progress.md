---
title: "<progress>"
---

<Intro>

[Komponen `<progress>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) memungkinkan Anda untuk menampilkan indikator progres.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<progress>` {/*progress*/}

Untuk menampilkan indikator progres, render komponen [`<progress>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress).

```js
<progress value={0.5} />
```

[Lihat lebih banyak contoh lainnya di bawah ini.](#usage)

#### Props {/*props*/}

`<progress>` mendukung semua [elemen umum *props*.](/reference/react-dom/components/common#props)

Selain itu, `<progress>` juga mendukung *props*:

<<<<<<< HEAD
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-max): Sebuah angka. Menentukan nilai maksimum `value`. *Default* ke `1`.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-value): Angka antara `0` dan `max`, atau `null` untuk progres tak tertentu. Menentukan berapa banyak yang telah dilakukan.
=======
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#max): A number. Specifies the maximum `value`. Defaults to `1`.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#value): A number between `0` and `max`, or `null` for indeterminate progress. Specifies how much was done.
>>>>>>> 842c24c9aefaa60b7ae9b46b002bd1b3cf4d31f3

---

## Penggunaan {/*usage*/}

### Mengontrol indikator progres {/*controlling-a-progress-indicator*/}

Untuk menampilkan indikator progres, render komponen `<progress>`. Anda dapat mengoper nilai `value` antara `0` dan nilai `max` yang anda tentukan. Jika Anda tidak memberikan nilai `max`, nilai tersebut akan dianggap sebagai `1` secara *default*.

Jika operasi tidak sedang berlangsung, berikan `value={null}` untuk mendapatkan indikator progres ke *state* tidak tentu *(indeterminate)*.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
