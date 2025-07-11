  // Import the functions you need from the SDKs you need
  import { initializeApp, getApps } from '@react-native-firebase/app';

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyByt-R736FS0bIiWln2zOZdnBC8lyTBReU",
    authDomain: "tomt-8866f.firebaseapp.com",
    projectId: "tomt-8866f",
    storageBucket: "tomt-8866f.firebasestorage.app",
    messagingSenderId: "784125937563",
    appId: "1:784125937563:web:a937ee06d956d03159033e",
    measurementId: "G-TTKP6HT0WL"
  };

  // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized');
  } else {
    app = getApps()[0]; 
  }

  export default app;
