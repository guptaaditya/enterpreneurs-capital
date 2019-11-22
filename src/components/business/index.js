import React from 'react';
import classNames from 'classnames';

import './business.css';
import Container from '../container';
import PurchaseBusiness from './purchasebusiness';
import RunBusiness from './runbusiness';
import { toIntNotation } from '../../utils';

export default class Business extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isStarted: false,
            canHireManager: false,
            canBuyMore: false,
            canUpgrade: false,
        };
    }

    componentDidMount() {
        const { stateObserver, business: { hasManager, isUpgraded } } = this.props;
        stateObserver.subscribe(() => {
            if (!hasManager) this.setState({ canHireManager: this.canHireManager() });
            if (!isUpgraded) this.setState({ canUpgrade: this.canUpgrade() });
            this.setState({ canBuyMore: this.canInvest() });
        });
    }

    handleBusinessUpgrade = () => {
        if (this.canUpgrade()) {
            const { upgradeBusiness, business: { id } } = this.props;
            upgradeBusiness(id);
        }
    }

    handleBuyMore = () => {
        if (this.canInvest()) {
            const { buyBranch, business: { id } } = this.props;
            buyBranch(id);
        }
    }

    handleHireManager = () => {
        const { hireManager, business: { hasManager, id } } = this.props;
        if(hasManager === true) return;
        if (this.canHireManager()) {
            hireManager(id);
        }
    }

    canHireManager = () => {
        const { getCapital, business: { managerCost } = {} } = this.props;
        return Boolean(managerCost <= getCapital());
    }

    canInvest = () => {
        const {  getCapital, business: { cost } = {} } = this.props;
        return Boolean(cost <= getCapital());
    }

    canUpgrade = () => {
        const {  getCapital, business: { upgradeCost } = {} } = this.props;
        return Boolean(upgradeCost <= getCapital());
    }
    
    render() {
        const { 
            stateObserver,
            resetObserver,
            business: { 
                hasManager = false, name, branchCount = 1, isPurchased = false, 
                cost, upgradeCost, managerCost, revenueBusinessGenerates, isUpgraded = false,
                upgradePromotionText, managerIcon, unitName
            } = {},
            onRevenue,
        } = this.props;
        const { canHireManager, canBuyMore, canUpgrade } = this.state;
        const showManager = Boolean(hasManager || canHireManager);
        const showBuyMore = canBuyMore;
        const showUpgrade = canUpgrade;

        return (
            <Container className="borderBox">
                {hasManager && <img className="top-right" src={`${process.env.PUBLIC_URL}${managerIcon}`} width="30" />}
                {isPurchased && (
                    <fieldset>
                        <legend>
                            <h3 className="display-inline">{name}</h3> x {branchCount} 
                        </legend>
                        <hr className="ruler" />
                        <div className="row">
                            <div className="col-2">
                                <div className="txt-align-left p-l-20">
                                    <div className="row">
                                        <div className="col">
                                            <span onClick={this.handleBuyMore} 
                                                className={classNames(
                                                    'buy-more-units c2a', 
                                                    {'disabled': !showBuyMore}, 
                                                    {'blink-image': showBuyMore}
                                                )}
                                            >
                                                Buy next {unitName} for <span className="currency">${toIntNotation(cost)}</span>
                                            </span>
                                        </div>
                                    </div>
                                    {!hasManager && (
                                        <div className="row">
                                            <div className="col">
                                                <Container>
                                                    <span
                                                        className={classNames(
                                                            'c2a', {'disabled': !showManager}, 
                                                            {'blink-image': showManager}
                                                        )}
                                                        onClick={this.handleHireManager} 
                                                    >
                                                        Hire <img src={`${process.env.PUBLIC_URL}${managerIcon}`} width="30" />
                                                        for <span className="currency">${toIntNotation(managerCost)}</span>
                                                    </span>
                                                </Container>
                                            </div>
                                        </div>
                                    )}
                                    {!isUpgraded && (
                                        <div className="row">
                                            <div className="col">
                                                <Container>
                                                    <span 
                                                        className={classNames(
                                                            'upgrade-business c2a', {'disabled': !showUpgrade}, 
                                                            {'blink-image': showUpgrade}
                                                        )}
                                                        onClick={this.handleBusinessUpgrade} 
                                                    >
                                                        {upgradePromotionText} -> costs <span className="currency">${toIntNotation(upgradeCost)}</span>
                                                    </span>
                                                </Container>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col txt-align-right p-r-20">
                                        <span>
                                            + 
                                            <span className="currency">
                                                {toIntNotation(revenueBusinessGenerates)}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <RunBusiness 
                                            resetObserver={resetObserver}
                                            business={this.props.business} 
                                            onRevenue={onRevenue}
                                        /> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                )}
                {!isPurchased && (
                    <PurchaseBusiness 
                        canInvest={this.canInvest}
                        onPurchase={this.handleBuyMore} 
                        business={this.props.business} 
                        stateObserver={stateObserver}
                    />
                )}
                </Container>
        );
    }
}