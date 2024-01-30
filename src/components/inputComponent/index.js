import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Controller } from 'react-hook-form';
import { BsFillEyeSlashFill, BsFillEyeFill } from 'react-icons/bs';
const cx = classNames.bind(styles);
const InputCustom = ({
	control,
	name,
	rules = {},
	value,
	onChange,
	onBlur,
	error,
	placeholder,
	label,
	type,
	showPass,
}) => {
	const [typeEye, setTypeEye] = useState(false);

	return (
		<div className={cx('input_container')}>
			<p className={cx('label_input')}>{label}</p>
			<Controller
				control={control}
				name={name}
				rules={rules}
				render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
					<>
						<div className={cx('input')}>
							{typeEye ? (
								<input
									className={cx('input-item')}
									type="text"
									value={value || ''}
									onChange={onChange}
									onBlur={onBlur}
									placeholder={placeholder}
								/>
							) : (
								<input
									className={cx('input-item')}
									type={type}
									value={value || ''}
									onChange={onChange}
									onBlur={onBlur}
									placeholder={placeholder}
									autoFocus={name === 'email'}
								/>
							)}
							{showPass && typeEye && (
								<BsFillEyeFill
									onClick={() => setTypeEye(!typeEye)}
									className={cx('eyes-btn')}
								/>
							)}
							{showPass && !typeEye && (
								<BsFillEyeSlashFill
									onClick={() => setTypeEye(!typeEye)}
									className={cx('eyes-btn')}
								/>
							)}
						</div>
						{error && <p className={cx('error')}>{error.message || 'Error'}</p>}
					</>
				)}
			/>
		</div>
	);
};

export default InputCustom;
