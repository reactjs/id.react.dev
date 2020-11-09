---
id: introducing-jsx
title: Memperkenalkan JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

Cobalah lihat deklarasi variabel dibawah ini:

```js
const element = <h1>Halo, Dunia!</h1>;
```

Sintaksis *tag* aneh ini bukanlah sebuah *string* ataupun *HTML*.

Sintaksis ini di kenal dengan sebutan JSX, dan sintaksis ini adalah sebuah sintaksis ekstensi untuk *JavaScript*. Kami sarankan menggunakannya dengan React untuk mendeskripsikan bagimana antarmuka pengguna seharusnya terlihat. JSX mungkin akan mengingatkan Anda dengan sebuah bahasa *templat*, bedanya adalah JSX telah dilengkapi dengan kekuatan penuh dari JavaScript.

JSX akan menghasilkan "elemen" React. Kita akan mulai mengeksplor bagaimana me-*render* mereka ke dalam DOM di bagian [berikutnya](/docs/rendering-elements.html). Di bawah ini, Anda akan menemukan dasar-dasar JSX yang Anda butuhkan untuk memulai.

### Mengapa JSX? {#why-jsx}

React mengakui bahwa logika *rendering* akan secara inheren digabungkan dengan logika antarmuka pengguna lainnya. bagaimana *events* akan ditangani, bagaimana *state* berubah seiring dengan waktu, dan bagaimana data disiapkan untuk di tampilkan.

