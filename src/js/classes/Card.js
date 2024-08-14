// importing custom class
import Charts from "./Charts.js";

// class used for creating the cards
class Card
{
    // Class required variables
    gridstack_default = {
        w: 2, minW: 2,
        h: 2, minH: 2, maxH: 3
    }
    gridstack = {};

    settings_default = {
        gridstack: {},
        chart_types: ['line'],
        input_types: [],
        id: 0
    }
    settings = {};

    data = {
        title: "Card Title",
        chart_type: 'line',
        input_type: "Spanning Accu (V)",
        chart_color: '#FFFFFF'
    };
    chart_data = {};

    inputs = {};

    element = undefined;
    dom_element = undefined;


    
    // Class Constructor
    constructor(grid, settings)
    {
        // checking if grid is set and/or found
        if (!grid) {
            throw new Error("Grid was not found in HTML body!");
        }
        this.grid = grid;

        // checking if settings is set and the right type
        if (!settings || typeof settings != 'object') {
            throw new Error('Expected an object as settings, but received ' + (settings === null ? 'null' : typeof settings));
        }

        // merging default settings with settings
        this.settings = Object.assign({}, this.settings_default, settings);
        // merging default gridstack settings with new gridstack settings
        this.settings.gridstack = Object.assign({}, this.settings_default.gridstack, settings.gridstack);

        // merging default data with data
        this.data = Object.assign({}, this.data, this.settings.data);
        this.chart_data = this.settings.chart_data;

        // rendering the card
        this.render();
        
        // creating the chart
        this.ctx = this.element.querySelector('.chart-canvas').getContext('2d');
        this.chart = new Chart(this.ctx, this.generate_chart(this.data.chart_type));
        
        // adding event listeners
        this.listeners();
    }

    // used in combination with the Charts class to generate the right chart
    generate_chart(type)
    {
        // chart options
        let chart_options = {};

        // switch on type to make sure it has the right settings
        switch (type) {
            case 'gauge':
                chart_options = {
                    current: this.chart_data[this.data.input_type].at(-1),
                    max: 100,
                    color: this.data.chart_color
                };
                break;
            case 'radar':
                chart_options = {
                    labels: this.chart_data["Uren"].filter(item => item.split(':')[1] == '00'),
                    data: this.chart_data[this.data.input_type],
                    color: this.data.chart_color
                };
                break;
            default:
                chart_options = {
                    labels: this.chart_data["Uren"],
                    data: this.chart_data[this.data.input_type],
                    color: this.data.chart_color
                };
                break;
        }

        // returning chartjs settings
        return Charts.generate(type, chart_options);
    }

    // Renders the DOM Element and adds this to the grid-stack
    render()
    {
        // dom element
        this.dom_element = document.createElement('div');

        // generating header and body
        this.generate_header();
        this.generate_body();

        // creating gridstack widget
        this.settings.gridstack.content = this.dom_element.innerHTML;
        this.element = this.grid.addWidget(this.settings.gridstack);
        this.element.setAttribute('id', this.settings.id);
        this.element.querySelector('.grid-stack-item-content').classList.add('card');
    }

    // Generates the HTML for the header
    generate_header() 
    {
        // creating header
        const parent = document.createElement('div');
        parent.classList.add('card-header');

        // appending edit and view mode headers
        parent.appendChild(this.generate_header_view());
        parent.appendChild(this.generate_header_edit());

        // appending header to dom element
        this.dom_element.appendChild(parent);
    }

    // Generates the DOM header for the view mode
    generate_header_view()
    {
        // creating header for view
        const div = document.createElement('div');
        div.setAttribute('mode', 'view');
        div.classList.add('view');

        // creating title for view 
        const title = document.createElement('div');
        title.classList.add('title');
        title.innerText = this.data.title;
        
        // appending and returning the header
        div.appendChild(title);
        return div;
    }

    // Generates the DOM header for the edit mode
    generate_header_edit()
    {
        // creating header for edit
        const div = document.createElement('div');
        div.setAttribute('mode', 'edit');
        div.classList.add('edit');

        // creating title input to edit the card title 
        const title = document.createElement('input');
        title.classList.add('title_input');
        title.name = 'title';
        title.setAttribute('value', this.data.title);

        // creating buttons for the card header
        const button_div = document.createElement('div');
        button_div.classList.add('buttons');

        const button_remove = document.createElement('button');
        button_remove.classList.add('remove_widget');
        button_remove.innerHTML = `<i class="bi bi-dash-lg remove_widget"></i>`;
        button_remove.addEventListener('click', (event) => {
            console.log("CLICKER REMOVE BUTTON");
        });
        
        // appending and returning the header
        div.appendChild(title);
        div.appendChild(button_div);
        button_div.appendChild(button_remove);
        return div;
    }

