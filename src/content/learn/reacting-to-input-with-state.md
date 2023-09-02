---
title: Merespon Masukan dengan State
---

<Intro>

React menyediakan cara deklaratif untuk memanipulasi UI. Alih-alih memanipulasi bagian-bagian UI secara langsung, Anda dapat membuat berbagai *state* komponen, dan mengubahnya sebagai respons terhadap masukan pengguna. Cara ini mirip dengan bagaimana desainer memikirkan tentang UI.

</Intro>

<YouWillLearn>

* Bagaimana pemrograman UI deklaratif berbeda dari pemrograman UI imperatif
* Bagaimana cara menjabarkan berbagai *state* visual yang berbeda pada komponen Anda
* Bagaimana cara memicu perubahan dari berbagai *state*

</YouWillLearn>

## Membandingkan UI deklaratif dengan imperatif {/*how-declarative-ui-compares-to-imperative*/}

Ketika Anda mendesain interaksi UI, Anda mungkin berpikir tentang bagaimana UI *berubah* dalam menanggapi tindakan pengguna. Pertimbangkan formulir yang memungkinkan pengguna mengirimkan jawaban:

* Anda mengetikan sesuatu kedalam formulir, maka tombol kirim menjadi **aktif**
* Anda mengklik tombol "Kirim", baik formulir maupun tombol "Kirim" tersebut menjadi **nonaktif** dan *spinner* muncul.
* Apabila permintaan jaringan berhasil, formulir disembunyikan dan pesan "Terima Kasih" muncul
* Apabila permintaan jaringan gagal, pesan kesalahan muncul dan formulir menjadi aktif kembali.


Pada **pemrograman imperatif**, yang disebutkan di atas berkaitan langsung dengan bagaimana Anda mengimplementasikan interaksi tersebut. Anda harus menulis intruksi yang spesifik untuk memanipulasi UI tergantung apa yang sedang terjadi. Cara lain untuk memikirkan hal ini adalah: bayangkan menumpang disebelah seseorang di dalam mobil dan memberitahu mereka kemana harus pergi disetiap belokan. 

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="Di dalam mobil yang dikemudikan oleh orang yang tampak khawatir, merepresentasikan JavaScript, seorang penumpang memerintahkan pengemudi untuk melakukan serangkaian navigasi belokan demi belokan yang rumit." />

Dia tidak tahu kemana Anda ingin pergi, dia hanya mengikuti perintah yang Anda berikan (dan apabila Anda memberikan arah yang salah, Anda akan sampai ditempat yang salah juga). Hal ini disebut *imperatif* karena Anda harus " memberi perintah" pada setiap elemen, dari pemintal hingga tombol, memberi tahu komputer *bagaimana cara* untuk memperbarui UI tersebut.

Pada contoh pemrograman antarmuka imperatif, formulir dibangun tanpa menggunakan React, hanya mengguna browse [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model):

<Sandpack>

