const TopMenu = () => {
  const navItems = [
    "Clients",
    "Providers",
    "Articles",
    "Collections",
    "Payments",
    "inf fact emitidas",
    "inf fact recibidas",
    "Management Docs (clients)",
    "Management Docs (Providers)",
  ];
  return (
    <div className="w-full bg-gray-300 h-14 flex items-center ">
      <ul className="flex text-center justify-center items-center w-full h-full">
        {navItems.map((navItem) => (
          <li className=" w-full h-full text-sm flex items-center justify-center hover:bg-red-700 hover:text-white cursor-pointer">
            {navItem}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopMenu;
