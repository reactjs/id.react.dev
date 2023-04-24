---
id: hooks-state
title: Using the Effect Hook
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
> - [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
> - [`useEffect`](https://react.dev/reference/react/useEffect)

</div>

*Hooks* adalah tambahan baru di React 16.8. *Hooks* memungkinkan Anda dapat menggunakan *state* dan fitur lain di *React* tanpa menulis *class*.

*Effect Hook* memungkinkan Anda melakukan efek samping (*side effects*) didalam *function component*:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Mirip dengan componentDidMount dan componentDidUpdate:
  useEffect(() => {
    // Memperbarui judul dokumen menggunakan API browser
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Potongan code diatas berdasarkan pada [contoh *counter* dari halaman sebelumnya](/docs/hooks-state.html), tetapi kita menambahkan fitur baru didalamnya: kita akan mengisi judul dokumen dengan pesan kustom termasuk dari jumlah klik.

Pengambilan data, pengaturan berlangganan (*subscription*) , dan perubahan manual DOM di dalam komponen React adalah beberapa contoh dari efek samping. Apakah Anda terbiasa menyebut memanggil operasi ini dengan sebutan efek samping (atau hanya "efek (*effects*)") atau tidak, Anda mungkin pernah melakukannya di dalam komponen Anda sebelumnya.

>Tip
>
>Jika Anda familiar dengan *React class lifecycle methods*, Anda dapat menganggap *Hook* `useEffect` sebagai`componentDidMount`, `componentDidUpdate`, dan `componentWillUnmount` yang disatukan.

Terdapat 2 macam jenis efek samping didalam komponen React: yang tidak membutuhkan pembersihan, dan yang membutuhkan pembersihan. Mari lihat perbedaannya secara lebih detail.

## Effects Tanpa Pembersihan {#effects-without-cleanup}

Terkadang, kita ingin **menjalankan beberapa kode tambahan setelah React memperbarui DOM.** Permintaan jaringan, mutasi DOM manual, dan pencatatan adalah contoh umum dari *effects* yang tidak membutuhkan pembersihan. Kita mengatakan seperti itu karena kita dapat menjalankannya dan langsung melupakannya. Mari kita bandingkan bagaimana *kelas* dan *Hooks* memungkinkan kita mengekspresikan efek samping (*side effects*) seperti itu.

### Contoh Menggunakan Classes {#example-using-classes}

Di dalam sebuah *class components* React, *method* `render` itu sendiri tidak seharusnya menyebabkan efek samping. Efek samping akan dijalankan terlalu awal -- kita biasanya ingin melakukan sebuah efek setelah React memperbarui DOM.

Inilah kenapa didalam kelas *React*, kita meletakkan efek samping didalam `componentDidMount` dan `componentDidUpdate`. Kembali ke contoh kita, berikut adalah *class component counter* React yang memperbarui judul dokumen setelah React membuat perubahan pada DOM:

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

Perhatikan bagaimana **kita dapat menduplikasi kode antara dua *lifecycle methods* didalam *class*.**

Ini karena dalam banyak kasus kita ingin melakukan efek samping yang sama terlepas dari apakah komponen baru saja dipasang, atau jika sudah diperbarui. Secara konsep, kita ingin hal ini terjadi setelah setiap *render* -- tetapi *class component* React tidak memiliki  *method* seperti ini. Kita bisa menyalin dua *method* terpisah tetapi kita masih harus memanggilnya di dua tempat.

Sekarang mari kita lihat bahwa kita dapat melakukan hal yang sama dengan `useEffect` *Hook*.

### Contoh Menggunakan Hooks {#example-using-hooks}

Kita telah melihat contoh ini di bagian atas halaman ini , tapi mari kita lihat lebih dekat lagi dibawah ini:

```js{1,6-8}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**Apa yang dilakukan `useEffect`?** dengan menggunakan Hook ini, Anda mengatakan kepada *React* bahwa komponen Anda butuh menjalankan sestuatu setelah *render*. React akan mengingat fungsi yang Anda berikan (kita akan menyebutnya sebagai "*effect*"), dan panggil itu nanti setelah DOM melakukan pembaruan. Di dalam *effect*, kita menentukan *document title*, tapi kita bisa juga melakukan pengambilan data atau memanggil beberapa API imperatif lainnya.

**Kenapa `useEffect` dipanggil didalam komponen?** Meletakkan `useEffect` di dalam komponen memberikan kita akses kepada variabel *state* `count` (atau *props* apapun) langsung dari *effect*. Kita tidak membutuhkan API khusus untuk membacanya -- itu sudah dalam lingkup *function*. Hooks merangkul penutup JavaScript dan menghindari memperkenalkan APIs React-khusus dimana JavaScript sudah menyediakan solusinya.

**Apakah `useEffect` berjalan setiap setelah render?** Ya! Secara standar, `useEffect` berjalan setelah pertama kali render *dan* setiap setelah pembaruan. (Kita akan bicarakan nanti tentang [bagimana cara menyesuaikannya](#tip-optimizing-performance-by-skipping-effects).) alih-alih berpikir dalam hal "pemasangan" dan "pembaruan", Anda mungkin lebih mudah berpikir bawah *effects* terjadi "setelah *render*". React menjamin bahwa DOM telah diperbarui pada saat menjalankan *effects*.

### Penjelasan Lebih Detail {#detailed-explanation}

Sekarang kita tahu lebih banyak tentang *effects*, line ini seharusnya masuk akal:

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
}
```

Kita mendeklarasikan *`count` state variable*, lalu kita memberitahu pada *React* kita perlu menggunakan *effect*. Kita memberikan *function* kepada `useEffect` *Hook*. *Function* ini kita berikan *kepada* *effect* kita. didalam *effect* kita, kita mengatur judul dokumen menggunakan `document.title` browser API. Kita dapat membaca  `count` terakhir di dalam *effect* karena berada dalam lingkup fungsi kita. Ketika *React renders* komponen kita, itu akan mengingatkan *effect*  yang kita gunakan, lalu menjalankan *effect* setelah memperbarui DOM. Ini terjadi untuk setiap *render*, termasuk yang pertama di *render*.

Pengembang JavaScript yang berpengalaman mungkin memperhatikan bahwa *function* yang kita berikan kepada `useEffect` akan berbeda setiap render. Ini disengajai. Faktanya, inilah yang memungkinkan kita membaca nilai `count` dari dalam *effect* tanpa mengkhawatikan tentang getting stale. Setiap kali kita mengulangi-*render*, kita menjadwalkan *effect* yang berbeda, menggantikan yang sebelumnya. Di satu sisi, inilah yang membuat *effects* berjalan lebih dari bagian hasil render -- setiap *effect* memiliki render tertentu. Kita akan melihat lebih jelas mengapa itu sangat berguna [nanti pada halaman ini](#explanation-why-effects-run-on-each-update).

>Tip
>
>Tidak seperti `componentDidMount` atau `componentDidUpdate`, *effects* terjadwal dengan  `useEffect` tidak menghalangi browser dari memperbarui layar. Ini membuat applikasi Anda merasa lebih responsif. sebagian besar effects tidak perlu terjadi *synchronously*. Dalam kasus yang tidak biasa dimana mereka melakukan (seperti pengukuran tata letak), ada *Hook* [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) yang terpisah dengan API identik dengan `useEffect`.

## Effects dengan Pembersihan {#effects-with-cleanup}

Sebelumnya, kita melihat bagaimana cara mengeskpresikan efek samping (*side effects*) yang tidak membutuhkan pembersihan. Namun, beberapa *effects* bisa melakukannya. Sebagai contoh, **kita mungkin ingin mengatur *subscription*** ke beberapa sumber data eksternal. dalam hal ini, penting untuk membersihkan agar tidak menyebabkan kebocoran memori! Mari kita bandingkan bagaimana kita melakukannya dengan *classes* dan dengan *Hooks*.

### Contoh Menggunakan Classes {#example-using-classes-1}

Dalam *React class*, Anda biasanya akan mengatur set subscription dalam `componentDidMount`, dan membersihkannya di `componentWillUnmount`. Sebagai contoh, Katakanlah kita mempunyai modul `ChatAPI` yang memungkinkan kita mengikuti status online seorang teman. Berikut cara kita mengikuti dan menampilkan status itu menggunakan *class*:

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

Perhatikan bagaimana `componentDidMount` dan `componentWillUnmount` perlu saling membutuhkan satu sama lain. *Lifecycle methods* memaksa kita untuk split membagi logika ini meskipun kedua kode tersebut secara konseptual terkait dengan *effect* yang sama.

>Catatan
>
>Pembaca mungkin melihat bahwa contoh ini juga membutuhkan `componentDidUpdate` *method* agar sepenuhnya benar. Kita akan mengabaikan ini untuk saat ini tapi akan kembali kesana [dibagian selanjutnya](#explanation-why-effects-run-on-each-update) dari halaman ini.

### Contoh Menggunakan Hooks {#example-using-hooks-1}

Mari kita lihat bagaimana kita dapat menulis komponen ini dengan *Hooks*.

Anda mungkin akan berpikir bahwa kita memerlukan *effect* terpisah untuk melakukan pembersihan. Tapi kode untuk menambah dan menghapus *subscription* sangat erat terkait sehingga `useEffect` didesain agar bisa untuk bersama sama. Jika *effect* Anda mengembalikan sebuah *function*, React akan menjalakannya ketika sudah saat untuk melakukan pembersihan:

```js{6-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**Kenapa kita mengembalikan sebuah fungsi dari *effect* kita?** Ini adalah sebuah mekanisme pembersihan untuk *effects*. Setiap *effect* dapat mengembalikan sebuah *function* setelah pembersihan. Ini memungkinkan kami tetap menjaga logika untuk menambah dan menghapus sebuah *subscriptions* yang dekat satu sama lain. Mereka adalah bagian dari *effect* yang sama!

**Kapan tepatnya React membersihkan sebuah *effect*?** React menjalankan pembersihan ketika komponen dilepaskan. namun, apa yang kita pelajari diawal, *effects* berjalan untuk setiap render dan tidak hanya sekali. Inilah kenapa React *juga* membersihkan *effects* dari *render* sebelumnya, sebelum menjalankan *effects* di waktu yang berikutnya. Kami akan membahas [kenapa ini membantu dalam menghindari bugs](#explanation-why-effects-run-on-each-update) dan [bagaimana lebih memilih keluar dari kasus ini jika itu menciptakan masalah dalam performa](#tip-optimizing-performance-by-skipping-effects) nanti dibawah ini.

>Catatan
>
>Kita tidak harus mengembalikan *function* yang disebutkan dari *effect*. Kita menyebutnya `cleanup` disini untuk memperjelas tujuannya, tapi Anda dapat mengembalikan *arrow function* atau menyebutnya sesuatu yang berbeda.

## Recap {#recap}

Kita telah belajar bahwa `useEffect` memungkinkan kita mengekspresikan berbagai jenis efek samping (*side effects*) setelah komponen di *renders*. Beberapa *effects* mungkin membutuhkan pembersihan maka mereka mengembalikan sebuah *function*:

```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

*Effects* lain mungkin tidak harus melakukan fase pembersihan, dan tidak mengembalikan apapun.

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

*Effect Hook* menyatukan kedua *use cases* dengan satu API.

-------------

**Jika Anda merasa memiliki pemahaman yang baik tentang  bagimana cara kerja *Effect Hook*, atau jika Anda merasa kewalahan, Anda dapat melompat ke [halaman selanjutnya tentang Aturean dari Hooks](/docs/hooks-rules.html) now.**

-------------

## Tips untuk Menggunakan Effects {#tips-for-using-effects}

Kita akan melanjutkan halaman ini dengan pandangan mendalam pada beberapa aspek `useEffect` bahwa pengguna dari React yang berpengalaman mungkin akan penasaran. Jangan merasa harus mengerti mereka sekarang. Anda dapat selalu kembali ke halaman ini untuk berlajar lebih lanjut dan detail tentang *Effect Hook*.

### Tip: Gunakan Banyak Effects untuk Memisahkan Masalah {#tip-use-multiple-effects-to-separate-concerns}

Salah satu masalah yang kita uraikan dalam [Motivasi](/docs/hooks-intro.html#complex-components-become-hard-to-understand) untuk *Hooks* adalah bahwa *class lifecycle methods* sering mengandung logika yang tidak terkait, tapi logika yang terkait akan dipecah menjadi beberapa *methods*. Berikut adalah komponen yang menggabungkan antara *counter* dan logika indikator status teman dari contoh sebelumnya:

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

Perhatikan bagimana logika tersebut menetapkan `document.title` dipisah antara `componentDidMount` dan `componentDidUpdate`. Logika *subscription* juga dipecah antara `componentDidMount` dan `componentWillUnmount`. dan `componentDidMount` berisi kode kedua tugas tersebut.

Jadi, bagaimana Hooks dapat mengatasi masalah ini? Sama seperti [anda dapat menggunakan *State* *Hook* lebih dari satu kali](/docs/hooks-state.html#tip-using-multiple-state-variables), Anda juga dapat menggunakan beberapa *effects*. Ini memungkinkan kita memisahkan logika yang tidak terkait menjadi *effects* yang berbeda:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

**Hooks memungkinkan kita untuk membagi kode berdasarkan apa yang akan dilakukan** daripada *lifecycle method name*. React akan menerapkan *setiap* effect yang digunakan oleh komponen, sesuai urutannya.

### Penjelasan: Mengapa *Effects* Berjalan di Setiap Pembaruan {#explanation-why-effects-run-on-each-update}

Jika Anda terbiasa menggunakan *classes*, Anda mungkin bertanya-tanya mengapa fase pembersihan *effect* cleaup terjadi setelah setiap *render* ulang, dan tidak hanya sekali selama pelepasan. Mari kita lihat contoh praktis kenapa desain ini membatu kita membuat komponen dengan *bug* lebih sedikit.

[Sebelumnya dihalaman ini](#example-using-classes-1), kita memperkenalkan sebuah contoh komponen `FriendStatus` yang menampilkan apakah seorang teman sedang online atau tidak. *Class* kita membacah `friend.id` dari `this.props`, *subscribes* ke status teman setelah melakukan pemasangan pada komponen, dan *unsubscribes* selama pelepasan:

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**Tapi apa yang terjadi jika *props* `friend` berubah** saat komponen sudah ada di layar? Komponen kita akan terus menampilkan status online teman yang berbeda. Ini adalah bug. Kita juga akan menyebabkan kebocoran memory atau kerusakan saat pelepasan karena pemanggilan unsubscribe akan menggunakan *ID* teman yang salah.

Dalam *class component*, kita perlu menambahkan`componentDidUpdate` untuk menangani kasus ini:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe from the previous friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe to the next friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

Lupa untuk menangani `componentDidUpdate` dengan benar adalah sumber bug yang umum di applikasi React.

Sekarang coba perhatikan versi komponen ini yang menggunakan *Hooks*:

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Komponen ini tidak akan mengalami *bug* ini. (Tapi kita juga tidak melakukan perubahan apapun terhadapnya.)

Tidak ada kode spesial untuk menangani pembaruan karena `useEffect` menanganinnya secara *default*. Membersihkan *effects* sebelumnya sebelum menerapkan *effects* selanjutnya. Untuk menggambarkan hal ini, berikut adalah urutan pemanggilan *subscribe* dan pemanggilan unsubscribe yang dapat dihasilkan komponen ini dari waktu ke waktu:

```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
```

Tindakan ini memastikan konsistensi secara default dan mencegah bugs yang biasanya ada di *class components* karena kesalahan logika pembaruan.

### Tip: Mengoptimalkan Performa dengan Melewati Effects {#tip-optimizing-performance-by-skipping-effects}

Dalam beberapa kasus, Pembersihan atau penerapan *effect* setelah setiap *render* memungkinkan dapat menimbulkan masalah pada performa. Dalam *class components*, kita dapat menyelesaikan ini dengan menulis perbandingan ekstra dengan `prevProps` atau `prevState` di dalam `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

Kebutuhan ini cukup umum sehingga dibangun di `useEffect` *Hook API*. Anda dapat memberitahu React untuk *melewati* menerapkan *effect* jika nilai-nilai tertentu tidak ada yang berubah diantara yang di *renders* ulang. Untuk melakukannya, kirim *array* sebagai argumen opsiopan ke dua di `useEffect`:

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

Contoh di atas, kita mengirim `[count]` sebagai argumen kedua. Apa artinya ini ? Jika `count` = `5`, lalu komponen kira me-*renders* ulang dengan `count` yang jumlahnya masih sama dengan `5`, React akan membandingkan `[5]` dari *render* sebelumnya dan `[5]` dari *render* selanjutnya. Karena semua item di dalam *array* adalah sama yaitu (`5 === 5`), React akan melewati effect. Itulah optimasi dari kita.

Ketika kita me-*render* dengan `count` diperbarui ke `6`, React akan membandingkan item di dalam `[5]` *array* dari *render* sebelumnya kepada item di dalam `[6]` *array* dari *render* sesudahnya. Kali ini, React akan menerapkan kembali *effect* karena `5 !== 6`. jika ada beberapa item di dalam array, React akan menjalankan kembali *effect* bahkan jika hanya salah satu dari mereka yang berbeda.

Ini juga bekerja untuk *effects* yang menggunakan fase pembersihan:

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
```

Kedepannya, Argumen kedua mungkin ditambahkan secara otomatis oleh *build-time transformation*.

>Catatan
>
>Jika Anda menggunakan pengoptimasian ini, pastikan *array* memasukkan **nilai apapun dari lingkup luar yang berubah setiap saat dan yang digunakan oleh effect**. Jika tidak,kode Anda akan menjadi acuan nilai dari *renders* sebelumnya. Kita juga akan berdiskusi  tentang membahas optimasi yang lain di [Hooks API reference](/docs/hooks-reference.html).
>
>Jika Anda ingin menjalankan *effect* dan membersihkannya hanya sekali saja (saat pemasangan dan pelepasan), Anda dapat memberikan array kosong (`[]`) sebagai argument kedua. Ini memberi tahu React bahwa *effect* Anda tidak bergantung pada *nilai* apapun dari props atau state, sehingga *effect* itu tidak perlu untuk dijalankan kembali. Ini tidak ditangani sebagai  kasus tertentu -- melainkan itu mengikuti langsung dari cara input array bekerja. Ketika kita memberikan `[]` kepada yang biasa kita sebut `componentDidMount` dan `componentWillUnmount` mental model, kami sarankan untuk tidak menjadikannya kebiasaan karena menyebabkan bug, [seperti yang sudah pernah dibahas diatas](#explanation-why-effects-run-on-each-update). Jangan lupa bahwa React menolak untuk menjalankan `useEffect` hingga browser telah selesai dijalnkan, jadi melakukan pekerjaan ekstra tidak akan menjadi masalah.
>
>Kita merekomendasikan menggunakan aturan [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) dari package [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Ini akan memperingatkan ketika depedensi ditentukan dengan cara yang salah dan menyarankan perbaikan.


## Langkah Selanjutnya {#next-steps}

Selamat! Ini adalah halaman yang panjang, tapi semoga sebagian besar pertanyaan Anda tentang *effect* telah dijawab dihalaman ini. Anda telah mempelajari tentang *State Hook * dan *Effect Hook*, dan ada *banyak* hal yang dapat Anda lakukan dengan kedua hal tersebut. Mereka mencakup sebagian besar dari kasus penggunaan untuk classes -- maupun tidak, Anda mungkin menemukan [Hooks tambahan](/docs/hooks-reference.html) yang sangat membantu.

Kita juga mulai melihat bagaimana Hooks menyelesaikan masalah yang diuraikan dalam [Motivation](/docs/hooks-intro.html#motivation). Kita juga telah melihat bagaimana *effect* pembersihan menghindari duplikasi di `componentDidUpdate` dan `componentWillUnmount`, membuat code tersebut lebih dekat, dan membatu kita menghindari bug. Kita juga telah melihat bagaimana kita dapat memisahkan sebuah *effects* agar bisa dikelompokkan berdasarkan tujuannya, dan hal itu adalah sesuatu yang tidak dapat kita lakukan di *classes* yang sama.

Pada point ini Anda mungkin bertanya bagaimana cara *Hooks* bekerja. Bagaimana React tau bahwa `useState` memanggil menghubungi koresponden untuk menandai variabel state yang dirender ulang? Bagaimana cara React "mencocokan" sebelum dan sesudah *effects* pada setiap perubahan? **Pada selanjutnya kita akan belajar tentang [Rules of Hooks](/docs/hooks-rules.html) -- yang akan menjelaskan bagaimana *Hooks* bekerja.**