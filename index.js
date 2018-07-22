const snekfetch = require("snekfetch"),
    Websocket = require("ws"),
    hqUserAgent = "HQ/1.2.19 (co.intermedialabs.hq; build:79; iOS 10.3.3) Alamofire/4.6.0",
    hqClient = "iOS/1.2.19 b79",
    hqUsersEndpoint = "https://api-quiz.hype.space/users";
    hqShowsEndpoint = "https://api-quiz.hype.space/shows/now";
    hqLeaderboardEndpoint = "https://api-quiz.hype.space/users/leaderboard?mode=1";
    hqVerificationsEndpoint = "https://api-quiz.hype.space/verifications";
    hqSelfDataEndpoint = "https://api-quiz.hype.space/users/me";
    hqFriendsEndpoint = "https://api-quiz.hype.space/friends";

class hqjsmodule {
    constructor(bearer, userId) {
        if (bearer != null) {
            this.bearer = bearer;
        } else {
            console.log('You need to pass your bearer token.');
        }
        if (userId != null) this.userId = userId;
    }

    async getUserData(username){
        return new Promise((resolve, reject) => {
            if (!this.bearer) return;
            if (!username) return reject("Username is not passed.");
            snekfetch.get(`${hqUsersEndpoint}?q=${username}`).set({'Authorization': `Bearer ${this.bearer}`}).then(res => {
                if (res.body.data[0]){
                    snekfetch.get(`${hqUsersEndpoint}/${res.body.data[0].userId}`).set({'Authorization': `Bearer ${this.bearer}`}).then(res1 => {
                        return resolve(res1.body)
                    }).catch(e1 => reject(e1.body))
                } else {
                    return reject("Could not find a user with that username.")
                }
            }).catch(e => reject(e.body))
        });
    }

    async getGameData(){
        return new Promise((resolve, reject) => {
            if (!this.bearer) return;
            snekfetch.get(hqShowsEndpoint).set({'Authorization': `Bearer ${this.bearer}`}).then(res => {
                if (res.body.active){
                    resolve(res.body.broadcast)
                } else {
                    return reject("No game live.")
                }
            }).catch(e => reject(e));
        })
    }

    async getNextGame(){
        return new Promise((resolve, reject) => {
            if (!this.bearer) return;
            snekfetch.get(hqShowsEndpoint).set({'Authorization': `Bearer ${this.bearer}`}).then(res => {
                resolve(res.body.upcoming[0])
            }).catch(e => reject(e));
        })
    }
    async getLeaderboard(){
        return new Promise((resolve, reject) => {
            if(!this.bearer) return;
            snekfetch.get(hqLeaderboardEndpoint).set({'Authorization': `Bearer ${this.bearer}`}).then(res => {
                resolve(res.body.data)
            }).catch(err => reject(err));
        });
    }

    async createPhoneVerification(number){
        return new Promise((resolve, reject) => {
            if (!this.bearer) return;
            if (!number) return reject("Phone number has not been passed.")
            snekfetch.post(hqVerificationsEndpoint).set({'User-Agent': hqUserAgent, "x-hq-client": hqClient}).send({"method": "sms", "phone": number}).then(res =>{
                resolve(res.body)
            }).catch(e => reject(e.body));
        });
    }

    async verifySms(verificationId, code){
        return new Promise((resolve, reject) => {
            if (!this.bearer) return;
            if (!verificationId) return reject("Verification ID is missing.");
            if (!code) return reject("Verification code is missing.")
            snekfetch.post(`${hqVerificationsEndpoint}/${verificationId}`).set({'User-Agent': hqUserAgent, "x-hq-client": hqClient}).send({"code": code}).then(res => {
                resolve(res.body)
            }).catch(e => reject(e.body));
        });
    }

    async createAccount(verificationId, region, username, referrer){
        return new Promise((resolve, reject) => {
            if (!this.bearer) return;
            if (!verificationId) return reject("Verification ID is missing.");
            if (!code) return reject("Region name is missing.")
            if (!username) return reject("Username is missing.")
            if (!referrer) return reject("Referrer name is missing.")
            snekfetch.post(hqUsersEndpoint).set({'User-Agent': hqUserAgent, "x-hq-client": hqClient}).send({'locale': region,'username': username,'verificationId': verificationId,'language': 'en','referringUsername': referrer}).then(res => {
                resolve(res.body)
            }).catch(e => reject(e.body));
        });
    }

    async getSelfData(){
        return new Promise((resolve, reject) => {
            if (!this.bearer) return;
            snekfetch.get(hqSelfDataEndpoint).set({"Authorization": `Bearer ${this.bearer}`}).then(r => {
                resolve(r.body);
            }).catch(e => reject(e.body))
        });
    }
    async getFriendsData(){
        return new Promise((resolve, reject) => {
            if (!this.bearer) return;
            snekfetch.get(hqFriendsEndpoint).set({"Authorization": `Bearer ${this.bearer}`}).then(r => {
                resolve(r.body);
            }).catch(e => reject(e.body))
        })
    }
}
module.exports = hqjsmodule;