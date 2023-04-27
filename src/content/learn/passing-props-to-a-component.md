---
title: Mengirim Props Pada Komponen
---

<Intro>

Komponen React menggunakan *props* untuk berkomunikasi antara satu dengan yang lainnya. Setiap komponen induk bisa mengirim beberapa informasi pada komponen-komponen anaknya dengan memberikan mereka *props*. *Props* mungkin akan mengingatkan Anda dengan atribut HTML, namun Anda bisa mengirim nilai JavaScript apapun melalui itu, termasuk objek, senarai, bahkan fungsi.

</Intro>

<YouWillLearn>

* Bagaimana cara mengirim *props* pada komponen
* Bagaimana cara membaca *props* dari komponen
* Bagaimana cara memberi nilai bawaan untuk *props*
* Bagaimana cara mengirim beberapa JSX ke dalam component
* Bagaimana *props* berubah seiring waktu

</YouWillLearn>

## Props umum {/*familiar-props*/}

*Props* adalah informasi yang Anda kirimkan pada tag JSX. Sebagai contoh, `className`, `src`, `alt`, `width`, dan `height` adalah beberapa contoh dari *props* yang bisa Anda kirimkan pada `<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

*Props* yang bisa dikirimkan pada tag `<img>` sudah didefinisikan sebelumnya (ReactDOM menyesuaikan dengan [standar HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Namun Anda bisa mengirimkan *props* apapun pada komponen Anda *sendiri*, Misalnya `<Avatar>`, untuk dikustomisasi. Begini caranya!

## Mengirim *props* pada komponen {/*passing-props-to-a-component*/}

Pada kode ini, komponen `Profile` tidak mengirimkan *props* apapun pada komponen anaknya, yaitu `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Kamu bisa memberi `Avatar` beberapa *props* dalam dua langkah.

### Langkah 1: Mengirim *props* pada komponen anak {/*step-1-pass-props-to-the-child-component*/}

Pertama-tama, kirimkan beberapa *props* pada `Avatar`. Sebagai contoh, mari kirimkan dua *props*: `person` (sebuah objek), dan `size` (sebuah angka):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Jika dobel kurung kurawal setelah `person=` membuatmu bingung, ingatlah bahwa [mereka hanyalah sebuah objek](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) dalam kurung kurawal JSX.

</Note>

Sekarang Anda bisa membaca *props* tersebut di dalam komponen `Avatar`.

### Langkah 2: Membaca **props** di dalam komponen anak {/*step-2-read-props-inside-the-child-component*/}

Anda bisa membaca *props* tersebut dengan mendaftarkan namanya yaitu `person, size` dengan cara dipisahkan dengan koma di dalam `({` dan `})` langsung setelah `function Avatar`. Hal ini memungkinkan Anda untuk menggunakannya di dalam kode `Avatar`, sama halnya saat Anda menggunakan variabel.

```js
function Avatar({ person, size }) {
  // sekarang person dan size bisa Anda pakai di sini
}
```

Tambahkan beberapa logika pada `Avatar` yang menggunakan *props* `person` dan `size` untuk dirender, dan selesai.

Sekarang Anda bisa membuat `Avatar` untuk dirender dalam banyak cara dan dengan *props* yang berbeda. Cobalah utak-atik nilainya!

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

*Props* membuat Anda berpikir tentang komponen induk dan komponen anak secara terpisah. Sebagai contoh, Anda bisa mengubah *props* `person` atau `size` di dalam `Profile` tanpa perlu memikirkan bagaimana `Avatar` menggunakannya. Begitupun, Anda bisa mengubah bagaimana `Avatar` menggunakan *props* tersebut, tanpa menghiraukan `Profile`.

Anda bisa menganggap *props* seperti "kenop" yang bisa disesuaikan. *Props* berperan sama seperti *arguments* pada *functions*—Nyatanya, *props* _adalah_ satu-satunya *argument* pada komponen Anda! Komponen fungsi React menerima satu *argument*, sebuah objek *props*.:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Biasanya Anda tidak memerlukan objek *props* secara utuh, maka kamu memecahnya menjadi *props* tersendiri.

