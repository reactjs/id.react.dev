---
title: Menulis Markup dengan JSX
---

<Intro>

JSX adalah perpanjangan sintaksis untuk menulis kode seperti *HTML* dalam file JavaScript. Meskipun ada beberapa cara lain, JSX lebih dipilih oleh sebagian besar *developer* React dan *codebase* karena kepadatannya.

</Intro>

<YouWillLearn>

* Mengapa React mencampur *markup* dan logika *render*
* Perbedaan JSX dengan HTML
* Cara menampilkan informasi menggunakan JSX

</YouWillLearn>

## JSX: Meletakkan markup ke JavaScript {/*jsx-putting-markup-into-javascript*/}

Website selama ini terbuat dari HTML, CSS, dan JavaScript. Selama bertahun-tahun, pengembang *website* menaruh konten di HTML, desain di CSS, dan logika di JavaScript—tidak jarang di *file* yang berbeda! Konten dibangun di HTML sedangkan logika halaman disimpan secara terpisah dalam JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="markup HTML dengan latar belakang berwarna ungu dan sebuah div dengan dua children tag: p dan form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Tiga fungsi  JavaScript dengan latar belakang kuning: onSubmit, onLogin, and onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Namun, seiring dengan situs yang makin iteraktif, logika semakin menentukan konten. JavaScript mengatur HTML! Inilah mengapa **dalam React, logika *render* dan *markup* berada di satu tempat yang sama—komponen.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="Komponen React dengan HTML dan JavaScript digabung dari contoh sebelumnya. Fungsi bernama Sidebar yang memanggil fungsi isLoggedIn, berwarna kuning. Tag p dari sebelumnya bersarang dalam fungsi berwarna ungu, dan sebuah tag Form mereferensi ke komponen yang ada di diagram berikutnya.">

Komponen React `Sidebar.js`

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="Komponen React dengan HTML dan JavaScript dari contoh sebelumnya digabung. Fungsi bernama Form memiliki dua handler onClick dan onSubmit berwarna kuning. Setelah itu diikuti oleh HTML berwarna ungu. HTML tersebut memiliki elemen form dan elemen input di dalamnya, masing-masing dengan prop onClick.">

Komponen React `Form.js`

</Diagram>

</DiagramGroup>

Menggabungkan logika *render* dan *markup* untuk sebuah tombol memastikan mereka tersinkronasi dengan satu sama lain pada tiap perubahan. Sebaliknya, detil yang tidak berhubungan, *markup* untuk tombol dan *sidebar*, juga tidak terhubung dengan satu sama lain, membuat perubahan masing-masing menjadi lebih aman.

Masing-masing komponen React adalah fungsi JavaScript yang bisa memiliki *markup* yang di-*render* oleh React ke peramban. Komponen React menggunakan ekstensi sitaksis yang bernama JSX untuk merepresentasikan *markup* tersebut. JSX terlihat sangat mirip dengan HTML, namun lebih ketat dan dapat menampilkan informasi secara dinamis. Cara terbaik untuk memahami JSX adalah dengan langsung mengubah beberapa *markup* HTML menjadi JSX.

<Note>

JSX dan React adalah dua hal yang berbeda. Mereka masing-masing digunakan secara bersama, namun anda *dapat* [digunakan sendiri secara independen](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform). 
JSX merupakan ekstensi sintaks, sedangkan React adalah *library* JavaScript.

</Note>

## Mengubah HTML menjadi JSX {/*converting-html-to-jsx*/}

Anggap anda memiliki HTML yang alid:

```html
<h1>Daftar Tugas Putri</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Putri" 
  class="photo"
>
<ul>
    <li>Mengerjakan PR
    <li>Pergi belanja
    <li>Minum vitamin
</ul>
```

Dan anda ingin meletakkannya di komponen:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Jika anda salin dan tempel secara langsung, maka dia tidak akan bekerja:


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Daftar Tugas Putri</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Putri" 
      class="photo"
    >
    <ul>
      <li>Mengerjakan PR
      <li>Pergi belanja
      <li>Minum vitamin
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

Ini dikarenakan JSX lebih ketat dan memiliki banyak peraturan dibandingkan HTML! Jika anda membaca pesan *error* yang tertera, pesan tersebut akan mengarahkanmu untuk memperbaiki *markup*, atau anda bisa mengikuti panduan berikut.

<Note>

Umumnya, pesan *error* pada React akan memandu anda mencari sumber masalah yang ada di kode. Jangan lupa membaca pesan *error* jika anda *stuck*!

</Note>

## Aturan JSX {/*the-rules-of-jsx*/}

### 1. Hanya mengembalikan satu elemen {/*1-return-a-single-root-element*/}

Untuk mengembalikan lebih dari satu elemen, **bungkus mereka dengan satu tag *parent*.**

