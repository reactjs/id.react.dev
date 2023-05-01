---
title: Memperbarui Objek dalam State
---

<Intro>

*State* bisa menampung berbagai jenis nilai JavaScript, termasuk objek. Tetapi objek-objek yang disimpan dalam React sebaiknya tidak diperbarui secara langsung. Sebaiknya, ketika sebuah objek ingin diperbarui, Anda perlu membuat objek baru atau menyalin objek yang ingin diubah, kemudian mengubah *state* untuk menggunakan objek hasil salinan tersebut.

</Intro>

<YouWillLearn>

- Bagaimana cara memperbarui objek di dalam React *state*
- Bagaimana cara memperbarui objek yang bersarang tanpa melakukan mutasi
- Apa itu *immutability*, dan bagaimana agar tidak merusaknya
- Bagaimana cara mempersingkat penyalinan objek dengan Immer

</YouWillLearn>

## Apa itu mutasi? {/*whats-a-mutation*/}

Anda bisa menyimpan segala jenis nilai JavaScript di dalam *state*.

```js
const [x, setX] = useState(0);
```

Sejauh ini Anda sudah bisa menggunakan angka, *string*, dan *boolean*. Nilai-nilai JavaScript tersebut bersifat *"immutable"*, yang berarti tidak bisa diubah atau *"read-only"*. Anda bisa memicu *render* ulang untuk *menimpa* sebuah nilai:

```js
setX(5);
```

Nilai *state* `x` berubah dari `0` menjadi `5`, tetapi *angka `0` itu sendiri* tidak berubah. Melakukan perubahan terhadap nilai-nilai primitif yang bawaan seperti angka, *string*, dan *boolean* itu mustahil di JavaScript.


Sekarang pikirkan sebuah objek dalam *state*:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Secara teknis, Anda bisa memperbarui isi konten *objek itu sendiri*. **Hal ini disebut sebagai mutasi:**

```js
position.x = 5;
```

Tetapi, meskipun objek di React secara teknis bisa diubah, Anda harus memperlakukan mereka **seolah-olah** objek itu *immutable*--seperti angka, *boolean*, dan *string*. Selain melakukan mutasi, Anda seharusnya menimpa mereka.

## Perlakukan state seperti read-only {/*treat-state-as-read-only*/}

Dengan kata lain, Anda seharusnya **memperlakukan semua objek JavaScript yang ditaruh di dalam *state* seperti *read-only*.**

Berikut adalah contoh kode yang menampung objek di dalam *state* untuk merepresentasikan posisi kursor saat ini. Titik merah tersebut seharusnya bergerak ketika Anda menyentuh layar atau kursor digerakkan pada daerah *preview*. Tetapi titik merah tersebut diam di tempat saja pada posisi awal:

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Masalahnya terdapat pada potongan kode berikut.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Kode tersebut melakukan modifikasi objek yang ditempatkan ke `position` [dari render sebelumnya.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) Tetapi tanpa menggunakan fungsi yang mengubah *state*, React tidak tahu bahwa objek tersebut telah berubah. Sehingga React tidak melakukan apa-apa. Hal ini sama seperti mencoba mengubah pesanan makanan setelah makanannya dihabiskan. Meskipun mengubah *state* bisa bekerja pada kasus tertentu, kami tidak menyarankannya. Anda harus memperlakukan nilai *state* yang aksesnya Anda miliki ketika render sebagai *read-only*.

