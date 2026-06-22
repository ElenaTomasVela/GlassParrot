export function H1({ children }: { readonly children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold text-balance mb-2">{children}</h1>;
}

export function H2({ children }: { readonly children: React.ReactNode }) {
  return (
    <h1 className="text-xl font-semibold text-balance mb-2">{children}</h1>
  );
}
