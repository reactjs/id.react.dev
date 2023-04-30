---
title: createContext
---

<Intro>

`createContext` memungkinkan Anda membuat [context](/learn/passing-data-deeply-with-context) yang dapat disediakan atau dibaca oleh komponen.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Panggil fungsi `createContext` di luar komponen apapun untuk membuat konteks.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Lihat contoh-contoh lainnya di bawah ini.](#usage)

#### Parameters {/*parameters*/}

* `defaultValue`: Nilai yang Anda inginkan untuk konteks ketika tidak ada penyedia konteks yang cocok di dalam pohon di atas komponen yang membaca konteks. Jika Anda tidak memiliki nilai default yang berarti, tentukan `null`. Nilai default dimaksudkan sebagai fallback "pilihan terakhir". Nilai ini bersifat statis dan tidak pernah berubah dari waktu ke waktu.

#### Returns {/*returns*/}

`createContext` mengembalikan sebuah konteks objek.

**Objek konteks itu sendiri tidak menyimpan informasi apapun** Objek ini merepresentasikan konteks yang dibaca atau disediakan oleh komponen lain. Biasanya, Anda akan menggunakan [`SomeContext.Provider`](#provider) pada komponen di atas untuk menentukan nilai konteks, dan memanggil [`useContext(SomeContext)`](/reference/react/useContext) pada komponen dibawah ini untuk membacanya. Objek konteks memiliki beberapa properti:

* `SomeContext.Provider` memungkinkan Anda memberikan nilai konteks pada komponen.
* `SomeContext.Consumer` adalah cara alternatif dan jarang digunakan untuk membaca nilai dari konteks.

---

### `SomeContext.Provider` {/*provider*/}

Bungkus komponen Anda ke dalam penyedia konteks untuk menentukan nilai konteks ini untuk semua komponen di dalamnya:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Props {/*provider-props*/}

* `value`: Nilai yang ingin Anda berikan kepada semua komponen yang membaca konteks ini di dalam penyedia ini, tidak peduli seberapa dalam. Nilai konteks dapat berupa jenis apa saja. Komponen yang memanggil [`useContext(SomeContext)`](/reference/react/useContext) di dalam penyedia menerima `value` dari penyedia konteks yang paling dalam di atasnya.

---

### `SomeContext.Consumer` {/*consumer*/}

Sebelum `useContext` ada, ada cara yang lebih lama untuk membaca konteks:

```js
function Button() {
  // 🟡 Legacy way (not recommended)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

Meskipun cara lama ini masih berfungsi, tetapi **kode yang baru ditulis harus membaca konteks dengan [`useContext()`](/reference/react/useContext) sebagai gantinya:**

```js
function Button() {
  // ✅ Recommended way
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: Sebuah fungsi. React akan memanggil fungsi yang Anda berikan dengan nilai konteks saat ini yang ditentukan oleh algoritma yang sama dengan yang dilakukan oleh [`useContext()`](/reference/react/useContext), dan me-render hasil yang Anda kembalikan dari fungsi ini. React juga akan menjalankan ulang fungsi ini dan memperbarui UI setiap kali konteks dari komponen induk berubah.

---

## Penggunaan {/*usage*/}

### Membuat context {/*creating-context*/}

Konteks memungkinkan komponen [pass information deep down](/learn/passing-data-deeply-with-context) tanpa secara eksplisit memberikan _props_.

Panggil fungsi `createContext` diluar komponen apapun untuk membuat satu atau beberapa konteks.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` mengembalikan <CodeStep step={1}>konteks objek</CodeStep>. Komponen membaca konteks dengan mengoper ke [`useContext()`](/reference/react/useContext):

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

Secara *default*, nilai yang diterima adalah <CodeStep step={3}>default values</CodeStep> yang Anda tentukan saat membuat konteks. Namun, dengan sendirinya hal ini tidak berguna karena nilai *default* tidak pernah berubah.

Konteks berguna karena Anda dapat **memberikan nilai dinamis lainnya dari komponen Anda:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Sekarang komponen `Page` dan semua komponen didalamnya, tidak peduli seberapa dalam, akan "melihat" nilai konteks yang diberikan. Jika nilai konteks yang diberikan berubah, React akan me-*render* ulang komponen yang membaca konteks tersebut.

[Baca lebih lanjut tentang membaca dan memberikan konteks dan lihat contohnya.](/reference/react/useContext)

---

### Mengimpor dan mengekspor konteks dari file {/*importing-and-exporting-context-from-a-file*/}

Sering kali, komponen dalam *file* yang berbeda membutuhkan akses ke konteks yang sama. Inilah sebabnya mengapa umum untuk mendeklarasikan konteks dalam file terpisah. Kemudian Anda dapat menggunakan [`export` statement](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) untuk membuat konteks tersedia untuk *file* lain:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
````

Komponen yang dideklarasikan di *file* lain dapat menggunakan pernyataan [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) untuk membaca atau menyediakan konteks ini:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Cara kerjanya mirip dengan [mengimpor dan mengekspor komponen.](/learn/importing-and-exporting-components)

---

## Pemecahan Masalah {/*troubleshooting*/}

### Saya tidak dapat menemukan cara untuk mengubah nilai konteks {/*i-cant-find-a-way-to-change-the-context-value*/}


Kode seperti ini menentukan nilai konteks *default*:

```js
const ThemeContext = createContext('light');
```

Nilai ini tidak pernah berubah. React hanya menggunakan nilai ini sebagai *fallback* jika tidak dapat menemukan penyedia yang cocok di atas.

Untuk membuat konteks berubah seiring waktu, [tambahkan state dan bungkus komponen didalam penyedia konteks](/reference/react/useContext#updating-data-passed-via-context)

