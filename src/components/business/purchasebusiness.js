import React from 'react';
import './business.css';
import Container from '../container';
import classNames from 'classnames';
import { toIntNotation } from '../../utils';

export default class PurchaseBusiness extends React.PureComponent {

    state = {
        canInvest: false,
    };

    subscriptionChanges = null;

    componentDidMount() {
        const { canInvest, stateObserver } = this.props;
        this.subscriptionChanges = stateObserver.subscribe(() => {
            this.setState({ canInvest: canInvest() });
        });
    }

    componentWillUnmount() {
        this.subscriptionChanges && this.subscriptionChanges.unsubscribe();
    }

    handlePurchaseClick = () => {
        const { onPurchase } = this.props;
        onPurchase();
    };

    render() {
        const { business: { name, cost: branchCost } = {} } = this.props;
        const { canInvest } = this.state;
        return (
            <fieldset>
                <legend><h3 className="display-inline">{name}</h3></legend>
                <hr className="ruler" />
                <div className="row">
                    <div className="col purchase-business" onClick={this.handlePurchaseClick}>
                        <span className={classNames("c2a", {"disabled": !canInvest })}>
                            Buy for <span className="currency">${toIntNotation(branchCost)}</span>
                            &nbsp;
                        </span>
                        <img className="encircle" src={`${process.env.PUBLIC_URL}/img/invest.svg`} width="25" />
                    </div>
                </div>
            </fieldset>
        )
    }
}