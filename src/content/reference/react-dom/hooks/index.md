---
title: "Hook React DOM Bawaan"
---

<Intro>

<<<<<<< HEAD
*Package* `react-dom` berisi Hooks yang hanya didukung untuk aplikasi web (yang berjalan di lingkunan DOM peramban). Hooks ini tidak didukung di lingkungan non-*peramban* seperti aplikasi iOS, Android, atau Windows. Jika Anda mencari Hooks yang didukung di peramban web *dan lingkungan lainnya* lihat [halaman React Hooks](/reference/react). Halaman ini mencantumkan semua Hooks dalam *package* `react-dom`.
=======
The `react-dom` package contains Hooks that are only supported for web applications (which run in the browser DOM environment). These Hooks are not supported in non-browser environments like iOS, Android, or Windows applications. If you are looking for Hooks that are supported in web browsers *and other environments* see [the React Hooks page](/reference/react/hooks). This page lists all the Hooks in the `react-dom` package.
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

</Intro>

---

## Hook Formulir {/*form-hooks*/}

Formulir memungkinkan Anda membuat kontrol interaktif untuk mengirimkan informasi. Untuk mengelola formulir di komponen Anda, gunakan salah satu Hooks ini:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) memungkinkan anda melakukan pembaruan UI berdasarkan status formulir.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```
