import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoBackN } from "./pages/go-back-n";
import { Homepage } from "./pages/home";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Homepage />} />
				<Route path={"/go-back-n"} element={<GoBackN />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
