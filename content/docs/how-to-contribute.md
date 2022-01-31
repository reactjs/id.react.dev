---
id: how-to-contribute
title: Cara Berkontribusi
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---

React adalah salah satu proyek sumber terbuka pertama milik Facebook yang berada dalam pengembangan yang sangat aktif sekaligus digunakan untuk mengirimkan kode pada semua orang di [facebook.com](https://www.facebook.com). Kami masih berusaha memperbaiki kekusutan yang ada untuk membuat proses kontribusi semudah dan setransparan mungkin, tapi kami belum sampai di sana. Semoga dokumen ini membuat proses berkontribusi menjadi jelas dan menjawab beberapa pertanyaan yang mungkin Anda miliki.

<<<<<<< HEAD
### [Kode Etik](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md) {#code-of-conduct}

Facebook telah mengadopsi [Persetujuan Kontributor](https://www.contributor-covenant.org/) sebagai Kode Etiknya, dan kami berharap peserta proyek mengikutinya. Dimohon untuk membaca [keseluruhannya](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md) agar Anda dapat memahami tindakan apa yang akan dan tidak akan ditoleransi.
=======
### [Code of Conduct](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md) {#code-of-conduct}

Facebook has adopted the [Contributor Covenant](https://www.contributor-covenant.org/) as its Code of Conduct, and we expect project participants to adhere to it. Please read [the full text](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

### Pengembangan Terbuka {#open-development}

Semua pengembangan pada React terjadi secara langsung pada [GitHub](https://github.com/facebook/react). Baik anggota tim inti dan kontributor eksternal mengirimkan _pull request_ yang akan melewati proses peninjauan yang sama.

### Versi Semantik {#semantic-versioning}

React mengikuti [versi semantik](https://semver.org/). Kami merilis versi _patch_ untuk perbaikan bug kritikal, versi minor untuk fitur baru atau perubahan yang tidak esensial, dan versi mayor untuk perubahan yang merusak. Ketika kami membuat perubahan yang merusak, kami juga memperkenalkan peringatan _deprecation_ pada versi minor sehingga pengguna kami mengetahui perubahan yang akan datang dan melakukan migrasi pada kode mereka terlebih dahilu. Pelajari lebih lanjut mengenai komitmen kami terhadap stabilitas dan migrasi inkremental di [kebijakan versi kami](/docs/faq-versioning.html).

<<<<<<< HEAD
Setiap perubahan signifikan didokumentasikan pada [_file changelog_](https://github.com/facebook/react/blob/master/CHANGELOG.md).
=======
Every significant change is documented in the [changelog file](https://github.com/facebook/react/blob/main/CHANGELOG.md).
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

### Pengaturan Cabang {#branch-organization}

<<<<<<< HEAD
Ajukan semua perubahan secara langsung pada [`cabang master`](https://github.com/facebook/react/tree/master). Kami tidak menggunakan cabang terpisah untuk pengembangan atau rilis yang akan datang. Kami mengupayakan yang terbaik untuk menjaga `master` dalam kondisi yang baik, dengan lulus semua tes yang ada.

Kode yang tiba di `master` harus kompatibel dengan rilis terakhir yang stabil. Kode tersebut boleh berisi fitur tambahan, tapi tidak boleh ada perubahan yang merusak. Kita harus bisa merilis versi minor yang baru dari  `master` setiap saat.
=======
Submit all changes directly to the [`main branch`](https://github.com/facebook/react/tree/main). We don't use separate branches for development or for upcoming releases. We do our best to keep `main` in good shape, with all tests passing.

Code that lands in `main` must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of `main` at any time.
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

### _Flag_ Fitur {#feature-flags}

<<<<<<< HEAD
Untuk menjaga cabang `master` pada keadaan dapat dirilis, perubahan yang merusak dan fitur eksperimental harus dipagari di balik _flag_ fitur.

_Flag_ fitur didefinisikan pada [`packages/shared/ReactFeatureFlags.js`](https://github.com/facebook/react/blob/master/packages/shared/ReactFeatureFlags.js). Beberapa _build_ dari React mungkin menmerapkan kumpulan _flag_ fitur yang berbeda; misalnya, _build_ React Native dikonfigurasi secara berbeda dari React DOM. _Flag_ ini dapat ditemukan di [`packages/shared/forks`](https://github.com/facebook/react/tree/master/packages/shared/forks). _Flag_ fitur diberi tipe secara statis oleh Flow, sehingga Anda dapat menjalankan `yarn flow` untuk memastikan bahwa Anda telah membarui semua _file_ yang dibutuhkan.
=======
To keep the `main` branch in a releasable state, breaking changes and experimental features must be gated behind a feature flag.

Feature flags are defined in [`packages/shared/ReactFeatureFlags.js`](https://github.com/facebook/react/blob/main/packages/shared/ReactFeatureFlags.js). Some builds of React may enable different sets of feature flags; for example, the React Native build may be configured differently than React DOM. These flags are found in [`packages/shared/forks`](https://github.com/facebook/react/tree/main/packages/shared/forks). Feature flags are statically typed by Flow, so you can run `yarn flow` to confirm that you've updated all the necessary files.
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

Sistem _build_ React akan menanggalkan cabang fitur yang dinonaktifkan sebelum diterbitkan. Sebuah tugas integrasi berkelanjutan _(continuous integration)_ berjalan pada setiap _commit_ untuk memeriksa perubahan ukuran bundel. Anda dapat menggunakan perubahan pada ukuran sebagai tanda bahwa sebuah fitur telah dipagari dengan baik.

### _Bug_ {#bugs}

#### Mencari Isu yang Diketahui {#where-to-find-known-issues}

Kami menggunakan [GitHub Issues](https://github.com/facebook/react/issues) untuk _bug_ publik. Kami sangat memperhatikan hal ini dan berusaha menjelaskan ketika kami sedang melakukan perbaikan secara internal. Sebelum mengajukan isu baru, coba pastikan bahwa masalahmu belum pernah ada sebelumnya.

#### Reporting New Issues {#reporting-new-issues}

Cara terbaik untuk memperbaiki _bug_ Anda adalah dengan menyediakan contoh kasus yang spesifik. [Templat JSFiddle](https://jsfiddle.net/Luktwrdm/) ini adalah titik mulai yang baik.

#### _Bug_ Keamanan {#security-bugs}

Facebook memiliki [program berhadiah](https://www.facebook.com/whitehat/) untuk melaporkan _bug_ keamanan secara rahasia. Dengan pertimbangan itu, dimohon untuk tidak mengajukan isu publik; harap melewati proses yang telah dijelaskan pada laman tersebut.

### Bagaimana Cara Berhubungan {#how-to-get-in-touch}

* IRC: [#reactjs pada freenode](https://webchat.freenode.net/?channels=reactjs)
* [Forum diskusi](/community/support.html#popular-discussion-forums)

Terdapat pula [komunitas aktif pengguna React pada platform komunikasi Discord](https://www.reactiflux.com/) jika Anda membutuhkan bantuan mengenai React.

### Mengajukan Perubahan {#proposing-a-change}

Jika Anda berniat untuk mengubah API publik, atau mengajukan perubahan signifikan pada implementasinya, kami merekomendasikan Anda untuk [mengajukan isu](https://github.com/facebook/react/issues/new). Ini memungkinkan kami untuk mencapai kesepakatan pada proposal Anda sebelum Anda mengerahkan usaha yang signifikan pada hal tersebut.

Jika Anda hanya memperbaiki sebuah _bug_, tidak masalah untuk langsung mengirimkan _pull request_, tetapi kami masih merekomendasikan untuk mengajukan isu yang menjelaskan apa yang Anda perbaiki. Ini sangat membantu apabila kami tidak menerima perbaikan itu secara spesifik, tetapi tetap ingin untuk memantau isu tersebut.

### _Pull Request_ Pertama Anda {#your-first-pull-request}

Sedang mengerjakan _Pull Request_ pertama Anda? Anda dapat belajar bagaimana caranya dari seri video gratis ini:

<<<<<<< HEAD
**[Bagaimana Cara Berkontribusi pada Proyek Sumber Terbuka di GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**
=======
**[How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)**
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

Untuk membantu Anda mengumpulkan pengalaman dan lebih familiar dengan proses kontribusi kami, kami memiliki daftar **[isu pertama yang baik](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** berisi _bug_ yang memiliki cakupan yang relatif terbatas. Ini adalah tempat yang baik untuk mulai.

Jika Anda memutuskan untuk memperbaiki sebuah isu, pastikan Anda memeriksa utas komentar apabila seseorang sudah sedang mengerjakan perbaikannya. Jika tidak ada yang sedang mengerjakannya pada saat itu, tinggalkan komentar yang menyatakan bahwa Anda bermaksud untuk memperbaikinya, sehingga orang lain tidak mengerjakan hal yang sama.

Jika seseorang mengambil sebuah isu, tetapi tidak dilanjutkan selama lebih dari 2 minggu, tidak apa-apa untuk mengambil alih isu tersebut, tapi Anda tetap sebaiknya meninggalkan komentar.

### Mengirimkan _Pull Request_ {#sending-a-pull-request}

Tim inti sedang memantau _pull request_. Kami akan meninjau _pull request_ Anda dan antara melakukan _merge_, meminta perubahan, atau menutupnya dengan penjelasan. Untuk perubahan API kami mungkin perlu memperbaiki pemakaian kami secara internal di Facebook.com, sehingga mungkin mengakibatkan penundaan. Kami akan berusaha sebaik mungkin untuk memberikan informasi terbaru dan umpan balik selama berlangsungnya proses.

**Sebelum mengajukan _pull request_**, pastikan hal berikut telah diselesaikan:

<<<<<<< HEAD
1. Fork [repositori](https://github.com/facebook/react) dan buat branch Anda dari `master`.
2. Jalankan `yarn` pada induk repositori.
3. Jika Anda telah memperbaiki _bug_ atau menambahkan kode yang perlu dites, tambahkan tes!
4. Pastikan rangkaian tes berhasil (`yarn test`). Tip: `yarn test --watch TestName` sangat membantu dalam pengembangan.
5. Jalankan `yarn test-prod` untuk mengetes pada lingkungan produksi. Ia mendukung opsi yang sama seperti `yarn test`.
6. Jika Anda membutuhkan _debugger_, jalankan `yarn debug-test --watch TestName`, buka `chrome://inspect`, dan tekan "Inspect".
7. Format kode Anda dengan [prettier](https://github.com/prettier/prettier) (`yarn prettier`).
8. Pastikan kode Anda di-_lint_ (`yarn lint`). Tip: `yarn linc` untuk mengecek hanya _file_ yang berubah.
9. Jalankan [Flow](https://flowtype.org/) untuk mengecek tipe (`yarn flow`).
10. Jika belum, lengkapi CLA.
=======
1. Fork [the repository](https://github.com/facebook/react) and create your branch from `main`.
2. Run `yarn` in the repository root.
3. If you've fixed a bug or added code that should be tested, add tests!
4. Ensure the test suite passes (`yarn test`). Tip: `yarn test --watch TestName` is helpful in development.
5. Run `yarn test --prod` to test in the production environment.
6. If you need a debugger, run `yarn debug-test --watch TestName`, open `chrome://inspect`, and press "Inspect".
7. Format your code with [prettier](https://github.com/prettier/prettier) (`yarn prettier`).
8. Make sure your code lints (`yarn lint`). Tip: `yarn linc` to only check changed files.
9. Run the [Flow](https://flowtype.org/) typechecks (`yarn flow`).
10. If you haven't already, complete the CLA.
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

### Perjanjian Lisensi Kontributor (CLA) {#contributor-license-agreement-cla}

Anda perlu melengkapi CLA agar kami dapat menyetujui _pull request_ Anda. Anda hanya perlu melakukan proses ini sekali. Jika Anda pernah melakukan hal ini untuk proyek sumber terbuka Facebook yang lain, Anda tidak perlu melakukannya lagi. Jika ini adalah pertama kalinya Anda mengirimkan _pull request_, beri tahu kami bahwa Anda telah melengkapi CLA Anda, dan kami akan memeriksa kembali dengan nama pengguna GitHub Anda.

**[Lengkapi CLA Anda di sini.](https://code.facebook.com/cla)**

### Prasyarat Kontribusi {#contribution-prerequisites}

* Anda telah memasang [Node](https://nodejs.org) pada v8.0.0+ dan Yarn](https://yarnpkg.com/en/) pada v1.2.0+.
* Anda telah memasang [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html).
* Anda telah memasang `gcc` atau dapat memasang _compiler_ jika dibutuhkan. Beberapa _dependency_ dapat membutuhkan tahapan kompilasi. Pada OS X, _Command Line Tools_ Xcode saja cukup. Pada Ubuntu, `apt-get install build-essential` akan memasang _package_ yang dibutuhkan. Perintah sejenis seharusnya dapat bekerja pada distro Linux lainnya. Windows akan membutuhkan beberapa langkah tambahan, lihat [instruksi pemasangan `node-gyp`](https://github.com/nodejs/node-gyp#installation) untuk informasi lebih lengkap.
* Anda familiar dengan Git.

### Alur Kerja Pengembangan {#development-workflow}

Setelah melakukan kloning React, jalankan `yarn` untuk mengambil _dependencies_-nya.
Kemudian, Anda dapat menjalankan beberapa perintah:

<<<<<<< HEAD
* `yarn lint` memeriksa _style_ kode.
* `yarn linc` seperti `yarn lint` tetapi lebih cepat karena ia hanya memeriksa _file_ yang berubah pada cabang Anda.
* `yarn test` menjalankan seluruh rangkaian tes.
* `yarn test --watch` menjalankan pemantau tes yang interaktif.
* `yarn test <pattern>` menjalankan tes dengan nama _file_ yang sama.
* `yarn test-prod` menjalankan tes pada lingkungan produksi. Ia mendukung semua opsi yang sama seperti `yarn test`.
* `yarn debug-test` sama seperti `yarn test` tetapi dengan _debugger_. Buka `chrome://inspect` dan tekan "Inspect".
* `yarn flow` menjalankan [Flow](https://flowtype.org/) untuk mengecek tipe.
* `yarn build` membuat sebuah folder `build` dengan semua _package_.
* `yarn build react/index,react-dom/index --type=UMD` membuat _build_ UMD yang terdiri hanya dari React dan ReactDOM.

Kami merekomendasikan menjalankan `yarn test` (atau variasi lainnya di atas) untuk memastikan Anda tidak menyebabkan regresi apapun selama Anda mengerjakan perubahan. Namun akan bermanfaat untuk mencoba _build_ React Anda pada proyek sesungguhnya.
=======
* `yarn lint` checks the code style.
* `yarn linc` is like `yarn lint` but faster because it only checks files that differ in your branch.
* `yarn test` runs the complete test suite.
* `yarn test --watch` runs an interactive test watcher.
* `yarn test --prod` runs tests in the production environment.
* `yarn test <pattern>` runs tests with matching filenames.
* `yarn debug-test` is just like `yarn test` but with a debugger. Open `chrome://inspect` and press "Inspect".
* `yarn flow` runs the [Flow](https://flowtype.org/) typechecks.
* `yarn build` creates a `build` folder with all the packages.
* `yarn build react/index,react-dom/index --type=UMD` creates UMD builds of just React and ReactDOM.

We recommend running `yarn test` (or its variations above) to make sure you don't introduce any regressions as you work on your change. However, it can be handy to try your build of React in a real project.
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

Pertama jalankan `yarn build`. Perintah ini akan menghasilkan bundel-bundel yang telah dibuat di folder `build`, serta mempersiapkan _package_ npm dalam `build/packages`.

Cara termudah untuk mencoba perubahan Anda adalah dengan menjalankan `yarn build react/index,react-dom/index --type=UMD` kemudian membuka `fixtures/packaging/babel-standalone/dev.html`. _File_ ini telah menggunakan `react.development.js` dari folder `build` sehingga ia akan menangkap perubahan Anda.

<<<<<<< HEAD
Jika Anda ingin mencoba perubahan Anda pada proyek React yang sudah ada, Anda bisa menyalin `build/dist/react.development.js`, `build/dist/react-dom.development.js`, atau produk _build_ lainnya ke dalam aplikasi Anda dan menggunakan mereka daripada versi stabilnya.
=======
If you want to try your changes in your existing React project, you may copy `build/node_modules/react/umd/react.development.js`, `build/node_modules/react-dom/umd/react-dom.development.js`, or any other build products into your app and use them instead of the stable version. 
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

Jika proyek Anda menggunakan React dari npm, Anda dapat menghapus `react` dan `react-dom` pada _dependencies_-nya dan menggunakan `yarn link` untuk mengarahkan mereka pada folder _build_ lokal Anda:

```sh
cd ~/path_to_your_react_clone/
yarn build react/index,react/jsx,react-dom/index,scheduler --type=NODE

cd build/node_modules/react
yarn link
cd build/node_modules/react-dom
yarn link

cd ~/path/to/your/project
yarn link react react-dom
```

Setiap kali Anda menjalankan `yarn build` pada folder React, versi terbaru akan muncul pada `node_modules` di proyek Anda. Anda dapat melakukan _rebuild_ proyek untuk mencoba perubahan Anda.

Jika ada beberapa _package_ yang masih hilang (mis. mungkin Anda menggunakan `react-dom/server` di proyek Anda), Anda dapat melakukan _full build_ dengan `yarn build`. Perlu dicatat bahwa menjalankan `yarn build` tanpa opsi akan memerlukan waktu yang lama.

Kami masih mengharuskan _pull request_ Anda berisi _unit test_ untuk setiap fungsionalitas baru. Dengan begitu, kami dapat memastikan bahwa kami tidak akan merusak kode Anda di kemudian hari.

### Panduan _Style_ {#style-guide}

Kami menggunakan _formatter_ kode otomatis [Prettier](https://prettier.io/).
Jalankan `yarn prettier` setelah melakukan perubahan apapun pada kode.

Kemudian, _linter_ kami akan menangkap sebagian besar isu yang mungkin ada pada kode Anda.
Anda dapat memeriksa status dari _style_ kode Anda secara mudah dengan menjalankan `yarn linc`.

Bagaimanapun, tetap ada beberapa _style_ yang tidak dapat dideteksi oleh _linter_. Jika Anda ragu mengenai sesuatu, melihat [Panduan _Style_ Airbnb](https://github.com/airbnb/javascript) akan memandu Anda ke arah yang tepat.

### Meminta Komentar (RFC) {#request-for-comments-rfc}

Banyak perubahan, termasuk perbaikan _bug_ dan penyempurnaan dokumentasi dapat diimplementasi dan ditinjau melalui alur _pull request_ GitHub pada umumnya.

Namum beberapa perubahan cukup "substansial", dan kami meminta agar perubahan tersebut dimasukkan ke dalam proses desain dan menciptakan kesepakatan di antara tim inti React.

Proses RFC _(Request for Comments)_ atau meminta komentar dimaksudkan untuk menyediakan jalur yang konsisten dan terkontrol untuk fitur baru yang akan masuk ke dalam proyek. Anda dapat berkontribusi dengan mengunjungi [repositori rfcs](https://github.com/reactjs/rfcs).

### Lisensi {#license}

Dengan berkontribusi pada React, Anda menyetujui bahwa kontribusi Anda akan dilisensikan di bawah lisensi MIT.

### Selanjutnya Apa? {#what-next}

Bacalah [bab berikutnya](/docs/codebase-overview.html) untuk mempelajari bagaimana basis kode ini diorganisir.
