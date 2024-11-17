const firebaseConfig = {
    apiKey: "AIzaSyBhFqrlX9FyLILbPvsCEWMRVah7sN66wI0",
    authDomain: "smartnote-2ef30.firebaseapp.com",
    databaseURL: "https://smartnote-2ef30-default-rtdb.firebaseio.com",
    projectId: "smartnote-2ef30",
    storageBucket: "smartnote-2ef30.firebasestorage.app",
    messagingSenderId: "858908253139",
    appId: "1:858908253139:web:f76114f5a98d01a43e2d26",
    measurementId: "G-DBJT4K3TCG"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Use the existing app
}
