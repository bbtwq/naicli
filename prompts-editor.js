/**
 * Remove some from the entered prompts.
 * TODO: Fixed prompts, and shuffling each prompt 
 * @param {string} prompts prompts
 * @param {string} reduceNum How many prompt words to remove (default:1)
 * @return {string} 
 */
export default function editPrompts(prompts, reduceNum=1) {

    if (reduceNum >= prompts.length) return prompts;

    let promptsBody = prompts.substr(0, prompts.indexOf("|"));  
    let promptsBodyArray = promptsBody.split(",").filter(prompt => prompt !== "");

    let promptsStyle = prompts.substr(prompts.indexOf("|") + 0).replace(",",""); // Include first "|"
    let promptsStyleArray =  promptsStyle.split("|").filter(prompt => prompt !== "").map(style => "|" + style); // Add "|" again

    let promptsArray  = promptsBodyArray.concat(promptsStyleArray);

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    let trimIndex = 0 ; 
    for (let i = 0; i < reduceNum; i++) {
        trimIndex = rand(0, promptsArray.length)
        promptsArray.splice(trimIndex, 1);    
    }

    return promptsArray.join();

}
