export function Badge({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}
