import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { textProfileComponent } from '../../constants/text';
import checkIfEmptyValueExists from '../../functions/checkEmptyObj';
import { notifyError, notifySuccess } from '../../functions/toast';
import BaseAxios from '../../api/setUpAxios';
import ApiServers from '../../constants/apiServers';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { ToastContainer } from 'react-toastify';
import { Data_text } from '../../constants/text';

const cx = classNames.bind(styles);

function ContactDetail() {
	document.title = 'My Account | Statutory Demand';

	const [readOnly, setReadOnly] = useState(true);
	const [readOnlyUser, setReadOnlyUser] = useState(true);

	const [checkBussinessName, setCheckBussinessName] = useState('');
	const [checkContactName, setCheckContactName] = useState('');
	const [checkContactEmail, setCheckContactEmail] = useState('');
	const [checkContactNumber, setCheckContactNumber] = useState('');

	const [businessName, setBusinessName] = useState('');
	const [contactName, setContactName] = useState('');
	const [contactNumber, setContactNumber] = useState('');
	const [contactEmail, setContactEmail] = useState('');
	const [email, setEmail] = useState('');
	const [oldPass, setOldPass] = useState('');
	const [newPass, setNewPass] = useState('');
	const [checkEmailCurrent, setCheckEmailCurrent] = useState('');
	const [formatEmailMainErr, setFormatEmailMainErr] = useState(false);

	const [validataBusinessName, setValidataBusinessName] = useState(false);
	const [validataEmail, setValidataEmail] = useState(false);
	const [validateEmailMain, setValidataEmailMain] = useState(false);
	const [validataName, setValidataName] = useState(false);
	const [validataNumber, setValidataNumber] = useState(false);
	const [validataOldPass, setValidataOldPass] = useState(false);
	const [validataNewPass, setValidataNewPass] = useState(false);
	const [isCoincide, setIsCoincide] = useState(false);
	const [lengthOldPass, setLengthOldPass] = useState(false);
	const [legnthNewPass, setLegnthNewPass] = useState(false);
	const [formatOldPass, setFormatOldPass] = useState(false);
	const [formatNewPass, setFormatNewPass] = useState(false);
	const [typeEye, setTypeEye] = useState(false);
	const [typeCurEye, setTypeCurEye] = useState(false);

	const [isUpdate, setIsUpdate] = useState(false);

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const regexPass = /^(?=.*[-!@#$%^&*()_+={[}\]:;'<,>.?/\\|`~])(?=.*[0-9])(?=.*[A-Z]).{8,}$/;
	const businessNameRef = useRef();
	const inputRef1 = useRef(null);
	const inputRef2 = useRef(null);

	useEffect(() => {
		BaseAxios({
			url: '/users/profile',
			method: 'GET',
		})
			.then((data) => {
				if (data.data.data.business_name) {
					setCheckBussinessName(data.data.data.business_name);
					setBusinessName(data.data.data.business_name);
				} else {
					setBusinessName('');
				}

				if (data.data.data.contact_name) {
					setCheckContactName(data.data.data.contact_name);
					setContactName(data.data.data.contact_name);
				} else {
					setContactName('');
				}

				if (data.data.data.contact_number) {
					setCheckContactNumber(data.data.data.contact_number);
					setContactNumber(data.data.data.contact_number);
				} else {
					setContactNumber('');
				}

				if (data.data.data.contact_email) {
					setCheckContactEmail(data.data.data.contact_email);
					setContactEmail(data.data.data.contact_email);
				} else {
					setContactEmail('');
				}

				if (data.data.data.email) {
					setCheckEmailCurrent(data.data.data.email);
					setEmail(data.data.data.email);
				} else {
					setEmail('');
				}

				if (
					!data.data.data.business_name ||
					data.data.data.business_name === '' ||
					!data.data.data.contact_name ||
					data.data.data.contact_name === '' ||
					!data.data.data.contact_number ||
					data.data.data.contact_number === '' ||
					!data.data.data.contact_email ||
					data.data.data.contact_email === ''
				) {
					setReadOnly(false);
					businessNameRef.current.focus();
					notifyError('Please enter full information');
				}
			})
			.catch((err) => {});
	}, [isUpdate]);

	function validateEmail(email) {
		return emailRegex.test(email);
	}

	function validateFormatPass(pass) {
		return regexPass.test(pass);
	}

	const handleSumbitUser = (e) => {
		e.preventDefault();
		const dataForm = {
			email,
			password_current: String(oldPass),
			password_new: String(newPass),
		};
		if (checkEmailCurrent === email && oldPass === '' && newPass === '') {
			setValidataOldPass(false);
			setLengthOldPass(false);
			setValidataNewPass(false);
			setLegnthNewPass(false);
			setIsCoincide(false);
			setReadOnlyUser(true);
		} else {
			if (oldPass === '' && newPass === '') {
				if (email === '' || email === null || !email) {
					setValidataEmailMain(true);
				} else {
					if (!validateEmail(email)) {
						setFormatEmailMainErr(true);
					} else {
						BaseAxios({
							url: '/users/send-email',
							method: 'POST',
							data: dataForm,
						})
							.then(() => {
								setIsUpdate(!isUpdate);
								setReadOnlyUser(true);
								notifySuccess('Updated successfully, please confirm by new email');
							})
							.catch((err) => {
								if (err.response.data.data.email === 'Your email existed') {
									notifyError('Email already exists, please try again');
								} else {
									notifyError('An error occurred, please try again');
								}
							});
					}
				}
			} else {
				if (oldPass !== '' && newPass === '') {
					if (!oldPass.match(regexPass)) setFormatOldPass(true);
					setFormatNewPass(true);
				}
				if (newPass !== '' && oldPass === '') {
					if (!newPass.match(regexPass)) setFormatNewPass(true);
					setFormatOldPass(true);
				}
				if (newPass !== '' && oldPass !== '') {
					if (!oldPass.match(regexPass) || !oldPass.match(regexPass)) {
						if (!oldPass.match(regexPass)) {
							setFormatOldPass(true);
						}
						if (!newPass.match(regexPass)) {
							setFormatNewPass(true);
						}
					} else {
						if (newPass === oldPass) {
							setIsCoincide(true);
						} else {
							BaseAxios({
								url: '/users/send-email',
								method: 'POST',
								data: dataForm,
							})
								.then(() => {
									setIsUpdate(!isUpdate);
									setReadOnlyUser(true);
									notifySuccess('Updated successfully, please confirm by email');
								})
								.catch((err) => {
									if (err.response.data.message === 'Wrong password')
										notifyError('Wrong current password');
									setNewPass('');
									setOldPass('');
								});
						}
					}
				}
			}
		}
	};

	return (
		<div className={cx('wrapper')}>
			<ToastContainer />
			<div className={cx('settings-group2')}>
				<h1 className={cx('settings-title')}>Settings for your account</h1>
				<div className={cx('settings-body')}>
					<h3 className={cx('title')}>Update Email / Password</h3>
					<form
						onSubmit={handleSumbitUser}
						className={cx('form-group')}
					>
						<div
							id="form-field-group"
							className={cx('form-field')}
						>
							<label
								className={cx('label-field')}
								htmlFor=""
							>
								{textProfileComponent.label.email}
								<span className={cx('important')}> *</span>
							</label>
							<input
								readOnly={readOnlyUser}
								id="email"
								className={readOnlyUser ? cx('input-field', 'read-only') : cx('input-field')}
								value={email || ''}
								onChange={(e) => {
									setValidataEmailMain(false);
									if (validateEmail(email)) setFormatEmailMainErr(false);
									setEmail(e.target.value);
								}}
								type="text"
								placeholder={textProfileComponent.placeHolder.contactEmail}
							/>
							{formatEmailMainErr && (
								<span className={cx('error-text')}>
									{textProfileComponent.errorValidate.formatEmailErr}
								</span>
							)}
							{validateEmailMain && <span className={cx('error-text')}>Please fill out this field</span>}
						</div>
						<div
							id="form-field-group"
							className={cx('form-field')}
						>
							<label
								className={cx('label-field')}
								htmlFor=""
							>
								{textProfileComponent.label.oldPass}
							</label>
							<div className={cx('password-group')}>
								<input
									readOnly={readOnlyUser}
									id="oldPass"
									ref={inputRef1}
									className={readOnlyUser ? cx('input-field', 'read-only') : cx('input-field')}
									value={oldPass || ''}
									onChange={(e) => {
										if (oldPass !== '') setValidataOldPass(false);
										if (oldPass.match(regexPass)) setFormatOldPass(false);
										setOldPass(e.target.value);
									}}
									type={!typeCurEye ? 'password' : 'text'}
									placeholder={textProfileComponent.placeHolder.oldPass}
								/>
								{!readOnlyUser && typeCurEye && (
									<BsFillEyeFill
										onClick={() => setTypeCurEye(!typeCurEye)}
										className={cx('eyes-btn')}
									/>
								)}
								{!readOnlyUser && !typeCurEye && (
									<BsFillEyeSlashFill
										onClick={() => setTypeCurEye(!typeCurEye)}
										className={cx('eyes-btn')}
									/>
								)}
							</div>
							{formatOldPass && (
								<span className={cx('error-text')}>{Data_text.required_Password_validate}</span>
							)}
						</div>
						<div
							id="form-field-group"
							className={cx('form-field')}
						>
							<label
								className={cx('label-field')}
								htmlFor=""
							>
								{textProfileComponent.label.newPass}
							</label>
							<div className={cx('password-group')}>
								<input
									readOnly={readOnlyUser}
									id="newPass"
									ref={inputRef2}
									className={readOnlyUser ? cx('input-field', 'read-only') : cx('input-field')}
									value={newPass || ''}
									onChange={(e) => {
										if (newPass !== '' || newPass !== regexPass) setValidataNewPass(false);
										if (newPass.match(regexPass)) setFormatNewPass(false);
										if (newPass !== oldPass) setIsCoincide(false);
										setNewPass(e.target.value);
									}}
									type={!typeEye ? 'password' : 'text'}
									placeholder={textProfileComponent.placeHolder.newPass}
								/>
								{!readOnlyUser && typeEye && (
									<BsFillEyeFill
										onClick={() => setTypeEye(!typeEye)}
										className={cx('eyes-btn')}
									/>
								)}
								{!readOnlyUser && !typeEye && (
									<BsFillEyeSlashFill
										onClick={() => setTypeEye(!typeEye)}
										className={cx('eyes-btn')}
									/>
								)}
							</div>
							{formatNewPass && (
								<span className={cx('error-text')}>{Data_text.required_Password_validate}</span>
							)}
							{isCoincide && (
								<span className={cx('error-text')}>
									The new password cannot be the same as the old password
								</span>
							)}
						</div>
						{readOnlyUser && (
							<button
								onClick={(e) => {
									e.preventDefault();
									setReadOnlyUser(false);
								}}
								className={cx('button-save')}
							>
								Edit User Information
							</button>
						)}
						{!readOnlyUser && (
							<button
								type="submit"
								className={cx('button-save')}
							>
								Save User Information
							</button>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}

export default ContactDetail;
