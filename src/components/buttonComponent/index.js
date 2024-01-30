import React from 'react';
import classNames from 'classnames/bind';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

const ButtonComponent = ({ onClick, textButton, type, dynamicClass = false }) => {
	return (
		<div className={cx('wrapper')}>
			<button
				type={type}
				className={cx('button_basic', dynamicClass)}
				onClick={onClick}
			>
				{textButton}
			</button>
		</div>
	);
};

export default ButtonComponent;
