<template>
    <main>
        <div class="box">
            <div class="title">
                <h3>Lend</h3>
                <div class="close" v-if="!lending" v-on:click="$emit('close')">
                    <IconClose />
                </div>
            </div>
            <div>
                <p>Borrow Amount</p>
                <div>
                    <p>{{ $toMoney($fromWei(getPrincipal())) }}</p>
                    <div>
                        <img :src="`/images/${$findAsset(offer.principalToken).image}.png`" alt="">
                        <p>{{ $findAsset(offer.principalToken).symbol }}</p>
                    </div>
                </div>
            </div>
            <div class="slider">
                <Slider v-model="percentage" :step="25" :max="max()" :format="{ suffix: '%' }" />
            </div>
            <div>
                <p>Collateral You'll Get</p>
                <div>
                    <p>{{ $toMoney($fromWei(getCollateral())) }}</p>
                    <div class="click_1" v-on:click="dropDown = !dropDown">
                        <img :src="`/images/${$findAsset(offer.collateralToken).image}.png`" alt="">
                        <p>{{ $findAsset(offer.collateralToken).symbol }}</p>
                    </div>
                </div>
                <div>
                    <input type="checkbox" name="" id="">
                    <p>Read and Agreed to our <a href="" target="_blank">Terms & Policy?</a></p>
                </div>
            </div>
            <div>
                <PrimaryButton :progress="approving" :state="approving ? 'disable' : ''"
                    v-if="Number($fromWei(allowance)) < Number($fromWei(getPrincipal()))" v-on:click="approve()"
                    :text="`Approve ${$findAsset(offer.principalToken).symbol}`" />

                <PrimaryButton :progress="lending" :state="lending ? 'disable' : ''" v-else v-on:click="lendLoan()"
                    :text="'Lend'" />

            </div>
        </div>
    </main>
</template>

<script setup>
import Slider from '@vueform/slider'
import IconClose from '../../../icons/IconClose.vue';
import PrimaryButton from '../../../PrimaryButton.vue';
</script>

<script>
import Authentication from '../../../../scripts/Authentication'
import LendingPoolAPI from '../../../../scripts/LendingPoolAPI'
import { messages } from '../../../../reactives/messages';
export default {
    props: ['offer'],
    data() {
        return {
            percentage: 25,
            collateralAmount: '0',
            allowance: '0',
            lending: false,
            dropDown: false,
            approving: false
        }
    },
    watch: {
        percentage: function () {
            this.getAllowance()
        }
    },
    methods: {
        max: function () {
            return (this.offer.currentPrincipal / this.offer.initialPrincipal) * 100
        },
        getPrincipal: function () {
            let principal = this.offer.initialPrincipal * (this.percentage / 100)
            return principal.toString()
        },
        getCollateral: function () {
            let collateral = this.offer.initialCollateral * (this.percentage / 100)
            return collateral.toString()
        },
        getAllowance: async function () {
            this.approving = true
            let amount = await this.$allowanceOf(
                await Authentication.userAddress(),
                this.offer.principalToken,
                LendingPoolAPI.address
            )
            this.approving = false
            this.allowance = amount
        },
        approve: async function () {
            this.approving = true
            await this.$approve(
                await Authentication.userAddress(),
                this.offer.principalToken,
                LendingPoolAPI.address
            )
            this.approving = false
            this.getAllowance()
        },
        lendLoan: async function () {
            if (this.lending) return

            this.lending = true
            const trx = await LendingPoolAPI.acceptBorrowingOffer(
                this.offer.offerId,
                this.percentage,
                this.getPrincipal(),
                this.offer.principalToken,
                await Authentication.userAddress()
            )

            if (trx && trx.tx) {
                messages.insertMessage({
                    title: 'Loan lent',
                    description: 'Loan was successfully created.',
                    type: 'success',
                    linkTitle: 'View Trx',
                    linkUrl: `https://sepolia.basescan.org/tx/${trx.tx}`
                })
                this.$emit('done')
            } else {
                messages.insertMessage({
                    title: 'Lend failed',
                    description: 'Loan failed to create.',
                    type: 'failed'
                })
            }

            this.$emit('done')
            this.$emit('close')

            this.lending = false
        }
    },
    mounted() {
        this.getAllowance()
        document.body.classList.add('modal')
    },
    unmounted() {
        document.body.classList.remove('modal')
    }
}
</script>

