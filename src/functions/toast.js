import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function notifySuccess(message) {
	toast(message, {
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'dark',
		style: { lineHeight: 2 },
	});
}

function notifyError(message) {
	toast(message, {
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'dark',
	});
}

export { notifySuccess, notifyError };
