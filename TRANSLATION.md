# Panduan Penerjemahan Bahasa Indonesia untuk react.dev

Berikut adalah panduan-panduan dasar dalam penerjemahan situs react.dev ke Bahasa Indonesia. Dokumen ini ditujukan bagi mereka yang baru mulai berkontribusi dan yang pernah berkontribusi sebelumnya. Apabila ada kekurangan, silakan berkontribusi dengan menyunting dokumen ini.

## Referensi

Semua referensi mengenai penerjemahan terletak di [bagian Wiki](https://github.com/reactjs/id.react.dev/wiki) di repositori ini.

- [Glosarium](https://github.com/reactjs/id.react.dev/wiki/Glosarium)
- [Panduan Penulisan Universal](https://github.com/reactjs/id.react.dev/wiki/Panduan-Penulisan-Universal)
- [Universal Style Guide (English)](https://github.com/reactjs/id.react.dev/wiki/Universal-Style-Guide)

Apabila Anda ingin mendikusikan apapun mengenai proyek penerjemahan situs dokumentasi ini, termasuk umpan balik (*feedback*) mengenai Glosarium dan alur kerja (*workflow*), silakan ke [bagian Discussions](https://github.com/reactjs/id.react.dev/discussions).

## Menyunting konten secara lokal

Untuk menjalankan situs id.react.dev secara lokal, ikuti langkah-langkah berikut:

1. Unduh dan instalasi [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/), dan [Yarn](https://yarnpkg.com/en/).
2. Buatlah *fork* dari repositori id.react.dev di akun Anda, kemudian *clone* repositori tersebut.
3. Jalankan `yarn` di terminal untuk menginstalasi dependensi yang dibutuhkan.
4. Jalankan `yarn dev` untuk menjalankan *server* lokal.
5. Buka alamat `localhost:3000` dalam peramban web Anda.

Konten dari situs id.react.dev terdapat dalam folder `src/content`, dan disimpan dalam format Markdown. Buka proyek id.react.dev dalam program penyunting teks Anda, dan mulailah menyunting. Konten dalam situs lokal akan diperbarui secara otomatis.

## Klaim halaman supaya tidak ada pekerjaan ganda

Proses penerjemahan akan dilacak dalam *issue* https://github.com/reactjs/id.react.dev/issues/330. Pastikan Anda telah meng-klaim halaman yang ingin Anda terjemahkan supaya tidak terjadi pekerjaan ganda.

### Perubahan mekanisme klaim penerjemahan

Sebagaimana yang bisa Anda lihat di *issue* https://github.com/reactjs/id.react.dev/issues/330, pada awalnya kami menggunakan penugasan terjemahan berbasis komentar. Namun proses tersebut terlalu menyulitkan dan berpotensi menghambat proses penerjemahan akibat aksi saling menunggu konfirmasi dan potensi miskomunikasi.

Oleh karena itu, terinspirasi dari mekanisme pembagian tugas di proyek [WargaBantuWarga](https://github.com/kawalcovid19/wargabantuwarga.com/blob/main/CONTRIBUTING.md#issue-assignment--communication), kami mengubah mekanismenya menjadi penugasan berbasis *Draft Pull Request*.

Secara prinsip, siapa pun yang bersedia untuk menerjemahkan suatu halaman, silakan langsung buat *Draft Pull Request* sesegera mungkin terhadap *issue* terkait.
Anda mungkin akan melihat beberapa *issue* yang mengandung deskripsi `Assignee: @<username>`. Teks tersebut hanyalah sisa dari proses penugasan yang sebelumnya, dan penugasan tersebut tidak ada artinya apabila tidak ada *Draft Pull Request* yang dibuat oleh kontributor yang ditugaskan di situ.
Oleh karena itu, mulai saat ini, kami para pengelola repositori ini akan memprioritaskan *Pull Request* manapun (termasuk *Draft Pull Request*) sebagai suatu tanda penugasan diri Anda sendiri terhadap *issue* tersebut. Apabila ditemukan dua atau lebih *Pull Request* yang terkait dengan *issue* yang sama, maka kami akan memprioritaskan *Pull Request* yang lebih jauh kemajuannya dan lebih terkini pembaruannya.

### Klaim penerjemahan melalui *Draft Pull Request*

*Draft Pull Request* merupakan *pull request* biasa, namun ia tidak dapat
digabungkan ke *branch* utama sampai statusnya diubah menjadi "ready for
review". *Draft Pull Request* menandakan bahwa *pull request* ini [masih sedang dalam pengerjaan](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/changing-the-stage-of-a-pull-request).
Hal ini diperlukan untuk memberikan sinyal kepada kontributor lainnya bahwa
terjemahan untuk halaman yang dimaksud di dalam *issue* tersebut sudah dimulai dan masih dikerjakan. Membuat *Draft Pull Request* juga merupakan cara yang lebih baik sebagai media komunikasi antara para kontributor karena informasi tambahan bisa disediakan di sana sembari melihat *file-file* yang diubah.

Dengan membuat *Draft Pull Request* untuk *issue* terkait, kita dapat asumsikan bersama bahwa **Anda telah ditugaskan untuk menerjemahkan halaman tersebut**, sehingga kontributor lain bisa memilih untuk menerjemahkan halaman yang lainnya. Apabila sebuah *Draft Pull Request* dari kontributor lain menggantung terlalu lama tanpa ada kemajuan yang jelas selama beberapa hari, Anda dapat **mengambil alih tugas penerjemahan** halaman tersebut dengan cara membuat *Draft Pull Request* Anda sendiri. Bisa dengan melanjutkan proses penerjemahannya dari *commit* terakhir oleh kontributor lainnya di *Draft Pull Request* yang menggantung tersebut, atau dengan memulainya dari awal lagi (dari *commit* di `main` *branch*).

#### Pembuatan *Draft Pull Request*

Langkah-langkah untuk membuat *Draft Pull Request*:

1. *Commit* dan *push* perubahan terbaru ke *forked repository* Anda. Mohon merujuk ke [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) untuk membuat pesan *commit* atau Anda dapat menggunakan [commitlint.io](https://commitlint.io/) untuk membantu Anda membuat pesan *commit*.
2. Pergi ke bagian *Pull requests* pada *forked repository* Anda, dan klik *New pull request*.

   ![Petunjuk-1](https://user-images.githubusercontent.com/46013258/126284390-c2bd1aa6-fdc2-4aa6-a945-031f02db038e.png)

3. Pilih *forked repository* Anda sebagai *head repository*, dan pilih *branch* tempat Anda membuat perubahan untuk bagian *compare*.

   ![Petunjuk-2](https://user-images.githubusercontent.com/46013258/126285036-27b49325-62a2-4a6c-b216-5bae261788da.png)

4. Berikan judul dan deskripsi yang jelas mengenai *pull request* Anda.
   Pastikan Anda mengikuti pengisian deskripsi seperti [keterangan di
   bawah](#pemberian-deskripsi-pull-request).

   ![Petunjuk-3](https://user-images.githubusercontent.com/46013258/126286179-04341e30-1224-49cb-9b9a-3c3aee99c308.png)

5. Pilih *Create draft pull request* (seperti pada gambar di atas) dan klik tombol berwarna hijau.
6. Jangan lupa untuk menandai *Draft Pull Request* Anda sebagai *Ready for review* ketika Anda sudah melakukan semua perubahan yang diinginkan.

#### Pemberian deskripsi *pull request*

Agar *pull request* dapat berkaitan dengan *issue*, ada sebuah syarat teks yang
harus dimasukkan ke dalam deskripsinya, yakni dengan format `Closes #nomor-issue`. Harap pastikan Anda menyebutkan nomor
*issue* yang Anda kerjakan dengan benar. Ubah teks `<!-- mention the issue that you're trying to close with this PR -->` yang disediakan dari *template*
menjadi nomor *issue*. Contoh, seperti pada https://github.com/reactjs/id.react.dev/pull/500:

```markdown
Closes #372

## Description

Translate the **Quick Start** page.
Page URL: https://id.react.dev/learn
```

Apabila Anda melakukannya dengan benar, maka Anda akan melihat *issue* dan *draft pull request* tersebut saling terhubung sebagaimana yang tampak pada tangkapan layar berikut ini.

![A Draft Pull Request linked to an Issue](https://user-images.githubusercontent.com/6315466/235304349-125f538f-e9a6-428b-ab55-f01158f0b8d4.png)

![An Issue linked to a Draft Pull Request](https://user-images.githubusercontent.com/6315466/235304341-f8b2f8dd-c94e-4548-a7da-ce3be49dee17.png)
