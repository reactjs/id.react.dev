// highlight-range{1-4}
// Context memungkinkan kita untuk oper nilai ke dalam diagram komponen
// tanpa secara ekplisit memasukannya ke dalam setiap komponen.
// Buat *context* untuk tema saat ini (dengan "light" sebagai default).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // highlight-range{1-3,5}
    // Gunakan Provider untuk oper tema saat ini ke diagram di bawah ini.
    // Komponen apa pun dapat membacanya, tidak peduli seberapa dalam diagram tersebut.
    // Dalam contoh ini, kita mengoper "dark" sebagai nilai saat ini.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// highlight-range{1,2}
<<<<<<< HEAD
// Komponen di tengah tidak harus 
// oper temanya secara ekplisit lagi.
function Toolbar(props) {
=======
// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar() {
>>>>>>> fa5e6e7a988b4cb465601e4c3beece321edeb812
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // highlight-range{1-3,6}
  // Tetapkan contextType untuk membaca *context theme* saat ini.
  // React akan menemukan Provider *theme* terdekat di atas dan menggunakan nilainya.
  // Dalam contoh ini, *theme* saat ini adalah "dark".
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
