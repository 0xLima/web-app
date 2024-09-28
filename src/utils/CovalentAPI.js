import axios from "axios"

const CovalentAPI = {
    baseUrl: 'https://api.covalenthq.com/v1/',
    getTokenBalances: async function(address, chainId = 84532) {
        try {
            const options = {
                method: 'GET',
                url: `${this.baseUrl}${chainId}/address/${address}/balances_v2/`,
                params: {
                    'quote-currency': 'USD',
                    'format': 'JSON',
                    'nft': false,
                    'no-nft-fetch': false,
                    'key': 'cqt_rQPR4D8Wh9FJmqQtyBgFpPc8JHXd'
                }
            }

            const response = await axios.request(options)
            return response.data
        } catch (error) {
            return null
        }
    }
}

export default CovalentAPI