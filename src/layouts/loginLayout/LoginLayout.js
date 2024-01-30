import React from 'react';
import style from './index.module.scss';
import classNames from 'classnames/bind';
import { Text } from '../../constants';

const cx = classNames.bind(style);

const LoginLayout = ({ Children }) => {
	return (
		<div className={cx('wrapper')}>
			<div style={{background:'url(/images/background-login.jpg)',backgroundRepeat:'no-repeat',backgroundSize:'cover',backgroundPosition:'center'}} className={cx('background-video')}>
				{/* <video
					autoPlay
					loop
					muted
					controls={false}
				>
					<source
						src="/videos/background-login.mp4"
						type="video/mp4"
					/>
					{Text.noSupportVideo}
				</video> */}
			</div>
			<div className={cx('layer')}>
				<div className={cx('content')}>{Children}</div>
			</div>
		</div>
	);
};

export default LoginLayout;
