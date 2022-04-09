import React from 'react';
import Link from 'next/link';

export default function test() {
  return (
    <>
      <Link href="/" passHref>
        <a style={{ position: 'fixed', bottom: 0, left: 0, fontSize: '14px' }}>Back to landing</a>
      </Link>
    </>
  );
}
