import BmoCsvParser from '../BmoCsvParser'

const csvData = [
  'Following data is valid as of 20180927111542 (Year/Month/Day/Hour/Minute/Second)',
  '',
  '',
  'First Bank Card,Transaction Type,Date Posted, Transaction Amount,Description',
  '',
  '',
  '\'500766**********\',DEBIT,20180628,-650.0,[SO]2211#8503-567 ',
  '\'500766**********\',CREDIT,20180629,2595.11,[DN]THE WORKING GRO PAY/PAY  ',
  '\'500766**********\',CREDIT,20180629,0.01,[IN]  ',
  '\'500766**********\',CREDIT,20180629,325.0,[CW]INTERAC E-TRANSFER       RECEIVED 20181801732942BE7   '
]

const expectedTransactions = [
  {
    institution: 'BMO',
    account: '\'500766**********\'',
    type: 'sell',
    ticker: 'CAD',
    shares: -650,
    bookValue: 1,
    description: '[SO]2211#8503-567',
    createdAt: 1530158400000
  },
  {
    institution: 'BMO',
    account: '\'500766**********\'',
    type: 'buy',
    ticker: 'CAD',
    shares: 2595.11,
    bookValue: 1,
    description: '[DN]THE WORKING GRO PAY/PAY',
    createdAt: 1530244800000
  },
  {
    institution: 'BMO',
    account: '\'500766**********\'',
    type: 'buy',
    ticker: 'CAD',
    shares: 0.01,
    bookValue: 1,
    description: '[IN]',
    createdAt: 1530244800000
  },
  {
    institution: 'BMO',
    account: '\'500766**********\'',
    type: 'buy',
    ticker: 'CAD',
    shares: 325,
    bookValue: 1,
    description: '[CW]INTERAC E-TRANSFER       RECEIVED 20181801732942BE7',
    createdAt: 1530244800000
  }
]

describe('BMO CSV parser', () => {
  describe('parse', () => {
    it('returns transactions', async () => {
      const file = new File([csvData.join('\n')], 'test.csv', { type: 'text/csv' })
      const { transactions, errors } = await new BmoCsvParser().parse(file, { ticker: 'CAD' })

      expect(errors.base.length).toBe(0)
      expect(Object.keys(errors.transactions).length).toBe(0)
      expect(transactions).toMatchObject(expectedTransactions)
      expect(transactions[0].id).not.toBeNull()
    })

    it('fails if the header doesn\'t match', async () => {
      // Remove spaces from header
      const oldHeader = csvData[3].split(',').map(string => string.trim()).join(',')
      csvData[3] = 'something else'
      const file = new File([csvData.join('\n')], 'test.csv', { type: 'text/csv' })
      const { transactions, errors } = await new BmoCsvParser().parse(file)

      expect(transactions.length).toBe(0)
      expect(errors.base.length).toBe(5)
      expect(errors.base[0]).toBe(`Invalid header. Expected [${oldHeader}] but found [${csvData[3]}]`)
      expect(Object.keys(errors.transactions).length).toBe(0)
    })
  })
})
