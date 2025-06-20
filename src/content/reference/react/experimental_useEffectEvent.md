---
title: experimental_useEffectEvent
version: experimental
---

<Experimental>

**API ini bersifat eksperimental dan belum tersedia dalam versi React yang stabil.**

Anda dapat mencobanya dengan memperbarui *package* React ke versi eksperimental terbaru:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Versi eksperimental React mungkin mengandung bug. Jangan menggunakannya dalam produksi.

</Experimental>


<Intro>

`useEffectEvent` adalah Hook React yang memungkinkan Anda mengekstrak logika non-reaktif ke dalam [Effect Event.](/learn/separating-events-from-effects#declaring-an-effect-event)

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />
