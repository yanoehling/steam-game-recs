const BASE_URL = "http://localhost:5000"; // ou a porta que estiver usando


async function testAddFriend() {
  const res = await fetch(`${BASE_URL}/add-friend`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: "685b47f48b50878c830f0aa0", //yanma
      friendId: "685f270626058ab349255fcb" //player_raiden
    })
  });

  const data = await res.json();
  console.log("add-friend:", data);
}


async function testDeleteFriend() {
  const res = await fetch(`${BASE_URL}/delete-friend`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: "685b47f48b50878c830f0aa0", //yanma
      friendId: "685f270626058ab349255fcb" //player_raiden
    })
  });

  const data = await res.json();
  console.log("delete-friend:", data);
}


async function testAddRecommendation() {
  const res = await fetch(`${BASE_URL}/add-recommendation`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      senderId: "685b47f48b50878c830f0aa0", //yanma
      receiverId: "685f270626058ab349255fcb", //player_raiden
      gameId: "685d9527a24a6417a51e8d68" //spider man
    })
  });

  const data = await res.json();
  console.log("add-recommendation:", data);
}


async function testDeleteRecommendation() {
  const res = await fetch(`${BASE_URL}/delete-recommendation`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: "685f270626058ab349255fcb", //player_raiden
      toDeleteId: "685b47f48b50878c830f0aa0",  //yanma
      gameId: "685d9527a24a6417a51e8d68" //spider man
    })
  });

  const data = await res.json();
  console.log("delete-recommendation:", data);
}


async function testGetGames() {
  const res = await fetch(`${BASE_URL}/games`);
  const data = await res.json();
  console.log("games:", data);
}


async function testGetGame() {
  const res = await fetch(`${BASE_URL}/get-game?gameId=685d9527a24a6417a51e8d64`); //hollow knight
  const data = await res.json();
  console.log("get-game:", data);
}


// await testAddFriend(); // OK
// await testDeleteFriend(); // OK
// await testGetGames(); // OK
// await testGetGame(); // OK

//await testAddRecommendation();
await testDeleteRecommendation();

