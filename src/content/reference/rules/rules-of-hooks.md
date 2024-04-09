---
title: Peraturan Hooks
---

<Intro>
*Hooks* didefinisikan menggunakan fungsi JavaScript, tapi mereka merepresentasikan sebuat logika UI khusus yang yang dapat digunakan kembali dengan batasan di mana *Hook* dapat dipanggil.
</Intro>

<InlineToc />

---

## Panggil *Hooks* hanya di tingkat atas {/*only-call-hooks-at-the-top-level*/}

Fungsi-fungsi yang namanya berawalan `use` disebut [*Hooks*](/reference/react) dalam React.

**Jangan memanggil *Hooks* di dalam pengulangan, kondisi, fungsi bersarang, atau blok `try`/`catch`/`finally`.** Sebagai gantinya, selalu gunakan Hooks di tingkat teratas fungsi React Anda, sebelum kembalian awal apapun. Anda hanya dapat memanggil *Hooks* ketika React sedang me-*render* komponen fungsi:

* ✅ Panggil *Hooks* di tingkat teratas di dalam [komponen fungsi](/learn/your-first-component).
* ✅ Panggil *Hooks* di tingkat teratas di dalam [*Hook* kustom](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Baik: tingkat atas dalam komponen fungsi
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Baik: tingkat atas dalam Hook kustom
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Memanggil Hooks (fungsi yang dimulai dengan `use`) dalam kasus penggunaan lainnya **tidak** diduking, misalnya:

* 🔴 Jangan memanggil *Hooks* di dalam kondisional atau pengulangan.
* 🔴 Jangan memanggil *Hooks* setelah pernyataan `return` kondisional.
* 🔴 Jangan memanggil *Hooks* di dalam *event handler*.
* 🔴 Jangan memanggil *Hooks* di dalam komponen kelas.
* 🔴 Jangan memanggil *Hooks* di dalam fungsi yang dioper ke `useMemo`, `useReducer`, atau `useEffect`.
* 🔴 Jangan memanggil *Hooks* di dalam blok `try`/`catch`/`finally`.

Jika Anda melanggar peraturan ini, kemungkinan Anda akan melihat *error* berikut.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Buruk: di dalam kondisional (untuk memperbaiki, pindahkan ke luar!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Buruk: di dalam pengulangan (untuk memperbaiki, pindahkan ke luar!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Buruk: setelah pengembalian kondisional (untuk memperbaiki, pindahkan ke sebelum return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Buruk: di dalam event handler (untuk memperbaiki, pindahkan ke luar!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Buruk: di dalam useMemo (untuk memperbaiki, pindahkan ke luar!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Buruk: di dalam komponen kelas (untuk memperbaiki, buat komponen fungsi dan bukan komponen kelas!)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 Buruk: di dalam blok try/catch/finally (untuk memperbaiki, pindahkan ke luar!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

Anda dapat menggunakan [plugin `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) untuk menangkap kesalahan-kesalahan ini.

<Note>

[*Hooks* kustom](/learn/reusing-logic-with-custom-hooks) *mungkin* memanggil *Hooks* lain (memang itu tujuannya). Ini bekerja karena *Hooks* kustom juga seharusnya hanya dipanggil saat komponen fungsi sedang di-*render*.

</Note>

---

## Panggil *Hooks* hanya dari fungsi React {/*only-call-hooks-from-react-functions*/}

Jangan memanggil *Hooks* dari fungsi JavaScript reguler. Sebagai gantinya, Anda dapat:

✅ Memanggil *Hooks* dari komponen fungsi React.
✅ Memanggil *Hooks* dari [*Hooks* kustom](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component).

Dengan mengikuti peraturan ini, Anda memastikan semua logika *stateful* dalam suatu komponen terlihat jelas dari kode sumbernya.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Bukan sebuah komponen atau Hooks kustom!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```
