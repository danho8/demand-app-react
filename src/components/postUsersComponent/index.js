import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Post_demand } from '../../constants/text';
import { useForm } from 'react-hook-form';
import BaseAxios from '../../api/setUpAxios';
import { notifyError } from '../../functions/toast';
import { ToastContainer } from 'react-toastify';
import { ErrorMessage } from '@hookform/error-message';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useState } from 'react';

const cx = classNames.bind(styles);

const PostUsersComponent = () => {
	const [typeCurEye, setTypeCurEye] = useState(false);

	document.title = 'Create User | Statutory Demand';

	const POSTS_URL = '/users/create';
	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: '',
			business_name: '',
			password: '',
			contact_number: '',
			contact_name: '',
			contact_email: '',
		},
	});

	const handleCreatePost = async (data) => {
		BaseAxios({
			url: POSTS_URL,
			method: 'POST',
			data: {
				email: data.email,
				business_name: data.business_name,
				password: data.password,
				contact_number: String(data.contact_number),
				contact_name: data.contact_name,
				contact_email: data.contact_email,
			},
		})
			.then((data) => {
				notifyError('✅ Create User Success');
				reset({
					email: '',
					business_name: '',
					password: '',
					contact_number: '',
					contact_name: '',
					contact_email: '',
				});
			})
			.catch((e) => {
				reset({
					email: '',
					business_name: '',
					password: '',
					contact_number: '',
					contact_name: '',
					contact_email: '',
				});
				if (e.response.data.message === 'The email has already been taken.') {
					notifyError(e.response.data.message);
				} else {
					notifyError('An error occurred. Please try again');
				}
			});
	};

	return (
		<div className={cx('layout')}>
			<ToastContainer />
			<form className={cx('container')}>
				<h1 className={cx('title')}>Create User</h1>
				<div className={cx('wrapper')}>
					<div className={cx('container_form_title')}>
						<div className={cx('text-field')}>
							<p>
								Business Name<span className={cx('important')}> *</span>
							</p>
							<div className={cx('input-field', 'input_debtor_company_name')}>
								<input
									type="text"
									className={cx('input')}
									{...register('business_name', {
										required: 'This input is required.',
										minLength: {
											value: 3,
											message: 'This input must exceed 3 characters',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="business_name"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>

						<div className={cx('text-field')}>
							<p>
								Email<span className={cx('important')}> *</span>
							</p>
							<div className={cx('input-field', 'input_creditor_ACN_ABN')}>
								<input
									type="email"
									className={cx('input')}
									{...register('email', {
										required: 'This input is required.',
										pattern: {
											value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
											message: 'This input is email only.',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="email"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>
						<div className={cx('text-field')}>
							<p>
								Password<span className={cx('important')}> *</span>
							</p>
							<div className={cx('input-field', 'input_creditor_name')}>
								<div className={cx('password-group')}>
									<input
										type={!typeCurEye ? 'password' : 'text'}
										className={cx('input')}
										{...register('password', {
											required: 'This input is required.',
											pattern: {
												value: /^(?=.*[-!@#$%^&*()_+={[}\]:;'<,>.?/\\|`~])(?=.*[0-9])(?=.*[A-Z]).{8,}$/,
												message:
													'Password must contain special characters, letters uppercase, number and at least 8 characters.',
											},
										})}
									/>
									{typeCurEye && (
										<BsFillEyeSlashFill
											onClick={() => setTypeCurEye(!typeCurEye)}
											className={cx('eyes-btn')}
										/>
									)}
									{!typeCurEye && (
										<BsFillEyeFill
											onClick={() => setTypeCurEye(!typeCurEye)}
											className={cx('eyes-btn')}
										/>
									)}
								</div>
								<ErrorMessage
									errors={errors}
									name="password"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>
						<div className={cx('text-field')}>
							<p>
								Contact Email<span className={cx('important')}> *</span>
							</p>
							<div className={cx('input-field', 'input_creditor_ACN_ABN')}>
								<input
									type="email"
									className={cx('input')}
									{...register('contact_email', {
										required: 'This input is required.',
										pattern: {
											value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
											message: 'This input is email only.',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="contact_email"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>
						<div className={cx('text-field')}>
							<p>
								Contact Number<span className={cx('important')}> *</span>
							</p>
							<div className={cx('input-field')}>
								<input
									type="number"
									className={cx('input_demand_amount')}
									{...register('contact_number', {
										pattern: {
											value: /^(0|[1-9]\d*)(\.\d+)?$/,
											message: 'This input is number only.',
										},

										required: 'This input is required.',
										minLength: {
											value: 5,
											message: 'This input must exceed 5 characters',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="contact_number"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>
						<div className={cx('text-field')}>
							<p>
								Contact Name<span className={cx('important')}> *</span>
							</p>
							<div className={cx('input-field', 'input_debtor_company_name')}>
								<input
									type="text"
									className={cx('input')}
									{...register('contact_name', {
										required: 'This input is required.',
										minLength: {
											value: 3,
											message: 'This input must exceed 3 characters',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="contact_name"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>
						<div className={cx('container_button')}>
							<button
								type="submit"
								onClick={handleSubmit(handleCreatePost)}
								className={cx('button-save')}
							>
								{/* {Post_demand.btn_post} */}
								Create Account
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default PostUsersComponent;
