import axios from 'axios';
import { loginFailed, loginStart, loginSuccess } from '../redux/authSilce';

export const loginHandle = async (user, dispatch, navigate) => {
	dispatch(loginStart());
	try {
		const url = 'https://statutorydemands.au/api/sign-in';
		const res = await axios.post(url, user);
		dispatch(loginSuccess(res.data));

		localStorage.setItem('token', res.data.data.accessToken);
		localStorage.setItem('status', res.data.data.user.status);
		localStorage.setItem('email_valid', res.data.data.user.email_valid);
		localStorage.setItem('isLogin', 'true');
		localStorage.setItem('role', res.data.data.user.role_type);
		localStorage.setItem('business_name', res.data.data.user.business_name);
		localStorage.setItem('contact_name', res.data.data.user.contact_name);
		localStorage.setItem('contact_number', res.data.data.user.contact_number);
		localStorage.setItem('contact_email', res.data.data.user.contact_email);

		sessionStorage.setItem('token', res.data.data.accessToken);
		sessionStorage.setItem('status', res.data.data.user.status);
		sessionStorage.setItem('email_valid', res.data.data.user.email_valid);
		sessionStorage.setItem('isLogin', 'true');
		sessionStorage.setItem('role', res.data.data.user.role_type);
		sessionStorage.setItem('business_name', res.data.data.user.business_name);
		sessionStorage.setItem('contact_name', res.data.data.user.contact_name);
		sessionStorage.setItem('contact_number', res.data.data.user.contact_number);
		sessionStorage.setItem('contact_email', res.data.data.user.contact_email);

		if (res.data.data.user.status === 0) {
			navigate('/notification');
		} else {
			if (
				!res.data.data.user.business_name ||
				!res.data.data.user.contact_name ||
				!res.data.data.user.contact_number ||
				!res.data.data.user.contact_email
			) {
				navigate('/profile');
			} else {
				navigate('/');
			}
		}
	} catch (error) {
		dispatch(loginFailed());
		return error.response.data;
	}
};
