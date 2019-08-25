import React, { Component } from 'react';
import classnames from 'classnames';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-python';
import { IProps } from '../../Type';
import hotkeys, { IHotkeyOptions } from './hotkeys';
import './index.less';

export interface ITextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>, IProps {
  onChange?: (value?: string) => void;
  tabSize?: number;
}

export interface ITextAreaState {
  value: ITextAreaProps['value'];
}

export default class TextArea extends Component<ITextAreaProps, ITextAreaState> {
  public preElm = React.createRef<HTMLPreElement>();
  public text = React.createRef<HTMLTextAreaElement>();
  public static defaultProps: ITextAreaProps = {
    tabSize: 2,
    autoFocus: true,
    spellCheck: false,
  }
  public static state: ITextAreaState;
  public constructor(props: ITextAreaProps) {
    super(props);
    this.state = {
      value: props.value,
    };
  }
  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { onChange } = this.props;
    this.setState({ value: e.target.value }, () => {
      this.highlight();
    });
    onChange && onChange(e.target.value);
  }
  public async componentDidMount() {
    this.highlight();
  }
  public UNSAFE_componentWillReceiveProps(nextProps: ITextAreaProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value }, () => {
        this.highlight();
      });
    }
  }
  public shouldComponentUpdate(nextProps: ITextAreaProps, nextState: ITextAreaState) {
    return nextProps.value !== this.props.value || nextState.value !== this.state.value;
  }
  public async highlight() {
    const { value } = this.state;
    const pre = this.preElm.current;
    const html = Prism.highlight(value as string, Prism.languages.markdown, 'markdown');
    pre!.innerHTML = html;
  }
  render() {
    const { prefixCls, className, onChange, tabSize, style, ...otherProps } = this.props;
    return (
      <div className={classnames(`${prefixCls}-aree`, className)}>
        <div className={classnames(`${prefixCls}-text`)}>
          <pre
            ref={this.preElm}
            className={classnames(`${prefixCls}-text-pre`, 'wmde-markdown-color')}
          />
          <textarea
            {...otherProps}
            ref={this.text}
            onKeyDown={hotkeys.bind(this, { tabSize } as IHotkeyOptions)}
            className={`${prefixCls}-text-input`}
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}