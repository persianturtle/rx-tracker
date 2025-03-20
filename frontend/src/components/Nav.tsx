import { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import useStore from "@store";
import { css } from "@emotion/css";
import HamburgerIcon from "@img/hamburger.svg";
import ArrowIcon from "@img/arrow.svg";

export default function Nav() {
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isNavOpen, setStore] = useStore((store) => store.isNavOpen);
  const [loggedInAs] = useStore((store) => store.loggedInAs);
  const [caregiverId] = useStore((store) => store.caregiverId);
  const [recipients] = useStore((store) => store.recipients);

  useEffect(() => {
    if (isNavOpen) {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }
  }, [isNavOpen]);

  return (
    <>
      <header className={header}>
        <button
          ref={openButtonRef}
          onClick={() => setStore({ isNavOpen: !isNavOpen })}
          tabIndex={isNavOpen ? -1 : 0}
        >
          <HamburgerIcon />
        </button>
        <h1>RxTracker</h1>
      </header>
      <nav
        className={nav(isNavOpen)}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <button
            ref={closeButtonRef}
            onClick={() => setStore({ isNavOpen: false })}
          >
            <ArrowIcon /> Home
          </button>
          <div className={div}>
            <p>Logged in as:</p>
            <select
              onChange={(event) => {
                const caregiverId = Number(
                  event.target.value.replace(/\D+/, "")
                );

                // Using a full page reload since, for some reason,
                // using the `navigate` function from `react-router` results
                // in App's useLoaderData having an undefined latest event.
                window.location.href = `/caregiver/${caregiverId}`;
              }}
              value={loggedInAs}
            >
              <option value="Caregiver 1">Caregiver 1</option>
              <option value="Caregiver 2">Caregiver 2</option>
            </select>
          </div>
        </header>
        <ul>
          <li>
            <NavLink
              to={`/caregiver/${caregiverId}`}
              end
              onClick={() => setStore({ isNavOpen: false })}
            >
              All Recipients
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/caregiver/${caregiverId}/recipient/add`}
              end
              onClick={() => setStore({ isNavOpen: false })}
            >
              Add New Recipient
            </NavLink>
          </li>
        </ul>
        {recipients.length > 0 && (
          <>
            <label>Recipients</label>
            <ul>
              {recipients.map((recipient) => (
                <li key={recipient.id}>
                  <NavLink
                    to={`/caregiver/${caregiverId}/recipient/${recipient.id}`}
                    end
                    onClick={() => setStore({ isNavOpen: false })}
                  >
                    {recipient.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </>
  );
}

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

  transform: ${isNavOpen ? "translateX(0)" : "translateX(calc(-100% - 10px))"};

  > * {
    visibility: ${isNavOpen ? "visible" : "hidden"};
  }

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

      > a {
        transition: background-color 450ms cubic-bezier(0.23, 1, 0.32, 1);
        font-size: 16px;
        line-height: 54px;
        text-decoration: none;
        display: block;
        padding: 0 15px;
        color: black;

        &.active {
          background-color: #e9e9e9;
        }
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

const div = css`
  margin-top: auto;
  padding: 0 15px;

  select {
    width: 100%;
    padding: 5px;
    font-size: 16px;
  }
`;
