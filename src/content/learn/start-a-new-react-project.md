---
title: Memulai Proyek Baru React
---

<Intro>

Jika Anda ingin membuat aplikasi baru atau situs web baru dengan menggunakan React, kami merekomendasikan Anda untuk memilih salah satu dari _framework_ berbasis React yang populer di komunitas. _Framework_ menyediakan fitur - fitur yang sebagian besar aplikasi dan situs web butuhkan, termasuk _routing_, pengambilan data, dan pembuatan halaman HTML.

</Intro>

<Note>

**Anda wajib memasang [Node.js](https://nodejs.org/en/) untuk dapat melakukan pengembangan di ekosistem lokal.** Anda *juga* dapat menggunakan Node.js pada ekosistem _production_, namun Anda tidak perlu melakukannya. Karena banyak _framework_ React yang mendukung ekspor ke folder HTML/CSS/JS statis.

</Note>

## Framework React Berkelas Produksi {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) adalah _full-stack framework_ React.** _Framework_ ini serbaguna dan memudahkan Anda untuk membuat aplikasi React dalam berbagai ukuran--mulai dari halaman blog statis hingga aplikasi dinamis yang kompleks. Untuk membuat proyek Next.js, jalankan perintah berikut di terminal Anda:

<TerminalBlock>
npx create-next-app
</TerminalBlock>

Jika Anda baru menggunakan Next.js, baca [panduan Next.js.](https://nextjs.org/learn/foundations/about-nextjs)

Next.js dikelola oleh [Vercel](https://vercel.com/). Anda dapat [memasang aplikasi Next.js](https://nextjs.org/docs/deployment) ke semua ekosistem berbasis Node.js atau _serverless hosting_ atau pada _server_ Anda sendiri. [Aplikasi statis Next.js](https://nextjs.org/docs/advanced-features/static-html-export) dapat dipasang pada layanan _hosting_ statis apapun.
### Remix {/*remix*/}

**[Remix](https://remix.run/) adalah _full-stack framework_ React yang menggunakan teknologi _nested routing_.** _Framework_ ini membantu Anda untuk dapat memecah aplikasi Anda ke dalam bagian - bagian bersarang yang dapat memuat data secara paralel dan melakukan _refresh_ sebagai bentuk respon dari aksi yang dilakukan oleh pengguna. Untuk membuat proyek Remix, jalankan perintah:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Jika Anda baru menggunakan Remix, lihat [panduan membuat blog dengan Remix](https://remix.run/docs/en/main/tutorials/blog) (pendek) dan [panduan membuat aplikasi dengan Remix](https://remix.run/docs/en/main/tutorials/jokes) (panjang).

Remix dikelola oleh [Shopify](https://www.shopify.com/). Saat Anda membuat proyek Remix, Anda perlu untuk [memilih target pemasangan Anda](https://remix.run/docs/en/main/guides/deployment). Anda dapat memasang aplikasi Remix ke semua _hosting_ Node.js atau _serverless_ dengan menggunanakan atau menuliskan sebuah [adaptor](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) adalah _framework_ React untuk situs web berbasis sistem manajemen konten cepat.** Ekosistem _plugin_ yang dimiliki serta lapisan data GraphQL dari Gatsby dapat memudahkan Anda dalam melakukan integrasi konten, API, dan layanan ke dalam satu situs web. Untuk membuat proyek Gatsby baru, jalankan perintah:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Jika Anda baru menggunakan Gatsby, lihat [panduan Gatsby.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby dikelola oleh [Netlify](https://www.netlify.com/). Anda dapat [memasang situs statis Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) ke _hosting_ statis apapun. Jika Anda memilih untuk menggunakan fitur _server-only_, Anda perlu memastikan jika penyedia layanan _hosting_ mendukung hal tersebut untuk Gatsby.

### Expo (untuk aplikasi _native_) {/*expo*/}

**[Expo](https://expo.dev/) adalah _framework_ React yang membantu Anda untuk dapat membuat aplikasi universal untuk Android, iOS, dan web dengan menggunakan tampilan antarmuka pengguna yang asli bawaan dari _platform_ tersebut (_native_).** _Framework_ ini menyediakan kit pengembangan perangkat lunak (SDK) untuk [React Native](https://reactnative.dev/) yang membuat komponen _native_ dapat digunakan dengan mudah. Untuk membuat proyek Expo baru, jalankan perintah:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Jika Anda baru menggunakan Expo, lihat [panduan Expo](https://docs.expo.dev/tutorial/introduction/).

Expo dikelola oleh [Expo (perusahaan)](https://expo.dev/about). Anda dapat Membuat aplikasi menggunakan Expo secara gratis, dan Anda dapat mengirimkan aplikasi Anda ke Google Play Store dan Apple App Store tanpa syarat tertentu. Sebagai tambahan, Expo juga menyediakan pilihan layanan komputasi awan (_cloud_) berbayar.

<DeepDive>

#### Dapatkah saya menggunakan React tanpa menggunakan framework? {/*can-i-use-react-without-a-framework*/}

Anda dapat menggunakan React tanpa menggunakan _framework_--begitupun Anda dapat [menggunakan React untuk sebagian dari halaman proyek Anda.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **Namun, jika Anda ingin membuat aplikasi atau situs baru sepenuhnya menggunakan React, kami merekomendasikan Anda untuk menggunakan _framework_.**

Alasannya.

Meskipun Anda tidak membutuhkan fungsi _routing_ maupun pengambilan data di awal pembuatan proyek, suatu waktu Anda perlu menambahkan beberapa _library_ baru untuk proyek tersebut. Semakin bertambahnya ukuran bundel JavaScript karena bertambahnya fitur baru, Anda perlu memikirkan bagaimana cara untuk memecah kode untuk setiap _route_ secara individu. Dengan semakin kompleksnya kebutuhan pengambilan data, Anda mungkin akan menghadapi situasi semakin banyaknya permintaan jaringan antara _server_ dan klien yang akan membuat aplikasi Anda terasa sangat lambat. Semakin banyak pengguna Anda dengan kondisi jaringan yang buruk dan perangkat dengan spesifikasi rendah serta fitur terbatas, Anda mungkin perlu untuk dapat membuat HTML dari komponen aplikasi Anda untuk bisa menampilkan konten aplikasi secara cepat--baik di _server_, atau saat waktu _build_. Mengubah susunan sistem untuk menjalankan kode di _server_ atau saat waktu _build_ sangatlah rumit.

**Masalah ini tidak hanya terjadi di React. Itulah mengapa Svelte memiliki SvelteKit, Vue memiliki Nuxt, dan lain sebagainya.** Untuk menyelesaikan masalah ini, Anda perlu untuk mengintegrasikan _bundler_ Anda dengan _router_ Anda dan dengan _library_ pengambilan data Anda. Membuat pengaturan awal dapat bekerja bukanlah hal yang sulit, namun terdapat banyak seluk-beluk yang terlibat dalam pembuatan suatu aplikasi yang dapat memuat dengan cepat meskipun terus berkembang dari waktu ke waktu. Anda mungkin ingin mengirimkan kode aplikasi dalam jumlah seminimal mungkin namun dapat melakukannya dalam sekali jalan antara klien dan _server_ pulang pergi, yang juga secara paralel dengan data apapun yang dibutuhkan untuk halaman tersebut. Anda mungkin ingin membuat halaman menjadi interaktif bahkan sebelum kode JavaScript dijalankan, untuk dapat mendukung peningkatan progresif. Anda mungkin ingin membuat sebuah folder dengan semua berkas HTML statis untuk halaman marketing Anda yang dapat dipasang dimanapun dan dapat bekerja meskipun tanpa JavaScript. Membangun aplikasi dengan kemampuan seperti ini membutuhkan kerja keras dari Anda untuk mewujudkannya.

**Secara umum, _framework_ React pada halaman ini dapat menyelesaikan masalah yang disebutkan sebelumnya, tanpa perlu usaha tambahan dari Anda.** React membantu Anda untuk dapat mulai membuat proyek dengan sangat ringkas dan kemudian mengembangkan aplikasi Anda sesuai kebutuhan Anda. Setiap _framework_ React memiliki komunitas yang aktif, sehingga Anda akan dengan mudah untuk menemukan jawaban atas pertanyaan serta informasi terkait peningkatan peralatan Anda. _Framework_ juga membantu Anda dalam menstrukturkan kode, membantu Anda dan orang lain untuk memahami konteks dan keterampilan di antara berbagai proyek. Sebaliknya dengan menggunakan pengaturan sendiri, Anda akan mudah terjebak pada versi dependensi yang sudah tidak didukung, dan pada akhirnya Anda akan membuat _framework_ Anda sendiri tanpa komunitas dan rencana peningkataan untuk membantu _framework_ tersebut terus berkembang (mungkin_framework_ tersebut pun mirip seperti yang pernah kita buat di masa lalu, dengan desain yang lebih asal-asalan).

Jika Anda masih belum yakin, atau aplikasi Anda memiliki kendala tidak umum yang tidak dapat dilayani dengan baik oleh _framework_ ini dan Anda ingin membuat pengaturan sendiri, kami tidak dapat menghentikan Anda--coba saja! Gunakan `react` dan `react-dom` dari npm, siapkan _bundler_ proses _build_ kostum Anda seperti [Vite](https://vitejs.dev/) atau [Parcel](https://parceljs.org/), dan peralatan lainnya sesuai kebutuhan Anda untuk _routing_, pembuatan halaman statis atau _server-side rendering_, dan lainnya.
</DeepDive>

## Framework React terbaru {/*bleeding-edge-react-frameworks*/}
Selama kami melakukan eksplorasi untuk meningkatkan kemampuan dan kualitas React, kami menyadari bahwa dengan mengintegrasikan React lebih dekat dengan berbagai macam _framework_ (khususnya dengan teknologi _routing_, _bundling_, dan _server_), hal tersebut merupakan kesempatan terbesar kami untuk membantu pengguna React untuk dapat membuat aplikasi yang lebih baik. Tim Next.js setuju untuk berkolaborasi dengan kami dalam riset, pengembangan, integrasi, serta pengujian fitur-fitur React terkini seperti [React Server Components.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

Setiap hari, fitur-fitur ini semakin dekat untuk menjadi teknologi yang siap digunakan di tingkat _production_, dan kami telah berbicara dengan pengembang _bundler_ dan _framework_ lainnya untuk dapat mengintergrasikan hal tersebut. Kami berharap bahwa dalam satu atau dua tahun, seluruh _framework_ yang terdaftar pada halaman ini akan mendapatkan dukungan penuh dari fitur - fitur ini. (Jika Anda adalah pencipta _framework_ dan tertarik untuk berkerja sama dengan kami untuk bereksperimen dengan fitur - fitur ini, mohon untuk menghubungi kami!)

### Router Aplikasi Next.js {/*nextjs-app-router*/}

**[_Router_ Aplikasi Next.js](https://beta.nextjs.org/docs/getting-started) adalah sebuah desain baru dari Next.js API yang bertujuan untuk memenuhi visi tim React mengenai arsitektur aplikasi _full-stack_.** Hal ini dapat membantu Anda untuk mengambil data pada komponen asinkron yang berjalan pada _server_ atau saat waktu _build_.

Next.js dikelola oleh [Vercel](https://vercel.com/). Anda dapat [memasang aplikasi Next.js](https://nextjs.org/docs/deployment) ke semua ekosistem berbasis Node.js atau _serverless hosting_ atau pada _server_ Anda sendiri. Next.js juga mendukung [ekspor halaman statis](https://beta.nextjs.org/docs/configuring/static-export) yang tidak membutuhkan _server_.
<Pitfall>

_Router_ Aplikasi Next.js **saat ini dalam fase _beta_ dan tidak direkomendasikan untuk implementasi di tingkat _production_** (per Bulan Maret 2023). Untuk mencoba bereksperimen dengan _Router_ Aplikasi dalam proyek Next.js yang ada, [ikuti panduan migrasi bertahap ini](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

</Pitfall>

<DeepDive>

#### Fitur apa yang membentuk visi arsitektur aplikasi full stack dari tim React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

_Router_ aplikasi Next.js sepenuhnya mengimplementasi [spesifikasi React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Hal ini memungkinkan Anda untuk dapat menggabungkan waktu _build_, _server-only_, dan komponen interaktif ke dalam satu pohon React.

Sebagai contoh, Anda dapat menulis komponen _server-only_ React sebagai sebuah fungsi `async` yang dapat membaca data dari database atau sebuah berkas. Kemudian Anda dapat mengirimkan data tersebut ke komponen interaktif Anda:

```js
// Komponen ini *hanya* berjalan di server (atau pada saat waktu build).
async function Talks({ confId }) {
  // 1. Anda berada di server, Anda dapat berkomunikasi dengan lapisan data Anda. endpoint API tidak dibutuhkan.
  const talks = await db.Talks.findAll({ confId });

  // 2. Tambahkan beberapa logika rendering. Hal ini tidak akan membuat bundel JavaScript Anda lebih besar.
  const videos = talks.map(talk => talk.video);

  // 3. Kirimkan data ke komponen yang akan berjalan di peramban.
  return <SearchableVideoList videos={videos} />;
}
```

_Router_ aplikasi Next.js juga mengintegrasikan [pengambilan data dengan _Suspense_](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Hal ini memungkinkan Anda untuk menentukan status pemuatan (seperti kerangka _placeholder_) untuk berbagai komponen dari tampilan antar muka Anda langsung dari pohon React Anda:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

_Server Components_ dan _Suspense_ merupakan fitur dari React dan bukanlan fitur Next.js. Namun, menggunakannya pada tingkatan _framework_ membutuhkan implementasi yang serius dan bukanlah sebuah percobaan. Saat ini, _Router_ aplikasi Next.js merupakan implementasi yang paling lengkap dari hal tersebut. Tim React saat ini sedang bekerja sama dengan pengembang _bundler_ untuk membuat fitur ini dapat diimplementasikan pada _framework_ generasi berikutnya.

</DeepDive>
