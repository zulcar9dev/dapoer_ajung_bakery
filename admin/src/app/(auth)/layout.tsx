export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F0E8] via-[#FFF8DC] to-[#F5F0E8] px-4">
      {children}
    </div>
  );
}
