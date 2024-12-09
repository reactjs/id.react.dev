---
title: prefetchDNS
---

<<<<<<< HEAD
<Canary>

Fungsi `prefetchDNS` saat ini hanya tersedia di kanal Canary dan eksperimental React. Pelajari lebih lanjut tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

=======
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
<Intro>

`prefetchDNS` memungkinkan Anda mencari IP server yang Anda harapkan untuk memuat sumber daya.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

Untuk mencari host, panggil fungsi `prefetchDNS` dari `react-dom`.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[Lihat lebih banyak contoh di bawah ini.](#usage)

Fungsi prefetchDNS memberikan petunjuk kepada browser untuk mencari alamat IP dari server tertentu. Jika browser memilih untuk melakukannya, hal ini dapat mempercepat pemuatan sumber daya dari server tersebut.

#### Parameter {/*parameters*/}

* `href`: sebuah string. URL server yang ingin Anda sambungkan.

#### Kembalian {/*returns*/}

`prefetchDNS` tidak mengembalikan apa pun.

#### Peringatan {/*caveats*/}

* Beberapa panggilan ke `prefetchDNS` dengan server yang sama memiliki efek yang sama dengan panggilan tunggal.
* Di browser, Anda dapat memanggil `prefetchDNS` dalam situasi apa pun: saat me-*render* komponen, di Effect, di *event handler*, dan sebagainya.
* Dalam rendering sisi server atau saat me-*render* Komponen Server, `prefetchDNS` hanya memiliki efek jika Anda memanggilnya saat me-*render* komponen atau dalam konteks asinkronisasi yang berasal dari rendering komponen. Pemanggilan lainnya akan diabaikan.
* Jika Anda mengetahui sumber daya spesifik yang Anda perlukan, Anda dapat memanggil [fungsi lain](/reference/react-dom/#resource-preloading-apis) sebagai gantinya yang akan langsung memuat sumber daya.
* Tidak ada manfaatnya untuk mengambil sumber daya dari server yang sama dengan tempat halaman web dihosting karena sumber daya tersebut sudah dicari pada saat petunjuk diberikan.
* Dibandingkan dengan [`preconnect`](/reference/react-dom/preconnect), `prefetchDNS` mungkin lebih baik jika Anda secara spekulatif menyambungkan ke sejumlah besar domain, yang mana dalam hal ini biaya tambahan untuk melakukan prapenghubungan bisa jadi lebih besar daripada manfaatnya.

---

## Penggunaan {/*usage*/}

### Melakukan prefetching DNS saat me-render {/*prefetching-dns-when-rendering*/}

Panggil `prefetchDNS` saat me-*render* komponen jika Anda mengetahui bahwa anak komponen akan memuat sumber daya eksternal dari host tersebut.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### Prefetching DNS pada event handler {/*prefetching-dns-in-an-event-handler*/}

Panggil `prefetchDNS` di dalam *event handler* sebelum bertransisi ke halaman atau state yang membutuhkan sumber daya eksternal. Hal ini akan memulai proses lebih awal dibandingkan jika Anda memanggilnya saat me-*render* halaman atau state baru.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
