---
id: hooks-custom
title: Building Your Own Hooks
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

*Hooks* adalah sebuah tambahan baru di React 16.8. mereka membiarkan anda menggunakan state dan komponen React lainnya tanpa menuliskan kelas.

Membuat Hook anda sendiri memungkinkan anda mengekstrak komponen logika ke fungsi yang dapat digunakan lagi.

Ketika kita mempelajari [menggunakan Hook efek](/docs/hooks-effect.html#example-using-hooks-1), kita melihat komponen ini dari sebuah aplikasi chat yang menampilkan pesan yang menunjukkan apakah teman anda online atau offline:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
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

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Sekarang dapat dikatakan bahwa aplikasi chatting kami juga memiliki daftar kontak, dan Anda ingin membuat nama pengguna online berwarna hijau. Kita bisa copy dan paste logika serupa diatas ke komponen `FriendListItem` kita tapi itu tidak ideal:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
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

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Sebaliknya, kita dapat membagikan logika antara `FriendStatus` dan `FriendListItem`.

Secara React tradisional, kita telah memiliki dua cara yang populer untuk berbagi logika stateful antar komponen: [render props](/docs/render-props.html) dan [higher-order components](/docs/higher-order-components.html). Kita akan melihat bagaimana kita memecahkan banyak masalah yang sama tanpa membuat anda untuk menambah komponen lain.

## Ekstraksi Hook kustom {#extracting-a-custom-hook}

Ketika kita ingin berbagi komponen logika antara dua fungsi Javascript, kita mengekstraknya menjadi komponen ketiga. Komponen dan hook adalah fungsi, jadi ini bekerja untuk mereka juga!

**Sebuah Hook kustom adalah sebuah fungsi Javascript yang namanya dimulai dengan "`use`" dan mungkin memanggil Hooks lain.** Misalnya, `useFriendStatus` dibawah ini adalah Hooks kustom pertama kami:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Tidak ada yang baru disitu -- logika disalin dari komponen di atas. Seperti komponen diatas, pastikan hanya memanggil hooks lain tanpa kondisi pada tingkat atas dari hook kustom anda.

Tidak seperti komponen React, sebuah hook custom tidak membutuhkan tanda yang spesifik. Kita bisa menentukan apa yang dibutuhkan sebagai argumen, dan apa, jika apapun, itu harus return. dengan kata lain, itu hanya sama seperti fungsi normal. Nama itu selalu diawali dengan `use` sehingga anda dapat memberitahu sekilas bahwa aturan-aturan [rules of Hooks](/docs/hooks-rules.html) berlaku untuk itu.

Tujuan Hook `useFriendStatus` adalah untuk mengikuti kami ke status teman. itulah mengapa `friendID` diambil sebagai argumen, dan mengembalikan apakah teman ini sedang online:

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Sekarang kita lihat bagaimana kita dapat mengkustom Hook kita.

## Menggunakan Hook Kustom {#using-a-custom-hook}

Di awal, tujuan kami adalah menghapus duplikasi logika dari komponen `FriendStatus` dan `FriendListItem`. Keduanya ingin mengetahui apakah teman sedang online.

Sekarang kita dapat mengekstraksi logika ini ke Hook `useFriendStatus`, kita dapat *hanya menggunakan:*

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**Apakah kode tersebut sama dengan contoh aslinya?** Ya, itu bekerja di cara yang sama. Jika anda lihat secara dekat, anda akan melihat kami tidak membuat perubahan perilaku. Semua yang kita lakukan adalah untuk mengekstrak beberapa kode antara dua fungsi ke dalam fungsi yang terpisah. **Hook kustom adalah konversi secara alami dari desain Hook, daripada fitur React.**

**Haruskah saya menamai Hook kustom saya dimulai dengan “`use`”?** silahkan dilakukan.  Konvensi ini sangatlah penting. Tanpa ini, kita tidak akan mampu secara otomatis memeriksa untuk pelanggaran [peraturan Hooks](/docs/hooks-rules.html)  karena kita mengatakan jika fungsi tertentu memanggil Hooks tersebut.

**Do two components using the same Hook share state?** Tidak. Hook kustom  adalah sebuah mekanisme untuk menggunakan kembali *logika stateful* (seperti mengatur  subscription dan mengingat nilai saat ini), tetapi setiap waktu anda menggunakan hook kustom, semua state dan efek itu sepenuhnya terisolasi.

**Bagaimana sebuah hook kustom mendapat state terisolasi?** Masing-masing *call* ke sebuah hook mendapatkan state tersiolasi. Karena kita memanggil `useFriendStatus` langsung, dari sudut pandang React komponen kita hanya memanggil `useState` dan `useEffect`. Dan seperti yang kita [pelajari](/docs/hooks-state.html#tip-using-multiple-state-variables) [sebelumnya](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), kira dapat memanggil `useState` dan `useEffect` berkali-kali dalam satu komponen, dan mereka akan benar-benar independen.

### Tip: Menyampaikan Informasi Antara Hook {#tip-pass-information-between-hooks}

Sejak Hook adalah fungsi, kita dapat menyampaikan informasi antara mereka.

Untuk menggambarkan ini, kita akan menggunakan komponen lain dari hipotesis chat kami. Ini adalah sebuah pesan chat picker yang menampilkan apakah teman yang dipilih online:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

Kita menyimpan ID teman yang dipilih saat ini di variabel state `recipientID`, dan memperbarui itu jika user memilih teman lain di `<select>` picker.

Karena Hook `useState` memanggil memberikan kita nilai dari variabel state `recipientID`, kita dappat melewati itu ke Hook kustom `useFriendStatus` kita sebagai sebuah argumen:

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

Hal ini memungkinkan kita tahu apakah teman *yang dipilih*  online. Jika kita memilih teman yang berbeda dan memperbarui variabel state `recipientID`, Hook `useFriendStatus` kita akan berhenti mengikuti dari teman dipilih sebelumnya, dan mengikuti ke status yang baru.

## `useYourImagination()` {#useyourimagination}

Kustom Hook menawarkan fleksibelitas berbagi logika yang tidak mungkin di komponen React sebelumnya. Anda bisa menulis kustom hook yang mencakup berbagai penggunaan kasus-kasus seperti form handling, animasi, declarative, subscriptions, timer, dan mungkin masih banyak lagi yang belum kita pertimbangkan. Terlebih lagi, anda dapat membangun Hook yang mudah digunakan seperti fitur bawaan React.

Cobalah untuk tidak menambahkan abstraksi terlalu dini. Sekarang komponen fungsi dapat berbuat lebih banyak, sangat mungkin bahwa rata-rata komponen fungsi dalam basis kode anda akan menjadi lebih lama. Ini normal -- jangan merasa seperti anda *harus* segera membaginya menjadi Hook. Tapi kami juga menganjurkan anda untuk mulai menemukan *case* dimana Hook kustom dapat menyembunyikan logika kompleks di belakang antarmuka yang sederhana, atau membantu mengurai komponen yang berantakan.

Misalnya, mungkin Anda memiliki komponen kompleks yang berisi banyak status lokal yang dikelola secara *ad-hoc*. `useState` tidak membuat pemusatan logika pembaruan menjadi lebih mudah sehingga Anda mungkin memilih untuk menuliskannya sebagai *reducer* di [Redux](https://redux.js.org/):

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... other actions ...
    default:
      return state;
  }
}
```

Reducers sangat nyaman untuk diuji dalam isolasi, dan skala untuk mengekspresikan logika pembaruan yang kompleks. Anda selanjutnya dapat memecahkannya menjadi reducers yang lebih kecil jika perlu. Namun, Anda dapat menikmati manfaat menggunakan React local state, atau mungkin tidak ingin menginstal *library* lainnya.

Jadi bagaimana jika kita bisa menulis Hook `useReducer` yang memungkinkan kita mengelola state *local* dari komponen kita dengan reducer? Versi yang disederhanakan mungkin terlihat seperti ini:

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

Sekarang kita bisa menggunakannya dalam komponen kita, dan biarkan reducer mengendalikan manajemen *state* :

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

Kebutuhan untuk mengelola keadaan lokal dengan reducer dalam komponen yang kompleks cukup umum sehingga kami telah membangun hak `useReducer` di React. Anda akan menemukannya bersama dengan Hook bawaan lainnya di [Hooks API reference](/docs/hooks-reference.html).
