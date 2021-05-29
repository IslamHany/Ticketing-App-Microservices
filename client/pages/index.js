import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {
    //this code is run from the browser
    return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
};

LandingPage.getInitialProps = async ({req}) => {
    /*
    -getInitialProps is run from the server when:
        1/Hard refresh of page
        2/Clicking link from different domain
        3/Typing URL into address bar
    -getInitialProps is run from the browser when:
        1/Navigating from one page to another while
        in the app
    */

    //this code is run inside the server
    //Fetch some data this component needs during server side rendering
    const client = buildClient({req, baseURL: "http://auth-srv:3000"});

    const {data} = await client.get('/api/users/currentuser');

    return data;
};

export default LandingPage;