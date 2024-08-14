// Importing node modules
import "../../node_modules/gridstack/dist/gridstack-all.js";
import "../../node_modules/chart.js/dist/chart.umd.js";

// Importing custom classes
import Card from "./classes/Card.js";
import Cards from "./classes/Cards.js";
import Modes from "./classes/Modes.js";
import CSV from "./classes/CSV.js";



// initializing gridstack
const grid = GridStack.init();
window.cards = [];


// main function to run the js application
async function main()
{
    // fetching csv data
    const csv = "src/media/data_20240619.csv";
    const response = await fetch(csv);
    const preparsed = await response.text();

    // parsing csv fetch
    const parsed = CSV.parse(preparsed, {
        delimiter: ';'
    });

    // putting the parsed csv into sessionStorage
    sessionStorage.setItem('csvData', JSON.stringify(parsed['huis']));
    const chart_data = JSON.parse(sessionStorage.getItem('csvData')) || parsed;
    
    // card settings
    const card_settings = {
        gridstack: {
            w: 2, minW: 2,
            h: 2, minH: 2, maxH: 4
        },
        chart_types: ['line', 'gauge', 'radar', 'bar'],
        input_types: Object.keys(chart_data),
        data: {
            'title': "Card title"
        },
        chart_data: chart_data
    };
    

    // initialize modes (edit and view)
    const modes = new Modes(grid, {
        container: document.querySelector('.buttons'),
        card_settings: card_settings
    });

    // load layout if founnd in localStorage
    const local = Cards.get_layout();
    if (local.length > 0) {
        local.forEach((saved) => {
            const settings = Object.assign({}, card_settings, saved)
            const card = new Card(grid, settings);
            
            window.cards.push(card);
            modes.style();
        });
    }
}

// initialize the script
main();