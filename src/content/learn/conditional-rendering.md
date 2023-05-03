---
title: Conditional Rendering
---

<Intro>

Komponen anda sering diperlukan untuk menampilkan hal yang berbeda tergantung dari beberapa kondisi yang berbeda. Di React, anda dapat melakukan render JSX secara bersyarat menggunakan sintaks JavaScript seperti pernyataan `if`, `&&`, dan `? :` operator.

</Intro>

<YouWillLearn>

* Cara mengembalikan JSX yang berbeda tergantung dari suatu kondisi
* Bagaimana cara memasukkan atau mengecualikan sepotong JSX secara bersyarat
* Pintasan sintaks bersyarat umum yang akan anda temukan di basis kode React

</YouWillLearn>

## Mengembalikan JSX secara Bersyarat {/*conditionally-returning-jsx*/}

Katakanlah anda memiliki komponen `PackingList` yang melakukan render pada beberapa `Item`, yang dapat ditandai secara dikemas atau tidak:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Perhatikan bahwa beberapa komponen `Item` memiliki properti `isPacked` yang disetel menjadi `true` daripada `false`. Anda ingin menambahkan tanda centang (✔) ke `Item` yang dikemas jika `isPacked={true}`.

Anda dapat menulis ini sebagai pernyataan [`if`/`else`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) seperti ini:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Jika properti `isPacked` adalah `true`, kode ini **mengembalikan JSX tree yang berbeda.** Dengan perubahan ini, beberapa `item` mendapat tanda centang di bagian akhir:

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
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Coba melakukan *edit* pada apa yang dikembalikan dalam kedua kasus tersebut, dan lihat bagaimana hasilnya berubah!

Perhatikan bagaimana anda membuat logika bercabang dengan pernyataan `if` dan `return` menggunakan JavaScript. Di React, alur kontrol (seperti kondisi) ditangani oleh JavaScript.

### Tidak mengembalikan Apa Pun secara Bersyarat dengan `null` {/*conditionally-returning-nothing-with-null*/}

