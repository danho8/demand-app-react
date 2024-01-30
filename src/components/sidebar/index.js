import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { sidebar_text } from '../../constants/text';
const cx = classNames.bind(styles);

function Sidebar() {
	return (
		<div className={cx('sidebar')}>
			<div className={cx('sidebar-body')}>
				<ul className={cx('sidebar-body-container-item')}>
					{sidebar_text.map((item) => {
						return (
							<li className={cx('sidebar-item')} key={item.body_sidebar_item}>
								{item.body_sidebar_item}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}

export default Sidebar;
