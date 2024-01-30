import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import InputCustom from '../../components/inputComponent';
import { useForm } from 'react-hook-form';
import ButtonComponent from '../../components/buttonComponent';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaFacebookF, FaTwitter, FaPinterest } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Data_text, Text, DynamicClass } from '../../constants';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { notifyError, notifySuccess, Toast } from '../../functions/toast';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../../redux/authSilce';
import { resetDataLogout } from '../../redux/userSlice';
const cx = classNames.bind(styles);

//regex data input
const schema = yup
	.object({
		email: yup
			.string()
			.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, Data_text.check_email)
			.required(Data_text.required_email),
		password: yup
			.string()
			.required(Data_text.required_Password)
			.matches(
				/^(?=.*[-!@#$%^&*()_+={[}\]:;'<,>.?/\\|`~])(?=.*[0-9])(?=.*[A-Z]).{8,}$/,
				Data_text.required_Password_validate,
			),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password'), null], Data_text.required_confirmPassword)
			.required(Data_text.required_Password)
			.matches(
				/^(?=.*[-!@#$%^&*()_+={[}\]:;'<,>.?/\\|`~])(?=.*[0-9])(?=.*[A-Z]).{8,}$/,
				Data_text.required_Password_validate,
			),
	})
	.required();

function RegisterComponent() {
	document.title = 'Sign Up | Statutory Demand';
	const dispatch = useDispatch();
	const [errConfirmPass, setErrorConfirmPass] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		localStorage.removeItem('token');
		sessionStorage.clear();
		dispatch(logoutAction());
		dispatch(resetDataLogout());
	}, []);

	const { control, handleSubmit, setFocus, reset } = useForm({
		resolver: yupResolver(schema),
	});
	const LoginContent = false;
	//style icon
	const iconStyles = { color: 'white', fontSize: '1.5em' };
	// data from
	const onSubmit = async (data) => {
		if (data.password !== data.confirmPassword) {
			setErrorConfirmPass(true);
		} else {
			let dataRegister = {
				email: data.email,
				password: data.password,
			};
			if (dataRegister) {
				const baseUrl = 'https://statutorydemands.au/api/sign-up';
				axios
					.post(baseUrl, dataRegister)
					.then((res) => {
						localStorage.setItem('token', res.data.data.accessToken);
						localStorage.setItem('status', res.data.data.user.status);
						localStorage.setItem('email_valid', res.data.data.user.email_valid);
						localStorage.setItem('isLogin', 'true');
						localStorage.setItem('role', res.data.data.user.role_type);
						localStorage.setItem('business_name', res.data.data.user.business_name);
						localStorage.setItem('contact_name', res.data.data.user.contact_name);
						localStorage.setItem('contact_number', res.data.data.user.contact_number);
						localStorage.setItem('contact_email', data.email);

						if (res.data.message === 'Let check your email') {
							notifySuccess('Registered successfully');
						}
						navigate('/profile');
					})
					.catch((err) => {
						reset({
							data: '',
						});
						if (err.response.data.message === 'The email has already been taken.') {
							notifyError('This email is already registered');
						}
						if (err.response.data.message === 'Something went wrong') {
							notifyError('An error occurred, please try again');
						}
					});
			}
		}
	};
	useEffect(() => {
		setFocus('register_form');
	}, [setFocus]);
	return (
		<div className={cx('signup')}>
			<ToastContainer />
			<div className={cx('signup-classic')}>
				<div className={cx('registration_content')}>
					<div className={cx('content_register')}>{Data_text.login_content}</div>
					<p className={cx('title_register')}>{Data_text.createAccount}</p>
				</div>
				{LoginContent && (
					<div className={cx('registration__actions-providers')}>
						<span
							style={{ background: Data_text.background_color_fb }}
							className={cx('circleClasses')}
						>
							<FaFacebookF style={iconStyles} />
						</span>
						<span
							style={{ background: Data_text.background_color_tw }}
							className={cx('circleClasses')}
						>
							<FaTwitter style={iconStyles} />
						</span>
						<span className={cx('circleClasses')}>
							<FcGoogle style={iconStyles} />
						</span>
						<span
							style={{ background: Data_text.background_color_pe }}
							className={cx('circleClasses')}
						>
							<FaPinterest style={iconStyles} />
						</span>
					</div>
				)}

				{/* form action */}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className={cx('register_form')}
				>
					<InputCustom
						label={Data_text.input_email}
						name="email"
						placeholder={Data_text.placeHolder_email}
						control={control}
						rules={{
							required: Data_text.required_email,
							pattern: {
								value: /^[a-z0-9]+@[a-z]+\.edu\.[a-z]{2,3}?$/,
							},
						}}
					/>
					<InputCustom
						showPass
						label={Data_text.input_Password}
						name="password"
						placeholder={Data_text.placeHolder_Password}
						control={control}
						type="password"
					/>
					<div className={cx('suggestion-password')}>
						<ul className={cx('item-suggestion')}>
							<li className={cx('item-suggestion-password')}>
								<p className={cx('text-suggestion')}>One lowercase character</p>
							</li>
							<li className={cx('item-suggestion-password')}>
								<p className={cx('text-suggestion')}>One uppercase character</p>{' '}
							</li>
							<li className={cx('item-suggestion-password')}>
								<p className={cx('text-suggestion')}>One number</p>
							</li>
						</ul>
						<ul className={cx('item-suggestion')}>
							<li className={cx('item-suggestion-password')}>
								<p className={cx('text-suggestion')}>One special character</p>
							</li>
							<li className={cx('item-suggestion-password')}>
								<p className={cx('text-suggestion')}>8 characters minimum</p>
							</li>
						</ul>
					</div>
					<InputCustom
						showPass
						label={Data_text.input_confirmPassword}
						name="confirmPassword"
						placeholder={Data_text.input_confirmPassword}
						control={control}
						type="password"
					/>
					<ButtonComponent
						textButton={Data_text.btn_create_account}
						dynamicClass={DynamicClass.loginButton}
					/>
				</form>
				<div className={cx('moveToSignUp')}>
					{Text.moveToSignIn}
					<Link
						className={cx('toLoginBtn')}
						to="/sign-in"
					>
						<span> {Text.signInHere}</span>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default RegisterComponent;