Alih-alih memisahkan *technologies* secara artifisial dengan meletakkan *markup* dan logika di file terpisah, React [memisahkan kepentingan *(separates concerns)*](https://en.wikipedia.org/wiki/Separation_of_concerns) dengan unit kopling rendah bernama "komponen" yang mengandung keduanya. Kita akan kembali ke komponen dalam [bagian selanjutnya](/docs/components-and-props.html), tetapi jika Anda merasa belum nyaman menempatkan *markup* di JavaScript, [video ini](https://www.youtube.com/watch?v=x7cQ3mrcKaY) mungkin akan meyakinkan Anda.

React [tidak mengharuskan](/docs/react-without-jsx.html) Anda untuk menggunakan JSX, namun kebanyakan orang merasa terbantu dengan adanya JSX sebagai bantuan visual saat mengerjakan antarmuka pengguna di dalam kode JavaScript. Menggunakan JSX juga memungkinkan React untuk menampilkan pesan kesalahan *(error)* dan peringatan *(warning)* yang lebih bermanfaat.

Setelah Anda memahaminya, mari kita mulai!

### Menyematkan Ekspresi di JSX {#embedding-expressions-in-jsx}

Dalam contoh di bawah ini, kita mendeklarasikan variabel bernama `name` dan kemudian menggunakannya di dalam JSX dengan cara membungkusnya di dalam tanda kurung kurawal *(curly braces)*:

```js{1,2}
const name = 'Budi';
const element = <h1>Halo, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

Anda dapat menyematkan semua [ekspresi *JavaScript*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) yang valid di dalam tanda kurung kurawal di JSX. Sebagai contoh, `2 + 2`, `user.firstName`, atau `formatName(user)` adalah ekspresi JavaScript yang valid.

Pada contoh di bawah ini, kami menyematkan hasil memanggil fungsi JavaScript, `formatName(user)`, kedalam elemen `<h1>`.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Budi',
  lastName: 'Mahardika'
};

const element = (
  <h1>
    Halo, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[Coba di CodePen](codepen://introducing-jsx)

Kami membagi JSX menjadi beberapa baris agar mudah dibaca. Meskipun tidak diwajibkan, ketika melakukan hal ini, kami juga merekomendasikan Anda membungkusnya dalam tanda kurung untuk menghindari terjadinya [penyisipan titik koma otomatis](https://stackoverflow.com/q/2846283).

### JSX adalah Ekspresi Juga {#jsx-is-an-expression-too}

Setelah dikompilasi, Ekspresi JSX akan menjadi panggilan fungsi JavaScript biasa dan menjadi objek JavaScript.

Hal ini berarti bahwa Anda dapat menggunakan JSX di dalam pernyataan `if` dan perulangan `for`, memasukkannya ke dalam variabel, menerimanya sebagai argumen, dan mengembalikannya dari sebuah fungsi:

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Halo, {formatName(user)}!</h1>;
  }
  return <h1>Halo, Orang Asing.</h1>;
}
```

### Menentukan Atribut dengan JSX {#specifying-attributes-with-jsx}

Anda dapat menggunakan tanda kutip untuk menentukan *string* literal sebagai atribut:

```js
const element = <div tabIndex="0"></div>;
```

Anda juga dapat menggunakan kurung kurawal untuk menyematkan ekspresi JavaScript di dalam atribut:

```js
const element = <img src={user.avatarUrl}></img>;
```

Jangan letakan tanda kutip di sekitar kurung kurawal saat menyematkan ekspresi JavaScript di dalam atribut. Anda bisa menggunakan tanda kutip (untuk nilai string) atau kurung kurawal (untuk ekspresi), tetapi jangan menggunakan keduanya dalam atribut yang sama.

>**Peringatan:**
>
>Karena JSX lebih dekat ke JavaScript daripada ke HTML, React DOM menggunakan `camelCase` sebagai konvensi penamaan alih-alih menggunakan konvensi penamaan atribut HTML.
>
>Sebagai contoh, `class` akan menjadi [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) di JSX, dan `tabindex` akan menjadi [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### Menspesifikasikan Elemen Anak dengan JSX {#specifying-children-with-jsx}

Jika *tag* bersifat kosong (tidak memiliki elemen anak), Anda bisa saja menutupnya secara langsung dengan `/>`, seperti XML:

```js
const element = <img src={user.avatarUrl} />;
```

*Tag* JSX dimungkinkan untuk memiliki elemen anak:

```js
const element = (
  <div>
    <h1>Halo!</h1>
    <h2>Senang melihatmu di sini.</h2>
  </div>
);
```

### JSX Mencegah Serangan Injeksi {#jsx-prevents-injection-attacks}

Anda dapat menanamkan input pengguna di JSX dengan aman:

```js
const title = response.potentiallyMaliciousInput;
// Ini aman:
const element = <h1>{title}</h1>;
```

Secara default, React DOM [meng-*escape*](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) nilai apapun yang ditaruh di dalam JSX sebelum me-*render* mereka. Oleh karena itu dapat dipastikan Anda tidak akan pernah menginjeksi apapun yang tidak ditulis di aplikasi Anda secara eksplisit. Semuanya akan diubah menjadi *string* sebelum di-*render*. Ini membantu mencegah ada nya serangan [XSS (skrip-lintas-situs)](https://en.wikipedia.org/wiki/Cross-site_scripting).

### JSX Merepresentasikan Objek {#jsx-represents-objects}

Babel akan meng-*compile* JSX menjadi pemanggilan `React.createElement()`.

Dua contoh ini akan menghasilkan hal yang sama:

```js
const element = (
  <h1 className="greeting">
    Halo, Dunia!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Halo, Dunia!'
);
```

`React.createElement()` melakukan serangkaian pengecekan yang membantu Anda menulis kode yang bebas dari *bug* namun pada dasarnya akan membuat objek seperti ini:

```js
// Catatan: struktur ini sudah disederhanakan
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Halo, Dunia!'
  }
};
```

Objek seperti ini disebut "elemen React". Anda dapat menganggap mereka sebagai deskripsi dari apa yang Anda ingin lihat di layar. React membaca objek-objek ini dan menggunakan mereka untuk membangun DOM dan membuatnya tetap sesuai dengan kondisi saat ini.

Kita akan mengeksplorasi *rendering* pada elemen React ke DOM dalam [bagian berikutnya](/docs/rendering-elements.html).

>**Saran:**
>
<<<<<<< HEAD
>Kami merokemendasikan Anda untuk mencari [skema sintaksis "Babel"](https://babeljs.io/docs/editors) untuk editor pilihan Anda sehingga baik kode ES6 dan JSX bisa di-*highlight* dengan benar.
=======
>We recommend using the ["Babel" language definition](https://babeljs.io/docs/en/next/editors) for your editor of choice so that both ES6 and JSX code is properly highlighted.
>>>>>>> 255497f12fa00d231b5af5d5aa34fa5beffac9e4
