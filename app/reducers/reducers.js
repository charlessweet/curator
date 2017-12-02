import {combineReducers} from 'redux'
import Settings from '../model/Settings'
import UserIdentity from '../model/UserIdentity'
import ArticleList from '../model/ArticleList'
import Article from '../model/Article'
import MemberList from '../model/MemberList'
import actionTypes from '../actionTypes'

const articleList = (state = { "articles":new ArticleList([]), "stream": new ArticleList([])}, action) => {
  let article = {}
  switch (action.type) {
    case actionTypes.SHOW_ARTICLES:
      let ns = Object.assign({}, state, {
        articles:  new ArticleList(action.articles)
      })
      return ns
    case actionTypes.CREATE_BOOKMARK:
      return Object.assign({}, state, {
        bookmark: action.bookmark
      })
    case actionTypes.ANALYZE_ARTICLE:
      article = action.article
      return Object.assign({}, state, {
        articles: new ArticleList(state.articles.articles).addIfNotExists(new Article(article.id, article.title, article.description, article.link, article.keywords, 0, article.biasScore, 0, article.critiques, article.outOfContextScore, article.factualErrorScore, article.logicalErrorScore))
      })
    case actionTypes.MY_ARTICLE_KEYWORD_SEARCH:
      let unfilteredList = (state.unfiltered === undefined ? new ArticleList(state.articles.articles) : state.unfiltered)
      let filteredList = new ArticleList(action.matchingArticles !== undefined ? action.matchingArticles : [])
      let displayList= (action.keywordWasValid ?  filteredList : unfilteredList)
      let ms = Object.assign({}, state, {
        unfiltered: unfilteredList,
        articles:  displayList
      })
      return ms
    case actionTypes.SHOW_STREAM:
      return Object.assign({}, state, {
        stream:  new ArticleList(action.articles)
      })
    case actionTypes.REVIEW_ARTICLE:
      return Object.assign({}, state, {
        currentArticle:  action.article
      })
    case actionTypes.ADD_ARTICLE_CRITIQUE:
      article = action.article
      return Object.assign({}, state, {
        articles: new ArticleList(state.articles.articles).overwriteIfExists(new Article(article.id, article.title, article.description, article.link, article.keywords, 0, article.biasScore, 0, article.critiques, article.outOfContextScore, article.factualErrorScore, article.logicalErrorScore)),
        currentArticle: article
      })
    default:
      return state
  }
}

const settingInitial = new Settings()
const settings = (state = settingInitial, action) => {
  switch(action.type){
    default:
      return state;    
  }
}

const identity = (state = {}, action) => {
  switch(action.type){
    case actionTypes.LOGIN:
      let userIdentity = new UserIdentity(action.userId, action.userName, action.memberId, action.roles);
      const newState = Object.assign({}, state, {
        userInfo: userIdentity
      })
      return newState;
    default:
      return state;
  }
}

const memberList = (state = {"members":new MemberList([])}, action) => {
  switch(action.type)  {
    case actionTypes.LOAD_ROLE_REQUESTS:
      if(action.members.length > 0){
        let nss = Object.assign({}, state, {
            members: new MemberList(action.members)
        })
        return nss;
      }else{
        return state;
      }
    case actionTypes.GRANT_PROMOTION_REQUEST:
      let nss = Object.assign({}, state, {
          members: new MemberList(state.members.members.filter((mem)=>
            { 
              mem.memberId !== action.grantInfo.grantorMemberId && mem["requesting_" + action.grantInfo.roleName] !== true 
            })
          )
      })
      return nss;
    case actionTypes.DENY_PROMOTION_REQUEST:
      let rss = Object.assign({}, state, {
          members: new MemberList(state.members.members.filter((mem)=>
            { 
              mem.memberId !== action.grantInfo.grantorMemberId && mem["requesting_" + action.grantInfo.roleName] !== true 
            })
          )
      })
      return rss;
    default:
      return state;    
  }
}

const page = (state = {"current":"LOGIN"}, action) => {
  switch(action.type){
    case actionTypes.SET_PAGE:
      return Object.assign({}, state, {"current": action.currentPage})
    case actionTypes.CHANGE_PAGE:
      return Object.assign({}, state, {"transitioningFrom": action.fromPage, "transitioningTo": action.toPage})
    default:
      return state;
  }
}

const failure = (state = {}, action) => {
  switch(action.type){
    case actionTypes.FAILED:
      let lstate = Object.assign({}, state, {"error": action.error})
      return lstate
    case actionTypes.CLEAR_ERROR:
      return {}
    default:
      return state
  }
}

//user notification states only - changing these states doesn't have persistent side
//effects
const notify = (state={}, action) => {
  switch(action.type){
    case actionTypes.CLEAR_NOTIFY_USER:
      let ns2 = Object.assign({}, state)
      ns2[action.triggerState] = false
      return ns2
    case actionTypes.CREATE_MEMBER:
      return Object.assign({}, state, { newAccountCreated: true })
    case actionTypes.LOGIN_FAILED:
      return Object.assign({}, state, { "loginFailed": true })
    default:
      return state
  }  
}

export default combineReducers({
  articleList, //note:  this prompts the creation of a reducer-specific state of the same name
  identity,
  settings,
  memberList,
  page,
  failure,
  notify
})