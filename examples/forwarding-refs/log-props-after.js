function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      // highlight-next-line
      const {forwardedRef, ...rest} = this.props;

      // Masukan prop kustom "forwardedRef" sebagai ref
      // highlight-next-line
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Catat param kedua "ref" yang disediakan oleh React.forwardRef.
  // Kita dapat meneruskannya ke LogProps sebagai regular prop, misalnya "forwardedRef"
  // Dan kemudian dapat dilampirkan ke Komponen.
  // highlight-range{1-3}
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
