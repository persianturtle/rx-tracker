import { css } from "@emotion/css";
import useStore from "@store";
import Nav from "@components/Nav";
import { Outlet } from "react-router";

export default function App() {
  const [isNavOpen, setStore] = useStore((store) => store.isNavOpen);

  return (
    <div
      className={wrapper(isNavOpen)}
      onClick={() => {
        if (isNavOpen) {
          setStore({ isNavOpen: false });
        }
      }}
    >
      <Nav />
      <Outlet />
    </div>
  );
}

const wrapper = (isNavOpen: boolean) => css`
  min-height: 100vh;

  &::after {
    content: "";
    transition: opacity 450ms cubic-bezier(0.23, 1, 0.32, 1),
      transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.33);
    transform: translateX(-100%);
    opacity: 0;
    z-index: 1;

    ${isNavOpen
      ? `
      transition: opacity 450ms cubic-bezier(0.23, 1, 0.32, 1);
      transform: translateX(0%);
      opacity: 1;
    `
      : ""}
  }
`;
