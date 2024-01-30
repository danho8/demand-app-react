
import { Link } from "react-router-dom"
import styles from './index.module.scss'
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

const SuspendedNoti = () => {
    const email = "XXXXXXXXX@XXXXXXXXX.com"

    return (
        <div style={{background:'url(/images/bg-err.jpg)',backgroundPosition:'center'}} className={cx("wrapper")}>
            <div className={cx("error__message message")}>
                <h1 className={cx("err-number")}>403</h1>
                <h2 className={cx("message__title")}>Your account has been suspended, please contact via email <span>{email}</span> for support</h2>
                <div className={cx("error__nav e-nav")}>
                    <Link to="/" className={cx("e-nav__link")}>Go Back To The Home Page</Link>
                </div>
            </div>
        </div>
    )
}

export default SuspendedNoti