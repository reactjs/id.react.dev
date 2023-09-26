---
title: "Komponen umum (cth. <div>)"
---

<Intro>

Semua komponen bawaan dari sebuah peramban web (*browser*), seperti [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), mendukung beberapa *props* dan *event* umum. 

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### Komponen umum (e.g. `<div>`) {/*common*/}

```js
<div className="wrapper">Konten sembarang</div>
```

[See more examples below.](#usage)

#### Props {/*common-props*/}

Beberapa *props* spesial React berikut didukung oleh setiap komponen bawaan:

* `children`: Sebuah *node* React (sebuah elemen, string, angka, [portal,](/reference/react-dom/createPortal) *node* kosong seperti `null`, `undefined` and booleans, atau senarai dari *nodes* React). Menggambarkan kontent yang berada di dalam komponen. Saat menggunakan JSX, biasanya kau akan mendefinisikan *prop* dari `children` secara implisit dengan menggunakan tag bersarang seperti `<div><span /></div>`.

* `dangerouslySetInnerHTML`: Sebuah objek dengan bentuk `{ __html: '<p>some html</p>' }` yang mengandung string HTML mentah. Objek ini menimpa [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) yang merupakan properti dari DOM *node* dan menampilkan HTML yang di-*passing* ke dalamnya. Hal ini harus digunakan dengan sangat hati-hati! Jika HTML yang berada didalamnya tidak terpercaya (sebagai contoh, jika datanya berbasis pada data pengguna), akan beresiko pada munculnya kerentanan terhadap [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). [Baca lebih lanjut mengenai penggunaan `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

* `ref`: Ref adalah sebuah objek dari [`useRef`](/reference/react/useRef) atau [`createRef`](/reference/react/createRef), atau sebuah [fungsi *callback* `ref`,](#ref-callback) atau sebuah string untuk [legacy refs.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Ref anda akan diisi dengan elemen DOM untuk *node* tersebut. [Baca lebih lanjut mengenai memanipulasi DOM dengan refs.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: Sebuah boolean. Jika `true`, menekan peringatan yang ditampilkan oleh React untuk element yang memngandung `children` dan `contentEditable={true}` (yang biasanya tidak bekerja secara bersamaan). Gunakan *prop* ini jika anda sedang membangun sebuah *library* input teks yang mengelola konten `contentEditable` secara manual.

* `suppressHydrationWarning`: Sebuah boolean. Jika anda menggunakan [*server rendering*,](/reference/react-dom/server) biasanya terdapat peringatan saat server dan client me-*render* konten yang berbeda. Untuk beberapa kasus langka (seperti tag waktu), sangat sulit atau tidak mungkin untuk menjamin kecocokan yang tepat. Jika anda mengatur `suppressHydrationWarning` menjadi `true`, React tidak akan memperingati anda mengenai ketidakcocokan dalam atribut ataupun konten dari elemen tersebut. Ini hanya bekerja sedalam satu tingkat, dan dimaksudkan untuk digunakan sebagai pintu keluar darurat. Jangan terlalu sering menggunakannya. [Baca mengenai menekan kesalahan hidrasi.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: Sebuah objek *styles* CSS, sebagai contoh `{ fontWeight: 'bold', margin: 20 }`. Seperti properti dari DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style), penamaan dari properti CSS harus ditulis dalam `camelCase`, sebagai contoh `fontWeight` bukan `font-weight`. Anda dapat mengoper string atau angka sebagai nilai. Jika anda memasukkan angka, seperti `width: 100`, React akan secara otomatis menambahkan `px` ("piksel") ke dalam nilai tersebut kecuali jika properti tersebut merupakan [properti tanpa unit.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) Kami merekomendasikan penggunaan `style` hanya untuk *styles* yang bersifat dinamis yang mana nilai dari *style* tersebut masih dapat berubah-ubah. Untuk kasus lainnya, penggunaan kelas *CSS* biasa dengan `className` lebih efisien. [Baca lebih lanjut mengenai `className` dan `style`.](#applying-css-styles)

Berikut *props* DOM standar yang juga didukung oleh setiap komponen bawaan: 

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): Sebuah string. Menentukan pintasan (*shortcut*) keyboard untuk elemen. [Tidak direkomendasikan secara umum.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): Atribut ARIA memungkinkan anda untuk menentukan informasi pohon aksesibilitas untuk elemen ini. Liat [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) untuk referensi yang lengkap. Dalam React, setiap atribut ARIA memiliki nama yang sama persis seperti di HTML.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): Sebuah string. menentukan apakah dan bagaimana masukkan dari pengguna harus dikapitalisasi.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): Sebuah string. Menentukan nama kelas CSS dari elemen tersebut. [Baca lebih lanjut mengenai menerapkan *styles* CSS.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): Sebuah boolean. Jika `true`, peramban web (*browser*) akan membiarkan pengguna untuk menyunting elemen yang di-*render* secara langsung. Ini digunakan untuk mengimplementasi *libraries* masukkan teks kaya seperti [Lexical.](https://lexical.dev/)  React akan memperingatkan jika anda mencoba untuk mengoper *children* React ke dalam elemen tersebut dengan `contentEditable={true}` karena React tidak akan bisa memperbarui konten tersebut setelah disunting oleh pengguna.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Atribut data membiarkan Anda melampirkan beberapa data string ke element, sebagai contoh `data-buah="pisang"`. Dalam React, hal ini jarang digunakan karena biasanya anda membaca data dari *props* ataupun *state*.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): Antara `'ltr'` atau `'rtl'`. Menentukan arah teks dari elemen tersebut.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): Sebuah boolean. Menentukan apakah elemen tersebut dapat diseret. Bagian dari [API HTML *Drag and Drop*.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): Sebuah string. Menentukan aksi apa yang direpresentasikan oleh tombol enter pada keyboard *virtual*.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): Sebuah string. Untuk [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) dan [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output), Memungkinan anda untuk [mengasosiasikan label the beberapa kontrol.](/reference/react-dom/components/input#providing-a-label-for-an-input) Sama seperti [atribut HTML `for`.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) React tidak menggunakan nama dari atribut HTML melainkan menggunakan nama properti standar DOM (`htmlFor`) 
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): Sebuah boolean atau string. Menentukan apakah sebuah elemen disembunyikan atau tidak.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): Sebuah string. Menentukan pengidentifikasi untuk untuk elemen ini, yang mana dapat digunakan untuk menemukannya kembali atau menghubungkannya dengan elemen lain. Dapatkan dengan menggunakan [`useId`](/reference/react/useId) untuk menghidari bentrokan antara beberapa *instances* pada komponen yang sama.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): Sebuah string. Jika ditentukan, maka komponen tersebut akan berperilaku seperti [elemen kustom.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): Sebuah string. Menentukan jenis keyboard apa yang akan ditampilkan (sebagai contoh, teks, angka or telepon).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): Sebuah string. Menentukan properti apa yang merepresentasikan elemen untuk  *crawler* data terstruktur.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): Sebuah string. Menentukan bahasa dari elemen tersebut.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): Sebuah fungsi [*handler* `AnimationEvent`](#animationevent-handler). Aktif saat sebuah animasi CSS selesai.
* `onAnimationEndCapture`: Sebuah versi dari `onAnimationEnd` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): Sebuah fungsi [*handler* `AnimationEvent`](#animationevent-handler). Aktif saat iterasi dari animasi CSS selesai, dan dimulainya animasi selanjutnya.
* `onAnimationIterationCapture`: Sebuah versi dari `onAnimationIteration` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): Sebuah fungsi [*handler* `AnimationEvent`](#animationevent-handler). Aktif saat animasi CSS dimulai.
* `onAnimationStartCapture`: `onAnimationStart`, tetapi aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): Sebuah fungsi [*handler* `MouseEvent`](#mouseevent-handler). Aktif saat tombol penunjuk (*pointer*) non-primer diklik.
* `onAuxClickCapture`: Sebuah versi dari `onAuxClick` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: Sebuah fungsi [*handler* `InputEvent`](#inputevent-handler). Aktif sebelum dilakukan modifikasi pada nilai dari elemen yang dapat disunting. React belum mengunakan *event* [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) *native*, dan alih-alih mencoba mengisinya menggunakan *event* lain.
* `onBeforeInputCapture`: Sebuah versi dari `onBeforeInput` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: Sebuah fungsi [*handler* `FocusEvent`](#focusevent-handler). Aktif saat sebuah elemen kehilangan fokus. Tidak seperti *event* [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) bawaan dari peramban web (*browser*), di React *event* `onBlur` menggelembung (*bubbles*).
* `onBlurCapture`: Sebuah versi dari `onBlur` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): Sebuah fungsi [*handler* `MouseEvent`](#mouseevent-handler). Aktif ketika tombol primer pada perangkat penunjuk (*pointer*) diklik.
* `onClickCapture`: Sebuah versi dari `onClick` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): Sebuah fungsi [*handler* `CompositionEvent`](#compositionevent-handler). Aktif saat [*input method editor*](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) memulai sebuah sesi komposisi baru.
* `onCompositionStartCapture`: Sebuah versi dari `onCompositionStart` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): Sebuah fungsi [*handler* `CompositionEvent`](#compositionevent-handler). Aktif saat [*input method editor*](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) menyelesaikan atau membatalkan sebuah sesi komposisi.
* `onCompositionEndCapture`: Sebuah versi dari `onCompositionEnd` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): Sebuah fungsi [*handler* `CompositionEvent`](#compositionevent-handler). Aktif saat [*input method editor*](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) menerima karakter baru.
* `onCompositionUpdateCapture`: Sebuah versi dari `onCompositionUpdate` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): Sebuah fungsi [*handler* `MouseEvent`](#mouseevent-handler). Aktif saat pengguna mencoba untuk membuka menu konteks.
* `onContextMenuCapture`: Sebuah versi dari `onContextMenu` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): Sebuah fungsi [*handler* `ClipboardEvent`](#clipboardevent-handler). Aktif saat pengguna mencoba menyalin (*copy*) sesuatu ke *clipboard*.
* `onCopyCapture`: Sebuah versi dari `onCopy` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): Sebuah fungsi [*handler* `ClipboardEvent`](#clipboardevent-handler). Aktif saat pengguna mencoba untuk memotong (*cut*) sesuatu ke *clipboard*.
* `onCutCapture`: Sebuah versi dari `onCut` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: Sebuah fungsi [*handler* `MouseEvent`](#mouseevent-handler). Aktif saat pengguna melakukan klik sebanyak dua kali. Sesuai dengan [*event* `dblclick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event) pada peramban web (*browser*).
* `onDoubleClickCapture`: Sebuah versi dari `onDoubleClick` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): Sebuah fungsi [*handler* `DragEvent`](#dragevent-handler). Aktif ketika user mencoba untuk menyeret sesuatu. 
* `onDragCapture`: Sebuah versi dari `onDrag` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): Sebuah fungsi [*handler* `DragEvent`](#dragevent-handler). Aktif saat user berhenti menyeret sesuatu. 
* `onDragEndCapture`: Sebuah versi dari `onDragEnd` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): Sebuah fungsi [*handler* `DragEvent`](#dragevent-handler). Aktif saat konten yang terseret memasuki suatu target penurunan yang valid. 
* `onDragEnterCapture`: Sebuah versi dari `onDragEnter` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): Sebuah fungsi [*handler* `DragEvent`](#dragevent-handler). Aktif pada target penurunan yang valid saat konten yang terseret sedang berada pada target tersebut. Anda perlu memanggil `e.preventDefault()` untuk memengizinkan proses penurunan.
* `onDragOverCapture`: Sebuah versi dari `onDragOver` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): Sebuah fungsi [*handler* `DragEvent`](#dragevent-handler). Aktif saat pengguna mulai menyeret sebuah element.
* `onDragStartCapture`: Sebuah versi dari `onDragStart` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): Sebuah fungsi [*handler* `DragEvent`](#dragevent-handler). Aktif saat terdapat sesuatu yang diturunkan pada target penurunan yang valid.
* `onDropCapture`: Sebuah versi dari `onDrop` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: Sebuah fungsi [*handler* `FocusEvent`](#focusevent-handler). Aktif saat sebuah elemen kehilangan fokus. Berbeda dengan *event* [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) bawaan dari peramban web (*browser*), di React *event* `onFocus` menggelembung (*bubbles*).
* `onFocusCapture`: Sebuah versi dari `onFocus` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): Sebuah fungsi [*handler* `PointerEvent`](#pointerevent-handler). Aktif saat sebuah elemen secara terprogram menangkap penunjuk (*pointer*).
* `onGotPointerCaptureCapture`: Sebuah versi dari `onGotPointerCapture` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): Sebuah fungsi [*handler* `KeyboardEvent`](#pointerevent-handler). Aktif saat sebuah tombol ditekan.
* `onKeyDownCapture`: Sebuah versi dari `onKeyDown` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): Sebuah fungsi [*handler* `KeyboardEvent`](#pointerevent-handler). *Deprecated*. Gunakan `onKeyDown` atau `onBeforeInput`.
* `onKeyPressCapture`: Sebuah versi dari `onKeyPress` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): Sebuah fungsi [*handler* `KeyboardEvent`](#pointerevent-handler). Aktif saat sebuah tombol dilepaskan.
* `onKeyUpCapture`: Sebuah versi dari `onKeyUp` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): Sebuah fungsi [*handler* `PointerEvent`](#pointerevent-handler). Aktif saat sebuah elemen berhenti menangkap sebuah penunjuk (*pointer*).
* `onLostPointerCaptureCapture`: Sebuah versi dari `onLostPointerCapture` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): Sebuah fungsi [*handler* `MouseEvent`](#mouseevent-handler). Aktif saat penunjuk (*pointer*) ditekan.
* `onMouseDownCapture`: Sebuah versi dari `onMouseDown` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): Sebuah fungsi [*handler* `MouseEvent`](#mouseevent-handler). Aktif saat sebuah penunjuk masuk kedalam sebuah element. Tidak mempunyai fase penangkapan. Alih-alih, `onMouseLeave` dan `onMouseEnter` merambat dari satu elemen yang ditinggalkan menuju ke elemen yang dituju/dimasukkan.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): Sebuah fungsi [*handler* `MouseEvent`](#mouseevent-handler). Aktif saat penunjuk (*pointer*) berada diluar elemen. Tidak mempunyai fase penangkan. Alih-alih, `onMouseLeave` dan `onMouseEnter` merambat dari satu elemen yang ditinggalkan menuju ke elemen yang dituju/dimasukkan.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): Sebuah fungsi [*handler* `MouseEvent`](#mouseevent-handler). Aktif saat penunjuk (*pointer*) merubah koordinat.
* `onMouseMoveCapture`: Sebuah versi dari `onMouseMove` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): Sebuah fungsi [*handler* `MouseEvent`](#mouseevent-handler). Aktif saat penunjuk (*pointer*) bergerak keluar dari sebuah elemen, atau ketika bergerak ke suatu anak elemen.
* `onMouseOutCapture`: Sebuah versi dari `onMouseOut` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): Sebuah fungsi [*handler* `MouseEvent`](#mouseevent-handler). Aktif saat penunjuk dilepaskan.
* `onMouseUpCapture`: Sebuah versi dari `onMouseUp` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): Sebuah fungsi [*handler* `PointerEvent`](#pointerevent-handler). Aktif saat peramban web (*browser*) membatalkan sebuah interaksi penunjuk (*pointer*).
* `onPointerCancelCapture`: Sebuah versi dari `onPointerCancel` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): Sebuah fungsi [*handler* `PointerEvent`](#pointerevent-handler). Aktif saat sebuah penunjuk (*pointer*) menjadi aktif.
* `onPointerDownCapture`: Sebuah versi dari `onPointerDown` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): Sebuah fungsi [*handler* `PointerEvent`](#pointerevent-handler). Aktif saat sebuah penunjuk (*pointer*) bergerak memasukki sebuah elemen. Tidak mempunyai fase penangkapan. Alih-alih, `onPointerLeave` dan `onPointerEnter` merambat dari satu elemen yang ditinggalkan menuju ke elemen yang dituju/dimasukkan.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): Sebuah fungsi [*handler* `PointerEvent`](#pointerevent-handler). Aktif saat sebuah penunjuk (*pointer*) bergerak keluar dari sebuah elemen. Tidak mempunyai fase penangkapan. Alih-alih, `onPointerLeave` and `onPointerEnter` merambat dari satu elemen yang ditinggalkan menuju ke elemen yang dituju/dimasukkan.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): Sebuah fungsi [*handler* `PointerEvent`](#pointerevent-handler). Aktif saat penunjuk (*pointer*) mengubah koordinat.
* `onPointerMoveCapture`: Sebuah versi dari `onPointerMove` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): Sebuah fungsi [*handler* `PointerEvent`](#pointerevent-handler). Aktif saat penunjuk (*pointer*) bergerak keluar dari sebuah elemen, Saat interaksi dari penunjuk (*pointer*) dibatalkan, dan [karena alasan lainnya.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: Sebuah versi dari `onPointerOut` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): Sebuah fungsi [*handler* `PointerEvent`](#pointerevent-handler). Aktif saat penunjuk (*pointer*) tidak lagi aktif.
* `onPointerUpCapture`: Sebuah versi dari `onPointerUp` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): Sebuah fungsi [*handler* `ClipboardEvent`](#clipboardevent-handler). Aktif saat pengguna mencoba untuk menemplekan sesuatu dari *clipboard*.
* `onPasteCapture`: Sebuah versi dari `onPaste` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat sebuah elemen telah di-*scroll*. *Event* ini tidak menggelembung (bubble).
* `onScrollCapture`: Sebuah versi dari `onScroll` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif setelah seleksi dari sebuah elemen yang dapat disunting seperti input, mengalami perubahan. React memperluas *event* `onSelect` agar dapat bekerja juga di elemen `contentEditable={true}`. Sebagai tambahan, React memperluasnya agar aktif pada seleksi kosong dan juga pada saat proses menyunting (memungkian pengaruh terhadap seleksi).
* `onSelectCapture`: Sebuah versi dari `onSelect` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): Sebuah fungsi [*handler* `TouchEvent`](#touchevent-handler). Aktif saat peramban web (*browser*) membatalkan sebuah interaksi sentuhan.
* `onTouchCancelCapture`: Sebuah versi dari `onTouchCancel` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): Sebuah fungsi [*handler* `TouchEvent`](#touchevent-handler). Aktif saat satu atau lebih titik sentuhan dihapus/dilepaskan.
* `onTouchEndCapture`: Sebuah versi dari `onTouchEnd` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): Sebuah fungsi [*handler* `TouchEvent`](#touchevent-handler). Aktif saat satu atau lebih titik sentuhan bergerak.
* `onTouchMoveCapture`: Sebuah versi dari `onTouchMove` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): Sebuah fungsi [*handler* `TouchEvent`](#touchevent-handler). Aktif saat satu atau lebih titik diletakkan.
* `onTouchStartCapture`: Sebuah versi dari `onTouchStart` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): Sebuah fungsi [*handler* `TransitionEvent`](#transitionevent-handler). Aktif saat transisi CSS selesai.
* `onTransitionEndCapture`: Sebuah versi dari `onTransitionEnd` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): Sebuah fungsi [*handler* `WheelEvent`](#wheelevent-handler). Aktif saat pengguna memutar tombol *wheel*.
* `onWheelCapture`: Sebuah versi dari `onWheel` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Sebuah string. Menentukan peran elemen secara eksplisit untuk teknologi bantuan.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Sebuah string. Menentukan nama dari slot saat menggunakan DOM bayangan. Di React, pola yang ekuivalen biasanya didapatkan dengan mengoper JSX sebagai sebuah *props*, sebagai contoh `<Layout kiri={<Sidebar />} kanan={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): Sebuah boolean atau null. Jika secara eksplisit diatur sebagai `true` atau `false`, mengaktifkan atau menonaktifkan pemeriksaan ejaan.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): Sebuah angka. Menimpa perilaku bawaan dari tombol Tab. [Hindari penggunaan nilai selain `-1` dan `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): Sebuah string. Menentukan teks *tooltip* untuk elemen tersebut.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): Antara `'yes'` atau `'no'`. Mengoper nilai `'no'` mengecualikan konten elemen agar tidak diterjemahkan.

