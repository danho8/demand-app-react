import classNames from 'classnames/bind';
import { FcDataBackup } from 'react-icons/fc';
import styles from './index.module.scss';
import { ErrorMessages, SubStrings, Text } from '../../constants';
import BaseAxios from '../../api/setUpAxios';
import { notifyError, notifySuccess } from '../../functions/toast';
import { useEffect, useState } from 'react';
import LoadingModal from '../loadingModal';
import { ToastContainer } from 'react-toastify';
import Loading from '../loading';

const cx = classNames.bind(styles);
const MIN_EXPIRED_DAY = 1;
const MAX_EXPIRED_DAY = 100;

function Settings() {
	const [isUpdate, setIsUpdate] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [previousValueOfSettingsExpiredDay, setPreviousValueOfSettingsExpiredDay] = useState(MIN_EXPIRED_DAY);
	const [currentValueOfSettingsExpiredDay, setCurrentValueOfSettingsExpiredDay] = useState('');

	const backUpDB = (textBackup) => {
		setIsLoading(true);
		let url = textBackup === Text.backUpDB ? SubStrings.path.backupDB : SubStrings.path.backupPDFFilesOfUsers;
		let fileName =
			textBackup === Text.backUpDB
				? Text.backup + Text.dot + Text.formatFile.sql
				: Text.uploadedPDFFilesOfUsers + Text.dot + Text.formatFile.xlsx;
		BaseAxios({
			url: url,
			method: 'GET',
			responseType: 'blob',
		})
			.then((res) => {
				setIsLoading(false);
				const url = window.URL.createObjectURL(new Blob([res.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', fileName);
				document.body.appendChild(link);
				link.click();
			})
			.catch(() => {
				setIsLoading(false);
				notifyError(ErrorMessages.default);
			});
	};

	const validateValueOfExpiredDay = (e) => {
		setCurrentValueOfSettingsExpiredDay(
			e.target.value < MIN_EXPIRED_DAY
				? MIN_EXPIRED_DAY
				: e.target.value > MAX_EXPIRED_DAY
				? MAX_EXPIRED_DAY
				: parseInt(e.target.value),
		);
	};

	const setExpiredDay = () => {
		if (currentValueOfSettingsExpiredDay !== previousValueOfSettingsExpiredDay) {
			BaseAxios({
				url: SubStrings.path.setExpiredDay,
				method: 'POST',
				params: {
					day: currentValueOfSettingsExpiredDay,
				},
			})
				.then(() => {
					setIsLoading(false);
					notifySuccess(
						'Updated expired demands from ' +
							previousValueOfSettingsExpiredDay +
							' to ' +
							currentValueOfSettingsExpiredDay +
							(currentValueOfSettingsExpiredDay > 1 ? ' days' : ' day') +
							' successfully.',
					);
					setIsUpdate(!isUpdate);
				})
				.catch(() => {
					setIsLoading(false);
					notifyError(ErrorMessages.default);
				});
		}
	};

	useEffect(() => {
		BaseAxios({
			url: SubStrings.path.getExpiredDay,
			method: 'GET',
		})
			.then((res) => {
				setIsLoading(false);
				setCurrentValueOfSettingsExpiredDay(parseInt(res.data.data.value));
				setPreviousValueOfSettingsExpiredDay(parseInt(res.data.data.value));
			})
			.catch(() => {});
	}, [isUpdate]);

	return (
		<>
			<div className={cx('wrapper')}>
				<ToastContainer />
				<div className={cx('content')}>
					<div className={cx('row')}>
						<p className={cx('text')}>
							{Text.backUpDB}
							{Text.colon}
						</p>
						<div className={cx('setting')}>
							<FcDataBackup
								className={cx('iconBackUpDB')}
								onClick={() => backUpDB(Text.backUpDB)}
								title={Text.download + ' ' + Text.backUpDB}
							/>
						</div>
					</div>
					<div className={cx('row')}>
						<p className={cx('text')}>
							{Text.backupPDFFilesOfUsers}
							{Text.colon}
						</p>
						<div className={cx('setting')}>
							<FcDataBackup
								className={cx('iconBackUpDB')}
								onClick={() => backUpDB(Text.backupPDFFilesOfUsers)}
								title={Text.download + ' ' + Text.backupPDFFilesOfUsers}
							/>
						</div>
					</div>
					<div className={cx('row')}>
						<p className={cx('text')}>
							{Text.expiredDemands} {Text.after}
							{Text.colon}
						</p>
						<div className={cx('setting')}>
							<input
								type="number"
								inputMode="numeric"
								pattern="[0-9]*"
								value={currentValueOfSettingsExpiredDay}
								onBlur={setExpiredDay}
								onChange={validateValueOfExpiredDay}
							/>
						</div>
					</div>
				</div>
				{isLoading && (
					<div className={cx('background')}>
						<LoadingModal />
					</div>
				)}
			</div>
		</>
	);
}

export default Settings;
