import { Image, ImageProps } from "./Image";
// import logo from "@/assets/newLogo.png";
import logo from "@/assets/Logo.svg";

interface LogoProps extends Omit<ImageProps, "src" | "alt"> {}

const Logo = (props: LogoProps) => {
  return <Image src={logo} alt="Aavak" height={props.height || 100} {...props} />;
};

export default Logo;
