import papers from '../data/papers.json'
import tags from '../data/tags.json'
import contries from '../data/contries.json'
import tests from '../data/test.json'
import customers from '../data/rowGroup.json'
import searchs from '../data/Searchs.json'
import detailCard from '../data/DetailCard.json'
import detailBank from '../data/DetailBank.json'

export default class DataManager {

    getCountries() {
        // return fetch('demo/data/countries.json').then(res => res.json())
        //     .then(d => d.data);
        return contries.data;
    }
    getPapers() {
        return papers.data;
    }
    getTags() {
        return tags.data;
    }
    getTests() {
        return tests.data;
    }
    getCustomers() {
        return customers.data;
    }
    getSearchs() {
        return searchs;
    }
    getDetailCards() {
        return detailCard;
    }
    getDetailBanks() {
        return detailBank;
    }
}