Anda juga dapat mengoper atribut kustom sebagai *props*, sebagai contoh `custompropsaya="sebuahNilai".` Hal ini akan sangat berguna pada proses pengintegrasian dengan *libraries* pihak ketiga. Nama dari atribut kustom ini harus *lowercase* (dalam huruf non-kapital) dan tidak diawali dengan `on`. Nilai tersebut akan dikonversikan kedalam String. Jika anda mengoper nilai `null` atau `undefined`, atribut kustom tersebut akan dihapus. 

Berikut *events* yang hanya aktif untuk elemen [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form):

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat sebuah *form*  mengalami pengaturan ulang(*reset*).
* `onResetCapture`: Sebuah versi dari `onReset` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat sebuah *form* dikirim.
* `onSubmitCapture`: Sebuah versi dari `onSubmit` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)

Berikut *events* yang hanya aktif untuk elemen [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Tidak seperti *events* bawaan peramban web (*browser*), di React *event-event* ini menggelembung (*bubble*):

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event):  Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat pengguna mencoba untuk mengabaikan/menutup dialog.
* `onCancelCapture`: Sebuah versi dari `onCancel` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat sebuah dialog telah ditutup.
* `onCloseCapture`: Sebuah versi dari `onClose` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)

Berikut *events* yang hanya aktif untuk elemen [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details). Tidak seperti *events* bawaan peramban web (*browser*), di React *event-event* ini menggelembung (*bubble*):

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat pengguna mengaktifkan detailnya.
* `onToggleCapture`: Sebuah versi dari `onToggle` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
capture-phase-events)

