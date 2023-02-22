type Props = {
  children?: React.ReactNode
}

export const Container = ({ children }: Props) => {
  return <div className="container prose mx-auto px-5">{children}</div>
}

