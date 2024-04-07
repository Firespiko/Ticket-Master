import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import TicketMaster from './abis/TicketMaster.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [ticketMaster, setTicketMaster] = useState(null)
  const [ocassions, setOcassions] = useState([])

  const [ocassion, setOcassion] = useState({})
  const [toggle, setToggle] = useState(false)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const ticketMaster = new ethers.Contract(config[network.chainId].TicketMaster.address, TicketMaster, provider)
    setTicketMaster(ticketMaster)

    const totalOcassions = await ticketMaster.totalOcassions()
    const ocassions = []

    for (var i = 1; i <= totalOcassions; i++) {
      const ocassion = await ticketMaster.getOcassion(i)
      ocassions.push(ocassion)
    }

    setOcassions(ocassions)

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />

        <h2 className="header__title"><strong>Event</strong> Tickets</h2>
      </header>

      <Sort />

      <div className='cards'>
        {ocassions.map((ocassion, index) => (
          <Card
            ocassion={ocassion}
            id={index + 1}
            ticketMaster={ticketMaster}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOcassion={setOcassion}
            key={index}
          />
        ))}
      </div>

      {toggle && (
        <SeatChart
          ocassion={ocassion}
          ticketMaster = {ticketMaster}
          provider={provider}
          setToggle={setToggle}
        />
      )}
    </div>
  );
}

export default App;