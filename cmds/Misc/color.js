const Command = require("../../lib/structures/Command");

class colorCommand extends Command {
  constructor(...args) {
    super(...args, {
      args: "[color:string]",
      aliases: ["colour", "hex", "hexcode", "hexcolor", "hexcolour"],
      description: "Previews a hex or generates a random color.",
    });
  }

  run(msg, args) {
    args = args.join();
    // Sets the color
    let color;
    const hexcheck = /[#]?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/.exec(args);
    const rgbcheck = /([0-9]{1,3})[, ]{1,2}([0-9]{1,3})[, ]{1,2}([0-9]{1,3})/.exec(args);
    // Checks for the color's name
    const namecheck = require("../../lib/utils/Colors").names.find(name => name[1].toLowerCase().startsWith(args.toLowerCase()));
    if (hexcheck && !rgbcheck) color = this.hexToRGB(hexcheck[0]);
    else if (rgbcheck) color = {
      r: parseInt(rgbcheck[1]),
      g: parseInt(rgbcheck[2]),
      b: parseInt(rgbcheck[3]),
    };

    // Randomly sets a color if no args are given
    else if (!args) color = this.hexToRGB(Math.floor(Math.random() * 16777215).toString(16));
    else if (namecheck) color = this.hexToRGB(namecheck[0]);
    if (!color) return msg.channel.createMessage(this.bot.embed("❌ Error", "Invalid hex or color.", "error"));
    const hex = this.rgbToHex(color.r, color.g, color.b);

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: `🎨 ${require("../../lib/utils/Colors").name(hex)[1]}`,
        description: `**RGB**: ${color.r}, ${color.g}, ${color.b}\n**Hex**: #${hex.toUpperCase()}`,
        color: parseInt(`0x${hex}`),
      },
    });
  }

  // Converts RGB to Hex
  rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // Converts hex to RGB
  hexToRGB(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    // Sets the result
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }
}


module.exports = colorCommand;