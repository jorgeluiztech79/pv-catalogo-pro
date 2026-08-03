import "./Button.css";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  loadingText = "Carregando...",
  className = "",
  onClick,
  ariaLabel,
  title,
  ...rest
}) {
  const isDisabled = disabled || loading;

  const buttonClasses = [
    "pv-button",
    `pv-button--${variant}`,
    `pv-button--${size}`,
    fullWidth ? "pv-button--full-width" : "",
    loading ? "pv-button--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  function handleClick(event) {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    if (typeof onClick === "function") {
      onClick(event);
    }
  }

  return (
    <button
      {...rest}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-label={ariaLabel}
      title={title}
      onClick={handleClick}
    >
      {loading ? (
        <>
          <span className="pv-button__spinner" aria-hidden="true" />

          <span className="pv-button__content">{loadingText}</span>
        </>
      ) : (
        <>
          {iconLeft && (
            <span
              className="pv-button__icon pv-button__icon--left"
              aria-hidden="true"
            >
              {iconLeft}
            </span>
          )}

          <span className="pv-button__content">{children}</span>

          {iconRight && (
            <span
              className="pv-button__icon pv-button__icon--right"
              aria-hidden="true"
            >
              {iconRight}
            </span>
          )}
        </>
      )}
    </button>
  );
}

export default Button;