/* eslint-disable */
import BigNumber from 'bignumber.js'
import { Image, Flex, Text, EarnFilledIcon, EarnFillIcon, Modal, useModal, AutoRenewIcon, Button, Input, Link } from '@kazamaswap/uikit'
import styled from 'styled-components'
import truncateHash from 'utils/truncateHash'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useProfileForAddress } from 'state/profile/hooks'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { PieChart, Pie} from "recharts";
import { getBalanceAmount } from 'utils/formatBalance'
import { useWeb3React } from '../../../packages/wagmi/src/useWeb3React'
import { bscTestnetTokens } from '@kazamaswap/tokens'
import { SPACENAUT, KRAKEN, WHALE, SHARK, ORCA, DOLPHIN, TURTLE, FISH, CRAB, SHRIMP } from './constants';
import { useKazama } from 'hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ModalInput } from 'components/Modal'

const colors = {
  admin: '#EE1A78',
  user: '#FFFFFF',
  kraken: '#F79418',
  whale: '#0096FF',
  shark: '#FFFFFF',
  dolphin: '#FFFFFF',
  turtle: '#81ba47',
  holder: '#FFFFFF',
}

const StyledModal = styled(Modal)`
  max-width: 300px;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 300px;
    max-width: 300px;
  }
`

const AvatarWrapper = styled.div`
width: 43px;
height: 43px;
background-position: center;
background-repeat: no-repeat;
background-size: 50%;
margin-left: -45px;
margin-top: 5px;
`

const Loader = styled.div`
border: 2px solid #F79418;
border-radius: 50%;
width: 43px;
height: 43px;
animation: fill linear 3s;
`

const TipIcon = styled(EarnFillIcon)`
fill: #93acd3 !important;
:hover {
  cursor: not-allowed;
  fill: rgba(255, 255, 255, 0.884) !important;
}
`

const TipButton = styled(Button)`
position: relative;
padding: 0.5rem 0;
background: rgba(238, 26, 121, 0.082);
border: 2px solid #EE1A78;
box-sizing: border-box;
border-radius: 8px;
height: 2.75rem;
transition: all .2s ease-in-out;
width: 100%;
margin-top: 10px;
&:hover {
  background: rgba(44, 38, 57, 0.897);
}
`

const RankIconWrapper = styled.div`
background: #222e3e;
border: 2px solid #111923;
border-radius: 50%;
width: 25px;
height: 25px;
margin-top: -15px;
text-align: center;
z-index: 100;
margin-left: 3px;
`

const roles = {
  admin: "ADMIN",
  support: "SUPPORT",
  moderator: "MODERATOR",
  partner: "PARTNER",
  swapdex: "SWAPDEX",
  verified: "VERIFIED",
  youtuber: "YOUTUBER",
  muted: "USER MUTED",
  scammer: "ALERT! SCAMMER",
}

const SWAPDEX_TEAM = 0x88FC8157e1E0038CB4c9120760850220d682A477;

