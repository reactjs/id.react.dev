---
title: Memulai Proyek Baru dengan React
---

<Intro>

<<<<<<< HEAD
Jika Anda ingin membuat aplikasi baru atau situs web baru dengan menggunakan React, kami merekomendasikan Anda untuk memilih salah satu dari *framework* berbasis React yang populer di komunitas. *framework* menyediakan fitur-fitur yang sebagian besar aplikasi dan situs web butuhkan, termasuk *routing*, pengambilan data, dan pembuatan halaman HTML.
=======
If you want to build a new app or a new website fully with React, we recommend picking one of the React-powered frameworks popular in the community.
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

</Intro>


<<<<<<< HEAD
**Anda perlu menginstal [Node.js](https://nodejs.org/en/) untuk dapat melakukan pengembangan di ekosistem lokal.** Anda *juga* dapat menggunakan Node.js pada ekosistem *production*, namun Anda tidak harus melakukannya. Karena banyak *framework* React yang mendukung ekspor ke folder HTML/CSS/JS statis.
=======
You can use React without a framework, however we’ve found that most apps and sites eventually build solutions to common problems such as code-splitting, routing, data fetching, and generating HTML. These problems are common to all UI libraries, not just React.
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

By starting with a framework, you can get started with React quickly, and avoid essentially building your own framework later.

<DeepDive>

#### Can I use React without a framework? {/*can-i-use-react-without-a-framework*/}

You can definitely use React without a framework--that's how you'd [use React for a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **However, if you're building a new app or a site fully with React, we recommend using a framework.**

Here's why.

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.

**These problems are not React-specific. This is why Svelte has SvelteKit, Vue has Nuxt, and so on.** To solve these problems on your own, you'll need to integrate your bundler with your router and with your data fetching library. It's not hard to get an initial setup working, but there are a lot of subtleties involved in making an app that loads quickly even as it grows over time. You'll want to send down the minimal amount of app code but do so in a single client–server roundtrip, in parallel with any data required for the page. You'll likely want the page to be interactive before your JavaScript code even runs, to support progressive enhancement. You may want to generate a folder of fully static HTML files for your marketing pages that can be hosted anywhere and still work with JavaScript disabled. Building these capabilities yourself takes real work.

**React frameworks on this page solve problems like these by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects. Conversely, with a custom setup it's easier to get stuck on unsupported dependency versions, and you'll essentially end up creating your own framework—albeit one with no community or upgrade path (and if it's anything like the ones we've made in the past, more haphazardly designed).

If your app has unusual constraints not served well by these frameworks, or you prefer to solve these problems yourself, you can roll your own custom setup with React. Grab `react` and `react-dom` from npm, set up your custom build process with a bundler like [Vite](https://vitejs.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.

</DeepDive>

## Framework React berkelas produksi {/*production-grade-react-frameworks*/}

These frameworks support all the features you need to deploy and scale your app in production and are working towards supporting our [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). All of the frameworks we recommend are open source with active communities for support, and can be deployed to your own server or a hosting provider. If you’re a framework author interested in being included on this list, [please let us know](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

<<<<<<< HEAD
**[Next.js](https://nextjs.org/) adalah *full-stack framework* React.** *framework* ini serbaguna dan memudahkan Anda untuk membuat aplikasi React dalam berbagai ukuran--mulai dari halaman blog statis hingga aplikasi dinamis yang kompleks. Untuk membuat proyek Next.js, jalankan di terminal Anda:
=======
### Next.js {/*nextjs-pages-router*/}

**[Next.js' Pages Router](https://nextjs.org/) is a full-stack React framework.** It's versatile and lets you create React apps of any size--from a mostly static blog to a complex dynamic application. To create a new Next.js project, run in your terminal:
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

<<<<<<< HEAD
Jika Anda baru menggunakan Next.js, baca [panduan Next.js.](https://nextjs.org/learn/foundations/about-nextjs)
=======
If you're new to Next.js, check out the [learn Next.js course.](https://nextjs.org/learn)

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports a [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) which doesn't require a server.
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

Next.js dikelola oleh [Vercel](https://vercel.com/). Anda dapat [memasang aplikasi Next.js](https://nextjs.org/docs/deployment) ke semua ekosistem berbasis Node.js atau *serverless hosting* atau pada *server* Anda sendiri. [Aplikasi statis Next.js](https://nextjs.org/docs/advanced-features/static-html-export) dapat dipasang pada layanan *hosting* statis apa pun.
### Remix {/*remix*/}

**[Remix](https://remix.run/) adalah *full-stack framework* React yang menggunakan teknologi *nested routing*.** *framework* ini membantu Anda untuk dapat memecah aplikasi Anda ke dalam bagian - bagian bersarang yang dapat memuat data secara paralel dan melakukan *refresh* sebagai bentuk respon dari aksi yang dilakukan oleh pengguna. Untuk membuat proyek Remix, jalankan perintah:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Jika Anda baru menggunakan Remix, lihat [panduan membuat blog dengan Remix](https://remix.run/docs/en/main/tutorials/blog) (pendek) dan [panduan membuat aplikasi dengan Remix](https://remix.run/docs/en/main/tutorials/jokes) (panjang).

Remix dikelola oleh [Shopify](https://www.shopify.com/). Saat Anda membuat proyek Remix, Anda perlu untuk [memilih target pemasangan Anda](https://remix.run/docs/en/main/guides/deployment). Anda dapat memasang aplikasi Remix ke semua *hosting* Node.js atau *serverless* dengan menggunanakan atau menuliskan sebuah [adaptor](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) adalah *framework* React untuk situs web berbasis sistem manajemen konten cepat.** Ekosistem *plugin* yang dimiliki serta lapisan data GraphQL dari Gatsby dapat memudahkan Anda dalam melakukan integrasi konten, API, dan layanan ke dalam satu situs web. Untuk membuat proyek Gatsby baru, jalankan perintah:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Jika Anda baru menggunakan Gatsby, lihat [panduan Gatsby.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby dikelola oleh [Netlify](https://www.netlify.com/). Anda dapat [memasang situs statis Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) ke *hosting* statis apa pun. Jika Anda memilih untuk menggunakan fitur *server-only*, Anda perlu memastikan jika penyedia layanan *hosting* mendukung hal tersebut untuk Gatsby.

### Expo (untuk aplikasi native) {/*expo*/}

**[Expo](https://expo.dev/) adalah *framework* React yang membantu Anda untuk dapat membuat aplikasi universal untuk Android, iOS, dan web dengan menggunakan tampilan antarmuka pengguna yang asli bawaan dari *platform* tersebut (*native*).** *Framework* ini menyediakan kit pengembangan perangkat lunak (SDK) untuk [React Native](https://reactnative.dev/) yang membuat komponen *native* dapat digunakan dengan mudah. Untuk membuat proyek Expo baru, jalankan:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Jika Anda baru menggunakan Expo, lihat [panduan Expo](https://docs.expo.dev/tutorial/introduction/).

Expo dikelola oleh [Expo (perusahaan)](https://expo.dev/about). Anda dapat Membuat aplikasi menggunakan Expo secara gratis, dan Anda dapat mengirimkan aplikasi Anda ke Google Play Store dan Apple App Store tanpa syarat tertentu. Sebagai tambahan, Expo juga menyediakan pilihan layanan komputasi awan (*cloud*) berbayar.

<<<<<<< HEAD
<DeepDive>

#### Dapatkah saya menggunakan React tanpa menggunakan framework? {/*can-i-use-react-without-a-framework*/}

Anda dapat menggunakan React tanpa menggunakan *framework*--begitupun Anda dapat [menggunakan React untuk sebagian dari halaman proyek Anda.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **Namun, jika Anda ingin membuat aplikasi atau situs baru sepenuhnya menggunakan React, kami merekomendasikan Anda untuk menggunakan *framework*.**

Berikut alasannya.

Meskipun Anda tidak membutuhkan fungsi *routing* maupun pengambilan data di awal pembuatan proyek, suatu waktu Anda perlu menambahkan beberapa *library* baru untuk proyek tersebut. Semakin bertambahnya ukuran bundel JavaScript karena bertambahnya fitur baru, Anda perlu memikirkan bagaimana cara untuk memecah kode untuk setiap *route* secara individu. Dengan semakin kompleksnya kebutuhan pengambilan data, Anda mungkin akan menghadapi situasi semakin banyaknya permintaan jaringan antara *server* dan klien yang akan membuat aplikasi Anda terasa sangat lambat. Semakin banyak pengguna Anda dengan kondisi jaringan yang buruk dan perangkat dengan spesifikasi rendah serta fitur terbatas, Anda mungkin perlu untuk dapat membuat HTML dari komponen aplikasi Anda untuk bisa menampilkan konten aplikasi secara cepat--baik di *server*, atau saat waktu *build*. Mengubah susunan sistem untuk menjalankan kode di *server* atau saat waktu *build* sangatlah rumit.

**Masalah ini tidak hanya terjadi di React. Itulah mengapa Svelte memiliki SvelteKit, Vue memiliki Nuxt, dan lain sebagainya.** Untuk menyelesaikan masalah ini, Anda perlu untuk mengintegrasikan *bundler* Anda dengan *router* Anda dan dengan *library* pengambilan data Anda. Membuat pengaturan awal dapat bekerja bukanlah hal yang sulit, namun terdapat banyak seluk-beluk yang terlibat dalam pembuatan suatu aplikasi yang dapat memuat dengan cepat meskipun terus berkembang dari waktu ke waktu. Anda mungkin ingin mengirimkan kode aplikasi dalam jumlah seminimal mungkin namun dapat melakukannya dalam sekali jalan antara klien dan *server* pulang pergi, yang juga secara paralel dengan data apa pun yang dibutuhkan untuk halaman tersebut. Anda mungkin ingin membuat halaman menjadi interaktif bahkan sebelum kode JavaScript dijalankan, untuk dapat mendukung peningkatan progresif. Anda mungkin ingin membuat sebuah folder dengan semua berkas HTML statis untuk halaman marketing Anda yang dapat dipasang dimanapun dan dapat bekerja meskipun tanpa JavaScript. Membangun aplikasi dengan kemampuan seperti ini membutuhkan kerja keras dari Anda untuk mewujudkannya.

**Secara umum, *framework* React pada halaman ini dapat menyelesaikan masalah yang disebutkan sebelumnya, tanpa perlu usaha tambahan dari Anda.** React membantu Anda untuk dapat mulai membuat proyek dengan sangat ringkas dan kemudian mengembangkan aplikasi Anda sesuai kebutuhan Anda. Setiap *framework* React memiliki komunitas yang aktif, sehingga Anda akan dengan mudah untuk menemukan jawaban atas pertanyaan serta informasi terkait peningkatan peralatan Anda. *Framework* juga membantu Anda dalam menstrukturkan kode, membantu Anda dan orang lain untuk memahami konteks dan keterampilan di antara berbagai proyek. Sebaliknya dengan menggunakan pengaturan sendiri, Anda akan mudah terjebak pada versi dependensi yang sudah tidak didukung, dan pada akhirnya Anda akan membuat *framework* Anda sendiri tanpa komunitas dan rencana peningkataan untuk membantu *framework* tersebut terus berkembang (mungkin *framework* tersebut pun mirip seperti yang pernah kita buat di masa lalu, dengan desain yang lebih asal-asalan).

Jika Anda masih belum yakin, atau aplikasi Anda memiliki kendala tidak umum yang tidak dapat dilayani dengan baik oleh *framework* ini dan Anda ingin membuat pengaturan sendiri, kami tidak dapat menghentikan Anda--coba saja! Gunakan `react` dan `react-dom` dari npm, siapkan *bundler* proses *build* kostum Anda seperti [Vite](https://vitejs.dev/) atau [Parcel](https://parceljs.org/), dan peralatan lainnya sesuai kebutuhan Anda untuk *routing*, pembuatan halaman statis atau *server-side rendering*, dan lainnya.
</DeepDive>

## Framework React terbaru {/*bleeding-edge-react-frameworks*/}
=======
## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

Selama kami melakukan eksplorasi untuk meningkatkan kemampuan dan kualitas React, kami menyadari bahwa dengan mengintegrasikan React lebih dekat dengan berbagai macam *framework* (khususnya dengan teknologi *routing*, *bundling*, dan *server*), hal tersebut merupakan kesempatan terbesar kami untuk membantu pengguna React untuk dapat membuat aplikasi yang lebih baik. Tim Next.js setuju untuk berkolaborasi dengan kami dalam riset, pengembangan, integrasi, serta pengujian fitur-fitur React terkini seperti [React Server Components.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

Setiap hari, fitur-fitur ini semakin dekat untuk menjadi teknologi yang siap digunakan di tingkat *production*, dan kami telah berbicara dengan pengembang *bundler* dan *framework* lainnya untuk dapat mengintergrasikan hal tersebut. Kami berharap bahwa dalam satu atau dua tahun, seluruh *framework* yang terdaftar pada halaman ini akan mendapatkan dukungan penuh dari fitur - fitur ini. (Jika Anda adalah pencipta *framework* dan tertarik untuk berkerja sama dengan kami untuk bereksperimen dengan fitur - fitur ini, mohon untuk menghubungi kami!)

### *App Router* Next.js {/*nextjs-app-router*/}

<<<<<<< HEAD
**[*App Router* Next.js](https://beta.nextjs.org/docs/getting-started) adalah sebuah desain baru dari Next.js API yang bertujuan untuk memenuhi visi tim React mengenai arsitektur aplikasi *full-stack*.** Hal ini dapat membantu Anda untuk mengambil data pada komponen asinkron yang berjalan pada *server* atau saat waktu *build*.

Next.js dikelola oleh [Vercel](https://vercel.com/). Anda dapat [memasang aplikasi Next.js](https://nextjs.org/docs/deployment) ke semua ekosistem berbasis Node.js atau *serverless hosting* atau pada *server* Anda sendiri. Next.js juga mendukung [ekspor halaman statis](https://beta.nextjs.org/docs/configuring/static-export) yang tidak membutuhkan *server*.
<Pitfall>

*App Router* Next.js **saat ini dalam fase *beta* dan tidak direkomendasikan untuk implementasi di tingkat *production*** (per Bulan Maret 2023). Untuk mencoba bereksperimen dengan *App Router* dalam proyek Next.js yang ada, [ikuti panduan migrasi bertahap ini](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

</Pitfall>
=======
**[Next.js's App Router](https://nextjs.org/docs) is a redesign of the Next.js APIs aiming to fulfill the React team’s full-stack architecture vision.** It lets you fetch data in asynchronous components that run on the server or even during the build.

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) which doesn't require a server.
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

<DeepDive>

#### Fitur apa yang membentuk visi arsitektur aplikasi full stack dari tim React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

*Bundler* App Router Next.js sepenuhnya mengimplementasi [spesifikasi React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Hal ini memungkinkan Anda untuk dapat menggabungkan waktu *build*, *server-only*, dan komponen interaktif ke dalam satu pohon React.

Sebagai contoh, Anda dapat menulis komponen *server-only* React sebagai sebuah fungsi `async` yang dapat membaca data dari database atau sebuah berkas. Kemudian Anda dapat mengirimkan data tersebut ke komponen interaktif Anda:

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

*App Router* Next.js juga mengintegrasikan [pengambilan data dengan *Suspense*](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Hal ini memungkinkan Anda untuk menentukan status pemuatan (seperti kerangka *placeholder*) untuk berbagai komponen dari tampilan antar muka Anda langsung dari pohon React Anda:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

*Server Components* dan *Suspense* merupakan fitur dari React dan bukan fitur Next.js. Namun, menggunakannya pada tingkatan *framework* membutuhkan implementasi yang serius dan bukan hal yang mudah (*non-trivial*). Saat ini, *App Router* Next.js merupakan implementasi yang paling lengkap dari hal tersebut. Tim React saat ini sedang bekerja sama dengan pengembang *bundler* untuk membuat fitur ini dapat diimplementasikan pada *framework* generasi berikutnya.

</DeepDive>
