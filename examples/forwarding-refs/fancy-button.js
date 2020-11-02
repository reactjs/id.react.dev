class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// Daripada mengekspor FancyButton, kita mengekspor LogProps.
// LogProps tetap akan me-render FancyButton.
// highlight-next-line
export default logProps(FancyButton);
