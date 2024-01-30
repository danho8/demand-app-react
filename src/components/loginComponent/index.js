import React, { useEffect, useLayoutEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import InputCustom from '../../components/inputComponent';
import { useForm } from 'react-hook-form';
import ButtonComponent from '../../components/buttonComponent';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Data_text, Text, DynamicClass } from '../../constants';
import { loginHandle } from '../../api/loginRequest';
import { Link, useNavigate } from 'react-router-dom';
import { notifyError } from '../../functions/toast';
import { ToastContainer } from 'react-toastify';
import { logoutAction } from '../../redux/authSilce';
import { resetDataLogout } from '../../redux/userSlice';

const cx = classNames.bind(styles);

const schema = yup
	.object({
		email: yup
			.string()
			.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, Data_text.check_email)
			.required(Data_text.required_email),
		password: yup
			.string()
			.trim()
			.required(Data_text.required_Password)
			.matches(
				/^(?=.*[-!@#$%^&*()_+={[}\]:;'<,>.?/\\|`~])(?=.*[0-9])(?=.*[A-Z]).{8,}$/,
				Data_text.required_Password_validate,
			),
	})
	.required();

function LoginComponent() {
	document.title = 'Sign In | Statutory Demand';
	useEffect(() => {
		localStorage.removeItem('token');
		sessionStorage.clear();
		localStorage.clear();
		dispatch(logoutAction());
		dispatch(resetDataLogout());
	}, []);

	const { reset, control, handleSubmit, resetField, setFocus } = useForm({
		resolver: yupResolver(schema),
	});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onSubmit = async (data) => {
		const returnErr = await loginHandle(data, dispatch, navigate);
		if (returnErr?.message && returnErr?.message === 'The selected email is invalid.') {
			notifyError('The selected email is invalid.');
		}
		if (returnErr?.message && returnErr?.message === 'The email must be a valid email address.') {
			notifyError('The selected email is invalid.');
		}
		if (returnErr?.message && returnErr?.message === 'Wrong password') {
			notifyError('Wrong password.');
			resetField('password');
		}
	};

	const divRef = useRef(null);

	return (
		<div className={cx('sign_in')}>
			<ToastContainer />
			<div className={cx('signin_classic')}>
				<div className={cx('logintration_content')}>
					<div className={cx('content_login')}>{Data_text.login_content}</div>
					<p className={cx('title_login')}>{Data_text.login_title}</p>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className={cx('login-form')}
				>
					<InputCustom
						label={Data_text.input_email}
						name="email"
						placeholder={Data_text.placeHolder_email}
						control={control}
					/>
					<InputCustom
						showPass
						label={Data_text.input_Password}
						name="password"
						placeholder={Data_text.placeHolder_Password}
						control={control}
						type="password"
					/>
					<ButtonComponent
						textButton={Data_text.btn_login}
						dynamicClass={DynamicClass.loginButton}
					/>
				</form>
				<div className={cx('moveToSignUp')}>
					{Text.moveToSignUp}
					<Link
						className={cx('toSignUp')}
						to="/sign-up"
					>
						<span> {Text.signUpHere}</span>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default LoginComponent;