Untuk [memicu render ulang](/learn/state-as-a-snapshot#setting-state-triggers-renders) pada kasus ini, **buatlah objek *baru* dan berikan objek tersebut kepada fungsi yang mengubah *state*:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

Dengan `setPosition`, Anda memberi tahu React:
* Timpa `position` dengan objek baru yang diberikan
* Lalu render komponen tersebut lagi

Perhatikan bahwa sekarang titik merah sudah mengikuti kursor Anda ketika Anda menyentuh layar atau menggerakkan kursor pada daerah *preview*:

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Mutasi Lokal itu baik-baik saja {/*local-mutation-is-fine*/}

Kode seperti ini merupakan masalah karena ia memodifikasi objek *yang sudah ada* pada *state*:

```js
position.x = e.clientX;
position.y = e.clientY;
```

Tetapi kode seperti ini itu **baik-baik saja** karena Anda melakukan mutasi terhadap objek yang *baru saja Anda buat*:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
````

Sebenarnya, penulisan kode di atas sama dengan kode berikut:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Mutasi hanya menjadi masalah ketika Anda mengubah objek-objek *yang sudah ada* yang berada di dalam *state*. Mengubah objek yang baru saja Anda buat itu baik-baik saja karena *belum ada kode lain yang menggunakannya.* Mengubah objek tersebut tidak akan mempengaruhi sesuatu yang bergantung pada objek tersebut secara tidak sengaja. Hal ini disebut sebagai "mutasi lokal". Anda bahkan bisa melakukan mutasi lokal [ketika melakukan render.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Sangat mudah dan baik-baik saja!

</DeepDive>

## Menyalin objek-objek dengan sintaksis spread {/*copying-objects-with-the-spread-syntax*/}

Pada contoh sebelumnya, objek `position` selalu dibentuk ulang dari posisi kursor saat ini. Tetapi, pada umumnya, Anda ingin menyimpan data *sebelumnya* sebagai bagian dari objek baru yang sedang dibuat. Sebagai contoh, Anda ingin mengubah *hanya satu* data bidang pada sebuah formulir tanpa mengubah data-data sebelumnya pada bidang lainnya.

Bidang isian berikut tidak bekerja karena *handler* `onChange` mengubah *state*:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        Nama depan:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nama belakang:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Sebagai contoh, baris ini mengubah *state* dari render sebelumnya:

```js
person.firstName = e.target.value;
```

Cara yang dapat diandalkan untuk mendapatkan perilaku yang diinginkan adalah dengan membuat objek baru dan mengopernya ke `setPerson`. Tetapi di sini, Anda juga ingin **menyalin data sebelumnya ke objek tersebut** karena hanya satu bidang saja yang berubah:

```js
setPerson({
  firstName: e.target.value, // Nama depan baru dari bidang isian
  lastName: person.lastName,
  email: person.email
});
```

Anda bisa menggunakan sintaksis `...` [*spread* objek](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) agar Anda tidak perlu menyalin semua properti secara terpisah.

```js
setPerson({
  ...person, // Salin properti-properti lama
  firstName: e.target.value // Tetapi perbarui properti yang ini
});
```

Sekarang formulirnya berfungsi!

Perhatikan bagaimana Anda tidak mendeklarasikan variabel *state* yang terpisah untuk setiap bidang isian. Untuk formulir yang besar, menyimpan semua data dalam sebuah objek sebagai satu kelompok merupakan hal yang mudah--selama objek tersebut diperbarui dengan benar!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        Nama depan:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nama belakang:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Perhatikan bahwa `...` sintaksis *spread* sebenarnya adalah "dangkal"--benda-benda yang disalin hanya sedalam satu level. Hal ini membuatnya cepat, tetapi itu juga berarti bahwa jika Anda ingin memperbarui properti yang bersarang, Anda harus menggunakannya lebih dari sekali.

<DeepDive>

#### Menggunakan satu event handler untuk beberapa bidang {/*using-a-single-event-handler-for-multiple-fields*/}

Anda juga bisa menggunakan tanda `[` dan `]` di dalam definisi objek untuk menentukan sebuah properti dengan nama yang dinamis. Berikut adalah contoh yang sama, tetapi dengan satu *event handler* daripada tiga yang berbeda:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        Nama depan:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Nama belakang:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Di sini, `e.target.name` merujuk ke properti `name` yang diberikan ke elemen DOM `<input>`.

</DeepDive>

## Memperbarui objek bersarang {/*updating-a-nested-object*/}

Pikirkan sebuah objek bersarang dengan struktur sebagai berikut:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

Jika Anda ingin memperbarui `person.artwork.city`, jelas bagaimana melakukannya dengan mutasi:

```js
person.artwork.city = 'New Delhi';
```

Tetapi dalam React, *state* itu diperlakukan sebagai *immutable*! Untuk mengubah `city`, pertama-tama Anda perlu membuat objek `artwork` yang baru (sudah terisi dengan data dari sebelumnya), kemudian buat objek `person` baru yang menunjuk ke `artwork` yang baru:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Atau, ditulis sebagai satu panggilan fungsi:

```js
setPerson({
  ...person, // Salin properti-properti lainnya
  artwork: { // tetapi timpa artwork
    ...person.artwork, // dengan artwork yang sama
    city: 'New Delhi' // tetapi di New Delhi!
  }
});
```

Ini menjadi agak bertele-tele, tetapi berfungsi dengan baik dalam banyak kasus:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Nama:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Judul:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Kota:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Gambar:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (terletak di {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### Objek-objek sebenarnya tidak bersarang {/*objects-are-not-really-nested*/}

Sebuah objek seperti ini terlihat "bersarang" dalam kode:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

Tetapi, "bersarang" adalah cara yang tidak akurat untuk memikirkan perilaku objek-objek. Ketika kode dieksekusi, tidak ada yang namanya objek "bersarang". Sebenarnya Anda sedang melihat dua objek yang berbeda:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

Objek `obj1` tidak berada "di dalam" `obj2`. Sebagai contoh, `obj3` bisa "menunjuk" ke `obj1` juga:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

Jika Anda memperbarui `obj3.artwork.city`, hal itu akan mempengaruhi `obj2.artwork.city` dan `obj1.city`. Hal ini disebabkan karena `obj3.artwork`, `obj2.artwork`, dan `obj1` merupakan objek yang sama. Hal ini sulit untuk dilihat ketika Anda memikirkan objek-objek sebagai "bersarang". Alih-alih, mereka sebenarnya adalah objek-objek terpisah yang "menunjuk" satu sama lain melalui properti-properti.

</DeepDive>

### Menulis logika pembaruan yang ringkas dengan Immer {/*write-concise-update-logic-with-immer*/}

Jika *state* memiliki sarang yang dalam, mungkin Anda ingin mempertimbangkan [untuk meratakannya.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) Tetapi, jika Anda tidak ingin mengubah struktur *state*, Anda mungkin lebih suka jalan pintas daripada *spreads* bersarang. [Immer](https://github.com/immerjs/use-immer) adalah *library* terkenal yang memungkinkan Anda menulis kode dengan sintaksis yang mudah tetapi melakukan mutasi dan mengurus proses penyalinan untuk Anda. Dengan Immer, kode yang ditulis terlihat seperti "melanggar peraturan" dan melakukan mutasi objek:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Tetapi tidak seperti mutasi biasa, hal ini tidak menimpa *state* sebelumnya!

<DeepDive>

#### Bagaimana cara kerja Immer? {/*how-does-immer-work*/}

`draft` yang disediakan oleh Immer merupakan jenis objek yang spesial, disebut sebagai [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), yang "mencatat" apapun yang Anda lakukan terhadap objek tersebut. Inilah alasan mengapa Anda bisa melakukan mutasi terhadap objek tersebut sebebas Anda! Di balik layar, Immer mencari tahu bagian mana dari `draft` yang berubah, dan membuat objek baru yang berisi perubahan-perubahan yang terjadi.

</DeepDive>

Untuk mencoba Immer:
1. Jalankan `npm install use-immer` untuk menambahkan Immer sebagai dependensi
2. Kemudian timpa `import { useState } from 'react'` dengan `import { useImmer } from 'use-immer'`

Berikut adalah contoh sebelumnya yang telah dikonversi menggunakan Immer:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Nama:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Judul:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Kota:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Gambar:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (terletak di {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Perhatikan bagaimana semua kode *event handler* menjadi lebih ringkas. Anda bisa mencampur dan mencocokkan `useState` dan `useImmer` dalam satu komponen sesuka hati Anda. Immer adalah cara yang bagus untuk menjaga agar *handler* logika pembaruan tetap ringkas, terutama jika ada objek bersarang di dalam *state*, dan penyalinan objek menyebabkan kode menjadi repetitif.

<DeepDive>

#### Mengapa mutasi state tidak direkomendasikan dalam React? {/*why-is-mutating-state-not-recommended-in-react*/}

Ada beberapa saran:

* **Debugging:** Jika Anda menggunakan `console.log` dan tidak melakukan mutasi *state*, log masa lalu Anda tidak akan tertimpa dengan perubahan *state* yang baru. Dengan demikian, Anda bisa melihat dengan jelas bagaimana *state* berubah dari satu render ke render lainnya.
* **Optimisasi:** [Strategi optimisasi](/reference/react/memo) React umumnya mengandalkan melewati pekerjaan jika *props* atau *state* sebelumnya itu sama dengan yang selanjutnya. Jika Anda tidak pernah melakukan mutasi *state*, pengecekan perubahan menjadi sangat cepat. Jika `prevObj === obj`, Anda bisa yakin bahwa tidak ada konten yang berubah.
* **Fitur-fitur Baru:** Fitur React baru yang sedang kami bangun mengandalkan *state* [diperlakukan seperti *snapshot*.](/learn/state-as-a-snapshot) Jika Anda melakukan mutasi terhadap *state* sebelumnya, hal itu bisa mencegah Anda dari menggunakan fitur-fitur baru.
* **Perubahan Kebutuhan:** Beberapa fitur aplikasi, seperti implementasi *Undo*/*Redo*, menunjukkan sejarah perubahan, atau membiarkan pengguna mengatur ulang sebuah formulir ke nilai yang lebih awal, lebih mudah dilakukan jika tidak ada yang dimutasi. Alasannya adalah Anda bisa menyimpan salinan-salinan dari *state* sebelumnya di dalam memori, dan menggunakannya kembali jika diinginkan. Jika Anda memulai dengan pendekatan mutasi, fitur-fitur seperti ini bisa menjadi rumit untuk ditambahkan di kemudian hari.
* **Implementasi yang Lebih Simpel:** Karena React tidak bergantung pada mutasi, React tidak perlu melakukan hal spesial terhadap objek-objek Anda. React tidak perlu membajak properti-properti objek, membungkus objek-objek menjadi *Proxies*, atau melakukan pekerjaan lainnya ketika inisialisasi seperti kebanyakan solusi "reaktif" lainnya. Ini juga menjadi alasan mengapa React membiarkan Anda menaruh objek di dalam *state*--tidak peduli sebesar apapun--tanpa isu-isu tambahan dalam hal performa atau ketepatan.

Dalam praktik, Anda bisa sering kali "lolos" dengan melakukan mutasi *state* dalam React, tetapi kami sangat menyarankan untuk tidak melakukan hal tersebut agar Anda bisa menggunakan fitur-fitur baru React yang dikembangkan dengan pendekatan ini. Para kontributor di masa depan dan bahkan mungkin diri Anda di masa depan akan berterima kasih!

</DeepDive>

<Recap>

* Perlakukan semua *state* dalam React sebagai *immutable*.
* Ketika Anda menyimpan objek-objek dalam *state*, mutasi terhadap objek tersebut tidak akan memicu render dan akan mengubah *state* dari render *"snapshots"* sebelumnya.
* Daripada mutasi objek, buat versi *baru* dari objek tersebut, dan picu render ulang dengan menyimpan objek baru tersebut ke *state*.
* Kamu bisa menggunakan `{...obj, something: 'newValue'}` sintaksis objek *spread* untuk membuat salinan dari objek-objek.
* Sintaksis *spread* adalah dangkal: ia hanya menyalin sedalam satu level.
* Untuk memperbarui objek bersarang, Anda perlu menyalin semuanya sampai ke tempat pembaruan.
* Untuk mengurangi kode salinan objek yang repetitif, gunakan Immer.

</Recap>



<Challenges>

#### Perbaiki pembaruan state yang salah {/*fix-incorrect-state-updates*/}

Formulir berikut memiliki beberapa kesalahan. Tekan tombol yang menambah skor beberapa kali. Perhatikan bahwa skor tidak bertambah. Kemudian ubah nama depan, dan perhatikan bahwa skor tiba-tiba "menyusul" dengan perubahan-perubahan Anda. Terakhir, ubah nama belakang, dan perhatikan skor menghilang sepenuhnya.

Tugas Anda adalah memperbaiki semua kesalahan tersebut. Saat Anda memperbaikinya, jelaskan alasan mengapa setiap kesalahan terjadi.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Skor: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Nama depan:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nama belakang:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>


Berikut adalah versi dengan kedua masalah yang sudah diperbaiki:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Skor: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Nama depan:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nama belakang:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Masalah pada `handlePlusClick` adalah fungsi tersebut melakukan mutasi terhadap objek `player`. Hasilnya, React tidak tahu bahwa ada alasan untuk melakukan render ulang, dan tidak memperbarui skor pada layar. Inilah alasan mengapa ketika Anda mengubah nama pertama, *state* diperbarui, memicu render ulang **yang juga** memperbarui skor pada layar.

Masalah pada `handleLastNameChange` adalah fungsi tersebut tidak menyalin properti-properti `...player` sebelumnya ke objek yang baru. Inilah alasan mengapa skor menjadi hilang setelah Anda mengubah nama belakang.

</Solution>

#### Cari dan perbaiki mutasi {/*find-and-fix-the-mutation*/}

Ada sebuah kotak yang bisa digeser di atas sebuah latar belakang statis. Anda bisa mengubah warna kotak dengan bidang pilih.

Tetapi ada masalah. Jika Anda menggerakkan kotak terlebih dahulu, kemudian mengubah warnanya, latar belakang (yang seharusnya tidak bergerak!) akan "lompat" ke posisi kotak. Tetapi hal ini seharusnya tidak terjadi: properti `position` dari `Background` telah diatur ke `initialPosition`, yaitu `{ x: 0, y: 0 }`. Mengapa latar belakang bergerak setelah warna berubah?

Cari masalahnya dan perbaiki.

<Hint>

Jika sesuatu berubah secara tidak terduga, maka ada mutasi. Cari mutasi di `App.js` dan perbaiki.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Geser saya!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Masalahnya berada pada mutasi yang berada di dalam fungsi `handleMove`. Fungsi tersebut memutasi `shape.position`, tetapi itu adalah objek yang sama yang ditunjuk oleh `initialPosition`. Inilah alasan mengapa kotak dan latar belakang bergerak. (Itu adalah mutasi, jadi perubahan tidak tercermin pada layar sampai pembaruan yang tidak bersangkutan--perubahan warna--memicu render ulang.)

Solusinya adalah menghapus mutasi dari `handleMove`, dan menggunakan sintaksis *spread* untuk menyalin kotaknya. Perhatikan bahwa `+=` adalah mutasi, jadi Anda perlu menulis ulang menggunakan operasi `+` biasa.

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Geser saya!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Perbarui objek dengan Immer {/*update-an-object-with-immer*/}

Berikut adalah contoh bermasalah yang sama dengan tantangan sebelumnya. Kali ini, perbaiki mutasi dengan menggunakan Immer. Untuk memudahkan Anda, `useImmer` sudah diimpor, jadi Anda perlu mengubah variabel *state* `shape` untuk menggunakan Immer.

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Geser saya!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

Berikut adalah solusi yang ditulis kembali dengan Immer. Perhatikan bagaimana semua *event handler* ditulis dalam cara mutasi, tetapi kesalahan tidak terjadi. Hal ini disebabkan karena di balik layar, Immer tidak pernah melakukan mutasi terhadap objek-objek sebelumnya.

<Sandpack>

```js App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Geser saya!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

</Solution>

</Challenges>