    // Generates the HTML for the body
    generate_body()
    {
        // creating the card body
        const parent = document.createElement('div');
        parent.classList.add('card-body');

        // appending the view and edit headers
        parent.appendChild(this.generate_body_view());
        parent.appendChild(this.generate_body_edit());

        // appending the card body to the card
        this.dom_element.appendChild(parent);
    }

    // Generates the DOM body for the view mode
    generate_body_view()
    {
        // creating the body for the view
        const div = document.createElement('div');
        div.setAttribute('mode', 'view');
        div.classList.add('view');

        const container = document.createElement('div');
        container.classList.add("chart-container");

        const canvas = document.createElement('canvas');
        canvas.classList.add("chart-canvas");
        
        // appending and returning the body
        container.appendChild(canvas);
        div.appendChild(container);
        return div;
    }

    // Generates the DOM body for the edit mode
    generate_body_edit()
    {
        // creating the body for the edit
        const div = document.createElement('div');
        div.setAttribute('mode', 'edit');
        div.classList.add('edit');

        // creating options div
        const option_div = document.createElement('div');
        option_div.classList.add('options');

        // creating chart display type dropdown
        const dropdown_chartType = document.createElement('select');
        dropdown_chartType.classList.add('chartType');
        this.settings.chart_types.forEach((type) => {
            const option = document.createElement('option');
            option.innerText = type;
            option.value = type;
            if (type === this.data.chart_type) {
                option.setAttribute('selected', 'selected');
            }

            dropdown_chartType.appendChild(option);
        });

        // creating data input type dropdown
        const dropdown_inputType = document.createElement('select');
        dropdown_inputType.classList.add('inputType');
        this.settings.input_types.forEach((type) => {
            if (type == "Uren") return;

            const option = document.createElement('option');
            option.innerText = type;
            option.value = type;
            if (type === this.data.input_type) {
                option.setAttribute('selected', 'selected');
            }

            dropdown_inputType.appendChild(option);
        });

        // creating color changer
        const color_input = document.createElement('input');
        color_input.setAttribute('value', this.data.chart_color);
        color_input.classList.add('color_input');
        color_input.type = 'color';

        // appending and returning the body
        option_div.appendChild(dropdown_chartType);
        option_div.appendChild(dropdown_inputType);
        option_div.appendChild(color_input);
        div.appendChild(option_div);
        return div;
    }

    // Initializes the usages of the EventListeners
    listeners()
    {
        // if resized change the width
        this.grid.on('resizestop', (event, element) => {
            const canvas = element.querySelector('.chart-canvas');
            const _rect = event.target.gridstackNode._rect;

            canvas.style.width = `${_rect.w}px`;
            canvas.setAttribute('width', _rect.w);

            console.log(canvas, _rect);
        });
        
        // if anything in the card is clicked trigger
        this.element.addEventListener('click', (event) => {
            const target = event.target;
            const class_ = target.getAttribute('class').split(' ');

            // check if clicked element is the remove button
            if (class_.includes('remove_widget')) {
                // remove widget from gridstack
                this.grid.removeWidget(this.element);

                // an attempt at removing the class
                delete this.element;
                delete window.cards[window.cards.indexOf(this)];
                delete this;
            }
        });
    }

    // Update card inputs
    update_inputs()
    {
        // update the title
        this.data.title = this.element.querySelector('.title_input').value;
        this.element.querySelector('.view .title').innerText = this.data.title;

        // update the chart type and input type
        this.data.chart_type = this.element.querySelector('.chartType').value;
        this.data.input_type = this.element.querySelector('.inputType').value;
        
        // update the chart color
        this.data.chart_color = this.element.querySelector('.color_input').value;

        // regenerating the chart for this card
        this.chart.destroy();
        this.chart = new Chart(this.ctx, this.generate_chart(this.data.chart_type));
    }

    // Revert card inputs
    revert_inputs()
    {
        // revert the input of title to the set data
        this.element.querySelector('.title_input').value = this.data.title;
        
        // revert the input of chart type and input type to the set data
        this.element.querySelector('.chartType').value = this.data.chart_type;
        this.element.querySelector('.inputType').value = this.data.input_type;
        
        // revert the input of color to the set data
        this.element.querySelector('.color_input').value = this.data.chart_color;
    }

    // Exports the current data usefull for saving
    export()
    {
        // check if card (element) is supposed to be removed
        if (!this.element) {
            delete this;
            return
        }

        // filter to only keep the given keys of an object
        const filterObject = (obj, keysToKeep) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([key]) => keysToKeep.includes(key))
            );
        };
        
        // returning the desired exported data used for saving the card and reloading it with the same set up
        return {
            gridstack: filterObject(this.element.gridstackNode, ['h', 'minH', 'maxH', 'w', 'minW', 'maxW', 'x', 'y']),
            data: filterObject(this.data, ['title', 'chart_type', 'input_type', 'chart_color'])
        };
    }
}

// Export the class for usage in module scripts
export default Card;