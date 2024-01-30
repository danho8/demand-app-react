
import { Link } from "react-router-dom"
import styles from './index.module.scss'
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

const NotFound = () => {
    return (
        <div style={{background:'url(/images/bg-err.jpg)',backgroundPosition:'center'}} className={cx("wrapper")}>
            <div className={cx("error__message message")}>
                <h1 className={cx("err-number")}>404</h1>
                <h2 className={cx("message__title")}>Page Not Found</h2>
                <div className={cx("error__nav e-nav")}>
                    <Link to="/" className={cx("e-nav__link")}>Visit Our Homepage</Link>
                </div>


            </div>
        </div>
    )
}

export default NotFound