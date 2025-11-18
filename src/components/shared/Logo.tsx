import logo1 from '@/assets/logo1.png';
import { Image } from '../base/Image';

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", width, height=70 }  ) => {
  return (
      <Image src={logo1} alt="Logo" className={className} width={width} height={height} />
  );
}

export default Logo;