import Link, { LinkProps } from 'next/link';
import { cloneElement, ReactElement } from 'react';

interface MyLinkProps extends LinkProps {
  children: ReactElement;
  className: string;
}

export function LinkComponent({
  children,
  className,
  ...rest
}: MyLinkProps): JSX.Element {
  return <Link {...rest}>{cloneElement(children, { className })}</Link>;
}
