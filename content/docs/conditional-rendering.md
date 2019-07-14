---
id: conditional-rendering
title: Render Bersyarat
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

Pada React, Anda dapat membuat komponen berbeda yang mencakup perilaku yang dibutuhkan. Lalu, Anda dapat merender hanya beberapa bagian saja, berdasarkan _state_ dari aplikasi Anda.

Render Bersyarat pada React berfungsi sama halnya dengan operator bersyarat pada Javascript. Gunakan JavaScript operator seperti [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) atau [operator bersyarat](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) untuk membuat representasi elemen dari _state_ saat ini, dan React akan memperbarui UI sesuai dengan _state_ tersebut.

Perhatikan dua komponen ini:

```js
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

Kita akan membuat komponen `Greeting` yang menampilkan salah satu dari dua komponen diatas berdasarkan pada apakah pengguna telah login:

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**Coba di Codepen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

Contoh di atas merender komponen greeting yang berbeda berdasarkan nilai prop `isLoggedIn`.

### Variabel Elemen {#element-variables}

Anda dapat memakai variabel untuk menyimpan element. Hal ini akan membantu anda merender beberapa bagian pada komponen secara kondisional sementara output lainnya tidak berubah.

Perhatikan dua komponen baru yang merepresentasikan tombol Logout dan Login:

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

Pada contoh dibawah, kita akan membuat sebuah [komponen _stateful_](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) `LoginControl`.

Itu akan merender salah satu dari `<LoginButton />` atau `<LogoutButton />` berdasarkan _state_ saat ini. Itu juga akan merender `<Greeting />` dari contoh sebelumnya:

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**Coba di Codepen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

Saat mendeklarasikan sebuah variabel dan  menggunakan statement `if` merupakan cara yang baik merender komponen secara kondisional, terkadang Anda mungkin ingin memakai sintaksis pendek. Ada beberapa cara _iniline_ bersyarat pada JSX, dijelaskan dibawah.

### Inline If dengan Operator Logis && {#inline-if-with-logical--operator}

Anda mungkin [menyisipkan ekspresi pada JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) dengan cara membungkusnya ke dalam kurung kurawal. Juga memasukan operator logis `&&`. Itu dapat berguna untuk memasukan elemen secara kondisional:

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**Coba di Codepen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Itu akan bekerja karena dalam JavaScript, `true && expression` selalu mengevaluasi `true`, dan `false && expression` selalu mengevaluasi `false`.

Oleh karenanya, jika kondisi `true`, elemen tepat setelah `&&` akan muncul pada _output_. jika `false`, React akan mengabaikannya.

### Inline If-Else with Conditional Operator {#inline-if-else-with-conditional-operator}

Metode lain untuk merender _inline_ elemen secara kondisional ialah menggunakan operator kondisional JavaScript [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

Pada contoh di bawah, kita memakainya untuk merender sebuah _small block_ dari text secara kondisional.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

Itu juga dapat digunakan untuk ekspresi yang lebih besar meski terlihat kurang jelas apa yang terjadi:

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

Seperti pada Javascript, Terserah pada Anda untuk memilih gaya yang sesuai dengan apa yang anda dan tim anda rasa lebih mudah dibaca. Ingat juga bahwa saat kondisi menjadi terlalu kompleks, waktu yang tepat untuk [mengekstark sebuah komponen](/docs/components-and-props.html#extracting-components).

### Mencegah Komponen dari Rendering {#preventing-component-from-rendering}

Dalam kasus yang jarang terjadi, Anda mungkin ingin komponen menyembunyikan dirinya sendiri meskipun komponen itu dirender oleh komponen lain. Untuk melakukan ini, kembalikan `null` daripada merender _output_.

Pada contoh di bawah, `<WarningBanner />` dirender berdasarkan nilai dari _prop_ yang bernama `warn`. Jika nilai dari _prop_ `false`, maka komponen tidak dirender.

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**Coba di Codepen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Mengembalikan `null` dari metode `render` pada komponen tidak akan berdampak pada kerja metode siklus hidup komponen. Contohnya `componentDidUpdate` akan tetap dijalankan.
