---
id: dom-elements
title: Elemen-elemen DOM
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React mengimplementasikan sistem DOM yang independen terhadap peramban demi performa dan kompatibilitas lintas peramban. Kami mengambil kesempatan untuk membersihkan beberapa sisi kasar dalam implementasi DOM peramban.

Di React, semua properti dan atribut DOM (termasuk *event handlers*) harus menggunakan *camelCase*. Sebagai contoh, atribut HTML `tabindex` mengacu pada atribut `tabIndex` di React. Terdapat pengecualian untuk atribut `aria-*` dan `data-*`, yang mana menggunakan *lowercase*. Sebagai contoh, Anda dapat membiarkan `aria-label` sebagai `aria-label`.

## Perbedaan Atribut {#differences-in-attributes}

Terdapat beberapa atribut yang bekerja secara berbeda antara React dan HTML:

### checked {#checked}

Atribut `checked` didukung oleh komponen `<input>` dengan tipe `checkbox` atau `radio`. Anda dapat menggunakannya untuk mengatur apakah komponen telah dicek. Hal ini bermanfaat untuk membangun komponen yang dikendalikan. `defaultChecked` adalah padanan yang tidak terkontrol, yang menetapkan apakah komponen telah dicek ketika pertama kali dipasang.

### className {#classname}

Untuk menentukan kelas CSS, gunakan atribut `className`. Hal ini berlaku untuk seluruh DOM reguler dan elemen SVG seperti `<div>`, `<a>`, dan lainnya.

Jika Anda menggunakan React dengan Komponen Web (yang mana tidak lazim), sebagai gantinya gunakan atribut `class`.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` adalah pengganti `innerHTML` milik React pada DOM peramban. Secara umum, pengaturan HTML melalui kode memiliki resiko karena secara tidak sengaja sangat mudah untuk membuka celah serangan [*cross-site scripting* (XSS)](https://id.wikipedia.org/wiki/XSS) kepada pengguna Anda. Sehingga, Anda dapat mengatur HTML secara langsung dari React, tetapi Anda harus mengetik `dangerouslySetInnerHTML` dan memberikan sebuah objek dengan *key* `__html`, untuk mengingatkan Anda sendiri bahwa hal ini berbahaya. Sebagai contoh:

```js
function createMarkup() {
  return {__html: 'Pertama &middot; Kedua'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

Karena `for` adalah kata khusus dalam JavaScript, elemen React menggunakan `htmlFor` sebagai gantinya.

### onChange {#onchange}

*Event* `onChange` bertingkah sebagaimana yang Anda harapkan: kapanpun kolom sebuah formulir diubah/berubah, *event* ini dieksekusi. Kami secara sengaja tidak menggunakan tingkah laku peramban yang ada karena `onChange` adalah penamaan yang salah untuk tingkah laku ini dan React bergantung kepada *event* ini untuk menangani masukan pengguna secara *real time*.

### selected {#selected}

Apabila Anda ingin menandai sebuah elemen `<option>` sebagai terpilih, referensikan nilai elemen `<option>` tersebut di atribut `value` di elemen `<select>`-nya. Baca bagian ["Tag select"](/docs/forms.html#the-select-tag) untuk instruksi lebih lanjut.

### style {#style}

>Catatan
>
>Beberapa contoh dalam dokumentasi ini menggunakan `style` untuk kenyamanan, tetapi **menggunakan atribut `style` sebagai sarana utama *styling* elemen secara umum sangat tidak disarankan.** Pada kebanyakan kasus, [`className`](#classname) harus digunakan untuk untuk merujuk kelas yang  ditentukan pada *stylesheet* CSS eksternal. `style` paling sering digunakan pada aplikasi React untuk menambahkan *style* yang dikomputasi secara dinamis ketika waktu render. Lihat juga [FAQ: Styling dan CSS](/docs/faq-styling.html).

Atribut `style` menerima objek JavaScript dengan properti *camelCase* dibanding sebuah *string* CSS. Hal ini konsisten dengan properti javascript DOM `style`, ini lebih efisien, dan menghindari celah security XSS. Sebagai contoh:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Halo Dunia!</div>;
}
```

Perhatikan bahwa *style* tidak diperbaiki secara otomatis. Untuk mendukung peramban lama, Anda perlu menyediakan properti *style* yang sesuai:

```js
const divStyle = {
  WebkitTransition: 'all', // perhatikan 'W' kapital disini
  msTransition: 'all' // 'ms' adalah satu-satunya vendor dengan awalan huruf kecil
};

function ComponentWithTransition() {
  return <div style={divStyle}>Ini harusnya berfungsi lintas peramban</div>;
}
```

*Style keys* diberi *camelCase* agar konsisten dengan mengakses properti pada *node* DOM dari JS (mis. `node.style.backgroundImage`). Awalan vendor [selain `ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) harus dimulai dengan huruf kapital. inilah mengapa `WebkitTransition` memiliki awalan "W".

React secara otomatis akan menambahkan akhiran "px" ke properti *style* *inline* numerik tertentu. Jika Anda ingin menggunakan satuan selain "px", tentukan nilainya sebagai *string* dengan satuan yang diinginkan. Sebagai contoh:

```js
// Hasil *style*: '10px'
<div style={{ height: 10 }}>
  Halo Dunia!
</div>

// Hasil *style*: '10%'
<div style={{ height: '10%' }}>
  Halo Dunia!
</div>
```

Tidak semua properti *style* dikonversi menjadi *string* pixel. Beberapa yang lain tetap tanpa unit (mis. `zoom`, `order`, `flex`). Daftar properti tanpa unit yang lengkap dapat dilihat [disini](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

Secara normal, ada sebuah peringatan ketika elemen dengan *children* juga ditandai sebagai `contentEditable`, karena ini tidak akan berfungsi. Atribut ini menyembunyikan peringatan tersebut. Jangan gunakan ini terkecuali jika Anda membangun sebuah library seberti [Draft.js](https://facebook.github.io/draft-js/) yang mengatur `contentEditable` secara manual.

### suppressHydrationWarning {#suppresshydrationwarning}

Jika Anda menggunakan *rendering* sisi server React, biasanya ada peringatan ketika server dan klien membuat konten yang berbeda. Namun, pada beberapa kasus yang jarang terjadi, sangat sulit atau tidak mungkin untuk menjamin kecocokan yang tepat. Sebagai contoh, *timestamps* diharapkan berbeda di server dan di klien.

Jika Anda mengatur `suppressHydrationWarning` ke `true`, React tidak akan memperingatkan Anda tentang ketidakcocokan dalam atribut dan konten elemen itu. Ini hanya bekerja sedalam satu tingkat, dan dimaksudkan untuk digunakan sebagai pintu keluar. Jangan terlalu sering menggunakannya. Anda dapat membaca lebih lanjut tentang hidrasi di [dokumentasi `ReactDOM.hydrate()`](/docs/react-dom.html#hydrate).

### value {#value}

Atribut `value` didukung oleh komponen `<input>` dan `<textarea>`. Anda dapat menggunakannya untuk mengatur nilai komponen. Ini berguna untuk membangun komponen yang dikendalikan. `defaultValue` adalah komponen yang tidak terkontrol, yang menetapkan nilai komponen saat pertama kali dipasang.

## Semua Atribut HTML yang Didukung {#all-supported-html-attributes}

Pada React 16, semua atribut DOM standar [atau *custom*](/blog/2017/09/08/dom-attributes-in-react-16.html) sepenuhnya didukung.

React selalu menyediakan API JavaScript-sentris untuk DOM. Karena komponen React seringkali mengambil *props* khusus dan *props* yang terkait dengan DOM, React menggunakan konvensi `camelCase` seperti halnya DOM API:

```js
<<<<<<< HEAD
<div tabIndex="-1" />      // Sama seperti API DOM node.tabIndex
<div className="Button" /> // Sama seperti API DOM node.className
<input readOnly={true} />  // Sama seperti API DOM node.readOnly
=======
<div tabIndex={-1} />      // Just like node.tabIndex DOM API
<div className="Button" /> // Just like node.className DOM API
<input readOnly={true} />  // Just like node.readOnly DOM API
>>>>>>> f2158e36715acc001c8317e20dc4f45f9e2089f3
```

*Props* ini bekerja mirip dengan atribut HTML yang sesuai, dengan pengecualian pada kasus khusus yang didokumentasikan di atas.

Beberapa atribut DOM yang didukung oleh React meliputi:

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

Demikian pula, semua atribut SVG didukung sepenuhnya:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

Anda juga dapat menggunakan atribut khusus selama hanya menggunakan huruf kecil.
