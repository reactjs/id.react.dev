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
  // Try 'submitting', 'error', 'success':
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

You want to avoid duplication in the state content so you're only tracking what is essential. Spending a little time on refactoring your state structure will make your components easier to understand, reduce duplication, and avoid unintended meanings. Your goal is to **prevent the cases where the state in memory doesn't represent any valid UI that you'd want a user to see.** (For example, you never want to show an error message and disable the input at the same time, or the user won't be able to correct the error!)

Here are some questions you can ask about your state variables:

* **Does this state cause a paradox?** For example, `isTyping` and `isSubmitting` can't both be `true`. A paradox usually means that the state is not constrained enough. There are four possible combinations of two booleans, but only three correspond to valid states. To remove the "impossible" state, you can combine these into a `status` that must be one of three values: `'typing'`, `'submitting'`, or `'success'`.
* **Is the same information available in another state variable already?** Another paradox: `isEmpty` and `isTyping` can't be `true` at the same time. By making them separate state variables, you risk them going out of sync and causing bugs. Fortunately, you can remove `isEmpty` and instead check `answer.length === 0`.
* **Can you get the same information from the inverse of another state variable?** `isError` is not needed because you can check `error !== null` instead.

After this clean-up, you're left with 3 (down from 7!) *essential* state variables:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

You know they are essential, because you can't remove any of them without breaking the functionality.

<DeepDive>

#### Eliminating “impossible” states with a reducer {/*eliminating-impossible-states-with-a-reducer*/}

These three variables are a good enough representation of this form's state. However, there are still some intermediate states that don't fully make sense. For example, a non-null `error` doesn't make sense when `status` is `'success'`. To model the state more precisely, you can [extract it into a reducer.](/learn/extracting-state-logic-into-a-reducer) Reducers let you unify multiple state variables into a single object and consolidate all the related logic!

</DeepDive>

### Langkah 5: Connect the event handlers to set state {/*step-5-connect-the-event-handlers-to-set-state*/}

Lastly, create event handlers that update the state. Below is the final form, with all event handlers wired up:

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
  // Pretend it's hitting the network.
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

Although this code is longer than the original imperative example, it is much less fragile. Expressing all interactions as state changes lets you later introduce new visual states without breaking existing ones. It also lets you change what should be displayed in each state without changing the logic of the interaction itself.

<Recap>

* Declarative programming means describing the UI for each visual state rather than micromanaging the UI (imperative).
* When developing a component:
  1. Identify all its visual states.
  2. Determine the human and computer triggers for state changes.
  3. Model the state with `useState`.
  4. Remove non-essential state to avoid bugs and paradoxes.
  5. Connect the event handlers to set state.

</Recap>



<Challenges>

#### Add and remove a CSS class {/*add-and-remove-a-css-class*/}

Make it so that clicking on the picture *removes* the `background--active` CSS class from the outer `<div>`, but *adds* the `picture--active` class to the `<img>`. Clicking the background again should restore the original CSS classes.

Visually, you should expect that clicking on the picture removes the purple background and highlights the picture border. Clicking outside the picture highlights the background, but removes the picture border highlight.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
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

This component has two visual states: when the image is active, and when the image is inactive:

* When the image is active, the CSS classes are `background` and `picture picture--active`.
* When the image is inactive, the CSS classes are `background background--active` and `picture`.

A single boolean state variable is enough to remember whether the image is active. The original task was to remove or add CSS classes. However, in React you need to *describe* what you want to see rather than *manipulate* the UI elements. So you need to calculate both CSS classes based on the current state. You also need to [stop the propagation](/learn/responding-to-events#stopping-propagation) so that clicking the image doesn't register as a click on the background.

Verify that this version works by clicking the image and then outside of it:

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
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
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

Alternatively, you could return two separate chunks of JSX:

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
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
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
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
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

Keep in mind that if two different JSX chunks describe the same tree, their nesting (first `<div>` → first `<img>`) has to line up. Otherwise, toggling `isActive` would recreate the whole tree below and [reset its state.](/learn/preserving-and-resetting-state) This is why, if a similar JSX tree gets returned in both cases, it is better to write them as a single piece of JSX.

</Solution>

#### Profile editor {/*profile-editor*/}

Here is a small form implemented with plain JavaScript and DOM. Play with it to understand its behavior:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
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
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

This form switches between two modes: in the editing mode, you see the inputs, and in the viewing mode, you only see the result. The button label changes between "Edit" and "Save" depending on the mode you're in. When you change the inputs, the welcome message at the bottom updates in real time.

Your task is to reimplement it in React in the sandbox below. For your convenience, the markup was already converted to JSX, but you'll need to make it show and hide the inputs like the original does.

Make sure that it updates the text at the bottom, too!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

You will need two state variables to hold the input values: `firstName` and `lastName`. You're also going to need an `isEditing` state variable that holds whether to display the inputs or not. You should _not_ need a `fullName` variable because the full name can always be calculated from the `firstName` and the `lastName`.

Finally, you should use [conditional rendering](/learn/conditional-rendering) to show or hide the inputs depending on `isEditing`.

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
        First name:{' '}
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
        Last name:{' '}
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
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Compare this solution to the original imperative code. How are they different?

</Solution>

#### Refactor the imperative solution without React {/*refactor-the-imperative-solution-without-react*/}

Here is the original sandbox from the previous challenge, written imperatively without React:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
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
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Imagine React didn't exist. Can you refactor this code in a way that makes the logic less fragile and more similar to the React version? What would it look like if the state was explicit, like in React?

If you're struggling to think where to start, the stub below already has most of the structure in place. If you start here, fill in the missing logic in the `updateDOM` function. (Refer to the original code where needed.)

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
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
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
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

The missing logic included toggling the display of inputs and content, and updating the labels:

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
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
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
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

The `updateDOM` function you wrote shows what React does under the hood when you set the state. (However, React also avoids touching the DOM for properties that have not changed since the last time they were set.)

</Solution>

</Challenges>
