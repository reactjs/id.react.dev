---
title: useTransition
---

<Intro>

`useTransition` adalah sebuah React Hook yang memungkinkan Anda merubah suatu *state* tanpa memblokir *UI*.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useTransition()` {/*usetransition*/}

Panggil `useTransition` pada level teratas komponen Anda untuk menandai beberapa perubahan *state* sebagai transisi.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Lihat contoh lainnya dibawah ini.](#usage)

#### Parameters {/*parameters*/}

`useTransition` tidak menerima parameter apapun.

#### Returns {/*returns*/}

`useTransition` mengembalikan senarai dengan tepat dua item:

1. Penanda `isPending` yang memberitahukan Anda bahwa terdapat transisi yang tertunda.
2. [fungsi `startTransition`](#starttransition) yang memungkinkan Anda menandai perubahan *state* sebagai transisi.

---

### fungsi `startTransition` {/*starttransition*/}

Fungsi `startTransition` yang dikembalikan oleh `useTransition` memungkinkan Anda menandai perubahan *state* sebagai transisi.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### Parameters {/*starttransition-parameters*/}

* `scope`: Fungsi yang mengubah beberapa *state* dengan memanggil satu atau lebih [fungsi `set`.](/reference/react/useState#setstate) React segera memanggil `scope` dengan tanpa parameter dan menandai semua perubahan *state* yang dijadwalkan secara sinkron saat fungsi `scope` dipanggil sebagai transisi. Mereka akan menjadi [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) dan [tidak akan menampilkan indikator *render* yang tidak perlu.](#preventing-unwanted-loading-indicators)

#### Returns {/*starttransition-returns*/}

`startTransition` tidak mengembalikan apapun.

#### Perhatian {/*starttransition-caveats*/}

* `useTransition` adalah sebuah Hook, sehingga hanya bisa dipanggil di dalam komponen atau Hook *custom*. Jika Anda ingin memulai sebuah transisi di tempat lain (contoh, dari data *library*), sebaiknya panggil [`startTransition`](/reference/react/startTransition) sebagai gantinya.

* Anda dapat membungkus perubahan menjadi transisi hanya jika Anda memiliki akses pada fungsi `set` pada *state* tersebut. Jika Anda ingin memulai sebuah transisi sebagai balasan dari beberapa *prop* atau nilai Hook *custom*, coba gunakan [`useDeferredValue`](/reference/react/useDeferredValue) sebagai gantinya.

* Fungsi yang Anda kirimkan kepada `startTransition` haruslah sinkron. React akan langsung mengeksekusi fungsi ini, menandai semua perubahan *state* yang terjadi sambil mengeksekusinya sebagai transisi. Jika Anda mencoba untuk melakukan perubahan *state* lebih nanti (contoh, saat *timeout*), mereka tidak akan ditandai sebagai transisi.

* Perubahan *state* yang ditandai sebagai transisi akan terganggu oleh perubahan *state* lainnya. Contohnya, jika anda mengubah komponen chart di dalam transisi, namun kemudian memulai mengetik dalam input ketika chart sedang di tengah me*render* ulang, React akan me*render* ulang pekerjaan pada komponen chart setelah mengerjakan perubahan pada input.

* Perubahan transisi tidak dapat digunakan untuk mengontrol input teks.

* Apabila terdapat beberapa transisi yang berjalan, React saat ini akan mengelompokkan mereka bersama. Ini adalah limitasi yang mungkin akan dihapus pada rilis yang akan datang.

---

## Kegunaan {/*usage*/}

### Menandai perubahan state sebagai transisi non-blocking {/*marking-a-state-update-as-a-non-blocking-transition*/}

Panggil `useTransition` pada level teratas komponen Anda untuk menandai perubahan *state* sebagai *transisi* non-blocking.

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` mengembalikan sebuah senarai dengan tepat dua item:

1. Penanda <CodeStep step={1}>`isPending`</CodeStep> yang memberitahukan Anda apakah terdapat transisi tertunda.
2. Fungsi <CodeStep step={2}>`startTransition`</CodeStep> yang memungkinkan Anda menandai perubahan *state* sebagai transisi.

