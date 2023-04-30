---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` dapat memperburuk kinerja. Gunakan [`useEffect`](/reference/react/useEffect) bila memungkinkan.

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

Panggil `useLayoutEffect` untuk mengukur tata letak sebelum peramban melukis ulang layar:

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

* `setup`: Fungsi berisi logika Efek Anda. Fungsi *setup* juga dapat secara opsional mengembalikan fungsi *pembersihan* (*cleanup*). Sebelum komponen pertama kali ditambahkan ke DOM, React akan menjalankan fungsi *setup*. Setelah setiap *re-render* dengan dependensi yang berubah, React akan terlebih dahulu menjalankan fungsi pembersihan (jika Anda memberikannya) dengan nilai lama. Selanjutnya, React akan menjalankan fungsi *setup* dengan nilai baru. Sebelum komponen dihapus dari DOM, React akan menjalankan fungsi pembersihan untuk terakhir kali.
 
* **opsional** `dependencies`: Daftar semua nilai reaktif yang dirujuk di dalam kode `setup`. Nilai reaktif termasuk *props*, *state*, dan semua variabel dan fungsi yang dideklarasikan langsung di dalam komponen. Jika *linter* Anda telah [dikonfigurasi untuk React](/learn/editor-setup#linting), maka *linter* tersebut akan memverifikasi bahwa setiap nilai reaktif sudah diatur dengan benar sebagai dependensi. Daftar dependensi ini harus memiliki jumlah *item* yang konstan dan ditulis secara *inline* seperti `[dep1, dep2, dep3]`. React akan membandingkan setiap dependensi dengan nilai lama menggunakan perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Jika argumen ini diabaikan, efek akan dijalankan ulang setelah setiap *re-render* dari komponen.

#### Returns {/*returns*/}

`useLayoutEffect` mengembalikan `undefined`.

#### Caveats {/*caveats*/}

* `useLayoutEffect` adalah sebuah Hook, sehingga hanya dapat memanggilnya **di tingkat atas komponen** ataupun di *custom* Hooks Anda. Serta tidak dapat dipanggil di dalam perulangan ataupun percabangan. Bila diperlukan, ekstrak komponen dan pindahkan Efek ke dalam komponen tersebut.

* Ketika Strict Mode aktif, React akan **menjalankan siklus *setup*+pembersihan khusus pengembangan *(development-only)*** sebelum menjalankan *setup* sebenarnya. Uji ketahanan *(Stress-test)* tersebut memastikan logika pembersihan "mencerminkan" logika *setup* dan pembersihan tersebut dapat menghentikan atau membatalkan apa pun yang sedang dilakukan fungsi *setup*. Jika hal ini menyebabkan masalah, maka [implementasikan fungsi pembersihan.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Jika beberapa dependensi merupakan objek atau fungsi yang didefinisikan di dalam komponen, akan timbul risiko **Efek dijalankan berulang kali lebih sering dari yang dibutuhkan.** Untuk memperbaiki ini, hilangkan dependensi [objek](/reference/react/useEffect#removing-unnecessary-object-dependencies) dan [fungsi](/reference/react/useEffect#removing-unnecessary-function-dependencies) yang tidak dibutuhkan. Anda juga dapat mengekstrak [pembaruan *state*](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) dan [logika non-reaktif](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) diluar dari efek.

* Efek **hanya berjalan di sisi klien**. Efek tidak berjalan ketika *server rendering*.

* Kode di dalam `useLayoutEffect` serta semua pembaruan *state* yang telah dijadwalkan akan **memblokir peramban untuk melukis ulang layar.** Penggunaan berlebihan dapat menyebabkan aplikasi Anda lambat. Jika memungkinkan, gunakan [`useEffect`](/reference/react/useEffect).

---

## Penggunaan {/*usage*/}

### Mengukur tata letak sebelum peramban melukis ulang layar {/*measuring-layout-before-the-browser-repaints-the-screen*/}

Sebagian besar komponen tidak perlu mengetahui posisi dan ukuran di layar untuk memutuskan apa yang harus di-*render*. Komponen hanya mengembalikan beberapa JSX. Selanjutnya, peramban akan mengukur *tata letak* (posisi dan ukuran) dan melukis ulang layar.

Terkadang, itu tidak cukup. Bayangkan sebuah *tooltip* berada di sebelah elemen tertentu saat diarahkan (*hover*). Jika ruang mencukupi, posisi *tooltip* harus berada di atas elemen tersebut. Tetapi, jika tidak cukup, posisi *tooltip* harus berada di bawah. Untuk me-*render* *tooltip* di posisi akhir yang tepat, maka Anda harus mengetahui ketinggiannya (yaitu, apakah muat berada di atas).

Untuk melakukan hal tersebut, Anda perlu me-*render* dalam dua tahap:

1. Me-*render* *tooltip* di mana saja (bahkan dengan posisi yang salah).
2. Mengukur tingginya dan menentukan posisi *tooltip* tersebut.
3. Me-*render* ulang *tooltip* agar berada di posisi yang tepat.

**Seluruh proses tersebut harus terjadi sebelum peramban melukis ulang layar.** Pengguna tidak ingin melihat *tooltip* bergerak. Panggil `useLayoutEffect` untuk mengukur tata letak sebelum peramban melukis ulang layar:

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // Belum mengetahui ketinggian tooltip sebenarnya

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Lakukan re-render setelah mengetahui ketinggian tooltip
  }, []);

  // ...gunakan tooltipHeight pada logika render di bawah ini ...
}
```

