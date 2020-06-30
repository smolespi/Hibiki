const Command = require("structures/Command");
const fetch = require("node-fetch");

class nasaimageCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["nasa", "nasaimg", "space", "spaceimage", "spaceimg", "spacephoto"],
      args: "<query:string>",
      description: "Sends an image from NASAs archive.",
      cooldown: 3,
    });
  }

  async run(msg, args) {
    // Fetches the API
    const nasamsg = await this.bot.embed("☄ NASA Image", "Searching NASA's archive...", msg);
    const body = await fetch(`https://images-api.nasa.gov/search?media_type=image&q=${encodeURIComponent(args.join(" "))}`)
      .then(async res => await res.json().catch(() => {}));
    const images = body.collection.items;
    const data = images[Math.floor(Math.random() * images.length)];
    if (!data) return this.bot.embed.edit("❌ Error", "No images found.", nasamsg, "error");

    nasamsg.edit({
      embed: {
        title: "☄ NASA Image",
        description: data.data[0].description.length > 2000 ? `${data.data[0].description.substring(0, 2000)}...` : data.data[0].description,
        color: 0x0B3D91,
        image: {
          url: data.links[0].href,
        },
        footer: {
          text: `Ran by ${this.bot.tag(msg.author)}`,
          icon_url: msg.author.dynamicAvatarURL(),
        },
      },
    });
  }
}

module.exports = nasaimageCommand;