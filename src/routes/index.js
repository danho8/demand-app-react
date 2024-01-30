import HeaderComponent from '../components/headerComponent';
import IndexPage from '../pages/indexPage';
import Footer from '../components/footer';
import { SubStrings } from '../constants';
import LoginComponent from '../components/loginComponent';
import RegisterComponent from '../components/registerComponent';
import ProfileComponent from '../components/profileComponent';
import LoginLayout from '../layouts/loginLayout/LoginLayout';
import PostDemandComponent from '../components/postDemandComponent';
import ViewDemand from '../layouts/demandComponent';
import UsersInformation from '../layouts/usersInformation';
import PostUsersComponent from '../components/postUsersComponent';
import ContactDetail from '../components/contactDetail';

const publicRoutes = [
	{ path: SubStrings.path.signIn, page: LoginComponent },
	{ path: SubStrings.path.signUp, page: RegisterComponent },
];

const privateRoutes = [
	{
		path: SubStrings.path.indexPage,
		header: HeaderComponent,
		page: IndexPage,
		footer: Footer,
	},
	{
		path: SubStrings.path.profile,
		header: HeaderComponent,
		page: ProfileComponent,
	},
	{
		path: SubStrings.path.postDemand,
		header: HeaderComponent,
		page: PostDemandComponent,
		footer: Footer,
	},
	{
		path: SubStrings.path.postUsers,
		header: HeaderComponent,
		page: PostUsersComponent,
		footer: Footer,
	},
	{
		path: SubStrings.path.users,
		header: HeaderComponent,
		page: UsersInformation,
		footer: Footer,
	},
	{
		path: SubStrings.path.contactDetails,
		header: HeaderComponent,
		page: ContactDetail,
		footer: Footer,
	},
	{ path: SubStrings.path.viewDemand, header: HeaderComponent, page: ViewDemand, footer: Footer },
	{ path: SubStrings.path.signIn, page: LoginLayout },
	{ path: SubStrings.path.signUp, page: RegisterComponent },
];

export { publicRoutes, privateRoutes };
