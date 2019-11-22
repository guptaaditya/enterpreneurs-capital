import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Container from '../container';

export default class RunBusiness extends React.PureComponent {
    state = {
        isRunEnabled: true,
    };  

    isRunByManager = false;

    progressNode = null;
    
    autoRunBusinessHandler = null; 

    runBusinessOnceTimer = null;

    resetSubscription = null;

    constructor() {
        super();
        this.handleRunBusiness = _.debounce(this.handleRunBusiness, 100, { leading: false, trailing: true });
    }

    componentDidMount() {
        const { resetObserver } = this.props;
        this.resetSubscription = resetObserver.subscribe((hasReset) => {
            if (hasReset && this.autoRunBusinessHandler) {
                clearInterval(this.autoRunBusinessHandler);
                this.resetSubscription.unsubscribe();
            }
        });
    }

    componentWillUnmount() {
        if (this.resetSubscription) this.resetSubscription.unsubscribe();
        if (this.autoRunBusinessHandler) clearInterval(this.autoRunBusinessHandler);
        if (this.runBusinessOnceTimer) clearTimeout(this.runBusinessOnceTimer);
    }

    componentWillUpdate(nextProps) {
        const { business: { hasManager } = {} } = nextProps;
        if (hasManager && !this.isRunByManager && this.progressNode) {
            this.isRunByManager = true;
            this.handleAutoStartBusiness();
        }
    }

    handleRef = (fillNode) => {
        this.progressNode = fillNode;
        this.forceUpdate();
    }

    animationHandler = () => {
        if (!this.progressNode) return;
        this.progressNode.classList.remove('fill')
        setTimeout(() => this.progressNode.classList.add('fill'), 0);
    };

    animationStop = () => {
        this.progressNode.classList.remove('fill')
    };

    generateRevenue = () => {
        const { onRevenue, business: { revenueBusinessGenerates } } = this.props;
        onRevenue(revenueBusinessGenerates);
    }

    handleRunBusiness = () => {
        if (this.isRunByManager === true) return;
        if (this.isStarted === true) return;
        this.isStarted = true;
        const { business: { time } = {} } = this.props;
        this.animationHandler();
        this.setState({ isRunEnabled: false });
        this.runBusinessOnceTimer = setTimeout(() => {
            this.generateRevenue();
            this.isStarted = false;
            this.setState({ isRunEnabled: true });
            this.animationStop();
        }, time);
    }

    handleAutoStartBusiness = () => {
        clearTimeout(this.runBusinessOnceTimer);
        this.setState({ isRunEnabled: true });
        const { business: { time } = {} } = this.props;
        this.animationHandler();
        this.autoRunBusinessHandler = setInterval(() => {
            this.generateRevenue();
        }, time);
    }

    render() {
        const { business: { icon, time, hasManager = false } = {} } = this.props;
        const { isRunEnabled } = this.state;
        const businessProps = {
            onClick: hasManager ? _.noop : this.handleRunBusiness,
        };
        return (
            <>
                <div className="col">
                    <Container className="txt-align-right p-r-20">
                        <img 
                            src={`${process.env.PUBLIC_URL}${icon}`} width="25" 
                            className={classNames(
                                "encircle c2a runBusiness", 
                                {"nocursor top-left": hasManager},
                                {"hidden": !isRunEnabled}
                            )} 
                            {...businessProps}
                        />
                        <div className="progressSlim">
                            <div ref={this.handleRef}
                                style={{ 
                                    animationDuration: `${time}ms`,
                                    animationIterationCount: this.isRunByManager ? 'infinite': 1 
                                }}>
                            </div>
                        </div>

                    </Container>
                </div>
            </>
        );
    }
}