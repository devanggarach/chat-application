import history from './services/history'
import { Router} from 'react-router-dom'
import Routes from './Routes'
function App() {
	return(
		<div className="App">
			<Router history={history}>
				<Routes/>
			</Router>
	  	</div>
	)
}

export default App