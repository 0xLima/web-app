import jazzicon from 'jazzicon'

const Profile = {
    generate: function (diameter = 100, address) {
        let seed = address.split(/ /)[0].replace(/[^\d]/g, '')
        return jazzicon(diameter, seed)
    },
    shortAddress: function (address, pad, gap = '...') {
        return address.substring(0, pad) + gap +
            address.substring(address.length - pad,
                address.length)
    },
    shortName: function (address, pad) {
        if (address.toLowerCase() == "0xe3f7876FD6130B9023Be4F7f991f74F1EdD392ca".toLowerCase()) {
            return 'James.base.eth'
        }
        if (address.toLowerCase() == "0x2Bd53ba464877B1Ef022c4ED9E5016EA20d70eaD".toLowerCase()) {
            return 'Lily.base.eth'
        }
        let name = address.replace(/[^a-zA-Z]/gm,"")
        return '0x' + name.substring(1, pad)  + '.base.eth'
    },
}

export default Profile