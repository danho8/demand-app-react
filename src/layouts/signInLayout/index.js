import classNames from 'classnames/bind';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

function SignInLayout({ Header, Page, Footer }) {
	return (
		<div className={cx('app')}>
			{Header}
			<div className={cx('body')}>
				<div style={{background:'url(/images/bg-err.jpg)',backgroundPosition:'center'}}  className={cx('contentPage')}>{Page}</div>
				<div className={cx('footer-area')}>{Footer}</div>
			</div>
		</div>
	);
}

export default SignInLayout;
