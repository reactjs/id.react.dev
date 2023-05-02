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

Katakanlah anda memiliki komponen `PackingList` yang melakukan render pada beberapa `Item`s, yang dapat ditandai secara dikemas atau tidak:

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

Coba melakukan edit apa yang dikembalikan dalam kedua kasus tersebut, dan lihat bagaimana hasilnya berubah!

Perhatikan bagaimana anda membuat logika bercabang dengan pernyataan `if` dan `return` menggunakan JavaScript. Di React, alur kontrol (seperti kondisi) ditangani oleh JavaScript.

### Tidak mengembalikan apa pun secara bersyarat dengan `null` {/*conditionally-returning-nothing-with-null*/}

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

Pada contoh sebelumnya, anda mengontrol JSX *tree* mana (*if any!*) yang akan dikembalikan oleh komponen. Anda mungkin telah memperhatikan beberapa duplikasi dalam hasil *render*:

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

Meskipun duplikasi ini tidak berbahaya, ini dapat membuka kode anda lebih susah untuk di-*maintain*. Bagaimana jika anda ingi mengganti `className`nya? Anda harus melakukannya di dua tempat dalam kode anda! Dalam situasi seperti itu, anda dapat menyertakan sedikit JSX secara bersyarat untuk membuat kode anda lebih [DRY.](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

### Operator (`? :`) bersyarat (ternary) {/*conditional-ternary-operator--*/}

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

### Operator Logis AND (`&&`) {/*logical-and-operator-*/}

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

**Jangan menaruh angka di sisi kiri `&&`.**

Untuk menguji kondisi tersebut, JavaScript mengubah sisi kiri menjadi sebuah `*boolean*` secara otomatis. Namun, jika sisi kiri adalah `0`, maka seluruh ekspresi akan mendapatkan nilai (`0`) tesebut, dan React akan dengan senang hati me-*render* `0` daripada tidak sama sekali.

Sebagai contoh, kesalahan umum yang sering terjadi adalah menulis kode seperti `messageCount && <p>Pesan Baru</p>`. Sangat mudah untuk berasumsi bahwa itu tidak me-*render*/menghasilkan apa-apa ketika `messageCount` adalah `0`, tapi itu benar-benar me-*render* `0` itu sendiri!

Untuk memperbaikinya, jadikan sisi kiri sebagai `*boolean*`: `messageCount > 0 && <p>Pesan Baru</p>`.

</Pitfall>

### Conditionally assigning JSX to a variable {/*conditionally-assigning-jsx-to-a-variable*/}

When the shortcuts get in the way of writing plain code, try using an `if` statement and a variable. You can reassign variables defined with [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), so start by providing the default content you want to display, the name:

```js
let itemContent = name;
```

Use an `if` statement to reassign a JSX expression to `itemContent` if `isPacked` is `true`:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[Curly braces open the "window into JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Embed the variable with curly braces in the returned JSX tree, nesting the previously calculated expression inside of JSX:

```js
<li className="item">
  {itemContent}
</li>
```

This style is the most verbose, but it's also the most flexible. Here it is in action:

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
      <h1>Sally Ride's Packing List</h1>
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

Like before, this works not only for text, but for arbitrary JSX too:

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
      <h1>Sally Ride's Packing List</h1>
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

If you're not familiar with JavaScript, this variety of styles might seem overwhelming at first. However, learning them will help you read and write any JavaScript code -- and not just React components! Pick the one you prefer for a start, and then consult this reference again if you forget how the other ones work.

<Recap>

* In React, you control branching logic with JavaScript.
* You can return a JSX expression conditionally with an `if` statement.
* You can conditionally save some JSX to a variable and then include it inside other JSX by using the curly braces.
* In JSX, `{cond ? <A /> : <B />}` means *"if `cond`, render `<A />`, otherwise `<B />`"*.
* In JSX, `{cond && <A />}` means *"if `cond`, render `<A />`, otherwise nothing"*.
* The shortcuts are common, but you don't have to use them if you prefer plain `if`.

</Recap>



<Challenges>

#### Show an icon for incomplete items with `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Use the conditional operator (`cond ? a : b`) to render a ❌ if `isPacked` isn’t `true`.

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
      <h1>Sally Ride's Packing List</h1>
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
      <h1>Sally Ride's Packing List</h1>
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

#### Show the item importance with `&&` {/*show-the-item-importance-with-*/}

In this example, each `Item` receives a numerical `importance` prop. Use the `&&` operator to render "_(Importance: X)_" in italics, but only for items that have non-zero importance. Your item list should end up looking like this:

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

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
      <h1>Sally Ride's Packing List</h1>
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

This should do the trick:

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
      <h1>Sally Ride's Packing List</h1>
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

Note that you must write `importance > 0 && ...` rather than `importance && ...` so that if the `importance` is `0`, `0` isn't rendered as the result!

In this solution, two separate conditions are used to insert a space between the name and the importance label. Alternatively, you could use a fragment with a leading space: `importance > 0 && <> <i>...</i></>` or add a space immediately inside the `<i>`:  `importance > 0 && <i> ...</i>`.

</Solution>

#### Refactor a series of `? :` to `if` and variables {/*refactor-a-series-of---to-if-and-variables*/}

This `Drink` component uses a series of `? :` conditions to show different information depending on whether the `name` prop is `"tea"` or `"coffee"`. The problem is that the information about each drink is spread across multiple conditions. Refactor this code to use a single `if` statement instead of three `? :` conditions.

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

Once you've refactored the code to use `if`, do you have further ideas on how to simplify it?

<Solution>

There are multiple ways you could go about this, but here is one starting point:

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

Here the information about each drink is grouped together instead of being spread across multiple conditions. This makes it easier to add more drinks in the future.

Another solution would be to remove the condition altogether by moving the information into objects:

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
