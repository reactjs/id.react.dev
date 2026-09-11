---
title: <ViewTransition>
version: experimental
---

<Experimental>

**API ini bersifat eksperimental dan belum tersedia dalam versi React yang stabil.**

Anda dapat mencobanya dengan memperbarui *package* React ke versi eksperimental terbaru:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Versi eksperimental React mungkin mengandung bug. Jangan menggunakannya dalam produksi.

</Experimental>

<Intro>

`<ViewTransition>` memungkinkan Anda untuk menganimasikan elemen yang diperbarui di dalam Transisi.


```js
import {unstable_ViewTransition as ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<ViewTransition>` {/*viewtransition*/}

Membungkus element didalam `<ViewTransition>` untuk menganimasikannya saat diperbarui di dalam [Transisi](/reference/react/useTransition). React menggunakan heuristik berikut untuk menentukan apakah Transisi Tampilan diaktifkan untuk animasi:

- `enter`: Jika `<ViewTransition>` itu sendiri dimasukkan dalam Transisi ini, maka ini akan diaktifkan.
- `exit`: Jika `<ViewTransition>` itu sendiri dihapus dalam Transisi ini, maka ini akan diaktifkan.
- `update`: Jika `<ViewTransition>` memiliki mutasi DOM di dalamnya yang dilakukan React (seperti perubahan prop) atau jika batas `<ViewTransition>` itu sendiri berubah ukuran atau posisi karena saudara langsung. Jika ada `<ViewTransition>` bersarang, maka mutasi berlaku untuk mereka dan bukan untuk induk.
- `share`: Jika `<ViewTransition>` bernama berada di dalam subpohon yang dihapus dan `<ViewTransition>` bernama lainnya dengan nama yang sama merupakan bagian dari subpohon yang dimasukkan dalam Transisi yang sama, mereka membentuk Transisi Elemen Bersama, dan menganimasikan dari yang dihapus ke yang dimasukkan.

