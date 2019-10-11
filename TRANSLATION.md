# Panduan Penerjemahan Bahasa Indonesia untuk reactjs.org

Berikut adalah panduan-panduan dasar dalam penerjemahan situs reactjs.org ke Bahasa Indonesia. Dokumen ini ditujukan bagi mereka yang baru mulai berkontribusi dan yang pernah berkontribusi sebelumnya. Apabila ada kekurangan, silakan berkontribusi dengan menyunting dokumen ini.

## Menyunting Konten Secara Lokal

Untuk menjalankan situs id.reactjs.org secara lokal, ikuti langkah-langkah berikut:

1. Unduh dan instalasi [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/), dan [Yarn](https://yarnpkg.com/en/).
2. Buatlah *fork* dari repositori id.reactjs.org di akun Anda, kemudian *clone* repositori tersebut.
3. Jalankan `yarn` di terminal untuk menginstalasi dependensi yang dibutuhkan.
4. Jalankan `yarn dev` untuk menjalankan *server* lokal.
5. Buka alamat `localhost:8000` dalam peramban web Anda.

Konten dari situs id.reactjs.org terdapat dalam folder `content`, dan disimpan dalam format Markdown. Buka proyek id.reactjs.org dalam program penyunting teks Anda, dan mulailah menyunting. Konten dalam situs lokal akan diperbarui secara otomatis.

## Klaim Halaman Supaya Tidak Ada Pekerjaan Ganda

Proses penerjemahan akan dicatat dalam *issue* https://github.com/reactjs/id.reactjs.org/issues/1. Pastikan Anda telah meng-klaim halaman yang Anda ingin menerjemahkan, supaya tidak terjadi pekerjaan ganda.

## Panduan Penulisan Universal

Berikut adalah panduan penulisan yang berlaku bagi seluruh situs terjemahan reactjs.org.

Silakan merujuk ke halaman [Glosarium](https://github.com/reactjs/id.reactjs.org/wiki/Glosarium) pada wiki id.reactjs.org. Halaman wiki tersebut berisi daftar glosarium beserta terjemahannya.

Referensi panduan penulisan Bahasa Indonesia lainnya yang dapat digunakan adalah:

* [Pedoman Umum Ejaan Bahasa Indonesia (PUEBI)](https://puebi.readthedocs.io/en/latest/)
* [Kamus Besar Bahasa Indonesia (KBBI)](https://kbbi.kemdikbud.go.id/)
* [RSNI3 8527:2018 - Glosarium Istilah Teknologi Informasi](https://github.com/jk8s/sig-docs-id/raw/master/resources/RSNI-glossarium.pdf)

### *Heading ID*

Setiap *heading* pada halaman reactjs.org memiliki ID seperti berikut:

```md
## Try React {#try-react}
```

**Jangan** menerjemahkan ID-nya! ID yang diterjemahkan akan merusak navigasi dalam situs.

```md
Lihat [bagian permulaan](/getting-started#try-react) untuk info lebih lanjut.
```

✅ LAKUKAN:

```md
## Coba React {#try-react}
```

❌ JANGAN LAKUKAN:

```md
## Coba React {#coba-react}
```

Ini akan merusak tautan di atas.

### Teks dalam Blok Kode

Anda dapat menerjemahkan teks di dalam string & komentar kode, namun berhati-hatilah supaya tidak menerjemahkan bagian dari kode secara tidak sengaja!

Contoh:

```js
// Example
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ LAKUKAN:

```js
// Contoh
const element = <h1>Halo, dunia</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

❌ JANGAN LAKUKAN:

```js
// Contoh
const element = <h1>Halo, dunia</h1>;
// "root" merujuk kepada ID elemen.
// JANGAN DITERJEMAHKAN
ReactDOM.render(element, document.getElementById('induk'));
```

❌ SANGAT TIDAK BOLEH DILAKUKAN:

```js
// Contoh
const elemen = <h1>Halo, dunia</h1>;
ReactDOM.render(elemen, dokumen.dapatkanElemenBerdasarkanId('induk'));
```

### Tautan Eksternal

Apabila tautan eksternal merujuk kepada artikel referensi seperti di [MDN](https://developer.mozilla.org/en-US/) atau [Wikipedia](https://id.wikipedia.org/wiki/Halaman_Utama), dan versi bahasa Indonesia dari artikel tersebut yang berkualitas cukup bagus tersedia, lebih baik merujuk kepada tautan versi bahasa Indonesia tersebut.

Contoh:

```md
This helps prevent [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.
```

✅ OK:

```md
Ini membantu menghindari serangan [XSS (*cross-site-scripting*)](https://id.wikipedia.org/wiki/XSS).
```
