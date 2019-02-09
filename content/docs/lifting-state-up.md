---
id: lifting-state-up
title: Mengangkat Ke Atas
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Seringkali, beberapa komponen perlu mencerminkan perubahan data yang sama. Kami menyarankan mengangkat `state` bersama ke modul utama terdekat. Mari kita lihat bagaimana ini bekerja dalam aksi.

Di bagian ini, kami akan membuat kalkulator suhu yang menghitung apakah air akan mendidih pada suhu tertentu.

Kami akan memulai dengan komponen bernama `BoilingVerdict`. Ini menerima `celsius` suhu sebagai `props`, dan mencetak apakah itu cukup untuk merebus air:

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>Air akan mendidih.</p>;
  }
  return <p>Air tidak akan mendidih.</p>;
}
```

Selanjutnya, kita akan membuat komponen bernama `Calculator`. Ini membuat `<input>` yang memungkinkan anda memasukan suhu, dan menyimpan nilainya di `this.state.temperature`.

Selain itu, ini membuat `BoilingVerdict` untuk nilai input saat ini.

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
        <legend>Masukan suhu dalam Celcius:</legend>
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

[**Cobalah di CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## Menambahkan Input Kedua {#adding-a-second-input}

Persyaratan baru kami adalah bahwa, selain input Celcius, kami memberikan input Fahrenheit dan mereka tetap sinkron.

Kita bisa memulai dengan mengekstraksi komponen `TemperatureInput` dari `Calculator`. Kami akan menambahkan `scale` *prop* baru untuk dapat berupa `"c"` atau `"f"`:

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
        <legend>Masukan temperatur dalam {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Kita sekarang dapat mengubah `Calculator` untuk membuat dua input suhu terpisah:

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

[**Cobalah di CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

Kami memiliki dua input sekarang, tetapi ketika anda memasukkan suhu di salah satu dari mereka, yang lain tidak memperbarui. Ini bertentangan dengan persyaratan kami: kami ingin tetap menyinkronkannya.

Kami juga tidak dapat menampilkan `BoilingVerdict` dari `Calculator`. `Calculator` tidak tahu suhu saat ini karena tersembunyi di dalam `TemperatureInput`.

## Penulisan Fungsi Konversi {#writing-conversion-functions}

Pertama, kita akan menulis dua fungsi untuk mengkonversi dari Celcius ke Fahrenheit dan kembali:

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

Dua fungsi ini mengkonversi angka. Kami akan menulis fungsi lain yang menggunakan fungsi *string* `temperature` dan fungsi konverter sebagai argumen dan mengembalikan string. Kami akan menggunakannya untuk menghitung nilai dari suatu input bersarakan input lainnya.

Ini mengembalikan string kosong pada `temperature` yang tidak valid, dan itu membuat *output* dibulatkan ke tempat desimal ketiga:

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

Misalnya, `tryConvert('abc', toCelsius)` mengembalikan string kosong, dan `tryConvert('10.22', toFahrenheit)` mengembalikan `'50.396'`.

## Mengangkat Ke Atas {#lifting-state-up}

Saat ini, kedua komponen `TemperatureInput` secara independen menjaga nilainya di `state` lokal:

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

Namun, kami ingin kedua input selaras satu sama lain. Ketika kami memperbarui input Celcius, input Fahrenheit harus mencerminkan suhu yang dikonversi, dan sebaliknya.

Dalam React, state bersama dicapai dengan memindahkannya ke module utama terdekat dari komponen yang membutuhkannya. Ini disebut "mengangkat keadaan". Kami akan menghapus state lokal dari `TemperatureInput` dan memindahkannya ke `Calculator` sebagai gantinya.

Jika `Calculator` memiliki state bersama, itu menjadi "sumber kebenaran" untuk suhu saat ini di kedua input. Ini dapat menginstruksikan mereka berdua untuk memiliki nilai yang konsisten satu sama lain. Karena kedua `props` pada komponen `TemperatureInput` berasal dari koponen `Calculator` induk yang sama, kedua input akan selalu sinkron.

Mari kita lihat bagaimana ini bekerja selangkah demi selangkah.

Pertama, kita akan ganti `this.state.temperature` dengan `this.props.temperature` di komponen `TemperatureInput`. Untuk saat ini, mari kita berpura-pura `this.props.temperature` sudah ada, meskipun kita harus meneruskannya dari `Calculator`:

```js{3}
  render() {
    // Sebelum: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

Kita tahu bahwa [props hanya bisa dibaca](/docs/components-and-props.html#props-are-read-only). Ketika `temperature` berada di state lokal, `TemperatureInput` hanya bisa memanggil `this.setState()` untuk mengubahnya. Namun, sekarang bahwa `temperature` berasal dari induknya sebagai `props`, `TemperatureInput` tidak memiliki kendali atasnya.

Dalam React, ini biasanya diselesaikan dengan membuat komponen "dikendalikan". Sama seperti *DOM* `<input>` menerima kedua `value` dan `onChange` prop, begitu juga dapat menyesuaikan `TemperatureInput` menerima kedua `temperature` dan `onTemperatureChange` props dari `Calculator` sebagai induknya.

Sekarang, ketika `TemperatureInput` ingin memperbarui suhunya, ia memanggil `this.props.onTemperatureChange`:

```js{3}
  handleChange(e) {
    // Sebelum: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Catatan:
>
>Tidak ada arti khusus untuk salah satu `temperature` atau `onTemperatureChange` nama prop dalam komponen khusus. Kita bisa memanggil mereka apapun, seperti memberi nama mereka `value` dan `onChange` yang merupakan konvensi umum.

`onTemperatureChange` prop akan diberikan bersama-sama dengan `temperature` prop oleh induk komponen `Calculator`. Ini akan menangani perubahan dengan memodifikasi state lokalnya sendiri, sehingga *render* ulang kedua input dengan nilai - nilai baru. Kami akan segera melihat implementasi `Calculator` yang baru.

Sebelum menyelam ke perubahan di `Calculator`, mari kita rekap perubahan kita ke komponen `TemperatureInput`. Kami telah menghapus state lokal dari situ, dan alih-alih membaca `this.state.temperature`, kami sekarang membaca `this.props.temperature`. Alih-alih memanggil `this.setState()` saat kami ingin melakukan perubahan, kami sekarang memanggil `this.props.onTemperatureChange()`, yang akan disediakan oleh `Calculator`:

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
        <legend>Masukan temperatur dalam {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Sekarang mari kita beralih ke komponen `Calculator`.

Kami akan menyimpan input `temperature` saat ini dan `scale` dalam state lokal. Ini adalah kondisi yang kita "angkat" dari input, dan itu akan berfungsi sebagai "sumber kebenaran" untuk keduanya. Ini adalah representasi minimal dari semua data yang perlu kita ketahui untuk membuat kedua input.

Misalnya, jika kita memasukkan 37 ke dalam input Celcius, state pada komponen `Calculator` akan menjadi:

```js
{
  temperature: '37',
  scale: 'c'
}
```

Jika nanti kami mengubah bidang Fahrenheit menjadi 212, state pada `Calculator` akan menjadi:

```js
{
  temperature: '212',
  scale: 'f'
}
```

Kami bisa menyimpan nilai dari kedua input tetapi tidak perlu. Cukup untuk menyimpan nilai input yang terakhir diubuah, dan skala yang diwakilinya. Kita kemudian dapat menyimpulkan nilai input lain berdasarkan arus `temperature` dan `scale` sendiri.

Input tetap sinkron karena nilainya dihitung dari state yang sama:

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

[**Cobalah di CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

Sekarang, tidak peduli yang input berubah, `this.state.temperature` dan `this.state.scale` dalam `Calculator` mendapatkan pembaruan. Salah satu input mendapatkan nilai apa adanya, sehingga setiap input pengguna dipertahankan, dan nilai input lainnya selalu dihitung ulang berdasarkan input.

Mari kita rekap apa yang terjadi ketika anda mengubah input:

* React memanggil fungsi yang spesifik `onChange` pada DOM `<input>`. Dalam kasus kami, ini adalah metode `handleChange` dalam komponen `TemperatureInput`.
* Metode `handleChange` dalam komponen `TemperatureInput` memanggil `this.props.onTemperatureChange()` dengan nilai baru. Itu merupakan `props`, termasuk `onTemperatureChange`, disediakan oleh komponen induknya, `Calculator`.
* Ketika sebelumnya di render, `Calculator` telah ditentukan bahwa `onTemperatureChange` dari Celcius `TemperatureInput` adalah metode `Calculator`'s `handleCelsiusChange`, dan `onTemperatureChange` dari Fahrenheit `TemperatureInput` adalah metode `Calculator`'s `handleFahrenheitChange`. Jadi salah satu dari dua metode `Calculator` dipanggil tergantung pada input yang kami ubah.
* Di dalam metode ini, komponen `Calculator` meminta React untuk mengulang render dengan memanggil `this.setState()` dengan nilai input baru dan skala input saat ini yang baru saja kita ubah.
* React memanggil komponen `Calculator` metode `render` untuk mempelajari seperti apa tampilan UI. Nilai kedua input dihitung berdasarkan suhu saat ini dan skala aktif. Konversi suhu dilakukan di sini.
* React memanggil metode `render` pada komponen individu `TemperatureInput` dengan props baru yang ditentukan oleh `Calculator`. Ia mempelajari seperti apa tampilan UI mereka.
* React memanggil metode `render` pada komponen `BoilingVerdict`, melewati suhu dalam Celcius sebagai props.
* React DOM memperbarui dengan vonis didih dan untuk mencocokan nilai input yang diinginkan. Input yang baru saja kami ubah menerima nilainya saat ini, dan input lainnya diperbarui kesuhu setelah konversi.

Setiap pembaruan melewati langkah yang sama sehinhha input tetap sinkron.

## Pelajaran yang Dipetik {#lessons-learned}

Seharusnya ada "sumber kebenaran" tunggal untuk setiap data yang berubah dalam aplikasi React. Biasanya, state ditambahkan pertama kali ke komponen yang membutuhkannya untuk *rendering*. Kemudian, jika komponen lain juga membutuhkannya, anda dapat mengangkat ke modul utama terdekat. Alih-alih mencoba menyinkronkan keadaan antara komponen yang berbeda, anda harus mengandalkan [aliran data dari atas kebawah](/docs/state-and-lifecycle.html#the-data-flows-down).

Pengangkatan `state` melibatkan penulisan lebih banyak kode "*boilerplate*" daripada pendekatan pengikatan dua arah, tetapi sebagai manfaat, dibutuhkan lebih sedikit pekerjaan untuk menemukan dan mengisolasi bug. Karena keadaan apa pun "hidup" di beberapa komponen dan komponen itu sendiri dapat mengubahnya, area permukaan untuk bug sangat berkurang. Selain itu, anda dapat menerapkan logika khusus apa pun untuk menolak atau mengubah input pengguna.

Jika sesuatu dapat diturunkan dari `props` atau `state`, itu mungkin tidak boleh di `state`. Sebagai contoh, alih-alih menyimpan keduanya `celsiusValue` dan `fahrenheitValue`, kami menyimpan hanya yang terakhir diubah `temperature` dan itu `scale`. Nilai input lain selalu dapat dihitung dari mereka dalam metode `render()`. Ini memungkinkan kami menghapus atau menerapkan pembulatan ke bidang lain tanpa kehilangan ketepatan dalam input pengguna.

Ketika anda melihat sesuatu yang salah di UI, anda dapat menggunakan [Alat Pengembang React](https://github.com/facebook/react-devtools) untuk memeriksa props dan geser *tree* sampai anda menemukan komponen yang bertanggung jawab untuk memperbarui state. Ini memungkinkan anda melacak bug ke sumbernya:

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

