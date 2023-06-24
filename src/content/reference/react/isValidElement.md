---
title: isValidElement
---

<Intro>

`isValidElement` memeriksa apakah suatu nilai (*value*) adalah elemen React.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Panggil `isValidElement(value)` untuk memeriksa apakah `value` adalah elemen React.

```js
import { isValidElement, createElement } from 'react';

// ✅ Elemen React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Bukan elemen React
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `value`: Sebuah nilai yang ingin diperiksa. Itu dapat berupa nilai apa pun dari jenis apa pun.

#### Kembalian {/*returns*/}

`isValidElement` mengembalikan `true` jika `value` adalah elemen React. Jika bukan, ia mengembalikan `false`.

#### Catatan penting {/*caveats*/}

* **Hanya [tag JSX](/learn/writing-markup-with-jsx) dan objek yang dikembalikan oleh [`createElement`](/reference/react/createElement) yang dianggap sebagai elemen React.** Misalnya, meskipun angka seperti 42 adalah *node* React yang valid (dan dapat dikembalikan dari komponen), itu bukan elemen React yang valid. *Array* dan portal yang dibuat dengan [`createPortal`](/reference/react-dom/createPortal) juga tidak dianggap sebagai elemen React.

---

## Penggunaan {/*usage*/}

### Memeriksa apakah ada elemen React {/*checking-if-something-is-a-react-element*/}

Panggil `isValidElement` untuk memeriksa apakah beberapa nilai merupakan *elemen React*.

Elemen React adalah:

- Nilai yang dihasilkan dengan menulis [tag JSX](/learn/writing-markup-with-jsx)
- Nilai yang dihasilkan oleh pemanggilan [`createElement`](/reference/react/createElement)

Untuk elemen React, `isValidElement` mengembalikan `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ Tag JSX adalah elemen React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Nilai yang dikembalikan oleh createElement adalah elemen React
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Nilai lainnya, seperti string, angka, atau objek sembarang dan *array*, bukan elemen React.

Untuk nilai-nilai tersebut, `isValidElement` mengembalikan `false`: 

```js
// ❌ Berikut ini *bukan* elemen React
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

`isValidElement` sangat jarang diperlukan. Ini sangat berguna jika Anda memanggil API lain yang *hanya* menerima elemen (seperti halnya [`cloneElement`](/reference/react/cloneElement)) dan Anda ingin menghindari kesalahan saat argumen Anda bukan elemen React.

Kecuali Anda memiliki alasan yang sangat spesifik untuk menambahkan pemeriksaan `isValidElement`, Anda mungkin tidak membutuhkannya.

<DeepDive>

#### Elemen React vs *node* React {/*react-elements-vs-react-nodes*/}

Saat Anda menulis sebuah komponen, Anda dapat mengembalikan *node React* apa pun darinya:

```js
function MyComponent() {
  // ... Anda dapat mengembalikan node React apa pun ...
}
```

*Node* React dapat berupa:

- Elemen React yang dibuat seperti `<div />` atau `createElement('div')`
- Portal yang dibuat dengan [`createPortal`](/reference/react-dom/createPortal)
- Sebuah *string*
- Sebuah angka
- `true`, `false`, `null`, atau `undefined` (yang tidak ditampilkan)
- Array *node* React lainnya

**Catatan `isValidElement` memeriksa apakah argumennya adalah *elemen React,* bukan apakah itu node React.** Misalnya, `42` bukan elemen React yang valid. Namun, ini adalah *node* React yang benar-benar valid:

```js
function MyComponent() {
  return 42; // Tidak apa-apa untuk mengembalikan angka dari komponen
}
```

Inilah sebabnya mengapa Anda tidak boleh menggunakan `isValidElement` sebagai cara untuk memeriksa apakah sesuatu dapat di-*render*.

</DeepDive>