Berikut adalah langkah-langkah cara kerja:

1. `Tooltip` di-*render* dengan menginisialisasi nilai `tooltipHeight = 0` (Sehingga, memungkinkan *tooltip* berada di posisi yang salah).
2. React menempatkannya di DOM dan menjalankan kode di `useLayoutEffect`.
 3. `useLayoutEffect`[mengukur tinggi](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) konten `tooltip` dan akan segera memicu *render* ulang.
4. `Tooltip` di-*render* ulang dengan nilai `tooltipHeight` yang sebenarnya (sehingga *tooltip* berada di posisi yang benar).
5. React memperbarui DOM dan akhirnya peramban menampilkan *tooltip* tersebut.

Arahkan kursor ke tombol berikut dan perhatikan *tooltip*  menyesuaikan posisinya tergantung dari ketersediaan ruang:

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
      // Tooltip tidak muat di atas, maka diletakkan di bawah
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

Meskipun komponen `Tooltip` harus di-*render* dalam dua tahap (pertama, dengan nilai `tooltipHeight` diinisialisasi `0` dan ketika nilai tersebut diukur sesuai dengan tinggi sebenarnya), Anda hanya melihat hasil akhirnya. Ini sebabnya mengapa Anda menggunakan `useLayoutEffect` dibandingkan [`useEffect`](/reference/react/useEffect) untuk kasus contoh tersebut. Mari kita lihat perbedaanya secara detail di bawah ini.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` memblokir peramban untuk melukis ulang {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React menjamin kode di dalam `useLayoutEffect` dan setiap pembaruan *state* yang dijadwalkan akan diproses **sebelum peramban melukis ulang layar.**  Hal ini memungkinkan Anda untuk me-*render* *tooltip*, mengukurnya, dan me-*render* ulang kembali *tooltip* tersebut tanpa pengguna menyadari *render* awal tambahan. Dengan kata lain, `useLayoutEffect` memblokir peramban untuk melukis ulang.

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
      // Tooltip tidak muat di atas, maka diletakkan di bawah
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

#### `useEffect` tidak memblokir peramban {/*useeffect-does-not-block-the-browser*/}

Berikut merupakan contoh identik menggunakan [`useEffect`](/reference/react/useEffect) daripada `useLayoutEffect`. Jika menggunakan perangkat yang lebih lambat, terkadang *tooltip* terlihat "berkedip" dan secara singkat posisi awal *tooltip* terlihat sebelum diperbaiki.

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
      // Tooltip tidak muat di atas, maka diletakkan di bawah
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

Untuk mempermudah reproduski *bug* ini, versi berikut menambahkan penundaan buatan saat me-*render*. React akan membiarkan peramban melukis ulang layar sebelum memproses pembaruan *state* di dalam `useEffect`. Hasilnya, tooltip berkedip:

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
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Berikut secara artifisial memperlambat proses me-*render* 
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Sementara tidak melakukan apa pun...
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
      // Tooltip tidak muat di atas, maka diletakkan di bawah
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

Ubah contoh berikut menjadi `useLayoutEffect` kemudian amati proses melukis layar akan terhalang meskipun proses me-*render* diperlambat. 

<Solution />

</Recipes>

<Note>

Proses me-*render* dua tahap dan memblokir peramban akan menurunkan kinerja. Sebaiknya proses tersebut dihindari.

</Note>

---

## Pemecahan Masalah {/*troubleshooting*/}

### Saya menerima *error*: "`useLayoutEffect` does nothing on the server" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

Tujuan dari `useLayoutEffect` adalah memungkinkan sebuah komponen [menggunakan informasi tata letak untuk *me-*render**:](#measuring-layout-before-the-browser-repaints-the-screen)

1. Me-*render* konten awal.
2. Mengukur tata letak *sebelum peramban melukis ulang layar.*
3. Me-*render* konten akhir menggunakan informasi tata letak yang telah dibaca.

Ketika Anda atau *framework* Anda menggunakan [*server rendering*](/reference/react-dom/server), aplikasi React Anda di-*render* menjadi HTML di *server* saat awal me-*render*.   

Masalahnya, di *server* tidak tersedia informasi tentang tata letak.

Pada [contoh sebelumnya](#measuring-layout-before-the-browser-repaints-the-screen), pemanggilan `useLayoutEffect` pada komponen `Tooltip` memungkinkan posisi *tooltip* disesuaikan dengan benar (antara di atas atau di bawah konten) tergantung pada ketinggian konten. Sedangkan, jika Anda mencoba me-*render* `Tooltip` sebagai bagian dari HTML *server* awal, hal tersebut tidak mungkin dapat dilakukan. Sebab di *server* belum terdapat tata letak! Jadi, meskipun Anda me-*render*nya di *server*, posisi *tooltip* akan "melompat" di sisi klien setelah JavaScript dimuat dan dijalankan.

Biasanya, komponen yang bergantung pada informasi tata letak tidak perlu di-*render* di *server*. Sebagai contoh, tidak akan masuk akal untuk menampilkan `Tooltip` selama *render* awal. Karena hal tersebut dipicu oleh interaksi klien.

Namun, jika mengalami masalah tersebut, terdapat beberapa opsi yang tersedia:

- Ubah `useLayoutEffect` menjadi [`useEffect`.](/reference/react/useEffect) Hal tersebut menginformasikan React bahwa hasil *render* awal dapat ditampilkan tanpa memblokir proses melukis (karena HTML asli akan terlihat sebelum Efek dijalankan).

- Sebagai alternatif, [tandai komponen Anda sebagai khusus klien (*client-only*).](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content) Hal tersebut menginformasikan React untuk mengganti kontennya hingga [`<Suspense>`](/reference/react/Suspense) terdekat dengan *fallback loading* (Sebagai contoh, *spinner* atau *glimmer*) selama *server rendering*.

- Sebagai alternatif, Anda dapat me-*render* komponen dengan `useLayoutEffect` hanya setelah proses hidrasi (*hydration*). Tambahkan *state boolean* `isMounted` yang diinisialisasi dengan nilai `false`, dan atur nilainya menjadi `true` di dalam panggilan `useEffect`. Logika me-*render* Anda dapat dituliskan seperti ini: `return isMounted ? <RealContent /> : <FallbackContent />`. Selama di sisi *server* atau proses hidrasi, pengguna akan melihat `FallbackContent` yang tidak memanggil `useLayoutEffect`. Kemudian React akan menggantinya dengan `RealContent` yang hanya dijalankan di sisi klien dan juga dapat mencakup pemanggilan `useLayoutEffect`.

- Jika Anda menyinkronkan komponen dengan penyimpanan data eksternal menggunakan `useLayoutEffect` untuk penggunaan selain dari pengukuran tata letak, pertimbangkan [`useSyncExternalStore`](/reference/react/useSyncExternalStore) yang [mendukung *server rendering*](reference/react/useSyncExternalStore#adding-support-for-server-rendering) sebagai gantinya.


