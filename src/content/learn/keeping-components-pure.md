---
title: Menjaga Kemurnian Komponen
---

<Intro>

Beberapa fungsi JavaScript bersifat murni, yaitu hanya melakukan kalkulasi dan tidak lebih dari itu. Dengan menulis komponen sebagai fungsi murni, Anda bisa menghindari berbagai macam *bug* dan tingkah laku yang membingungkan dari aplikasi yang Anda bangun. Namun, ada beberapa aturan yang harus Anda ikuti untuk mencapai keadaan ini.

</Intro>

<YouWillLearn>

* Apa itu kemurnian dan bagaimana hal tersebut dapat membantu Anda menghindari *bug*
* Bagaimana cara menjaga kemurnian komponen dengan tidak melakukan pengubahan pada fase *render*
* Bagaimana cara menggunakan *Strict Mode* untuk menemukan kesalahan pada komponen Anda

</YouWillLearn>

## Kemurnian: Komponen sebagai rumus {/*purity-components-as-formulas*/}

Dalam ilmu komputer, terutama di dunia pemrograman fungsional, [fungsi murni](https://wikipedia.org/wiki/Pure_function) adalah sebuah fungsi yang memenuhi kriteria berikut:

* **Dia hanya mengurus dirinya sendiri.** Dia tidak mengubah objek atau variabel yang ada sebelum dia dipanggil.
* **Masukan yang sama, luaran yang sama.** Untuk masukan yang sama, fungsi murni akan selalu menghasilkan luaran yang sama.

Anda mungkin sudah akrab dengan salah satu contoh fungsi murni, yaitu rumus-rumus dalam matematika.

Perhatikan rumus ini: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

Jika <Math><MathI>x</MathI> = 2</Math>, <Math><MathI>y</MathI> = 4</Math>. Selalu. 

Jika <Math><MathI>x</MathI> = 3</Math>, <Math><MathI>y</MathI> = 6</Math>. Selalu. 

Jika <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> tidak mungkin bernilai <Math>9</Math> ataupun <Math>–1</Math> ataupun <Math>2.5</Math> hanya karena ada pergantian hari atau pergerakan bursa saham. 

Jika <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> dan <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> akan *selalu* bernilai <Math>6</Math>. 

Jika kita mengonversi rumus ini menjadi fungsi JavaScript, fungsi tersebut akan terlihat seperti ini:

```js
function double(number) {
  return 2 * number;
}
```

Pada contoh di atas, `double` adalah sebuah **fungsi murni**. Jika Anda masukkan `3`, fungsi itu akan mengembalikan `6`. Selalu.

React dibuat berdasarkan konsep ini. **React berasumsi kalau setiap komponen yang Anda buat adalah fungsi murni**. Ini berarti komponen React yang Anda buat harus selalu menghasilkan JSX yang sama jika diberikan masukan yang sama:

<Sandpack>

```js App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

Jika Anda memberikan `drinkers={2}` ke `Recipe`, komponen tersebut akan mengembalikan JSX yang berisi `2 cups of water`. Selalu. 

Jika Anda memberikan `drinkers={4}`, komponen tersebut akan mengembalikan JSX yang berisi `4 cups of water`. Selalu.

Seperti rumus matematika. 

Anda bisa menganggap komponen Anda sebagai resep: jika Anda mengikuti resep tersebut dan tidak menambahkan bahan apapun dalam proses pemasakan, Anda akan selalu mendapatkan makanan yang sama. "Makanan" itu adalah JSX yang diserahkan sebuah komponen ke React untuk di-[*render*](/learn/render-and-commit).

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="Sebuah resep teh untuk x orang: membutuhkan x gelas air, tambahkan teh sebanyak x sendok, tambahkan rempah sebanyak 0,5 sendok, dan 0,5 gelas susu" />

## Efek Samping: Konsekuensi yang (tidak) diinginkan {/*side-effects-unintended-consequences*/}

Proses *render* React harus selalu murni. Komponen hanya *mengembalikan* JSX mereka dan tidak mengubah objek atau variabel apapun yang telah ada sebelumnya--ini membuat komponen tersebut menjadi tidak murni!

Ini contoh komponen yang tidak mengikuti aturan tersebut:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Buruk: mengubah variabel yang sudah ada!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Komponen ini membaca dan menulis sebuah variabel `guest` yang telah dideklarasi di luar komponen tersebut. Ini berarti **memanggil komponen JSX ini berkali-kali akan menghasilkan JSX yang berbeda pada setiap percobaan!** Bukan hanya itu, jika ada komponen **lain* yang juga membaca `guest`, komponen tersebut juga akan menghasilkan JSX yang berbeda, bergantung kepada kapan dia di-*render*. Hal ini sangat sulit untuk diprediksi.

Kembali ke rumus <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, meskipun <Math><MathI>x</MathI> = 2</Math>, kita tidak bisa menjamin <Math><MathI>y</MathI> = 4</Math>. Kasus uji kita akan gagal, pengguna kita menjadi sangat bingung, dan pesawat akan berjatuhan dari langit--Anda bisa melihat bagaimana ini akan berujung kepada *bug* yang sangat membingungkan!

Anda bisa memperbaiki komponen ini dengan [memberikan `guest` sebagai sebuah *prop*](/learn/passing-props-to-a-component):

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

Sekarang, komponen Anda menjadi murni karena JSX yang dikembalikan hanya bergantung kepada *prop* `guest`.

Secara umum, Anda jangan mengharapkan komponen Anda untuk di-*render* mengikuti suatu urutan yang pasti. Meskipun Anda memanggil <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> sebelum atau sesudah <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>, kedua rumus tersebut akan berjalan secara independen. Oleh karena itu, setiap komponen sebaiknya hanya "mengurus dirinya sendiri" dan tidak mencoba untuk berkoordinasi atau bergantung kepada komponen lain selama proses *render* berjalan. Proses *render* mirip dengan ujian di sekolah, setiap komponen harus mengalkulasi JSX dia sendiri.

<DeepDive>

#### Mendeteksi kalkulasi tidak murni dengan *Strict Mode* {/*detecting-impure-calculations-with-strict-mode*/}

Walaupun Anda mungkin belum menggunakan semuanya, di React, ada tiga jenis masukan yang bisa dibaca saat proses *render*, yaitu [*prop*](/learn/passing-props-to-a-component), [*state*](/learn/state-a-components-memory), and [*context*](/learn/passing-data-deeply-with-context). Anda harus selalu menganggap masukan ini sebagai sesuatu yang hanya untuk dibaca (*read-only*).

Saat Anda ingin mengubah sesuatu sebagai respons dari masukan pengguna, Anda harus [mengubah *state*](/learn/state-a-components-memory), bukan menulis ke suatu variabel. Anda tidak boleh mengubah variabel atau objek yang sudah ada sebelumnya saat komponen Anda sedang di-*render*.

React menawarkan "*Strict Mode*" yang memanggil setiap komponen dua kali pada proses pengembangan. **Dengan memanggil setiap komponen dua kali, *Strict Mode* membantu Anda menemukan komponen-komponen yang melanggar aturan ini**.

Di contoh pertama, Anda dapat melihat apa yang ditampilkan adalah "*Guest #2*", "*Guest #4*", dan "*Guest #6*", bukan "*Guest #1*", "*Guest #2*", dan "*Guest #3*". Fungsi tersebut tidak murni sehingga saat dipanggil dua kali, dia rusak. Namun, fungsi yang sudah diperbaiki dan menjadi murni dapat bekerja dengan baik meskipun dijalankan dua kali pada setiap pemanggilan. **Fungsi murni hanya mengalkulasi sehingga memanggil dia dua kali tidak akan mengubah apapun**--seperti memanggil `double(2)` dua kali tidak akan mengubah hasilnya dan menyelesaikan <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> dua kali tidak akan mengubah nilai <MathI>y</MathI>. Masukan yang sama, luaran yang sama. Selalu.

*Strict Mode* tidak memberikan pengaruh apapun di tahap produksi sehingga tidak akan memperlambat aplikasi bagi pengguna Anda. Untuk mencoba *Strict Mode*, Anda bisa membungkus komponen akar Anda ke dalam `<React.StrictMode>`. Beberapa *framework* sudah melakukan ini untuk Anda tanpa perlu intervensi dari Anda.

</DeepDive>

### Mutasi lokal: Rahasia kecil bagi komponen Anda {/*local-mutation-your-components-little-secret*/}

Pada contoh di atas, masalah yang ditemukan adalah komponen tersebut mengubah variabel yang *sudah ada* sebelumnya saat melakukan proses *render*. Ini sering disebut **mutasi** agar terdengar lebih menakutkan. Fungsi murni tidak memutasi variabel yang ada di luar lingkup fungsi tersebut ataupun objek yang dibuat sebelum fungsi tersebut dipanggil--ini membuat fungsi tersebut menjadi tidak murni!

Namun, **mengubah variabel atau objek yang *baru saja* Anda buat saat proses *render* bukan menjadi masalah**. Pada contoh ini, Anda akan membuat sebuah senarai `[]`, memasukkannya ke variabel `cups`, kemudian `menambahkan` 1 lusin *cup* ke dalamnya dengan menggunakan *method* `push()`:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

Jika variabel `cups` atau senarai `[]` dibuat di luar fungsi `TeaGathering`, ini akan menimbulkan masalah besar! Anda akan mengubah objek yang *sudah ada* sebelumnya dengan menambahkan benda baru ke dalam senarai tersebut.

Namun, pada kasus ini, itu tidak menjadi masalah karena Anda membuatnya *bersamaan dengan proses render yang sama*, di dalam `TeaGathering`. Tidak ada kode di luar `TeaGathering` akan mengetahui kejadian ini. Inilah yang disebut sebagai **"mutasi lokal"**—rahasia kecil bagi komponen Anda.

## Di mana Anda *dapat* menimbulkan efek samping {/*where-you-_can_-cause-side-effects*/}

Walaupun pemrograman fungsional sangat bergantung terhadap kemurnian, ada beberapa situasi, *sesuatu* memang harus diubah. Itulah tujuan dari pemrograman! Perubahan ini-—memperbarui layar, memulai sebuah animasi, mengubah data-—disebut **efek samping**. Aktivitas tersebut terjadi *"di samping"*, bukan saat *render*.

Di React, **efek samping biasanya berada di dalam [*event handlers*](/learn/responding-to-events)**. *Event handler* adalah fungsi yang dijalankan React saat Anda melakukan sebuah aksi-—misalnya, saat Anda menekan sebuah tombol. Meskipun *event handler* berada *di dalam* komponen Anda, dia tidak berjalan *saat* *render*! **Dengan demikian, *event handler* tidak perlu murni**.

Jika Anda sudah kehabisan pilihan dan tidak dapat menemukan *event handler* yang tepat untuk efek samping Anda, Anda masih dapat melampirkannya di JSX yang dikembalikan komponen Anda dengan memanggil [`useEffect`](/reference/react/useEffect) di dalam komponen Anda. Ini memberi tahu React untuk mengeksekusinya nanti, setelah *render*, saat efek samping sudah diperbolehkan. **Namun, metode ini sebaiknya menjadi pilihan terakhir Anda**.

Saat memungkinkan, Anda sebaiknya mencoba untuk menuliskan logika tersebut di proses *render*. Anda akan terkejut seberapa jauh ini dapat membantu Anda!

<DeepDive>

#### Mengapa React peduli terhadap kemurnian? {/*why-does-react-care-about-purity*/}

Menulis fungsi murni membutuhkan waktu dan kedisiplinan, tetapi ini membuka jalan bagi banyak kesempatan menakjubkan:

* Komponen Anda dapat berjalan di lingkungan yang berbeda-—misalnya, di server! Karena komponen tersebut selalu menghasilkan hal yang sama untuk masukan yang sama, sebuah komponen bisa melayani permintaan dari banyak pengguna.
* Anda bisa meningkatkan performa dengan [melewati proses *render*](/reference/react/memo) dari komponen yang masukannya tidak berubah. Ini aman karena fungsi murni selalu memberikan hasil yang sama sehingga hasilnya bisa disimpan di *cache*.
* Jika ada data yang berubah di tengah *render* dari sebuah pohon komponen yang dalam, React bisa mengulang proses *render* tanpa perlu menghabiskan waktu menyelesaikan *render* yang sudah tidak berlaku lagi. Kemurnian menjamin keamanan dari penghentian kalkulasi pada sembarang waktu.

Setiap fitur baru React yang kami bangun memanfaatkan kelebihan dari kemurnian. Dari pengambilan data hingga animasi dan performa. Menjaga kemurnian komponen membuka jalan bagi kemampuan asli dari paradigma React untuk bersinar.

</DeepDive>

<Recap>

* Sebuah komponen harus murni, berarti:
  * **Dia hanya mengurus dirinya sendiri.** Dia tidak mengubah objek atau variabel yang ada sebelum dia dipanggil.
  * **Masukan yang sama, luaran yang sama.** Untuk masukan yang sama, fungsi murni akan selalu menghasilkan JSX yang sama. 
* *Render* bisa terjadi kapan saja, maka komponen sebaiknya tidak bergantung terhadap proses *render* satu sama lain.
* Anda sebaiknya tidak memutasi masukan yang digunakan komponen Anda dalam proses *render*, termasuk *prop*, *state*, dan *context*. Untuk memperbarui layar, ["ubah" *state*](/learn/state-a-components-memory) daripada memutasi objek yang sudah ada sebelumnya.
* Anda sebaiknya berusaha untuk menuliskan logika komponen di JSX yang akan dihasilkan komponen. Saat Anda ingin "mengubah sesuatu", Anda sebaiknya melakukannya di dalam *event handler*. Sebagai pilihan terakhir, Anda juga bisa menggunakan `useEffect`.
* Menulis fungsi murni akan membutuhkan waktu, tetapi ini membuka jalan untuk memanfaatkan potensi paradigma React secara maksimal.

</Recap>


  
<Challenges>

#### Memperbaiki jam rusak {/*fix-a-broken-clock*/}

Komponen ini ingin mengubah kelas CSS `<h1>` ke `"night"` dari tengah malam hingga pukul enam pagi dan `"day"` di waktu lain. Namun, ini tidak bekerja. Apakah Anda bisa memperbaiki jam ini?

Anda bisa memverifikasi solusi Anda dengan mengubah zona waktu komputer Anda. Saat waktu ada di antara tengah malam dan pukul enam pagi, warna jam berubah!

<Hint>

Pe-*render*-an adalah *kalkulasi*. Oleh karena itu, seharusnya *render* tidak berusaha untuk "mengubah" sesuatu. Apakah Anda bisa mengekpresikan ide yang sama dengan cara yang berbeda?

</Hint>

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
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
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

Anda bisa memperbaiki komponen ini dengan mengalkulasi `className` dan menyertakannya di luaran *render*:

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
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
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

Di contoh ini, efek samping (memodifikasi DOM) tidak perlu dilakukan. Anda hanya perlu mengembalikan JSX.

</Solution>

#### Memperbaiki profil rusak {/*fix-a-broken-profile*/}

Dua komponen `Profile` di-*render* secara berdampingan dengan data yang berbeda. Anda bisa menekan "*Collapse*" di profil pertama dan menekan "*Expand*". Anda akan melihat kedua profil menampilkan orang yang sama. Ini adalah sebuah *bug*.

Anda diminta untuk menemukan *bug* tersebut dan memperbaikinya.

<Hint>

Kode yang bermasalah ada di `Profile.js`. Pastikan Anda membaca seluruh kode tersebut!

</Hint>

<Sandpack>

```js Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

Masalahnya adalah komponen `Profile` menulis ke variabel yang sudah ada sebelumnya, yaitu `currentPerson`, dan komponen `Header`, serta `Avatar` membaca variabel tersebut. Ini mengakibatkan *tiga komponen ini* tidak murni dan sulit untuk diprediksi.

Untuk memperbaikinya, hapus variabel `currentPerson`. Justru, serahkan semua informasi dari `Profile` ke `Header` dan `Avatar` melalui *prop*. Anda perlu menambahkan *prop* `person` ke dua komponen tersebut dan meneruskan informasi tersebut.

<Sandpack>

```js Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Anda harus ingat React tidak menjamin sebuah fungsi komponen akan dieksekusi berdasarkan suatu urutan sehingga Anda tidak bisa membangun komunikasi antarkomponen dengan menggunakan variabel. Smeua komunikasi harus dilakukan melalui *prop*.

</Solution>

#### Memperbaiki *story tray* rusak {/*fix-a-broken-story-tray*/}

*CEO* perusahaan Anda meminta Anda untuk menambahkan "*story*" ke aplikasi jam daring Anda dan Anda tidak bisa menolak permintaan tersebut. Anda telah menulis sebuah komponen `StoryTray` yang menerima daftar berisikan `stories`, kemudian diikuti *placeholder* "*Create Story*".

Anda telah mengimplementasi *placeholder* "*Create Story*" dengan menambahkan satu *story* palsu di akhir senarai `stories` yang Anda terima sebagai `prop`. Sayangnya, entah mengapa, "*Create Story*" muncul lebih dari satu kali. Anda diminta untuk memperbaiki ini.

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Perhatikan bagaimana saat jam berubah, "*Create Story*" ditambahkan *dua kali*. Ini mengindikasikan komponen melakukan mutasi pada saat me-*render*--*Strict Mode* memanggil komponen dua kali untuk menunjukkan masalah ini.

Fungsi `StoryTray` tidak murni. Dengan memanggil `push` kepada senarai `stories` yang diterima (sebuah *prop*!), fungsi ini memutasi sebuah objek yang dibuat *sebelum* `StoryTray` mulai me-*render*. Ini yang mengakibatkan *bug* dan komponen menjadi sulit diprediksi.

Solusi paling sederhana adalah untuk tidak menyentuh senarai dan me-*render* "*Create Story*" secara terpisah:

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Solusi alternatif adalah Anda bisa membuat sebuah senarai *baru* (dengan menyalin senarai yang sudah ada) sebelum Anda menambahkan anggota baru ke dalamnya:

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  // Salin senarai!
  let storiesToDisplay = stories.slice();

  // Tidak mengubah senarai asli:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Ini menjaga mutasi Anda tetap lokal dan proses *render* tetap murni. Namun, Anda tetap harus berhati-hati: misalnya, jika Anda berusaha untuk mengubah anggota dari senarai tersebut, Anda harus menyalin anggota tersebut terlebih dahulu sebelum mengubahnya.

Oleh karena itu, sangat penting bagi Anda untuk mengingat operasi yang memutasi senarai dan yang tidak. Misalnya, `push`, `pop`, `reverse`, dan `sort` memutasi senarai asli, tetapi `slice`, `filter`, dan `map` akan membuat senarai baru.

</Solution>

</Challenges>
