import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function RequiredInformation() {
	const [businessNameLocal, setBusinessNameLocal] = useState(localStorage.getItem('business_name'));
	const [contactNameLocal, setContactNameLocal] = useState(localStorage.getItem('contact_name'));
	const [contactNumberLocal, setContactNumberLocal] = useState(localStorage.getItem('contact_number'));
	const [contactEmailLocal, setContactEmailLocal] = useState(localStorage.getItem('contact_email'));
	const location = useLocation();

	return businessNameLocal &&
		businessNameLocal !== '' &&
		businessNameLocal !== 'null' &&
		contactNameLocal &&
		contactNameLocal !== '' &&
		contactNameLocal !== 'null' &&
		contactNumberLocal &&
		contactNumberLocal !== '' &&
		contactNumberLocal !== 'null' &&
		contactEmailLocal &&
		contactEmailLocal !== '' &&
		contactEmailLocal !== 'null' ? (
		<Outlet />
	) : (
		<Navigate
			to="/profile"
			state={{ from: location }}
			replace
		/>
	);
}

export default RequiredInformation;
