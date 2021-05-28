import React from 'react';
import numeral from 'numeral';
/**
 * Reduce use dangerouslySetInnerHTML
 */
export default class Yuan extends React.Component<{
  children: React.ReactText;
}> {
  main: HTMLSpanElement | undefined | null = null;

  componentDidMount() {
    this.renderToHtml();
  }

  componentDidUpdate() {
    this.renderToHtml();
  }

  renderToHtml = () => {
    const { children } = this.props;
    const yuan = (val: number | string) => `¥ ${numeral(val).format('0,0.00')}`;
    if (this.main) {
      this.main.innerHTML = yuan(children);
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
