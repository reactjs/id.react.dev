---
id: handling-events
title: Penanganan Events
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

Menangani *events* dengan elemen React sangat mirip seperti menangani sebuah *events* pada elemen DOM. Ada beberapa perbedaan sintaksis:

* *Events* pada React biasanya ditulis dalam bentuk *camelCase*, bukan *lowercase*.
* Dengan JSX Anda dapat mengoper *function* sebagai *event handler*, bukan sebagai *string*.

Sebagai contoh pada HTML berikut ini:

```html
<button onclick="activateLasers()">
  Aktivasi Laser
</button>
```

sedikit berbeda dengan React:

```js{1}
<button onClick={activateLasers}>
  Aktivasi Laser
</button>
```

<<<<<<< HEAD
Perbedaan lainnya adalah Anda tidak dapat mengembalikan nilai `false` untuk mencegah *behavior* bawaan React. Anda harus memanggil `preventDefault` secara eksplisit. Sebagai contoh, pada HTML untuk mencegah agar *link* bawaan membuka halaman baru, Anda dapat menulis seperti ini:
=======
Another difference is that you cannot return `false` to prevent default behavior in React. You must call `preventDefault` explicitly. For example, with plain HTML, to prevent the default form behavior of submitting, you can write:
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

```html
<form onsubmit="console.log('You clicked submit.'); return false">
  <button type="submit">Submit</button>
</form>
```

Sedangkan pada React, contoh tersebut dapat ditulis sebagai berikut:

```js{3}
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
<<<<<<< HEAD
    console.log('Tautan diklik.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Klik Saya
    </a>
=======
    console.log('You clicked submit.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c
  );
}
```

Di sini, `e` adalah sebuah *event* tiruan. React mendefinisikan event tiruan ini berdasarkan [W3C spec](https://www.w3.org/TR/DOM-Level-3-Events/), jadi Anda tidak perlu khawatir akan kesesuaian antar lintas *browser*. _Event_ dalam React tidak bekerja secara sama dengan _event_ _native_ dari _browser. Lihat referensi pada [`SyntheticEvent`](/docs/events.html) untuk panduan belajar lebih jauh.

Ketika menggunakan React, pada umumnya Anda tidak perlu memanggil `addEventListener` untuk menambahkan *listener* pada elemen DOM setelah dibuat. Sebagai gantinya, cukup berikan *listener* ketika elemen pertama kali di-*render*.

Ketika Anda mendefinisikan sebuah komponen dengan menggunakan [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes), pada umumnya penanganan *event* sebagai sebuah *method* dalam *class*. Sebagai contoh, komponen `Toggle` ini me-*render* sebuah tombol yang memungkinkan pengguna untuk mengubah kondisi "ON" dan "OFF" pada sebuah *state*:

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // cara binding seperti ini diperlukan untuk membuat `this` dapat berfungsi -
    // pada callback binding
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
```

[**Coba di CodePen**](http://codepen.io/gaearon/pen/xEmzGg?editors=0010)

Anda harus berhati-hati terhadap makna dari `this` pada JSX *callbacks*. Dalam JavaScript, *class method* tidak [terikat](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) secara bawaan. Jika Anda lupa untuk melakukan *binding* `this.handleClick` dan mengoperkan pada `onClick`, maka `this` akan menjadi `undefined` ketika sebuah *function* telah dipanggil. 

Ini bukan *behavior* yang spesifik pada React, tetapi ini merupakan bagian dari [bagaimana *functions* dalam JavaScript bekerja](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). Pada umumnya jika Anda mendefinisikan sebuah *method* tanpa diakhiri dengan `()`, seperti `onClick={this.handleClick}`, maka Anda harus melakukan *binding* terhadap *method* tersebut.

Jika Anda tidak terbiasa menggunakan `bind`, ada dua cara untuk mengatasi ini. Jika Anda menggunakan sintaksis eksperimental [public class fields](https://babeljs.io/docs/plugins/transform-class-properties/), Anda dapat menggunakan *class fields* untuk melakukan *binding* terhadap *callbacks*:

```js{2-6}
class LoggingButton extends React.Component {
  // Sintaksis ini memastikan `this` telah terikat dalam handleClick.
  // Peringatan: Ini adalah eksperimental sintaksis.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Klik Saya
      </button>
    );
  }
}
```

Sintaksis ini telah diakfifkan secara bawaan pada [Create React App](https://github.com/facebookincubator/create-react-app).

Jika Anda tidak menggunakan sintaksis *class fields*, Anda dapat menggunakan [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) pada *callback*:

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // Sintaksis ini memastikan `this` telah terikat dalam handleClick.
    return (
      <button onClick={() => this.handleClick()}>
        Klik Saya
      </button>
    );
  }
}
```

Masalah pada sintaksis tersebut adalah *callback* yang berbeda dibuat setiap kali `LoggingButton` di-*render*. Dalam banyak kasus, hal ini tidak masalah. Akan tetapi, jika callback tersebut mengoperkan sebagai *props* kepada komponen yang lebih rendah, maka komponen tersebut mungkin akan melakukan ekstra *render* ulang. Kita umumnya merekomendasikan *binding* dilakukan pada *constructor* atau menggunakan sintaksis *class fields*, untuk menghindari masalah kinerja seperti ini.

## Mengoper Argumen ke dalam Penanganan Event {#passing-arguments-to-event-handlers}

Di dalam perulangan, umumnya Anda ingin mengoper sebuah parameter ekstra kedalam penanganan *event*. Sebagai contoh, jika `id` sama dengan ID baris, maka salah satu dari kedua contoh berikut dapat dijalankan:

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

Dua baris di atas memiliki arti yang sama, masing-masing menggunakan [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) dan [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind).

Dalam kedua kasus tersebut, argumen `e` merepresentasikan *event* React yang akan dioper sebagai argumen kedua setelah ID. Dengan *arrow function*, kita harus mengeoperkan secara eksplisit, namun dengan `bind` segala argumen setelahnya akan diteruskan secara otomatis.
