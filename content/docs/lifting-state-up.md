---
id: lifting-state-up
title: Memindahkan State ke Atas
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Seringkali, beberapa komponen perlu mencerminkan perubahan data yang sama. Kami menyarankan untuk memindah `state` yang digunakan bersama tersebut ke modul _parent_ terdekat yang dimiliki komponen-komponen terkait. Mari kita lihat bagaimana ini bekerja dalam aksi.

Di bagian ini, kita akan membuat kalkulator suhu yang menghitung apakah air akan mendidih pada suhu tertentu.

Kita akan memulai dengan komponen bernama `BoilingVerdict`. Komponen tersebut akan menerima suhu `celsius` sebagai *prop*, dan menentukan apakah suhu cukup untuk membuat air mendidih:

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>Air akan mendidih.</p>;
  }
  return <p>Air tidak akan mendidih.</p>;
}
```

Selanjutnya, kita akan menampilkan komponen bernama `Calculator`. Komponen tersebut menampilkan `<input>` yang memungkinkan Anda memasukkan suhu, dan menyimpan nilainya di `this.state.temperature`.

Selain itu, ini menampilkan `BoilingVerdict` untuk nilai masukan saat ini.

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## Menambahkan Masukan Kedua {#adding-a-second-input}

Syarat baru dari kita adalah selain masukan Celcius, kita juga memberikan masukan Fahrenheit, dan kedua masukan tersebut harus tetap sinkron.

Kita dapat memulai dengan mengeluarkan komponen `TemperatureInput` dari `Calculator`. Kita akan menambahkan *prop* `scale` baru pada komponen tersebut yang dapat bernilai `"c"` atau `"f"`:

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Masukkan temperatur dalam skala {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Kita sekarang dapat mengubah `Calculator` untuk membuat dua masukan suhu terpisah:

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

Kita memiliki dua masukan sekarang, tetapi ketika Anda memasukkan suhu di salah satunya, yang lain tidak diperbarui. Ini bertentangan dengan syarat kita: kita ingin tetap menyinkronkannya.

Kita juga tidak dapat menampilkan `BoilingVerdict` dari `Calculator`. `Calculator` tidak tahu suhu saat ini karena suhu tersebut tersembunyi di dalam `TemperatureInput`.

## Menulis Fungsi Konversi {#writing-conversion-functions}

Pertama, kita akan menulis dua fungsi untuk mengkonversi suhu dari Celsius ke Fahrenheit dan sebaliknya:

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

Dua fungsi ini akan mengkonversi angka. Kita akan menulis fungsi lain yang menggunakan fungsi *string* `temperature` dan fungsi konverter sebagai argumen dan mengembalikan string. Kita akan menggunakannya untuk menghitung nilai dari suatu masukan bersarakan masukan lainnya.

Ini mengembalikan *string* kosong pada `temperature` yang tidak valid, dan itu membuat keluaran dibulatkan ke tempat desimal ketiga:

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

Misalnya, `tryConvert('abc', toCelsius)` menghasilkan *string* kosong, dan `tryConvert('10.22', toFahrenheit)` menghasilkan `'50.396'`.

## Memindahkan State ke Atas {#lifting-state-up}

Saat ini, kedua komponen `TemperatureInput` secara independen menyimpan nilainya di `state` lokal:

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...
```

Namun, kita ingin kedua masukan selaras satu sama lain. Ketika kita memperbarui masukan Celcius, masukan Fahrenheit harus mencerminkan suhu yang dikonversi, dan sebaliknya.

Dalam React, *state* bersama dicapai dengan memindahkannya ke komponen induk bersama terdekat dari komponen yang membutuhkannya. Ini disebut "memindahkan *state* ke atas". Kita akan menghapus *state* lokal dari `TemperatureInput` dan memindahkannya ke `Calculator` sebagai gantinya.

Jika `Calculator` memiliki *state* bersama, *state* tersebut akan menjadi "sumber kebenaran" untuk suhu saat ini di kedua masukan. Ini dapat menginstruksikan kedua input untuk memiliki nilai yang konsisten satu sama lain. Karena kedua `props` pada komponen `TemperatureInput` berasal dari komponen `Calculator` induk yang sama, kedua masukan akan selalu sinkron.

