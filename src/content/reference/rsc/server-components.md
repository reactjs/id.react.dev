---
title: "Komponen Server React"
canary: true
---

<Intro>

Komponen Server adalah jenis Komponen baru yang dirender terlebih dahulu, sebelum proses bundling, di lingkungan yang terpisah dari aplikasi klien atau server SSR Anda.


</Intro>

Lingkungan terpisah ini adalah "server" dalam Komponen Server React. Komponen Server dapat dijalankan sekali saat build di server CI Anda, atau dapat dijalankan untuk setiap permintaan menggunakan web server.

<InlineToc />

<Note>


#### Bagaimana cara membangun dukungan untuk Komponen Server? {/*how-do-i-build-support-for-server-components*/}

Meskipun Komponen Server React di React 19 sudah stabil dan tidak akan rusak antar versi mayor, API dasar yang digunakan untuk mengimplementasikan bundler atau framework Komponen Server React tidak mengikuti semver dan dapat berubah antar versi minor di React 19.x.

Untuk mendukung Komponen Server React sebagai bundler atau framework, kami merekomendasikan untuk mengunci ke versi React tertentu, atau menggunakan rilis Canary. Kami akan terus bekerja sama dengan bundler dan framework untuk menstabilkan API yang digunakan untuk mengimplementasikan Komponen Server React di masa mendatang.

</Note>

### Komponen Server tanpa Server {/*server-components-without-a-server*/}
Komponen server dapat dijalankan saat proses build untuk membaca dari filesystem atau mengambil konten statis, sehingga web server tidak diperlukan. Sebagai contoh, Anda mungkin ingin membaca data statis dari sistem manajemen konten.

Tanpa Komponen Server, biasanya data statis diambil di klien menggunakan Effect:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // CATATAN: dimuat *setelah* render pertama halaman.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

Pola ini berarti pengguna perlu mengunduh dan mengurai tambahan pustaka sebesar 75K (gzipped), dan menunggu permintaan kedua untuk mengambil data setelah halaman dimuat, hanya untuk merender konten statis yang tidak akan berubah selama masa hidup halaman.

Dengan Komponen Server, Anda dapat merender komponen ini sekali saat proses build:

```js
import marked from 'marked'; // Tidak termasuk dalam bundel
import sanitizeHtml from 'sanitize-html'; // Tidak termasuk dalam bundel

async function Page({page}) {
  // CATATAN: dimuat *saat* render, ketika aplikasi dibangun.
  const content = await file.readFile(`${page}.md`);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

Output yang dirender kemudian dapat dirender di sisi server (SSR) ke HTML dan diunggah ke CDN. Ketika aplikasi dimuat, klien tidak akan melihat komponen `Page` yang asli, atau pustaka mahal untuk merender markdown. Klien hanya akan melihat output yang dirender:

```js
<div><!-- html for markdown --></div>
```

Ini berarti konten terlihat selama pemuatan halaman pertama, dan bundel tidak menyertakan pustaka mahal yang diperlukan untuk merender konten statis.

<Note>

Anda mungkin memperhatikan bahwa Komponen Server di atas adalah fungsi async:

```js
async function Page({page}) {
  //...
}
```

Komponen Async adalah fitur baru dari Komponen Server yang memungkinkan Anda untuk `await` saat merender.

Lihat [Komponen Async dengan Komponen Server](#async-components-with-server-components) di bawah ini.

</Note>

### Komponen Server dengan Server {/*server-components-with-a-server*/}
Komponen Server juga dapat dijalankan di web server saat ada permintaan untuk sebuah halaman, sehingga Anda dapat mengakses data secara langsung tanpa perlu membangun API. Komponen ini dirender sebelum aplikasi Anda dibundel, dan dapat meneruskan data serta JSX sebagai props ke Komponen Klien.

Tanpa Komponen Server, biasanya data dinamis diambil di klien menggunakan Effect:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // CATATAN: dimuat *setelah* render pertama.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);
  
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // CATATAN: dimuat *setelah* Note dirender.
  // Menyebabkan waterfall client-server yang mahal.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

Dengan Komponen Server, Anda dapat membaca data dan merendernya langsung di komponen:

```js
import db from './database';