const MessageList = ({ scrollRef, messages }) => {
  const timeFormat = (time) => {
    let result = time
    if (time < 10) {
      result = '0' + time
    }
    return result
  }

  let progressColor;
  let progressValue;
  let backColor;
  let level;
  let nameColor;

  return (
    <div
      className="chat-messages"
      style={{ overflowY: 'auto' }}
      onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
    >
      {messages.map((message, index) => {
        const sender = message.sender
        const isAvatarSet = sender?.avatarImage !== ''
        const getAllMessage = () => {
          let _messageDiv = new Array()
          _messageDiv.push(message)
          let k = 1
          while (true) {
            if (index + k < messages.length && sender?.username === messages[index + k].sender.username) {
              _messageDiv.push(messages[index + k])
              k++
            } else if (index === messages.length - 1) break
            else break
          }

          return _messageDiv
        }

        if (index > 0 && sender?.username === messages[index - 1].sender?.username) {
          return <></>
        } else {
          let color = colors.user
          if (sender?.role === 'admin') {
            color = colors.admin
          } else if (sender?.isKraken) {
            color = colors.kraken
          } else if (sender?.isWhale) {
            color = colors.whale
          }  else if (sender?.isShark) {
            color = colors.shark
          } else if (sender?.isDolphin) {
            color = colors.dolphin
          } else if (sender?.isTurtle) {
            color = color.turtle
          }

          if (sender?.isHolder) {
              progressColor = "#ffffff"
              backColor = "rgba(255, 255, 255, 0.205)"
              level = "0"
              progressValue = sender?.balance / SHRIMP * 100;
          }
          if (sender?.isShrimp) {
            progressColor = "#e14f4f"
            backColor = "rgba(225, 79, 79, 0.295)"
            level = "1"
            progressValue = sender?.balance / CRAB * 100;
          }
          if (sender?.isCrab) {
            progressColor = "#cfc6c1"
            backColor = "rgba(207, 198, 193, 0.267)"
            level = "2"
            progressValue = sender?.balance / FISH * 100;
          }
          if (sender?.isFish) {
            progressColor = "#CDE2B8"
            backColor = "rgba(205, 226, 184, 0.288)"
            level = "3"
            progressValue = sender?.balance / TURTLE * 100;
          }
          if (sender?.isTurtle) {
            progressColor = "#81ba47"
            backColor = "rgba(49, 208, 171, 0.247)"
            level = "4"
            progressValue = sender?.balance / DOLPHIN * 100;
          }
          if (sender?.isDolphin) {
            progressColor = "#A5D1D3"
            backColor = "rgba(165, 209, 211, 0.349)"
            level = "5"
            progressValue = sender?.balance / ORCA * 100;
          }
          if (sender?.isOrca) {
            progressColor = "#7a6a96"
            backColor = "rgba(122, 106, 150, 0.315)"
            level = "6"
            progressValue = sender?.balance / SHARK * 100;
          }
          if (sender?.isShark) {
            progressColor = "#777777"
            backColor = "rgba(119, 119, 119, 0.308)"
            level = "7"
            progressValue = sender?.balance / WHALE * 100;
          }
          if (sender?.isWhale) {
            progressColor = "#0096ff"
            backColor = "rgba(0, 149, 255, 0.288)"
            level = "8"
            progressValue = sender?.balance / KRAKEN * 100;
          }
          if (sender?.isKraken) {
            progressColor = "#F79418"
            backColor = "rgba(247, 147, 24, 0.336)"
            level = "9"
            progressValue = sender?.balance / SPACENAUT * 100;
          }
          if (sender?.isSpacenaut) {
            progressColor = "#534CD1"
            backColor = "rgba(83, 76, 209, 0.39)"
            level = "10"
            progressValue = 10000;
          }

          if (sender?.role === 'admin') {
            level = "A"
            progressColor = "#EE1A78"
            nameColor = "#EE1A78"
            backColor = "rgba(238, 26, 121, 0.308)"
            progressValue = 10000;
          }

          const RankProgress = [{ name: "Progress", value: progressValue }, {name: "Completed", value: 100, fill: backColor} ]
          return (
            <div ref={scrollRef}>
              <Flex flexDirection="row">
                <Flex ml="7px" mr="5px" mt="9px" alignItems="center">
                <Flex flexDirection="column">
                  <Flex>
                <PieChart width={49} height={49}>
                <Pie
                dataKey="value"
                data={RankProgress}
                cx={19}
                stroke="transparent"
                startAngle={0}
                rotate={180}
                cy={20}
                innerRadius={21}
                outerRadius={24}
                fill={progressColor}
                />
                </PieChart>
                  <AvatarWrapper>
                  {isAvatarSet ? (
                    <img src={sender?.avatarImage} width={40} style={{ borderRadius: '50%', padding: '1px' }} />
                  ) : (
                    <Jazzicon
                      diameter={38}
                      seed={jsNumberForAddress(sender?.address)}
                      style={{ borderRadius: '50%', padding: '1px' }}
                    />
                  )}
                  </AvatarWrapper>
                  </Flex>
                  <Flex justifyContent="center" alignItems="center">
                    <RankIconWrapper>
                    <Text fontSize="12px" marginTop="1px" style={{ textTransform: "bold"}}>{level}</Text>
                    </RankIconWrapper>
                    
                  </Flex>
                </Flex>
                  </Flex>

                  <Flex width="100%">
              <MessageContent>
                <div className="message-header">
                  <Flex flexDirection="row">
                    <Flex>
                    <div>
                  <NextLinkFromReactRouter to={`#`}>
                    <p style={{ marginBottom: '5px', fontSize: '15px', color: '#fff', fontWeight: 'bold'}}>
                      {sender?.username.length > 20 ? truncateHash(sender?.username) : sender?.username}
                    </p>
                    </NextLinkFromReactRouter>
                  </div>

                    </Flex>
                    {sender?.role === 'admin' && <div className="badge role-badge">{roles.admin}</div>}
                    {sender?.isSpacenaut && (<> <p className="spacenaut-badge">SPACENAUT</p> </> )}
                    {sender?.isKraken && (<> <p className="kraken-badge">KRAKEN</p> </> )}
                    {sender?.isWhale && (<> <p className="whale-badge">WHALE</p> </>)}
                    {sender?.isShark && (<> <p className="shark-badge">SHARK</p> </>)}
                    {sender?.isTurtle && (<> <p className="turtle-badge">TURTLE</p> </>)}
                    {sender?.isShrimp && (<> <p className="shrimp-badge">SHRIMP</p> </>)}
                    <Flex ml="auto" mr="15px" pb="5px">
                      <TipIcon width={18} />
                    </Flex>
                  </Flex>

                </div>
                {getAllMessage().map((_message) => {
                  if (_message.message.startsWith('http') && !_message.message.startsWith('https')) 
                  return (<div style={{background: "rgba(255, 88, 88, 0.459)", border: "1px solid #FF5958",
                  borderRadius: "4px", marginRight: "11px", padding: "5px"}}>Unsecured link!
                  <Text fontSize="12px">Only URLs with SSL certificate are allowed.</Text></div>)

                  if (_message.message.startsWith('http') && _message.message.endsWith('.gif'))
                  return (<div className="message-content gif-preview" style={{overflow: "hidden"}}><img style={{borderRadius: "10px", width: "96%", overflow: "hidden"}} src={_message.message}></img></div>)

                  if (_message.message.startsWith('https'))
                  return (<div className="message-content" style={{overflow: "hidden"}}><Link href={_message.message}>{_message.message}</Link></div>)

                  return (
                    <div className="message-content">
                      <p className="normal-text">{_message.message}</p>
                    </div>
                  )
                })}
              </MessageContent>
              </Flex>
              </Flex>
            </div>
          )
        }
      })}
    </div>
  )
}