Mari kita lihat bagaimana ini bekerja selangkah demi selangkah.

Pertama, kita akan ganti `this.state.temperature` dengan `this.props.temperature` di komponen `TemperatureInput`. Untuk saat ini, mari kita berpura-pura `this.props.temperature` sudah ada, meskipun kita harus menampilkannya dari `Calculator`:

```js{3}
  render() {
    // Before: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

Kita tahu bahwa [*props* bersifat *read-only*](/docs/components-and-props.html#props-are-read-only). Ketika `temperature` berada di *state* lokal, `TemperatureInput` bisa memanggil `this.setState()` untuk mengubahnya. Namun, karena sekarang `temperature` berasal dari induknya sebagai sebuah `prop`, `TemperatureInput` tidak memiliki kendali atasnya.

Dalam React, ini biasanya diselesaikan dengan membuat komponen "dikendalikan". Sama seperti *DOM* `<input>` menerima kedua `value` dan `onChange` *prop*, begitu juga dapat menyesuaikan `TemperatureInput` menerima kedua `temperature` dan `onTemperatureChange` *props* dari `Calculator` sebagai induknya.

Sekarang, ketika `TemperatureInput` ingin memperbarui suhunya, ia memanggil `this.props.onTemperatureChange`:

```js{3}
  handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Catatan:
>
>Tidak ada arti khusus untuk salah satu `temperature` atau `onTemperatureChange` nama *prop* dalam komponen khusus. Kita bisa memanggil mereka apapun, seperti memberi nama mereka `value` dan `onChange` yang merupakan konvensi umum.

*Prop* `onTemperatureChange` akan diberikan bersama-sama dengan  *prop* `temperature` oleh komponen induk `Calculator`. Fungsi ini akan menangani perubahan dengan memodifikasi *state* lokalnya sendiri, sehingga menampilkan ulang kedua masukan dengan nilai-nilai baru. Kita akan segera melihat implementasi `Calculator` yang baru.

