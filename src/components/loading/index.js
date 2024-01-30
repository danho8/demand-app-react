import styles from './index.module.css';
import cn from 'classnames';

function Loading() {
	return (
		<div className={cn(styles.ldsEllipsis)}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}

export default Loading;
