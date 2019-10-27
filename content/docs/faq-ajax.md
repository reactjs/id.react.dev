---
id: faq-ajax
title: AJAX dan API
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Bagaimana cara membuat panggilan AJAX? {#how-can-i-make-an-ajax-call}

Anda bisa menggunakan *library* AJAX apa saja yang anda inginkan dengan React. Beberapa yang populer yaitu [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), dan [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) bawaan *browser*.

### Pada *lifecycle* komponen mana seharusnya membuat panggilan AJAX? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

Anda sebaiknya mengisi data melalui panggilan AJAX pada *lifecycle method* [`componentDidMount`](/docs/react-component.html#mounting). Dengan begitu Anda dapat menggunakan `setState` untuk memperbarui komponen Anda ketika data telah diterima.

### Contoh: Menggunakan hasil AJAX untuk mengisi *state* lokal {#example-using-ajax-results-to-set-local-state}

Komponen dibawah menunjukkan cara menggunakan panggilan AJAX pada `componentDidMount` untuk mengisi *state* komponen lokal.

Contoh API dibawah ini menghasilkan objek JSON sebagai berikut:

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
        // Catatan: sangatlah penting untuk mengatasi error disini
        // daripada menggunakan blok catch() sehingga kita tidak menenggelamkan
        // exception dari bug yang sebenarnya terjadi di komponen
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
