---
title: Membuat aplikasi React
---

<Intro>

Jika Anda ingin membuat aplikasi baru atau situs web baru dengan menggunakan React, kami merekomendasikan Anda untuk memulai dari *framework*.

</Intro>

If your app has constraints not well-served by existing frameworks, you prefer to build your own framework, or you just want to learn the basics of a React app, you can [build a React app from scratch](/learn/build-a-react-app-from-scratch).

## *Framework full-stack* {/*full-stack-frameworks*/}

These recommended frameworks support all the features you need to deploy and scale your app in production. They have integrated the latest React features and take advantage of React’s architecture.

<Note>

#### Full-stack frameworks do not require a server. {/*react-frameworks-do-not-require-a-server*/}

All the frameworks on this page support client-side rendering ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)), single-page apps ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)), and static-site generation ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)). These apps can be deployed to a [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) or static hosting service without a server. Additionally, these frameworks allow you to add server-side rendering on a per-route basis, when it makes sense for your use case.

This allows you to start with a client-only app, and if your needs change later, you can opt-in to using server features on individual routes without rewriting your app. See your framework's documentation for configuring the rendering strategy.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[*App Router* Next.js](https://nextjs.org/docs) adalah *framework* React yang memanfaatkan sepenuhnya arsitektur React untuk membangun aplikasi React *full-stack*.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js dikelola oleh [Vercel](https://vercel.com/). Anda dapat [memasang aplikasi Next.js](https://nextjs.org/docs/app/building-your-application/deploying) ke penyedia *hosting* yang mendukung Node.js atau kontainer Docker, atau pada *server* Anda sendiri. Next.js juga mendukung [ekspor halaman stasis](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) yang tidak membutuhkan *server*.

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) adalah pustaka *routing* paling populer untuk React dan dapat digabungkan dengan Vite untuk membuat *framework* React *full-stack***. Ia menekankan penggunaan API Web standar dan memiliki beberapa [*template* siap pakai](https://github.com/remix-run/react-router-templates) untuk berbagai macam *runtime* dan *platform* JavaScript.

Untuk membuat proyek *framework* React Router baru, jalankan:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router dikelola oleh [Shopify](https://www.shopify.com).

### Expo (untuk aplikasi *native*) {/*expo*/}

**[Expo](https://expo.dev/) adalah *framework* React yang memungkinkan Anda membangun aplikasi universal untuk Android, iOS, and web with antarmuka pengguna (UI) yang sesungguhnya *native*.** Ia menyediakan SDK untuk [React Native](https://reactnative.dev/) yang memudahkan penggunaan bagian-bagian *native*. Untuk membuat proyek Expo baru, jalankan:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Jika Anda baru menggunakan Expo, bacalah [tutorial Expo](https://docs.expo.dev/tutorial/introduction/).

Expo dikelola oleh [Expo (perusahaan)](https://expo.dev/about). Membangun aplikasi dengan Expo gratis, dan Anda dapat men-*submit* aplikasi Anda ke bursa aplikasi Google and Apple tanpa hambatan. Sebagai tambahan, Expo menyediakan layanan *cloud* opsional yang bersifat berbayar.


## *Framework* lain {/*other-frameworks*/}

Ada beberapa framework baru yang sedang berkembang yang berupaya mewujudkan visi React *full stack* kami:

- [TanStack Start (Beta)](https://tanstack.com/): TanStack Start adalah *framework* React *full-stack* yang ditenagai oleh TanStack Router. Ia menyediakan SSR di keseluruhan dokumen, *streaming*, fungsi *server*, *bundling*, dan lebih banyak lagi menggunakan perangkat seperti Nitro dan Vite.
- [RedwoodJS](https://redwoodjs.com/): Redwood adalah *framework* React *full stack* dengan berbagai macam *packages* dan konfigurasi yang sudah terpasang secara bawaan yang memudahkan pembangunan aplikasi web *full-stack*.

<DeepDive>

#### Fitur-fitur apa saja yang memenuhi visi arsitektur *full-stack* tim React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Bundler *App Router* Next.js mengimplementasikan [spesifikasi resmi Komponen Server React](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) secara penuh. Ini memungkinkan Anda menggabungkan komponen *build-time*, komponen khusus *server*, dan komponen interaktif dalam satu pohon komponen React.

Sebagai contoh, Anda dapat membuat komponen React khusus server sebagai fungsi `async` yang membaca dari sebuah database atau berkas. Kemudian Anda dapat meneruskan data menuju komponen interaktif Anda:

```js
// Komponen ini *hanya* berjalan di server (atau saat build).
async function Talks({ confId }) {
  // 1. Anda berada dalam server, jadi Anda dapat berkomunikasi dengan *data layer*. Tidak perlu *endpoint* API.
  const talks = await db.Talks.findAll({ confId });

  // 2. Tambahkan logika rendering sebanyak apapun. Tidak akan memperbesar *bundle* JavaScript Anda.
  const videos = talks.map(talk => talk.video);

  // 3. Teruskan data ke komponen yang akan berjalan di browser.
  return <SearchableVideoList videos={videos} />;
}
```

*App Router* Next.js juga mengintegrasikan [pengambilan data dengan Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Ini memungkinkan Anda menentukan *state* memuat (seperti *skeleton placeholder*) untuk bagian-bagian UI berbeda langsung di dalam pohon komponen React Anda:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Komponen Server dan Suspense adalah fitur React dan bukan fitur Next.js. Namun, mengadopsinya dalam tingat *framework* membutuhkan kerja keras dalam implementasi yang tidak sepele. Saat ini, the *App Router* Next.js memiliki implementasi yang paling lengkap. Tim React bekerja sama dengan pengembang *bundler* untuk membuat fitur-fitur ini lebih mudah diimplementasikan pada *framework* generasi berikutnya.

</DeepDive>

## Memulai dari Awal {/*start-from-scratch*/}

Jika aplikasi Anda memiliki kendala yang tidak dapat diatasi dengan baik oleh *framework* yang ada, Anda lebih suka membangun *framework* Anda sendiri, atau Anda hanya ingin mempelajari dasar-dasar aplikasi React, ada pilihan lain yang tersedia untuk memulai proyek React dari awal.

Memulai dari awal memberi Anda lebih banyak fleksibilitas, tetapi mengharuskan Anda membuat pilihan tentang alat mana yang akan digunakan untuk perutean, pengambilan data, dan pola penggunaan umum lainnya. Ini sangat mirip dengan membangun *framework* Anda sendiri, alih-alih menggunakan *framework* yang sudah ada. [*Framework* yang kami rekomendasikan](#full-stack-frameworks) memiliki solusi bawaan untuk masalah ini.

Jika Anda ingin membangun solusi Anda sendiri, lihat panduan kami untuk [membangun aplikasi React dari awal](/learn/build-a-react-app-from-scratch) untuk petunjuk tentang cara menyiapkan proyek React baru yang dimulai dengan alat pembangunan seperti [Vite](https://vite.dev/), [Parcel](https://parceljs.org/), atau [RSbuild](https://rsbuild.dev/).

-----

_Jika Anda sedang membangun framework dan Anda tertarik untuk memasukkan framework Anda ke halaman ini, [silakan hubungi kami](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
