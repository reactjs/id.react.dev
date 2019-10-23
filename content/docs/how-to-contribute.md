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

### [Kode Etik](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md) {#code-of-conduct}

Facebook telah mengadopsi [Persetujuan Kontributor](https://www.contributor-covenant.org/) sebagai Kode Etiknya, dan kami berharap peserta proyek mengikutinya. Dimohon untuk membaca [keseluruhannya](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md) agar Anda dapat memahami tindakan apa yang akan dan tidak akan ditoleransi.

### Pengembangan Terbuka {#open-development}

Semua pengembangan pada React terjadi secara langsung pada [GitHub](https://github.com/facebook/react). Baik anggota tim inti dan kontributor eksternal mengirimkan *pull requests* yang akan melewati proses peninjauan yang sama.

### Semantic Versioning {#semantic-versioning}

React follows [semantic versioning](https://semver.org/). We release patch versions for critical bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor version so that our users learn about the upcoming changes and migrate their code in advance. Learn more about our commitment to stability and incremental migration in [our versioning policy](https://reactjs.org/docs/faq-versioning.html).

Every significant change is documented in the [changelog file](https://github.com/facebook/react/blob/master/CHANGELOG.md).

### Pengaturan Cabang {#branch-organization}

Ajukan semua perubahan secara langsung pada [`cabang master`](https://github.com/facebook/react/tree/master). Kami tidak menggunakan cabang terpisah untuk pengembangan atau rilis yang akan datang. Kami mengupayakan yang terbaik untuk menjaga `master` dalam kondisi yang baik, dengan lulus semua tes yang ada.

Kode yang tiba di `master` harus kompatibel dengan rilis terakhir yang stabil. Kode tersebut boleh berisi fitur tambahan, tapi tidak boleh ada perubahan yang merusak. Kita harus bisa merilis versi minor yang baru dari  `master` setiap saat.

### Bendera Fitur {#feature-flags}

Untuk menjaga cabang `master` pada keadaan dapat dirilis, perubahan yang merusak dan fitur eksperimental harus dipagari di balik bendera fitur.

Bendera fitur didefinisikan pada [`packages/shared/ReactFeatureFlags.js`](https://github.com/facebook/react/blob/master/packages/shared/ReactFeatureFlags.js). Beberapa _build_ dari React mungkin menmerapkan kumpulan bendera fitur yang berbeda; misalnya, _build_ React Native dikonfigurasi secara berbeda dari React DOM. Bendera-bendera ini dapat ditemukan di [`packages/shared/forks`](https://github.com/facebook/react/tree/master/packages/shared/forks). Bendera fitur umumnya dibuat secara statis oleh Flow, sehingga Anda dapat menjalankan `yarn flow` untuk memastikan bahwa Anda telah membarui semua _file_ yang dibutuhkan.

Sistem _build_ React akan menanggalkan cabang fitur yang dinonaktifkan sebelum diterbitkan. Sebuah tugas integrasi berkelanjutan _(continuous integration)_ berjalan pada setiap _commit_ untuk memeriksa perubahan ukuran bundel. Anda dapat menggunakan perubahan pada ukuran sebagai tanda bahwa sebuah fitur telah dipagari dengan baik.

### Bug {#bugs}

#### Mencari Isu yang Diketahui {#where-to-find-known-issues}

Kami menggunakan [Isu GitHub](https://github.com/facebook/react/issues) untuk bug publik. Kami sangat memperhatikan hal ini dan berusaha menjelaskan ketika kami sedang melakukan perbaikan secara internal. Sebelum mengajukan isu baru, coba pastikan bahwa masalahmu belum pernah ada sebelumnya.

#### Reporting New Issues {#reporting-new-issues}

Cara terbaik untuk memperbaiki bug Anda adalah dengan menyediakan contoh kasus yang spesifik. [Templat JSFiddle](https://jsfiddle.net/Luktwrdm/) ini adalah titik mulai yang baik.

#### Security Bugs {#security-bugs}

Facebook memiliki [program berhadiah](https://www.facebook.com/whitehat/) untuk melaporkan bug keamanan secara rahasia. Dengan pertimbangan itu, dimohon untuk tidak mengajukan isu publik; harap melewati proses yang telah dijelaskan pada halaman tersebut.

### Bagaimana Cara Berhubungan {#how-to-get-in-touch}

* IRC: [#reactjs pada freenode](https://webchat.freenode.net/?channels=reactjs)
* [Forum diskusi](https://reactjs.org/community/support.html#popular-discussion-forums)

Terdapat pula [komunitas aktif pengguna React pada platform komunikasi Discord](https://www.reactiflux.com/) jika Anda membutuhkan bantuan mengenai React.

### Mengajukan Perubahan {#proposing-a-change}

Jika Anda berniat untuk mengubah API publik, atau mengajukan perubahan non-trivial pada implementasinya, kami merekomendasikan Anda untuk [mengajukan isu](https://github.com/facebook/react/issues/new). Ini memungkinkan kami untuk mencapai kesepakatan pada proposal Anda sebelum Anda mengerahkan usaha yang signifikan pada hal tersebut.

Jika Anda hanya memperbaiki sebuah bug, tidak masalah untuk langsung mengirimkan _pull request_, tetapi kami masih merekomendasikan untuk mengajukan isu yang menjelaskan apa yang Anda perbaiki. Ini sangat membantu apabila kami tidak menerima perbaikan itu secara spesifik, tetapi tetap ingin untuk memantau isu tersebut.

### Pull Request Pertama Anda {#your-first-pull-request}

Sedang mengerjakan _Pull Request_ pertama Anda? Anda dapat belajar bagaimana caranya dari seri video gratis ini:
Working on your first Pull Request? You can learn how from this free video series:

**[Bagaimana Cara Berkontribusi pada Proyek Sumber Terbuka di GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**

Untuk membantu Anda mengumpulkan pengalaman dan lebih familiar dengan proses kontribusi kami, kami memiliki daftar **[isu pertama yang baik](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** berisi bug yang memiliki cakupan yang relatif terbatas. Ini adalah tempat yang baik untuk mulai.

Jika Anda memutuskan untuk memperbaiki sebuah isu, pastikan Anda memeriksa utas komentar apabila seseorang sudah sedang mengerjakan perbaikannya. Jika tidak ada yang sedang mengerjakannya pada saat itu, tinggalkan komentar yang menyatakan bahwa Anda bermaksud untuk memperbaikinya, sehingga orang lain tidak mengerjakan hal yang sama.

Jika seseorang mengambil sebuah isu, tetapi tidak dilanjutkan selama lebih dari 2 minggu, tidak apa-apa untuk mengambil alih isu tersebut, tapi Anda tetap sebaiknya meninggalkan komentar.

### Mengirimkan _Pull Request_ {#sending-a-pull-request}



The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. For API changes we may need to fix our internal uses at Facebook.com, which could cause some delay. We'll do our best to provide updates and feedback throughout the process.

**Before submitting a pull request,** please make sure the following is done:

1. Fork [the repository](https://github.com/facebook/react) and create your branch from `master`.
2. Run `yarn` in the repository root.
3. If you've fixed a bug or added code that should be tested, add tests!
4. Ensure the test suite passes (`yarn test`). Tip: `yarn test --watch TestName` is helpful in development.
5. Run `yarn test-prod` to test in the production environment. It supports the same options as `yarn test`.
6. If you need a debugger, run `yarn debug-test --watch TestName`, open `chrome://inspect`, and press "Inspect".
7. Format your code with [prettier](https://github.com/prettier/prettier) (`yarn prettier`).
8. Make sure your code lints (`yarn lint`). Tip: `yarn linc` to only check changed files.
9. Run the [Flow](https://flowtype.org/) typechecks (`yarn flow`).
10. If you haven't already, complete the CLA.

### Perjanjian Lisensi Kontributor (CLA) {#contributor-license-agreement-cla}

Agar dapat menyetujui *pull request* Anda, Anda perlu melengkapi CLA. Anda hanya perlu melakukan ini sekali, jadi apabila anda pernah melakukan hal ini untuk proyek sumber terbuka Facebook yang lain. Jika ini adalah pertama kalinya anda mengirimkan *pull request*, beritahu kamu bahwa Anda telah melengkapi CLA Anda, dan kami akan memeriksa kembali dengan nama pengguna GitHub anda.

**[Lengkapi CLA Anda di sini.](https://code.facebook.com/cla)**

### Prasyarat Kontribusi {#contribution-prerequisites}

* Anda telah memasang [Node](https://nodejs.org) pada v8.0.0+ dan Yarn](https://yarnpkg.com/en/) pada v1.2.0+.
* Anda telah memasang `gcc` atau dapat memasang _compiler_ jika dibutuhkan. Beberapa _dependency_ dapat membutuhkan tahapan kompilasi. Pada OS X, _Command Line Tools_ Xcode saja cukup. Pada Ubuntu, `apt-get install build-essential` akan memasang _package_ yang dibutuhkan. Perintah sejenis seharusnya dapat bekerja pada distro Linux lainnya. Windows akan membutuhkan beberapa langkah tambahan, lihat [instruksi pemasangan `node-gyp`](https://github.com/nodejs/node-gyp#installation) untuk informasi lebih lengkap.
* Anda familiar dengan Git.

### Development Workflow {#development-workflow}

After cloning React, run `yarn` to fetch its dependencies.
Then, you can run several commands:

* `yarn lint` checks the code style.
* `yarn linc` is like `yarn lint` but faster because it only checks files that differ in your branch.
* `yarn test` runs the complete test suite.
* `yarn test --watch` runs an interactive test watcher.
* `yarn test <pattern>` runs tests with matching filenames.
* `yarn test-prod` runs tests in the production environment. It supports all the same options as `yarn test`.
* `yarn debug-test` is just like `yarn test` but with a debugger. Open `chrome://inspect` and press "Inspect".
* `yarn flow` runs the [Flow](https://flowtype.org/) typechecks.
* `yarn build` creates a `build` folder with all the packages.
* `yarn build react/index,react-dom/index --type=UMD` creates UMD builds of just React and ReactDOM.

We recommend running `yarn test` (or its variations above) to make sure you don't introduce any regressions as you work on your change. However it can be handy to try your build of React in a real project.

First, run `yarn build`. This will produce pre-built bundles in `build` folder, as well as prepare npm packages inside `build/packages`.

The easiest way to try your changes is to run `yarn build react/index,react-dom/index --type=UMD` and then open `fixtures/packaging/babel-standalone/dev.html`. This file already uses `react.development.js` from the `build` folder so it will pick up your changes.

If you want to try your changes in your existing React project, you may copy `build/dist/react.development.js`, `build/dist/react-dom.development.js`, or any other build products into your app and use them instead of the stable version. If your project uses React from npm, you may delete `react` and `react-dom` in its dependencies and use `yarn link` to point them to your local `build` folder:

```sh
cd ~/path_to_your_react_clone/build/node_modules/react
yarn link
cd ~/path_to_your_react_clone/build/node_modules/react-dom
yarn link
cd /path/to/your/project
yarn link react react-dom
```

Every time you run `yarn build` in the React folder, the updated versions will appear in your project's `node_modules`. You can then rebuild your project to try your changes.

We still require that your pull request contains unit tests for any new functionality. This way we can ensure that we don't break your code in the future.

### Panduan _Style_ {#style-guide}

Kami menggunakan _formatter_ kode otomatis [Prettier](https://prettier.io/).
Jalankan `yarn prettier` setelah melakukan perubahan apapun pada kode.

Kemudian, _linter_ kami akan menangkap sebagian besar isu yang mungkin ada pada kode Anda.
Anda dapat memeriksa status dari _style_ kode Anda secara mudah dengan menjalankan `yarn linc`.

Bagaimanapun, tetap ada beberapa _style_ yang tidak dapat dideteksi oleh _linter_. Jika Anda ragu mengenai sesuatu, melihat [Panduan _Style_ Airbnb](https://github.com/airbnb/javascript) akan memandu anda ke arah yang tepat.

### Video Pengantar {#introductory-video}

Anda mungkin tertarik untuk menonton [video singkat ini](https://www.youtube.com/watch?v=wUpPsEcGsg8) (26 menit) yang memberikan pengantar mengenai bagaimana cara berkontribusi pada React.

#### Video yang Penting: {#video-highlights}
- [4:12](https://youtu.be/wUpPsEcGsg8?t=4m12s) - Membangun dan mengetes React secara lokal
- [6:07](https://youtu.be/wUpPsEcGsg8?t=6m7s) - Membuat dan mengirimkan *pull request*
- [8:25](https://youtu.be/wUpPsEcGsg8?t=8m25s) - Mengorganisir kode
- [14:43](https://youtu.be/wUpPsEcGsg8?t=14m43s) - React npm registry
- [19:15](https://youtu.be/wUpPsEcGsg8?t=19m15s) - Menambahkan fitur baru React

Untuk gambaran realistik mengenai seperti apa _rasanya_ berkontribusi pada React untuk pertama kalinya, cek [acara ReactNYC yang menarik ini](https://www.youtube.com/watch?v=GWCcZ6fnpn4).

### Meminta Komentar (RFC) {#request-for-comments-rfc}

Banyak perubahan, termasuk perbaikan bug dan penyempurnaan dokumentasi dapat diimplementasi dan ditinjau melalui alur *pull request* GitHub pada umumnya.

Namum beberapa perubahan cukup "substansial", dan kami meminta agar perubahan tersebut dimasukkan ke dalam proses desain dan menciptakan kesepakatan di antara tim inti React.

Proses RFC _(Request for Comments)_ atau meminta komentar dimaksudkan untuk menyediakan jalur yang konsisten dan terkontrol untuk fitur baru yang akan masuk ke dalam proyek. Anda dapat berkontribusi dengan mengunjungi [repositori rfcs](https://github.com/reactjs/rfcs).

### Lisensi {#license}

Dengan berkontribusi pada React, Anda menyetujui bahwa kontribusi Anda akan dilisensikan di bawah lisensi MIT.

### Selanjutnya Apa? {#what-next}

Bacalah [bab berikutnya](/docs/codebase-overview.html) untuk mempelajari bagaimana basis kode ini diorganisir.
