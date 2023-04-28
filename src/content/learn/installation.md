---
title: Pemasangan
---

<Intro>

React didesain sejak awal untuk dapat diapdopsi secara bertahap. Anda dapat menggunakan React sedikit atau sebanyak apapun sesuai dengan kebutuhan Anda. Baik jika Anda hanya ingin mencoba React, menambahkan interaktivitas ke halaman HTML, atau mulai mengembangkan aplikasi kompleks berbasis React, bagian ini akan membantu Anda untuk mulai menggunakan React.

</Intro>

<YouWillLearn isChapter={true}>

* [Bagaimana cara untuk mulai membuat proyek React baru](/learn/start-a-new-react-project)
* [Bagaimana cara untuk menambahkan React ke dalam proyek yang ada](/learn/add-react-to-an-existing-project)
* [Bagaimana cara untuk mempersiapkan editor kode Anda](/learn/editor-setup)
* [Bagaimana cara memasang React Developer Tools](/learn/react-developer-tools)

</YouWillLearn>

## Mencoba React {/*try-react*/}

Anda tidak perlu memasang apapun untuk mulai menggunakan React. Coba ubah *sandbox* di bawah ini!

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
Di luar dokumentasi React, terdapat banyak *sandbox* daring yang mendukung ekosistem React: contohnya seperti, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), or [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### Mencoba React di ekosistem lokal {/*try-react-locally*/}

Untuk mencoba React secara lokal pada komputer Anda, [unduh halaman HTML ini.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Kemudian buka berkas tersebut pada editor kode dan aplikasi perambah Anda!

## Mulai membuat proyek React {/*start-a-new-react-project*/}

Jika Anda ingin membuat sebuah aplikasi atau situs web dengan React, [mulai buat proyek React.](/learn/start-a-new-react-project)

## Menambahkan React ke proyek yang sudah ada {/*add-react-to-an-existing-project*/}

Jika Anda ingin menggunakan React ke aplikasi atau situs web Anda yang sudah ada, [tambahkan React ke proyek yang sudah ada.](/learn/add-react-to-an-existing-project)

## Langkah berikutnya {/*next-steps*/}

Menuju ke panduan [Mulai Cepat](/learn) untuk mengikuti tur mengenai konsep paling penting dari React yang akan Anda temui setiap hari.

