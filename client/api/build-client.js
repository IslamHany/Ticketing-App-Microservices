import axios from 'axios';

export default ({req, baseURL}) => {
    if(typeof window === 'undefined'){
        //we are on the server
        return axios.create({
            baseURL,
            headers: req.headers
        });
    }else{
        //we are on the browser
        return axios.create({
            baseURL: '/'
        });
    }
};