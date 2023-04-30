---
title: memo
---

<Intro>

`memo` memungkinkan Anda untuk melewatkan proses render ulang komponen apabila props tidak berubah.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Bungkus komponen dengan `memo` untuk mendapatkan versi *memoized* dari komponen tersebut. Versi memo dari komponen Anda biasanya tidak akan di-*render* ulang ketika komponen induknya di-*render* ulang selama propsnya tidak berubah. Tetapi React masih bisa me-*render* ulang: *memoisasi* adalah pengoptimalan performa, bukan jaminan.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[Lihat contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `Component`: Komponen yang ingin Anda buat memonya. `memo` tidak mengubah komponen ini, tetapi mengembalikan komponen baru yang telah dimemo sebagai gantinya. Setiap komponen React yang valid, termasuk fungsi dan [`forwardRef`](/reference/react/forwardRef) komponen bisa diterima.

* **optional** `arePropsEqual`: Fungsi yang menerima dua argumen: props sebelumnya dari komponen, dan props barunya. Fungsi ini akan mengembalikan `true` jika props lama dan baru sama: yaitu, jika komponen akan me-*render* output yang sama dan berperilaku dengan cara yang sama dengan props baru seperti pada props lama. Jika tidak, fungsi ini akan mengembalikan `false`. Biasanya, Anda tidak akan menentukan fungsi ini. Secara default, React akan membandingkan setiap prop dengan [`Object.is`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

#### Pengembalian {/*returns*/}

`memo` mengembalikan sebuah komponen React yang baru. Komponen ini berperilaku sama dengan komponen yang disediakan untuk `memo` kecuali bahwa React tidak akan selalu me-*render* ulang komponen tersebut ketika induknya di-*render* ulang kecuali jika propsnya telah berubah.

---

## Penggunaan {/*usage*/}

### Melewatkan proses render ulang apabila props tidak berubah {/*skipping-re-rendering-when-props-are-unchanged*/}

React biasanya me-*render* ulang sebuah komponen setiap kali induknya di render ulang. Dengan `memo`, Anda dapat membuat komponen yang tidak akan di render ulang oleh React ketika induknya di render ulang selama props yang baru sama dengan props yang lama. Komponen seperti ini disebut sebagai *memoized*.

Untuk memo sebuah komponen, bungkus komponen tersebut dengan `memo` dan gunakan nilai yang dikembalikannya untuk menggantikan komponen asli Anda:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

Sebuah komponen React harus selalu memiliki [logika rendering murni](/learn/keeping-components-pure) Artinya, ia harus mengembalikan output yang sama jika props, state, dan konteksnya tidak berubah. Dengan menggunakan `memo`, Anda memberi tahu React bahwa komponen Anda memenuhi persyaratan ini, sehingga React tidak perlu me-*render* ulang selama propsnya tidak berubah. Bahkan dengan `memo`, komponen Anda akan di-*render* ulang jika state-nya berubah atau jika konteks yang digunakan berubah.

Pada contoh ini, perhatikan bahwa komponen `Salam` di-*render* ulang setiap kali `nama` diubah (karena itu adalah salah satu propsnya), tetapi tidak saat `alamat` diubah (karena tidak dioper ke `Salam` sebagai props):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**Anda hanya boleh mengandalkan `memo` sebagai pengoptimalan kinerja.** Jika kode Anda tidak berfungsi tanpa itu, temukan masalah yang mendasarinya dan perbaiki terlebih dahulu. Kemudian Anda dapat menambahkan `memo` untuk meningkatkan kinerja.

</Note>

<DeepDive>

#### Haruskah Anda menambahkan memo di mana-mana? {/*should-you-add-memo-everywhere*/}

Jika aplikasi Anda seperti situs ini, dan sebagian besar interaksinya bersifat kasar (seperti mengganti halaman atau seluruh bagian), memoisasi biasanya tidak diperlukan. Di sisi lain, jika aplikasi Anda lebih seperti editor gambar, dan sebagian besar interaksinya bersifat granular (seperti memindahkan bentuk), maka Anda mungkin akan merasa sangat terbantu dengan adanya memoisasi. 

Mengoptimalkan dengan `memo` hanya berguna ketika komponen Anda sering di-*render* ulang dengan props yang sama persis, dan logika render ulangnya mahal. Jika tidak ada jeda yang terlihat ketika komponen Anda di-*render* ulang, `memo` tidak diperlukan. Perlu diingat bahwa `memo` sama sekali tidak berguna jika props yang dioper ke komponen Anda *selalu berbeda, seperti jika Anda mengoper sebuah objek atau fungsi biasa yang didefinisikan selama rendering. Inilah sebabnya mengapa Anda akan sering membutuhkan[`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) dan [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) serta `memo`.

Tidak ada manfaatnya membungkus komponen dalam `memo` dalam kasus lain. Tidak ada kerugian yang signifikan untuk melakukan hal tersebut, sehingga beberapa tim memilih untuk tidak memikirkan kasus-kasus individual, dan membuat memo sebanyak mungkin. Kelemahan dari pendekatan ini adalah kode menjadi kurang mudah dibaca. Selain itu, tidak semua memoisasi efektif: satu nilai yang "selalu baru" sudah cukup untuk mematahkan memoisasi untuk seluruh komponen.

**Dalam praktiknya, Anda bisa membuat banyak memo yang tidak perlu dengan mengikuti beberapa prinsip:**

1. Ketika sebuah komponen secara visual membungkus komponen lain, biarkan komponen tersebut [terima JSX sebagai anak.](/learn/passing-props-to-a-component#passing-jsx-as-children) Dengan cara ini, ketika komponen wrapper memperbarui state-nya sendiri, React tahu bahwa anak-anaknya tidak perlu me-*render* ulang.
1. Lebih suka state lokal dan tidak [mengangkat state](/learn/sharing-state-between-components) lebih jauh dari yang diperlukan. Sebagai contoh, jangan menyimpan status sementara seperti form dan apakah item dilayangkan di bagian atas pohon Anda atau di perpustakaan status global.
1. aga agar [logika rendering Anda tetap murni.](/learn/keeping-components-pure) Jika me-*render* ulang komponen menyebabkan masalah atau menghasilkan artefak visual yang mencolok, itu adalah bug dalam komponen Anda! Perbaiki bug daripada menambahkan memoisasi.
1. Hindari [Efek yang tidak perlu yang memperbarui status.](/learn/you-might-not-need-an-effect) Sebagian besar masalah performa pada aplikasi React disebabkan oleh rantai pembaruan yang berasal dari Effects yang menyebabkan komponen Anda di-*render* berulang kali.
1. Cobalah untuk [menghapus ketergantungan yang tidak perlu dari Efek Anda.](/learn/removing-effect-dependencies) Sebagai contoh, alih-alih memoisasi, sering kali lebih mudah untuk memindahkan suatu objek atau fungsi di dalam Efek atau di luar komponen.

Jika interaksi tertentu masih terasa lamban, [gunakan profiler React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) untuk melihat komponen mana yang paling diuntungkan dengan memoisasi, dan menambahkan memoisasi jika diperlukan. Prinsip-prinsip ini membuat komponen Anda lebih mudah di-debug dan dipahami, jadi sebaiknya Anda mengikutinya dalam hal apa pun. Dalam jangka panjang, kami sedang meneliti [melakukan memoisasi granular secara otomatis](https://www.youtube.com/watch?v=lGEMwh32soc) untuk menyelesaikan masalah ini untuk selamanya.

</DeepDive>

---

### Memperbarui komponen yang telah dimemo menggunakan state {/*updating-a-memoized-component-using-state*/}

Bahkan ketika sebuah komponen dimemoisasi, komponen tersebut akan tetap di-*render* ulang ketika statusnya berubah. Memoisasi hanya berkaitan dengan props yang diteruskan ke komponen dari induknya.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Jika Anda menetapkan variabel state ke nilai saat ini, React akan melewatkan proses render ulang komponen Anda meskipun tanpa `memo`. Anda mungkin masih melihat fungsi komponen Anda dipanggil beberapa kali, namun hasilnya akan dibuang.

---

### Memperbarui komponen yang telah dimemo menggunakan context {/*updating-a-memoized-component-using-a-context*/}

Bahkan ketika sebuah komponen dimemoisasi, komponen tersebut akan tetap di-*render* ulang ketika konteks yang digunakan berubah. Memoisasi hanya berkaitan dengan props yang dioper ke komponen dari induknya.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

Untuk membuat komponen Anda di-*render* ulang hanya ketika sebuah _bagian_ dari konteks berubah, pisahkan komponen Anda menjadi dua. Baca apa yang Anda butuhkan dari konteks di komponen luar, dan turunkan ke anak komponen yang dimodifikasi sebagai prop.

---

### Meminimalkan perubahan props {/*minimizing-props-changes*/}

Ketika Anda menggunakan `memo`, komponen Anda akan di-*render* ulang setiap kali ada prop yang tidak *sama persis* dengan sebelumnya. Ini berarti React membandingkan setiap prop dalam komponen Anda dengan nilai sebelumnya menggunakan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) perbandingan. Perhatikan bahwa `Object.is(3, 3)` adalah `true`, namun `Object.is({}, {})` adalah `false`.


Untuk mendapatkan hasil maksimal dari `memo`, minimalkan waktu perubahan props. Sebagai contoh, jika props adalah sebuah objek, cegah komponen induk untuk membuat ulang objek tersebut setiap saat dengan menggunakan [`useMemo`:](/reference/react/useMemo)

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

Cara yang lebih baik untuk meminimalkan perubahan props adalah memastikan komponen menerima informasi minimum yang diperlukan dalam props. Sebagai contoh, komponen tersebut dapat menerima nilai individual, bukan keseluruhan objek:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Bahkan nilai individual terkadang dapat diproyeksikan ke nilai yang lebih jarang berubah. Sebagai contoh, di sini sebuah komponen menerima boolean yang mengindikasikan keberadaan suatu nilai, bukan nilai itu sendiri:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

Ketika Anda perlu mengoper fungsi ke komponen yang dimemo, deklarasikan fungsi tersebut di luar komponen Anda agar tidak berubah, atau [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) untuk menyimpan definisinya di antara render ulang.

---

### Menentukan fungsi perbandingan khusus {/*specifying-a-custom-comparison-function*/}

Dalam kasus yang jarang terjadi, ada kemungkinan tidak dapat meminimalkan perubahan props dari komponen yang dimemo. Dalam hal ini, Anda dapat menyediakan fungsi perbandingan khusus, yang akan digunakan React untuk membandingkan props yang lama dan yang baru, alih-alih menggunakan penyetaraan yang dangkal. Fungsi ini diberikan sebagai argumen kedua untuk `memo`. Fungsi ini akan mengembalikan `true` hanya jika props yang baru akan menghasilkan output yang sama dengan props yang lama; jika tidak, fungsi ini akan mengembalikan `false`.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

Jika Anda melakukan ini, gunakan panel Kinerja di alat pengembang browser Anda untuk memastikan bahwa fungsi perbandingan Anda benar-benar lebih cepat daripada me-*render* ulang komponen. Anda mungkin akan terkejut.

Ketika Anda melakukan pengukuran performa, pastikan React berjalan dalam mode produksi.

<Pitfall>

Jika Anda menyediakan implementasi `arePropsEqual` khusus, **Anda harus membandingkan setiap prop, termasuk fungsi-fungsi.** Fungsi sering kali [tutup di atas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) props dan status komponen induk. Jika Anda mengembalikan `true` ketika `oldProps.onClick !== newProps.onClick`, komponen Anda akan terus "melihat" props dan state dari render sebelumnya di dalam handler `onClick`, yang mengarah ke bug yang sangat membingungkan.

Hindari melakukan pemeriksaan kesetaraan yang dalam di dalam `arePropsEqual` kecuali jika Anda 100% yakin bahwa struktur data yang Anda gunakan memiliki kedalaman yang terbatas. **Pengecekan kesetaraan yang mendalam dapat menjadi sangat lambat** dan dapat membekukan aplikasi Anda selama beberapa detik jika seseorang mengubah struktur data di kemudian hari.

</Pitfall>

---

## Pemecahan masalah {/*troubleshooting*/}
### Komponen saya di-render ulang ketika sebuah prop adalah objek, senarai, atau fungsi {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React membandingkan props lama dan baru dengan kesetaraan yang dangkal: yaitu, mempertimbangkan apakah setiap props baru memiliki referensi yang sama dengan props lama. Jika Anda membuat objek atau array baru setiap kali induknya di-*render* ulang, meskipun setiap elemennya sama, React akan tetap menganggapnya berubah. Demikian pula, jika Anda membuat fungsi baru ketika me-*render* komponen induk, React akan menganggap fungsi tersebut telah berubah meskipun fungsi tersebut memiliki definisi yang sama. Untuk menghindari hal ini, [menyederhanakan props atau memo props dalam komponen induk](#minimizing-props-changes).
