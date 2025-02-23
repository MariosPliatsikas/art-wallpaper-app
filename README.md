
# Art Wallpaper App

![Art Wallpaper App Screenshot](./public/screenshot.png) <!-- Add image -->

The **Art Wallpaper App** changes your device's wallpaper with art pieces from various museums, while also offering you the ability to listen to music from MusicBrainz. The app automatically updates every 10 minutes with new art pieces and songs.

## 🚀 Features

- Display random art pieces from the Metropolitan Museum of Art.
- Play music from MusicBrainz.
- User interaction: Display information about the art piece after 15 seconds.
- Automatic update every 10 minutes.

## 🛠️ Technologies

- **React**: JavaScript library for building user interfaces.
- **React Router**: For managing routes in the app.
- **Metropolitan Museum of Art API**: For retrieving art pieces.
- **MusicBrainz API**: For playing music.
- **CSS**: For the style and aesthetics of the app.

## 📦 Installation

Follow the steps below to run the app locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/MariosPliatsikas/art-wallpaper-app.git
Navigate to the project folder:
bash
cd art-wallpaper-app

Install dependencies:
bash
npm install

Create a .env file and add the MusicBrainz API token:
plaintext
REACT_APP_MUSIC_API_TOKEN=your_api_token_here

Start the app:

bash
npm start
Open your browser at http://localhost:3000.

🧪 Testing
To run tests, use the command:
bash
Copy
npm test

🚀 Development
To create a production build, run:
bash
npm run build

🤝 Contribution
Contributions are welcome! If you want to contribute, please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/YourFeatureName).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/YourFeatureName).

Open a Pull Request.

📄 License
This project is licensed under the MIT License. See the LICENSE file for more details.

This project was bootstrapped with Create React App.
