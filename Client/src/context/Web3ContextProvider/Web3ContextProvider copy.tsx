import React from "react";
import { createContext, FC, ReactElement, useContext, useEffect, useMemo, useState } from "react";

import { useLocalStorage } from "@q-dev/react-hooks";
import { ErrorHandler } from "helpers";
import { UseProvider } from "typings";
import { Wrap } from "./styles";

import { chainIdToNetworkMap, networkConfigsMap, ORIGIN_NETWORK_NAME } from "constants/config";
import { PROVIDERS } from "constants/providers";

export type Web3Data = {
  currentProvider: UseProvider;
  isRightNetwork: boolean;
  isWeb3Loaded: boolean;
  
  connect: (provider: PROVIDERS) => Promise<void>;
  initDefaultProvider: (rpc: number) => Promise<void>;
  disconnect: () => void;
};

