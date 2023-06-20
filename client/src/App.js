import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link,Routes} from 'react-router-dom';
import Otherpage from './Otherpage';
import Fib from './Fib';

function App() {
  return (
    <Router>
    <div className="App">
      <div>Welcome to react app</div>
      <Link to="/">Home</Link>
      <Link to="/otherpage">Other page</Link>
      <div>
        <Routes>
        <Route exact path="/" element={<Fib/>}/>
        <Route path="/otherpage" element={<Otherpage/>}/>
        </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;