Contohnya, anda dapat menggunakan tag `<div>`:

```js {1,11}
<div>
  <h1>Daftar Tugas Putri</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Putri" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


Jika anda tidak ingin menambahkan `<div>` pada *markup*, anda dapat `<>` dan `</>` saja:

```js {1,11}
<>
  <h1>Daftar Tugas Putri</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Putri" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

*Tag* kosong di atas disebut *[Fragment.](/reference/react/Fragment)* *Fragments* dapat menggabungkan beberapa *tag* tanpa memasukkan *tag* tersebut ke bagian dari HTML.

<DeepDive>

#### Mengapa beberapa tag JSX perlu dibungkus? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX mirip dengan HTML, namun di balik layar, mereka berubah menjadi objek *literal* JavaScript. Anda tidak bisa mengembalikan dua objek dari sebuah fungsi tanpa membungkus mereka ke sebuah senarai. Inilah mengapa anda juga tidak bisa mengembalikan dua *tag* JSX tanpa membungkus mereka menjadi sebuah *fragment*.

</DeepDive>

### 2. Tutup semua tag {/*2-close-all-the-tags*/}

Semua *tag* JSX harus dapat ditutup: *tag* tunggal seperti `<img>` harus ditulis `<img />`, dan *tag* ganda seperti `<li>oranges` harus ditulis `<li>oranges</li>`.

Berikut adalah gambar dan daftar tugas Putri dengan *tag* ganda:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Putri" 
    class="photo"
   />
  <ul>
    <li>Mengerjakan PR</li>
    <li>Pergi Belanja</li>
    <li>Minum vitamin</li>
  </ul>
</>
```

### 3. Ubah <s>semua</s> sebagian menjadi camelCase! {/*3-camelcase-salls-most-of-the-things*/}

JSX berubah menjadi JavaScript dan atribut yang dituis di JSX menjadi *key* pada objek di JavaScript. Dalam komponen, atribut akan lebih mudah dibaca sebagai *variable*. Namun JavaScript memiliki beberapa batasan dalam menamai *variable*. Contohnya, nama *variable* tidak boleh terdiri dari karakter minus dan tidak boleh menggunakan nama pesanan tertentu seperti `class`.

Inilah mengapa di React, banyak atribut HTML dan SVG ditulis secara camelCase. Contohnya, `stroke-width` dapat ditulis sebagai `strokeWidth`. Dan karena `class` merupakan nama pesanan, di React kita menulisnya sebagai `className`, dinamakan sesuai dengan [versi DOM-nya](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Putri" 
  className="photo"
/>
```

Anda dapat [mencari semua atribut pada list DOM component berikut.](/reference/react-dom/components/common) Jika ada yang salah, jangan takut—React akan menampilkan pesan dengan koreksi ke [konsol di peramban.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

Untuk beberapa alasan, atribut [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) dan [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) ditulis menggunakan tanda minus.

</Pitfall>

### Tip: Gunakan JSX Converter {/*pro-tip-use-a-jsx-converter*/}

Mengubah atribut di markup yang sudah ada bisa menjadi membosankan! Kami sarankan untuk menggunakan *[converter](https://transform.tools/html-to-jsx)* untuk mengubah HTML dan SVG-mu menjadi JSX.
Converters are very useful in practice, but it's still worth understanding what is going on so that you can comfortably write JSX on your own.

Berikut hasil jadinya:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Daftar Tugas Putri</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Putri" 
        className="photo" 
      />
      <ul>
        <li>Mengerjakan PR</li>
        <li>Pergi Belanja</li>
        <li>Minum vitamin</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

Sekarang anda paham mengapa ada JSX dan cara menggunakannya pada komponen:

* Komponen React menggabungkan logika *render* dengan *markup* karena mereka berkaitan.
* JSX mirip dengan HTML, dengan beberapa perbedaan. Anda bisa menggunakan [converter](https://transform.tools/html-to-jsx) jika diperlukan.
* Pesan error umumnya mengarahkan anda ke sumber masalah pada *markup*.

</Recap>



<Challenges>

#### Mengubah beberapa HTML menjadi JSX {/*convert-some-html-to-jsx*/}

HTML berikut telah disalin ke sebuah komponen, tapi bukan JSX yang valid. Coba perbaiki:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Selamat datang di website saya!</h1>
    </div>
    <p class="summary">
      Anda dapat membaca uneg-unegku di sini.
      <br><br>
      <b>Juga ada <i>foto</b></i> ilmuwan!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Antara melakukannya dengan manual atau menggunakan *converter*, terserah Anda!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Selamat datang di website saya!</h1>
      </div>
      <p className="summary">
        Anda dapat menemukan pemikiran saya di sini.
        <br /><br />
        <b>Juga ada <i>foto-foto</b></i>para ilmuwan!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
