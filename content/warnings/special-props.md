---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---

Kebanyakan _props_ pada elemen JSX diteruskan ke komponen, namun, ada dua _props_ khusus (`ref` dan `key`) yang mana digunakan oleh React dan tidak diterusakan ke komponen.

Contohnya, mencoba mengakses `this.props.key` dari komponen (seperti fungsi _render_ atau [propTypes](/docs/typechecking-with-proptypes.html#proptypes)) tidak didefinisikan. Jika Anda butuh untuk mengakses nilai yang sama antara komponen turunan, Anda harus meneruskannya sebagai _prop_ yang berbeda (seperti `<ListItemWrapper key={result.id} id={result.id} />`). Meskipun terlihat mubazir, penting untuk memisahkan logika aplikasi dari petunjuk rekonsiliasi.
