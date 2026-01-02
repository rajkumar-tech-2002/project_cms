export default function FormInput({
  label,
  error,
  helper,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
          error
            ? "border-destructive focus:ring-destructive"
            : "border-input focus:border-ring"
        }`}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}
