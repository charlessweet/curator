import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import LoginPage from './components/LoginPage'
import ArticlePage from './components/ArticlePage'
import RegistrationPage from './components/RegistrationPage'
import PhilosopherRulerPage from './components/PhilosopherRulerPage'
import ArticleReviewPage from './components/ArticleReviewPage'
import StreamPage from './components/StreamPage'
import AboutPage from './components/AboutPage'
import ProfilePage from './components/ProfilePage'
import TestPage from './components/TestPage'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import store from './store'

const Blank = () => (
	<div>
		this is Blank
	</div>
);

const App = () => (
  <Switch>
    <Route exact path="/" component={LoginPage} />
    <Route exact path="/ruler" component={PhilosopherRulerPage} />
    <Route exact path="/articles" component={ArticlePage} />
    <Route exact path="/register" component={RegistrationPage} />
    <Route exact path="/stream/:articleId" component={ArticleReviewPage} />
    <Route exact path="/stream" component={StreamPage} />
    <Route exact path="/about" component={AboutPage} />
    <Route exact path="/profile" component={ProfilePage} />
  </Switch>
)

ReactDOM.render(
<Provider store ={ store }>
	<BrowserRouter>
		<App />
	</BrowserRouter>
</Provider>
	,document.getElementById('appDiv'));