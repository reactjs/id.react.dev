---
id: composition-vs-inheritance
title: Komposisi vs Pewarisan
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React memiliki model/gaya komposisi yang cukup *powerful*, dan kami merekomendasikan penggunaan komposisi dibandingkan pewarisan (*inheritance*) untuk menggunakan kembali kode antar komponen.

Pada bagian ini, kita akan melihat beberapa kasus di mana para pengembang yang baru mengenal React sering kali akan mencoba menerapkan pewarisan, dan kami akan menunjukkan bagaimana kita dapat menyelesaikan kasus-kasus tersebut dengan komposisi.

## Kontainmen {#containment}

Beberapa komponen tidak serta-merta mengetahui komponen anak mereka (*children*) ketika mereka didefinisikan. Kasus ini umum terjadi khususnya untuk komponen seperti `Sidebar` atau `Dialog` yang merepresentasikan komponen "kotak" biasa.

Kami merekomendasikan komponen-komponen seperti ini untuk menggunakan *props* spesial bernama `children` untuk menambahkan elemen-elemen anak secara langsung di keluaran mereka:

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

Ini memungkinkan komponen lain untuk menambahkan komponen anak apapun dengan menyarangkan JSX seperti ini:

```js{4-9}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Selamat Datang
      </h1>
      <p className="Dialog-message">
        Terima kasih telah mengunjungi pesawat luar angkasa kami!
      </p>
    </FancyBorder>
  );
}
```

**[Coba di CodePen](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)**

Apapun yang berada di dalam tag JSX `<FancyBorder>` akan dioper ke komponen `FancyBorder` sebagai *props* `children`. Karena `FancyBorder` me-*render* `{props.children}` di dalam sebuah `<div>`, elemen yang dioper tersebut akan muncul di hasil keluaran akhirnya.

Walaupun kasus seperti ini jarang terjadi, terkadang Anda mungkin membutuhkan beberapa "lubang" di dalam sebuah komponen. Dalam kasus seperti ini Anda dapat menggunakan konvensi Anda sendiri alih-alih menggunakan `children`:

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

Elemen-elemen React seperti `<Contacts />` dan `<Chat />` sebenarnya hanya objek biasa, oleh karenanya Anda dapat mengoper mereka sebagai *props* selayaknya data lain. Pendekatan ini mungkin mengingatkan Anda dengan "slot" di *library* lain namun tidak ada batasan apapun mengenai apa yang dapat Anda oper sebagai *props* di React.

## Spesialisasi {#specialization}

Terkadang kita menganggap beberapa komponen sebagai "kasus spesial" dari komponen lainnya. Sebagai contoh, kita dapat menganggap sebuah komponen `WelcomeDialog` sebagai kasus spesial dari `Dialog`.

Di React, kasus seperti ini juga dapat diselesaikan dengan komposisi, di mana sebuah komponen yang lebih "spesifik" me-*render* sebuah komponen yang lebih "umum" dan mengkonfigurasinya menggunakan *props*:

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Selamat Datang"
      message="Terima kasih telah mengunjungi pesawat luar angkasa kami!" />
  );
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

Komposisi juga bekerja sama baiknya untuk komponen yang didefinisikan menggunakan kelas:

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Program Eksplorasi Mars"
              message="Bagaimana kami memanggil Anda?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Daftarkan Saya!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Selamat Datang, ${this.state.login}!`);
  }
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## Lalu Bagaimana Dengan Pewarisan? {#so-what-about-inheritance}

Di Facebook, kami telah menggunakan React untuk ribuan komponen, dan kami belum menemukan satu pun kasus di mana kami merekomendasikan pembuatan komponen secara pewarisan.

*props* dan komposisi memberikan Anda semua fleksibilitas yang Anda butuhkan untuk mengkustomisasi tampilan dan perilaku sebuah komponen secara eksplisit dan aman. Perlu diingat bahwa komponen dapat menerima *props* apapun, termasuk nilai-nilai primitif, elemen React, atau fungsi.

Jika Anda berniat untuk menggunakan kembali fungsionalitas yang bersifat non-antarmuka pengguna, kami menyarankan agar Anda mengekstraknya ke dalam sebuah modul JavaScript terpisah. Komponen kemudian dapat mengimpornya untuk menggunakan fungsi, objek, atau kelas tersebut, tanpa perlu mewarisinya.
