import axios from 'axios';

export const githubApi = axios.create({
    baseURL: 'https://api.github.com/repos/facebook/react/',
    headers: {
        Authorization: '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'
    }
})