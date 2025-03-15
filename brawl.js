const { Client, GatewayIntentBits} = require('discord.js'); // importing items from DiscordJS Package, like "client" which represents the bot
const { availableMoves } = require("../data/availableMoves");
const { EmbedBuilder } = require('discord.js');
const { User } = require('../models/user');
const { registerUser } = require('../commands/register');
const { get } = require('mongoose');

async function startBrawl(message){

    const challenger = message.guild.members.cache.get(message.author.id); //User who sent brawl command

    const existingUser = await User.findOne({ discordID: challenger.id});

    if(!existingUser){
        return message.reply("❌ You need to be registered to challenge people to BRAWL!!!");
    }

    const opponent = message.mentions.users.first();

    if(!opponent){
        return message.channel.send("✅ Tag someone you want to challenge to a fight!");
    }

    const existingOpp = await User.findOne({discordID: opponent.id});

    if(!existingOpp){
        return message.channel.send("❌ The opponent you mentioned is not registered as a BRAWLER!");
    }

    const challengeMsg = await message.channel.send(`${opponent}, you've been challenged to a BRAWL ⚔️ by ${challenger}! Do you accept the challenge? Reply with "Y" to accept or "N" to decline!`);

    const filter = message => {
        return(message.content === 'Y' || message.content === "N") && message.author.id === opponent.id;
    };

    try{
        const collected = await message.channel.awaitMessages({
            filter,
            max:1,
            errors:['time']
        });
          const response = collected.first();
    
          const fightGif = [
        'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHlsMHF1czBmeXUybnRzeXM2NGxtcHJ6YnkxYmo3ODJiZmZvMW8ydyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eR7OEDQDyA7Cg/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnhjc2NzbGZpYWg2dzN5ZWU3dzBhYzllZG9xeW01aGk2Y2xkYmk5MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/b1dXky39p5Zcs/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjJoOHVsaTJuNTltZGZudXo3aXQwYjZpcWgzNGd6dHZsYWM1dWk1dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iqkCNZIzSSXSM/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzJ1NncwcDdsd3lmeHMyN3loZG5wM3pleTZiYnNsNXR0ZTYxMnRzMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1xONKAmjT1GHFpkLRd/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGw4dW9iamY0Ymtod2p1cjRsZnhpMTBidnFseDE0dnhvNnBvcXE2NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12n2skyAAjOGhq/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3JzMGNvbDJlY2FidG4xc2U1dDlwOW9odG9ra3RpbmdidnBpd2ZxZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kIQOoOZlaDxGKwgTzz/giphy.gif',
        'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExemlhOWJyeDNnYmk0YmJtM2R2eTF3cmp6dTN1am9ydTd4dWc4cWF2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wiaoWlW17fqIo/giphy.gif',
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExazVhbDF4bWR4ajNmMGg0ODdiem00Z3I0ZjFhOXQ5N280eWZnNjk4MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TPeGCbJjGLgxW/giphy.gif',
        'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXNkdjR2c2k4ZDY2dXp4amtmZmIwdWdmODQxb2x1aTExeTdxZXEzOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qKpmDQrJSKFq0/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmQ1MDJtd3BkdXowaHBzNWF3MW93ZDhzbXdtMXI4cGEzd2k1NG5uayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2MmPmTGoi7Uly/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2R6dzRjcXVwbmliMTJ4ZHZ3enl2cjZxNXZhb2FpbWNwZms5b2ZhbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UFPiXwB9V5hde/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXB0eGJsODBhbGI4ZTBybXJ6Zm56amo1NDExMnE2aTVuMWpqbGphMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/h9rBcBywX895S/giphy.gif',
        'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzM0dHN2dG1kZTVscXVpOWUyOTVtZjAzaThwOHphcnk1cDJoeDBmdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XDVNmIREHVTfsBowCT/giphy.gif',
    ];
        const fightGifRandom = fightGif[Math.floor(Math.random()* fightGif.length)];

        if(response.content === "Y"){
        message.channel.send(`✔️ ${opponent} has accepted the challenge! Let the BRAWL begin!!! ⚔️`);

        const brawlEmbed = new EmbedBuilder()
            .setColor('#f0f0f0')
            .setTitle(`💥 ⚔️ 👊 **${opponent.displayName || opponent.username}**  vs. **${challenger.displayName || challenger.username}** 💥 👊 ⚔️`)
            .setDescription("Alright, let's settle this— no more words, just ACTION.")
            .setTimestamp(new Date())
            .setImage(fightGifRandom);

        message.channel.send({embeds:[brawlEmbed]}); 

        try{
        await brawlLogic(message,challenger,opponent);
        } catch(error){
            message.channel.send("❌ Something went wrong during this BRAWL!");
        }
        

    } else if(response.content === "N"){
        message.channel.send(`❌ ${opponent} has declined the BRAWL challenge!`);
    }

} catch(error){
    message.channel.send("❌ The challege has timed out, no response from the opponent.");
}

}

