// src/components/Navbar.jsx
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Navbar as MTNavbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "@/assets/logo-v3loz.svg";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";
import AuthService from "@/services/authService";

export function Navbar({ brandName, routes, action }) {
  const [openNav, setOpenNav] = React.useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.info);

  React.useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleLogout = () => {
    dispatch(clearUser());
    AuthService.logout();
  };

  const filteredRoutes = routes.filter(({ name }) => {
    if (!user) {
      // não logado: só remove o link de Entrar
      return name.toLowerCase() !== "entrar";
    }
    // logado: remove Entrar e Cadastrar‑se
    return !["entrar", "cadastrar-se"].includes(name.toLowerCase());
  });

  const actionElement = user ? (
    <Button variant="gradient" size="sm" onClick={handleLogout}>
      Sair
    </Button>
  ) : (
    action
  );

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {filteredRoutes.map(({ name, path, icon, href, target }) => (
        <Typography
          key={name}
          as="li"
          variant="small"
          color="inherit"
          className="capitalize"
        >
          {href ? (
            <a
              href={href}
              target={target}
              className="flex items-center gap-1 p-1 font-bold"
            >
              {icon &&
                React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
              {name}
            </a>
          ) : (
            <Link
              to={path}
              target={target}
              className="flex items-center gap-1 p-1 font-bold"
            >
              {icon &&
                React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
              {name}
            </Link>
          )}
        </Typography>
      ))}
    </ul>
  );

  return (
    <MTNavbar color="transparent" className="p-3">
      <div className="container mx-auto flex items-center justify-between text-white">
        <Link to="/" className="flex items-center mr-4 ml-2 cursor-pointer">
          <img src={logo} alt="V3LOZ Academy" className="h-8 w-auto mr-2" />
          <Typography variant="h6" className="font-bold">
            {brandName}
          </Typography>
        </Link>

        {/* desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {navList}
          {actionElement}
        </div>

        {/* mobile hamburger */}
        <IconButton
          variant="text"
          size="sm"
          color="white"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      {/* mobile menu */}
      <MobileNav
        className="rounded-xl bg-white px-4 pt-2 pb-4 text-blue-gray-900"
        open={openNav}
      >
        <div className="container mx-auto">
          {navList}
          <div className="mt-4">{actionElement}</div>
        </div>
      </MobileNav>
    </MTNavbar>
  );
}

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.node,
};

Navbar.defaultProps = {
  brandName: "V3LOZ Academy",
  action: (
    <Link to="/sign-in">
      <Button variant="gradient" size="sm">
        Entrar
      </Button>
    </Link>
  ),
};

export default Navbar;
