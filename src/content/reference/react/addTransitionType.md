---
title: unstable_addTransitionType
version: experimental
---

<Experimental>

**API ini bersifat eksperimental dan belum tersedia dalam versi React yang stabil.**

Anda dapat mencobanya dengan memperbarui *package* React ke versi eksperimental terbaru:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Versi eksperimental React mungkin mengandung bug. Jangan menggunakannya dalam produksi.

</Experimental>

<Intro>

`unstable_addTransitionType` memungkinkan Anda untuk menentukan penyebab dari suatu transisi.

```js
startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setState(newState);
});
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `addTransitionType` {/*addtransitiontype*/}

#### Parameter {/*parameters*/}

- `type`: Tipe transisi yang akan ditambahkan. Ini dapat berupa string apa pun.

#### Kembalian {/*returns*/}

`addTransitionType` tidak mengembalikan apa pun.

#### Caveats {/*caveats*/}

- Jika beberapa transisi digabungkan, semua Tipe Transisi akan dikumpulkan. Anda juga dapat menambahkan lebih dari satu tipe ke dalam sebuah Transisi.
- Tipe Transisi diatur ulang setiap kali *commit*. Ini berarti *fallback* `<Suspense>` akan mengasosiasikan tipe setelah `startTransition`, namun menampilkan konten tidak demikian.

---

## Penggunaan {/*usage*/}

### Menambahkan penyebab transisi {/*adding-the-cause-of-a-transition*/}

Panggil `addTransitionType` di dalam `startTransition` untuk menunjukkan penyebab dari suatu transisi:

```js [[1, 6, "unstable_addTransitionType"], [2, 5, "startTransition", [3, 6, "'submit-click'"]]
import { startTransition, unstable_addTransitionType } from 'react';

function Submit({action) {
  function handleClick() {
    startTransition(() => {
      unstable_addTransitionType('submit-click');
      action();
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}

```

Saat Anda memanggil <CodeStep step={1}>addTransitionType</CodeStep> di dalam cakupan <CodeStep step={2}>startTransition</CodeStep>, React akan mengasosiasikan <CodeStep step={3}>submit-click</CodeStep> sebagai salah satu penyebab Transisi tersebut.

Saat ini, Tipe Transisi dapat digunakan untuk menyesuaikan animasi yang berbeda berdasarkan apa yang menyebabkan Transisi tersebut. Anda memiliki tiga cara berbeda yang dapat dipilih untuk menggunakannya:

- [Menyesuaikan animasi menggunakan tipe transisi tampilan browser](#customize-animations-using-browser-view-transition-types)
- [Menyesuaikan animasi menggunakan Kelas `View Transition`](#customize-animations-using-view-transition-class)
- [Menyesuaikan animasi menggunakan event `ViewTransition`](#customize-animations-using-viewtransition-events) 

Di masa mendatang, kami berencana untuk mendukung lebih banyak kasus penggunaan untuk menggunakan penyebab transisi.

---
### Menyesuaikan animasi menggunakan tipe transisi tampilan browser {/*customize-animations-using-browser-view-transition-types*/}

Ketika [`ViewTransition`](/reference/react/ViewTransition) aktif dari sebuah transisi, React menambahkan semua Tipe Transisi sebagai [tipe transisi tampilan](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) browser ke elemen tersebut.

Ini memungkinkan Anda menyesuaikan animasi berbeda berdasarkan cakupan CSS:

```js [11]
function Component() {
  return (
    <ViewTransition>
      <div>Hello</div>
    </ViewTransition>
  );
}

startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setShow(true);
});
```

```css
:root:active-view-transition-type(my-transition-type) {
  &::view-transition-...(...) {
    ...
  }
}
```

---

### Menyesuaikan animasi menggunakan Kelas `View Transition` {/*customize-animations-using-view-transition-class*/}

Anda dapat menyesuaikan animasi untuk `ViewTransition` yang diaktifkan berdasarkan tipe dengan meneruskan objek ke Kelas View Transition:

```js
function Component() {
  return (
    <ViewTransition enter={{
      'my-transition-type': 'my-transition-class',
    }}>
      <div>Hello</div>
    </ViewTransition>
  );
}

// ...
startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setState(newState);
});
```

Jika beberapa tipe cocok, maka mereka akan digabungkan. Jika tidak ada tipe yang cocok, maka entri khusus "default" yang digunakan. Jika ada tipe yang memiliki nilai "none", maka itu yang akan menang dan ViewTransition dinonaktifkan (tidak diberikan nama).

Ini dapat dikombinasikan dengan prop enter/exit/update/layout/share untuk mencocokkan berdasarkan jenis pemicu dan Tipe Transisi.

```js
<ViewTransition enter={{
  'navigation-back': 'enter-right',
  'navigation-forward': 'enter-left',
}}
exit={{
  'navigation-back': 'exit-right',
  'navigation-forward': 'exit-left',
}}>
```

---

### Menyesuaikan animasi menggunakan event `ViewTransition` {/*customize-animations-using-viewtransition-events*/}

Anda dapat secara imperatif menyesuaikan animasi untuk `ViewTransition` yang diaktifkan berdasarkan tipe menggunakan event View Transition:

```
<ViewTransition onUpdate={(inst, types) => {
  if (types.includes('navigation-back')) {
    ...
  } else if (types.includes('navigation-forward')) {
    ...
  } else {
    ...
  }
}}>
```

Ini memungkinkan Anda untuk memilih Animasi imperatif yang berbeda berdasarkan penyebabnya.

---

## Troubleshooting {/*troubleshooting*/}

### TODO {/*todo2*/}