//Move specific messages based on damage range//
 const moveMessages={
    Bladeslash:(damage) => {
        if(damage >= 5 && damage <=7)
            return "You did some light damage with your blade 🗡️";
        if(damage >=8 && damage <=10)
            return "You cut deep and did serious damage with that slash 🗡️";
        return "";
    },

    Quickstrikes:(damage) => {
        if(damage >=5 && damage <=7)
            return "You definitely landed at least TWO punches so good job! Light damage 🥊";
        if(damage >=8 && damage <10)
            return "Those quick strikes were quick and HARD. Big damage dealt! 🥊🥊🥊";
        return "";
    },

    Quickkicks:(damage) => {
       if(damage >=5 && damage <=7)
        return "Those quick kicks did some light damage!";
       if(damage >=8 && damage >=10)
        return "Your fast and powerful kicks did some pretty good damage!!!";
    return "";
    },

    Chainwhip:(damage) => {
        if(damage >= 5 && damage <= 7)
            return "That Chainwhip must be made of plastic, it hurts but not alot!";
        if(damage >= 8 && damage <=10)
            return "Your Chainwhip attack lashes through your opponent with FORCE ⛓️";
    },

    Fireball:(damage) => {
        if(damage >= 5 && damage <= 7)
            return "That fireball burned your opponent lightly, no marks but definitly burnt some hair! 🔥";
        if(damage >= 8 && damage <= 10)
            return "HOLY SMOKES YOU NEARLY BURNED THE HOUSE DOWN WITH THAT FIREBALL!!!🔥🔥🔥";
        return "";
    },

    Spark:(damage) => {
        if(damage >= 5 && damage <= 7)
            return "You did some minor shock damage to your opponent ⚡";
        if(damage >= 8 && damage <= 10)
            return "WOAH! That attack damage is SHOCKING ⚡⚡⚡";
        return "";
    },

    Watershot:(damage) => {
        if(damage >= 5 && damage <= 7)
            return "That WATERSHOT lightly sprinkled your opponent and did some light damage";
        if(damage >= 8 && damage <= 10)
            return "Watershot pierces through your opponent with force, doing serious damage 🔫";
        return "";
    },

    Stonethrow:(damage) => {
        if(damage >= 5 && damage <= 7)
            return "That throw was pretty light and the stone grazes the enemy!";
        if(damage >= 8 && damage <=10)
            return "Your stone caught some pretty good speed and knocks the wind out of your opponent! 🪨";
    },

    Powerbomb:(damage) => {
        if(damage >= 10 && damage <= 13)
            return "You slammed your opponent with that powerbomb pretty hard! Not bad!!";
        if(damage >= 14 && damage <= 17)
            return "That powerbomb spikes the opponent with some great force!!!";
        if(damage >= 18 && damage <=20)
            return "You channeled your inner pro wrestler and absolutely SLAMMED your opponent with that powerbomb 💪💣";
        return "";
    },

    Arrowshot:(damage) => {
        if(damage >= 10 && damage <=12)
            return "That arrow shot 🏹 was pretty accurate! Light damage acquired";
        if(damage >= 13 && damage <=15)
            return "ARROW SHOT 🏹 HITS THE EXACT MARK AND DOES BIG DAMAGE!!!";
        return "";
    }
};

