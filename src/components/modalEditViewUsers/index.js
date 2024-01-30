import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { formatDate } from '../../functions/formatDate';
import { AiOutlineCloseCircle, AiOutlineDownload } from 'react-icons/ai';
import { USdollar } from '../../functions/formatPrice';
import { Post_demand, Text, Users_demand } from '../../constants/text';
import BaseAxios from '../../api/setUpAxios';
import { BiEdit, BiInfoCircle } from 'react-icons/bi';
import { notifyError } from '../../functions/toast';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { MdCancelScheduleSend } from 'react-icons/md';
import { TbEdit, TbEditOff } from 'react-icons/tb';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip, Tooltip } from 'react-tooltip';
import LoadingModal from '../loadingModal';

const cx = classNames.bind(styles);

function ModalEditViewMyDemand({ handleCloseModal, data, handleUpdateListUser }) {
	const divRef = useRef(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const POSTS_URL = `/users/${data.id}/admin-update`;
	const [bussinessNameUser, setBussinessNameUsers] = useState('');
	const [contactNameUsers, setContactNameUsers] = useState('');
	const [contactEmailUser, setContactEmailUser] = useState('');
	const [roleUser, setRoleUser] = useState('');
	const [comments, setComments] = useState('');
	const [dateCreateUser, setDateCreateUser] = useState('');
	const [emailUser, setEmailUser] = useState('');
	const [editDemand, setEditDemand] = useState(true);
	const [contactEmail, setContactEmail] = useState('Loading...');
	const [businessName, setBusinessName] = useState('Loading...');
	const [contactNumber, setContactNumber] = useState('Loading...');
	const [contactName, setContactName] = useState('Loading...');
	const [isUpdate, setIsUpdate] = useState(false);
	const [isSuspend, setIsSuspend] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [valueRole, setValueRole] = useState();
	const [role] = useState(JSON.parse(localStorage.getItem('role')));
	useEffect(() => {
		BaseAxios({
			url: `/users/${data.id}/detail`,
			method: 'GET',
		})
			.then((data) => {
				setBussinessNameUsers(data.data.data.business_name);
				setContactNameUsers(data.data.data.contact_name);
				setContactEmailUser(data.data.data.contact_email);
				setRoleUser(data.data.data.role);
				setComments(data.data.data.comment);
				setDateCreateUser(data.data.data.created_at);
				setEmailUser(data.data.data.email);
				setBusinessName(data.data.data.business_name);
				setContactName(data.data.data.contact_name);
				setContactNumber(data.data.data.contact_number);
				setContactEmail(data.data.data.contact_email);
				setIsLoading(false);
			})
			.catch((err) => {
			});
	}, [isUpdate]);
	const handleEditDemand = (e) => {
		if (editDemand) {
			setEditDemand(false);
		} else {
			setIsUpdate(!isUpdate);
			setEditDemand(true);
		}
	};
	useEffect(() => {
		function handleClickOutside(event) {
			if (divRef.current && !divRef.current.contains(event.target)) handleCloseModal();
		}
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [divRef]);
	useEffect(() => {
		window.addEventListener('keydown', (e) => {
			if (e.keyCode === 27) {
				handleCloseModal();
			}
		});
	}, []);

	const handleSave = (e) => {
		const dataEdit = {
			business_name: bussinessNameUser,
			contact_name: contactNameUsers,
			contact_email: contactEmailUser,
			contact_number: contactNumber,
			role_id: valueRole,
			// role: roleUser,
			// created_at: dateCreateUser,
		};
		BaseAxios({
			url: POSTS_URL,
			method: 'POST',
			data: dataEdit,
		})
			.then((data) => {
				setIsUpdate(!isUpdate);
				handleUpdateListUser();
				setEditDemand(true);
				notifyError('💾 Update Success');
			})
			.catch((e) => {
				if (e.response && e.response.data) {
					notifyError('💢❗ Oh try again');
				}
			});
	};
	useEffect(() => {
		if (roleUser === 'User') {
			setValueRole(0);
		} else if (roleUser === 'Moderator') {
			setValueRole(1);
		} else if (roleUser === 'Admin') {
			setValueRole(2);
		}
	}, [roleUser]);

	return (
		<div className={cx('wrapper')}>
			<ToastContainer />
			{isLoading ? (
				<LoadingModal />
			) : (
				<div
					className={cx('body-modal')}
					ref={divRef}
				>
					<AiOutlineCloseCircle
						onClick={handleCloseModal}
						className={cx('icon-close')}
					/>
					<div>
						{role === 2 &&
							(editDemand ? (
								<TbEdit
									id="titleEditUser"
									data-tooltip-content="Click to edit !"
									onClick={handleEditDemand}
									className={cx('icon-edit')}
								/>
							) : (
								<TbEditOff
									id="titleEditUser"
									onClick={handleEditDemand}
									className={cx('icon-edit')}
									data-tooltip-content="Click to cancel edit !"
								/>
							))}
						<Tooltip
							anchorId="titleEditUser"
							place="bottom"
							style={{
								backgroundColor: 'var(--background-header)',
								color: 'var(--text-login-color)',
								fontWeight: 600,
								fontSize: 14,
							}}
						/>
					</div>
					<form>
						<div className={cx('text-field')}>
							<h4>User ID</h4>
							<p>{data.id}</p>
						</div>
						<div className={cx('text-field')}>
						
							<h4>{Users_demand.title.contact_name}{!editDemand &&<span className={cx('important')}> *</span> }</h4>
							{editDemand && <p>{contactNameUsers}</p>}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<input
										value={contactNameUsers}
										type="text"
										className={cx('input')}
										{...register('contact_name_users', {
											onChange: (e) => setContactNameUsers(e.target.value),
											required: 'This input is required.',
											minLength: {
												value: 3,
												message: 'This input must exceed 3 characters',
											},
											maxLength: {
												value: 50,
												message: 'Input should not exceed 50 characters',
											},
										})}
									/>
									<ErrorMessage
										errors={errors}
										name="contact_name_users"
										render={({ message }) => <span className={cx('message')}>{message}</span>}
									/>
								</div>
							)}
						</div>
						<div className={cx('text-field')}>
							<h4>{Users_demand.title.business_name}{!editDemand &&<span className={cx('important')}> *</span> }</h4>
							{editDemand && <p>{bussinessNameUser}</p>}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<input
										value={bussinessNameUser}
										type="text"
										className={cx('input')}
										{...register('bussiness_name_users', {
											onChange: (e) => setBussinessNameUsers(e.target.value),
											required: 'This input is required.',
											minLength: {
												value: 3,
												message: 'This input must exceed 3 characters',
											},
											maxLength: {
												value: 50,
												message: 'Input should not exceed 50 characters',
											},
										})}
									/>
									<ErrorMessage
										errors={errors}
										name="bussiness_name_users"
										render={({ message }) => <span className={cx('message')}>{message}</span>}
									/>
								</div>
							)}
						</div>
						<div className={cx('text-field')}>
							<h4>Contact Number{!editDemand &&<span className={cx('important')}> *</span> }</h4>
							{editDemand && <p>{contactNumber}</p>}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<input
										value={contactNumber}
										type="number"
										className={cx('input')}
										{...register('contact_number_users', {
											onChange: (e) => setContactNumber(e.target.value),
											required: 'This input is required.',
											minLength: {
												value: 10,
												message: 'This input must exceed 10 characters',
											},
											maxLength: {
												value: 15,
												message: 'Input should not exceed 15 characters',
											},
										})}
									/>
									<ErrorMessage
										errors={errors}
										name="contact_number_users"
										render={({ message }) => <span className={cx('message')}>{message}</span>}
									/>
								</div>
							)}
						</div>
						<div className={cx('text-field')}>
							<h4>{Users_demand.title.contact_email}{!editDemand &&<span className={cx('important')}> *</span> }</h4>
							{editDemand && <p>{contactEmailUser}</p>}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<input
										value={contactEmailUser}
										type="text"
										className={cx('input')}
										{...register('contact_email_user', {
											onChange: (e) => setContactEmailUser(e.target.value),
											required: 'This input is required.',
											minLength: {
												value: 3,
												message: 'This input must exceed 3 characters',
											},
											maxLength: {
												value: 50,
												message: 'Input should not exceed 50 characters',
											},
										})}
									/>
									<ErrorMessage
										errors={errors}
										name="contact_email_user"
										render={({ message }) => <span className={cx('message')}>{message}</span>}
									/>
								</div>
							)}
						</div>
						<div className={cx('text-field')}>
							<h4>{Users_demand.title.email}{!editDemand &&<span className={cx('important')}> *</span> }</h4>
							{editDemand && <p>{emailUser}</p>}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<input
										value={emailUser}
										type="text"
										className={cx('input')}
										{...register('email_user', {
											onChange: (e) => setEmailUser(e.target.value),
											required: 'This input is required.',
											minLength: {
												value: 3,
												message: 'This input must exceed 3 characters',
											},
											maxLength: {
												value: 50,
												message: 'Input should not exceed 50 characters',
											},
										})}
									/>
									<ErrorMessage
										errors={errors}
										name="email_user"
										render={({ message }) => <span className={cx('message')}>{message}</span>}
									/>
								</div>
							)}
						</div>
						<div className={cx('text-field')}>
							<h4>{Users_demand.title.role}:</h4>
							{editDemand && <p>{roleUser}</p>}
							{!editDemand && (
								<div className={cx('wrap_input', 'selector')}>
									<select
										className={cx('select-input')}
										value={valueRole}
										onChange={(e) => setValueRole(e.target.value)}
									>
										<option value="0">Users</option>
										<option value="1">Moderator</option>
										<option value="2">Admin</option>
									</select>
									{/* <input

									value={roleUser}
									type="text"
									className={cx('input_demand_amount')}

									{...register('role', {
										onChange: (e) => setRoleUser(e.target.value),
										minLength: {
											value: 3,
											message: 'This input must exceed 3 characters',
										},
										pattern: {
											value: /[^0-9]/g,
											message: 'This input is text only.',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="role"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/> */}
								</div>
							)}
						</div>

						<div className={cx('text-field')}>
							<h4>{Users_demand.title.date_create}</h4>
							<p>{formatDate(dateCreateUser)}</p>
						</div>
						{!editDemand && (
							<div className={cx('container_btn')}>
								{data.demand_status_name !== 'Posted' && (
									<button
										type="submit"
										onClick={handleSubmit(handleSave)}
										className={cx('button-save')}
									>
										{Post_demand.save}
									</button>
								)}
							</div>
						)}
					</form>
				</div>
			)}
		</div>
	);
}

export default ModalEditViewMyDemand;
