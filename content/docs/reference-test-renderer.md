---
id: test-renderer
title: Test Renderer
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**Cara Import**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 dengan npm
```

## Ikhtisar {#overview}


*Package* ini menyediakan *renderer* React  yang dapat digunakan untuk me-*render* komponen React menjadi objek JavaScript murni, tanpa bergantung pada DOM atau bahasa *native* pada telepon seluler.

Pada dasarnya, *package* ini memberi kemudahan untuk mengambil *snapshot* dari hierarki tampilan *platform* (mirip dengan pohon DOM) yang di-*render* oleh React DOM atau komponen React Native tanpa menggunakan *browser* atau [jsdom](https://github.com/tmpvar/jsdom).

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

Anda dapat menggunakan fitur *snapshot testing* dari Jest untuk menyimpan salinan pohon JSON ke *file* secara otomatis dan melakukan pengecekan di tes anda terhadap adanya perubahan (struktur): [Pelajari lebih lanjut](http://facebook.github.io/jest/blog/2016/07/27/jest-14.html).

Anda juga dapat melintasi ke bagian keluaran untuk menemukan *node* tertentu dan membuat perbandingan terhadap *node-node* tersebut.

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
* [`TestRenderer.act()`](#testrendereract)

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

Membuat *instance* `TestRenderer` dengan mengoper elemen React. Fungsi ini tidak menggunakan DOM asli, tetapi masih sepenuhnya me-*render* diagram komponen ke dalam memori sehingga Anda masih dapat membandingkannya. Mengembalikan sebuah [*instance* TestRenderer](#testrenderer-instance).

### `TestRenderer.act()` {#testrendereract}

```javascript
TestRenderer.act(callback);
```

Mirip seperti [fungsi pembantu `act()` dari `react-dom/test-utils`](/docs/test-utils.html#act), `TestRenderer.act` menyiapkan komponen untuk dibandingkan. Gunakan versi `act()` ini untuk membungkus panggilan ke `TestRenderer.create` dan `testRenderer.update`.

```javascript
import {create, act} from 'react-test-renderer';
import App from './app.js'; // Komponen yang akan dites

// merender komponen
let root; 
act(() => {
  root = create(<App value={1}/>)
});

// membuat perbandingan dengan root 
expect(root.toJSON()).toMatchSnapshot();

// memperbarui dengan prop berbeda
act(() => {
  root = root.update(<App value={2}/>);
})

// membuat perbandingan dengan root 
expect(root.toJSON()).toMatchSnapshot();
```

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

Menghasilkan objek yang merepresentasikan pohon yang telah di-*render*. Pohon ini hanya berisi *node* *platform* khusus seperti `<div>` atau `<View>` dan beserta *props*-nya, tetapi tidak mengandung komponen yang dibuat oleh pengguna. Hal ini berguna untuk [pengujian potret](http://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

Menghasilkan objek yang merepresentasikan diageam yang telah di-*render*. Tidak seperti `toJSON ()`, representasinya lebih detail daripada yang dihasilkan oleh `toJSON ()`, dan termasuk komponen yang dibuat pengguna. Anda mungkin tidak memerlukan *method* ini kecuali Anda sedang membuat *library* pernyataan sendiri di atas uji *renderer*.

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

Menghasilkan objek *root* "*test instance*"  yang berguna untuk membuat pernyataan tentang *node* tertentu di pohon. Anda dapat menggunakannya untuk menemukan "*test instance*" lainnya secara lebih dalam di bawah ini.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Menemukan turunan tunggal *test instance* yang mana `test(testInstance)` menghasilkan nilai `true`. Jika `test(testInstance)` tidak menghasilkan nilai `true` untuk satu *test instance*, fungsi ini akan melemparkan *error*.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Menemukan turunan tunggal dari *test instance* berdasarkan `type` yang disediakan. Jika tidak ada satupun *test instance* dengan `type` yang disediakan, fungsi ini akan melemparkan *error*.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Menemukan turunan tunggal *test instance* dengan berdasarkan `props` yang disediakan. Jika tidak ada satupun *test instance* dengan `props` yang disediakan, hal ini akan melemparkan *error*.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Menemukan semua turunan *test instance* yang mana `test(testInstance)` menghasilkan nilai `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Menemukan semua turunan *test instance* dengan berdasarkan `type` yang disediakan.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

Menemukan semua turunan *test instance* dengan berdasarkan `props` yang disediakan.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

*Instance* dari komponen yang ada di *test instance*. Hanya tersedia untuk *class component*, karena *function component* tidak memiliki *instance*. Hal Ini sama dengan nilai `this` di dalam komponen yang diberikan.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

Jenis dari komponen yang ada di *test instance*. Sebagai contoh, komponen `<Button />` memiliki tipe `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

*Props* yang ada di *test instance*. Sebagai contoh, komponen `<Button size="small" />` memiliki `{size: 'small'}` sebagai *props*.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

Induk *test instance* dari *test instance* ini.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

Anak *test instance* dari *test instance* ini.

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
