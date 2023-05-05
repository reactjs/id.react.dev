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

Panggil `useMemo` di tingkat atas komponen Anda untuk meng-*cache* hasil perhitungan pada tiap *render*.

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

[Lihat contoh lainnya di bawah ini.](#usage)

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

Secara bawaan, React akan menjalankan ulang seluruh badan komponen Anda setiap *render* ulang. Sebagai contoh, jika `TodoList` memperbarui *state*-nya atau mendapatkan *props* baru dari induknya (*parent*), fungsi `filterTodos` akan dijalankan kembali:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Biasanya, hal ini tidak menjadi masalah karena kebanyakan perhitungan dilakukan dengan sangat cepat. Namun, jika Anda melakukan penyaringan atau mengubah senarai (*array*) yang besar, atau melakukan komputasi yang mahal (*expensive computation*), Anda mungkin ingin melewatkan melakukannya lagi jika data tidak berubah. Jika `todos` dan `tab` sama seperti *render* terakhir, mengemas perhitungan tersebut dalam `useMemo` seperti sebelumnya memungkinkan Anda menggunakan kembali `visibleTodos` yang telah Anda hitung sebelumnya.

Tipe *caching* ini disebut dengan *[memoisasi.](https://en.wikipedia.org/wiki/Memoization)*

<Note>

**Anda sebaiknya hanya mengandalkan `useMemo` untuk pengoptimalan kinerja.** Jika kode Anda tidak berjalan tanpanya, temukan masalah dasarnya dan perbaiki terlebih dahulu. Kemudian Anda dapat menambahkan `useMemo` untuk meningkatkan kinerja.

</Note>

<DeepDive>

#### Bagaimana cara mengetahui bahwa sebuah perhitungan itu mahal? {/*how-to-tell-if-a-calculation-is-expensive*/}

Pada umumnya, kecuali jika Anda membuat atau mengulang ribuan objek, mungkin perhitungan itu tidak mahal. Jika Anda ingin lebih percaya diri, Anda dapat menambahkan *console log* untuk mengukur waktu yang dihabiskan dalam sebuah kode:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Lakukan interaksi yang Anda ukur (misalnya, mengetik ke dalam masukan). Anda akan melihat *log* seperti `filter array: 0.15ms` pada *console* Anda. Jika keseluruhan waktu yang dicatat bertambah hingga jumlah yang signifikan (seperti `1ms` atau lebih), mungkin masuk akal untuk memoisasi perhitungan tersebut. Sebagai percobaan, Anda kemudian dapat membungkus perhitungan tersebut dalam `useMemo` untuk mengecek apakah total waktu yang dicatat untuk interaksi tersebut berkurang atau tidak:

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
  console.log('[DILAMBATKAN] Menyaring ' + todos.length + ' todos untuk tab "' + tab + '".');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Tidak melakukan apapun selama 500 ms untuk meniru kode yang sangat lambat
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

Pada contoh ini, implementasi `filterTodos` juga **dilambatkan secara artifisial** sehingga Anda dapat melihat apa yang terjadi ketika beberapa fungsi JavaScript yang Anda panggil ketika pe-*render*-an sangat lambat. Coba ganti *tab* dan ubah temanya.

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
        <p><b>Catatan: <code>filterTodos</code> diperlambat secara artifisial!</b></p>
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
    // Tidak melakukan apapun selama 500 ms untuk meniru kode yang sangat lambat
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

Anda dapat menambahkan jumlah *item* todo pada `utils.js` dan lihat bagaimana perilaku berubah. Perhitungan ini awalnya memang tidak terlalu mahal, namun jika jumlah todo bertambah secara signifikan, sebagian besar biaya akan terletak pada pe-*render*-an ulang daripada *filtering*. Baca terus di bawah untuk melihat bagaimana Anda dapat mengoptimalkan pe-*render*-an ulang dengan `useMemo`.

<Solution />

</Recipes>

---

### Melewati pe-*render*-an ulang pada komponen {/*skipping-re-rendering-of-components*/}

Dalam beberapa kasus, `useMemo` juga dapat membantu Anda mengoptimalkan kinerja komponen *child* dalam pe-*render*-an ulang. Untuk menggambarkan ini, anggap komponen `TodoList` memberikan `visibleTodos` sebagai *prop* kepada komponen *child* `List`:

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

Anda telah memerhatikan bahwa mengubah *prop* `theme` membekukan aplikasi sesaat, tetapi jika Anda menghapus `<List />` dari JSX anda, rasanya jadi cepat. Hal ini memberitahu Anda bahwa ada baiknya untuk mencoba mengoptimalkan komponen `List`.

**Secara bawaan, ketika komponen me*render* ulang, React akan me*render* semua *children*-nya secara berulang** Inilah sebabnya, ketika `TodoList` me*render* ulang dengan `theme` yang berbeda, komponen `List` *juga* me*render* ulang. Hal ini bagus untuk komponen yang tidak memerlukan banyak perhitungan untuk *render* ulang. Namun jika anda telah memeriksa bahwa *render* ulang berjalan lambat, Anda dapat memberi tahu `List` untuk melewatkan pe-*render*-an ulang jika *props*-nya sama seperti *render* sebelumnya dengan membungkusnya dalam [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Dengan perubahan ini, `List` akan melewati pe-*render*-an ulang jika seluruh *props*-nya *sama* dengan *render* terakhir.** Disinilah meng-*cache* perhitungan menjadi penting! Bayangkan Anda menghitung `visibleTodos` tanpa `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Setiap tema berganti, ini akan menjadi senarai (array) yang berbeda...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... prop dari List tidak akan sama, dan akan melakukan render ulang tiap saat */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**Pada contoh di atas, fungsi `filterTodos` selalu membuat senarai (*array*) yang *berbeda*,** mirip dengan objek literal `{}` selalu membuat objek baru. Biasanya, hal ini tidak menjadi masalah, tapi ini berarti bahwa *prop* dari `List` tidak akan sama, dan optimalisasi [`memo`](/reference/react/memo) tidak akan berjalan. Di sinilah `useMemo` berguna:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Memberitahu React untuk meng-cache perhitungan Anda di antara render ulang...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...selama dependency ini tidak berubah...
  );
  return (
    <div className={theme}>
      {/* ...List akan menerima prop yang sama dan dapat melewati rendering ulang */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**Dengan membungkus perhitungan `visibleTodos` pada `useMemo`, Anda pastikan bahwa itu mempunyai nilai yang *sama* di antara *render* ulang** (sampai *dependency* berubah). Kamu tidak *perlu* untuk membungkus perhitungan dalam `useMemo` kecuali Anda melakukan itu untuk alasan yang spesifik. Pada contoh ini, alasannya adalah Anda memberikannya ke komponen yang dibungkus dengan [`memo`,](/reference/react/memo) dan ini memungkinkannya melewatkan pe-*render*-an ulang. Terdapat alasan-alasan lain untuk menambahkan `useMemo` yang dijelaskan lebih lanjut pada halaman ini.

<DeepDive>

#### Memoisasi *node* JSX secara individu {/*memoizing-individual-jsx-nodes*/}

Daripada membungkus `List` dalam .., Anda dapat membungkus *node* JSX `<List />` itu sendiri dalam `useMemo`:

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

Perilakunya akan sama. Jika `visibleTodos` tidak berubah, `List` tidak akan di*render* ulang.

*Node* JSX seperti `<List items={visibleTodos} />` merupakan objek seperti `{ type: List, props: { items: visibleTodos } }`. Membuat objek ini sangat murah, tapi React tidak mengetahui apakah kontennya sama dengan sebelumnya atau tidak. Inilah mengapa secara bawaan, React akan me*render* ulang komponen `List`.

Namun, jika React melihat JSX yang sama persis seperti saat *render* sebelumnya, React tidak akan mencoba me*render* ulang komponen Anda. Hal ini karena node JSX [tidak dapat diubah (*immutable*).](https://en.wikipedia.org/wiki/Immutable_object) Objek *node* JSX tidak dapat diubah dari waktu ke waktu, jadi React tahu bahwa aman untuk melakukan *render* ulang. Namun, agar berfungsi, *node* harus *benar-benar menjadi objek yang sama*, bukan hanya terlihat sama dalam kode. Inilah yang dilakukan `useMemo` pada contoh ini.

Membungkus *node* JSX secara manual ke dalam `useMemo` tidaklah mudah. Misalnya, Anda tidak dapat melakukannya secara bersyarat. Itulah mengapa biasanya Anda akan membungkus komponen dengan [`memo`](/reference/react/memo) daripada membungkus *node* JSX.

</DeepDive>

<Recipes titleText="Perbedaan antara melewati render ulang dan selalu rendering ulang" titleId="examples-rerendering">

#### Melewati pe-render-an ulang dengan `useMemo` dan `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

Pada contoh ini, komponen `List` **dilambatkan secara artifisial** sehingga Anda dapat melihat apa yang terjadi ketika komponen React yang anda *render* benar-benar lambat. Coba ganti *tab* dan ubah temanya.

Mengganti *tab* terasa lambat karena `List` yang diperlambat dipaksa untuk *render* ulang. Hal ini wajar karena `tab` berubah, sehingga Anda perlu menampilkan pilihan baru untuk pengguna di layar. 

Selanjutnya, coba ubah temanya. **Berkat `useMemo` dan [`memo`](/reference/react/memo), mengubah tema menjadi cepat walaupun dilambatkan secara artifisial!** Pe-*render*-an ulang pada `List` dilewati karena senarai (*array*) `visibleItems` tidak berubah semenjak *render* terakhir. Senarai (*array*) `visibleItems` tidak berubah karena `todos` dan `tabs` (yang Anda berikan sebagai `dependency` ke `useMemo`) tidak berubah semenjak *render* terakhir.
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
      <p><b>Catatan: <code>List</code> diperlambat secara artifisial!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[DILAMBATKAN] Merender <List /> dengan item sebanyak ' + items.length);
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Tidak melakukan apapun selama 500 ms untuk meniru kode yang sangat lambat
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

#### Selalu lakukan pe-render-an ulang pada komponen {/*always-re-rendering-a-component*/}

Pada contoh ini, implementasi `List` juga **dilambatkan secara artifisial** sehingga Anda dapat melihat apa yang terjadi ketika beberapa komponen React yang Anda *render* benar-benar lambat. Coba ganti *tab* dan ubah temanya.

Tidak seperti contoh sebelumnya, mengubah tema juga sangat lambat sekarang! Hal ini karena **tidak adanya pemanggilan *useMemo* pada versi ini,** sehingga senarai (*array*) `visibleTodos` selalu berbeda, dan pe-*render*-an ulang untuk komponen `List` yang diperlambat tidak dapat dilewati.

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
      <p><b>Catatan: <code>List</code> diperlambat secara artifisial!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[DILAMBATKAN] Merender <List /> dengan item sebanyak ' + items.length);
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Tidak melakukan apapun selama 500 ms untuk meniru kode yang sangat lambat
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

Namun, ini adalah kode yang sama **tanpa pelambatan buatan.** Apakah tidak adanya `useMemo` terasa?

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

Seringnya, kode tanpa memoisasi berjalan dengan baik. Jika interaksi Anda cukup cepat, Anda tidak memerlukan memoisasi.

Catat bahwa Anda perlu menjalankan React di mode *production*, non-aktifkan [React Developer Tools](/learn/react-developer-tools), dan gunakan perangkat yang mirip dengan punya pengguna Anda guna mendapatkan pengertian terhadap apa yang memperlambat aplikasi Anda.

<Solution />

</Recipes>

---

### Memoisasi sebuah dependency dari Hook lain {/*memoizing-a-dependency-of-another-hook*/}


Misalkan Anda mempunyai perhitungan yang bergantung pada objek yang dibuat langsung pada badan komponen:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Peringatan: Dependency pada sebuah objek dibuat pada badan komponen
  // ...
```

Tergantung pada objek seperti ini menggagalkan tujuan memoisasi. Ketika komponen me*render* ulang, seluruh kode yang langsung di dalam badan komponen berjalan lagi. **Baris kode yang membuat objek `searchOptions` juga akan berjalan pada setiap *render* ulang.** Karena `searchOptions` merupakan *dependency* dari pemanggilan `useMemo` Anda, dan berbeda setiap saat, React mengetahui *dependency* tersebut berbeda, kemudian menghitung ulang `searchItems`tiap saat.

Untuk memperbaiki ini, Anda dapat memoisasi objek `searchOptions` itu *sendiri* sebelum memberikannya sebagai *dependency*:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Hanya berubah ketika `text` berubah

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Hanya berubah ketika `allItems` atau `searchOptions` berubah
  // ...
```

Dalam contoh di atas, jika `text` tidak berubah, maka objek `searchOptions` juga tidak akan berubah. Namun, lebih baik untuk memindahkan deklarasi object `searchOptions` *ke dalam* fungsi perhitungan `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Hanya berubah ketika `allItems` atau `text` berubah
  // ...
```

Sekarang perhitungan Anda bergantung dengan `text` secara langsung (yang merupakan string dan tidak bisa "secara tidak sengaja" menjadi berbeda).

---

### Memoisasi sebuah fungsi {/*memoizing-a-function*/}

Misalkan komponen `Form` dibungkus dengan [`memo`.](/reference/react/memo) Anda ingin meneruskan fungsi sebagai *prop* dari komponen tersebut:

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

Seperti `{}` membuat objek yang berbeda, deklarasi fungsi seperti `function() {}` dan ekspresi seperti `() => {}` menghasilkan fungsi yang *berbeda* pada tiap *render* ulang. Dengan sendirinya, membuat fungsi baru tidak menjadi masalah. Hal ini bukan sesuatu untuk dihindari! Namun, jika komponen `Form` dimemoisasi, 
Just as `{}` creates a different object, function declarations like `function() {}` and expressions like `() => {}` produce a *different* function on every re-render. By itself, creating a new function is not a problem. This is not something to avoid! However, if the `Form` component is memoized, dengan asumsi Anda ingin melewati pe-*render*-an ulang ketika tidak ada *prop* yang berubah. Sebuah *prop* yang *selalu* berbeda akan menggagalkan poin memoisasipresumably you want to skip re-rendering it when no props have changed.

Untuk memoisasi fungsi dengan `useMemo`, fungsi perhitungan Anda harus mengembalikan fungsi lain:

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

Ini terlihat kikuk! **Fungsi memoisasi cukup umum sehingga React memiliki Hook bawaan khusus untuk itu. Bungkus fungsi Anda ke dalam [`useCallback`](/reference/react/useCallback) alih-alih `useMemo`** untuk menghindari keharusan menulis *nested function* tambahan:

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

Dua contoh di atas sepenuhnya setara. Satu-satunya manfaat `useCallback` adalah memungkinkan Anda menghindari penulisan *nested function* tambahan di dalamnya, tidak melakukan hal lain. [Baca selengkapnya tentang `useCallback`.](/reference/react/useCallback)

---

## Pemecahan Masalah {/*troubleshooting*/}

### Perhitungan saya berjalan dua kali setiap render ulang {/*my-calculation-runs-twice-on-every-re-render*/}

Dalam [Strict Mode](/reference/react/StrictMode), React akan memanggil beberapa fungsi Anda sebanyak dua kali, bukan sekali:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // Fungsi komponen ini akan berjalan dua kali tiap *render*.

  const visibleTodos = useMemo(() => {
    // Perhitungan ini akan berjalan dua kali jika sebuah dependency berubah.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

Hal ini wajar dan tidak merusak kode Anda.

Perlakuan **hanya pada *development*** ini membantu Anda untuk [menjaga komponen tetap murni.](/learn/keeping-components-pure) React menggunakan hasil dari salah satu pemanggilan tersebut, dan mengabaikan hasil dari pemanggilan lain. Selama fungsi komponen dan perhitungan Anda murni, hal ini seharusnya tidak memengaruhi logika Anda. Akan tetapi, jika secara tidak sengaja menjadi tidak murni, hal ini membantu Anda untuk menyadari dan memperbaiki masalah tersebut.

Misalnya, fungsi perhitungan yang tidak murni ini memutasikan senarai (*array*) yang Anda terima sebagai *prop*:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Masalah: memutasikan sebuah `prop`
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React memanggil fungsi Anda sebanyak dua kali, jadi Anda akan melihat bahwa todo ditambahkan dua kali. Perhitungan Anda seharusnya tidak mengubah objek yang sudah ada, tapi tidak masalah mengubah objek *baru* yang Anda buat selama perhitungan. Sebagai contoh, jika fungsi `filterTodos` selalu mengembalikan senarai (*array*) yang berbeda, Anda dapat memutasikan senarai (*array*) itu sebagai gantinya:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Benar: memutasikan objek yang Anda buat selama perhitungan
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Baca [menjaga komponen agar tetao murni](/learn/keeping-components-pure) untuk belajar lebih lanjut tentang kemurnian.

Lihat juga panduan tentang [memperbarui objek](/learn/memperbarui-objek-dalam-status) dan [memperbarui senarai (*array*)](/belajar/memperbarui-array-dalam-status) tanpa mutasi.

---

### Pemanggilan `useMemo` saya seharusnya mengembalikan objek, tetapi mengembalikan undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Kode ini tidak bekerja:

```js {1-2,5}
  // 🔴 Anda tidak dapat mengembalikan objek dari arrow function dengan () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

Dalam JavaScript, `() => {` memulai badan *arrow function*, sehingga kurawal `{` bukan bagian dari objek Anda. Inilah mengapa hal tersebut tidak mengembalikan objek dan dapat menyebabkan kesalahan. Anda dapat memperbaikinya dengan menambahkan tand kurung seperti `({` dan `})`:

```js {1-2,5}
  // Ini bekerja, tetapi mudah bagi seseorang untuk merusaknya lagi
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

Namun, hal ini tetap membingungkan dan terlalu mudah bagi seseorang untuk merusaknya lagi dengan menghilangkan tanda kurung.

Untuk menghindari kesalahan ini, tulis pernyataan `return` secara eksplisit:

```js {1-3,6-7}
  // ✅ Ini berfungsi dan eksplisit
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### Setiap kali komponen saya me-*render* ulang, perhitungan dalam `useMemo` berjalan kembali {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Pastikan anda telah menentukan senarai (*array*) *dependency* sebagai argumen kedua!

Jika Anda melupakan senarai (*array*) *dependency*, `useMemo` akan menjalankan ulang perhitungan setiap saat:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Menghitung ulang setiap saat: tanpa senarai (array) dependency
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Ini merupakan versi terkoreksi yang memberikan senarai (*array*) *dependency* sebagai argumen kedua:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Tidak menghitung ulang
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Jika ini tidak membantu, maka masalahnya adalah setidaknya salah satu `dependency` Anda berbeda dari *render* terakhir. Anda dapat men-*debug* masalah ini dengan mencatat *dependency* anda secara manual ke *console*:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Anda kemudian dapat mengklik kanan pada senarai (*array*) dari *render* ulang yang berbeda di *console* dan pilih "Simpan sebagai variabel *global*" untuk keduanya. Dengan asumsi yang pertama disimpan sebagai `temp1` dan yang kedua disimpan sebagai `temp2`, kemudian Anda dapat menggunakan *console* peramban (*browser*) untuk mengecek apakah tiap *dependency* pada kedua senarai (*array*) sama:

```js
Object.is(temp1[0], temp2[0]); // Apakah dependency pertama sama di antara senarai (array)?
Object.is(temp1[1], temp2[1]); // Apakah dependency kedua sama di antara seranai (array)?
Object.is(temp1[2], temp2[2]); // ... dan sebagainya untuk tiap dependency ...
```

Ketika Anda menemukan *dependency* mana yang menggagalkan memoisasi, temukan cara untuk menghapusnya, atau [memoisasikannya juga.](#memoizing-a-dependency-of-another-hook)

---

### Saya butuh memanggil `useMemo` untuk tiap daftar item pada perulangan, tapi tidak diperbolehkan {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Misalkan komponen `Chart` dibungkus dalam [`memo`](/reference/react/memo). Anda ingin melewati pe-*render*-an ulang setiap `Chart` dalam daftar ketika komponen `ReportList` me-*render* ulang. Namun, Anda tidak dapat memanggil `useMemo` dalam perulangan:

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Anda tidak dapat memanggil useMemo dalam perulangan seperti ini
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

Alih-alih, ekstrak komponen untuk setiap *item* dan memoisasi data untuk masing-masing *item*:

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
  // ✅ Panggil useMemo pada tingkat atas:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

Sebagai alternatif, Anda dapat menghapus `useMemo` dan membungkus `Report` sendiri di [`memo`.](/reference/react/memo) Jika *prop* `item` tidak berubah, `Report` akan melewatkan pe-*render*-an ulang, jadi `Chart` juga akan melewatkan pe-*render*-an ulang:

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
