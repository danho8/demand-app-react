import React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import ModalConfirm from '../../components/modalConfirm';
import { AiOutlineDelete } from 'react-icons/ai';
import styles from './index.module.scss';
import NoData from '../../components/noData';
import Loading from '../../components/loading';
import PaginatedItems from '../../components/pagination';
import { Text, Number, ApiServers, SuccessfulMessages, ErrorMessages } from '../../constants';
import { formatDate } from '../../functions/formatDate';
import { notifyError, notifySuccess } from '../../functions/toast';
import BaseAxios from '../../api/setUpAxios';
import { BiSearchAlt2 } from 'react-icons/bi';
import { FcDataBackup } from 'react-icons/fc';
import ModalEditViewUsers from '../../components/modalEditViewUsers';
import { ToastContainer } from 'react-toastify';
import { Users_demand } from '../../constants/text';
import 'react-tooltip/dist/react-tooltip.css';

const cx = classNames.bind(styles);

function UserInformation() {
	const [listOfDemands, setListOfDemands] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [paginate, setPaginate] = useState(1);
	const [totalPage, setTotalPage] = useState(0);
	const [isShowModal, setIsShowModal] = useState(false);
	const [dataModal, setDataModal] = useState();
	const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
	const [idDelete, setIdDelete] = useState(null);
	const [listSearch, setListSearch] = useState([]);
	const [isUpdate, setIsUpdate] = useState(false);
	const [liveUsers, setLiveUsers] = useState(Text.active);
	const [deletedUsers, setDeletedUsers] = useState(Text.noActive);
	const [isCallApiLiveUsers, setIsCallApiLiveUsers] = useState(true);
	const [isCallApiDeletedUsers, setIsCallApiDeletedUsers] = useState(false);
	const [role] = useState(JSON.parse(localStorage.getItem('role')));

	document.title = 'Manage Accounts | Statutory Demand';

	const autoPostDemand = (id) => {
		BaseAxios({
			url: `/users/${id}/auto-post`,
			method: 'POST',
		})
			.then((data) => {
				setIsUpdate(!isUpdate);
				notifyError(SuccessfulMessages.trusted);
			})
			.catch((e) => {
				notifyError('💢❗ Oh try again');
			});
	};

	const cancelAutoPostDemand = (id) => {
		BaseAxios({
			url: `/users/${id}/not-auto-post					`,
			method: 'POST',
		})
			.then((data) => {
				setIsUpdate(!isUpdate);
				notifyError(SuccessfulMessages.untrusted);
			})
			.catch((e) => {
				notifyError('💢❗ Oh try again');
			});
	};

	const unsuspendUser = (id) => {
		BaseAxios({
			url: ApiServers.users + '/' + id + '/active',
			method: 'POST',
		})
			.then((data) => {
				setIsUpdate(!isUpdate);
				notifySuccess('✅ ' + SuccessfulMessages.unsuspend);
			})
			.catch((e) => {
				notifyError('💢❗ Oh try again');
			});
	};

	const suspendUser = (id) => {
		BaseAxios({
			url: ApiServers.users + '/' + id + '/suspend',
			method: 'POST',
		})
			.then((data) => {
				setIsUpdate(!isUpdate);
				notifySuccess('✅ ' + SuccessfulMessages.suspended);
			})
			.catch((e) => {
				notifyError('💢❗ Oh try again');
			});
	};

	const searchSubmit = () => {
		let url = isCallApiLiveUsers === true ? ApiServers.users : ApiServers.deletedUsers;
		BaseAxios({
			url: url,
			method: 'GET',
			params: {
				page: paginate,
				search: listSearch,
				paginate_size: 30,
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

	const showDemandDetails = (demand) => {
		if (isCallApiLiveUsers) {
			setDataModal(demand);
			setIsShowModal(true);
		}
	};

	const handleUpdateListUser = () => {
		setIsUpdate(!isUpdate);
	};

	useEffect(() => {
		BaseAxios({
			url: isCallApiLiveUsers ? ApiServers.users : ApiServers.deletedUsers,
			params: {
				search: listSearch,
				page: paginate,
				paginate_size: 30,
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
	}, [paginate, isUpdate, isCallApiLiveUsers]);

	const handleCloseModal = () => {
		setDataModal(null);
		setIsShowModal(false);
	};

	const setValidEmail = (id) => {
		BaseAxios({
			url: `/users/${id}/email-valid	`,
			method: 'POST',
		})
			.then((res) => {
				setIsUpdate(!isUpdate);
				notifyError('Successfully');
			})
			.catch((err) => {
				if (err) {
					notifyError('An error occurred, please try again');
				}
			});
	};

	const deleteDemand = (id) => {
		BaseAxios({
			url: `${ApiServers.users}/${id}/delete`,
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

	const handleChangeTab = (nameTab) => {
		setListSearch('');
		switch (nameTab) {
			case Text.liveUsers:
				setLiveUsers(Text.active);
				setDeletedUsers(Text.noActive);
				setIsCallApiLiveUsers(true);
				setIsCallApiDeletedUsers(false);
				break;
			case Text.deletedUsers:
				setLiveUsers(Text.noActive);
				setDeletedUsers(Text.active);
				setIsCallApiLiveUsers(false);
				setIsCallApiDeletedUsers(true);
				break;
			default:
				notifyError(ErrorMessages.selectedTabIsInvalid);
				break;
		}
	};

	const restoreUser = (id) => {
		BaseAxios({
			url: `/users/${id}/restore`,
			method: 'POST',
		})
			.then((res) => {
				setIsUpdate(!isUpdate);
				notifySuccess(SuccessfulMessages.restored);
			})
			.catch((err) => {
				if (err) notifyError(ErrorMessages.default);
			});
	};

	return (
		<div>
			<div className={cx('wrapper')}>
				<ToastContainer />
				{isShowModal && (
					<ModalEditViewUsers
						handleUpdateListUser={handleUpdateListUser}
						data={dataModal}
						handleCloseModal={handleCloseModal}
					/>
				)}
				<div className={cx('content')}>
					<div className={cx('contentHeader')}>
						<h2>Manage accounts</h2>
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

					{role > 0 && (
						<div className={cx('tabs')}>
							<div
								className={cx('tab', `${liveUsers}`)}
								onClick={() => handleChangeTab(Text.liveUsers)}
							>
								<p>{Text.liveUsers}</p>
							</div>
							<div
								className={cx('tab', `${deletedUsers}`)}
								onClick={() => handleChangeTab(Text.deletedUsers)}
							>
								<p>{Text.deletedUsers}</p>
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
									<th className={cx('demandId')}>{Users_demand.title.users_id}</th>
									<th className={cx('debtorCompanyName')}>{Users_demand.title.business_name}</th>
									<th className={cx('acn')}>{Users_demand.title.email}</th>
									<th className={cx('demandAmount')}>{Users_demand.title.phone}</th>
									<th className={cx('dateIssued')}>{Users_demand.title.day}</th>
									<th className={cx('expiresIn')}>{Users_demand.title.role}</th>
									{role > 0 && isCallApiLiveUsers && (
										<>
											<th className={cx('action')}>{Users_demand.title.suspend}</th>
											<th className={cx('action')}>{Users_demand.title.auto_post}</th>
											<th className={cx('action')}>{Users_demand.title.verified}</th>
										</>
									)}
									{role === 2 && isCallApiLiveUsers && <th className={cx('delete')}></th>}
									{role > 0 && isCallApiDeletedUsers && (
										<th className={cx('action')}>{Text.restore}</th>
									)}
								</tr>
							</thead>

							{listOfDemands.length > 0 && !isLoading && (
								<tbody>
									{listOfDemands.map((demand) => {
										return (
											<tr
												key={demand.id}
												className={isCallApiLiveUsers ? cx('pointer') : null}
											>
												<td
													className={cx('demandId')}
													onClick={() => {
														showDemandDetails(demand);
													}}
												>
													{demand.id}
												</td>
												<td
													className={cx('debtorCompanyName')}
													onClick={() => {
														showDemandDetails(demand);
													}}
												>
													{demand.business_name}
												</td>
												<td
													className={cx('acn')}
													onClick={() => {
														showDemandDetails(demand);
													}}
												>
													{demand.email}
												</td>
												<td
													className={cx('demandAmount')}
													onClick={() => {
														showDemandDetails(demand);
													}}
												>
													{demand.contact_number}
												</td>
												<td
													className={cx('dateIssued')}
													onClick={() => {
														showDemandDetails(demand);
													}}
												>
													{formatDate(demand.created_at)}
												</td>
												<td
													className={cx('expiresIn')}
													onClick={() => {
														showDemandDetails(demand);
													}}
												>
													{demand.role}
												</td>
												{role > 0 && demand.role !== 'Admin' && isCallApiLiveUsers && (
													<td className={cx('approve')}>
														{demand.status === Text.suspended ? (
															<button
																className={cx('buttonPost', 'suspended')}
																onClick={() => unsuspendUser(demand.id)}
															>
																{Text.yes}
															</button>
														) : (
															<button
																className={cx('buttonPost', 'unsuspend')}
																onClick={() => suspendUser(demand.id)}
															>
																{Text.no}
															</button>
														)}
													</td>
												)}
												{demand.role === 'Admin' && <td className={cx('approve')}></td>}
												{role > 0 && isCallApiLiveUsers && (
													<td className={cx('approve')}>
														{demand.role !== 'Admin' &&
															(demand.auto_post === Text.suspended ? (
																<button
																	className={cx('buttonPost', 'suspended')}
																	onClick={() => autoPostDemand(demand.id)}
																>
																	{Text.no}
																</button>
															) : (
																<button
																	className={cx('buttonPost', 'unsuspend')}
																	onClick={() => cancelAutoPostDemand(demand.id)}
																>
																	{Text.yes}
																</button>
															))}
													</td>
												)}
												{role > 0 && isCallApiLiveUsers && (
													<td className={cx('approve')}>
														{demand.role !== 'Admin' &&
															(demand.email_valid === Text.suspended ? (
																<button
																	className={cx('buttonPost', 'suspended')}
																	onClick={() => setValidEmail(demand.id)}
																>
																	{Text.no}
																</button>
															) : (
																<button
																	className={cx('buttonPost', 'unsuspend')}
																	onClick={() => setValidEmail(demand.id)}
																>
																	{Text.yes}
																</button>
															))}
													</td>
												)}
												{isCallApiLiveUsers && (
													<td className={cx('delete')}>
														{role === 2 && demand.role !== 'Admin' && (
															<AiOutlineDelete
																className={cx('deleteIcon')}
																onClick={() => showModalConfirm(demand.id)}
															/>
														)}
														{isShowModalConfirm && (
															<ModalConfirm
																submitDelete={() => deleteDemand(idDelete)}
																backgroundColor={Text.backgroundMatteCoatingColor}
																description="Are you sure you want to delete this user ?"
																alertBtn={false}
																deleteBtn={true}
																closeModal={() => setIsShowModalConfirm(false)}
																isOpen={isShowModalConfirm}
															/>
														)}
													</td>
												)}
												{role > 0 && isCallApiDeletedUsers && (
													<td className={cx('approve')}>
														{demand.role !== 'Admin' && demand.deleted_at !== null && (
															<button
																className={cx('buttonPost', 'unsuspend')}
																onClick={() => restoreUser(demand.id)}
															>
																{Text.yes}
															</button>
														)}
													</td>
												)}
											</tr>
										);
									})}
								</tbody>
							)}
							{listOfDemands.length === 0 && !isLoading && <NoData colSpan={role === 2 ? 10 : 9} />}
							{isLoading && (
								<tbody>
									<tr>
										<td
											colSpan={role === 2 ? 10 : 9}
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
		</div>
	);
}

export default UserInformation;
