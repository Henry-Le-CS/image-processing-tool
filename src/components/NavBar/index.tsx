'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../../../public/HCMUT_official_logo.ico';
import { Button } from 'antd';

const navItems = [
  {
    path: '/',
    name: 'Home',
  },
  {
    path: '/labelling',
    name: 'Labelling',
  },
  // {
  //   path: '/cameras',
  //   name: 'Cameras',
  // },
  {
    path: '/live',
    name: 'Live',
  },
];

const NavBar = () => {
  const pathname = usePathname() || '/';
  console.log(pathname);
  return (
    <div className="flex bg-blue-100 p-2 items-center justify-between gap-2 relative">
      <div className="flex gap-2 items-center mr-3 invisible sm:visible">
        <Image
          src={Logo}
          alt="HCMUT Logo"
          className="w-[24px] md:w-[48px] aspect-square"
        />
        <h1 className="whitespace-nowrap font-bold text-blue-700 ">
          HCMUT TrafficView
        </h1>
      </div>
      <nav className=" flex gap-2 absolute items-center justify-center w-full">
        {navItems.map(({ path, name }) => {
          const isActive = path === pathname;
          return (
            <Link key={path} href={path}>
              {/* <span>{name}</span> */}
              <Button
                className={`font-bold px-2 py-1 ${isActive
                  ? ' text-white'
                  : '!bg-blue-100 text-blue-600 border-blue-600'
                  }`}
              >
                {name}
              </Button>
            </Link>
          );
        })}
      </nav>
      {/* <Button>Placeholder</Button> */}
    </div>
  );
};

export default NavBar;
