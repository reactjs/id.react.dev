---
id: faq-structure
title: Struktur File
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### Apakah ada cara yang disarankan dalam menyusun proyek React? {#is-there-a-recommended-way-to-structure-react-projects}

React tidak memiliki pendapat tentang bagaimana Anda memasukkan file ke folder. Namun, ada beberapa pendekatan umum pada ekosistem yang cukup populer yang mungkin ingin Anda pertimbangkan.

#### Pengelompokan berdasarkan fitur atau rute {#grouping-by-features-or-routes}

<<<<<<< HEAD
Salah satu cara umum untuk menyusun proyek adalah dengan menempatkan CSS, JS, dan tes bersama di dalam folder yang dikelompokkan berdasarkan fitur atau rute.
=======
One common way to structure projects is to locate CSS, JS, and tests together inside folders grouped by feature or route.
>>>>>>> d16f1ee7958b5f80ef790265ba1b8711d4f228d6

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

Definisi "fitur" tidak universal, dan terserah Anda dalam memilih rincian. Jika Anda tidak dapat membuat daftar *top-level* folder, Anda dapat bertanya kepada pengguna produk Anda apa bagian utama dari daftar tersebut, dan menggunakan *mental model*  mereka sebagai *blueprint*.

#### Pengelompokan berdasarkan jenis file {#grouping-by-file-type}

Cara populer lainnya untuk menyusun proyek adalah dengan mengelompokkan *file-file* yang sama, misalnya:

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

Beberapa orang juga lebih suka melangkah lebih jauh, dan memisahkan komponen ke dalam folder yang berbeda tergantung pada peran mereka dalam aplikasi. Misalnya, [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) adalah metodologi desain yang dibangun berdasarkan prinsip ini. Ingatlah bahwa biasanya akan lebih produktif untuk menggunakan metodologi seperti ini sebagai contoh yang bermanfaat daripada mengikuti aturan ketat.

#### Hindari terlalu banyak nesting {#avoid-too-much-nesting}

Ada banyak *pain points* terkait dengan *nesting* direktori yang dalam pada proyek JavaScript. Itu akan menjadi lebih sulit saat menulis impor relatif di antara mereka, atau memperbarui impor tersebut ketika file dipindahkan. Kecuali jika Anda memiliki alasan yang sangat kuat untuk menggunakan struktur folder yang dalam, pertimbangkan untuk membatasi diri hingga maksimum tiga atau empat *nesting* folder dalam satu proyek. Tentu saja, ini hanya rekomendasi, dan mungkin tidak relevan dengan proyek Anda.

#### Jangan terlalu memikirkannya {#dont-overthink-it}

Jika Anda baru memulai sebuah proyek, [jangan menghabiskan lebih dari lima menit](https://en.wikipedia.org/wiki/Analysis_paralysis) untuk memilih struktur file. Pilih salah satu pendekatan di atas (atau muncul dengan pendekatan Anda sendiri) dan mulailah menulis kode! Anda tetap ingin memikirkannya kembali setelah Anda menulis beberapa kode secara *real*.

Jika Anda merasa benar-benar *stuck*, mulailah dengan menyimpan semua file dalam satu folder. Pada akhirnya itu akan tumbuh cukup besar sehingga Anda ingin memisahkan beberapa file dari yang lain. Pada saat itu Anda akan memiliki cukup pengetahuan untuk mengetahui file mana yang paling sering Anda ubah bersama. Secara umum, sebaiknya menyimpan file yang sering berganti secara berdekatan satu sama lain. Prinsip ini disebut "colocation".

Ketika proyek tumbuh lebih besar, mereka sering menggunakan campuran dari kedua pendekatan di atas dalam praktiknya. Jadi memilih yang "benar" pada awalnya tidak terlalu penting.
