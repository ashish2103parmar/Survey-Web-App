import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Main from './Main';
import Submit from './Submit';
import Report from './Report';

function App() {
    return (
        <div className="App">
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={Main} />
                    <Route path="/submitsurvey/:email" component={Submit} />
                    <Route path="/surveyreport" component={Report} />
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </HashRouter>
        </div>
    );
}

export default App;