Dalam kondisi tertentu, anda tidak ingin me-*render* apa pun. Sebagai Contoh, katakan anda tidak mau menampilkan `item` yang dikemas. Sebuah komponen harus mengembalikan sesuatu. Dalam kasus ini, anda dapat mengambalikan `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Jika `isPacked` adalah `true`, komponen tidak akan mengembalikan apa pun, `null`. Jika tidak, itu akan mengembalikan JSX untuk di-*render*.

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
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Dalam praktiknya, mengembalikan `null` dari sebuah komponen itu tidak umum karena dapat mengejutkan *developer* yang mencoba untuk me-*render*-nya. Lebih sering, anda akan menyertakan atau mengecualikan komponen secara bersyarat di komponen induk JSX. Berikut adalah cara untuk melakukannya!

## Secara Bersyarat memasukkan JSX {/*conditionally-including-jsx*/}

Pada contoh sebelumnya, anda mengontrol JSX *tree* mana (if any!) yang akan dikembalikan oleh komponen. Anda mungkin telah memperhatikan beberapa duplikasi dalam hasil *render*:

```js
<li className="item">{name} ✔</li>
```

mirip dengan

```js
<li className="item">{name}</li>
```

Kedua *branches* bersyarat tersebut mengembalikan `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Meskipun duplikasi ini tidak berbahaya, ini dapat membuka kode anda lebih susah untuk di-*maintain*. Bagaimana jika anda ingin mengganti `className`nya? Anda harus melakukannya di dua tempat dalam kode anda! Dalam situasi seperti itu, anda dapat menyertakan sedikit JSX secara bersyarat untuk membuat kode anda lebih [DRY.](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

### Operator (`? :`) Bersyarat (ternary) {/*conditional-ternary-operator--*/}

JavaScript memiliki syntax yang ringkas untuk menulis ekspresi bersyarat -- [operator bersyarat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) atau sering disebut sebagai *"ternary operator"*.

Daripada ini:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Anda dapat menulis ini:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

anda dapat membacanya sebagai *"jika `isPacked` adalah `true`, maka (`?`) render `name + ' ✔'`, jika tidak (`:`) render `name`"*.

<DeepDive>

#### Apakah kedua contoh tersebut sepenuhnya sama? {/*are-these-two-examples-fully-equivalent*/}

Jika anda berasal dari latar belakang pemrograman berorientasi objek, anda mungkin berasumsi bahwa kedua contoh tersebut sedikit berbeda karena salah satunya dapat membuat dua jenis "instansi" `<li>` berbeda. Tetapi elemen JSX bukan "instansi" karena mereka tidak memiliki *state* internal dan bukan node DOM yang sebenarnya. Itu deskripsi ringan, seperti cetak biru. Jadi kedua contoh ini, sebenarnya, *adalah* benar-benar sama. [Preserving and Resetting State](/learn/preserving-and-resetting-state) menjelaskan lebih detil bagaimana hal ini bekerja.

</DeepDive>

Sekarang katakanlah anda ingin membungkus teks `item` yang sudah selesai ke dalam tag HTML lain, seperti `<del>` untuk mencoretnya. Anda bahkan dapat menambahkan lebih banyak baris baru dan tanda kurung sehingga lebih mudah untuk menyarankan lebih banyak JSX di setiap kasus:

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
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Gaya ini bekerja dengan baik untuk kondisi yang sederhana, tetapi gunakan dengan secukupnya. Jika komponen anda berantakan dengan terlalu banyak *markup* bersyarat bersarang (*nested conditional markup*), pertimbangkan untuk mengekstrak komponen turunan untuk membersihkan semuanya. Di React, *markup* adalah bagian dari kode anda, sehingga anda dapat menggunakan alat seperti variabel (`variables`) dan fungsi (`functions`) untuk merapikan ekspresi yang kompleks.

### Operator Logika `AND` (`&&`) {/*logical-and-operator-*/}

Pintasan umum lainnya yang akan anda temui adalah [JavaScript logical AND (`&&`) operator.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) Di Dalam komponen React, hal tersebut sering muncul ketika anda ingin me-*render* beberapa JSX apabila memiliki kondisi `true`, **atau tidak me-*render* sebaliknya.** Dengan `&&`, anda dapat me-*render* tanda centang secara bersyarat hanya jika `isPacked` adalah `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

Anda dapat membaca ini sebagai *"jika `isPacked`, maka (`&&`) render tanda centang, jika tidak, tidak render apa pun"*.

Seperti berikut:

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
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[Ekspresi && JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) mengembalikan nilai sisi kanannya (dalam kasus ini, tanda centang) jika sisi kirinya (kondisi kita) adalah `true`. Tetapi jika kondisinya adalah `false`, seluruh ekspresi menjadi `false`. React menganggap `false` sebagai sebuah "lubang" pada JSX *tree*, sama seperti `null` atau `undefined`, dan tidak me-*render* apa pun di tempatnya.


<Pitfall>

**Jangan menaruh Angka di sisi kiri `&&`.**

Untuk menguji kondisi tersebut, JavaScript mengubah sisi kiri menjadi sebuah *`boolean`* secara otomatis. Namun, jika sisi kiri adalah `0`, maka seluruh ekspresi akan mendapatkan nilai (`0`) tesebut, dan React akan dengan senang hati me-*render* `0` daripada tidak sama sekali.

Sebagai contoh, kesalahan umum yang sering terjadi adalah menulis kode seperti `messageCount && <p>Pesan Baru</p>`. Sangat mudah untuk berasumsi bahwa itu tidak me-*render*/menghasilkan apa-apa ketika `messageCount` adalah `0`, tapi itu benar-benar me-*render* `0` itu sendiri!

Untuk memperbaikinya, jadikan sisi kiri sebagai *`boolean`*: `messageCount > 0 && <p>Pesan Baru</p>`.

</Pitfall>

### Menugaskan JSX secara Bersyarat ke sebuah Variabel {/*conditionally-assigning-jsx-to-a-variable*/}

Saat pintasan menghalangi dalam penulisan kode biasa, coba gunakan pernyataan `if` dan sebuah variabel. Anda dapat menetapkan ulang variabel yang telah ditentukan dengan menggunakan [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), jadi mulailah dengan menyediakan konten *default* yang ingin anda tampilkan, namanya:

```js
let itemContent = name;
```

Gunakan pernyataan `if` untuk menetapkan kembali ekspresi JSX ke `itemContent` jika `isPacked` adalah `true`:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[Kurung kurawal membuka "jendela ke JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Menyematkan variabel dengan kurung kurawal di JSX *tree* yang dikembalikan, menyarangkan ekspresi yang sebelumnya dihitung di dalam JSX:

```js
<li className="item">
  {itemContent}
</li>
```

Gaya ini paling bertele-tele, tetapi juga yang paling fleksibel. Berikut adalah caranya:

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
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Seperti sebelumnya, cara ini bekerja tidak hanya pada teks, tetapi juga pada JSX yang sewenang-wenang:

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
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Jika anda tidak terbiasa dengan JavaScript, variasi dari gaya ini mungkin tampak berlebihan pada awalnya. Namun, mempelajarinya akan membantu anda dalam membaca dan menulis kode JavaScript apa pun -- dan bukan hanya komponen React! Pilih salah satu yang anda sukai sebagai permulaan, dan lihat kembali referensi ini jika anda lupa cara kerja yang lain.

<Recap>

* Di React, anda mengontrol logika percabangan dengan JavaScript.
* Anda dapat mengembalikan ekspresi JSX secara bersyarat menggunakan pernyataan `if`.
* Anda dapat menyimpan beberapa JSX ke dalam sebuah variabel secara bersyarat dan kemudian memasukkannya ke dalam JSX yang lain dengan menggunakan kurung kurawal.
* Di JSX, `{cond ? <A /> : <B />}` berarti *"jika `cond`, render `<A />`, jika tidak `<B />`"*.
* Di JSX, `{cond && <A />}` berarti *"jika `cond`, render `<A />`, jika tidak render apa pun"*.
* Pintasan itu umum, tapi anda tidak harus menggunakannya jika anda lebih menyukai pernyataan `if`.

</Recap>



<Challenges>

#### Tampilkan ikon untuk item yang tidak lengkap dengan menggunakan `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Gunakan operator bersyarat (`cond ? a : b`) untuk me-*render* sebuah ❌ jika `isPacked` bukan `true`.

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
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
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
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Tunjukan *importance* item dengan menggunakan `&&` {/*show-the-item-importance-with-*/}

Dalam contoh ini, setiap `Item` menerima sebuah properti numerik `importance`. Gunakan operator `&&` untuk me-*render* "_(Importance: X)_" dalam *italics*, tapi hanya untuk *items* yang memiliki properti importance bukan nol. Kumpulan *item* anda akan terlihat seperti ini:

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

Jangan lupa untuk menambahkan spasi di antara kedua label tersebut!

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
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Berikut adalah cara penyelesaiannya:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Andrian Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Catat bahwa andar harus menulis `importance > 0 && ...` daripada `importance && ...` sehingga jika `importance` adalah `0`, `0` tidak akan di-*render* sebagai hasilnya!

Dalam solusi ini, dua kondisi berbeda digunakan untuk menambahkan spasi diantara nama dan label *`importance`. Alternatifnya, anda bisa menggunakan *`fragment`* dengan spasi terdepan: `importance > 0 && <> <i>...</i></>` atau menambahkan spasi tepat di dalam  `<i>`:  `importance > 0 && <i> ...</i>`.

</Solution>

#### Lakukan *refactor* terhadap serangkaian kondisi `? :` menjadi menggunakan `if` dan variabel {/*refactor-a-series-of---to-if-and-variables*/}

Komponen `Drink` menggunakan serangkaian kondisi `? :` untuk menampilkan informasi berbeda tergantung dari properti `name` bernilai `"tea"` atau `"coffee"`. Masalahnya adalah informasi setiap *`drink`* tersebar di berbagai kondisi. Lakukan *refactor* pada kode ini untuk menggunakan satu pernyataan `if` daripada menggunakan 3 kondisi `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
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

Setelah anda melakukan *refactor* kode tersebut menggunakan pernyataan `if`, apakah anda memiliki ide lebih lanjut untuk menyederhanakannya?

<Solution>

Ada banyak cara untuk melakukannya, tetapi berikut adalah salah satu titik awal:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
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

Disini informasi tentang setiap *drink* dikelompokkan bersama, bukannya disebarkan ke berbagai kondisi. Ini membuatnya lebih mudah untuk menambahkan lebih banyak *drinks* di masa mendatang.

Solusi lainnya adalah menghapus kondisi bersamaan dengan memindahkan infomasi ke dalam objek.

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
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