const MessageContent = styled.div`
  margin-top: 7px;
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 10px;
  padding-bottom: 10px;
  background: #1b2031;
  border-radius: 10px;
  width: 100%;

  .message-header {
    display: block;
    align-items: center;
    padding: 10px 1px;

    .spacenaut-badge {
      border-radius: 7px;
      padding: 0 8px;
      border: 2px solid transparent;
      height: 16px;
      background: #534CD1;
      box-shadow: none;
      color: #fff;
      margin-left: 8px;
      font-size: 12px;
      font-weight: bold;
    }

    .kraken-badge {
      border-radius: 7px;
      padding: 0 8px;
      border: 2px solid;
      height: 16px;
      border-color: #f79418;
      background: #f79418;
      box-shadow: none;
      color: #fff;
      margin-left: 8px;
      font-size: 12px;
      border-radius: 5px;
      font-weight: bold;
    }
    .whale-badge {
      border-radius: 7px;
      padding: 0 8px;
      height: 16px;
      border: 2px solid;
      border-color: #0096ff;
      background: #0096ff;
      box-shadow: none;
      color: #ffffff;
      margin-left: 8px;
      font-size: 12px;
      border-radius: 5px;
      font-weight: bold;
    }
    .shark-badge {
      border-radius: 7px;
      padding: 0 8px;
      height: 16px;
      border: 2px solid;
      background: #6c7780;
      border-color: #6c7780;
      box-shadow: none;
      color: #fff;
      margin-left: 8px;
      font-size: 12px;
      border-radius: 5px;
      font-weight: bold;
    }
    .turtle-badge {
      border-radius: 7px;
      padding: 0 8px;
      border: 2px solid;
      border-color: #81ba47;
      background: #81ba47;
      height: 16px;
      box-shadow: none;
      color: #fff;
      margin-left: 8px;
      font-size: 12px;
      border-radius: 5px;
      font-weight: bold;
    }
    .shrimp-badge {
      border-radius: 7px;
      padding: 0 8px;
      border: 2px solid;
      border-color: #e14f4f;
      background: #e14f4f;
      height: 16px;
      box-shadow: none;
      color: #fff;
      margin-left: 8px;
      font-size: 12px;
      border-radius: 5px;
      font-weight: bold;
    }
    .holder-badge {
      border-radius: 7px;
      padding: 0 8px;
      border: 2px solid;
      border-color: #6e5f8d;
      background: rgba(110, 95, 141, 0.253);
      box-shadow: none;
      color: #fff;
      margin-left: 8px;
      font-size: 12px;
      border-radius: 5px;
      text-align: center;
      font-weight: bold;
    }
    .badge {
      padding: 0 8px;
      height: 16px;
      border: 2px solid;
      border-color: #ee1a78;
      box-shadow: none;
      color: #fff;
      background: #ee1a78;
      margin-left: 8px;
      font-weight: bold;
      font-size: 11px;
      border-radius: 5px;
      font-weight: bold;
    }
  }

  .message-content {
    display: flex;
    padding-bottom: 5px;
    padding-right: 10px;
    .smaller-text {
      font-size: 11px;
      font-weight: 400;
      padding-top: 4px;
      color: #93acd3;
    }
    .normal-text {
      color: #93acd3;
      word-wrap: break-word;
      overflow-wrap: break-word;
      overflow: hidden;
      font-weight: 400;
      font-size: 14px;
    }
  }
`
export default MessageList