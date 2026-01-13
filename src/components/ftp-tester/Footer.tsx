"use client";

export function Footer() {
  return (
    <div className="text-center text-muted-foreground text-sm mt-12 pb-8">
      <p>
        © {new Date().getFullYear()} BDIX FTP Tester • Made for the community
      </p>
    </div>
  );
}
