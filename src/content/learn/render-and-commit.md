---
title: Render dan Commit
---

<Intro>

Sebelum komponen Anda ditampilkan pada layar, komponen tersebut akan melakukan proses *render* oleh React. Mengerti tahapan ini akan membuat Anda mengerti bagaimana kode tersebut dijalankan dan dapat menjelaskan perilaku kode tersebut.

</Intro>

<YouWillLearn>

* Apa definisi proses *render* pada React
* Kapan dan Mengapa React melakukukan *render* pada komponen
* Langkah-langkah untuk menampilkan komponen pada layar
* Mengapa proses *render* tidak selalu menghasilkan perubahan pada DOM 

</YouWillLearn>

Bayangkan komponen Anda adalah juru masak pada sebuah dapur yang meracik hidangan lezat dari bahan-bahan. Pada skenario ini, React adalah pelayan yang meletakkan permintaan dari konsumen dan membawa pesanan kepada mereka. Proses meminta dan menyajikan UI ada 3 langkah:

1. **Memicu** sebuah render (mengirimkan pesanan tamu ke dapur)
2. **Render** komponen (menyiapkan pesanan di dapur)
3. **_Commit_** terhadap DOM (meletakkan pesanan pada meja)

<IllustrationBlock sequential>
  <Illustration caption="Memicu" alt="React sebagai server pada sebuah restoran, mengambil pesanan dari pengguna dan mengirimkan pesanan tersebut kepada komponen dapur." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="Kartu Chef memberikan React sebuah komponen kartu baru." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React mengirimkan komponen kartu kepada pengguna pada meja mereka." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Langkah 1: Memicu *render* {/*step-1-trigger-a-render*/}

Terdapat dua alasan bagi komponen untuk melakukan *render*:

1. Itu adalah sebuah komponen **_render_ awal.**
2. Komponen (atau salah satu turunannya) **_state_ telah diperbarui.**

### *Render* awal {/*initial-render*/}

Ketika Anda memulai aplikasi, Anda perlu untuk memicu *render* awal. Kerangka kerja dan *sandboxes* terkadang menyembunyikan kode ini, tetapi itu telah dilakukan dengan memanggil [`createRoot`](/reference/react-dom/client/createRoot) yang mengarahkan pada simpul dari target DOM, dan itu tekah menjalankan fungsi *`render`* pada komponen Anda:

<Sandpack>

