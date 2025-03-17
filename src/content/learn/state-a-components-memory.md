---
title: "State: Memori dari Sebuah Komponen"
---

<Intro>

Seringkali komponen perlu mengubah tampilan di layar sebagai respons terjadinya interaksi dari pengguna. Mengetik di dalam form akan memperbarui kolom masukan (*input field*), menekan tombol "Selanjutnya" pada slide gambar akan mengganti gambar yang ditampilkan, menekan "Beli" akan menambahkan barang ke dalam keranjang. Komponen perlu "mengingat" informasi-informasi ini: nilai kolom input, gambar, dan isi keranjang belanja. Dalam React, ingatan (*memory*) yang dimiliki komponen ini disebut *state*.

</Intro>

<YouWillLearn>

* Bagaimana menambahkan *state* dengan Hook [`useState`](/reference/react/useState)
* Pasangan variabel yang dikembalikan oleh Hook `useState`
* Bagaimana menambahkan lebih dari satu variabel *state*
* Mengapa lingkup *state* bersifat lokal ke komponen

</YouWillLearn>

## Saat variabel biasa kurang memadai {/*when-a-regular-variable-isnt-enough*/}

Di bawah adalah komponen yang merender sebuah gambar pahatan. Menekan tombol "Selanjutnya" seharusnya menampilkan gambar pahatan yang berikutnya dengan mengganti nilai `index` menjadi `1`, lalu `2`, dan seterusnya. Namun, komponen ini **belum bekerja** (Boleh Anda cek!):

<Sandpack>

