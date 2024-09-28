/* eslint-disable no-undef */
const Authentication = {
    userAddress: async function (request = false, callback = null) {
        if (typeof ethereum === 'undefined') return null
        try {
            if (!this.isAuth() && !request) return null
            await ethereum.request({
                method: 'eth_requestAccounts'
            });
            await this.switchToBaseSepolia()
            let accounts = await ethereum.enable();
            ethereum.on('accountsChanged', (_accounts) => {
                if (_accounts.length == 0) {
                    this.setAuth("false")
                } else {
                    accounts = _accounts
                }
                if (callback) {
                    callback()
                }
            })
            this.setAuth("true")
            return accounts[0]
        } catch (error) {
            console.error(error);
            return null
        }
    },

    isAuth: function () {
        if (typeof (Storage) !== "undefined") {
            return localStorage.getItem("auth") == "true"
        }
        return false
    },

    setAuth: function (value) {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("auth", value)
        }
    },

    logOut: function () {
        this.setAuth("false")
    },

    switchToBaseSepolia: async function () {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x14a34' }],
            });
        } catch (error) {
            if (error.code === 84532) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x14a34',
                            chainName: 'Base Sepolia',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            blockExplorerUrls: ['https://sepolia.basescan.org'],
                            rpcUrls: ['https://sepolia.base.org'],
                        },],
                    });
                } catch (addError) {
                    console.error(addError);
                }
            }
        }
    },
}

export default Authentication