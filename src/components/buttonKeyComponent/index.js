import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
const cx = classNames.bind(styles);
const ButtonKeyComponent = ({ text, onClick }) => {
  return (
    <div className={cx("container_bnt_key")}>
      <button className={cx("wrap_btn")} onClick={onClick}>
        <span className={cx("btn_key")}>{text}</span>
      </button>
    </div>
  );
};

export default ButtonKeyComponent;
