---
title: "API bawaan React"
---

<Intro>

<<<<<<< HEAD
Selain [Hooks](/reference/react) dan [Components](/reference/react/components), pustaka `react` mengekspor beberapa API lain yang berguna untuk mendefinisikan komponen. Halaman ini mencantumkan semua API React modern yang tersisa.
=======
In addition to [Hooks](/reference/react/hooks) and [Components](/reference/react/components), the `react` package exports a few other APIs that are useful for defining components. This page lists all the remaining modern React APIs.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

</Intro>

---

<<<<<<< HEAD
* [`createContext`](/reference/react/createContext) memungkinkan Anda untuk mendefinisikan dan memberikan konteks komponen turunan. Digunakan dengan [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) memungkinkan Anda menunda pemuatan kode komponen sampai kode tersebut di-*render* untuk pertama kalinya.
* [`memo`](/reference/react/memo) memungkinkan komponen Anda melewatkan render ulang dengan *props* yang sama. Digunakan dengan [`useMemo`](/reference/react/useMemo) dan [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) memungkinkan Anda menandai pembaruan *state* sebagai tidak urgen. Mirip dengan [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) memungkinkan Anda membungkus *render* dan interaksi dalam pengujian untuk memastikan pembaruan telah diproses sebelum membuat pernyataan.
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.
* [`cache`](/reference/react/cache) lets you cache the result of a data fetch or computation.
* [`cacheSignal`](/reference/react/cacheSignal) lets you know when the `cache()` lifetime is over.
* [`captureOwnerStack`](/reference/react/captureOwnerStack) reads the current Owner Stack in development and returns it as a string if available.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

---

## Resource APIs {/*resource-apis*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

You can pass these types of resources to [`use`](/reference/react/use):

* A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to read its resolved value.
* A [context](/learn/passing-data-deeply-with-context) to read its value.
* <CanaryBadge /> The value returned by [`browser`](/reference/react-dom/browser) to mark a component as browser-only during server rendering.

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```
