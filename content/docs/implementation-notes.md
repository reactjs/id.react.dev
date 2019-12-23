---
id: implementation-notes
title: Catatan Implementasi
layout: contributing
permalink: docs/implementation-notes.html
prev: codebase-overview.html
next: design-principles.html
redirect_from:
  - "contributing/implementation-notes.html"
---

Bagian ini adalah kumpulan catatan implementasi untuk [*stack reconciler*](/docs/codebase-overview.html#stack-reconciler).

Ini sangat teknis dan mengasumsikan pemahaman yang kuat tentang API publik React serta bagaimana itu dibagi menjadi inti, *renderers*, dan *reconciler*. Jika anda tidak terlalu mengenal basis kode React, baca dahulu [ikhtisar basis kode](/docs/codebase-overview.html).

Ini juga mengasumsikan pemahaman tentang [perbedaan antara komponen React, *instances* mereka, dan elemen](/blog/2015/12/18/react-components-elements-and-instances.html).

*Stack reconciler* digunakan dalam React 15 dan sebelumnya. Terletak di [src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler).

### Video: Membangun React dari awal {#video-building-react-from-scratch}

[Paul O'Shannessy](https://twitter.com/zpao) memberi ceramah tentang [membangun React dari awal](https://www.youtube.com/watch?v=_MAD4Oly9yg) yang sebagian besar menginspirasi dokumen ini.

Baik dokumen ini maupun ceramahnya merupakan penyederhanaan basis kode nyata jadi anda mungkin mendapatkan pemahaman yang lebih baik dengan membiasakan diri dengan mereka berdua.

### Ikhtisar {#overview}

<<<<<<< HEAD
*Reconciler* sendiri tidak memiliki API publik. [*Renderers*](/docs/codebase-overview.html#stack-renderers) seperti React DOM dan React Native menggunakannya untuk memperbarui antarmuka pengguna secara efisien sesuai dengan komponen React yang ditulis oleh pengguna.
=======
The reconciler itself doesn't have a public API. [Renderers](/docs/codebase-overview.html#renderers) like React DOM and React Native use it to efficiently update the user interface according to the React components written by the user.
>>>>>>> 1dd4e325f070ce198aed69fd9cc5467563679e54

### Mounting sebagai proses rekursif{#mounting-as-a-recursive-process}

Mari kita pertimbangkan pertama kali anda pasang komponen:

```js
ReactDOM.render(<App />, rootEl);
```

React DOM akan oper `<App />` ke *reconciler*. Ingat bahwa `<App />` adalah elemen React, yaitu, deskripsi *apa* yang akan di *render*. Anda dapat menganggapnya sebagai objek biasa:

```js
console.log(<App />);
// { type: App, props: {} }
```

*Reconciler* akan memeriksa apakah `App` adalah kelas atau fungsi.
Jika `App` adalah fungsi, *reconciler* akan memanggil `App(props)` untuk mendapatkan elemen yang di *render*.

Jika `App` adalah kelas, *reconciler* akan *instantiate* sebuah `App` dengan `new App(props)`, panggil *method lifecycle* `componentWillMount()`, dan kemudian akan memanggil *method* `render()` untuk mendapatkan elemen yang di *render*.

Bagaimanapun juga, *reconciler* akan mempelajari elemen `App` *"rendered to"*.

Proses ini rekursif. `App` dapat di *render* menjadi `<Greeting />`, `Greeting` dapat di *render* menjadi `<Button />`, dan begitu seterusnya. *Reconciler* akan "menelusuri" melalui komponen yang ditentukan pengguna secara rekursif saat mempelajari apa yang di *render* oleh setiap komponen.

Anda dapat membayangkan proses ini sebagai *pseudocode*:

```js
function isClass(type) {
  // Subkelas React.Component memiliki *flag* ini
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Fungsi ini mengambil elemen React (misalnya <App />)
// dan mengembalikan DOM atau *node* Native yang mewakili diagram yang dipasang.
function mount(element) {
  var type = element.type;
  var props = element.props;

  // Kita akan menentukan elemen yang di *render*
  // dengan menjalankan tipe sebagai fungsi
  // atau membuat *instance* dan memanggil render().
  var renderedElement;
  if (isClass(type)) {
    // Komponen kelas
    var publicInstance = new type(props);
    // Atur *props*
    publicInstance.props = props;
    // Panggil *lifecycle* jika diperlukan
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // Dapatkan elemen yang di *render* dengan memanggil render()
    renderedElement = publicInstance.render();
  } else {
    // Komponen fungsi
    renderedElement = type(props);
  }

  // Proses ini rekursif karena komponen mungkin
  // mengembalikan elemen dengan tipe komponen lain.
  return mount(renderedElement);

  // Catatan: implementasi ini tidak lengkap dan berulang-ulang!
  // Ini hanya menangani elemen seperti <App /> atau <Button />.
  // Ini tidak menangani elemen seperti <div /> atau <p /> belum.
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

>**Catatan:**
>
>Implementasi di atas benar-benar *pseudo-code*, dan tidak mirip dengan implementasi nyata. Implementasi ini juga akan menyebabkan *stack overflow* karena kita belum membahas kapan harus menghentikan rekursi.

Mari kita rekap beberapa ide utama dalam contoh di atas:

* Elemen React adalah objek polos yang mewakili jenis komponen (mis. `App`) dan *props*.
* Komponen yang ditentukan pengguna(misalnya. `App`) dapat berupa kelas atau fungsi tetapi semuanya merupakan elemen *"render to"*.
* *"Mounting"* adalah proses rekursif yang membuat DOM atau diagram Native diberi elemen React tingkat atas (misalnya. `<App />`).

### Elemen Mounting Host {#mounting-host-elements}

Proses ini akan sia-sia jika kami tidak *render* sesuatu ke layar sebagai hasilnya.

Selain komponen yang ditentukan pengguna (*"composite"*), elemen React mungkin juga dapat mewakili komponen platform khusus ("*host*"). Sebagai contoh, `Button` mungkin mengembalikan `<div />` dari *method render*.

Jika properti elemen `type` adalah *string*, kami berurusan dengan elemen *host*:

```js
console.log(<div />);
// { type: 'div', props: {} }
```

Tidak ada kode yang ditentukan pengguna yang terkait dengan element *host*.

Ketika *reconciler* menjumpai elemen *host*, itu memungkinkan *renderer* mengurus *mounting*. Misalnya, React DOM akan membuat *node* DOM.

Jika elemen host memiliki *children*, *reconciler* secara rekursif me-*mount* mereka mengikuti algoritma yang sama seperti diatas. Tidak masalah apakah *children* adalah *host* (seperti `<div><hr /></div>`), komposit (seperti `<div><Button /></div>`), atau keduanya.

*Node* DOM diproduksi oleh komponen *child* akan ditambahkan ke *node parent* DOM, dan secara rekursif, struktur DOM lengkap akan dirakit.

>**Catatan:**
>
>*Reconciler* sendiri tidak terikat dengan DOM. Hasil *mounting* yang tepat (kadang disebut *"image mount"* dalam *source code*) tergantung pada *renderer*, dan bisa menjadi *node* DOM (React DOM), *string* (React DOM Server), atau *number* mewakili tampilan asli (React Native).

Jika kami memperluas kode untuk menangani elemen *host*, akan terlihat seperti ini:

```js
function isClass(type) {
  // Subkelas React.Component memiliki *flag* ini
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Fungsi ini hanya menangani elemen dengan tipe komposit.
// Sebagai contoh, ia menangani <App /> dan <Button />, tetapi bukan <div />.
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    // Komponen kelas
    var publicInstance = new type(props);
    // Atur *props*
    publicInstance.props = props;
    // Panggil *lifecycle* jika diperlukan
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // Komponen fungsi
    renderedElement = type(props);
  }

  // Ini bersifat rekursif tetapi pada akhirnya kami akan mencapai dasar rekursif ketika
  // elemen adalah *host* (misalnya <div />) daripada komposit (misalnya <App />):
  return mount(renderedElement);
}

// Fungsi ini hanya menangani elemen dengan tipe *host*
// Sebagai contoh, ia menangani <div /> dan <p /> bukan <App />.
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);

  // Blok kode ini seharusnya tidak ada di dalam *reconciler*.
  // *Renderers* yang berbeda mungkin menginisialisasi *node* secara berbeda.
  // Sebagai contoh, React Native akan membuat tampilan iOS atau Android.
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  // Pasang *children*
  children.forEach(childElement => {
    // *Children* dapat berupa *host* (e.g. <div />) atau komposit (e.g. <Button />).
    // Kami juga akan memasang mereka secara rekursif:
    var childNode = mount(childElement);

    // Baris kode ini juga khusus *renderer*.
    // Ini akan berbeda tergantung pada *renderer*:
    node.appendChild(childNode);
  });

  // Kembalikan *node* DOM sebagai hasil pemasangan.
  // Di sinilah rekursi berakhir.
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Komponen yang ditentukan pengguna
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // Komponen khusus platform
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

Kode ini bekerja, tetapi masih jauh dari bagaimana *reconciler* benar-benar dilaksanakan. Bahan utama yang hilang adalah dukungan untuk pembaruan.

### Memperkenalkan Instance Internal {#introducing-internal-instances}

Fitur utama dari React adalah anda dapat *render* ulang semuanya, dan itu tidak akan membuat ulang DOM atau mengatur ulang *state*:

```js
ReactDOM.render(<App />, rootEl);
// Harus menggunakan kembali DOM yang ada:
ReactDOM.render(<App />, rootEl);
```

Namun, implementasi kami di atas hanya tahu cara memasang diagram awal. Itu tidak dapat melakukan pembaruan karena itu tidak menyimpan semua informasi yang diperlukan, seperti semua `publicInstance`, atau `node` DOM yang sesuai dengan komponen yang mana.

Basis kode *stack reconciler* memecahkan ini dengan membuat fungsi `mount()` menjadi *method* dan meletakannya di kelas. Ada beberapa kelemahan dari pendekatan ini, dan kita akan berada di arah yang berlawanan dalam [penulisan ulang *reconciler* yang sedang berlangsung](/docs/codebase-overview.html#fiber-reconciler). Namun demikian inilah cara kerjanya sekarang.

Alih-alih memisahkan fungsi `mountHost` dan `mountComposite`, kami akan membuat dua kelas: `DOMComponent` dan `CompositeComponent`.

Kedua kelas memiliki *constructor* yang menerima `element`, serta *method* `mount()` yang mengembalikan *node* yang dipasang. Kami akan mengganti fungsi `mount()` tingkat atas dengan *factory* yang membuat kelas yang benar:

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Komponen yang ditentukan pengguna
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // Komponen khusus platform
    return new DOMComponent(element);
  }  
}
```

Pertama, mari kita pertimbangkan implementasi `CompositeComponent`:

```js
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    // Untuk komponen komposit, buka instance kelas.
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // Komponen Kelas
      publicInstance = new type(props);
      // Atur props
      publicInstance.props = props;
      // Panggil lifecycle jika diperlukan
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Komponen Fungsi
      publicInstance = null;
      renderedElement = type(props);
    }

    // Simpan instance publik
    this.publicInstance = publicInstance;

    // Instantiate instance child internal sesuai dengan elemen.
    // Ini akan menjadi DOMComponent untuk <div /> atau <p />,
    // dan CompositeComponent untuk <App /> atau <Button />:
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Pasang keluaran yang di render
    return renderedComponent.mount();
  }
}
```

Ini tidak jauh berbeda dari implementasi `mountComposite()` kami sebelumnya, tetapi sekarang kami dapat menyimpan beberapa informasi, seperti `this.currentElement`, `this.renderedComponent`, dan `this.publicInstance`, untuk digunakan selama pembaruan.

Perhatikan bahwa *instance* `CompositeComponent` tidak sama dengan *instance* dari `element.type` yang disediakan pengguna. `CompositeComponent` adalah detail implementasi dari *reconciler* kami, dan tidak pernah di ekspos ke pengguna. Kelas yang ditentukan pengguna adalah yang kita baca dari `element.type`, dan `CompositeComponent` menciptakan *instance* dari itu.

Untuk menghindari kebingungan, kami akan memanggil *instance* `CompositeComponent` dan `DOMComponent` "*instance* internal". Mereka ada sehingga kami dapat mengaitkan beberapa data *long-lived* dengan mereka. Hanya *renderer* dan *reconciler* yang menyadari bahwa mereka ada.

Sebaliknya, kami menyebut *instance* kelas yang ditentukan pengguna sebagai "*instance* publik". *Instance* publik adalah apa yang ada lihat sebagai `this` di `render()` dan *method* lain dari komponen *custom* anda.

Fungsi `mountHost()`, yang di tulis ulang menjadi *method* `mount()` pada kelas `DOMComponent`, juga tampak familier:

```js
class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    // Untuk komponen DOM, hanya mengekspos *node* DOM.
    return this.node;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;
    var children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    // Buat dan simpan *node*
    var node = document.createElement(type);
    this.node = node;

    // Atur atributnya
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // Buat dan simpan children yang dibungkus.
    // Masing-masing dari mereka dapat menjadi DOMComponent atau CompositeComponent,
    // tergantung pada apakah tipe elemen adalah string atau fungsi.
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // Kumpulkan node DOM yang mereka kembalikan saat pemasangan
    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    // Kembalikan node DOM node sebagai hasil pemasangan
    return node;
  }
}
```

Perbedaan utama setelah menulis ulang dari `mountHost()` adalah sekarang kita menyimpan `this.node` dan `this.renderedChildren` yang terkait dengan *instance* komponen DOM internal. Kami juga akan menggunakannya untuk menerapkan pembaruan yang tidak merusak di masa mendatang.

Akibatnya, setiap *instance* internal, komposit atau *host*, sekarang menuju ke *instance* internal *child*. Untuk membantu memvisualisasikan ini, jika fungsi komponen `<App>` me-*render* komponen kelas `<Button>`, dan kelas `Button`  me-*render* sebuah `<div>`, diagram *instance* internal akan terlihat seperti ini:

```js
[object CompositeComponent] {
  currentElement: <App />,
  publicInstance: null,
  renderedComponent: [object CompositeComponent] {
    currentElement: <Button />,
    publicInstance: [object Button],
    renderedComponent: [object DOMComponent] {
      currentElement: <div />,
      node: [object HTMLDivElement],
      renderedChildren: []
    }
  }
}
```

Dalam DOM Anda hanya akan melihat `<div>`. Namun diagram *instance* internal berisi komposit dan *instance* internal *host*.

*Instance* internal komposit perlu disimpan:

* Elemen saat ini.
* *Instance* publik jika tipe elemen adalah kelas.
* Satu *instance* internal yang di *render*. Itu bisa berupa `DOMComponent` atau `CompositeComponent`.

*Instance* internal *host* perlu disimpan:

* Elemen saat ini.
* *Node* DOM.
* Semua *instance* internal *child*. Masing-masing dari mereka dapat berupa `DOMComponent` atau `CompositeComponent`.

Jika anda kesulitan membayangkan bagaimana struktur *instance* internal terstruktur dalam aplikasi yang lebih kompleks, [React DevTools](https://github.com/facebook/react-devtools) dapat memberi anda perkiraan yang mendekati, karena menyoroti *instance host* dengan contoh warna abu-abu, dan *instance* komposit dengan warna ungu:

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

Untuk menyelesaikan penulisan ulang ini, kami akan memperkenalkan fungsi yang memasang diagram lengkap ke *node container*, juga seperti `ReactDOM.render()`. Ia mengembalikan *instance* publik, juga seperti `ReactDOM.render()`:

```js
function mountTree(element, containerNode) {
  // Buat instance internal tingkat atas
  var rootComponent = instantiateComponent(element);

  // Pasang komponen tingkat atas ke dalam container
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Kembalikan instance publik yang disediakannya
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### Unmounting {#unmounting}

Sekarang kami memiliki *instance* internal yang menampung *children* mereka dan *node* DOM, kami dapat menerapkan *unmounting*. Untuk komponen komposit, *unmounting* memanggil *method lifecycle* dan berulang.

```js
class CompositeComponent {

  // ...

  unmount() {
    // Panggil method lifecycle jika diperlukan
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Lepaskan komponen tunggal yang di*render*
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```

Untuk `DOMComponent`, *unmounting* memberitahu setiap *child* untuk *unmount*:

```js
class DOMComponent {

  // ...

  unmount() {
    // Lepaskan semua *children*
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

Dalam praktiknya, *unmounting* komponen DOM juga menghapus *event listener* dan menghapus beberapa *cache*, tetapi kami akan melewatkan detail itu.

Kita sekarang dapat menambahkan fungsi tingkat atas baru yang disebut `unmountTree(containerNode)` yang mirip dengan `ReactDOM.unmountComponentAtNode()`:

```js
function unmountTree(containerNode) {
  // Baca instance internal dari node DOM:
  // (Ini belum berfungsi, kita perlu mengubah mountTree() untuk menyimpannya.)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // Lepas diagram dan bersihkan *container*
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

Agar ini berfungsi, kita perlu membaca *instance root* internal dari *node* DOM. Kami akan memodifikasi `mountTree()` untuk menambahkan properti `_internalInstance` ke *root node* DOM. Kami juga akan mengajarkan `mountTree()` untuk menghancurkan diagram yang ada sehingga dapat dipanggil beberapa kali:

```js
function mountTree(element, containerNode) {
  // Hancurkan diagram yang ada
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // Buat instance internal tingkat atas
  var rootComponent = instantiateComponent(element);

  // Pasang komponen tingkat atas kedalam container
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Simpan referensi ke instance internal
  node._internalInstance = rootComponent;

  // Kembalikan instance publik yang disediakannya
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

Sekarang, jalankan `unmountTree()`, atau jalankan `mountTree()` berulang kali, hapus hierarki yang lama dan jalankan *method lifecycle* `componentWillUnmount()` pada komponen.

### Memperbarui {#updating}

Di bagian sebelumnya, kami menerapkan *unmounting*. Namun React tidak akan sangat berguna jika setiap perubahan *prop* dilepas dan dipasang seluruh diagram. Tujuan dari *reconciler* adalah menggunakan kembali *instances* yang ada di mana mungkin untuk melestarikan DOM dan *state*:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Harus menggunakan kembali DOM yang ada:
mountTree(<App />, rootEl);
```

Kami akan memperpanjang kontrak *instance* internal kami dengan satu *method* lagi. Selain `mount()` dan `unmount()`, `DOMComponent` dan `CompositeComponent` akan menerapkan *method* baru yang disebut `receive(nextElement)`:

```js
class CompositeComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}

class DOMComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}
```

Tugasnya adalah melakukan apa pun yang diperlukan untuk memperbarui komponen (dan *children*-nya) dengan deskripsi yang disediakan oleh `nextElement`.

Ini adalah bagian yang sering digambarkan sebagai "*virtual DOM diffing*" walaupun yang sebenarnya terjadi adalah kita menjalankan diagram internal secara rekursif dan membiarkan setiap *instance* internal menerima pembaruan.

### Memperbarui Komponen Komposit {#updating-composite-components}

Ketika komponen komposit menerima elemen baru, kami menjalankan *method lifecycle* `componentWillUpdate()`.

Lalu kami *render* ulang komponen dengan *props* baru, dan mendapatkan elemen yang di*render* berikutnya:

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Perbarui elemen *sendiri*
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Cari tahu apa hasil render() berikutnya
    var nextRenderedElement;
    if (isClass(type)) {
      // Komponen kelas
      // Panggil lifecycle jika diperlukan
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Perbaru props
      publicInstance.props = nextProps;
      // Render ulang
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Komponen fungsi
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Selanjutnya, kita bisa melihat elemen `type` yang di-*render*. Jika `type` belum berubah sejak *render* terakhir, komponen di bawah ini juga dapat diperbarui di tempat.

Misalnya, jika ia mengembalikan `<Button color="red" />` pertama kalinya, dan `<Button color="blue" />` untuk kedua kalinya, kami hanya bisa memberi tahu *instance* internal terkait untuk `receive()` elemen selanjutnya:

```js
    // ...

    // Jika tipe elemen yang di render tidak berubah,
    // gunakan kembali instance komponen yang ada dan keluar.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

Namun, jika elemen yang di-*render* berikutnya memiliki `type` yang berbeda dari elemen yang di-*render* sebelumnya, kami tidak dapat memperbarui *instance* internal. Sebuah `<button>` tidak bisa "menjadi" sebuah `<input>`.

Sebagai gantinya, kita harus lepaskan *instance* internal yang ada dan pasang yang baru yang sesuai dengan tipe elemen yang di*render*. Sebagai contoh, inilah yang terjadi ketika komponen yang sebelumnya me*render* `<button />` me*render* `<input />`:

```js
    // ...

    // Jika kita mencapai titik ini, kita perlu meng-unmount sebelumnya
    // komponen yang dipasang, pasang yang baru, dan tukar node mereka.

    // Temukan node lama karena perlu diganti
    var prevNode = prevRenderedComponent.getHostNode();

    // Lepas child lama dan pasang child baru
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Ganti referensi dengan child
    this.renderedComponent = nextRenderedComponent;

    // Ganti node lama dengan yang baru
    // Catatan: ini adalah kode renderer khusus dan
    // idealnya harus hidup di luar CompositeComponent:
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

Singkatnya, ketika komponen komposit menerima elemen baru, ia dapat mendelegasikan pembaruan ke *instance* internal yang di-*render*, atau melepaskan dan pasang yang baru di tempatnya.

Ada kondisi lain di mana komponen akan dipasang kembali daripada menerima elemen, dan saat itulah elemen `key` telah berubah. Kami tidak membahas penanganan `key` dalam dokumen ini karena menambah kompleksitas pada tutorial yang sudah kompleks.

Perhatikan bahwa kami perlu menambahkan *method* yang disebut `getHostNode()` ke kontrak *instance* internal sehingga memungkinkan untuk menemukan *node* platform khusus dan menggantinya selama pembaruan. Implementasinya sangat mudah untuk kedua kelas:
 
```js
class CompositeComponent {
  // ...

  getHostNode() {
    // Tanyakan komponen yang di-*render* untuk menyediakannya.
    // Ini akan menelusuri setiap komposit secara rekursif.
    return this.renderedComponent.getHostNode();
  }
}

class DOMComponent {
  // ...

  getHostNode() {
    return this.node;
  }  
}
```

### Memperbarui Komponen Host {#updating-host-components}

Implementasi komponen *host*, seperti `DOMComponent`, perbarui secara berbeda. Ketika mereka menerima elemen, mereka perlu memperbaru tampilan platform spesifik yang mendasarinya. Dalam kasus React DOM, ini berarti memperbarui atribut DOM:

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // Hapus atribut lama.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Tetapkan atribut berikutnya.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

Kemudian, komponen *host* perlu memperbarui *children* mereka. Tidak seperti komponen komposit, mereka mungkin mengandung lebih dari satu *child*.

Dalam contoh yang disederhanakan ini, kami menggunakan senarai *instance* internal dan mengulanginya, memperbarui atau mengganti *instance* internal tergantung pada apakah `type` yang diterima cocok dengan `type` sebelumnya. *Reconciler* nyata juga mengambil elemen `key` dalam akun dan melacak pergerakan selain penyisipan dan penghapusan, tetapi kami akan menghilangkan logika ini.

Kami mengumpulkan operasi DOM pada *children* dalam daftar sehingga kami dapat menjalankannya dalam *batch*:

```js
    // ...

    // Ini adalah senarai elemen React
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // Ini adalah senarai dari instance internal:
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // Saat kita beralih ke children, kita akan menambahkan operasi ke senarai.
    var operationQueue = [];

    // Catatan: bagian di bawah ini sangat disederhanakan!
    // Itu tidak menangani pemesanan ulang, *children* dengan *holes*, atau *key*.
    // Itu hanya ada untuk menggambarkan aliran keseluruhan, bukan spesifik.

    for (var i = 0; i < nextChildren.length; i++) {
      // Cobalah untuk mendapatkan *instance* internal yang ada untuk *child* ini
      var prevChild = prevRenderedChildren[i];

      // Jika tidak ada *instance* internal di bawah indeks ini,
      // *child* telah ditambahkan sampai akhir. Buat yang baru
      // *instance* internal, pasang, dan gunakan *node*nya.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Catat bahwa kita perlu menambahkan sebuah *node*
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Kami hanya dapat memperbarui *instance* jika tipe elemennya cocok.
      // Misalnya, <Button size="small" /> dapat diperbaru ke
      // <Button size="large" /> tetapi tidak ke <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // Jika kita tidak dapat memperbarui *instance* yang ada, kita harus melepasnya
      // dan pasang yang baru sebagai gantinya.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Catat bahwa kita perlu menukar kode
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Jika kita dapat memperbarui *instance* internal yang ada,
      // biarkan saja menerima elemen berikutnya dan menangani pembaruannya sendiri.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Akhirnya, lepaskan semua *children* yang tidak ada:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Catat bahwa kita perlu menghapus *node*
      operationQueue.push({type: 'REMOVE', node});
    }

    // Arahkan daftar *children* yang di*render* ke versi yang diperbarui.
    this.renderedChildren = nextRenderedChildren;

    // ...
```

Sebagai langkah terakhir, kami menjalankan operasi DOM. Sekali lagi, kode *reconciler* nyata lebih kompleks karena ia juga menangani gerakan:

```js
    // ...

    // Memproses antrian operasi.
    while (operationQueue.length > 0) {
      var operation = operationQueue.shift();
      switch (operation.type) {
      case 'ADD':
        this.node.appendChild(operation.node);
        break;
      case 'REPLACE':
        this.node.replaceChild(operation.nextNode, operation.prevNode);
        break;
      case 'REMOVE':
        this.node.removeChild(operation.node);
        break;
      }
    }
  }
}
```

Dan itu untuk memperbarui komponen *host*

### Pembaruan Tingkat Atas {#top-level-updates}

Sekarang setelah `CompositeComponent` dan `DOMComponent` menerapkan *method* `receive(nextElement)`, kita dapat mengubah fungsi `mountTree()` tingkat atas untuk menggunakanny ketika elemen `type` sama dengan yang terakhir kali:

```js
function mountTree(element, containerNode) {
  // Periksa diagram yang ada
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // Jika kita bisa, gunakan kembali komponen *root* yang ada
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Jika tidak, lepaskan diagram yang ada
    unmountTree(containerNode);
  }

  // ...

}
```

Sekarang memanggil `mountTree()` dua kali dengan tipe yang sama tidak merusak:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Menggunakan kembali DOM yang ada:
mountTree(<App />, rootEl);
```

Ini adalah dasar-dasar bagaimana React bekerja secara internal.

### Apa yang kami keluarkan {#what-we-left-out}

Dokumen ini disederhanakan dibandingkan dengan basis kode nyata. Ada beberapa aspek penting yang tidak kami tangani:

* Komponen dapat membuat `null`, dan *reconciler* dapat menangani "slot kosong" dalam senarai dan menghasilkan keluaran.

* *Reconciler* juga membaca `key` dari elemen-elemen, dan menggunakannya untuk menetapkan *instance* internal yang sesuai dengan elemen mana dalam senarai. Sebagian besar kompleksitas dalam implementasi React aktual terkait dengan itu.

* Selain kelas *instance* internal *host* dan komposit, ada juga kelas untuk komponen "teks" and "kosong". Mereka mewakili *node* teks dan "slot kosong" anda dapatkan dengan *rendering* `null`.

* *Renderer* menggunakan [injeksi](/docs/codebase-overview.html#dynamic-injection) untuk meneruskan kelas internal *host* ke *reconciler*. Misalnya, React DOM memberitahu *reconciler* untuk menggunakan `ReactDOMComponent` sebagai implementasi *instance* internal *host*.

* Logika untuk memperbarui daftar *children* diekstraksi ke dalam *mixin* yang disebut `ReactMultiChild` yang digunakan oleh implementasi kelas *instance host* internal baik di React DOM dan React Native.

* *Reconciler* juga mengimplementasikan dukungan untuk `setState()` dalam komponen komposit. Beberapa pembaruan di dalam *event handlers* dapat dikumpulkan menjadi satu pembaruan tunggal.

* *Reconciler* juga menangani melampirkan dan melepaskan *refs* ke komponen komposit dan *node host*.

* *Method Lifecycle* yang dipanggil setelah DOM siap, seperti `componentDidMount()` dan `componentDidUpdate()`, dikumpulkan ke dalam "antrean *callback*" dan dieksekusi dalam satu *batch*.

* React menempatkan informasi tentang pembaruan saat ini ke objek internal yang disebut "transaksi". Transaksi berguna untuk melacak antrean *method lifecycle* yang tertunda, DOM saat ini bersarang untuk peringatan, dan hal lain yang bersifat "global" untuk pembaruan tertentu. Transaksi juga memastikan React "membersihkan semuanya" setelah pembaruan. Misalnya, kelas transaksi yang disediakan oleh React DOM mengembalikan pilihan masukan setelah pembaruan apapun.

### Melompat ke Kode {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) adalah tempat kode seperti `mountTree()` dan `unmountTree()` dari tutorial ini berada. Ini menangani pemasangan dan pelepasan komponen tingkat atas. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) adalah analog React Native-nya.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) adalah setara dengan `DOMComponent` dalam tutorial ini. Ini mengimplementasikan Komponen Kelas *host* untuk *renderer* React DOM. [`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) adalah analog React Native-nya.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) adalah setara dengan `CompositeComponent` dalam tutorial ini. Ini menangani panggilan komponen yang ditentukan pengguna dan mempertahankan *state* mereka. 
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) berisi sakelar yang memilih kelas *instance* internal yang tepat untuk membangun sebuah elemen. Ini sama dengan `instantiateComponent()` dalam tutorial ini.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) adalah pembungkus dengan *method* `mountComponent()`, `receiveComponent()`, dan `unmountComponent()`. Ia menyebut implementasi yang mendasarinya pada *instance* internal, tetapi juga menyertakan beberapa kode di sekitarnya yang dibagikan oleh semua implementasi *instance* internal.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) mengimplementasikan logika untuk memasang, memperbarui, dan melepaskan *children* sesuai dengan elemen `key` mereka.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) mengimplementasikan pemrosesan antrean operasi untuk penyisipan *child*, penghapusan, dan bergerak secara independen dari *renderer*.

* `mount()`, `receive()`, dan `unmount()` benar-benar disebut `mountComponent()`, `receiveComponent()`, dan `unmountComponent()` di basis kode React untuk alasan warisan, tetapi mereka menerima elemen.

* Properti pada *instance* internal dimulai dengan garis bawah, misalnya `_currentElement`. Mereka dianggap sebagai bidang publik *read-only* di seluruh basis kode.

### Arah Masa Depan {#future-directions}

*Stack reconciler* memiliki keterbatasan yang melekat seperti menjadi *synchronous* dan tidak dapat mengganggu pekerjaan atau membaginya menjadi beberapa bagian. Ada pekerjaan yang sedang berjalan [*Reconciler fiber* baru](/docs/codebase-overview.html#fiber-reconciler) dengan [arsitektur yang sama sekali berbeda](https://github.com/acdlite/react-fiber-architecture). Di masa mendatang, kami bermaksud mengganti *stack reconciler* dengannya, tetapi saat ini masih jauh dari paritas fitur.

### Langkah Selanjutnya {#next-steps}

Baca [bagian selanjutnya](/docs/design-principles.html) untuk mempelajari tentang prinsip panduan yang kita gunakan untuk pengembangan React.
