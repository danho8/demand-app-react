import { logoutAction } from "../redux/authSilce";

export const logoutHandle = async (dispatch) => {
    dispatch(logoutAction())
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.setItremoveItemem('isLogin');
}