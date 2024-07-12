/** @jsxRuntime classic */
/** @jsx jsx */

import { H3, jsx } from '@keystone-ui/core'
import Link from 'next/link'


export const CustomLogo = () => {
  return (
    <H3>
      <Link
        href="/"
        css={{
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        Marta Góngora CMS
      </Link>
    </H3>
  )
}