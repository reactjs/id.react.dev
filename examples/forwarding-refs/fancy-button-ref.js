import FancyButton from './FancyButton';

// highlight-next-line
const ref = React.createRef();

// Komponen FancyButton yang kita impor adalah HOC LogProps.
// Meskipun keluaran yang dirender akan sama,
// Ref kita akan menunjuk ke komponen LogProps daripada komponen FancyButton!
// Ini berarti kita tidak dapat memanggil ref, seperti ref.current.focus()
// highlight-range{4}
<FancyButton
  label="Klik saya!"
  handleClick={handleClick}
  ref={ref}
/>;
