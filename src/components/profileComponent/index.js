import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { textProfileComponent } from '../../constants/text';
import checkIfEmptyValueExists from '../../functions/checkEmptyObj';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../../functions/toast';
import BaseAxios from '../../api/setUpAxios';
import ApiServers from '../../constants/apiServers';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { SubStrings } from '../../constants';

const cx = classNames.bind(styles);

function ProfileComponent() {
	document.title = 'Profile | Statutory Demand';

	const [readOnly, setReadOnly] = useState(true);
	const [readOnlyUser, setReadOnlyUser] = useState(true);

	const [checkBussinessName, setCheckBussinessName] = useState('');
	const [checkContactName, setCheckContactName] = useState('');
	const [checkContactEmail, setCheckContactEmail] = useState('');
	const [checkContactNumber, setCheckContactNumber] = useState('');

	const [businessName, setBusinessName] = useState('');
	const [contactName, setContactName] = useState('');
	const [contactNumber, setContactNumber] = useState('');
	const [contactEmail, setContactEmail] = useState(localStorage.getItem('contact_email') || '');
	const [email, setEmail] = useState('');
	const [oldPass, setOldPass] = useState('');
	const [newPass, setNewPass] = useState('');
	const [checkEmailCurrent, setCheckEmailCurrent] = useState('');

	const [businessNameErr, setBusinessNameErr] = useState(false);
	const [contactNameErr, setContactNameErr] = useState(false);
	const [contactNumberErr, setContactNumberErr] = useState(false);
	const [formatEmailErr, setFormatEmailErr] = useState(false);
	const [formatEmailMainErr, setFormatEmailMainErr] = useState(false);
	const [update, setUpdate] = useState(false);

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

	const [typeEye, setTypeEye] = useState(false);
	const [typeCurEye, setTypeCurEye] = useState(false);

	const [isUpdate, setIsUpdate] = useState(false);

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const businessNameRef = useRef();
	const inputRef1 = useRef(null);
	const inputRef2 = useRef(null);
	const navigate = useNavigate();

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
					setContactEmail(localStorage.getItem('contact_email') || '');
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
	const handleNumber = (e) => {
		const re = /^[0-9/b]+$/;
		if (contactNumber || re.test(e.target.value)) {
			setContactNumber(e.target.value);
			setValidataNumber(false);
			if (contactNumber.length === 9) setContactNumberErr(false);
		}
	};

	function validateEmail(email) {
		return emailRegex.test(email);
	}

	const handleSumbit = (e) => {
		e.preventDefault();
		const dataForm = {
			business_name: businessName,
			contact_name: contactName,
			contact_number: contactNumber,
			contact_email: contactEmail,
		};
		let isEmptyData = checkIfEmptyValueExists(dataForm);
		if (
			checkBussinessName !== businessName ||
			checkContactName !== contactName ||
			checkContactNumber !== contactNumber ||
			checkContactEmail !== contactEmail
		) {
			if (isEmptyData) {
				if (businessName === '') {
					setValidataBusinessName(true);
				} else {
					if (businessName.length < 3) setBusinessNameErr(true);
				}
				if (contactName === '') {
					setValidataName(true);
				} else {
					if (contactName.length < 3) setContactNameErr(true);
				}
				if (contactEmail === '') {
					setValidataEmail(true);
				} else {
					if (!validateEmail(contactEmail)) setFormatEmailErr(true);
				}
				if (email === '') {
					setValidataEmailMain(true);
				} else {
					if (!validateEmail(email)) setFormatEmailMainErr(true);
				}
				if (contactNumber === '') {
					setValidataNumber(true);
				} else {
					if (contactNumber.length < 10) setContactNumberErr(true);
				}
			} else {
				if (
					businessName.length < 3 ||
					contactName.length < 3 ||
					contactNumber.length < 10 ||
					!validateEmail(contactEmail) ||
					!validateEmail(email)
				) {
					if (businessName.length < 3) setBusinessNameErr(true);
					if (contactName.length < 3) setContactNameErr(true);
					if (contactNumber.length < 10) setContactNumberErr(true);
					if (!validateEmail(contactEmail)) setFormatEmailErr(true);
				} else {
					BaseAxios({
						url: ApiServers.profileConfirm,
						method: 'POST',
						data: dataForm,
					})
						.then(() => {
							setReadOnly(true);
							setIsUpdate(!isUpdate);
							localStorage.setItem('business_name', businessName);
							localStorage.setItem('contact_name', contactName);
							localStorage.setItem('contact_number', contactNumber);
							localStorage.setItem('contact_email', contactEmail);

							sessionStorage.setItem('business_name', businessName);
							sessionStorage.setItem('contact_name', contactName);
							sessionStorage.setItem('contact_number', contactNumber);
							sessionStorage.setItem('contact_email', contactEmail);
							notifySuccess('Successfully updated information');
							navigate(SubStrings.path.goBack);
						})
						.catch((err) => {
							if (err) notifyError('An error occurred, please try again');
						});
				}
			}
		} else {
			setReadOnly(true);
		}
	};

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
					if (oldPass.length < 8) setLengthOldPass(true);
					setValidataNewPass(true);
				}
				if (newPass !== '' && oldPass === '') {
					if (newPass.length < 8) setLegnthNewPass(true);
					setValidataOldPass(true);
				}
				if (newPass !== '' && oldPass !== '') {
					if (oldPass.length < 8 || newPass.length < 8) {
						if (oldPass.length < 8) {
							setLengthOldPass(true);
						}
						if (newPass.length < 8) {
							setLegnthNewPass(true);
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
			<div className={cx('settings-group')}>
				<h1 className={cx('settings-title')}>Your Information</h1>
				<div className={cx('settings-body')}>
					<h3 className={cx('title')}>Edit Contact Details</h3>
					<form
						onSubmit={handleSumbit}
						className={cx('form-group')}
					>
						<div className={cx('form-field')}>
							<label
								className={cx('label-field')}
								htmlFor=""
							>
								{textProfileComponent.label.businessName}
								<span className={cx('important')}> *</span>
							</label>
							<input
								ref={businessNameRef}
								readOnly={readOnly}
								id="business-name"
								className={readOnly ? cx('input-field', 'read-only') : cx('input-field')}
								value={businessName}
								onChange={(e) => {
									setValidataBusinessName(false);
									if (businessName.length === 2) setBusinessNameErr(false);
									setBusinessName(e.target.value);
								}}
								type="text"
								placeholder={textProfileComponent.placeHolder.businessName}
							/>
							{businessNameErr && (
								<span className={cx('error-text')}>
									{textProfileComponent.errorValidate.minimumText}
								</span>
							)}
							{validataBusinessName && (
								<span className={cx('error-text')}>Please fill out this field</span>
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
								{textProfileComponent.label.contactName}
								<span className={cx('important')}> *</span>
							</label>
							<input
								readOnly={readOnly}
								id="contact-name"
								className={readOnly ? cx('input-field', 'read-only') : cx('input-field')}
								value={contactName}
								onChange={(e) => {
									setValidataName(false);
									if (contactName.length === 2) setContactNameErr(false);
									setContactName(e.target.value);
								}}
								type="text"
								placeholder={textProfileComponent.placeHolder.contactName}
							/>
							{contactNameErr && (
								<span className={cx('error-text')}>
									{textProfileComponent.errorValidate.minimumText}
								</span>
							)}
							{validataName && <span className={cx('error-text')}>Please fill out this field</span>}
						</div>
						<div
							id="form-field-group"
							className={cx('form-field')}
						>
							<label
								className={cx('label-field')}
								htmlFor=""
							>
								{textProfileComponent.label.contactNumber}
								<span className={cx('important')}> *</span>
							</label>
							<input
								readOnly={readOnly}
								id="contact-number"
								className={readOnly ? cx('input-field', 'read-only') : cx('input-field')}
								value={contactNumber.replace(/\D/g, '') || ''}
								onChange={handleNumber}
								type="text"
								placeholder={textProfileComponent.placeHolder.contactNumber}
							/>
							{contactNumberErr && (
								<span className={cx('error-text')}>
									{textProfileComponent.errorValidate.minimumNumber}
								</span>
							)}
							{validataNumber && <span className={cx('error-text')}>Please fill out this field</span>}
						</div>
						<div
							id="form-field-group"
							className={cx('form-field')}
						>
							<label
								className={cx('label-field')}
								htmlFor=""
							>
								{textProfileComponent.label.contactEmail}
								<span className={cx('important')}> *</span>
							</label>
							<input
								readOnly={readOnly}
								id="contact-email"
								className={readOnly ? cx('input-field', 'read-only') : cx('input-field')}
								value={contactEmail || ''}
								onChange={(e) => {
									setValidataEmail(false);
									if (validateEmail(contactEmail)) setFormatEmailErr(false);
									setContactEmail(e.target.value);
								}}
								type="text"
								placeholder={textProfileComponent.placeHolder.contactEmail}
							/>
							{formatEmailErr && (
								<span className={cx('error-text')}>
									{textProfileComponent.errorValidate.formatEmailErr}
								</span>
							)}
							{validataEmail && <span className={cx('error-text')}>Please fill out this field</span>}
						</div>
						{readOnly && (
							<button
								onClick={(e) => {
									e.preventDefault();
									setReadOnly(false);
								}}
								className={cx('button-save')}
							>
								Edit Profile Information
							</button>
						)}
						{!readOnly && (
							<button
								type="submit"
								className={cx('button-save')}
							>
								Save Profile Information
							</button>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}

export default ProfileComponent;
