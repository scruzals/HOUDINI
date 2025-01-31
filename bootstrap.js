const inquirer = require('inquirer');
const copyFile = require('fs/promises').copyFile;
const writeFile = require('fs/promises').writeFile;
const readFile = require('fs/promises').readFile;

// Default values
const TEMPLATE_SRC_README = './template/README.md';
const TOOLS_TARGET_FOLDER = './tools';
const TOOLS_CONFIG_FILE_PATH = './webapp/src/config/tools.json';

const sexyIntro = () => {
    console.log("  _____               _____  _____ ")
    console.log(" / ____|             / ____||_   _|")
    console.log("| (___    ___   ___ | (___    | |  ")
    console.log(" \\___ \\  / _ \\ / __| \\___ \\   | |  ")
    console.log(" ____) ||  __/| (__  ____) | _| |_ ")
    console.log("|_____/  \\___| \\___||_____/ |_____|")
    console.log("")
}

const setToolInfo = async () => {
    const questions = [
        {
            type: 'input',
            name: 'fancy_name',
            message: 'What is the (fancy) name of the Tool?',
        },
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the Docker Image? (in the format <organization/image>)',
            validate(value) {
                const pass = value.match(
                    /(\w+)\/(\w+)/gm
                );
                if (pass) {
                  return true;
                }
          
                return 'Please enter a valid Docker Image (in the format <organization/image>)';
            },
        },
        {
            type: 'input',
            name: 'official_doc',
            message: 'What is the link to the official documentation?',
            validate(value) {
                const pass = value.match(
                    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm
                );
                if (pass) {
                  return true;
                }
          
                return 'Please enter a valid link (starting with "http(s)://"';
            },
        },
        {
            type: 'input',
            name: 'run_command',
            message: 'What is the run command for this tool?',
        },
        {
            type: "confirm",
            name: "is_finished",
            message: "Check the data, is everything ok?",
        },
    ]

    try { 
        const answers = await inquirer.prompt(questions);
        if (answers.is_finished) {
            return answers
        }
        else {
            return setToolInfo()
        }
    }
    catch (e) {
        console.error("An error occurred while parsing your answers.")
        console.error(e)
    }
}

const main = async () => {
    sexyIntro()
    try {
        const answers = await setToolInfo()
        const config = {
            fancy_name: answers.fancy_name,
            name: answers.name.split('/')[1],
            official_doc: answers.official_doc,
            organization: answers.name.split('/')[0],
            run_command: answers.run_command,
        }

        await copyFile(TEMPLATE_SRC_README, `${TOOLS_TARGET_FOLDER}/${config.name}.md`)
        console.log(`Template documentation copied in ${TOOLS_TARGET_FOLDER}/${config.name}.md`);
        
        const jsonToolsFile = await readFile(TOOLS_CONFIG_FILE_PATH, 'utf8')
        let tools = JSON.parse(jsonToolsFile)
        // Add tool and sort
        tools.push(config)
        tools = tools.sort((a, b) => a.name.localeCompare(b.name));
        await writeFile(TOOLS_CONFIG_FILE_PATH, JSON.stringify(tools, null, 4),)
        
        console.log(`The following object has been added to the file '${TOOLS_CONFIG_FILE_PATH}':`)
        console.log(config)
    }
    catch (e) {
        console.error("An error occurred while editing files.")
        console.error(e)
    }
}

main()