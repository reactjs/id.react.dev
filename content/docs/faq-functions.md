---
id: faq-functions
title: Mengoper fungsi-fungsi ke dalam komponen
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### Bagaimana saya mengoper event handler (seperti onClick) ke sebuah komponen? {#how-do-i-pass-an-event-handler-like-onclick-to-a-component }

Anda bisa melakukannya dengan cara meletakkan __event handlers__ dan fungsi-fungsi lain sebagai props untuk child components:

```jsx
<button onClick={this.handleClick}>
```

Jika Anda butuh akses ke _parent component_ pada _handler_ tersebut, maka Anda juga harus mem-_bind_ fungsi tersebut pada _component instance_ (lihat di bawah).

### Bagaimana saya mem-bind fungsi ke sebuah component instance {#how-do-i-bind-a-function-to-a-component-instance}

Ada beberapa cara untuk membuat fungsi memiliki akses terhadap atribut komponen seperti `this.props` dan `this.state`, tergantung pada sintaksis mana dan _build steps_ seperti apa yang Anda gunakan.

#### _Bind_ di dalam Konstruktor (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

#### Class Properties (Stage 3 Proposal) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // Note: this syntax is experimental and not standardized yet.
  handleClick = () => {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

#### _Bind_ di dalam _Render_ {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click Me</button>;
  }
}
```

>Catatan:**
>
>Menggunakan `Function.prototype.bind` di dalam _render_ akan membuat fungsi baru setiap kali komponen ter-_render_, yang akan mempengaruhi performa (lihat di bawah).

#### Arrow Function dalam Method Render {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Click Me</button>;
  }
}
```

>Catatan:**
>
>Menggunakan arrow function di dalam method render akan menyebabkan program membuat fungsi baru setiap kali component ter-render. Hal ini akan berpengaruh terhadap performa (akan dibahas di bagian selanjutnya)


### Apakah tidak ada masalah menggunakan arrow function di metode render {#is-it-ok-to-use-arrow-functions-in-render-methods}

Secara umum tidak ada masalah, dan terkadang inilah cara termudah untuk mengoper parameter pada fungsi callback.

Adapun demikian, jika Anda menemukan masalah dengan performa program, Anda perlu melakukan optimasi.


### Mengapa binding diperlukan? {#why-is-binding-necessary-at-all}

Dalam JavaScript, kedua contoh kode ini **tidak** sama (memiliki makna berbeda):

```js
obj.method();
```

```js
var method = obj.method;
method();
```

Melakukan binding pada method membantu kita untuk memastikan bahwa contoh kode kedua akan berjalan persis seperti contoh kode pertama.

Pada React, biasanya Anda hanya perlu melakukan binding method jika method tersebut diberikan pada komponen lain. Sebagai contoh, `<button onClick={this.handleClick}>` mengoper `this.handleClick` pada komponen button, sehingga Anda perlu melakukan binding. Adapun demikian, kita tidak perlu melakukan binding method `render` atau binding method-method bawaan lainnya (lifecycle method) karena kita tidak mengoper method-method tersebut pada komponen lain.

[Artikel oleh Yehuda Katz](http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) menjelaskan apa itu binding, dan bagaimana cara kerja fungsi di dalam JavaScript secara detail.


### Mengapa fungsi saya dijalankan setiap kali component di-render (bukan saat event terkait)? {#why-is-my-function-being-called-every-time-the-component-renders}

Pastikan Anda tidak menjalankan fungsi saat mengopernya pada component (Perhatikan tanda kurungnya):

```jsx
render() {
  // Wrong: handleClick is called instead of passed as a reference!
  return <button onClick={this.handleClick()}>Click Me</button>
}
```

Cara yang benar untuk mengoper fungsi adalah sebagai berikut (tanpa tanda kurung):

```jsx
render() {
  // Correct: handleClick is passed as a reference!
  return <button onClick={this.handleClick}>Click Me</button>
}
```

### Bagaimana saya mengoper parameter pada sebuah event handler atau callback? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

Anda bisa menggunakan arrow function untuk membungkus event handler dan mengoper parameter:

```jsx
<button onClick={() => this.handleClick(id)} />
```

Hal tersebut sama dengan melakukan `.bind`:

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### Contoh: Mengoper parameter menggunakan arrow function {#example-passing-params-using-arrow-functions}

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### Contoh: Mengoper parameter menggunakan data-attributes {#example-passing-params-using-data-attributes}

Cara yang lain, Anda bisa memakai DOM API untuk menyimpan data yang dibutuhkan untuk event handler. Pertimbagnkan cara ini jika Anda harus mengoptimasi element dalam jumlah besar atau Anda harus merender struktur tree yang tergantung pada pengecekan kesamaan React.PureComponent

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### Bagaimana saya menghindari sebuah fungsi dipanggil terlalu cepat atau terpanggil berkali-kali secara berurutan? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

