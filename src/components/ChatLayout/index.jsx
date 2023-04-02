/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from 'styled-components';
import axios from "axios";
import { io } from "socket.io-client";
import useGetTokenBalance from 'hooks/useTokenBalance';
import { useFetchMessages, useGetUserInfo } from 'hooks/useClient'
import { getBalanceAmount } from 'utils/formatBalance';
import { useWeb3React } from '../../../packages/wagmi/src/useWeb3React';
import { connect, getAllMessagesRoute, sendMessageRoute, host, getUserRoute } from '../../utils/apiRoutes'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { SPACENAUT, KRAKEN, WHALE, SHARK, ORCA, DOLPHIN, TURTLE, FISH, CRAB, SHRIMP } from './constants';

const ChatComponent = () => {
  const socket = useRef();
  const scrollRef = useRef();
  const { account, isConnected } = useWeb3React()
  const [currentUser, setCurrentUser] = useState("")
  const [ip, setIP] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const { balance: userKazama, fetchStatus } = useGetTokenBalance("0x0f48757b9B9b5F04416824FDF1F812dDbedB54E7", account)
  const userKazamaBalance = getBalanceAmount(userKazama)
  const [messages, setMessages] = useState([]);
  const ADMIN_ADDRESS = "0x4162fBe60B7dDb0EaAbC0b13C6e68cC836Fe3a8f"
  // const messages = useFetchMessages("http://localhost:5000/api/message/getmsg")
  socket.current = io(host);

  //creating function to load ip address from the API
  // const getData = async () => {
  // const res = await axios.get('https://api.ipify.org')
  // setIP(res.data.IPv4)
  //  }
    
  //  useEffect( () => {
      //passing getData method to the lifecycle method
  //    getData()
  
    //}, [])

  useEffect( () => {
    const connectUser = async() => {
      if (isConnected && fetchStatus === "FETCHED") {
        let spacenaut, kraken, whale, shark, orca, dolphin, turtle, fish, crab, shrimp, holder, lpProvider
        if (userKazamaBalance.isGreaterThan(SPACENAUT)) {
          spacenaut = true;
          kraken = false;
          whale = false;
          shark = false;
          orca = false;
          dolphin = false;
          turtle = false;
          fish = false;
          crab = false;
          shrimp = false;
          holder = false;
        }
         else if (userKazamaBalance.isGreaterThan(KRAKEN)) {
          spacenaut = false;
          kraken = true;
          whale = false;
          shark = false;
          orca = false;
          dolphin = false;
          turtle = false;
          fish = false;
          crab = false;
          shrimp = false;
          holder = false;
        } else if (userKazamaBalance.isGreaterThan(WHALE)) {
          spacenaut = false;
          kraken = false;
          whale = true;
          shark = false;
          orca = false;
          dolphin = false;
          turtle = false;
          fish = false;
          crab = false;
          shrimp = false;
          holder = false;
        } else if (userKazamaBalance.isGreaterThan(SHARK)) {
          spacenaut = false;
          kraken = false;
          whale = false;
          shark = true;
          orca = false;
          dolphin = false;
          turtle = false;
          fish = false;
          crab = false;
          shrimp = false;
          holder = false;
        } else if (userKazamaBalance.isGreaterThan(ORCA)) {
          spacenaut = false;
          kraken = false;
          whale = false;
          shark = false;
          orca = true;
          dolphin = false;
          turtle = false;
          fish = false;
          crab = false;
          shrimp = false;
          holder = false;
        } else if (userKazamaBalance.isGreaterThan(DOLPHIN)) {
          spacenaut = false;
          kraken = false;
          whale = false;
          shark = false;
          orca = false;
          dolphin = true;
          turtle = false;
          fish = false;
          crab = false;
          shrimp = false;
          holder = false;
        } else if (userKazamaBalance.isGreaterThan(TURTLE)) {
          spacenaut = false;
          kraken = false;
          whale = false;
          shark = false;
          orca = false;
          dolphin = false;
          turtle = true;
          fish = false;
          crab = false;
          shrimp = false;
          holder = false;
        } else if (userKazamaBalance.isGreaterThan(FISH)) {
          spacenaut = false;
          kraken = false;
          whale = false;
          shark = false;
          orca = false;
          dolphin = false;
          turtle = false;
          fish = true;
          crab = false;
          shrimp = false;
          holder = false;
        } else if (userKazamaBalance.isGreaterThan(CRAB)) {
          spacenaut = false;
          kraken = false;
          whale = false;
          shark = false;
          orca = false;
          dolphin = false;
          turtle = false;
          fish = false;
          crab = true;
          shrimp = false;
          holder = false;
        } else if (userKazamaBalance.isGreaterThan(SHRIMP)) {
          spacenaut = false;
          kraken = false;
          whale = false;
          shark = false;
          orca = false;
          dolphin = false;
          turtle = false;
          fish = false;
          crab = false;
          shrimp = true;
          holder = false;
        } else if (userKazamaBalance.isLessThanOrEqualTo(0)) {
          spacenaut = false;
          kraken = false;
          whale = false;
          shark = false;
          orca = false;
          dolphin = false;
          turtle = false;
          fish = false;
          crab = false;
          shrimp = false;
          holder = true;
        }

        if (account === ADMIN_ADDRESS) {
          spacenaut = false;
          kraken = false;
          whale = false;
          shark = false;
          orca = false;
          dolphin = false;
          turtle = false;
          fish = false;
          crab = false;
          shrimp = false;
          holder = false;          
        }

        const userBalance = userKazamaBalance;
        
        const { data } = await axios.post(connect, {
          address: account,
          balance: userBalance,
          isSpacenaut: spacenaut,
          isKraken: kraken,
          isWhale: whale,
          isShark: shark, 
          isOrca: orca, 
          isDolphin: dolphin, 
          isTurtle: turtle,
          isFish: fish,
          isCrab: crab,
          isShrimp: shrimp, 
          isHolder: holder, 
        })
        
        setCurrentUser(data.user)
      }
    }
    connectUser()

    const fetchData = async () => {
      const response = await axios.post(getAllMessagesRoute, {
        sender: currentUser?._id,
      });
      setMessages(response.data);
    }
    fetchData();
  }, [account, fetchStatus])

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      sender: currentUser,
      message: msg,
    });
    const updateTime = Date.now()
    socket.current.emit("send-msg", {
      sender: currentUser,
      message: msg,
      updatedAt: updateTime
    });
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieved", (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg.message,
          sender: msg.sender,
          updatedAt: msg.updatedAt
        });
      })
    }

  }, [socket]);

  useEffect(()=>{
    arrivalMessage && setMessages((prev)=>[...prev,arrivalMessage]);
  },[arrivalMessage]);

  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <MessageList scrollRef={ scrollRef } messages={ messages } />
      <MessageInput handleSendMsg={handleSendMsg} />
    </>
  );
};

export default ChatComponent;
