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

## API Dihapus {/*removed-apis*/}

API ini telah dihapus di React 19:

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): lihat [alternatif](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): gunakan [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](https://18.react.dev/reference/react-dom/render): gunakan [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): gunakan [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): gunakan API [`react-dom/server`](/reference/react-dom/server).
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): gunakan API [`react-dom/server`](/reference/react-dom/server).