```js
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Selanjutnya
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        oleh {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} dari {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

*event handler* `handleClick` memperbarui nilai variabel `index`. Namun dua hal mencegah pembaruan tersebut ditampilkan ke pengguna:

1. **Variabel lokal tidak dipertahankan antarrender.** Saat React merender komponen ini untuk kedua kalinya, dia membuatnya ulang dari awal—tidak memerhatikan adanya perubahan ke variabel tersebut.
2. **Perubahan terhadap variabel lokal tidak memicu *render*.** React tidak menyadari kalau dia perlu melakukan *render*ulang dengan data yang baru.

Untuk memperbarui komponen dengan data baru, dua hal perlu terjadi:

1. **Mempertahankan** data antarrender.
2. **Memicu** React untuk merender ulang komponennya dengan data baru.

Dua hal tersebut bisa dicapai dengan Hook [`useState`](/reference/react/useState):

1. Sebuah **variabel state** untuk mempertahankan data antarrender.
2. Sebuah **fungsi *state* setter** untuk memperbarui variabel dan memicu React untuk merender ulang komponen.

## Menambahkan variabel *state* {/*adding-a-state-variable*/}

Untuk menambahkan variabel state, impor `useState` dari React di paling atas *file*: 

```js
import { useState } from 'react';
```

Lalu, ubah baris berikut:

```js
let index = 0;
```

menjadi

```js
const [index, setIndex] = useState(0);
```

`index` merupakan variabel *state* dan `setIndex` adalah fungsi setter.

> Sintaks yang menggunakan `"["` dan `"]"` digunakan untuk [membongkar isi array](https://javascript.info/destructuring-assignment) dan memungkinkan Anda untuk membaca elemen dalam array tersebut. Array yang dikembalikan oleh `useState` akan selalu berisi dua elemen.


Ini cara mereka bekerja dalam `handleClick`:

```js
function handleClick() {
  setIndex(index + 1);
}
```

Sekarang, menekan tombol "Selanjutnya" akan mengganti gambar pahatan:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Selanjutnya
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        oleh {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} dari {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

### Menggunakan Hook pertama Anda {/*meet-your-first-hook*/}

Dalam React, `useState`, dan fungsi lainnya yang berawalan "`use`", disebut sebuah Hook.

*Hooks* adalah fungsi spesial yang hanya tersedia hanya pada proses [rendering](/learn/render-and-commit#step-1-trigger-a-render) (yang akan kita bahas lebih detail di halaman selanjutnya). Mereka memberikan Anda akses ke berbagai fitur React.

State adalah salah satu fitur tersebut, Anda akan menemui Hooks lainnya nanti.

<Pitfall>

**Fungsi-fungsi Hook yang diawali `use`—hanya bisa dipanggil pada tingkat atas komponen Anda atau [hooks Anda sendiri](/learn/reusing-logic-with-custom-hooks)** Anda tidak bisa memanggil  Hook di dalam blok kode kondisi, perulangan, atau fungsi bersarang lainnya. Hook sendiri adalah fungsi, tapi penting untuk ingat deklarasi mereka tidak bergantung pada pemanggilan bersyarat. Anda bisa menggunakan fitur React di tingkat atas komponen seperti Anda mengimpor modul di bagian atas file.

</Pitfall>

### Anatomi dari `useState` {/*anatomy-of-usestate*/}

Saat Anda memanggil [`useState`](/reference/react/useState), Anda memberitahu React bahwa komponen ini harus mengingat sesuatu
```js
const [index, setIndex] = useState(0);
```

Dalam kasus ini, Anda ingin React untuk mengingat `index`.

<Note>

Dalam penamaan pasangan variabel dari `useState`, kesepakatannya yang diikuti adalah `const [something, setSomething]`. Walaupun sebenarnya Anda tidak harus mengikuti ini, pola penamaan yang konsisten membuat kode lebih mudah dimengerti. 

</Note>


Nilai yang dimasukan ke `useState` adalah **nilai awal** dari variabel state. Dalam kasus ini, nilai awal `index` disetel ke 0 dengan `useState(0)`.

Tiap kali komponen Anda dirender, `useState` kan mengembalikan array dengan dua elemen:
1. **Variabel state** (`index`) dengan nilai yang Anda simpan.
2. **Fungsi *state* setter** (`setIndex`) yang akan memperbarui variabel *state* dan memicu React untuk melakukan *render* ulang.

Ini urutan yang terjadi:

```js
const [index, setIndex] = useState(0);
```

1. **Komponen Anda *render* untuk pertama kali.** Karena Anda memberikan `0` ke `useState` sebagai nilai awal untuk `index`, dia akan mengembalikan `[0, setIndex]`. React akan menandai `0` sebagai nilai *state* terbaru.
2. **Anda memperbarui state** Saat pengguna menekan tombol, dia akan memanggil `setIndex(index + 1)` di saat `index` bernilai `0`, sehingga menjadi `setIndex(1)`. Kali ini React akan mengingat nilai *state* terbaru adalah `1` dan memicu *render* lain.
3. **Render kedua** React masih membaca `useState(0)`, namun karena sebelumnya dia *ingat* kalau Anda sudah mengatur nilai `index` ke `1`, ia mengembalikan `[1, setIndex]`.
4. Dan pola ini berlanjut seterusnya!

## Memberikan beberapa variabel state kepada komponen {/*giving-a-component-multiple-state-variables*/}

Anda bisa memberikan sebanyak mungkin variabel *state* dengan berbagai macam tipe data ke sebuah komponen. Komponen di bawah memiliki dua variabel state, sebuah bilangan `index` dan boolean `showMore` yang berganti nilai saat Anda menekan "Tampilkan Detail"

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Selanjutnya
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        oleh {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} dari {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Sembunyikan' : 'Tampilkan'} Detail
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

Baiknya memang ada beberapa variabel *state* jika mereka tidak saling berhubungan, misal `index` dan `showMore` dalam contoh tadi. Tapi kalau Anda merasa dua *state* akan sering berganti nilai bersama, ada baiknya untuk menggabungkannya. Misal, jika Anda mempunyai form dengan beberapa kolom, akan lebih mudah jika ada satu variabel *state* berupa objek daripada ada variabel *state* untuk masing-masing kolom. Baca [Memilih struktur state](/learn/choosing-the-state-structure) untuk tips lainnya.

<DeepDive>

#### Bagaimana React tahu state mana yang harus dikembalikan? {/*how-does-react-know-which-state-to-return*/}

Anda mungkin memperhatikan kalau dalam pemanggilan `useState` tidak ada informasi mengenai *state* *mana* yang terbaru. Tidak ada *tanda pengenal* yang dioper ke `useState`, jadi bagaimana dia bisa tahu variabel *state* yang harus dikembalikan? Apakah ada cara ajaib seperti memproses fungsi Anda? Jawabannya adalah tidak.

Untuk dapat tetap memakai sintaks yang singkat, Hook **bergantung pada pemanggilan yang konsisten di tiap *render* dalam komponen yang sama**. Dalam prakteknya ini berjalan dengan baik karena jika Anda mengikuti ketentuan di atas ("panggil Hook hanya pada tingkat atas"), Hook akan selalu dipanggil dengan urutan yang sama. Sebagai tambahan, [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) akan memberitahu Anda kalau ada kesalahan yang luput.

Di balik layar, React menyimpan sebuah array berisi pasangan *state* untuk tiap komponen. Dia juga menandai pasangan *state* terbaru, yang mana diatur menjadi `0` sebelum *render*. Tiap kali pemanggilan `useState`, React akan memberi pasangan *state* dan menambah nilai *index*. Anda bisa membaca lebih lanjut tentang mekanisme ini di [React Hooks: Not Magic, Just Arrays.](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)

Contoh di bawah **tidak menggunakan React** namun bisa memberi gambaran bagaimana `useState` bekerja:

<Sandpack>

```js src/index.js active
let componentHooks = [];
let currentHookIndex = 0;

