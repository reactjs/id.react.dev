---
id: test-renderer
title: Uji Renderer
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**Pengimporan**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 dengan npm
```

## Ikhtisar {#overview}


*Package* ini menyediakan *renderer* React  yang dapat digunakan untuk me-*render* komponen React menjadi objek JavaScript murni, tanpa bergantung pada DOM atau bahasa *native* pada telepon seluler.

Pada dasarnya, *package* ini membuat kemudahan untuk mengambil potret awal dari hierarki tampilan *platform* (mirip dengan pohon DOM) yang di-*render* oleh React DOM atau komponen React Native tanpa menggunakan *browser* atau [jsdom](https://github.com/tmpvar/jsdom).

Contoh:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

Anda dapat menggunakan fitur pengujian potret awal dari Jest untuk menyimpan salinan pohon JSON ke *file* secara otomatis dan memeriksa bahwa pengujian Anda tidak berubah: [Pelajari lebih lanjut](http://facebook.github.io/jest/blog/2016/07/27/jest-14.html).

Anda juga dapat melewati ke bagian keluaran untuk menemukan *node* tertentu dan membuat pernyataan tentang *node - node* tersebut.

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)

### TestRenderer instance {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## Referensi {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

Membuat *instance* `TestRenderer` dengan mengoper elemen React. Hal ini tidak menggunakan DOM asli, tetapi masih sepenuhnya me-*render* pohon komponen ke dalam memori sehingga Anda dapat membuat sebuah pernyataan. *Instance* yang dihasilkan memiliki *method* dan *property* sebagai berikut.

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

Menghasilkan objek yang merepresentasikan pohon yang telah di-*render*. Pohon ini hanya berisi *node* *platform* khusus seperti `<div>` atau `<View>` dan beserta *props*-nya, tetapi tidak mengandung komponen yang dibuat oleh pengguna. Hal ini berguna untuk [pengujian potret](http://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

Menghasilkan objek yang merepresentasikan pohon yang telah di-*render*. Tidak seperti `toJSON ()`, representasinya lebih detail daripada yang dihasilkan oleh `toJSON ()`, dan termasuk komponen yang dibuat pengguna. Anda mungkin tidak memerlukan *method* ini kecuali Anda sedang membuat *library* pernyataan sendiri di atas uji *renderer*.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

Me-*render* ulang pohon dalam memori dengan elemen *root* baru. Hal Ini mensimulasikan pembaruan React di *root*. Jika elemen baru memiliki tipe dan *key* yang sama dengan elemen sebelumnya, struktur pohon akan diperbarui; jika tidak, akan memasang ulang pohon yang baru.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

Melepas pohon dalam memori, memicu siklus hidup *event* yang sesuai.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

Menghasilkan *instance* yang sesuai dengan elemen *root*, jika tersedia. Hal ini tidak akan berfungsi jika elemen *root* adalah *function component*, karena *function component* tidak memiliki *instance*.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

Menghasilkan objek *root* "uji *instance*"  yang berguna untuk membuat pernyataan tentang *node* tertentu di pohon. Anda dapat menggunakannya untuk menemukan "uji *instance*" lainnya secara lebih dalam di bawah ini.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Menemukan turunan tunggal uji *instance* yang mana `test(testInstance)` menghasilkan nilai `true`. Jika `test(testInstance)` tidak menghasilkan nilai `true` untuk satu uji *instance*, hal ini akan melemparkan *error*.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Menemukan turunan tunggal uji *instance* dengan berdasarkan `type` yang disediakan. Jika tidak ada satupun uji *instance* dengan `type` yang disediakan, hal ini akan melemparkan *error*.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Menemukan turunan tunggal uji *instance* dengan berdasarkan `props` yang disediakan. Jika tidak ada satupun uji *instance* dengan `props` yang disediakan, hal ini akan melemparkan *error*.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Menemukan semua turunan uji *instance* yang mana `test(testInstance)` menghasilkan nilai `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Menemukan semua turunan uji *instance* dengan berdasarkan `type` yang disediakan.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

Menemukan semua turunan uji *instance* dengan berdasarkan `props` yang disediakan.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

*Instance* dari komponen yang ada di uji *instance*. Hanya tersedia untuk *class component*, karena *function component* tidak memiliki *instance*. Hal Ini sama dengan nilai `this` di dalam komponen yang diberikan.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

Jenis dari komponen yang ada di uji *instance*. Sebagai contoh, komponen `<Button />` memiliki tipe `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

*Props* yang ada di uji *instance*. Sebagai contoh, komponen `<Button size="small" />` memiliki `{size: 'small'}` sebagai *props*.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

Induk uji *instance* dari uji *instance* ini.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

Anak uji *instance* dari uji *instance* ini.

## Gagasan {#ideas}

Anda dapat mengoper *function* `createNodeMock` ke ` TestRenderer.create` sebagai opsinya, yang memungkinkan untuk referensi tiruan yang sudah diubah.
`createNodeMock` menerima elemen tersebut dan harus menghasilkan objek referensi tiruan.
Hal Ini berguna ketika Anda menguji sebuah komponen yang bergantung pada referensi.

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // tiruan function focus
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
