import React, { memo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './index.module.css';
import classNames from 'classnames/bind';
import { Text } from '../../constants';

const cx = classNames.bind(styles);

function PaginatedItems({ setPaginate, totalPage }) {
	const [disabled, setDisable] = useState(1);
	const _onPageChange = (data) => {
		setDisable(data.selected + 1);
		setPaginate(data.selected + 1);
	};

	return (
		<>
			<ReactPaginate
				breakLabel={Text.pagination.breakLabel}
				nextLabel={Text.pagination.next}
				onPageChange={_onPageChange}
				pageRangeDisplayed={2}
				pageCount={totalPage}
				previousLabel={Text.pagination.previous}
				renderOnZeroPageCount={null}
				containerClassName={cx('pagination')}
				pageLinkClassName={cx('pageNum', 'number')}
				previousClassName={disabled === 1 ? cx('pageNum', 'previous', 'disabled') : cx('pageNum', 'previous')}
				nextLinkClassName={disabled === totalPage ? cx('pageNum', 'next', 'disabled') : cx('pageNum', 'next')}
				activeLinkClassName={cx('active')}
			/>
		</>
	);
}

export default memo(PaginatedItems);
