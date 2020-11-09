---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Panduan ini mendokumentasikan pembungkus `SyntheticEvent` yang merupakan bagian dari sistem _event_ yang dimiliki oleh React. Silahkan melihat panduan bagian [Handling Events](/docs/handling-events.html) untuk mempelajarinya lebih lanjut.

## Ikhtisar {#overview}

*Event handler* Anda akan dioperkan `SyntheticEvent`, sebuah pembungkus lintas _browser_ yang membungkus _event_ bawaan _browser_. `SyntheticEvent` memiliki antarmuka yang sama dengan _event_ bawaan _browser_, termasuk `stopPropagation()` dan `preventDefault()`, bedanya _event_ ini bekerja secara seragam untuk lintas _browser_.

Jika untuk alasan tertentu Anda memerlukan _event_ bawaan dari _browser_, gunakan atribut `nativeEvent` untuk mengaksesnya. _Event_ sintetik berbeda dari _event_ native di _browser_. Contohnya, di dalam `onMouseLeave`, `event.nativeEvent` akan merujuk kepada _event_ `mouseout`. _Mapping_ secara spesifik bukan merupakan bagian dari API publik dan dapat berubah setiap waktu. Setiap objek `SyntheticEvent` memiliki atribut-atribut berikut:

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
<<<<<<< HEAD
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
=======
> As of v17, `e.persist()` doesn't do anything because the `SyntheticEvent` is no longer [pooled](/docs/legacy-event-pooling.html).
>>>>>>> 255497f12fa00d231b5af5d5aa34fa5beffac9e4

> Catatan:
>
<<<<<<< HEAD
> Jika Anda ingin mengakses isi _event_ secara asinkron, Anda perlu memanggil fungsi `event.persist()` dalam _event_, yang akan mengeluarkan _synthetic event_ dari kumpulan(*pool*) sehingga acuan terhadap _event_ tersebut dapat dipertahankan melalui kode pengguna.
=======
> As of v0.14, returning `false` from an event handler will no longer stop event propagation. Instead, `e.stopPropagation()` or `e.preventDefault()` should be triggered manually, as appropriate.
>>>>>>> 255497f12fa00d231b5af5d5aa34fa5beffac9e4

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

```js
DOMEventTarget relatedTarget
```

#### onFocus {#onfocus}

The `onFocus` event is called when the element (or some element inside of it) receives focus. For example, it's called when the user clicks on a text input.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur {#onblur}

The `onBlur` event handler is called when focus has left the element (or left some element inside of it). For example, it's called when the user clicks outside of a focused text input.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detecting Focus Entering and Leaving {#detecting-focus-entering-and-leaving}

You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from _outside_ of the parent element. Here is a demo you can copy and paste that shows how to detect focusing a child, focusing the element itself, and focus entering or leaving the whole subtree.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
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

<<<<<<< HEAD
Atribut-atribut:
=======
>Note
>
>Starting with React 17, the `onScroll` event **does not bubble** in React. This matches the browser behavior and prevents the confusion when a nested scrollable element fires events on a distant parent.

Properties:
>>>>>>> 255497f12fa00d231b5af5d5aa34fa5beffac9e4

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
