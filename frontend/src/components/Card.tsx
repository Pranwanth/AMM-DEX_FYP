import { PropsWithChildren } from 'react'

interface CardProps {
  className?: string
}

const Card = (props: PropsWithChildren<CardProps>) => {
  const { className, children } = props

  const styles = className ? className : ""

  return (
    <div className={`card mt-12 mx-auto p-8 relative bg-white ${styles}`}>
      {children}
    </div>
  )
}

export default Card