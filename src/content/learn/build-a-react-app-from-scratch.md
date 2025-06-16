---
title: Membangun aplikasi React dari awal
---

<Intro>

Jika aplikasi Anda memiliki kendala yang tidak dapat diatasi dengan baik oleh *framework* yang ada, Anda lebih suka membangun *framework* Anda sendiri, atau Anda hanya ingin mempelajari dasar-dasar aplikasi React, Anda dapat membangun aplikasi React dari awal.

</Intro>

<DeepDive>

#### Pertimbangkan untuk menggunakan *framework* {/*consider-using-a-framework*/}

Memulai dari awal adalah cara mudah untuk mulai menggunakan React, tetapi ada satu hal yang perlu diperhatikan, yaitu bahwa mengikuti cara ini sering kali sama dengan membangun *framework ad hoc* Anda sendiri. Seiring dengan perkembangan kebutuhan Anda, Anda mungkin perlu memecahkan lebih banyak masalah seperti *framework* yang solusinya telah dikembangkan dan didukung dengan baik oleh *framework* yang kami rekomendasikan.

Misalnya, jika di masa mendatang aplikasi Anda memerlukan dukungan untuk *server-side rendering* (SSR), *static site generation* (SSG), dan/atau Komponen Server React (RSC), Anda harus mengimplementasikannya sendiri. Demikian pula, fitur React mendatang yang memerlukan integrasi pada tingkat *framework* harus diimplementasikan sendiri jika Anda ingin menggunakannya.

*Framework* yang kami rekomendasikan juga membantu Anda membangun aplikasi dengan performa yang lebih baik. Misalnya, mengurangi atau menghilangkan *waterfall* dari permintaan jaringan menghasilkan pengalaman pengguna yang lebih baik. Ini mungkin bukan prioritas tinggi saat Anda membangun proyek mainan, tetapi jika aplikasi Anda melayani banyak pengguna, Anda mungkin ingin meningkatkan performanya.

Menggunakan cara ini juga akan mempersulit Anda untuk mendapatkan dukungan, karena cara Anda mengembangkan *routing*, pengambilan data, dan fitur lainnya akan berbeda-beda tergantung pada situasi Anda. Anda sebaiknya hanya memilih opsi ini jika Anda merasa nyaman mengatasi masalah ini sendiri, atau jika Anda yakin bahwa Anda tidak akan pernah membutuhkan fitur-fitur ini.

Untuk daftar *framework* yang direkomendasikan, lihat [Membuat Aplikasi React](/learn/creating-a-react-app).

</DeepDive>


## Langkah 1: Menginstal *build tool* {/*step-1-install-a-build-tool*/}

Langkah pertama adalah menginstal alat bantu seperti `vite`, `parcel`, atau `rsbuild`. Alat bantu ini menyediakan fitur untuk mengemas dan menjalankan kode sumber, menyediakan *server* pengembangan untuk pengembangan lokal, dan perintah *build* untuk memasang aplikasi Anda ke server produksi.

### Vite {/*vite*/}

