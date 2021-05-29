import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
    <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
    </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    const { req } = appContext.ctx;
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
    const client = buildClient({ req, baseURL: "http://auth-srv:3000" });

    const { data } = await client.get('/api/users/currentuser');
    let pageProps = {};
    if (appContext.Component.getInitialProps)
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);

    return {
        pageProps,
        currentUser: data.currentUser
    };
};

export default AppComponent;