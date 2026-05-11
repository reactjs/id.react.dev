---
title: flushSync
---

<Pitfall>

Penggunaan `flushSync` tidak umum dan dapat menyebabkan penurunan kinerja aplikasi Anda.

</Pitfall>

<Intro>

`flushSync` dapat memaksa React untuk menge-*flush* pembaruan dalam *callback* yang diberikan secara sinkron. Ini memastikan bahwa DOM diperbarui dengan segera.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

Panggil `flushSync` untuk memaksa React menge-*flush* pekerjaan tertunda dan memperbarui DOM secara sinkon.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

Seringnya, `flushSync` dapat dihindari. Gunakan `flushSync` sebagai pilihan terakhir.

[Lihat lebih banyak contoh di bawah.](#usage)

#### Parameter {/*parameters*/}


* `callback`: Sebuah fungsi. React akan langsung memanggil *callback* ini dan menge-*flush* pembaruan di dalamnya secara sinkron. React juga dapat menge-*flush* pembaruan tertunda, atau *Effects*, atau pembaruan di dalam *Effects*. Jika sebuah pembaruan tertunda karena pemanggilan `flushSync` ini, *fallback*-nya dapat ditampilkan kembali.

#### Kembalian {/*returns*/}

`flushSync` mengembalikan `undefined`.

#### Catatan penting {/*caveats*/}

* `flushSync` dapat menurunkan performa secara signifikan. Jangan gunakan terlalu sering.
* `flushSync` dapat memaksa batas *Suspense* tertunda untuk menampilkan *state* `fallback`-nya.
* `flushSync` dapat menjakankan *effects* tertunda dan secara sinkron menerapkan pembaruan di dalamnya sebelum mengembalikan.
* `flushSync` dapat menge-*flush* pembaruan di luar *callback* ketika perlu untuk menge-*flush* pembaruan di dalam *callback*. Misalnya, jika ada pembaruan tertunda dari sebuah klik, React dapat menge-*flush* pembaruan tersebut sebelum menge-*flush* pembaruan di dalam *callback*.

---

## Penggunaan {/*usage*/}

### Menge-*flush* pembaruan untuk integrasi pihak ketiga {/*flushing-updates-for-third-party-integrations*/}

Saat berintegrasi dengan kode pihak ketiga seperti API browser atau pustaka UI, mungkin akan diperlukan untuk memaksa React menge-*flush* pembaruan. Gunakan `flushSync` untuk memaksa react menge-*flush* <CodeStep step={1}>pembaruan *state*</CodeStep> di dalam callback secara sinkron:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// Pada baris ini, DOM sudah diperbarui.
```

Ini memastikan bahwa, pada saat baris berikutnya berjalan, React sudah memperbarui DOM.

**Penggunaan `flushSync` tidak umum, dan menggunakannya dengan sering dapat menurunkan performa aplikasi Anda secara signifikan.** Jika aplikasi Anda hanya menggunakan API React, dan tidak berintegrasi dengan pustaka pihak ketiga, `flushSync` seharusnya tidak perlu digunakan.

Namun, `flushSync` dapat berguna untuk berintegrasi dengan kode pihak ketiga seperti API peramban.

Beberapa API peramban mengekspektasikan hasil di dalam *callback* ditulis ke DOM secara sinkron di akhir *callback*, sehingga peramban dapat melakukan sesuatu dengan DOM yang telah di-*render*. Dalam kebanyakan kasus, React menangani ini untuk Anda secara otomatis. Namun, dalam beberapa kasus, mungkin tidak diperlukan untuk memaksakan pembaruan sinkron.

Sebagai contoh, API peramban `onbeforeprint` memungkinkan Anda untuk mengubah halaman dengan segera sebelum dialog cetak (*print dialog*) terbuka. Ini berguna untuk menerapkan gaya cetak tersuai (*custom print styles*) yang memungkinkan dokumen untuk tampil lebih baik untuk dicetak. Dalam contoh di bawah, Anda menggunakan `flushSync` di dalam *callback* `onbeforeprint` untuk dengan segera "menge-*flush*" *state* React ke DOM. Kemudian, pada saat dialog cetak terbuka, `isPrinting` akan menampilkan "yes":

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

Tanpa `flushSync`, dialog cetak akan menampilkan `isPrinting` sebagai "no". Ini terjadi karena React mengelompokkan (*batch*) pembaruan secara asinkron dan dialog cetak ditampilkan sebelum *state* diperbarui.

<Pitfall>

`flushSync` dapat menurunkan performa secara signifikan, dan mungkin tiba-tiba memaksa batas *Suspense* yang tertunda untuk menampilkan *state* *fallback*-nya.

Seringnya, `flushSync` dapat dihindari, maka gunakan `flushSync` sebagai pilihan terakhir.

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "flushSync was called from inside a lifecycle method" {/*im-getting-an-error-flushsync-was-called-from-inside-a-lifecycle-method*/}


React cannot `flushSync` in the middle of a render. If you do, it will noop and warn:

<ConsoleBlock level="error">

Warning: flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.

</ConsoleBlock>

This includes calling `flushSync` inside:

- rendering a component.
- `useLayoutEffect` or `useEffect` hooks.
- Class component lifecycle methods.

For example, calling `flushSync` in an Effect will noop and warn:

```js
import { useEffect } from 'react';
import { flushSync } from 'react-dom';

function MyComponent() {
  useEffect(() => {
    // 🚩 Wrong: calling flushSync inside an effect
    flushSync(() => {
      setSomething(newValue);
    });
  }, []);

  return <div>{/* ... */}</div>;
}
```

To fix this, you usually want to move the `flushSync` call to an event:

```js
function handleClick() {
  // ✅ Correct: flushSync in event handlers is safe
  flushSync(() => {
    setSomething(newValue);
  });
}
```


If it's difficult to move to an event, you can defer `flushSync` in a microtask:

```js {3,7}
useEffect(() => {
  // ✅ Correct: defer flushSync to a microtask
  queueMicrotask(() => {
    flushSync(() => {
      setSomething(newValue);
    });
  });
}, []);
```

This will allow the current render to finish and schedule another syncronous render to flush the updates.

<Pitfall>

`flushSync` can significantly hurt performance, but this particular pattern is even worse for performance. Exhaust all other options before calling `flushSync` in a microtask as an escape hatch.

</Pitfall>
