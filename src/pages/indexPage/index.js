import React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { AiOutlineDelete } from 'react-icons/ai';
import styles from './index.module.scss';
import NoData from '../../components/noData';
import Loading from '../../components/loading';
import PaginatedItems from '../../components/pagination';
import { Text, Number, ApiServers, ErrorMessages, StatusApprove } from '../../constants';
import ModalDetailDemand from '../../components/modalDetailDemand';
import ModalConfirm from '../../components/modalConfirm';
import { USdollar } from '../../functions/formatPrice';
import { formatDate } from '../../functions/formatDate';
import BaseAxios from '../../api/setUpAxios';
import { BiSearchAlt2 } from 'react-icons/bi';
import { notifyError } from '../../functions/toast';
import { ToastContainer } from 'react-toastify';
import Banner from '../../components/banner';
import { set } from 'react-hook-form';

const cx = classNames.bind(styles);

function IndexPage() {
	const [isLogin, setIsLogin] = useState(localStorage.getItem('isLogin'));
	const [statusEmailValid, setStatusEmailValid] = useState(localStorage.getItem('email_valid'));
	const [isUpdate, setIsUpdate] = useState(false);
	const [listSearch, setListSearch] = useState([]);
	const [updateListDemand, setUpdateListDemand] = useState(false);
	const [listOfDemands, setListOfDemands] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [paginate, setPaginate] = useState(1);
	const [totalPage, setTotalPage] = useState(0);
	const [isShowModal, setIsShowModal] = useState(false);
	const [dataModal, setDataModal] = useState();
	const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
	const [idDelete, setIdDelete] = useState(null);
	const [role] = useState(JSON.parse(localStorage.getItem('role')));
	const [common, setCommon] = useState(Text.active);
	const [demandsForReview, setDemandsForReview] = useState(Text.noActive);
	const [expiredDemands, setExpiredDemands] = useState(Text.noActive);
	const [deletedDemands, setDeletedDemands] = useState(Text.noActive);
	const [statusApprove, setStatusApprove] = useState(StatusApprove.approved);
	const [isCallApiExpiredDemands, setIsCallApiExpiredDemands] = useState(false);
	const [isCallApiDeletedDemands, setIsCallApiDeletedDemands] = useState(false);
	const [isCallApiPublicAndReview, setIsCallApiPublicAndReview] = useState(true);
	const [valueOfSelect, setValueOfSelect] = useState(Text.titleCell.debtorCompanyName);

	const handleUpdateListDemand = () => {
		setUpdateListDemand(!updateListDemand);
	};

	document.title = 'List Of Demands | Statutory Demand';

	const searchSubmit = () => {
		let url = isCallApiPublicAndReview
			? ApiServers.demands
			: isCallApiExpiredDemands
			? ApiServers.expiredDemands
			: ApiServers.deletedDemands;
		BaseAxios({
			url: url,
			params: {
				page: paginate,
				search: listSearch,
				paginate_size: Number.maxQuantityItemPerPage,
				status: statusApprove === StatusApprove.approved ? statusApprove : StatusApprove.noApprove,
				debtor_company_name: valueOfSelect === Text.titleCell.debtorCompanyName ? listSearch : null,
				code_company: valueOfSelect === Text.titleCell.acn ? listSearch : null,
			},
		})
			.then((data) => {
				setListOfDemands(data.data.data.data);
				setIsLoading(false);
				setTotalPage(data.data.data.pagination.total_pages);
			})
			.catch(() => {
				setIsLoading(false);
			});
	};

	const handleEnterPress = (e) => {
		if (e.key === 'Enter') {
			searchSubmit();
		}
	};

	const showModalConfirm = (id) => {
		setIsShowModalConfirm(true);
		setIdDelete(id);
	};

	const deleteDemand = (id) => {
		BaseAxios({
			url: `${ApiServers.deleteDemands}/${id}/delete`,
			method: 'POST',
		})
			.then((res) => {
				setIsUpdate(!isUpdate);
				notifyError('Deleted successfully');
			})
			.catch((err) => {
				if (err.response.status === 403) {
					notifyError('You do not have permission to delete this demand');
				}
			});
		setIsShowModalConfirm(false);
	};

	const showDemandDetails = (demand) => {
		if (!isCallApiDeletedDemands) {
			setDataModal(demand);
			setIsShowModal(true);
		}
	};

	const handleCloseModal = () => {
		setDataModal(null);
		setIsShowModal(false);
	};

	const handleApprove = (id) => {
		BaseAxios({ url: ApiServers.demands + '/' + id + '/approve', method: 'POST' })
			.then((data) => {
				setIsUpdate(!isUpdate);
				setIsLoading(false);
				notifyError('Demand has been approved');
			})
			.catch((err) => {
				notifyError('An error occurred. Please try again');
				setIsLoading(false);
			});
	};

	const handleSelectFilter = (e) => {
		setValueOfSelect(e.target.value);
		setListSearch('');
	};

	const handleChangeTab = (nameTab) => {
		setListSearch('');
		switch (nameTab) {
			case Text.public:
				setCommon(Text.active);
				setDemandsForReview(Text.noActive);
				setExpiredDemands(Text.noActive);
				setDeletedDemands(Text.noActive);
				setStatusApprove(StatusApprove.approved);
				setIsCallApiPublicAndReview(true);
				setIsCallApiExpiredDemands(false);
				setIsCallApiDeletedDemands(false);
				break;
			case Text.demandsForReview:
				setCommon(Text.noActive);
				setDemandsForReview(Text.active);
				setExpiredDemands(Text.noActive);
				setDeletedDemands(Text.noActive);
				setStatusApprove(StatusApprove.noApprove);
				setIsCallApiPublicAndReview(true);
				setIsCallApiExpiredDemands(false);
				setIsCallApiDeletedDemands(false);
				break;
			case Text.expiredDemands:
				setCommon(Text.noActive);
				setDemandsForReview(Text.noActive);
				setExpiredDemands(Text.active);
				setDeletedDemands(Text.noActive);
				setIsCallApiPublicAndReview(false);
				setIsCallApiExpiredDemands(true);
				setIsCallApiDeletedDemands(false);
				break;
			case Text.deletedDemands:
				setCommon(Text.noActive);
				setDemandsForReview(Text.noActive);
				setExpiredDemands(Text.noActive);
				setDeletedDemands(Text.active);
				setIsCallApiPublicAndReview(false);
				setIsCallApiExpiredDemands(false);
				setIsCallApiDeletedDemands(true);
				break;
			default:
				notifyError(ErrorMessages.selectedTabIsInvalid);
				break;
		}
	};

	useEffect(() => {
		if (isCallApiPublicAndReview) {
			BaseAxios(ApiServers.demands, {
				method: 'GET',
				params: {
					page: paginate,
					search: listSearch,
					paginate_size: Number.maxQuantityItemPerPage,
					status: statusApprove === StatusApprove.approved ? statusApprove : StatusApprove.noApprove,
				},
			})
				.then((data) => {
					setListOfDemands(data.data.data.data);
					setIsLoading(false);
					setTotalPage(data.data.data.pagination.total_pages);
				})
				.catch(() => {
					setIsLoading(false);
				});
		}
	}, [paginate, isUpdate, updateListDemand, statusApprove, isCallApiPublicAndReview]);

	useEffect(() => {
		if (isCallApiExpiredDemands) {
			BaseAxios({
				method: 'GET',
				url: ApiServers.expiredDemands,
				params: {
					page: paginate,
					search: listSearch,
					paginate_size: Number.maxQuantityItemPerPage,
				},
			})
				.then((data) => {
					setListOfDemands(data.data.data.data);
					setIsLoading(false);
					setTotalPage(data.data.data.pagination.total_pages);
				})
				.catch(() => {
					setIsLoading(false);
				});
		}
	}, [isCallApiExpiredDemands]);

	useEffect(() => {
		if (isCallApiDeletedDemands) {
			BaseAxios({
				method: 'GET',
				url: ApiServers.deletedDemands,
				params: {
					page: paginate,
					search: listSearch,
					paginate_size: Number.maxQuantityItemPerPage,
				},
			})
				.then((data) => {
					setListOfDemands(data.data.data.data);
					setIsLoading(false);
					setTotalPage(data.data.data.pagination.total_pages);
				})
				.catch(() => {
					setIsLoading(false);
				});
		}
	}, [isCallApiDeletedDemands]);

	return (
		<div className={cx('wrapper')}>
			<ToastContainer />
			{isShowModal && (
				<ModalDetailDemand
					handleUpdateListDemand={handleUpdateListDemand}
					data={dataModal}
					handleCloseModal={handleCloseModal}
				/>
			)}
			<div className={cx('content')}>
				{isLogin === 'true' && statusEmailValid === '0' && <Banner text={Text.banner} />}
				<div className={cx('contentHeader')}>
					<h2>{Text.title.listOfDemands}</h2>
					<div className={cx('searchAndFilter')}>
						<select
							value={valueOfSelect}
							onChange={handleSelectFilter}
						>
							<option value={Text.titleCell.debtorCompanyName}>{Text.titleCell.debtorCompanyName}</option>
							<option value={Text.titleCell.acn}>{Text.titleCell.acn}</option>
						</select>
						<div className={cx('search')}>
							<input
								onKeyUp={handleEnterPress}
								onChange={(e) => setListSearch(e.target.value)}
								value={listSearch}
								type="text"
								placeholder={Text.search}
							/>
							<div className={cx('iconSearch')}>
								<BiSearchAlt2
									className={cx('searchIcon')}
									onClick={searchSubmit}
								/>
							</div>
						</div>
					</div>
				</div>

				{role > 0 && (
					<div className={cx('tabs')}>
						<div
							className={cx('tab', `${common}`)}
							onClick={() => handleChangeTab(Text.public)}
						>
							<p>{Text.public}</p>
						</div>
						<div
							className={cx('tab', `${demandsForReview}`)}
							onClick={() => handleChangeTab(Text.demandsForReview)}
						>
							<p>{Text.demandsForReview}</p>
						</div>
						<div
							className={cx('tab', `${expiredDemands}`)}
							onClick={() => handleChangeTab(Text.expiredDemands)}
						>
							<p>{Text.expiredDemands}</p>
						</div>
						<div
							className={cx('tab', `${deletedDemands}`)}
							onClick={() => handleChangeTab(Text.deletedDemands)}
						>
							<p>{Text.deletedDemands}</p>
						</div>
					</div>
				)}

				<div className={cx('contentbody')}>
					<table
						className={cx('tableContent')}
						cellSpacing="0"
					>
						<thead>
							<tr>
								{role > 0 && <th className={cx('demandId')}>{Text.titleCell.demandId}</th>}
								<th className={cx('debtorCompanyName')}>{Text.titleCell.debtorCompanyName}</th>
								<th className={cx('acn')}>{Text.titleCell.acn}</th>
								<th className={cx('demandAmount')}>{Text.titleCell.demandAmount}</th>
								<th className={cx('dateIssued')}>{Text.titleCell.dateIssued}</th>
								{!isCallApiDeletedDemands && (
									<th className={cx('expiresIn')}>{Text.titleCell.expiresIn}</th>
								)}
								{role > 0 && demandsForReview === Text.active && (
									<th className={cx('action')}>{Text.titleCell.action}</th>
								)}
								{role > 0 && !isCallApiDeletedDemands && <th className={cx('delete')}></th>}
							</tr>
						</thead>

						{listOfDemands.length > 0 && !isLoading && (
							<tbody>
								{listOfDemands.map((demand) => {
									return (
										<tr
											key={demand.id}
											className={!isCallApiDeletedDemands ? cx('pointer') : null}
										>
											{role > 0 && (
												<td
													className={cx('demandId')}
													onClick={() => {
														showDemandDetails(demand);
													}}
												>
													{demand.id}
												</td>
											)}
											<td
												className={cx('debtorCompanyName')}
												onClick={() => {
													showDemandDetails(demand);
												}}
											>
												{demand.debtor_company_name}
											</td>
											<td
												className={cx('acn')}
												onClick={() => {
													showDemandDetails(demand);
												}}
											>
												{demand.code_company}
											</td>
											<td
												className={cx('demandAmount')}
												onClick={() => {
													showDemandDetails(demand);
												}}
											>
												${USdollar.format(demand.demand_amount)}
											</td>
											<td
												className={cx('dateIssued')}
												onClick={() => {
													showDemandDetails(demand);
												}}
											>
												{formatDate(demand.date_issued)}
											</td>
											{!isCallApiDeletedDemands && (
												<td
													className={cx(
														'expiresIn',
														demand.expries_in.toLowerCase() === Text.expired
															? 'red'
															: parseInt(demand.expries_in.split(' ')[0]) <=
															  Text.from20dayToExpired
															? 'red'
															: parseInt(demand.expries_in.split(' ')[0]) <=
															  Text.from15To19day
															? 'orange'
															: 'green',
													)}
													onClick={() => {
														showDemandDetails(demand);
													}}
												>
													{demand.expries_in}
												</td>
											)}
											{role > 0 && demandsForReview === Text.active && (
												<td className={cx('approve')}>
													{demand.demand_status_name === Text.titleCell.review ? (
														<button
															className={cx('buttonPost')}
															onClick={() => handleApprove(demand.id)}
														>
															{Text.titleCell.posted}
														</button>
													) : null}
												</td>
											)}

											{role > 0 && !isCallApiDeletedDemands && (
												<td className={cx('delete')}>
													<AiOutlineDelete
														className={cx('deleteIcon')}
														onClick={() => showModalConfirm(demand.id)}
													/>
													{isShowModalConfirm && (
														<ModalConfirm
															submitDelete={() => deleteDemand(idDelete)}
															backgroundColor={Text.backgroundMatteCoatingColor}
															description={Text.delete.confirm}
															alertBtn={false}
															deleteBtn={true}
															closeModal={() => setIsShowModalConfirm(false)}
															isOpen={isShowModalConfirm}
														/>
													)}
												</td>
											)}
										</tr>
									);
								})}
							</tbody>
						)}
						{listOfDemands.length === 0 && !isLoading && <NoData colSpan={role > 0 ? 8 : 6} />}
						{isLoading && (
							<tbody>
								<tr>
									<td
										colSpan={role > 0 ? 8 : 6}
										className={cx('loadingArea')}
									>
										<Loading />
									</td>
								</tr>
							</tbody>
						)}
					</table>
				</div>

				{listOfDemands.length > 0 && totalPage > 1 && (
					<div className={cx('pagination')}>
						<PaginatedItems
							setPaginate={setPaginate}
							totalPage={totalPage}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default IndexPage;
