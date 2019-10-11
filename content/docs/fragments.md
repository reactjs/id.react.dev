---
id: fragments
title: Fragments
permalink: docs/fragments.html
---

Salah satu pola umum pada React adalah mengembalikan banyak elemen sekaligus. *Fragments* memungkinkan Anda untuk mengelompokkan sejumlah elemen anak tanpa perlu menambahkan lagi *node* ekstra ke *DOM*.

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

Terdapat juga [sintaksis singkat](#short-syntax) baru untuk mendeklarasikannya.

## Motivasi {#motivation}

Sebuah pola umum untuk komponen mengembalikan sejumlah elemen anak. Lihat contoh potongan kode React berikut.

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

`<Columns />` harus mengembalikan sejumlah elemen `<td>` untuk menghasilkan HTML dengan benar. Jika div induk digunakan didalam `render()` pada `<Columns />`, maka akan menghasilkan HTML yang tidak benar.

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

menghasilkan sebuah `<Table />` dengan luaran:

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

*Fragments* menyelesaikan masalah ini.

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

yang menghasilkan luaran `<Table />` dengan benar berupa:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Sintaksis Singkat {#short-syntax}

Terdapat sintaksis baru dan lebih singkat yang bisa kamu gunakan untuk mendeklarasikan *fragments*. Itu terlihat seperti *tag* kosong:

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

Anda bisa menggunakan `<></>` dengan cara yang sama kamu menggunakan elemen lainnya namun hal ini tidak mendukung *key* maupun atribut.

### Fragments dengan Key {#keyed-fragments}

*Fragments* yang dideklarasikan secara eksplisit dengan sintaksis `<React.Fragment>` bisa memiliki *key*. Contoh kasus untuk ini yaitu saat melakukan pemetaan sebuah koleksi menjadi larik sejumlah *fragment* -- contohnya saat membuat daftar deskripsi:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Tanpa `key`, React akan mengirimkan peringatan key
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` merupakan satu-satunya atribut yang bisa diberikan kepada `Fragment`. Kedepannya, kami mungkin menambahkan dukungan untuk atribut lain, seperti penanganan *event*.

### Demonstrasi Langsung {#live-demo}

Anda dapat mencoba langsung sintaksis baru JSX *fragment* dengan ini [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
