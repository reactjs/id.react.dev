---
title: Pemasangan
---

<Intro>

React didesain sejak awal untuk dapat diapdopsi secara bertahap. Anda dapat menggunakan React sedikit atau sebanyak apa pun sesuai dengan kebutuhan Anda. Baik jika Anda hanya ingin mencoba React, menambahkan interaktivitas ke halaman HTML, atau mulai mengembangkan aplikasi kompleks berbasis React, bagian ini akan membantu Anda untuk mulai menggunakan React.

</Intro>

## Mencoba React {/*try-react*/}

Anda tidak perlu memasang apa pun untuk mulai menggunakan React. Coba ubah *sandbox* di bawah ini!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Halo, {name}</h1>;
}

export default function App() {
  return <Greeting name="dunia" />
}
```

</Sandpack>

Anda dapat mengubah secara langsung atau membukanya pada tab baru dengan menekan tombol "Fork" pada pojok kanan atas komponen *sandbox*.

Sebagian besar halaman pada dokumentasi React menggunanakan komponen *sandbox* seperti ini.
Di luar dokumentasi React, terdapat banyak *sandbox* daring yang mendukung ekosistem React: misalnya, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), atau [CodePen.](https://codepen.io/pen?template=QWYVwWN)

Untuk mencoba React secara lokal pada komputer Anda, [unduh halaman HTML ini.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Kemudian buka berkas tersebut pada editor kode dan aplikasi perambah Anda!

## Membuat aplikasi React {/*creating-a-react-app*/}

Jika Anda ingin membuat sebuah aplikasi atau situs web dengan React, [mulai buat proyek React.](/learn/creating-a-react-app)

If you want to start a new React app, you can [create a React app](/learn/creating-a-react-app) using a recommended framework.

## Membangun aplikasi React dari nol {/*build-a-react-app-from-scratch*/}

Jika *framework* tidak cocok untuk proyek Anda, anda memilih untuk membangun *framework* sendiri, atau Anda hanya ingin mempelajari dasar-dasar aplikasi React Anda dapat [membangun aplikasi React dari nol](/learn/build-a-react-app-from-scratch).

## Menambahkan React ke proyek yang sudah ada {/*add-react-to-an-existing-project*/}

Jika Anda ingin menggunakan React ke aplikasi atau situs web Anda yang sudah ada, [tambahkan React ke proyek yang sudah ada.](/learn/add-react-to-an-existing-project)


<Note>

#### Apakah saya dapat menggunakan Create React App? {/*should-i-use-create-react-app*/}

Tidak. Create React App sudah tidak lagi dikelola. Untuk info lebih lanjut, baca [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>

## Langkah berikutnya {/*next-steps*/}

Menuju ke panduan [Mulai Cepat](/learn) untuk mengikuti tur mengenai konsep paling penting dari React yang akan Anda temui setiap hari.

