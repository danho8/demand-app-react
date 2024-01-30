import React from 'react';
import classNames from 'classnames/bind';
import { BiSearchAlt2 } from 'react-icons/bi';
import { Text } from '../../constants';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

function Search({ search }) {
	return (
		<div className={cx('search')}>
			<input
				type="text"
				placeholder={Text.search}
			/>
			<div className={cx('iconSearch')}>
				<BiSearchAlt2
					className={cx('searchIcon')}
					onClick={search}
				/>
			</div>
		</div>
	);
}

export default Search;
