const Discord = require("discord.js")
const {MessageEmbed} = require('discord.js')
let hastebin = require('hastebin');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES', 'GUILD_PRESENCES', 'GUILD_BANS'], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const config = require("./ticket-config.js")
const yconfig = require('yaml-config');
var text_panel = yconfig.readConfig('./texts-config.yaml', 'ticket_panel');
var text_ticket = yconfig.readConfig('./texts-config.yaml', 'in_tickets');
var text_support = yconfig.readConfig('./texts-config.yaml', 'support_control');

client.on("ready", () => {
    console.log(client.user.tag)
})

client.on("messageCreate", message => {
        if(message.author.bot) return;
        if(message.member.permissions.has("MANAGE_MESSAGES")){
        if(message.content === "!newticketpanel"){
   var row = new Discord.MessageActionRow()
        .addComponents(new Discord.MessageButton()
            .setCustomId("open-ticket")
            .setLabel(text_panel.buttons.open_ticket)
            .setStyle(text_panel.buttons.open_ticket_style)
        );
        const Ticketembed = new MessageEmbed()
            .setColor(text_panel.color)
            .setTitle(text_panel.title)
            .setDescription(text_panel.description)
            .setFooter({ text: text_panel.footer  });
        
        message.channel.send({ embeds: [Ticketembed], components: [row] });
        message.delete()
}}});
    client.on("interactionCreate", interaction => {
        if(interaction.isButton()){
            if(interaction.customId === "open-ticket"){     
                interaction.guild.channels.create("ticket-" + interaction.user.username, {
                    parent: config.catopen,
                    topic: `${interaction.user.id}`,
                    permissionOverwrites: [
                       {
                         id: interaction.user.id,
                         type: 'member',
                         allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                       },
                       {
                           id: interaction.guild.id,
                           type: 'role',
                           deny: 'VIEW_CHANNEL'
                         },
                       {
                           id: config.staff,
                           type: 'role',
                           allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                       }  
                     ]
                }).then(channel =>{
                    var row = new Discord.MessageActionRow()
                       .addComponents(new Discord.MessageButton()
                           .setCustomId("close-ticket")
                           .setLabel(text_ticket.buttons.close_ticket)
                           .setStyle(text_ticket.buttons.close_ticket_style)
                       );
                       const embed7 = new MessageEmbed()
                       .setColor(text_ticket.color)
                       .setTitle(text_ticket.title)
                       .setDescription(text_ticket.description)
                       channel.send({  content: `<@&${config.staff}>, <@${interaction.user.id}>`,embeds: [embed7], components: [row] }).then(msg =>{
                            msg.pin()
                        })
                        
   
                       interaction.reply({content: text_panel.confirmation+" (<#"+channel.id+">)", ephemeral: true})
                       
                });
            }
            else if(interaction.customId === "close-ticket"){
                interaction.channel.setParent(config.catclose);
   
                var row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageButton()
                   .setCustomId("delete-ticket")
                   .setLabel(text_support.buttons.del_ticket)
                   .setStyle(text_support.buttons.del_ticket_style)
                , new Discord.MessageButton()
                    .setCustomId("save-transcript")
                    .setLabel(text_support.buttons.save_trans)
                    .setStyle(text_support.buttons.save_trans_style)
                );
   
                const embed8 = new MessageEmbed()
                    .setColor(text_support.color)
                    .setTitle(text_support.title)
                    .setDescription(text_support.description)
                interaction.channel.send({ embeds: [embed8], components: [row] });
                   
            }
            else if(interaction.customId === "delete-ticket" ){
                interaction.channel.delete();
            } else if(interaction.customId === "save-transcript"){
                const guild = client.guilds.cache.get(interaction.guildId);
                const chan = guild.channels.cache.get(interaction.channelId);

                if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
                    return interaction.reply("You do not have the permissions to do this.")
                const transcriptCreated = new Discord.MessageEmbed()
                    .setDescription("**Transcript is being created...**")
                    .setColor(text_support.color)
                interaction.reply({
                    embeds: [transcriptCreated]
                });

                chan.messages.fetch().then(async (messages) => {
                    let a = messages.filter(m => m.author.bot !== true).map(m =>
                        `${new Date(m.createdTimestamp).toLocaleString('am-AM')} - ${m.author.username}#${m.author.discriminator} : ${m.content}`
                    ).reverse().join('\n');
                    if (a.length < 1) a = "Nothing"
                    hastebin.createPaste(a, {
                        contentType: 'text/plain',
                        server: 'https://hastebin.com'
                    }, {})
                        .then(function (urlToPaste) {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`📰 Ticket logged \`${chan.id}\` created by <@${chan.topic}> and deleted by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs.**](${urlToPaste})`)
                                .setColor(text_support.color)
                                .setTimestamp();
                            const embed2 = new Discord.MessageEmbed()  
                                .setDescription("You can now safely delete the channel !")
                                .setColor(text_support.color)

                            interaction.editReply({embeds: [embed2]})

                            client.channels.cache.get(config.logChannel).send({
                                embeds: [embed]
                            });


                        });
                });
            }}    
});




client.login(config.token).then(() => {
    client.user.setPresence({ activities: [{ name: 'En cour de dev', type: 'PLAYING' }], status: 'idle' });
});