async function Note({id}) {
  // CATATAN: dimuat *saat* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // CATATAN: dimuat *setelah* Note,
  // tapi akan cepat jika data berdekatan.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

Bundler kemudian akan menggabungkan data, Komponen Server yang sudah dirender, dan Komponen Klien dinamis ke dalam satu bundel. Opsional, bundel ini bisa dirender di sisi server (SSR) untuk membuat HTML awal halaman. Saat halaman dimuat, browser tidak akan melihat komponen `Note` dan `Author` asli; hanya output yang sudah dirender yang dikirim ke klien:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

Komponen Server dapat dibuat dinamis dengan mengambil ulang dari server, sehingga dapat mengakses data dan merender ulang. Arsitektur aplikasi baru ini menggabungkan model mental “request/response” sederhana dari Multi-Page Apps berbasis server dengan interaktivitas mulus dari Single-Page Apps berbasis klien, memberikan Anda keunggulan dari kedua dunia.

### Menambahkan interaktivitas ke Komponen Server {/*adding-interactivity-to-server-components*/}

Komponen Server tidak dikirim ke browser, jadi mereka tidak dapat menggunakan API interaktif seperti `useState`. Untuk menambahkan interaktivitas ke Komponen Server, Anda dapat menggabungkannya dengan Komponen Klien menggunakan direktif `"use client"`.

<Note>

#### Tidak ada direktif untuk Komponen Server. {/*there-is-no-directive-for-server-components*/}

Sebuah kesalahpahaman umum adalah bahwa Komponen Server ditandai dengan `"use server"`, tetapi tidak ada direktif untuk Komponen Server. Direktif `"use server"` digunakan untuk Server Actions.

Untuk info lebih lanjut, lihat dokumen untuk [Directives](/reference/rsc/directives).

</Note>


Dalam contoh berikut, Komponen Server `Notes` mengimpor Komponen Klien `Expandable` yang menggunakan state untuk mengubah status `expanded`:
```js
// Komponen Server
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Komponen Klien
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

Ini bekerja dengan pertama-tama merender `Notes` sebagai Komponen Server, dan kemudian menginstruksikan bundler untuk membuat bundel untuk Komponen Klien `Expandable`. Di browser, Komponen Klien akan melihat output dari Komponen Server yang diteruskan sebagai props:

```js
<head>
  <!-- the bundle for Client Components -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div> 
</body>
```

### Komponen Async dengan Komponen Server {/*async-components-with-server-components*/}

Komponen Server memperkenalkan cara baru untuk menulis Komponen menggunakan async/await. Ketika Anda `await` di dalam komponen async, React akan suspend dan menunggu promise untuk diselesaikan sebelum melanjutkan rendering. Ini bekerja di seluruh batas server/klien dengan dukungan streaming untuk Suspense.

Anda bahkan dapat membuat promise di server, dan menunggunya di klien:

```js
// Komponen Server
import db from './database';

async function Page({id}) {
  // Akan suspend Komponen Server.
  const note = await db.notes.get(id);
  
  // CATATAN: tidak ditunggu, akan mulai di sini dan menunggu di klien. 
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Komponen Klien
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // CATATAN: ini akan melanjutkan promise dari server.
  // Ini akan suspend sampai data tersedia.
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

Konten `note` adalah data penting untuk merender halaman, jadi kami `await` di server. Komentar berada di bawah lipatan dan memiliki prioritas lebih rendah, jadi kami memulai promise di server, dan menunggunya di klien dengan API `use` tersebut. Ini akan Suspend di klien, tanpa memblokir konten `note` untuk dirender.

Karena komponen async [tidak didukung di klien](#why-cant-i-use-async-components-on-the-client), kami menunggu promise dengan `use`.
