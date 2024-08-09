import React from "react";
import Popper from "popper.js";

const Dropdown = ({ color }) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start"
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  // bg colors
  let bgColor;
  color === "white"
    ? (bgColor = "bg-gray-800")
    : (bgColor = "bg-" + color + "-500");
  return (
    <>
      <div className="flex flex-wrap h-full w-full">
        <div className="w-full h-full">
          <div className="relative">
            <button
              className={
                "bg-gray-50 py-2.5 border border-gray-300 rounded-lg font-bold uppercase text-sm px-6 mt-1 outline-none focus:outline-none ml-0 mr-1 mb-1 " +
                bgColor
              }
              style={{ transition: "all .15s ease" }}
              type="button"
              ref={btnDropdownRef}
              onClick={() => {
                dropdownPopoverShow
                  ? closeDropdownPopover()
                  : openDropdownPopover();
              }}
            >
              Enterprise
            </button>
            <div
              ref={popoverDropdownRef}
              className={
                (dropdownPopoverShow ? "block " : "hidden ") +
                (color === "white" ? "bg-white " : bgColor + " ") +
                "text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1"
              }
              style={{ minWidth: "12rem" }}
            >
              <a
                href="#pablo"
                className={
                  "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent"
                }
                onClick={(e) => e.preventDefault()}
              >
                Enterprise
              </a>
              <a
                href="#pablo"
                className={
                  "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent"
                }
                onClick={(e) => e.preventDefault()}
              >
                
              </a>
              <a
                href="#pablo"
                className={
                  "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800"
                }
                onClick={(e) => e.preventDefault()}
              >
                Something else here
              </a>
              <div className="h-0 my-2 border border-solid border-t-0 border-gray-900 opacity-25" />
              <a
                href="#pablo"
                className={
                  "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent"
                }
                onClick={(e) => e.preventDefault()}
              >
                Seprated link
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function DropdownRender() {
  return (
    <>
      <Dropdown color="orange" />
    </>
  );
}
