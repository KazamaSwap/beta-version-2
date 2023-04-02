import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { Text } from '@kazamaswap/uikit';
import { LotteryResponse } from 'state/types'
import useSWR from 'swr'
import useIsRenderLotteryBanner from 'views/Home/components/Banners/hooks/useIsRenderLotteryBanner';

const TimerBlock = styled.div`
-webkit-text-size-adjust: 100%;
-webkit-tap-highlight-color: transparent;
-webkit-font-smoothing: antialiased;
line-height: 1.2;
text-align: center;
box-sizing: border-box;
padding: 12px 16px;
border-radius: 8px;
font-variant-numeric: tabular-nums;
background: #201c29;
color: rgb(255, 255, 255);
font-size: 32px;
font-family: "Geogrotesque Wide", sans-serif;
font-weight: 800;
font-style: normal;
min-width: 80px;
`

const Timer = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { data } = useSWR<LotteryResponse>(['currentLottery'])

  const getTime = () => {
    const time = parseInt(data.endTime) * 1000 - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 12)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 12));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <>
        <div className="raffle-countdown">
            <div className="timer-info">
                <TimerBlock>
                     {Math.floor(hours/10)}
                     {hours%10}
                    <div className="label">
                    <Text fontSize="13px">
                    Hours
                    </Text>
                    </div>
                </TimerBlock>
                <TimerBlock>
                    {Math.floor(minutes/10)}
                    {minutes%10}
                    <div className="label">
                    <Text fontSize="13px" color="Text">
                    Minutes
                    </Text>
                    </div>
                </TimerBlock>
                <TimerBlock>
                    {Math.floor(seconds/10)}
                    {seconds%10}
                    <div className="label">
                    <Text fontSize="13px">
                    Seconds
                    </Text>
                    </div>
                    </TimerBlock>
            </div>
        </div>
    </>    
  );
};

export default Timer;