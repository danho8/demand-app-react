import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { Text } from "../../constants";

const cx = classNames.bind(styles);

function NoData({ colSpan }) {
    return (
        <tbody>
            <tr>
                <td colSpan={colSpan} className={cx("emptyData")}>
                    {Text.noData}
                </td>
            </tr>
        </tbody>
    );
}

export default NoData;
