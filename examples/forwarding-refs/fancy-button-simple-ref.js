// highlight-range{1-2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// Sekarang Anda bisa mendapatkan ref langsung ke button DOM:
const ref = React.createRef();
<FancyButton ref={ref}>Klik saya!</FancyButton>;
