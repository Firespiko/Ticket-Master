const { expect } = require("chai")

const NAME = "TicketMaster"
const SYMBOL = "TM"

const OCASSION_NAME = "ETH Texas"
const OCASSION_COST = ethers.utils.parseUnits('1', 'ether')
const OCASSION_MAX_TICKETS = 100
const OCASSION_DATE = "Apr 27"
const OCASSION_TIME = "10:00AM CST"
const OCASSION_LOCATION = "Austin, Texas"

describe("TicketMaster", () => {
  let ticketMaster
  let deployer, buyer

  beforeEach(async () => {
    // Setup accounts
    [deployer, buyer] = await ethers.getSigners()

    // Deploy contract
    const TicketMaster = await ethers.getContractFactory("TicketMaster")
    ticketMaster = await TicketMaster.deploy(NAME, SYMBOL)

    const transaction = await ticketMaster.connect(deployer).list(
      OCASSION_NAME,
      OCASSION_COST,
      OCASSION_MAX_TICKETS,
      OCASSION_DATE,
      OCASSION_TIME,
      OCASSION_LOCATION
    )

    await transaction.wait()
  })

  describe("Deployment", () => {
    it("Sets the name", async () => {
      expect(await ticketMaster.name()).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      expect(await ticketMaster.symbol()).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      expect(await ticketMaster.owner()).to.equal(deployer.address)
    })
  })

  describe("Ocassions", () => {
    it('Returns ocassions attributes', async () => {
      const ocassion = await ticketMaster.getOcassion(1)
      expect(ocassion.id).to.be.equal(1)
      expect(ocassion.name).to.be.equal(OCASSION_NAME)
      expect(ocassion.cost).to.be.equal(OCASSION_COST)
      expect(ocassion.tickets).to.be.equal(OCASSION_MAX_TICKETS)
      expect(ocassion.date).to.be.equal(OCASSION_DATE)
      expect(ocassion.time).to.be.equal(OCASSION_TIME)
      expect(ocassion.location).to.be.equal(OCASSION_LOCATION)
    })

    it('Updates ocassions count', async () => {
      const totalOcassions = await ticketMaster.totalOcassions()
      expect(totalOcassions).to.be.equal(1)
    })})

    describe("Minting", () => {
      const ID = 1
      const SEAT = 50
      const AMOUNT = ethers.utils.parseUnits('1', 'ether')
  
      beforeEach(async () => {
        const transaction = await ticketMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
        await transaction.wait()
      })
  
      it('Updates ticket count', async () => {
        const ocassion = await ticketMaster.getOcassion(1)
        expect(ocassion.tickets).to.be.equal(OCASSION_MAX_TICKETS - 1)
      })
  
      it('Updates buying status', async () => {
        const status = await ticketMaster.hasBought(ID, buyer.address)
        expect(status).to.be.equal(true)
      })
  
      it('Updates seat status', async () => {
        const owner = await ticketMaster.seatTaken(ID, SEAT)
        expect(owner).to.equal(buyer.address)
      })
  
      it('Updates overall seating status', async () => {
        const seats = await ticketMaster.getSeatsTaken(ID)
        expect(seats.length).to.equal(1)
        expect(seats[0]).to.equal(SEAT)
      })
  
      it('Updates the contract balance', async () => {
        const balance = await ethers.provider.getBalance(ticketMaster.address)
        expect(balance).to.be.equal(AMOUNT)
      })
    })

    describe("Withdrawing", () => {
      const ID = 1
      const SEAT = 50
      const AMOUNT = ethers.utils.parseUnits("1", 'ether')
      let balanceBefore
  
      beforeEach(async () => {
        balanceBefore = await ethers.provider.getBalance(deployer.address)
  
        let transaction = await ticketMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
        await transaction.wait()
  
        transaction = await ticketMaster.connect(deployer).withdraw()
        await transaction.wait()
      })
  
      it('Updates the owner balance', async () => {
        const balanceAfter = await ethers.provider.getBalance(deployer.address)
        expect(balanceAfter).to.be.greaterThan(balanceBefore)
      })
  
      it('Updates the contract balance', async () => {
        const balance = await ethers.provider.getBalance(ticketMaster.address)
        expect(balance).to.equal(0)
      })
    })
  
})