```js index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

Cobalah memberi komentar di luar dari `root.render()` dan lihat komponen tersebut menghilang!

### Render ulang ketika *state* diperbarui {/*re-renders-when-state-updates*/}

Setelah komponen telah pertama kali di*render*, Anda dapat memicu *render* kembali dengan memperbarui *state* menggunakan [fungsi `set`.](/reference/react/useState#setstate) Mengubah *state* komponen Anda otomatis akan membuat antrian proses *render*. (Anda dapat membayangkan ada sebuah restoran dimana pengunjung memesan teh, hidangan penutup, dan semua hal tersebut dipesan setelah melakukan pesanan pertama, tergantung pada keadaan haus atau lapar dari pengunjung)

<IllustrationBlock sequential>
  <Illustration caption="State diperbarui..." alt="React sebagai a server pada sebuah restoran, menyajikan sebuah Kartu UI untuk pengguna, direpresentasikan sebagai pelindung dengan kursor di kepala mereka. Pelindung mereka menyatakan mereka menginginkan kartu merah mudah, bukan yang hitam!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...memicu..." alt="React mengembalikan kepada komponen dapur dan mengatakan pada Chef kartu bahwa mereka membutuhkan kartu merah muda." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="Chef kartu itu memberi React kartu merah muda." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Langkah 2: React me-render komponen Anda {/*step-2-react-renders-your-components*/}

Setelah Anda memicu sebuah *render*, React memanggil komponen Anda untuk menemukan apa yang ingin ditampilkan pada layar. **"Rendering" adalah proses ketika React memanggil komponen Anda.** 

* **Pada render awal,** React akan memanggil komponen *root*.
* **Untuk render selanjutnya,** React akan memanggil komponen fungsi yang pembaruan *state*-nya memicu proses *render*.

Proses ini bersifat rekursif: jika komponen yang diperbarui mengembalikan beberapa komponen lain, React akan me-*render* komponen _itu_ berikutnya, dan jika komponen itu juga mengembalikan sesuatum React akan me-*render* komponen _itu_ berikutnya, dan seterusnya. Proses tersebut akan berlanjut sampai tidak terdapat komponen bersarang dan React mengetahui persis apa yang harus ditampilkan pada layar.

Dalam contoh berikut, React akan memanggil `Gallery()` dan  `Image()` beberapa kali:   

<Sandpack>

```js Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Patung yang Menginspirasi</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' oleh Eduardo Catalano: patung bunga metalik raksasa dengan kelopak reflektif"
    />
  );
}
```

```js index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **Selama proses _render_ awal,** React akan [membuat simpul DOM](https://developer.mozilla.org/docs/Web/API/Document/createElement) untuk `<section>`, `<h1>`, dan tiga `<img>` tag. 
* **Selama proses _render_ ulang,** React akan menghitung properti mereka, jika ada yang telah berubah sejak proses *render* sebelumnya. Itu tidak akan melakukan apapun sampai tahapan selanjutnya, yaitu fase *commit*. 

<Pitfall>

Proses _render_ harus selalu [kalkulasi murni](/learn/keeping-components-pure)

* **Masukkan sama, keluaran sama** Dengan masukkan yang sama, sebuah komponen harus mengembalikan JSX yang sama. (Ketika seseorang memesan salad dengan tomat, mereka seharusnya tidak menerima salad dengan bawang!)
* **Memikirkan urusannya sendiri.** Itu seharusnya tidak mengubah objek atau variabel yang ada sebelum proses *render*. (Satu pesanan tidak boleh mengubah pesanan orang lain.)

Jika tidak, Anda dapat menemukan bug yang membingungkan dan perilaku yang tidak dapat diprediksi dari basis kode Anda saat menjadi lebih kompleks. Ketika proses pengembangan dalam "Mode Ketat", React memanggil setiap fungsi komponen sebanyak dua kali, yang dapat membantu untuk menampilkan kesalahan oleh fungsi yang tidak murni.

</Pitfall>

<DeepDive>

#### Mengoptimalkan kinerja {/*optimizing-performance*/}

Perilaku bawaan dari proses *render* semua komponen bersarang di dalam komponen yang diperbarui adalah tidak optimal untuk performa jika komponen yang diperbarui sangat tinggi pada pohon. Jika Anda mengalami permasalahan pada performa, ada beberapa opsi untuk menyelesaikannya pada bagian [Performa](https://reactjs.org/docs/optimizing-performance.html). **Jangan optimalkan sebelum saatnya!**

</DeepDive>

## Langkah 3: React mengirimkan perubahan kepada DOM {/*step-3-react-commits-changes-to-the-dom*/}

Setelah proses _render_ (memanggil) komponen Anda, React akan memodifikasi DOM.

* **Untuk _render_ awal,** React akan menggunakan [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API untuk meletakkan semua simpul DOM yang telah dibuat ke dalam layar.
* **Untuk _render_ ulang,** React akan menerapkan operasi minimal yang diperlukan (dihitung saat proses *render*!) untuk membuat DOM sama dengan keluaran *render* terakhir.

**React hanya mengubah simpul DOM jika ada perbedaan diantara proses _render_.** Sebagai contoh, berikut terdapat komponen yang me-*render* ulang dengan properti berbeda yang dikirimkan setiap detik. Perhatikan bagaimana Anda dapat menambahkan beberapa teks ke dalam `<input>`, memperbarui nilai `<input>`, tetapi teks tersebut tidak menghilang saat komponen me-*render* ulang:

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

Hal ini bekerja dikarenakan selama tahap terakhir ini, React hanya memperbarui konten `<h1>` dengan `waktu` yang baru. Terlihat bawah `<input>` muncul pada JSX di tempat yang sama dengan saat terakhir, jadi React tidak menyentuh `<input>` ataupun `nilai`-nya!
## Epilog: Cat peramban {/*epilogue-browser-paint*/}

Setelah proses *render* selesai dan React memperbarui DOM, peramban akan mengecat ulang layar. Meskipun proses ini dikenal sebagai "*render* pada peramban", kami akan menyebutnya sebagai "lukisan" untuk menghindari kebingungan pada dokumen.

<Illustration alt="Sebuah lukisan peramban 'masih hidup dengan elemen kartu'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Setuap pembaruan layar pada aplikasi React terjadi dalam 3 langkah:
  1. Memicu
  2. *Render*
  3. *Commit*
* Anda dapat menggunakan Mode Ketat untuk menghindari kesalahan pada komponen Anda
* React tidak menyentuh DOM apabila hasil *render* sama dengan sebelumnya

</Recap>

