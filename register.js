const { availableMoves } = require("../data/availableMoves");
const { EmbedBuilder } = require('discord.js');
const { User } = require('../models/user');

async function registerUser(message) {
    const user = message.author;
    console.log("User ID:", user.id);

    if (!user.id) {
        return message.reply("❌ Error: Your Discord ID could not be found.");
    }

    // Check if the user is already registered
    const existingUser = await User.findOne({ discordID: user.id });
    if (existingUser) {
        return message.reply("❌ You are already registered as a Brawler!");
    }

    // Initialize an empty array for selected moves
    const chosenMoves = [];

    // Select moves for the user
    const selectedMoves = await selectMoves(message, chosenMoves);
    if (!selectedMoves) return;

    console.log("Selected Moves:", selectedMoves);


    const guildID = message.guild ? message.guild.id : null;

    // Create a new user document
    const newUser = new User({
        discordID: user.id,
        username: user.username,
        guildID: guildID,
        chosenMoves: selectedMoves, // Store the selected moves here
        wins: 0,
        losses: 0,
        coins: 0,
        brawlers: [], // Initialize as an empty array
    });

    try {
        // Log user data before saving
        console.log("Saving user data:", newUser);

        // Save the new user to the database
        await newUser.save();

        message.reply(`✔️ You're now a registered BRAWLER! 💪🗡️ These are your starter moves: [**${chosenMoves.join(",")}**]`);
    } catch (error) {
        console.error("Error saving user:", error);
        // Handle MongoDB unique constraint errors
        if (error.code === 11000) {
            return message.reply("❌ There was an issue with registration. Please try again.");
        }
        message.reply("❌ There was an error registering you. Please try again!");
    }
}

module.exports = { registerUser };




async function selectMoves(message, chosenMoves) {
    if(!Array.isArray(chosenMoves)){
        return message.reply("The chosen move array is not available");
    }
    const userId = message.author.id;

    const moveListEmbed = new EmbedBuilder()
        .setTitle('👊 CHOOSE YOUR 3 STARTER MOVES 👊')
        .setDescription('Shape your fighting style and determine your path to victory in the battle! ⚔️')
        .setColor('#f0f0f0')
        .addFields(
            availableMoves.map(move => ({
                name: move.name,
                value: `Description: ${move.description} | Damage: ${move.minDamage} - ${move.maxDamage} HP`,
                inline: true,
            }))
        )
        .setFooter({ text: 'Pick your moves wisely! Type them in one by one.' });

    await message.channel.send({ embeds: [moveListEmbed] });

    const filter = (response) => response.author.id === userId; //Makes sure that only person who's responses are accepted are the person tagged

    // Repeat move selection until 3 valid moves are chosen
    while (chosenMoves.length < 3) {
        try {
            const collected = await message.channel.awaitMessages({
                filter,
                max: 1,
                time: 60000,
                errors: ['time'],
            });

            const userResponse = collected.first().content.trim();
            const selectedMove = availableMoves.find(move => move.name.toLowerCase() === userResponse.toLowerCase());

            if (!selectedMove) {
                message.reply("❌ Invalid move! Please choose a valid move from the list.");
                continue;
            }

            if (chosenMoves.includes(selectedMove.name)) {
                message.reply("❌ You've already chosen this move. Please select a different move.");
                continue;
            }

            // Add the selected move to the chosenMoves array
            chosenMoves.push(selectedMove.name);

            await message.reply(`✅ You have selected **${selectedMove.name}**! (${chosenMoves.length}/3 moves selected!)`);

        } catch (error) {
            console.error("Error during move selection:", error);
            message.reply("❌ You took too long to respond! Try registering again.");
            return null;
        }
    }

    // Return the chosen moves when 3 are selected
    return chosenMoves;
}

