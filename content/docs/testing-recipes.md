---
id: testing-recipes
title: Testing Recipes
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

Pola pengujian umum untuk komponen React.

> Catatan:
>
> Laman ini berasumsi Anda menggunakan [Jest](https://jestjs.io/) sebagai *runner* pengujian. Apabila Anda menggunakan *runner* pengujian yang berbeda, Anda perlu menyesuaikan API yang digunakan, tetapi secara keseluruhan bentuk solusi kurang lebih akan sama. Baca lebih lanjut mengenai detil dalam mengatur *environment* pengujian pada laman [Environments Pengujian](/docs/testing-environments.html).

Pada laman ini, kami akan menggunakan *function components*. Walaupun begitu, strategi pengujian tidak bergantung pada detil implementasi, dan dapat bekerja dengan baik untuk *class components* juga.

- [Persiapan](#setup--teardown)
- [`act()`](#act)
- [*Rendering*](#rendering)
- [*Pengambilan Data*](#data-fetching)
- [Modul-modul Tiruan](#mocking-modules)
- [*Events*](#events)
- [Pengatur Waktu](#timers)
- [Pengujian *Snapshot*](#snapshot-testing)
- [*Multiple Renderers*](#multiple-renderers)
- [Ada yang kurang?](#something-missing)

---

### Persiapan {#setup--teardown}

Untuk setiap pengujian, Umumnya kita me-*render* pohon React ke sebuah elemen DOM yang terhubung dengan `document`. Ini penting agar pengujian dapat menerima *event* DOM. Setelah pengujian selesai, kita harus melakukan "Pembersihan" dan melepas pohon tersebut dari `document`.

Cara yang umum dilakukan adalah menggunakan pasangan blok `beforeEach` dan `afterEach` agar mereka terus berjalan dan memisahkan efek-efek dari sebuah pengujian hanya kepada pengujian tersebut.

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // Atur elemen DOM sebagai tujuan render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // Pembersihan ketika keluar
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

Anda dapat menggunakan pola yang berbeda, namun ingatlah bahwa kita harus melakukan pembersihan tadi _walaupun sebuah pengujian gagal_. Jika tidak, pengujian-pengujian akan menjadi "bocor", dan sebuah pengujian dapat mengubah perangai dari pengujian yang lain. Hal ini akan menyebabkan *debug* akan sulit dilakukan pada pengujian lain.

---

### `act()` {#act}

<<<<<<< HEAD
Ketika menulis pengujian antarmuka pengguna, Pekerjaan-pekerjaan seperti *rendering*, *events* pengguna, atau pengambilan data dapat diperlakukan sebagai "unit-unit" dari interaksi dengan antarmuka pengguna. React menyediakan fungsi bantuan bernama `act()` yang memastikan semua pembaruan yang berhubungan dengan "unit-unit" tadi sudah diproses dan diterapkan ke DOM sebelum Anda melakukan *assertion*.
=======
When writing UI tests, tasks like rendering, user events, or data fetching can be considered as "units" of interaction with a user interface. `react-dom/test-utils` provides a helper called [`act()`](/docs/test-utils.html#act) that makes sure all updates related to these "units" have been processed and applied to the DOM before you make any assertions:
>>>>>>> 6349ec18a01a3a880b66b87feb8dfe53f52e7aaf

```js
act(() => {
  // render komponen
});
// buat assertions
```

Fungsi ini membantu Anda melakukan pengujian-pengujian yang mendekati apa yang pengguna sebenarnya alami ketika menggunakan aplikasi. Selanjutnya dari contoh-contoh dibawah ini akan menggunakan `act()` untuk menjamin pendekatan tersebut.

Anda mungkin akan menemukan bahwa menggunakan `act()` secara langsung adalah sedikit terlalu bertele-tele. Untuk menghindari beberapa *boilerplate*, Anda dapat menggunakan sebuah *library* seperti [React Testing Library](https://testing-library.com/react), dimana fungsi-fungsi bantuannya dibungkus dengan `act()`.

> Catatan:
>
> Nama `act` berasal dari pola [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert).

---

### *Rendering* {#rendering}

Secara umum, Anda ingin melakukan pengujian apakah sebuah komponen, dengan *props* tertentu di-*render* dengan benar.

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>Halo, {props.name}!</h1>;
  } else {
    return <span>Hai, orang asing</span>;
  }
}
```

Kita dapat menulis sebuah pengujian untuk komponen ini:

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // Atur elemen DOM sebagai tujuan render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // Pembersihan ketika keluar
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hai, orang asing");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Halo, Jenny!");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Halo, Margaret!");
});
```

---

### Pengambilan Data {#data-fetching}

Alih-alih melakukan pemanggilan ke API sebenarnya pada semua pengujian Anda, Anda dapat membuat *request* tiruan dengan data buatan. Pengambilan data tiruan "palsu" seperti ini mencegah pengujian yang berlapis-lapis karena ketiadaan *backend*, dan membuat pengujian-pengujian tersebut berjalan lebih cepat. Catatan: Anda tetap dapat menjalankan bagian dari pengujian menggunakan [*"end-to-end"*](/docs/testing-environments.html#end-to-end-tests-aka-e2e-tests) *framework* yang memberitahu apakah aplikasi secara keseluruhan bekerja sama dengan baik.

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "loading...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> tahun
      <br />
      tinggal di {user.address}
    </details>
  );
}
```

Kita dapat menulis pengujian untuk ini:

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // Atur elemen DOM sebagai tujuan render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // Pembersihan ketika keluar
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // Gunakan versi asynchronous dari act untuk menerapkan resolved promises
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // hapus tiruan untuk memastikan pengujian sepenuhnya terpisah
  global.fetch.mockRestore();
});
```

---

### Modul-modul Tiruan {#mocking-modules}

Beberapa modul mungkin tidak bekerja dengan baik didalam *environment* pengujian, atau mungkin tidak begitu penting bagi pengujian itu sendiri. Membuat tiruan modul-modul ini dengan modul-modul buatan dapat mempermudah penulisan pengujian untuk kode Anda.

Contohnya sebuah komponen `Contact` yang menanamkan komponen `GoogleMap` sebagai pihak ketiga:

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

export default function Contact(props) {
  return (
    <div>
      <address>
        Kontak {props.name} via{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        atau pada <a data-testid="site" href={props.site}>
          website
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

Apabila kita tidak ingin memuat komponen ini kedalam pengujian kita, kita dapat melepas ketergantungan itu kepada komponen buatan, dan menjalankan pengujian kita:

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // Atur elemen DOM sebagai tujuan render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // Pembersihan ketika keluar
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render contact information", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### *Events* {#events}

Kami menyarankan pengiriman *event* DOM sebenarnya dari elemen DOM, lalu melakukan *asserting* pada hasilnya. Dapat dilihat pada komponen `Toggle` berikut:

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

Dapat kita tulis pengujiannya sebagai berikut:

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // Atur elemen DOM sebagai tujuan render
  container = document.createElement("div");
<<<<<<< HEAD
  // container *harus* melekat pada document agar events bekerja dengan benar
=======
>>>>>>> 6349ec18a01a3a880b66b87feb8dfe53f52e7aaf
  document.body.appendChild(container);
});

afterEach(() => {
  // Pembersihan ketika keluar
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("changes value when clicked", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // pegang elemen button, dan picu beberapa klik dengannya
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

<<<<<<< HEAD
*Event* DOM yang berbeda dan properti-properti mereka dijabarkan di [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent). Perlu dicatat bahwa Anda perlu mengoper `{ bubbles: true }` pada setiap *event* yang Anda buat agar *event* tersebut dapat mencapai React *listener* karena React secara otomatis mendelegasikan *event-event*  itu ke dokumen.
=======
Different DOM events and their properties are described in [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent). Note that you need to pass `{ bubbles: true }` in each event you create for it to reach the React listener because React automatically delegates events to the root.
>>>>>>> 6349ec18a01a3a880b66b87feb8dfe53f52e7aaf

Catatan:
>
> React Testing Library menawarkan [bantuan-bantuan yang lebih ringkas](https://testing-library.com/docs/dom-testing-library/api-events) untuk melepaskan *event-event*.

---

### Pengatur Waktu {#timers}

Kode Anda mungkin menggunakan fungsi berbasis pengaturan waktu seperti `setTimeout` untuk menjadwalkan pekerjaan di masa depan. Pada contoh ini, sebuah panel pilihan ganda menunggu pemilihan dan pergerakan, waktu akan habis apabila pemilihan tidak dilakukan dalam 5 detik: 

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

Kita dapat melakukan pengujian-pengujian pada komponen ini dengan memanfaatkan [Jest's timer mocks](https://jestjs.io/docs/en/timer-mocks), dan melakukan pengujian-pengujian dengan *states* yang berbeda-beda.

```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Card from "./card";

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // Atur elemen DOM sebagai tujuan render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // Pembersihan ketika keluar
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should select null after timing out", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // bergerak maju dalam waktu 100 milidetik
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // dan bergerak maju dalam 5 detik
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("should cleanup on being removed", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // lepas app
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("should accept selections", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

Anda dapat menggunakan pengaturan waktu palsu hanya pada beberapa pengujian. Diatas, kita mengaktifkan itu dengan memanggil `jest.useFakeTimers()`. Kelebihan utama dari ini adalah test Anda tidak perlu menunggu waktu aktual selama 5 detik untuk dilaksanakan, dan Anda juga tidak perlu membuat kode komponen menjadi lebih membelit hanya untuk pengujian.

---

### Pengujian *Snapshot* {#snapshot-testing}

*Framework* seperti Jest juga dapat menyimpan *"snapshots"* data dengan [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing). Dengan ini, kita dapat "menyimpan" keluaran komponen yang sudah ter-*render* dan memastikan perubahan pada komponen itu komit secara eksplisit seperti perubahan pada *snapshot*.

Pada contoh ini, kita akan melakukan *render* komponen dan membentuk hasil *render* HTML dengan paket [`pretty`](https://www.npmjs.com/package/pretty), sebelum menyimpan sebagai *snapshot inline*:

```jsx{29-31}
// hello.test.js, again

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // Atur elemen DOM sebagai tujuan render
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // Pembersihan ketika keluar
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render a greeting", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... otomatis dipenuhi oleh jest ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... otomatis dipenuhi oleh jest ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... otomatis dipenuhi oleh jest ... */
});
```

Pada umumnya lebih baik untuk membuat *assertions* yang lebih spesifik daripada menggunakan snapshots. Jenis pengujian ini termasuk implementasi detil agar mereka dapat dipilah dengan mudah, dan tim tidak terlalu terpengaruh dari pemilahan *snapshot*. Secara selektif [meniru beberapa anak komponen](#mocking-modules) dapat membantu mengurangi ukuran *snapshots* and menjaga mereka tetap dapat terbaca untuk ulasan kode.

---

### *Multiple Renderers* {#multiple-renderers}

Pada kasus-kasus yang jarang, Anda akan menjalankan pengujian dengan komponen yang menggunakan *multiple renderers*. Sebagai contoh, Anda mungkin menjalankan pengujian-pengujian *snapshot* pada sebuah komponen dengan `react-test-renderer`, yang secara internal menggunakan `ReactDOM.render` didalam sebuah anak komponen untuk me-*render* konten. Pada skenario ini, Anda dapat membungkus pembaruan-pembaruan dengan `act()`s sesuai dengan *renderers* masing-masing.

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### Ada yang kurang? {#something-missing}

Apabila beberapa skenario umum belum tercakup, harap memberitahukan kami pada [issue tracker](https://github.com/reactjs/reactjs.org/issues) untuk dokumentasi *website*.
