const HeaderMenu = ({ title }) => {
  return (
    <div className="flex justify-center items-center  mt-20 pb-0 xl:pl-2 md:p-2 pl-3 p-4">
      <h1 className="md:text-2xl text-xl md:left-0 right-1 font-bold relative inline-block pb-2">
        {title}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
      </h1>
    </div>
  );
};

export default HeaderMenu;
