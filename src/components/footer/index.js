import React from 'react';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { footer_text } from '../../constants/text';
const cx = classNames.bind(styles);

function Footer() {
	return (
		<footer className={cx('footer')}>
			<div className={cx('footer-content')}>
				<div className={cx('footer-section', 'medium')}>
					<h3 className={cx('footer-heading')}>{footer_text.disclaimer}</h3>
					<p className={cx('footer-text')}>{footer_text.disclaimer_item_1}</p>
					<p className={cx('footer-text')}>{footer_text.disclaimer_item_2}</p>
				</div>
				<div className={cx('footer-section', 'medium')}>
					<h3 className={cx('footer-heading')}>{footer_text.contact_footer}</h3>
					<ul className={cx('footer-list')}>
						<li>{footer_text.contact_footer_item_1}</li>
						<li>{footer_text.contact_footer_item_2}</li>
						<li>{footer_text.contact_footer_item_3}</li>
						<li>{footer_text.contact_footer_item_4}</li>
					</ul>
				</div>
				<div className={cx('footer-section', 'small')}>
					<h3 className={cx('footer-heading')}>{footer_text.privacy}</h3>
					<p>
						<a
							className={cx('footer-text', 'footer-text-link')}
							href="https://en.wikipedia.org/wiki/Internet_privacy"
							target='_blank'
						>
							{footer_text.privacy_item_1}
						</a>
					</p>
					<p>
						<a
							className={cx('footer-text', 'footer-text-link')}
							href="https://en.wikipedia.org/wiki/Internet_privacy"
							target='_blank'
						>
							{footer_text.privacy_item_2}
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
export default Footer;
