/* eslint-disable */
import React, { Component } from 'react'
import ReactDOM from 'react-dom/client';
import styled from 'styled-components'
import { GifIcon, EmojiIcon, SettingsIcon, Flex, useModal, ModalContainer } from '@kazamaswap/uikit'
import EmojiPicker from 'emoji-picker-react'
import { IoMdSend } from 'react-icons/io'
import { BsEmojiSmileFill } from 'react-icons/bs'
import useGetTokenBalance from 'hooks/useTokenBalance'
import { getBalanceAmount } from 'utils/formatBalance'
import { useWeb3React } from '../../../packages/wagmi/src/useWeb3React'
import { useState } from 'react';
import GifPicker, { TenorImage } from 'gif-picker-react';
import SetChatName from 'views/ChatUsername/setChatName'
import SetProfileAvatar from '../../views/ChatAvatar/setAvatar';

export default function MessageInput({ handleSendMsg }): JSX.Element {
  const { account } = useWeb3React()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [selected, setSelected ] = useState<TenorImage>(null!)
  const [onPresentSetUsernameModal] =  useModal(<SetChatName />)
  const [onPresentSetAvatarModal] =  useModal(<SetProfileAvatar />)
  
  const [msg, setMsg] = useState('')

  const TENOR_API_KEY = 'AIzaSyCdRm-UH7PVl6V0NnQwz1b-TmIjw9I6vpI';

const EmojiPickerIcon = styled(EmojiIcon)`
fill: #93acd3 !important;
:hover {
  cursor: pointer;
  fill: rgba(255, 255, 255, 0.884) !important;
}
`

const SettingsPickerIcon = styled(SettingsIcon)`
fill: #93acd3 !important;
:hover {
  cursor: pointer;
  fill: rgba(255, 255, 255, 0.884) !important;
}
`

const GifPickerIcon = styled(GifIcon)`
fill: #93acd3 !important;
:hover {
  cursor: pointer;
  fill: rgba(255, 255, 255, 0.884) !important;
}
`

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleGifPicker = () => {
    setShowGifPicker(!showGifPicker)
  }

  const handleEmojiClick = (e, emoji) => {
    let message = msg
    message += e.emoji
    setMsg(message)
  }

  const handleGifClick = (e) => {
    handleSendMsg(e.url)
    setShowGifPicker(!showGifPicker)
  }

  const sendChat = (e) => {
    e.preventDefault()
    if (showEmojiPicker) setShowEmojiPicker(!showEmojiPicker)
    if (showGifPicker) setShowGifPicker(!showGifPicker)
    if (msg.length > 0) {
      handleSendMsg(msg)
      setMsg('')
    }
  }

  return (
    <Container>
      {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" height={400} />}
      {showGifPicker && <GifPicker onGifClick={handleGifClick} tenorApiKey={TENOR_API_KEY} width="100%" height={400} /> }
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
      <input
              type="text"
              color="#ffffff"
              placeholder="Say something .."
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value)
              }}
            />
            <button className="submit">Send</button>
      </form>
       <div className="button-container">
        <Flex flexDirection="row">
           <Flex mr="5px">
          <EmojiPickerIcon width={20} onClick={handleEmojiPickerHideShow} />
          </Flex>
        <Flex mt="3px">
        <GifPickerIcon width={26} onClick={handleGifPicker} />
        </Flex>
        {/* <Flex>
        <SettingsPickerIcon onClick={onPresentSetUsernameModal} />
        </Flex> */}
        </Flex>

      </div>
    </Container>
  )
}

{
  /* <IoMdSend fill="#4c4160" /> */
}

const InputContainer = styled.div`
box-shadow: 0 0 20px rgb(0 0 0 / 30%);
`

const Container = styled.div`
    padding: 8px;
    padding-top: 15px;
    padding-bottom: 15px;
    background-color: #191e2e;
    box-shadow: 0 -8px 45px #111923;
    border-top: 2px solid rgba(0, 0, 0, 0.35);
    z-index: 5;
    .input-container {
        display: flex;
        flex-direction:row;
        justify-content: space-between;
        input {
            display: flex;
            flex-grow: 2;
            -webkit-box-align: center;
            align-items: center;
            min-height: 40px;
            width: 100%;
            padding: 6px 5px 6px 15px;
            border-radius: 10px 0px 0px 10px;
            border: 1px solid transparent;
            background: #141824;
            transition: background 0.1s ease 0s;
            position: relative;
            height: auto;
            color: #fff;
            font-size: 15px;
            }
        }
    }

    .submit {
      background: #111923;
      color: white;
      outline: none;
      border: none;
      border-radius: 0px 10px 10px 0px;
      padding-right: 20px;
  }

    .button-container {
        display: flex;
        align-items: center;
        margin-top: 5px;

        .submit, emoji {
            background: none;
            border: none;
            cursor: pointer;

            svg {
                width: 20px;
                height: 20px;
            }
        }
    }
}
`