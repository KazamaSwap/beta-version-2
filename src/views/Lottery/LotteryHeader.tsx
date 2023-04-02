
import UsdPrize from "./components/PreviousRoundCard/UsdPrize"

const LotteryHeader = () => {

  return (
    <>
        <div className="raffle-unit">

            <div className="raffle-hero-unit">
                <div className="inner">
                    <div className="big-text">

                    <UsdPrize  />

                    </div>
                </div>
                 {/* <div className="timer-shadow"></div>  */}
                   {/* <div className="left-graphics">
                    <div className="tree">
 
                    </div>
                </div>  */}
                                 {/* <div className="timer-shadow-right"></div>  */}
                  {/* <div className="right-graphics">
                    <div className="gifts">
                        <div className="blur"/>
                    </div>
                </div>   */}
            </div>
        </div>
    </>
  )
}

export default LotteryHeader
