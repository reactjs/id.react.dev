---
id: faq-ajax
title: AJAX dan API
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Bagaimana cara membuat panggilan AJAX? {#how-can-i-make-an-ajax-call}

Anda bisa menggunakan semua AJAX *library* yang anda inginkan seperti halnya dengan React. Salah satu diantaranya yang populer yaitu [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), dan *browser* yang ter-integrasi [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

### Dimana komponen *lifecycle* harus menggunakan panggilan AJAX? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

Anda seharusnya dapat mengisi data melalui panggilan AJAX di dalam [`componentDidMount`](/docs/react-component.html#mounting) *lifecycle method*. Disini anda juga bisa menggunakan `setState` untuk memperbarui komponen anda ketika data telah diterima.

### Contoh: Penggunaan AJAX yang ditentukan ke *state* lokal {#example-using-ajax-results-to-set-local-state}

Komponen dibawah menunjukan cara membuat panggilan di AJAX  `componentDidMount` untuk mengisi komponen *state* lokal  .

Contoh penggunaan API yang dikembalikan ke objek JSON seperti ini:

```
{
  "items": [
    { "id": 1, "nama": "apel",  "harga": "$2" },
    { "id": 2, "nama": "pear", "harga": "$5" }
  ]
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // catatan: sangatlah penting untuk mengatasi kesalahan disini
        // sebagai gantinya catch() block so that we don't swallow
        // pengencualian dari bugs yang sebenarnya didalam komponen-komponen.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.nama}>
              {item.nama} {item.harga}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```
