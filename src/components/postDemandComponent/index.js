import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Post_demand } from '../../constants/text';
import { set, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import BaseAxios from '../../api/setUpAxios';
import { notifyError } from '../../functions/toast';
import { ToastContainer } from 'react-toastify';
import { ErrorMessage } from '@hookform/error-message';
import { BsTrash3 } from 'react-icons/bs';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../loadingModal';
import checkIsPdfFile from '../../functions/checkIsPdfFile';
import { ErrorMessages } from '../../constants';

const cx = classNames.bind(styles);

const PostDemandComponent = () => {
	const navigate = useNavigate();
	const inputRef1 = useRef(null);
	const inputRef2 = useRef(null);
	const [dataPDF, setData] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [dataPDFOptional, setDataOptional] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [errorMsgOptional, setErrorMsgOptional] = useState(false);
	const [errorCheck, setErrorCheck] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isSuccessOptional, setIsSuccessOptional] = useState(false);
	const POSTS_URL = '/demands/create';
	const Upload_URL = '/uploads/file-pdf';
	document.title = 'Post Demand | Statutory Demand';

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			code_company: '',
			debtor_company_name: '',
			creditor_name: '',
			demand_amount: '',
			comment: '',
			date_issued: '',
			creditor_code_company: '',
			stat_demand_documents_required_pdf: '',
			stat_demand_documents_optional_pdf: '',
		},
	});

	const handleDraft = (data) => {
		if (dataPDF === '') {
			setErrorMsg(true);
		} else {
			setIsLoading(true);
			BaseAxios({
				url: POSTS_URL,
				method: 'POST',
				data: {
					draft: 1,
					code_company: data.code_company,
					debtor_company_name: data.debtor_company_name,
					creditor_name: data.creditor_name,
					demand_amount: Number(data.demand_amount),
					comment: data.comment,
					date_issued: data.date_issued,
					creditor_code_company: data.creditor_code_company,
					stat_demand_documents_required_pdf: dataPDF,
					stat_demand_documents_optional_pdf: dataPDFOptional,
				},
			})
				.then((data) => {
					setIsLoading(false);
					navigate('/view-my-demands');
					// reset({
					// 	code_company: '',
					// 	debtor_company_name: '',
					// 	creditor_name: '',
					// 	demand_amount: '',
					// 	comment: '',
					// 	date_issued: '',
					// 	creditor_code_company: '',
					// 	stat_demand_documents_required_pdf: '',
					// 	stat_demand_documents_optional_pdf: '',
					// });
					// setData('');
					// setDataOptional('');
					// inputRef1.current.value = '';
					// inputRef2.current.value = '';
					// notifyError('☑️ Draft Success');
					// setIsSuccessOptional(false);
					// setIsSuccess(false);
					// setErrorMsg('');
					// errorMsgOptional('');
				})
				.catch((e) => {
					setIsLoading(false);
					if (e.response && e.response.data) {
						if (e.response.data.message === 'You have been suspended so do not post the demand') {
							navigate('/notification');
						} else {
							notifyError('An error occurred. Please try again');
						}
					}
				});
		}
	};

	const handleFileChange = (e) => {
		setIsLoading(true);
		setData('');
		setErrorCheck(false);
		if (e.target.files[0].type === 'application/pdf') {
			if (e.target.files.length > 0) {
				const file = e.target.files[0];
				let isPdfFile = checkIsPdfFile(file.name);
				if (!isPdfFile) {
					setErrorMsg(ErrorMessages.incorrectFormatFile);
					setIsSuccess(false);
					setIsLoading(false);
					return;
				}

				const MAX_FILE_SIZE = 20000; // 20MB
				const fileSizeKiloBytes = file.size / 1024;
				if (fileSizeKiloBytes > MAX_FILE_SIZE) {
					setErrorMsg('File size 20MB maximum limit');
					setIsSuccess(false);
					setIsLoading(false);
					return;
				}

				if (fileSizeKiloBytes < MAX_FILE_SIZE) {
					setErrorMsg('');
					BaseAxios({
						url: Upload_URL,
						method: 'POST',
						data: {
							file: file,
						},
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					})
						.then((response) => {
							setIsSuccess(true);
							setData(response.data.data.name_file);
							setIsLoading(false);
						})
						.catch((error) => {
							setIsLoading(false);
						});
				}
			}
		} else {
			setIsSuccess(false);
			notifyError('Must upload pdf file');
			inputRef1.current.value = '';
			setData('');
			setIsLoading(false);
		}
	};

	const handleFileChangeOptional = (e) => {
		setIsLoading(true);
		setDataOptional('');
		setErrorMsgOptional(false);
		if (e.target.files[0].type === 'application/pdf') {
			if (e.target.files.length > 0) {
				const file = e.target.files[0];
				const MAX_FILE_SIZE = 20000; // 20MB

				if (file == null) {
					setIsLoading(false);
					setErrorMsgOptional('Please choose a file');
					setIsSuccessOptional(false);
					return;
				}
				const fileSizeKiloBytes = file.size / 1024;
				if (fileSizeKiloBytes > MAX_FILE_SIZE) {
					setIsLoading(false);
					setErrorMsgOptional('File size 20MB maximum limit');
					setIsSuccessOptional(false);
					return;
				}
				if (fileSizeKiloBytes < MAX_FILE_SIZE) {
					setErrorMsgOptional('');
					BaseAxios({
						url: Upload_URL,
						method: 'POST',
						data: {
							file: file,
						},
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					})
						.then((response) => {
							setIsLoading(false);
							setIsSuccessOptional(true);
							setDataOptional(response.data.data.name_file);
						})
						.catch((error) => {
							setIsLoading(false);
						});
				}
			}
		} else {
			setIsSuccessOptional(false);
			notifyError('Must upload pdf file');
			inputRef2.current.value = '';
			setDataOptional('');
			setIsLoading(false);
		}
	};
	const handleClick1 = () => {
		//  reset input field's value
		inputRef1.current.value = '';
		setData('');
		setIsSuccessOptional(false);
		setIsSuccess(false);
		setErrorMsg('');
	};

	const handleClick2 = () => {
		//  reset input field's value
		inputRef2.current.value = '';
		setDataOptional('');
		setIsSuccessOptional(false);
		setIsSuccess(false);
		errorMsgOptional('');
	};

	const handleCreatePost = (data) => {
		if (dataPDF === '') {
			setErrorCheck(true);
		} else {
			setIsLoading(true);
			BaseAxios({
				url: POSTS_URL,
				method: 'POST',
				data: {
					code_company: data.code_company,
					debtor_company_name: data.debtor_company_name,
					creditor_name: data.creditor_name,
					demand_amount: data.demand_amount,
					comment: data.comment,
					date_issued: data.date_issued,
					creditor_code_company: data.creditor_code_company,
					stat_demand_documents_required_pdf: dataPDF,
					stat_demand_documents_optional_pdf: dataPDFOptional,
				},
			})
				.then((data) => {
					setIsLoading(false);
					navigate('/view-my-demands');
					// reset({
					// 	code_company: '',
					// 	debtor_company_name: '',
					// 	creditor_name: '',
					// 	demand_amount: '',
					// 	comment: '',
					// 	date_issued: '',
					// 	creditor_code_company: '',
					// 	stat_demand_documents_required_pdf: '',
					// 	stat_demand_documents_optional_pdf: '',
					// });
					// setData('');
					// setDataOptional('');
					// inputRef1.current.value = '';
					// inputRef2.current.value = '';
					// notifyError('📋 Post Success');
					// setIsSuccessOptional(false);
					// setIsSuccess(false);
					// setErrorMsg('');
					// errorMsgOptional('');
				})
				.catch((e) => {
					setIsLoading(false);
					if (e.response && e.response.data) {
						if (e.response.data.message === 'You have been suspended so do not post the demand') {
							navigate('/notification');
						} else {
							notifyError(`${e.response.data.message}`);
						}
					}
				});
		}
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<div className={cx('layout')}>
			{isLoading && (
				<div className={cx('wrapper-modal')}>
					<LoadingModal />
				</div>
			)}
			<ToastContainer />
			<form className={cx('container')}>
				<h1 className={cx('title')}>{Post_demand.Title_post_demand}</h1>
				<div className={cx('wrapper')}>
					<div className={cx('container_form_title')}>
						<div className={cx('text-field')}>
							<p>
								{Post_demand.debtor_company_name}
								<span className={cx('important')}> *</span>
							</p>
							<div className={cx('input-field', 'input_debtor_company_name')}>
								<input
									type="text"
									className={cx('input')}
									{...register('debtor_company_name', {
										required: 'This input is required.',
										minLength: {
											value: 3,
											message: 'This input must exceed 3 characters',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="debtor_company_name"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>

						<div className={cx('text-field')}>
							<div className={cx('text-column')}>
								<p className={cx('use-description')}>
									{Post_demand.acn_abn}
									<span className={cx('important')}> *</span>
								</p>
								<p className={cx('use-comment')}>{Post_demand.suggestion_number}</p>
							</div>
							<div className={cx('input-field', 'input_ACN_ABN')}>
								<input
									type="number"
									onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
									className={cx('input')}
									{...register('code_company', {
										required: 'This input is required.',
										pattern: {
											value: /\d+/,
											message: 'This input is number only.',
										},
										minLength: {
											value: 9,
											message: 'This input must exceed 9 to 11 number',
										},
										maxLength: {
											value: 11,
											message: 'Too Many Characters (Need 9 to 11 number)',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="code_company"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>
						<div className={cx('text-field')}>
							<p>
								{Post_demand.creditor_name}
								<span className={cx('important')}> *</span>
							</p>
							<div className={cx('input-field', 'input_creditor_name')}>
								<input
									type="text"
									className={cx('input')}
									{...register('creditor_name', {
										required: 'This input is required.',
										minLength: {
											value: 3,
											message: 'This input must exceed 3 characters',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="creditor_name"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>
						<div className={cx('text-field')}>
							<div className={cx('text-column')}>
								<p className={cx('use-description')}>
									{Post_demand.creditor_ACN_ABN}
									<span className={cx('important')}> *</span>
								</p>
								<p className={cx('use-comment')}>{Post_demand.suggestion_number}</p>
							</div>
							<div className={cx('input-field', 'input_creditor_ACN_ABN')}>
								<input
									type="number"
									onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
									className={cx('input')}
									{...register('creditor_code_company', {
										required: 'This input is required.',
										pattern: {
											value: /\d+/,
											message: 'This input is number only.',
										},
										minLength: {
											value: 9,
											message: 'This input must exceed 9 to 11 number',
										},
										maxLength: {
											value: 11,
											message: 'Too Many Characters (Need 9 to 11 number)',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="creditor_code_company"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>
						<div className={cx('text-field')}>
							<p>
								{Post_demand.demand_amount}
								<span className={cx('important')}> *</span>
							</p>
							<div className={cx('input-field')}>
								<input
									type="number"
									minLength={5}
									onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
									className={cx('input')}
									{...register('demand_amount', {
										required: 'This input is required.',
										pattern: {
											value: /\d+/,
											message: 'This input is number only.',
										},
										minLength: {
											value: 5,
											message: 'This input must exceed 5 characters',
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="demand_amount"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>
						<div className={cx('text-field')}>
							<p>
								{Post_demand.date_issued}
								<span className={cx('important')}> *</span>
							</p>
							<div className={cx('input-field')}>
								<input
									lang="en"
									type="date"
									data-date=""
									data-date-format="DD MM YYYY"
									maxLength={4}
									{...register('date_issued', { required: 'This input is required.' })}
								/>
								<ErrorMessage
									errors={errors}
									name="date_issued"
									render={({ message }) => <span className={cx('message')}>{message}</span>}
								/>
							</div>
						</div>
						<div className={cx('text-field', 'download')}>
							<p className={cx('post-lable')}>
								{Post_demand.stat_demand_documents_1}
								<span className={cx('important')}> *</span>
							</p>
							<div
								data-input={Post_demand.upload}
								className={cx('file-upload-wrapper')}
							>
								<div className={cx('wrapper_icon')}>
									<input
										ref={inputRef1}
										type="file"
										id="files"
										className={cx('input_stat_demand_documents_2')}
										accept="application/pdf"
										onChange={handleFileChange}
									/>
									{dataPDF && (
										<BsTrash3
											onClick={handleClick1}
											className={cx('icon_delete')}
										/>
									)}
								</div>
								{errorCheck ? <p className={cx('error-message')}>This input is required.</p> : null}
								{isSuccess ? <p className={cx('success-message')}>Validation successful</p> : null}
								<p className={cx('error-message')}>{errorMsg}</p>
							</div>
						</div>
						<div className={cx('text-field', 'download')}>
							<p className={cx('post-lable')}>{Post_demand.stat_demand_documents_2}</p>
							<div
								data-input={Post_demand.upload}
								className={cx('file-upload-wrapper')}
							>
								<div className={cx('wrapper_icon')}>
									<input
										ref={inputRef2}
										type="file"
										className={cx('input_stat_demand_documents_2')}
										accept="application/pdf,application/vnd.ms-excel"
										onChange={handleFileChangeOptional}
									/>
									{dataPDFOptional && (
										<BsTrash3
											onClick={handleClick2}
											className={cx('icon_delete')}
										/>
									)}
								</div>
								{isSuccessOptional ? (
									<p className={cx('success-message')}>Validation successful</p>
								) : null}
								<p className={cx('error-message')}>{errorMsgOptional}</p>
							</div>
						</div>
						<div>
							<p className={cx('additional-comments')}>{Post_demand.comments}</p>
							<div className={cx('input-field')}>
								<textarea
									{...register('comment', {
										maxLength: {
											value: 1000,
											message: 'Too Many Characters',
										},
									})}
									wrap="hard"
									className={cx('comments')}
								></textarea>
								<ErrorMessage
									errors={errors}
									name="comment"
									render={({ message }) => <p className={cx('message')}>{message}</p>}
								/>
							</div>
						</div>
						<div className={cx('container_button')}>
							<button
								type="submit"
								onClick={handleSubmit(handleDraft)}
								className={cx('button-save', 'draft')}
							>
								{Post_demand.btn_save}
							</button>
							<button
								type="submit"
								onClick={handleSubmit(handleCreatePost)}
								className={cx('button-save')}
							>
								{Post_demand.btn_post}
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default PostDemandComponent;
