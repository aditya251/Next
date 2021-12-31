import '../styles/globals.css'
import Navbar from '../components/navbar';
import { Toaster} from 'react-hot-toast'
import {UserContext} from '../lib/context';

import { useUserData } from '../lib/hooks';


function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
    <Navbar></Navbar>
    <Component {...pageProps} />
    <Toaster></Toaster>
    </UserContext.Provider>
  )
}

export default MyApp