[Vite](https://vite.dev/) adalah alat pengembangan yang bertujuan untuk menyediakan pengalaman pengembangan yang lebih cepat dan ramping untuk proyek web modern.

<TerminalBlock>
{`npm create vite@latest my-app -- --template react`}
</TerminalBlock>

Vite adalah alat pengembangan *opinionated* dan hadir dengan pengaturan bawaan yang masuk akal. Vite memiliki ekosistem plugin yang kaya untuk mendukung penyegaran cepat, JSX, Babel/SWC, dan fitur umum lainnya. Lihat [plugin React](https://vite.dev/plugins/#vitejs-plugin-react) atau [plugin React SWC](https://vite.dev/plugins/#vitejs-plugin-react-swc) dan [proyek contoh React SSR](https://vite.dev/guide/ssr.html#example-projects) Vite untuk memulai.

Vite sudah digunakan sebagai alat pembangunan di salah satu [*framework* yang kami rekomendasikan](/learn/creating-a-react-app): [React Router](https://reactrouter.com/start/framework/installation).

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/) menggabungkan pengalaman pengembangan *out-of-the-box* yang hebat dengan arsitektur berskala yang dapat membawa proyek Anda dari baru saja dimulai hingga aplikasi produksi besar-besaran.

<TerminalBlock>
{`npm install --save-dev parcel`}
</TerminalBlock>

Parcel mendukung *fast refresh*, JSX, TypeScript, Flow, dan *styling* secara langsung. Lihat [resep React Parcel](https://parceljs.org/recipes/react/#getting-started) untuk memulai.

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/) adalah alat pengembangan yang didukung Rspack yang menyediakan pengalaman pengembangan yang lancar untuk aplikasi React. Alat ini dilengkapi dengan pengaturan bawaan yang telah disesuaikan dengan cermat dan pengoptimalan kinerja yang siap digunakan.

<TerminalBlock>
{`npx create-rsbuild --template react`}
</TerminalBlock>

Rsbuild menyertakan dukungan bawaan untuk fitur React seperti *fast refresh*, JSX, TypeScript, dan *styling*. Lihat [panduan React Rsbuild](https://rsbuild.dev/guide/framework/react) untuk memulai.

<Note>

#### Metro untuk React Native {/*react-native*/}

Jika Anda memulai dari awal dengan React Native, Anda perlu menggunakan [Metro](https://metrobundler.dev/), *bundler* JavaScript untuk React Native. Metro mendukung *bundling* untuk *platform* seperti iOS dan Android, tetapi kekurangan banyak fitur jika dibandingkan dengan alat-alat di sini. Kami sarankan untuk memulai dengan Vite, Parcel, atau Rsbuild kecuali proyek Anda memerlukan dukungan React Native.

</Note>

## Langkah 2: Membangun Pola Aplikasi Umum {/*step-2-build-common-application-patterns*/}

The build tools listed above start off with a client-only, single-page app (SPA), but don't include any further solutions for common functionality like routing, data fetching, or styling.

The React ecosystem includes many tools for these problems. We've listed a few that are widely used as a starting point, but feel free to choose other tools if those work better for you.

### *Routing* {/*routing*/}

Routing determines what content or pages to display when a user visits a particular URL. You need to set up a router to map URLs to different parts of your app. You'll also need to handle nested routes, route parameters, and query parameters.  Routers can be configured within your code, or defined based on your component folder and file structures.

Routers are a core part of modern applications, and are usually integrated with data fetching (including prefetching data for a whole page for faster loading), code splitting (to minimize client bundle sizes), and page rendering approaches (to decide how each page gets generated).

We suggest using:

- [React Router](https://reactrouter.com/start/data/custom)
- [Tanstack Router](https://tanstack.com/router/latest)


### Pengambilan Data {/*data-fetching*/}

Fetching data from a server or other data source is a key part of most applications. Doing this properly requires handling loading states, error states, and caching the fetched data, which can be complex.

Purpose-built data fetching libraries do the hard work of fetching and caching the data for you, letting you focus on what data your app needs and how to display it.  These libraries are typically used directly in your components, but can also be integrated into routing loaders for faster pre-fetching and better performance, and in server rendering as well.

Note that fetching data directly in components can lead to slower loading times due to network request waterfalls, so we recommend prefetching data in router loaders or on the server as much as possible!  This allows a page's data to be fetched all at once as the page is being displayed.

If you're fetching data from most backends or REST-style APIs, we suggest using:

- [React Query](https://react-query.tanstack.com/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

If you're fetching data from a GraphQL API, we suggest using:

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)


### Pemisahan kode (*Code-splitting*) {/*code-splitting*/}

Pemisahan kode (*Code-splitting*) adalah proses memecah aplikasi Anda menjadi *bundle* yang lebih kecil yang dapat dimuat sesuai permintaan. Ukuran kode aplikasi bertambah dengan setiap fitur baru dan dependensi tambahan. Aplikasi dapat menjadi lambat dimuat karena semua kode untuk keseluruhan aplikasi perlu dikirim sebelum dapat digunakan. Menyimpan dalam *cache*, mengurangi fitur/dependensi, dan memindahkan beberapa kode untuk dijalankan di server dapat membantu mengurangi pemuatan yang lambat tetapi merupakan solusi yang tidak lengkap yang dapat mengorbankan fungsionalitas jika digunakan secara berlebihan.

Demikian pula, jika Anda mengandalkan aplikasi yang menggunakan *framework* Anda untuk memisahkan kode, Anda mungkin mengalami situasi di mana pemuatan menjadi lebih lambat daripada jika tidak ada pemisahan kode sama sekali. Misalnya, [memuat dengan lambat](/reference/react/lazy) sebuah komponen *chart* menunda pengiriman kode yang diperlukan untuk merender *chart*, memisahkan kode *chart* dari bagian aplikasi lainnya. [Parcel mendukung pemisahan kode dengan React.lazy](https://parceljs.org/recipes/react/#code-splitting). Namun, jika *chart* memuat datanya *setelah* awalnya dirender, Anda sekarang menunggu dua kali. Ini adalah *waterfall*: daripada mengambil data untuk *chart* dan mengirim kode untuk merendernya secara bersamaan, Anda harus menunggu setiap langkah selesai satu demi satu.

Memisahkan kode berdasarkan *route*, saat diintegrasikan dengan bundling dan pengambilan data, dapat mengurangi waktu muat awal aplikasi Anda dan waktu yang diperlukan untuk konten aplikasi yang paling terlihat ([Largest Contentful Paint](https://web.dev/articles/lcp)).

Untuk petunjuk pemisahan kode, lihat dokumen alat build Anda:
- [Optimasi *build* Vite](https://vite.dev/guide/features.html#build-optimizations)
- [Pemisahan kode Parcel](https://parceljs.org/features/code-splitting/)
- [Pemisahan kode Rsbuild](https://rsbuild.dev/guide/optimization/code-splitting)

### Meningkatkan Performa Aplikasi {/*improving-application-performance*/}

Karena alat *build* yang Anda pilih hanya mendukung aplikasi *single-page* (SPA), Anda perlu menerapkan [pola rendering](https://www.patterns.dev/vanilla/rendering-patterns) lain seperti *server-side rendering* (SSR), *static site generation* (SSG), dan/atau Komponen Server React (RSC). Meskipun Anda tidak memerlukan fitur-fitur ini pada awalnya, di masa mendatang mungkin ada beberapa jalur yang akan menguntungkan SSR, SSG, atau RSC.

* **Aplikasi *single-page* (SPA)** memuat satu halaman HTML dan memperbarui halaman secara dinamis saat pengguna berinteraksi dengan aplikasi. SPA lebih mudah untuk memulai, tetapi waktu muat awal dapat lebih lambat. SPA adalah arsitektur default untuk sebagian besar alat build.

* ***Streaming server-side rendering* (SSR)** merender halaman di server dan mengirimkan halaman yang telah dirender sepenuhnya ke klien. SSR dapat meningkatkan kinerja, tetapi dapat lebih rumit untuk disiapkan dan dipelihara daripada aplikasi satu halaman. Dengan penambahan *streaming*, SSR bisa sangat rumit untuk disiapkan dan dipelihara. Lihat [panduan SSR Vite]( https://vite.dev/guide/ssr).

* ***Static site generation* (SSG)** menghasilkan file HTML statis untuk aplikasi Anda pada waktu pembuatan. SSG dapat meningkatkan kinerja, tetapi bisa lebih rumit untuk disiapkan dan dipelihara daripada rendering sisi server. Lihat [panduan SSG Vite](https://vite.dev/guide/ssr.html#pre-rendering-ssg).

* **Komponen Server React (RSC)** memungkinkan Anda mencampur komponen waktu pembuatan, khusus server, dan interaktif dalam satu pohon React. RSC dapat meningkatkan kinerja, tetapi saat ini memerlukan keahlian mendalam untuk menyiapkan dan memeliharanya. Lihat [contoh RSC Parcel](https://github.com/parcel-bundler/rsc-examples).

Strategi rendering Anda perlu diintegrasikan dengan *router* Anda sehingga aplikasi yang dibangun dengan *framework* Anda dapat memilih strategi rendering pada tingkat per *route*. Ini akan memungkinkan strategi rendering yang berbeda tanpa harus menulis ulang seluruh aplikasi Anda. Misalnya, halaman landing untuk aplikasi Anda mungkin lebih baik jika dibuat secara statis (SSG), sementara halaman dengan umpan konten mungkin berkinerja terbaik dengan rendering sisi server.

Menggunakan strategi rendering yang tepat untuk *route* yang tepat dapat mengurangi waktu yang diperlukan untuk memuat byte konten pertama ([Time to First Byte](https://web.dev/articles/ttfb)), bagian konten pertama yang dirender ([First Contentful Paint](https://web.dev/articles/fcp)), dan konten aplikasi yang paling besar yang terlihat ([Largest Contentful Paint](https://web.dev/articles/lcp)).

### Dan masih banyak lagi... {/*and-more*/}

Ini hanyalah beberapa contoh fitur yang perlu dipertimbangkan aplikasi baru saat membangun dari awal. Banyak keterbatasan yang akan Anda hadapi yang mungkin sulit dipecahkan karena setiap masalah saling terkait satu sama lain dan dapat memerlukan keahlian mendalam di area masalah yang mungkin tidak Anda pahami.

Jika Anda tidak ingin memecahkan masalah ini sendiri, Anda dapat [memulai dengan *framework*](/learn/creating-a-react-app) yang menyediakan fitur-fitur ini secara langsung.
