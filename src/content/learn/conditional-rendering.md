---
title: Perenderan Kondisional
---

<Intro>

Komponen Anda akan seringkali perlu menampilkan hal yang berbeda tergantung pada kondisi yang berbeda. Di React, Anda dapat me-*render* JSX secara kondisional menggunakan sintaksis JavaScript seperti pernyataan `if`, `&&`, dan operator `? :`.

</Intro>

<YouWillLearn>

* Cara mengembalikan JSX yang berbeda tergantung pada suatu kondisi
* Cara menyertakan atau mengecualikan bagian dari JSX secara kondisional
* Pintasan (*shortcut*) sintaksis kondisional yang umum yang akan Anda temui di basis kode (*codebase*) React

</YouWillLearn>

## Mengembalikan JSX secara kondisional {/*conditionally-returning-jsx*/}

Katakanlah Anda memiliki komponen `PackingList` yang me-*render* beberapa `Item`, yang dapat ditandai sebagai dikemas atau tidak:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          isPacked={true} 
          name="Helm berwarna emas" 
        />
        <Item 
          isPacked={false} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Perhatikan bahwa beberapa komponen `Item` memiliki *prop* `isPacked` yang disetel ke `true`, bukan `false`. Anda ingin menambahkan tanda centang (✔) pada item yang sudah dikemas jika `isPacked={true}`.

Anda dapat menuliskannya sebagai [pernyataan `if`/`else`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) seperti ini:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Jika *prop* `isPacked` bernilai `true`, kode ini **mengembalikan pohon JSX yang berbeda.** Dengan perubahan ini, beberapa item akan mendapatkan tanda centang di bagian akhir:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          isPacked={true} 
          name="Helm berwarna emas" 
        />
        <Item 
          isPacked={false} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Coba edit apa yang akan dikembalikan dalam kedua kasus tersebut, dan lihat bagaimana hasilnya berubah!

Perhatikan bagaimana Anda membuat logika bercabang dengan pernyataan `if` dan `return` JavaScript. Dalam React, aliran kontrol (seperti kondisi) ditangani oleh JavaScript.

### Tidak mengembalikan elemen apa pun secara kondisional dengan `null` {/*conditionally-returning-nothing-with-null*/}

