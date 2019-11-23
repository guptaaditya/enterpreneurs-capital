# Enterpreneur's adventure

## Purpose
The application Enterpreneur's adventure gamifies the adventurous journey of the enterpreneur within you. It catches your focus in no time to think, calculate and calibrate the cost-revenue model of the businesses, force you to assess the profitable resources be it time, money or work force, each of which comes at a cost, in critical times. As you progress, you find yourself capable of turning $50 (which you get as seed capital for running business) into incoming stream of profits and turn various businesses into profit making machines. In the later stages you would like to focus on making even larger profits in lesser time. Remember the following mantras of business:-

* **Time is Money**
* **Your people are your assets**
* **A penny saved is a penny earned, but a penny invested is two pennies earned**.

## Game rules
* The player gets seed capital of $50, which is sufficient enough to start one business and hence the business is automatically bought for the user. 
* User can run the business to generate revenue. The business is run by clicking the business icon.
* Every business takes some amount of time to generate revenue, and hence the revenue is generated after that time elapses from the time the business starts.
* When you have sufficient capital, you will see other options (for e.g. buying more business, hiring managers, upgrading business) blinking(blinks only once) when they are available/affordable as per the capital in your account.
* You can buy the options/resources to generate more/faster revenue. Available options are: Resources such as a Manager can be hired who could run your business for you (click on the business after each business run cycle), More units of business (so that you can multiply your profit/revenue on each business run), Upgrade the business (You can invest more in your business to upgrade, with which the profits get tripled) or buy more businesses. **Remember each resource comes at a hefty cost**.
* When you leave the game, it still runs to earn you money(ofcourse only if you have manager).
* The game will keep running unless you reset it.



#### Good Luck


## Developer's voice

### Getting started
Prerequisite:-
* Install node.js on your system. It comes with node package manager (npm)
* cd PATH_TO_ADVENTURE_CAPITAL
* npm i
* npm start

This launches the game in your default browser.

### Implementation
The application has been built using React. It also uses Observables to demonstrate the usage of Observables. The use of Observables prevents unneccessary rendering of all the components when only affordable items needs to be enabled (you will see that in the application). The application is completely **front end**. The backend support would be pretty simple. When user exits the application, all the game information/statistics are saved in local storage in form of JSON. That can be synced to backend when adding backend support, and the same can be retrieved when the application is reloaded.
The application comprises of a few significant components named as follows:-
* **PurchaseBusiness**
* **RunBusiness**
* **HireManager**
* **PurchaseMoreBusinessUnits**
* **UpgradeBusiness**
* **Owner's Capital**


I believe the names are self explanatory (or refer to the game rules/features for more insights of the game).

### Technologies used
1. HTML -> in form of JSX
2. CSS
3. npm package **create-react-app** to bootstrap the react app.
4. Lodash library for some ready to use functions like debounce. Observables could also be used in this case
5. Rxjs Observables library to track operations performed by user and in turn make the resources available for the player.

### Reasons to choose React/Other libraries/Tradeoffs
* The job description demanded React as a pre requisite, and hence to demonstrate the usage.
* Observables to demonstrate the Reactive programming.
* React Components are entities that can be composed into an application irrespectivce of the layouts. They allow me to easily resturcture my application with minimum changes.
* Web Application in react can easily be ported into react native without any logic changes to build mobile apps
* Create-react-app helps me develop application and focus on logic, UI, and functionality rather then getting into nitty gritties of building infrastructure.
* Now that I have components ready, the application can easily be translated into choice of stack.
* It is easy to extend/enhance the game.
* There is a single source of truth for the game which is state of root component (namely App in App.js). Hence it is easier to save the application's state and reload the application without taking care of those things in development.
* **If I had more time, I would focus on UI. make it more convenient and appropriate to games, considering that this is the first game I have developed. I would like to create another version using native javascript and Observables, rather than loading React library and other libraries as they make my game a bit heavier in terms of downloading size(though not significant weightage).**
* **If time allowed then I would try to involve a service worker and store data in indexedDB rather than localstorage from a service worker, rather than performing same work in main thread**.
* **If I had more time, would have cleared redundant code, especially css**. Have lot of css thats no more in use.
* **If time allowed me, then I would create funtionality to drag and place the cards(business cards) and the reset button as per user's convenience thus offering them workspace kind of thingy**.
* **If time allowed, I would have done better testing for mobile use case and worked on issues, if any**.
