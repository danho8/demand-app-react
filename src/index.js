import React from 'react';
import ReactDOM from 'react-dom/client';
import './globalStyles.scss';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './redux/store';
import { Provider } from 'react-redux';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path='/*' element={<App />} />
				</Routes>
			</BrowserRouter>
	</Provider>,
);
