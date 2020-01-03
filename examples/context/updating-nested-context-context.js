// Pastikan bentuk nilai default yang di oper ke
// createContext cocok dengan bentuk yang di harapkan *consumer*!
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
