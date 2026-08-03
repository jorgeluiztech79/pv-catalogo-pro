import { forwardRef, useId } from "react";

import "./Input.css";

const Input = forwardRef(function Input(
  {
    id,
    name,
    label,
    type = "text",
    value,
    defaultValue,
    placeholder = "",
    helperText = "",
    error = "",
    success = "",
    required = false,
    disabled = false,
    readOnly = false,
    fullWidth = true,
    size = "md",
    iconLeft = null,
    iconRight = null,
    className = "",
    inputClassName = "",
    onChange,
    onBlur,
    onFocus,
    autoComplete,
    min,
    max,
    step,
    maxLength,
    ariaLabel,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || `pv-input-${generatedId}`;

  const message = error || success || helperText;

  const messageId = message
    ? `${inputId}-message`
    : undefined;

  const containerClasses = [
    "pv-input",
    `pv-input--${size}`,
    fullWidth ? "pv-input--full-width" : "",
    error ? "pv-input--error" : "",
    success && !error ? "pv-input--success" : "",
    disabled ? "pv-input--disabled" : "",
    readOnly ? "pv-input--readonly" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const fieldClasses = [
    "pv-input__field",
    iconLeft ? "pv-input__field--with-left-icon" : "",
    iconRight ? "pv-input__field--with-right-icon" : "",
    inputClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {label && (
        <label
          className="pv-input__label"
          htmlFor={inputId}
        >
          {label}

          {required && (
            <span
              className="pv-input__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="pv-input__control">
        {iconLeft && (
          <span
            className="pv-input__icon pv-input__icon--left"
            aria-hidden="true"
          >
            {iconLeft}
          </span>
        )}

        <input
          {...rest}
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          className={fieldClasses}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
          aria-label={ariaLabel}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
        />

        {iconRight && (
          <span
            className="pv-input__icon pv-input__icon--right"
            aria-hidden="true"
          >
            {iconRight}
          </span>
        )}
      </div>

      {message && (
        <span
          id={messageId}
          className="pv-input__message"
        >
          {message}
        </span>
      )}
    </div>
  );
});

export default Input;