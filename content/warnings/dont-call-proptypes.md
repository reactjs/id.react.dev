---
title: Don't Call PropTypes Warning
layout: single
permalink: warnings/dont-call-proptypes.html
---

> Catatan:
>
> `React.PropTypes` telah dipindahkan kedalam *package* yang berbeda sejak React v15.5. Silahkan gunakan [*library* `prop-types` sebagai gantinya](https://www.npmjs.com/package/prop-types).
>
>Kami menyediakan [sebuah *codemod script*](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) untuk mengotomatisasi perpindahan.

Pada sebuah rilis besar React dimasa depan, kode yang menerapkan validasi fungsi-fungsi PropType akan dihilangkan di *production*. Segera sesudah ini terjadi, semua kode yang memanggil fungsi-fungsi ini secara manual (yang tidak dihilangkan di *production*) akan melempar sebuah *error*.

### Deklarasi PropTypes masih baik-baik saja {#declaring-proptypes-is-still-fine}

Penggunaan normal dari PropTypes masih didukung:

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

Tidak ada yang berubah disini.

### Jangan memanggil PropTypes secara langsung {#dont-call-proptypes-directly}

Menggunakan PropTypes dengan cara selain menambahkan catatan pada komponen-komponen React tidak lagi didukung:

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// Tidak didukung!
var error = apiShape(json, 'response');
```

Jika anda terpaksa menggunakan PropTypes seperti ini, kami menyarankan anda sebaiknya menggunakan atau membuat sebuah *fork* dari PropTypes (seperti *package* [ini](https://github.com/aackerman/PropTypes) dan [ini](https://github.com/developit/proptypes)).

Jika anda mengabaikan peringatan, kode ini akan *crash* di *production* dengan React 16.

### Jika anda tidak memanggil PropTypes secara langsung tetapi tetap mendapatkan peringatan  {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

Periksa *stack trace* yang dihasilkan oleh peringatan. Anda akan menemukan definisi komponen yang bertanggung jawab memanggil PropTypes langsung. Biasanya, masalah ini disebabkan oleh PropTypes pihak ketiga yang membungkus PropTypes milik React, contohnya:

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
}
```

Dalam kasus ini, `ThirdPartyPropTypes.deprecated` adalah pembungkus yang memanggil `PropTypes.bool`. Pola ini sendiri tidak masalah, tetapi memicu berbagai peringatan yang salah karena React berpikir anda memanggil PropTypes langsung. Bagian selanjutnya menjelaskan bagaimana memperbaiki masalah ini untuk *library* yang menerapkan sesuatu seperti `ThirdPartyPropTypes`. Jika ini bukan sebuah *library* yang anda tulis, anda dapat mengajukan *issue* terhadapnya.

### Memperbaiki salah positif di PropTypes pihak ketiga {#fixing-the-false-positive-in-third-party-proptypes}

Jika anda adalah penulis dari *library* PropTypes pihak ketiga dan anda memperbolehkan pengguna membungkus *React PropTypes* yang ada, mereka mungkin berpikir peringatan ini datang dari *library* anda. Ini terjadi karena React tidak melihat sebuah argumen "rahasia" terakhir yang [melewati](https://github.com/facebook/react/pull/7132) untuk mendeteksi pemanggilan-pemanggilan PropTypes secara manual.

Ini cara memberbaikinya. Kita akan menggunakan `deprecated` dari [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) sebagai sebuah contoh. Implementasi sekarang hanya meneruskan argumen-argumen `props`, `propName`, dan `componentName`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

Untuk memperbaiki salah positif, pastikan anda meneruskan **semua** argumen-argumen ke PropType yang terbungkus. Ini mudah dilakukan dengan notasi ES6 `...rest`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // Note ...rest here
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // and here
  };
}
```

Ini akan menghilangkan peringatan.
