---
title: useMemo
---

<Intro>

`useMemo` merupakan React Hook yang memungkinkan kamu untuk meng-*cache* hasil perhitungan pada tiap *render*.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Panggil `useMemo` di tingkat atas komponen Anda untuk meng-*cache* hasil perhitungan pada tiap *render.

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[Lihat contoh lainnya.](#usage)

#### Parameters {/*parameters*/}

* `calculateValue`: Fungsi untuk menghitung nilai yang ingin Anda *cache*. Nilai harus murni, tidak mempunyai argumen, dan harus membalikkan nilai dari tipe data apapun. React akan memanggil fungsi tersebut pada *render* awal. Pada *render* selanjutnya, React akan mengembalikan nilai yang sama jika `dependencies` tidak berubah dari *render* terakhir. Sebaliknya, React akan memanggil `calculateValue`, mengembalikan hasil nilainya, dan disimpan sehingga nilai tersebut dapat digunakan kembali nantinya.

* `dependencies`: Daftar dari semua nilai reaktif yang direferensikan dalam kode `calculatedValue`. Nilai reaktif termasuk *props*, *state*, serta seluruh variabel dan fungsi yang dideklarasi langsung dalam badan komponen. Jika *linter* Anda sudah [dikonfigurasi untuk React](/learn/editor-setup#linting), maka *linter* akan memeriksa setiap nilai reaktif sudah dispesifikasikan sebagai sebuah *dependency* dengan benar. Daftar `dependency` harus memiliki jumlah *item* yang tetap dan dituliskan dalam sebaris seperti `[dep1, dep2, dep3]`. React akan membandingkan tiap `dependency` dengan nilai sebelumnya menggunakan perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Kembalian {/*returns*/}

Pada *render* pertama kali, `useMemo` mengembalikan hasil pemanggilan `calculateValue` tanpa argumen.

Saat *render* selanjutnya, akan mengembalikan nilai yang telah disimpan dari *render* selanjutnya (apabila `dependency` belum berubah), atau kembali memanggil `calculateValue`, dan mengembalikan hasil yang dikembalikan oleh `calculateValue`.

#### Catatan Penting {/*caveats*/}

* `useMemo` merupakan Hook, jadi Anda hanya dapat memanggilnya **di tingkat atas komponen Anda** atau pada Hook Anda sendiri. Anda tidak bisa memanggilnya di dalam perulangan atau suatu kondisi. Jika Anda memerlukannya, ekstrak komponen baru dan pindahkan *state* tersebut ke dalamnya.
* Pada *Strict Mode*, React akan **memanggil fungsi perhitungan Anda dua kali** untuk [membantu Anda menemukan ketidakmurnian (*impurity*) yang tidak disengaja.](#my-calculation-runs-twice-on-every-re-render) Perlakuan ini hanya terjadi pada *development* dan tidak memengaruhi *production*. Jika fungsi perhitungan Anda murni (sebagaimana mestinya), maka seharusnya tidak memengaruhi logika Anda. Hasil dari salah satu pemanggilan akan diabaikan.
* React **tidak akan membuang nilai *cache* kecuali ada alasan spesifik untuk melakukannya**. Sebagai contoh, pada *development*, React membuang *cache* ketika Anda menyunting *file* komponen Anda. Baik dalam *development* dan *production*, React akan membuang *cache* jika komponen Anda menunda saat *mount* awal. Kedepannya, React mungkin akan menambahkan fitur yang memanfaatkan pembuangan *cache*--misalnya, jika React menambahkan dukungan bawaan untuk daftar virtual di masa depan, maka akan masuk akal untuk membuang *cache* untuk *item* yang keluar dari tampilan tabel virtual. Hal ini seharusnya tidak masalah jika Anda hanya mengandalkan `useMemo` sebagai optimasi kinerja semata. Jika tidak, [variabel status](/reference/react/useState#avoiding-recreating-the-initial-state) atau sebuah [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) mungkin lebih tepat.

<Note>

Meng-*cache* hasil kembalian seperti ini juga dikenal sebagai [*memoisasi*](https://en.wikipedia.org/wiki/Memoization), maka dari itu Hook ini disebut sebagai `useMemo`.

</Note>

---

## Penggunaan {/*usage*/}

### Melewati perhitungan ulang yang mahal {/*skipping-expensive-recalculations*/}

Untuk meng-*cache* perhitungan di antara *render* ulang, kemas dalam panggilan `useMemo` di tingkat atas komponen Anda:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Anda perlu memberikan dua hal untuk `useMemo`:

1. Sebuah <CodeStep step={1}>fungsi perhitungan</CodeStep> tanpa argumen, seperti `() =>` dan mengembalikan apa yang ingin Anda hitung.
2. Sebuah <CodeStep step={2}>daftar *dependency*</CodeStep> termasuk setiap nilai pada komponen Anda yang digunakan dalam perhitngan Anda.

Pada *render* awal, <CodeStep step={3}>nilai</CodeStep> yang akan Anda dapatkan dari `useMemo` akan menjadi hasil dari pemanggilan <CodeStep step={1}>perhitungan</CodeStep> Anda.

Pada setiap *render* berikutnya, React akan membandingkan <CodeStep step={2}>`dependency`</CodeStep> dengan `dependency` yang Anda berikan pada *render* sebelumnya. Jika `dependency` tersebut tidak berubah, (bandingkan dengan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo` akan mengembalikan nilai yang telah Anda hitung sebelumnya. Sebaliknya, React akan menjalankan ulang perhitungan Anda dan mengembalikan nilai baru.

Dengan kata lain, `useMemo` meng-*cache* hasil perhitungan antara *render* ulang hingga *dependency*-nya berubah.

**Mari telusuri contoh untuk melihat kapan ini berguna.**

Secara bawaan, React akan menjalankan ulang seluruh badan kompoenn Anda setiap *render* ulang. Sebagai contoh, jika `TodoList` memperbarui *state*-nya atau mendapatkan *props* baru dari *parent*-nya, fungsi `filterTodos` akan dijalankan kembali:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Biasanya, hal ini tidak menjadi masalah karena kebanyakan perhitungan dilakukan dengan sangat cepat. Namun, jika Anda melakukan penyaringan atau mengubah seranai (*array*) yang besar, atau melakukan komputasi yang mahal, Anda mungkin ingin melewatkan melakukannya lagi jika data tidak berubah. Jika `todos` dan `tab` sama seperti *render* terakhir, mengemas perhitungan tersebut dalam `useMemo` seperti sebelumnya memungkinkan Anda menggunakan kembali `visibleTodos` yang telah Anda hitung sebelumnya.

Tipe *caching* ini disebut dengan *[memoisasi.](https://en.wikipedia.org/wiki/Memoization)*

<Note>

**Anda sebaiknya hanya mengandalkan `useMemo` untuk pengoptimalan kinerja.** Jika koda Anda tidak berjalan tanpanya, temukan masalah dasarnya dan perbaiki terlebih dahulu. Kemudian Anda dapat menambahkan `useMemo` untuk meningkatkan kinerja.

</Note>

<DeepDive>

#### Bagaimana cara mengetahui bahwa sebuah perhitungan itu mahal? {/*how-to-tell-if-a-calculation-is-expensive*/}

Pada umumnya, kecuali jika Anda membuat atau mengulang ribuan objek, mungkin perhitungan itu tidak mahal. Jika Anda ingin lebih percaya diri, Anda dapat menambahkan *console log* untuk mengukur waktu yang dihabiskan dalam sebuah kode:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Lakukan interaksi yang adna ukur (misalnya, mengetik ke dalam masukan). Anda akan melihat *log* seperti `filter array: 0.15ms` pada *console* Anda. Jika keseluruhan waktu yang dicatat bertambah hingga jumlah yang signifikan (seperti `1ms` atau lebih), mungkin masuk akal untuk memoisasi perhitungan tersebut. Sebagai percobaan, Anda kemudian dapat membungkus perhitungan tersebut dalam `useMemo` untuk mengecek apakah total waktu yang dicatat untuk interaksi tersebut berkurang atau tidak:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Dilewatkan jika todos dan tab tidak berubah
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` tidak akan membuat *render* pertama lebih cepat. Ini hanya membantu Anda melewati pekerjaan yang tidak perlu pada pembaruan.

Ingatlah bahwa mesin Anda mungkin lebih cepat daripada pengguna Anda, jadi sebaiknya uji kinerja dengan pelambatan buatan. Sebagai contoh, Chrome menawarkan opsi [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) untuk hal ini.

Perhatikan juga bahwa mengukur kinerja dalam *development* tidak akan memberikan Anda hasil yang paling akurat. (Misalnya, jika [Strict Mode](/reference/react/StrictMode) menyala, Anda akan melihat setiap komponen di-*render* dua kali, bukan sekali.) Untuk memperoleh pengukuran waktu yang paling akurat, buat aplikasi Anda untuk *production* dan uji pada perangkat seperti yang dimiliki pengguna Anda.

</DeepDive>

<DeepDive>

#### Haruskah Anda menambahkan useMemo di mana-mana? {/*should-you-add-usememo-everywhere*/}

Jika aplikasi Anda seperti situs ini, dan sebagian besar interaksinya kasar (seperti mengganti halaman atau seluruh bagian), memoisasi biasanya tidak diperlukan. Di sisi lain, jika aplikasi Anda lebih seperti editor gambar, dan sebagian besar interaksinya halus (seperti memindahkan bentuk), maka Anda mungkin akan menemukan memoisasi sangat membantu.

Pengoptimalan dengan `useMemo` hanya bermanfaat pada beberapa kasus:

- Perhitungan yang Anda masukkan ke dalam `useMemo` cukup lambat, dan `dependency`-nya jarang berubah.
- Anda meneruskannya sebagai *prop* ke komponen yang dibungkus dalam[`memo`.](/reference/react/memo) Anda ingin melewati *render* ulang jika nilainya tidak berubah. Memoisasi memungkinkan komponen Anda melakukan *render* ulang hanya saat *dependency*-nya tidak sama.
- Nilai yang anda berikan nantinya akan digunakan sebagai *dependency* dari beberapa Hook. Sebagai contoh, mungkin perhitungan `useMemo` yang lain bergantung pada nilai tersebut. Atau mungkin Anda bergantung pada nilai ini dari [`useEffect.`](/reference/react/useEffect)

Tidak ada manfaat untuk membungkus perhitungan dalam `useMemo` pada kasus lainnya. Tidak ada salahnya melakukan itu juga, jadi beberapa tim memilih untuk tidak memikirkan kasus-kasus individu, dan membuat memo sebanyak mungkin. Kelemahan dari pendekatan ini adalah kode menjadi sulit dibaca. Selain itu, tidak semua memoisasi efektif: suatu nilai yang "selalu baru" sudah cukup untuk menghentikan memoisasi pada seluruh komponen.

**Dalam praktiknya, Anda dapat membuat memoisasi tidak diperlukan dengan mengikuti beberapa prinsip:**

1. Saat suatu komponen membungkus komponen lainnya secara visual, biarkan ia [menerika JSX sebagai *children*.](/learn/passing-props-to-a-component#passing-jsx-as-children) Dengan cara ini, ketika komponen pembungkus memperbarui *state*-nya sendiri, React mengetahui bahwa *children*-nya tidak perlu melakukan *render* ulang.
1. Pilih *state* lokal dan jangan [angkat *state*](/learn/sharing-state-between-components) lebih dari yang diperlukan. Sebagai contoh, jangan simpan *state* sementara seperti *form* dan apakah *item* di-*hover* pada atas pohon Anda atau di *global state library*.
1. Jaga agar [logika *render* tetap murni.](/learn/keeping-components-pure) Jika me*render* ulang suatu komponen menyebabkan masalah atau menghasilkan artefak visual yang mencolok, itu adalah *bug* di komponen Anda! Perbaiki *bug* alih-alih menambahkan memoisasi.
1. Hindari [Effect tidak berguna yang memperbarui state.](/learn/you-might-not-need-an-effect) Sebagian besar masalah kinerja di aplikasi React disebabkan oleh rantai pembaruan yang berasal dari Effect yang menyebabkan komponen Anda me*render* berulang kali.
1. Cobalah untuk [menghilangkan *dependency* yang tidak perlu dari Effect Anda.](/learn/removing-effect-dependencies) Sebagai contoh, dibandingkan memoisasi, seringkali lebih mudah untuk memindahkan beberapa objek atau fungsi di dalam Effect atau di luar komponen.

Jika interaksi tertentu masih terasa lamban, [gunakan *profiler* React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) untuk melihat komponen mana yang paling diuntungkan dengan memoisasi dan tambahkan memoisasi jika diperlukan. Prinsip ini akan menjadikan komponen Anda lebih gampang di-*debug* dan dipahami, jadi ada baiknya untuk mengikutinya dalam hal apapun. Dalam jangka panjang, kami sedang meneliti [melakukan memoisasi terperinci secara otomatis](https://www.youtube.com/watch?v=lGEMwh32soc) untuk menyelesaikan masalah ini sekali dan untuk selamanya.

</DeepDive>

<Recipes titleText="Perbedaan antara useMemo dan menghitung suatu nilai secara langsung" titleId="examples-recalculation">

#### Melewati perhitungan ulang dengan `useMemo` {/*skipping-recalculation-with-usememo*/}

Pada contoh ini, implementasi `filterTodos` **diperlambat secara artifisial** sehingga Anda dapat melihat apa yang terjadi jika beberapa fungsi JavaScript yang Anda panggil selama me*render* benar-benar lambat. Coba ganti *tab* dan ubah temanya.

Mengganti *tab* terasa lambat karena memaksa `filterTodos` yang diperlambat untuk dijalankan kembali. Itu hal yang wajar karena `tab` berubah, sehingga seluruh perhitungan *perlu* dijalankan kembali. (Jika Anda penasaran mengapa berjalan dua kali, hal ini dijelaskan [di sini.](#my-calculation-runs-twice-on-every-re-render))

Ubah temanya. **Berkat `useMemo`, tetap cepat meskipun ada pelambatan buatan!** Pemanggilan `filterTodos` yang lambat dilewati karena `todos` dan `tab` (yang Anda berikan sebagai `dependency` ke `useMemo`) tidak berubah sejak *render* terakhir.

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Catatan: <code>filterTodos</code> diperlambat secara artifisial!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[DILAMBATKAN] Menyaring ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Tidak melewati apapun selama 500 ms untuk meniru kode yang sangat lambat
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Selalu hitung ulang suatu nilai {/*always-recalculating-a-value*/}

Pada contoh ini, implementasi `filterTodos` juga **dilambatkan secara artifisial** sehingga Anda dapat melihat apa yang terjadi ketika beberapa fungsi JavaScript yang Anda panggil ketika *rendering* sangat lambat. Coba ganti *tab* dan ubah temanya.

Tidak seperti contoh sebelumnya, mengubah tema juga sangat lambat! Hal ini karena **tidak adanya pemanggilan `useMemo` di versi ini**, sehingga `filterTodos` yang dilambatkan secara artifisial terpanggil tiap *render* ulang. Ini akan dipanggil walaupun hanya `theme` yang berubah.

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[DILAMBATKAN] Menyaring ' + todos.length + ' todos untuk tab "' + tab + '".');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Tidak melewati apapun selama 500 ms untuk meniru kode yang sangat lambat
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Namun, ini adalah kode yang sama **dengan pelambat buatan dihapus.** Apakah tidak adanya `useMemo` terasa?

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Menyaring ' + todos.length + ' todos untuk tab "' + tab + '".');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Seringnya, kode tanpa memoisasi berjalan dengan baik. Jika interaksi Anda cukup cepat, Anda mungkin tidak membutuhkan memoisasi.

Anda dapat menambahkan jumlah *item* todo pada `utils.js` dan lihat bagaimana perilaku berubah. Perhitungan ini awalnya memang tidak terlalu mahal, namun jika jumlah todo bertambah secara signifikan, sebagian besar biaya akan terletak pada *rendering* ulang daripada *filtering*. Baca terus di bawah untuk melihat bagaimana Anda dapat mengoptimalkan *rendering* ulang dengan `useMemo`.

<Solution />

</Recipes>

---

### Skipping re-rendering of components {/*skipping-re-rendering-of-components*/}

In some cases, `useMemo` can also help you optimize performance of re-rendering child components. To illustrate this, let's say this `TodoList` component passes the `visibleTodos` as a prop to the child `List` component:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

You've noticed that toggling the `theme` prop freezes the app for a moment, but if you remove `<List />` from your JSX, it feels fast. This tells you that it's worth trying to optimize the `List` component.

**By default, when a component re-renders, React re-renders all of its children recursively.** This is why, when `TodoList` re-renders with a different `theme`, the `List` component *also* re-renders. This is fine for components that don't require much calculation to re-render. But if you've verified that a re-render is slow, you can tell `List` to skip re-rendering when its props are the same as on last render by wrapping it in [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**With this change, `List` will skip re-rendering if all of its props are the *same* as on the last render.** This is where caching the calculation becomes important! Imagine that you calculated `visibleTodos` without `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Every time the theme changes, this will be a different array...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... so List's props will never be the same, and it will re-render every time */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**In the above example, the `filterTodos` function always creates a *different* array,** similar to how the `{}` object literal always creates a new object. Normally, this wouldn't be a problem, but it means that `List` props will never be the same, and your [`memo`](/reference/react/memo) optimization won't work. This is where `useMemo` comes in handy:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Tell React to cache your calculation between re-renders...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...so as long as these dependencies don't change...
  );
  return (
    <div className={theme}>
      {/* ...List will receive the same props and can skip re-rendering */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**By wrapping the `visibleTodos` calculation in `useMemo`, you ensure that it has the *same* value between the re-renders** (until dependencies change). You don't *have to* wrap a calculation in `useMemo` unless you do it for some specific reason. In this example, the reason is that you pass it to a component wrapped in [`memo`,](/reference/react/memo) and this lets it skip re-rendering. There are a few other reasons to add `useMemo` which are described further on this page.

<DeepDive>

#### Memoizing individual JSX nodes {/*memoizing-individual-jsx-nodes*/}

Instead of wrapping `List` in [`memo`](/reference/react/memo), you could wrap the `<List />` JSX node itself in `useMemo`:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

The behavior would be the same. If the `visibleTodos` haven't changed, `List` won't be re-rendered.

A JSX node like `<List items={visibleTodos} />` is an object like `{ type: List, props: { items: visibleTodos } }`. Creating this object is very cheap, but React doesn't know whether its contents is the same as last time or not. This is why by default, React will re-render the `List` component.

However, if React sees the same exact JSX as during the previous render, it won't try to re-render your component. This is because JSX nodes are [immutable.](https://en.wikipedia.org/wiki/Immutable_object) A JSX node object could not have changed over time, so React knows it's safe to skip a re-render. However, for this to work, the node has to *actually be the same object*, not merely look the same in code. This is what `useMemo` does in this example.

Manually wrapping JSX nodes into `useMemo` is not convenient. For example, you can't do this conditionally. This is usually why you would wrap components with [`memo`](/reference/react/memo) instead of wrapping JSX nodes.

</DeepDive>

<Recipes titleText="The difference between skipping re-renders and always re-rendering" titleId="examples-rerendering">

#### Skipping re-rendering with `useMemo` and `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

In this example, the `List` component is **artificially slowed down** so that you can see what happens when a React component you're rendering is genuinely slow. Try switching the tabs and toggling the theme.

Switching the tabs feels slow because it forces the slowed down `List` to re-render. That's expected because the `tab` has changed, and so you need to reflect the user's new choice on the screen.

Next, try toggling the theme. **Thanks to `useMemo` together with [`memo`](/reference/react/memo), it’s fast despite the artificial slowdown!** The `List` skipped re-rendering because the `visibleItems` array has not changed since the last render. The `visibleItems` array has not changed because both `todos` and `tab` (which you pass as dependencies to `useMemo`) haven't changed since the last render.

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Always re-rendering a component {/*always-re-rendering-a-component*/}

In this example, the `List` implementation is also **artificially slowed down** so that you can see what happens when some React component you're rendering is genuinely slow. Try switching the tabs and toggling the theme.

Unlike in the previous example, toggling the theme is also slow now! This is because **there is no `useMemo` call in this version,** so the `visibleTodos` is always a different array, and the slowed down `List` component can't skip re-rendering.

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

However, here is the same code **with the artificial slowdown removed.** Does the lack of `useMemo` feel noticeable or not?

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Quite often, code without memoization works fine. If your interactions are fast enough, you don't need memoization.

Keep in mind that you need to run React in production mode, disable [React Developer Tools](/learn/react-developer-tools), and use devices similar to the ones your app's users have in order to get a realistic sense of what's actually slowing down your app.

<Solution />

</Recipes>

---

### Memoizing a dependency of another Hook {/*memoizing-a-dependency-of-another-hook*/}

Suppose you have a calculation that depends on an object created directly in the component body:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body
  // ...
```

Depending on an object like this defeats the point of memoization. When a component re-renders, all of the code directly inside the component body runs again. **The lines of code creating the `searchOptions` object will also run on every re-render.** Since `searchOptions` is a dependency of your `useMemo` call, and it's different every time, React knows the dependencies are different, and recalculate `searchItems` every time.

To fix this, you could memoize the `searchOptions` object *itself* before passing it as a dependency:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Only changes when text changes

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Only changes when allItems or searchOptions changes
  // ...
```

In the example above, if the `text` did not change, the `searchOptions` object also won't change. However, an even better fix is to move the `searchOptions` object declaration *inside* of the `useMemo` calculation function:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Only changes when allItems or text changes
  // ...
```

Now your calculation depends on `text` directly (which is a string and can't "accidentally" become different).

---

### Memoizing a function {/*memoizing-a-function*/}

Suppose the `Form` component is wrapped in [`memo`.](/reference/react/memo) You want to pass a function to it as a prop:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

Just as `{}` creates a different object, function declarations like `function() {}` and expressions like `() => {}` produce a *different* function on every re-render. By itself, creating a new function is not a problem. This is not something to avoid! However, if the `Form` component is memoized, presumably you want to skip re-rendering it when no props have changed. A prop that is *always* different would defeat the point of memoization.

To memoize a function with `useMemo`, your calculation function would have to return another function:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

This looks clunky! **Memoizing functions is common enough that React has a built-in Hook specifically for that. Wrap your functions into [`useCallback`](/reference/react/useCallback) instead of `useMemo`** to avoid having to write an extra nested function:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

The two examples above are completely equivalent. The only benefit to `useCallback` is that it lets you avoid writing an extra nested function inside. It doesn't do anything else. [Read more about `useCallback`.](/reference/react/useCallback)

---

## Troubleshooting {/*troubleshooting*/}

### My calculation runs twice on every re-render {/*my-calculation-runs-twice-on-every-re-render*/}

In [Strict Mode](/reference/react/StrictMode), React will call some of your functions twice instead of once:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // This component function will run twice for every render.

  const visibleTodos = useMemo(() => {
    // This calculation will run twice if any of the dependencies change.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

This is expected and shouldn't break your code.

This **development-only** behavior helps you [keep components pure.](/learn/keeping-components-pure) React uses the result of one of the calls, and ignores the result of the other call. As long as your component and calculation functions are pure, this shouldn't affect your logic. However, if they are accidentally impure, this helps you notice and fix the mistake.

For example, this impure calculation function mutates an array you received as a prop:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Mistake: mutating a prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React calls your function twice, so you'd notice the todo is added twice. Your calculation shouldn't change any existing objects, but it's okay to change any *new* objects you created during the calculation. For example, if the `filterTodos` function always returns a *different* array, you can mutate *that* array instead:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correct: mutating an object you created during the calculation
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Read [keeping components pure](/learn/keeping-components-pure) to learn more about purity.

Also, check out the guides on [updating objects](/learn/updating-objects-in-state) and [updating arrays](/learn/updating-arrays-in-state) without mutation.

---

### My `useMemo` call is supposed to return an object, but returns undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

This code doesn't work:

```js {1-2,5}
  // 🔴 You can't return an object from an arrow function with () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

In JavaScript, `() => {` starts the arrow function body, so the `{` brace is not a part of your object. This is why it doesn't return an object, and leads to mistakes. You could fix it by adding parentheses like `({` and `})`:

```js {1-2,5}
  // This works, but is easy for someone to break again
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

However, this is still confusing and too easy for someone to break by removing the parentheses.

To avoid this mistake, write a `return` statement explicitly:

```js {1-3,6-7}
  // ✅ This works and is explicit
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### Every time my component renders, the calculation in `useMemo` re-runs {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Make sure you've specified the dependency array as a second argument!

If you forget the dependency array, `useMemo` will re-run the calculation every time:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalculates every time: no dependency array
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

This is the corrected version passing the dependency array as a second argument:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Does not recalculate unnecessarily
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

If this doesn't help, then the problem is that at least one of your dependencies is different from the previous render. You can debug this problem by manually logging your dependencies to the console:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

You can then right-click on the arrays from different re-renders in the console and select "Store as a global variable" for both of them. Assuming the first one got saved as `temp1` and the second one got saved as `temp2`, you can then use the browser console to check whether each dependency in both arrays is the same:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

When you find which dependency breaks memoization, either find a way to remove it, or [memoize it as well.](#memoizing-a-dependency-of-another-hook)

---

### I need to call `useMemo` for each list item in a loop, but it's not allowed {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Suppose the `Chart` component is wrapped in [`memo`](/reference/react/memo). You want to skip re-rendering every `Chart` in the list when the `ReportList` component re-renders. However, you can't call `useMemo` in a loop:

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useMemo in a loop like this:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

Instead, extract a component for each item and memoize data for individual items:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useMemo at the top level:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

Alternatively, you could remove `useMemo` and instead wrap `Report` itself in [`memo`.](/reference/react/memo) If the `item` prop does not change, `Report` will skip re-rendering, so `Chart` will skip re-rendering too:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
