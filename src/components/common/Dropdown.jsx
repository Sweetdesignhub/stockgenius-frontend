import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Dropdown({ selectedOption, handleOptionSelect }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div style={{ boxShadow: "0px 9px 20px 0px #0000000F" }}>
        <MenuButton className="flex w-full justify-between rounded-md bg-white px-3 py-[9.1px] text-sm text-[#979797E5] font-[poppins] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {selectedOption || "Select Broker"}
          <ChevronDownIcon
            className="-mr-1 h-5 text-gray-400"
            aria-hidden="true"
          />
        </MenuButton>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md font-[poppins] bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <MenuItem>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => handleOptionSelect("Fyers")}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } block px-4 py-2 text-sm w-full`}
                >
                  Fyers
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => handleOptionSelect("Zerodha")}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } block px-4 py-2 text-sm w-full`}
                >
                  Zerodha
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => handleOptionSelect("Motilal Oswal")}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } block px-4 py-2 text-sm w-full`}
                >
                  Motilal Oswal
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
