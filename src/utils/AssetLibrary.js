const AssetLibrary = {
    assets: [
        {
            id: 0,
            symbol: 'ETH',
            name: 'Ethereum',
            shortName: 'Ethereum',
            image: 'eth',
            type: 'native',
            address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            maxDecimal: 6,
            faucetAmount: '0',
            minLendOffer: 0.05,
            maxLendOffer: 20,
            minBorrowOffer: 0.05,
            maxBorrowOffer: 5
        },
        {
            id: 1,
            symbol: 'WBTC',
            name: 'Wrapped Bitcoin',
            shortName: 'Bitcoin',
            image: 'btc',
            type: 'native',
            address: '0xe0327fCf38c61584FF2AE33047a1C2b43D3a477f',
            maxDecimal: 10,
            faucetAmount: '1000000000000000000',
            minLendOffer: 0.008,
            maxLendOffer: 0.6,
            minBorrowOffer: 0.008,
            maxBorrowOffer: 0.5
        }, {
            id: 2,
            symbol: 'cbETH',
            name: 'Coinbase Wrapped Ethereum',
            shortName: 'cbETH',
            image: 'cbeth',
            type: 'native',
            address: '0x19d1B61053a9C89913F0Ac6094BBB965B8eE225d',
            maxDecimal: 5,
            faucetAmount: '5000000000000000000',
            minLendOffer: 0.05,
            maxLendOffer: 10,
            minBorrowOffer: 0.05,
            maxBorrowOffer: 5
        }, {
            id: 3,
            symbol: 'DAI',
            name: 'DAI Stablecoin',
            shortName: 'DAI',
            image: 'dai',
            type: 'stable',
            address: '0x056fFd854eafbB1A144d3c94F2F3Edca92ED3A82',
            maxDecimal: 2,
            faucetAmount: '100000000000000000000',
            minLendOffer: 20,
            maxLendOffer: 20000,
            minBorrowOffer: 20,
            maxBorrowOffer: 10000
        }, {
            id: 4,
            symbol: 'USDC',
            name: 'USD Coin',
            shortName: 'USDC',
            image: 'usdc',
            type: 'stable',
            address: '0xcb80f001417D7EcB790969df0174D9c6d76474B3',
            maxDecimal: 2,
            faucetAmount: '100000000000000000000',
            minLendOffer: 20,
            maxLendOffer: 20000,
            minBorrowOffer: 20,
            maxBorrowOffer: 10000
        }, {
            id: 5,
            symbol: 'LINK',
            name: 'Chainlink',
            shortName: 'LINK',
            image: 'link',
            type: 'native',
            address: '0xb33A788E6077e309D3649969A2467037A4Cefbf0',
            maxDecimal: 2,
            faucetAmount: '50000000000000000000',
            minLendOffer: 10,
            maxLendOffer: 2000,
            minBorrowOffer: 10,
            maxBorrowOffer: 1000
        },
    ],
    findAsset: function(address) {
        return this.assets.find(asset => asset.address.toLowerCase() == address.toLowerCase())
    },
    otherAssets: function(address) {
        return this.assets.filter(asset => asset.address.toLowerCase() != address.toLowerCase())
    },
    findConjugates: function(type, except = null) {
        return this.assets.filter(asset => asset.type != type && asset.address != except)
    }
}

export default AssetLibrary