import axios from "axios";
import sodium from "libsodium-wrappers";
import { writeFileSync, existsSync, mkdirSync, appendFileSync} from "fs";
import { readFile } from "fs/promises";
import editPrompts from "./prompts-editor.js"

// First arg is Integer
let editPromptsMode = false
if (process.argv.length >=3 && Number.isInteger(Number(process.argv[2])) && process.argv[2] >= 1){
  editPromptsMode = true;
}

// Read parameters.json
const p = JSON.parse(
  await readFile(
    new URL('./parameters.json', import.meta.url)
  )
);

if (p.prompts === "") {
    console.log("Please input prompts, check the parameters.json")
    process.exit(1);
}

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const defaultSeed = rand(1, 4294967295)

// input parameters
let param = {
    "input": p.prompts,
    "model": "nai-diffusion",
    "parameters": {
      "width": p.width? p.width : 384,
      "height": p.height? p.height : 640,
      "scale": p.scale? p.scale : 11,
      "sampler": p.sampler? p.sampler : "k_euler_ancestral",
      "steps": p.steps? p.steps : 28,
      "seed": p.seed? p.seed : defaultSeed, 
      "n_samples": p.n_samples? p.n_samples : 1,
      "ucPreset": 0,
      "qualityToggle": p.qualityToggle? p.qualityToggle : true,
      "uc": p.uc? p.uc : "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry"
    }
}

if (editPromptsMode) {
  param.input =  editPrompts(param.input, Number(process.argv[2]))
}
// Get a key for an access token
async function calcAccessKey(email, password) {
    await sodium.ready;
    return sodium.crypto_pwhash(
      64,
      new Uint8Array(Buffer.from(password)),
      sodium.crypto_generichash(
        sodium.crypto_pwhash_SALTBYTES,
        password.slice(0, 6) + email + 'novelai_data_access_key',
      ),
      2,
      2e6,
    sodium.crypto_pwhash_ALG_ARGON2ID13,
      'base64').slice(0, 64)
  }

// Get an acceess token using user email and password
let key = await calcAccessKey(process.env.NAI_EMAIL, process.env.NAI_PASSWORD);
let result = await axios.post('https://api.novelai.net/user/login', {
    key: key
  })
  .then(function (response) {
    console.log("Login succeeded.")
    return response;
  })
  .catch(function (error) {
    console.log("Login failed.")
    console.log(error);
  });

// Post request to NAI to generate images
const imageResult = await axios.post('https://api.novelai.net/ai/generate-image', 
    param,
    {
    headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${result.data.accessToken}`
    }
  })
  .then(function (response) {
    return response;
  })
  .catch(function (e) {
    console.log("Image gen failed. Error code : ", e.code)
  });

// Create a directry to store images
if (!existsSync("outputs")) {
    mkdirSync("outputs");
}

if (imageResult.data  === "") {
  console.log("NAI returned no image, maybe their servers' issue.")
  process.exit(1);
}

// imageResult.data is string, and includes multiple DataURLs so convert them to png  
try {
    let i =1;
    let buffer;
    for( const imageURI of imageResult.data.matchAll(/(?<=data:)(.*)/g)){
        buffer = Buffer.from(imageURI.toString(), 'base64');
        let imageName = `./outputs/image-s${param.parameters.seed}-${i}.png`
        writeFileSync(imageName, buffer);
        appendFileSync("./outputs/prompts.log", `${imageName}, ${param.input}\n`)
        i++;
    }
    console.log("Image gen succeeded.")
} catch(e) {
    console.log("Failed to save image.")
}



