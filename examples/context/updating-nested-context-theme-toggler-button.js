import {ThemeContext} from './theme-context';

function ThemeTogglerButton() {
  // highlight-range{1-2,5}
  // Theme Toggler Button tidak hanya menerima *theme*
  // tetapi juga fungsi toggleTheme dari *context*
  return (
    <ThemeContext.Consumer>
      {({theme, toggleTheme}) => (
        <button
          onClick={toggleTheme}
          style={{backgroundColor: theme.background}}>
          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}

export default ThemeTogglerButton;
