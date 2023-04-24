---
title: Peringatan ARIA Prop Tidak Valid
layout: single
permalink: warnings/invalid-aria-prop.html
---

Peringatan _invalid-aria-prop_ akan terpicu jika Anda mencoba untuk me-_render_ elemen DOM dengan _prop_ `aria-*` yang tidak ada didalam [spesifikasi _Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA)_](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. Jika Anda merasa telah menggunakan _prop_ yang valid, periksa kembali ejaannya dengan baik. `aria-labelledby` dan `aria-activedescendant` seringkali salah dieja.

2. If you wrote `aria-role`, you may have meant `role`.

3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/facebook/react/issues/new/choose).
