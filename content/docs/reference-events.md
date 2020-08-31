---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Panduan ini mendokumentasikan pembungkus `SyntheticEvent` yang merupakan bagian dari sistem _event_ yang dimiliki oleh React. Silahkan melihat panduan bagian [Handling Events](/docs/handling-events.html) untuk mempelajarinya lebih lanjut.

## Ikhtisar {#overview}

<<<<<<< HEAD
*Event handler* Anda akan dioperkan `SyntheticEvent`, sebuah pembungkus lintas _browser_ yang membungkus _event_ bawaan _browser_. `SyntheticEvent` memiliki antarmuka yang sama dengan _event_ bawaan _browser_, termasuk `stopPropagation()` dan `preventDefault()`, bedanya _event_ ini bekerja secara seragam untuk lintas _browser_.

Jika untuk alasan tertentu Anda memerlukan _event_ bawaan dari _browser_, gunakan atribut `nativeEvent` untuk mengaksesnya. Setiap objek `SyntheticEvent` memiliki atribut-atribut berikut:
=======
Your event handlers will be passed instances of `SyntheticEvent`, a cross-browser wrapper around the browser's native event. It has the same interface as the browser's native event, including `stopPropagation()` and `preventDefault()`, except the events work identically across all browsers. 

If you find that you need the underlying browser event for some reason, simply use the `nativeEvent` attribute to get it. The synthetic events are different from, and do not map directly to, the browser's native events. For example in `onMouseLeave` `event.nativeEvent` will point to a `mouseout` event. The specific mapping is not part of the public API and may change at any time. Every `SyntheticEvent` object has the following attributes:
>>>>>>> 25cc703d1f23f1782ff96c5c7882a806f8741ec4

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

> Catatan:
>
> Sejak v0.14, mengembalikan nilai `false` dari _event handler_ tidak akan menghentikan propagasi _event_. Sebagai gantinya, `e.stopPropagation()` atau `e.preventDefault()` perlu dipanggil secara manual, seperlunya.

### Event Pooling {#event-pooling}

`SyntheticEvent` dikumpulkan. Hal ini berarti objek `SyntheticEvent` akan digunakan kembali dan isi objek akan dikosongkan setelah _callback_ untuk _event_ tersebut dipanggil.
Hal ini dilakukan untuk mengoptimalkan kinerja.
Dengan demikian, _event_ tersebut tidak dapat diakses secara asinkron.

```javascript
function onClick(event) {
  console.log(event); // => objek yang dikosongkan.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Tidak akan berfungsi. this.state.clickEvent hanya berisi nilai kosong.
  this.setState({clickEvent: event});

  // Anda masih dapat mengekspor atribut event.
  this.setState({eventType: event.type});
}
```

> Catatan:
>
> Jika Anda ingin mengakses isi _event_ secara asinkron, Anda perlu memanggil fungsi `event.persist()` dalam _event_, yang akan mengeluarkan _synthetic event_ dari kumpulan(*pool*) sehingga acuan terhadap _event_ tersebut dapat dipertahankan melalui kode pengguna.

## Supported Events {#supported-events}

React menormalisasi _event_ agar memiliki properti yang sama di lintas _browser_.

_Event handler_ di bawah dipicu oleh _event_ dalam fase _bubbling_. Untuk mendaftarkan sebuah _event handler_ dalam fase _capture_, tambahkan `Capture` pada nama _event_; contohnya, alih-alih menggunakan `onClick`, gunakan `onClickCapture` untuk menangani _event_ klik dalam fase _capture_.

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Generic Events](#generic-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)

* * *

## Referensi {#reference}

### Clipboard Events {#clipboard-events}

Nama-nama _event_:

```
onCopy onCut onPaste
```

Atribut-atribut:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Composition Events {#composition-events}

Nama-nama _event_:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Atribut-atribut:

```javascript
string data

```

* * *

### Keyboard Events {#keyboard-events}

Nama-nama _event_:

```
onKeyDown onKeyPress onKeyUp
```

Atribut-atribut:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

Atribut `key` dapat diisi dengan nilai apapun yang terdokumentasi dalam [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

* * *

### Focus Events {#focus-events}

Nama-nama _event_:

```
onFocus onBlur
```

_Event_ fokus bekerja untuk semua elemen-elemen di React DOM, tidak hanya untuk elemen-elemen _form_.

Atribut-atribut:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Form Events {#form-events}

Nama-nama _event_:

```
onChange onInput onInvalid onReset onSubmit 
```

Untuk informasi lebih mengenai _event_ `onChange`, lihat [Forms](/docs/forms.html).

* * *

### Generic Events {#generic-events}

Event names:

```
onError onLoad
```

* * *

### Mouse Events {#mouse-events}

Nama-nama _event_:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

Tidak seperti _bubbling_ pada umumnya, _event_ `onMouseEnter` dan `onMouseLeave` berkembang dari elemen yang keluar sampai elemen yang masuk dan tidak memiliki fase _capture_.

Atribut-atribut:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### Pointer Events {#pointer-events}

Nama-nama _event_:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

Tidak seperti _bubbling_ pada umumnya, _event_ `onPointerEnter` dan `onPointerLeave` berkembang dari elemen yang ditinggalkan sampai elemen yang dimasuki dan tidak memiliki fase _capture_.

Atribut-atribut:

Seperti yang didefinisikan dalam [W3 spec](https://www.w3.org/TR/pointerevents/), _event_ penunjuk _pointer events_ mengembangkan _event_ [Mouse Events](#mouse-events) dengan atribut-atribut ini:

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

Catatan untuk dukungan lintas _browser_:

_Pointer event_ belum didukung oleh semua _browser_ (saat penulisan artikel ini, _browser_ yang telah mendukung adalah: Chrome, Firefox, Edge, dan Internet Explorer). React tidak serta-merta memberikan dukungan untuk _browser_ lain karena akan meningkatkan ukuran bundel `react-dom` secara signifikan.

Jika aplikasi Anda memerlukan _pointer event_, kami merekomendasikan Anda untuk menambah _polyfill_ untuk _pointer event_ dari pihak ketiga.

* * *

### Selection Events {#selection-events}

Nama-nama _event_:

```
onSelect
```

* * *

### Touch Events {#touch-events}

Nama-nama _event_:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Atribut-atribut:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### UI Events {#ui-events}

Nama-nama _event_:

```
onScroll
```

Atribut-atribut:

```javascript
number detail
DOMAbstractView view
```

* * *

### Wheel Events {#wheel-events}

Nama-nama _event_:

```
onWheel
```

Atribut-atribut:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Media Events {#media-events}

Nama-nama _event_:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Image Events {#image-events}

Nama-nama _event_:

```
onLoad onError
```

* * *

### Animation Events {#animation-events}

Nama-nama _event_:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Atribut-atribut:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Transition Events {#transition-events}

Nama-nama _event_:

```
onTransitionEnd
```

Atribut-atribut:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Other Events {#other-events}

Nama-nama _event_:

```
onToggle
```
