const Header3 = ({ title }) => {
  return (
    <div className="flex justify-between items-center pl-0 md:pl-4 p-4">
      <h1 className="md:text-2xl text-lg md:left-2 right-0 font-bold relative inline-block ">
        {title}
      </h1>
    </div>
  );
};

export default Header3;