Kemudian Anda dapat menandai perubahan *state* sebagai transisi seperti berikut:

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transisi akan memungkinkan Anda untuk mempertahankan perubahan tampilan pengguna secara responsif bahkan untuk perangkat lambat.

Dengan transisi, UI Anda akan tetap responsif di tengah-tengah me-*render* ulang. Contohnya, jika pengguna menekan tab namun mereka berubah pikiran dan menekan tab lain, mereka dapat melakukan itu tanpa menunggu muat ulang pertama selesai.

<Recipes titleText="Perbedaan antara useTransition dan perubahan state biasa" titleId="examples">

#### Merubah tab saat ini dalam transisi {/*updating-the-current-tab-in-a-transition*/}

Pada contoh berikut ini, tab "Posts" ini **Dipelankan secara artifisial** sehingga akan memakan waktu setidaknya satu detik untuk *render*.

Tekan "Posts" kemudian segera tekan "Contact". Perhatikan bahwa ini akan mengganggu muatan "Posts" yang lambat. Tab "Contact" akan tampil segera. Karena perubahan *state* ini ditandai sebagai transisi, me*render* ulang yang lambat tidak akan membekukan tampilan pengguna.

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

#### Merubah tab saat ini tanpa transisi {/*updating-the-current-tab-without-a-transition*/}

Pada contoh berikut, tab "Posts" juga **Dipelankan secara artifisial** sehingga akan memakan waktu setidaknya satu detik untuk *render*. Berbeda dengan contoh sebelumnya, perubahan *state* ini **bukanlah sebuah transisi.**

Tekan "Posts" kemudian segera tekan "Contact". Perhatikan bahwa aplikasi membeku ketika render tab yang lambat, dan UI menjadi tidak responsive. Perubahan *state* ini bukanlah sebuah transisi, sehingga me-*render* ulang yang lambat membekukan tampilan pengguna.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Merubah komponen induk dalam transisi {/*updating-the-parent-component-in-a-transition*/}

Anda dapat mengubah *state* komponen induk dari panggilan `useTransition` juga. Contohnya, komponen `TabButton` ini membungkus logika komponen `onClick` dalam sebuah transisi:

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

Karena komponen induk merubah *state*nya di dalam event handler `onClick`, perubahan *state* tersebut akan ditandai sebagai transisi. Inilah mengapa, seperti pada contoh di awal, Anda dapat menekan pada "Posts" dan kemudian segera menekan "Contact". Mengubah tab yang dipilih akan ditandai sebagai transisi, sehingga itu tidak memblokir tampilan pengguna.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

### Menampilan state visual tertunda saat transisi {/*displaying-a-pending-visual-state-during-the-transition*/}

Anda dapat menggunakan nilai boolean `isPending` yang dikembalikan oleh `useTransition` untuk menandai ke pengguna bahwa transisi sedang berjalan. Contohnya, tombol tab dapat memiliki *state* visual special "pending":

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Perhatikan bagaimana menekan "Posts" sekarang terasa lebih responsif karena tombol tab tersebut berubah langsung:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### Mencegah indikator loading yang tidak diinginkan {/*preventing-unwanted-loading-indicators*/}

Pada contoh berikut ini, komponen `PostsTab` mengambil beberapa data menggunakan [Suspense-enabled](/reference/react/Suspense) data source. Ketika Anda menekan tab "Posts", komponen `PostsTab` akan di*suspends*, menyebabkan *fallback* loading terdekat untuk muncul:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Menyembunyikan seluruh tab container untuk menampilkan indikator loading akan mengarahkan ke pengalaman pengguna yang gemuruh. Jika Anda menambahkan `useTransition` ke `TabButton`, Anda bisa sebagai gantinya mengindikasi tampilan *state* pending di tombol tab sebagai gantinya.

