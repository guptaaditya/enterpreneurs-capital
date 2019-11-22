import React from 'react';
import './container.css';

export default class Container extends React.PureComponent {
    render() {
        const { className, children } = this.props;
        return (
            <div className={className}>
                {children}
            </div>
        )
    }
}