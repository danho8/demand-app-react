import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Text } from '../../constants';
import React, { useState } from 'react';
import Modal from 'react-modal';
const cx = classNames.bind(styles);
const customStyles = {
	overlay: {
		backgroundColor: ' var(--modal-confirm-background-color)',
		zIndex: 99999,
	},
	content: {
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxWidth: '36rem',
		width: '34rem',
		height: '17rem',
		overflow: 'auto',
		padding: 'padding: 25px 0 0 12px',
		borderRadius: '8px',
		boxSizing: 'border-box',
		justifyContent: 'center',
		alignItems: 'center',
	}
};
function ModalConfirm({ isOpen, description, successBtn, deleteBtn, alertBtn, closeModal, backgroundColor, submitDelete }) {
	const [modalIsOpen, setModalIsOpen] = useState(isOpen);

	const handleCloseModal = () => {
		setModalIsOpen(false);
		closeModal();
	};

	return (
		<Modal
			isOpen={modalIsOpen}
			onRequestClose={handleCloseModal}
			style={customStyles}
		>
			<div className={cx('boxConfirm')}>
				<p className={cx('boxHeader')}>{description}</p>
				{deleteBtn && (
					<div className={cx('groupBtn')}>
						<button onClick={handleCloseModal} className={cx('btn', 'btnCancel')}>
							{Text.cancel}
						</button>
						<button onClick={submitDelete} className={cx('btn', 'btnDelete')}>
							{Text.ok}
						</button>
					</div>
				)}

				{alertBtn && (
					<div className={cx('groupBtn')}>
						<button onClick={handleCloseModal} className={cx('btnCancel')}>
							{Text.close}
						</button>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default ModalConfirm;
