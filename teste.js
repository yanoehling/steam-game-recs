user = {
    x: "a", 
    y: "b", 
    friends: [
        {
            friend: "raiden",
            recs: ["tft"]
        }, {
            friend: "patrick",
            recs: ["lol"]
        }]}

const friendUsernames = user.friends.map(f => f.friend);
console.log(friendNames)
