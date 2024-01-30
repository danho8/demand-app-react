import styles from './index.module.css'
import classNames from 'classnames/bind';

const cn = classNames.bind(styles)

function LoadingModal() {
    return (
            <div className={cn('ldsDefault')}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
    );
}

export default LoadingModal;