---
title: flushSync
---

<Pitfall>

Penggunaan `flushSync` tidak umum dan dapat menyebabkan penurunan kinerja aplikasi Anda.

</Pitfall>

<Intro>

`flushSync` dapat memaksa React untuk menge-*flush* pembaruan dalam *callback* yang diberikan secara sinkron.

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

#### Parameters {/*parameters*/}


* `callback`: Sebuah fungsi. React akan langsung memanggil *callback* ini dan menge-*flush* pembaruan di dalamnya secara sinkron. React juga dapat menge-*flush* pembaruan tertunda, atau *Effects*, atau pembaruan di dalam *Effects*. Jika sebuah pembaruan tertunda karena pemanggilan `flushSync` ini, *fallback*-nya dapat ditampilkan kembali.

#### Returns {/*returns*/}

`flushSync` mengembalikan `undefined`.

#### Perhatian {/*caveats*/}

* `flushSync` dapat menurunkan performa secara signifikan. Jangan gunakan terlalu sering.
* `flushSync` dapat memaksa batas *Suspense* tertunda untuk menampilkan state `fallback`-nya.
* `flushSync` may run pending effects and synchronously apply any updates they contain before returning.
* `flushSync` may flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

---

## Usage {/*usage*/}

### Flushing updates for third-party integrations {/*flushing-updates-for-third-party-integrations*/}

When integrating with third-party code such as browser APIs or UI libraries, it may be necessary to force React to flush updates. Use `flushSync` to force React to flush any <CodeStep step={1}>state updates</CodeStep> inside the callback synchronously:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// By this line, the DOM is updated.
```

This ensures that, by the time the next line of code runs, React has already updated the DOM.

**Using `flushSync` is uncommon, and using it often can significantly hurt the performance of your app.** If your app only uses React APIs, and does not integrate with third-party libraries, `flushSync` should be unnecessary.

However, it can be helpful for integrating with third-party code like browser APIs.

Some browser APIs expect results inside of callbacks to be written to the DOM synchronously, by the end of the callback, so the browser can do something with the rendered DOM. In most cases, React handles this for you automatically. But in some cases it may be necessary to force a synchronous update.

For example, the browser `onbeforeprint` API allows you to change the page immediately before the print dialog opens. This is useful for applying custom print styles that allow the document to display better for printing. In the example below, you use `flushSync` inside of the `onbeforeprint` callback to immediately "flush" the React state to the DOM. Then, by the time the print dialog opens, `isPrinting` displays "yes":

<Sandpack>

```js App.js active
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

Without `flushSync`, when the print dialog will display `isPrinting` as "no". This is because React batches the updates asynchronously and the print dialog is displayed before the state is updated.

<Pitfall>

`flushSync` can significantly hurt performance, and may unexpectedly force pending Suspense boundaries to show their fallback state.

Most of the time, `flushSync` can be avoided, so use `flushSync` as a last resort.

</Pitfall>
