const { getRedditPost } = require("../utils/common");

module.exports = {
  name: "dank",
  args: false,
  description: "Get a random meme from some meme-containing subreddits",
  execute: async (message) => {
    const subreddits = [
      "dankmemes",
      "historymemes",
      "memes",
      "me_irl",
      "rance",
      "suddenlygay",
      "prequelmemes",
      "2meirl4meirl",
      "fakehistoryporn",
      "okpolarncp",
      "okbuddyretard",
      "okkamuretardi",
      "bertstrips",
      "alabamamemes",
      "deepfriedmemes",
      "sesamestreetmemes",
      "toiletpaperusa",
      "surrealmemes"
    ];

    const random = subreddits[Math.floor(Math.random() * subreddits.length)];
    const post = await getRedditPost(random, "day", 100);
    post
      ? message.channel.send(post)
      : message.channel.send("Failed to fetch dank meme.");
  }
};
