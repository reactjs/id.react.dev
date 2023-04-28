---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` dapat mempengaruhi kinerja. Lebih baik gunakan [`useEffect`](/reference/react/useEffect) bila memungkinkan.

</Pitfall>

<Intro>

`useLayoutEffect` adalah versi [`useEffect`](/reference/react/useEffect) yang dijalankan sebelum peramban melukis ulang (*repaint*) layar.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Panggil `useLayoutEffect` untuk melakukan pengukuran tata letak sebelum peramban melukis ulang layar:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[Lihat contoh lainnya di bawah ini](#usage)

#### Parameter {/*parameters*/}

* `setup`: Fungsi dengan logika Efek Anda. Fungsi *setup* juga dapat secara opsional mengembalikan fungsi *pembersihan* (*cleanup*). Sebelum komponen pertama kali ditambahkan ke DOM, React akan menjalankan fungsi *setup*. Setelah setiap *re-render* dengan dependensi yang berubah, React akan terlebih dahulu menjalankan fungsi pembersihan (jika Anda memberikannya) dengan nilai lama. Selanjutnya, React akan menjalankan fungsi *setup* dengan nilai baru. Sebelum komponen dihapus dari DOM, React akan menjalankan fungsi pembersihan untuk terakhir kali.
 
* **opsional** `dependencies`: Daftar semua nilai reaktif yang dirujuk di dalam kode `setup`. Nilai reaktif termasuk *props*, *state*, dan semua variabel dan fungsi dideklarasikan langsung di dalam komponen Anda. Jika *linter* Anda telah [dikonfigurasi untuk React](/learn/editor-setup#linting), maka *linter* tersebut akan memverifikasi bahwa setiap nilai reaktif sudah diatur dengan benar sebagai dependensi. Daftar dependensi ini harus memiliki jumlah *item* yang konstan dan ditulis secara *inline* seperti `[dep1, dep2, dep3]`. React akan membandingkan setiap dependensi dengan nilai lama menggunakan perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Jika argumen ini diabaikan, efek akan dijalankan ulang setelah setiap *re-render* dari komponen.

#### Returns {/*returns*/}

`useLayoutEffect` mengembalikan `undefined`.

#### Caveats {/*caveats*/}

* `useLayoutEffect` adalah sebuah Hook, sehingga Anda hanya dapat memanggilnya **di tingkat atas komponen** ataupun di *custom* Hooks Anda. Serta Anda tidak dapat memanggilnya di dalam perulangan ataupun percabangan. Bila diperlukan, ekstrak komponen dan pindahkan Efek ke dalam komponen tersebut.

* Ketika Strict Mode aktif, React akan **menjalankan siklus *setup*+pembersihan khusus pengembangan *(development-only)*** sebelum menjalankan *setup* sebenarnya. Uji ketahanan *(Stress-test)* tersebut memastikan logika pembersihan "mencerminkan" logika *setup* dan pembersihan tersebut dapat menghentikan atau membatalkan apa pun yang sedang dilakukan fungsi *setup*. Jika hal ini menyebabkan masalah, maka [implementasikan fungsi pembersihan.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Jika beberapa dependensi merupakan objek atau fungsi yang didefinisikan di dalam komponen, ada risiko **Efek akan dijalankan berulang kali lebih sering dari yang dibutuhkan.** Untuk memperbaiki ini, hilangkan dependensi [objek](/reference/react/useEffect#removing-unnecessary-object-dependencies) dan [fungsi](/reference/react/useEffect#removing-unnecessary-function-dependencies) yang tidak dibutuhkan. Anda juga dapat mengekstrak [pembaruan *state*](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) dan [logika non-reaktif](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) diluar dari efek Anda.

* Efek **hanya berjalan di sisi klien**. Efek tidak berjalan ketika *server rendering*.

* Kode di dalam `useLayoutEffect` serta semua pembaruan *state* yang telah dijadwalkan akan **menghalangi peramban untuk melukis ulang layar.** Penggunaan yang berlebihan dapat menyebabkan aplikasi Anda lambat. Jika memungkinkan, gunakan [`useEffect`](/reference/react/useEffect).

---

## Penggunaan {/*usage*/}

### Mengukur tata letak sebelum peramban melukis ulang layar {/*measuring-layout-before-the-browser-repaints-the-screen*/}

Sebagian besar komponen tidak perlu mengetahui posisi dan ukuran di layar untuk memutuskan apa yang harus dirender. Komponen hanya mengembalikan beberapa JSX. Selanjutnya, peramban akan mengukur *tata letak* (posisi dan ukuran) dan melukis ulang layar

Terkadang, itu tidak cukup. Bayangkan sebuah *tooltip* berada di sebelah elemen tertentu saat diarahkan (*hover*). Jika ruang mencukupi, posisi *tooltip* harus berada di atas elemen tersebut. Tetapi, jika tidak cukup, posisi *tooltip* harus berada di bawah. Untuk merender *tooltip* di posisi akhir yang tepat, maka Anda harus mengetahui tingginya (yaitu, apakah muat berada di atas)

Untuk melakukan hal ini, Anda perlu merender dalam dua tahap:

1. Merender *tooltip* di mana saja (bahkan dengan posisi yang salah).
2. Mengukur tingginya dan menentukan posisi *tooltip* tersebut.
3. Merender *ulang tooltip* agar berada di posisi yang tepat.

**Seluruh proses tersebut harus terjadi sebelum peramban melukis ulang layar.** Anda tidak ingin pengguna untuk melihat *tooltip* bergerak. Panggil `useLayoutEffect` untuk melakukan pengukuran tata letak sebelum peramban melukis ulang layar:


```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // Belum mengetahui tinggi tooltip sebenarnya

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Lakukan re-render setelah mengetahui tinggi tooltip
  }, []);

  // ...gunakan tooltipHeight di logika render di bawah ini ...
}
```

Berikut adalah langkah-langkah cara kerja:

1. `Tooltip` dirender dengan menginisialisasi nilai `tooltipHeight = 0` (Sehingga, memungkinkan *tooltip* berada di posisi yang salah).
2. React menempatkannya di DOM dan menjalankan kode di `useLayoutEffect`.
3. `useLayoutEffect`[mengukur tinggi](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) konten `tooltip` dan akan segera memicu *re-render*.
4. `Tooltip` dirender ulang dengan nilai `tooltipHeight` yang sebenarnya (sehingga *tooltip* berada di posisi yang benar).
5. React memperbarui DOM dan akhirnya peramban menampilkan *tooltip* tersebut.

Arahkan kursor ke tombol-tombol berikut dan perhatikan *tooltip*  menyesuaikan posisinya tergantung dari muat atau tidaknya ruang:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Tooltip ini tidak muat di atas tombol
            <br />
            Ini sebabnya tooltip ditampilkan di bawah
          </div>
        }
      >
        Arahkan disini (tooltip berada di atas)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip ini muat di atas tombol</div>
        }
      >
        Arahkan disini (tooltip berada di bawah)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip ini muat di atas tombol</div>
        }
      >
        Arahkan disini (tooltip berada di bawah)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Hasil pengukuran tinggi tooltip: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Tooltip tidak muat di atas, maka ditempatkan di bawah
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Perhatikan meskipun komponen `Tooltip` harus dirender dalam dua tahap (pertama, dengan nilai `tooltipHeight` diinisialisasi `0` dan ketika nilai tersebut diukur sesuai dengan tinggi sebenarnya), Anda hanya melihat hasil akhirnya. Ini sebabnya mengapa Anda menggunakan `useLayoutEffect` dibandingkan [`useEffect`](/reference/react/useEffect) untuk kasus contoh tersebut. Mari kita lihat perbedaanya secara detail di bawah ini.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` menghalangi peramban untuk melukis ulang {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React menjamin kode di dalam `useLayoutEffect` dan setiap pembaruan *state* yang dijadwalkan akan diproses **sebelum peramban melukis ulang layar.**  Hal ini memungkinkan Anda untuk merender *tooltip*, mengukurnya, dan merender ulang kembali *tooltip* tersebut tanpa pengguna menyadari *render* awal tambahan. Dengan kata lain, `useLayoutEffect` menghalangi peramban untuk melukis ulang

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Tooltip ini tidak muat di atas tombol
            <br />
            Ini sebabnya tooltip ditampilkan di bawah
          </div>
        }
      >
        Arahkan disini (tooltip berada di atas)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip ini muat di atas tombol</div>
        }
      >
        Arahkan disini (tooltip berada di bawah)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip ini muat di atas tombol</div>
        }
      >
        Arahkan disini (tooltip berada di bawah)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Tooltip tidak muat di atas, maka ditempatkan di bawah
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` tidak menghalangi peramban {/*useeffect-does-not-block-the-browser*/}

Berikut merupakan contoh identik menggunakan [`useEffect`](/reference/react/useEffect) daripada `useLayoutEffect`. Jika Anda menggunakan perangkat yang lebih lambat, mungkin Anda akan melihat bahwa terkadang *tooltip* "berkedip" dan secara singkat Anda melihat posisi awalnya sebelum diperbaiki.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Tooltip ini tidak muat di atas tombol
            <br />
            Ini sebabnya tooltip ditampilkan di bawah
          </div>
        }
      >
        Arahkan disini (tooltip berada)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip ini muat di atas tombol</div>
        }
      >
        Arahkan disini (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip ini muat di atas tombol</div>
        }
      >
        Arahkan disini (tooltip berada di bawah)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Tooltip tidak muat di atas, maka ditempatkan di bawah
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Untuk mempermudah reproduski *bug* ini, versi berikut secara artifisial menambahkan delay saat merender. React akan membiarkan peramban melukis ulang layar sebelum memproses pembaruan *state* di dalam `useEffect`. Hasilnya, tooltip berkedip:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Tooltip ini tidak muat di atas tombol
            <br />
            Ini sebabnya tooltip ditampilkan di bawah
          </div>
        }
      >
        Arahkan disini (tooltip berada)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip ini muat di atas tombol</div>
        }
      >
        Arahkan disini (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Tooltip ini muat di atas tombol</div>
        }
      >
        Arahkan disini (tooltip berada di bawah)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Berikut secara artifisial memperlambat rendering 
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Tidak melakukan apa pun sebentar...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Tooltip tidak muat di atas, maka ditempatkan di bawah
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Ubah contoh berikut menjadi `useLayoutEffect` dan perhatikan bahwa proses melukis diblokir meskipun *rendering* diperlambat . 

<Solution />

</Recipes>

<Note>

Proses merender dalam dua tahap dan memblokir peramban akan menurunkan kinerja. Cobalah untuk menghindari ini sebisa mungkin.

</Note>

---

## Pemecahan Masalah {/*troubleshooting*/}

### Saya menerima pesan kesalahan: "`useLayoutEffect` does nothing on the server" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

Tujuan dari `useLayoutEffect` adalah memungkinkan sebuah komponen [menggunakan informasi tata letak untuk *merender*:](#measuring-layout-before-the-browser-repaints-the-screen)

1. Merender konten awal.
2. Mengukur tata letak *sebelum peramban melukis ulang layar.*
3. Merender konten akhir menggunakan informasi tata letak yang telah dibaca.

When you or your framework uses [server rendering](/reference/react-dom/server), your React app renders to HTML on the server for the initial render. This lets you show the initial HTML before the JavaScript code loads.

Saat Anda atau *framework* Anda menggunakan [*server rendering*](/reference/react-dom/server), aplikasi React Anda dirender menjadi HTML di *server* saat awal merender.   

Masalahnya, di *server* tidak tersedia informasi tentang tata letak.

Pada [contoh sebelumnya](#measuring-layout-before-the-browser-repaints-the-screen), pemanggilan `useLayoutEffect` pada komponen `Tooltip` memungkinkan posisi *tooltip* disesuaikan dengan benar (entah di atas atau di bawah konten) tergantung pada tinggi konten. Jika Anda mencoba merender `Tooltip` sebagai bagian dari HTML *server* awal, ini akan menjadi tidak mungkin untuk ditentukan. Pada *server*, belum terdapat tata letak! Jadi, meskipun Anda merendernya pada server, posisinya akan "melompat" di klien setelah JavaScript dimuat dan dijalankan.

Biasanya, komponen yang bergantung pada informasi tata letak tidak perlu dirender di *server*. Misalnya, mungkin tidak masuk akal untuk menampilkan `Tooltip` selama render awal. Itu dipicu oleh interaksi klien.

Namun, jika Anda mengalami masalah ini, ada beberapa opsi yang tersedia:

- Ubah `useLayoutEffect` menjadi [`useEffect`.](/reference/react/useEffect) Hal ini memberi tahu React bahwa hasil render awal dapat ditampilkan tanpa memblokir proses melukis (karena HTML asli akan menjadi terlihat sebelum Efek dijalankan).

- Sebagai alternatif, [tandai komponen Anda sebagai *client-only*.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content Ini memberi tahu React untuk mengganti kontennya hingga batas [`<Suspense>`](/reference/react/Suspense) terdekat dengan *loading* cadangan (misalnya, *spinner* atau *glimmer*) selama *server rendering*.

- Jika Anda menyinkronkan komponen Anda dengan penyimpanan data eksternal dan mengandalkan `useLayoutEffect` untuk penggunaan selain dari pengukuran tata letak, pertimbangkan [`useSyncExternalStore`](/reference/react/useSyncExternalStore) sebagai gantinya, yang [mendukung `server rendering`.](reference/react/useSyncExternalStore#adding-support-for-server-rendering)