<Pitfall>

**Jangan melewatkan pasangan kurung kurawal `{` dan `}`** di dalam `(` dan `)` saat menyatakan *props*:

```js
function Avatar({ person, size }) {
  // ...
}
```

Sintaksis ini disebut ["destructuring"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) dan ini berfungsi untuk membaca properti dari parameter fungsi:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Menentukan nilai bawaaan untuk *prop* {/*specifying-a-default-value-for-a-prop*/}

Jika Anda ingin memberi *prop* nilai bawaan untuk berjaga-jaga saat tidak ada nilai yang ditentukan, Anda bisa melakukannya dengan memecahnya lalu menaruh `=` dan nilai bawaannya tepat setelah parameter:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Sekarang, jika `<Avatar person={...} />` dirender tanpa menerima prop `size`, `size` akan bernilai `100`.

Nilai bawaan hanya akan terpakai jika *prop* `size` tidak ada atau jika Anda mengirim `size={undefined}`. Namun jika kamu mengirim `size={null}` atau `size={0}`, nilai bawaan **tidak akan** terpakai.

## Meneruskan *props* dengan sintaksis *spread* JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

Terkadang, mengirim *props* bisa sangat repetitif:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Tidak ada salahnya dengan kode yang repetitif—itu membuatnya lebih mudah untuk dibaca. Namun terkadang Anda mungkin lebih menyukai keringkasan. Beberapa komponen meneruskan semua *props*nya kepada komponen anaknya, persis seperti yang `Profile` lakukan dengan `Avatar`. Karena mereka tidak menggunakan *props*nya secara langsung, ini akan masuk akal untuk menggunakan sintaksis "*spread*" yang mana lebih ringkas:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Ini akan meneruskan semua *props* milik `Profile` pada `Avatar` tanpa menuliskannya satu-persatu.

**Gunakan sintaksis *spread* dengan batasan.** Jika Anda menggunakannya pada setiap komponen, maka ada yang salah. Seringkali, ini menunjukan bahwa Anda perlu memecah komponen Anda dan mengirim anaknya sebagai JSX. Mari kita bahas!

## Mengirim JSX sebagai anak {/*passing-jsx-as-children*/}

Sudah umum untuk menyisipkan tag bawaan pada peramban:

```js
<div>
  <img />
</div>
```

Terkadang Anda ingin menyisipkan komponen Anda dengan cara yang sama:

```js
<Card>
  <Avatar />
</Card>
```

Saat Anda menyisipkan konten ke dalam tag JSX, komponen induk akan menerima konten tersebut dalam bentuk *prop* yang disebut `children`. Sebagai contoh, Komponen `Card` di bawah akan menerima *prop* `children` yang diisi `<Avatar />` lalu me-*render*nya dengan cara membungkusnya ke dalam div:

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

```js utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

Cobalah ubah `<Avatar>` yang ada di dalam `<Card>` dengan teks untuk melihat bagaimana komponen `Card` bisa disisipkan konten apapun. Komponen tersebut tidak perlu "mengetahui" apa yang dirender di dalamnya. Kamu lihat betapa fleksibelnya hal ini.

Anda bisa menganggap bahwa komponen dengan *prop* `children` itu mempunyai "lubang" yang bisa "diisi" oleh komponen induknya dengan JSX secara bebas. Anda akan sering menggunakan *prop* `children` sebagai pembungkus: *panels*, *grids*, dan lainnya.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## Bagaimana props berubah seiring waktu {/*how-props-change-over-time*/}

Komponen `Clock` di bawah menerima dua *props* dari komponen induknya: `color` dan `time`. (Kode untuk komponen induknya dihilangkan karena itu menggunakan [state](/learn/state-a-components-memory), yang mana belum kita bahas untuk saat ini.)

Coba ubahlah warna pada kotak pilihan di bawah:

<Sandpack>

```js Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Contoh ini menggambarkan bahwa **sebuah komponen mungkin menerima props yang berbeda seiring waktu.** *Props* tidak selalu bersifat tetap! Begini, *prop* `time` berubah setiap detik, dan *prop* `color` berubah ketika Anda memilih warna lain. Data pada komponen akan ditampilkan *props* kapan saja, bukan hanya di awal.

