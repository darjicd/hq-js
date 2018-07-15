const snekfetch = require("snekfetch"),
    hqUsersEndpoint = "https://api-quiz.hype.space/users",
    hqShowsEndpoint = "https://api-quiz.hype.space/shows/now";
    hqLeaderboardEndpoint = "https://api-quiz.hype.space/users/leaderboard?mode=1";

class hqjsmodule {
    constructor(bearer) {
        if (bearer != null) {
            this.bearer = bearer;
        } else {
            console.log('You need to pass your bearer token.');
        }
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
            snekfetch.get(hqLeaderboardEndpoint).set({"Authorization" : `Bearer ${this.bearer}`}).then(res => {
                resolve(res.body.data)
            }).catch(err => reject(err));
        });
    }
}

module.exports = hqjsmodule;