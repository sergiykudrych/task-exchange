import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <Link className="footer__link" href="/support">
        Служба поддержки
      </Link>
    </footer>
  );
};

export default Footer;
