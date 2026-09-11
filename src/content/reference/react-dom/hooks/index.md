---
title: "Hook React DOM Bawaan"
---

<Intro>

*Package* `react-dom` berisi Hooks yang hanya didukung untuk aplikasi web (yang berjalan di lingkunan DOM peramban). Hooks ini tidak didukung di lingkungan non-*peramban* seperti aplikasi iOS, Android, atau Windows. Jika Anda mencari Hooks yang didukung di peramban web *dan lingkungan lainnya* lihat [halaman React Hooks](/reference/react). Halaman ini mencantumkan semua Hooks dalam *package* `react-dom`.

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
