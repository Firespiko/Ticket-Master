import { ethers } from 'ethers'

const Card = ({ ocassion, toggle, setToggle, setOcassion }) => {
  const togglePop = () => {
    setOcassion(ocassion)
    toggle ? setToggle(false) : setToggle(true)
  }

  return (
    <div className='card'>
      <div className='card__info'>
        <p className='card__date'>
          <strong>{ocassion.date}</strong><br />{ocassion.time}
        </p>

        <h3 className='card__name'>
          {ocassion.name}
        </h3>

        <p className='card__location'>
          <small>{ocassion.location}</small>
        </p>

        <p className='card__cost'>
          <strong>
            {ethers.utils.formatUnits(ocassion.cost.toString(), 'ether')}
          </strong>
          ETH
        </p>

        {ocassion.tickets.toString() === "0" ? (
          <button
            type="button"
            className='card__button--out'
            disabled
          >
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className='card__button'
            onClick={() => togglePop()}
          >
            View Seats
          </button>
        )}
      </div>

      <hr />
    </div >
  );
}

export default Card;