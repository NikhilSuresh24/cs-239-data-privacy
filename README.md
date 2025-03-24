# cs-239-data-privacy
Repo containing all research and code for CS 239: Introduction to HCI at UCLA for Winter 2025.

![logo](./logo.png)

## Development Setup

1. Clone this repo from Github

        $ git clone https://github.com/NikhilSuresh24/cs-239-data-privacy.git

2. Install the required packages for the server with npm

        $ cd server & npm install


3. Create an API key at `https://openrouter.ai/settings/keys `and paste the API key in `server/summarizer.js`


4. Click on the extensions button on Chrome -> Manage Extensions


5. Turn on Developer Mode and click `Load Unpacked`

6. Select the `extension_files` folder

7. Run the server

       $ node server.js


You can now see the extension on chrome!! To make any changes, follow the following developer workflow:

    a. Make any front-end changes
    b. Open extensions page on Chrome and click reload button on Privacy Pal Extension
    d. Test!

