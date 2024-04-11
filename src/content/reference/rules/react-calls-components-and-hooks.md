---
title: React memanggil Komponen dan Hooks
---

<Intro>
React bertanggung jawab untuk me-*render* komponen dan *Hooks* saat diperlukan untuk mengoptimisasi pengalaman pengguna. Ini bersifat deklaratif: Anda memberi tahu React apa yang harus di-*render* dalam logika komponen Anda, dan React akan mencari cara terbaik untuk menampilkannya kepada pengguna Anda.

</Intro>

<InlineToc />

---

## Jangan pernah memanggil fungsi komponen secara langsung {/*never-call-component-functions-directly*/}
Komponen seharusnya hanya digunakan di JSX. Jangan memanggil komponen seperti fungsi pada umumnya. React yang seharusnya memanggilnya.

React harus menentukan kapan sebuah fungsi komponen dipanggil [saat sedang di-*render*](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code). Di React, hal ini dilakukan dengan JSX.


```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Baik: Hanya menggunakan komponen dalam bentuk JSX
}
```

```js {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Buruk: Jangan pernah memanggil komponen secara langsung
}
```
Jika sebuah komponen mengandung *Hooks*, sangat mudah untuk melanggar [Aturan dari Hooks](/reference/rules/rules-of-hooks) saat komponen secara langsung dipanggil dalam sebuah perulangan ataupun secara kondisional.


Membiarkan React melakukan orkestrasi rendering juga memungkinkan sejumlah manfaat:

* **Komponen menjadi lebih dari sebuah fungsi.** React dapat menambahkannya dengan fitur seperti _localstate_ melalui Hooks yang diikat ke identitas komponen di dalam pohon React.
* **Tipe komponen ikut sertadalam rekonsiliasi.** Dengan membiarkan React memanggil komponen Anda, Anda juga memberi tahu React lebih banyak tentang struktur konseptual dari pohon Anda. Sebagai contoh, ketika Anda berpindah dari merender `<Feed>` ke halaman `<Profile>`, React tidak akan mencoba untuk menggunakannya kembali.
* **React dapat memingkatkan pengalaman pengguna anda.** Sebagai contoh, jika anda membiarkan peramban untuk melakukan beberapa pekerjaan di antara pemanggilan komponen sehingga me-render ulang pohon komponen yang besar tidak memblokir utas utama.
* **Story debugging yang lebih baik** Jika komponen adalah warga kelas satu yang diketahui oleh library, kita dapat membuat alat bantu pengembang yang kaya untuk introspeksi dalam pengembangan.
* **Rekonsiliasi yang lebih efisien.** React dapat memutuskan dengan tepat komponen mana di dalam tree yang perlu di-render ulang dan melewatkan komponen yang tidak perlu di-render ulang. Hal ini membuat aplikasi Anda menjadi lebih cepat dan lebih tajam.

---

## Jangan oper Hooks sebagai nilai {/*never-pass-around-hooks-as-regular-values*/}

Hooks seharusnya hanya dipanggil didalam sebuah komponen atau Hooks. Jangan pernah mengopernya sebagai sebuah nilai.

Hooks memungkinkan anda untuk menambahkan sebuah komponen dalam fitur React. Hooks seharusnya harus selalu dipanggil sebagai sebuah fungsi, dan tidak dioper sebagai sebuah nilai. Hal ini memungkinkan _local reasoning_, atau kemampuan para developer untuk memahami semua yang dapat dilakukan oleh sebuah komponen hanya dengan melihat komponen tersebut secara terisolasi.

Melanggar aturan ini akan menyebabkan React untuk tidak secara langsung mengoptimisasi komponen anda.

### Jangan melakukan mutasi Hook secara dinamis {/*dont-dynamically-mutate-a-hook*/}

Sebuah Hooks sebagainya selalu se-"statis" mungkin. Berarti anda seharusnya tidak melakukan mutasi secara dinamis pada Hooks. Sebagai contoh, artinya anda tidak seharusnya menulis sebuah Hooks dengan orde yang lebih tinggi:

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Buruk: jangan menulis sebuah Hooks dengan orde yang lebih tinggi
  const data = useDataWithLogging();
}
```

Hooks seharusnya tidak dapat dimutasi dan tidak dilakukan mutasi. Melainkan memutasi Hook secara dinamis, buatlah sebuah bentuk statis dari Hook tersebut dengan fungsionalitas yang diinginkan.

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Baik: Buatlah sebuah versi baru dari Hook
}

function useDataWithLogging() {
  // ... Buatlah versi baru hook dan logikanya disini
}
```

### Jangan menggunakan Hooks secara dinamis {/*dont-dynamically-use-hooks*/}

Hooks juga seharusnya tidak digunakan secara dinamis: sebagai contoh, gunakanlah *dependency injection* pada sebuah komponen dengan cara mengopernya kedalam Hook sebaga sebuah nilai:

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Buruk: Jangan mengoper Hooks sebagai props
}
```

Anda harus selalu mensejajarkan pemanggilan Hook ke dalam komponen tersebut dan menangani logika apa pun di dalamnya.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Baik: Gunakan Hook secara langsung 
}

function useDataWithLogging() {
  // Jika ada logika kondisional untuk mengubah perilaku Hook, logika tersebut harus di-inline-kan menjadi
  // sebuah Hook
}
```

Dengan cara ini, `<Button />` menjadi lebih mudah untuk dipahami dan didebug. Saat Hooks digunakan dengan cara yang dinamis, komplesitas dari aplikasi akan meningkat secara signifikan dan menghambat penalaran lokal, membuat tim anda menjadi lebih tidak produktif dalam jangka panjang. Hal ini juga memudahkan Anda untuk secara tidak sengaja melanggar [Aturan Hooks](/reference/rules/rules-of-hooks) bahwa Hooks tidak boleh dipanggil secara bersyarat. Jika Anda merasa perlu membuat *mock* komponen untuk pengujian, lebih baik membuat *mock* server untuk merespons dengan data kalengan. Jika memungkinkan, biasanya juga lebih efektif untuk menguji aplikasi Anda dengan pengujian *end-to-end*.