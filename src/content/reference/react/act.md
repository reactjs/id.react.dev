---
title: act
---

<Intro>

`act` adalah alat bantu pengujian untuk menerapkan pembaruan React yang tertunda sebelum melakukan perbandingan.

```js
await act(async actFn)
```

</Intro>

Untuk mempersiapkan komponen sebelum perbandingan, bungkus kode yang me-*render*-nya dan melakukan pembaruan di dalam panggilan await act(). Ini membuat pengujian Anda lebih mendekati cara kerja React di peramban.

<Note>
Anda mungkin merasa penggunaan `act()` secara langsung agak terlalu bertele-tele. Untuk menghindari beberapa boilerplate, Anda bisa menggunakan pustaka seperti [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), yang alat bantunya sudah dibungkus dengan `act()`.
</Note>


<InlineToc />

---

## Referensi {/*reference*/}

### `await act(async actFn)` {/*await-act-async-actfn*/}

Saat menulis pengujian UI, tugas-tugas seperti me-*render*, *events* pengguna, atau pengambilan data dapat dianggap sebagai "unit" interaksi dengan antarmuka pengguna. React menyediakan alat bantu bernama `act()` yang memastikan semua pembaruan terkait "unit" ini telah diproses dan diterapkan ke DOM sebelum Anda melakukan perbandingan apa pun.

Nama `act` berasal dari pola [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert).

```js {2,4}
it ('merender dengan tombol dinonaktifkan', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

<Note>

Kami merekomendasikan penggunaan `act` dengan `await` dan fungsi `async`. Meskipun versi sinkron bekerja dalam banyak kasus, ia tidak berfungsi di semua kasus dan karena cara React menjadwalkan pembaruan secara internal, sulit untuk memprediksi kapan Anda dapat menggunakan versi sinkron.

Kami akan menonaktifkan dan menghapus versi sinkron di masa mendatang.

</Note>

#### Parameter {/*parameters*/}

* `async actFn`: Fungsi async yang membungkus *render* atau interaksi untuk komponen yang diuji. Pembaruan yang dipicu dalam `actFn`, ditambahkan ke antrean act internal, yang kemudian dibersihkan bersama untuk memproses dan menerapkan perubahan pada DOM. Karena bersifat async, React juga akan menjalankan kode yang melewati batas async, dan membersihkan pembaruan yang dijadwalkan.

#### Kembalian {/*returns*/}

`act` tidak mengembalikan apa pun.

## Penggunaan {/*usage*/}

Saat menguji sebuah komponen, Anda dapat menggunakan `act` untuk membuat perbandingan tentang keluarannya.

Sebagai contoh, misalnya kita memiliki komponen `Counter`, contoh penggunaan di bawah ini menunjukkan cara mengujinya:

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
<<<<<<< HEAD
    document.title = `Anda mengklik ${this.state.count} kali`;
=======
    document.title = `You clicked ${count} times`;
>>>>>>> 65d297e93b36be5370e58ab7828d022c741ecbe2
  }, [count]);

  return (
    <div>
<<<<<<< HEAD
      <p>Anda mengklik ${this.state.count} kali</p>
      <button onClick={this.handleClick}>
        Klik saya
=======
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
>>>>>>> 65d297e93b36be5370e58ab7828d022c741ecbe2
      </button>
    </div>
  )
}
```

### Me-*render* komponen dalam pengujian {/*rendering-components-in-tests*/}

Untuk menguji keluaran *render* suatu komponen, bungkus *render* tersebut di dalam `act()`:

```js  {10,12}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('dapat me-render dan memperbarui penghitung', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  
  // ✅ Render the component inside act().
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Anda mengklik 0 kali');
  expect(document.title).toBe('Anda mengklik 0 kali');
});
```

Di sini, kita membuat sebuah kontainer, menambahkannya ke dalam dokumen, dan me-*render* komponen `Counter` di dalam `act()`. Hal ini memastikan bahwa komponen tersebut di-*render* dan efek-efeknya diterapkan sebelum melakukan perbandingan.

Menggunakan `act` memastikan bahwa semua pembaruan telah diterapkan sebelum kita melakukan perbandingan.

### Mengirimkan events dalam pengujian {/*dispatching-events-in-tests*/}

Untuk menguji *events*, bungkus pengiriman *events* di dalam `act()`: 

```js {14,16}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('dapat me-render dan memperbarui penghitung', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  // ✅ Dispatch the event inside act().
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Anda mengklik 1 kali');
  expect(document.title).toBe('Anda mengklik 1 kali');
});
```

Di sini, kita me-*render* komponen dengan `act`, dan kemudian mengirimkan *event* ke dalam `act` lainnya. Hal ini memastikan bahwa semua pembaruan dari *event* tersebut diterapkan sebelum melakukan perbandingan.

<Pitfall>

Jangan lupa bahwa mengirimkan *events* DOM hanya berfungsi ketika kontainer DOM ditambahkan ke dalam dokumen. Anda dapat menggunakan pustaka seperti [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) untuk mengurangi kode boilerplate.

</Pitfall>

## Pemecahan Masalah {/*troubleshooting*/}

### Saya mendapatkan error: "The current testing environment is not configured to support act(...)" {/*error-the-current-testing-environment-is-not-configured-to-support-act*/}

Menggunakan `act` memerlukan pengaturan `global.IS_REACT_ACT_ENVIRONMENT=true` di lingkungan pengujian Anda. Hal ini untuk memastikan bahwa `act` hanya digunakan di lingkungan yang tepat.

Jika Anda tidak mengatur global ini, Anda akan melihat error seperti ini:

<ConsoleBlock level="error">

Warning: The current testing environment is not configured to support act(...)

</ConsoleBlock>

Untuk memperbaikinya, tambahkan ini ke *file* pengaturan global untuk pengujian React Anda:

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

<Note>

Pada *framework* pengujian seperti [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), `IS_REACT_ACT_ENVIRONMENT` sudah diatur untuk Anda.s

</Note>
