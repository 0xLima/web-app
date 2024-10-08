<template>
    <main>
        <div class="progress_box" v-if="fetching">
            <ProgressBox />
        </div>

        <div class="lends" v-else>
            <RouterLink v-for="offer, fIndex in offers" :to="`/discover/borrowers/${offer._id}`" :key="offer.offerId">
                <div class="lend">
                    <div class="asset">
                        <div class="label">
                            <p>Principal needed</p>
                            <p>Collateral</p>
                        </div>
                        <div class="tokens">
                            <div>
                                <img :src="`/images/${$findAsset(offer.principalToken).image}.png`" alt="">
                                <p>{{ $fromWei(offer.currentPrincipal) }} {{ $findAsset(offer.principalToken).symbol }}</p>
                            </div>
                            <div>
                                <img src="/images/usdc.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="info">
                        <div class="duration">
                            <p>Duration</p>
                            <div>
                                <IconClock />
                                <p>{{ offer.daysToMaturity }} Days</p>
                            </div>
                        </div>
                        <div class="interest">
                            <p>Interest</p>
                            <div>
                                <IconInterest />
                                <p>{{ getInterest(offer.interest, offer.daysToMaturity) }} %</p>
                            </div>
                        </div>
                    </div>
                    <div class="expire" v-if="offer.loans.length == 0">
                        <p>Offer expires in</p>
                        <p>{{ getExpire(offer) }}</p>
                    </div>
                    <div class="progress" v-else>
                        <div class="users">
                            <div class="img" v-for="loan, index in offer.loans" :key="index"
                                :id="`${fIndex}img_lender${index}`">
                            </div>
                            <div class="extra_user">{{ offer.loans.length }}</div>
                        </div>
                        <div class="needed">
                            <div class="label">
                                <p>{{ $toMoney($fromWei(offer.currentPrincipal)) }} <span>/ {{
                                    $toMoney($fromWei(offer.initialPrincipal)) }} {{
        $findAsset(offer.principalToken).symbol }}</span></p>
                                <IconInfo />
                            </div>
                            <div class="bar">
                                <div class="percentage" :style="`width: ${$progress(offer)}%`"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </RouterLink>
        </div>

        <div class="t_empty" v-if="!fetching && offers.length == 0">
            <img src="../../../../assets/images/receipt-text.png" alt="">
            <p>No Borrowers found.</p>
        </div>
    </main>
</template>


<script setup>
import IconClock from '../../../icons/IconClock.vue';
import IconInfo from '../../../icons/IconInfo.vue';
import IconInterest from '../../../icons/IconInterest.vue';
import ProgressBox from '../../../ProgressBox.vue'
</script>

<script>
import Countdown from '../../../../utils/Countdown';
import Profile from '../../../../scripts/Profile';
export default {
    data() {
        return {
            offers: [],
            fetching: true
        }
    },
    created() {
        this.fetchLendingOffers()
    },
    methods: {
        getInterest: function (rate, daysToMaturity) {
            let result = rate * daysToMaturity * 24 * 60 * 60
            let interest = this.$fromWei(result.toString())
            return this.$toMoney(interest)
        },
        getExpire: function (offer) {
            let txt = ''
            let due = offer.expiresAt * 1000
            Countdown.start(due, (text) => {
                txt = text
            })
            return txt
        },
        fetchLendingOffers: function () {
            this.fetching = true
            this.axios.get('https://zapsterfinance.onrender.com/offers?offerType=1').then(response => {
                const offers = response.data
                const now = (Date.now() / 1000).toFixed(0)

                this.offers = offers.filter(offer => {
                    if (offer.currentCollateral == 0 || offer.initialCollateral == 0) {
                        return false
                    } else if (offer.loans.length == 0) {
                        return offer.expiresAt > now
                    } else {
                        return true
                    }
                })

                this.fetching = false
            }).catch(error => {
                console.error(error);
                this.fetching = false
            })
        },
        generateImages: function () {
            if (this.offers) {
                for (let fIndex = 0; fIndex < this.offers.length; fIndex++) {
                    const offer = this.offers[fIndex];
                    for (let index = 0; index < offer.loans.length; index++) {
                        const loan = offer.loans[index];
                        let el = Profile.generate(30, loan.lender)
                        let dom = document.getElementById(`${fIndex}img_lender${index}`)
                        if (dom && dom.childNodes.length == 0) {
                            dom.appendChild(el)
                        }
                    }
                }
            }
        }
    },
    mounted() {
        this.generateImages()
    },
    updated() {
        this.generateImages()
    }
}
</script>

