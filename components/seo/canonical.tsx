"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";

export function CanonicalUrl() {
  const pathname = usePathname();
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const canonicalUrl = `${domain}${pathname}`;

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
