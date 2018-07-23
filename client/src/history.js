import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

const history = createHistory()
const middleware = routerMiddleware(history)

export { history, middleware }