Sebelum melihat perubahan di `Calculator`, mari kita rekap perubahan kita ke komponen `TemperatureInput`. Kita telah menghapus *state* lokal darinya, dan alih-alih membaca `this.state.temperature`, kita sekarang membaca `this.props.temperature`. Alih-alih memanggil `this.setState()` saat kita ingin melakukan perubahan, kita sekarang memanggil `this.props.onTemperatureChange()`, yang akan disediakan oleh `Calculator`:

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Masukkan temperatur dalam skala {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Sekarang mari kita beralih ke komponen `Calculator`.

Kita akan menyimpan masukan `temperature` saat ini dan `scale` dalam *state* lokal. Ini adalah kondisi yang kita "angkat" dari masukan, dan itu akan berfungsi sebagai "sumber kebenaran" untuk keduanya. Ini adalah representasi minimal dari semua data yang perlu kita ketahui untuk membuat kedua masukan.

Misalnya, jika kita memasukkan 37 ke dalam masukan Celcius, *state* pada komponen `Calculator` akan menjadi:

```js
{
  temperature: '37',
  scale: 'c'
}
```

Jika nanti kita mengubah kolom Fahrenheit menjadi 212, state pada `Calculator` akan menjadi:

```js
{
  temperature: '212',
  scale: 'f'
}
```

Kita bisa menyimpan nilai dari kedua masukan tetapi tidak perlu. Cukup untuk menyimpan nilai masukan yang terakhir diubuah, dan skala yang diwakilinya. Kita kemudian dapat menyimpulkan nilai masukan lain berdasarkan alur `temperature` dan `scale` sendiri.

Masukan tetap sinkron karena nilainya dihitung dari *state* yang sama:

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

Sekarang, tidak peduli apabila masukan berubah, `this.state.temperature` dan `this.state.scale` dalam `Calculator` akan diperbarui. Salah satu masukan mendapatkan nilai apa adanya, sehingga setiap masukan pengguna dipertahankan, dan nilai masukan lainnya selalu dihitung ulang berdasarkan masukan.

Mari kita rekap apa yang terjadi ketika Anda mengubah masukan:

* React memanggil fungsi yang disebut `onChange` pada DOM `<input>`. Dalam kasus kita, ini adalah metode `handleChange` dalam komponen `TemperatureInput`.
* Metode `handleChange` dalam komponen `TemperatureInput` memanggil `this.props.onTemperatureChange()` dengan nilai baru. Itu merupakan *props*, termasuk `onTemperatureChange`, disediakan oleh komponen induknya, `Calculator`.
* Ketika sebelumnya di-*render*, `Calculator` telah menentukan bahwa `onTemperatureChange` dari `TemperatureInput` Celcius adalah metode `handleCelsiusChange` milik `Calculator`, dan `onTemperatureChange` dari `TemperatureInput` Fahrenheit adalah metode `handleFahrenheitChange` milik `Calculator`. Jadi salah satu dari dua metode `Calculator` dipanggil tergantung pada masukan yang kita ubah.
* Di dalam metode ini, komponen `Calculator` meminta React untuk mengulang *render* dengan memanggil `this.setState()` dengan nilai masukan baru dan skala masukan saat ini yang baru saja kita ubah.
* React memanggil komponen `Calculator` metode `render` untuk mempelajari seperti apa tampilan antarmuka pengguna. Nilai kedua masukan dihitung berdasarkan suhu saat ini dan skala aktif. Konversi suhu dilakukan di sini.
* React memanggil metode `render` pada komponen `TemperatureInput` individual dengan *props* baru yang ditentukan oleh `Calculator`. Mreka kemduain mempelajari seperti apa tampilan antarmuka pengguna mereka.
* React memanggil metode `render` pada komponen `BoilingVerdict`, melewati suhu dalam Celcius sebagai *props*.
* React DOM memperbarui dengan vonis didih dan untuk mencocokan nilai masukan yang diinginkan. Masukan yang baru saja kita ubah menerima nilainya saat ini, dan masukan lainnya diperbarui ke suhu setelah konversi.

Setiap pembaruan melewati langkah yang sama sehingga masukan tetap sinkron.

## Pelajaran yang Dipetik {#lessons-learned}

Seharusnya ada "sumber kebenaran" tunggal untuk setiap data yang berubah dalam aplikasi React. Biasanya, *state* ditambahkan pertama kali ke komponen yang membutuhkannya untuk di-*render*. Kemudian, jika komponen lain juga membutuhkannya, Anda dapat memindahkan *state* ke komponen induk bersama terdekat. Alih-alih mencoba menyinkronkan *state* antara komponen yang berbeda, Anda harus mengandalkan [aliran data dari atas kebawah](/docs/state-and-lifecycle.html#the-data-flows-down).

Pengangkatan *state* melibatkan penulisan lebih banyak kode "*boilerplate*" daripada pendekatan pengikatan dua arah, tetapi sebagai manfaat, dibutuhkan lebih sedikit pekerjaan untuk menemukan dan mengisolasi *bug*. Karena tiap *state* akan "hidup" di sebuah komponen dan hanya komponen itu sendiri yang dapat mengubahnya, area permukaan untuk *bug* akan sangat berkurang. Selain itu, Anda dapat menerapkan logika khusus apa pun untuk menolak atau mengubah masukan pengguna.

Jika sesuatu dapat diturunkan dari *props* atau *state*, hal itu mungkin tidak sebaiknya berada di *state*. Sebagai contoh, alih-alih menyimpan keduanya `celsiusValue` dan `fahrenheitValue`, kita menyimpan hanya `temperature` yang terakhir diubah dan `scale`-nya. Nilai dari masukan lain selalu dapat dihitung dari kedua nilai tersebut dalam metode `render()`. Ini memungkinkan kita menghapus atau menerapkan pembulatan ke masukan lain tanpa kehilangan ketepatan pada masukan pengguna.

<<<<<<< HEAD
Ketika Anda melihat sesuatu yang salah di antarmuka pengguna, Anda dapat menggunakan [React Developer Tools](https://github.com/facebook/react/tree/master/packages/react-devtools) untuk memeriksa *props* dan menelusuri *tree* komponen Anda ke atas sampai Anda menemukan komponen yang bertanggung jawab untuk memperbarui *state*. Ini memungkinkan Anda melacak *bug* ke sumbernya:
=======
When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react/tree/main/packages/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:
>>>>>>> 20f0fe280f3c122df7541256b983c46e21e33b20

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

