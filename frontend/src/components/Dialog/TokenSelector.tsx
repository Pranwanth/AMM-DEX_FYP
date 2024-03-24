import { useState } from "react";

import ArrowDown from "../../../public/assets/ArrowDown";
import CloseIcon from "../../../public/assets/CloseIcon";
import { Token } from "../GlobalTypes";
import COMMON_TOKENS from "../Tokens";

interface TokenSelectorProps {
  token?: Token;
  tokenSelectHandler: (token: Token) => void;
}

const TokenSelector = (props: TokenSelectorProps) => {
  const { token, tokenSelectHandler } = props;

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClick = (token: Token) => {
    tokenSelectHandler(token);
    setOpenDialog(false);
  };

  return (
    <div className="flex items-center">
      <button
        className="bg-white text-primaryText hover:bg-sky-600/20 font-bold py-1 px-2 rounded-3xl text-base whitespace-nowrap"
        onClick={handleOpenDialog}
      >
        <div className="flex justify-center items-center gap-2">
          {token ? token.ticker : "Select Token"}
          <ArrowDown />
        </div>
      </button>
      {openDialog && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 h-80 flex flex-col gap-2">
            <div className="flex justify-between">
              Select a token
              <CloseIcon onClose={handleCloseDialog} />
            </div>
            <div className="bg-sky-50 flex justify-center items-center gap-2 p-1 rounded-xl ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#082f49"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                placeholder="Search name"
                className="block w-full h-8 bg-transparent rounded-md text-base"
              />
            </div>
            <div className="flex gap-1  flex-wrap">
              {COMMON_TOKENS.map((token, index) => {
                return (
                  <button
                    key={`token-${index}`}
                    className="py-1 px-2 rounded-2xl border-2 border-sky-800/20 font-medium"
                    onClick={() => handleClick(token)}
                  >
                    {token.ticker}
                  </button>
                );
              })}
            </div>
            <hr />
            <h4>Popular Tokens</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelector;
