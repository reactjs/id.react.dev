---
title: PureComponent
---

<Pitfall>

Kami menyarankan untuk membuat komponen sebagai fungsi, bukan kelas. [Lihat cara migrasinya.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` mirip dengan [`Component`](/reference/react/Component) tetapi melewatkan proses *render* ulang untuk props dan state yang sama. Komponen kelas masih didukung oleh React, tetapi kami tidak menyarankan untuk menggunakannya dalam kode baru.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `PureComponent` {/*purecomponent*/}

Untuk melewatkan *render* ulang sebuah komponen kelas untuk props dan state yang sama, perluas `PureComponent`, bukan [`Component`:](/reference/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` adalah subkelas dari `Component` dan mendukung [semua API `Component`.](/reference/react/Component#reference) Memperluas `PureComponent` sama dengan mendefinisikan sebuah metode kustom [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) yang membandingkan props dan state secara dangkal.


[Lihat contoh lainnya di bawah ini.](#usage)

---

## Penggunaan {/*usage*/}

### Melewatkan *render* ulang yang tidak perlu untuk komponen kelas {/*skipping-unnecessary-re-renders-for-class-components*/}

React umumnya me-*render* ulang sebuah komponen setiap kali induknya me-*render* ulang. Untuk mengoptimalkannya, Anda dapat membuat komponen yang tidak akan di-*render* ulang oleh React ketika induknya di-*render* ulang selama props dan state yang baru sama dengan props dan state yang lama. [Komponen kelas](/reference/react/Component) dapat memilih perilaku ini dengan memperluas `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Sebuah komponen React harus selalu memiliki [logika me-*render* murni.](/learn/keeping-components-pure) Ini berarti komponen tersebut harus mengembalikan output yang sama jika props, state, dan konteksnya tidak berubah. Dengan menggunakan `PureComponent`, Anda memberi tahu React bahwa komponen Anda memenuhi persyaratan ini, sehingga React tidak perlu me-*render* ulang selama props dan state-nya belum berubah. Namun, komponen Anda akan tetap di-*render* ulang jika konteks yang digunakan berubah.

Pada contoh ini, perhatikan bahwa komponen `Greeting` di-*render* ulang setiap kali `name` diubah (karena itu adalah salah satu props-nya), tetapi tidak ketika `address` diubah (karena tidak dioper ke `Greeting` sebagai props):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

Kami menyarankan untuk membuat komponen sebagai fungsi, bukan kelas. [Lihat cara migrasinya.](#alternatives)

</Pitfall>

---

## Alternatif {/*alternatives*/}

### Migrasi dari komponen kelas `PureComponent` ke sebuah fungsi {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

Kami menyarankan untuk menggunakan komponen fungsi daripada [komponen kelas](/reference/react/Component) dalam kode baru. Jika Anda memiliki beberapa komponen kelas yang sudah ada menggunakan `PureComponent`, berikut ini cara mengonversinya. Ini adalah kode aslinya:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Saat Anda [mengonversi komponen ini dari kelas ke fungsi,](/reference/react/Component#alternatives) bungkus komponen ini dengan [`memo`](/reference/react/memo):

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

Tidak seperti `PureComponent`, [`memo`](/reference/react/memo) tidak membandingkan state yang baru dan state yang lama. Pada komponen fungsi, memanggil [fungsi `set`](/reference/react/useState#setstate) dengan state yang sama [sudah mencegah *render* ulang secara default,](/reference/react/memo#updating-a-memoized-component-using-state) bahkan tanpa `memo`.

</Note>