Berikut *events* yang aktif untuk elemen [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), dan [SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag). Tidak seperti *events* bawaan peramban web (*browser*), di React *event-event* ini menggelembung (*bubble*):

* `onLoad`: Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat sumber daya telah dimuat.
* `onLoadCapture`: Sebuah versi dari `onLoad` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat sumber daya tidak dapat dimuat.
* `onErrorCapture`: Sebuah versi dari `onError` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)

Berikut *events* yang aktif pada beberapa sumber daya seperti [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) dan [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). Tidak seperti *events* bawaan peramban web (*browser*), di React *event-event* ini menggelembung (*bubble*):

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat sumber daya belum sepenuhnya dimuat, tetapi bukan karena adanya kesalahan.
* `onAbortCapture`: Sebuah versi dari `onAbort` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat terdapat cukup data sehingga dapat dimulai, tetapi belum cukup untuk diputar hingga akhir tanpa adanya *buffering*.
* `onCanPlayCapture`: Sebuah versi dari `onCanPlay` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat terdapat cukup data yang memungkinkan untuk diputar dari awal hingga akhir tanpa adanya *buffering*.
* `onCanPlayThroughCapture`: Sebuah versi dari `onCanPlayThrough` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat durasi dari media berubah/diperbarui.
* `onDurationChangeCapture`: Sebuah versi dari `onDurationChange` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat media telah menjadi kosong. 
* `onEmptiedCapture`: Sebuah versi dari `onEmptied` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): Sebuah fungsi [`Event` *handler*](#event-handler). Aktif saat peramban web (*browser*) menemukan media yang terenkripsi.
* `onEncryptedCapture`: Sebuah versi dari `onEncrypted` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat pemutaran berhenti karena tidak ada yang tersisa untuk diputar.
* `onEndedCapture`: Sebuah versi dari `onEnded` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat terdapat sumber daya yang tidak dapat dimuat.
* `onErrorCapture`: Sebuah versi dari `onError` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat *frame* pemutaran sekarang berhasil dimuat.
* `onLoadedDataCapture`: Sebuah versi dari `onLoadedData` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat metadata berhasil dimuat.
* `onLoadedMetadataCapture`: Sebuah versi dari `onLoadedMetadata` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat peramban web (*browser*) mulai untuk memuat sumber daya.
* `onLoadStartCapture`: Sebuah versi dari `onLoadStart` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat media dijeda.
* `onPauseCapture`: Sebuah versi dari `onPause` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat media sudah tidak lagi dijeda.
* `onPlayCapture`: Sebuah versi dari `onPlay` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat media mulai atau media terulang kembali.
* `onPlayingCapture`: Sebuah versi dari `onPlaying` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif secara periodik ketika sumber daya sedang memuat.
* `onProgressCapture`: Sebuah versi dari `onProgress` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat adanya perubahan pada tingkat pemutaran (*playback rate*).
* `onRateChangeCapture`: Sebuah versi dari `onRateChange` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* `onResize`: Sebuah fungsi [`Event` handler](#event-handler). Aktif saat ukuran dari video berubah.
* `onResizeCapture`: Sebuah versi dari `onResize` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat operasi pencarian selesai.
* `onSeekedCapture`: Sebuah versi dari `onSeeked` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat operasi pencari dimulai.
* `onSeekingCapture`: Sebuah versi dari `onSeeking` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat peramban web (*browser*) sedang menunggu data tetapi tetap tidak memuat.
* `onStalledCapture`: Sebuah versi dari `onStalled` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat proses memuat sumber daya dihentikan.
* `onSuspendCapture`: Sebuah versi dari `onSuspend` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat adanya perubahan pada waktu dari pemutaran sekarang.
* `onTimeUpdateCapture`: Sebuah versi dari `onTimeUpdate` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat adanya perubahan pada volume.
* `onVolumeChangeCapture`: Sebuah versi dari `onVolumeChange` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): Sebuah fungsi [`Event` handler](#event-handler). Aktif saat pemutaran dihentikan karena ada kekurangan data sementara.
* `onWaitingCapture`: Sebuah versi dari `onWaiting` yang aktif pada [fase penangkapan.](/learn/responding-to-events#capture-phase-events)

#### Peringatan {/*common-caveats*/}

- Anda tidak bisa mengoper `children` dan `dangerouslySetInnerHTML` secara bersamaan.
- Beberapa *event* (seperti `onAbort` dan `onLoad`) tidak menggelembung (*bubble*) di peramban web, tetapi menggelembung (*bubble*) di React.

---

### Fungsi Callback `ref` {/*ref-callback*/}

Alih-alih menggunakan sebuah objek ref (seperti yang dikembalikan oleh [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), anda dapat mengoper sebuah fungsi ke atribut `ref`.

```js
<div ref={(node) => console.log(node)} />
```

[Lihat contoh dari penggunaan dari *callback* `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

Saat *node* DOM `<div>` ditambahkan pada layar, React akan memanggil *callbak* dari `ref` beserta dengan `node` DOM sebagai sebuah argumen. Saat *node* DOM `<div>` tersebut dihapus, React akan memanggil *callback* `ref` dengan `null`

React juga akan memanggi *callback* `ref` setiap kali anda mengoper sebuah *callback* `ref` yang berbeda. Pada contoh di atas, `(node) => { ... }` adalah fungsi yang berbeda pada setiap *render*. Saat komponen anda mengalami *render* ulang, fungsi sebelumnya akan dipanggil dengan `null` sebagai argumennya, dan fungsi selanjutnya akan dipanggi dengan *node* DOM.

#### Parameter {/*ref-callback-parameters*/}

* `node`: Sebuah *node* DOM atau `null`. React akan mengoper kepada anda *node* DOM saat ref terpasang, dan `null` saat ref dilepas. Kecuali, jika anda mengoper referensi fungsi yang sama untuk *callback* `ref` pada setiap *render*, *callback* tersebut akan secara sementara dilepaskan dan dipasang kembali pada setiap *render* ulang dari komponen tersebut.

#### Pengembalian (Returns) {/*returns*/}

Jangan menggembalikan apa pun pada *callback* `ref`.

---

### Objek event React {/*react-event-object*/}

*Event handlers* anda akan menerima sebuah *Objek Event React.* Biasanya juga dikenal sebagai "*synthetic event*".

```js
<button onClick={e => {
  console.log(e); // React event object
}} />
```

Itu sesuai dengan stadar yang sama dengan *events* DOM yang mendasdarinya, tetapi memperbaiki beberapa ketidakkonsistenan dari peramban web (*browser*).

Beberapa *events* React tidak dipetakan secara langsung ke *events* asli dari peramban web (*browser*). Sebaagi contoh `onMouseLeave`, `e.nativeEvent` akan menunjuk ke sebuah *event* `mouseout`. Pemetaan spesifik bukan bagian dari API publik dan masih dapat berubah di masa mendatang. Jika anda memerlukan *event* peramban web (*browser*) mendasari karena alasan tertentu, bacalah dari `e.nativeEvent`. 

#### Properti {/*react-event-object-properties*/}

Objek *event* React mengimplementasikan beberapa properti standar [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event):

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): Sebuah boolean. Mengembalikan apakah gelembung (*bubbles*) dari *event* melewati DOM.
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): Sebuah boolean. Mengembalikan apakah *event* dapat dibatalkan.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): Sebuah *node* DOM. Mengembalikan *node*  tempat handler saat ini terpasang di pohon React.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): Sebuah boolean. Mengembalikan apakah `preventDefault` dipanggil.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): Sebuah angka. Mengembalikan fase *event* saat ini.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): Sebuah boolean. Mengembalikan apakah *event* diinisiasi oleh pengguna.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): Sebuah *node* DOM. Mengembalikan *node* dimana *event* terjadi (yang bisa jadi *child* jauh).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): Sebuah angkah. Mengembalikan waktu terjadinya *event*.

Selain itu, Objek *event* React juga menyediakan properti berikut:

* `nativeEvent`: Sebuah DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). Objek *event* original dari peramban web (*browser*).

#### Metode {/*react-event-object-methods*/}

Objek *event* React mengimplementasikan beberapa metode standar [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event):

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): Mencegah aksi bawaan peramban web (*browser*) untuk *event* tersebut.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): Menghentikan propagasi *event* melalui pohon React.

Selain itu, objek *event* React juga menyediakan metode berikut:

* `isDefaultPrevented()`: Mengembalikan sebuah nilai boolean yang mengindikasikan apakah `preventDefault` dipanggil.
* `isPropagationStopped()`: Mengembalikan sebuah nilai boolean yang mengindikasikan apakah `stopPropagation` dipanggil.
* `persist()`: Tidak digunakan dengan DOM React. Dengan React Native, panggil ini untuk membaca properti dari *event* setelah *event*.
* `isPersistent()`: Tidak digunakan dengan DOM React. Dengan React Native, Mengembalikan apakah `persist` telah dipanggil.

#### Peringatan {/*react-event-object-caveats*/}

* Nilai dari `currentTarget`, `eventPhase`, `target`, dan `type` menunjukkan nilai yang diharapkan oleh kode React anda. Di dalamnya, React memasang *event handlers* pada akarnya, tetapi ini tidak merefleksi di objek *event* React. Sebagai contoh, `e.currentTarget` mungkin tidak sama dengan `e.nativeEvent.currentTarget`. Untuk *polyfilled events*, `e.type` (Tipe *event* React) mungkin berbeda dengan `e.nativeEvent.type` () 

 but this is not reflected in React event objects. For example, `e.currentTarget` may not be the same as the underlying `e.nativeEvent.currentTarget`. For polyfilled events, `e.type` (React event type) may differ from `e.nativeEvent.type` (tipe yang mendasari).

---

### Fungsi `AnimationEvent` handler {/*animationevent-handler*/}

Sebuah tipe *event handler* untuk *events* [animasi CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Parameter {/*animationevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent):
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### Fungsi `ClipboardEvent` handler {/*clipboadevent-handler*/}

Sebuah tipe *event handler* untuk *events* [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Parameter {/*clipboadevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent):

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### Fungsi `CompositionEvent` handler {/*compositionevent-handler*/}

Sebuah tipe *event handler* untuk *events* [*input method editor* (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor).

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Parameter {/*compositionevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### Fungsi `DragEvent` handler {/*dragevent-handler*/}

Sebuah tipe *event handler* untuk *events* [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Sumber tarik
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Target Penurunan
  </div>
</>
```

#### Parameter {/*dragevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent):
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  Ini juga termasuk properti yang diturunkan oleh [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Ini juga termasuk properti yang diturunkan oleh [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Fungsi `FocusEvent` handler {/*focusevent-handler*/}

Sebuah tipe *event handler* untuk *events* fokus.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[Lihat Contoh.](#handling-focus-events)

#### Parameter {/*focusevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent):
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  Ini juga termasuk properti yang diturunkan oleh [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Fungsi `Event` handler {/*event-handler*/}

Sebuah tipe *event handler* untuk *events* umum.

#### Parameters {/*event-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) tanpa properti tambahan.

---

### Fungsi `InputEvent` handler {/*inputevent-handler*/}

Sebuah tipe *event handler* untuk *event* `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Parameter {/*inputevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### Fungsi `KeyboardEvent` handler {/*keyboardevent-handler*/}

Sebuah tipe *event handler* untuk *event* papan ketik (*keyboard*).

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[Lihat Contoh.](#handling-keyboard-events)

#### Parameters {/*keyboardevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  Ini juga termasuk properti yang diturunkan oleh [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Fungsi `MouseEvent` handler {/*mouseevent-handler*/}

Sebuah tipe *event handler* untuk *event* tetikus (*mouse*).

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[Lihat Contoh.](#handling-mouse-events)

#### Parameter {/*mouseevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Ini juga termasuk properti yang diturunkan oleh [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Fungsi `PointerEvent` handler {/*pointerevent-handler*/}

Sebuah tipe *event handler* untuk [*pointer events*.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[Lihat Contoh.](#handling-pointer-events)

#### Parameters {/*pointerevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent):
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  Ini juga termasuk properti yang diturunkan oleh [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Ini juga termasuk properti yang diturunkan oleh [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Fungsi `TouchEvent` handler {/*touchevent-handler*/}

Sebuah tipe *event handler* untuk [*touch events*.](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Parameter {/*touchevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  Ini juga termasuk properti yang diturunkan oleh [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Fungsi `TransitionEvent` handler {/*transitionevent-handler*/}

Sebuah tipe *event handler* untuk *events* transisi CSS.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Parameter {/*transitionevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent):
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### Fungsi `UIEvent` handler {/*uievent-handler*/}

Sebuah tipe *event handler* untuk *events* UI umum.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parameters {/*uievent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Fungsi `WheelEvent` handler {/*wheelevent-handler*/}

Sebuah tipe *event handler* untuk *event* `onWheel`.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parameter {/*wheelevent-handler-parameters*/}

* `e`: Sebuah [objek *event* React](#react-event-object) dengan tambahan properti [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent):
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  Ini juga termasuk properti yang diturunkan oleh [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Ini juga termasuk properti yang diturunkan oleh [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Penggunaan {/*usage*/}

### Mengaplikasikan *styles* CSS {/*applying-css-styles*/}

Dalam React, anda me
In React, you menentukan kelas CSS dengan [`className`.](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) yang bekerja sama seperti atribut `class` di HTML:

```js
<img className="avatar" />
```

Lalu, anda menulis aturan CSS untuknya pada *file* CSS terpisah:

```css
/* Di file CSS anda */
.avatar {
  border-radius: 50%;
}
```

React tidak menentukan bagaimana cara anda menambahkan *file* CSS. Dalam kasus yang sederhana, anda akan menambahkan tag [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) pada HTML anda. Jika anda menggunakan sebuah alat membangun (*build tool*) atau *framework*, lihat dokumentasinya untuk mempelajari cara menambahkan file CSS ke proyek Anda.

Terkadang, nilai dari *style* tergantung pada data. Gunakan atribut `style` untuk mengoper beberapa *styles* secara dinamis:

```js {3-6}
<img
  className="avatar"
  style={{
    width: pengguna.ukuranGambar,
    height: pengguna.ukuranGambar
  }}
/>
```


Pada contoh di atas, `style={{}}` bukan merupakan sintaks khusus, tapi terdapat objek reguler `{}` di dalam `style={ }` [Kurung Kurawal JSX.](/learn/javascript-in-jsx-with-curly-braces) Kami merekomendasikan penggunaan atribut `style` hanya jika *styles* anda tergantung pada variabel Javascript.

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

const pengguna = {
  nama: 'Budi',
  urlGambar: 'https://i.imgur.com/yXOvdOSs.jpg',
  ukuranGambar: 90,
};

export default function App() {
  return <Avatar pengguna={pengguna} />;
}
```

```js Avatar.js active
export default function Avatar({ pengguna }) {
  return (
    <img
      src={pengguna.urlGambar}
      alt={'Foto dari ' + pengguna.nama}
      className="avatar"
      style={{
        width: pengguna.ukuranGambar,
        height: pengguna.ukuranGambar
      }}
    />
  );
}
```

```css styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### Bagaimana cara menerapkan beberapa kelas CSS secara kondisional? {/*how-to-apply-multiple-css-classes-conditionally*/}

Untuk menerapkan kelas CSS secara kondisional, Anda perlu menghasilkan string `className` dengan JavaScript.

Sebagai contoh, `className={'baris ' + (sedangDipilih ? 'dipilih': '')}` akan menghasilkan antara `className="baris"` atau `className="baris dipilih"` tergantung apakah nilai dari `sedangDipilih` adalah `true`. 

Untuk membuatnya lebih mudah dipaca, anda dapat menggunakan *library* bantuan seperti [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Baris({ sedangDipilih }) {
  return (
    <div className={cn('baris', sedangDipilih && 'dipilih')}>
      ...
    </div>
  );
}
```

Ini sangat mudah jika Anda memiliki beberapa kelas kondisional:

```js
import cn from 'classnames';

function Baris({ sedangDipilih, ukuran }) {
  return (
    <div className={cn('baris', {
      dipilih: sedangDipilih,
      besar: ukuran === 'besar',
      kecil: ukuran === 'kecil',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Memanipulasi node DOM dengan sebuah ref {/*manipulating-a-dom-node-with-a-ref*/}

Terkadang, anda perlu untuk mengambil node DOM peramban web (*browser*) yang berasosiasi dengan tag di JSX. Sebagai contoh, jika anda ingin fokus pada sebuah `<input>` saat sebuah tombol diklik, anda harus memanggil [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) pada *node* DOM `<input>` peramban web (*browser*). 

Untuk mendapatkan *node* DOM peramban web (*browser*) untuk sebuah tag, [deklarasikan sebuah ref](/reference/react/useRef) dan oper sebagai atribut `ref` pada tag tersebut:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const refMasukkan = useRef(null);
  // ...
  return (
    <input ref={refMasukkan} />
    // ...
```

React akan meletakkan *node* DOM ke `inputRef.current` setelah ter-*render* pada layar.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const refMasukkan = useRef(null);

  function handleKlik() {
    refMasukkan.current.focus();
  }

  return (
    <>
      <input ref={refMasukkan} />
      <button onClick={handleKlik}>
        Fokus pada input
      </button>
    </>
  );
}
```

</Sandpack>

Baca lebih lanjut mengenai [memanipulasi DOM dengan refs](/learn/manipulating-the-dom-with-refs) and [lihat lebih banyak contoh.](/reference/react/useRef#examples-dom)

Untuk kasus yang lebih canggih, attribut `ref` juga menerima sebuah [fungsi *callback*.](#ref-callback)

---

### Mengatur inner HTML secara bahaya {/*dangerously-setting-the-inner-html*/}

Anda dapat mengoper string HTML mentah ke sebuah elemen seperti berikut:

```js
const markup = { __html: '<p>beberapa HTML mentah</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**Hal ini berbahaya. Karena dengan properti DOM mendasar [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML), anda harus sangat berhati-hati! Kecuali, markup tersebut berasal dari sumber yang sepenuhnya dipercayai, Itu sepele untuk memperkenalkan kerentanan [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting).**

Sebagai contoh, jika anda menggunakan *library* Markdown untuk mengkonversi Markdown ke HTML, Anda percaya bahwa *parser* tidak mengandung bug, dan pengguna hanya melihat masukan mereka sendiri, Anda dapat menampilkan HTML yang dihasilkan seperti ini:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Masukkan beberapa markdown
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownKeHTML(markdown) {
  // Ini HANYA aman karena keluaran HTML
  // ditampilkan kepada pengguna yang sama, dan karena Anda
  // percayakan parser Markdown ini untuk tidak memiliki bug.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownKeHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

Untuk mengetahui mengapa me-*render* HTML sewenang-wenang itu berbahaya, ganti kode di atas dengan ini:

```js {1-4,7,8}
const post = {
  // Imagine this content is stored in the database.
  content: `<img src="" onerror='alert("anda di hack!")'>`
};

export default function MarkdownPreview() {
  // 🔴 SECURITY HOLE: passing untrusted input to dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

Kode yang disematkan dalam HTML akan berjalan. Seorang peretas dapat menggunakan lubang keamanan ini untuk mencuri informasi pengguna atau melakukan tindakan atas nama mereka. **Hanya gunakan `dangerouslySetInnerHTML` dengan data tepercaya dan tersanitasi.**

---

### Penanganan *events* mouse {/*handling-mouse-events*/}

Contoh dibawah ini menunjukkan beberapa [*events* mouse (tetikus)](#mouseevent-handler) umum dan saat mereka aktif.

<Sandpack>

```js
export default function ContohMouse() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (Tombol Pertama)')}
        onMouseDown={e => console.log('onMouseDown (Tombol Pertama)')}
        onMouseEnter={e => console.log('onMouseEnter (Tombol Pertama)')}
        onMouseLeave={e => console.log('onMouseLeave (Tombol Pertama)')}
        onMouseOver={e => console.log('onMouseOver (Tombol Pertama)')}
        onMouseUp={e => console.log('onMouseUp (Tombol Pertama)')}
      >
        Tombol Pertama
      </button>
      <button
        onClick={e => console.log('onClick (Tombol Kedua)')}
        onMouseDown={e => console.log('onMouseDown (Tombol Kedua)')}
        onMouseEnter={e => console.log('onMouseEnter (Tombol Kedua)')}
        onMouseLeave={e => console.log('onMouseLeave (Tombol Kedua)')}
        onMouseOver={e => console.log('onMouseOver (Tombol Kedua)')}
        onMouseUp={e => console.log('onMouseUp (Tombol Kedua)')}
      >
        Tombol Kedua
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Penanganan *events* penunjuk {/*handling-pointer-events*/}

Contoh dibawah ini menunjukkan beberapa [*events* penunjuk](#pointerevent-handler) umum dan saat mereka aktif.

<Sandpack>

```js
export default function ContohPenunjuk() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (Child Pertama)')}
        onPointerEnter={e => console.log('onPointerEnter (Child Pertama)')}
        onPointerLeave={e => console.log('onPointerLeave (Child Pertama)')}
        onPointerMove={e => console.log('onPointerMove (Child Pertama)')}
        onPointerUp={e => console.log('onPointerUp (Child Pertama)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        Child Pertama
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (Child Kedua)')}
        onPointerEnter={e => console.log('onPointerEnter (Child Kedua)')}
        onPointerLeave={e => console.log('onPointerLeave (Child Kedua)')}
        onPointerMove={e => console.log('onPointerMove (Child Kedua)')}
        onPointerUp={e => console.log('onPointerUp (Child Kedua)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Child Kedua
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Penanganan *events* fokus {/*handling-focus-events*/}

Dalam React, [*events* fokus](#focusevent-handler) menggelembung (*bubble*). Anda dapat menggunakan `currentTarget` dan `relatedTarget`  
In React, [focus events](#focusevent-handler) bubble. You can use the `currentTarget` and `relatedTarget` untuk membedakan apakah *events* pemfokusan atau pemburaman berasal dari luar elemen *parent*. Contoh tersebut menunjukkan cara mendeteksi fokus *child*, memfokuskan elemen *parent*, dan cara mendeteksi fokus masuk atau keluar dari seluruh subpohon.

<Sandpack>

```js
export default function ContohFokus() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('parent yang difokus');
        } else {
          console.log('child yang difokus', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Tidak terpicu saat bertukar fokus di antara children
          console.log('fokus memasukki parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('parent yang tidak difokus');
        } else {
          console.log('child yang tidak difokus', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Tidak terpicu saat bertukar fokus di antara children
          console.log('fokus meninggalkan parent');
        }
      }}
    >
      <label>
        Nama Pertama:
        <input name="namaPertama" />
      </label>
      <label>
        Nama Akhir:
        <input name="namaAkhir" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Penanganan *events* papan ketik (*keyboard*). {/*handling-keyboard-events*/}

Contoh dibawah ini menunjukkan beberapa [*events* papan ketik (*keyboard*)](#keyboardevent-handler) umum dan saat mereka aktif.

<Sandpack>

```js
export default function ContohKeyboard() {
  return (
    <label>
      Nama Pertama:
      <input
        name="namaPertama"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
