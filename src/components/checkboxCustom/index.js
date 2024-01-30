import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { Controller } from "react-hook-form";
const cx = classNames.bind(styles);

const CheckBoxCustom = ({ control, name, value, onChange, text}) => {
  return (
    <div className={cx('container_checkbox')}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange }}) => (
          <>
            <input
              type="checkbox"
              className={cx("checkbox")}
              value={value}
              onChange={(e) => {
                onChange(e.target.checked);
              }}
              checked={value}
            />
          </>
        )}
      />
      <p className={cx("text_checkbox")}>{text}</p>
    </div>
  );
};

export default CheckBoxCustom;
