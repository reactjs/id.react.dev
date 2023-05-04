---
title: State Sebagai Sebuah Snapshot
---

<Intro>

*State* mungkin terlihat seperti variabel reguler pada Javascript yang dapat Anda baca dan tulis. Akan tetapi, *state* berperilaku lebih seperti sebuah *snapshot*. Melakukan perubahan pada *state* tidak mengubah kondisi dari variabel yang Anda miliki, akan tetapi memicu terjadinya sebuah *render* ulang.

</Intro>

<YouWillLearn>

* Bagaimana mengubah suatu *state* memicu terjadinya *render* ulang
* Kapan dan bagaimana *state* diperbarui
* Mengapa *state* tidak segera diperbarui setelah Anda mengubahnya  
* Bagaimana *event handlers* dapat mengakses "*snapshot*" dari sebuah *state*

</YouWillLearn>

## Mengubah state memicu terjadinya render ulang {/*setting-state-triggers-renders*/}

Anda mungkin berpikir bahwa antarmuka pengguna Anda berubah seketika sebagai respons terhadap *event* pengguna seperti sebuah *event* klik. Pada React, cara kerjanya sedikit berbeda dari model mental ini. Pada halaman sebelumnya, Anda dapat melihat bahwa [mengubah *state* mengirim permintaan *render* ulang](/learn/render-and-commit#step-1-trigger-a-render) kepada React. Artinya, agar antarmuka pengguna pada aplikasi Anda dapat bereaksi terhadap *event* tersebut, Anda perlu *memperbarui state tersebut*.

Pada contoh dibawah, ketika Anda menekan tombol "Kirim", `setIsSent(true)` memberi tahu React untuk melakukan *render* ulang terhadap UI:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Halo!');
  if (isSent) {
    return <h1>Pesan anda sedang dikirim!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Kirim</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Inilah yang terjadi ketika Anda menekan tombol "Kirim" pada contoh di atas:

1. *Event handler* `onSubmit` dijalankan.
2. `setIsSent(true)` mengubah nilai `isSent` menjadi `true` dan memasukkan antrian *render* baru.
3. React melakukan *render* ulang pada komponen tersebut sesuai dengan nilai `isSent` yang baru.  

Mari kita lihat lebih dekat hubungan antara *state* dan *rendering*.

## Rendering mengambil sebuah snapshot pada waktu tersebut {/*rendering-takes-a-snapshot-in-time*/}

["Rendering"](/learn/render-and-commit#step-2-react-renders-your-components) berarti React memanggil komponen Anda, yang merupakan sebuah fungsi. JSX yang Anda kembalikan dari fungsi tersebut layaknya seperti sebuah *snapshot* UI pada waktu *render* tersebut. *Props*, *event handler*, dan variabel lokal semuanya dikalkulasi *menggunakan state pada komponen tersebut pada saat render*.

Tidak seperti sebuah foto atau sebuah bingkai film, "*snapshot*" antarmuka yang Anda kembalikan bersifat interaktif. Ini termasuk logika seperti *event handler* yang menentukan apa yang terjadi sebagai respons terhadap suatu input. React memperbarui antarmuka agar sesuai dengan *snapshot* ini dan menghubungkan *event handler*. Sebagai hasilnya, menekan sebuah tombol akan memicu *handler* klik dari JSX Anda.

Ketika React melakukan *render* ulang pada sebuah komponen:

1. React memanggil fungsi Anda kembali.
2. Fungsi Anda mengembalikan *snapshot* JSX yang baru.
3. React lalu memperbarui antarmuka agar sesuai dengan *snapshot* yang Anda kembalikan.

<IllustrationBlock sequential>
    <Illustration caption="React menjalankan fungsi" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Melakukan kalkulasi untuk mendapatkan snapshot terbaru" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Memperbarui pohon DOM" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Sebagai memori dari sebuah komponen, *state* tidak seperti variabel biasa yang hilang setelah fungsi Anda selesai. *State* sebenarnya "hidup" didalam React itu sendiri--seolah-olah di sebuah rak!--di luar fungsi Anda. Ketika React memanggil komponen Anda, React memberi Anda *snapshot* dari *state* untuk *render* tersebut. Komponen Anda mengembalikan *snapshot* UI dengan kumpulan *props* dan *event handler* baru di JSX tersebut, yang semuanya dikalkulasi **menggunakan nilai *state* dari *render* tersebut!**

<IllustrationBlock sequential>
  <Illustration caption="Anda memberi tahu React untuk memperbarui suatu state" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React memperbarui nilai dari state tersebut" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React meneruskan snapshot dari nilai state tersebut ke komponen yang bersangkutan" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

Berikut sedikit eksperimen untuk menunjukkan cara kerjanya. Pada contoh dibawah, Anda mungkin mengira bahwa menekan tombol "+3" akan menaikkan jumlah perhitungannya sebanyak tiga kali karena kode tersebut memanggil `setNumber(number + 1)` sebanyak tiga kali.

Lihat apa yang terjadi ketika anda menekan tombol "+3":

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Perhatikan bahwa `number` hanya bertambah satu kali per klik!

**Memperbarui state hanya akan mengubahnya untuk *render* selanjutnya.** Pada *render* pertama, `number` bernilai `0`. Inilah sebabnya, dalam *handler* `onClick` pada *render* tersebut, `number` tetap bernilai `0` bahkan setelah `setNumber(number + 1)` dipanggil:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Berikut adalah apa yang *handler* klik pada tombol tersebut beri tahu kepada React apa yang perlu dilakukan:

1. `setNumber(number + 1)`: `number` bernilai `0` sehingga `setNumber(0 + 1)`.
    - React mempersiapkan untuk mengubah `number` menjadi `1` pada *render* selanjutnya.
2. `setNumber(number + 1)`: `number` bernilai `0` sehingga `setNumber(0 + 1)`.
    - React mempersiapkan untuk mengubah `number` menjadi `1` pada *render* selanjutnya.
3. `setNumber(number + 1)`: `number` bernilai `0` sehingga `setNumber(0 + 1)`.
    - React mempersiapkan untuk mengubah `number` menjadi `1` pada *render* selanjutnya.

Walaupun Anda memanggil `setNumber(number + 1)` sebanyak tiga kali, dalam *event handler* pada *render* ini nilai `number` selalu `0`, sehingga Anda mengubah *state* tersebut menjadi `1` sebanyak tiga kali. Inilah sebabnya, setelah *event handler* Anda selesai dijalankan, React melakukan *render* ulang pada komponen tersebut dengan `number` bernilai `1`, bukan `3`. 

Anda juga dapat memvisualisasikan hal ini pada benak Anda dengan mengganti variabel *state* dengan nilai aslinya pada kode Anda. Karena variabel *state* `number` adalah `0` untuk *render* ini, *event handler*-nya terlihat seperti ini:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Untuk *render* selanjutnya, `number` bernilai `1`, sehingga *handler* klik untuk *render* tersebut terlihat seperti ini:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Inilah sebabnya mengapa menekan tombol lagi akan mengubah mengubah perhitungannya menjadi `2`, kemudian menjadi `3` pada klik selanjutnya, dan seterusnya.

## State dari waktu ke waktu {/*state-over-time*/}

Yah, itu menyenangkan. Coba tebak apa yang akan ditampilkan oleh *alert* dengan menekan tombol ini:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Jika Anda menggunakan metode substitusi dari sebelumnya, Anda dapat menebak bahwa *alert* akan menampilkan “0”:

```js
setNumber(0 + 5);
alert(0);
```


Tetapi bagaimana jika Anda menaruh *timer* pada *alert*, sehingga kode *alert* tersebut hanya akan dijalankan setelah komponen di-*render* ulang? Apakah akan tertulis "0" atau "5"? Silahkan tebak! 

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Terkejut? Jika Anda menggunakan metode substitusi, Anda dapat melihat "*snapshot*" dari *state* tersebut diteruskan kepada *alert*.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

*State* yang disimpan di React mungkin telah berubah pada saat *alert* dijalankan, akan tetapi ia dijadwalkan untuk dijalankan menggunakan *snapshot* dari *state* pada saat pengguna berinteraksi dengannya!

**Nilai dari *state* tidak pernah berubah pada saat render,** bahkan jika kode *event handler*-nya bersifat asinkron. Didalam `onClick` pada *render* tersebut, nilai dari `number` tetaplah `0`, bahkan setelah `setNumber(number + 5)` dipanggil. Nilainya sudah ditetapkan pada saat React "mengambil *snapshot*" dari UI dengan memanggil komponen Anda.

Berikut adalah contoh bagaimana hal tersebut membuat *event handler* Anda tidak terlalu rentan terhadap kesalahan perkiraan waktu. Di bawah ini adalah *form* yang mengirimkan pesan dengan jeda selama lima detik. Bayangkan skenario ini:

1. Anda menekan tombol "Kirim", mengirim pesan "Halo" kepada Alice.
2. Sebelum jeda lima detik berakhir, Anda mengganti nilai dari *field* "To" menjadi "Bob"

Apa yang Anda perkirakan akan ditampilkan oleh `alert`? Apakah ia akan menampilkan, "Anda berkata Halo kepada Alice"? Atau apakah ia akan menampilkan, "Anda berkata Halo kepada Bob"? Silahkan menebak berdasarkan apa yang Anda ketahui, lalu coba:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Halo');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Anda berkata ${message} kepada ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Kirim</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React menjaga *state* bernilai "tetap" dalam satu *event handler* didalam render.** Anda tidak perlu khawatir apakah *state* Anda telah berubah saat kode sedang berjalan.

Tetapi bagaimana jika Anda ingin membaca *state* terakhir sebelum sebuah *render* ulang? Anda dapat menggunakan [*state updater function*](/learn/queueing-a-series-of-state-updates), yang akan dibahas di halaman selanjutnya!

<Recap>

* Mengubah *state* mengirim permintaan *render* ulang
* React menyimpang *state* diluar komponen Anda, seolah-olah berada di rak.
* Ketika Anda memanggil `useState`, React memberikan Anda *snapshot* dari *state* untuk *render* tersebut.
* Variabel dan *event handlers* tidak "bertahan" pada saat terjadi *render* ulang. Setiap *render* memiliki *event handlers*-nya sendiri.
* Setiap *render* (dan fungsi didalamnya) akan selalu "melihat" *snapshot* dari *state* yang diberikan oleh React pada *render* tersebut.
* Anda dapat melakukan substitusi nilai *state* pada *event handlers* didalam benak anda, mirip dengan apa yang anda pikirkan tentang JSX yang sudah di-*render*. 
* *Event handlers* yang dibuat di masa lalu memiliki nilai *state* dari *render* tempat mereka dibuat.

</Recap>



<Challenges>

#### Implementasikan sebuah lampu lalu lintas {/*implement-a-traffic-light*/}

Berikut adalah komponen lampu penyeberangan yang menyala saat tombol ditekan:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Ubah menjadi {walk ? 'Berhenti' : 'Jalan'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Jalan' : 'Berhenti'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Tambahkan sebuah `alert` didalam *handler* klik. Ketika lampu menyala hijau dan tertulis "Jalan", menekan tombol harus menampilkan "Selanjutnya adalah berhenti". Ketika lampu menyala merah dan tertulis "Berhenti", menekan tombol harus menampilkan "Selanjutnya adalah berjalan." 

Apakah terdapat perbedaan ketika anda menaruh `alert` sebelum atau sesudah `setWalk` dipanggil?


<Solution>

`alert` Anda akan terlihat seperti ini:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Selanjutnya adalah berhenti' : 'Selanjutnya adalah berjalan');
  }

  return (
    <>
      <button onClick={handleClick}>
        Ubah menjadi {walk ? 'Berhenti' : 'Jalan'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Jalan' : 'Berhenti'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Apakah Anda meletakkannya sebelum atau sesudah `setWalk` dipanggil tidak ada bedanya. Nilai `jalan` pada *render* tersebut sudah ditetapkan. Memanggil `setWalk` hanya akan mengubahnya untuk *render* berikutnya, tetapi tidak akan memengaruhi *event handler* dari *render* sebelumnya.

Baris ini mungkin tampak kontra-intuitif pada awalnya:

```js
alert(walk ? 'Selanjutnya adalah berhenti' : 'Selanjutnya adalah berjalan');
```

Tapi masuk akal jika Anda membacanya sebagai berikut: "Jika lampu lalu lintas menunjukkan 'Jalan sekarang', pesannya harus mengatakan 'Selanjutnya adalah berhenti.'" Variabel `walk` di dalam *event handler* Anda bernilai sama dengan nilai `walk` pada *render* dan tidak berubah.

Anda dapat memverifikasi bahwa ini benar dengan menerapkan metode substitusi. Ketika `walk` adalah `true`, Anda mendapatkan:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Ubah menjadi Berhenti
</button>
<h1 style={{color: 'darkgreen'}}>
  Jalan
</h1>
```

Sehingga, mengeklik "Ubah menjadi Berhenti" akan membuat antrean *render* dengan `walk` yang diubah ke `false`, dan menampilkan "Berikutnya adalah berhenti".

</Solution>

</Challenges>
