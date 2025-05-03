import Link from "next/link";

const Header = ({ title, linkHref, linkTitle }) => {
  return (
    <div className="flex justify-between items-center pb-0 xl:pl-2 md:p-2 pl-3 p-4">
      <h1 className="md:text-2xl text-xl md:left-0 right-1 font-bold relative inline-block pb-2">
        {title}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
      </h1>
      <Link
        href={linkHref}
        className="inline-flex items-center space-x-2 text-purple-400 px-4 py-2 transition duration-300 hover:text-purple-600"
      >
        <span className="md:text-base text-sm">{linkTitle}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="md:w-5 md:h-5 w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-5.72-5.72a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  );
};

export default Header;
