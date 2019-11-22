import React from 'react';
import { Observable, interval } from 'rxjs';
import { throttle } from 'rxjs/operators';
import './App.css';
import Container from './components/container';
import Business from './components/business';
import Reset from './components/reset';
import { storage, toIntNotation } from './utils';

import businessList from './data/businesses.json';

import { 
  REVENUE_MULTIPLIER_AT_UPGRADE, INCREASE_IN_BRANCH_COST_PERCENT, APP_KEY, INITIAL_CAPITAL,
} from './constants';

function observerFactory() {
  const observersList = [];
  return {
    creator: function(observer) { 
      observersList.push(observer);
      const observerIndex = observersList.length - 1;
      return () => observersList[observerIndex] = null;
    },
    publisher: (...args) => {
      observersList.forEach(o => {
        if (o) o.next(...args)
      });
    },
  };
};

const stateChangeObserver = observerFactory();
const resetObserver = observerFactory();

export default class App extends React.PureComponent {
  state = {
    owner: {
      capital: INITIAL_CAPITAL,
      businesses: businessList,
    },
  };
  
  stateChangeObserver = null;
  resetObserver = null;

  componentDidMount() {
    const newState = this.loadData();

    if(newState) {
      this.setStateAndPublishChanges(newState);
    } else {
      stateChangeObserver.publisher();
    }
  }

  exportData() {
    const { owner: { capital, businesses } = {} } = this.state;
    const timeNow = new Date().getTime();
    const userData = {
      timeOfExit: timeNow,
      businesses: [...businesses],
      capital,
    };
    storage.export(APP_KEY, userData);
    return true;
  }

  loadData() {
    const userData = storage.import(APP_KEY);
    if(userData && userData.businesses && userData.timeOfExit) {
      const timeNow = new Date().getTime();
      const timeUserStayedAway = timeNow - userData.timeOfExit;
      const runningBusiness = userData.businesses.filter(b => b.hasManager);
      const capitalGenerated  = runningBusiness.reduce((acc, nextBusiness) => {
        return acc + (nextBusiness.revenueBusinessGenerates * (timeUserStayedAway/nextBusiness.time));
      }, 0);
      const totalCapital = Math.floor(capitalGenerated + (userData.capital || 0));
      const newState = {
        owner: {
          capital: totalCapital,
          businesses: userData.businesses,
        }
      };
      return newState;
    }
    return null;
  }

  setStateAndPublishChanges = (args, handler) => {
    this.setState(args, () => {
      (handler || stateChangeObserver.publisher)(this.state);
      this.exportData();
    });
  }

  onGetCapital = () => {
    return this.state.owner.capital;
  }

  getBusinessById = (id, businesses) => {
    const businessBoughtIndex = businesses.findIndex(b => b.id === id);
    const businessBought = Object.assign({}, businesses[businessBoughtIndex]);
    return businessBought;
  }

  onBuyBranch = (id) => {
    const businesses = [...this.state.owner.businesses];
    const businessBoughtIndex = businesses.findIndex(b => b.id === id);
    const businessBought = Object.assign({}, businesses[businessBoughtIndex]);
    const { owner } = this.state;
    if (owner.capital < businessBought.cost) return;
    let capital = owner.capital - businessBought.cost;
    const branchCount = (businessBought.branchCount || 0) + 1;
    businessBought.branchCount = branchCount;
    businessBought.isPurchased = true;
    businessBought.revenueBusinessGenerates = businessBought.branchCount * businessBought.revenue;
    const businessCostIncrease = businessBought.cost * (INCREASE_IN_BRANCH_COST_PERCENT/100);
    businessBought.cost += Math.floor(businessCostIncrease);
    businesses[businessBoughtIndex] = businessBought;
    this.setStateAndPublishChanges({
      owner: {
        ...owner,
        capital,
        businesses
      }
    });
    return true;
  }

  handleReset = () => {
    this.setStateAndPublishChanges({
      owner: {
        capital: INITIAL_CAPITAL,
        businesses: businessList,
      },
    }, () => {
      resetObserver.publisher(true);
      stateChangeObserver.publisher(false, this.state);
    });
  }

  handleHireManager = id => {
    const businesses = [...this.state.owner.businesses];
    const businessBoughtIndex = businesses.findIndex(b => b.id === id);
    const businessBought = Object.assign({}, businesses[businessBoughtIndex]);
    const { owner } = this.state;
    if (owner.capital < businessBought.managerCost) return;
    businessBought.hasManager = true;
    let capital = owner.capital - businessBought.managerCost;
    businesses[businessBoughtIndex] = businessBought;
    this.setStateAndPublishChanges({
      owner: {
        ...owner,
        capital,
        businesses
      }
    });
    return true;
  }

  handleBusinessUpgrade = id => {
    const businesses = [...this.state.owner.businesses];
    const businessBoughtIndex = businesses.findIndex(b => b.id === id);
    const businessBought = Object.assign({}, businesses[businessBoughtIndex]);
    const { owner } = this.state;
    if (owner.capital < businessBought.upgradeCost) return;
    businessBought.isUpgraded = true;
    businessBought.revenue *= REVENUE_MULTIPLIER_AT_UPGRADE;
    businessBought.revenueBusinessGenerates = businessBought.branchCount * businessBought.revenue;
    let capital = owner.capital - businessBought.upgradeCost;
    businesses[businessBoughtIndex] = businessBought;
    this.setStateAndPublishChanges({
      owner: {
        ...owner,
        capital,
        businesses
      }
    });
    return true;
  }

  addCapital = (revenue) => {
    const { owner } = this.state;
    let capital = owner.capital + revenue;
    this.setStateAndPublishChanges({
      owner: { 
        ...owner,
        capital 
      }
    }, () => {
      stateChangeObserver.publisher(true, this.state);
    });
  }

  onInvestCapital = (cost) => {
      const { owner } = this.state;
      let capital = owner.capital;
      if (cost <= capital) {
        capital -= cost;
        this.setStateAndPublishChanges({
          owner: { 
            ...owner,
            capital 
          }
        });
        return true;
      } else {
        return false;
      }
  }

  render() {
    const { owner: { businesses, capital } = {} } = this.state;

    const commonBusinessProps = {
      getCapital: this.onGetCapital,
      investCapital: this.onInvestCapital,
      buyBranch: this.onBuyBranch,
      onRevenue: this.addCapital,
      hireManager: this.handleHireManager,
      upgradeBusiness: this.handleBusinessUpgrade,
    };
    
    if (!this.stateChangeObserver) {
      this.stateChangeObserver = Observable.create(stateChangeObserver.creator);
    }

    if (!this.resetObserver) {
      this.resetObserver = Observable.create(resetObserver.creator);
    }

    const businessesView = businesses.map((b, index) => {
      return (
        <div className="col" key={index}>
          <Business 
            stateObserver={this.stateChangeObserver} 
            resetObserver={this.resetObserver}
            business={b} {...commonBusinessProps} 
          />
        </div>
      );
    });

    return (
      <div className="App">
        <div className="game">
          <div className="row">
            <div className="col">
              <Container className="border p-btm-15">
                <h3>
                  <span role="img">&#128176;</span>
                  &nbsp; Available capital <span className="currency">${toIntNotation(capital)}</span>
                </h3>
              </Container>
            </div>
          </div>
          <div className="row">{businessesView}</div>
          <Reset onReset={this.handleReset} />
        </div>
      </div>
    );
  }
}