// Penjelasan sederhana tentang 
// cara kerja useState di dalam React
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // Karena bukan render pertama
    // pasangan variable *state* sudah ada.
    // Langsung kembalikan dan tunggu pemanggilan Hook selanjutnya 
    currentHookIndex++;
    return pair;
  }

  // Ini render pertama, maka buat dan simpan
  // pasangan nilai *state*
  pair = [initialState, setState];

  function setState(nextState) {
    // Saat pengguna melakukan perubahan *state*,
    // simpan nilai barunya ke dalam pasangan nilai
    pair[0] = nextState;
    updateDOM();
  }

  // Simpan pasangan nilai untuk render berikutnya
  // dan tunggu pemanggilan Hook selanjutnya 
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // Tiap pemanggilan useState() akan mengembalikan
  // pasangan nilai yang berikutnya 
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // Contoh di bawah tidak menggunakan React,
  // makanya yang dikembalikan adalah objek, bukan JSX.
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} by ${sculpture.artist}`,
    counter: `${index + 1} of ${sculptureList.length}`,
    more: `${showMore ? 'Hide' : 'Show'} details`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // Setel ulang index terbaru dari Hook 
  // sebelum merender komponen
  currentHookIndex = 0;
  let output = Gallery();

  // Perbarui DOM untuk menyamakannya dengan `output`
  // Ini bagian yang React lakukan untuk Anda
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}

let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');

let sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];

// Make UI match the initial state.
updateDOM();
```

```html public/index.html
<button id="nextButton">
  Next
</button>
<h3 id="header"></h3>
<button id="moreButton"></button>
<p id="description"></p>
<img id="image">

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
button { display: block; margin-bottom: 10px; }
</style>
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

Anda tidak perlu mendalaminya untuk menggunakan React, tapi bisa memberi Anda gambaran kasar tentang cara kerjanya.

</DeepDive>

## State terisolasi dan privat {/*state-is-isolated-and-private*/}

Lingkup *state* terbatas pada komponen di mana dia dipanggil. Dalam kata lain, **jika Anda merender komponen yang sama dua kali, tiap komponen akan memiliki *state* yang terpisah!** Mengubah salah satunya tidak kan memengaruhi yang satunya.

Dalam contoh di bawah, komponen `Gallery` dari sebelumnya dirender dua kali tanpa perubahan ke logikanya. Coba tekan tombol di dalam tiap galeri. Perhatikan bagaimana *state* mereka tidak saling memengaruhi

<Sandpack>

```js
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}

