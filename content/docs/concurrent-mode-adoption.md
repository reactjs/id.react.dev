---
id: concurrent-mode-adoption
title: Menggunakan Concurrent Mode (Experimental)
permalink: docs/concurrent-mode-adoption.html
prev: concurrent-mode-patterns.html
next: concurrent-mode-reference.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Perhatian:
>
>Laman ini menjelaskan **fitur eksperimental yang [belum tersedia](/docs/concurrent-mode-adoption.html) dalam versi rilis yang stabil**. Jangan mengandalkan _build_ eksperimental dalam aplikasi React versi produksi. Fitur ini dapat berubah secara signifikan dan tanpa peringatan sebelum menjadi bagian dari React.
>
>Dokumentasi ini ditujukan untuk pengguna awal dan orang-orang yang penasaran. **Kalau anda baru menggunakan React, jangan khawatir tentang fitur ini** -- anda tidak perlu mempelajarinya sekarang.

</div>

- [Instalasi](#installation)
  - [Untuk Siapakah Rilis Eksperimental Ini?](#who-is-this-experimental-release-for)
  - [Enabling Concurrent Mode](#enabling-concurrent-mode)
- [What to Expect](#what-to-expect)
  - [Migration Step: Blocking Mode](#migration-step-blocking-mode)
  - [Why So Many Modes?](#why-so-many-modes)
  - [Feature Comparison](#feature-comparison)

## Instalasi {#installation}

Mode Concurrent hanya tersedia di dalam [build eksperimental](/blog/2019/10/22/react-release-channels.html#experimental-channel) React. Untuk instalasi, jalankan:

```
npm install react@experimental react-dom@experimental
```

**Tidak ada jaminan versi semantik untuk build eksperimental.**  
API dapat ditambahkan, diubah, atau dihapus di dalam rilis `@experimental`.

**Rilis eksperimental memungkinkan adanya banyak perubahan signifikan.**

Anda dapat mencoba build ini untuk projek personal atau di dalam branch, tetapi
kami tidak merekomendasikan build ini untuk mode produksi. Di Facebook, kami *menggunakan*
build ini di mode produksi, tapi karena kami juga ada untuk membetulkan *bug*
ketika ada suatu masalah. Anda telah diperingatkan!

### Untuk Siapakah Rilis Eksperimental Ini? {#who-is-this-experimental-release-for}

Rilis ini diperuntukkan bagi pengguna awal, pencipta library, dan orang yang
penasaran.

Kami menggunakan kode ini di dalam mode produksi (dan itu bekerja untuk kami)
tetapi masih terdapat beberapa *bug*, fitur yang hilang, dan dokumentasi yang belum
lengkap. Kami ingin mendengar lebih tentang apa yang tidak bekerja di dalam Mode
Concurrent sehingga kami dapat mempersiapkan rilis resmi dan stabil kedepannya.

### Enabling Concurrent Mode {#enabling-concurrent-mode}

Normally, when we add features to React, you can start using them immediately. Fragments, Context, and even Hooks are examples of such features. You can use them in new code without making any changes to the existing code.

Concurrent Mode is different. It introduces semantic changes to how React works. Otherwise, the [new features](/docs/concurrent-mode-patterns.html) enabled by it *wouldn't be possible*. This is why they're grouped into a new "mode" rather than released one by one in isolation.

You can't opt into Concurrent Mode on a per-subtree basis. Instead, to opt in, you have to do it in the place where today you call `ReactDOM.render()`.

**This will enable Concurrent Mode for the whole `<App />` tree:**

```js
import ReactDOM from 'react-dom';

// If you previously had:
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// You can opt into Concurrent Mode by writing:

ReactDOM.unstable_createRoot(
  document.getElementById('root')
).render(<App />);
```

>Note:
>
>Concurrent Mode APIs such as `createRoot` only exist in the experimental builds of React.

In Concurrent Mode, the lifecycle methods [previously marked](/blog/2018/03/27/update-on-async-rendering.html) as "unsafe" actually *are* unsafe, and lead to bugs even more than in today's React. We don't recommend trying Concurrent Mode until your app is [Strict Mode](/docs/strict-mode.html)-compatible.

## What to Expect {#what-to-expect}

If you have a large existing app, or if your app depends on a lot of third-party packages, please don't expect that you can use the Concurrent Mode immediately. **For example, at Facebook we are using Concurrent Mode for the new website, but we're not planning to enable it on the old website.** This is because our old website still uses unsafe lifecycle methods in the product code, incompatible third-party libraries, and patterns that don't work well with the Concurrent Mode.

In our experience, code that uses idiomatic React patterns and doesn't rely on external state management solutions is the easiest to get running in the Concurrent Mode. We will describe common problems we've seen and the solutions to them separately in the coming weeks.

### Migration Step: Blocking Mode {#migration-step-blocking-mode}

For older codebases, Concurrent Mode might be a step too far. This is why we also provide a new "Blocking Mode" in the experimental React builds. You can try it by substituting `createRoot` with `createBlockingRoot`. It only offers a *small subset* of the Concurrent Mode features, but it is closer to how React works today and can serve as a migration step.

To recap:

* **Legacy Mode:** `ReactDOM.render(<App />, rootNode)`. This is what React apps use today. There are no plans to remove the legacy mode in the observable future — but it won't be able to support these new features.
* **Blocking Mode:** `ReactDOM.createBlockingRoot(rootNode).render(<App />)`. It is currently experimental. It is intended as a first migration step for apps that want to get a subset of Concurrent Mode features.
* **Concurrent Mode:** `ReactDOM.createRoot(rootNode).render(<App />)`. It is currently experimental. In the future, after it stabilizes, we intend to make it the default React mode. This mode enables *all* the new features.

### Why So Many Modes? {#why-so-many-modes}

We think it is better to offer a [gradual migration strategy](/docs/faq-versioning.html#commitment-to-stability) than to make huge breaking changes — or to let React stagnate into irrelevance.

In practice, we expect that most apps using Legacy Mode today should be able to migrate at least to the Blocking Mode (if not Concurrent Mode). This fragmentation can be annoying for libraries that aim to support all Modes in the short term. However, gradually moving the ecosystem away from the Legacy Mode will also *solve* problems that affect major libraries in the React ecosystem, such as [confusing Suspense behavior when reading layout](https://github.com/facebook/react/issues/14536) and [lack of consistent batching guarantees](https://github.com/facebook/react/issues/15080). There's a number of bugs that can't be fixed in Legacy Mode without changing semantics, but don't exist in Blocking and Concurrent Modes.

You can think of the Blocking Mode as a "gracefully degraded" version of the Concurrent Mode. **As a result, in longer term we should be able to converge and stop thinking about different Modes altogether.** But for now, Modes are an important migration strategy. They let everyone decide when a migration is worth it, and upgrade at their own pace.

### Feature Comparison {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|   |Legacy Mode  |Blocking Mode  |Concurrent Mode  |
|---  |---  |---  |---  |
|[String Refs](/docs/refs-and-the-dom.html#legacy-api-string-refs)  |✅  |🚫**  |🚫**  |
|[Legacy Context](/docs/legacy-context.html) |✅  |🚫**  |🚫**  |
|[findDOMNode](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)  |✅  |🚫**  |🚫**  |
|[Suspense](/docs/concurrent-mode-suspense.html#what-is-suspense-exactly) |✅  |✅  |✅  |
|[SuspenseList](/docs/concurrent-mode-patterns.html#suspenselist) |🚫  |✅  |✅  |
|Suspense SSR + Hydration |🚫  |✅  |✅  |
|Progressive Hydration  |🚫  |✅  |✅  |
|Selective Hydration  |🚫  |🚫  |✅  |
|Cooperative Multitasking |🚫  |🚫  |✅  |
|Automatic batching of multiple setStates     |🚫* |✅  |✅  |
|[Priority-based Rendering](/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) |🚫  |🚫  |✅  |
|[Interruptible Prerendering](/docs/concurrent-mode-intro.html#interruptible-rendering) |🚫  |🚫  |✅  |
|[useTransition](/docs/concurrent-mode-patterns.html#transitions)  |🚫  |🚫  |✅  |
|[useDeferredValue](/docs/concurrent-mode-patterns.html#deferring-a-value) |🚫  |🚫  |✅  |
|[Suspense Reveal "Train"](/docs/concurrent-mode-patterns.html#suspense-reveal-train)  |🚫  |🚫  |✅  |

</div>

\*: Legacy mode has automatic batching in React-managed events but it's limited to one browser task. Non-React events must opt-in using `unstable_batchedUpdates`. In Blocking Mode and Concurrent Mode, all `setState`s are batched by default.

\*\*: Warns in development.
