import { PropsWithChildren } from "react";

interface CardProps {
  className?: string;
}

const Card = (props: PropsWithChildren<CardProps>) => {
  const { className, children } = props;

  const styles = className ? className : "";
  const hasBg = styles.includes("bg");

  return (
    <div
      className={`card mt-12 mx-auto p-8 relative ${!hasBg && "bg-white"} ${styles}`}
    >
      {children}
    </div>
  );
};

export default Card;
