import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdtIcU69zkvfpYCg1D_DsYJlNTpgCbwuY",
  authDomain: "lodify-driver-production.firebaseapp.com",
  projectId: "lodify-driver-production",
  storageBucket: "lodify-driver-production.firebasestorage.app",
  messagingSenderId: "470519797224",
  appId: "1:470519797224:web:c744635f1d894c6284c05d",
  measurementId: "G-5CPFJJ2LVE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// auth.settings.appVerificationDisabledForTesting = true;

export {auth};
