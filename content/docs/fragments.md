---
id: fragments
title: Fragments
permalink: docs/fragments.html
---

Pola umum dalam React adalah agar komponen mengembalikan banyak elemen. Fragmen memungkinkan anda mengelompokkan daftar komponen-komponen tanpa menambahkan node tambahan ke DOM.


```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

Ada juga [sintaks pendek](#short-syntax) untuk mendeklarasikannya.

## Motivasi {#motivation}

Pola umum pada komponen adalah mengembalikan daftar komponen-komponen. Ambil potongan contoh react ini: 


```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

`<Columns />` perlu mengembalikan beberapa `<td>` elemen agar HTML yang diberikan menjadi benar. Jika div induk digunakan di dalam `render()` dari `<Columns />`, maka HTML yang dihasilkan tidak benar.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

menghasilkan keluaran `<Table />` dari:

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

Fragmen memecahkan masalah ini

## Penggunaan {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

yang menghasilkan keluaran `<Table />` yang benar:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Sintaks Pendek {#short-syntax}

Ada yang baru, sintaks yang lebih pendek dapat anda gunakan untuk mendeklarasikan fragmen. seperti tag kosong:

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

Anda dapat menggunakan `<></>` dengan cara yang sama anda akan menggunakan elemen lain kecuali itu tidak medukung *key* atau atribut.

### Keyed Fragments {#keyed-fragments}

Fragmen dideklarasikan dengan eksplisit `<React.Fragment>` sintaks mungkin memiliki *key*. Kasus penggunaan untuk ini adalah memetakan koleksi ke array fragmen -- untuk contoh, untuk membuat daftar deskripsi:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Tanpa sebuah `key`, React akan mengeluarkan peringatan
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` adalah satu-satunya atribut yang dapat dteruskan ke `Fragment`. Dimasa mendatang, kami dapat menambahkan dukungan untuk atribut tambahan, seperti *event handlers*.

### Demo langsung {#live-demo}

Anda dapat mencoba sintaks JSX fragmen baru dengan ini [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).

