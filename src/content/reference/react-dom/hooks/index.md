---
title: "Built-in React DOM Hooks"
---

<Intro>

_Package_ `react-dom` berisi Hooks yang hanya didukung untuk aplikasi web (yang berjalan di lingkunan DOM peramban). Hooks ini tidak didukung di lingkungan non-_peramban_ seperti aplikasi iOS, Android, atau Windows. Jika Anda mencari Hooks yang didukung di peramban web *dan lingkungan lainnya* lihat [halaman React Hooks](/reference/react). Halaman ini mencantumkan semua Hooks dalam _package_ `react-dom`.

</Intro>

---

## Form Hooks {/*form-hooks*/}

<Canary>

Form Hooks saat ini hanya tersedia di canary dan saluran eksperimental React. Pelajari lebih lanjut tentang [saluran rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

*Forms* memungkinkan Anda membuat kontrol interaktif untuk mengirimkan informasi. Untuk mengelola form di komponen Anda, gunakan salah satu Hooks ini:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) memungkinkan Anda melakukan pembaruan pada UI berdasarkan status form.

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