<style src="@vueform/slider/themes/default.css"></style>
<style scoped>
main {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    background: rgba(20, 20, 22, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fade_in .2s ease-in-out;
}

.box {
    width: 500px;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: var(--bglight);
    border-radius: 6px;
    overflow: hidden;
    animation: slide_in_up .2s ease-in-out;
}

.title {
    height: 70px;
    width: 100%;
    background: #141416;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title h3 {
    font-weight: 500;
    font-size: 16px;
    color: var(--textnormal);
}

.title div {
    width: 30px;
    height: 30px;
    background: var(--bglighter);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.box>div:nth-child(2) {
    margin: 0 30px;
    padding-top: 30px;
    margin-bottom: 40px;
    border-bottom: 1px solid var(--background);
}

.box>div:nth-child(2)>p {
    font-weight: 500;
    font-size: 14px;
    color: var(--textdimmed);
}

.box>div:nth-child(2)>div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
}

.box>div:nth-child(2)>div>div {
    height: 50px;
    padding: 0 20px;
    background: var(--bglighter);
    border-radius: 4px 4px 0px 0px;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
}

.box>div:nth-child(2)>div:nth-child(2) img {
    width: 24px;
    height: 24px;
}

.box>div:nth-child(2)>div p:first-child {
    font-weight: 500;
    font-size: 20px;
    color: var(--textnormal);
}

.box>div:nth-child(2)>div>div>p {
    font-weight: 400;
    font-size: 14px;
    color: var(--textnormal);
}

.slider {
    padding: 30px;
    padding-top: 40px;
}

.box>div:nth-child(4) {
    margin: 0 30px;
    padding-top: 30px;
    margin-bottom: 20px;
}

.box>div:nth-child(4)>p {
    font-weight: 500;
    font-size: 14px;
    color: var(--textdimmed);
}

.box>div:nth-child(4)>div:nth-child(2) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    border-bottom: 1px solid var(--background);
}

.box>div:nth-child(4)>div:nth-child(2)>div {
    height: 50px;
    padding: 0 20px;
    background: var(--bglighter);
    border-radius: 4px 4px 0px 0px;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
}

.box>div:nth-child(4)>div:nth-child(2) img {
    width: 24px;
    height: 24px;
}

.box>div:nth-child(4)>div:nth-child(2) p:first-child {
    font-weight: 500;
    font-size: 20px;
    color: var(--textnormal);
}

.box>div:nth-child(4)>div:nth-child(2)>div>p {
    font-weight: 400;
    font-size: 14px;
    color: var(--textnormal);
}

.box>div:nth-child(4)>div:nth-child(3) {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 50px;
}

.box>div:nth-child(4)>div:nth-child(3) p {
    font-weight: 500;
    font-size: 14px;
    color: var(--textdimmed);
}


.box>div:nth-child(4)>div:nth-child(3) a {
    color: var(--primary);
    border-bottom: 1px var(--primary) solid;
}

.box>div:nth-child(5) {
    width: 100%;
    padding: 30px;
    background-image: url('/images/subtle_gradient.png');
    background-size: cover;
    background-repeat: no-repeat;
}

.click_1 {
    position: relative;
    cursor: pointer;
    user-select: none;
}

.drop_down {
    position: absolute;
    top: 50px;
    width: 100%;
    z-index: 4;
    background: var(--bglighter);
    border-radius: 4px;
}

.drop_item {
    height: 50px;
    padding: 0 20px;
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;
    border-bottom: 1px solid var(--bglightest);
}

.drop_item:first-child {
    border-top: 1px solid var(--bglightest);
}

.drop_item:last-child {
    border: none;
}

.drop_down img {
    width: 24px;
    height: 24px;
}

.drop_item p {
    font-weight: 400;
    font-size: 14px;
    color: var(--textnormal);
}
</style>