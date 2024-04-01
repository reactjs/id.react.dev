---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` digunakan untuk pengguna library CSS-in-JS. Kecuali jika Anda sedang mengerjakan sebuah pustaka CSS-in-JS dan butuh sebuah tempat untuk menyisipkan *style*, Anda mungkin lebih menginginkan [`useEffect`](/reference/react/useEffect) atau [`useLayoutEffect`](/reference/react/useLayoutEffect).

</Pitfall>

<Intro>

<<<<<<< HEAD
`useInsertionEffect` memungkinkan Anda memasukan element ke dalam DOM sebelum efek *layout* aktif.
=======
`useInsertionEffect` allows inserting elements into the DOM before any layout Effects fire.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

<<<<<<< HEAD
Panggil `useInsertionEffect` untuk menyertakan sebuah *style* sebelum ada efek aktif yang mungkin akan membaca *layout*:
=======
Call `useInsertionEffect` to insert styles before any Effects fire that may need to read layout:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js
import { useInsertionEffect } from 'react';

// Inside your CSS-in-JS library
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... inject <style> tags here ...
  });
  return rule;
}
```

[Lihat contoh lain di bawah ini.](#usage)

#### Parameter {/*parameters*/}

<<<<<<< HEAD
* `setup`: Fungsi berisi logika Efek Anda. Fungsi *setup* juga dapat secara opsional mengembalikan fungsi *pembersihan* (*cleanup*). Sebelum komponen ditambahkan ke DOM, dan sebelum efek *layout* apa pun aktif, React akan menjalankan fungsi *setup*. Setelah setiap *render* ulang dengan dependensi yang berubah, React akan terlebih dahulu menjalankan fungsi pembersihan (*cleanup*) (jika Anda memberikannya) dengan nilai lama. Selanjutnya, React akan menjalankan fungsi *setup* dengan nilai baru. Sebelum komponen dihapus dari DOM, React akan menjalankan fungsi pembersihan (*cleanup*).
=======
* `setup`: The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. When your component is added to the DOM, but before any layout Effects fire, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. When your component is removed from the DOM, React will run your cleanup function.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4
 
* **opsional** `dependencies`: Daftar semua nilai reaktif yang dirujuk di dalam kode `setup`. Nilai reaktif termasuk *props*, *state*, dan semua variabel dan fungsi yang dideklarasikan langsung di dalam komponen. Jika linter Anda telah [dikonfigurasi untuk React](/learn/editor-setup#linting), maka *linter* tersebut akan memverifikasi bahwa setiap nilai reaktif sudah diatur dengan benar sebagai dependensi. Daftar dependensi ini harus memiliki jumlah *item* yang konstan dan ditulis secara *inline* seperti `[dep1, dep2, dep3]`. React akan membandingkan setiap dependensi dengan nilai lama menggunakan algoritma perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Jika Anda tidak menentukan sebuah dependensi sama sekali, efek akan dijalankan ulang setelah setiap *re-render* dari komponen.

#### Returns {/*returns*/}

`useInsertionEffect` mengembalikan `undefined`.

#### Caveats {/*caveats*/}

* Efek hanya berjalan di sisi klien. Efek tidak berjalan ketika *server rendering*.
* Anda tidak dapat mengupdate *state* dari dalam `useInsertionEffect`.
* Pada saat `useInsertionEffect` berjalan, *refs* belum  terpasang, dan DOM belum diperbarui.
* `useInsertionEffect` mungkin akan berjalan sebelum atau sesudah DOM diperbarui. Seharusnya Anda tidak mengandalkan DOM diperbarui dalam titik waktu tertentu.
* Alih-alih tipe Efek yang lain, yang mengaktifkan fungsi pembersihan untuk setiap Efek dan kemudian menjalankan *setup* untuk setiap Efek, `useInsertionEffect` akan mengaktifkan fungi pembersihan dan *setup* secara sekaligus, komponen per komponen. Ini akan menghasilkan "penyisipan" dari fungsi pembersihan dan *setup*.
---

## Penggunaan {/*usage*/}

### Menyisipkan style dinamis dari pustaka CSS-in-JS {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

Secara tradisional, kamu dapat menata komponen-komponen React menggunakan CSS biasa.

```js
// In your JS file:
<button className="success" />

// In your CSS file:
.success { color: green; }
```

Beberapa tim lebih memilih untuk menulis *style* secara langsung di dalam pada kode Javascript daripada menuliskan file CSS terpisah. Biasanya ini memerlukan penggunaan sebuah pustaka CSS-in-JS atau sebuah alat. Terdapat 3 pendekatan umum dalam CSS-in-JS:

1. Ekstraksi statis ke dalam file-file CSS dengan sebuah kompiler
2. *Style* *inline*, e.g. `<div style={{ opacity: 1 }}>`
3. Injeksi *runtime* tag `<style>`

Jika kamu menggunakan CC-in-JS, kami merekomendasikan sebuah kombinasi dari dua pendekatan pertama (File CSS untuk *style* statis, *inline* untuk *style* dinamis). **Kami tidak merekomendasikan injeksi *runtime* tag `<style>` karena dua alasan:**

1. Injeksi *runtime* memaksa peramban untuk menghitung ulang *style* dengan lebih sering.
2. Injeksi *runtime* bisa lebih lambat jika injeksi terjadi pada waktu yang salah pada *React lifecycle*.

Masalah pertama tidak dapat diselesaikan, tapi `useInsertionEffect` membantu Anda menyelesaikan masalah kedua.

<<<<<<< HEAD
Panggil `useInsertionEffect` untuk menyertakan sebuah *style* sebelum efek *layout* aktif:
=======
Call `useInsertionEffect` to insert the styles before any layout Effects fire:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {4-11}
// Inside your CSS-in-JS library
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // Seperti yang sudah dijelaskan sebelumnya, kami tidak merekomendasikan injeksi *runtime* dari tag <style>.
    // Tapi jika Anda harus melakukannya, maka sangat penting untuk melakukannya di dalam useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

Sama seperti `useEffect`, `useInsertionEffect` tidak berjalan di sisi *server*. Jika Anda ingin mengumpulkan aturan CSS yang telah digunakan pada *server*, Anda dapat melakukannya saat rendering:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[Baca lebih lanjut tentang memperbarui pustaka CSS-in-JS dengan injeksi *runtime* ke `useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### Bagaimana ini bisa lebih baik daripada menyisipkan style saat render atau useLayoutEffect? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

Jika kamu menambahkan *style* saat rendering dan React sedang memproses [non-blocking update,](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) peramban akan menghitung ulang *style* setiap *frame* saat me-*render* sebuah pohon (*tree*) komponen, yang dapat **sangat lambat.**

`useInsertionEffect` lebih baik daripada menyertakan *style* saat [`useLayoutEffect`](/reference/react/useLayoutEffect) atau [`useEffect`](/reference/react/useEffect) karena `useInsertionEffect` memastikan pada saat efek lain berjalan di dalam komponen Anda, tag `<style>` sudah terpasang. Jika tidak, perhitungan tata letak pada efek biasa akan salah karena *style* yang sudah usang.

</DeepDive>
