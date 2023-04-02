// define and export `useClient` hook somewhere in your codebase
// or keep it in the `src/App.js`, up to you

import { useEffect, useState } from "react";
import { StreamChat, StreamType } from "stream-chat";
import useInterval from "./useInterval";

// we'll use src/hooks/useClient.js path for this example
export const useClient = ({ apiKey, userData, tokenOrProvider }) => {
  const [chatClient, setChatClient] = useState(null);


  useEffect(() => {
    if (tokenOrProvider && userData) {
      const didUserConnectInterrupt = false;
      const client = new StreamChat(apiKey);
      // const token = server.createToken('john');
      // prevents application from setting stale client (user changed, for example)

      const connectionPromise = client.connectUser(userData, tokenOrProvider).then(() => {
        if (!didUserConnectInterrupt) setChatClient(client);
      });
      // return () => {
      //   didUserConnectInterrupt = true;
      //   setChatClient(null);
      //   // wait for connection to finish before initiating closing sequence
      //   connectionPromise
      //     .then(() => client.disconnectUser())
      //     .then(() => {
      //       console.log('connection closed');
      //     });
      // };
    }

  }, [apiKey, userData, tokenOrProvider]);

  return chatClient;
};

export const useFetchTokenFromApi = (name) => {
  const [token, setToken] = useState('')
  useEffect(() => {
    const api = async () => {
      const res = await fetch("https://kazama-chat-app.herokuapp.com/token",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: name
          })
        })

      res.json().then((data) => {
        setToken(data);
      })
    }
    api();
  }, [name])
  return token;
};

export const useFetchTokens = () => {
  const [tokenInfo, setTokenInfo] = useState([{logoUrl: '', tokenTicker: '', tokenPrice: '', percentChange: '', contractAddress: ''}])
  useEffect(() => {
    const api = async () => {
      const res = await fetch("https://ape-swap-api.herokuapp.com/tokens/trending",
        {
          method: "get",
          headers: { "Content-Type": "application/json" }
        })

      res.json().then((data) => {
        setTokenInfo(data);
      })
    }
    api();
  }, [])
  return tokenInfo;
};

export const useFetchTxs = () => {
  const [txs, setTxs] = useState([{transactionHash: '', blockTimestamp: '', fromAddress: '', toAddress: '', value: 0, type: ''}])
  useEffect(() => {
    const api = async () => {
      const res = await fetch("https://kazama-tx-api.kazamaswap.finance/getTransactions",
        {
          method: "get",
          headers: { "Content-Type": "application/json" }
        })

      console.log(res)
      res.json().then((data) => {
        setTxs(data.lastestTxs);
      })
    }
    api();
  }, [])  
  return txs;
};

export const useFetchDistributor = () => {
  const [txs, setTxs] = useState([{transactionHash: '', blockTimestamp: '', fromAddress: '', toAddress: '', value: 0, type: ''}])
  useEffect(() => {
    const api = async () => {
      const res = await fetch("https://busd-distributor-api.kazamaswap.finance/getTransactions",
        {
          method: "get",
          headers: { "Content-Type": "application/json" }
        })

      console.log(res)
      res.json().then((data) => {
        setTxs(data.lastestTxs);
      })
    }
    api();
  }, [])  
  return txs;
};