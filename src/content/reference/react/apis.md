---
title: "API bawaan React"
---

<Intro>

Selain [Hooks](/reference/react) dan [Components](/reference/react/components), pustaka `react` mengekspor beberapa API lain yang berguna untuk mendefinisikan komponen. Halaman ini mencantumkan semua API React modern yang tersisa.

</Intro>

---

* [`createContext`](/reference/react/createContext) memungkinkan Anda untuk mendefinisikan dan memberikan konteks komponen turunan. Digunakan dengan [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) memungkinkan Anda menunda pemuatan kode komponen sampai kode tersebut di-*render* untuk pertama kalinya.
* [`memo`](/reference/react/memo) memungkinkan komponen Anda melewatkan render ulang dengan *props* yang sama. Digunakan dengan [`useMemo`](/reference/react/useMemo) dan [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) memungkinkan Anda menandai pembaruan *state* sebagai tidak urgen. Mirip dengan [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) memungkinkan Anda membungkus *render* dan interaksi dalam pengujian untuk memastikan pembaruan telah diproses sebelum membuat pernyataan.

---

## Resource APIs {/*resource-apis*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

To read a value from a resource, use this API:

* [`use`](/reference/react/use) lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
