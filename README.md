# Ticket Bot

A simple home-made ticket bot with hastebin transcript !


## Authors

- [@Its0xyToan](https://github.com/Its0xyToan)
- [@Fazenz](https://github.com/Fazenz)
## Requirements
#### Node.js Requirements:


|   Name     |         Download            |
| :--------  | :------------------------- |
| Discord.js |     `npm i discord.js@v13.10.3`     |
|  hastebin  |  `npm i hastebin@latest`   |
| Yaml  | `npm i yaml-config@latest` |

## Usage/Examples

- 1: Download the code
- 2: Execute `npm i` in the terminal

- 3: Modify the ticket-config.js file:
```javascript
class config {
    constructor() {
        this.token = "token"// The token of your bot here !
        this.catopen = "1015267866276278322" // The open tickets category id
        this.catclose = "1015267880595628052" // The close tickets category id
        this.staff = "1015267532158025799" // The id of the staff role !
        this.logChannel = "1015280470210138154" // The id of the channel where transcripts will be saved !
    }
}

module.exports = new config()
```

- 4: Modify the texts-config.yaml file.

- 5: Go to a discord server and type !newticketpanel, this will create the panel for you !
## Contributing

Contributions are always welcome!

For contributions, please make a pull request, or dm me on discord: `0xyToan\n#0001`
