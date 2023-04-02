import { useState } from 'react'
import styled from 'styled-components'
import { escapeRegExp } from 'utils'
import { Text, Input, Flex, Box, IconButton, ArrowDownIcon } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { useUserSlippageTolerance, useUserTransactionTTL } from 'state/user/hooks'
import { CommitButton } from 'components/CommitButton'
import QuestionHelper from '../../QuestionHelper'

const StyledInputWrapper = styled.div`
padding: 0.75rem;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
align-items: center;
`

const StyledCommit = styled(CommitButton)`
height: 24px;
border-radius: 8px;
background: transparent;
border: 1px solid #1b2031;
`

const StyledInput = styled(Input)`
  background: transparent;
  width: 17%;
  border-radius: 7px;
  border: 0px solid transparent !important;
  outline: none;
  box-shadow: none;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  background-color: transparent;
  font-size: 22px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  &:disabled {
    background-color: transparent;
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    box-shadow: none !important;
    }};

  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 22px;
  }

 ::placeholder::focus {
    color: purple;
}
`

const StyledInputTime = styled(Input)`
  background: transparent;
  width: 17%;
  border-radius: 7px;
  border: 0px solid transparent !important;
  outline: none;
  box-shadow: none;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  background-color: transparent;
  font-size: 22px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  &:disabled {
    background-color: transparent;
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    box-shadow: none !important;
    }};

  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 22px;
  }

 ::placeholder::focus {
    color: purple;
}
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-down {
    fill: #fff !important;
  }
  .icon-up-down {
    display: none;
    fill: #fff !important;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

const StyledSwitchButton = styled(SwitchIconButton)`
border-radius: 50%;
background: #191e2e;
z-index: 100;
border: 1px solid #11141e;
`

const InfoWrapper = styled.div`
padding: 0.75rem;
    border-radius: 14px;
    border: 1px solid #1b2031;
    margin-top: 3px;
    margin-bottom: 15px;
`

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}


const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3

const SlippageTabs = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
  const [ttl, setTtl] = useUserTransactionTTL()
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined;
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 60 && valueAsInt < THREE_DAYS_IN_SECONDS) {
        setTtl(valueAsInt)
      } else {
        deadlineError = DeadlineError.InvalidInput
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <><InfoWrapper>
      <Flex flexDirection="column">
        <Flex flexDirection="column" mb="5px">
          <Flex mb="5px">
            <Text>{t('Slippage Tolerance')}</Text>
            {!!slippageError && (
              <Flex style={{ marginLeft: "auto" }}>
                {slippageError === SlippageError.InvalidInput ?
                  <Flex style={{ background: "#FF5958", borderRadius: "7px", display: "inline-block", width: "150px", height: "20px", marginLeft: "auto" }}>
                    <Text textAlign="center" fontSize="12px" color="#fff">  Enter valid a slippage
                    </Text>
                  </Flex>
                  : slippageError === SlippageError.RiskyLow
                    ?
                    <Flex style={{ background: "#FF5958", borderRadius: "7px", display: "inline-block", width: "150px", height: "20px", marginLeft: "auto" }}>
                      <Text textAlign="center" fontSize="12px" color="#fff"> Transaction will fail
                      </Text>
                    </Flex>
                    :
                    <Flex style={{ background: "#F3841E", borderRadius: "7px", display: "inline-block", width: "165px", height: "20px", marginLeft: "auto" }}>
                      <Text textAlign="center" fontSize="12px" color="#fff"> Transaction might frontrun
                      </Text>
                    </Flex>}
              </Flex>
            )}
            {!slippageError && (
      <Flex style={{ background: "#29304a", borderRadius: "7px", display: "inline-block", width: "145px", height: "20px", marginLeft: "auto" }}>
      <Text textAlign="center" fontSize="12px" color="#fff">Safe slippage
      </Text>
    </Flex>
            )}
          </Flex>
          <StyledInputWrapper>
            <Flex alignItems="center" justifyContent="center" mb="3px">
              <StyledInput
                scale="sm"
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                placeholder={(userSlippageTolerance / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
                } }
                onChange={(event) => {
                  if (event.currentTarget.validity.valid) {
                    parseCustomSlippage(event.target.value.replace(/,/g, '.'))
                  }
                } }
                isWarning={!slippageInputIsValid}
                isSuccess={![10, 50, 100].includes(userSlippageTolerance)} />
              <Text color="text" fontSize="22px" fontWeight="500">
                %
              </Text>
            </Flex>
          </StyledInputWrapper>
          <div style={{ padding: '0 1rem', marginTop: '-1.25rem', marginBottom: '-1.25rem', justifyContent: "center", display: "flex" }}>
            <StyledSwitchButton variant="light" scale="sm">
              <ArrowDownIcon />
            </StyledSwitchButton>
          </div>
          <StyledInputWrapper>
            <div style={{ textAlign: "center", display: "flex", marginTop: "5px", marginBottom: "3px", wordWrap: "break-word", width: "350px" }}>
              <Text fontSize="12px" color="#93acd3">
                Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.
              </Text>
            </div>
          </StyledInputWrapper>
          <Flex flexWrap="wrap" justifyContent="space-between" mt="5px">
            <StyledCommit
              mt="4px"
              mr="1px"
              scale="sm"
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(10)
              } }
              variant={userSlippageTolerance === 10 ? 'primary' : 'tertiary'}
            >
              0.1%
            </StyledCommit>
            <StyledCommit
              mt="4px"
              mr="1px"
              scale="sm"
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(50)
              } }
              variant={userSlippageTolerance === 50 ? 'primary' : 'tertiary'}
            >
              0.5%
            </StyledCommit>
            <StyledCommit
              mr="1px"
              mt="4px"
              scale="sm"
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(100)
              } }
              variant={userSlippageTolerance === 100 ? 'primary' : 'tertiary'}
            >
              1.0%
            </StyledCommit>
            <StyledCommit
              mr="1px"
              mt="4px"
              scale="sm"
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(300)
              } }
              variant={userSlippageTolerance === 300 ? 'primary' : 'tertiary'}
            >
              3.0%
            </StyledCommit>
            <StyledCommit
              mr="1px"
              mt="4px"
              scale="sm"
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(700)
              } }
              variant={userSlippageTolerance === 700 ? 'primary' : 'tertiary'}
            >
              7.0%
            </StyledCommit>
          </Flex>
        </Flex>
      </Flex>
    </InfoWrapper>
    <InfoWrapper>
    <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Text>{t('Tx deadline (Minutes)')}</Text>
        </Flex>
      </Flex>
      <Text fontSize="12px" color="#93acd3" mb="2px">
      Your transaction will revert if it is left confirming for longer.
              </Text>
      <StyledInputWrapper>
          <Flex alignItems="center" justifyContent="center" mb="3px">
            <StyledInputTime
              scale="sm"
              inputMode="numeric"
              pattern="^[0-9]+$"
              isWarning={!!deadlineError}
              onBlur={() => {
                parseCustomDeadline((ttl / 60).toString())
              } }
              placeholder={(ttl / 60).toString()}
              value={deadlineInput}
              onChange={(event) => {
                if (event.currentTarget.validity.valid) {
                  parseCustomDeadline(event.target.value)
                }
              } } />
        </Flex>
        </StyledInputWrapper>
      </InfoWrapper>
      </>
  )
}

export default SlippageTabs
