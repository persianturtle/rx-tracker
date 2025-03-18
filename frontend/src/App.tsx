import { useState } from "react";
import { css } from "@emotion/css";
import HamburgerIcon from "@img/hamburger.svg";
import ArrowIcon from "@img/arrow.svg";

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div
      className={wrapper(isNavOpen)}
      onClick={() => {
        if (isNavOpen) {
          setIsNavOpen(false);
        }
      }}
    >
      <header className={header}>
        <button onClick={() => setIsNavOpen(!isNavOpen)}>
          <HamburgerIcon />
        </button>
        <h1>RxTracker</h1>
      </header>
      <nav
        className={nav(isNavOpen)}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <button onClick={() => setIsNavOpen(false)}>
            <ArrowIcon /> Home
          </button>
          <div
            className={css`
              margin-top: auto;
              padding: 0 15px;

              select {
                width: 100%;
                padding: 5px;
                font-size: 16px;
            `}
          >
            <p>Logged in as:</p>
            <select>
              <option value="zAVMbyhsmj9dAJ9USwijrIdsfng9HWQ7yXYpWfb0">
                Caregiver 1
              </option>
              <option value="Ld6nYabJTJ13Qil6nwJBk8qrA2hUVaN52OboRJgZ">
                Caregiver 2
              </option>
            </select>
          </div>
        </header>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
      <main></main>
      <footer></footer>
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

const header = css`
  display: flex;
  align-items: center;
  width: 100vw;
  height: 60px;
  background-color: dodgerblue;
  color: white;
  box-shadow: 0 4px 5px 0 rgba(15, 74, 133, 0.14),
    0 2px 9px 1px rgba(15, 74, 133, 0.12), 0 4px 2px -2px rgba(15, 74, 133, 0.2);

  > button {
    appearance: none;
    border: none;
    background: none;
    display: flex;
    align-items: center;
    width: 60px;
    height: 100%;
    padding: 0 10px;
    cursor: pointer;

    > svg {
      width: 100%;
      height: 100%;
    }
  }

  > h1 {
    font-size: 26px;
    line-height: 26px;
    margin-left: 10px;
  }
`;

const nav = (isNavOpen: boolean) => css`
  transition: transform 450ms cubic-bezier(0.23, 1, 0.32, 1);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: white;
  box-shadow: 0px 3px 10px 0 rgba(0, 0, 0, 0.16),
    0px 3px 10px 0 rgba(0, 0, 0, 0.23);
  overflow: auto;
  z-index: 2;
  visibility: ${isNavOpen ? "visible" : "hidden"};

  transform: ${isNavOpen ? "translateX(0)" : "translateX(calc(-100% - 10px))"};

  > header {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: lavender;
    height: 150px;
    padding: 15px 0;

    > button {
      appearance: none;
      border: none;
      background: none;
      font-size: 24px;
      color: inherit;
      line-height: 24px;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      height: 40px;
      padding: 10px 20px;
      cursor: pointer;

      > svg {
        width: 20px;
        height: 20px;
        margin-right: 20px;
      }
    }
  }

  > label {
    font-weight: normal;
    font-size: 12px;
    line-height: 24px;
    text-transform: uppercase;
    display: block;
    background-color: rgba(0, 0, 0, 0.32);
    color: white;
    padding: 0 15px;
  }

  > ul {
    margin: 0;
    padding: 0;
    list-style: none;

    > li {
      position: relative;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);

      svg {
        position: absolute;
        top: 0;
        right: 15px;
        bottom: 0;
        margin: auto;
        width: 15px;
        height: 15px;
      }

      > a {
        transition: background-color 450ms cubic-bezier(0.23, 1, 0.32, 1);
        font-size: 18px;
        line-height: 54px;
        text-decoration: none;
        display: block;
        padding: 0 15px;
        color: black;

        &.active {
          background-color: #e9e9e9;
        }
      }

      > img {
        width: 15px;
        height: 15px;
      }
    }
  }

  @media (max-width: 767px) {
    width: 85vw;
  }

  @media (min-width: 768px) {
    width: 300px;
  }
`;
