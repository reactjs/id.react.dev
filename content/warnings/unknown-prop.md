---
title: Unknown Prop Warning
layout: single
permalink: warnings/unknown-prop.html
---
Peringatan *unknown-prop* akan muncul jika Anda mencoba me-*render* sebuah elemen DOM dengan *prop* yang tidak dikenali oleh React sebagai sebuah atribut/properti DOM yang valid.

Ada beberapa penyebab yang memungkinkan munculnya peringatan ini:

1. Apakah Anda menggunakan `{...this.props}` atau `cloneElement(element, this.props)`? Komponen Anda mengirimkan *props*-nya sendiri langsung ke elemen turunannya (misalnya [mengirimkan *props*](/docs/transferring-props.html)). Ketika mengirimkan *props* ke elemen turunan, Anda harus memastikan Anda tidak secara tidak sengaja meneruskan *props* yang dimaksudkan untuk diinterpretasikan oleh elemen induknya.

2. Anda menggunakan sebuah atribut DOM yang bukan merupakan atribut standar pada sebuah *node* DOM bawaan, mungkin untuk merepresentasikan suatu data *custom*. Jika Anda sedang berusaha melampirkan data *custom* pada sebuah elemen DOM standar, pertimbangkanlah untuk menggunakan sebuah atribut data *custom* sebagaimana dijelaskan [di MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using*data*attributes).

3. React belum mengenali atribut yang Anda spesifikasikan. Hal ini kemungkinan akan diperbaiki pada versi React yang akan datang. Namun, untuk saat ini React akan menghilangkan semua atribut yang tidak dikenali, sehingga menspesifikasikan atribut-atribut tersebut pada aplikasi React Anda tidak akan membuat atribut-atribut tersebut di-*render*.

4. Anda menggunakan sebuah komponen React tanpa *uppercase*. React merepresentasikan komponen tersebut sebagai sebuah *tag* DOM karena [proses transformasi React JSX menggunakan konvensi *upper* versus *lower case* untuk membedakan antara komponen yang dibuat oleh pengguna dengan *tag* DOM](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

---

Untuk memperbaiki hal ini, komponen-komponen komposit harus "mengonsumsi" semua *prop* yang dimaksudkan untuk komponen komposit tersebut dan bukannya untuk komponen turunannya. Contoh:

**Buruk:** *Prop* `layout` tiba-tiba diteruskan ke *tag* `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // BURUK! Karena Anda tahu pasti bahwa "layout" bukan merupakan prop yang dimengerti oleh <div>.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // BURUK! Karena Anda tahu pasti bahwa "layout" bukan merupakan prop yang dimengerti oleh <div>.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

<<<<<<< HEAD
**Baik:** *Spread operator* dapat digunakan untuk mengekstrak variabel-variabel dari objek *props*, dan menyimpan *props* yang tersisa ke dalam sebuah variabel.
=======
**Good:** The spread syntax can be used to pull variables off props, and put the remaining props into a variable.
>>>>>>> 20f0fe280f3c122df7541256b983c46e21e33b20

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**Baik:** Anda dapat juga menempatkan *props* pada sebuah objek baru dan menghapus sebagian *key* yang telah Anda gunakan dari objek baru tersebut. Pastikan Anda tidak menghapus *props* dari objek `this.props` yang asli karena objek tersebut seharusnya dianggap *immutable*.

```js
function MyDiv(props) {

  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
