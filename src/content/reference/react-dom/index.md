---
title: API React DOM
---

<Intro>

*package* `react-dom` berisi *method* yang hanya didukung untuk aplikasi web (yang berjalan di lingkungan *DOM* peramban). Mereka tidak didukung untuk React Native.

</Intro>

---

## API {/*apis*/}

API ini dapat di import dari komponen. Namun, jarang digunakan:

* [`createPortal`](/reference/react-dom/createPortal) memungkinkan Anda untuk me-*render* *child component* ke dalam bagian *DOM* *tree* yang berbeda.
* [`flushSync`](/reference/react-dom/flushSync) memungkinkan Anda untuk memaksa React untuk segera mengeksekusi pembaruan *state* dan memperbarui *DOM* secara sinkron.

## Resource Preloading APIs {/*resource-preloading-apis*/}

These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) lets you prefetch the IP address of a DNS domain name that you expect to connect to.
* [`preconnect`](/reference/react-dom/preconnect) lets you connect to a server you expect to request resources from, even if you don't know what resources you'll need yet.
* [`preload`](/reference/react-dom/preload) lets you fetch a stylesheet, font, image, or external script that you expect to use.
* [`preloadModule`](/reference/react-dom/preloadModule) lets you fetch an ESM module that you expect to use.
* [`preinit`](/reference/react-dom/preinit) lets you fetch and evaluate an external script or fetch and insert a stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) lets you fetch and evaluate an ESM module.

---

## Titik masuk {/*entry-points*/}

*Package* `react-dom` menyediakan dua titik masuk tambahan:

* [`react-dom/client`](/reference/react-dom/client) berisi API untuk me-*render* komponen React di sisi klien (di dalam peramban).
* [`react-dom/server`](/reference/react-dom/server) berisi API untuk me-*render* komponen React di sisi server.

---

<<<<<<< HEAD
## API Usang {/*deprecated-apis*/}

<Deprecated>

API ini akan dihapus pada versi utama React yang akan datang.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) digunakan untuk mencari elemen *DOM* terdekat yang sesuai dengan instansi *class component*.
* [`hydrate`](/reference/react-dom/hydrate) digunakan untuk menampilkan sebuah struktur *tree* pada *DOM* yang telah dibuat sebelumnya melalui server HTML. Fungsi ini sudah tidak digunakan lagi, dan diganti dengan [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) digunakan untuk memasang sebuah struktur *tree* pada *DOM*. Fungsi ini juga sudah tidak digunakan lagi, dan diganti dengan [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) digunakan untuk melepaskan sebuah struktur pohon *tree* dari *DOM*. Fungsi ini sudah tidak digunakan lagi, dan diganti dengan [`root.unmount()`.](/reference/react-dom/client/createRoot#root-unmount)
=======
## Removed APIs {/*removed-apis*/}

These APIs were removed in React 19:

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): see [alternatives](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): use [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) instead.
* [`render`](https://18.react.dev/reference/react-dom/render): use [`createRoot`](/reference/react-dom/client/createRoot) instead.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): use [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) instead.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
