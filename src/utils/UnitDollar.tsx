import React from 'react';
import numeral from 'numeral';
/**
 * Reduce use dangerouslySetInnerHTML
 */
export default class Dollar extends React.Component<{
  children: React.ReactText;
  decimalPoint: string;
}> {
  main: HTMLSpanElement | undefined | null = null;

  componentDidMount() {
    this.renderToHtml();
  }

  componentDidUpdate() {
    this.renderToHtml();
  }

  renderToHtml = () => {
    const { children, decimalPoint } = this.props;
    const dollar = (val: number | string) => `$ ${numeral(val).format('0,0' + decimalPoint )}`;
    if (this.main) {
      this.main.innerHTML = dollar(children);
    }
  };

  render() {
    return (
      <span
        ref={ref => {
          this.main = ref;
        }}
      />
    );
  }
}
