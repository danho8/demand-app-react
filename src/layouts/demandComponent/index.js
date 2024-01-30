import React, { memo } from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import ModalConfirm from '../../components/modalConfirm';
import { AiOutlineDelete } from 'react-icons/ai';
import styles from './index.module.scss';
import NoData from '../../components/noData';
import Loading from '../../components/loading';
import PaginatedItems from '../../components/pagination';
import { Text, Number, ApiServers } from '../../constants';
import axios from 'axios';
import { USdollar } from '../../functions/formatPrice';
import { formatDate } from '../../functions/formatDate';
import { notifyError } from '../../functions/toast';
import BaseAxios from '../../api/setUpAxios';
import { BiSearchAlt2 } from 'react-icons/bi';
import ModalEditViewMyDemand from '../../components/modalEditViewMyDemand';

const cx = classNames.bind(styles);
function ViewDemand() {
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
	const [role] = useState(sessionStorage.getItem('role'));

	document.title = 'View My Demands | Statutory Demand';

	const searchSubmit = () => {
		BaseAxios({
			url: ApiServers.viewDemands,
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

	const handleUpdateViewMyDemand = () => {
		setIsUpdate(!isUpdate);
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
		setDataModal(demand);
		setIsShowModal(true);
	};

	useEffect(() => {
		BaseAxios(ApiServers.viewDemands, {
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
	}, [paginate, isUpdate]);

	const handleCloseModal = () => {
		setDataModal(null);
		setIsShowModal(false);
	};

	const handleApprove = (id) => {
		// use post
		BaseAxios({ url: ApiServers.demands + '/' + id + '/approve', method: 'post' })
			.then((data) => {
				setIsLoading(true);
			})
			.catch((err) => {
				setIsLoading(false);
			});
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

	return (
		<div>
			<div className={cx('wrapper')}>
				{isShowModal && (
					<ModalEditViewMyDemand
						handleUpdateViewMyDemand={handleUpdateViewMyDemand}
						data={dataModal}
						handleCloseModal={handleCloseModal}
					/>
				)}
				{/* <Sidebar /> */}
				<div className={cx('content')}>
					<div className={cx('contentHeader')}>
						<h2>{Text.title.viewOfDemands}</h2>
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

					<div className={cx('contentbody')}>
						<table
							className={cx('tableContent')}
							cellSpacing="0"
						>
							<thead>
								<tr>
									<th className={cx('demandId')}>{Text.titleCell.demandId}</th>
									<th className={cx('debtorCompanyName')}>{Text.titleCell.debtorCompanyName}</th>
									<th className={cx('acn')}>{Text.titleCell.acn}</th>
									<th className={cx('demandAmount')}>{Text.titleCell.demandAmount}</th>
									<th className={cx('dateIssued')}>{Text.titleCell.dateIssued}</th>
									<th className={cx('expiresIn')}>{Text.titleCell.expiresIn}</th>
									<th className={cx('status')}>{Text.titleCell.status}</th>
									<th className={cx('status')}></th>
								</tr>
							</thead>

							{listOfDemands.length > 0 && !isLoading && (
								<tbody>
									{listOfDemands.map((demand) => {
										return (
											<tr key={demand.id}>
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
												<td
													className={cx('expiresIn')}
													onClick={() => {
														showDemandDetails(demand);
													}}
												>
													{demand.expries_in}
												</td>
												<td
													className={cx('status')}
													onClick={() => {
														showDemandDetails(demand);
													}}
												>
													{demand.demand_status_name}
												</td>
												<td className={cx('remove')}>
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
											</tr>
										);
									})}
								</tbody>
							)}
							{listOfDemands.length === 0 && !isLoading && <NoData colSpan={8} />}
							{isLoading && (
								<tbody>
									<tr>
										<td
											colSpan={8}
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

					<div className={cx('textBox')}>
						<p>{Text.titleCell.status}</p>
						<p>
							{Text.titleCell.review} {Text.equal} {Text.meanOfReview}
						</p>
						<p>
							{Text.approved} {Text.equal} {Text.meanOfApproved}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ViewDemand;
