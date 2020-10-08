---
id: forwarding-refs
title: Forwarding Refs
permalink: docs/forwarding-refs.html
---

*Ref forwarding* adalah sebuah teknik untuk meneruskan [ref](/docs/refs-and-the-dom.html) secara otomatis melalui komponen ke salah satu anaknya. Ini biasanya tidak diperlukan untuk sebagian besar komponen dalam aplikasi. Namun, ini bisa berguna untuk beberapa jenis komponen, terutama di pustaka komponen yang dapat digunakan kembali. Skenario paling umum dijelaskan di bawah ini.

## Forwarding refs to DOM components {#forwarding-refs-to-dom-components}

Consider a `FancyButton` component that renders the native `button` DOM element:
`embed:forwarding-refs/fancy-button-simple.js`

React components hide their implementation details, including their rendered output. Other components using `FancyButton` **usually will not need to** [obtain a ref](/docs/refs-and-the-dom.html) to the inner `button` DOM element. This is good because it prevents components from relying on each other's DOM structure too much.

Although such encapsulation is desirable for application-level components like `FeedStory` or `Comment`, it can be inconvenient for highly reusable "leaf" components like `FancyButton` or `MyTextInput`. These components tend to be used throughout the application in a similar manner as a regular DOM `button` and `input`, and accessing their DOM nodes may be unavoidable for managing focus, selection, or animations.

**Ref forwarding is an opt-in feature that lets some components take a `ref` they receive, and pass it further down (in other words, "forward" it) to a child.**

Pada contoh di bawah ini, `FancyButton` menggunakan `React.forwardRef` to obtain the `ref` passed to it, and then forward it to the DOM `button` that it renders:

`embed:forwarding-refs/fancy-button-simple-ref.js`

This way, components using `FancyButton` can get a ref to the underlying `button` DOM node and access it if necessary—just like if they used a DOM `button` directly.

Berikut adalah penjelasan langkah demi langkah tentang apa yang terjadi pada contoh di atas:

1. We create a [React ref](/docs/refs-and-the-dom.html) by calling `React.createRef` and assign it to a `ref` variable.
1. We pass our `ref` down to `<FancyButton ref={ref}>` by specifying it as a JSX attribute.
1. React passes the `ref` to the `(props, ref) => ...` function inside `forwardRef` as a second argument.
1. We forward this `ref` argument down to `<button ref={ref}>` by specifying it as a JSX attribute.
1. When the ref is attached, `ref.current` will point to the `<button>` DOM node.

>Catatan
>
>The second `ref` argument only exists when you define a component with `React.forwardRef` call. Regular function or class components don't receive the `ref` argument, and ref is not available in props either.
>
>Ref forwarding is not limited to DOM components. You can forward refs to class component instances, too.

## Catatan untuk pengelola pustaka komponen {#note-for-component-library-maintainers}

**When you start using `forwardRef` in a component library, you should treat it as a breaking change and release a new major version of your library.** This is because your library likely has an observably different behavior (such as what refs get assigned to, and what types are exported), and this can break apps and other libraries that depend on the old behavior.

Conditionally applying `React.forwardRef` when it exists is also not recommended for the same reasons: it changes how your library behaves and can break your users' apps when they upgrade React itself.

## Forwarding refs in higher-order components {#forwarding-refs-in-higher-order-components}

This technique can also be particularly useful with [higher-order components](/docs/higher-order-components.html) (also known as HOCs). Let's start with an example HOC that logs component props to the console:
`embed:forwarding-refs/log-props-before.js`

The "logProps" HOC passes all `props` through to the component it wraps, so the rendered output will be the same. For example, we can use this HOC to log all props that get passed to our "fancy button" component:
`embed:forwarding-refs/fancy-button.js`

There is one caveat to the above example: refs will not get passed through. That's because `ref` is not a prop. Like `key`, it's handled differently by React. If you add a ref to a HOC, the ref will refer to the outermost container component, not the wrapped component.

This means that refs intended for our `FancyButton` component will actually be attached to the `LogProps` component:
`embed:forwarding-refs/fancy-button-ref.js`

Fortunately, we can explicitly forward refs to the inner `FancyButton` component using the `React.forwardRef` API. `React.forwardRef` accepts a render function that receives `props` and `ref` parameters and returns a React node. For example:
`embed:forwarding-refs/log-props-after.js`

## Menampilkan nama custom di DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` menerima fungsi *render*. React DevTools uses this function to determine what to display for the ref forwarding component.

Sebagai contoh, komponen berikut akan muncul sebagai "*ForwardRef*" di DevTools:

`embed:forwarding-refs/wrapped-component.js`

If you name the render function, DevTools will also include its name (e.g. "*ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

You can even set the function's `displayName` property to include the component you're wrapping:

`embed:forwarding-refs/customized-display-name.js`
