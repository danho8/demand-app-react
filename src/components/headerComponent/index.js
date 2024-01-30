import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { header_text } from '../../constants/text';
import { AiOutlineClose, AiOutlineMenu, AiOutlineLogout } from 'react-icons/ai';
import { SubStrings, Text } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../../redux/authSilce';
import { resetDataLogout } from '../../redux/userSlice';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function HeaderComponent() {
	const [isSidebar, setIsSidebar] = useState(false);
	const [role] = useState(localStorage.getItem('role'));
	const [hasToken, setHasToken] = useState(localStorage.getItem('token'));
	const [status, setStatus] = useState(localStorage.getItem('status'));
	const divRef = useRef(null);
	const dispatch = useDispatch();
	const location = useLocation();
	const { pathname, search, hash } = location;
	useEffect(() => {
		function handleClickOutside(event) {
			if (divRef.current && !divRef.current.contains(event.target)) setIsSidebar(false);
		}
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [divRef]);

	useEffect(() => {
		if (pathname === '/sign-in' || pathname === '/sign-up') {
			setHasToken(null);
		}
	}, [pathname]);

	const handleLogout = () => {
		dispatch(logoutAction());
		dispatch(resetDataLogout());
	};

	return (
		<div className={cx('header-container')}>
			<div className={cx('header-left')}>
				<div className={cx('logo')}>
					<Link to={SubStrings.path.goBack}>
						<img
							src={SubStrings.path.imgs.logo}
							alt={Text.logo}
						/>
					</Link>
				</div>
			</div>
			{isSidebar &&
				(hasToken && hasToken !== '' ? (
					<div className={cx('side-bar-mobile')}>
						<div
							className={cx('box-content-sidebar')}
							ref={divRef}
						>
							{/* <AiOutlineClose
							onClick={() => setIsSidebar(false)}
							className={cx('close-sidebar')}
						/> */}
							<ul className={cx('list-menu-mobile')}>
								<Link
									onClick={() => setIsSidebar(false)}
									to="/"
								>
									<li className={cx('item-menu-mobile')}>{header_text.homePage}</li>
								</Link>
								{role !== '0' && (
									<Link
										onClick={() => setIsSidebar(false)}
										to="/users"
									>
										<li className={cx('item-menu-mobile')}>{header_text.users}</li>
									</Link>
								)}
								{role === '2' && (
									<Link
										onClick={() => setIsSidebar(false)}
										to="/create-user"
									>
										<li className={cx('item-menu-mobile')}>{header_text.createUser}</li>
									</Link>
								)}
								{status !== '0' && (
									<Link
										onClick={() => setIsSidebar(false)}
										to="/post-demand"
									>
										<li className={cx('item-menu-mobile')}>{header_text.post_demand}</li>
									</Link>
								)}
								<Link
									onClick={() => setIsSidebar(false)}
									to="/"
								>
									<li className={cx('item-menu-mobile')}>{header_text.contact_details}</li>
								</Link>
								<Link
									onClick={() => setIsSidebar(false)}
									to="/profile"
								>
									<li className={cx('item-menu-mobile')}>{header_text.edit_profile}</li>
								</Link>
								<Link
									onClick={() => setIsSidebar(false)}
									to="/view-my-demands"
								>
									<li className={cx('item-menu-mobile')}>{header_text.view_my_demands}</li>
								</Link>
								{role > 0 && (
									<Link
										onClick={() => setIsSidebar(false)}
										to={SubStrings.path.settings}
									>
										<li className={cx('item-menu-mobile')}>{header_text.settings}</li>
									</Link>
								)}
								<Link
									onClick={handleLogout}
									to="/sign-in"
								>
									<li className={cx('item-menu-mobile')}>{header_text.logout}</li>
								</Link>
							</ul>
						</div>
					</div>
				) : (
					<div className={cx('side-bar-mobile')}>
						<div
							className={cx('box-content-sidebar')}
							ref={divRef}
						>
							{/* <AiOutlineClose
							onClick={() => setIsSidebar(false)}
							className={cx('close-sidebar')}
						/> */}
							<ul className={cx('list-menu-mobile')}>
								<Link
									onClick={() => setIsSidebar(false)}
									to="/sign-in"
								>
									<li className={cx('item-menu-mobile')}>Sign In</li>
								</Link>
								<Link
									onClick={() => setIsSidebar(false)}
									to="/sign-up"
								>
									<li className={cx('item-menu-mobile')}>Sign Up</li>
								</Link>
							</ul>
						</div>
					</div>
				))}
			{hasToken && hasToken !== '' ? (
				<div className={cx('header-right')}>
					{role !== '0' && (
						<Link
							className={
								pathname === '/users' ? cx('header-post-demand', 'active') : cx('header-post-demand')
							}
							to="/users"
						>
							<div>{header_text.users}</div>
						</Link>
					)}

					{role === '2' && (
						<Link
							className={
								pathname === '/create-user'
									? cx('header-post-demand', 'active')
									: cx('header-post-demand')
							}
							to="/create-user"
						>
							<div>{header_text.createUser}</div>
						</Link>
					)}
					{status !== '0' && (
						<Link
							className={
								pathname === SubStrings.path.postDemand
									? cx('header-post-demand', 'active')
									: cx('header-post-demand')
							}
							to={SubStrings.path.postDemand}
						>
							<div>{header_text.post_demand}</div>
						</Link>
					)}

					<Link
						className={
							pathname === SubStrings.path.contactDetails
								? cx('header-post-demand', 'active')
								: cx('header-post-demand')
						}
						to={SubStrings.path.contactDetails}
					>
						<div>{header_text.contact_details}</div>
					</Link>
					<Link
						className={
							pathname === SubStrings.path.profile
								? cx('header-post-demand', 'active')
								: cx('header-post-demand')
						}
						to={SubStrings.path.profile}
					>
						<div>{header_text.edit_profile}</div>
					</Link>

					<Link
						className={
							pathname === SubStrings.path.viewDemand
								? cx('header-post-demand', 'active')
								: cx('header-post-demand')
						}
						to={SubStrings.path.viewDemand}
					>
						<div>{header_text.view_my_demands}</div>
					</Link>

					{role > 0 && (
						<Link
							className={
								pathname === SubStrings.path.settings
									? cx('header-post-demand', 'active')
									: cx('header-post-demand')
							}
							to={SubStrings.path.settings}
						>
							{header_text.settings}
						</Link>
					)}

					<AiOutlineMenu
						onClick={() => setIsSidebar(true)}
						className={cx('memu-mobile')}
					/>
					<Link
						className={cx('logout')}
						onClick={handleLogout}
						to={SubStrings.path.signIn}
					>
						<div>
							<AiOutlineLogout className={cx('icon-logout')} />
						</div>
					</Link>
				</div>
			) : (
				<div className={cx('header-right')}>
					<Link
						className={
							pathname === '/sign-in' ? cx('header-post-demand', 'active') : cx('header-post-demand')
						}
						to="/sign-in"
					>
						<div>Sign In</div>
					</Link>
					<Link
						className={
							pathname === '/sign-up' ? cx('header-post-demand', 'active') : cx('header-post-demand')
						}
						to="/sign-up"
					>
						<div>Sign Up</div>
					</Link>
					<AiOutlineMenu
						onClick={() => setIsSidebar(true)}
						className={cx('memu-mobile')}
					/>
				</div>
			)}
		</div>
	);
}

export default HeaderComponent;
