
interface LogoProps {
    size?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }  ) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className={className}
      >
        <circle cx="50" cy="50" r="50" fill="#4F46E5" />
        <path
          d="M50 15L61.1803 35.4508L84.5492 39.0983L67.2746 54.5492L72.3607 77.9017L50 65.4508L27.6393 77.9017L32.7254 54.5492L15.4508 39.0983L38.8197 35.4508L50 15Z"
          fill="white"
        />
      </svg>
    </>
  );
}

export default Logo;