import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import LoginPage from './components/LoginPage'
import ArticlePage from './components/ArticlePage'
import MemberManagementPage from './components/MemberManagementPage'
import ArticleReviewPage from './components/ArticleReviewPage'
import StreamPage from './components/StreamPage'
import ProfilePage from './components/ProfilePage'
import CreateAccountPage from './components/CreateAccountPage'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import store from './store'
import { MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import Auth from './model/Auth'
import BiasCheckerTheme from './theme/BiasCheckerTheme'
import CuratorTheme from './theme/CuratorTheme'
import LandingPage from './components/LandingPage'

const Blank = () => (
	<div>
		this is Blank
	</div>
);

/**
 * If a user is logged in, then displays 'component', othrwise,
 * displays the login page.
 * @param The component we originally desired to show.
 */
const n2 = (component) => {
    let redirectComponent = (props) => { window.location = '/' }
    return (Auth.isLoggedIn() ? component : redirectComponent)
}

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/ruler" component={n2(MemberManagementPage)} />
    <Route exact path="/articles" component={n2(ArticlePage)} />
    <Route path="/stream/:articleId" component={n2(ArticleReviewPage)} />
    <Route exact path="/stream" component={n2(StreamPage)} />
    <Route exact path="/profile" component={n2(ProfilePage)} />
    <Route exact path="/create" component={CreateAccountPage} />
    <Route exact path="/" component={LandingPage} />
  </Switch>
)

ReactDOM.render(
<Provider store ={ store }>
	<BrowserRouter>
    <MuiThemeProvider theme={CuratorTheme}>
		  <App />
    </MuiThemeProvider>
	</BrowserRouter>
</Provider>
	,document.getElementById('appDiv'));