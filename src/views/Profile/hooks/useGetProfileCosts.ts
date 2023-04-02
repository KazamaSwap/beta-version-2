import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useTranslation } from '@kazamaswap/localization'
import { multicallv2 } from 'utils/multicall'
import profileABI from 'config/abi/kazamaProfile.json'
import { getKazamaProfileAddress } from 'utils/addressHelpers'
import useToast from 'hooks/useToast'

const useGetProfileCosts = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [costs, setCosts] = useState({
    numberKazamaToReactivate: Zero,
    numberKazamaToRegister: Zero,
    numberKazamaToUpdate: Zero,
  })
  const { toastError } = useToast()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const calls = ['numberKazamaToReactivate', 'numberKazamaToRegister', 'numberKazamaToUpdate'].map((method) => ({
          address: getKazamaProfileAddress(),
          name: method,
        }))
        const [[numberKazamaToReactivate], [numberKazamaToRegister], [numberKazamaToUpdate]] = await multicallv2<
          [[BigNumber], [BigNumber], [BigNumber]]
        >({ abi: profileABI, calls })

        setCosts({
          numberKazamaToReactivate,
          numberKazamaToRegister,
          numberKazamaToUpdate,
        })
        setIsLoading(false)
      } catch (error) {
        toastError(t('Error'), t('Could not retrieve KAZAMA costs for profile'))
      }
    }

    fetchCosts()
  }, [setCosts, toastError, t])

  return { costs, isLoading }
}

export default useGetProfileCosts