Dalam beberapa situasi, Anda tidak ingin me-*render* apa pun. Sebagai contoh, katakanlah Anda tidak ingin menampilkan item yang dikemas sama sekali. Sebuah komponen harus mengembalikan sesuatu. Dalam kasus ini, Anda dapat mengembalikan `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Jika nilai `isPacked` adalah *true*, komponen tidak akan mengembalikan apa-apa, `null`. Jika tidak, komponen ini akan mengembalikan JSX untuk di-*render*.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          isPacked={true} 
          name="Helm berwarna emas" 
        />
        <Item 
          isPacked={false} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Dalam praktiknya, mengembalikan `null` dari sebuah komponen tidaklah umum karena dapat mengejutkan pengembang yang mencoba me-*render*-nya. Lebih sering, Anda akan menyertakan atau mengecualikan komponen secara kondisional dalam JSX komponen induk. Inilah cara untuk melakukannya!

## Menyertakan JSX secara kondisional {/*conditionally-including-jsx*/}

Pada contoh sebelumnya, Anda mengontrol pohon JSX mana (jika ada!) yang akan dikembalikan oleh komponen. Anda mungkin telah melihat beberapa duplikasi pada keluaran *render*:

```js
<li className="item">{name} ✔</li>
```

is very similar to

```js
<li className="item">{name}</li>
```

Kedua cabang kondisional mengembalikan `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Meskipun duplikasi ini tidak berbahaya, namun dapat membuat kode Anda menjadi lebih sulit untuk dipelihara. Bagaimana jika Anda ingin mengubah `className`? Anda harus melakukannya di dua tempat dalam kode Anda! Dalam situasi seperti ini, Anda dapat menyertakan sedikit JSX secara kondisional untuk membuat kode Anda lebih [DRY.] (https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

### Operator kondisional (ternary) (`? :`) {/*conditional-ternary-operator--*/}

JavaScript memiliki sintaks yang ringkas untuk menulis ekspresi bersyarat -- the [operator kondisional](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) atau "operator *ternary*".

Daripada ini:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Anda bisa menulis ini:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

Anda dapat membacanya sebagai *"jika nilai `isPacked` adalah true, maka (`?`) render `name + ' ✔'`, jika tidak (`:`) render `name`"*.

<DeepDive>

#### Apakah kedua contoh ini sepenuhnya setara? {/*are-these-two-examples-fully-equivalent*/}

Jika Anda berasal dari latar belakang pemrograman berorientasi objek, Anda mungkin berasumsi bahwa kedua contoh di atas sangat berbeda karena salah satu contoh tersebut dapat membuat dua "*instance*" yang berbeda dari `<li>`. Tetapi elemen JSX bukanlah "*instance*" karena mereka tidak memiliki *state* internal dan bukan merupakan simpul DOM yang sebenarnya. Mereka adalah deskripsi ringan, seperti cetak biru. Jadi, kedua contoh ini, pada kenyataannya, *sebenarnya* sepenuhnya setara. [Mempertahankan dan Mengatur Ulang State](/learn/preserving-and-resetting-state) menjelaskan secara detail tentang cara kerjanya.

</DeepDive>

Sekarang katakanlah Anda ingin membungkus teks item yang sudah selesai ke dalam tag HTML lain, seperti `<del>` untuk memcoretnya. Anda dapat menambahkan lebih banyak lagi baris baru dan tanda kurung sehingga lebih mudah untuk menyarangkan lebih banyak JSX dalam setiap kasus:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          isPacked={true} 
          name="Helm berwarna emas" 
        />
        <Item 
          isPacked={false} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Model seperti ini bekerja dengan baik untuk kondisi sederhana, tetapi gunakan secukupnya. Jika komponen Anda menjadi berantakan dengan terlalu banyak *markup* kondisional bersarang, pertimbangkan untuk mengekstrak komponen turunan untuk membereskannya. Di React, *markup* adalah bagian dari kode Anda, sehingga Anda dapat menggunakan alat bantu seperti variabel dan fungsi untuk merapikan ekspresi yang kompleks.

### Operator logis AND (`&&`) {/*logical-and-operator-*/}

Pintasan umum lainnya yang akan Anda temui adalah [operator logis AND (`&&`) JavaScript.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) Di dalam komponen React, hal ini sering muncul ketika Anda ingin me-*render* beberapa JSX ketika kondisinya *true*, **atau tidak me-*render* apapuin jika sebaliknya.** Dengan `&&`, Anda dapat me-*render* tanda centang secara kondisional hanya jika `isPacked` bernilai `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

Anda dapat membacanya sebagai *"jika `isPacked`, maka (`&&`) render tanda centang, sebaliknya, jangan render apa pun"*.

Here it is in action:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          isPacked={true} 
          name="Helm berwarna emas" 
        />
        <Item 
          isPacked={false} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[Ekspresi && JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) mengembalikan nilai sisi kanannya (dalam kasus kita, tanda centang) jika sisi kiri (kondisi kita) adalah `true`. Tetapi jika kondisinya adalah `false`, seluruh ekspresi menjadi `false`. React menganggap `false` sebagai sebuah "lubang" pada pohon JSX, seperti halnya `null` atau `undefined`, dan tidak me-*render* apa pun sebagai gantinya.


<Pitfall>

**Jangan menaruh angka di sisi kiri `&&`.**

Untuk menguji kondisi tersebut, JavaScript mengubah sisi kiri menjadi boolean secara otomatis. Namun, jika sisi kiri adalah `0`, maka seluruh ekspresi akan mendapatkan nilai tersebut (`0`), dan React akan dengan senang hati me-render `0` daripada tidak sama sekali.

Sebagai contoh, kesalahan yang sering terjadi adalah menulis kode seperti `messageCount && <p>Pesan baru</p>`. Sangat mudah untuk mengasumsikan bahwa kode tersebut tidak melakukan apa-apa ketika `messageCount` bernilai `0`, namun sebenarnya kode tersebut benar-benar me-*render* `0` itu sendiri!

Untuk memperbaikinya, buatlah sisi kiri menjadi boolean: `messageCount > 0 && <p>Pesan baru</p>`.

</Pitfall>

### Menetapkan JSX secara kondisional ke sebuah variabel {/*conditionally-assigning-jsx-to-a-variable*/}

Ketika pintasan menghalangi penulisan kode biasa, cobalah menggunakan pernyataan `if` dan variabel. Anda dapat menetapkan ulang variabel yang didefinisikan dengan [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), jadi mulailah dengan memberikan konten *default* yang ingin Anda tampilkan, yaitu nama:

```js
let itemContent = name;
```

Gunakan pernyataan `if` untuk menetapkan kembali ekspresi JSX ke `itemContent` jika `isPacked` adalah `true`:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[Kurung kurawal membuka "jendela ke dalam JavaScript".](/learn/javascript-in-jsx-dengan-kurung-kurawal#menggunakan-kurung-kurawal-sebuah-jendela-ke-dalam-dunia-javascript) Tempelkan variabel dengan kurung kurawal pada pohon JSX yang dikembalikan, menyarangkan ekspresi yang telah dikalkulasi sebelumnya di dalam JSX:

```js
<li className="item">
  {itemContent}
</li>
```

Model ini adalah model yang paling bertele-tele, tetapi juga paling fleksibel. Ini contohnya:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          isPacked={true} 
          name="Helm berwarna emas" 
        />
        <Item 
          isPacked={false} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Seperti sebelumnya, ini tidak hanya berfungsi untuk teks, tetapi juga untuk JSX sembarang:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          isPacked={true} 
          name="Helm berwarna emas" 
        />
        <Item 
          isPacked={false} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Jika Anda tidak terbiasa dengan JavaScript, variasi gaya ini mungkin tampak membingungkan pada awalnya. Namun, dengan mempelajarinya akan membantu Anda membaca dan menulis kode JavaScript apa pun -- dan bukan hanya komponen React! Pilih salah satu yang Anda sukai sebagai permulaan, lalu lihat referensi ini lagi jika Anda lupa cara kerja yang lain.

<Recap>

* Di React, Anda dapat mengontrol logika percabangan dengan JavaScript.
* Anda dapat mengembalikan ekspresi JSX secara kondisional dengan pernyataan `if`.
* Anda dapat menyimpan beberapa JSX secara kondisional ke sebuah variabel dan kemudian menyertakannya di dalam JSX lain dengan menggunakan kurung kurawal.
* Dalam JSX, `{cond ? <A /> : <B />}` berarti *"jika `cond`, render `<A />`, sebaliknya `<B />`"*.
* Dalam JSX, `{cond && <A />}` berarti *"jika `cond`, render `<A />`, sebaliknya jangan render apa pun"*.
* Pintasan ini umum digunakan, tetapi Anda tidak perlu menggunakannya jika Anda lebih suka `if` biasa.

</Recap>



<Challenges>

#### Menampilkan ikon untuk item yang tidak lengkap dengan `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Gunakan operator kondisional (`cond ? a : b`) untuk me-*render* ❌ jika `isPacked` tidak `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          isPacked={true} 
          name="Helm berwarna emas" 
        />
        <Item 
          isPacked={false} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          isPacked={true} 
          name="Helm berwarna emas" 
        />
        <Item 
          isPacked={false} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Tunjukkan tingkat kepentingan item dengan `&&` {/*show-the-item-importance-with-*/}

Dalam contoh ini, setiap `Item` menerima sebuah proposisi `penting` numerik. Gunakan operator `&&` untuk membuat "*(Kepentingan: X)*" dalam huruf miring, tetapi hanya untuk item yang memiliki tingkat kepentingan bukan nol. Daftar item Anda akan terlihat seperti ini:

* Pakaian luar angkasa *(Kepentingan: 9)*
* Helm berwarna emas
* Foto Tam *(Kepentingan: 6)*

Don't forget to add a space between the two labels!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          importance={9} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          importance={0} 
          name="Helm berwarna emas" 
        />
        <Item 
          importance={6} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

This should do the trick:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Kepentingan: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Daftar Pengemasan Sally Ride</h1>
      <ul>
        <Item 
          importance={9} 
          name="Pakaian luar angkasa" 
        />
        <Item 
          importance={0} 
          name="Helm berwarna emas" 
        />
        <Item 
          importance={6} 
          name="Foto Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Perhatikan bahwa Anda harus menulis `importance > 0 && ...` dan bukan `importance && ...` sehingga jika `importance` adalah `0`, `0` tidak di-*render* sebagai hasilnya!

Dalam solusi ini, dua kondisi terpisah digunakan untuk menyisipkan spasi di antara nama dan label kepentingan. Atau, Anda bisa menggunakan *fragment* dengan spasi di depan: `importance > 0 && <> <i>...</i></>` atau tambahkan spasi langsung di dalam `<i>`:  `importance > 0 && <i> ...</i>`.

</Solution>

#### Refaktor rangkaian `? :` menjadi `if` dan variabel {/*refactor-a-series-of---to-if-and-variables*/}

Komponen `Drink` ini menggunakan serangkaian kondisi `? :` untuk menampilkan informasi yang berbeda, tergantung pada apakah *props* `name` adalah `"tea"` atau `"coffee"`. Masalahnya adalah informasi tentang setiap minuman tersebar di beberapa kondisi. Refaktor kode ini untuk menggunakan satu pernyataan `if`, bukan tiga kondisi `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Bagian dari tanaman</dt>
        <dd>{name === 'tea' ? 'daun' : 'biji'}</dd>
        <dt>Kandungan kafein</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Usia</dt>
        <dd>{name === 'tea' ? '4,000+ tahun' : '1,000+ tahun'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Setelah Anda merefaktor kode untuk menggunakan `if`, apakah Anda memiliki ide lebih lanjut tentang cara menyederhanakannya?

<Solution>

Ada banyak cara yang bisa Anda lakukan untuk melakukan hal ini, tetapi berikut ini adalah salah satu titik awal:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'daun';
    caffeine = '15–70 mg/cup';
    age = '4,000+ tahun';
  } else if (name === 'coffee') {
    part = 'biji';
    caffeine = '80–185 mg/cup';
    age = '1,000+ tahun';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Bagian dari tanaman</dt>
        <dd>{part}</dd>
        <dt>Kandungan kafein</dt>
        <dd>{caffeine}</dd>
        <dt>Usia</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Di sini, informasi tentang setiap minuman dikelompokkan bersama dan bukannya tersebar di berbagai kondisi. Hal ini memudahkan untuk menambahkan lebih banyak minuman di masa mendatang.

Solusi lain adalah menghapus kondisi tersebut dengan memindahkan informasi ke dalam objek:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'daun',
    caffeine: '15–70 mg/cup',
    age: '4,000+ tahun'
  },
  coffee: {
    part: 'biji',
    caffeine: '80–185 mg/cup',
    age: '1,000+ tahun'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Bagian dari tanaman</dt>
        <dd>{info.part}</dd>
        <dt>Kandungan kafein</dt>
        <dd>{info.caffeine}</dd>
        <dt>Usia</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
