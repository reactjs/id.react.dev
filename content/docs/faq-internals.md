---
id: faq-internals
title: Virtual DOM and Internals
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### Apa itu Virtual DOM? {#what-is-the-virtual-dom}

*Virtual DOM* (VDOM) adalah sebuah konsep dalam pemrograman di mana representasi ideal atau "virtual" dari antarmuka pengguna disimpan dalam memori dan disinkronkan dengan *DOM* "yang sebenarnya" oleh *library* seperti ReactDOM. Proses ini disebut [*reconciliation*](/docs/reconciliation.html).

Pendekatan ini memungkinkan *API* deklaratif React: Anda cukup memberi tahu React *state* apa yang anda inginkan untuk antarmuka pengguna, dan React akan memastikan *DOM* sesuai dengan *state* yang anda inginkan. Hal ini menciptakan abstraksi yang memudahkan manipulasi atribut, *event handling*, dan pembaruan *DOM* yang seharusnya anda lakukan secara manual untuk membangun aplikasi anda.

Karena "*virtual DOM*" lebih merupakan pola daripada sebuah teknologi, kadang orang mengatakan itu berarti hal yang berbeda. Di dunia React, istilah "*virtual DOM*" biasanya dikaitkan dengan [elemen React](/docs/rendering-elements.html) karena mereka adalah objek yang mewakili antarmuka pengguna. React juga menggunakan objek internal yang disebut "*fibers*" untuk menyimpan informasi tambahan tentang *component tree*. Mereka juga dapat dianggap sebagai bagian dari implementasi "*virtual DOM*" di React.

### Apakah *Shadow DOM* sama dengan *Virtual DOM*? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

Tidak, mereka berbeda. *Shadow DOM* adalah teknologi peramban web yang dirancang untuk *scoping variables* dan CSS pada *web components*. *Virtual DOM* adalah konsep yang diimplementasikan oleh *library* JavaScript diatas *API* peramban web.

### Apa itu "*React Fiber*"? {#what-is-react-fiber}

*Fiber* adalah *reconciliation engine* baru pada React 16. Tujuan utamanya ialah memungkinkan *incremental rendering* untuk *virtual DOM*. [Baca lebih lanjut](https://github.com/acdlite/react-fiber-architecture).