Perhatikan bahwa menekan "Posts" tidak menjadikan seluruh tab container dengan spinner:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Baca lebih lanjut tentang menggunakan transisi dengan Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Transisi hanya akan "menunggu" cukup lama untuk menghindari konten *already revealed* (seperti tab container). Jika tab Posts memiliki [nested `<Suspense>` boundary,](/reference/react/Suspense#revealing-nested-content-as-it-loads) transisi tidak akan "menunggu" untuk itu.

</Note>

---

### Membangun router Suspense-enabled {/*building-a-suspense-enabled-router*/}

Jika Anda membangun React framework atau router, kami merekomendasikan menandai navigasi halaman sebagai transisi.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

Ini direkomendasikan karena dua alasan:

- [Transisi dapat terputus,](#marking-a-state-update-as-a-non-blocking-transition) yang memungkinkan pengguna mengklik tanpa menunggu me-*render* ulang selesai.
- [Transisi mencegah indikator loading yang tidak diinginkan,](#preventing-unwanted-loading-indicators) yang memungkinkan pengguna menghindari lompatan menggelegar pada navigasi.

Berikut adalah contoh router kecil sederhana menggunakan transisi untuk navigasi.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

Secara default, router [Suspense-enabled](/reference/react/Suspense) diharapkan untuk membungkus perubahan navigasi menjadi transisi.

</Note>

---

## Pemecahan Masalah {/*troubleshooting*/}

### Merubah input dalam transisi tidak bekerja {/*updating-an-input-in-a-transition-doesnt-work*/}

Anda tidak dapat menggunakan transisi unttuk variabel state yang mengendalikan input:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Can't use transitions for controlled input state
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

Ini dikarenakan transisi adalah non-blocking, namun mengubah input dalam respon untuk mengubah *event* seharusnya bekerja secara sinkron. Jika Anda ingin menjalankan transisi sebagai respon untuk menulis, Anda memiliki dua opsi:

1. Anda dapat mendeklarasikan dua variabel *state* berbeda: satu untuk *state* masukan ( yang selalu berubah secara sinkron), dan satu yang akan Anda ubah dalam transisi. Ini memungkinkan Anda mengendalikan masukan menggunakan *state* sinkron, dan mengirim variabel *state* transisi (yang akan "lag" dibelakang masukan) ke sisa logika *rendering* Anda.
2. Kalau tidak, Anda dapat memiliki satu variabel *state*, dan tambahkan [`useDeferredValue`](/reference/react/useDeferredValue) yang akan "lag" dibelakang nilai asli. Ini akan men*trigger* me*render* ulang non-blocking untuk "mengejar" dengan nilai baru secara otomatis.

---

### React tidak memperlakukan perubahan state saya sebagai transisi {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Ketika Anda membungkus perubahan *state* di dalam transisi, pastikan bahwa itu terjadi *saat* memanggil `startTransition`:

```js
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

Fungsi yang Anda kirimkan ke `startTransition` harus sinkron.

Anda tidak dapat menandakan perubahan sebagai transisi seperti berikut:

```js
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Sebaiknya, anda dapat melakukan hal berikut:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

Demikian pula, Anda tidak dapat menandai perubahan sebagai transisi seperti berikut:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Setting state *after* startTransition call
  setPage('/about');
});
```

Namun, ini bekerja sebagai gantinya:

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

---

### Saya ingin memanggil `useTransition` dari luar komponen {/*i-want-to-call-usetransition-from-outside-a-component*/}

Anda tidak dapat memanggil `useTransition` di luar sebuah komponen karena ini adalah sebuah Hook. Dalam kasus ini, sebaiknya gunakanlah *method* [`startTransition`](/reference/react/startTransition). Itu bekerja dengan cara yang sama, namun itu tidak dapat memberikan indikator `isPending`.

---

### Fungsi yang saya berikan ke `startTransition` tereksekusi langsung {/*the-function-i-pass-to-starttransition-executes-immediately*/}

Jika Anda menjalankan kode berikut, ini akan mencetak 1, 2, 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**Ini diharapkan untuk mencetak 1, 2, 3.** Fungsi yang Anda berikan ke `startTransition` tidak tertunda. Tidak seperti milik browser `setTimeout`, hal tersebut nantinya tidak menjalankan *callback*. React akan eksekusi fungsi Anda secara langsung, namun perubahan *state* yang terjadwal *saat berjalan* akan ditandai sebagai transisi. Anda dapat membayangkan hal tersebut bekerja seperti berikut:

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```
