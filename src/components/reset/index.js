import React from 'react';
import './reset.css';

export default function Reset(props) {
    return (<div onClick={props.onReset} className="reset top-right">
        <img src={`${process.env.PUBLIC_URL}/img/reset.svg`} width="40" />
    </div>);
}