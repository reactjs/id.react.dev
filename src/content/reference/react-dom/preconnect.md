---
title: preconnect
---

<<<<<<< HEAD
<Canary>

Fungsi `preconnect` saat ini hanya tersedia di kanal Canary dan eksperimental React. Pelajari lebih lanjut tentang [saluran rilis React di sini].

</Canary>

=======
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772
<Intro>

`preconnect` memungkinkan Anda menyambungkan ke server yang Anda harapkan untuk memuat sumber daya.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

Untuk melakukan prakoneksi ke sebuah host, panggil fungsi `preconnect` dari `react-dom`.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[Lihat lebih banyak contoh di bawah ini.](#usage)

Fungsi `preconnect` memberikan petunjuk kepada browser untuk membuka koneksi ke server yang diberikan. Jika browser memilih untuk melakukannya, hal ini dapat mempercepat pemuatan sumber daya dari server tersebut.

#### Parameter {/*parameters*/}

* `href`: sebuah string. URL server yang ingin Anda sambungkan.


#### Kembalian {/*returns*/}

`preconnect` tidak mengembalikan apa pun.

#### Peringatan {/*caveats*/}

* Beberapa panggilan ke `preconnect` dengan server yang sama memiliki efek yang sama dengan panggilan tunggal.
* Di browser, Anda dapat memanggil `preconnect` dalam situasi apa pun: saat merender komponen, di Effect, di event handler, dan sebagainya.
* Dalam rendering sisi server atau saat merender Komponen Server, `preconnect` hanya memiliki efek jika Anda memanggilnya saat merender komponen atau dalam konteks asinkronisasi yang berasal dari rendering komponen. Panggilan lain akan diabaikan.
* Jika Anda mengetahui sumber daya spesifik yang Anda perlukan, Anda dapat memanggil [fungsi lain](/reference/react-dom/#resource-preloading-apis) sebagai gantinya yang akan langsung memuat sumber daya.
* Tidak ada manfaatnya melakukan prakoneksi ke server yang sama dengan tempat halaman web dihosting karena server tersebut sudah tersambung pada saat petunjuk diberikan.

---

## Penggunaan {/*usage*/}

### Preconnecting saat merender {/*preconnecting-when-rendering*/}

Panggil `preconnect` saat merender komponen jika Anda mengetahui bahwa anak komponen akan memuat sumber daya eksternal dari host tersebut.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### Preconnecting pada event handler {/*preconnecting-in-an-event-handler*/}

Panggil `preconnect` dalam event handler sebelum bertransisi ke halaman atau state yang membutuhkan sumber daya eksternal. Hal ini akan memulai proses lebih awal dibandingkan jika Anda memanggilnya saat merender halaman atau state baru.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
