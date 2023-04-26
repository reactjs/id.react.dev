---
title: Persiapan Editor
---

<Intro>

Sebuah editor yang terkonfigurasi dengan baik dapat membuat kode lebih mudah dibaca dan lebih cepat ditulis. Ini bahkan dapat membantu Anda menangkap *bug* saat Anda menulisnya! Jika ini adalah pertama kalinya Anda mempersiapkan editor atau Anda ingin menyetel ulang editor Anda saat ini, kami memiliki beberapa rekomendasi.

</Intro>

<YouWillLearn>

* Apa saja editor yang paling populer
* Cara memformat kode Anda secara otomatis

</YouWillLearn>

## Editor Anda {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) adalah salah satu editor yang paling populer yang digunakan saat ini. Memiliki pasar ekstensi yang besar dan terintegrasi dengan baik dengan layanan populer seperti GitHub. Sebagian besar fitur yang tercantum di bawah ini juga dapat ditambahkan ke VS Code sebagai ekstensi, sehingga membuatnya sangat dapat dikonfigurasi!

Editor teks populer lainnya yang digunakan dalam komunitas React meliputi:

* [WebStorm](https://www.jetbrains.com/webstorm/) adalah lingkungan pengembangan terpadu yang dirancang khusus untuk JavaScript.
* [Sublime Text](https://www.sublimetext.com/) memiliki dukungan untuk JSX dan TypeScript, [*syntax highlighting*](https://stackoverflow.com/a/70960574/458193) dan penyelesaian otomatis yang sudah *built-in*.
* [Vim](https://www.vim.org/) adalah editor teks yang sangat dapat dikonfigurasi yang dirancang untuk membuat membuat dan mengubah jenis teks apa pun menjadi sangat efisien. Ini disertakan sebagai "vi" dengan sebagian besar sistem UNIX dan dengan Apple OS X.

## Fitur editor teks yang direkomendasikan {/*recommended-text-editor-features*/}

Beberapa editor dilengkapi dengan fitur-fitur ini secara *built-in*, tetapi yang lain mungkin memerlukan penambahan ekstensi. Periksa untuk melihat dukungan yang disediakan editor pilihan Anda untuk memastikan!

### Pemeriksaan {/*linting*/}

Pemeriksa kode dapat menemukan masalah dalam kode Anda saat Anda menulis, membantu Anda memperbaikinya lebih awal. [ESLint](https://eslint.org/) adalah pemeriksa *open source* yang populer untuk JavaScript.

* [Memasang ESLint dengan konfigurasi yang direkomendasikan untuk React](https://www.npmjs.com/package/eslint-config-react-app) (pastikan Anda telah [memasang Node!](https://nodejs.org/en/download/current/))
* [Integrasi ESLint di VSCode dengan ekstensi resmi](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Pastikan Anda telah mengaktifkan semua aturan [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) untuk proyek Anda.** Mereka sangat penting dan menangkap *bug* yang paling parah lebih awal. *Preset* [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) yang direkomendasikan sudah termasuk di dalamnya.

### Pemformatan {/*formatting*/}

Hal terakhir yang ingin Anda lakukan saat berbagi kode Anda dengan kontributor lain adalah terlibat dalam diskusi tentang [tab vs spasi](https://www.google.com/search?q=tabs+vs+spaces)! Untungnya, [Prettier](https://prettier.io/) akan membersihkan kode Anda dengan memformat ulang sesuai dengan aturan yang telah ditentukan. Jalankan Prettier, dan semua tab Anda akan dikonversi menjadi spasi—dan indentasi, tanda kutip, dll juga akan diubah sesuai dengan konfigurasi. Dalam pengaturan yang ideal, Prettier akan berjalan saat Anda menyimpan file Anda, dengan cepat membuat perubahan ini untuk Anda.

Anda dapat memasang [ekstensi Prettier di VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) dengan mengikuti langkah-langkah berikut:

1. Buka VS Code
2. Gunakan *Quick Open* (tekan Ctrl/Cmd+P)
3. Tempelkan `ext install esbenp.prettier-vscode`
4. Tekan Enter

#### Pemformatan saat menyimpan {/*formatting-on-save*/}

Idealnya, Anda harus memformat kode Anda setiap kali menyimpan. VS Code memiliki pengaturan untuk ini!

1. Di VS Code, tekan `CTRL/CMD + SHIFT + P`.
2. Ketik "settings"
3. Tekan Enter
4. Di bilah pencarian, ketik "format on save"
5. Pastikan opsi "format on save" dicentang!

Jika *preset* ESLint Anda memiliki aturan pemformatan, mereka mungkin akan bertentangan dengan Prettier. Kami menyarankan untuk menonaktifkan semua aturan pemformatan di *preset* ESLint Anda menggunakan [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) sehingga ESLint hanya digunakan untuk menangkap kesalahan logis. Jika Anda ingin menegakkan bahwa file diformat terlabih dahulu sebelum *pull request* digabungkan, gunakan [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) untuk integrasi berkelanjutan Anda.
