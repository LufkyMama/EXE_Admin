export default function Button({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium bg-white hover:bg-slate-50 ${className}`}
      {...props}
    />
  );
}
