import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { formatDate } from '../../functions/formatDate';
import { AiOutlineCloseCircle, AiOutlineDownload } from 'react-icons/ai';
import { USdollar } from '../../functions/formatPrice';
import { Post_demand, Text } from '../../constants/text';
import BaseAxios from '../../api/setUpAxios';
import { BiEdit, BiInfoCircle } from 'react-icons/bi';
import { notifyError } from '../../functions/toast';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { TbEdit, TbEditOff } from 'react-icons/tb';
import { BsTrash3 } from 'react-icons/bs';
import LoadingModal from '../loadingModal';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip, Tooltip } from 'react-tooltip';
import ShowMoreText from 'react-show-more-text';

const cx = classNames.bind(styles);

function ModalDetailDemand({ handleCloseModal, data, handleUpdateListDemand }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const inputRef1 = useRef(null);
	const inputRef2 = useRef(null);
	const divRef = useRef(null);
	const [dataPDF, setData] = useState('');
	const [dataPDFOptional, setDataOptional] = useState('');
	const [errorMsg, setErrorMsg] = useState(false);
	const [errorMsgOptional, setErrorMsgOptional] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isSuccessOptional, setIsSuccessOptional] = useState(false);
	const Upload_URL = '/uploads/file-pdf';
	const POSTS_URL = '/demands/create';
	const Edit_URL = `/demands/${data.id}/update`;
	const [codeCompany, setCodeCompany] = useState('');
	const [debtorCompanyName, setDebtorCompanyName] = useState('');
	const [creditorName, setCreditorName] = useState('');
	const [demandAmount, setDemandAmount] = useState('');
	const [comments, setComments] = useState('');
	const [dateIssued, setDateIssued] = useState('');
	const [creditorCodeCompany, setCreditorCodeCompany] = useState('');
	const [editDemand, setEditDemand] = useState(true);
	const [contactEmail, setContactEmail] = useState('Loading...');
	const [businessName, setBusinessName] = useState('Loading...');
	const [contactNumber, setContactNumber] = useState('Loading...');
	const [contactName, setContactName] = useState('Loading...');
	const [isUpdate, setIsUpdate] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [showDownload, setShowDownload] = useState(true);
	const [showDownloadOptional, setShowDownloadOptional] = useState(true);
	const [role] = useState(localStorage.getItem('role'));
	const [hasToken] = useState(localStorage.getItem('token'));
	const [isLoadingFile, setIsLoadingFile] = useState(false);

	useEffect(() => {
		BaseAxios({
			url: `/demands/${data.id}/detail`,
			method: 'GET',
		})
			.then((data) => {
				setCodeCompany(data.data.data.acn_abn);
				setDebtorCompanyName(data.data.data.debtor_company_name);
				setCreditorName(data.data.data.creditor_name);
				setDemandAmount(data.data.data.demand_amount);
				setComments(data.data.data.comment);
				setDateIssued(data.data.data.date_issued);
				setCreditorCodeCompany(data.data.data.creditor_code_company);
				setBusinessName(data.data.data.business_name);
				setContactName(data.data.data.contact_name);
				setContactNumber(data.data.data.contact_number);
				setContactEmail(data.data.data.contact_email);
				setIsLoading(false);
			})
			.catch((err) => {});
	}, [isUpdate]);
	const handleShowEdit = (e) => {
		if (showDownload) {
			setShowDownload(false);
		} else {
			setShowDownload(true);
		}
	};
	const handleShowEditOptional = (e) => {
		if (showDownloadOptional) {
			setShowDownloadOptional(false);
		} else {
			setShowDownloadOptional(true);
		}
	};
	const handleEditDemand = (e) => {
		if (editDemand) {
			setShowDownload(true);
			setShowDownloadOptional(true);
			if (data.stat_demand_documents_optional_pdf == null) {
				setShowDownloadOptional(false);
			}
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

	const handleFileChangeOptional = (e) => {
		setIsLoadingFile(true);
		setDataOptional('');
		if (e.target.files[0].type === 'application/pdf') {
			if (e.target.files.length > 0) {
				const file = e.target.files[0];
				const MAX_FILE_SIZE = 20000; // 20MB

				if (!file) {
					setIsLoadingFile(false);
					setErrorMsgOptional('Please choose a file');
					setIsSuccessOptional(false);
					return;
				}
				const fileSizeKiloBytes = file.size / 1024;
				if (fileSizeKiloBytes > MAX_FILE_SIZE) {
					setIsLoadingFile(false);
					setErrorMsgOptional('File size 20MB maximum limit');
					setIsSuccessOptional(false);
					return;
				}
				if (fileSizeKiloBytes < MAX_FILE_SIZE) {
					setErrorMsgOptional('');
					setIsSuccessOptional(true);
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
							setIsLoadingFile(false);
							setDataOptional(response.data.data.name_file);
						})
						.catch((error) => {
							setIsLoadingFile(false);
						});
				}
			}
		} else {
			setIsSuccessOptional(false);
			notifyError('Must upload pdf file');
			setDataOptional('');
			inputRef2.current.value = '';
			setIsLoadingFile(false);
		}
	};
	const handleClick1 = () => {
		inputRef1.current.value = '';
		setData('');
		setIsSuccessOptional(false);
		setIsSuccess(false);
		setErrorMsg('');
	};

	const handleClick2 = () => {
		setDataOptional('');
		inputRef2.current.value = '';
		setIsSuccessOptional(false);
		setIsSuccess(false);
		setErrorMsg('');
	};
	const handleFileChange = (e) => {
		setIsLoadingFile(true);
		setData('');
		if (e.target.files[0].type === 'application/pdf') {
			if (e.target.files.length > 0) {
				const file = e.target.files[0];
				const MAX_FILE_SIZE = 20000; // 20MB

				if (!file) {
					setIsLoadingFile(false);
					setErrorMsg('Please choose a file');
					setIsSuccess(false);
					return;
				}
				const fileSizeKiloBytes = file.size / 1024;
				if (fileSizeKiloBytes > MAX_FILE_SIZE) {
					setIsLoadingFile(false);
					setErrorMsg('File size 20MB maximum limit');
					setIsSuccess(false);
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
							setIsLoadingFile(false);
							setIsSuccess(true);
							setData(response.data.data.name_file);
						})
						.catch((error) => {
							setIsLoadingFile(false);
						});
				}
			}
		} else {
			setIsSuccess(false);
			notifyError('Must upload pdf file');
			inputRef1.current.value = '';
			setData('');
			setIsLoadingFile(false);
		}
	};
	const HandleEdit = (e) => {
		const dataEdit = {
			code_company: codeCompany,
			debtor_company_name: debtorCompanyName,
			creditor_name: creditorName,
			demand_amount: Number(demandAmount),
			comment: comments,
			creditor_code_company: creditorCodeCompany,
			stat_demand_documents_required_pdf: dataPDF,
			stat_demand_documents_optional_pdf: dataPDFOptional,
			date_issued: dateIssued,
		};
		BaseAxios({
			url: Edit_URL,
			method: 'POST',
			data: dataEdit,
		})
			.then((data) => {
				handleUpdateListDemand();
				setIsUpdate(!isUpdate);
				notifyError('☑️ Edit Success');
				setEditDemand(true);
			})
			.catch((err) => {
				if (err.response && err.response.data) {
					notifyError(`${err.response.data.message}`);
				}
			});
	};
	return (
		<div className={cx('wrapper')}>
			<ToastContainer />
			{isLoadingFile && (
				<div className={cx('wrapper-modal')}>
					<LoadingModal />
				</div>
			)}
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
						{role > 0 &&
							(editDemand ? (
								<TbEdit
									id="titleEdit"
									onClick={handleEditDemand}
									className={cx('icon-edit')}
									data-tooltip-content="Click to edit !"
								/>
							) : (
								<TbEditOff
									id="titleEdit"
									onClick={handleEditDemand}
									className={cx('icon-edit')}
									data-tooltip-content="Click to cancel edit !"
								/>
							))}
						<Tooltip
							anchorId="titleEdit"
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
						<div className={cx('text-field', 'medium')}>
							<h4>Demand ID</h4>
							<p>{data.id}</p>
						</div>
						<div className={cx('text-field', 'medium')}>
							<h4>
								Debtor Company Name<span style={{ color: 'var(--error-border-color)' }}> *</span>
							</h4>
							{editDemand && <p>{debtorCompanyName}</p>}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<input
										value={debtorCompanyName}
										type="text"
										className={cx('input')}
										{...register('debtor_company_name', {
											onChange: (e) => setDebtorCompanyName(e.target.value),
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
							)}
						</div>
						<div className={cx('text-field', 'medium')}>
							<h4>
								ACN / ABN<span style={{ color: 'var(--error-border-color)' }}> *</span>
							</h4>
							{editDemand && <p>{codeCompany}</p>}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<input
										value={codeCompany}
										type="number"
										onKeyDown={(evt) =>
											['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
										}
										className={cx('input')}
										onChange={(e) => {
											setCodeCompany(e.target.value);
										}}
										{...register('code_company', {
											onChange: (e) => setCodeCompany(e.target.value),
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
							)}
						</div>
						<div className={cx('text-field', 'medium')}>
							<h4>
								Creditor Name<span style={{ color: 'var(--error-border-color)' }}> *</span>
							</h4>
							{editDemand && <p>{creditorName}</p>}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<input
										value={creditorName}
										type="text"
										className={cx('input')}
										{...register('creditor_name', {
											onChange: (e) => setCreditorName(e.target.value),
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
							)}
						</div>
						<div className={cx('text-field', 'medium')}>
							<h4>
								Creditor ACN / ABN<span style={{ color: 'var(--error-border-color)' }}> *</span>
							</h4>
							{editDemand && <p>{creditorCodeCompany}</p>}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<input
										value={creditorCodeCompany}
										type="number"
										onKeyDown={(evt) =>
											['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
										}
										className={cx('input')}
										{...register('creditor_code_company', {
											onChange: (e) => setCreditorCodeCompany(e.target.value),
											required: 'This input is required.',
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
							)}
						</div>
						<div className={cx('text-field', 'medium')}>
							<h4>
								Demand Amount $<span style={{ color: 'var(--error-border-color)' }}> *</span>
							</h4>
							{editDemand && <p>${USdollar.format(demandAmount)}</p>}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<input
										value={demandAmount}
										type="number"
										onKeyDown={(evt) =>
											['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
										}
										className={cx('input')}
										{...register('demand_amount', {
											onChange: (e) => setDemandAmount(e.target.value),
											required: 'This input is required.',
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
							)}
						</div>
						<div className={cx('text-field', 'medium')}>
							<h4>Date Issued</h4>
							{editDemand && <p>{formatDate(dateIssued)}</p>}
							{!editDemand && (
								<input
									value={dateIssued}
									type="date"
									className={cx('input_date_issued')}
									onChange={(e) => {
										setDateIssued(e.target.value);
									}}
								/>
							)}
						</div>
						<div className={cx('text-field', 'download', 'medium')}>
							<h4>
								Stat Demand Documents 1<span style={{ color: 'var(--error-border-color)' }}> *</span>
							</h4>
							{editDemand && data.demand_pdf_required && (
								<>
									<a
										target="_blank"
										href={data.demand_pdf_required}
										className={cx('download-btn')}
										download
									>
										{Text.download} <AiOutlineDownload />
									</a>

									<p>{data.stat_demand_documents_required_pdf}</p>
								</>
							)}
							{!editDemand &&
								(!showDownload ? (
									<>
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
										{isSuccess ? (
											<p className={cx('success-message')}>Validation successful</p>
										) : null}
										{dataPDF && <p className={cx('error-message')}>{errorMsg}</p>}
									</>
								) : (
									<div className={cx('wrap_icon_download')}>
										<div className={cx('wrap_icon_download')}>
											<span className={cx('value_download')}>
												{data.stat_demand_documents_required_pdf}
											</span>
										</div>
										<BiEdit
											id="editfile2"
											onClick={handleShowEdit}
											className={cx('icon_download')}
											data-tooltip-content="Click to edit file !"
										/>
										<Tooltip
											anchorId="editfile2"
											place="bottom"
											style={{
												backgroundColor: 'var(--background-header)',
												color: 'var(--text-login-color)',
												fontWeight: 600,
												fontSize: 14,
											}}
										/>
									</div>
								))}
						</div>
						<div className={cx('text-field', 'download', 'medium')}>
							<h4>Stat Demand Documents 2</h4>
							{editDemand && data.demand_pdf_optional && (
								<>
									<a
										target="_blank"
										href={data.demand_pdf_optional}
										className={cx('download-btn')}
										download
									>
										{Text.download} <AiOutlineDownload />
									</a>

									<p>{data.stat_demand_documents_optional_pdf}</p>
								</>
							)}
							{!editDemand &&
								(!showDownloadOptional ? (
									<>
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
										{dataPDFOptional && <p className={cx('error-message')}>{errorMsgOptional}</p>}
									</>
								) : (
									<div className={cx('wrap_icon_download')}>
										<div className={cx('wrapper_value_download')}>
											<span className={cx('value_download')}>
												{data.stat_demand_documents_optional_pdf}{' '}
											</span>
										</div>
										<BiEdit
											id="editfile1"
											data-tooltip-content="Click to edit file !"
											onClick={handleShowEditOptional}
											className={cx('icon_download')}
										/>
										<Tooltip
											anchorId="editfile1"
											place="bottom"
											style={{
												backgroundColor: 'var(--background-header)',
												color: 'var(--text-login-color)',
												fontWeight: 600,
												fontSize: 14,
											}}
										/>
									</div>
								))}
						</div>

						<div className={cx('text-field', 'comments-field')}>
							<h4 className={cx('additional-comments')}>Additional Comments</h4>
							{editDemand && (
								<ShowMoreText
									/* Default options */
									lines={3}
									more="Show more"
									less="Show less"
									className={cx('comments')}
									anchorClass="show-more-less-clickable"
									truncatedEndingComponent={'... '}
								>
									<p className={cx('content-show-more')}>{comments}</p>
								</ShowMoreText>
							)}
							{!editDemand && (
								<div className={cx('wrap_input')}>
									<textarea
										value={comments || ''}
										className={cx('comments_input')}
										{...register('comment', {
											onChange: (e) => setComments(e.target.value),
											maxLength: {
												value: 1000,
												message: 'Too Many Characters',
											},
										})}
									/>
									<ErrorMessage
										errors={errors}
										name="comment"
										render={({ message }) => <p className={cx('message')}>{message}</p>}
									/>
								</div>
							)}
						</div>
						{!editDemand && (
							<div className={cx('container_btn')}>
								<button
									type="submit"
									onClick={handleSubmit(HandleEdit)}
									className={cx('button-save')}
								>
									{Post_demand.save}
								</button>
							</div>
						)}
						{hasToken && hasToken !== '' && hasToken !== null && (
							<div>
								<div className={cx('line-contact')}>
									<h3 className={cx('contact-details')}>Contact Details</h3>
								</div>
								<div className={cx('text-field')}>
									<h4>Representative Business Name</h4>
									<p>{businessName || 'No Information'}</p>
								</div>
								<div className={cx('text-field')}>
									<h4>Contact Name</h4>
									<p>{contactName || 'No Information'}</p>
								</div>
								<div className={cx('text-field')}>
									<h4>Contact Number</h4>
									<p>{contactNumber || 'No Information'}</p>
								</div>
								<div className={cx('text-field')}>
									<h4>Contact Email</h4>
									<p>{contactEmail || 'No Information'}</p>
								</div>
							</div>
						)}
					</form>
				</div>
			)}
		</div>
	);
}

export default ModalDetailDemand;
