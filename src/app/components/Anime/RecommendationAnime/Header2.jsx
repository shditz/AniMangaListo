const Header2 = ({ title }) => {
  return (
    <div className="flex justify-between items-center pl-0 md:pl-4 p-4">
      <h1 className="md:text-2xl text-lg md:left-2 right-0 font-bold relative inline-block pb-2">
        {title}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
      </h1>
    </div>
  );
};

export default Header2;
