/* eslint-disable no-undef */
import contract from 'truffle-contract'
import ZapScoreABI from '../contracts/ZapScore.json'
import Web3 from 'web3'

const LtvAPI = {
    instance: null,
    getInstance: async function () {
        if (this.instance != null) return this.instance

        const ZapScore = contract(ZapScoreABI)
        const web3 = new Web3('https://sepolia.base.org');
            ZapScore.setProvider(web3.currentProvider)

        try {
            this.instance = await ZapScore.deployed()
            return this.instance
        } catch (error) {
            console.error(error);
            return null
        }
    },
    getZapScore: async function (userAddress) {
        const instance = await this.getInstance()
        if (instance == null) return null
        let score = await instance.getScore(userAddress)
        if (score >= 100) {
            score = 99
        }

        let nScore = (100 - score)
        let label = ''
        let tag = ''

        if (nScore <= 40) {
            label = 'Poor'
            tag = 'bad'
        } else if (nScore <= 80) {
            label = 'Good'
            tag = 'good'
        } else {
            label = 'Excellent'
            tag = 'excellent'
        }

        return {
            score: nScore,
            label: label,
            tag: tag
        }
    }
}

export default LtvAPI