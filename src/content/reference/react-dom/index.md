---
title: React DOM APIs
---

<Intro>

*package* `react-dom` berisi *method* yang hanya didukung untuk aplikasi web (yang berjalan di lingkungan *DOM* peramban). Mereka tidak didukung untuk React Native.

</Intro>

---

## API {/*apis*/}

API ini dapat di import dari komponen. Namun, jarang digunakan:

* [`createPortal`](/reference/react-dom/createPortal) memungkinkan Anda untuk me-*render* *child component* ke dalam bagian *DOM* *tree* yang berbeda.
* [`flushSync`](/reference/react-dom/flushSync) memungkinkan Anda untuk memaksa React untuk segera mengeksekusi pembaruan *state* dan memperbarui *DOM* secara sinkron.

---

## Titik masuk {/*entry-points*/}

*Package* `react-dom` menyediakan dua titik masuk tambahan:

* [`react-dom/client`](/reference/react-dom/client) berisi API untuk me-*render* komponen React di sisi klien (di dalam peramban).
* [`react-dom/server`](/reference/react-dom/server) berisi API untuk me-*render* komponen React di sisi server.

---

## API Usang {/*deprecated-apis*/}

<Deprecated>

API ini akan dihapus pada versi utama React yang akan datang.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) digunakan untuk mencari elemen *DOM* terdekat yang sesuai dengan instansi *class component*.
* [`hydrate`](/reference/react-dom/hydrate) digunakan untuk menampilkan sebuah struktur *tree* pada *DOM* yang telah dibuat sebelumnya melalui server HTML. Fungsi ini sudah tidak digunakan lagi, dan diganti dengan [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) digunakan untuk memasang sebuah struktur *tree* pada *DOM*. Fungsi ini juga sudah tidak digunakan lagi, dan diganti dengan [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) digunakan untuk melepaskan sebuah struktur pohon *tree* dari *DOM*. Fungsi ini sudah tidak digunakan lagi, dan diganti dengan [`root.unmount()`.](/reference/react-dom/client/createRoot#root-unmount)