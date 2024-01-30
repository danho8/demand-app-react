import { Navigate, redirect, Route, Routes } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';
import MainLayout from './layouts/mainLayout';
import { Fragment, useEffect, useState } from 'react';
import { SubStrings } from './constants';
import LoginLayout from './layouts/loginLayout/LoginLayout';
import LoginComponent from './components/loginComponent';
import RegisterComponent from './components/registerComponent';
import AuthenLayout from './components/AuthenLayout';
import RequiredAuth from './components/requiredAuth';
import IndexPage from './pages/indexPage';
import HeaderComponent from './components/headerComponent';
import Footer from './components/footer';
import ProfileComponent from './components/profileComponent';
import NotFound from './components/notFound';
import RequiredInformation from './components/requiredInformation';
import ViewDemand from './layouts/demandComponent';
import PostDemandComponent from './components/postDemandComponent';
import UserInformation from './layouts/usersInformation';
import PostUsersComponent from './components/postUsersComponent';
import IsManager from './components/IsManager';
import IsAdmin from './components/IsAdmin';
import ContactDetail from './components/contactDetail';
import SignInLayout from './layouts/signInLayout';
import SuspendedNoti from './components/suspendedNotify';
import CheckSuspend from './components/checkSuspend';
import Settings from './components/settings';

function App() {   
	document.title = 'Statutory Demand';
	return (
		<Routes>
			<Route
				path="/"
				element={<AuthenLayout />}
			>
				{/* public router */}
				<Route
					path={SubStrings.path.signIn}
					element={
						<SignInLayout
							Header={<HeaderComponent />}
							Page={<LoginComponent />}
							Footer={<Footer />}
						/>
					}
				/>
				<Route
					path={SubStrings.path.signUp}
					element={
						<SignInLayout
							Header={<HeaderComponent />}
							Page={<RegisterComponent />}
							Footer={<Footer />}
						/>
					}
				/>

				{/* private router */}
				<Route
					path={SubStrings.path.goBack}
					element={
						<MainLayout
							Header={<HeaderComponent />}
							Page={<IndexPage />}
							Footer={<Footer />}
						/>
					}
				/>
				<Route element={<RequiredAuth />}>
					<Route element={<RequiredInformation />}>
						<Route
							path={SubStrings.path.viewDemand}
							element={
								<MainLayout
									Header={<HeaderComponent />}
									Page={<ViewDemand />}
									Footer={<Footer />}
								/>
							}
						/>
					</Route>
				</Route>
				<Route element={<RequiredAuth />}>
					<Route element={<RequiredInformation />}>
						<Route
							path={SubStrings.path.settings}
							element={
								<MainLayout
									Header={<HeaderComponent />}
									Page={<Settings />}
									Footer={<Footer />}
								/>
							}
						/>
					</Route>
				</Route>
				<Route element={<RequiredAuth />}>
					<Route element={<RequiredInformation />}>
						<Route
							path={SubStrings.path.contactDetails}
							element={
								<MainLayout
									Header={<HeaderComponent />}
									Page={<ContactDetail />}
									Footer={<Footer />}
								/>
							}
						/>
					</Route>
				</Route>
				<Route element={<RequiredAuth />}>
					<Route element={<CheckSuspend />}>
						<Route element={<RequiredInformation />}>
							<Route
								path={SubStrings.path.postDemand}
								element={
									<MainLayout
										Header={<HeaderComponent />}
										Page={<PostDemandComponent />}
										Footer={<Footer />}
									/>
								}
							/>
						</Route>
					</Route>
				</Route>
				<Route element={<RequiredAuth />}>
					<Route
						path="/notification"
						element={<SuspendedNoti />}
					/>
				</Route>
				<Route element={<RequiredAuth />}>
					<Route element={<RequiredInformation />}>
						<Route element={<IsManager />}>
							<Route
								path={SubStrings.path.users}
								element={ 
									<MainLayout
										Header={<HeaderComponent />}
		 								Page={<UserInformation />}
										Footer={<Footer />}
									/>
								}
							/>
						</Route>
					</Route>
				</Route>
				<Route element={<RequiredAuth />}>
					<Route element={<RequiredInformation />}>
						<Route element={<IsAdmin />}>
							<Route
								path={SubStrings.path.createUser}
								element={
									<MainLayout
										Header={<HeaderComponent />}
										Page={<PostUsersComponent />}
										Footer={<Footer />}
									/>
								}
							/>
						</Route>
					</Route>
				</Route>
				<Route element={<RequiredAuth />}>
					<Route
						path={SubStrings.path.profile}
						element={
							<MainLayout
								Header={<HeaderComponent />}
								Page={<ProfileComponent />}
								Footer={<Footer />}
							/>
						}
					/>
				</Route>
				{/* notfound */}
				<Route
					path="*"
					element={<NotFound />}
				/>
			</Route>
		</Routes>
	);
}

export default App;

{
	/* {privateRoutes.map((route, index) => {
	const Header = route.header && route.header !== null ? route.header : Fragment;
	const Page = route.page && route.page !== null ? route.page : Fragment;
	const Footer = route.footer && route.footer !== null ? route.footer : Fragment;

	return (
		<Route
			key={index}
			path={route.path}
			element={
				route.path === SubStrings.path.signIn ? (
					<LoginLayout Children={<LoginComponent />} />
				) : route.path === SubStrings.path.signUp ? (
					<LoginLayout Children={<RegisterComponent />} />
				) : (
					<MainLayout
						Header={<Header />}
						Page={<Page />}
						Footer={<Footer />}
					></MainLayout>
				)
			}
		/>
	);
})} */
}
