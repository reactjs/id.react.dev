class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // komponen Toolbar harus menggunakan *prop* "theme" tambahan
  // dan oper ke ThemedButton. Ini bisa menjadi *painful*
  // jika setiap tombol di dalam aplikasi perlu mengetahui *theme*-nya
  // karena itu harus melewati semua komponen.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