```js index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Anggap saja sedang menghubungi jaringan.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() == 'istanbul') {
        resolve();
      } else {
        reject(new Error('Tebakan yang bagus, tapi salah. Coba lagi!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>Kuis kota</h2>
  <p>
    Kota apa yang terletak di dua benua?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Kirim</button>
  <p id="loading" style="display: none">Memuat...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">Benar sekali!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Memanipulasi UI secara imperatif bekerja dengan cukup baik untuk contoh-contoh yang terpencil, tetapi menjadi jauh lebih sulit untuk dikelola dalam sistem yang lebih kompleks. Bayangkan jika Anda memperbarui halaman yang penuh dengan berbagai macam formulir seperti formulir di atas. Menambahkan elemen UI baru atau interaksi baru akan memerlukan pemeriksaan yang hati-hati terhadap semua kode yang ada untuk memastikan bahwa Anda tidak membuat bug (misalnya, lupa menampilkan atau menyembunyikan sesuatu).

React dibangun untuk mengatasi masalah ini.

Pada React, Anda tidak perlu memanipulasi antarmuka secara langsung, maksudnya Anda tidak perlu mengaktifkan, menonaktifkan, menampilkan, atau menyembunyikan suatu component secara langsung. Melainkan, Anda dapat **mendeklarasikan apa yang ingin Anda tampilkan**, dan React akan mengupdate antarmuka tersebut. Pikirkan Anda menyewa taksi dan memberitahu pengemudinya kemana Anda akan pergi, daripada memberitahukan di mana ia harus berbelok. Itu adalah tugas pengemudi untuk mencari tahu bagaimana mengantar Anda ke tujuan, bahkan dia bisa menemukan jalan pintas yang tidak Anda tahu!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="Di dalam mobil yang dikemudikan oleh React, seorang penumpang meminta untuk diantarkan ke tempat tertentu pada peta. React akan mencari cara menuju ke tempat tersebut." />

## Berpikir tentang UI secara deklaratif {/*thinking-about-ui-declaratively*/}

Anda telah melihat bagaimana cara mengimplementasikan sebuah formulir secara imperatif di atas. Untuk lebih memahami cara berpikir dalam React, Anda akan mempelajari cara mengimplementasikan ulang UI berikut ini dalam React:

1. **Identifikasi** berbagai *state* komponen visual Anda
2. **Tentukan** apa yang menyebabkan perubahan *state* tersebut
3. **Representasikan** *state* tersebut dalam memori dengan menggunakan `useState`
4. **Hapus** variabel *state* yang tidak esensial
5. **Hubungkan** *event handler* untuk mengatur *state* tersebut

### Langkah 1: Identifikasi berbagai *state* komponen visual Anda {/*step-1-identify-your-components-different-visual-states*/}

Dalam ilmu komputer, Anda mungkin pernah mendengar tentang ["*state machine*"](https://en.wikipedia.org/wiki/Finite-state_machine) yang merupakan salah satu dari beberapa "*state*". Jika Anda bekerja dengan seorang desainer, Anda mungkin pernah melihat model visual untuk "*visual state*" yang berbeda. React terletak pada persimpangan antara desain dan ilmu komputer, sehingga kedua ide ini menjadi sumber inspirasi.

Pertama, Anda perlu memvisualisasikan seluruh "*state*" UI yang mungkin akan dilihat oleh pengguna:

* **Kosong**: Formulir memiliki tombol "Kirim" yang dinonaktifkan.
* **Mengetik**: Formulir memiliki tombol "Kirim" yang diaktifkan.
* **Mengirimkan**: Formulir sepenuhnya dinonaktifkan. *Spinner* ditampilkan.
* **Sukses**: Pesan "Terima kasih" ditampilkan, menggantikan formulir.
* **Kesalahan**: Sama seperti *state* Mengetik, namun dengan tambahan pesan kesalahan.

Sama seperti seorang desainer, Anda pasti ingin "model visual" atau membuat "tiruan" untuk berbagai state sebelum menerapkan logika. Sebagai contoh, berikut ini adalah *mock* hanya untuk bagian visual dari formulir. *Mock* ini dikontrol oleh sebuah *prop* yang disebut `status` dengan nilai *default* `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Benar sekali!</h1>
  }
  return (
    <>
      <h2>Kuis kota</h2>
      <p>
        Di kota manakah terdapat papan reklame yang mengubah udara menjadi air yang dapat diminum?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Kirim
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Anda dapat menamai *prop* tersebut dengan nama apa pun yang Anda inginkan, penamaannya tidaklah penting. Cobalah mengubah `status = 'kosong'` menjadi `status = 'sukses'` untuk melihat pesan sukses muncul. *Mock* memungkinkan Anda melakukan iterasi dengan cepat pada UI sebelum Anda menyambungkan logika apa pun. Berikut ini adalah prototipe yang lebih matang dari komponen yang sama, yang masih " dikontrol" oleh *prop* `status`:

<Sandpack>

```js
export default function Form({
  // Cobalah 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Benar sekali!</h1>
  }
  return (
    <>
      <h2>Kuis kota</h2>
      <p>
        Di kota manakah terdapat papan reklame yang mengubah udara menjadi air yang dapat diminum?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Tebakan yang bagus, tapi salah. Coba lagi!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Menampilkan banyak *state* visual sekaligus {/*displaying-many-visual-states-at-once*/}

Jika suatu komponen memiliki banyak state visual, mungkin akan lebih mudah untuk menampilkan semuanya pada satu halaman:

<Sandpack>

```js App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Formulir ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>Benar sekali!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Tebakan yang bagus, tapi salah. Coba lagi!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Halaman seperti ini sering disebut "*living styleguides*" atau "*storybooks*".

</DeepDive>

### Langkah 2: Tentukan apa yang menyebabkan perubahan *state* tersebut {/*step-2-determine-what-triggers-those-state-changes*/}

Anda dapat memicu pembaruan state sebagai respons terhadap dua jenis masukan:

* **Masukan manusia,** seperti mengklik tombol, mengetik di kolom, navigasi tautan.
* **Masukan komputer,** seperti respon jaringan yang diterima, batas waktu selesai, pemuatan gambar.

<IllustrationBlock>
  <Illustration caption="Human inputs" alt="Sebuah jari." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Computer inputs" alt="Satu dan nol." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

Pada kedua kasus tersebut, **Anda harus mengatur [variabel *state*](/learn/state-a-components-memory#anatomy-of-usestate) untuk memperbarui UI.** Untuk form yang Anda kembangkan, Anda perlu mengubah *state* sebagai respons terhadap berbagai masukan yang berbeda:

* **Mengubah input teks** (manusia) akan mengubahnya dari *state* *Kosong* ke *state* *Mengetik* atau sebaliknya, tergantung apakah kotak teks kosong atau tidak.
* **Mengklik tombol Kirim** (manusia) akan mengalihkannya ke *state* *Mengirimkan*.
* **Respons jaringan yang berhasil** (komputer) akan mengalihkannya ke *state* *Sukses*.
* **Respon jaringan gagal** (komputer) akan mengalihkannya ke *state* *Kesalahan* dengan pesan kesalahan yang sesuai.

<Note>

Perhatikan bahwa masukan dari manusia sering kali membutuhkan [*event handler*](/learn/respon-to-events)!

</Note>

Untuk membantu memvisualisasikan alur ini, cobalah gambar setiap *state* di atas kertas sebagai lingkaran berlabel, dan setiap perubahan di antara dua *state* sebagai tanda panah. Anda dapat membuat kerangka alur dengan cara ini dan mencegah *bug* jauh sebelum implementasi.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Diagram alur bergerak dari kiri ke kanan dengan 5 simpul. Simpul pertama yang berlabel 'kosong' memiliki satu edge berlabel 'mulai mengetik' yang terhubung ke simpul berlabel 'mengetik'. Simpul tersebut memiliki satu edge berlabel 'tekan kirim' yang terhubung ke simpul berlabel 'kirim', yang memiliki dua edge. Edge di kiri diberi label 'kesalahan jaringan' yang terhubung ke simpul berlabel 'kesalahan'. Edge di kanan berlabel 'keberhasilan jaringan' yang terhubung ke simpul berlabel 'sukses'.">

Berbagai *state* formulir

</Diagram>

</DiagramGroup>

### Langkah 3: Representasikan *state* tersebut dalam memori dengan menggunakan `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

Selanjutnya Anda harus merepresentasikan *state* visual dari komponen Anda di dalam memori dengan [`useState`.](/reference/react/useState) Kesederhanaan adalah kuncinya: setiap bagian dari *state* adalah sebuah "bagian yang bergerak", dan **Anda ingin sesedikit mungkin "bagian yang bergerak"** Semakin kompleks maka akan semakin banyak bug!

Mulailah dengan state yang *mutlak harus* ada di sana. Sebagai contoh, Anda harus menyimpan `answer` untuk masukan, dan `error` (jika ada) untuk menyimpan kesalahan sebelumnya:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Kemudian, Anda akan membutuhkan variabel *state* yang mewakili salah satu status visual yang ingin Anda tampilkan. Biasanya ada lebih dari satu cara untuk merepresentasikannya dalam memori, jadi Anda perlu bereksperimen dengannya.

Jika Anda kesulitan untuk menemukan cara terbaik dengan segera, mulailah dengan menambahkan cukup banyak *state* sehingga Anda *yakin* bahwa semua keadaan visual yang ada sudah tercakup:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Ide pertama Anda mungkin bukan yang terbaik, tapi itu bukan masalah, menulis ulang *state* adalah bagian dari proses!

### Langkah 4: Hapus variabel *state* yang tidak esensial {/*step-4-remove-any-non-essential-state-variables*/}

Anda ingin menghindari duplikasi pada konten *state* sehingga Anda hanya perlu mencatat *state* yang penting saja. Luangkan sedikit waktu untuk melakukan penulisan ulang pada struktur *state* Anda akan membuat komponen Anda lebih mudah dipahami, mengurangi duplikasi, dan menghindari ambiguitas yang tidak diinginkan. Target Anda adalah untuk **mencegah kasus di mana *state* dalam memori tidak merepresentasikan UI valid yang Anda harapkan untuk dilihat oleh pengguna** (Sebagai contoh, Anda tidak akan pernah ingin menampilkan pesan kesalahan dan menonaktifkan input pada waktu yang sama, atau pengguna tidak akan bisa memperbaiki kesalahan tersebut!)

Berikut adalah beberapa hal yang dapat Anda pertimbangkan tentang variabel *state* Anda:

* **Apakah keadaan ini menimbulkan kondisi paradoks?** Sebagai contoh, `isTyping` dan `isSubmit` tidak mungkin bernilai `true` bersamaan. Kondisi paradoks biasanya menandakan bahwa *state* tidak dibatasi dengan baik. Ada empat kemungkinan kombinasi dari dua boolean, tetapi hanya tiga yang sesuai dengan *state* yang sesuai. Untuk menghilangkan *state* yang "tidak mungkin", Anda dapat menyatukannya menjadi sebuah `status` yang harus merupakan salah satu dari tiga nilai: `'typing'` (mengetik), `'submitting'` (mengirim), atau `'success'` (sukses).
* **Apakah informasi yang sama sudah tersedia di variabel status yang lain?** Kondisi paradoks lain: `isEmpty` dan `isTyping` tidak dapat bernilai `true` pada saat yang bersamaan. Dengan menjadikannya variabel *state* yang terpisah, Anda berisiko membuat keduanya tidak sinkron dan mengakibatkan bug. Untungnya, Anda dapat menghapus `isEmpty` dan sebagai gantinya memeriksa `answer.length === 0`.
* **Bisakah Anda mendapatkan informasi yang sama dari kebalikan dari variabel state yang lain?** `isError` tidak diperlukan karena Anda bisa memeriksa `error !== null` sebagai gantinya.

Setelah pembersihan ini, Anda akan memiliki 3 ( berkurang dari 7!) variabel *state* yang *esensial*:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', atau 'success'
```

Anda tahu mereka sangat penting, karena Anda tidak dapat menghapus salah satu dari variabel-variabel tersebut tanpa merusak fungsionalitasnya.

<DeepDive>

#### Menghilangkan *state-state* "tidak mungkin" dengan *reducer* {/*eliminating-impossible-states-with-a-reducer*/}

Ketiga variabel ini merupakan representasi yang cukup baik dari *state* formulir ini. Namun, masih ada beberapa *state* lanjutan yang tidak sepenuhnya masuk akal. Sebagai contoh, `error` yang non-null tidak masuk akal ketika `status` adalah `'success'`. Untuk memodelkan *state* dengan lebih akurat, Anda dapat [mengekstraknya ke sebuah reducer.](/learn/extracting-state-logic-into-a-reducer) Reducer memungkinkan Anda menyatukan beberapa variabel *state* ke dalam satu objek dan menggabungkan semua logika yang berhubungan!

</DeepDive>

### Langkah 5: Hubungkan *event handler* untuk mengatur *state* tersebut {/*step-5-connect-the-event-handlers-to-set-state*/}

Terakhir, buatlah *event handler* yang memperbarui *state*. Berikut ini adalah bentuk akhir, dengan semua *event handler* yang terhubung:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>Benar sekali!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Kuis kota</h2>
      <p>
        Di kota manakah terdapat papan reklame yang mengubah udara menjadi air yang dapat diminum?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Anggap saja sedang menghubungi jaringan.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Tebakan yang bagus, tapi salah. Coba lagi!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Meskipun kode ini lebih panjang daripada contoh imperatif semula, kode ini lebih tidak mudah rusak. Mengekspresikan semua interaksi sebagai perubahan *state* memungkinkan Anda untuk memperkenalkan *state* visual baru tanpa merusak *state* yang sudah ada. Hal ini juga memungkinkan Anda untuk mengubah apa yang harus ditampilkan di setiap *state* tanpa mengubah logika interaksi itu sendiri.

<Recap>

* Pemrograman deklaratif berarti mendeskripsikan UI untuk setiap *visual state* daripada mengelola UI secara terperinci (imperatif).
* Saat mengembangkan sebuah komponen:
  1. Identifikasi semua *visual state*-nya.
  2. Tentukan pemicu dari pengguna dan komputer untuk perubahan *state*.
  3. Memodelkan *state* dengan `useState`.
  4. Hapus *state* yang tidak esensial untuk menghindari bug dan kondisi paradoks.
  5. Hubungkan event handler untuk menyetel *state*.

</Recap>



<Challenges>

#### Menambah dan menghapus kelas CSS {/*add-and-remove-a-css-class*/}

Buatlah agar mengklik gambar *menghapus* kelas CSS `background--active` dari `<div>` bagian luar, tetapi *menambahkan* kelas `picture--active` ke `<img>`. Mengklik latar belakang lagi akan mengembalikan kelas CSS semula.

Secara visual, Anda seharusnya dapat memperkirakan bahwa dengan mengeklik gambar, Anda akan menghilangkan latar belakang ungu dan menyorot tepian gambar. Mengklik di luar gambar akan menyorot latar belakang, tetapi menghilangkan sorotan tepian gambar tersebut.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rumah Pelangi di Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Komponen ini memiliki dua status visual: apabila gambar aktif, dan apabila gambar tidak aktif:

* Saat gambar aktif, kelas CSS adalah `background` dan `picture picture--active`.
* Ketika gambar tidak aktif, kelas CSS adalah `background background--active` dan `picture`.

Sebuah variabel *state* boolean sudah cukup untuk menyimpan informasi, apakah gambar tersebut aktif atau tidak. Tugas awalnya adalah menghapus atau menambahkan kelas CSS. Namun, di React Anda perlu *mendeskripsikan* apa yang ingin Anda lihat daripada *memanipulasi* elemen UI. Jadi, Anda perlu menghitung kedua kelas CSS berdasarkan *state* saat ini. Anda juga perlu [menghentikan propagasi](/learn/responing-to-events#stopping-propagation) agar mengklik gambar tidak terdeteksi sebagai klik pada latar belakang.

Pastikan bahwa versi ini berfungsi dengan baik, dengan mengeklik gambar dan kemudian klik kembali di luar gambar tersebut:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rumah Pelangi di Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Atau, Anda dapat mengembalikan dua potongan JSX yang terpisah:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rumah Pelangi di Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rumah Pelangi di Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Perlu diingat bahwa jika dua potongan JSX yang berbeda mendeskripsikan pohon yang sama, susunannya (`<div>` pertama → `<img>` pertama) harus sama. Jika tidak, penggantian `isActive` akan menyebabkan pembuatan ulang seluruh pohon di dalamnya dan [mereset *state*-nya.](/learn/preserving-and-reset-state) Inilah sebabnya, jika pohon JSX dari kedua kasus tersebut menghasilkan pohon serupa, lebih baik penulisannya digabungkan menjadi sepotong JSX.

</Solution>

#### Editor profil {/*profile-editor*/}

Berikut ini adalah formulir kecil yang diimplementasikan dengan JavaScript biasa dan DOM. Silakan dicoba untuk memahami perilakunya:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Ubah Profil') {
    editButton.textContent = 'Simpan Profil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Ubah Profil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Halo ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Halo ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nama depan:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Nama belakang:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Ubah Profil</button>
  <p><i id="helloText">Halo, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Formulir ini dapat berganti-ganti di antara dua mode: dalam mode ubah, Anda dapat melihat masukannya, dan dalam mode tampilan, Anda hanya dapat melihat hasilnya. Label tombol berubah antara "Ubah" dan "Simpan", tergantung pada mode yang aktif. Apabila Anda mengubah masukan, pesan selamat datang di bagian bawah akan diperbarui secara langsung.

Tugas Anda adalah mengimplementasikannya kembali di React pada *sandbox* berikut ini. Untuk kenyamanan Anda, *markup* sudah dikonversi ke JSX, tetapi Anda harus membuatnya menampilkan dan menyembunyikan masukan seperti versi awal.

Pastikan juga memperbarui teks di bagian bawah!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        Nama depan:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Nama belakang:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Ubah Profil
      </button>
      <p><i>Halo, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Anda akan membutuhkan dua variabel state untuk menyimpan nilai input: `firstName` dan `lastName`. Anda juga akan membutuhkan variabel state `isEditing` yang menyimpan informasi apakah akan menampilkan masukan atau tidak. Anda seharusnya tidak memerlukan variabel `fullName` karena nama lengkap selalu dapat ditentukan dari `firstName` dan `lastName`.

Terakhir, Anda harus menggunakan [pe-*render*-an bersyarat](/learn/conditional-rendering) untuk menampilkan atau menyembunyikan masukan, tergantung dari *state* `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        Nama depan:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Nama belakang:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Simpan' : 'Ubah'} Profile
      </button>
      <p><i>Halo, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Bandingkan solusi ini dengan kode imperatif yang awal. Apa perbedaannya?

</Solution>

#### Menulis ulang solusi imperatif tanpa React {/*refactor-the-imperative-solution-without-react*/}

Berikut ini adalah *sandbox* awal dari tantangan sebelumnya, yang ditulis secara imperatif tanpa React:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Ubah Profil') {
    editButton.textContent = 'Simpan Profil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Ubah Profil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Halo ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Halo ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nama depan:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Nama belakang:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Ubah Profil</button>
  <p><i id="helloText">Halo, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Bayangkan jika React tidak ada. Dapatkah Anda menuliskan ulang kode ini dengan cara yang membuat logikanya tidak mudah rusak dan lebih mirip dengan versi React? Bagaimana jadinya jika state dibuat eksplisit seperti di React?

Jika Anda kesulitan untuk memulai dari mana, contoh di bawah ini sudah menyediakan sebagian besar strukturnya. Jika Anda memulai dari sini, isi logika yang kosong dalam fungsi `updateDOM`. (Lihat kode awal jika diperlukan).

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Simpan Profil';
    // TODO: tampilkan seluruh masukan, sembunyikan konten
  } else {
    editButton.textContent = 'Ubah Profil';
    // TODO: sembunyikan seluruh masukan, tampilkan konten
  }
  // TODO: perbarui label teks
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nama depan:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Nama belakang:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Ubah Profil</button>
  <p><i id="helloText">Halo, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

Logika yang kosong mencakup peralihan tampilan masukan dan konten, serta memperbarui label:

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Simpan Profil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Ubah Profil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Halo ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nama depan:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Nama belakang:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Ubah Profil</button>
  <p><i id="helloText">Halo, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Fungsi `updateDOM` yang Anda tulis menunjukkan apa yang dilakukan React di balik layar ketika Anda menyetel *state*. (Namun, React juga menghindari pengubahan DOM untuk properti yang tidak berubah sejak terakhir kali *state* disetel).

</Solution>

</Challenges>
