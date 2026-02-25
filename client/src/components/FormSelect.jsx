
import Select from "react-select";

export default function FormSelect({
  label,
  error,
  options = [],
  value,
  onChange,
  name,
  placeholder = "Select an option",
  ...props
}) {
  // Find the current selected option object
  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Custom styles to match the native Tailwind/Shadcn look
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "0.5rem", // rounded-lg
      backgroundColor: "white",
      borderWidth: "1px",
      // border-input or border-destructive
      borderColor: error ? "#ef4444" : state.isFocused ? "hsl(var(--ring))" : "#e5e7eb",
      // focus:ring-1 focus:ring-ring
      boxShadow: state.isFocused ? (error ? "0 0 0 1px #ef4444" : "0 0 0 1px hsl(var(--ring))") : "none",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        borderColor: error ? "#ef4444" : state.isFocused ? "hsl(var(--ring))" : "#d1d5db",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 0.75rem", // px-3
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280", // text-muted-foreground / text-gray-500
      fontSize: "0.875rem", // text-sm
    }),
    singleValue: (base) => ({
      ...base,
      color: "inherit",
      fontSize: "0.875rem", // text-sm
    }),
    input: (base) => ({
      ...base,
      fontSize: "0.875rem",
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: "#6b7280",
      padding: "0 0.5rem",
      transition: "transform 0.2s",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
      "&:hover": {
        color: "#4b5563",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "0.875rem",
      backgroundColor: state.isSelected
        ? "rgba(0, 0, 0, 0.1)"
        : state.isFocused
          ? "rgba(0, 0, 0, 0.1)"
          : "transparent",
      color: state.isSelected
        ? "#181717ff"
        : "inherit",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    }),
  };

  const handleChange = (selected) => {
    if (onChange) {
      // Mock event for compatibility with existing (e) => setFormData({...formData, key: e.target.value})
      onChange({
        target: {
          name: name,
          value: selected ? selected.value : "",
        },
      });
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <Select
        {...props}
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        isSearchable={true}
        styles={customStyles}
        classNamePrefix="react-select"
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