<style scoped>
.progress_box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 200px;
}

.lends {
    display: flex;
    flex-wrap: wrap;
    padding: 40px 60px;
    gap: 30px;
}

.lend {
    width: 333px;
    background: var(--bglight);
    border-radius: 6px;
    overflow: hidden;
    transition: .2s;
    /* border: 2px transparent solid; */
}

.lend:hover {
    transform: translateY(-2px);
    /* border: 2px var(--bglighter) solid; */
}

.asset {
    padding: 26px 20px;
    border-bottom: 1px solid var(--background);
}

.asset>div {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.asset>.label>p {
    font-weight: 500;
    font-size: 14px;
    color: var(--textdimmed);
}

.asset>.label {
    margin-bottom: 16px;
}

.asset .tokens>div {
    display: flex;
    align-items: center;
    gap: 12px;
}

.asset .tokens>div p {
    font-weight: 500;
    font-size: 16px;
    color: var(--textnormal);
}

.asset .tokens>div:first-child img {
    width: 24px;
}

.asset .tokens>div:nth-child(2) img {
    width: 18px;
}

.asset .tokens>div:nth-child(2) {
    height: 30px;
    width: 34px;
    background: var(--bglighter);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}

.info {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border-bottom: 1px solid var(--background);
}

.info .duration {
    border-right: 1px solid var(--background);
}

.info>div>p {
    font-weight: 500;
    font-size: 14px;
    color: var(--textdimmed);
}

.info>div>div {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
}

.info>div {
    padding: 26px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.info>div>div p {
    font-weight: 500;
    font-size: 14px;
    color: var(--textnormal);
}

.expire,
.progress {
    height: 72px;
    background: var(--bglighter);
    padding: 0 20px;
    display: flex;
    align-items: center;
}

.progress {
    justify-content: space-between;
}

.users {
    display: flex;
    align-items: center;
}

.users img,
.users .img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-left: -16px;
    background: var(--bglight);
}

.users img:first-child,
.users .img:first-child {
    margin: 0;
}

.extra_user {
    width: 40px;
    height: 32px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background);
    font-weight: 500;
    font-size: 12px;
    color: var(--textdimmed);
    margin-left: -16px;
    z-index: 1;
}

.needed>div {
    display: flex;
    align-items: center;
    gap: 6px;
}

.needed>div>p {
    font-weight: 500;
    font-size: 12px;
    color: var(--textnormal);
}

.needed>div>p span {
    color: var(--textdimmed);
}

.bar {
    width: 120px;
    height: 6px;
    border-radius: 6px;
    background: var(--background);
    margin-top: 12px;
}

.percentage {
    height: 100%;
    background: var(--primary);
    border-radius: 6px;
}

.expire {
    text-align: center;
    flex-direction: column;
    justify-content: center;
}

.expire p:first-child {
    font-weight: 500;
    font-size: 12px;
    color: var(--textdimmed);
}

.expire p:nth-child(2) {
    font-weight: 500;
    font-size: 12px;
    color: var(--textnormal);
    margin-top: 6px;
}


.t_empty {
    width: 100%;
    height: 298px;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
}

.t_empty p {
    font-weight: 400;
    font-size: 14px;
    color: var(--textdimmed);
}
</style>