async function brawlLogic(message,challenger,opponent){
    
    const challengerMoves = Array.isArray(challenger.selectedMoves) ? challenger.selectedMoves : [];
    const opponentMoves = Array.isArray(opponent.selectedMoves) ? opponent.selectedMoves : [];

    let challengerHP = 100;
    let opponentHP = 100;

    const victoryGifs = [
        'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXk3Z2Q2Zml3bmdoc2djd2p2Z2d3bHg5bGpzNTczdzcxdTU2aDZiZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2wSblJnaFakthn0BM1/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGM5bWEyZWdpY3Zpb25iNjBuZzlmaW01em0zMnRqbWo3OGtnMWk2ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/69IgMedgXzQNllxnLR/giphy.gif',
        'https://tenor.com/view/mortal-kombat-gif-13069212326083661143',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTdvb2Rlcjdsd3BpbmlhdXRzaDAydnVsMmU5cXB5ZjZybzZkdDQ4bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oHxWy43FuGahx2IYrr/giphy.gif',
        'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWMxaGVyeHYzZG56eHljYTM2cmEycmY1NWxpNW5kYXJiMGw1eGFuOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7wZVhq1bRispXgaJz1/giphy.gif',
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExazJvd3luNnRiczQzOHh0c3B4bGU0bHJpaGl0YXlvNHYxanpxMnVmbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EHiTRbpaoISEfwMpxH/giphy.gif',
        'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDA0cWdiNTd4ZGJ5c3phNjY0cmFleHB2NHBqZHI5dGkxYXM2bW44MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohs4l6IhkEXqnxv6E/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2tzbnk4emRrcGJjYmZxeHpvNWt1dWhtaGRtZzgyYTh2cHBmbTY1aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cf8O3hQqzDq1Gg/giphy.gif',
        'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm1nOWtubmJpNThxZmlqZ3JqdGRuM290bmVrczk2ZGY0cXVhdzZoOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ntqLOgoHFTgrB3SCq0/giphy.gif',
        'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXBwZWVoeGhnbjh2MmhwbmJzY21hcnFwcWhybzgzYjJpZGFzM3Q4aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/A7Gpt39kH5sAg/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2d3YWdjZjliaDR3cGV6bnQ3amIxcWlibDJjYXN3a2t3MmNhZnEwYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WyGe2lsUCYNJJL1Wjv/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmxzdHEzYmV6MW5vOTAyNWplaTBpYzFiY2tyY2Q0b3Z1dmxuaG95OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8h3oYPjGATcOKGATMy/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExajd5aGczbWhpbzlpenU1bjVsZWYydmVqNW45dzJuYjNydDQydTczZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Y8K0XaIY7WR9VBRSHe/giphy.gif',
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHVjMDg2a2FkZjl6cWNhYnV2Y3Q5enBudXhhOWcwc2VyeHdjNjdpNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cQNRp4QA8z7B6/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTY0OGc0NWg0OWp2emE5cnZtMDRlcTFoOGhqYzBkN2c1cTJueXRtaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Sg4v7DaaHExozAUShL/giphy.gif',
        'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGw0NzRjdzRiZGMzYW1rOWV6dTR6cjFkZGUwMnc0M2RwODB2OHl2biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WUDGo9jYZzVt3DExhi/giphy.gif',
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnBraGtxd2JoN2hjazhlMDlua3M4eGo0em9qaXF3ZnQ3Ym45emw3NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3nF8lOW9D0ZElDvG/giphy.gif',
        'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2g1NXkwZXk2YTBxNnlxb3JyODJsamw1aXBwZ240dWQ3a2lvbmNvcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/okLCopqw6ElCDnIhuS/giphy.gif',
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjAwbTk4Y2pobGxwMTg0Z3JtbjR4a3JtNjB3YmRsZW5sNHZhajRhaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5MjQ87rBCRIB2/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTlpY213dHAzNXp6N3hqcjhvNm01NTUxZnlidmluaHZ4NjNuZHEwYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NY3tXwOBUwQYq7lbXx/giphy.gif'
    ];
    
        
        
        const randomGif = victoryGifs[Math.floor(Math.random()*victoryGifs.length)];

        function getDamage(move){
            const moveDamage = availableMoves.find(m => m.name === move);
            return Math.floor(Math.random() * (moveDamage.maxDamage - moveDamage.minDamage + 1)) + moveDamage.minDamage;
        }

        let isChallengerTurn = true;

        while(challengerHP > 0 && opponentHP > 0){
            console.log(challengerMoves);
            console.log(opponentMoves);
            if(isChallengerTurn){
                message.channel.send(`${challenger.toString()}, it's your turn! Choose your move:\n${challengerMoves.join('\n')}`);
            } else {
                message.channel.send(`${opponent.toString()}, it's your turn! Choose your move:\n${opponentMoves.join('\n')}`);
            }

            const filter = response => response.author.id === (isChallengerTurn ? challenger.id : opponent.id);

            try{
                let moveMessage;

                if(isChallengerTurn){
                    const collected = await message.channel.awaitMessages({
                        filter,
                        max:1,
                        errors:['time']
                    });

                    const challengerMove = collected.first().content.trim();

                    if(!challengerMoves.includes(challengerMove)){
                        message.channel.send('Invalid Move! Please select a move from your move list!');
                        continue;
                    }
                    const challengerDamage = getDamage(challengerMove);
                    opponentHP -= challengerDamage

                    moveMessage = moveMessages[challengerMove](challengerDamage);
                    message.channel.send(moveMessage);
                    message.channel.send(`${opponent.username} HP: ${opponentHP}`);

                    if(opponentHP <= 0){
                        const winner = challenger;
                        const loser = opponent;

                        const winnerEmbed = new EmbedBuilder()
                            .setColor('#f0f0f0')
                            .setTitle(`${winner.username} WINS!!! 🏅`)
                            .setThumbnail(winner.displayAvatarUrl())
                            .setDescription(`${winner} is the **winner** of this brawl!!! 🎉`)
                            .addFields(
                                {name:"Reward", value: "1 coin earned!", inline:true},
                                {name:"Defeated", value: `${loser}`, inline:true}
                            )

                            .setImage(randomGif)
                            .setFooter({ text: 'Victory is sweet, right?'});

                       message.channel.send({ embeds: [winnerEmbed]});
                       return;     
                    }
                    isChallengerTurn = false;
                } else {
                    const opponentMove = opponentMoves[Math.floor(Math.random() * opponentMoves.length)];

                    const opponentDamage = getDamage(opponentMove);
                    challengerHP -= opponentDamage

                    moveMessage = moveMessages[opponentMove](opponentDamage);
                    message.channel.send(moveMessage);
                    message.channel.send(`${challenger.username} HP: ${challengerHP}`);

                    if(challengerHP <= 0){
                        const winner = opponent;
                        const loser = challenger;

                        const winnerEmbed = new EmbedBuilder()
                            .setColor('#f0f0f0')
                            .setTitle(`${winner.username} WINS!!! 🏅`)
                            .setThumbnail(winner.displayAvatarUrl())
                            .setDescription(`${winner} is the **winner** of this brawl!!! 🎉`)
                            .addFields(
                                {name:"Reward", value: "1 coin earned!", inline:true},
                                {name:"Defeated", value: `${loser}`, inline:true}
                            )

                            .setImage(randomGif)
                            .setFooter({ text: 'Victory is sweet, right?'});

                       message.channel.send({ embeds: [winnerEmbed]});
                       return;     
                    }
                    isChallengerTurn = true;
                    }
                } catch(error){
                        message.channel.send("There was an error! Please try again!");
                }
            }
        }



module.exports = { startBrawl, brawlLogic};






//comment out is Ctrl + /



 
