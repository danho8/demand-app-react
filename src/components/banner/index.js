import React from 'react';
import classNames from 'classnames/bind';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

function Banner({text}) {
    return ( 
        <div className={cx('banner')}>
            <p>{text}</p>
        </div>
     );
}

export default Banner;