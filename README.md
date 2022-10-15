# naicli
naicli is a NovelAI CLI to make image generation more convinient.

# How to use
Workspace> git clone https://github.com/bbtwq/naicli.git

Workspace> cd naicli

#### \# Package install

naicli> npm install

#### \# Set NAI account information to the environment variables (NAI_EMAIL, NAI_PASSWORD). The commands below are for Windows OS.

naicli> $env:NAI_EMAIL = "YOUR_EMAIL_ADDRESS"

naicli> $env:NAI_PASSWORD = "YOUR_SECRET_PASSWORD"

naicli> node .\naicli.js

#### \# Prompts Edit Mode (You can change the argument number)
naicli> node .\naicli.js 4

You can find the output images in output/image-***.png

# Input parameters
NAI requires some parameters, and to input them you can edit parameters.json file. If you want to edit seed you can add the "seed" line in the json file.

# Tested version
naicli> node -v

v14.17.3

# Prompts Edit Mode
Prompts Edit Mode can automatically change the prompts in parameter.json randomly. It may be useful to check the relation between the prompts and the output images when running image generation repeatedly. The generated images' name and the prompts are written in /outputs/prompts.log.

At this point, Prompts Edit Mode can simply reduce the randomly selected prompts by the number you enter as an argument.

Tips: It is interesting to input many prompts firts and then have Edit Mode shave them down later to make randomness.
