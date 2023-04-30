---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` digunakan untuk pengguna library CSS-in-JS. Kecuali jika Anda sedang mengerjakan sebuah pustaka CSS-in-JS dan butuh sebuah tempat untuk menyisipkan style, Sudah pasti Anda memilih [`useEffect`](/reference/react/useEffect) atau [`useLayoutEffect`](/reference/react/useLayoutEffect) daripada sebelumya.

</Pitfall>

<Intro>

`useInsertionEffect` adalah sebuah versi dari [`useEffect`](/reference/react/useEffect) yang akan berjalan sebelum adanya mutasi DOM.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Panggil `useInsertionEffect` untuk menyertakan sebuah style sebelum terjadinya mutasi DOM:

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

[Lihat contoh lain dibawah ini.](#usage)

#### Parameter {/*parameters*/}

* `setup`: Fungsi berisi logika Efek Anda. Fungsi *setup* juga dapat secara opsional mengembalikan fungsi *pembersihan* (*cleanup*). Sebelum komponen pertama kali ditambahkan ke DOM, React akan menjalankan fungsi *setup*. Setelah setiap *re-render* dengan dependensi yang berubah, React akan terlebih dahulu menjalankan fungsi pembersihan (jika Anda memberikannya) dengan nilai lama. Selanjutnya, React akan menjalankan fungsi *setup* dengan nilai baru. Sebelum komponen dihapus dari DOM, React akan menjalankan fungsi pembersihan untuk terakhir kali.
 
* **opsional** `dependencies`: Daftar semua nilai reaktif yang dirujuk di dalam kode `setup`. Nilai reaktif termasuk *props*, *state*, dan semua variabel dan fungsi yang dideklarasikan langsung di dalam komponen. Jika linter Anda telah [dikonfigurasi untuk React](/learn/editor-setup#linting), maka *linter* tersebut akan memverifikasi bahwa setiap nilai reaktif sudah diatur dengan benar sebagai dependensi. Daftar dependensi ini harus memiliki jumlah *item* yang konstan dan ditulis secara *inline* seperti `[dep1, dep2, dep3]`. React akan membandingkan setiap dependensi dengan nilai lama menggunakan algoritma perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Jika Anda tidak menentukan sebuah dependensi sama sekali, efek akan dijalankan ulang setelah setiap *re-render* dari komponen.

#### Returns {/*returns*/}

`useInsertionEffect` mengembalikan `undefined`.

#### Caveats {/*caveats*/}

* Efek hanya berjalan di sisi klien. Efek tidak berjalan ketika *server rendering*.
* Anda tidak dapat mengupdate *state* dari dalam `useInsertionEffect`.
* Pada saat `useInsertionEffect` berjalan, *refs* belum  terpasang, dan DOM belum diperbarui.

---

## Usage {/*usage*/}

### Injecting dynamic styles from CSS-in-JS libraries {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

Traditionally, you would style React components using plain CSS.

```js
// In your JS file:
<button className="success" />

// In your CSS file:
.success { color: green; }
```

Some teams prefer to author styles directly in JavaScript code instead of writing CSS files. This usually requires using a CSS-in-JS library or a tool. There are three common approaches to CSS-in-JS:

1. Static extraction to CSS files with a compiler
2. Inline styles, e.g. `<div style={{ opacity: 1 }}>`
3. Runtime injection of `<style>` tags

If you use CSS-in-JS, we recommend a combination of the first two approaches (CSS files for static styles, inline styles for dynamic styles). **We don't recommend runtime `<style>` tag injection for two reasons:**

1. Runtime injection forces the browser to recalculate the styles a lot more often.
2. Runtime injection can be very slow if it happens at the wrong time in the React lifecycle.

The first problem is not solvable, but `useInsertionEffect` helps you solve the second problem.

Call `useInsertionEffect` to insert the styles before any DOM mutations:

```js {4-11}
// Inside your CSS-in-JS library
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // As explained earlier, we don't recommend runtime injection of <style> tags.
    // But if you have to do it, then it's important to do in useInsertionEffect.
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

Similarly to `useEffect`, `useInsertionEffect` does not run on the server. If you need to collect which CSS rules have been used on the server, you can do it during rendering:

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

[Read more about upgrading CSS-in-JS libraries with runtime injection to `useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### How is this better than injecting styles during rendering or useLayoutEffect? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

If you insert styles during rendering and React is processing a [non-blocking update,](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) the browser will recalculate the styles every single frame while rendering a component tree, which can be **extremely slow.**

`useInsertionEffect` is better than inserting styles during [`useLayoutEffect`](/reference/react/useLayoutEffect) or [`useEffect`](/reference/react/useEffect) because it ensures that by the time other Effects run in your components, the `<style>` tags have already been inserted. Otherwise, layout calculations in regular Effects would be wrong due to outdated styles.

</DeepDive>