Bagaimanapun, props bersifat [*immutable*](https://en.wikipedia.org/wiki/Immutable_object)—Sebuah istilah pada ilmu komputer yang berarti "tidak dapat diubah". Saat sebuah komponen ingin mengubah *props*nya (sebagai contoh, untuk merespon interaksi pengguna atau merespon data baru), mereka harus "meminta" komponen induknya untuk mengirim dirinya ***props* yang lain**—objek baru! Lalu *props* yang lama akan disingkirkan, dan nantinya mesin JavasCript akan mengambil kembali memori yang dipakai oleh mereka.

**Jangan mencoba untuk "mengubah *props*".** Ketika Anda perlu merespon masukan pengguna (misalnya mengubah warna yang dipilih), Anda akan memerlukan "*set state*", yang mana akan Anda pelajari pada [State: Memori Milik Komponen.](/learn/state-a-components-memory)

<Recap>

* To pass props, add them to the JSX, just like you would with HTML attributes.
* To read props, use the `function Avatar({ person, size })` destructuring syntax.
* You can specify a default value like `size = 100`, which is used for missing and `undefined` props.
* You can forward all props with `<Avatar {...props} />` JSX spread syntax, but don't overuse it!
* Nested JSX like `<Card><Avatar /></Card>` will appear as `Card` component's `children` prop.
* Props are read-only snapshots in time: every render receives a new version of props.
* You can't change props. When you need interactivity, you'll need to set state.

</Recap>



<Challenges>

#### Extract a component {/*extract-a-component*/}

This `Gallery` component contains some very similar markup for two profiles. Extract a `Profile` component out of it to reduce the duplication. You'll need to choose what props to pass to it.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Start by extracting the markup for one of the scientists. Then find the pieces that don't match it in the second example, and make them configurable by props.

</Hint>

<Solution>

In this solution, the `Profile` component accepts multiple props: `imageId` (a string), `name` (a string), `profession` (a string), `awards` (an array of strings), `discovery` (a string), and `imageSize` (a number).

Note that the `imageSize` prop has a default value, which is why we don't pass it to the component.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Note how you don't need a separate `awardCount` prop if `awards` is an array. Then you can use `awards.length` to count the number of awards. Remember that props can take any values, and that includes arrays too!

Another solution, which is more similar to the earlier examples on this page, is to group all information about a person in a single object, and pass that object as one prop:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Although the syntax looks slightly different because you're describing properties of a JavaScript object rather than a collection of JSX attributes, these examples are mostly equivalent, and you can pick either approach.

</Solution>

#### Adjust the image size based on a prop {/*adjust-the-image-size-based-on-a-prop*/}

In this example, `Avatar` receives a numeric `size` prop which determines the `<img>` width and height. The `size` prop is set to `40` in this example. However, if you open the image in a new tab, you'll notice that the image itself is larger (`160` pixels). The real image size is determined by which thumbnail size you're requesting.

Change the `Avatar` component to request the closest image size based on the `size` prop. Specifically, if the `size` is less than `90`, pass `'s'` ("small") rather than `'b'` ("big") to the `getImageUrl` function. Verify that your changes work by rendering avatars with different values of the `size` prop and opening images in a new tab.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Here is how you could go about it:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

You could also show a sharper image for high DPI screens by taking [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) into account:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Props let you encapsulate logic like this inside the `Avatar` component (and change it later if needed) so that everyone can use the `<Avatar>` component without thinking about how the images are requested and resized.

</Solution>

#### Passing JSX in a `children` prop {/*passing-jsx-in-a-children-prop*/}

Extract a `Card` component from the markup below, and use the `children` prop to pass different JSX to it:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Any JSX you put inside of a component's tag will be passed as the `children` prop to that component.

</Hint>

<Solution>

This is how you can use the `Card` component in both places:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

You can also make `title` a separate prop if you want every `Card` to always have a title:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
