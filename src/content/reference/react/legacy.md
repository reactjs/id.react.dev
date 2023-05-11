---
title: "API React Lama"
---

<Intro>

API ini diekspor dari paket `react`, tapi tidak disarankan untuk digunakan dalam kode yang baru ditulis. Lihat halaman API individual tertaut untuk alternatif yang disarankan.

</Intro>

---

## API Lama {/*legacy-apis*/}

* [`Children`](/reference/react/Children) memungkinakn Anda memanipulasi dan mengubah JSX yang diterima sebagai *prop* `children`. [Lihat alternatif.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) memungkinkan Anda membuat elemen React menggunakan elemen lain sebagai titik awal. [Lihat alternatif.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) memungkinkan Anda mendefinisikan komponen React sebagai *class* JavaScript. [Lihat alternatif.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) memungkinkan Anda membuat elemen React. Biasanya Anda akan menggunakan JSX sebagai gantinya.
* [`createRef`](/reference/react/createRef) membuat objek ref yang dapat berisi nilai arbiter. [Lihat alternatif.](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement) memeriksa apakah suatu nilai adalah elemen React. Biasanya digunakan dengan [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) mirip dengan [`Component`,](/reference/react/Component) tetapi melewatkan render ulang dengan `props` yang sama. [Lihat alternatif.](/reference/react/PureComponent#alternatives)

---

## API yang tidak digunakan lagi {/*deprecated-apis*/}

<Deprecated>

API ini akan dihapus di versi utama React yang akan datang.

</Deprecated>

* [`createFactory`](/reference/react/createFactory) memungkinkan Anda membuat fungsi yang menghasilkan elemen React dari tipe tertentu.