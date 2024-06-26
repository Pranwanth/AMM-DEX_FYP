import { useState } from "react";

import ArrowDown from "../../../public/assets/ArrowDown";
import CloseIcon from "../../../public/assets/CloseIcon";
import { Token } from "../GlobalTypes";
import TOKENS from "../Tokens";
import TokenWithSymbol from "../Token/TokenWithSymbol";

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
          {token ? <TokenWithSymbol token={token} className="mr-7" /> : "Select Token"}
          <ArrowDown />
        </div>
      </button>
      {openDialog && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-80 h-96 flex flex-col">
            <div className="p-6">
              <div className="flex justify-between mb-2">
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
            </div>
            <hr />
            <div className="overflow-auto scrollbar-style p-6">
              {TOKENS.map((token) => {
                return (
                  <button
                    key={token.address}
                    onClick={() => handleClick(token)}
                    className="flex w-full gap-4 mb-2"
                  >
                    <img src={token.imageUrl} className='w-8' />
                    <div className="text-left">
                      <div className="text-base">{token.name}</div>
                      <div className="text-sm">{token.ticker}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelector;