```

```js src/Gallery.js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <section>
      <button onClick={handleNextClick}>
        Selanjutnya
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        oleh {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} dari {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Sembunyikan' : 'Tampilkan'} Detail
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
    </section>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

Inilah yang membedakan *state* dengan variabel biasa yang Anda deklarasikan di tingkat atas komponen. *State* tidak terikat ke pemanggilan fungsi tertentu atau lokasi di dalam kode, tapi dia "bersifat lokal" ke komponen spesifik di laman web. Anda merender dua buah komponen `<Gallery />` makan *state* mereka disimpan secara terpisah.

Perhatikan juga bagaimana komponen `Page` tidak "mengetahui" tentang *state* milik `Gallery` atau bahkan ada-tidaknya. Tidak seperti *props*, **state bersifat privat ke komponen tempat dia dideklarasikan.** Komponen *parent* tidak dapat mengubahnya. Sehingga Anda bisa menambahkan atau menghapus *state* tanpa memengaruhi komponen lainnya.

Bagaimana jika Anda ingin menjaga *state* di kedua `Gallery` tetap sinkron? Cara yang benar dalam React adalah *menghapus* *state* dari komponen anak (*child*) dan memindahkannya ke komponen Induk (*parent*) terdekat yang sama. Beberapa halaman berikutnya akan fokus ke mengatur *state* dalam sebuah komponen, tapi kita akan kembali ke topic ini di [Sharing *State* Between Components.](/learn/sharing-state-between-components)

<Recap>

* Gunakan variabel *state* saat komponen perlu *mengingat* informasi antarrender.
* Variabel *state* dideklarasikan dengan Hook `useState`.
* Hooks adalah fungsi spesial yang diawali `use`. Mereka memberi Anda akses ke fitur-fitur React seperti *state*.
* Hooks mungkin mengingatkan Anda ke pernyataan impor: mereka perlu dipanggil tanpa syarat. Memanggil Hooks, termasuk `useState`, hanya bisa pada tingkat atas sebuah komponen atau Hook lainnya.
* Hook `useState` mengembalikan pasangan nilai: nilai *state* terbaru dan fungsi untuk memperbaruinya.
* Anda bisa memliki lebih dari satu variabel *state*. Di balik layar, React akan menandainya sesuai urutan pemanggilannya.
* *State* bersifat privat ke komponennya. Jika Anda merendernya di dua tempat, tiap komponen memiliki *state* masing-masing.

</Recap>



<Challenges>

#### Lengkapi galerinya {/*complete-the-gallery*/}

Jika Anda menekan "Selanjunya" di gambar pahatan terakhir, kodenya akan berhenti bekerja. Coba perbaiki logikanya untuk mencegah hal tersebut. Anda bisa melakukannya dengan menambahkan pengecekan di event hanler atau menonaktifkan tombolnya saat tidak ada aksi yang mungkin terjadi.

Setelah memperbaiki kesalahannya, tambahkan tombol "Sebelumnya" untuk menampilkan gambar pahatan yang sebelumnya. Kodenya harus berjalan lancar sampai gambar yang pertama tampil.

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Selanjutnya
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        oleh {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} dari {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Sembunyikan' : 'Tampilkan'} Detail
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

<Solution>

Kode ini menambahkan pengecekan di dalam event handler dan menonaktifkan tombol saat tidak diperlukan:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;

  function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button
        onClick={handlePrevClick}
        disabled={!hasPrev}
      >
        Sebelumnya
      </button>
      <button
        onClick={handleNextClick}
        disabled={!hasNext}
      >
        Selanjutnya
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        oleh {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} dari {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Sembunyikan' : 'Tampilkan'} Detail
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js hidden
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

Perhatikan bagaimana `hasPrev` dan `hasNext` bisa digunakan langsung di dalam blok JSK dan di dalam event handler! Ini pola yang tergolong praktis karena fungsi event handler [membaca variabel di lingkup sekitarnya](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

</Solution>

#### Memperbaiki form masukan {/*fix-stuck-form-inputs*/}

Saat Anda mengetik di dalam kolom masukan, tidak ada yang muncul. Kolom masukkan terlihat "terjebak" menampilkan string kosong. `value` dari `<input>` yang pertama disetel untuk selalu membaca dari variabel `firstName`, dan `value` untuk `<input>` kedua disetel untuk membaca `lastName`. Sejauh ini benar. Kedua input memiliki event handler `onChange`, yang mana akan memperbarui nilai variabel berdasarkan masukan terbaru dari pengguna (`e.target.value`). Namun variabelnya seperti tidak "mengingat" nilai mereka antarrender. Perbaiki kode ini dengan menggunakan variabel *state*.

<Sandpack>

```js
export default function Form() {
  let firstName = '';
  let lastName = '';

  function handleFirstNameChange(e) {
    firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    lastName = e.target.value;
  }

  function handleReset() {
    firstName = '';
    lastName = '';
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="Nama Depan"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Nama Belakang"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hai, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Setel Ulang</button>
    </form>
  );
}
```

```css 
h1 { margin-top: 10px; }
```

</Sandpack>

<Solution>

Pertama, impor `useState` dari React. Lalu ganti `firstName` dan `lastName` dengan variabel *state* yang dideklaraskan menggunakan `useState`. Terkahir, gnati setiap pemberian nilai `firstName = ...` dengan `setFirstName(...)`, dan lakukan hal yang sama untuk `lastName`. Jangan lupa untuk mengubah isi `handleReset` juga agar tombol `Setel Ulang` bekerja.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="Nama Depan"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Nama Belakang"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hai, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Setel Ulang</button>
    </form>
  );
}
```

```css 
h1 { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Perbaiki kerusakan {/*fix-a-crash*/}

Di bawah adalah form di mana pengguna bisa memberi masukan. Saat masukan dikirim, sebuah pesan "Terima kasih" seharusnya ditampilkan. Namun dia justru berhenti bekerja dan menampilkan pesan galat "Hooks yang dirender lebih sedikit dari yang seharusnya". Apakah Anda bisa menemukan kesalahan dan memperbaikinya?

<Hint>

Apakah ada batasan mengenai *di mana* Hooks bisa dipanggil? Apakah komponen ini melanggar aturan? Cek apakah ada komentar yang menonaktifkan pengecekan *linter*--sering di sini tempat bug bersembunyi.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  if (isSent) {
    return <h1>Terima kasih!</h1>;
  } else {
    // eslint-disable-next-line
    const [message, setMessage] = useState('');
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Mengirim: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Pesan masukan"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Kirim</button>
      </form>
    );
  }
}
```

</Sandpack>

<Solution>

Hooks hanya dapat dipanggil di tingkat atas dari komponen fungsi. Di sini, deklarasi `isSent` pertama mengikuti aturan tersebut, namun tidak untuk `message` karena dia terletak di dalam blok kondisi.

Pindahkan dia ke luar dari blok kondisi untuk memperbaiki isu ini.

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Terima kasih!</h1>;
  } else {
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Mengirim: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Pesan masukan"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Kirim</button>
      </form>
    );
  }
}
```

</Sandpack>

Ingat, Hooks hanya dapat dipanggil tanpa syarat dan selalu dengan urutan yang sama!

Anda juga bisa menghapus cabang `else` yang tidak perlu untuk mengurangi persarangan. Namun, yang penting adalah semua pemanggilan Hooks terjadi *sebelum* `return` yang pertama.

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Terima kasih!</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert(`Mengirim: "${message}"`);
      setIsSent(true);
    }}>
      <textarea
        placeholder="Pesan masukan"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Kirim</button>
    </form>
  );
}
```

</Sandpack>

Coba pindahkan pemanggilan `useState` kedua ke bawah kondisi `if` dan perhatikan kodenya berhenti bekerja lagi. 

Jika *linter* Anda [disetel untuk React](/learn/editor-setup#linting), Anda seharusnya melihat pesan galat saat melakukan kesalahan seperti ini. Jika Anda tidak melihatnya, Anda perlu memasang *linter* untuk proyek Anda.

</Solution>

#### Menghapus state yang tidak perlu {/*remove-unnecessary-state*/}

<<<<<<< HEAD
Saat tombol ditekan, pada contoh di bawah, sebuah kotak dialog akan muncul untuk diisi pengguna dan akan menambilkan pesan untuk menyapa mereka. Anda sudah coba menggunakan *state* untuk namanya, namun karena suatu hal dia tetap menampilkan "Halo, !" 
=======
When the button is clicked, this example should ask for the user's name and then display an alert greeting them. You tried to use state to keep the name, but for some reason the first time it shows "Hello, !", and then "Hello, [name]!" with the previous input every time after.
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff

Untuk memperbaiki kode di bawah, hilangkan variabel *state* yang tidak perlu. (Kita akan bahas [mengapa hal tersebut tidak bekerja](/learn/state-as-a-snapshot) nanti.) 

Apakah Anda bisa menjelaskan mengapa variabel *state* ini tidak diperlukan?

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [name, setName] = useState('');

  function handleClick() {
    setName(prompt('Siapa nama Anda?'));
    alert(`Halo, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Sapa
    </button>
  );
}
```

</Sandpack>

<Solution>

Ini adalah versi yang sudah dibetulkan dengan menggunakan variabel biasa untuk `nama` di dalam fungsi yang membutuhkannya:

<Sandpack>

```js
export default function FeedbackForm() {
  function handleClick() {
    const name = prompt('Siapa nama Anda?');
    alert(`Halo, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Sapa
    </button>
  );
}
```

</Sandpack>

Sebuah variabel *state* hanya diperlukan untuk mempertahankan informasi antarrender di sebuah komponen. Di dalam event handler, variabel biasa sudah mencukupi. Jangan pakai variabel *state* jika tujuannya bisa dicapai dengan variabel biasa.

</Solution>

</Challenges>
