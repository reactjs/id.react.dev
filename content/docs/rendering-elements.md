---
id: rendering-elements
title: Me-render Elemen
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

Elemen adalah blok terkecil pada aplikasi React.

Sebuah elemen menggambarkan apa yang ingin Anda lihat pada layar:

```js
const element = <h1>Halo dunia</h1>;
```

Tidak seperti elemen DOM, elemen React merupakan objek biasa dan mudah dibuat. React DOM mangatur pembaruan DOM agar sesuai dengan elemen React.

>**Catatan:**
>
>Mungkin akan sedikit membingungkan antara elemen dengan konsep yang lebih dikenali yaitu "komponen". Kami akan memperkenalkan komponen di [bagian berikutnya](/docs/components-and-props.html). Elemen adalah "bahan dasar" komponen dan kami menyarankan Anda untuk membaca bagian ini sebelum melompat ke bagian berikutnya.

## Me-render elemen ke dalam DOM {#rendering-an-element-into-the-dom}

Sebagai contoh terdapat sebuah `<div>` di suatu tempat di *file* HTML Anda:

```html
<div id="root"></div>
```

Kita menyebut ini sebagai *node DOM* "akar" karena semua yang berada di dalamnya nanti akan diatur oleh React DOM.

Aplikasi yang dibuat dengan React biasanya memiliki satu *node DOM* akar. Jika Anda mengintegrasikan React ke dalam aplikasi yang sudah ada, Anda dapat memiliki *node DOM* akar yang terisolasi sebanyak yang Anda inginkan.

Untuk me-*render* sebuah elemen React ke dalam sebuah *node DOM* akar, oper keduanya ke `ReactDOM.render()`:

`embed:rendering-elements/render-an-element.js`

[Coba di CodePen](codepen://rendering-elements/render-an-element)

Kode di atas akan menampilkan "Halo dunia" pada laman.

## Memperbarui Elemen yang Telah Di-render {#updating-the-rendered-element}

Elemen React bersifat [*immutable*](https://en.wikipedia.org/wiki/Immutable_object). Setelah Anda membuat sebuah elemen, Anda tidak dapat mengubah elemen anak atau atributnya. Sebuah elemen mirip dengan sebuah *frame* dalam film: elemen merepresentasikan antarmuka pengguna pada satu titik waktu tertentu.

Dengan pengetahuan kita sejauh ini, satu-satunya jalan untuk memperbarui antarmuka pengguna adalah dengan membuat sebuah elemen baru dan mengopernya ke `ReactDOM.render()`.

Perhatikan contoh jam berdetak di bawah ini:

`embed:rendering-elements/update-rendered-element.js`

[Coba di CodePen](codepen://rendering-elements/update-rendered-element)

Contoh di atas memanggil `ReactDOM.render()` setiap detiknya dari sebuah *callback* [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval).

>**Catatan:**
>
>Dalam praktiknya, sebagian besar aplikasi React hanya memanggil `ReactDOM.render()` sekali saja. Pada bagian berikutnya kita akan mempelajari bagaimana kode ini dapat dienkapsulasi ke dalam [*stateful components*](/docs/state-and-lifecycle.html).
>
>Kami menyarankan agar Anda tidak melewati satu topik karena topik-topik ini berhubungan satu dengan lainnya.

## React Hanya Memperbarui Apa yang Diperlukan {#react-only-updates-whats-necessary}

React DOM membandingkan antara elemen dan elemen anaknya dengan elemen sebelumnya dan hanya mengaplikasikan perbaruan DOM yang diperlukan untuk menyelaraskan DOM ke *state* yang diinginkan.

Anda dapat memverifikasi hal ini dengan menginspeksi [contoh terakhir](codepen://rendering-elements/update-rendered-element) dengan peralatan dari *browser*:

![Inspektor DOM menunjukkan pembaruan yang bersifat *granular*](../images/docs/granular-dom-updates.gif)

<<<<<<< HEAD
Walaupun kita membuat sebuah elemen yang mendeskripsikan struktur antarmuka pengguna secara keseluruhan dalam setiap detiknya, hanya *node* teks yang kontennya mengalami perubahanlah yang akan diperbarui oleh React DOM.
=======
Even though we create an element describing the whole UI tree on every tick, only the text node whose contents have changed gets updated by React DOM.
>>>>>>> 2ab1ca5007a37ca509863a212293f1c6b26d0afc

Menurut pengalaman kami, dengan hanya memikirkan tentang bagaimana antarmuka pengguna seharusnya terlihat pada saat tertentu daripada bagaimana ia berubah seiring waktu akan dapat mengeliminasi banyak *bug*.
