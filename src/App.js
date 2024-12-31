import AppRoutes from "./Routes.js"; 
import { Provider } from "react-redux";
import store from "./store/Store.js";


function App() {
  return (
    <Provider store={store}>
    <div className="App">
     <AppRoutes />
    </div>
    </Provider>
  );
}

export default App;
