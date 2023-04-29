# Panduan Penerjemahan Bahasa Indonesia untuk react.dev

Berikut adalah panduan-panduan dasar dalam penerjemahan situs react.dev ke Bahasa Indonesia. Dokumen ini ditujukan bagi mereka yang baru mulai berkontribusi dan yang pernah berkontribusi sebelumnya. Apabila ada kekurangan, silakan berkontribusi dengan menyunting dokumen ini.

## Referensi

Semua referensi mengenai penerjemahan terletak di [bagian Wiki](https://github.com/reactjs/id.react.dev/wiki) di repositori ini.

- [Glosarium](https://github.com/reactjs/id.react.dev/wiki/Glosarium)
- [Panduan Penulisan Universal](https://github.com/reactjs/id.react.dev/wiki/Panduan-Penulisan-Universal)
- [Universal Style Guide (English)](https://github.com/reactjs/id.react.dev/wiki/Universal-Style-Guide)

Apabila Anda ingin mendikusikan apapun mengenai proyek penerjemahan situs dokumentasi ini, termasuk umpan balik (*feedback*) mengenai Glosarium dan alur kerja (*workflow*), silakan ke [bagian Discussions](https://github.com/reactjs/id.react.dev/discussions).

## Menyunting Konten Secara Lokal

Untuk menjalankan situs id.react.dev secara lokal, ikuti langkah-langkah berikut:

1. Unduh dan instalasi [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/), dan [Yarn](https://yarnpkg.com/en/).
2. Buatlah *fork* dari repositori id.react.dev di akun Anda, kemudian *clone* repositori tersebut.
3. Jalankan `yarn` di terminal untuk menginstalasi dependensi yang dibutuhkan.
4. Jalankan `yarn dev` untuk menjalankan *server* lokal.
5. Buka alamat `localhost:3000` dalam peramban web Anda.

Konten dari situs id.react.dev terdapat dalam folder `content`, dan disimpan dalam format Markdown. Buka proyek id.react.dev dalam program penyunting teks Anda, dan mulailah menyunting. Konten dalam situs lokal akan diperbarui secara otomatis.

## Klaim Halaman Supaya Tidak Ada Pekerjaan Ganda

Proses penerjemahan akan dilacak dalam *issue* https://github.com/reactjs/id.react.dev/issues/330. Pastikan Anda telah meng-klaim halaman yang ingin Anda terjemahkan supaya tidak terjadi pekerjaan ganda.

### Perubahan mekanisme klaim penerjemahan

Sebagaimana yang bisa Anda lihat di *issue* https://github.com/reactjs/id.react.dev/issues/330, pada awalnya kami menggunakan penugasan terjemahan berbasis komentar. Namun proses tersebut terlalu menyulitkan dan berpotensi menghambat proses penerjemahan akibat aksi saling menunggu konfirmasi dan potensi miskomunikasi.

Oleh karena itu, terinspirasi dari mekanisme pembagian tugas di proyek [WargaBantuWarga](https://github.com/kawalcovid19/wargabantuwarga.com/blob/main/CONTRIBUTING.md#issue-assignment--communication), kami mengubah mekanismenya menjadi penugasan berbasis *Draft Pull Request*.

### Klaim penerjemahan melalui *Draft Pull Request*

*Draft Pull Request* merupakan *pull request* biasa, namun ia tidak dapat
digabungkan ke *branch* utama sampai statusnya diubah menjadi "ready for
review". *Draft Pull Request* menandakan bahwa *pull request* ini [masih sedang dalam pengerjaan](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/changing-the-stage-of-a-pull-request).
Hal ini diperlukan untuk memberikan sinyal kepada kontributor lainnya bahwa
terjemahan untuk halaman yang dimaksud di dalam *issue* tersebut sudah dimulai dan masih dikerjakan. Membuat *Draft Pull Request* juga merupakan cara yang lebih baik sebagai media komunikasi antara para kontributor karena informasi tambahan bisa disediakan di sana sembari melihat *file-file* yang diubah.

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

Agar *pull request* dapat berkaitan dengan *issue*, ada 1 syarat teks yang
harus dimasukkan ke dalam deskripsinya. Harap pastikan Anda menyebutkan nomor
*issue* yang Anda kerjakan dengan benar. Ubah teks `<!-- mention the issue that you're trying to close with this PR -->` yang disediakan dari *template*
menjadi nomor *issue*. Contoh:

```markdown
Closes #318

## Description

Update **`Start working on Issues`** section with clearer instructions on getting ready to work on an issue.
```
