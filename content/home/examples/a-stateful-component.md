---
title: Sebuah Stateful Component
order: 1
domid: timer-example
---

Selain menerima data masukan (yang dapat diakses melalui `this.props`), sebuah komponen dapat memiliki data *state* internal (yang dapat diakses melalui `this.state`). Ketika data *state* pada sebuah komponen berubah, *markup* yang di-*render* oleh komponen tersebut juga akan diperbarui dengan memanggil kembali `render()`.