Jika Anda memiliki event handler seperti `onClick` atau `onScroll` dan Anda ingin mencegah callback dari event tersebut terpanggil terlalu cepat, maka Anda dapat melakukan pembatasan kecepatan pemanggilan fungsi callback. Hal tersebut dapat dilakukan menggunakan:

- **throttling**: Mengecek apakah ada perubahan dalam jangka waktu tertentu (contoh: [`_.throttle`](https://lodash.com/docs#throttle))
- **debouncing**: Mempublish perubahan setelah tidak ada aktivitas selama beberapa waktu (contoh: [`_.debounce`](https://lodash.com/docs#debounce))
- **`requestAnimationFrame` throttling**: Mengecek perubahan berdasarkan [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) (eg [`raf-schd`](https://github.com/alexreardon/raf-schd))

Silahkan melihat [gambar berikut](http://demo.nimius.net/debounce_throttle/) untuk mendapatkan perbandingan antara `throttle` dan `debounce`.

> Catatan:
>
> `_.debounce`, `_.throttle` dan `raf-schd` menyediakan metode `cancel` untuk membatalkan callback yang tertunda. Anda harus memanggil metode melalui `componentWillUnmount` _atau_ melakukan pengecekan untuk memastikan bahwa komponen yang dimasuksu masih dalam keadaan ter-mount selama penundaan eksekusi fungsi callback.

#### Throttle {#throttle}

Teknik throttling mencegah sebuah fungsi terpanggil beberapa kali dalam jangka waktu tertentu. Sebagai contoh, berikut adalah contoh throttle pada handler "click" untuk mencegah pemanggilan lebih dari sekali dalam waktu satu detik.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Load More</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

Teknik debouncing memastikan bahwa sebuah fungsi tidak akan dieksekusi setelah beberapa waktu sejak pemanggilan terakhir. Teknik ini akan berguna terutama jika kita harus melakukan perhitungan yang berat sebagai respon terhadap event yang terjadi berkali-kali dalam waktu yang singkat (misalnya scroll atau penekanan tombol keyboard). Berikut adalah contoh teknik debounce pada text input dengan penundaan sebesar 250 ms.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Search..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    // React pools events, so we read the value before debounce.
    // Alternately we could call `event.persist()` and pass the entire event.
    // For more info see reactjs.org/docs/events.html#event-pooling
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame` throttling {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) adalah sebuah cara untuk mengantrikan fungsi sehingga bisa dieksekusi oleh browser secara optimal untuk rendering. Sebuah fungsi yang diantrikan menggunakan `requestAnimationFrame` akan dijalankan pada frame selanjutnya. Secara normal, browser akan bekerja untuk memastikan bahwa akan ada 60 frame dalam waktu satu detik (60 fps). Namun, jika browser tidak mampu memenuhi standar tersebut, maka browser akan *membatasi* jumlah frame dalam satu detik. Sebagai contoh, sebuah device mungkin hanya mampu untuk melayani 30 fps. Menggunakan `requestAnimationFrame` untuk throttling adalah teknik yang berguna untuk membatasi supaya tidak ada lebih dari 60 perubahan dalam satu detik. Jika Anda melakukan 100 perubahan dalam satu detik, hal tersebut hanya akan membuat browser melakukan komputasi yang pada dasarnya tidak akan terlihat dari sisi user. Teknik throttling digunakan untuk mencegah hal tersebut.

>**Catatan:**
>
>Dengan menggunakan teknik ini, maka peramban hanya akan mengolah perubahan terakhir dalam satu _frame_. Anda dapat melihat contoh detil optimasinya di [`MDN`](https://developer.mozilla.org/en-US/docs/Web/Events/scroll)

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // Create a new function to schedule updates.
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // When we receive a scroll event, schedule an update.
    // If we receive many updates within a frame, we'll only publish the latest value.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Cancel any pending updates since we're unmounting.
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### Menguji pembatasan rate {#testing-your-rate-limiting}

Saat menguji apakah pembatasan _rate_ yang Anda terapkan sudah bekerja dengan baik, akan sangat membantu jika kita bisa mempercepat waktu. Jika Anda menggunakan [`jest`](https://facebook.github.io/jest/) maka Anda bisa menggunakan [`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html) untuk mempercepat waktu. Jika Anda menggunakan pelambatan `requestAnimationFrame` maka [`raf-stub`](https://github.com/alexreardon/raf-stub) juga akan berguna untuk mengendalikan jumlah _frame_ per detik.
