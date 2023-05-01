---
title: "API bawaan React"
---

<Intro>

Selain [Hooks](/reference/react) dan [Components](/reference/react/components), pustaka `react` mengekspor beberapa API lain yang berguna untuk mendefinisikan komponen. Halaman ini mencantumkan semua API React modern yang tersisa.

</Intro>

---

* [`createContext`](/reference/react/createContext) memungkinkan Anda untuk mendefinisikan dan memberikan konteks komponen turunan. Digunakan dengan [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) memungkinkan Anda mengekspos sebuah *DOM node* sebagai sebuah *ref* kepada *parent*. Digunakan dengan [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) memungkinkan Anda menunda pemuatan kode komponen sampai kode tersebut di-*render* untuk pertama kalinya.
* [`memo`](/reference/react/memo) memungkinkan komponen Anda melewatkan render ulang dengan *props* yang sama. Digunakan dengan [`useMemo`](/reference/react/useMemo) dan [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) memungkinkan Anda menandai pembaruan *state* sebagai tidak urgen. Mirip dengan [`useTransition`.](/reference/react/useTransition)