Secara default, `<ViewTransition>` menganimasikan dengan cross-fade yang halus (transisi tampilan default browser). Anda dapat menyesuaikan animasi dengan menyediakan [Kelas Transisi Tampilan](#view-transition-class) ke komponen `<ViewTransition>`. Anda dapat menyesuaikan animasi untuk setiap jenis pemicu (lihat [Membuat Gaya Transisi Tampilan](#styling-view-transitions)).

<DeepDive>

#### Bagaimana `<ViewTransition>` bekerja? {/*how-does-viewtransition-work*/}

Di balik layar, React menerapkan `view-transition-name` ke gaya inline dari node DOM terdekat yang bersarang di dalam komponen `<ViewTransition>`. Jika ada beberapa node DOM saudara seperti `<ViewTransition><div /><div /></ViewTransition>`, maka React menambahkan sufiks ke nama untuk membuat masing-masing unik tetapi secara konseptual mereka adalah bagian dari yang sama. React tidak menerapkan ini dengan cepat tetapi hanya pada saat batas tersebut harus berpartisipasi dalam animasi.

React secara otomatis memanggil `startViewTransition` sendiri di balik layar sehingga Anda tidak boleh melakukannya sendiri. Faktanya, jika Anda memiliki sesuatu lain di halaman yang menjalankan ViewTransition, React akan mengganggu itu. Jadi disarankan untuk menggunakan React itu sendiri untuk mengkoordinasikan ini. Jika Anda memiliki cara lain untuk memicu ViewTransitions di masa lalu, kami sarankan untuk bermigrasi ke cara bawaan.

Jika ada ViewTransitions React lainnya yang sudah berjalan, maka React akan menunggu mereka selesai sebelum memulai yang berikutnya. Namun, pentingnya jika ada beberapa pembaruan yang terjadi saat yang pertama berjalan, semuanya akan digabungkan menjadi satu. Jika Anda memulai A->B. Kemudian di antara waktu itu Anda mendapatkan pembaruan untuk pergi ke C dan kemudian D. Ketika animasi A->B pertama selesai, yang berikutnya akan menganimasikan dari B->D.

Siklus hidup `getSnapshotBeforeUpdate` akan dipanggil sebelum `startViewTransition` dan beberapa `view-transition-name` akan diperbarui pada saat yang sama.

Kemudian React memanggil `startViewTransition`. Di dalam `updateCallback`, React akan:

- Menerapkan mutasi ke DOM dan memanggil useInsertionEffects.
- Menunggu font dimuat.
- Memanggil componentDidMount, componentDidUpdate, useLayoutEffect dan refs.
- Menunggu Navigasi tertunda selesai.
- Kemudian React akan mengukur perubahan apa pun pada tata letak untuk melihat batas mana yang perlu dianimasikan.

Setelah Promise siap dari `startViewTransition` diselesaikan, React kemudian akan mengembalikan `view-transition-name`. Kemudian React akan memanggil callback `onEnter`, `onExit`, `onUpdate` dan `onShare` untuk memungkinkan kontrol programatik manual atas Animasi. Ini akan terjadi setelah yang bawaan default sudah dihitung.

Jika `flushSync` terjadi di tengah urutan ini, maka React akan melewatkan Transisi karena bergantung pada penyelesaian secara sinkron.

Setelah Promise selesai dari `startViewTransition` diselesaikan, React kemudian akan memanggil `useEffect`. Ini mencegah mereka mengganggu kinerja Animasi. Namun, ini bukan jaminan karena jika `setState` lain terjadi saat Animasi berjalan, itu masih harus memanggil `useEffect` lebih awal untuk menjaga jaminan berurutan.

</DeepDive>

#### Props {/*props*/}

Secara default, `<ViewTransition>` menganimasikan dengan cross-fade yang halus. Anda dapat menyesuaikan animasi, atau menentukan transisi elemen bersama, dengan prop ini:

* **opsional** `enter`: String atau objek. [Kelas Transisi Tampilan](#view-transition-class) yang diterapkan saat enter diaktifkan.
* **opsional** `exit`: String atau objek. [Kelas Transisi Tampilan](#view-transition-class) yang diterapkan saat exit diaktifkan.
* **opsional** `update`: String atau objek. [Kelas Transisi Tampilan](#view-transition-class) yang diterapkan saat update diaktifkan.
* **opsional** `share`: String atau objek. [Kelas Transisi Tampilan](#view-transition-class) yang diterapkan saat elemen bersama diaktifkan.
* **opsional** `default`: String atau objek. [Kelas Transisi Tampilan](#view-transition-class) yang digunakan saat tidak ada prop aktivasi yang cocok ditemukan.
* **opsional** `name`: String atau objek. Nama Transisi Tampilan yang digunakan untuk transisi elemen bersama. Jika tidak disediakan, React akan menggunakan nama unik untuk setiap View Transition untuk mencegah animasi yang tidak diharapkan.

#### Callback {/*events*/}

Callback ini memungkinkan Anda untuk menyesuaikan animasi secara imperatif menggunakan API [animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate):

* **opsional** `onEnter`: Fungsi. React memanggil `onEnter` setelah animasi "enter".
* **opsional** `onExit`: Fungsi. React memanggil `onExit` setelah animasi "exit".
* **opsional** `onShare`: Fungsi. React memanggil `onShare` setelah animasi "share".
* **opsional** `onUpdate`: Fungsi. React memanggil `onUpdate` setelah animasi "update".

Setiap callback menerima sebagai argumen:
- `element`: Elemen DOM yang dianimasikan.
- `types`: [Jenis Transisi](/reference/react/addTransitionType) yang termasuk dalam animasi.

### Kelas Transisi Tampilan {/*view-transition-class*/}

Kelas Transisi Tampilan adalah nama kelas CSS yang diterapkan oleh React selama transisi saat ViewTransition diaktifkan. Ini bisa berupa string atau objek.
- `string`: `class` yang ditambahkan pada elemen anak saat diaktifkan. Jika `'none'` disediakan, tidak ada kelas yang akan ditambahkan.
- `object`: kelas yang ditambahkan pada elemen anak akan menjadi kunci yang cocok dengan jenis Transisi Tampilan yang ditambahkan dengan `addTransitionType`. Objek juga dapat menentukan `default` untuk digunakan jika tidak ada jenis yang cocok ditemukan.

Nilai `'none'` dapat digunakan untuk mencegah Transisi Tampilan diaktifkan untuk pemicu tertentu.

### Membuat Gaya Transisi Tampilan {/*styling-view-transitions*/}

<Note>

Dalam banyak contoh awal Transisi Tampilan di sekitar web, Anda mungkin telah melihat menggunakan [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name) dan kemudian membuat gayanya menggunakan pemilih `::view-transition-...(my-name)`. Kami tidak merekomendasikan itu untuk membuat gaya. Sebaliknya, kami biasanya merekomendasikan menggunakan Kelas Transisi Tampilan sebagai gantinya.

</Note>

Untuk menyesuaikan animasi untuk `<ViewTransition>`, Anda dapat menyediakan Kelas Transisi Tampilan ke salah satu prop aktivasi. Kelas Transisi Tampilan adalah nama kelas CSS yang diterapkan React ke elemen anak saat ViewTransition diaktifkan.

Misalnya, untuk menyesuaikan animasi "enter", berikan nama kelas ke prop `enter`:


```js
<ViewTransition enter="slide-in">
```

Ketika `<ViewTransition>` mengaktifkan animasi "enter", React akan menambahkan nama kelas `slide-in`. Kemudian Anda dapat merujuk ke kelas ini menggunakan [pemilih pseudo transisi tampilan](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API#pseudo-elements) untuk membangun animasi yang dapat digunakan kembali:

```css
::view-transition-group(.slide-in) {

}
::view-transition-old(.slide-in) {

}
::view-transition-new(.slide-in) {

}
```
Di masa depan, pustaka CSS mungkin menambahkan animasi bawaan menggunakan Kelas Transisi Tampilan untuk membuat ini lebih mudah digunakan.

#### Peringatan {/*caveats*/}

- Secara default, pembaruan `setState` segera dan tidak mengaktifkan `<ViewTransition>`, hanya pembaruan yang dibungkus dalam [Transisi](/reference/react/useTransition). Anda juga dapat menggunakan [`<Suspense>`](/reference/react/Suspense) untuk ikut serta dalam Transisi untuk [mengungkap konten](/reference/react/Suspense#revealing-content-together-at-once).
- `<ViewTransition>` membuat gambar yang dapat dipindahkan, diskalakan, dan cross-faded. Tidak seperti Animasi Tata Letak yang mungkin Anda lihat di React Native atau Motion, ini berarti bahwa tidak setiap Elemen individu di dalamnya menganimasikan posisinya. Ini dapat menghasilkan kinerja yang lebih baik dan animasi yang lebih halus dan berkelanjutan dibandingkan dengan menganimasikan setiap bagian individu. Namun, ini juga dapat kehilangan kesinambungan dalam hal-hal yang seharusnya bergerak sendiri. Jadi Anda mungkin harus menambahkan batas `<ViewTransition>` lebih banyak secara manual sebagai hasilnya.
- Banyak pengguna mungkin lebih suka tidak memiliki animasi di halaman. React tidak secara otomatis menonaktifkan animasi untuk kasus ini. Kami merekomendasikan menggunakan query media `@media (prefers-reduced-motion)` untuk menonaktifkan animasi atau menguranginya berdasarkan preferensi pengguna. Di masa depan, pustaka CSS mungkin memiliki ini bawaan di preset mereka.
- Saat ini, `<ViewTransition>` hanya berfungsi di DOM. Kami sedang mengerjakan menambahkan dukungan untuk React Native dan platform lainnya.

---


## Penggunaan {/*usage*/}

### Menganimasikan elemen pada enter/exit {/*animating-an-element-on-enter*/}

Transisi Enter/Exit dipicu ketika `<ViewTransition>` ditambahkan atau dihapus oleh komponen dalam transisi:

```js
function Child() {
  return <ViewTransition>Hi</ViewTransition>
}

function Parent() {
  const [show, setShow] = useState();
  if (show) {
    return <Child />;
  }
  return null;
}
```

Ketika `setShow` dipanggil, `show` beralih ke `true` dan komponen `Child` dirender. Ketika `setShow` dipanggil di dalam `startTransition`, dan `Child` merender `ViewTransition` sebelum node DOM lainnya, animasi `enter` dipicu.

Ketika `show` beralih kembali ke `false`, animasi `exit` dipicu.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition>
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Pitfall>

`<ViewTransition>` hanya diaktifkan jika ditempatkan sebelum node DOM apa pun. Jika `Child` terlihat seperti ini, tidak ada animasi yang akan dipicu:

```js [3, 5]
function Component() {
  return (
    <div>
      <ViewTransition>Hi</ViewTransition>
    </div>
  );
}
```

</Pitfall>

---
### Menganimasikan elemen bersama {/*animating-a-shared-element*/}

Biasanya, kami tidak merekomendasikan menetapkan nama ke `<ViewTransition>` dan sebaliknya membiarkan React menetapkan nama otomatis. Alasan Anda mungkin ingin menetapkan nama adalah untuk menganimasikan antara komponen yang sepenuhnya berbeda ketika satu pohon unmount dan pohon lainnya mount pada saat yang sama. Untuk menjaga kesinambungan.

```js
<ViewTransition name={UNIQUE_NAME}>
  <Child />
</ViewTransition>
```

Ketika satu pohon unmount dan yang lain mount, jika ada pasangan di mana nama yang sama ada di pohon yang unmount dan pohon yang mount, mereka memicu animasi "share" di keduanya. Ini menganimasikan dari sisi yang unmount ke sisi yang mount.

Tidak seperti animasi exit/enter, ini dapat berada jauh di dalam pohon yang dihapus/dimount. Jika `<ViewTransition>` juga memenuhi syarat untuk exit/enter, maka animasi "share" lebih diutamakan.

Jika Transisi pertama unmount satu sisi dan kemudian menyebabkan fallback `<Suspense>` ditampilkan sebelum akhirnya nama baru dimount, maka tidak ada transisi elemen bersama yang terjadi.

<Sandpack>

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from "react";
import {Video, Thumbnail, FullscreenVideo} from "./Video";
import videos from "./data";

export default function Component() {
  const [fullscreen, setFullscreen] = useState(false);
  if (fullscreen) {
    return <FullscreenVideo
      video={videos[0]}
      onExit={() => startTransition(() => setFullscreen(false))}
    />
  }
  return <Video
    video={videos[0]}
    onClick={() => startTransition(() => setFullscreen(true))}
  />
}

```

```js src/Video.js
import {unstable_ViewTransition as ViewTransition} from "react";

const THUMBNAIL_NAME = "video-thumbnail"

export function Thumbnail({ video, children }) {
  return (
    <ViewTransition name={THUMBNAIL_NAME}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      />
    </ViewTransition>
  );
}

export function Video({ video, onClick }) {
  return (
    <div className="video">
      <div className="link" onClick={onClick}>
        <Thumbnail video={video} />
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function FullscreenVideo({video, onExit}) {
  return (
    <div className="fullscreenLayout">
      <ViewTransition name={THUMBNAIL_NAME}>
        <div
          aria-hidden="true"
          tabIndex={-1}
          className={`thumbnail ${video.image} fullscreen`}
        />
        <button
          className="close-button"
          onClick={onExit}
        >
          ✖
        </button>
      </ViewTransition>
    </div>
  );
}
```


```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.fullscreen {
  height: 100%;
  width: 100%;
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
.fullscreenLayout {
  position: relative;
  height: 100%;
  width: 100%;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
}
@keyframes progress-animation {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>


<Note>

Jika salah satu sisi yang dipasang atau tidak dipasang dari pasangan berada di luar viewport, maka tidak ada pasangan yang dibentuk. Ini memastikan bahwa itu tidak terbang masuk atau keluar dari viewport ketika sesuatu digulir. Sebaliknya itu diperlakukan sebagai enter/exit reguler dengan sendirinya.

Ini tidak terjadi jika instance Komponen yang sama mengubah posisi, yang memicu "update". Mereka menganimasikan terlepas dari apakah satu posisi berada di luar viewport.

Saat ini ada quirk di mana jika `<ViewTransition>` yang tidak dipasang bersarang dalam berada di dalam viewport tetapi sisi yang dipasang tidak berada dalam viewport, maka sisi yang tidak dipasang menganimasikan sebagai animasi "exit" sendiri bahkan jika bersarang dalam alih-alih sebagai bagian dari animasi induk.

</Note>

<Pitfall>

Penting bahwa hanya ada satu hal dengan nama yang sama yang dipasang pada satu waktu di seluruh aplikasi. Oleh karena itu penting untuk menggunakan namespace unik untuk nama untuk menghindari konflik. Untuk memastikan Anda dapat melakukan ini, Anda mungkin ingin menambahkan konstanta di modul terpisah yang Anda impor.

```js
export const MY_NAME = "my-globally-unique-name";
import {MY_NAME} from './shared-name';
...
<ViewTransition name={MY_NAME}>
```

</Pitfall>


---

### Menganimasikan penyusunan ulang item dalam daftar {/*animating-reorder-of-items-in-a-list*/}


```js
items.map(item => <Component key={item.id} item={item} />)
```

Ketika menyusun ulang daftar, tanpa memperbarui konten, animasi "update" memicu pada setiap `<ViewTransition>` dalam daftar jika mereka berada di luar node DOM. Mirip dengan animasi enter/exit.

Ini berarti bahwa ini akan memicu animasi pada `<ViewTransition>` ini:

```js
function Component() {
  return <ViewTransition><div>...</div></ViewTransition>;
}
```
<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from "react";
import {Video} from "./Video";
import videos from "./data";

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <div className="listContainer">
        {orderedVideos.map((video, i) => {
          return (
            <ViewTransition key={video.title}>
              <Video video={video} />
            </ViewTransition>
          );
        })}
      </div>
    </>
  );
}


```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

However, this wouldn't animate each individual item:

```js
function Component() {
  return <div><ViewTransition>...</ViewTransition></div>;
}
```
Instead, any parent `<ViewTransition>` would cross-fade. If there is no parent `<ViewTransition>` then there's no animation in that case.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from "react";
import {Video} from "./Video";
import videos from "./data";

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <ViewTransition>
        <div className="listContainer">
          {orderedVideos.map((video, i) => {
            return <Video video={video} key={video.title} />;
          })}
        </div>
      </ViewTransition>
    </>
  );
}


```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

This means you might want to avoid wrapper elements in lists where you want to allow the Component to control its own reorder animation:

```
items.map(item => <div><Component key={item.id} item={item} /></div>)
```

Aturan di atas juga berlaku jika salah satu item diperbarui untuk mengubah ukuran, yang kemudian menyebabkan saudara mengubah ukuran, itu juga akan menganimasikan `<ViewTransition>` saudaranya tetapi hanya jika mereka saudara langsung.

Ini berarti bahwa selama update, yang menyebabkan banyak re-layout, itu tidak menganimasikan setiap `<ViewTransition>` di halaman secara individual. Itu akan menyebabkan banyak animasi bising yang mengalihkan perhatian dari perubahan sebenarnya. Oleh karena itu React lebih konservatif tentang kapan animasi individual dipicu.

<Pitfall>

Penting untuk menggunakan kunci dengan benar untuk menjaga identitas saat menyusun ulang daftar. Mungkin terlihat seperti Anda bisa menggunakan "name", transisi elemen bersama, untuk menganimasikan penyusunan ulang tetapi itu tidak akan dipicu jika satu sisi berada di luar viewport. Untuk menganimasikan penyusunan ulang, Anda sering ingin menunjukkan bahwa itu pergi ke posisi di luar viewport.

</Pitfall>

---

### Menganimasikan dari konten Suspense {/*animating-from-suspense-content*/}

Sama seperti Transisi apa pun, React menunggu data dan CSS baru (`<link rel="stylesheet" precedence="...">`) sebelum menjalankan animasi. Selain itu, ViewTransitions juga menunggu hingga 500ms untuk font baru dimuat sebelum memulai animasi untuk menghindari mereka berkedip nanti. Untuk alasan yang sama, gambar yang dibungkus dalam ViewTransition akan menunggu gambar dimuat.

Jika itu di dalam instance batas Suspense baru, maka fallback ditampilkan terlebih dahulu. Setelah batas Suspense sepenuhnya dimuat, itu memicu `<ViewTransition>` untuk menganimasikan pengungkapan ke konten.

Saat ini, ini hanya terjadi untuk Transisi sisi klien. Di masa depan, ini juga akan menganimasikan batas Suspense untuk streaming SSR ketika konten dari server menangguhkan selama pemuatan awal.

Ada dua cara untuk menganimasikan batas Suspense tergantung di mana Anda menempatkan `<ViewTransition>`:

Update:

```
<ViewTransition>
  <Suspense fallback={<A />}>
    <B />
  </Suspense>
</ViewTransition>
```
Dalam skenario ini ketika konten pergi dari A ke B, itu akan diperlakukan sebagai "update" dan menerapkan kelas itu jika sesuai. Baik A dan B akan mendapatkan view-transition-name yang sama dan oleh karena itu mereka bertindak sebagai cross-fade secara default.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: "loading"}
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition,
  Suspense
} from 'react';
import {Video, VideoPlaceholder} from "./Video";
import {useLazyVideoData} from "./data"

function LazyVideo() {
  const video = useLazyVideoData();
  return (
    <Video video={video}/>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from "react";

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(90deg, rgba(173, 216, 230, 0.3) 25%, rgba(135, 206, 250, 0.5) 50%, rgba(173, 216, 230, 0.3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Enter/Exit:

```
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
  <ViewTransition><B /></ViewTransition>
</Suspense>
```

Dalam skenario ini, ini adalah dua instance ViewTransition terpisah masing-masing dengan `view-transition-name` sendiri. Ini akan diperlakukan sebagai "exit" dari `<A>` dan "enter" dari `<B>`.

Anda dapat mencapai efek berbeda tergantung di mana Anda memilih untuk menempatkan batas `<ViewTransition>`.

---
### Memilih keluar dari animasi {/*opting-out-of-an-animation*/}

Terkadang Anda membungkus komponen yang ada yang besar, seperti seluruh halaman, dan Anda ingin menganimasikan beberapa pembaruan, seperti mengubah tema. Namun, Anda tidak ingin itu ikut serta semua pembaruan di dalam seluruh halaman untuk cross-fade ketika mereka memperbarui. Terutama jika Anda menambahkan lebih banyak animasi secara bertahap.

Anda dapat menggunakan kelas "none" untuk memilih keluar dari animasi. Dengan membungkus anak-anak Anda dalam "none" Anda dapat menonaktifkan animasi untuk pembaruan pada mereka sementara induk masih memicu.

```js
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">
      {children}
    </ViewTransition>
  </div>
</ViewTransition>
```

Ini hanya akan menganimasikan jika tema berubah dan tidak jika hanya anak-anak yang diperbarui. Anak-anak masih dapat ikut serta lagi dengan `<ViewTransition>` sendiri tetapi setidaknya itu manual lagi.

---

### Menyesuaikan animasi {/*customizing-animations*/}

Secara default, `<ViewTransition>` menyertakan cross-fade default dari browser.

Untuk menyesuaikan animasi, Anda dapat menyediakan prop ke komponen `<ViewTransition>` untuk menentukan animasi mana yang akan digunakan, berdasarkan bagaimana `<ViewTransition>` diaktifkan.

Misalnya, kita dapat memperlambat animasi cross fade default:

```js
<ViewTransition default="slow-fade">
  <Video />
</ViewTransition>
```

Dan tentukan slow-fade di CSS menggunakan kelas transisi tampilan:

```css
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition default="slow-fade">
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Selain menetapkan `default`, Anda juga dapat menyediakan konfigurasi untuk animasi `enter`, `exit`, `update`, dan `share`.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slide-in) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

### Menyesuaikan animasi dengan jenis {/*customizing-animations-with-types*/}
Anda dapat menggunakan API [`addTransitionType`](/reference/react/addTransitionType) untuk menambahkan nama kelas ke elemen anak ketika jenis transisi tertentu diaktifkan untuk pemicu aktivasi tertentu. Ini memungkinkan Anda untuk menyesuaikan animasi untuk setiap jenis transisi.

Misalnya, untuk menyesuaikan animasi untuk semua navigasi maju dan mundur:

```js
<ViewTransition default={{
  'navigation-back': 'slide-right',
  'navigation-forward': 'slide-left',
 }}>
  <div>...</div>
</ViewTransition>

// in your router:
startTransition(() => {
  addTransitionType('navigation-' + navigationType);
});
```

Ketika ViewTransition mengaktifkan animasi "navigation-back", React akan menambahkan nama kelas "slide-right". Ketika ViewTransition mengaktifkan animasi "navigation-forward", React akan menambahkan nama kelas "slide-left".

Di masa depan, router dan pustaka lainnya mungkin menambahkan dukungan untuk jenis dan gaya transisi tampilan standar.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  unstable_addTransitionType as addTransitionType,
  useState,
  startTransition,
} from "react";
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition enter={
        {
          "add-video-back": "slide-in-back",
          "add-video-forward": "slide-in-forward"
        }
      }
      exit={
        {
          "remove-video-back": "slide-in-forward",
          "remove-video-forward": "slide-in-back"
        }
      }>
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType("remove-video-back")
              } else {
                addTransitionType("add-video-back")
              }
              setShowItem((prev) => !prev);
            });
          }}
        >⬅️</button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType("remove-video-forward")
              } else {
                addTransitionType("add-video-forward")
              }
              setShowItem((prev) => !prev);
            });
          }}
        >➡️</button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slide-in-back) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-back) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-back) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-back) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-in-forward) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-forward) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-forward) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-forward) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

### Membangun router yang mendukung Transisi Tampilan {/*building-view-transition-enabled-routers*/}

React menunggu Navigasi tertunda selesai untuk memastikan bahwa pemulihan gulir terjadi dalam animasi. Jika Navigasi diblokir pada React, router Anda harus membuka blokir di `useLayoutEffect` karena `useEffect` akan menyebabkan deadlock.

Jika `startTransition` dimulai dari event popstate lama, seperti selama navigasi "back", maka itu harus selesai secara sinkron untuk memastikan pemulihan gulir dan formulir bekerja dengan benar. Ini bertentangan dengan menjalankan animasi Transisi Tampilan. Oleh karena itu, React akan melewatkan animasi dari popstate. Oleh karena itu animasi tidak akan berjalan untuk tombol back. Anda dapat memperbaikinya dengan meningkatkan router Anda untuk menggunakan Navigation API.

---

## Pemecahan Masalah {/*troubleshooting*/}

### `<ViewTransition>` saya tidak diaktifkan {/*my-viewtransition-is-not-activating*/}

`<ViewTransition>` hanya diaktifkan jika ditempatkan sebelum node DOM apa pun:

```js [3, 5]
function Component() {
  return (
    <div>
      <ViewTransition>Hi</ViewTransition>
    </div>
  );
}
```

Untuk memperbaiki, pastikan bahwa `<ViewTransition>` datang sebelum node DOM lainnya:

```js [3, 5]
function Component() {
  return (
    <ViewTransition>
      <div>Hi</div>
    </ViewTransition>
  );
}
```

### Saya mendapatkan error "There are two `<ViewTransition name=%s>` components with the same name mounted at the same time." {/*two-viewtransition-with-same-name*/}

Error ini terjadi ketika dua komponen `<ViewTransition>` dengan `name` yang sama dipasang pada saat yang sama:


```js [3]
function Item() {
  // 🚩 Semua item akan mendapatkan "name" yang sama.
  return <ViewTransition name="item">...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {item.map(item => <Item key={item.id} />)}
    </>
  );
}
```

Ini akan menyebabkan View Transition error. Dalam pengembangan, React mendeteksi masalah ini untuk menampilkannya dan mencatat dua error:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

There are two `<ViewTransition name=%s>` components with the same name mounted at the same time. This is not supported and will cause View Transitions to error. Try to use a more unique name e.g. by using a namespace prefix and adding the id of an item to the name.
{'    '}at Item
{'    '}at ItemList

</ConsoleLogLine>

<ConsoleLogLine level="error">

The existing `<ViewTransition name=%s>` duplicate has this stack trace.
{'    '}at Item
{'    '}at ItemList

</ConsoleLogLine>
</ConsoleBlockMulti>

Untuk memperbaiki, pastikan bahwa hanya ada satu `<ViewTransition>` dengan nama yang sama yang dipasang pada satu waktu di seluruh aplikasi dengan memastikan `name` unik, atau menambahkan `id` ke nama:

```js [3]
function Item({id}) {
  // ✅ Semua item akan mendapatkan "name" yang sama.
  return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {item.map(item => <Item key={item.id} item={item} />)}
    </>
  );
}
```
